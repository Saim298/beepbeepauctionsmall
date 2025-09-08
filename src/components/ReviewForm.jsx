import React, { useState } from 'react';
import StarRating from './StarRating';

const ReviewForm = ({ partId, onReviewSubmitted, onCancel, existingReview = null }) => {
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    comment: existingReview?.comment || '',
    qualityRating: existingReview?.qualityRating || 0,
    shippingRating: existingReview?.shippingRating || 0,
    valueRating: existingReview?.valueRating || 0
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setErrors(prev => ({
        ...prev,
        images: 'Maximum 5 images allowed'
      }));
      return;
    }
    
    setImages(files);
    setErrors(prev => ({
      ...prev,
      images: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    }
    
    if (formData.comment.length > 1000) {
      newErrors.comment = 'Comment must be less than 1000 characters';
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
      // Get purchase ID to verify eligibility
      const eligibilityResponse = await fetch(`/api/reviews/can-review/${partId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const eligibility = await eligibilityResponse.json();
      
      if (!eligibility.canReview) {
        setErrors({ general: 'You are not eligible to review this part' });
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('partId', partId);
      formDataToSend.append('purchaseId', eligibility.purchaseId);
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('comment', formData.comment);
      
      if (formData.qualityRating > 0) {
        formDataToSend.append('qualityRating', formData.qualityRating);
      }
      if (formData.shippingRating > 0) {
        formDataToSend.append('shippingRating', formData.shippingRating);
      }
      if (formData.valueRating > 0) {
        formDataToSend.append('valueRating', formData.valueRating);
      }
      
      // Add images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const url = existingReview 
        ? `/api/reviews/${existingReview._id}`
        : '/api/reviews';
      
      const method = existingReview ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        onReviewSubmitted(result.review);
      } else {
        setErrors({ general: result.error || 'Failed to submit review' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ general: 'Failed to submit review. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <StarRating
            rating={formData.rating}
            interactive={true}
            onRatingChange={(rating) => handleInputChange('rating', rating)}
            size="lg"
          />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Summarize your experience"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            maxLength={100}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Review Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Tell others about your experience with this part"
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            maxLength={1000}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.comment.length}/1000
          </div>
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
          )}
        </div>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <StarRating
              rating={formData.qualityRating}
              interactive={true}
              onRatingChange={(rating) => handleInputChange('qualityRating', rating)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping
            </label>
            <StarRating
              rating={formData.shippingRating}
              interactive={true}
              onRatingChange={(rating) => handleInputChange('shippingRating', rating)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value for Money
            </label>
            <StarRating
              rating={formData.valueRating}
              interactive={true}
              onRatingChange={(rating) => handleInputChange('valueRating', rating)}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload up to 5 images (Max 5MB each)
          </p>
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
