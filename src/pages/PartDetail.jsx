import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMessageSquare, FiShoppingCart, FiHeart, FiShare2, FiMapPin, FiClock, FiPackage, FiTool, FiShield, FiTruck } from 'react-icons/fi'
import Sidebar from '../utils/Sidebar.jsx'
import { getAuthToken } from '../api/client.js'
import './dashboard.css'

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'

const PartDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark')
  const [part, setPart] = useState(null)
  const [similarParts, setSimilarParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => { localStorage.setItem('beep-theme', theme) }, [theme])

  useEffect(() => {
    fetchPartDetails()
    fetchCurrentUser()
  }, [id])

  const fetchCurrentUser = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  const fetchPartDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API}/api/parts/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        setPart(data.part)
        setSimilarParts(data.similarParts || [])
      } else {
        navigate('/parts')
      }
    } catch (error) {
      console.error('Error fetching part details:', error)
      navigate('/parts')
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = async () => {
    if (!currentUser) {
      navigate('/signin')
      return
    }

    setBuying(true)
    
    try {
      // For now, just console log the purchase details
      console.log('🛒 Purchase initiated:', {
        partId: part._id,
        partName: part.name,
        price: part.price,
        sellerId: part.seller._id,
        buyerId: currentUser.id,
        quantity: 1
      })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert(`Purchase simulated! 🎉\n\nPart: ${part.name}\nPrice: $${part.price}\nSeller: ${part.seller.username}\n\nThis would integrate with your payment system.`)
      
      // In a real implementation, you would:
      // 1. Create an order record
      // 2. Process payment
      // 3. Update inventory
      // 4. Send notifications
      
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setBuying(false)
    }
  }

  const handleChatWithSeller = () => {
    if (!currentUser) {
      navigate('/signin')
      return
    }

    // Navigate to chat with part context
    navigate('/chat', {
      state: {
        partId: part._id,
        partName: part.name,
        partPrice: part.price,
        partImage: part.media?.[0]?.url ? `${API}${part.media[0].url}` : '/assets/images/handpicked-img-1.webp',
        vendorId: part.seller._id,
        vendorName: part.seller.username
      }
    })
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

  if (loading) {
    return (
      <div className="dashboard-root" data-theme={theme}>
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading part details...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!part) {
    return (
      <div className="dashboard-root" data-theme={theme}>
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-container" style={{ textAlign: 'center', padding: '50px' }}>
            <h3>Part not found</h3>
            <button className="pill primary" onClick={() => navigate('/parts')}>
              Back to Parts
            </button>
          </div>
        </main>
      </div>
    )
  }

  const conditionBadge = getConditionBadge(part.condition)
  const isOwnPart = currentUser && part.seller._id === currentUser.id

  return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header */}
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <button className="pill ghost" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Back
              </button>
              <div>
                <h1 className="page-title">{part.name}</h1>
                <span className="page-subtitle">
                  {part.brand && `${part.brand} • `}
                  Part #{part.partNumber || 'N/A'}
                </span>
              </div>
            </div>
            <div className="topbar-right">
              <button className="pill ghost">
                <FiShare2 /> Share
              </button>
              <button className="pill ghost">
                <FiHeart /> Save
              </button>
            </div>
          </header>

          <div className="row" style={{ gap: '24px' }}>
            {/* Left Column - Images */}
            <div className="col-md-6">
              <div className="panel glass" style={{ padding: '16px' }}>
                {/* Main Image */}
                <div className="main-image" style={{ 
                  height: '400px', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  marginBottom: '16px',
                  position: 'relative'
                }}>
                  <img 
                    src={part.media?.[selectedImageIndex]?.url ? `${API}${part.media[selectedImageIndex].url}` : '/assets/images/handpicked-img-1.webp'}
                    alt={part.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {/* Condition Badge */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span className={conditionBadge.class}>{conditionBadge.text}</span>
                  </div>
                  
                  {/* OEM Badge */}
                  {part.oem && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <span className="badge bg-warning text-dark">OEM</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {part.media && part.media.length > 1 && (
                  <div className="thumbnail-images" style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    overflowX: 'auto',
                    padding: '4px'
                  }}>
                    {part.media.map((media, index) => (
                      <img
                        key={index}
                        src={`${API}${media.url}`}
                        alt={`${part.name} ${index + 1}`}
                        style={{
                          width: '80px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: selectedImageIndex === index ? '2px solid var(--primary-500)' : '1px solid var(--glass-300)',
                          opacity: selectedImageIndex === index ? 1 : 0.7
                        }}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="col-md-6">
              <div className="panel glass" style={{ padding: '24px' }}>
                {/* Price and Stock */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <h2 style={{ margin: 0, color: 'var(--primary-500)', fontSize: '28px', fontWeight: '700' }}>
                      ${part.price?.toLocaleString()}
                    </h2>
                    <span className="badge bg-success" style={{ fontSize: '12px' }}>
                      <FiPackage style={{ marginRight: '4px' }} />
                      {part.quantity} in stock
                    </span>
                  </div>
                  
                  {/* Quick Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '16px' }}>
                    <div className="stat-item" style={{ textAlign: 'center', padding: '8px', background: 'var(--glass-100)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Category</div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{part.category?.replace('_', ' ')}</div>
                    </div>
                    <div className="stat-item" style={{ textAlign: 'center', padding: '8px', background: 'var(--glass-100)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Views</div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{part.views || 0}</div>
                    </div>
                    <div className="stat-item" style={{ textAlign: 'center', padding: '8px', background: 'var(--glass-100)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Warranty</div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{part.warranty ? part.warranty.replace('_', ' ') : 'None'}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isOwnPart && (
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <button 
                      className="pill primary"
                      style={{ flex: 1, padding: '12px 24px', fontSize: '16px', fontWeight: '600' }}
                      onClick={handleBuyNow}
                      disabled={buying || part.quantity === 0}
                    >
                      {buying ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiShoppingCart style={{ marginRight: '8px' }} />
                          Buy Now
                        </>
                      )}
                    </button>
                    
                    <button 
                      className="pill"
                      style={{ padding: '12px 24px', fontSize: '16px', fontWeight: '600' }}
                      onClick={handleChatWithSeller}
                    >
                      <FiMessageSquare style={{ marginRight: '8px' }} />
                      Chat
                    </button>
                  </div>
                )}

                {isOwnPart && (
                  <div style={{ padding: '16px', background: 'var(--glass-100)', borderRadius: '8px', marginBottom: '24px' }}>
                    <p style={{ margin: 0, textAlign: 'center', color: 'var(--muted)' }}>
                      This is your listing
                    </p>
                  </div>
                )}

                {/* Seller Info */}
                <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--glass-100)', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Seller Information</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={part.seller.avatarUrl || '/assets/images/user-img-1.webp'}
                      alt={part.seller.username}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600' }}>{part.seller.username}</div>
                      {part.seller.location && (
                        <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                          <FiMapPin style={{ marginRight: '4px' }} />
                          {part.seller.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compatibility */}
                {part.compatibility && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Compatibility</h4>
                    <div style={{ padding: '12px', background: 'var(--glass-100)', borderRadius: '8px' }}>
                      {part.compatibility}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Specifications</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {part.material && (
                      <div className="spec-item">
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Material:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}> {part.material}</span>
                      </div>
                    )}
                    {part.color && (
                      <div className="spec-item">
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Color:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}> {part.color}</span>
                      </div>
                    )}
                    {part.weight && (
                      <div className="spec-item">
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Weight:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}> {part.weight} lbs</span>
                      </div>
                    )}
                    {part.dimensions && (
                      <div className="spec-item">
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Dimensions:</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}> {part.dimensions}</span>
                      </div>
                    )}
                    <div className="spec-item">
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Return Policy:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}> {part.returnPolicy?.replace('_', ' ') || 'No returns'}</span>
                    </div>
                    <div className="spec-item">
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Listed:</span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}> {new Date(part.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {part.descriptionHtml && (
            <div className="panel glass" style={{ padding: '24px', marginTop: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0' }}>Description</h3>
              <div 
                className="part-description"
                dangerouslySetInnerHTML={{ __html: part.descriptionHtml }}
                style={{ lineHeight: 1.6 }}
              />
            </div>
          )}

          {/* Similar Parts */}
          {similarParts.length > 0 && (
            <div className="panel glass" style={{ padding: '24px', marginTop: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0' }}>Similar Parts</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '16px' 
              }}>
                {similarParts.map((similarPart) => (
                  <div 
                    key={similarPart._id}
                    className="similar-part-card"
                    style={{ 
                      border: '1px solid var(--glass-300)', 
                      borderRadius: '8px', 
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onClick={() => navigate(`/parts/${similarPart._id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img 
                      src={similarPart.media?.[0]?.url ? `${API}${similarPart.media[0].url}` : '/assets/images/handpicked-img-1.webp'}
                      alt={similarPart.name}
                      style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '12px' }}>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{similarPart.name}</h5>
                      <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: 'var(--primary-500)' }}>
                        ${similarPart.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PartDetail
