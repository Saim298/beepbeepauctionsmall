import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdChat, MdShoppingCart } from 'react-icons/md';
import { FiPackage, FiTool, FiShield, FiStar } from 'react-icons/fi';
import { useCart } from "../context/CartContext.jsx";
import StarRating from './StarRating.jsx';

const PartCardFront = ({ part, toAbsUrl }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Extract image URLs from descriptionHtml
  const extractImagesFromHtml = (html) => {
    if (!html) return [];
    const imgRegex = /<img[^>]+src="([^"]+)"/g;
    const images = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      images.push(match[1]);
    }
    return images;
  };

  // Get images from media array or extract from descriptionHtml
  const getPartImages = () => {
    if (part.media && part.media.length > 0) {
      return part.media.map(media => media.url);
    }
    return extractImagesFromHtml(part.descriptionHtml);
  };

  const getConditionBadge = (condition) => {
    const badges = {
      new: { text: 'New', color: 's3-color' },
      used_excellent: { text: 'Excellent', color: 's3-color' },
      used_good: { text: 'Good', color: 'p1-color' },
      used_fair: { text: 'Fair', color: 'n5-color' },
      refurbished: { text: 'Refurbished', color: 'p1-color' },
      remanufactured: { text: 'Remanufactured', color: 'n4-color' }
    };
    return badges[condition] || { text: condition, color: 'n4-color' };
  };

  const handleChatClick = () => {
    const images = getPartImages();
    navigate('/chat', { 
      state: { 
        partId: part._id, 
        partName: part.name,
        partPrice: part.price,
        partImage: images.length > 0 ? toAbsUrl(images[0]) : null,
        vendorId: part.seller?._id,
        vendorName: part.seller?.username
      } 
    });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    try {
      await addToCart(part, 1);
      // Show success without alert for better UX
    } catch (error) {
      alert(error.message || 'Please sign in to add items to cart');
    }
  };

  const conditionBadge = getConditionBadge(part.condition);

  return (
    <div className="single-items d-flex transition cus-border border b-fourth rounded-3 mb-4">
      <div className="first-items">
        <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
          <div className="d-grid gap-2">
            <h5 className="n4-color transition fw-bold">{part.name}</h5>
            <span className="n4-color transition fw-medium fs-nine">
              {part.brand} {part.partNumber && `• Part #${part.partNumber}`}
            </span>
          </div>
          <div className="btn-area">
            <a href={`/parts/${part._id}`} className="d-center">
              <span className="d-center transition fs-three n4-color">
                <FiPackage />
              </span>
            </a>
          </div>
        </div>
        
        {/* Part Images */}
        <div className="swiper multi-slider">
          <div className="swiper-wrapper">
            {(() => {
              const images = getPartImages();
              if (images.length > 0) {
                return images.slice(0, 5).map((imageUrl, index) => (
                  <div key={index} className="swiper-slide">
                    <div className="img-area text-center">
                      <img
                        src={toAbsUrl(imageUrl)}
                        className="w-100"
                        alt={`${part.name} ${index + 1}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/assets/images/handpicked-img-1.webp';
                        }}
                      />
                    </div>
                  </div>
                ));
              } else {
                return (
                  <div className="swiper-slide">
                    <div className="img-area text-center">
                      <img
                        src="/assets/images/handpicked-img-1.webp"
                        className="w-100"
                        alt={part.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                );
              }
            })()}
          </div>
          <div className="bottom-area position-absolute bottom-0 w-100 z-1 p-3 p-md-4 d-center justify-content-between">
            <div className="d-center flex-wrap flex-xxl-nowrap gap-2 gap-md-3 justify-content-start">
              <span className="rounded-pill n1-bg-color cus-border border b-fourth d-center gap-1 py-2 px-3 px-md-4">
                <span className={`fs-six d-center ${conditionBadge.color}`}>
                  <FiStar />
                </span>
                <span className="fs-nine n4-color fw-semibold">{conditionBadge.text}</span>
                <span className="fs-nine n5-color">({part.views || 0})</span>
              </span>
              <span className="rounded-pill n3-bg-color d-center gap-1 py-2 px-3 px-md-4">
                <span className="fs-nine n4-color">
                  {part.quantity > 0 ? `${part.quantity} in stock` : 'Out of stock'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Part Details */}
      <div className="second-items">
        <div className="row g-0 h-100 cus-border border b-fourth">
          <div className="col-lg-8 d-flex flex-column justify-content-center gap-3 gap-md-4">
            <h6 className="n4-color px-3 px-md-4 pt-2 list-only d-none d-md-block">
              Products Specifications
            </h6>
            <div className="row g-0">
              {/* Specs Grid */}
              <div className="col-6 col-lg-4 cus-border border b-fourth">
                <div className="d-grid gap-2 py-5 py-md-7 text-center">
                  <div className="icon-area">
                    <FiTool className="fs-three n4-color" />
                  </div>
                  <h6 className="fs-nine fw-normal n5-color">{part.category?.replace('_', ' ') || 'PART'}</h6>
                </div>
              </div>
              <div className="col-6 col-lg-4 cus-border border b-fourth">
                <div className="d-grid gap-2 py-5 py-md-7 text-center">
                  <div className="icon-area">
                    <img
                      src="/assets/images/icon/handpicked-icon-2.webp"
                      className="max-un"
                      alt="image"
                    />
                  </div>
                  <h6 className="fs-nine fw-normal n5-color">{part.compatibility?.split(' ')[0] || 'UNIVERSAL'}</h6>
                </div>
              </div>
              <div className="col-6 col-lg-4 cus-border border b-fourth">
                <div className="d-grid gap-2 py-5 py-md-7 text-center">
                  <div className="icon-area">
                    {part.oem ? (
                      <img
                        src="/assets/images/icon/handpicked-icon-3.webp"
                        className="max-un"
                        alt="image"
                      />
                    ) : (
                      <FiPackage className="fs-three n4-color" />
                    )}
                  </div>
                  <h6 className="fs-nine fw-normal n5-color">{part.oem ? 'OEM' : 'AFTERMARKET'}</h6>
                </div>
              </div>
              <div className="col-6 col-lg-4 cus-border border b-fourth">
                <div className="d-grid gap-2 py-5 py-md-7 text-center">
                  <div className="icon-area">
                    {part.warranty && part.warranty !== 'none' ? (
                      <FiShield className="fs-three s3-color" />
                    ) : (
                      <img
                        src="/assets/images/icon/handpicked-icon-4.webp"
                        className="max-un"
                        alt="image"
                      />
                    )}
                  </div>
                  <h6 className="fs-nine fw-normal n5-color">
                    {part.warranty && part.warranty !== 'none' ? 'WARRANTY' : 'NO WARRANTY'}
                  </h6>
                </div>
              </div>
              <div className="col-6 col-lg-4 cus-border border b-fourth">
                <div className="d-grid gap-2 py-5 py-md-7 text-center">
                  <div className="icon-area">
                    <img
                      src="/assets/images/icon/handpicked-icon-5.webp"
                      className="max-un"
                      alt="image"
                    />
                  </div>
                  <h6 className="fs-nine fw-normal n5-color">{part.material || 'STANDARD'}</h6>
                </div>
              </div>
              <div className="col-6 col-lg-4 cus-border border b-fourth">
                <div className="d-grid gap-2 py-5 py-md-7 text-center">
                  <div className="icon-area">
                    <img
                      src="/assets/images/icon/handpicked-icon-6.webp"
                      className="max-un"
                      alt="image"
                    />
                  </div>
                  <h6 className="fs-nine fw-normal n5-color">{part.returnPolicy?.replace('_', ' ') || 'NO RETURNS'}</h6>
                </div>
              </div>
            </div>
          </div>
          
          {/* Price and Actions */}
          <div className="col-lg-4 d-flex flex-column justify-content-center gap-3 gap-md-4 px-3 px-md-4 py-5 py-md-7">
            <div className="d-grid gap-2 text-center">
              <h3 className="n4-color fw-bold">{formatPrice(part.price)}</h3>
              <span className="fs-nine n5-color">Starting Price</span>
              
              {/* Rating Display */}
              {part.reviews && part.reviews.totalReviews > 0 && (
                <div className="d-flex align-items-center justify-content-center gap-2 mt-2">
                  <StarRating rating={part.reviews.averageRating} size="sm" />
                  <span className="fs-nine n5-color">
                    ({part.reviews.totalReviews} review{part.reviews.totalReviews !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </div>
            
            {/* Seller Info */}
            <div className="d-center gap-3">
              <div className="img-area">
                <img
                  src={part.seller?.avatarUrl ? toAbsUrl(part.seller.avatarUrl) : "/assets/images/user-img-1.webp"}
                  className="w-100 rounded-circle"
                  alt={part.seller?.username || "Seller"}
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
              </div>
              <div className="text-area">
                <h6 className="fs-eight n4-color fw-medium mb-1">
                  {part.seller?.username || 'Seller'}
                </h6>
                <span className="fs-nine n5-color">Verified Seller</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="d-grid gap-2">
              <button
                onClick={() => navigate(`/parts/${part._id}`)}
                className="box-style style-two rounded-pill w-100 p1-bg-color d-center py-2 py-md-3 px-3 px-md-4"
              >
                <span className="fs-ten fw-bold n1-color text-uppercase transition">
                  View Details
                </span>
              </button>
              
              {part.quantity > 0 && (
                <button
                  onClick={handleAddToCart}
                  className={`box-style rounded-pill w-100 d-center py-2 py-md-3 px-3 px-md-4 ${
                    isInCart(part._id) ? 's3-bg-color' : 'n3-bg-color'
                  }`}
                >
                  <span className="d-center gap-2">
                    <MdShoppingCart className="fs-six" />
                    <span className="fs-ten fw-bold n4-color text-uppercase transition">
                      {isInCart(part._id) ? 'In Cart' : 'Add to Cart'}
                    </span>
                  </span>
                </button>
              )}
              
              <button
                onClick={handleChatClick}
                className="box-style rounded-pill w-100 n4-2nd-bg-color d-center py-2 py-md-3 px-3 px-md-4"
              >
                <span className="d-center gap-2">
                  <MdChat className="fs-six n4-color" />
                  <span className="fs-ten fw-bold n4-color text-uppercase transition">
                    Chat with Seller
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartCardFront;
