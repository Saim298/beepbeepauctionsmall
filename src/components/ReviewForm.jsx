import React, { useState } from "react";
import StarRating from "./StarRating";
import { getAuthToken } from "../api/client.js";
import "./reviews-ui.css";

const API_BASE = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ReviewForm = ({ partId, onReviewSubmitted, onCancel, existingReview = null }) => {
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || "",
    comment: existingReview?.comment || "",
    qualityRating: existingReview?.qualityRating || 0,
    shippingRating: existingReview?.shippingRating || 0,
    valueRating: existingReview?.valueRating || 0,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 5 images allowed",
      }));
      return;
    }

    setImages(files);
    setErrors((prev) => ({
      ...prev,
      images: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Review comment is required";
    }

    if (formData.comment.length > 1000) {
      newErrors.comment = "Comment must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const eligibilityResponse = await fetch(`${API_BASE}/api/reviews/can-review/${partId}`, {
        headers: authHeaders(),
      });

      const eligibility = await eligibilityResponse.json();

      if (!eligibility.canReview) {
        setErrors({ general: "You are not eligible to review this part" });
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("partId", partId);
      formDataToSend.append("purchaseId", eligibility.purchaseId);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("comment", formData.comment);

      if (formData.qualityRating > 0) {
        formDataToSend.append("qualityRating", formData.qualityRating);
      }
      if (formData.shippingRating > 0) {
        formDataToSend.append("shippingRating", formData.shippingRating);
      }
      if (formData.valueRating > 0) {
        formDataToSend.append("valueRating", formData.valueRating);
      }

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const url = existingReview ? `${API_BASE}/api/reviews/${existingReview._id}` : `${API_BASE}/api/reviews`;

      const method = existingReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders(),
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        onReviewSubmitted(result.review);
      } else {
        setErrors({ general: result.error || "Failed to submit review" });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrors({ general: "Failed to submit review. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form">
      <h3 className="review-form__title">{existingReview ? "Edit Your Review" : "Write a Review"}</h3>

      {errors.general && <div className="review-form__error">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        <div className="review-form__field">
          <label className="review-form__label">Overall Rating *</label>
          <StarRating
            rating={formData.rating}
            interactive={true}
            onRatingChange={(rating) => handleInputChange("rating", rating)}
            size="lg"
          />
          {errors.rating && <p className="review-form__err">{errors.rating}</p>}
        </div>

        <div className="review-form__field">
          <label className="review-form__label">Review Title *</label>
          <input
            type="text"
            className="review-form__input"
            placeholder="Summarize your experience"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            maxLength={100}
          />
          {errors.title && <p className="review-form__err">{errors.title}</p>}
        </div>

        <div className="review-form__field">
          <label className="review-form__label">Your Review *</label>
          <textarea
            className="review-form__textarea"
            rows={4}
            placeholder="Tell others about your experience with this part"
            value={formData.comment}
            onChange={(e) => handleInputChange("comment", e.target.value)}
            maxLength={1000}
          />
          <div className="review-form__hint">{formData.comment.length}/1000</div>
          {errors.comment && <p className="review-form__err">{errors.comment}</p>}
        </div>

        <div className="review-form__grid">
          <div className="review-form__field" style={{ marginBottom: 0 }}>
            <label className="review-form__label">Quality</label>
            <StarRating
              rating={formData.qualityRating}
              interactive={true}
              onRatingChange={(rating) => handleInputChange("qualityRating", rating)}
            />
          </div>
          <div className="review-form__field" style={{ marginBottom: 0 }}>
            <label className="review-form__label">Shipping</label>
            <StarRating
              rating={formData.shippingRating}
              interactive={true}
              onRatingChange={(rating) => handleInputChange("shippingRating", rating)}
            />
          </div>
          <div className="review-form__field" style={{ marginBottom: 0 }}>
            <label className="review-form__label">Value for Money</label>
            <StarRating
              rating={formData.valueRating}
              interactive={true}
              onRatingChange={(rating) => handleInputChange("valueRating", rating)}
            />
          </div>
        </div>

        <div className="review-form__field">
          <label className="review-form__label">Add Photos (Optional)</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="review-form__input" />
          <div className="review-form__hint" style={{ textAlign: "left", marginTop: 8 }}>
            Upload up to 5 images (Max 5MB each)
          </div>
          {errors.images && <p className="review-form__err">{errors.images}</p>}
        </div>

        <div className="review-form__actions">
          <button type="submit" disabled={loading} className="reviews-btn-primary">
            {loading ? "Submitting…" : existingReview ? "Update Review" : "Submit Review"}
          </button>
          <button type="button" onClick={onCancel} className="review-form__btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
