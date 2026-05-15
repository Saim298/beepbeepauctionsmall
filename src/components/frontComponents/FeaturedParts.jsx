import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiStar, FiEye } from "react-icons/fi";
import { apiRequest } from "../../api/client";
import { partHeroImageSrc, PART_IMAGE_PLACEHOLDER } from "../../utils/partMedia";
import "./FeaturedParts.css";

function formatPrice(part) {
  const raw = part?.price;
  let n = typeof raw === "number" ? raw : parseFloat(String(raw ?? ""));
  if (Number.isNaN(n)) n = 0;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}

function sellerDisplayName(part) {
  const s = part?.seller;
  if (!s) return "Verified seller";
  if (typeof s === "string") return "Verified seller";
  return s.username || s.name || s.email || "Verified seller";
}

function formatCondition(c) {
  if (!c) return "New";
  return String(c)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (x) => x.toUpperCase());
}

function formatCategory(cat) {
  if (!cat) return "";
  return String(cat).replace(/_/g, " ").replace(/\b\w/g, (x) => x.toUpperCase());
}

const FeaturedParts = () => {
  const [featuredParts, setFeaturedParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest("/api/parts/featured?limit=10", { method: "GET" });
      const raw = Array.isArray(response.parts) ? response.parts : [];
      const visible = raw.filter((p) => {
        if (!p) return false;
        if (p.status && p.status !== "active") return false;
        return Number(p.quantity || 0) > 0;
      });
      setFeaturedParts(visible);
    } catch (err) {
      console.error("Error fetching featured parts:", err);
      setError(err.message || "Could not load parts");
      setFeaturedParts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const heroSrc = (part) => partHeroImageSrc(part);

  if (loading) {
    return (
      <section className="fp-section d-none d-md-block" aria-busy="true">
        <div className="fp-inner">
          <div className="fp-loading">Loading featured parts…</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="fp-section d-none d-md-block">
        <div className="fp-inner">
          <div className="fp-error">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="fp-section d-none d-md-block" aria-labelledby="fp-heading">
      <div className="fp-inner">
        <header className="fp-head">
          <p className="fp-kicker">Marketplace</p>
          <h2 id="fp-heading" className="fp-title">
            Featured car products
          </h2>
          <p className="fp-sub">Top-viewed, in-stock parts from sellers — same catalog as parts search.</p>
        </header>

        {featuredParts.length === 0 ? (
          <div className="fp-empty">No featured parts yet. List a part or check back soon.</div>
        ) : (
          <div className="fp-grid">
            {featuredParts.map((part) => {
              const imgSrc = heroSrc(part);
              const rating = Number(part.reviews?.averageRating) || 0;
              const reviews = Number(part.reviews?.totalReviews) || 0;
              const views = Number(part.views) || 0;

              return (
                <article key={part._id} className="fp-card">
                  <Link to={`/parts/${part._id}`} className="fp-card-media">
                    <img
                      src={imgSrc}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
                      }}
                    />
                    <div className="fp-card-badges">
                      <span className="fp-pill">
                        <FiStar size={12} style={{ color: "#fbbf24" }} aria-hidden />
                        {rating.toFixed(1)} ({reviews})
                      </span>
                      <span className="fp-pill fp-pill--accent">
                        <FiEye size={12} aria-hidden />
                        {views} views
                      </span>
                    </div>
                  </Link>
                  <div className="fp-card-body">
                    <h3 className="fp-card-title">{part.name}</h3>
                    <p className="fp-brand">{part.brand || "OEM / aftermarket"}</p>
                    <div className="fp-meta">
                      <span className="fp-chip">{formatCondition(part.condition)}</span>
                      {part.category ? <span className="fp-chip">{formatCategory(part.category)}</span> : null}
                      {Number(part.quantity) > 0 ? (
                        <span className="fp-chip">{Number(part.quantity)} in stock</span>
                      ) : null}
                    </div>
                    <div className="fp-row">
                      <div className="fp-price">{formatPrice(part)}</div>
                    </div>
                    <div className="fp-seller">
                      <span>Seller</span>
                      {sellerDisplayName(part)}
                    </div>
                    <div className="fp-actions">
                      <Link to={`/parts/${part._id}`} className="fp-btn fp-btn--primary">
                        Buy now
                      </Link>
                      <Link to={`/parts/${part._id}`} className="fp-btn fp-btn--ghost">
                        Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="fp-foot">
          <Link to="/parts" className="fp-all">
            Explore all products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedParts;
