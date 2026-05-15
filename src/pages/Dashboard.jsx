import React, { useEffect, useMemo, useState } from 'react'
import { DashboardAppChrome, DashboardMenuButton } from '../components/DashboardAppChrome.jsx'
import StatsCard from '../components/StatCard.jsx'
import GoalRadial from '../components/GoalRadial.jsx'
import TopAuctions from '../components/TopAuctions.jsx'
import '../pages/dashboard.css'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { apiRequest, getAuthToken } from '../api/client'

// Image extraction functions
const extractImagesFromHtml = (html) => {
  if (!html) return [];
  const imgRegex = /<img[^>]+src="([^"]+)"/g;
  const images = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }
  return images;
};

const getPartImages = (part) => {
  if (!part) return [];
  
  // First try to get images from media array
  if (part.media && part.media.length > 0) {
    return part.media.map(media => media.url);
  }
  
  // If no media, try to extract from descriptionHtml
  if (part.descriptionHtml) {
    return extractImagesFromHtml(part.descriptionHtml);
  }
  
  return [];
};

const toAbsUrl = (url) => {
  if (!url) return "/assets/images/handpicked-img-1.webp";
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'}${url}`;
};

const DEFAULT_STATS = {
  totalParts: { value: '0', diff: '0%', trend: 'up' },
  activeOrders: { value: '0', diff: '0%', trend: 'up' },
  partsSold: { value: '0', diff: '0%', trend: 'up' },
  revenue: { value: '$0', diff: '0%', trend: 'up' },
};

const DEFAULT_GOALS = {
  orderFulfillment: { label: 'Order Fulfillment', value: 0, color: 'var(--primary-500)' },
  customerRating: { label: 'Customer Rating', value: 0, color: 'var(--accent-500)' },
  inventoryLevel: { label: 'Inventory Level', value: 0, color: '#22c55e' },
};

const mergeStats = (incoming = {}) => ({
  totalParts: { ...DEFAULT_STATS.totalParts, ...(incoming.totalParts || {}) },
  activeOrders: { ...DEFAULT_STATS.activeOrders, ...(incoming.activeOrders || {}) },
  partsSold: { ...DEFAULT_STATS.partsSold, ...(incoming.partsSold || {}) },
  revenue: { ...DEFAULT_STATS.revenue, ...(incoming.revenue || {}) },
});

const mergeGoals = (incoming = {}) => ({
  orderFulfillment: { ...DEFAULT_GOALS.orderFulfillment, ...(incoming.orderFulfillment || {}) },
  customerRating: { ...DEFAULT_GOALS.customerRating, ...(incoming.customerRating || {}) },
  inventoryLevel: { ...DEFAULT_GOALS.inventoryLevel, ...(incoming.inventoryLevel || {}) },
});

// Custom Topproducts component for dashboard
const Topproducts = ({ products }) => {
  console.log('Topproducts received parts:', products)
  
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
        No products sold yet. Start listing products to see your top performers!
      </div>
    )
  }

  return (
    <div className="top-parts-list">
      {products.map((part, index) => (
          <div key={products._id} className="part-item" style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid var(--glass-200)',
          gap: '1rem'
        }}>
          <div className="part-rank" style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            background: 'var(--primary-500)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            {index + 1}
          </div>
          <div className="part-image" style={{ width: '3rem', height: '3rem' }}>
            {getPartImages(products).length > 0 ? (
              <img 
                src={toAbsUrl(getPartImages(products)[0])} 
                alt={products.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  borderRadius: '0.5rem' 
                }}
                onError={(e) => {
                  e.target.src = "/assets/images/handpicked-img-1.webp";
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'var(--glass-200)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--muted)',
                fontSize: '0.8rem'
              }}>
                No Image
              </div>
            )}
          </div>
          <div className="part-info" style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
              {products.name}
            </h4>
            <p style={{ margin: '0.25rem 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
              {products.brand}
            </p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
              <span>Sold: {products.totalSold}</span>
              <span>Revenue: ${part.totalRevenue.toLocaleString()}</span>
            </div>
          </div>
          <div className="part-price" style={{ 
            fontSize: '1.1rem', 
            fontWeight: '600', 
            color: 'var(--primary-500)' 
          }}>
            ${products.price.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}

const Dashboard = () => {
  const [theme, setTheme] = useState('dark')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [performanceData, setPerformanceData] = useState([])
  const [goals, setGoals] = useState(DEFAULT_GOALS)
  const [topParts, setTopParts] = useState([])

  useEffect(() => {
    // Optional: remember theme
    const saved = localStorage.getItem('beep-theme')
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('beep-theme', theme)
  }, [theme])

  useEffect(() => {
    const load = async () => {
      try {
        const token = getAuthToken()
        if (!token) return
        
        // Load user info
        const { user } = await apiRequest('/api/auth/me', { token })
        if (user && user.avatarUrl) setAvatarUrl(user.avatarUrl)

        // Load dashboard data
        await loadDashboardData(token)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const loadDashboardData = async (token) => {
    const statsReq = apiRequest('/api/dashboard/stats', { token })
      .then((res) => {
        if (res?.success) setStats(mergeStats(res.stats))
      })
      .catch((error) => {
        console.error('Dashboard stats endpoint failed:', error)
      })

    const performanceReq = apiRequest('/api/dashboard/performance', { token })
      .then((res) => {
        if (res?.success && Array.isArray(res.performanceData)) {
          setPerformanceData(res.performanceData)
        }
      })
      .catch((error) => {
        console.error('Dashboard performance endpoint failed:', error)
      })

    const goalsReq = apiRequest('/api/dashboard/goals', { token })
      .then((res) => {
        if (res?.success) setGoals(mergeGoals(res.goals))
      })
      .catch((error) => {
        console.error('Dashboard goals endpoint failed:', error)
      })

    const topPartsReq = apiRequest('/api/dashboard/top-parts?limit=5', { token })
      .then((res) => {
        if (res?.success && Array.isArray(res.topParts)) {
          setTopParts(res.topParts)
        }
      })
      .catch((error) => {
        // Not fatal: some backends may not expose top-parts yet.
        console.warn('Dashboard top-parts endpoint unavailable:', error?.message || error)
      })

    await Promise.all([statsReq, performanceReq, goalsReq, topPartsReq])
  }

  if (loading) {
    return (
      <DashboardAppChrome theme={theme}>
        <main className="dashboard-main">
          <div className="dashboard-container">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '50vh',
              fontSize: '1.2rem',
              color: 'var(--muted)'
            }}>
              Loading dashboard...
            </div>
          </div>
        </main>
      </DashboardAppChrome>
    )
  }

  return (
    <DashboardAppChrome theme={theme}>
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <DashboardMenuButton />
              <h1 className="page-title">Dashboard</h1>
              <span className="page-subtitle">Welcome back, let's sell some products today</span>
            </div>
            <div className="topbar-right">
              <div className="searchbox">
                <input placeholder="Search parts, brands, vendors…" />
                <span className="kbd">/</span>
              </div>
              <button className="pill ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
             
              <div className="avatar dropdown-host">
                <input id="avatar-toggle" type="checkbox" />
                <label htmlFor="avatar-toggle">
                  <img src={avatarUrl || "/assets/images/user-img-1.webp"} alt="User" />
                </label>
                <div className="avatar-dropdown panel glass">
                  <a href="#">Profile</a>
                  <a href="#">Settings</a>
                  <a href="#">My Parts</a>
                  <button>Logout</button>
                </div>
              </div>
            </div>
          </header>

          <section className="grid stats-grid">
            <StatsCard 
              title="Total products Listed" 
              value={stats.totalParts.value} 
              diff={stats.totalParts.diff} 
              trend={stats.totalParts.trend} 
              data={[12,14,13,16,18,22,21,24,26,30]} 
            />
            <StatsCard 
              title="Active Orders" 
              value={stats.activeOrders.value} 
              diff={stats.activeOrders.diff} 
              trend={stats.activeOrders.trend} 
              data={[6,8,7,9,10,9,11,12,13,12]} 
            />
            <StatsCard 
              title="products Sold" 
              value={stats.partsSold.value} 
              diff={stats.partsSold.diff} 
              trend={stats.partsSold.trend} 
              data={[9,8,7,8,9,10,9,8,9,8]} 
            />
            <StatsCard 
              title="Revenue" 
              value={stats.revenue.value} 
              diff={stats.revenue.diff} 
              trend={stats.revenue.trend} 
              currency 
              data={[8,9,11,13,12,15,17,18,19,21]} 
            />
          </section>

          <section className="grid content-grid mt-4">
            <div className="panel glass stretch">
              <div className="panel-header">
                <h3>Performance</h3>
                <div className="legend">
                  <span className="dot primary"></span> Orders
                  <span className="dot accent"></span> products Listed
                </div>
              </div>
              <div className="panel-body">
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <AreaChart data={performanceData} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary-500)" stopOpacity={0.7} />
                          <stop offset="100%" stopColor="var(--primary-500)" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorParts" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent-500)" stopOpacity={0.7} />
                          <stop offset="100%" stopColor="var(--accent-500)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--glass-200)" strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="var(--muted)" />
                      <YAxis stroke="var(--muted)" />
                      <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--glass-300)', color: 'var(--text)' }} />
                      <Area type="monotone" dataKey="orders" stroke="var(--primary-500)" fill="url(#colorOrders)" strokeWidth={2} />
                      <Area type="monotone" dataKey="parts" stroke="var(--accent-500)" fill="url(#colorParts)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="panel glass">
              <div className="panel-header space-between">
                <h3>Goals</h3>
                <span className="muted">This month</span>
              </div>
              <div className="goals">
                <GoalRadial 
                  label={goals.orderFulfillment.label} 
                  value={goals.orderFulfillment.value} 
                  color={goals.orderFulfillment.color} 
                />
                <GoalRadial 
                  label={goals.customerRating.label} 
                  value={goals.customerRating.value} 
                  color={goals.customerRating.color} 
                />
                <GoalRadial 
                  label={goals.inventoryLevel.label} 
                  value={goals.inventoryLevel.value} 
                  color={goals.inventoryLevel.color} 
                />
              </div>
            </div>

            <div className="panel glass stretch full-span">
              <div className="panel-header space-between">
                <h3>Top Selling Parts</h3>
                <a className="link" href="/user/parts">View all</a>
              </div>
              <Topproducts parts={topParts} />
            </div>
          </section>
        </div>
      </main>
    </DashboardAppChrome>
  )
}

export default Dashboard