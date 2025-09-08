import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import StarRating from '../components/StarRating';
import Sidebar from '../utils/Sidebar.jsx';
import '../pages/dashboard.css';

const MyReviews = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('beep-theme') || 'dark');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0
  });

  const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

  useEffect(() => { localStorage.setItem('beep-theme', theme); }, [theme]);

  const fetchMyReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBase}/api/reviews/my-reviews?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setPagination(data.pagination);
      } else {
        setError('Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`${apiBase}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        setReviews(prev => prev.filter(review => review._id !== reviewId));
        alert('Review deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete review: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toAbsUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${apiBase}${url}`;
  };

  if (loading) {
    return (
      <div className="dashboard-root" data-theme={theme}>
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--glass-300)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
              <p>Loading reviews...</p>
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
              <h1 className="page-title">My Reviews</h1>
              <span className="page-subtitle">Manage your product reviews and ratings</span>
            </div>
            <div className="topbar-right">
              <span className="pill">
                {pagination.totalReviews} Review{pagination.totalReviews !== 1 ? 's' : ''}
              </span>
              <button className="pill" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </header>

          {error && (
            <div className="panel glass" style={{ padding: 16, marginBottom: 16, background: 'var(--red-500)', color: 'white' }}>
              {error}
            </div>
          )}

          {reviews.length === 0 ? (
            <section className="panel glass" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
                <div style={{ width: 120, height: 90, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--glass-300)' }}>
                  <FiStar size={48} style={{ width: '100%', height: '100%', objectFit: 'cover', color: 'var(--muted)', padding: '20px' }} />
                </div>
                <h3 style={{ margin: 0 }}>No Reviews Yet</h3>
                <p className="muted" style={{ margin: 0 }}>You haven't written any reviews yet. Purchase parts and share your experience!</p>
                <div className="btn-row" style={{ marginTop: 8 }}>
                  <button className="pill primary" onClick={() => navigate('/parts')}>Browse Parts</button>
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* Reviews List */}
              <div style={{ display: 'grid', gap: '16px' }}>
                {reviews.map((review) => (
                  <div key={review._id}>
                    <div className="panel glass" style={{ padding: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '16px', alignItems: 'start' }}>
                        {/* Part Image and Info */}
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div 
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/parts/${review.sparePart._id}`)}
                          >
                            <img
                              src={review.sparePart.media?.[0]?.url 
                                ? toAbsUrl(review.sparePart.media[0].url) 
                                : "/assets/images/handpicked-img-1.webp"}
                              alt={review.sparePart.name}
                              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 8 }}
                            />
                          </div>
                          <div>
                            <h6 
                              style={{ fontWeight: 'bold', margin: '0 0 4px 0', cursor: 'pointer' }}
                              onClick={() => navigate(`/parts/${review.sparePart._id}`)}
                            >
                              {review.sparePart.name}
                            </h6>
                            <p className="muted" style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                              ${review.sparePart.price}
                            </p>
                            {review.verifiedPurchase && (
                              <span className="pill" style={{ background: 'var(--green-500)', color: 'white', fontSize: '12px' }}>
                                ✓ Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Review Content */}
                        <div>
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <StarRating rating={review.rating} size="sm" />
                              <span className="muted" style={{ fontSize: '12px' }}>
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <h6 style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>
                              {review.title}
                            </h6>
                          </div>

                          <p className="muted" style={{ margin: '0 0 8px 0' }}>
                            {review.comment.length > 150 
                              ? `${review.comment.substring(0, 150)}...` 
                              : review.comment}
                          </p>

                          {/* Detailed Ratings */}
                          {(review.qualityRating || review.shippingRating || review.valueRating) && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: '12px' }}>
                              {review.qualityRating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span>Quality:</span>
                                  <StarRating rating={review.qualityRating} size="sm" />
                                </div>
                              )}
                              {review.shippingRating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span>Shipping:</span>
                                  <StarRating rating={review.shippingRating} size="sm" />
                                </div>
                              )}
                              {review.valueRating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span>Value:</span>
                                  <StarRating rating={review.valueRating} size="sm" />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Seller Response */}
                          {review.sellerResponse && (
                            <div style={{ marginTop: 8, padding: 8, background: 'var(--glass-100)', borderRadius: 8 }}>
                              <small style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                Response from {review.seller?.username}:
                              </small>
                              <p className="muted" style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                                {review.sellerResponse.message}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <button
                            onClick={() => navigate(`/parts/${review.sparePart._id}`)}
                            className="pill"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                            title="View Part"
                          >
                            <FiEye style={{ marginRight: 4 }} />
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="pill"
                            style={{ fontSize: '12px', padding: '6px 12px', background: 'var(--red-500)', color: 'white' }}
                            title="Delete Review"
                          >
                            <FiTrash2 style={{ marginRight: 4 }} />
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={toAbsUrl(image.url)}
                                alt={`Review image ${index + 1}`}
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                                onClick={() => window.open(toAbsUrl(image.url), '_blank')}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Helpful Votes */}
                      {(review.helpfulCount > 0 || review.notHelpfulCount > 0) && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--glass-300)' }}>
                          <small className="muted">
                            {review.helpfulCount > 0 && (
                              <span style={{ marginRight: 12 }}>
                                👍 {review.helpfulCount} helpful
                              </span>
                            )}
                            {review.notHelpfulCount > 0 && (
                              <span>
                                👎 {review.notHelpfulCount} not helpful
                              </span>
                            )}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="btn-row" style={{ justifyContent: 'center', marginTop: 16 }}>
                  <button 
                    className="pill" 
                    disabled={!pagination.hasPrev} 
                    onClick={() => fetchMyReviews(pagination.currentPage - 1)}
                  >
                    Previous
                  </button>
                  <span className="pill soft">Page {pagination.currentPage} / {pagination.totalPages}</span>
                  <button 
                    className="pill" 
                    disabled={!pagination.hasNext} 
                    onClick={() => fetchMyReviews(pagination.currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyReviews;
