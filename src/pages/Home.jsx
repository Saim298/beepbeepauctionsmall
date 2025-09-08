import React, { useState } from "react";
import Header from "../utils/Header";
import Banner from "../components/frontComponents/Banner";
import FeaturedParts from "../components/frontComponents/FeaturedParts";
import Footer from "../components/frontComponents/Footer";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";

const Home = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      setNewsletterStatus("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    setNewsletterStatus("");

    try {
      const response = await apiRequest("/api/newsletter/subscribe", {
        method: "POST",
        body: { email: newsletterEmail }
      });

      if (response.success) {
        setNewsletterStatus("🎉 " + response.message);
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("❌ " + response.message);
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setNewsletterStatus("❌ " + (error.message || "Failed to subscribe. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />

      <Banner />

      <FeaturedParts />

      {/* <!-- Book Online start --> */}
      {/* <section className="book-online overflow-visible n1-bg-color pt-120 pb-120 rounded-5 rounded-bottom-0 mt-n6 z-1 position-relative">
        <div className="container-fluid px-3 px-md-8">
          <div className="row gy-3 gy-md-0 justify-content-between">
            <div className="col-md-6 col-xxl-7 order-1 order-xl-0">
              <div className="cus-sticky d-flex flex-column gap-10 gap-md-20">
                <div className="image-area position-relative d-center order-1 order-md-0 overflow-hidden rounded-5">
                  <img
                    src="assets/images/book-online-bg-1.webp"
                    className="w-100 rounded-5"
                    alt="Image"
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 counter-area row g-0">
                    <div className="col-6 col-xl-5 col-xxl-4 p1-bg-color py-6 py-md-8 px-5 px-md-7">
                      <div className="counters d-flex mb-n3">
                        <span
                          className="odometer fs-one fw-normal n1-color font-tertiary"
                          data-odometer-final="95"
                        >
                          100
                        </span>
                        <span className="symbol fs-four fw-light n1-color mt-1">
                          %
                        </span>
                      </div>
                      <span className="n1-color fs-six">
                        Customer Satisfaction
                      </span>
                    </div>
                    <div className="col-6 col-xl-5 col-xxl-4 p3-bg-color py-6 py-md-8 px-5 px-md-7">
                      <div className="counters d-flex mb-n3">
                        <span
                          className="odometer fs-one fw-normal n1-color font-tertiary"
                          data-odometer-final="100"
                        >
                          0
                        </span>
                        <span className="symbol fs-four fw-light n1-color mt-1">
                          %
                        </span>
                      </div>
                      <span className="n1-color fs-six">No Hidden Fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xxl-5">
              <div className="section-area mb-6 mb-md-10">
                <div className="d-center justify-content-start gap-2">
                  <span className="p1-color fs-nine fw-semibold text-uppercase">
                    Get more, pay less!
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
                    Premium cars at
                  </span>
                  <span className="fw-normal text-uppercase n4-color">
                    unbeatable prices!
                  </span>
                </h2>
              </div>
              <div className="swiper premium-cars-carousel">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="single-item transition cus-border border b-fourth rounded-3">
                      <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                        <div className="d-grid gap-2">
                          <h5 className="n4-color transition fw-bold">
                            Porsche Taycan
                          </h5>
                          <span className="n4-color transition fw-medium fs-nine">
                            GT
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
                                src="assets/images/handpicked-img-1.webp"
                                className="w-100"
                                alt="Image"
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
                                12 bids
                              </span>
                              <span className="fs-nine n5-color">
                                until now
                              </span>
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
                                <h6 className="fs-nine fw-normal n5-color">
                                  02
                                </h6>
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
                                <span className="fs-ten n5-color"> once a bid is placed
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                          <span className="fs-nine n4-color">
                            Started: 5 days ago
                          </span>
                          <div className="d-grid gap-1">
                            <span className="fs-nine n4-color">
                              Current Bid
                            </span>
                            <span className="fs-three p1-color">$324.0</span>
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
                  <div className="swiper-slide">
                    <div className="single-item transition cus-border border b-fourth rounded-3">
                      <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                        <div className="d-grid gap-2">
                          <h5 className="n4-color transition fw-bold">
                            Cayenne
                          </h5>
                          <span className="n4-color transition fw-medium fs-nine">
                            GT
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
                                src="assets/images/handpicked-img-3.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-4.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-14.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-15.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-16.webp"
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
                                <i className="fa-solid fa-star"></i>
                              </span>
                              <span className="fs-nine n4-color fw-semibold">
                                4.6
                              </span>
                              <span className="fs-nine n5-color">(302)</span>
                            </span>
                            <span className="rounded-pill n3-bg-color d-center gap-1 py-2 px-3 px-md-4">
                              <span className="fs-nine n4-color">
                                Booked till 10 PM
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
                                <h6 className="fs-nine fw-normal n5-color">
                                  02
                                </h6>
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
                                <span className="fs-ten p4-color">
                                  Free cancellation up
                                </span>
                                <span className="fs-ten n5-color">
                                  to 48h before pick-up time
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                          <span className="fs-nine n4-color">Total 5 days</span>
                          <div className="d-grid gap-1">
                            <span className="fs-eight n5-color text-decoration-line-through">
                              $532.00
                            </span>
                            <span className="fs-three p1-color">$352.0</span>
                          </div>
                          <span className="fs-nine n4-color">
                            $ 57.99 / Daily
                          </span>
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
                  <div className="swiper-slide">
                    <div className="single-item transition cus-border border b-fourth rounded-3">
                      <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                        <div className="d-grid gap-2">
                          <h5 className="n4-color transition fw-bold">
                            Cayenne
                          </h5>
                          <span className="n4-color transition fw-medium fs-nine">
                            GT
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
                                src="assets/images/handpicked-img-7.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-8.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-17.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-18.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-19.webp"
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
                                <i className="fa-solid fa-star"></i>
                              </span>
                              <span className="fs-nine n4-color fw-semibold">
                                4.8
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
                                <h6 className="fs-nine fw-normal n5-color">
                                  02
                                </h6>
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
                                <span className="fs-ten p4-color">
                                  Free cancellation up
                                </span>
                                <span className="fs-ten n5-color">
                                  to 48h before pick-up time
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                          <span className="fs-nine n4-color">Total 5 days</span>
                          <div className="d-grid gap-1">
                            <span className="fs-eight n5-color text-decoration-line-through">
                              $545.00
                            </span>
                            <span className="fs-three p1-color">$209.0</span>
                          </div>
                          <span className="fs-nine n4-color">
                            $ 49.99 / Daily
                          </span>
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
                  <div className="swiper-slide">
                    <div className="single-item transition cus-border border b-fourth rounded-3">
                      <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                        <div className="d-grid gap-2">
                          <h5 className="n4-color transition fw-bold">
                            Porsche Taycan
                          </h5>
                          <span className="n4-color transition fw-medium fs-nine">
                            GT
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
                                src="assets/images/handpicked-img-9.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-10.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-20.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-21.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-22.webp"
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
                                <i className="fa-solid fa-star"></i>
                              </span>
                              <span className="fs-nine n4-color fw-semibold">
                                4.6
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
                                <h6 className="fs-nine fw-normal n5-color">
                                  02
                                </h6>
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
                                <span className="fs-ten p4-color">
                                  Free cancellation up
                                </span>
                                <span className="fs-ten n5-color">
                                  to 48h before pick-up time
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                          <span className="fs-nine n4-color">Total 5 days</span>
                          <div className="d-grid gap-1">
                            <span className="fs-eight n5-color text-decoration-line-through">
                              $388.00
                            </span>
                            <span className="fs-three p1-color">$338.0</span>
                          </div>
                          <span className="fs-nine n4-color">
                            $ 52.99 / Daily
                          </span>
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
                  <div className="swiper-slide">
                    <div className="single-item transition cus-border border b-fourth rounded-3">
                      <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                        <div className="d-grid gap-2">
                          <h5 className="n4-color transition fw-bold">
                            Panamera 4.45
                          </h5>
                          <span className="n4-color transition fw-medium fs-nine">
                            GT
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
                                src="assets/images/handpicked-img-5.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-6.webp"
                                className="w-100"
                                alt="Image"
                              />
                            </div>
                          </div>
                          <div className="swiper-slide">
                            <div className="img-area text-center">
                              <img
                                src="assets/images/handpicked-img-23.webp"
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
                                src="assets/images/handpicked-img-24.webp"
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
                                <i className="fa-solid fa-star"></i>
                              </span>
                              <span className="fs-nine n4-color fw-semibold">
                                4.9
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
                                <h6 className="fs-nine fw-normal n5-color">
                                  02
                                </h6>
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
                                <span className="fs-ten p4-color">
                                  Free cancellation up
                                </span>
                                <span className="fs-ten n5-color">
                                  to 48h before pick-up time
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                          <span className="fs-nine n4-color">Total 5 days</span>
                          <div className="d-grid gap-1">
                            <span className="fs-eight n5-color text-decoration-line-through">
                              $456.00
                            </span>
                            <span className="fs-three p1-color">$369.0</span>
                          </div>
                          <span className="fs-nine n4-color">
                            $ 53.99 / Daily
                          </span>
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
                  <div className="swiper-slide">
                    <div className="single-item transition cus-border border b-fourth rounded-3">
                      <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                        <div className="d-grid gap-2">
                          <h5 className="n4-color transition fw-bold">
                            Cayenne
                          </h5>
                          <span className="n4-color transition fw-medium fs-nine">
                            GT
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
                                src="assets/images/handpicked-img-8.webp"
                                className="w-100"
                                alt="Image"
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
                                <i className="fa-solid fa-star"></i>
                              </span>
                              <span className="fs-nine n4-color fw-semibold">
                                4.4
                              </span>
                              <span className="fs-nine n5-color">(209)</span>
                            </span>
                            <span className="rounded-pill n3-bg-color d-center gap-1 py-2 px-3 px-md-4">
                              <span className="fs-nine n4-color">
                                Booked till 10 PM
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
                                <h6 className="fs-nine fw-normal n5-color">
                                  02
                                </h6>
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
                                <span className="fs-ten p4-color">
                                  Free cancellation up
                                </span>
                                <span className="fs-ten n5-color">
                                  to 48h before pick-up time
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                          <span className="fs-nine n4-color">Total 5 days</span>
                          <div className="d-grid gap-1">
                            <span className="fs-eight n5-color text-decoration-line-through">
                              $406.00
                            </span>
                            <span className="fs-three p1-color">$345.0</span>
                          </div>
                          <span className="fs-nine n4-color">
                            $ 64.99 / Daily
                          </span>
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
            </div>
          </div>
        </div>
      </section> */}
      {/* <!-- Book Online end --> */}

      {/* <!-- Review Section start --> */}
      {/* <section className="review-section sticky-area position-stickya rounded-5 rounded-bottom-0">
        <div className="container-fluid px-0">
          <div
            className="d-center position-relative pt-120 pb-120 bg-img"
            data-bg="./assets/images/review-bg.webp"
          >
            <div className="scroll-content-wrapper position-relative d-center flex-column gap-4 gap-md-5">
              <div className="round-slider">
                <div className="slider-content position-absolute d-center rounded-circle z-1 p1-bg-color">
                  <div className="progress-circles transition d-center">
                    <span className="transition progress-value fs-four"></span>
                    <h3 className="transition progress-text"></h3>
                  </div>
                </div>
              </div>
              <div className="scroll-content second row flex-nowrap gy-4 gy-md-6">
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="scroll-content third row flex-nowrap gy-4 gy-md-6">
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5 col-lg-5 col-xl-4">
                  <div className="d-center flex-column gap-2 gap-md-3 align-items-start n1-bg-color px-3 px-md-6 px-lg-10 py-5 py-md-8 py-lg-20">
                    <ul className="d-center justify-content-start gap-1 gap-md-1">
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                      <li>
                        <span className="fs-six d-center s3-color">
                          <i className="fa-solid fa-star"></i>
                        </span>
                      </li>
                    </ul>
                    <p className="fs-five fw-normal n4-color">
                      Affordable deals and excellent customer support made Beep Beep Auctions my go-to auction platform!
                    </p>
                    <div className="d-center gap-3 gap-md-4 mt-3 mt-md-5">
                      <div className="img-area box-area box-six d-center position-relative">
                        <img
                          src="assets/images/trusted-img-1.webp"
                          className="w-100 rounded-circle"
                          alt="Image"
                        />
                        <span className="icon-area d-center position-absolute rounded-circle m-n1 box-area box-two p1-bg-color bottom-0 end-0">
                          <i className="ph ph-quotes"></i>
                        </span>
                      </div>
                      <div className="text-area">
                        <h6 className="text-uppercase">
                          <span className="fw-bolder n4-color">Sarah</span>
                          <span className="fw-normal n4-color">Lewis</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* <!-- Review Section end --> */}
      {/* <!-- Cars Auction start --> */}
      <section className="cars-auction position-relative px-0 px-md-10 pb-120 mt-4">
        <div className="abs-area position-absolute top-0 end-0 pe-none mt-20">
          <span className="text-uppercase text-gradient display-two p1-color mb-n20">
            Beep
          </span>
        </div>
        <div className="container-fluid cus-padding">
          <div className="row gy-6 gy-md-0 mb-8 mb-md-15 justify-content-between align-items-end">
            <div className="col-md-8 col-lg-9 col-xl-7 col-xxl-8">
              <div className="section-area d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                <span className="p1-color fs-nine fw-semibold text-uppercase">
                  Fast & Easy Way To Buy Car Products
                </span>
                <h2 className="fs-two d-grid text-uppercase">
                  <span className="fw-bolder n4-color">
                    Join 4 Simple Steps To
                  </span>
                  <span className="fw-normal n4-color">Get Your Products!</span>
                </h2>
                <p className="n5-color max-ch">
                  Browse premium car Products from verified sellers,
                  compare prices, read reviews, and get the best deals
                  delivered to your door.
                </p>
              </div>
            </div>
            <div className="col-md-4 col-lg-3 col-xl-3 col-xxl-4">
              <div className="d-center justify-content-start justify-content-lg-end gap-1 gap-md-5">
                <span className="n4-color">
                  Easy steps for buying your Products
                </span>
                <span className="d-center cus-border b-fifth border-1 border-top h-0">
                  <span className="opacity-0 px-1 px-md-4">title</span>
                </span>
                <div className="video-bg-thumb d-center ms-8">
                  <a
                    href="https://www.youtube.com/watch?v=BHACKCNDMW8"
                    className="popup-video btn-popup-animation d-center rounded-circle"
                  >
                    <span className="d-center fs-three n1-color z-1">
                      <i className="fa-solid fa-play"></i>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="row gy-9 gy-xl-0">
            {/* Step 1 */}
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="single-item px-6 text-center d-flex flex-column gap-2">
                <div className="icon-area p1-3rd-bg-color mb-3 mb-md-6 d-center rounded-circle m-auto cus-border border b-third box-area box-four">
                  <i className="fa-solid fa-car p1-color fs-two"></i>
                </div>
                <span className="p1-color font-tertiary">Step 1</span>
                <h5 className="text-uppercase">
                  <span className="n4-color fw-bolder">Browse </span>
                  <span className="n4-color fw-normal">Products</span>
                </h5>
                <p className="n5-color mt-1">
                  Explore a wide range of car Products from trusted sellers.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="single-item px-6 text-center d-flex flex-column gap-2">
                <div className="icon-area p1-3rd-bg-color mb-3 mb-md-6 d-center rounded-circle m-auto cus-border border b-third box-area box-four">
                  <i className="fa-solid fa-gavel p1-color fs-two"></i>
                </div>
                <span className="p1-color font-tertiary">Step 2</span>
                <h5 className="text-uppercase">
                  <span className="n4-color fw-bolder">Add to </span>
                  <span className="n4-color fw-normal">Cart</span>
                </h5>
                <p className="n5-color mt-1">
                  Select your desired Products and add them to your cart.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="single-item px-6 text-center d-flex flex-column gap-2">
                <div className="icon-area p1-3rd-bg-color mb-3 mb-md-6 d-center rounded-circle m-auto cus-border border b-third box-area box-four">
                  <i className="fa-solid fa-clock p1-color fs-two"></i>
                </div>
                <span className="p1-color font-tertiary">Step 3</span>
                <h5 className="text-uppercase">
                  <span className="n4-color fw-bolder">Secure </span>
                  <span className="n4-color fw-normal">Checkout</span>
                </h5>
                <p className="n5-color mt-1">
                  Complete your purchase with our secure payment system.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="single-item px-6 text-center d-flex flex-column gap-2">
                <div className="icon-area p1-3rd-bg-color mb-3 mb-md-6 d-center rounded-circle m-auto cus-border border b-third box-area box-four">
                  <i className="fa-solid fa-sack-dollar p1-color fs-two"></i>
                </div>
                <span className="p1-color font-tertiary">Step 4</span>
                <h5 className="text-uppercase">
                  <span className="n4-color fw-bolder">Receive </span>
                  <span className="n4-color fw-normal">Your Products</span>
                </h5>
                <p className="n5-color mt-1">
                  Get fast, secure delivery right to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Cars Auction end --> */}

      {/* <!-- Newsletter Section start --> */}
      <section className="newsletter-section position-relative px-0 px-md-10 pt-120 pb-120">
        <div className="container-fluid cus-padding">
          <div className="row align-items-stretch g-0">
            {/* Left Side - Newsletter Signup */}
            <div className="col-lg-6">
              <div
                className="newsletter-content h-100 d-flex flex-column justify-content-center"
                style={{
                  backgroundColor: "#FBE5E6",
                  padding: "80px 60px",
                  minHeight: "400px",
                }}
              >
                <div className="content-wrapper" style={{ boxShadow: "none" }}>
                  {/* Main Heading */}
                  <h2 className="fs-two text-uppercase fw-bolder n4-color mb-4">
                    GET DAILY UPDATES FROM
                    <br />
                    <span className="p1-color">Beep Beep</span>
                  </h2>

                  {/* Description */}
                  <p className="fs-six n5-color lh-base mb-5">
                    FILLED WITH THE LATEST PART LISTINGS, DEALS,
                    <br />
                    AND MAINTENANCE TIPS.
                  </p>

                  {/* Email Form */}
                  <form onSubmit={handleNewsletterSubmit}>
                  <div className="email-form-container d-flex gap-3">
                    <input
                      type="email"
                      className="form-control rounded-pill py-3 px-4"
                      placeholder="Enter your email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        disabled={isSubmitting}
                      style={{
                        backgroundColor: "white",
                        border: "2px solid #e2e8f0",
                        fontSize: "16px",
                        color: "#333",
                        flex: "1",
                      }}
                    />
                    <button
                      type="submit"
                        disabled={isSubmitting}
                      className="box-style style-one n4-bg-color rounded-pill d-center py-3 px-6"
                    >
                      <span className="fs-nine fw-semibold text-nowrap text-uppercase transition n1-color">
                          {isSubmitting ? "SIGNING UP..." : "SIGN ME UP!"}
                      </span>
                    </button>
                  </div>
                    
                    {/* Status Message */}
                    {newsletterStatus && (
                      <div className="mt-3">
                        <p className={`mb-0 ${newsletterStatus.includes('🎉') ? 'text-success' : 'text-danger'}`}>
                          {newsletterStatus}
                        </p>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Right Side - Upcoming Events */}
            <div className="col-lg-6">
              <div
                className="events-section h-100 d-flex flex-column justify-content-center"
                style={{
                  backgroundColor: "#D70007",
                  padding: "80px 60px",
                  minHeight: "400px",
                }}
              >
                <div className="events-content">
                  {/* Events Heading */}
                  <h2 className="fs-two text-uppercase fw-bolder n1-color mb-4">
                    FEATURED BRANDS
                  </h2>

                  {/* Event Details */}
                  <div className="event-details mb-4">
                    <h3
                      className="n1-color mb-3 fs-four fw-bold text-uppercase"
                      style={{
                        lineHeight: "1.2",
                      }}
                    >
                      PREMIUM Products FROM TOP BRANDS
                    </h3>

                    <p className="n1-color mb-4 fs-seven fw-medium">
                      Bosch • Denso • NGK • Brembo • Monroe
                    </p>
                  </div>

                  {/* Learn More Button */}
                  <button
                    className="box-style style-one rounded-pill cus-border border transition d-center py-3 px-6"
                    style={{
                      backgroundColor: "white",
                      color: "#D70007",
                    }}
                  >
                    <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                      Browse Products
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Newsletter Section end --> */}

      <Footer />
    </div>
  );
};

export default Home;
