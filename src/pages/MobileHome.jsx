import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MobileHome.css";
import BeepVintageVideo from "../assets/Videos/Beep Vintage Car.mp4";
import { MobileBottomBarHome } from "../components/MobileBottomBar";
import { partHeroImageSrc, PART_IMAGE_PLACEHOLDER } from "../utils/partMedia";

const API_BASE = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const PART_CATEGORIES = [
  { key: "engine", name: "Engine", icon: "fa-gears" },
  { key: "brakes", name: "Brakes", icon: "fa-circle-stop" },
  { key: "suspension", name: "Susp.", icon: "fa-car" },
  { key: "electrical", name: "Electrical", icon: "fa-bolt" },
  { key: "exterior", name: "Exterior", icon: "fa-car-side" },
  { key: "wheels_tires", name: "Wheels", icon: "fa-circle-notch" },
];

function formatPrice(val) {
  const v = typeof val === "number" ? val : parseFloat(String(val ?? ""));
  if (Number.isNaN(v)) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

function formatCondition(c) {
  if (!c) return "—";
  return String(c).replace(/_/g, " ").replace(/\b\w/g, (x) => x.toUpperCase());
}

const StarRating = ({ rating }) => {
  const r = Math.round(Number(rating) || 0);
  return (
    <div className="mh-stars">
      {[...Array(5)].map((_, i) => (
        <i key={i} className={`fa-solid fa-star ${i < r ? "" : "opacity-25"}`} />
      ))}
    </div>
  );
};

export default function MobileHome() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/parts/featured?limit=10`, { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        const raw = Array.isArray(data.parts) ? data.parts : [];
        const visible = raw.filter((p) => {
          if (!p) return false;
          if (p.status && p.status !== "active") return false;
          return Number(p?.quantity || 0) > 0;
        });
        if (!cancelled) setParts(visible);
      } catch {
        if (!cancelled) setParts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalQty = parts.reduce((s, p) => s + (Number(p.quantity) || 0), 0);
  const totalViews = parts.reduce((s, p) => s + (Number(p.views) || 0), 0);
  const brands = new Set(parts.map((p) => p.brand).filter(Boolean)).size;

  const filteredParts =
    activeCat === 0 ? parts : parts.filter((p) => p.category === PART_CATEGORIES[activeCat - 1]?.key);

  return (
    <div className="mobile-home-container">
      <section className="mh-hero-section">
        <video autoPlay muted loop playsInline className="mh-video-bg">
          <source src={BeepVintageVideo} type="video/mp4" />
        </video>
        <div className="mh-hero-overlay" />
        <div className="mh-hero-content">
          <div className="mh-live-indicator">
            <span className="mh-live-dot" />
            <span className="mh-live-text">Parts marketplace</span>
          </div>
          <h1 className="mh-hero-title">
            Genuine parts.
            <br />
            Trusted sellers.
          </h1>
          <p className="mh-hero-subtitle">
            OEM and aftermarket components — browse featured inventory updated from our catalog.
          </p>
          <div className="mh-hero-buttons">
            <Link to="/parts" className="mh-btn-primary">
              Shop parts
            </Link>
            <Link to="/signup" className="mh-btn-secondary">
              Sell parts
            </Link>
          </div>
        </div>
      </section>

      <section className="mh-stats-section">
        <div className="mh-stats-scroll hide-scrollbar">
          <div className="mh-stat-card">
            <span className="mh-stat-value">{parts.length}</span>
            <span className="mh-stat-label">Featured picks</span>
          </div>
          <div className="mh-stat-card">
            <span className="mh-stat-value">{totalQty || "—"}</span>
            <span className="mh-stat-label">In stock units</span>
          </div>
          <div className="mh-stat-card">
            <span className="mh-stat-value">{brands || "—"}</span>
            <span className="mh-stat-label">Brands shown</span>
          </div>
          <div className="mh-stat-card">
            <span className="mh-stat-value">
              {totalViews > 999 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews || "—"}
            </span>
            <span className="mh-stat-label">Catalog views</span>
          </div>
        </div>
      </section>

      <section className="mh-section" style={{ paddingTop: "10px" }}>
        <div className="mh-categories-scroll hide-scrollbar">
          <div
            className={`mh-category-card ${activeCat === 0 ? "active" : ""}`}
            onClick={() => setActiveCat(0)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveCat(0)}
          >
            <div className="mh-category-icon">
              <i className="fa-solid fa-layer-group" />
            </div>
            <span className="mh-category-name">All</span>
          </div>
          {PART_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.key}
              className={`mh-category-card ${activeCat === idx + 1 ? "active" : ""}`}
              onClick={() => setActiveCat(idx + 1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveCat(idx + 1)}
            >
              <div className="mh-category-icon">
                <i className={`fa-solid ${cat.icon}`} />
              </div>
              <span className="mh-category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mh-section">
        <div className="mh-section-header">
          <h2 className="mh-section-title">Featured parts</h2>
          <Link to="/parts" className="mh-section-link">
            View all
          </Link>
        </div>
        <div className="mh-cars-scroll hide-scrollbar">
          {loading ? (
            <div style={{ color: "#888", padding: "20px" }}>Loading featured parts…</div>
          ) : filteredParts.length === 0 ? (
            <div style={{ color: "#888", padding: "20px" }}>
              No parts in this filter. Try &quot;All&quot; or browse the full catalog.
            </div>
          ) : (
            filteredParts.map((part, idx) => {
              const imgUrl = partHeroImageSrc(part);
              return (
                <Link to={`/parts/${part._id}`} key={part._id || idx} className="mh-car-card" style={{ textDecoration: "none" }}>
                  <div className="mh-car-image-container">
                    <img
                      src={imgUrl}
                      alt=""
                      className="mh-car-image"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
                      }}
                    />
                    <div className="mh-car-badges">
                      <div className="mh-badge-live">
                        <span className="dot" /> In stock
                      </div>
                      <span className="mh-btn-fav" aria-hidden>
                        <i className="fa-regular fa-heart" />
                      </span>
                    </div>
                  </div>
                  <div className="mh-car-info">
                    <h3 className="mh-car-title">{part.name}</h3>
                    <div className="mh-car-specs">
                      <div className="mh-spec">
                        <i className="fa-solid fa-tag" />
                        <span>{part.brand || "Brand"}</span>
                      </div>
                      <div className="mh-spec">
                        <i className="fa-solid fa-box" />
                        <span>{part.quantity ?? 0} left</span>
                      </div>
                    </div>
                    <div className="mh-car-price-row">
                      <div>
                        <div className="mh-car-price-label">Price</div>
                        <div className="mh-car-price">{formatPrice(part.price)}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="mh-car-price-label">Condition</div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{formatCondition(part.condition)}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      <section className="mh-section">
        <div className="mh-section-header">
          <h2 className="mh-section-title">Why shop here</h2>
        </div>
        <div className="mh-features-grid">
          <div className="mh-feature-card">
            <div className="mh-feature-icon">
              <i className="fa-solid fa-truck-fast" />
            </div>
            <div className="mh-feature-title">
              Fast
              <br />
              fulfillment
            </div>
          </div>
          <div className="mh-feature-card">
            <div className="mh-feature-icon">
              <i className="fa-solid fa-shield-halved" />
            </div>
            <div className="mh-feature-title">
              Verified
              <br />
              listings
            </div>
          </div>
          <div className="mh-feature-card">
            <div className="mh-feature-icon">
              <i className="fa-solid fa-rotate-left" />
            </div>
            <div className="mh-feature-title">
              Clear
              <br />
              returns policy
            </div>
          </div>
          <div className="mh-feature-card">
            <div className="mh-feature-icon">
              <i className="fa-solid fa-headset" />
            </div>
            <div className="mh-feature-title">
              Seller
              <br />
              messaging
            </div>
          </div>
        </div>
      </section>

      <section className="mh-section" style={{ paddingBottom: "10px" }}>
        <div className="mh-section-header">
          <h2 className="mh-section-title">Buyers say</h2>
        </div>
        <div className="mh-testimonials-scroll hide-scrollbar">
          <div className="mh-testimonial-card">
            <StarRating rating={5} />
            <p className="mh-review-text">
              &quot;Found a hard-to-source timing kit. Shipped fast and matched the listing photos.&quot;
            </p>
            <div className="mh-user-info">
              <img src="https://i.pravatar.cc/150?u=parts1" alt="" className="mh-user-avatar" />
              <div className="mh-user-details">
                <span className="mh-user-name">Chris P.</span>
                <span className="mh-user-car">Brake & suspension parts</span>
              </div>
            </div>
          </div>
          <div className="mh-testimonial-card">
            <StarRating rating={5} />
            <p className="mh-review-text">&quot;Clean checkout and tracking. My alternator was exactly as described.&quot;</p>
            <div className="mh-user-info">
              <img src="https://i.pravatar.cc/150?u=parts2" alt="" className="mh-user-avatar" />
              <div className="mh-user-details">
                <span className="mh-user-name">Samira L.</span>
                <span className="mh-user-car">Electrical & engine</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mh-final-cta">
        <div className="mh-cta-glow" />
        <div className="mh-cta-content">
          <h2 className="mh-cta-title">Need a specific part?</h2>
          <p className="mh-cta-subtitle">Search the full marketplace — filters by vehicle, brand, and category.</p>
          <Link to="/parts" className="mh-cta-btn" style={{ display: "inline-block", textDecoration: "none", textAlign: "center" }}>
            Browse catalog
          </Link>
        </div>
      </section>

      <MobileBottomBarHome />
    </div>
  );
}
