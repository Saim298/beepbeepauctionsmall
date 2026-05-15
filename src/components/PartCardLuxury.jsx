import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiPackage, FiTool } from "react-icons/fi";
import { MdShoppingCart } from "react-icons/md";
import { useCart } from "../context/CartContext.jsx";
import { collectPartImageUrls, toAbsUrl, PART_IMAGE_PLACEHOLDER } from "../utils/partMedia";

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

function userInitials(user) {
  if (!user) return "?";
  const name = (user.name || user.username || user.email || "U").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  return name.slice(0, 2).toUpperCase();
}

function conditionLabel(c) {
  if (!c) return "—";
  const map = {
    new: "New",
    used_excellent: "Exc.",
    used_good: "Good",
    used_fair: "Fair",
    refurbished: "Refurb.",
    remanufactured: "Reman.",
  };
  return map[c] || String(c).replace(/_/g, " ");
}

const PartCardLuxury = ({ part }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);

  const imageUrls = useMemo(() => {
    const raw = collectPartImageUrls(part);
    return raw.map((u) => toAbsUrl(u)).filter(Boolean);
  }, [part]);

  const displayUrls = imageUrls.length ? imageUrls : [PART_IMAGE_PLACEHOLDER];
  const primarySrc = displayUrls[Math.min(imgIndex, displayUrls.length - 1)];

  const seller =
    typeof part.seller === "object" && part.seller ? part.seller : null;
  const sellerName = seller
    ? seller.username || seller.name || seller.email || "Seller"
    : "Seller";
  const sellerAv =
    seller?.avatarUrl ? toAbsUrl(seller.avatarUrl) : null;
  const inStock = Number(part.quantity || 0) > 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await addToCart(part, 1);
    } catch (error) {
      alert(error.message || "Please sign in to add items to cart");
    }
  };

  return (
    <div className="lux-card">
      <div
        className="lux-card-image-wrap"
        onClick={() => navigate(`/parts/${part._id}`)}
        style={{ cursor: "pointer" }}
        role="presentation"
      >
        <img
          src={primarySrc}
          alt=""
          className="lux-card-img"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
          }}
        />
        <div className="lux-card-gradient" />

        {inStock ? (
          <div className="lux-badge-live">
            <span className="dot" />
            In stock
          </div>
        ) : (
          <div
            className="lux-badge-live"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            Out of stock
          </div>
        )}

        <button
          type="button"
          className="lux-btn-fav"
          aria-label="Favorite"
          onClick={(e) => e.stopPropagation()}
        >
          <FiHeart size={18} />
        </button>

        {displayUrls.length > 1 ? (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              left: 12,
              display: "flex",
              gap: 6,
              overflowX: "auto",
              paddingTop: 8,
            }}
          >
            {displayUrls.slice(0, 5).map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImgIndex(i);
                }}
                style={{
                  flex: "0 0 44px",
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  overflow: "hidden",
                  border:
                    i === imgIndex
                      ? "2px solid #D70007"
                      : "2px solid rgba(255,255,255,0.2)",
                  padding: 0,
                  cursor: "pointer",
                  background: "#111",
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
                  }}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="lux-card-content">
        <h3 className="lux-card-title">{part.name || "Part"}</h3>

        <div className="lux-card-specs">
          <span>
            <FiPackage /> {part.brand || "—"}
          </span>
          <span>
            <FiTool />{" "}
            {(part.category || "General").replace(/_/g, " ").slice(0, 22)}
          </span>
          <span>{conditionLabel(part.condition)}</span>
        </div>

        <div className="lux-bid-row">
          <div>
            <div className="lux-bid-label">Price</div>
            <div className="lux-bid-amount">{formatPrice(part.price)}</div>
          </div>
          <div className="lux-bid-avatars">
            {sellerAv ? (
              <div
                className="lux-avatar-mini lux-avatar-mini--img"
                title={sellerName}
              >
                <img src={sellerAv} alt="" />
              </div>
            ) : (
              <div
                className="lux-avatar-mini"
                style={{ background: "#444" }}
                title={sellerName}
              >
                {userInitials(seller)}
              </div>
            )}
          </div>
        </div>

        <div className="lux-card-actions">
          <button
            type="button"
            className="lux-btn-secondary"
            onClick={() => navigate(`/parts/${part._id}`)}
          >
            Details
          </button>
          {inStock ? (
            <button
              type="button"
              className="lux-btn-primary"
              onClick={handleAddToCart}
              style={
                isInCart(part._id)
                  ? { background: "#15803d", boxShadow: "none" }
                  : undefined
              }
            >
              <MdShoppingCart
                size={18}
                style={{ verticalAlign: "middle", marginRight: 8 }}
              />
              {isInCart(part._id) ? "In cart" : "Add to cart"}
            </button>
          ) : (
            <button type="button" className="lux-btn-primary" disabled>
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartCardLuxury;
