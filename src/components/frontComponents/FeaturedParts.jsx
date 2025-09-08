import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiStar, FiEye, FiShoppingCart } from "react-icons/fi";
import { apiRequest } from "../../api/client";

const FeaturedParts = () => {
  const [featuredParts, setFeaturedParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

  const toAbsUrl = (url) => {
    if (!url) return "/assets/images/handpicked-img-1.webp";
    if (url.startsWith("http")) return url;
    return `${apiBase}${url}`;
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
  const getPartImages = (part) => {
    if (!part) return [];
    
    // First try to get images from media array
    if (part.media && part.media.length > 0) {
      console.log("Using media array for part:", part.name, part.media);
      return part.media.map(media => media.url);
    }
    
    // If no media, try to extract from descriptionHtml
    if (part.descriptionHtml) {
      const extractedImages = extractImagesFromHtml(part.descriptionHtml);
      console.log("Extracted images from HTML for part:", part.name, extractedImages);
      return extractedImages;
    }
    
    console.log("No images found for part:", part.name);
    return [];
  };

  useEffect(() => {
    const fetchFeaturedParts = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/api/parts/featured?limit=10", {
          method: "GET",
        });
        console.log("Featured parts response:", response);
        console.log("Featured parts count:", response.parts?.length || 0);
        console.log("Featured parts data:", response.parts);
        setFeaturedParts(response.parts || []);
      } catch (err) {
        console.error("Error fetching featured parts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedParts();
  }, []);

  if (loading) {
    return (
      <section className="cars-rent position-relative px-0 px-md-10 pt-120 pb-120">
        <div className="abs-area position-absolute top-0 end-0 pe-none mt-20">
          <span className="text-uppercase text-gradient display-two p1-color mb-n20 me-20">
            PARTS
          </span>
        </div>
        <div className="container-fluid cus-padding">
          <div className="row gy-6 gy-md-0 mb-4 mb-md-6 justify-content-between align-items-end">
            <div className="col-md-8 col-lg-9 col-xl-7 col-xxl-5">
              <div className="section-area d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                <div className="d-center justify-content-start gap-2">
                  <span className="p1-color fs-nine fw-semibold text-uppercase">
                    Premium Quality Products
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
                  <span className="fw-bolder n4-color">Featured </span>
                  <span className="fw-normal n4-color">Car Products</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="spinner-border p1-color" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="cars-rent position-relative px-0 px-md-10 pt-120 pb-120">
        <div className="abs-area position-absolute top-0 end-0 pe-none mt-20">
          <span className="text-uppercase text-gradient display-two p1-color mb-n20 me-20">
            PRODUCTS
          </span>
        </div>
        <div className="container-fluid cus-padding">
          <div className="row gy-6 gy-md-0 mb-4 mb-md-6 justify-content-between align-items-end">
            <div className="col-md-8 col-lg-9 col-xl-7 col-xxl-5">
              <div className="section-area d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                <div className="d-center justify-content-start gap-2">
                  <span className="p1-color fs-nine fw-semibold text-uppercase">
                    Premium Quality Products
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
                  <span className="fw-bolder n4-color">Featured </span>
                  <span className="fw-normal n4-color">Car Parts</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-danger">Error loading parts: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cars-rent position-relative px-0 px-md-10 pt-120 pb-120">
      <div className="abs-area position-absolute top-0 end-0 pe-none mt-20">
        <span className="text-uppercase text-gradient display-two p1-color mb-n20 me-20">
          PARTS
        </span>
      </div>
      <div className="container-fluid cus-padding">
        <div className="row gy-6 gy-md-0 mb-4 mb-md-6 justify-content-between align-items-end">
          <div className="col-md-8 col-lg-9 col-xl-7 col-xxl-5">
            <div className="section-area d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
              <div className="d-center justify-content-start gap-2">
                <span className="p1-color fs-nine fw-semibold text-uppercase">
                  Premium Quality Products
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
                <span className="fw-bolder n4-color">Featured </span>
                <span className="fw-normal n4-color">Car Parts</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="row gy-9 gy-xl-0">
          <div className="col-12">
            <div className="row g-6 g-md-5 justify-content-center justify-content-md-start">
              {featuredParts.map((part) => (
                <div key={part._id} className="col-11 col-md-6 col-xxl-4">
                  <div className="single-item transition cus-border border b-fourth rounded-3 bg-white">
                    <div className="d-center px-4 px-md-5 py-3 py-md-4 justify-content-between">
                      <div className="d-grid gap-2">
                        <h5 className="n4-color transition fw-bold">
                          {part.name}
                        </h5>
                        <span className="n4-color transition fw-medium fs-nine">
                          {part.brand}
                        </span>
                      </div>
                      <div className="btn-area">
                        <button className="d-center border-0 bg-transparent">
                          <span className="d-center transition fs-three n4-color">
                            <FiShoppingCart />
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Image Area */}
                    <div className="img-container position-relative">
                      <div className="img-area text-center">
                        {getPartImages(part).length > 0 ? (
                          <img
                            src={toAbsUrl(getPartImages(part)[0])}
                            className="w-100"
                            alt={part.name}
                            style={{ height: "250px", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src = "/assets/images/handpicked-img-1.webp";
                            }}
                          />
                        ) : (
                          <div 
                            className="w-100 d-center"
                            style={{ 
                              height: "250px", 
                              backgroundColor: "#f8f9fa",
                              color: "#6c757d",
                              fontSize: "1rem"
                            }}
                          >
                            No Image Available
                          </div>
                        )}
                      </div>
                      
                      {/* Overlay with Stats */}
                      <div className="bottom-area position-absolute bottom-0 w-100 z-1 p-3 p-md-4 d-center justify-content-between">
                        <div className="d-center flex-wrap flex-xxl-nowrap gap-2 gap-md-3 justify-content-start">
                          <span className="rounded-pill n1-bg-color cus-border border b-fourth d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-six d-center text-warning">
                              <FiStar />
                            </span>
                            <span className="fs-nine n4-color fw-semibold">
                              {part.reviews?.averageRating?.toFixed(1) || "0.0"}
                            </span>
                            <span className="fs-nine n5-color">
                              ({part.reviews?.totalReviews || 0})
                            </span>
                          </span>
                          <span className="rounded-pill n3-bg-color d-center gap-1 py-2 px-3 px-md-4">
                            <span className="fs-six d-center n4-color">
                              <FiEye />
                            </span>
                            <span className="fs-nine n4-color">
                              {part.views || 0} views
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Part Details */}
                    <div className="row g-0 h-100">
                      <div className="col-lg-8">
                        <div className="row g-0">
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-1.webp"
                                  className="max-un"
                                  alt="condition"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                {part.condition?.toUpperCase() || "NEW"}
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-2.webp"
                                  className="max-un"
                                  alt="brand"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                {part.brand?.toUpperCase() || "BRAND"}
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-3.webp"
                                  className="max-un"
                                  alt="category"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                {part.category?.replace('_', ' ').toUpperCase() || "CATEGORY"}
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-4.webp"
                                  className="max-un"
                                  alt="warranty"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                {part.warranty || "NO WARRANTY"}
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <div className="d-grid gap-2 py-5 py-md-7 text-center cus-border border b-fourth">
                              <div className="icon-area">
                                <img
                                  src="assets/images/icon/handpicked-icon-5.webp"
                                  className="max-un"
                                  alt="stock"
                                />
                              </div>
                              <h6 className="fs-nine fw-normal n5-color">
                                {part.quantity > 0 ? "IN STOCK" : "OUT OF STOCK"}
                              </h6>
                            </div>
                          </div>
                          <div className="col-6 col-lg-4">
                            <Link
                              to={`/part/${part._id}`}
                              className="d-grid gap-2 h-100 text-center cus-border border b-fourth text-decoration-none"
                            >
                              <span className="fs-six d-center p1-color mb-n3">
                                <i className="ph ph-caret-right"></i>
                              </span>
                              <p className="fs-nine fw-normal p1-color">
                                View Details
                              </p>
                            </Link>
                          </div>
                        </div>
                        <div className="free-cancellation py-3 py-md-4">
                          <div className="d-center gap-2">
                            <span className="fs-six d-center p4-color">
                              <i className="ph ph-check"></i>
                            </span>
                            <div className="text-area">
                              <span className="fs-ten p4-color">Free shipping </span>
                              <span className="fs-ten n5-color">on orders over $100</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 px-6 d-center text-center py-4 py-md-6 px-3 px-md-4 gap-2 flex-column p1-2nd-bg-color">
                        <span className="fs-nine n4-color">
                          {part.seller?.username || "Seller"}
                        </span>
                        <div className="d-grid gap-1">
                          <span className="fs-nine n4-color">Price</span>
                          <span className="fs-three p1-color">
                            ${part.price?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                        <div className="btn-area d-grid gap-1 gap-md-2 mt-2 mt-md-3">
                          <Link
                            to={`/part/${part._id}`}
                            className="box-style style-one n4-bg-color rounded-pill d-center py-2 py-md-3 px-3 px-md-6 text-decoration-none"
                          >
                            <span className="fs-nine fw-semibold text-nowrap text-uppercase transition text-white">
                              Buy Now
                            </span>
                          </Link>
                          <Link
                            to={`/part/${part._id}`}
                            className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 px-3 px-md-6 text-decoration-none"
                          >
                            <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                              View Details
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="btn-area d-center mt-6 mt-md-10">
              <Link
                to="/parts"
                className="box-style style-one rounded-pill cus-border border transition d-center py-2 py-md-3 py-lg-4 px-3 px-md-6 text-decoration-none"
              >
                <span className="fs-nine n4-color fw-semibold text-nowrap text-uppercase transition">
                  Explore More Products
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedParts;