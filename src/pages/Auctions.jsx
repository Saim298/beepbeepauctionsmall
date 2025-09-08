import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiClock, 
  FiDollarSign, 
  FiUsers, 
  FiFilter,

  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { MdGavel } from 'react-icons/md';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://beep-auctions-backend.onrender.com';

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    auctionType: 'all',
    sortBy: 'endDate',
    page: 1
  });
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadAuctions();
  }, [filters]);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: filters.page,
        auctionType: filters.auctionType,
        sortBy: filters.sortBy,
        limit: 20,
// showAll: 'true' // Remove this for production - only show active auctions
      });

      const response = await fetch(`${API_BASE}/api/auctions/active?${params}`);
      if (response.ok) {
        const data = await response.json();
        // console.log('Auctions API response:', data);
        // console.log('Auctions array:', data.auctions);
        setAuctions(data.auctions);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error loading auctions:', error);
    } finally {
      setLoading(false);
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

  const getAuctionTypeLabel = (type) => {
    const labels = {
      standard: 'Standard Auction',
      reserve: 'Reserve Auction', 
      direct_sale: 'Buy It Now'
    };
    return labels[type] || type;
  };

  const getAuctionTypeBadge = (type) => {
    const badges = {
      standard: 'badge bg-primary',
      reserve: 'badge bg-warning text-dark',
      direct_sale: 'badge bg-success'
    };
    return badges[type] || 'badge bg-secondary';
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">Live Auctions</h1>
          <p className="text-muted">Bid on premium vehicles from trusted sellers</p>
              </div>
              <button
          className="btn btn-primary"
          onClick={() => navigate('/seller-dashboard')}
              >
          Sell Your Car
              </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <label className="form-label">Auction Type</label>
              <select 
                className="form-select"
                value={filters.auctionType}
                onChange={(e) => setFilters({...filters, auctionType: e.target.value, page: 1})}
              >
                <option value="all">All Types</option>
                <option value="standard">Standard Auction</option>
                <option value="reserve">Reserve Auction</option>
                <option value="direct_sale">Buy It Now</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Sort By</label>
              <select 
                className="form-select"
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value, page: 1})}
              >
                <option value="endDate">Ending Soon</option>
                <option value="currentBid">Highest Bid</option>
                <option value="totalBids">Most Bids</option>
                <option value="createdAt">Newest</option>
              </select>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-end gap-2 h-100">
                <div className="text-muted">
                  <small>{auctions.length} auctions found</small>
                </div>
              </div>
            </div>
                </div>
              </div>
            </div>

      {/* Auction Grid */}
      {auctions.length === 0 ? (
        <div className="text-center py-5">
          <MdGavel size={48} className="text-muted mb-3" />
          <h5>No active auctions</h5>
          <p className="text-muted">Check back later for new auctions</p>
        </div>
      ) : (
        <div className="row">
        {auctions.map(auction => (
          <div key={auction._id} className="col-lg-6 col-xl-4 mb-4">
            <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
      
              {/* Image Section */}
              <div className="position-relative">
                {auction.carListing?.media?.[0] ? (
                  <img 
                    src={`${API_BASE}${auction.carListing.media[0].url}`}
                    alt={auction.carListing.name}
                    className="card-img-top"
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
                    <span className="text-muted">No Image</span>
                  </div>
                )}
      
                {/* Auction Type Badge */}
                <div className="position-absolute top-0 start-0 m-2">
                  <span className={getAuctionTypeBadge(auction.auctionType)}>
                    {getAuctionTypeLabel(auction.auctionType)}
                  </span>
                </div>
      
                {/* Status Badge */}
                {auction.status !== 'active' && (
                  <div className="position-absolute top-0 start-0 mt-5 m-2">
                    <span className={`badge ${auction.status === 'pending_approval' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                      {auction.status === 'pending_approval' ? 'Pending Approval' :
                       auction.status === 'draft' ? 'Draft' : auction.status}
                    </span>
                  </div>
                )}
      
                {/* Reserve Badge */}
                {auction.auctionType === 'reserve' && (
                  <div className="position-absolute top-0 end-0 m-2">
                    {auction.reserveMet ? (
                      <span className="badge bg-success">
                        <FiCheckCircle className="me-1" size={12} />
                        Reserve Met
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        <FiAlertCircle className="me-1" size={12} />
                        Reserve Not Met
                      </span>
                    )}
                  </div>
                )}
              </div>
      
              {/* Card Body */}
              <div className="card-body d-flex flex-column">
      
                {/* Title + Year + Location */}
                <h5 className="fw-bold mb-1">{auction.carListing?.name}</h5>
                <p className="text-muted small mb-3">
                  {auction.carListing?.year} • {auction.carListing?.location}
                </p>
      
                {/* Auction Specs */}
                <div className="row text-center mb-3">
                  <div className="col-4 border-end">
                    <h6 className="mb-0">{auction.totalBids}</h6>
                    <small className="text-muted">Bids</small>
                  </div>
                  <div className="col-4 border-end">
                    <h6 className="mb-0">${auction.currentBid.toLocaleString()}</h6>
                    <small className="text-muted">Current Bid</small>
                  </div>
                  <div className="col-4">
                    <h6 className="mb-0 text-danger">{formatTimeRemaining(auction.endDate)}</h6>
                    <small className="text-muted">Time Left</small>
                  </div>
                </div>
      
                {/* Buy Now Option */}
                {auction.buyNowPrice && (
                  <div className="text-success text-center mb-3">
                    <strong>Buy Now: ${auction.buyNowPrice.toLocaleString()}</strong>
                  </div>
                )}
      
                {/* CTA */}
                <div className="mt-auto">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/auction-details/${auction._id || auction.id}`)}
                  >
                    View Auction
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setFilters({...filters, page: filters.page - 1})}
                  disabled={filters.page === 1}
                >
                  Previous
                </button>
              </li>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, filters.page - 2)) + i;
                return (
                  <li key={pageNum} className={`page-item ${filters.page === pageNum ? 'active' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setFilters({...filters, page: pageNum})}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              
              <li className={`page-item ${filters.page === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link"
                  onClick={() => setFilters({...filters, page: filters.page + 1})}
                  disabled={filters.page === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Auctions;