import React, { useEffect, useMemo, useState } from 'react'
import AdminSidebar from './Sidebar.jsx'
import '../../pages/dashboard.css'

const apiBase = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const Listings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [view, setView] = useState('grid')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [cars, setCars] = useState([])

  const limit = 10

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${apiBase}/api/cars?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}&sort=${encodeURIComponent(sort)}`, { signal: controller.signal })
      .then(r => r.json())
      .then(({ data, total: t }) => { setCars(data || []); setTotal(t || 0) })
      .catch(() => {})
    return () => controller.abort()
  }, [page, q, sort])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="dashboard-root" data-theme={theme}>
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">Listings</h1>
              <span className="page-subtitle">Manage marketplace inventory</span>
            </div>
            <div className="topbar-right">
              <button className="pill" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
              <a className="pill" href="/admin/listings/new">Add Car</a>
            </div>
          </header>

          <div className="panel glass" style={{ padding: 16, marginBottom: 12 }}>
            <div className="inline-row" style={{ gridTemplateColumns: '1fr 220px 160px' }}>
              <input className="search" placeholder="Search cars…" value={q} onChange={(e) => { setPage(1); setQ(e.target.value) }} />
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="-createdAt">Newest</option>
                <option value="createdAt">Oldest</option>
                <option value="-price">Price high</option>
                <option value="price">Price low</option>
              </select>
              <div className="btn-row">
                <button className={`pill ${view === 'grid' ? 'primary' : ''}`} onClick={() => setView('grid')}>Grid</button>
                <button className={`pill ${view === 'table' ? 'primary' : ''}`} onClick={() => setView('table')}>Table</button>
              </div>
            </div>
          </div>

          {view === 'grid' ? (
            <div className="auctions-grid">
              {cars.map((c) => (
                <a key={c._id} className="auction-card panel glass" href={`/cars/${c._id}`}>
                  <div className="thumb-xl"><img src={c.media?.[0]?.url || '/assets/images/handpicked-img-1.webp'} alt={c.name} /></div>
                  <div className="card-body">
                    <div className="title-row"><h4>{c.name}</h4><span className="year">{c.year}</span></div>
                    <div className="metrics"><div className="metric"><span className="muted">Price</span><strong>${c.price?.toLocaleString()}</strong></div><div className="metric"><span className="muted">Make</span><strong>{c.make?.name}</strong></div><div className="metric"><span className="muted">Model</span><strong>{c.model?.name}</strong></div><div className="metric"><span className="muted">Owner</span><strong>{c.owner?.name || '—'}</strong></div></div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="panel glass">
              <div className="panel-body" style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr><th>Name</th><th>Year</th><th>Make</th><th>Model</th><th>Price</th></tr>
                  </thead>
                  <tbody>
                    {cars.map((c) => (
                      <tr key={c._id}>
                        <td><a href={`/admin/listings/${c._id}`}>{c.name}</a></td>
                        <td>{c.year}</td>
                        <td>{c.make?.name}</td>
                        <td>{c.model?.name}</td>
                        <td>${c.price?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 16 }}>
            <button className="pill" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            <span className="pill soft">Page {page} / {totalPages}</span>
            <button className="pill" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Listings


