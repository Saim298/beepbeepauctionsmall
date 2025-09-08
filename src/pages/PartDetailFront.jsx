import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiMessageSquare,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiPackage,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiStar,
} from "react-icons/fi";
import { HiHome, HiChevronRight } from "react-icons/hi";
import { getAuthToken } from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";
import ReviewsList from "../components/ReviewsList.jsx";
import StarRating from "../components/StarRating.jsx";

const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

// Add CSS animations and custom styles
const styles = `
  <style>
    .hover-lift {
      transition: transform 0.2s ease-in-out;
    }
    .hover-lift:hover {
      transform: translateY(-2px);
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #D70007 0%, #B80006 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .7; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .box-style {
      border: none;
      border-radius: 50px;
      font-weight: 600;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .style-two {
      background-color: #D70007;
      color: #ffffff;
    }
    
    .style-two:hover {
      background-color: #B80006;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(215, 0, 7, 0.3);
    }
    
    .p1-bg-color {
      background-color: #D70007;
    }
    
    .d-center {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .rounded-pill {
      border-radius: 50px;
    }
    
    .py-3 { padding-top: 12px; padding-bottom: 12px; }
    .py-md-4 { padding-top: 16px; padding-bottom: 16px; }
    .px-3 { padding-left: 12px; padding-right: 12px; }
    .px-md-4 { padding-left: 16px; padding-right: 16px; }
    .px-xl-6 { padding-left: 24px; padding-right: 24px; }
  </style>
`;

const PartDetailFront = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemByPartId } = useCart();
  const [part, setPart] = useState(null);
  const [similarParts, setSimilarParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [sellerTopProducts, setSellerTopProducts] = useState([]);
  const [sellerProductsLoading, setSellerProductsLoading] = useState(false);

  // Normalize relative upload paths to absolute URLs
  const toAbsUrl = (u) => {
    if (!u) return "/assets/images/handpicked-img-1.webp";
    if (u.startsWith("http") || u.startsWith("data:")) return u;
    const cleanUrl = u.startsWith("/") ? u : `/${u}`;
    return `${apiBase}${cleanUrl}`;
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
    if (part?.media && part.media.length > 0) {
      return part.media.map((media) => media.url);
    }
    return extractImagesFromHtml(part?.descriptionHtml);
  };

  // Get current user
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetch(`${apiBase}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(console.error);
    }
  }, []);

  // Fetch latest reviews for the part
  const fetchLatestReviews = async (partId) => {
    try {
      setReviewsLoading(true);
      const response = await fetch(
        `${apiBase}/api/reviews/parts/${partId}?limit=5&sort=newest`
      );
      const data = await response.json();

      if (response.ok && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch seller's top products
  const fetchSellerTopProducts = async (sellerId, currentPartId) => {
    try {
      setSellerProductsLoading(true);
      const response = await fetch(
        `${apiBase}/api/parts?seller=${sellerId}&limit=3&sort=popular`
      );
      const data = await response.json();

      if (response.ok && data.parts) {
        // Filter out the current part and get top 2
        const filteredProducts = data.parts
          .filter((product) => product._id !== currentPartId)
          .slice(0, 2);
        setSellerTopProducts(filteredProducts);
      }
    } catch (error) {
      console.error("Error fetching seller products:", error);
    } finally {
      setSellerProductsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render individual review card
  const renderReviewCard = (review) => (
    <div
      key={review._id}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid rgba(215, 0, 7, 0.1)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        {/* User Avatar */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#FBE5E6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {review.reviewer?.avatarUrl ? (
            <img
              src={toAbsUrl(review.reviewer.avatarUrl)}
              alt={review.reviewer.username}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            style={{
              display: review.reviewer?.avatarUrl ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#D70007",
            }}
          >
            {review.reviewer?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>

        {/* Review Content */}
        <div style={{ flex: 1 }}>
          {/* User Info and Rating */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "8px",
            }}
          >
            <div>
              <h6
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#000000",
                }}
              >
                {review.reviewer?.username || "Anonymous"}
              </h6>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#666666",
                }}
              >
                {formatDate(review.createdAt)}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <StarRating rating={review.rating} size="sm" />
              {review.verifiedPurchase && (
                <span
                  style={{
                    backgroundColor: "#D70007",
                    color: "#ffffff",
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontWeight: "500",
                  }}
                >
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          {/* Review Title */}
          {review.title && (
            <h6
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
                color: "#000000",
              }}
            >
              {review.title}
            </h6>
          )}

          {/* Review Comment */}
          <p
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              color: "#333333",
              lineHeight: "1.5",
            }}
          >
            {review.comment}
          </p>

          {/* Detailed Ratings */}
          {(review.qualityRating ||
            review.shippingRating ||
            review.valueRating) && (
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                padding: "12px",
                backgroundColor: "#FBE5E6",
                borderRadius: "8px",
              }}
            >
              {review.qualityRating && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#000000",
                      fontWeight: "500",
                    }}
                  >
                    Quality:
                  </span>
                  <StarRating rating={review.qualityRating} size="sm" />
                </div>
              )}
              {review.shippingRating && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#000000",
                      fontWeight: "500",
                    }}
                  >
                    Shipping:
                  </span>
                  <StarRating rating={review.shippingRating} size="sm" />
                </div>
              )}
              {review.valueRating && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#000000",
                      fontWeight: "500",
                    }}
                  >
                    Value:
                  </span>
                  <StarRating rating={review.valueRating} size="sm" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Load part data and track view
  useEffect(() => {
    const controller = new AbortController();

    // Fetch part details and track view
    fetch(`${apiBase}/api/parts/${id}`, {
      signal: controller.signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("🎯 Raw part response:", data);

        if (data.error) {
          setError(data.error);
        } else {
          setPart(data.part);
          setSimilarParts(data.similarParts || []);
          // Fetch reviews for this part
          if (data.part && data.part._id) {
            fetchLatestReviews(data.part._id);
          }
          // Fetch seller's top products
          if (data.part && data.part.seller && data.part.seller._id) {
            fetchSellerTopProducts(data.part.seller._id, data.part._id);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load part details");
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  const getConditionBadge = (condition) => {
    const badges = {
      new: {
        style: { backgroundColor: "#D70007", color: "#ffffff" },
        text: "New",
        icon: "✨",
      },
      used_excellent: {
        style: { backgroundColor: "#FBE5E6", color: "#D70007" },
        text: "Used - Excellent",
        icon: "⭐",
      },
      used_good: {
        style: { backgroundColor: "#FBE5E6", color: "#D70007" },
        text: "Used - Good",
        icon: "👍",
      },
      used_fair: {
        style: { backgroundColor: "#FBE5E6", color: "#D70007" },
        text: "Used - Fair",
        icon: "👌",
      },
      refurbished: {
        style: { backgroundColor: "#FBE5E6", color: "#D70007" },
        text: "Refurbished",
        icon: "🔧",
      },
      remanufactured: {
        style: { backgroundColor: "#000000", color: "#ffffff" },
        text: "Remanufactured",
        icon: "♻️",
      },
    };
    return (
      badges[condition] || {
        style: { backgroundColor: "#FBE5E6", color: "#D70007" },
        text: condition,
        icon: "📦",
      }
    );
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert("Please sign in to add items to cart");
      navigate("/signin");
      return;
    }

    if (quantity > part.quantity) {
      alert(`Only ${part.quantity} items available in stock`);
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(part, quantity);
      
      // Show success message without alert for better UX
      // The button will automatically update to show "In Cart" state
      
      // Optionally redirect to cart
      const goToCart = confirm(
        "Item added to cart! Would you like to view your cart?"
      );
      if (goToCart) {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.message || "Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleChatWithSeller = () => {
    if (!currentUser) {
      alert("Please sign in to chat with seller");
      navigate("/signin");
      return;
    }

    const images = getPartImages();
    // Navigate to chat with part context
    navigate("/chat", {
      state: {
        partId: part._id,
        partName: part.name,
        partPrice: part.price,
        partImage:
          images.length > 0
            ? toAbsUrl(images[0])
            : "/assets/images/handpicked-img-1.webp",
        vendorId: part.seller._id,
        vendorName: part.seller.username,
      },
    });
  };

  if (loading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading part details...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h3>Error</h3>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/parts")}
          >
            ← Back to Parts
          </button>
        </div>
      </div>
    );

  if (!part) return null;

  const conditionBadge = getConditionBadge(part.condition);
  const isOwnPart = currentUser && part.seller._id === currentUser.id;
  const isInStock = part.quantity > 0;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: styles }} />
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
        {/* Premium Header */}
        <header
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderBottom: "1px solid rgba(215, 0, 7, 0.1)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <div style={{ padding: "16px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <nav aria-label="breadcrumb">
                <ol
                  style={{
                    display: "flex",
                    alignItems: "center",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    backgroundColor: "transparent",
                  }}
                >
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <a
                      href="/"
                      style={{
                        textDecoration: "none",
                        color: "#000000",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <HiHome size={18} style={{ color: "#D70007" }} />
                      Home
                    </a>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "0 8px",
                    }}
                  >
                    <HiChevronRight size={14} style={{ color: "#D70007" }} />
                  </li>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <a
                      href="/parts"
                      style={{
                        textDecoration: "none",
                        color: "#000000",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FiPackage size={18} style={{ color: "#D70007" }} />
                      Spare Parts
                    </a>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "0 8px",
                    }}
                  >
                    <HiChevronRight size={14} style={{ color: "#D70007" }} />
                  </li>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        color: "#D70007",
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      {part.name}
                    </span>
                  </li>
                </ol>
              </nav>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span
                  style={{
                    ...conditionBadge.style,
                    padding: "8px 16px",
                    borderRadius: "25px",
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {conditionBadge.icon} {conditionBadge.text}
                </span>
                {part.oem && (
                  <span
                    style={{
                      backgroundColor: "#FBE5E6",
                      color: "#D70007",
                      padding: "8px 16px",
                      borderRadius: "25px",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🏭 OEM Part
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ padding: "32px 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "32px",
              alignItems: "start",
            }}
          >
            {/* Left Column - Media and Details */}
            <div>
              {/* Premium Part Title Section */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  padding: "24px",
                  marginBottom: "24px",
                  border: "1px solid rgba(215, 0, 7, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "300px" }}>
                    <h1
                      style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "#000000",
                        marginBottom: "16px",
                        lineHeight: "1.2",
                      }}
                    >
                      {part.name}
                    </h1>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        flexWrap: "wrap",
                      }}
                    >
                      {part.brand && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            style={{
                              fontWeight: "600",
                              backgroundColor: "#FBE5E6",
                              color: "#D70007",
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontSize: "14px",
                            }}
                          >
                            {part.brand}
                          </span>
                        </div>
                      )}
                      {part.partNumber && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "8px" }}>📋</span>
                          <span
                            style={{ fontWeight: "500", color: "#000000" }}
                            className="text-dark"
                          >
                            Part #{part.partNumber}
                          </span>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FiEye
                          size={16}
                          style={{ marginRight: "8px", color: "#D70007" }}
                        />
                        <span style={{ fontWeight: "500", color: "#000000" }}>
                          {part.views || 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{
                        padding: "8px 16px",
                        border: "1px solid rgba(215, 0, 7, 0.2)",
                        borderRadius: "20px",
                        backgroundColor: "#ffffff",
                        color: "#D70007",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#FBE5E6";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#ffffff";
                      }}
                    >
                      <FiShare2 size={14} />
                      Share
                    </button>
                    <button
                      style={{
                        padding: "8px 16px",
                        border: "1px solid rgba(215, 0, 7, 0.2)",
                        borderRadius: "20px",
                        backgroundColor: "#ffffff",
                        color: "#D70007",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#FBE5E6";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#ffffff";
                      }}
                    >
                      <FiHeart size={14} />
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Premium Media Gallery */}
              <div className="bg-white rounded-4 shadow-sm mb-4 border-0 overflow-hidden">
                <div className="position-relative" style={{ height: "500px" }}>
                  {(() => {
                    const images = getPartImages();
                    const media =
                      images.length > 0
                        ? images.map((url) => ({ url, type: "image" }))
                        : [
                            {
                              url: "/assets/images/handpicked-img-1.webp",
                              type: "image",
                            },
                          ];

                    const m = media[Math.min(activeIdx, media.length - 1)];
                    const mediaUrl = toAbsUrl(m.url);

                    return m?.type === "video" ? (
                      <video
                        src={mediaUrl}
                        controls
                        className="w-100 h-100"
                        style={{
                          objectFit: "cover",
                          borderRadius: "1rem 1rem 0 0",
                        }}
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={part.name}
                        className="w-100 h-100"
                        style={{
                          objectFit: "cover",
                          borderRadius: "1rem 1rem 0 0",
                        }}
                        onError={(e) => {
                          e.target.src = "/assets/images/handpicked-img-1.webp";
                        }}
                      />
                    );
                  })()}

                  {/* Premium Overlay Elements */}
                  <div className="position-absolute top-0 start-0 p-4">
                    <div className="d-flex gap-2">
                      <span className="badge bg-white text-dark px-3 py-2 rounded-pill fw-semibold shadow-sm">
                        <FiPackage className="me-2" size={14} />
                        Spare Part
                      </span>
                      {isInStock ? (
                        <span className="badge bg-success text-white px-3 py-2 rounded-pill fw-semibold shadow-sm">
                          ✅ In Stock ({part.quantity})
                        </span>
                      ) : (
                        <span className="badge bg-danger text-white px-3 py-2 rounded-pill fw-semibold shadow-sm">
                          ❌ Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Media counter */}
                  {(() => {
                    const images = getPartImages();
                    return (
                      images.length > 1 && (
                        <div className="position-absolute bottom-0 start-0 p-4">
                          <span className="badge bg-black bg-opacity-75 text-white px-3 py-2 rounded-pill">
                            📷 {activeIdx + 1} / {images.length}
                          </span>
                        </div>
                      )
                    );
                  })()}

                  {/* Premium Navigation Arrows */}
                  {(() => {
                    const images = getPartImages();
                    return (
                      images.length > 1 && (
                        <>
                          <button
                            className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle shadow-sm"
                            style={{
                              width: "50px",
                              height: "50px",
                              opacity: 0.9,
                            }}
                            onClick={() =>
                              setActiveIdx(
                                activeIdx > 0
                                  ? activeIdx - 1
                                  : images.length - 1
                              )
                            }
                          >
                            <i className="fas fa-chevron-left text-dark"></i>
                          </button>
                          <button
                            className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle shadow-sm"
                            style={{
                              width: "50px",
                              height: "50px",
                              opacity: 0.9,
                            }}
                            onClick={() =>
                              setActiveIdx(
                                activeIdx < images.length - 1
                                  ? activeIdx + 1
                                  : 0
                              )
                            }
                          >
                            <i className="fas fa-chevron-right text-dark"></i>
                          </button>
                        </>
                      )
                    );
                  })()}
                </div>

                {/* Premium Thumbnails */}
                {(() => {
                  const images = getPartImages();
                  return (
                    images.length > 1 && (
                      <div className="p-4 bg-light bg-opacity-50">
                        <div
                          className="d-flex gap-3 overflow-auto"
                          style={{ scrollbarWidth: "thin" }}
                        >
                          {images.map((imageUrl, i) => {
                            const thumbUrl = toAbsUrl(imageUrl);
                            return (
                              <button
                                key={i}
                                className={`btn p-0 border-0 position-relative overflow-hidden ${
                                  activeIdx === i ? "ring ring-primary" : ""
                                }`}
                                onClick={() => setActiveIdx(i)}
                                style={{
                                  width: "100px",
                                  height: "75px",
                                  flexShrink: 0,
                                  borderRadius: "12px",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                <img
                                  src={thumbUrl}
                                  alt={`${part.name}-${i}`}
                                  className="w-100 h-100"
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                  }}
                                  onError={(e) => {
                                    e.target.src =
                                      "/assets/images/handpicked-img-1.webp";
                                  }}
                                />
                                {activeIdx === i && (
                                  <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                    style={{
                                      backgroundColor: "rgba(0,123,255,0.2)",
                                    }}
                                  >
                                    <i
                                      className="fas fa-play-circle text-primary"
                                      style={{ fontSize: "24px" }}
                                    ></i>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )
                  );
                })()}
              </div>

              {/* Premium Products Specifications */}
              <div className="bg-white rounded-4 shadow-sm mb-4 border-0">
                <div className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <i
                        className="fas fa-cog text-primary"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                    <div>
                      <h3 className="fw-bold text-dark mb-1">
                        Products Specifications
                      </h3>
                      <p className="text-secondary mb-0">
                        Detailed information about this part
                      </p>
                    </div>
                  </div>

                  <div className="row g-4">
                    {part.category && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-tag text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {part.category.replace("_", " ")}
                            </div>
                            <small className="text-secondary">Category</small>
                          </div>
                        </div>
                      </div>
                    )}

                    {part.compatibility && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-car text-success"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {part.compatibility}
                            </div>
                            <small className="text-secondary">
                              Compatibility
                            </small>
                          </div>
                        </div>
                      </div>
                    )}

                    {part.material && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-cube text-info"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {part.material}
                            </div>
                            <small className="text-secondary">Material</small>
                          </div>
                        </div>
                      </div>
                    )}

                    {part.weight && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-weight text-warning"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {part.weight} lbs
                            </div>
                            <small className="text-secondary">Weight</small>
                          </div>
                        </div>
                      </div>
                    )}

                    {part.dimensions && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-ruler text-secondary"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {part.dimensions}
                            </div>
                            <small className="text-secondary">Dimensions</small>
                          </div>
                        </div>
                      </div>
                    )}

                    {part.color && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-palette text-danger"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {part.color}
                            </div>
                            <small className="text-secondary">Color</small>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {part.descriptionHtml && (
                    <div className="mt-5">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="fas fa-file-alt text-primary"></i>
                        </div>
                        <h5 className="fw-bold text-dark mb-0">Description</h5>
                      </div>
                      <div className="p-4 bg-light bg-opacity-30 rounded-3">
                        <div
                          className="text-dark lh-lg"
                          style={{ fontSize: "16px" }}
                          dangerouslySetInnerHTML={{
                            __html: part.descriptionHtml,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Warranty & Returns */}
              <div className="bg-white rounded-4 shadow-sm border-0">
                <div className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                      <FiShield className="text-success" size={24} />
                    </div>
                    <div>
                      <h3 className="fw-bold text-dark mb-1">
                        Warranty & Returns
                      </h3>
                      <p className="text-secondary mb-0">
                        Protection and return policies for this part
                      </p>
                    </div>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                        <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                          <FiShield className="text-success" size={16} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">
                            {part.warranty
                              ? part.warranty.replace("_", " ")
                              : "No Warranty"}
                          </div>
                          <small className="text-secondary">Warranty</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                        <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                          <FiRotateCcw className="text-info" size={16} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">
                            {part.returnPolicy
                              ? part.returnPolicy.replace("_", " ")
                              : "No Returns"}
                          </div>
                          <small className="text-secondary">
                            Return Policy
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Purchase */}
            <div>
              {/* Premium Price Card */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                  marginBottom: "24px",
                  border: "1px solid rgba(215, 0, 7, 0.1)",
                  position: "sticky",
                  top: "100px",
                }}
              >
                <div style={{ padding: "32px", textAlign: "center" }}>
                  <div
                    style={{
                      backgroundColor: "#FBE5E6",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                      width: "60px",
                      height: "60px",
                    }}
                  >
                    <FiPackage style={{ color: "#D70007" }} size={28} />
                  </div>
                  <h6
                    style={{
                      color: "#666666",
                      marginBottom: "12px",
                      fontWeight: "600",
                      fontSize: "14px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    PART PRICE
                  </h6>
                  <h1
                    style={{
                      fontSize: "48px",
                      fontWeight: "bold",
                      color: "#000000",
                      marginBottom: "16px",
                      fontFamily: "monospace",
                    }}
                  >
                    ${part.price?.toLocaleString() || "0"}
                  </h1>

                   {/* Stock Status */}
                   <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                     <div className="single-item d-center justify-content-start gap-2 bg-light rounded-pill py-2 px-3">
                       <span className="d-center rounded-circle bg-white shadow-sm p-2">
                         <FiPackage size={14} className="text-primary" />
                       </span>
                       <span className="text-dark fw-bold fs-sm">
                         {isInStock
                           ? `${part.quantity} in stock`
                           : "Out of stock"}
                       </span>
                     </div>
                     {isInCart(part._id) && (
                       <div className="single-item d-center justify-content-start gap-2 bg-success rounded-pill py-2 px-3">
                         <span className="d-center rounded-circle bg-white shadow-sm p-2">
                           <FiShoppingCart size={14} className="text-success" />
                         </span>
                         <span className="text-white fw-bold fs-sm">
                           In Cart
                         </span>
                       </div>
                     )}
                   </div>

                  {/* Quantity Selector */}
                  {isInStock && !isOwnPart && (
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Quantity
                      </label>
                      <div className="d-flex align-items-center justify-content-center gap-3">
                        <button
                          className="btn btn-outline-secondary rounded-circle"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          style={{ width: "40px", height: "40px" }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control text-center fw-bold"
                          style={{ width: "80px" }}
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(
                              Math.max(
                                1,
                                Math.min(
                                  part.quantity,
                                  parseInt(e.target.value) || 1
                                )
                              )
                            )
                          }
                          min="1"
                          max={part.quantity}
                        />
                        <button
                          className="btn btn-outline-secondary rounded-circle"
                          onClick={() =>
                            setQuantity(Math.min(part.quantity, quantity + 1))
                          }
                          style={{ width: "40px", height: "40px" }}
                        >
                          +
                        </button>
                      </div>
                      <small className="text-muted">
                        Total: $
                        {((part.price || 0) * quantity).toLocaleString()}
                      </small>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!isOwnPart && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        marginBottom: "24px",
                      }}
                    >
                       {isInStock ? (
                         <button
                           className="box-style style-two rounded-pill p1-bg-color d-center py-3 py-md-4 px-3 px-md-4 px-xl-6"
                           onClick={handleAddToCart}
                           disabled={addingToCart}
                           style={{
                             padding: "16px 32px",
                             fontWeight: "600",
                             fontSize: "16px",
                             width: "100%",
                             backgroundColor: isInCart(part._id) ? "#28a745" : "#D70007",
                           }}
                         >
                           {addingToCart ? (
                             <>
                               <div
                                 style={{
                                   width: "20px",
                                   height: "20px",
                                   border: "2px solid #ffffff",
                                   borderTop: "2px solid transparent",
                                   borderRadius: "50%",
                                   animation: "spin 1s linear infinite",
                                   marginRight: "8px",
                                 }}
                               ></div>
                               Adding to Cart...
                             </>
                           ) : (
                             <>
                               <FiShoppingCart
                                 style={{ marginRight: "8px" }}
                                 size={18}
                               />
                               {isInCart(part._id) ? "In Cart" : "Add to Cart"}
                             </>
                           )}
                         </button>
                      ) : (
                        <button
                          style={{
                            padding: "16px 32px",
                            fontWeight: "600",
                            fontSize: "16px",
                            width: "100%",
                            backgroundColor: "#666666",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "50px",
                            cursor: "not-allowed",
                          }}
                          disabled
                        >
                          Out of Stock
                        </button>
                      )}

                      <button
                        onClick={handleChatWithSeller}
                        style={{
                          padding: "16px 32px",
                          fontWeight: "600",
                          fontSize: "16px",
                          width: "100%",
                          backgroundColor: "#ffffff",
                          color: "#D70007",
                          border: "2px solid #D70007",
                          borderRadius: "50px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#D70007";
                          e.target.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#ffffff";
                          e.target.style.color = "#D70007";
                        }}
                      >
                        <FiMessageSquare
                          style={{ marginRight: "8px" }}
                          size={18}
                        />
                        Chat with Seller
                      </button>
                    </div>
                  )}

                  {isOwnPart && (
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      This is your listing
                    </div>
                  )}

                  {/* Features */}
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    {part.warranty && part.warranty !== "none" && (
                      <span className="badge bg-success bg-opacity-20 text-white">
                        <FiShield size={12} className="me-1" />
                        Warranty
                      </span>
                    )}
                    {part.returnPolicy &&
                      part.returnPolicy !== "no_returns" && (
                        <span className="badge bg-info bg-opacity-20 text-white">
                          <FiRotateCcw size={12} className="me-1" />
                          Returns
                        </span>
                      )}
                    <span className="badge bg-primary bg-opacity-20 text-white">
                      <FiTruck size={12} className="me-1" />
                      Fast Shipping
                    </span>
                  </div>
                </div>
              </div>

              {/* Overall Rating Summary */}
              {part.reviews && part.reviews.totalReviews > 0 && (
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    marginBottom: "24px",
                    border: "1px solid rgba(215, 0, 7, 0.1)",
                    padding: "24px",
                  }}
                >
                  <h5
                    style={{
                      fontWeight: "bold",
                      color: "#000000",
                      marginBottom: "16px",
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FiStar style={{ color: "#D70007" }} size={18} />
                    Customer Rating
                  </h5>

                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        color: "#000000",
                        lineHeight: "1",
                      }}
                    >
                      {part.reviews.averageRating.toFixed(1)}
                    </div>
                    <div style={{ margin: "8px 0" }}>
                      <StarRating
                        rating={part.reviews.averageRating}
                        size="md"
                      />
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#666666",
                        fontWeight: "500",
                      }}
                    >
                      Based on {part.reviews.totalReviews} review
                      {part.reviews.totalReviews !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div style={{ marginTop: "16px" }}>
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count =
                        part.reviews.ratingDistribution[rating] || 0;
                      const percentage =
                        part.reviews.totalReviews > 0
                          ? (count / part.reviews.totalReviews) * 100
                          : 0;

                      return (
                        <div
                          key={rating}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#000000",
                              width: "20px",
                              fontWeight: "500",
                            }}
                          >
                            {rating}★
                          </span>
                          <div
                            style={{
                              flex: 1,
                              margin: "0 8px",
                              backgroundColor: "rgba(215, 0, 7, 0.1)",
                              borderRadius: "4px",
                              height: "6px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "#D70007",
                                height: "6px",
                                borderRadius: "4px",
                                width: `${percentage}%`,
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#000000",
                              width: "20px",
                              textAlign: "right",
                              fontWeight: "500",
                            }}
                          >
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Premium Login Prompt */}
              {!currentUser && (
                <div className="bg-white rounded-4 shadow-lg mb-4 border-0">
                  <div className="p-4 text-center">
                    <div
                      className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <i
                        className="fas fa-user-plus text-info"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                    <h4 className="fw-bold text-dark mb-2">
                      Ready to Purchase? 🛒
                    </h4>
                    <p className="text-secondary mb-4">
                      Sign in to add items to cart and complete your purchase!
                    </p>
                    <div className="d-grid gap-3">
                      <button
                        className="btn btn-primary btn-lg rounded-pill shadow-sm"
                        onClick={() => navigate("/signin")}
                        style={{ padding: "12px 24px", fontWeight: "600" }}
                      >
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In to Buy
                      </button>
                      <button
                        className="btn btn-outline-primary btn-lg rounded-pill"
                        onClick={() => navigate("/signup")}
                        style={{ padding: "12px 24px", fontWeight: "600" }}
                      >
                        <i className="fas fa-user-plus me-2"></i>
                        Create Free Account
                      </button>
                    </div>
                    <p className="text-secondary mt-3 mb-0 small">
                      <i className="fas fa-shield-alt me-1 text-success"></i>
                      100% secure • Free to join • Instant access
                    </p>
                  </div>
                </div>
              )}

              {/* Premium Seller Info */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  marginBottom: "24px",
                  border: "1px solid rgba(215, 0, 7, 0.1)",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#FBE5E6",
                      borderRadius: "50%",
                      padding: "8px",
                      marginRight: "12px",
                    }}
                  >
                    <i
                      className="fas fa-user"
                      style={{ color: "#D70007", fontSize: "16px" }}
                    ></i>
                  </div>
                  <h5
                    style={{
                      fontWeight: "bold",
                      color: "#000000",
                      margin: 0,
                      fontSize: "18px",
                    }}
                  >
                    Seller Information
                  </h5>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#FBE5E6",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "12px",
                    }}
                  >
                    <img
                      src={
                        part.seller?.avatarUrl
                          ? toAbsUrl(part.seller.avatarUrl)
                          : "/assets/images/user-img-1.webp"
                      }
                      alt="seller"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #ffffff",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h6
                      style={{
                        fontWeight: "bold",
                        color: "#000000",
                        marginBottom: "4px",
                        fontSize: "16px",
                      }}
                    >
                      {part.seller?.username || "Unknown Seller"}
                    </h6>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#D70007",
                          color: "#ffffff",
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontWeight: "500",
                        }}
                      >
                        ✅ Verified Seller
                      </span>
                      {part.seller?.location && (
                        <span
                          style={{
                            color: "#666666",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiMapPin size={12} />
                          {part.seller.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller's Top Products */}
              {sellerTopProducts.length > 0 && (
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    marginBottom: "24px",
                    border: "1px solid rgba(215, 0, 7, 0.1)",
                    padding: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#FBE5E6",
                        borderRadius: "50%",
                        padding: "8px",
                        marginRight: "12px",
                      }}
                    >
                      <i
                        className="fas fa-star"
                        style={{ color: "#D70007", fontSize: "16px" }}
                      ></i>
                    </div>
                    <h5
                      style={{
                        fontWeight: "bold",
                        color: "#000000",
                        margin: 0,
                        fontSize: "18px",
                      }}
                    >
                      Seller's Top Products
                    </h5>
                  </div>

                  {sellerProductsLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px 0",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid #FBE5E6",
                          borderTop: "2px solid #D70007",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {sellerTopProducts.map((product) => (
                        <div
                          key={product._id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "12px",
                            backgroundColor: "#FBE5E6",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                          onClick={() => navigate(`/parts/${product._id}`)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(215, 0, 7, 0.1)";
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#FBE5E6";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <img
                            src={(() => {
                              const images =
                                product.media?.length > 0
                                  ? product.media.map((m) => m.url)
                                  : (() => {
                                      if (!product.descriptionHtml) return [];
                                      const imgRegex =
                                        /<img[^>]+src="([^"]+)"/g;
                                      const extractedImages = [];
                                      let match;
                                      while (
                                        (match = imgRegex.exec(
                                          product.descriptionHtml
                                        )) !== null
                                      ) {
                                        extractedImages.push(match[1]);
                                      }
                                      return extractedImages;
                                    })();
                              return images.length > 0
                                ? toAbsUrl(images[0])
                                : "/assets/images/handpicked-img-1.webp";
                            })()}
                            alt={product.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              marginRight: "12px",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "/assets/images/handpicked-img-1.webp";
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h6
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#000000",
                                marginBottom: "4px",
                                lineHeight: "1.3",
                              }}
                            >
                              {product.name}
                            </h6>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  color: "#D70007",
                                }}
                              >
                                ${product.price?.toLocaleString()}
                              </span>
                              {product.reviews &&
                                product.reviews.totalReviews > 0 && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    <StarRating
                                      rating={product.reviews.averageRating}
                                      size="sm"
                                    />
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "#666666",
                                      }}
                                    >
                                      ({product.reviews.totalReviews})
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div style={{ marginTop: "40px" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                padding: "32px",
                border: "1px solid rgba(215, 0, 7, 0.1)",
              }}
            >
              <h3
                style={{
                  fontWeight: "bold",
                  color: "#000000",
                  marginBottom: "24px",
                  fontSize: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FiStar style={{ color: "#D70007" }} size={24} />
                Customer Reviews
              </h3>

              {/* Show latest reviews if available, otherwise show full ReviewsList */}
              {reviews.length > 0 ? (
                <div>
                  <div style={{ marginBottom: "24px" }}>
                    {reviews.map(renderReviewCard)}
                  </div>
                </div>
              ) : (
                <ReviewsList
                  partId={part._id}
                  partOwner={part.seller}
                  currentUser={currentUser}
                />
              )}
            </div>
          </div>

          {/* Similar Parts */}
          {similarParts.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  padding: "32px",
                  border: "1px solid rgba(215, 0, 7, 0.1)",
                }}
              >
                <h3
                  style={{
                    fontWeight: "bold",
                    color: "#000000",
                    marginBottom: "24px",
                    fontSize: "24px",
                  }}
                >
                  Similar Parts
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "24px",
                  }}
                >
                  {similarParts.slice(0, 3).map((similarPart) => (
                    <div
                      key={similarPart._id}
                      style={{
                        border: "1px solid rgba(215, 0, 7, 0.1)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        backgroundColor: "#ffffff",
                      }}
                      onClick={() => navigate(`/parts/${similarPart._id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 25px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <img
                        src={(() => {
                          const images =
                            similarPart.media?.length > 0
                              ? similarPart.media.map((m) => m.url)
                              : (() => {
                                  if (!similarPart.descriptionHtml) return [];
                                  const imgRegex = /<img[^>]+src="([^"]+)"/g;
                                  const extractedImages = [];
                                  let match;
                                  while (
                                    (match = imgRegex.exec(
                                      similarPart.descriptionHtml
                                    )) !== null
                                  ) {
                                    extractedImages.push(match[1]);
                                  }
                                  return extractedImages;
                                })();
                          return images.length > 0
                            ? toAbsUrl(images[0])
                            : "/assets/images/handpicked-img-1.webp";
                        })()}
                        alt={similarPart.name}
                        style={{
                          height: "200px",
                          objectFit: "cover",
                          width: "100%",
                        }}
                        onError={(e) => {
                          e.target.src = "/assets/images/handpicked-img-1.webp";
                        }}
                      />
                      <div style={{ padding: "20px" }}>
                        <h5
                          style={{
                            fontWeight: "bold",
                            color: "#000000",
                            marginBottom: "8px",
                            fontSize: "18px",
                          }}
                        >
                          {similarPart.name}
                        </h5>
                        <p
                          style={{
                            color: "#666666",
                            marginBottom: "16px",
                            fontSize: "14px",
                          }}
                        >
                          {similarPart.brand}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h4
                            style={{
                              color: "#D70007",
                              fontWeight: "bold",
                              margin: 0,
                              fontSize: "20px",
                            }}
                          >
                            ${similarPart.price?.toLocaleString()}
                          </h4>
                          <small
                            style={{
                              color:
                                similarPart.quantity > 0
                                  ? "#D70007"
                                  : "#666666",
                              fontWeight: "500",
                            }}
                          >
                            {similarPart.quantity > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PartDetailFront;
