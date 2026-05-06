import React, { useEffect, useState } from 'react'
import { DashboardAppChrome, DashboardMenuButton } from '../../components/DashboardAppChrome.jsx'
import '../../pages/dashboard.css'

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const MyListings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [cars, setCars] = useState([])
  const limit = 10

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])
  useEffect(() => {
    const controller = new AbortController()
    const token = localStorage.getItem('auth_token')
    fetch(`${API}/api/my/cars?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}&sort=${encodeURIComponent(sort)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}, signal: controller.signal
    })
      .then(r => r.json())
      .then(({ data, total: t }) => { setCars(data || []); setTotal(t || 0) })
      .catch(() => {})
    return () => controller.abort()
  }, [page, q, sort])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <DashboardAppChrome theme={theme}>
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <DashboardMenuButton />
              <h1 className="page-title">My Listings</h1>
              <span className="page-subtitle">Manage your cars</span>
            </div>
            <div className="topbar-right">
              <a className="pill" href="/user/listings/new">Add Car</a>
            </div>
          </header>

          <div className="panel glass dashboard-filters-panel" style={{ padding: 16, marginBottom: 12 }}>
            <div className="dashboard-filters-bar">
              <label className="sr-only" htmlFor="my-listings-search">Search my cars</label>
              <input
                id="my-listings-search"
                type="search"
                className="dashboard-filters-input"
                placeholder="Search my cars…"
                value={q}
                onChange={(e) => { setPage(1); setQ(e.target.value) }}
                autoComplete="off"
              />
              <div className="dashboard-filters-select-wrap">
                <label className="sr-only" htmlFor="my-listings-sort">Sort by</label>
                <select
                  id="my-listings-sort"
                  className="dashboard-filters-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="-price">Price high</option>
                  <option value="price">Price low</option>
                </select>
              </div>
            </div>
          </div>

          {cars.length === 0 ? (
            <section className="panel glass" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
                <div style={{ width: 120, height: 90, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--glass-300)' }}>
                  <img src="/assets/images/handpicked-img-1.webp" alt="Empty" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ margin: 0 }}>No cars yet</h3>
                <p className="muted" style={{ margin: 0 }}>You haven’t added any listings. Get started by adding your first car.</p>
                <div className="btn-row" style={{ marginTop: 8 }}>
                  <a className="pill primary" href="/user/listings/new">Add your first car</a>
                </div>
              </div>
            </section>
          ) : (
            <div className="auctions-grid">
              {cars.map((c) => (
                <a key={c._id} className="auction-card panel glass" href={`/cars/${c._id}`}>
                  <div className="thumb-xl"><img src={`https://beep-auctions-backend.onrender.com${c.media?.[0]?.url}` || '/assets/images/handpicked-img-1.webp'} alt={c.name} /></div>
                  <div className="card-body">
                    <div className="title-row"><h4>{c.name}</h4><span className="year">{c.year}</span></div>
                    <div className="metrics"><div className="metric"><span className="muted">Price</span><strong>${c.price?.toLocaleString()}</strong></div><div className="metric"><span className="muted">Make</span><strong>{c.make?.name}</strong></div><div className="metric"><span className="muted">Model</span><strong>{c.model?.name}</strong></div></div>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 16 }}>
            <button className="pill" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            <span className="pill soft">Page {page} / {totalPages}</span>
            <button className="pill" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>
      </main>
    </DashboardAppChrome>
  )
}

export default MyListings


