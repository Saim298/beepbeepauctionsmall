import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../utils/Sidebar.jsx'
import '../pages/dashboard.css'
import { FiClock, FiDollarSign, FiUsers, FiHeart, FiShare2, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiCreditCard } from 'react-icons/fi'
import { MdGavel } from 'react-icons/md'
import io from 'socket.io-client'

const apiBase = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const AuctionDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const [bidAmount, setBidAmount] = useState('')
  const [maxBidAmount, setMaxBidAmount] = useState('')
  const [showProxyBid, setShowProxyBid] = useState(false)
  const [bidding, setBidding] = useState(false)
  const [socket, setSocket] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [watchers, setWatchers] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [loadingComments, setLoadingComments] = useState(true)

  // Normalize relative upload paths to absolute URLs
  const toAbsUrl = (u) => {
    if (!u) return '/assets/images/handpicked-img-1.webp'
    if (u.startsWith('http') || u.startsWith('data:')) return u
    // Ensure no double slashes
    const cleanUrl = u.startsWith('/') ? u : `/${u}`
    const fullUrl = `${apiBase}${cleanUrl}`
    return fullUrl
  }

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])

  // Initialize socket connection and get current user
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    // Get current user
    fetch(`${apiBase}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if (data.user) {
        setCurrentUser(data.user)
      }
    })
    .catch(console.error)

    // Setup socket connection
    const newSocket = io(apiBase, {
      auth: token ? { token } : {}
    })

    newSocket.on('connect', () => {
      console.log('🔗 Socket connected for auction:', id)
      if (currentUser) {
        newSocket.emit('join', { 
          userId: currentUser.id, 
          userName: currentUser.name 
        })
      }
      newSocket.emit('join-auction', { auctionId: id })
    })

    newSocket.on('new-bid', (bidData) => {
      console.log('🏁 New bid received:', bidData)
      setBids(prev => [bidData, ...prev])
    })

    newSocket.on('auction-updated', (updateData) => {
      console.log('🔄 Auction updated:', updateData)
      setAuction(prev => prev ? {
        ...prev,
        currentBid: updateData.currentBid,
        totalBids: updateData.totalBids,
        highestBidder: updateData.highestBidder,
        reserveMet: updateData.reserveMet
      } : null)
    })

    newSocket.on('new-auction-comment', (commentData) => {
      console.log('💬 New comment received:', commentData)
      setComments(prev => [commentData, ...prev])
    })

    newSocket.on('auction-comment-deleted', (data) => {
      console.log('🗑️ Comment deleted:', data.commentId)
      setComments(prev => prev.filter(c => c._id !== data.commentId))
    })

    newSocket.on('auction-comment-hidden', (data) => {
      console.log('👁️ Comment hidden:', data.commentId)
      setComments(prev => prev.filter(c => c._id !== data.commentId))
    })

    newSocket.on('auction-user-typing', (data) => {
      if (data.userId !== currentUser?.id) {
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.userId !== data.userId)
          if (data.isTyping) {
            return [...filtered, { userId: data.userId, userName: data.userName }]
          }
          return filtered
        })
        
        // Clear typing indicator after 3 seconds
        if (data.isTyping) {
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(u => u.userId !== data.userId))
          }, 3000)
        }
      }
    })

    newSocket.on('auction-ended', (data) => {
      console.log('🏁 Auction ended:', data)
      setAuction(prev => prev ? { ...prev, status: 'ended', winner: data.winner } : null)
    })

    newSocket.on('auction-watcher-joined', (data) => {
      setWatchers(data.watcherCount)
    })

    newSocket.on('auction-watcher-left', (data) => {
      setWatchers(data.watcherCount)
    })

    setSocket(newSocket)

    return () => {
      newSocket.emit('leave-auction', { auctionId: id })
      newSocket.close()
    }
  }, [id])

  // Load auction data and comments
  useEffect(() => {
    const controller = new AbortController()
    
    Promise.all([
      fetch(`${apiBase}/api/auctions/${id}`, { signal: controller.signal }).then(r => r.json()),
      fetch(`${apiBase}/api/auctions/${id}/bids`, { signal: controller.signal }).then(r => r.ok ? r.json() : { bids: [] }),
      fetch(`${apiBase}/api/auctions/${id}/comments`, { signal: controller.signal }).then(r => r.ok ? r.json() : { comments: [] })
    ]).then(([auctionData, bidsData, commentsData]) => {
      console.log('🎯 Raw auction response:', auctionData)
      console.log('🎯 Raw bids response:', bidsData)
      
      if (auctionData.error) {
        setError(auctionData.error)
      } else {
        // Handle nested auction structure from API
        const auction = auctionData.auction || auctionData
        console.log('🎯 Processed auction:', auction)
        console.log('🎯 Media data:', auction?.carListing?.media)
        
        setAuction(auction)
        setBids(Array.isArray(bidsData.bids) ? bidsData.bids : [])
        setComments(Array.isArray(commentsData.comments) ? commentsData.comments : [])
      }
      setLoading(false)
      setLoadingComments(false)
    }).catch(() => { 
      setError('Failed to load auction') 
      setLoading(false)
      setLoadingComments(false)
    })
    
    return () => controller.abort()
  }, [id])

  const formatTimeRemaining = (endDate) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end - now

    if (diff <= 0) return 'Ended'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const placeBid = async () => {
    if (!currentUser) {
      alert('Please log in to place a bid')
      return
    }

    const minimumBid = auction.currentBid > 0 
      ? auction.currentBid + (auction.bidIncrement || 100)
      : auction.startingBid;

    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) < minimumBid) {
      alert(`Bid must be at least $${minimumBid.toLocaleString()}`)
      return
    }

    setBidding(true)
    try {
      const token = localStorage.getItem('auth_token')
      const payload = {
        bidAmount: Number(bidAmount)
      }
      
      if (showProxyBid && maxBidAmount) {
        payload.maxBidAmount = Number(maxBidAmount)
      }

      const response = await fetch(`${apiBase}/api/auctions/${id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      
      if (response.ok) {
        setBidAmount('')
        setMaxBidAmount('')
        setShowProxyBid(false)
        // Bids will be updated via socket
      } else {
        alert(result.error || 'Failed to place bid')
      }
    } catch (error) {
      alert('Error placing bid')
    } finally {
      setBidding(false)
    }
  }

  const buyNow = async () => {
    if (!currentUser) {
      alert('Please log in to buy now')
      return
    }

    if (!auction.buyNowPrice) return

    if (confirm(`Buy this auction for $${auction.buyNowPrice.toLocaleString()}?`)) {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${apiBase}/api/auctions/${id}/buy-now`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        const result = await response.json()
        
        if (response.ok) {
          alert('Purchase successful!')
          // Reload auction to show new status
          window.location.reload()
        } else {
          alert(result.error || 'Failed to complete purchase')
        }
      } catch (error) {
        alert('Error processing purchase')
      }
    }
  }

  const addComment = async () => {
    if (!currentUser) {
      alert('Please log in to comment')
      return
    }

    if (!newComment.trim()) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${apiBase}/api/auctions/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: newComment.trim() })
      })

      const result = await response.json()
      
      if (response.ok) {
        setNewComment('')
        // Comment will be added via socket event
      } else {
        alert(result.error || 'Failed to add comment')
      }
    } catch (error) {
      alert('Error adding comment')
    }
  }

  const handleCommentInputChange = (e) => {
    const value = e.target.value
    setNewComment(value)
    
    // Handle typing indicator
    if (socket && currentUser) {
      if (value.length > 0 && !isTyping) {
        setIsTyping(true)
        socket.emit('auction-typing', { auctionId: id, isTyping: true })
      } else if (value.length === 0 && isTyping) {
        setIsTyping(false)
        socket.emit('auction-typing', { auctionId: id, isTyping: false })
      }
    }
  }

  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addComment()
      if (socket && isTyping) {
        setIsTyping(false)
        socket.emit('auction-typing', { auctionId: id, isTyping: false })
      }
    }
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

  const getAuctionTypeBadge = (type) => {
    const badges = {
      standard: { class: 'bg-primary', text: 'Standard Auction' },
      reserve: { class: 'bg-warning text-dark', text: 'Reserve Auction' },
      direct_sale: { class: 'bg-success', text: 'Buy It Now' }
    }
    return badges[type] || { class: 'bg-secondary', text: type }
  }

  if (loading) return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="panel glass" style={{ padding: 24 }}>Loading auction...</div>
        </div>
      </main>
    </div>
  )

  if (error) return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="panel glass" style={{ padding: 24 }}>
            <h3>Error</h3>
            <p>{error}</p>
            <button className="pill" onClick={() => navigate('/auctions')}>← Back to Auctions</button>
          </div>
        </div>
      </main>
    </div>
  )

  if (!auction) return null

  const statusBadge = getStatusBadge(auction.status)
  const typeBadge = getAuctionTypeBadge(auction.auctionType)
  const timeRemaining = formatTimeRemaining(auction.endDate)
  const isEnded = auction.status === 'ended' || new Date(auction.endDate) < new Date()
  const isActive = auction.status === 'active' && !isEnded
  const canBid = isActive && currentUser && currentUser.id !== auction.seller?.id
  const canBuyNow = isActive && auction.buyNowPrice && currentUser && currentUser.id !== auction.seller?.id

  return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <button className="pill" onClick={() => navigate('/auctions')}>← Back to Auctions</button>
              <h1 className="page-title">
                <MdGavel style={{ marginRight: 8 }} />
                {auction.carListing?.name}
              </h1>
              <span className="page-subtitle">
                {auction.carListing?.year} • {auction.carListing?.make?.name} • {auction.carListing?.model?.name}
              </span>
            </div>
            <div className="topbar-right">
              <span className={`badge ${statusBadge.class}`}>{statusBadge.text}</span>
              <button className="pill" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </header>

          {/* Main auction content */}
          <section className="panel glass" style={{ padding: 16 }}>
            <div className="d-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <div>
                {/* Main media viewer */}
                <div className="thumb-xl" style={{ borderRadius: 16, overflow: 'hidden', maxHeight: 520, position: 'relative' }}>
                  {/* Debug info */}
                  {process.env.NODE_ENV === 'development' && (
                    <div style={{ position: 'absolute', top: 0, left: 0, background: 'rgba(255,0,0,0.7)', color: 'white', padding: '4px', fontSize: 10, zIndex: 1000 }}>
                      Media: {auction.carListing?.media?.length || 0} items
                    </div>
                  )}
                  {(() => {
                    const media = (auction.carListing?.media?.length ? auction.carListing.media : [{ url: '/assets/images/handpicked-img-1.webp', type: 'image' }])
                    console.log('🖼️ Available media:', media)
                    const m = media[Math.min(activeIdx, media.length - 1)]
                    const mediaUrl = toAbsUrl(m.url)
                    console.log('🖼️ Current media item:', m)
                    console.log('🖼️ Media URL transformation:', m.url, '→', mediaUrl)
                    
                    return m?.type === 'video' ? (
                      <video 
                        src={mediaUrl} 
                        controls 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => console.error('Video load error:', e)}
                      />
                    ) : (
                      <img 
                        src={mediaUrl} 
                        alt={auction.carListing?.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          console.error('Image load error:', e)
                          e.target.src = '/assets/images/handpicked-img-1.webp'
                        }}
                      />
                    )
                  })()}
                  
                  {/* Auction type overlay */}
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className={`badge ${typeBadge.class}`}>{typeBadge.text}</span>
                  </div>
                  
                  {/* Time remaining overlay */}
                  {isActive && (
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '8px 12px', borderRadius: 8 }}>
                      <FiClock style={{ marginRight: 4 }} />
                      {timeRemaining}
                    </div>
                  )}
                  
                  {/* Media counter */}
                  {auction.carListing?.media?.length > 1 && (
                    <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '4px 8px', borderRadius: 12, fontSize: 12 }}>
                      {activeIdx + 1} / {auction.carListing.media.length}
                    </div>
                  )}
                  
                  {/* Watchers count */}
                  {watchers > 1 && (
                    <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '4px 8px', borderRadius: 12, fontSize: 12 }}>
                      <FiUsers style={{ marginRight: 4 }} />
                      {watchers} watching
                    </div>
                  )}
                </div>

               

                {/* Thumbnails */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto' }}>
                  {(auction.carListing?.media?.length ? auction.carListing.media : [{ url: '/assets/images/handpicked-img-1.webp', type: 'image' }]).map((m, i) => {
                    const thumbUrl = toAbsUrl(m.url)
                    return (
                      <button key={i} className={`thumb sm ${activeIdx === i ? 'active' : ''}`} onClick={() => setActiveIdx(i)} style={{ width: 116, height: 74, borderRadius: 12, overflow: 'hidden', border: activeIdx === i ? '2px solid var(--primary)' : '1px solid var(--glass-300)' }}>
                        {m.type === 'video' ? (
                          <video 
                            src={thumbUrl} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => console.error('Thumb video error:', e)}
                          />
                        ) : (
                          <img 
                            src={thumbUrl} 
                            alt={`${auction.carListing?.name}-${i}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              console.error('Thumb image error:', e)
                              e.target.src = '/assets/images/handpicked-img-1.webp'
                            }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Vehicle details */}
                <div className="mt-3">
                  <h3 style={{ marginBottom: 16 }}>Vehicle Details</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                    {auction.carListing?.mileage && (
                      <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--glass-300)', background: 'var(--glass-100)' }}>
                        <strong>Mileage:</strong> {auction.carListing.mileage.toLocaleString()} miles
                      </div>
                    )}
                    {auction.carListing?.condition && (
                      <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--glass-300)', background: 'var(--glass-100)' }}>
                        <strong>Condition:</strong> {auction.carListing.condition}
                      </div>
                    )}
                    {auction.carListing?.color && (
                      <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--glass-300)', background: 'var(--glass-100)' }}>
                        <strong>Color:</strong> {auction.carListing.color}
                      </div>
                    )}
                    {auction.carListing?.transmission && (
                      <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--glass-300)', background: 'var(--glass-100)' }}>
                        <strong>Transmission:</strong> {auction.carListing.transmission}
                      </div>
                    )}
                    {auction.carListing?.fuelType && (
                      <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--glass-300)', background: 'var(--glass-100)' }}>
                        <strong>Fuel Type:</strong> {auction.carListing.fuelType}
                      </div>
                    )}
                    {auction.carListing?.drivetrain && (
                      <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--glass-300)', background: 'var(--glass-100)' }}>
                        <strong>Drivetrain:</strong> {auction.carListing.drivetrain}
                      </div>
                    )}
                    {auction.carListing?.location && (
                      <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--glass-300)', background: 'var(--glass-100)' }}>
                        <strong>Location:</strong> {auction.carListing.location}
                      </div>
                    )}
                  </div>

                  <div className="prose" style={{ marginTop: 16 }} dangerouslySetInnerHTML={{ __html: auction.carListing?.descriptionHtml || '<p>No description available.</p>' }} />
                </div>
              </div>

              {/* Bidding sidebar */}
              <aside>
                <div className="panel soft" style={{ padding: 16, borderRadius: 12, marginBottom: 16 }}>
                  <div className="d-grid" style={{ gridTemplateColumns: '1fr', gap: 16 }}>
                    {/* Current bid */}
                    <div style={{ textAlign: 'center' }}>
                      <span className="muted">Current Bid</span>
                      <h2 style={{ margin: '4px 0', color: 'var(--primary)' }}>
                        ${auction.currentBid?.toLocaleString() || '0'}
                      </h2>
                      <div style={{ fontSize: 14, color: 'var(--muted)' }}>
                        {auction.totalBids || 0} bid{auction.totalBids !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Reserve status */}
                    {auction.auctionType === 'reserve' && (
                      <div style={{ textAlign: 'center', padding: '8px 12px', borderRadius: 8, background: auction.reserveMet ? 'var(--success-100)' : 'var(--warning-100)' }}>
                        {auction.reserveMet ? (
                          <span style={{ color: 'var(--success-700)', fontSize: 14, fontWeight: 'bold' }}>
                            <FiCheckCircle style={{ marginRight: 4 }} />
                            Reserve Met
                          </span>
                        ) : (
                          <span style={{ color: 'var(--warning-700)', fontSize: 14, fontWeight: 'bold' }}>
                            <FiAlertCircle style={{ marginRight: 4 }} />
                            Reserve Not Met
                          </span>
                        )}
                      </div>
                    )}

                    {/* Buy now option */}
                    {canBuyNow && (
                      <div style={{ textAlign: 'center', padding: '12px', borderRadius: 8, border: '2px solid var(--success)', background: 'var(--success-100)' }}>
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ fontSize: 14, color: 'var(--muted)' }}>Buy It Now</span>
                          <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--success)' }}>
                            ${auction.buyNowPrice.toLocaleString()}
                          </div>
                        </div>
                        <button 
                          className="pill primary" 
                          onClick={buyNow}
                          style={{ width: '100%', background: 'var(--success)', borderColor: 'var(--success)' }}
                        >
                          <FiCreditCard style={{ marginRight: 4 }} />
                          Buy Now
                        </button>
                      </div>
                    )}

                    {/* Bidding form */}
                    {canBid && (
                      <div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                            Your Bid
                          </label>
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={`Min: $${(auction.currentBid > 0 ? auction.currentBid + (auction.bidIncrement || 100) : auction.startingBid).toLocaleString()}`}
                            className="input glass"
                            style={{ width: '100%' }}
                          />
                          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                            Minimum increment: ${auction.bidIncrement?.toLocaleString() || '100'}
                          </div>
                        </div>

                        {/* Proxy bidding */}
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                            <input
                              type="checkbox"
                              checked={showProxyBid}
                              onChange={(e) => setShowProxyBid(e.target.checked)}
                            />
                            Enable proxy bidding
                          </label>
                          {showProxyBid && (
                            <input
                              type="number"
                              value={maxBidAmount}
                              onChange={(e) => setMaxBidAmount(e.target.value)}
                              placeholder="Maximum bid amount"
                              className="input glass"
                              style={{ width: '100%', marginTop: 8 }}
                            />
                          )}
                        </div>

                        <button 
                          className="pill primary" 
                          onClick={placeBid}
                          disabled={bidding || !bidAmount}
                          style={{ width: '100%' }}
                        >
                          <MdGavel style={{ marginRight: 4 }} />
                          {bidding ? 'Placing Bid...' : 'Place Bid'}
                        </button>
                      </div>
                    )}

                    {/* Time remaining */}
                    {isActive && (
                      <div style={{ textAlign: 'center', padding: '12px', borderRadius: 8, background: 'var(--glass-200)' }}>
                        <div style={{ fontSize: 14, color: 'var(--muted)' }}>Time Remaining</div>
                        <div style={{ fontSize: 16, fontWeight: 'bold', color: 'var(--text)' }}>{timeRemaining}</div>
                      </div>
                    )}

                    {/* Seller info */}
                    <div>
                      <span className="muted">Seller</span>
                      <div className="d-center" style={{ gap: 8, justifyContent: 'flex-start', marginTop: 4 }}>
                        <div className="avatar sm">
                          <img src={auction.seller?.avatarFile ? toAbsUrl(auction.seller.avatarFile) : '/assets/images/user-img-1.webp'} alt="seller" />
                        </div>
                        <strong>{auction.seller?.name || 'Unknown'}</strong>
                        <span className="pill soft">{auction.seller?.role || 'seller'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent bids */}
                <div className="panel soft" style={{ padding: 16, borderRadius: 12, marginBottom: 16 }}>
                  <h4 style={{ marginTop: 0, marginBottom: 12 }}>Recent Bids</h4>
                  {bids.length === 0 ? (
                    <p className="muted" style={{ fontSize: 14 }}>No bids yet</p>
                  ) : (
                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                      {bids.slice(0, 10).map((bid, index) => (
                        <div key={bid._id || index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom: index < Math.min(bids.length, 10) - 1 ? '1px solid var(--glass-300)' : 'none'
                        }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 'bold' }}>${(bid.amount || bid.bidAmount)?.toLocaleString()}</span>
                              
                              {bid.status === 'winning' && (
                                <span className="pill soft" style={{ fontSize: 10, padding: '2px 6px', background: 'var(--success)', color: 'white' }}>
                                  HIGH BID
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
                              <span>{bid.bidder?.name || 'Anonymous'}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>
                            {new Date(bid.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Comments */}
                <div className="panel soft" style={{ padding: 16, borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0 }}>Live Chat</h4>
                    {watchers > 1 && (
                      <span className="pill soft" style={{ fontSize: 12 }}>
                        {watchers} watching
                      </span>
                    )}
                  </div>
                  
                  {/* Comments Display */}
                  <div style={{ 
                    height: 300, 
                    overflowY: 'auto',
                    padding: 12,
                    border: '1px solid var(--glass-300)',
                    borderRadius: 8,
                    background: 'var(--glass-100)',
                    marginBottom: 12
                  }}>
                    {loadingComments ? (
                      <div style={{ textAlign: 'center', padding: 20 }}>
                        <span className="muted">Loading comments...</span>
                      </div>
                    ) : comments.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: 20 }}>
                        <span className="muted">No comments yet. Start the conversation!</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                        {comments.map((comment, index) => (
                          <div key={comment._id || index} style={{ marginBottom: 8 }}>
                            <div style={{ 
                              padding: 8, 
                              borderRadius: 8,
                              background: comment.type === 'bid_notification' ? 'var(--primary)' : 
                                         comment.type === 'system' ? 'var(--warning)' : 'var(--glass-200)',
                              color: comment.type === 'bid_notification' ? 'white' : 'var(--text)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                {comment.type === 'comment' && (
                                  <div className="avatar sm">
                                    <img src={comment.user?.avatarFile ? toAbsUrl(comment.user.avatarFile) : '/assets/images/user-img-1.webp'} alt="user" />
                                  </div>
                                )}
                                <span style={{ fontSize: 12, fontWeight: 'bold' }}>
                                  {comment.type === 'system' ? '🔔 System' : 
                                   comment.type === 'bid_notification' ? '💰 Bid Alert' : 
                                   comment.user?.name || 'Anonymous'}
                                </span>
                                <span className="muted" style={{ fontSize: 11 }}>
                                  {new Date(comment.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                              <div style={{ fontSize: 14 }}>
                                {comment.message}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Typing Indicators */}
                    {typingUsers.length > 0 && (
                      <div style={{ 
                        padding: 8, 
                        background: 'var(--glass-200)', 
                        borderRadius: 8, 
                        marginBottom: 8,
                        border: '1px solid var(--glass-300)'
                      }}>
                        <span className="muted" style={{ fontSize: 12 }}>
                          {typingUsers.map(u => u.userName).join(', ')} 
                          {typingUsers.length === 1 ? ' is' : ' are'} typing...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Comment Input */}
                  <div>
                    {currentUser ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          className="input glass"
                          placeholder="Type a comment..."
                          value={newComment}
                          onChange={handleCommentInputChange}
                          onKeyPress={handleCommentKeyPress}
                          maxLength={500}
                          style={{ flex: 1 }}
                        />
                        <button 
                          className="pill primary"
                          onClick={addComment}
                          disabled={!newComment.trim()}
                        >
                          Send
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: 8 }}>
                        <span className="muted" style={{ fontSize: 14 }}>
                          Sign in to join the conversation
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* Auction info */}
          <section className="panel glass mt-3" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Auction Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              <div>
                <strong>Auction Type:</strong> {typeBadge.text}
              </div>
              <div>
                <strong>Started:</strong> {new Date(auction.startDate).toLocaleString()}
              </div>
              <div>
                <strong>Ends:</strong> {new Date(auction.endDate).toLocaleString()}
              </div>
              <div>
                <strong>Starting Bid:</strong> ${auction.startingBid?.toLocaleString() || '0'}
              </div>
              {auction.reservePrice && (
                <div>
                  <strong>Reserve Price:</strong> ${auction.reservePrice.toLocaleString()}
                </div>
              )}
              <div>
                <strong>Bid Increment:</strong> ${auction.bidIncrement?.toLocaleString() || '100'}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AuctionDetails
