import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiClock,
  FiDollarSign,
  FiUsers,
  FiHeart,
  FiShare2,
  FiCheckCircle,
  FiAlertCircle,
  FiCreditCard,
  FiMapPin,
  FiCalendar,
  FiEye,
} from "react-icons/fi";
import { MdGavel } from "react-icons/md";
import { HiHome, HiChevronRight } from "react-icons/hi";
import io from "socket.io-client";

const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

// Add CSS animations
const styles = `
  <style>
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }
    
    .bid-history::-webkit-scrollbar {
      width: 6px;
    }
    .bid-history::-webkit-scrollbar-track {
      background: #f1f3f5;
      border-radius: 10px;
    }
    .bid-history::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 10px;
    }
    .bid-history::-webkit-scrollbar-thumb:hover {
      background: #adb5bd;
    }
    
    .comments-container::-webkit-scrollbar {
      width: 6px;
    }
    .comments-container::-webkit-scrollbar-track {
      background: transparent;
    }
    .comments-container::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.2);
      border-radius: 10px;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .7; }
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hover-lift {
      transition: transform 0.2s ease-in-out;
    }
    .hover-lift:hover {
      transform: translateY(-2px);
    }
  </style>
`;

const AuctionDetailFront = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [maxBidAmount, setMaxBidAmount] = useState("");
  const [showProxyBid, setShowProxyBid] = useState(false);
  const [bidding, setBidding] = useState(false);
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [watchers, setWatchers] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // Normalize relative upload paths to absolute URLs
  const toAbsUrl = (u) => {
    if (!u) return "/assets/images/handpicked-img-1.webp";
    if (u.startsWith("http") || u.startsWith("data:")) return u;
    const cleanUrl = u.startsWith("/") ? u : `/${u}`;
    return `${apiBase}${cleanUrl}`;
  };

  // Initialize socket connection and get current user
  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      // Get current user
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

      // Setup socket connection
      const newSocket = io(apiBase, {
        auth: token ? { token } : {},
      });

      newSocket.on("connect", () => {
        console.log("🔗 Socket connected for auction:", id);
        if (currentUser) {
          newSocket.emit("join", {
            userId: currentUser.id,
            userName: currentUser.name,
          });
        }
        newSocket.emit("join-auction", { auctionId: id });
      });

      newSocket.on("new-bid", (bidData) => {
        console.log("🏁 New bid received:", bidData);
        setBids((prev) => [bidData, ...prev]);
      });

      newSocket.on("auction-updated", (updateData) => {
        console.log("🔄 Auction updated:", updateData);
        setAuction((prev) =>
          prev
            ? {
                ...prev,
                currentBid: updateData.currentBid,
                totalBids: updateData.totalBids,
                highestBidder: updateData.highestBidder,
                reserveMet: updateData.reserveMet,
              }
            : null
        );
      });

      newSocket.on("new-auction-comment", (commentData) => {
        console.log("💬 New comment received:", commentData);
        setComments((prev) => [commentData, ...prev]);
      });

      newSocket.on("auction-comment-deleted", (data) => {
        console.log("🗑️ Comment deleted:", data.commentId);
        setComments((prev) => prev.filter((c) => c._id !== data.commentId));
      });

      newSocket.on("auction-comment-hidden", (data) => {
        console.log("👁️ Comment hidden:", data.commentId);
        setComments((prev) => prev.filter((c) => c._id !== data.commentId));
      });

      newSocket.on("auction-user-typing", (data) => {
        if (data.userId !== currentUser?.id) {
          setTypingUsers((prev) => {
            const filtered = prev.filter((u) => u.userId !== data.userId);
            if (data.isTyping) {
              return [
                ...filtered,
                { userId: data.userId, userName: data.userName },
              ];
            }
            return filtered;
          });

          // Clear typing indicator after 3 seconds
          if (data.isTyping) {
            setTimeout(() => {
              setTypingUsers((prev) =>
                prev.filter((u) => u.userId !== data.userId)
              );
            }, 3000);
          }
        }
      });

      newSocket.on("auction-ended", (data) => {
        console.log("🏁 Auction ended:", data);
        setAuction((prev) =>
          prev ? { ...prev, status: "ended", winner: data.winner } : null
        );
      });

      newSocket.on("auction-watcher-joined", (data) => {
        setWatchers(data.watcherCount);
      });

      newSocket.on("auction-watcher-left", (data) => {
        setWatchers(data.watcherCount);
      });

      setSocket(newSocket);

      return () => {
        newSocket.emit("leave-auction", { auctionId: id });
        newSocket.close();
      };
    }
  }, [id]);

  // Load auction data and comments
  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetch(`${apiBase}/api/auctions/${id}`, {
        signal: controller.signal,
      }).then((r) => r.json()),
      fetch(`${apiBase}/api/auctions/${id}/bids`, {
        signal: controller.signal,
      }).then((r) => (r.ok ? r.json() : { bids: [] })),
      fetch(`${apiBase}/api/auctions/${id}/comments`, {
        signal: controller.signal,
      }).then((r) => (r.ok ? r.json() : { comments: [] })),
    ])
      .then(([auctionData, bidsData, commentsData]) => {
        console.log("🎯 Raw auction response:", auctionData);

        if (auctionData.error) {
          setError(auctionData.error);
        } else {
          const auction = auctionData.auction || auctionData;
          setAuction(auction);
          setBids(Array.isArray(bidsData.bids) ? bidsData.bids : []);
          setComments(
            Array.isArray(commentsData.comments) ? commentsData.comments : []
          );
        }
        setLoading(false);
        setLoadingComments(false);
      })
      .catch(() => {
        setError("Failed to load auction");
        setLoading(false);
        setLoadingComments(false);
      });

    return () => controller.abort();
  }, [id]);

  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const placeBid = async () => {
    if (!currentUser) {
      alert("Please log in to place a bid");
      navigate("/signin");
      return;
    }

    const minimumBid =
      auction.currentBid > 0
        ? auction.currentBid + (auction.bidIncrement || 100)
        : auction.startingBid;

    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) < minimumBid) {
      alert(`Bid must be at least $${minimumBid.toLocaleString()}`);
      return;
    }

    setBidding(true);
    try {
      const token = localStorage.getItem("auth_token");
      const payload = {
        bidAmount: Number(bidAmount),
      };

      if (showProxyBid && maxBidAmount) {
        payload.maxBidAmount = Number(maxBidAmount);
      }

      const response = await fetch(`${apiBase}/api/auctions/${id}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setBidAmount("");
        setMaxBidAmount("");
        setShowProxyBid(false);
      } else {
        alert(result.error || "Failed to place bid");
      }
    } catch (error) {
      alert("Error placing bid");
    } finally {
      setBidding(false);
    }
  };

  const buyNow = async () => {
    if (!currentUser) {
      alert("Please log in to buy now");
      navigate("/signin");
      return;
    }

    if (!auction.buyNowPrice) return;

    if (
      confirm(`Buy this auction for $${auction.buyNowPrice.toLocaleString()}?`)
    ) {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${apiBase}/api/auctions/${id}/buy-now`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          alert("Purchase successful!");
          window.location.reload();
        } else {
          alert(result.error || "Failed to complete purchase");
        }
      } catch (error) {
        alert("Error processing purchase");
      }
    }
  };

  const addComment = async () => {
    if (!currentUser) {
      alert("Please log in to comment");
      navigate("/signin");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${apiBase}/api/auctions/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newComment.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        setNewComment("");
        // Comment will be added via socket event
      } else {
        alert(result.error || "Failed to add comment");
      }
    } catch (error) {
      alert("Error adding comment");
    }
  };

  const handleCommentInputChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    // Handle typing indicator
    if (socket && currentUser) {
      if (value.length > 0 && !isTyping) {
        setIsTyping(true);
        socket.emit("auction-typing", { auctionId: id, isTyping: true });
      } else if (value.length === 0 && isTyping) {
        setIsTyping(false);
        socket.emit("auction-typing", { auctionId: id, isTyping: false });
      }
    }
  };

  const handleCommentKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addComment();
      if (socket && isTyping) {
        setIsTyping(false);
        socket.emit("auction-typing", { auctionId: id, isTyping: false });
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending_approval: { class: "bg-warning", text: "Pending Approval" },
      draft: { class: "bg-secondary", text: "Draft" },
      active: { class: "bg-success", text: "Live Auction" },
      ended: { class: "bg-dark", text: "Ended" },
      sold: { class: "bg-primary", text: "Sold" },
      cancelled: { class: "bg-danger", text: "Cancelled" },
    };
    return badges[status] || { class: "bg-secondary", text: status };
  };

  const getAuctionTypeBadge = (type) => {
    const badges = {
      standard: { class: "fs-six fw-bold p1-color", text: "Standard Auction" },
      reserve: { class: "bg-warning", text: "Reserve Auction" },
      direct_sale: { class: "bg-success", text: "Buy It Now" },
    };
    return badges[type] || { class: "bg-secondary", text: type };
  };

  if (loading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading auction details...</p>
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
            onClick={() => navigate("/auctions")}
          >
            ← Back to Auctions
          </button>
        </div>
      </div>
    );

  if (!auction) return null;

  const statusBadge = getStatusBadge(auction.status);
  const typeBadge = getAuctionTypeBadge(auction.auctionType);
  const timeRemaining = formatTimeRemaining(auction.endDate);
  const isEnded =
    auction.status === "ended" || new Date(auction.endDate) < new Date();
  const isActive = auction.status === "active" && !isEnded;
  const canBid =
    isActive && currentUser && currentUser.id !== auction.seller?.id;
  const canBuyNow =
    isActive &&
    auction.buyNowPrice &&
    currentUser &&
    currentUser.id !== auction.seller?.id;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: styles }} />
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        {/* Premium Header */}
        <header
          className="bg-white shadow-sm border-bottom sticky-top"
          style={{ zIndex: 1000 }}
        >
          <div className="container-fluid py-3">
            <div className="row align-items-center">
              <div className="col-md-6">
                <nav aria-label="breadcrumb">
                  <ol
                    className="breadcrumb mb-0"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <li className="breadcrumb-item">
                      <a
                        href="/"
                        className="text-decoration-none text-dark fw-medium"
                      >
                        <HiHome
                          className="me-2"
                          size={18}
                          style={{ color: "#6c757d" }}
                        />
                        Home
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <HiChevronRight
                        className="mx-2"
                        size={14}
                        style={{ color: "#dee2e6" }}
                      />
                      <a
                        href="/auctions"
                        className="text-decoration-none text-dark fw-medium"
                      >
                        <MdGavel
                          className="me-2"
                          size={18}
                          style={{ color: "#6c757d" }}
                        />
                        Live Auctions
                      </a>
                    </li>
                    <li className="breadcrumb-item active">
                      <HiChevronRight
                        className="mx-2"
                        size={14}
                        style={{ color: "#dee2e6" }}
                      />
                      <span className="text-primary fw-semibold">
                        {auction.carListing?.name}
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="col-md-6 text-end">
                <span
                  className={`badge ${statusBadge.class} me-3 px-3 py-2 fs-6 fw-semibold`}
                  style={{ borderRadius: "25px" }}
                >
                  {statusBadge.text}
                </span>
                <span
                  className={`badge ${typeBadge.class} px-3 py-2 fs-6 fw-semibold`}
                  style={{ borderRadius: "25px" }}
                >
                  {typeBadge.text}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container-fluid py-5">
          <div className="row g-4">
            {/* Left Column - Media and Details */}
            <div className="col-lg-8">
              {/* Premium Vehicle Title Section */}
              <div className="bg-white rounded-4 shadow-sm p-4 mb-4 border-0">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h1
                      className="display-6 fw-bold text-dark mb-2"
                      style={{ lineHeight: "1.2" }}
                    >
                      {auction.carListing?.name}
                    </h1>
                    <div className="d-flex align-items-center gap-4 text-secondary">
                      <div className="d-flex align-items-center">
                        <FiCalendar size={16} className="me-2 text-primary" />
                        <span className="fw-medium">
                          {auction.carListing?.year}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FiMapPin size={16} className="me-2 text-primary" />
                        <span className="fw-medium">
                          {auction.carListing?.location}
                        </span>
                      </div>
                      {auction.carListing?.mileage && (
                        <div className="d-flex align-items-center">
                          <span className="me-2 text-primary">🏃</span>
                          <span className="fw-medium">
                            {auction.carListing.mileage.toLocaleString()} miles
                          </span>
                        </div>
                      )}
                      <div className="d-flex align-items-center">
                        <FiEye size={16} className="me-2 text-primary" />
                        <span className="fw-medium">
                          {auction.viewCount || 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
  <div className="single-item d-inline-flex align-items-center justify-content-center p1-2nd-bg-color rounded-pill px-3 py-2">
    <span className="fs-six fw-bold p1-color"> Live Auction</span>
  </div>
</div>

                </div>
              </div>

              {/* Premium Media Gallery */}
              <div className="bg-white rounded-4 shadow-sm mb-4 border-0 overflow-hidden">
                <div className="position-relative" style={{ height: "500px" }}>
                  {(() => {
                    const media = auction.carListing?.media?.length
                      ? auction.carListing.media
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
                        alt={auction.carListing?.name}
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
                        <MdGavel className="me-2" size={14} />
                        Live Auction
                      </span>
                      {isActive && (
                        <span className="badge bg-danger text-black px-3 py-2 rounded-pill fw-semibold shadow-sm animate__animated animate__pulse animate__infinite">
                          <FiClock className="me-2" size={14} />
                          {timeRemaining} left
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Media counter */}
                  {auction.carListing?.media?.length > 1 && (
                    <div className="position-absolute bottom-0 start-0 p-4">
                      <span className="badge bg-black bg-opacity-75 text-black px-3 py-2 rounded-pill">
                        📷 {activeIdx + 1} / {auction.carListing.media.length}
                      </span>
                    </div>
                  )}

                  {/* Watchers count */}
                  {watchers > 1 && (
                    <div className="position-absolute bottom-0 end-0 p-4">
                      <span className="badge bg-primary text-black px-3 py-2 rounded-pill shadow-sm">
                        <FiUsers className="me-2" size={14} />
                        {watchers} watching live
                      </span>
                    </div>
                  )}

                  {/* Premium Navigation Arrows */}
                  {auction.carListing?.media?.length > 1 && (
                    <>
                      <button
                        className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle shadow-sm"
                        style={{ width: "50px", height: "50px", opacity: 0.9 }}
                        onClick={() =>
                          setActiveIdx(
                            activeIdx > 0
                              ? activeIdx - 1
                              : auction.carListing.media.length - 1
                          )
                        }
                      >
                        <i className="fas fa-chevron-left text-dark"></i>
                      </button>
                      <button
                        className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle shadow-sm"
                        style={{ width: "50px", height: "50px", opacity: 0.9 }}
                        onClick={() =>
                          setActiveIdx(
                            activeIdx < auction.carListing.media.length - 1
                              ? activeIdx + 1
                              : 0
                          )
                        }
                      >
                        <i className="fas fa-chevron-right text-dark"></i>
                      </button>
                    </>
                  )}
                </div>

                {/* Premium Thumbnails */}
                {auction.carListing?.media?.length > 1 && (
                  <div className="p-4 bg-light bg-opacity-50">
                    <div
                      className="d-flex gap-3 overflow-auto"
                      style={{ scrollbarWidth: "thin" }}
                    >
                      {auction.carListing.media.map((m, i) => {
                        const thumbUrl = toAbsUrl(m.url);
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
                            {m.type === "video" ? (
                              <video
                                src={thumbUrl}
                                className="w-100 h-100"
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "12px",
                                }}
                              />
                            ) : (
                              <img
                                src={thumbUrl}
                                alt={`${auction.carListing?.name}-${i}`}
                                className="w-100 h-100"
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "12px",
                                }}
                              />
                            )}
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
                )}
              </div>

              {/* Premium Vehicle Details */}
              <div className="bg-white rounded-4 shadow-sm mb-4 border-0">
                <div className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <i
                        className="fas fa-car text-primary"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                    <div>
                      <h3 className="fw-bold text-dark mb-1">
                        Vehicle Specifications
                      </h3>
                      <p className="text-secondary mb-0">
                        Detailed information about this vehicle
                      </p>
                    </div>
                  </div>

                  <div className="row g-4">
                    {auction.carListing?.mileage && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-tachometer-alt text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {auction.carListing.mileage.toLocaleString()}{" "}
                              miles
                            </div>
                            <small className="text-secondary">Mileage</small>
                          </div>
                        </div>
                      </div>
                    )}
                    {auction.carListing?.condition && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-star text-warning"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {auction.carListing.condition}
                            </div>
                            <small className="text-secondary">Condition</small>
                          </div>
                        </div>
                      </div>
                    )}
                    {auction.carListing?.color && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-palette text-info"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {auction.carListing.color}
                            </div>
                            <small className="text-secondary">Color</small>
                          </div>
                        </div>
                      </div>
                    )}
                    {auction.carListing?.transmission && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-cog text-secondary"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {auction.carListing.transmission}
                            </div>
                            <small className="text-secondary">
                              Transmission
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                    {auction.carListing?.fuelType && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-gas-pump text-success"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {auction.carListing.fuelType}
                            </div>
                            <small className="text-secondary">Fuel Type</small>
                          </div>
                        </div>
                      </div>
                    )}
                    {auction.carListing?.drivetrain && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-road text-dark"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {auction.carListing.drivetrain}
                            </div>
                            <small className="text-secondary">Drivetrain</small>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {auction.carListing?.descriptionHtml && (
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
                            __html: auction.carListing.descriptionHtml,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Auction Information */}
              <div className="bg-white rounded-4 shadow-sm border-0">
                <div className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                      <MdGavel className="text-success" size={24} />
                    </div>
                    <div>
                      <h3 className="fw-bold text-dark mb-1">
                        Auction Details
                      </h3>
                      <p className="text-secondary mb-0">
                        Complete auction information and timeline
                      </p>
                    </div>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                        <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                          <i className="fas fa-tag text-success"></i>
                        </div>
                        <div>
                          <div className="fw-bold text-dark">
                            {typeBadge.text}
                          </div>
                          <small className="text-secondary">Auction Type</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                        <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                          <FiDollarSign className="text-primary" size={16} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">
                            ${auction.startingBid?.toLocaleString() || "0"}
                          </div>
                          <small className="text-secondary">Starting Bid</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                        <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                          <i className="fas fa-plus text-info"></i>
                        </div>
                        <div>
                          <div className="fw-bold text-dark">
                            ${auction.bidIncrement?.toLocaleString() || "100"}
                          </div>
                          <small className="text-secondary">
                            Bid Increment
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                        <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                          <FiCalendar className="text-warning" size={16} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">
                            {new Date(auction.startDate).toLocaleDateString()}
                          </div>
                          <small className="text-secondary">Started</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                        <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                          <FiClock className="text-danger" size={16} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">
                            {new Date(auction.endDate).toLocaleDateString()}
                          </div>
                          <small className="text-secondary">Ends</small>
                        </div>
                      </div>
                    </div>
                    {auction.reservePrice && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                          <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                            <i className="fas fa-shield-alt text-warning"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              ${auction.reservePrice.toLocaleString()}
                            </div>
                            <small className="text-secondary">
                              Reserve Price
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Bidding */}
            <div className="col-lg-4">
              {/* Premium Current Bid Card */}
              <div
                className="cus-border border b-third py-3 py-md-5 px-3 px-md-8 d-grid gap-3 gap-md-4 rounded-4 p1-3rd-bg-color mb-4 "
                style={{ top: "100px" }}
              >
                <div className="p-4 text-center collapse-single second active">
                  <div
                    className="bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "rgba(var(--p1), 0.1)",
                    }}
                  >
                    <MdGavel
                      style={{ color: "rgba(var(--p1), 1)" }}
                      size={28}
                    />
                  </div>
                  <h6 className="text-secondary mb-2 fw-semibold">
                    CURRENT HIGH BID
                  </h6>
                  <h1
                    className="display-4 fw-bold text-dark mb-2"
                    style={{ fontFamily: "monospace" }}
                  >
                    ${auction.currentBid?.toLocaleString() || "0"}
                  </h1>
                  <div className="d-flex align-items-center justify-content-center gap-3 mb-3 flex-wrap">
                    <div className="single-item d-center justify-content-start gap-2 p1-2nd-bg-color rounded-pill py-2 px-3">
                      <span className="d-center box-area box-ten rounded-circle p1-4th-bg-color p1-color">
                        <FiUsers size={14} />
                      </span>
                      <span className="n4-color fs-eight fw-bold">
                        {auction.totalBids || 0} bid
                        {auction.totalBids !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {watchers > 1 && (
                      <div className="single-item d-center justify-content-start gap-2 p1-2nd-bg-color rounded-pill py-2 px-3">
                        <span className="d-center box-area box-ten rounded-circle p1-4th-bg-color p1-color">
                          <FiEye size={14} />
                        </span>
                        <span className="n4-color fs-eight fw-bold">
                          {watchers} watching
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Premium Time Remaining */}
                  {isActive && (
                    <div className="single-item d-center justify-content-start gap-3 gap-md-4 p1-2nd-bg-color rounded-pill py-3 py-md-4 px-3 px-md-4 px-lg-8">
                      <span className="d-center box-area box-ten rounded-circle p1-4th-bg-color p1-color">
                        <FiClock
                          size={20}
                          style={{ color: "rgba(var(--p1), 1)" }}
                        />
                      </span>
                      <div className="d-grid gap-1">
                        <span className="n4-color fs-eight fw-bold">
                          {timeRemaining}
                        </span>
                        <span className="n4-color fs-eight">
                          Time Remaining
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Reserve Status */}
              {auction.auctionType === "reserve" && (
                <div className="bg-white rounded-4 shadow-sm mb-4 border-0">
                  <div className="p-4 text-center">
                    {auction.reserveMet ? (
                      <div>
                        <div
                          className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <FiCheckCircle className="text-success" size={24} />
                        </div>
                        <h5 className="fw-bold text-success mb-2">
                          Reserve Met! 🎉
                        </h5>
                        <p className="text-secondary mb-0">
                          The reserve price has been reached. This auction will
                          sell to the highest bidder.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div
                          className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <FiAlertCircle className="text-warning" size={24} />
                        </div>
                        <h5 className="fw-bold text-warning mb-2">
                          Reserve Not Met
                        </h5>
                        <p className="text-secondary mb-0">
                          Bidding has not yet reached the seller's reserve
                          price.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Premium Buy Now Option */}
              {canBuyNow && (
                <div className="bg-gradient-to-r from-success to-success bg-white rounded-4 shadow-lg mb-4 border-2 border-success border-opacity-25">
                  <div className="p-4 text-center">
                    <div
                      className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <FiCreditCard className="text-success" size={24} />
                    </div>
                    <h5 className="fw-semibold text-dark mb-2">
                      Skip the Wait - Buy It Now!
                    </h5>
                    <h2
                      className="display-6 fw-bold text-success mb-3"
                      style={{ fontFamily: "monospace" }}
                    >
                      ${auction.buyNowPrice.toLocaleString()}
                    </h2>
                    <button
                      className="btn btn-success btn-lg w-100 rounded-pill shadow-sm"
                      onClick={buyNow}
                      style={{ padding: "12px 24px", fontWeight: "600" }}
                    >
                      <FiCreditCard className="me-2" size={18} />
                      Buy Now & End Auction
                    </button>
                    <p className="text-secondary mt-2 mb-0 small">
                      Instant purchase - no waiting required
                    </p>
                  </div>
                </div>
              )}

              {/* Premium Bidding Form */}
              {canBid && (
                <div className="bg-white rounded-4 shadow-lg mb-4 border-0">
                  <div className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                        <MdGavel className="text-primary" size={20} />
                      </div>
                      <h5 className="fw-bold text-dark mb-0">Place Your Bid</h5>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Bid Amount
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0 fw-bold text-dark">
                          $
                        </span>
                        <input
                          type="number"
                          className="form-control border-start-0 fs-4 fw-bold text-center"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={(auction.currentBid > 0
                            ? auction.currentBid + (auction.bidIncrement || 100)
                            : auction.startingBid
                          ).toLocaleString()}
                          style={{
                            fontFamily: "monospace",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "0 12px 12px 0",
                          }}
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <small className="text-secondary">
                          <i className="fas fa-info-circle me-1"></i>
                          Min: $
                          {(auction.currentBid > 0
                            ? auction.currentBid + (auction.bidIncrement || 100)
                            : auction.startingBid
                          ).toLocaleString()}
                        </small>
                        <small className="text-secondary">
                          Increment: $
                          {auction.bidIncrement?.toLocaleString() || "100"}
                        </small>
                      </div>
                    </div>

                    {/* Premium Proxy Bidding */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                        <input
                          className="form-check-input me-3"
                          type="checkbox"
                          checked={showProxyBid}
                          onChange={(e) => setShowProxyBid(e.target.checked)}
                          id="proxyBidding"
                          style={{ transform: "scale(1.2)" }}
                        />
                        <div className="flex-grow-1">
                          <label
                            className="form-check-label fw-semibold text-dark d-block"
                            htmlFor="proxyBidding"
                          >
                            🤖 Enable Auto-Bidding
                          </label>
                          <small className="text-secondary">
                            Automatically bid up to your maximum amount
                          </small>
                        </div>
                      </div>
                      {showProxyBid && (
                        <div className="mt-3">
                          <label className="form-label fw-semibold text-dark">
                            Maximum Bid Amount
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-light fw-bold text-dark">
                              $
                            </span>
                            <input
                              type="number"
                              className="form-control fw-bold"
                              value={maxBidAmount}
                              onChange={(e) => setMaxBidAmount(e.target.value)}
                              placeholder="Your maximum bid"
                              style={{ backgroundColor: "#f8f9fa" }}
                            />
                          </div>
                          <small className="text-info">
                            <i className="fas fa-shield-alt me-1"></i>
                            We'll bid incrementally up to this amount to keep
                            you winning
                          </small>
                        </div>
                      )}
                    </div>

                    <div className="btn-area">
                      <button
                        className="box-style style-two rounded-pill w-100 p1-bg-color d-center py-3 py-md-4 px-3 px-md-4 px-xl-6"
                        style={{ "--x": "25px", "--y": "4px" }}
                        onClick={placeBid}
                        disabled={bidding || !bidAmount}
                      >
                        {bidding ? (
                          <>
                            <div
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></div>
                            <span className="fs-eight fw-bold n1-color text-uppercase">
                              Placing Bid...
                            </span>
                          </>
                        ) : (
                          <>
                            <MdGavel className="me-2" size={20} />
                            <span className="fs-eight fw-bold n1-color text-uppercase">
                              Place Bid Now
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-center mt-3">
                      <small className="text-secondary">
                        <i className="fas fa-lock me-1"></i>
                        Secure bidding powered by SSL encryption
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* Premium Login Prompt */}
              {!currentUser && (isActive || canBuyNow) && (
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
                      Ready to Start Bidding? 🚀
                    </h4>
                    <p className="text-secondary mb-4">
                      Join thousands of bidders and start winning amazing deals!
                    </p>
                    <div className="d-grid gap-3">
                      <button
                        className="btn btn-primary btn-lg rounded-pill shadow-sm"
                        onClick={() => navigate("/signin")}
                        style={{ padding: "12px 24px", fontWeight: "600" }}
                      >
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In to Bid
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
              <div className="bg-white rounded-4 shadow-sm mb-4 border-0">
                <div className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-user text-secondary"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-0">
                      Seller Information
                    </h5>
                  </div>

                  <div className="d-flex align-items-center p-3 bg-light bg-opacity-50 rounded-3">
                    <div
                      style={{ width: "50px", height: "50px" }}
                      className="me-3"
                    >
                      <img
                        src={
                          auction.seller?.avatarFile
                            ? toAbsUrl(auction.seller.avatarFile)
                            : "/assets/images/user-img-1.webp"
                        }
                        alt="seller"
                        className="w-100 h-100 rounded-circle shadow-sm border border-white border-3"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-dark mb-1">
                        {auction.seller?.name || "Unknown Seller"}
                      </h6>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-warning bg-opacity-20 text-dark px-2 py-1 rounded-pill small">
                          {auction.seller?.role === "dealer"
                            ? "🏢 Dealer"
                            : "👤 Private Seller"}
                        </span>
                        <span className="badge bg-primary bg-opacity-20 text-white px-2 py-1 rounded-pill small">
                          ✅ Verified
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <button className="btn btn-outline-secondary btn-sm rounded-pill">
                        <i className="fas fa-envelope me-1"></i>
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Recent Bids */}
              <div className="bg-white rounded-4 shadow-sm mb-4 border-0">
                <div className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center">
                      <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="fas fa-history text-warning"></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-0">Bid History</h5>
                    </div>
                    <span className="badge bg-primary bg-opacity-20 text-white px-3 py-2 rounded-pill">
                      {bids.length} total
                    </span>
                  </div>

                  {bids.length === 0 ? (
                    <div className="text-center py-5">
                      <div
                        className="bg-light bg-opacity-50 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: "60px", height: "60px" }}
                      >
                        <i
                          className="fas fa-gavel text-secondary"
                          style={{ fontSize: "24px" }}
                        ></i>
                      </div>
                      <h6 className="text-secondary mb-2">No bids yet</h6>
                      <p className="text-secondary mb-0 small">
                        Be the first to place a bid on this auction!
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                      className="bid-history"
                    >
                      {bids.slice(0, 10).map((bid, index) => (
                        <div
                          key={bid._id || index}
                          className={`d-flex align-items-center p-3 rounded-3 mb-2 ${
                            bid.status === "winning"
                              ? "bg-success bg-opacity-10 border border-success border-opacity-25"
                              : "bg-light bg-opacity-30"
                          }`}
                        >
                          <div className="me-3">
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center ${
                                bid.status === "winning"
                                  ? "bg-success text-black"
                                  : "bg-secondary text-black"
                              }`}
                              style={{ width: "35px", height: "35px" }}
                            >
                              <i
                                className={`fas ${
                                  bid.bidType === "proxy"
                                    ? "fa-robot"
                                    : "fa-user"
                                }`}
                                style={{ fontSize: "14px" }}
                              ></i>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span
                                className="fw-bold text-dark fs-5"
                                style={{ fontFamily: "monospace" }}
                              >
                                $
                                {(
                                  bid.amount || bid.bidAmount
                                )?.toLocaleString()}
                              </span>

                              {bid.status === "winning" && (
                                <span
                                  className="badge bg-success text-black px-2 py-1 rounded-pill"
                                  style={{ fontSize: "10px" }}
                                >
                                  👑 WINNING
                                </span>
                              )}
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <small className="text-secondary fw-medium">
                                {bid.bidder?.name || "Anonymous Bidder"}
                              </small>
                              <small className="text-secondary">
                                {new Date(bid.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Live Chat */}
              <div className="bg-white rounded-4 shadow-sm border-0">
                <div className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center">
                      <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="fas fa-comments text-success"></i>
                      </div>
                      <div>
                        <h5 className="fw-bold text-dark mb-0">Live Chat</h5>
                        <small className="text-secondary">
                          Real-time auction discussion
                        </small>
                      </div>
                    </div>
                    {watchers > 1 && (
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-success bg-opacity-20 rounded-circle"
                          style={{ width: "8px", height: "8px" }}
                        ></div>
                        <small className="text-success fw-semibold">
                          {watchers} online
                        </small>
                      </div>
                    )}
                  </div>

                  {/* Premium Comments Display */}
                  <div
                    style={{
                      height: "400px",
                      overflowY: "auto",
                      padding: "1rem",
                      background:
                        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      borderRadius: "16px",
                      border: "1px solid #dee2e6",
                    }}
                    className="comments-container"
                  >
                    {loadingComments ? (
                      <div className="text-center py-5">
                        <div
                          className="spinner-border text-primary mb-3"
                          style={{ width: "2rem", height: "2rem" }}
                        ></div>
                        <p className="text-secondary mb-0">
                          Loading chat messages...
                        </p>
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-5">
                        <div
                          className="bg-light bg-opacity-50 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <i
                            className="fas fa-comment-dots text-secondary"
                            style={{ fontSize: "24px" }}
                          ></i>
                        </div>
                        <h6 className="text-secondary mb-2">No messages yet</h6>
                        <p className="text-secondary mb-0 small">
                          Start the conversation and connect with other bidders!
                        </p>
                      </div>
                    ) : (
                      <div className="d-flex flex-column-reverse">
                        {comments.map((comment, index) => (
                          <div key={comment._id || index} className="mb-3">
                            <div
                              className={`p-3 rounded-3 shadow-sm ${
                                comment.type === "bid_notification"
                                  ? "bg-warning text-black"
                                  : comment.type === "system"
                                  ? "bg-warning bg-opacity-20 text-dark border border-warning border-opacity-25"
                                  : "bg-white border"
                              }`}
                            >
                              <div className="d-flex align-items-center gap-2 mb-2">
                                {comment.type === "comment" && (
                                  <img
                                    src={
                                      comment.user?.avatarFile
                                        ? toAbsUrl(comment.user.avatarFile)
                                        : "/assets/images/user-img-1.webp"
                                    }
                                    alt={comment.user?.name}
                                    className="rounded-circle border border-white border-2 shadow-sm"
                                    style={{
                                      width: "28px",
                                      height: "28px",
                                      objectFit: "cover",
                                    }}
                                  />
                                )}
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <span
                                      className="fw-bold text-secondary"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {comment.type === "system"
                                        ? "🔔 System Alert"
                                        : comment.type === "bid_notification"
                                        ? "💰 Bid Update"
                                        : comment.user?.name || "Anonymous"}
                                    </span>
                                    <small
                                      className={
                                        comment.type === "bid_notification"
                                          ? "text-black-50"
                                          : "text-secondary"
                                      }
                                    >
                                      {new Date(
                                        comment.createdAt
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </small>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="text-secondary"
                                style={{ fontSize: "15px", lineHeight: "1.4" }}
                              >
                                {comment.message}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Premium Typing Indicators */}
                    {typingUsers.length > 0 && (
                      <div className="typing-indicator p-3 bg-white bg-opacity-80 rounded-3 mb-3 border border-primary border-opacity-25">
                        <div className="d-flex align-items-center gap-2">
                          <div className="typing-animation d-flex gap-1">
                            <div
                              className="bg-primary rounded-circle"
                              style={{
                                width: "6px",
                                height: "6px",
                                animation: "typing 1.4s infinite ease-in-out",
                              }}
                            ></div>
                            <div
                              className="bg-primary rounded-circle"
                              style={{
                                width: "6px",
                                height: "6px",
                                animation:
                                  "typing 1.4s infinite ease-in-out 0.2s",
                              }}
                            ></div>
                            <div
                              className="bg-primary rounded-circle"
                              style={{
                                width: "6px",
                                height: "6px",
                                animation:
                                  "typing 1.4s infinite ease-in-out 0.4s",
                              }}
                            ></div>
                          </div>
                          <small className="text-primary fw-semibold">
                            {typingUsers.map((u) => u.userName).join(", ")}
                            {typingUsers.length === 1 ? " is" : " are"}{" "}
                            typing...
                          </small>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Premium Comment Input */}
                  <div className="mt-4">
                    {currentUser ? (
                      <div className="d-flex gap-3 align-items-end">
                        <div style={{ width: "40px", height: "40px" }}>
                          <img
                            src={
                              currentUser.avatarFile
                                ? toAbsUrl(currentUser.avatarFile)
                                : "/assets/images/user-img-1.webp"
                            }
                            alt={currentUser.name}
                            className="w-100 h-100 rounded-circle shadow-sm border border-white border-2"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <input
                            type="text"
                            className="form-control form-control-lg rounded-pill border-2"
                            placeholder="Join the conversation..."
                            value={newComment}
                            onChange={handleCommentInputChange}
                            onKeyPress={handleCommentKeyPress}
                            maxLength={500}
                            style={{
                              backgroundColor: "#f8f9fa",
                              border: "2px solid #dee2e6",
                              padding: "12px 20px",
                            }}
                          />
                        </div>
                        <button
                          className="btn btn-primary btn-lg rounded-circle shadow-sm"
                          onClick={addComment}
                          disabled={!newComment.trim()}
                          style={{ width: "50px", height: "50px" }}
                        >
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-light bg-opacity-50 rounded-3">
                        <i
                          className="fas fa-lock text-secondary mb-2"
                          style={{ fontSize: "24px" }}
                        ></i>
                        <p className="text-secondary mb-2">
                          Join the conversation
                        </p>
                        <a
                          href="/signin"
                          className="btn btn-primary btn-sm rounded-pill px-4"
                        >
                          Sign in to chat
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionDetailFront;
