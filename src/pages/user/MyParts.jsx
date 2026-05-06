import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardAppChrome, DashboardMenuButton } from '../../components/DashboardAppChrome.jsx'
import { getAuthToken } from '../../api/client.js'
import '../dashboard.css'

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const MyParts = () => {
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [parts, setParts] = useState([])  
  const limit = 12

  // Extract image URLs from descriptionHtml
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

  const isImageMedia = (m) => {
    if (!m?.url) return false
    if (m.type === 'image') return true
    if (m.type === 'video') return false
    return /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(m.url)
  }

  // Prefer image files for <img> — first item is often a video, which would break the thumbnail
  const getPartImageUrls = (part) => {
    if (part?.media?.length) {
      const fromMedia = part.media.filter(isImageMedia).map((m) => m.url).filter(Boolean)
      if (fromMedia.length) return fromMedia
    }
    return extractImagesFromHtml(part?.descriptionHtml || '') || []
  }

  // Normalize relative upload paths to absolute URLs (handles missing slash after API base)
  const toAbsUrl = (u) => {
    if (!u) return "/assets/images/handpicked-img-1.webp"
    if (u.startsWith("http") || u.startsWith("data:")) return u
    const base = (API || "").replace(/\/$/, "")
    const path = u.startsWith("/") ? u : `/${u}`
    return `${base}${path}`
  }

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])
  
  useEffect(() => {
    const controller = new AbortController()
    const token = getAuthToken()
    
    if (!token) {
      navigate('/signin')
      return
    }

    fetch(`${API}/api/my/parts?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}&sort=${encodeURIComponent(sort)}`, {
      headers: { Authorization: `Bearer ${token}` }, 
      signal: controller.signal
    })
      .then(r => r.json())
      .then((data) => { 
        if (data.parts) {
          setParts(data.parts || []); 
          setTotal(data.pagination?.totalParts || 0);
        } else {
          setParts([]);
          setTotal(0);
        }
      })
      .catch(() => {
        setParts([]);
        setTotal(0);
      })
    return () => controller.abort()
  }, [page, q, sort, navigate])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const activatePart = async (partId) => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${API}/api/my/parts/${partId}/activate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        alert('Part activated successfully!')
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Failed to activate part: ${error.error}`)
      }
    } catch (error) {
      alert('Error activating part')
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#198754'
      case 'inactive': return '#6c757d'
      case 'out_of_stock': return '#dc3545'
      case 'pending_approval': return '#fd7e14'
      case 'sold': return '#0d6efd'
      default: return '#198754'
    }
  }

  const getConditionBadge = (condition) => {
    const badges = {
      new: { class: 'badge bg-success', text: 'New' },
      used_excellent: { class: 'badge bg-primary', text: 'Used - Excellent' },
      used_good: { class: 'badge bg-info', text: 'Used - Good' },
      used_fair: { class: 'badge bg-warning text-dark', text: 'Used - Fair' },
      refurbished: { class: 'badge bg-secondary', text: 'Refurbished' },
      remanufactured: { class: 'badge bg-dark', text: 'Remanufactured' }
    };
    return badges[condition] || { class: 'badge bg-secondary', text: condition };
  }

  return (
    <DashboardAppChrome theme={theme}>
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <DashboardMenuButton />
              <h1 className="page-title">My Products</h1>
              <span className="page-subtitle">Manage your products listings</span>
            </div>
            <div className="topbar-right">
              <button className="pill" onClick={() => navigate('/user/parts/new')}>List New Product</button>
            </div>
          </header>

          <div className="panel glass dashboard-filters-panel" style={{ padding: 16, marginBottom: 12 }}>
            <div className="dashboard-filters-bar">
              <label className="sr-only" htmlFor="my-parts-search">Search my products</label>
              <input
                id="my-parts-search"
                type="search"
                className="dashboard-filters-input"
                placeholder="Search my products…"
                value={q}
                onChange={(e) => { setPage(1); setQ(e.target.value) }}
                autoComplete="off"
              />
              <div className="dashboard-filters-select-wrap">
                <label className="sr-only" htmlFor="my-parts-sort">Sort by</label>
                <select
                  id="my-parts-sort"
                  className="dashboard-filters-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="-price">Highest price</option>
                  <option value="price">Lowest price</option>
                  <option value="-quantity">Most stock</option>
                  <option value="quantity">Least stock</option>
                </select>
              </div>
            </div>
          </div>

          {parts.length === 0 ? (
            <section className="panel glass" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
                <div style={{ width: 120, height: 90, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--glass-300)' }}>
                  <img src="/assets/images/handpicked-img-1.webp" alt="Empty" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ margin: 0 }}>No products listed yet</h3>
                <p className="muted" style={{ margin: 0 }}>You haven't listed any products. Get started by listing your first product.</p>
                <div className="btn-row" style={{ marginTop: 8 }}>
                  <button className="pill primary" onClick={() => navigate('/user/parts/new')}>List your first product</button>
                </div>
              </div>
            </section>
          ) : (
            <>
              <div className="parts-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '20px',
                marginBottom: '20px'
              }}>
                {parts.map((part) => {
                  const conditionBadge = getConditionBadge(part.condition);
                  
                  return (
                    <div key={part._id} className="part-card panel glass" style={{ 
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                    onClick={() => navigate(`/parts/${part._id}`)}
                    >
                      <div className="part-image" style={{ 
                        height: '200px', 
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <img 
                          src={(() => {
                            const images = getPartImageUrls(part);
                            return images.length > 0 ? toAbsUrl(images[0]) : '/assets/images/handpicked-img-1.webp';
                          })()} 
                          alt={part.name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.src = '/assets/images/handpicked-img-1.webp';
                          }}
                        />
                        <div className="status-badge" style={{ 
                          position: 'absolute', 
                          top: 8, 
                          left: 8, 
                          background: getStatusColor(part.status), 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: 12, 
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {part.status?.toUpperCase() || 'ACTIVE'}
                        </div>
                        <div className="condition-badge" style={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8
                        }}>
                          <span className={conditionBadge.class}>{conditionBadge.text}</span>
                        </div>
                        {part.oem && (
                          <div className="oem-badge" style={{ 
                            position: 'absolute', 
                            bottom: 8, 
                            left: 8
                          }}>
                            <span className="badge bg-warning text-dark">OEM</span>
                          </div>
                        )}
                      </div>

                      <div className="card-body" style={{ padding: '16px' }}>
                        <div className="title-row" style={{ marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{part.name}</h4>
                          {part.brand && (
                            <span className="brand" style={{ 
                              fontSize: '12px', 
                              color: 'var(--muted)',
                              fontWeight: '500'
                            }}>{part.brand}</span>
                          )}
                        </div>
                        
                        <div className="metrics" style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr 1fr', 
                          gap: '12px',
                          marginBottom: '12px'
                        }}>
                          <div className="metric">
                            <span className="muted" style={{ fontSize: '11px' }}>Price</span>
                            <strong style={{ fontSize: '14px' }}>${part.price?.toLocaleString() || '0'}</strong>
                          </div>
                          <div className="metric">
                            <span className="muted" style={{ fontSize: '11px' }}>Stock</span>
                            <strong style={{ fontSize: '14px' }}>{part.quantity || 0}</strong>
                          </div>
                          <div className="metric">
                            <span className="muted" style={{ fontSize: '11px' }}>Views</span>
                            <strong style={{ fontSize: '14px' }}>{part.views || 0}</strong>
                          </div>
                        </div>

                        {part.compatibility && (
                          <div className="compatibility" style={{ 
                            marginBottom: '12px',
                            padding: '8px',
                            background: 'var(--glass-100)',
                            borderRadius: '6px'
                          }}>
                            <span className="muted" style={{ fontSize: '11px' }}>Compatible with</span>
                            <div style={{ fontSize: '12px', color: 'var(--text)' }}>
                              {part.compatibility}
                            </div>
                          </div>
                        )}

                        {part.partNumber && (
                          <div className="part-number" style={{ 
                            marginBottom: '12px',
                            fontSize: '11px', 
                            color: 'var(--muted)' 
                          }}>
                            Part #: {part.partNumber}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ 
                          display: 'flex', 
                          gap: '8px',
                          marginTop: '12px'
                        }}>
                          <button 
                            className="pill primary" 
                            style={{ flex: 1, fontSize: '12px', padding: '6px 12px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/parts/${part._id}`);
                            }}
                          >
                            View Details
                          </button>
                          
                          <button 
                            className="pill" 
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/user/parts/edit/${part._id}`);
                            }}
                          >
                            Edit
                          </button>
                          
                          {part.status === 'inactive' && (
                            <button 
                              className="pill success" 
                              style={{ 
                                background: '#198754', 
                                borderColor: '#198754', 
                                color: 'white',
                                fontSize: '12px', 
                                padding: '6px 12px'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                activatePart(part._id);
                              }}
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              <div className="btn-row" style={{ justifyContent: 'center', marginTop: 16 }}>
                <button className="pill" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                <span className="pill soft">Page {page} / {totalPages}</span>
                <button className="pill" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
              </div>
            </>
          )}
        </div>
      </main>
    </DashboardAppChrome>
  )
}

export default MyParts