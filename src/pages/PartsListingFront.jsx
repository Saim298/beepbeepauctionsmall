import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiSliders,
  FiHome,
  FiShoppingCart,
  FiPackage,
} from "react-icons/fi";
import { MdOutlineDashboard, MdGavel } from "react-icons/md";
import FiltersSidebar from "../components/FiltersSidebar";
import PartCardLuxury from "../components/PartCardLuxury";
import { useCart } from "../context/CartContext.jsx";
import { getAuthToken } from "../api/client";
import "./AuctionsFrontLayout.css";
import "./PartsListingFront.css";
import { BRAND_NAME_SHORT } from "../constants/brand.js";

const apiBase = (import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com").replace(
  /\/$/,
  ""
);

const userInitials = (user) => {
  if (!user) return "?";
  const name = (user.name || user.username || user.email || "U").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase();
};

const userAvatarSrc = (user) => {
  if (!user) return null;
  const raw = user.avatarUrl || user.avatarFile;
  if (!raw) return null;
  const s = String(raw).trim();
  if (s.startsWith("http") || s.startsWith("data:")) return s;
  const path = s.startsWith("/") ? s : `/${s}`;
  return `${apiBase}${path}`;
};

const PartsLuxuryTopNavbar = ({ q, setQ, navUser }) => {
  const { itemCount } = useCart();
  const avatar = userAvatarSrc(navUser);
  const initials = userInitials(navUser);
  return (
    <div className="lux-navbar d-none d-lg-flex">
      <Link to="/" className="lux-nav-logo">
        {BRAND_NAME_SHORT.slice(0, 4)}
        <span>{BRAND_NAME_SHORT.slice(4)}</span>
      </Link>
      <div className="lux-nav-search">
        <FiSearch className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search parts, brands, OEM numbers..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="lux-nav-actions">
        <button type="button" className="lux-nav-btn" aria-label="Saved">
          <FiHeart />
        </button>
        <Link to="/cart" className="lux-nav-btn position-relative" title="Cart">
          <FiShoppingCart />
          {itemCount > 0 ? (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "#D70007",
                color: "#fff",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: 11,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          ) : null}
        </Link>
        <Link
          to="/dashboard"
          className="lux-nav-profile"
          title={navUser?.name || "Dashboard"}
        >
          {avatar ? (
            <img src={avatar} alt="" className="lux-nav-profile-img" />
          ) : (
            initials
          )}
        </Link>
      </div>
    </div>
  );
};

const PartsLuxuryMobileHeader = () => {
  const { itemCount } = useCart();
  return (
    <div className="lux-mobile-header">
      <Link to="/" className="lux-nav-btn" aria-label="Home">
        <FiHome size={22} />
      </Link>
      <Link to="/" className="lux-nav-logo" style={{ fontSize: "20px" }}>
        {BRAND_NAME_SHORT.slice(0, 4)}
        <span>{BRAND_NAME_SHORT.slice(4)}</span>
      </Link>
      <Link to="/cart" className="lux-nav-btn position-relative" aria-label="Cart">
        <FiShoppingCart size={22} />
        {itemCount > 0 ? (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "#D70007",
              color: "#fff",
              borderRadius: "50%",
              width: 16,
              height: 16,
              fontSize: 10,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        ) : null}
      </Link>
    </div>
  );
};

const PartsLuxuryMobileDock = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  return (
    <div className="lux-mobile-dock">
      <Link to="/" className={`lux-dock-item ${isActive("/") ? "active" : ""}`}>
        <FiHome className="lux-dock-icon" />
        <span className="lux-dock-label">Home</span>
      </Link>
      <Link
        to="/auctions"
        className={`lux-dock-item ${location.pathname.startsWith("/auctions") ? "active" : ""}`}
      >
        <MdGavel className="lux-dock-icon" />
        <span className="lux-dock-label">Auctions</span>
      </Link>
      <Link
        to="/parts"
        className={`lux-dock-item ${isActive("/parts") ? "active" : ""}`}
      >
        <FiPackage className="lux-dock-icon" />
        <span className="lux-dock-label">Parts</span>
      </Link>
      <Link to="/cart" className={`lux-dock-item ${isActive("/cart") ? "active" : ""}`}>
        <FiShoppingCart className="lux-dock-icon" />
        <span className="lux-dock-label">Cart</span>
      </Link>
      <Link
        to="/dashboard"
        className={`lux-dock-item ${location.pathname.startsWith("/dashboard") ? "active" : ""}`}
      >
        <MdOutlineDashboard className="lux-dock-icon" />
        <span className="lux-dock-label">Dashboard</span>
      </Link>
    </div>
  );
};

const PartsLuxuryMobileFilterSheet = ({
  open,
  onClose,
  filters,
  setFilters,
  brands,
  categories,
  clearAll,
  activeFilterCount,
}) => (
  <>
    <div
      className={`lux-bottom-sheet-overlay ${open ? "open" : ""}`}
      onClick={onClose}
      role="presentation"
    />
    <div className={`lux-bottom-sheet ${open ? "open" : ""}`}>
      <div className="lux-sheet-handle" />
      <div className="lux-sheet-header">
        <h3 className="lux-sheet-title">Filters</h3>
        <button
          type="button"
          className="lux-nav-btn"
          onClick={clearAll}
          style={{ fontSize: "14px", color: "#D70007" }}
        >
          Clear all
        </button>
      </div>
      <div className="lux-sheet-content">
        <FiltersSidebar
          luxury
          hideSearch
          q=""
          setQ={() => {}}
          filters={filters}
          setFilters={setFilters}
          brands={brands}
          categories={categories}
          activeFilterCount={activeFilterCount}
        />
      </div>
      <div className="lux-sheet-footer">
        <button
          type="button"
          className="lux-btn-primary"
          style={{ width: "100%" }}
          onClick={onClose}
        >
          Apply filters
        </button>
      </div>
    </div>
  </>
);

const PartsListingFront = () => {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [navUser, setNavUser] = useState(null);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    condition: "",
    priceRange: "",
    compatibility: "",
  });

  const activeFilterCount = useMemo(() => {
    return [
      q,
      filters.brand,
      filters.category,
      filters.condition,
      filters.priceRange,
      filters.compatibility,
    ].filter(Boolean).length;
  }, [q, filters]);

  const filtersOnlyCount = useMemo(() => {
    return [
      filters.brand,
      filters.category,
      filters.condition,
      filters.priceRange,
      filters.compatibility,
    ].filter(Boolean).length;
  }, [filters]);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
  const prevFiltersKey = useRef(filtersKey);
  useEffect(() => {
    if (prevFiltersKey.current !== filtersKey) {
      prevFiltersKey.current = filtersKey;
      setPage(1);
    }
  }, [filtersKey]);

  useEffect(() => {
    fetch(`${apiBase}/api/parts/brands`)
      .then((r) => r.json())
      .then(setBrands)
      .catch(() => {});
    fetch(`${apiBase}/api/parts/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setNavUser(null);
      return;
    }
    fetch(`${apiBase}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) return null;
        return r.ok ? r.json() : null;
      })
      .then((data) => setNavUser(data?.user || null))
      .catch(() => setNavUser(null));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
    });
    if (q) params.set("search", q);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.category) params.set("category", filters.category);
    if (filters.condition) params.set("condition", filters.condition);
    if (filters.compatibility) params.set("compatibility", filters.compatibility);
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }

    fetch(`${apiBase}/api/parts?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then(({ parts: partsData, pagination }) => {
        const visibleParts = (partsData || []).filter(
          (part) => part?.status === "active" && Number(part?.quantity || 0) > 0
        );
        setParts(visibleParts);
        setTotal(pagination?.totalParts || visibleParts.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [q, sort, page, limit, filters]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const clearAllFilters = () => {
    setQ("");
    setFilters({
      brand: "",
      category: "",
      condition: "",
      priceRange: "",
      compatibility: "",
    });
  };

  return (
    <div className="luxury-auctions-page parts-listing-root">
      <PartsLuxuryTopNavbar q={q} setQ={setQ} navUser={navUser} />
      <PartsLuxuryMobileHeader />

      <div className="lux-mobile-search-bar">
        <div className="position-relative">
          <FiSearch className="lux-mobile-search-icon" size={20} />
          <input
            type="text"
            className="lux-mobile-search-input"
            placeholder="Search parts, brands, compatibility..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <section className="lux-hero">
        <div className="lux-hero-glow" />
        <h1 className="lux-hero-title">Shop verified auto parts</h1>
        <p className="lux-hero-subtitle">
          OEM and aftermarket parts from trusted sellers — same polish as live
          auctions, built for the parts catalog.
        </p>

        <div className="lux-quick-filters">
          <button
            type="button"
            className={`lux-quick-pill ${activeFilterCount === 0 ? "active" : ""}`}
            onClick={clearAllFilters}
          >
            All parts
          </button>
          <button
            type="button"
            className={`lux-quick-pill ${filters.condition === "new" ? "active" : ""}`}
            onClick={() =>
              setFilters((p) => ({
                ...p,
                condition: p.condition === "new" ? "" : "new",
              }))
            }
          >
            New only
          </button>
          {(Array.isArray(categories) ? categories : []).slice(0, 4).map((c) => (
            <button
              key={c}
              type="button"
              className={`lux-quick-pill ${filters.category === c ? "active" : ""}`}
              onClick={() =>
                setFilters((p) => ({
                  ...p,
                  category: p.category === c ? "" : c,
                }))
              }
            >
              {typeof c === "string" ? c.replace(/_/g, " ") : c}
            </button>
          ))}
        </div>
      </section>

      <div className="lux-main-container">
        <aside className="lux-sidebar">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Filters</h3>
            {activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={clearAllFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "#D70007",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            ) : null}
          </div>
          <FiltersSidebar
            luxury
            hideSearch
            q={q}
            setQ={setQ}
            filters={filters}
            setFilters={setFilters}
            brands={brands}
            categories={categories}
            activeFilterCount={activeFilterCount}
          />
        </aside>

        <main>
          <div className="lux-grid-header">
            <div className="lux-results-count">
              {total} <span>Parts found</span>
            </div>
            <div className="d-none d-md-block">
              <select
                className="lux-select"
                style={{ width: 220 }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="-createdAt">Newly listed</option>
                <option value="createdAt">Oldest</option>
                <option value="-price">Price: high to low</option>
                <option value="price">Price: low to high</option>
                <option value="name">Name A–Z</option>
                <option value="-name">Name Z–A</option>
                <option value="-views">Most viewed</option>
                <option value="views">Least viewed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="lux-empty-state">
              <div
                className="spinner-border text-danger"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <h3 className="lux-empty-title mt-4">Loading parts</h3>
            </div>
          ) : parts.length === 0 ? (
            <div className="lux-empty-state">
              <FiPackage className="lux-empty-icon" />
              <h3 className="lux-empty-title">No matching parts</h3>
              <p className="lux-empty-desc">
                Try clearing filters or broadening your search.
              </p>
              <button
                type="button"
                className="lux-btn-secondary"
                style={{ maxWidth: 220, margin: "0 auto", display: "block" }}
                onClick={clearAllFilters}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="lux-auctions-grid">
              {parts.map((part) => (
                <PartCardLuxury key={part._id} part={part} />
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="lux-pagination">
              <button
                type="button"
                className="lux-page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let start = Math.max(1, page - 2);
                if (start + 4 > totalPages) start = Math.max(1, totalPages - 4);
                const pNum = start + i;
                return (
                  <button
                    key={pNum}
                    type="button"
                    className={`lux-page-btn ${page === pNum ? "active" : ""}`}
                    onClick={() => setPage(pNum)}
                  >
                    {pNum}
                  </button>
                );
              })}
              <button
                type="button"
                className="lux-page-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          ) : null}
        </main>
      </div>

      <button
        type="button"
        className="lux-fab-filter"
        onClick={() => setMobileFilterOpen(true)}
        aria-label="Open filters"
      >
        <FiSliders />
        {filtersOnlyCount > 0 ? (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "#fff",
              color: "#000",
              borderRadius: "50%",
              width: 18,
              height: 18,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
            }}
          >
            {filtersOnlyCount}
          </span>
        ) : null}
      </button>

      <PartsLuxuryMobileDock />

      <PartsLuxuryMobileFilterSheet
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        brands={brands}
        categories={categories}
        clearAll={clearAllFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
};

export default PartsListingFront;
