import React, { useState } from 'react';
import StarRating from './StarRating';

const ReviewCard = ({ review, onHelpfulVote, onSellerResponse, isOwner = false, currentUser = null }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleHelpfulVote = async (helpful) => {
    if (!currentUser) {
      alert('Please login to vote on reviews');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${review._id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ helpful })
      });

      const result = await response.json();
      
      if (response.ok) {
        onHelpfulVote(review._id, result.helpfulCount, result.notHelpfulCount);
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const handleSellerResponse = async () => {
    if (!responseText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/reviews/${review._id}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: responseText })
      });

      const result = await response.json();
      
      if (response.ok) {
        onSellerResponse(review._id, result.response);
        setShowResponseForm(false);
        setResponseText('');
      }
    } catch (error) {
      console.error('Error submitting seller response:', error);
    } finally {
      setLoading(false);
    }
  };

  const shouldTruncateComment = review.comment.length > 300;
  const displayComment = shouldTruncateComment && !showFullComment 
    ? review.comment.substring(0, 300) + '...' 
    : review.comment;

  return (
    <div className="bg-white border rounded-lg p-6 mb-4">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {review.reviewer?.avatarUrl ? (
              <img 
                src={review.reviewer.avatarUrl} 
                alt={review.reviewer.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {review.reviewer?.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">
                {review.reviewer?.username}
              </h4>
              {review.verifiedPurchase && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  ✓ Verified Purchase
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
              {review.reviewer?.location && ` • ${review.reviewer.location}`}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Review Title */}
      <h3 className="font-semibold text-gray-900 mb-2">
        {review.title}
      </h3>

      {/* Detailed Ratings */}
      {(review.qualityRating || review.shippingRating || review.valueRating) && (
        <div className="flex flex-wrap gap-4 mb-3 text-sm">
          {review.qualityRating && (
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">Quality:</span>
              <StarRating rating={review.qualityRating} size="sm" />
            </div>
          )}
          {review.shippingRating && (
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">Shipping:</span>
              <StarRating rating={review.shippingRating} size="sm" />
            </div>
          )}
          {review.valueRating && (
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">Value:</span>
              <StarRating rating={review.valueRating} size="sm" />
            </div>
          )}
        </div>
      )}

      {/* Review Comment */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {displayComment}
        </p>
        {shouldTruncateComment && (
          <button
            onClick={() => setShowFullComment(!showFullComment)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-1"
          >
            {showFullComment ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {review.images.map((image, index) => (
              <div key={index} className="w-20 h-20 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.caption || `Review image ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                  onClick={() => {
                    // TODO: Implement image modal/lightbox
                    window.open(image.url, '_blank');
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seller Response */}
      {review.sellerResponse && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-900 text-sm">
                Response from {review.seller?.username}
              </p>
              <p className="text-blue-800 mt-1">
                {review.sellerResponse.message}
              </p>
              <p className="text-blue-600 text-xs mt-2">
                {formatDate(review.sellerResponse.respondedAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-4">
          {/* Helpful Votes */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Was this helpful?</span>
            <button
              onClick={() => handleHelpfulVote(true)}
              className="text-sm text-gray-600 hover:text-green-600 flex items-center space-x-1"
            >
              <span>👍</span>
              <span>{review.helpfulCount || 0}</span>
            </button>
            <button
              onClick={() => handleHelpfulVote(false)}
              className="text-sm text-gray-600 hover:text-red-600 flex items-center space-x-1"
            >
              <span>👎</span>
              <span>{review.notHelpfulCount || 0}</span>
            </button>
          </div>
        </div>

        {/* Seller Response Button */}
        {isOwner && !review.sellerResponse && (
          <button
            onClick={() => setShowResponseForm(!showResponseForm)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Respond
          </button>
        )}
      </div>

      {/* Seller Response Form */}
      {showResponseForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Respond to this review..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{responseText.length}/500</span>
            <div className="space-x-2">
              <button
                onClick={() => setShowResponseForm(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSellerResponse}
                disabled={loading || !responseText.trim()}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
