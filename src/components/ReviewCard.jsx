import React, { useState } from "react";
import StarRating from "./StarRating";
import { getAuthToken } from "../api/client.js";
import "./reviews-ui.css";

const API_BASE = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ReviewCard = ({ review, onHelpfulVote, onSellerResponse, isOwner = false, currentUser = null }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const comment = review.comment || "";
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleHelpfulVote = async (helpful) => {
    if (!currentUser) {
      alert("Please login to vote on reviews");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/reviews/${review._id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ helpful }),
      });

      const result = await response.json();

      if (response.ok) {
        onHelpfulVote(review._id, result.helpfulCount, result.notHelpfulCount);
      }
    } catch (error) {
      console.error("Error voting on review:", error);
    }
  };

  const handleSellerResponse = async () => {
    if (!responseText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/reviews/${review._id}/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ message: responseText }),
      });

      const result = await response.json();

      if (response.ok) {
        onSellerResponse(review._id, result.response);
        setShowResponseForm(false);
        setResponseText("");
      }
    } catch (error) {
      console.error("Error submitting seller response:", error);
    } finally {
      setLoading(false);
    }
  };

  const shouldTruncateComment = comment.length > 300;
  const displayComment =
    shouldTruncateComment && !showFullComment ? comment.substring(0, 300) + "..." : comment;

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__user">
          <div className="review-card__avatar">
            {review.reviewer?.avatarUrl ? (
              <img src={review.reviewer.avatarUrl} alt={review.reviewer.username || ""} />
            ) : (
              <span>{review.reviewer?.username?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div>
              <span className="review-card__name">{review.reviewer?.username}</span>
              {review.verifiedPurchase && (
                <span className="review-card__verified">✓ Verified Purchase</span>
              )}
            </div>
            <p className="review-card__meta">
              {formatDate(review.createdAt)}
              {review.reviewer?.location && ` • ${review.reviewer.location}`}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      <h3 className="review-card__title">{review.title}</h3>

      {(review.qualityRating || review.shippingRating || review.valueRating) && (
        <div className="review-card__detail-row">
          {review.qualityRating ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>Quality:</span>
              <StarRating rating={review.qualityRating} size="sm" />
            </div>
          ) : null}
          {review.shippingRating ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>Shipping:</span>
              <StarRating rating={review.shippingRating} size="sm" />
            </div>
          ) : null}
          {review.valueRating ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>Value:</span>
              <StarRating rating={review.valueRating} size="sm" />
            </div>
          ) : null}
        </div>
      )}

      <div>
        <p className="review-card__comment">{displayComment}</p>
        {shouldTruncateComment && (
          <button
            type="button"
            className="review-card__link"
            onClick={() => setShowFullComment(!showFullComment)}
          >
            {showFullComment ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {review.images && review.images.length > 0 && (
        <div className="review-card__images">
          {review.images.map((image, index) => (
            <div key={index} className="review-card__img-wrap">
              <img
                src={image.url}
                alt={image.caption || `Review image ${index + 1}`}
                onClick={() => window.open(image.url, "_blank")}
              />
            </div>
          ))}
        </div>
      )}

      {review.sellerResponse && (
        <div className="review-card__seller-reply">
          <strong>Response from {review.seller?.username}</strong>
          <p>{review.sellerResponse.message}</p>
          <div className="review-card__seller-date">{formatDate(review.sellerResponse.respondedAt)}</div>
        </div>
      )}

      <div className="review-card__actions">
        <div className="review-card__helpful">
          <span>Was this helpful?</span>
          <button type="button" className="review-card__vote" onClick={() => handleHelpfulVote(true)}>
            <span>👍</span> {review.helpfulCount || 0}
          </button>
          <button type="button" className="review-card__vote" onClick={() => handleHelpfulVote(false)}>
            <span>👎</span> {review.notHelpfulCount || 0}
          </button>
        </div>

        {isOwner && !review.sellerResponse && (
          <button type="button" className="review-card__respond" onClick={() => setShowResponseForm(!showResponseForm)}>
            Respond
          </button>
        )}
      </div>

      {showResponseForm && (
        <div className="review-card__reply-form">
          <textarea
            className="review-card__textarea"
            rows={3}
            placeholder="Respond to this review..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            maxLength={500}
          />
          <div className="review-card__reply-actions">
            <span style={{ marginRight: "auto", fontSize: 12, color: "var(--text-muted, rgba(255,255,255,0.35))" }}>
              {responseText.length}/500
            </span>
            <button type="button" className="review-card__btn-ghost" onClick={() => setShowResponseForm(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="review-card__btn-submit"
              onClick={handleSellerResponse}
              disabled={loading || !responseText.trim()}
            >
              {loading ? "Posting…" : "Post Response"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
