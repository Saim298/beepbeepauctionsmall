import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdChat } from 'react-icons/md';

const CarCard = ({ car, toAbsUrl }) => {
  const navigate = useNavigate();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleChatClick = () => {
    // Navigate to chat with car context
    navigate('/chat', { 
      state: { 
        carId: car._id, 
        carName: car.name,
        carPrice: car.price,
        carImage: car.media && car.media.length > 0 ? toAbsUrl(car.media[0].url) : null,
        vendorId: car.owner?._id,
        vendorName: car.owner?.name
      } 
    });
  };

  return (
    <div className="single-items d-flex transition cus-border border b-fourth rounded-3 mb-4">
      <div className="first-items">
        <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
          <div className="d-grid gap-2">
            <h5 className="n4-color transition fw-bold">{car.name}</h5>
            <span className="n4-color transition fw-medium fs-nine">
              {car.make?.name} {car.model?.name} {car.year}
            </span>
          </div>
          <div className="btn-area">
            <a href={`/car-details/${car._id}`} className="d-center">
              <span className="d-center transition fs-three n4-color">
                <i className="ph ph-bookmarks-simple"></i>
              </span>
            </a>
          </div>
        </div>
        
        {/* Car Images */}
        <div className="swiper multi-slider">
          <div className="swiper-wrapper">
            {car.media && car.media.length > 0 ? (
              car.media.slice(0, 5).map((media, index) => (
                <div key={index} className="swiper-slide">
                  <div className="img-area text-center">
                    <img
                      src={toAbsUrl(media.url)}
                      className="w-100"
                      alt={`${car.name} ${index + 1}`}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="swiper-slide">
                <div className="img-area text-center">
                  <img
                    src="/assets/images/handpicked-img-1.webp"
                    className="w-100"
                    alt={car.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="bottom-area position-absolute bottom-0 w-100 z-1 p-3 p-md-4 d-center justify-content-between">
            <div className="d-center flex-wrap flex-xxl-nowrap gap-2 gap-md-3 justify-content-start">
              <span className="rounded-pill n1-bg-color cus-border border b-fourth d-center gap-1 py-2 px-3 px-md-4">
                <span className="fs-six d-center s3-color">
                  <i className="fa-solid fa-star"></i>
                </span>
                <span className="fs-nine n4-color fw-semibold">4.8</span>
                <span className="fs-nine n5-color">(0)</span>
              </span>
              <span className="rounded-pill n3-bg-color d-center gap-1 py-2 px-3 px-md-4">
                <span className="fs-nine n4-color">
                  {car.location || 'Available'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Car Details */}
      <div className="second-items">
        <div className="row g-0 h-100 cus-border border b-fourth">
          <div className="col-lg-8 d-flex flex-column justify-content-center gap-3 gap-md-4">
            <h6 className="n4-color px-3 px-md-4 pt-2 list-only d-none d-md-block">
              Vehicle Specifications
            </h6>
            <div className="row g-0">
              {/* Specs Grid */}
              <div className="col-6 col-lg-4 cus-border border b-fourth">
                <div className="d-grid gap-2 py-5 py-md-7 text-center">
                  <div className="icon-area">
                    <img
                      src="/assets/images/icon/handpicked-icon-1.webp"
                      className="max-un"
                      alt="image"
                    />
                  </div>
                  <h6 className="fs-nine fw-normal n5-color">{car.year}</h6>
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
                  <h6 className="fs-nine fw-normal n5-color">{car.origin || 'N/A'}</h6>
                </div>
              </div>
              <div className="col-6 col-lg-4 cus-border border b-fourth">
                <div className="d-grid gap-2 py-5 py-md-7 text-center">
                  <div className="icon-area">
                    <img
                      src="/assets/images/icon/handpicked-icon-3.webp"
                      className="max-un"
                      alt="image"
                    />
                  </div>
                  <h6 className="fs-nine fw-normal n5-color">{car.era || 'CLASSIC'}</h6>
                </div>
              </div>
              <div className="col-6 col-lg-4 cus-border border b-fourth">
                <div className="d-grid gap-2 py-5 py-md-7 text-center">
                  <div className="icon-area">
                    <img
                      src="/assets/images/icon/handpicked-icon-4.webp"
                      className="max-un"
                      alt="image"
                    />
                  </div>
                  <h6 className="fs-nine fw-normal n5-color">Premium</h6>
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
                  <h6 className="fs-nine fw-normal n5-color">Quality</h6>
                </div>
              </div>
              <div className="col-6 col-lg-4 cus-border border b-fourth">
                <a
                  href={`/car-details/${car._id}`}
                  className="d-grid gap-2 h-100 text-center"
                >
                  <span className="fs-six d-center p1-color mb-n3">
                    <i className="ph ph-caret-right"></i>
                  </span>
                  <p className="fs-nine fw-normal p1-color">
                    View All Details
                  </p>
                </a>
              </div>
            </div>
            <div className="free-cancellation px-3 px-md-4 pb-2">
              <div className="d-center justify-content-start gap-2">
                <span className="fs-six d-center p4-color">
                  <i className="ph ph-check"></i>
                </span>
                <div className="text-area">
                  <span className="fs-ten p4-color">Free cancellation up</span>
                  <span className="fs-ten n5-color"> to 48h before pickup</span>
                </div>
              </div>
              <div className="d-center justify-content-start gap-2 list-only">
                <span className="fs-six d-center p4-color">
                  <i className="ph ph-check"></i>
                </span>
                <div className="text-area">
                  <span className="fs-ten n5-color">Instant confirmation!</span>
                </div>
              </div>
              <div className="d-center justify-content-start gap-2 list-only">
                <span className="fs-six d-center p4-color">
                  <i className="ph ph-check"></i>
                </span>
                <div className="text-area">
                  <span className="fs-ten n5-color">Secure full payment</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
            <span className="fs-nine n4-color">Classic Car</span>
            <div className="d-grid gap-1">
              <span className="fs-three p1-color">{formatPrice(car.price)}</span>
            </div>
            <span className="fs-nine n4-color">Premium Collection</span>
            <div className="btn-area d-grid gap-1 gap-md-2 mt-2 mt-md-3">
              <a
                href={`/purchase/${car._id}`}
                className="box-style style-one n4-bg-color rounded-pill d-center py-2 py-md-3 px-3 px-md-6"
              >
                <span className="fs-nine fw-semibold text-nowrap text-uppercase transition">
                  Buy Now
                </span>
              </a>
              <div className="d-flex gap-2">
                <button
                  onClick={handleChatClick}
                  className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-2 px-md-3 flex-shrink-0"
                  title="Chat with seller"
                >
                  <MdChat className="fs-six n4-color" />
                </button>
                <a
                  href={`/car-details/${car._id}`}
                  className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6 flex-grow-1"
                >
                  <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                    View Details
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
