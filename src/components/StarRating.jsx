import React, { useState } from 'react';

const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  interactive = false, 
  onRatingChange = null,
  showValue = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const sizeClasses = {
    sm: { fontSize: '16px', gap: '2px' },
    md: { fontSize: '20px', gap: '3px' },
    lg: { fontSize: '24px', gap: '4px' },
    xl: { fontSize: '28px', gap: '5px' }
  };

  const handleStarClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue) => {
    if (interactive) {
      setHoverRating(starValue);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
      setIsHovering(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const currentRating = isHovering ? hoverRating : rating;
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= currentRating;
      const isHalfFilled = i === Math.ceil(currentRating) && currentRating % 1 !== 0;
      
      stars.push(
        <span
          key={i}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          style={{
            fontSize: sizeClasses[size].fontSize,
            color: isFilled ? '#fbbf24' : '#d1d5db',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.2s ease, transform 0.1s ease',
            display: 'inline-block',
            marginRight: i < maxRating ? sizeClasses[size].gap : '0',
            userSelect: 'none'
          }}
          onMouseOver={(e) => {
            if (interactive) {
              e.target.style.transform = 'scale(1.1)';
            }
          }}
          onMouseOut={(e) => {
            if (interactive) {
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          ★
        </span>
      );
    }
    
    return stars;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {renderStars()}
      </div>
      {showValue && (
        <span style={{ 
          fontSize: '14px', 
          color: 'var(--muted)', 
          marginLeft: '4px' 
        }}>
          ({rating.toFixed(1)})
        </span>
      )}
      {interactive && (
        <span style={{ 
          fontSize: '12px', 
          color: 'var(--muted)', 
          marginLeft: '8px' 
        }}>
          {isHovering ? `Rate ${hoverRating} star${hoverRating > 1 ? 's' : ''}` : `Current: ${rating} star${rating > 1 ? 's' : ''}`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
