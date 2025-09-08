import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import custom styles
import './CarAuctionCards.css';

const CarAuctionCards = () => {
  return (
    <div>
      {" "}
      {/* <!-- Cars Rent start --> */}
      <section className="cars-rent position-relative px-0 px-md-10 pt-120 pb-120">
        <div className="abs-area position-absolute top-0 end-0 pe-none mt-20">
          <span className="text-uppercase text-gradient display-two p1-color mb-n20 me-20">
          BID
          </span>
        </div>
        <div className="container-fluid cus-padding">
          <div className="row gy-6 gy-md-0 mb-4 mb-md-6 justify-content-between align-items-end">
            <div className="col-md-8 col-lg-9 col-xl-7 col-xxl-5">
              <div className="section-area d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                <div className="d-center justify-content-start gap-2">
                  <span className="p1-color fs-nine fw-semibold text-uppercase">
                    Handpicked Classics For You
                  </span>
                  <span className="img-area text-center">
                    <img
                      src="assets/images/title-car.webp"
                      className="w-100"
                      alt="Image"
                    />
                  </span>
                </div>
                <h2 className="fs-two text-uppercase">
                  <span className="fw-bolder n4-color">Live on </span>
                  <span className="fw-normal n4-color"> Beep Beep Auctions</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="row gy-9 gy-xl-0">
            <div className="singleFilter">
              <div className="d-center flex-wrap gap-3 gap-md-4 justify-content-between mb-8 mb-md-15">
                <ul className="filter-list fourth d-center flex-wrap gap-2 gap-md-1">
                  <li data-filter="first second fifth" className="filter-item">
                    <div className="filter-links p1-3rd-bg-color px-4 px-md-5 py-1 py-md-2 transition rounded-pill cus-border border b-fourth d-center justify-content-start gap-2">
                      <span className="img-area text-center pe-none">
                        <img
                          src="assets/images/handpicked-car-1.webp"
                          className="w-100"
                          alt="Image"
                        />
                      </span>
                      <span className="n4-color fs-eight fw-semibold">
                        Compact
                      </span>
                    </div>
                  </li>
                  <li data-filter="third fourth fifth" className="filter-item">
                    <div className="filter-links p1-3rd-bg-color px-4 px-md-5 py-1 py-md-2 transition rounded-pill cus-border border b-fourth d-center justify-content-start gap-2">
                      <span className="img-area text-center pe-none">
                        <img
                          src="assets/images/handpicked-car-2.webp"
                          className="w-100"
                          alt="Image"
                        />
                      </span>
                      <span className="n4-color fs-eight fw-semibold">
                        limousine
                      </span>
                    </div>
                  </li>
                  <li data-filter="fifth sixth fourth" className="filter-item">
                    <div className="filter-links p1-3rd-bg-color px-4 px-md-5 py-1 py-md-2 transition rounded-pill cus-border border b-fourth d-center justify-content-start gap-2">
                      <span className="img-area text-center pe-none">
                        <img
                          src="assets/images/handpicked-car-3.webp"
                          className="w-100"
                          alt="Image"
                        />
                      </span>
                      <span className="n4-color fs-eight fw-semibold">
                        Station Wagon
                      </span>
                    </div>
                  </li>
                  <li data-filter="fifth fourth first" className="filter-item">
                    <div className="filter-links p1-3rd-bg-color px-4 px-md-5 py-1 py-md-2 transition rounded-pill cus-border border b-fourth d-center justify-content-start gap-2">
                      <span className="img-area text-center pe-none">
                        <img
                          src="assets/images/handpicked-car-3.webp"
                          className="w-100"
                          alt="Image"
                        />
                      </span>
                      <span className="n4-color fs-eight fw-semibold">SUV</span>
                    </div>
                  </li>
                  <li data-filter="fourth first fifth" className="filter-item">
                    <div className="filter-links p1-3rd-bg-color px-4 px-md-5 py-1 py-md-2 transition rounded-pill cus-border border b-fourth d-center justify-content-start gap-2">
                      <span className="img-area text-center pe-none">
                        <img
                          src="assets/images/handpicked-car-3.webp"
                          className="w-100"
                          alt="Image"
                        />
                      </span>
                      <span className="n4-color fs-eight fw-semibold">
                        Electric
                      </span>
                    </div>
                  </li>
                  <li data-filter="first sixth fourth" className="filter-item">
                    <div className="filter-links p1-3rd-bg-color px-4 px-md-5 py-1 py-md-2 transition rounded-pill cus-border border b-fourth d-center justify-content-start gap-2">
                      <span className="img-area text-center pe-none">
                        <img
                          src="assets/images/handpicked-car-3.webp"
                          className="w-100"
                          alt="Image"
                        />
                      </span>
                      <span className="n4-color fs-eight fw-semibold">
                        Pickup
                      </span>
                    </div>
                  </li>
                  <li data-filter="sixth second fifth" className="filter-item">
                    <div className="filter-links p1-3rd-bg-color px-4 px-md-5 py-1 py-md-2 transition rounded-pill cus-border border b-fourth d-center justify-content-start gap-2">
                      <span className="img-area text-center">
                        <img
                          src="assets/images/handpicked-car-3.webp"
                          className="w-100"
                          alt="Image"
                        />
                      </span>
                      <span className="n4-color fs-eight fw-semibold">
                        Minibus
                      </span>
                    </div>
                  </li>
                  <li data-filter="second first sixth" className="filter-item">
                    <div className="filter-links p1-3rd-bg-color px-4 px-md-5 py-1 py-md-2 transition rounded-pill cus-border border b-fourth d-center justify-content-start gap-2">
                      <span className="img-area text-center">
                        <img
                          src="assets/images/handpicked-car-3.webp"
                          className="w-100"
                          alt="Image"
                        />
                      </span>
                      <span className="n4-color fs-eight fw-semibold">
                        Convertible
                      </span>
                    </div>
                  </li>
                  <li data-filter="*" className="filter-item active">
                    <div className="filter-links p1-3rd-bg-color px-4 px-md-5 px-lg-6 py-1 py-md-5 transition rounded-pill cus-border border b-fourth d-center justify-content-start gap-2">
                      <span className="n4-color fs-six fw-semibold">8+</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="grid-item filterItems handpicked-cars row cus-row justify-content-center justify-content-md-start g-6 g-md-5">
                <div className="col-11 col-md-6 col-xxl-4" data-tag="first">
                  <div className="single-item transition cus-border border b-fourth rounded-3">
                    <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                      <div className="d-grid gap-2">
                        <h5 className="n4-color transition fw-bold">
                          1969 Mustang Boss 429
                        </h5>
                        <span className="n4-color transition fw-medium fs-nine">
                          Classic Muscle
                        </span>
                      </div>
                      <div className="btn-area">
                        <a href="#" className="d-center">
                          <span className="d-center transition fs-three n4-color">
                            <i className="ph ph-bookmarks-simple"></i>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="swiper multi-slider">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=400&fit=crop&crop=center"
                              className="w-100"
                              alt="1969 Mustang Boss 429"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="assets/images/handpicked-img-2.webp"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="assets/images/handpicked-img-11.webp"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="assets/images/handpicked-img-12.webp"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="assets/images/handpicked-img-13.webp"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bottom-area position-absolute bottom-0 w-100 z-1 p-3 p-md-4 d-center justify-content-between">
                        <div className="d-center flex-wrap flex-xxl-nowrap gap-2 gap-md-3 justify-content-start">
                          <span className="rounded-pill n1-bg-color cus-border border b-fourth d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-six d-center s3-color">
                              <i className="fa-solid fa-gavel"></i>
                            </span>
                            <span className="fs-nine n4-color fw-semibold">
                            Bids  
                            </span>
                            <span className="fs-nine n5-color">(102)</span>
                          </span>
                          <span className="rounded-pill n3-bg-color d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-nine n4-color">
                              Closes tonight at 10 PM
                            </span>
                          </span>
                        </div>
                        <div className="d-center d-none d-sm-flex justify-content-start rounded-pill n1-bg-color cus-border border b-fourth px-3 py-2 py-md-3">
                          <div className="slider-pagination d-center"></div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-0 h-100">
                      <div className="col-lg-8">
                        <div className="row g-0">
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-1.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">02</h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-2.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                DIESEL
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-3.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                AUTOMATIC
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-4.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                6,5 lt/100 km
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-5.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                615 LT
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <a
                              href="#"
                              className="d-grid gap-2 h-100 text-center cus-border border b-fourth"
                            >
                              <span className="fs-six d-center p1-color mb-n3">
                                <i className="ph ph-caret-right"></i>
                              </span>
                              <p className="fs-nine fw-normal p1-color">
                                View All Specification
                              </p>
                            </a>
                          </div>
                        </div>
                        <div className="free-cancellation py-3 py-md-4">
                          <div className="d-center gap-2">
                            <span className="fs-six d-center p4-color">
                              <i className="ph ph-check"></i>
                            </span>
                            <div className="text-area">
                              <span className="fs-ten p4-color">No cancellations </span>
                              <span className="fs-ten n5-color"> once a bid is placed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                        <span className="fs-nine n4-color">Started: 5 days ago</span>
                        <div className="d-grid gap-1">
                          <span className="fs-nine n4-color">Current Bid</span>
                          <span className="fs-three p1-color">$125,500</span>
                        </div>
                        <div className="btn-area d-grid gap-1 gap-md-2 mt-2 mt-md-3">
                          <a
                            href="#"
                            className="box-style style-one n4-bg-color rounded-pill d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine fw-semibold text-nowrap text-uppercase transition">
                              Bid Now
                            </span>
                          </a>
                          <a
                            href="#"
                            className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                              View Deal
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-11 col-md-6 col-xxl-4" data-tag="second">
                  <div className="single-item transition cus-border border b-fourth rounded-3">
                    <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                      <div className="d-grid gap-2">
                        <h5 className="n4-color transition fw-bold">1967 Shelby GT500</h5>
                        <span className="n4-color transition fw-medium fs-nine">
                          Eleanor Edition
                        </span>
                      </div>
                      <div className="btn-area">
                        <a href="#" className="d-center">
                          <span className="d-center transition fs-three n4-color">
                            <i className="ph ph-bookmarks-simple"></i>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="swiper multi-slider">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://robbreport.com/wp-content/uploads/2024/02/2-w-A-FrontSide.jpg?w=1024"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://robbreport.com/wp-content/uploads/2024/02/2-w-A-FrontSide.jpg?w=1024"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://robbreport.com/wp-content/uploads/2024/02/2-w-A-FrontSide.jpg?w=1024"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://robbreport.com/wp-content/uploads/2024/02/2-w-A-FrontSide.jpg?w=1024"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://robbreport.com/wp-content/uploads/2024/02/2-w-A-FrontSide.jpg?w=1024"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bottom-area position-absolute bottom-0 w-100 z-1 p-3 p-md-4 d-center justify-content-between">
                        <div className="d-center flex-wrap flex-xxl-nowrap gap-2 gap-md-3 justify-content-start">
                          <span className="rounded-pill n1-bg-color cus-border border b-fourth d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-six d-center s3-color">
                              <i className="fa-solid fa-gavel"></i>
                            </span>
                            <span className="fs-nine n4-color fw-semibold">
                            Bids  
                            </span>
                            <span className="fs-nine n5-color">(302)</span>
                          </span>
                          <span className="rounded-pill n3-bg-color d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-nine n4-color">
                              Closes tonight at 10 PM
                            </span>
                          </span>
                        </div>
                        <div className="d-center d-none d-sm-flex justify-content-start rounded-pill n1-bg-color cus-border border b-fourth px-3 py-2 py-md-3">
                          <div className="slider-pagination d-center"></div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-0 h-100">
                      <div className="col-lg-8">
                        <div className="row g-0">
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-1.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">02</h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-2.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                DIESEL
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-3.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                AUTOMATIC
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-4.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                6,5 lt/100 km
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-5.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                615 LT
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <a
                              href="#"
                              className="d-grid gap-2 h-100 text-center cus-border border b-fourth"
                            >
                              <span className="fs-six d-center p1-color mb-n3">
                                <i className="ph ph-caret-right"></i>
                              </span>
                              <p className="fs-nine fw-normal p1-color">
                                View All Specification
                              </p>
                            </a>
                          </div>
                        </div>
                        <div className="free-cancellation py-3 py-md-4">
                          <div className="d-center gap-2">
                            <span className="fs-six d-center p4-color">
                              <i className="ph ph-check"></i>
                            </span>
                            <div className="text-area">
                              <span className="fs-ten p4-color">No cancellations </span>
                              <span className="fs-ten n5-color"> once a bid is placed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                        <span className="fs-nine n4-color">Started: 3 days ago</span>
                        <div className="d-grid gap-1">
                          <span className="fs-nine n4-color">Current Bid</span>
                          <span className="fs-three p1-color">$295,750</span>
                        </div>
                        <div className="btn-area d-grid gap-1 gap-md-2 mt-2 mt-md-3">
                          <a
                            href="#"
                            className="box-style style-one n4-bg-color rounded-pill d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine fw-semibold text-nowrap text-uppercase transition">
                              Bid Now
                            </span>
                          </a>
                          <a
                            href="#"
                            className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                              View Deal
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-11 col-md-6 col-xxl-4" data-tag="third">
                  <div className="single-item transition cus-border border b-fourth rounded-3">
                    <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                      <div className="d-grid gap-2">
                        <h5 className="n4-color transition fw-bold">1963 Ferrari 250 GTO</h5>
                        <span className="n4-color transition fw-medium fs-nine">
                          Racing Legend
                        </span>
                      </div>
                      <div className="btn-area">
                        <a href="#" className="d-center">
                          <span className="d-center transition fs-three n4-color">
                            <i className="ph ph-bookmarks-simple"></i>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="swiper multi-slider">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://www.cnet.com/a/img/resize/d60f7c7c679a24004d73b704342e2b47cf062967/hub/2014/08/18/7750f2ab-8191-44f2-9859-cc32e794401e/gto.jpg?auto=webp&fit=crop&height=675&width=1200"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://www.cnet.com/a/img/resize/d60f7c7c679a24004d73b704342e2b47cf062967/hub/2014/08/18/7750f2ab-8191-44f2-9859-cc32e794401e/gto.jpg?auto=webp&fit=crop&height=675&width=1200"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://www.cnet.com/a/img/resize/d60f7c7c679a24004d73b704342e2b47cf062967/hub/2014/08/18/7750f2ab-8191-44f2-9859-cc32e794401e/gto.jpg?auto=webp&fit=crop&height=675&width=1200"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://www.cnet.com/a/img/resize/d60f7c7c679a24004d73b704342e2b47cf062967/hub/2014/08/18/7750f2ab-8191-44f2-9859-cc32e794401e/gto.jpg?auto=webp&fit=crop&height=675&width=1200"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://www.cnet.com/a/img/resize/d60f7c7c679a24004d73b704342e2b47cf062967/hub/2014/08/18/7750f2ab-8191-44f2-9859-cc32e794401e/gto.jpg?auto=webp&fit=crop&height=675&width=1200"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bottom-area position-absolute bottom-0 w-100 z-1 p-3 p-md-4 d-center justify-content-between">
                        <div className="d-center flex-wrap flex-xxl-nowrap gap-2 gap-md-3 justify-content-start">
                          <span className="rounded-pill n1-bg-color cus-border border b-fourth d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-six d-center s3-color">
                              <i className="fa-solid fa-gavel"></i>
                            </span>
                            <span className="fs-nine n4-color fw-semibold">
                            Bids  
                            </span>
                            <span className="fs-nine n5-color">(304)</span>
                          </span>
                          <span className="rounded-pill p6-bg-color cus-border border b-fifth d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-nine p4-color">
                              Available Now
                            </span>
                          </span>
                        </div>
                        <div className="d-center d-none d-sm-flex justify-content-start rounded-pill n1-bg-color cus-border border b-fourth px-3 py-2 py-md-3">
                          <div className="slider-pagination d-center"></div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-0 h-100">
                      <div className="col-lg-8">
                        <div className="row g-0">
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-1.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">02</h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-2.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                DIESEL
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-3.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                AUTOMATIC
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-4.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                6,5 lt/100 km
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-5.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                615 LT
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <a
                              href="#"
                              className="d-grid gap-2 h-100 text-center cus-border border b-fourth"
                            >
                              <span className="fs-six d-center p1-color mb-n3">
                                <i className="ph ph-caret-right"></i>
                              </span>
                              <p className="fs-nine fw-normal p1-color">
                                View All Specification
                              </p>
                            </a>
                          </div>
                        </div>
                        <div className="free-cancellation py-3 py-md-4">
                          <div className="d-center gap-2">
                            <span className="fs-six d-center p4-color">
                              <i className="ph ph-check"></i>
                            </span>
                            <div className="text-area">
                              <span className="fs-ten p4-color">No cancellations </span>
                              <span className="fs-ten n5-color"> once a bid is placed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                        <span className="fs-nine n4-color">Started: 1 day ago</span>
                        <div className="d-grid gap-1">
                          <span className="fs-nine n4-color">Current Bid</span>
                          <span className="fs-three p1-color">$48.5M</span>
                        </div>
                        <div className="btn-area d-grid gap-1 gap-md-2 mt-2 mt-md-3">
                          <a
                            href="#"
                            className="box-style style-one n4-bg-color rounded-pill d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine fw-semibold text-nowrap text-uppercase transition">
                              Bid Now
                            </span>
                          </a>
                          <a
                            href="#"
                            className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                              View Deal
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-11 col-md-6 col-xxl-4" data-tag="fourth">
                  <div className="single-item transition cus-border border b-fourth rounded-3">
                    <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                      <div className="d-grid gap-2">
                        <h5 className="n4-color transition fw-bold">
                          1970 Plymouth Barracuda
                        </h5>
                        <span className="n4-color transition fw-medium fs-nine">
                          Hemi V8
                        </span>
                      </div>
                      <div className="btn-area">
                        <a href="#" className="d-center">
                          <span className="d-center transition fs-three n4-color">
                            <i className="ph ph-bookmarks-simple"></i>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="swiper multi-slider">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://www.motortopia.com/wp-content/uploads/2022/10/MD-1504-CUDA-00-LEAD.jpg"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://www.motortopia.com/wp-content/uploads/2022/10/MD-1504-CUDA-00-LEAD.jpg"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://www.motortopia.com/wp-content/uploads/2022/10/MD-1504-CUDA-00-LEAD.jpg"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://www.motortopia.com/wp-content/uploads/2022/10/MD-1504-CUDA-00-LEAD.jpg"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://www.motortopia.com/wp-content/uploads/2022/10/MD-1504-CUDA-00-LEAD.jpg"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bottom-area position-absolute bottom-0 w-100 z-1 p-3 p-md-4 d-center justify-content-between">
                        <div className="d-center flex-wrap flex-xxl-nowrap gap-2 gap-md-3 justify-content-start">
                          <span className="rounded-pill n1-bg-color cus-border border b-fourth d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-six d-center s3-color">
                              <i className="fa-solid fa-gavel"></i>
                            </span>
                            <span className="fs-nine n4-color fw-semibold">
                            Bids  
                            </span>
                            <span className="fs-nine n5-color">(205)</span>
                          </span>
                          <span className="rounded-pill p6-bg-color cus-border border b-fifth d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-nine p4-color">
                              Available Now
                            </span>
                          </span>
                        </div>
                        <div className="d-center d-none d-sm-flex justify-content-start rounded-pill n1-bg-color cus-border border b-fourth px-3 py-2 py-md-3">
                          <div className="slider-pagination d-center"></div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-0 h-100">
                      <div className="col-lg-8">
                        <div className="row g-0">
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-1.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">02</h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-2.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                DIESEL
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-3.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                AUTOMATIC
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-4.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                6,5 lt/100 km
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-5.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                615 LT
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <a
                              href="#"
                              className="d-grid gap-2 h-100 text-center cus-border border b-fourth"
                            >
                              <span className="fs-six d-center p1-color mb-n3">
                                <i className="ph ph-caret-right"></i>
                              </span>
                              <p className="fs-nine fw-normal p1-color">
                                View All Specification
                              </p>
                            </a>
                          </div>
                        </div>
                        <div className="free-cancellation py-3 py-md-4">
                          <div className="d-center gap-2">
                            <span className="fs-six d-center p4-color">
                              <i className="ph ph-check"></i>
                            </span>
                            <div className="text-area">
                              <span className="fs-ten p4-color">No cancellations </span>
                              <span className="fs-ten n5-color"> once a bid is placed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                        <span className="fs-nine n4-color">Started: 2 days ago</span>
                        <div className="d-grid gap-1">
                          <span className="fs-nine n4-color">Current Bid</span>
                          <span className="fs-three p1-color">$185,250</span>
                        </div>
                        <div className="btn-area d-grid gap-1 gap-md-2 mt-2 mt-md-3">
                          <a
                            href="#"
                            className="box-style style-one n4-bg-color rounded-pill d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine fw-semibold text-nowrap text-uppercase transition">
                              Bid Now
                            </span>
                          </a>
                          <a
                            href="#"
                            className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                              View Deal
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-11 col-md-6 col-xxl-4" data-tag="fifth">
                  <div className="single-item transition cus-border border b-fourth rounded-3">
                    <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                      <div className="d-grid gap-2">
                        <h5 className="n4-color transition fw-bold">
                          1957 Mercedes 300SL
                        </h5>
                        <span className="n4-color transition fw-medium fs-nine">
                          Gullwing Coupe
                        </span>
                      </div>
                      <div className="btn-area">
                        <a href="#" className="d-center">
                          <span className="d-center transition fs-three n4-color">
                            <i className="ph ph-bookmarks-simple"></i>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="swiper multi-slider">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://hiltonandmoss.com/image-blobs/stock/590904/images/2fd45e55-009f-431a-aa91-3dc2e8fe0c98/mercedes_w198_300sl_roadster_hilton_and_moss_01.jpg?width=2000&height=1333"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://hiltonandmoss.com/image-blobs/stock/590904/images/2fd45e55-009f-431a-aa91-3dc2e8fe0c98/mercedes_w198_300sl_roadster_hilton_and_moss_01.jpg?width=2000&height=1333"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://hiltonandmoss.com/image-blobs/stock/590904/images/2fd45e55-009f-431a-aa91-3dc2e8fe0c98/mercedes_w198_300sl_roadster_hilton_and_moss_01.jpg?width=2000&height=1333"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://hiltonandmoss.com/image-blobs/stock/590904/images/2fd45e55-009f-431a-aa91-3dc2e8fe0c98/mercedes_w198_300sl_roadster_hilton_and_moss_01.jpg?width=2000&height=1333"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://hiltonandmoss.com/image-blobs/stock/590904/images/2fd45e55-009f-431a-aa91-3dc2e8fe0c98/mercedes_w198_300sl_roadster_hilton_and_moss_01.jpg?width=2000&height=1333"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bottom-area position-absolute bottom-0 w-100 z-1 p-3 p-md-4 d-center justify-content-between">
                        <div className="d-center flex-wrap flex-xxl-nowrap gap-2 gap-md-3 justify-content-start">
                          <span className="rounded-pill n1-bg-color cus-border border b-fourth d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-six d-center s3-color">
                              <i className="fa-solid fa-gavel"></i>
                            </span>
                            <span className="fs-nine n4-color fw-semibold">
                            Bids  
                            </span>
                            <span className="fs-nine n5-color">(303)</span>
                          </span>
                          <span className="rounded-pill p6-bg-color cus-border border b-fifth d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-nine p4-color">
                              Available Now
                            </span>
                          </span>
                        </div>
                        <div className="d-center d-none d-sm-flex justify-content-start rounded-pill n1-bg-color cus-border border b-fourth px-3 py-2 py-md-3">
                          <div className="slider-pagination d-center"></div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-0 h-100">
                      <div className="col-lg-8">
                        <div className="row g-0">
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-1.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">02</h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-2.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                DIESEL
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-3.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                AUTOMATIC
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-4.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                6,5 lt/100 km
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-5.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                615 LT
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <a
                              href="#"
                              className="d-grid gap-2 h-100 text-center cus-border border b-fourth"
                            >
                              <span className="fs-six d-center p1-color mb-n3">
                                <i className="ph ph-caret-right"></i>
                              </span>
                              <p className="fs-nine fw-normal p1-color">
                                View All Specification
                              </p>
                            </a>
                          </div>
                        </div>
                        <div className="free-cancellation py-3 py-md-4">
                          <div className="d-center gap-2">
                            <span className="fs-six d-center p4-color">
                              <i className="ph ph-check"></i>
                            </span>
                            <div className="text-area">
                              <span className="fs-ten p4-color">No cancellations </span>
                              <span className="fs-ten n5-color"> once a bid is placed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                        <span className="fs-nine n4-color">Started: 4 days ago</span>
                        <div className="d-grid gap-1">
                          <span className="fs-nine n4-color">Current Bid</span>
                          <span className="fs-three p1-color">$1.25M</span>
                        </div>
                        <div className="btn-area d-grid gap-1 gap-md-2 mt-2 mt-md-3">
                          <a
                            href="#"
                            className="box-style style-one n4-bg-color rounded-pill d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine fw-semibold text-nowrap text-uppercase transition">
                              Bid Now
                            </span>
                          </a>
                          <a
                            href="#"
                            className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                              View Deal
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-11 col-md-6 col-xxl-4" data-tag="sixth">
                  <div className="single-item transition cus-border border b-fourth rounded-3">
                    <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                      <div className="d-grid gap-2">
                        <h5 className="n4-color transition fw-bold">1961 Jaguar E-Type</h5>
                        <span className="n4-color transition fw-medium fs-nine">
                          Series 1 Roadster
                        </span>
                      </div>
                      <div className="btn-area">
                        <a href="#" className="d-center">
                          <span className="d-center transition fs-three n4-color">
                            <i className="ph ph-bookmarks-simple"></i>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="swiper multi-slider">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://cdn.motor1.com/images/mgl/Rq9PgK/s1/first-production-1961-jaguar-e-type-right-hand-drive-coupe.jpg"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://cdn.motor1.com/images/mgl/Rq9PgK/s1/first-production-1961-jaguar-e-type-right-hand-drive-coupe.jpg"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://cdn.motor1.com/images/mgl/Rq9PgK/s1/first-production-1961-jaguar-e-type-right-hand-drive-coupe.jpg"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://cdn.motor1.com/images/mgl/Rq9PgK/s1/first-production-1961-jaguar-e-type-right-hand-drive-coupe.jpg"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="img-area text-center">
                            <img
                              src="https://cdn.motor1.com/images/mgl/Rq9PgK/s1/first-production-1961-jaguar-e-type-right-hand-drive-coupe.jpg"
                              className="w-100"
                              alt="Image"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bottom-area position-absolute bottom-0 w-100 z-1 p-3 p-md-4 d-center justify-content-between">
                        <div className="d-center flex-wrap flex-xxl-nowrap gap-2 gap-md-3 justify-content-start">
                          <span className="rounded-pill n1-bg-color cus-border border b-fourth d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-six d-center s3-color">
                              <i className="fa-solid fa-gavel"></i>
                            </span>
                            <span className="fs-nine n4-color fw-semibold">
                            Bids  
                            </span>
                            <span className="fs-nine n5-color">(209)</span>
                          </span>
                          <span className="rounded-pill n3-bg-color d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-nine n4-color">
                              Closes tonight at 10 PM
                            </span>
                          </span>
                        </div>
                        <div className="d-center d-none d-sm-flex justify-content-start rounded-pill n1-bg-color cus-border border b-fourth px-3 py-2 py-md-3">
                          <div className="slider-pagination d-center"></div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-0 h-100">
                      <div className="col-lg-8">
                        <div className="row g-0">
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-1.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">02</h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-2.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                DIESEL
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-3.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                AUTOMATIC
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-4.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                6,5 lt/100 km
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-5.webp"
                                  className="max-un"
                                  alt="image"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                615 LT
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <a
                              href="#"
                              className="d-grid gap-2 h-100 text-center cus-border border b-fourth"
                            >
                              <span className="fs-six d-center p1-color mb-n3">
                                <i className="ph ph-caret-right"></i>
                              </span>
                              <p className="fs-nine fw-normal p1-color">
                                View All Specification
                              </p>
                            </a>
                          </div>
                        </div>
                        <div className="free-cancellation py-3 py-md-4">
                          <div className="d-center gap-2">
                            <span className="fs-six d-center p4-color">
                              <i className="ph ph-check"></i>
                            </span>
                            <div className="text-area">
                              <span className="fs-ten p4-color">No cancellations </span>
                              <span className="fs-ten n5-color"> once a bid is placed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                        <span className="fs-nine n4-color">Started: 6 days ago</span>
                        <div className="d-grid gap-1">
                          <span className="fs-nine n4-color">Current Bid</span>
                          <span className="fs-three p1-color">$175,500</span>
                        </div>
                        <div className="btn-area d-grid gap-1 gap-md-2 mt-2 mt-md-3">
                          <a
                            href="#"
                            className="box-style style-one n4-bg-color rounded-pill d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine fw-semibold text-nowrap text-uppercase transition">
                              Bid Now
                            </span>
                          </a>
                          <a
                            href="#"
                            className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6"
                          >
                            <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                              View Deal
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="btn-area d-center mt-6 mt-md-10">
              <a
                href="#"
                className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 py-lg-4 px-3 px-md-6"
              >
                <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                  Explore More
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Cars Rent end --> */}
            {/* <!-- Popular Makes start --> */}
      <section className="popular-makes position-relative px-0 px-md-10 pt-0 pb-120">
        <div className="container-fluid cus-padding">
          <div className="row gy-6 gy-md-0 mb-8 mb-md-12 justify-content-center">
            <div className="col-md-8 col-lg-9 col-xl-7">
              <div className="section-area d-grid gap-2 gap-md-3 text-center">
                <span className="p1-color fs-nine fw-semibold text-uppercase">Popular Makes</span>
                <h3 className="fs-two text-uppercase"><span className="fw-bolder n4-color">Explore Iconic Brands</span></h3>
            </div>
            </div>
          </div>
          <div className="row gy-4 g-md-4">
            {[
              { name: "Porsche", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&crop=center" },
              { name: "Ferrari", img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop&crop=center" },
              { name: "Ford", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&crop=center" },
              { name: "Chevrolet", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop&crop=center" },
              { name: "BMW", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&crop=center" },
              { name: "Mercedes", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&crop=center" },
              { name: "Jaguar", img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop&crop=center" },
              { name: "Lamborghini", img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center" }
            ].map((mk, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="single-item transition cus-border border b-fourth rounded-4 overflow-hidden h-100 brand-card">
                  <div className="img-area text-center position-relative">
                    <img src={mk.img} className="w-100 object-cover" alt={mk.name} style={{height: '240px'}} />
                    <div className="overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end">
                      <div className="content-area p-4 p-md-5">
                      <h5 className="n1-color fw-bold text-uppercase mb-3">{mk.name}</h5>
                      <a href="#" className="box-style style-one rounded-pill cus-border border transition d-center py-2 px-4">
                        <span className="fs-nine n1-color fw-semibold text-nowrap text-uppercase">
                          <i className="fa-solid fa-gavel me-2"></i>
                          Explore Auctions
                        </span>
                      </a>
                  </div>
                </div>
              </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <!-- Popular Makes end --> */}

                  {/* <!-- Popular Search Categories start --> */}
      <section className="popular-search position-relative px-0 px-md-10 pt-120 pb-120 n3-bg-color">
        <div className="container-fluid cus-padding">
          <div className="row gy-6 gy-md-0 mb-8 mb-md-12 justify-content-between align-items-end">
            <div className="col-md-8 col-lg-9 col-xl-7">
              <div className="section-area d-grid gap-2 gap-md-3">
                <span className="p1-color fs-nine fw-bold text-uppercase">Search Faster</span>
                <h3 className="fs-one text-uppercase lh-1"><span className="fw-bolder n4-color">Popular Search Categories</span></h3>
                <p className="n5-color fs-seven mb-0">Discover your perfect classic car by exploring our most popular categories</p>
              </div>
            </div>
            <div className="col-md-4 col-lg-3 col-xl-5">
              <div className="d-center justify-content-end gap-3">
                <button className="categories-prev d-center rounded-circle p1-bg-color cus-border border b-fourth box-area box-three transition" style={{cursor: 'pointer', width: '4rem', height: '4rem'}}>
                  <i className="fa-solid fa-chevron-left n1-color fs-six"></i>
                </button>
                <button className="categories-next d-center rounded-circle p1-bg-color cus-border border b-fourth box-area box-three transition" style={{cursor: 'pointer', width: '4rem', height: '4rem'}}>
                  <i className="fa-solid fa-chevron-right n1-color fs-six"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="row gy-6">
            <div className="col-12">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  480: {
                    slidesPerView: 1.5,
                    spaceBetween: 16,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2.5,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 3.5,
                    spaceBetween: 30,
                  },
                  1200: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                  },
                }}
                navigation={{
                  prevEl: '.categories-prev',
                  nextEl: '.categories-next',
                }}
                pagination={{
                  el: '.categories-pagination',
                  clickable: true,
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                className="categories-carousel"
                style={{ minHeight: '380px' }}
              >
                {[
                  { label: "Classics", bg: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=500&h=400&fit=crop&crop=center", count: "150+ Cars" },
                  { label: "Convertibles", bg: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=400&fit=crop&crop=center", count: "85+ Cars" },
                  { label: "Muscle Cars", bg: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=400&fit=crop&crop=center", count: "120+ Cars" },
                  { label: "Sports Cars", bg: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=400&fit=crop&crop=center", count: "200+ Cars" },
                  { label: "Luxury Cars", bg: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=400&fit=crop&crop=center", count: "75+ Cars" },
                  { label: "Vintage Racing", bg: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=500&h=400&fit=crop&crop=center", count: "45+ Cars" },
                  { label: "Restomods", bg: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=400&fit=crop&crop=center", count: "60+ Cars" },
                  { label: "Exotic Cars", bg: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=400&fit=crop&crop=center", count: "35+ Cars" }
                ].map((it, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="category-card-enhanced position-relative overflow-hidden rounded-4 transition h-100">
                      <div className="image-container position-relative">
                        <img src={it.bg} className="w-100 object-cover" alt={it.label} style={{height: '320px'}} />
                        <div className="gradient-overlay position-absolute top-0 start-0 w-100 h-100"></div>
                        <div className="category-badge position-absolute top-4 end-4 p1-bg-color rounded-pill px-3 py-1">
                          <span className="n1-color fw-bold fs-ten">{it.count}</span>
                        </div>
                      </div>
                      <div className="card-content position-absolute bottom-0 start-0 w-100 p-5">
                        <div className="content-wrapper n1-bg-color rounded-3 p-4 backdrop-blur">
                          <h5 className="n4-color fw-bold mb-2 text-center">{it.label}</h5>
                          <a href="#" className="btn-enhanced d-block text-center py-2 px-4 rounded-pill transition">
                            <span className="p1-color fw-bold fs-nine text-nowrap">
                            View Auctions <i className="fa-solid fa-arrow-right ms-2"></i>
                          </span>
                        </a>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="d-center justify-content-center mt-6">
                <div className="categories-pagination d-center gap-2"></div>
              </div>
            </div>
              </div>
                      </div>
      </section>
      {/* <!-- Popular Search Categories end --> */}

   {/* <!-- Selling A Car start --> */}
   <section className="selling-car overflow-visible n1-bg-color pt-120 pb-120 rounded-5 rounded-bottom-0 mt-n6 z-1 position-relative">
        <div className="container-fluid px-3 px-md-8">
          <div className="row gy-3 gy-md-0 justify-content-between">
            
            <div className="col-md-6 col-xxl-6">
              <div className="cus-sticky d-flex flex-column gap-10 gap-md-20">
                <div className="image-area position-relative d-center order-1 order-md-0 overflow-hidden rounded-5">
                  <img
                    src="https://clasiq.com/wp-content/themes/clasiq/img/sell-your-car-car.jpg"
                    className="w-100 rounded-5"
                    alt="Classic Car for Sale"
                  />
                  
                    </div>
              </div>
            </div>
            <div className="col-md-6 col-xxl-6 order-1 order-xl-0">
              <div className="section-area mb-6 mb-md-10">
                <div className="d-center justify-content-start gap-2">
                  <span className="p1-color fs-nine fw-semibold text-uppercase">
                    Simple Process
                  </span>
                  <span className="img-area text-center">
                    <img
                      src="assets/images/title-car.webp"
                      className="w-100"
                      alt="Image"
                    />
                  </span>
                </div>
                <h2 className="fs-two text-uppercase">
                  <span className="fw-bolder text-uppercase n4-color d-block">
                    Selling A Car?
                  </span>
                  <span className="fw-normal text-uppercase n4-color">
                    Start Your Journey!
                  </span>
                </h2>
              </div>
              <div className="selling-details">
                <div className="description-area mb-6">
                  <p className="n5-color fs-seven mb-4 lh-base">
                    It only costs <span className="p1-color fw-bold fs-six">$99</span> to get your vehicle listed on Beep Beep Auctions with an additional <span className="p1-color fw-bold fs-six">$200 ONLY</span> if your vehicle sells.
                  </p>
                  <p className="n5-color fs-seven mb-4 lh-base">
                    Simply sign up at Beep Beep Auctions, fill out some basic details and one of our Concierge team will be in touch with you. Our team of professionals guide you step by step to turn this very large decision into a very simple process.
                  </p>
                  <p className="n5-color fs-seven mb-4 lh-base">
                    Not only do we work with you, our seller, during the auction, but we also work with our bidders to make sure we get you the highest price possible from the most knowledgeable buyers.
                  </p>
                  <p className="n5-color fs-seven mb-6 lh-base">
                    After the auction we are there to assist with the transaction, help make shipping arrangements, and make sure both parties are completely satisfied. Let us handle the stress and hassle of selling your next classic.
                  </p>
                </div>

               

                <div className="btn-area d-flex flex-wrap gap-3">
                  <a href="#" className="box-style style-one n4-bg-color rounded-pill d-center py-3 px-6">
                    <span className="fs-eight fw-bold text-nowrap text-uppercase transition n1-color">
                      <i className="fa-solid fa-car me-2"></i>
                      List Your Car
                    </span>
                  </a>
                  <a href="#" className="box-style style-one rounded-pill cus-border border transition d-center py-3 px-6">
                    <span className="fs-eight n4-color fw-bold text-nowrap text-uppercase transition">
                      <i className="fa-solid fa-calculator me-2"></i>
                      Get Valuation
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Selling A Car end --> */}

      {/* <!-- How Beep Beep Auctions Work start --> */}
      <section className="how-it-works overflow-visible n1-bg-color pt-120 pb-120 rounded-5 rounded-bottom-0 mt-n6 z-1 position-relative">
        <div className="container-fluid px-3 px-md-8">
          <div className="row gy-3 gy-md-0 justify-content-between">
            <div className="col-md-6 col-xxl-6 order-1 order-xl-0">
              <div className="section-area mb-6 mb-md-10">
                <div className="d-center justify-content-start gap-2">
                  <span className="p1-color fs-nine fw-semibold text-uppercase">
                    Revolutionary Platform
                  </span>
                  <span className="img-area text-center">
                    <img
                      src="assets/images/title-car.webp"
                      className="w-100"
                      alt="Image"
                    />
                  </span>
                </div>
                <h2 className="fs-two text-uppercase">
                  <span className="fw-bolder text-uppercase n4-color d-block">
                    How Beep Beep
                  </span>
                  <span className="fw-normal text-uppercase n4-color">
                    Auctions Work
                  </span>
                </h2>
              </div>
              <div className="auction-details">
                <div className="description-area mb-6">
                  <p className="n5-color fs-seven mb-4 lh-base">
                    Beep Beep Auctions is a revolutionary new way to buy your next classic car. Beep Beep is building the industry standard for buying and selling classic cars with trust, safety and a white glove level service at the heart of what we offer.
                  </p>
                  <p className="n5-color fs-seven mb-4 lh-base">
                    If you're looking for a classic vehicle, you can check out pictures & videos of our upcoming auctions, read our in-depth vehicle descriptions, and can register to start bidding!
                  </p>
                  <p className="n5-color fs-seven mb-6 lh-base">
                    Our team of professional car enthusiasts are right there with you through the entire process. We make things simple and most of all, it's run by people who live and breathe classic cars, just like you!
                  </p>
                </div>


                <div className="btn-area d-flex flex-wrap gap-3">
                  <a href="#" className="box-style style-one n4-bg-color rounded-pill d-center py-3 px-6">
                    <span className="fs-eight fw-bold text-nowrap text-uppercase transition n1-color">
                      <i className="fa-solid fa-user-plus me-2"></i>
                      Register to Bid
                    </span>
                  </a>
                  <a href="#" className="box-style style-one rounded-pill cus-border border transition d-center py-3 px-6">
                    <span className="fs-eight n4-color fw-bold text-nowrap text-uppercase transition">
                      <i className="fa-solid fa-calendar me-2"></i>
                      View Upcoming Auctions
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xxl-6">
              <div className="cus-sticky d-flex flex-column gap-10 gap-md-20">
                <div className="image-area position-relative d-center order-1 order-md-0 overflow-hidden rounded-5">
                  <img
                    src="https://clasiq.com/wp-content/themes/clasiq/img/how-it-works-car.jpg"
                    className="w-100 rounded-5"
                    alt="Classic Vintage Car"
                  />
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- How Beep Beep Auctions Work end --> */}

      {/* <!-- Premium Membership Section start --> */}
      <section className="premium-membership position-relative px-0 px-md-10 pt-120 pb-120 mb-4" style={{ backgroundColor: '#FBE5E6' }}>
        <div className="container-fluid cus-padding">
          <div className="row align-items-center">
                         {/* Left Side - Multi-Band Gradient Background with Logo */}
             <div className="col-lg-6">
               <div className="membership-card-wrapper position-relative">
                 <div className="membership-card position-relative overflow-hidden" style={{
                   background: `
                     linear-gradient(90deg, 
                       #FBE5E6 0%, #FBE5E6 16.66%, 
                       #F0B5BA 16.66%, #F0B5BA 33.33%, 
                       #E3858D 33.33%, #E3858D 50%, 
                       #D45560 50%, #D45560 66.66%, 
                       #C42533 66.66%, #C42533 83.33%, 
                       #D70007 83.33%, #D70007 100%
                     )
                   `,
                   minHeight: '550px',
                   borderRadius: '24px',
                   padding: '0',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   boxShadow: '0 25px 50px rgba(215, 0, 7, 0.15), 0 15px 35px rgba(0, 0, 0, 0.1)',
                   border: '1px solid rgba(255, 255, 255, 0.2)'
                 }}>
                   {/* Top Badge */}
                   <div className="membership-badge position-absolute top-0 start-0 m-4">
                     <span className="badge rounded-pill px-4 py-2 membership-badge-pill">
                       <i className="fa-solid fa-crown me-2"></i>
                       Premium Membership
                     </span>
                   </div>

                   {/* Main Logo/Brand Area - Centered */}
                   <div className="brand-area text-center position-relative z-3">
                     <div className="brand-logo">
                       {/* BBC Logo with Animation */}
                       
                       
                       {/* Club Name */}
                       <div className="brand-name-container">
                       <h2 className="fs-one text-uppercase fw-bolder n4-color mb-4">
                    Beep Beep Auctions Club
                  </h2>
                       </div>

                       {/* Decorative Line */}
                       <div className="decorative-line mx-auto mt-4"></div>
                     </div>
                   </div>

                   {/* Enhanced Overlay for Better Text Contrast */}
                   <div className="contrast-overlay position-absolute top-0 start-0 w-100 h-100" style={{
                     background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.45) 100%)',
                     zIndex: 1
                   }}></div>

                   {/* Subtle Pattern Overlay */}
                   <div className="pattern-overlay position-absolute top-0 start-0 w-100 h-100" style={{
                     background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
                     zIndex: 2
                   }}></div>
                 </div>

                 {/* Card Shadow Effect */}
                 <div className="card-shadow position-absolute top-0 start-0 w-100 h-100" style={{
                   background: 'linear-gradient(45deg, rgba(215, 0, 7, 0.1) 0%, rgba(215, 0, 7, 0.05) 100%)',
                   borderRadius: '24px',
                   transform: 'translate(8px, 8px)',
                   zIndex: -1
                 }}></div>
               </div>
             </div>

            {/* Right Side - Content */}
            <div className="col-lg-6 ps-lg-5">
              <div className="membership-content">
                {/* Header */}
                <div className="content-header mb-5">
                  <div className="badge-container mb-3">
                    <span className="badge rounded-pill px-3 py-2" style={{
                      backgroundColor: '#D70007',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      Premium Membership
                    </span>
                  </div>
                 
                  <p className="fs-six n5-color lh-base mb-4">
                    A premium car club for your classic car passions — where collectors from all over can connect, save money, solve problems, share tips, and build relationships through garages and roads across the world.
                  </p>
                </div>

                {/* Benefits List */}
                <div className="benefits-section mb-5">
                  <h4 className="fs-four fw-bold n4-color mb-4 text-uppercase" style={{
                    borderBottom: '2px solid #D70007',
                    paddingBottom: '10px',
                    letterSpacing: '1px'
                  }}>
                    Benefits Include:
                  </h4>
                  <ul className="benefits-list">
                    {[
                      'Early Listing Access',
                      'Collector Car Valuations',
                      'Partner Discounts',
                      'Insurance Discounts',
                      'Beep Beep Magazine',
                      'Community Discussion Board',
                      'Exclusive Beep Beep Gear'
                    ].map((benefit, idx) => (
                      <li key={idx} className="benefit-item d-flex align-items-start mb-3">
                        <div className="benefit-icon me-3 mt-1">
                          <div className="icon-circle d-center rounded-circle" style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#D70007',
                            minWidth: '24px'
                          }}>
                            <i className="fa-solid fa-check text-white" style={{ fontSize: '12px' }}></i>
                          </div>
                        </div>
                        <span className="benefit-text n4-color fw-medium fs-seven text-uppercase" style={{
                          letterSpacing: '0.5px'
                        }}>
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="cta-section">
                  <button className="membership-cta-btn w-100 rounded-pill py-4 px-6 border-0 transition" style={{
                    backgroundColor: '#D70007',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 8px 25px rgba(215, 0, 7, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    <i className="fa-solid fa-crown me-3"></i>
                    Join The Club Today!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Premium Membership Section end --> */}

   
    </div>
  );
};

export default CarAuctionCards;
