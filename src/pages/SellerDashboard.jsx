import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiEdit, 
  FiEye, 
  FiClock, 
  FiDollarSign, 
  FiUsers, 
  FiTrendingUp,
  FiCalendar,
  FiSettings
} from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://beep-auctions-backend.onrender.com';

const SellerDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    avgBids: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'ended', 'draft'
  const navigate = useNavigate();

  useEffect(() => {
    loadSellerAuctions();
  }, [filter]);

  const loadSellerAuctions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/auctions/user/my-auctions?type=selling`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        let filteredAuctions = data.auctions;

        if (filter !== 'all') {
          filteredAuctions = data.auctions.filter(auction => auction.status === filter);
        }

        setAuctions(filteredAuctions);

        // Calculate stats
        const stats = {
          totalAuctions: data.auctions.length,
          activeAuctions: data.auctions.filter(a => a.status === 'active').length,
          totalRevenue: data.auctions
            .filter(a => a.status === 'sold')
            .reduce((sum, a) => sum + a.currentBid, 0),
          avgBids: data.auctions.length > 0 
            ? data.auctions.reduce((sum, a) => sum + a.totalBids, 0) / data.auctions.length 
            : 0
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error loading seller auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAuction = async (auctionId) => {
    try {
      const response = await fetch(`${API_BASE}/api/auctions/${auctionId}/start`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (response.ok) {
        await loadSellerAuctions();
        alert('Auction started successfully!');
      } else {
        alert('Failed to start auction');
      }
    } catch (error) {
      console.error('Error starting auction:', error);
      alert('Error starting auction');
    }
  };

  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'badge bg-secondary',
      active: 'badge bg-success',
      ended: 'badge bg-warning text-dark',
      sold: 'badge bg-primary',
      cancelled: 'badge bg-danger'
    };
    return badges[status] || 'badge bg-secondary';
  };

  const getAuctionTypeBadge = (type) => {
    const badges = {
      standard: 'badge bg-info',
      reserve: 'badge bg-warning text-dark',
      direct_sale: 'badge bg-success'
    };
    return badges[type] || 'badge bg-secondary';
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">Seller Dashboard</h1>
          <p className="text-muted">Manage your auctions and track performance</p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => navigate('/create-auction')}
        >
          <FiPlus /> Create Auction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <FiTrendingUp className="text-primary" size={24} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Total Auctions</div>
                  <div className="h4 mb-0">{stats.totalAuctions}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <FiClock className="text-success" size={24} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Active Auctions</div>
                  <div className="h4 mb-0">{stats.activeAuctions}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <FiDollarSign className="text-warning" size={24} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Total Revenue</div>
                  <div className="h4 mb-0">${stats.totalRevenue.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="text-info" size={24} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Avg. Bids</div>
                  <div className="h4 mb-0">{stats.avgBids.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Auctions
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${filter === 'draft' ? 'active' : ''}`}
                onClick={() => setFilter('draft')}
              >
                Draft
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${filter === 'ended' ? 'active' : ''}`}
                onClick={() => setFilter('ended')}
              >
                Ended
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          {auctions.length === 0 ? (
            <div className="text-center py-5">
              <FiCalendar size={48} className="text-muted mb-3" />
              <h5>No auctions found</h5>
              <p className="text-muted">
                {filter === 'all' 
                  ? "You haven't created any auctions yet." 
                  : `No ${filter} auctions found.`
                }
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/create-auction')}
              >
                Create Your First Auction
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Current Bid</th>
                    <th>Reserve</th>
                    <th>Bids</th>
                    <th>Time Remaining</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.map(auction => (
                    <tr key={auction._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {auction.carListing?.media?.[0] && (
                            <img 
                              src={`${API_BASE}${auction.carListing.media[0].url}`}
                              alt={auction.carListing.name}
                              className="rounded me-2"
                              style={{ width: '50px', height: '40px', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <div className="fw-semibold">{auction.carListing?.name}</div>
                            <small className="text-muted">
                              {auction.carListing?.year} {auction.carListing?.make?.name}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={getAuctionTypeBadge(auction.auctionType)}>
                          {auction.auctionType.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadge(auction.status)}>
                          {auction.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold">${auction.currentBid.toLocaleString()}</div>
                        {auction.buyNowPrice && (
                          <small className="text-muted">Buy Now: ${auction.buyNowPrice.toLocaleString()}</small>
                        )}
                      </td>
                      <td>
                        {auction.auctionType === 'reserve' ? (
                          <div>
                            <div className="fw-semibold">${auction.reservePrice?.toLocaleString() || 'N/A'}</div>
                            <small className={auction.reserveMet ? 'text-success' : 'text-warning'}>
                              {auction.reserveMet ? 'Met' : 'Not Met'}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted">No Reserve</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{auction.totalBids}</span>
                      </td>
                      <td>
                        {auction.status === 'active' ? (
                          <div className="text-primary fw-semibold">
                            {formatTimeRemaining(auction.endDate)}
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/auction/${auction._id}`)}
                            title="View Auction"
                          >
                            <FiEye />
                          </button>
                          {auction.status === 'draft' && (
                            <>
                              <button 
                                className="btn btn-outline-secondary"
                                onClick={() => navigate(`/edit-auction/${auction._id}`)}
                                title="Edit Auction"
                              >
                                <FiEdit />
                              </button>
                              <button 
                                className="btn btn-success"
                                onClick={() => startAuction(auction._id)}
                                title="Start Auction"
                              >
                                Start
                              </button>
                            </>
                          )}
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(`/auction/${auction._id}/settings`)}
                            title="Settings"
                          >
                            <FiSettings />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
