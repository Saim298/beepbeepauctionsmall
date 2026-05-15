import React, { useEffect, useState } from 'react'
import Sidebar from '../../utils/Sidebar.jsx'
import '../../pages/dashboard.css'
import { FiCheck, FiX, FiEye, FiClock, FiUser, FiDollarSign, FiCalendar } from 'react-icons/fi'
import { MdGavel } from 'react-icons/md'

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const AuctionApproval = () => {
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [pendingAuctions, setPendingAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})
  const [selectedAuction, setSelectedAuction] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])

  useEffect(() => {
    loadPendingAuctions()
  }, [])

  const loadPendingAuctions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(`${API}/api/auctions/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setPendingAuctions(data.auctions || [])
      } else {
        console.error('Failed to load pending auctions')
      }
    } catch (error) {
      console.error('Error loading pending auctions:', error)
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
        await loadPendingAuctions()
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
        await loadPendingAuctions()
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
              <p>Loading pending auctions...</p>
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
              <h1 className="page-title">Auction Approval</h1>
              <span className="page-subtitle">Review and approve pending auctions</span>
            </div>
            <div className="topbar-right">
              <div style={{ 
                background: pendingAuctions.length > 0 ? '#dc2626' : '#6b7280', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: 20, 
                fontSize: 14, 
                fontWeight: 'bold' 
              }}>
                {pendingAuctions.length} Pending
              </div>
            </div>
          </header>

          {pendingAuctions.length === 0 ? (
            <div className="panel glass" style={{ padding: 40, textAlign: 'center' }}>
              <MdGavel size={48} style={{ color: 'var(--muted)', marginBottom: 16 }} />
              <h3 style={{ margin: '0 0 8px 0' }}>No Pending Auctions</h3>
              <p className="muted">All auctions have been reviewed</p>
            </div>
          ) : (
            <div className="auctions-grid">
              {pendingAuctions.map((auction) => {
                const typeBadge = getAuctionTypeBadge(auction.auctionType)
                const isProcessing = processing[auction._id]
                
                return (
                  <div key={auction._id} className="auction-card panel glass">
                    <div className="thumb-xl">
                      <img 
                        src={auction.carListing?.media?.[0]?.url ? `${API}${auction.carListing.media[0].url}` : '/assets/images/handpicked-img-1.webp'}
                        alt={auction.carListing?.name}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      <div style={{ 
                        position: 'absolute', 
                        top: 8, 
                        left: 8, 
                        background: '#dc2626', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: 12, 
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        PENDING APPROVAL
                      </div>
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
                            Submitted: {formatDate(auction.createdAt)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <FiClock size={14} style={{ color: 'var(--muted)' }} />
                          <span style={{ fontSize: 14, color: 'var(--muted)' }}>
                            Starts: {formatDate(auction.startDate)}
                          </span>
                        </div>
                      </div>

                      <div className="metrics">
                        <div className="metric">
                          <span className="muted">Starting Bid</span>
                          <strong>${auction.startingBid?.toLocaleString() || '0'}</strong>
                        </div>
                        <div className="metric">
                          <span className="muted">Duration</span>
                          <strong>{Math.ceil((new Date(auction.endDate) - new Date(auction.startDate)) / (1000 * 60 * 60 * 24))} days</strong>
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
                          onClick={() => viewDetails(auction)}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                        >
                          <FiEye size={14} />
                          Details
                        </button>
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
                          onClick={() => {
                            setSelectedAuction(auction)
                            setShowDetails(true)
                          }}
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
                maxWidth: 800, 
                maxHeight: '90vh', 
                overflow: 'auto',
                padding: 24 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h3 style={{ margin: 0 }}>Auction Details</h3>
                  <button 
                    className="pill small"
                    onClick={() => setShowDetails(false)}
                  >
                    Close
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {/* Left Column - Vehicle Info */}
                  <div>
                    <h4 style={{ marginBottom: 16 }}>Vehicle Information</h4>
                    <div style={{ marginBottom: 16 }}>
                      <img 
                        src={selectedAuction.carListing?.media?.[0]?.url ? `${API}${selectedAuction.carListing.media[0].url}` : '/assets/images/handpicked-img-1.webp'}
                        alt={selectedAuction.carListing?.name}
                        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
                      />
                    </div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <div><strong>Name:</strong> {selectedAuction.carListing?.name}</div>
                      <div><strong>Year:</strong> {selectedAuction.carListing?.year}</div>
                      <div><strong>Make:</strong> {selectedAuction.carListing?.make?.name}</div>
                      <div><strong>Model:</strong> {selectedAuction.carListing?.model?.name}</div>
                      {selectedAuction.carListing?.mileage && (
                        <div><strong>Mileage:</strong> {selectedAuction.carListing.mileage.toLocaleString()} miles</div>
                      )}
                      {selectedAuction.carListing?.condition && (
                        <div><strong>Condition:</strong> {selectedAuction.carListing.condition}</div>
                      )}
                      {selectedAuction.carListing?.color && (
                        <div><strong>Color:</strong> {selectedAuction.carListing.color}</div>
                      )}
                      {selectedAuction.carListing?.location && (
                        <div><strong>Location:</strong> {selectedAuction.carListing.location}</div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Auction Info */}
                  <div>
                    <h4 style={{ marginBottom: 16 }}>Auction Information</h4>
                    <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                      <div><strong>Seller:</strong> {selectedAuction.seller?.name}</div>
                      <div><strong>Email:</strong> {selectedAuction.seller?.email}</div>
                      <div><strong>Type:</strong> {getAuctionTypeBadge(selectedAuction.auctionType).text}</div>
                      <div><strong>Starting Bid:</strong> ${selectedAuction.startingBid?.toLocaleString()}</div>
                      {selectedAuction.reservePrice && (
                        <div><strong>Reserve Price:</strong> ${selectedAuction.reservePrice.toLocaleString()}</div>
                      )}
                      {selectedAuction.buyNowPrice && (
                        <div><strong>Buy Now Price:</strong> ${selectedAuction.buyNowPrice.toLocaleString()}</div>
                      )}
                      <div><strong>Duration:</strong> {Math.ceil((new Date(selectedAuction.endDate) - new Date(selectedAuction.startDate)) / (1000 * 60 * 60 * 24))} days</div>
                      <div><strong>Start Date:</strong> {formatDate(selectedAuction.startDate)}</div>
                      <div><strong>End Date:</strong> {formatDate(selectedAuction.endDate)}</div>
                      <div><strong>Submitted:</strong> {formatDate(selectedAuction.createdAt)}</div>
                    </div>

                    {/* Description */}
                    {selectedAuction.carListing?.descriptionHtml && (
                      <div style={{ marginBottom: 16 }}>
                        <h5>Description:</h5>
                        <div 
                          style={{ 
                            padding: 12, 
                            background: 'var(--glass-100)', 
                            borderRadius: 8, 
                            maxHeight: 150, 
                            overflow: 'auto' 
                          }}
                          dangerouslySetInnerHTML={{ __html: selectedAuction.carListing.descriptionHtml }}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                      <button 
                        className="pill"
                        onClick={() => approveAuction(selectedAuction._id)}
                        disabled={processing[selectedAuction._id]}
                        style={{ 
                          background: '#22c55e', 
                          color: 'white', 
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8
                        }}
                      >
                        <FiCheck />
                        {processing[selectedAuction._id] === 'approving' ? 'Approving...' : 'Approve Auction'}
                      </button>
                    </div>

                    {/* Reject Section */}
                    <div style={{ marginTop: 16, padding: 16, background: 'rgba(220, 38, 38, 0.1)', borderRadius: 8, border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                      <h5 style={{ color: '#dc2626', marginBottom: 12 }}>Reject Auction</h5>
                      <textarea
                        className="input glass big"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        rows={3}
                        style={{ marginBottom: 12 }}
                      />
                      <button 
                        className="pill"
                        onClick={() => rejectAuction(selectedAuction._id, rejectReason)}
                        disabled={processing[selectedAuction._id] || !rejectReason.trim()}
                        style={{ 
                          background: '#dc2626', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}
                      >
                        <FiX />
                        {processing[selectedAuction._id] === 'rejecting' ? 'Rejecting...' : 'Reject Auction'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AuctionApproval
