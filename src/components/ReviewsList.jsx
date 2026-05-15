import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";
import { FiStar, FiFilter } from "react-icons/fi";
import { FaSortAlphaDown } from "react-icons/fa";
import { getAuthToken } from "../api/client.js";
import "./reviews-ui.css";

const API_BASE = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const ReviewsList = ({ partId, partOwner, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [filters, setFilters] = useState({
    rating: "",
    sort: "newest",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasPrev: false,
    hasNext: false,
  });

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sort: filters.sort,
        ...(filters.rating && { rating: filters.rating }),
      });

      const response = await fetch(`${API_BASE}/api/reviews/parts/${partId}?${queryParams}`);
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (response.ok && data) {
        setReviews(data.reviews || []);
        setStats(data.stats);
        setPagination({
          currentPage: data.pagination?.currentPage ?? page,
          totalPages: data.pagination?.totalPages ?? 1,
          totalReviews: data.pagination?.totalReviews ?? 0,
          hasPrev: data.pagination?.hasPrev ?? false,
          hasNext: data.pagination?.hasNext ?? false,
        });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
      const token = getAuthToken();
      const response = await fetch(`${API_BASE}/api/reviews/can-review/${partId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (response.ok && data) {
        setCanReview(data.canReview);
        setHasReviewed(data.hasReviewed);
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
    checkReviewEligibility();
  }, [partId, filters]);

  const handleReviewSubmitted = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setShowReviewForm(false);
    setCanReview(false);
    setHasReviewed(true);
    fetchReviews(1);
  };

  const handleHelpfulVote = (reviewId, helpfulCount, notHelpfulCount) => {
    setReviews((prev) =>
      prev.map((review) =>
        review._id === reviewId ? { ...review, helpfulCount, notHelpfulCount } : review
      )
    );
  };

  const handleSellerResponse = (reviewId, response) => {
    setReviews((prev) =>
      prev.map((review) => (review._id === reviewId ? { ...review, sellerResponse: response } : review))
    );
  };

  const handlePageChange = (page) => {
    fetchReviews(page);
  };

  const renderRatingDistribution = () => {
    if (!stats || stats.totalReviews === 0) return null;

    return (
      <div className="reviews-breakdown">
        <h4 className="reviews-breakdown__title">Rating breakdown</h4>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating] || 0;
          const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
          return (
            <div key={rating} className="reviews-breakdown__row">
              <span className="reviews-breakdown__label">{rating}★</span>
              <div className="reviews-breakdown__track">
                <div className="reviews-breakdown__fill" style={{ width: `${percentage}%` }} />
              </div>
              <span className="reviews-breakdown__count">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="reviews-loading">
        <div className="reviews-loading__spinner" aria-hidden />
        <span>Loading reviews…</span>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      {stats && stats.totalReviews > 0 && (
        <div className="reviews-panel">
          <div className="reviews-summary">
            <div className="reviews-summary__score">
              <div className="reviews-summary__num">{stats.averageRating.toFixed(1)}</div>
              <div>
                <StarRating rating={stats.averageRating} size="lg" />
              </div>
              <div className="reviews-summary__count">
                {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: "260px" }}>{renderRatingDistribution()}</div>
          </div>

          {(stats.averageQuality || stats.averageShipping || stats.averageValue) && (
            <div className="reviews-subscores">
              <h4 className="reviews-subscores__title">Average ratings</h4>
              <div className="reviews-subscores__grid">
                {stats.averageQuality ? (
                  <div className="reviews-subscore">
                    <span>Quality</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <StarRating rating={stats.averageQuality} size="sm" />
                      <strong>{stats.averageQuality.toFixed(1)}</strong>
                    </div>
                  </div>
                ) : null}
                {stats.averageShipping ? (
                  <div className="reviews-subscore">
                    <span>Shipping</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <StarRating rating={stats.averageShipping} size="sm" />
                      <strong>{stats.averageShipping.toFixed(1)}</strong>
                    </div>
                  </div>
                ) : null}
                {stats.averageValue ? (
                  <div className="reviews-subscore">
                    <span>Value</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <StarRating rating={stats.averageValue} size="sm" />
                      <strong>{stats.averageValue.toFixed(1)}</strong>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}

      {currentUser && canReview && !showReviewForm && (
        <div className="reviews-panel reviews-cta">
          <div className="reviews-cta__title">
            <FiStar size={22} aria-hidden />
            Share your experience
          </div>
          <p className="reviews-cta__text">Help others by writing a review for this part.</p>
          <button type="button" className="reviews-btn-primary" onClick={() => setShowReviewForm(true)}>
            <FiStar size={18} />
            Write a review
          </button>
        </div>
      )}

      {showReviewForm && (
        <ReviewForm partId={partId} onReviewSubmitted={handleReviewSubmitted} onCancel={() => setShowReviewForm(false)} />
      )}

      {currentUser && hasReviewed && (
        <div className="reviews-banner">
          <FiStar size={18} aria-hidden />
          <span>You have already reviewed this part. Thank you for your feedback.</span>
        </div>
      )}

      {!currentUser && (
        <div className="reviews-banner">
          <FiStar size={18} aria-hidden />
          <span>
            <Link to="/signin">Sign in</Link> to write a review
          </span>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="reviews-panel">
          <div className="reviews-filters">
            <div className="reviews-filters__group">
              <FiFilter size={18} style={{ color: "var(--p1, #d70007)" }} aria-hidden />
              <span className="reviews-filters__label">Filter</span>
              <select
                className="reviews-select"
                value={filters.rating}
                onChange={(e) => setFilters((prev) => ({ ...prev, rating: e.target.value }))}
              >
                <option value="">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>
            <div className="reviews-filters__group">
              <FaSortAlphaDown size={16} style={{ color: "var(--p1, #d70007)" }} aria-hidden />
              <span className="reviews-filters__label">Sort</span>
              <select
                className="reviews-select"
                value={filters.sort}
                onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
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

      <div>
        {reviews.length === 0 ? (
          <div className="reviews-empty">
            <div className="reviews-empty__icon">
              <FiStar size={32} aria-hidden />
            </div>
            <h3 className="reviews-empty__title">No reviews yet</h3>
            <p className="reviews-empty__text">
              Be the first to review this part and help other buyers make confident decisions.
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

            {pagination.totalPages > 1 && (
              <div className="reviews-pagination">
                <button
                  type="button"
                  className="reviews-page-btn"
                  disabled={!pagination.hasPrev}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  const isActive = page === pagination.currentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      className={`reviews-page-btn${isActive ? " reviews-page-btn--active" : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="reviews-page-btn"
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
