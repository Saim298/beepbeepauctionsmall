import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';
import { FiStar, FiFilter  } from 'react-icons/fi';
import { FaSortAlphaDown } from 'react-icons/fa';

const ReviewsList = ({ partId, partOwner, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [filters, setFilters] = useState({
    rating: '',
    sort: 'newest'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0
  });

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sort: filters.sort,
        ...(filters.rating && { rating: filters.rating })
      });

      const response = await fetch(`/api/reviews/parts/${partId}?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    if (!currentUser) {
      setCanReview(false);
      setHasReviewed(false);
      return;
    }

    try {
      const response = await fetch(`/api/reviews/can-review/${partId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCanReview(data.canReview);
        setHasReviewed(data.hasReviewed);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
    checkReviewEligibility();
  }, [partId, filters]);

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setShowReviewForm(false);
    setCanReview(false);
    setHasReviewed(true);
    
    // Refresh stats
    fetchReviews(1);
  };

  const handleHelpfulVote = (reviewId, helpfulCount, notHelpfulCount) => {
    setReviews(prev => prev.map(review => 
      review._id === reviewId 
        ? { ...review, helpfulCount, notHelpfulCount }
        : review
    ));
  };

  const handleSellerResponse = (reviewId, response) => {
    setReviews(prev => prev.map(review => 
      review._id === reviewId 
        ? { ...review, sellerResponse: response }
        : review
    ));
  };

  const handlePageChange = (page) => {
    fetchReviews(page);
  };

  const renderRatingDistribution = () => {
    if (!stats || stats.totalReviews === 0) return null;

    return (
      <div style={{ 
        backgroundColor: '#FBE5E6', 
        padding: '24px', 
        borderRadius: '16px',
        border: '1px solid rgba(215, 0, 7, 0.1)'
      }}>
        <h4 style={{ 
          fontWeight: '600', 
          color: '#000000', 
          marginBottom: '20px',
          fontSize: '18px'
        }}>
          Rating Breakdown
        </h4>
        {[5, 4, 3, 2, 1].map(rating => {
          const count = stats.ratingDistribution[rating] || 0;
          const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
          
          return (
            <div key={rating} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '12px' 
            }}>
              <span style={{ 
                fontSize: '14px', 
                color: '#000000', 
                width: '32px',
                fontWeight: '500'
              }}>
                {rating}★
              </span>
              <div style={{ 
                flex: 1, 
                margin: '0 12px', 
                backgroundColor: 'rgba(215, 0, 7, 0.1)', 
                borderRadius: '8px', 
                height: '8px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    backgroundColor: '#D70007',
                    height: '8px',
                    borderRadius: '8px',
                    width: `${percentage}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <span style={{ 
                fontSize: '14px', 
                color: '#000000', 
                width: '32px', 
                textAlign: 'right',
                fontWeight: '500'
              }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '48px 0' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          color: '#000000',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid #FBE5E6',
            borderTop: '3px solid #D70007',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading reviews...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Review Summary */}
      {stats && stats.totalReviews > 0 && (
        <div style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid rgba(215, 0, 7, 0.1)', 
          borderRadius: '16px', 
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center', minWidth: '200px' }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: '#000000',
                lineHeight: '1'
              }}>
                {stats.averageRating.toFixed(1)}
              </div>
              <div style={{ margin: '8px 0' }}>
                <StarRating rating={stats.averageRating} size="lg" />
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#666666', 
                marginTop: '8px',
                fontWeight: '500'
              }}>
                {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              {renderRatingDistribution()}
            </div>
          </div>

          {/* Detailed Ratings */}
          {(stats.averageQuality || stats.averageShipping || stats.averageValue) && (
            <div style={{ 
              marginTop: '32px', 
              paddingTop: '24px', 
              borderTop: '1px solid rgba(215, 0, 7, 0.1)' 
            }}>
              <h4 style={{ 
                fontWeight: '600', 
                color: '#000000', 
                marginBottom: '20px',
                fontSize: '18px'
              }}>
                Average Ratings
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px' 
              }}>
                {stats.averageQuality && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: '#FBE5E6',
                    borderRadius: '12px'
                  }}>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#000000',
                      fontWeight: '500'
                    }}>
                      Quality
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StarRating rating={stats.averageQuality} size="sm" />
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#000000',
                        fontWeight: '600'
                      }}>
                        {stats.averageQuality.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
                {stats.averageShipping && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: '#FBE5E6',
                    borderRadius: '12px'
                  }}>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#000000',
                      fontWeight: '500'
                    }}>
                      Shipping
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StarRating rating={stats.averageShipping} size="sm" />
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#000000',
                        fontWeight: '600'
                      }}>
                        {stats.averageShipping.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
                {stats.averageValue && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: '#FBE5E6',
                    borderRadius: '12px'
                  }}>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#000000',
                      fontWeight: '500'
                    }}>
                      Value
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StarRating rating={stats.averageValue} size="sm" />
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#000000',
                        fontWeight: '600'
                      }}>
                        {stats.averageValue.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Write Review Section */}
      {currentUser && canReview && !showReviewForm && (
        <div style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid rgba(215, 0, 7, 0.1)', 
          borderRadius: '16px', 
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <FiStar style={{ color: '#D70007', marginRight: '8px' }} size={24} />
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#000000', 
                margin: 0
              }}>
                Share Your Experience
              </h3>
            </div>
            <p style={{ 
              color: '#666666', 
              marginBottom: '24px',
              fontSize: '16px'
            }}>
              Help others by writing a review for this part
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="box-style style-two rounded-pill p1-bg-color d-center py-3 py-md-4 px-3 px-md-4 px-xl-6"
              style={{
                backgroundColor: '#D70007',
                color: '#ffffff',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#B80006';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#D70007';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FiStar style={{ marginRight: '8px' }} />
              Write a Review
            </button>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          partId={partId}
          onReviewSubmitted={handleReviewSubmitted}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Already Reviewed Message */}
      {currentUser && hasReviewed && (
        <div style={{ 
          backgroundColor: '#FBE5E6', 
          border: '1px solid rgba(215, 0, 7, 0.2)', 
          color: '#D70007', 
          padding: '16px 24px', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FiStar style={{ color: '#D70007' }} />
          <span style={{ fontWeight: '500' }}>
            You have already reviewed this part. Thank you for your feedback!
          </span>
        </div>
      )}

      {/* Login Prompt */}
      {!currentUser && (
        <div style={{ 
          backgroundColor: '#FBE5E6', 
          border: '1px solid rgba(215, 0, 7, 0.2)', 
          color: '#D70007', 
          padding: '16px 24px', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FiStar style={{ color: '#D70007' }} />
          <span>
            <a 
              href="/signin" 
              style={{ 
                color: '#D70007', 
                fontWeight: '600',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Sign in
            </a> to write a review
          </span>
        </div>
      )}

      {/* Filters and Sorting */}
      {reviews.length > 0 && (
        <div style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid rgba(215, 0, 7, 0.1)', 
          borderRadius: '16px', 
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'center', 
            gap: '24px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiFilter style={{ color: '#D70007' }} size={18} />
              <label style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#000000'
              }}>
                Filter by rating:
              </label>
              <select
                style={{
                  border: '1px solid rgba(215, 0, 7, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  cursor: 'pointer'
                }}
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
              >
                <option value="">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaSortAlphaDown  style={{ color: '#D70007' }} size={18} />
              <label style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#000000'
              }}>
                Sort by:
              </label>
              <select
                style={{
                  border: '1px solid rgba(215, 0, 7, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  cursor: 'pointer'
                }}
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="rating_high">Highest rated</option>
                <option value="rating_low">Lowest rated</option>
                <option value="helpful">Most helpful</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div>
        {reviews.length === 0 ? (
          <div style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid rgba(215, 0, 7, 0.1)', 
            borderRadius: '16px', 
            padding: '48px 24px', 
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '24px',
              opacity: 0.6
            }}>
              📝
            </div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#000000', 
              marginBottom: '12px' 
            }}>
              No reviews yet
            </h3>
            <p style={{ 
              color: '#666666',
              fontSize: '16px'
            }}>
              Be the first to review this part and help other buyers!
            </p>
          </div>
        ) : (
          <>
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onHelpfulVote={handleHelpfulVote}
                onSellerResponse={handleSellerResponse}
                isOwner={partOwner && currentUser && partOwner._id === currentUser._id}
                currentUser={currentUser}
              />
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: '32px' 
              }}>
                <nav style={{ display: 'flex', gap: '8px' }}>
                  {pagination.hasPrev && (
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        color: '#000000',
                        border: '1px solid rgba(215, 0, 7, 0.2)',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#FBE5E6';
                        e.target.style.borderColor = '#D70007';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.borderColor = 'rgba(215, 0, 7, 0.2)';
                      }}
                    >
                      Previous
                    </button>
                  )}
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    const isActive = page === pagination.currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          padding: '8px 16px',
                          fontSize: '14px',
                          border: '1px solid rgba(215, 0, 7, 0.2)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: isActive ? '#D70007' : '#ffffff',
                          color: isActive ? '#ffffff' : '#000000',
                          fontWeight: isActive ? '600' : '400'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.target.style.backgroundColor = '#FBE5E6';
                            e.target.style.borderColor = '#D70007';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.target.style.backgroundColor = '#ffffff';
                            e.target.style.borderColor = 'rgba(215, 0, 7, 0.2)';
                          }
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {pagination.hasNext && (
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        color: '#000000',
                        border: '1px solid rgba(215, 0, 7, 0.2)',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#FBE5E6';
                        e.target.style.borderColor = '#D70007';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.borderColor = 'rgba(215, 0, 7, 0.2)';
                      }}
                    >
                      Next
                    </button>
                  )}
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
