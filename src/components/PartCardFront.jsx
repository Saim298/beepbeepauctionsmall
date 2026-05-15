import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdChat, MdShoppingCart } from "react-icons/md";
import { FiPackage, FiTool, FiShield, FiStar, FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext.jsx";
import StarRating from "./StarRating.jsx";
import { collectPartImageUrls, toAbsUrl, PART_IMAGE_PLACEHOLDER } from "../utils/partMedia";
import "./PartCardFront.css";

function formatPrice(price) {
  const n = typeof price === "number" ? price : parseFloat(String(price ?? ""));
  const v = Number.isNaN(n) ? 0 : n;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(v);
}

function warrantyLabel(w) {
  if (!w) return "As listed";
  const map = {
    "30_days": "30-day",
    "90_days": "90-day",
    "6_months": "6 mo",
    "1_year": "1 yr",
    "2_years": "2 yr",
    lifetime: "Lifetime",
  };
  return map[w] || String(w).replace(/_/g, " ");
}

const PartCardFront = ({ part }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);

  const imageUrls = useMemo(() => {
    const raw = collectPartImageUrls(part);
    return raw.map((u) => toAbsUrl(u)).filter(Boolean);
  }, [part]);

  const displayUrls = imageUrls.length ? imageUrls : [PART_IMAGE_PLACEHOLDER];
  const primarySrc = displayUrls[Math.min(imgIndex, displayUrls.length - 1)];

  const conditionBadge = useMemo(() => {
    const c = part?.condition;
    const badges = {
      new: { text: "New", color: "#16a34a" },
      used_excellent: { text: "Excellent", color: "#16a34a" },
      used_good: { text: "Good", color: "#d70007" },
      used_fair: { text: "Fair", color: "#64748b" },
      refurbished: { text: "Refurbished", color: "#d70007" },
      remanufactured: { text: "Remanufactured", color: "#0f172a" },
    };
    return badges[c] || { text: c ? String(c).replace(/_/g, " ") : "—", color: "#0f172a" };
  }, [part?.condition]);

  const handleChatClick = () => {
    navigate("/chat", {
      state: {
        partId: part._id,
        partName: part.name,
        partPrice: part.price,
        partImage: displayUrls[0] || null,
        vendorId: typeof part.seller === "object" ? part.seller?._id : undefined,
        vendorName: typeof part.seller === "object" ? part.seller?.username : undefined,
      },
    });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await addToCart(part, 1);
    } catch (error) {
      alert(error.message || "Please sign in to add items to cart");
    }
  };

  const sellerName =
    typeof part.seller === "object" && part.seller
      ? part.seller.username || part.seller.name || part.seller.email || "Seller"
      : "Verified seller";

  const avatarSrc =
    typeof part.seller === "object" && part.seller?.avatarUrl
      ? toAbsUrl(part.seller.avatarUrl)
      : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop";

  return (
    <div className="pcf-card">
      <div className="pcf-media">
        <img
          src={primarySrc}
          alt=""
          className="pcf-main-img"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
          }}
        />
        {displayUrls.length > 1 && (
          <div className="pcf-thumbs">
            {displayUrls.slice(0, 6).map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={src}
                alt=""
                className={i === imgIndex ? "is-active" : ""}
                loading="lazy"
                onClick={() => setImgIndex(i)}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
                }}
              />
            ))}
          </div>
        )}
        <div className="pcf-badges">
          <span className="pcf-pill" style={{ color: conditionBadge.color }}>
            <FiStar size={12} aria-hidden />
            {conditionBadge.text}
          </span>
          <span className="pcf-pill pcf-pill--accent">
            <FiEye size={12} aria-hidden />
            {part.views || 0} views
          </span>
        </div>
      </div>

      <div className="pcf-content">
        <div className="pcf-head">
          <div>
            <h3 className="pcf-title">{part.name}</h3>
            <p className="pcf-meta">
              {part.brand}
              {part.partNumber ? ` · #${part.partNumber}` : ""}
            </p>
          </div>
          <Link to={`/parts/${part._id}`} className="pcf-icon-link" aria-label="View part">
            <FiPackage size={22} />
          </Link>
        </div>

        <div className="pcf-grid">
          <div className="pcf-cell">
            <FiTool size={18} aria-hidden />
            {(part.category || "part").replace(/_/g, " ")}
          </div>
          <div className="pcf-cell">
            <FiPackage size={18} aria-hidden />
            {part.compatibility
              ? String(part.compatibility).slice(0, 18) + (String(part.compatibility).length > 18 ? "…" : "")
              : "Universal"}
          </div>
          <div className="pcf-cell">
            <FiShield size={18} aria-hidden />
            {part.oem ? "OEM" : "Aftermarket"}
          </div>
          <div className="pcf-cell">
            <FiStar size={18} aria-hidden />
            {warrantyLabel(part.warranty)}
          </div>
          <div className="pcf-cell">
            <FiPackage size={18} aria-hidden />
            {part.material || "Standard"}
          </div>
          <div className="pcf-cell">
            <FiTool size={18} aria-hidden />
            {(part.returnPolicy || "7_days").replace(/_/g, " ")}
          </div>
        </div>
      </div>

      <div className="pcf-side">
        <div>
          <div className="pcf-price">{formatPrice(part.price)}</div>
          <div className="pcf-price-label">Price · {part.quantity > 0 ? `${part.quantity} in stock` : "Out of stock"}</div>
          {part.reviews && part.reviews.totalReviews > 0 ? (
            <div className="pcf-rating mt-2">
              <StarRating rating={part.reviews.averageRating} size="sm" />
              <span style={{ fontSize: 12, color: "#64748b" }}>
                ({part.reviews.totalReviews} review{part.reviews.totalReviews !== 1 ? "s" : ""})
              </span>
            </div>
          ) : null}
        </div>

        <div className="pcf-seller">
          <img
            src={avatarSrc}
            alt=""
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop";
            }}
          />
          <div>
            <div className="pcf-seller-name">{sellerName}</div>
            <div className="pcf-seller-sub">Verified seller</div>
          </div>
        </div>

        <div className="pcf-actions">
          <button type="button" className="pcf-btn pcf-btn--primary" onClick={() => navigate(`/parts/${part._id}`)}>
            View details
          </button>
          {part.quantity > 0 ? (
            <button
              type="button"
              className="pcf-btn pcf-btn--cart"
              onClick={handleAddToCart}
              style={isInCart(part._id) ? { background: "#15803d" } : undefined}
            >
              <MdShoppingCart size={18} />
              {isInCart(part._id) ? "In cart" : "Add to cart"}
            </button>
          ) : null}
          <button type="button" className="pcf-btn pcf-btn--ghost" onClick={handleChatClick}>
            <MdChat size={18} />
            Chat with seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartCardFront;
