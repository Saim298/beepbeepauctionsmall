import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../utils/Sidebar.jsx'
import '../../pages/dashboard.css'
import { FiCheck, FiX, FiEye, FiClock, FiUser, FiDollarSign, FiCalendar, FiFilter } from 'react-icons/fi'
import { MdGavel } from 'react-icons/md'

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const AdminAuctions = () => {
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})
  const [selectedAuction, setSelectedAuction] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    auctionType: 'all',
    sortBy: '-createdAt'
  })
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    ended: 0
  })

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])

  useEffect(() => {
    loadAuctions()
  }, [filters])

  const loadAuctions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      
      // Get all auctions for admin
      const params = new URLSearchParams({
        showAll: 'true', // Admin can see all auctions
        sortBy: filters.sortBy
      })
      
      if (filters.status !== 'all') {
        params.append('status', filters.status)
      }
      if (filters.auctionType !== 'all') {
        params.append('auctionType', filters.auctionType)
      }

      const response = await fetch(`${API}/api/auctions/active?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAuctions(data.auctions || [])
        
        // Calculate stats
        const total = data.auctions?.length || 0
        const pending = data.auctions?.filter(a => a.status === 'pending_approval').length || 0
        const active = data.auctions?.filter(a => a.status === 'active').length || 0
        const ended = data.auctions?.filter(a => a.status === 'ended').length || 0
        
        setStats({ total, pending, active, ended })
      } else {
        console.error('Failed to load auctions')
      }
    } catch (error) {
      console.error('Error loading auctions:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveAuction = async (auctionId) => {
    setProcessing(prev => ({ ...prev, [auctionId]: 'approving' }))
    
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API}/api/auctions/admin/${auctionId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        alert('Auction approved successfully!')
        await loadAuctions()
      } else {
        const error = await response.json()
        alert(`Failed to approve auction: ${error.error}`)
      }
    } catch (error) {
      alert('Error approving auction')
    } finally {
      setProcessing(prev => ({ ...prev, [auctionId]: null }))
    }
  }

  const rejectAuction = async (auctionId, reason) => {
    setProcessing(prev => ({ ...prev, [auctionId]: 'rejecting' }))
    
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API}/api/auctions/admin/${auctionId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      })

      if (response.ok) {
        alert('Auction rejected successfully!')
        await loadAuctions()
        setShowDetails(false)
        setRejectReason('')
      } else {
        const error = await response.json()
        alert(`Failed to reject auction: ${error.error}`)
      }
    } catch (error) {
      alert('Error rejecting auction')
    } finally {
      setProcessing(prev => ({ ...prev, [auctionId]: null }))
    }
  }

  const viewDetails = (auction) => {
    setSelectedAuction(auction)
    setShowDetails(true)
  }

  const getAuctionTypeBadge = (type) => {
    const badges = {
      standard: { class: 'badge bg-primary', text: 'Standard' },
      reserve: { class: 'badge bg-warning text-dark', text: 'Reserve' },
      direct_sale: { class: 'badge bg-success', text: 'Buy Now' }
    }
    return badges[type] || { class: 'badge bg-secondary', text: type }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending_approval: { class: 'bg-warning text-dark', text: 'Pending Approval' },
      draft: { class: 'bg-secondary', text: 'Draft' },
      active: { class: 'bg-success', text: 'Live Auction' },
      ended: { class: 'bg-dark', text: 'Ended' },
      sold: { class: 'bg-primary', text: 'Sold' },
      cancelled: { class: 'bg-danger', text: 'Cancelled' }
    }
    return badges[status] || { class: 'bg-secondary', text: status }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="dashboard-root" data-theme={theme}>
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--glass-300)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p>Loading auctions...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">Manage Auctions</h1>
              <span className="page-subtitle">View and manage all auction listings</span>
            </div>
            <div className="topbar-right">
              <button className="pill" onClick={() => navigate('/admin/auction-approval')}>
                Pending Approvals ({stats.pending})
              </button>
            </div>
          </header>

          {/* Stats Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div className="panel glass" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--primary)' }}>{stats.total}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}>Total Auctions</div>
            </div>
            <div className="panel glass" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fd7e14' }}>{stats.pending}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}>Pending Approval</div>
            </div>
            <div className="panel glass" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#198754' }}>{stats.active}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}>Active Auctions</div>
            </div>
            <div className="panel glass" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#6c757d' }}>{stats.ended}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}>Ended Auctions</div>
            </div>
          </div>

          {/* Filters */}
          <div className="panel glass" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                  <FiFilter style={{ marginRight: 4 }} />
                  Status
                </label>
                <select 
                  value={filters.status} 
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="input glass"
                  style={{ width: '100%' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                  <option value="sold">Sold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                  Auction Type
                </label>
                <select 
                  value={filters.auctionType} 
                  onChange={(e) => setFilters(prev => ({ ...prev, auctionType: e.target.value }))}
                  className="input glass"
                  style={{ width: '100%' }}
                >
                  <option value="all">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="reserve">Reserve</option>
                  <option value="direct_sale">Buy Now</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                  Sort By
                </label>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="input glass"
                  style={{ width: '100%' }}
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="-currentBid">Highest Bid</option>
                  <option value="currentBid">Lowest Bid</option>
                  <option value="endDate">Ending Soon</option>
                  <option value="-endDate">Ending Later</option>
                </select>
              </div>
            </div>
          </div>

          {/* Auctions Grid */}
          {auctions.length === 0 ? (
            <div className="panel glass" style={{ padding: 40, textAlign: 'center' }}>
              <MdGavel size={48} style={{ color: 'var(--muted)', marginBottom: 16 }} />
              <h3 style={{ margin: '0 0 8px 0' }}>No Auctions Found</h3>
              <p className="muted">No auctions match the current filters</p>
            </div>
          ) : (
            <div className="auctions-grid">
              {auctions.map((auction) => {
                const typeBadge = getAuctionTypeBadge(auction.auctionType)
                const statusBadge = getStatusBadge(auction.status)
                const isProcessing = processing[auction._id]
                
                return (
                  <div key={auction._id} className="auction-card panel glass">
                    <div className="thumb-xl">
                      <img 
                        src={auction.carListing?.media?.[0]?.url ? `${API}${auction.carListing.media[0].url}` : '/assets/images/handpicked-img-1.webp'}
                        alt={auction.carListing?.name}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      
                      {/* Status Badge */}
                      <div style={{ 
                        position: 'absolute', 
                        top: 8, 
                        left: 8, 
                        background: statusBadge.class.includes('bg-') ? 
                          (statusBadge.class.includes('warning') ? '#fd7e14' : 
                           statusBadge.class.includes('success') ? '#198754' :
                           statusBadge.class.includes('danger') ? '#dc3545' :
                           statusBadge.class.includes('primary') ? '#0d6efd' : '#6c757d') : '#6c757d',
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: 12, 
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        {statusBadge.text}
                      </div>
                      
                      {/* Type Badge */}
                      <div style={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        background: 'rgba(0,0,0,0.7)', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: 12, 
                        fontSize: 12
                      }}>
                        {typeBadge.text}
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="title-row">
                        <h4>{auction.carListing?.name}</h4>
                        <span className="year">{auction.carListing?.year}</span>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <FiUser size={14} style={{ color: 'var(--muted)' }} />
                          <span style={{ fontSize: 14, color: 'var(--muted)' }}>
                            Seller: {auction.seller?.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <FiCalendar size={14} style={{ color: 'var(--muted)' }} />
                          <span style={{ fontSize: 14, color: 'var(--muted)' }}>
                            Created: {formatDate(auction.createdAt)}
                          </span>
                        </div>
                        {auction.status === 'active' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiClock size={14} style={{ color: 'var(--muted)' }} />
                            <span style={{ fontSize: 14, color: 'var(--muted)' }}>
                              Ends: {formatDate(auction.endDate)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="metrics">
                        <div className="metric">
                          <span className="muted">Current Bid</span>
                          <strong>${auction.currentBid?.toLocaleString() || '0'}</strong>
                        </div>
                        <div className="metric">
                          <span className="muted">Total Bids</span>
                          <strong>{auction.totalBids || 0}</strong>
                        </div>
                        {auction.auctionType === 'reserve' && auction.reservePrice && (
                          <div className="metric">
                            <span className="muted">Reserve</span>
                            <strong>${auction.reservePrice.toLocaleString()}</strong>
                          </div>
                        )}
                      </div>

                      {auction.buyNowPrice && (
                        <div style={{ marginTop: 8, fontSize: 14, color: 'var(--success)' }}>
                          Buy Now: ${auction.buyNowPrice.toLocaleString()}
                        </div>
                      )}

                      <div style={{ 
                        display: 'flex', 
                        gap: 8, 
                        marginTop: 16,
                        opacity: isProcessing ? 0.7 : 1,
                        pointerEvents: isProcessing ? 'none' : 'auto'
                      }}>
                        <button 
                          className="pill small"
                          onClick={() => navigate(`/dashboard/auction-details/${auction._id}`)}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                        >
                          <FiEye size={14} />
                          View
                        </button>
                        
                        {auction.status === 'pending_approval' && (
                          <>
                            <button 
                              className="pill small"
                              onClick={() => approveAuction(auction._id)}
                              disabled={isProcessing}
                              style={{ 
                                background: '#22c55e', 
                                color: 'white', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 4 
                              }}
                            >
                              <FiCheck size={14} />
                              {isProcessing === 'approving' ? 'Approving...' : 'Approve'}
                            </button>
                            <button 
                              className="pill small"
                              onClick={() => viewDetails(auction)}
                              disabled={isProcessing}
                              style={{ 
                                background: '#dc2626', 
                                color: 'white', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 4 
                              }}
                            >
                              <FiX size={14} />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Details Modal */}
          {showDetails && selectedAuction && (
            <div style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.7)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 1000 
            }}>
              <div className="panel glass" style={{ 
                width: '90%', 
                maxWidth: 600, 
                maxHeight: '90vh', 
                overflow: 'auto',
                padding: 24 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h3 style={{ margin: 0 }}>Reject Auction</h3>
                  <button 
                    className="pill small"
                    onClick={() => setShowDetails(false)}
                  >
                    Close
                  </button>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <h4>{selectedAuction.carListing?.name}</h4>
                  <p>Seller: {selectedAuction.seller?.name}</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Rejection Reason:
                  </label>
                  <textarea
                    className="input glass big"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    rows={4}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    className="pill"
                    onClick={() => setShowDetails(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="pill"
                    onClick={() => rejectAuction(selectedAuction._id, rejectReason)}
                    disabled={processing[selectedAuction._id] || !rejectReason.trim()}
                    style={{ 
                      background: '#dc2626', 
                      color: 'white',
                      flex: 1
                    }}
                  >
                    {processing[selectedAuction._id] === 'rejecting' ? 'Rejecting...' : 'Reject Auction'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminAuctions
