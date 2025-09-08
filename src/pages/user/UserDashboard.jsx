import React, { useEffect, useState } from 'react'
import Sidebar from '../../utils/Sidebar.jsx'
import '../../pages/dashboard.css'
import { FiTrendingUp, FiDollarSign, FiClock, FiAward, FiEye } from 'react-icons/fi'
import { MdGavel } from 'react-icons/md'

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const UserDashboard = () => {
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [stats, setStats] = useState({
    totalBids: 0,
    activeBids: 0,
    wonAuctions: 0,
    totalSpent: 0
  })
  const [recentBids, setRecentBids] = useState([])
  const [watchingAuctions, setWatchingAuctions] = useState([])
  const [topBids, setTopBids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      // Load user's auction activity
      const response = await fetch(`${API}/api/auctions/user/my-auctions?type=bidding`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        const auctions = data.auctions || []
        
        // Calculate stats
        const totalBids = auctions.reduce((sum, auction) => sum + (auction.userBid?.bidAmount || 0), 0)
        const activeBids = auctions.filter(a => a.status === 'active' && a.userBid).length
        const wonAuctions = auctions.filter(a => a.status === 'sold' && a.highestBidder?._id === a.userBid?.bidder).length
        const totalSpent = auctions
          .filter(a => a.status === 'sold' && a.highestBidder?._id === a.userBid?.bidder)
          .reduce((sum, a) => sum + a.currentBid, 0)

        setStats({
          totalBids: auctions.length,
          activeBids,
          wonAuctions,
          totalSpent
        })

        // Set recent bids (last 5)
        setRecentBids(auctions.slice(0, 5))

        // Set top bids (highest bid amounts)
        const topBidsData = auctions
          .filter(a => a.userBid)
          .sort((a, b) => (b.userBid.bidAmount || 0) - (a.userBid.bidAmount || 0))
          .slice(0, 5)
        setTopBids(topBidsData)
      }

      // Load featured auctions for "watching" section
      const featuredResponse = await fetch(`${API}/api/auctions/active?limit=5&sortBy=-currentBid`)
      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json()
        setWatchingAuctions(featuredData.auctions || [])
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeRemaining = (endDate) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end - now

    if (diff <= 0) return 'Ended'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h`
    return 'Less than 1h'
  }

  const getAuctionCategory = (auction) => {
    if (!auction.carListing) return 'Standard'
    
    const price = auction.currentBid || auction.startingBid || 0
    if (price >= 100000) return 'Luxury'
    if (price >= 50000) return 'Premium'
    if (auction.carListing.year && auction.carListing.year < 1990) return 'Classic'
    return 'Standard'
  }

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Luxury': return '#ffd700'
      case 'Premium': return '#c0392b'
      case 'Classic': return '#8e44ad'
      default: return '#3498db'
    }
  }

  if (loading) {
    return (
      <div className="dashboard-root" data-theme={theme}>
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--glass-300)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p>Loading dashboard...</p>
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
              <h1 className="page-title">Auction Dashboard</h1>
              <span className="page-subtitle">Track your bidding activity and wins</span>
            </div>
            <div className="topbar-right">
              <a className="pill" href="/auctions">Browse Auctions</a>
            </div>
          </header>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div className="panel glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 12, borderRadius: 12, background: 'var(--primary)', color: 'white' }}>
                  <MdGavel size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalBids}</div>
                  <div className="muted">Total Bids</div>
                </div>
              </div>
            </div>

            <div className="panel glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 12, borderRadius: 12, background: 'var(--success)', color: 'white' }}>
                  <FiClock size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--text)' }}>{stats.activeBids}</div>
                  <div className="muted">Active Bids</div>
                </div>
              </div>
            </div>

            <div className="panel glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 12, borderRadius: 12, background: 'var(--warning)', color: 'white' }}>
                  <FiAward size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--text)' }}>{stats.wonAuctions}</div>
                  <div className="muted">Won Auctions</div>
                </div>
              </div>
            </div>

            <div className="panel glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 12, borderRadius: 12, background: 'var(--info)', color: 'white' }}>
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--text)' }}>${stats.totalSpent.toLocaleString()}</div>
                  <div className="muted">Total Spent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Recent Bids */}
            <div className="panel glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Recent Bids</h3>
                <a href="/user/auctions" className="pill small">View All</a>
              </div>
              
              {recentBids.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <MdGavel size={32} style={{ color: 'var(--muted)', marginBottom: 8 }} />
                  <p className="muted">No bids yet</p>
                  <a href="/auctions" className="pill">Start Bidding</a>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {recentBids.map((auction) => (
                    <a key={auction._id} href={`/auctions/${auction._id}`} className="bid-item" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      padding: 12, 
                      background: 'var(--glass-100)', 
                      borderRadius: 8, 
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'background 0.2s'
                    }}>
                      <img 
                        src={auction.carListing?.media?.[0]?.url ? `https://beep-auctions-backend.onrender.com${auction.carListing.media[0].url}` : '/assets/images/handpicked-img-1.webp'}
                        alt={auction.carListing?.name}
                        style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: 14 }}>{auction.carListing?.name}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Your bid: ${auction.userBid?.bidAmount?.toLocaleString() || '0'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: auction.status === 'active' ? 'var(--success)' : 'var(--muted)' }}>
                          {auction.status === 'active' ? formatTimeRemaining(auction.endDate) : auction.status.toUpperCase()}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Top Bids by Category */}
            <div className="panel glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Top Bids by Category</h3>
                <FiTrendingUp size={20} style={{ color: 'var(--primary)' }} />
              </div>

              {topBids.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <FiDollarSign size={32} style={{ color: 'var(--muted)', marginBottom: 8 }} />
                  <p className="muted">No bids to show</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {topBids.map((auction) => {
                    const category = getAuctionCategory(auction)
                    return (
                      <a key={auction._id} href={`/auctions/${auction._id}`} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 12, 
                        padding: 12, 
                        background: 'var(--glass-100)', 
                        borderRadius: 8, 
                        textDecoration: 'none',
                        color: 'inherit'
                      }}>
                        <div style={{ 
                          width: 8, 
                          height: 36, 
                          backgroundColor: getCategoryColor(category), 
                          borderRadius: 4 
                        }}></div>
                        <img 
                          src={auction.carListing?.media?.[0]?.url ? `https://beep-auctions-backend.onrender.com${auction.carListing.media[0].url}` : '/assets/images/handpicked-img-1.webp'}
                          alt={auction.carListing?.name}
                          style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4 }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: 14 }}>{auction.carListing?.name}</div>
                          <div style={{ fontSize: 12, color: getCategoryColor(category) }}>{category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 'bold' }}>${auction.userBid?.bidAmount?.toLocaleString() || '0'}</div>
                          <div className="muted" style={{ fontSize: 12 }}>Your bid</div>
                        </div>
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Luxury Cars */}
            <div className="panel glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Luxury Auctions</h3>
                <span style={{ fontSize: 12, color: '#ffd700' }}>High Value</span>
              </div>
              
              <div style={{ display: 'grid', gap: 12 }}>
                {watchingAuctions.filter(a => (a.currentBid || a.startingBid || 0) >= 100000).slice(0, 3).map((auction) => (
                  <a key={auction._id} href={`/auctions/${auction._id}`} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12, 
                    padding: 12, 
                    background: 'linear-gradient(45deg, rgba(255,215,0,0.1), rgba(255,215,0,0.05))', 
                    borderRadius: 8, 
                    textDecoration: 'none',
                    color: 'inherit',
                    border: '1px solid rgba(255,215,0,0.2)'
                  }}>
                    <img 
                      src={auction.carListing?.media?.[0]?.url ? `https://beep-auctions-backend.onrender.com${auction.carListing.media[0].url}` : '/assets/images/handpicked-img-1.webp'}
                      alt={auction.carListing?.name}
                      style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: 14 }}>{auction.carListing?.name}</div>
                      <div style={{ fontSize: 12, color: '#ffd700' }}>
                        ${(auction.currentBid || auction.startingBid || 0).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--success)' }}>
                        {formatTimeRemaining(auction.endDate)}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Classic Cars */}
            <div className="panel glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Classic Auctions</h3>
                <span style={{ fontSize: 12, color: '#8e44ad' }}>Vintage</span>
              </div>
              
              <div style={{ display: 'grid', gap: 12 }}>
                {watchingAuctions.filter(a => a.carListing?.year && a.carListing.year < 1990).slice(0, 3).map((auction) => (
                  <a key={auction._id} href={`/auctions/${auction._id}`} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12, 
                    padding: 12, 
                    background: 'linear-gradient(45deg, rgba(142,68,173,0.1), rgba(142,68,173,0.05))', 
                    borderRadius: 8, 
                    textDecoration: 'none',
                    color: 'inherit',
                    border: '1px solid rgba(142,68,173,0.2)'
                  }}>
                    <img 
                      src={auction.carListing?.media?.[0]?.url ? `https://beep-auctions-backend.onrender.com${auction.carListing.media[0].url}` : '/assets/images/handpicked-img-1.webp'}
                      alt={auction.carListing?.name}
                      style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: 14 }}>{auction.carListing?.name}</div>
                      <div style={{ fontSize: 12, color: '#8e44ad' }}>
                        {auction.carListing?.year} • ${(auction.currentBid || auction.startingBid || 0).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--success)' }}>
                        {formatTimeRemaining(auction.endDate)}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserDashboard
