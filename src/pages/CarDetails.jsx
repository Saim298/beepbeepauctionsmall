import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../utils/Sidebar.jsx'
import '../pages/dashboard.css'

const apiBase = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const CarDetails = () => {
  const { id } = useParams()
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [car, setCar] = useState(null)
  const [comments, setComments] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)

  // Normalize relative upload paths to absolute URLs
  const toAbsUrl = (u) => {
    if (!u) return ''
    if (u.startsWith('http') || u.startsWith('data:')) return u
    return `${apiBase}${u}`
  }

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      fetch(`${apiBase}/api/cars/${id}`, { signal: controller.signal }).then(r => r.json()),
      fetch(`${apiBase}/api/cars/${id}/comments`, { signal: controller.signal }).then(r => r.json()),
      fetch(`${apiBase}/api/cars/${id}/reviews`, { signal: controller.signal }).then(r => r.json()),
    ]).then(([carData, commentsData, reviewsData]) => {
      setCar(carData)
      setComments(Array.isArray(commentsData) ? commentsData : [])
      setReviews(Array.isArray(reviewsData) ? reviewsData : [])
      setLoading(false)
    }).catch(() => { setError('Failed to load'); setLoading(false) })
    return () => controller.abort()
  }, [id])

  if (loading) return <div className="dashboard-root" data-theme={theme}><Sidebar /><main className="dashboard-main"><div className="dashboard-container"><div className="panel glass" style={{ padding: 24 }}>Loading…</div></div></main></div>
  if (error) return <div className="dashboard-root" data-theme={theme}><Sidebar /><main className="dashboard-main"><div className="dashboard-container"><div className="panel glass" style={{ padding: 24 }}>{error}</div></div></main></div>

  return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">{car.name}</h1>
              <span className="page-subtitle">{car.year} • {car.make?.name} • {car.model?.name}</span>
            </div>
            <div className="topbar-right">
              <button className="pill" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
            </div>
          </header>

          <section className="panel glass" style={{ padding: 16 }}>
            <div className="d-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <div>
                {/* Main media viewer */}
                <div className="thumb-xl" style={{ borderRadius: 16, overflow: 'hidden', maxHeight: 520 }}>
                  {(() => {
                    const media = (car.media?.length ? car.media : [{ url: '/assets/images/handpicked-img-1.webp', type: 'image' }])
                    const m = media[Math.min(activeIdx, media.length - 1)]
                    return m?.type === 'video' ? (
                      <video src={m.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={toAbsUrl(m.url)} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )
                  })()}
                </div>
                {/* Thumbnails */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto' }}>
                  {(car.media?.length ? car.media : [{ url: '/assets/images/handpicked-img-1.webp', type: 'image' }]).map((m, i) => (
                    <button key={i} className={`thumb sm ${activeIdx === i ? 'active' : ''}`} onClick={() => setActiveIdx(i)} style={{ width: 116, height: 74, borderRadius: 12, overflow: 'hidden', border: activeIdx === i ? '2px solid var(--primary)' : '1px solid var(--glass-300)' }}>
                      {m.type === 'video' ? (
                        <video src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <img src={toAbsUrl(m.url)} alt={`${car.name}-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <h3 style={{ marginBottom: 8 }}>About this car</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {car.era && (
                      <div style={{ padding: '10px 14px', borderRadius: 22, border: '1px solid var(--glass-300)', background: 'var(--glass-100)' }}>
                        <strong>Era:</strong> {car.era}
                      </div>
                    )}
                    {car.origin && (
                      <div style={{ padding: '10px 14px', borderRadius: 22, border: '1px solid var(--glass-300)', background: 'var(--glass-100)' }}>
                        <strong>Origin:</strong> {car.origin}
                      </div>
                    )}
                    {car.location && (
                      <div style={{ padding: '10px 14px', borderRadius: 22, border: '1px solid var(--glass-300)', background: 'var(--glass-100)' }}>
                        <strong>Location:</strong> {car.location}
                      </div>
                    )}
                    {Array.isArray(car.categories) && car.categories.map((c) => (
                      <div key={c._id || c} style={{ padding: '10px 14px', borderRadius: 22, border: '1px solid var(--glass-300)' }}>
                        {c.name || c}
                      </div>
                    ))}
                  </div>
                  <div className="prose" style={{ marginTop: 12 }} dangerouslySetInnerHTML={{ __html: car.descriptionHtml || '<p>No description.</p>' }} />
                </div>
              </div>

              <aside>
                <div className="panel soft" style={{ padding: 16, borderRadius: 12 }}>
                  <div className="d-grid" style={{ gridTemplateColumns: '1fr', gap: 8 }}>
                    <div>
                      <span className="muted">Price</span>
                      <h2 style={{ margin: 0 }}>${car.price?.toLocaleString()}</h2>
                    </div>
                    <div>
                      <span className="muted">Owner</span>
                      <div className="d-center" style={{ gap: 8, justifyContent: 'flex-start' }}>
                        <div className="avatar sm"><img src={car.owner?.avatarFile ? toAbsUrl(car.owner.avatarFile) : '/assets/images/user-img-1.webp'} alt="owner" /></div>
                        <strong>{car.owner?.name || 'Unknown'}</strong>
                        <span className="pill soft">{car.owner?.role || 'user'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <section className="panel glass mt-3" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Comments</h3>
            {comments.length === 0 ? (
              <p className="muted">No comments yet.</p>
            ) : (
              <div className="d-grid" style={{ gap: 12 }}>
                {comments.map((c) => (
                  <div key={c._id} className="panel soft" style={{ padding: 12, borderRadius: 12 }}>
                    <div className="d-center" style={{ gap: 8, justifyContent: 'flex-start' }}>
                      <div className="avatar sm"><img src={c.user?.avatarUrl || '/assets/images/user-img-1.webp'} alt="user" /></div>
                      <strong>{c.user?.name || 'User'}</strong>
                      <span className="muted">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    {c.imageUrl ? (
                      <div className="thumb-xl mt-2" style={{ maxWidth: 360 }}>
                        <img src={toAbsUrl(c.imageUrl)} alt="comment attachment" style={{ width: '100%', borderRadius: 10 }} />
                      </div>
                    ) : null}
                    {c.text ? <p style={{ marginTop: 8 }}>{c.text}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="panel glass mt-3" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Buyer Reviews</h3>
            {reviews.length === 0 ? (
              <p className="muted">No reviews yet.</p>
            ) : (
              <div className="d-grid" style={{ gap: 12 }}>
                {reviews.map((c) => (
                  <div key={c._id} className="panel soft" style={{ padding: 12, borderRadius: 12 }}>
                    <div className="d-center" style={{ gap: 8, justifyContent: 'flex-start' }}>
                      <div className="avatar sm"><img src={c.user?.avatarUrl || '/assets/images/user-img-1.webp'} alt="user" /></div>
                      <strong>{c.user?.name || 'User'}</strong>
                      {c.rating ? <span className="pill soft">{c.rating}★</span> : null}
                      <span className="pill" style={{ background: 'var(--green-500)' }}>Verified Buyer</span>
                      <span className="muted">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    {c.imageUrl ? (
                      <div className="thumb-xl mt-2" style={{ maxWidth: 360 }}>
                        <img src={toAbsUrl(c.imageUrl)} alt="review" style={{ width: '100%', borderRadius: 10 }} />
                      </div>
                    ) : null}
                    {c.text ? <p style={{ marginTop: 8 }}>{c.text}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default CarDetails


