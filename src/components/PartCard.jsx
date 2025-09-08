import React from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiEye, FiMapPin } from "react-icons/fi";
import { useCart } from "../context/CartContext.jsx";

const PartCard = ({ part, toAbsUrl }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const getConditionBadge = (condition) => {
    const badges = {
      new: { class: "bg-success", text: "New" },
      used_excellent: { class: "bg-primary", text: "Excellent" },
      used_good: { class: "bg-info", text: "Good" },
      used_fair: { class: "bg-warning text-dark", text: "Fair" },
      refurbished: { class: "bg-secondary", text: "Refurbished" },
      remanufactured: { class: "bg-dark", text: "Remanufactured" }
    };
    return badges[condition] || { class: "bg-secondary", text: condition };
  };

  const conditionBadge = getConditionBadge(part.condition);

  const handleViewDetails = () => {
    navigate(`/parts/${part._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    try {
      await addToCart(part, 1);
      alert(`${part.name} added to cart! 🎉`);
    } catch (error) {
      alert(error.message || 'Please sign in to add items to cart');
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    // Wishlist functionality
    console.log('Add to wishlist:', part._id);
  };

  return (
    <div className="col-xl-4 col-lg-6 col-md-6 mb-6 mb-xxl-8">
      <div 
        className="product-item-two cus-border border b-sixth n4-bg-color rounded-3 p-3 p-md-4 transition hover-lift"
        style={{ cursor: 'pointer', height: '100%' }}
        onClick={handleViewDetails}
      >
        {/* Image Section */}
        <div className="img-area position-relative overflow-hidden rounded-3 mb-3">
          <img
            src={part.media?.[0]?.url ? toAbsUrl(part.media[0].url) : '/assets/images/handpicked-img-1.webp'}
            alt={part.name}
            className="w-100"
            style={{ 
              height: '200px', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onError={(e) => {
              e.target.src = '/assets/images/handpicked-img-1.webp';
            }}
          />
          
          {/* Badges */}
          <div className="position-absolute top-0 start-0 p-2">
            <span className={`badge ${conditionBadge.class} rounded-pill px-3 py-1`}>
              {conditionBadge.text}
            </span>
          </div>
          
          {part.oem && (
            <div className="position-absolute top-0 end-0 p-2">
              <span className="badge bg-warning text-dark rounded-pill px-3 py-1">
                OEM
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="position-absolute bottom-0 end-0 p-2">
            <div className="d-flex gap-1">
              <button
                className="btn btn-light btn-sm rounded-circle shadow-sm"
                onClick={handleAddToWishlist}
                title="Add to Wishlist"
              >
                <FiHeart size={14} />
              </button>
              <button
                className="btn btn-primary btn-sm rounded-circle shadow-sm"
                onClick={handleAddToCart}
                title="Add to Cart"
              >
                <FiShoppingCart size={14} />
              </button>
            </div>
          </div>

          {/* Stock Status */}
          {part.quantity === 0 && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <span className="badge bg-danger fs-6 px-4 py-2">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="content-area">
          {/* Brand */}
          {part.brand && (
            <div className="mb-2">
              <span className="badge bg-light text-dark rounded-pill px-3 py-1 fw-medium">
                {part.brand}
              </span>
            </div>
          )}

          {/* Title */}
          <h4 className="mb-2 fw-bold n4-color hover-text-decoration-underline">
            {part.name}
          </h4>

          {/* Part Number */}
          {part.partNumber && (
            <p className="mb-2 text-muted small">
              Part #: <span className="fw-medium">{part.partNumber}</span>
            </p>
          )}

          {/* Compatibility */}
          {part.compatibility && (
            <p className="mb-3 text-muted small">
              <i className="fas fa-car me-1"></i>
              Fits: <span className="fw-medium">{part.compatibility}</span>
            </p>
          )}

          {/* Price and Stock */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h3 className="mb-0 fw-bold p1-color">
                ${part.price?.toLocaleString() || '0'}
              </h3>
              <small className="text-muted">
                {part.quantity > 0 ? `${part.quantity} in stock` : 'Out of stock'}
              </small>
            </div>
            
            {/* Views */}
            <div className="text-end">
              <small className="text-muted d-flex align-items-center">
                <FiEye size={12} className="me-1" />
                {part.views || 0} views
              </small>
            </div>
          </div>

          {/* Seller Info */}
          {part.seller && (
            <div className="d-flex align-items-center justify-content-between mb-3 p-2 bg-light bg-opacity-50 rounded-2">
              <div className="d-flex align-items-center">
                <img
                  src={part.seller.avatarUrl || '/assets/images/user-img-1.webp'}
                  alt={part.seller.username}
                  className="rounded-circle me-2"
                  style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                />
                <div>
                  <div className="fw-medium text-dark" style={{ fontSize: '13px' }}>
                    {part.seller.username}
                  </div>
                  {part.seller.location && (
                    <div className="text-muted d-flex align-items-center" style={{ fontSize: '11px' }}>
                      <FiMapPin size={10} className="me-1" />
                      {part.seller.location}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-end">
                <span className="badge bg-success bg-opacity-20 text-success" style={{ fontSize: '10px' }}>
                  ✓ Verified
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary rounded-pill py-2 fw-semibold"
              onClick={handleViewDetails}
            >
              View Details
            </button>
            {part.quantity > 0 && (
              <button
                className={`btn rounded-pill py-2 fw-semibold ${
                  isInCart(part._id) ? 'btn-success' : 'btn-outline-primary'
                }`}
                onClick={handleAddToCart}
              >
                <FiShoppingCart size={14} className="me-2" />
                {isInCart(part._id) ? 'Added to Cart' : 'Add to Cart'}
              </button>
            )}
          </div>

          {/* Features */}
          <div className="mt-3">
            <div className="d-flex flex-wrap gap-1">
              {part.warranty && part.warranty !== 'none' && (
                <span className="badge bg-info bg-opacity-20 text-info" style={{ fontSize: '10px' }}>
                  <i className="fas fa-shield-alt me-1"></i>
                  Warranty
                </span>
              )}
              {part.returnPolicy && part.returnPolicy !== 'no_returns' && (
                <span className="badge bg-success bg-opacity-20 text-success" style={{ fontSize: '10px' }}>
                  <i className="fas fa-undo me-1"></i>
                  Returns
                </span>
              )}
              {part.aftermarket && (
                <span className="badge bg-secondary bg-opacity-20 text-secondary" style={{ fontSize: '10px' }}>
                  Aftermarket
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartCard;
