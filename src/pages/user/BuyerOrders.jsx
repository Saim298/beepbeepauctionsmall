import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import { FiPackage, FiTruck, FiCheck, FiEye, FiStar, FiClock, FiMapPin, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Sidebar from '../../utils/Sidebar.jsx';
import '../dashboard.css';
import StarRating from '../../components/StarRating';

const BuyerOrders = () => {
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    comment: '',
    qualityRating: 5,
    shippingRating: 5,
    valueRating: 5
  });

  useEffect(() => { localStorage.setItem('beep-theme', theme); }, [theme]);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await apiRequest(`/api/orders/buyer${params}`, {
        method: 'GET'
      });

      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReceived = async (orderId) => {
    try {
      const response = await apiRequest(`/api/orders/${orderId}/received`, {
        method: 'PUT'
      });

      if (response.success) {
        fetchOrders();
        alert('Order marked as received! You can now leave a review.');
      }
    } catch (error) {
      console.error('Error marking order as received:', error);
      alert('Failed to mark order as received');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'success',
      delivered: 'success',
      completed: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FiClock />,
      confirmed: <FiCheck />,
      processing: <FiPackage />,
      shipped: <FiTruck />,
      delivered: <FiCheck />,
      completed: <FiCheck />
    };
    return icons[status] || <FiPackage />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toAbsUrl = (u) => {
    if (!u) return '/assets/images/handpicked-img-1.webp';
    if (u.startsWith('http') || u.startsWith('data:')) return u;
    return `${import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'}${u}`;
  };

  // Extract images from HTML description
  const extractImagesFromHtml = (htmlString) => {
    if (!htmlString) return [];
    const imgRegex = /<img[^>]+src="([^"]+)"/gi;
    const matches = [];
    let match;
    while ((match = imgRegex.exec(htmlString)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };

  // Get part images (from media array or extracted from descriptionHtml)
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

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const openReviewModal = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setReviewData({
      rating: 5,
      title: '',
      comment: '',
      qualityRating: 5,
      shippingRating: 5,
      valueRating: 5
    });
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      // Validate required data
      if (!selectedItem?.part?._id) {
        alert('Error: Part information is missing');
        return;
      }
      
      if (!selectedOrder?._id) {
        alert('Error: Order information is missing');
        return;
      }

      // Create FormData for the review submission
      const formData = new FormData();
      formData.append('partId', selectedItem.part._id);
      formData.append('purchaseId', selectedOrder._id);
      formData.append('rating', reviewData.rating.toString());
      formData.append('title', reviewData.title);
      formData.append('comment', reviewData.comment);
      formData.append('qualityRating', reviewData.qualityRating.toString());
      formData.append('shippingRating', reviewData.shippingRating.toString());
      formData.append('valueRating', reviewData.valueRating.toString());

      // Debug: Log the data being sent
      console.log('Submitting review with data:', {
        partId: selectedItem.part._id,
        purchaseId: selectedOrder._id,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment
      });

      // Get auth token
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        alert('Error: You must be logged in to submit a review');
        return;
      }
      
      // Make the request directly with fetch to handle FormData properly
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com'}/api/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - let browser set it with boundary
        },
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      console.log('Review submission response:', data);

      if (response.ok && data.message) {
        alert('Review submitted successfully!');
        setShowReviewModal(false);
        fetchOrders(); // Refresh orders to update review status
      } else {
        const errorMessage = data.error || data.details || 'Failed to submit review';
        alert(`Error: ${errorMessage}`);
        console.error('Review submission failed:', data);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-root" data-theme={theme}>
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--glass-300)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p>Loading orders...</p>
            </div>
        </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-root" data-theme={theme}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <h1 className="page-title">My Orders</h1>
              <span className="page-subtitle">Track your purchase orders and deliveries</span>
            </div>
            <div className="topbar-right">
        <select
                className="pill"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
        </select>
              <button className="pill" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? "Light" : "Dark"}
              </button>
      </div>
          </header>

      {/* Orders List */}
      {orders.length === 0 ? (
            <section className="panel glass" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
                <div style={{ width: 120, height: 90, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--glass-300)' }}>
                  <FiPackage size={48} style={{ width: '100%', height: '100%', objectFit: 'cover', color: 'var(--muted)', padding: '20px' }} />
                </div>
                <h3 style={{ margin: 0 }}>No orders found</h3>
                <p className="muted" style={{ margin: 0 }}>You haven't placed any orders yet.</p>
                <div className="btn-row" style={{ marginTop: 8 }}>
                  <Link to="/parts" className="pill primary">Browse Parts</Link>
                </div>
        </div>
            </section>
      ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
          {orders.map((order) => (
                <div key={order._id}>
                  <div className="panel glass" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                    <div>
                        <h6 style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>
                        Order #{order.orderNumber}
                      </h6>
                        <small className="muted">
                        Placed on {formatDate(order.createdAt)}
                      </small>
                    </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`pill d-inline-flex align-items-center gap-1`} style={{ 
                          background: `var(--${getStatusColor(order.status)}-500)`, 
                          color: 'white',
                          marginBottom: 8 
                        }}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                        <div style={{ fontWeight: 'bold' }}>
                        ${order.totalAmount}
                        </div>
                    </div>
                  </div>

                  {/* Order Items */}
                    <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
                    {order.items.map((item, index) => (
                        <div key={index}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--glass-100)', borderRadius: 8 }}>
                          <img
                            src={toAbsUrl(getPartImages(item.part)[0])}
                            alt={item.part?.name}
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 8 }}
                            onError={(e) => {
                              e.target.src = '/assets/images/handpicked-img-1.webp';
                            }}
                          />
                            <div style={{ flex: 1 }}>
                              <h6 style={{ margin: '0 0 4px 0' }}>{item.part?.name}</h6>
                              <p className="muted" style={{ margin: '0 0 4px 0', fontSize: '12px' }}>
                              Brand: {item.part?.brand} | Seller: {item.seller?.username}
                            </p>
                              <p className="muted" style={{ margin: 0, fontSize: '12px' }}>
                              Qty: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                          
                            {/* Review Button - Only show if order is completed and can be reviewed */}
                            {order.status === 'completed' && order.reviewEligible && !order.reviewSubmitted && (
                              <button
                                onClick={() => openReviewModal(order, item)}
                                className="pill"
                                style={{ background: 'var(--warning)', color: 'white', fontSize: '12px', padding: '6px 12px' }}
                              >
                                <FiStar style={{ marginRight: 4 }} />
                              Review
                              </button>
                            )}
                            {order.status === 'completed' && order.reviewSubmitted && (
                              <span className="pill" style={{ background: 'var(--success)', color: 'white', fontSize: '12px', padding: '6px 12px' }}>
                                <FiCheck style={{ marginRight: 4 }} />
                                Reviewed
                              </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Info */}
                  {order.tracking?.trackingNumber && (
                      <div style={{ padding: 12, background: 'var(--info)', color: 'white', borderRadius: 8, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiTruck />
                        <strong>Tracking:</strong> {order.tracking.trackingNumber}
                        {order.tracking.carrier && (
                            <span className="pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px' }}>
                            {order.tracking.carrier.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                        className="pill"
                      onClick={() => viewOrderDetails(order)}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                        <FiEye style={{ marginRight: 4 }} />
                      View Details
                    </button>
                    
                    {order.status === 'shipped' && (
                      <button
                          className="pill"
                        onClick={() => handleMarkReceived(order._id)}
                          style={{ background: 'var(--success)', color: 'white', fontSize: '12px', padding: '6px 12px' }}
                      >
                          <FiCheck style={{ marginRight: 4 }} />
                        Mark as Received
                      </button>
                    )}
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Review Modal */}
      {showReviewModal && selectedOrder && selectedItem && (
        <div 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowReviewModal(false);
            }
          }}
        >
          <div 
            style={{
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              border: '1px solid var(--glass-300)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ 
              padding: '20px', 
              borderBottom: '1px solid var(--glass-300)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h5 style={{ margin: 0, color: 'var(--text)' }}>Write a Review</h5>
                <button
                  type="button"
                onClick={() => setShowReviewModal(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--glass-300)';
                  e.target.style.color = 'var(--text)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--muted)';
                }}
              >
                ×
              </button>
              </div>

            {/* Modal Body */}
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <img
                    src={toAbsUrl(getPartImages(selectedItem.part)[0])}
                    alt={selectedItem.part?.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 8 }}
                    onError={(e) => {
                      e.target.src = '/assets/images/handpicked-img-1.webp';
                    }}
                  />
                          <div>
                    <h6 style={{ margin: '0 0 4px 0', color: 'var(--text)' }}>{selectedItem.part?.name}</h6>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
                      Order #{selectedOrder.orderNumber}
                    </p>
                  </div>
                    </div>
                  </div>

              <form>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '12px', 
                    fontWeight: 'bold',
                    color: 'var(--text)'
                  }}>
                    Overall Rating *
                  </label>
                  <StarRating
                    rating={reviewData.rating}
                    onRatingChange={(rating) => setReviewData({...reviewData, rating})}
                    size="lg"
                    interactive={true}
                  />
                      </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: 'bold',
                    color: 'var(--text)'
                  }}>
                    Review Title *
                  </label>
                  <input
                    type="text"
                    value={reviewData.title}
                    onChange={(e) => setReviewData({...reviewData, title: e.target.value})}
                    placeholder="Summarize your experience"
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-300)',
                      backgroundColor: 'var(--glass-100)',
                      color: 'var(--text)',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-300)'}
                    required
                  />
                      </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: 'bold',
                    color: 'var(--text)'
                  }}>
                    Review Comment *
                  </label>
                  <textarea
                    rows="4"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                    placeholder="Share your experience with this part..."
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-300)',
                      backgroundColor: 'var(--glass-100)',
                      color: 'var(--text)',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '100px',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-300)'}
                    required
                  />
                      </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '12px', 
                    fontWeight: 'bold',
                    color: 'var(--text)'
                  }}>
                    Detailed Ratings
                  </label>
                  
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: 'var(--glass-100)',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-300)'
                    }}>
                      <span style={{ color: 'var(--text)', fontWeight: '500' }}>Quality:</span>
                      <StarRating
                        rating={reviewData.qualityRating}
                        onRatingChange={(rating) => setReviewData({...reviewData, qualityRating: rating})}
                        size="sm"
                        interactive={true}
                      />
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: 'var(--glass-100)',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-300)'
                    }}>
                      <span style={{ color: 'var(--text)', fontWeight: '500' }}>Shipping:</span>
                      <StarRating
                        rating={reviewData.shippingRating}
                        onRatingChange={(rating) => setReviewData({...reviewData, shippingRating: rating})}
                        size="sm"
                        interactive={true}
                      />
                  </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: 'var(--glass-100)',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-300)'
                    }}>
                      <span style={{ color: 'var(--text)', fontWeight: '500' }}>Value for Money:</span>
                      <StarRating
                        rating={reviewData.valueRating}
                        onRatingChange={(rating) => setReviewData({...reviewData, valueRating: rating})}
                        size="sm"
                        interactive={true}
                      />
                    </div>
                  </div>
                </div>
              </form>
              </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: '20px', 
              borderTop: '1px solid var(--glass-300)', 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-300)',
                  backgroundColor: 'var(--glass-100)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--glass-300)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--glass-100)';
                }}
              >
                Cancel
              </button>
                <button
                  type="button"
                onClick={submitReview}
                disabled={!reviewData.title || !reviewData.comment}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: reviewData.title && reviewData.comment ? 'var(--primary)' : 'var(--glass-300)',
                  color: reviewData.title && reviewData.comment ? 'white' : 'var(--muted)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: reviewData.title && reviewData.comment ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (reviewData.title && reviewData.comment) {
                    e.target.style.backgroundColor = 'var(--primary-dark)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (reviewData.title && reviewData.comment) {
                    e.target.style.backgroundColor = 'var(--primary)';
                  }
                }}
              >
                Submit Review
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
