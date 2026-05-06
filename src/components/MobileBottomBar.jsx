import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getAuthToken } from "../api/client";
import "./MobileBottomBar.css";

const useAuthed = () => {
  const [authed, setAuthed] = useState(() => Boolean(getAuthToken()));
  useEffect(() => {
    const sync = () => setAuthed(Boolean(getAuthToken()));
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);
  return authed;
};

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const IconGavel = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2.5l7 7-10.5 10.5-7-7L14.5 2.5z" />
    <path d="M2 22l5-5" />
    <path d="M10 16l-4 4" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconFilter = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

const IconMall = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconList = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconPackage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
    <path d="M3.29 7 12 12l8.71-5" />
    <path d="M12 22V12" />
  </svg>
);

const IconCart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="20" r="1" />
    <circle cx="20" cy="20" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const LastItem = () => {
  const authed = useAuthed();
  const location = useLocation();
  if (authed) {
    const active = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/user");
    return (
      <Link to="/dashboard" className={`mbb-item ${active ? "active" : ""}`}>
        <span className="mbb-item__icon"><IconDashboard /></span>
        <span className="mbb-item__label">Dashboard</span>
      </Link>
    );
  }
  const active = location.pathname === "/signin" || location.pathname === "/signup";
  return (
    <Link to="/signin" className={`mbb-item ${active ? "active" : ""}`}>
      <span className="mbb-item__icon"><IconUser /></span>
      <span className="mbb-item__label">Account</span>
    </Link>
  );
};

export const MobileBottomBarHome = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      <div className="mobile-bottom-bar__inner">
        <Link to="/" className={`mbb-item ${isActive("/") ? "active" : ""}`}>
          <span className="mbb-item__icon"><IconHome /></span>
          <span className="mbb-item__label">Home</span>
        </Link>

        <Link to="/auctions" className={`mbb-item mbb-item--cta ${isActive("/auctions") ? "active" : ""}`}>
          <span className="mbb-item__icon"><IconGavel /></span>
          <span className="mbb-item__label">Cars</span>
        </Link>

        <Link to="/parts" className={`mbb-item ${isActive("/parts") ? "active" : ""}`}>
          <span className="mbb-item__icon"><IconPackage /></span>
          <span className="mbb-item__label">Parts</span>
        </Link>

        <LastItem />
      </div>
    </nav>
  );
};

export const MobileBottomBarAuctions = ({
  activeFilterCount = 0,
  onFilterOpen,
  onSearchOpen,
}) => {
  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      <div className="mobile-bottom-bar__inner">
        <Link to="/" className="mbb-item">
          <span className="mbb-item__icon"><IconHome /></span>
          <span className="mbb-item__label">Home</span>
        </Link>

        <button className={`mbb-item ${activeFilterCount > 0 ? "active" : ""}`} onClick={onFilterOpen}>
          <span className="mbb-item__icon" style={{ position: "relative" }}>
            <IconFilter />
            {activeFilterCount > 0 && (
              <span className="mbb-badge">{activeFilterCount}</span>
            )}
          </span>
          <span className="mbb-item__label">Filter</span>
        </button>

        <Link to="/auctions" className="mbb-item mbb-item--cta active">
          <span className="mbb-item__icon"><IconGavel /></span>
          <span className="mbb-item__label">Live</span>
        </Link>

        <button className="mbb-item" onClick={onSearchOpen}>
          <span className="mbb-item__icon"><IconSearch /></span>
          <span className="mbb-item__label">Search</span>
        </button>

        <LastItem />
      </div>
    </nav>
  );
};

export const MobileBottomBarDetail = ({
  onBidPress,
  auctionName = "",
  isActive: auctionIsActive = true,
}) => {
  const navigate = useNavigate();
  const [shared, setShared] = useState(false);
  const [watched, setWatched] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: auctionName,
          text: `Check out this auction: ${auctionName}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {}
  };

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      <div className="mobile-bottom-bar__inner">
        <button className="mbb-item" onClick={() => navigate("/auctions")}>
          <span className="mbb-item__icon"><IconBack /></span>
          <span className="mbb-item__label">Back</span>
        </button>

        <button className={`mbb-item ${shared ? "active" : ""}`} onClick={handleShare}>
          <span className="mbb-item__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </span>
          <span className="mbb-item__label">{shared ? "Copied!" : "Share"}</span>
        </button>

        <button
          className="mbb-item mbb-item--cta"
          onClick={onBidPress}
          disabled={!auctionIsActive}
          style={{ opacity: auctionIsActive ? 1 : 0.45 }}
        >
          <span className="mbb-item__icon"><IconGavel /></span>
          <span className="mbb-item__label">{auctionIsActive ? "Bid" : "Ended"}</span>
        </button>

        <button className={`mbb-item ${watched ? "active" : ""}`} onClick={() => setWatched((w) => !w)}>
          <span className="mbb-item__icon">
            <svg viewBox="0 0 24 24" fill={watched ? "#D70007" : "none"} stroke={watched ? "#D70007" : "currentColor"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </span>
          <span className="mbb-item__label">{watched ? "Watching" : "Watch"}</span>
        </button>

        <LastItem />
      </div>
    </nav>
  );
};

export const MobileFilterSheet = ({
  open,
  onClose,
  children,
  title = "Filter Auctions",
  activeFilterCount = 0,
  onClearAll,
}) => {
  const sheetRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="mbb-filter-sheet-overlay" onClick={handleOverlayClick} />
      <div className="mbb-filter-sheet" ref={sheetRef}>
        <div className="mbb-filter-sheet__handle" />
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0 fw-bold" style={{ color: "#212529" }}>{title}</h5>
            {activeFilterCount > 0 && (
              <span className="badge rounded-pill" style={{ backgroundColor: "#D70007", color: "#fff", fontSize: "11px" }}>
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="d-flex align-items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                onClick={onClearAll}
                style={{ background: "none", border: "none", color: "#D70007", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: 0 }}
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: "rgba(0,0,0,0.06)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#212529",
              }}
            >
              <IconClose />
            </button>
          </div>
        </div>
        {children}
        <div style={{ height: "16px" }} />
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #D70007, #ff2a2a)",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(215,0,7,0.4)",
            letterSpacing: "0.5px",
          }}
        >
          Show Results
        </button>
      </div>
    </>
  );
};

export const MobileSearchSheet = ({ open, onClose, value, onChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="mbb-search-sheet">
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(255,255,255,0.4)",
            display: "flex",
          }}
        >
          <IconSearch />
        </span>
        <input
          ref={inputRef}
          className="mbb-search-input"
          style={{ paddingLeft: "48px" }}
          type="text"
          placeholder="Search auctions, makes, models..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button className="mbb-search-close" onClick={onClose}>
          <IconClose />
        </button>
      </div>
    </div>
  );
};

const IconSignIn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const IconSignUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

export const MobileBottomBarAuth = ({ page = "signin" }) => {
  const location = useLocation();
  const isSignin = page === "signin" || location.pathname === "/signin";
  const isSignup = page === "signup" || location.pathname === "/signup";

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      <div className="mobile-bottom-bar__inner">
        <Link to="/" className="mbb-item">
          <span className="mbb-item__icon"><IconHome /></span>
          <span className="mbb-item__label">Home</span>
        </Link>

        <Link to="/auctions" className="mbb-item">
          <span className="mbb-item__icon"><IconGavel /></span>
          <span className="mbb-item__label">Auctions</span>
        </Link>

        <Link to="/signin" className={`mbb-item ${isSignin ? "mbb-item--cta active" : ""}`}>
          <span className="mbb-item__icon"><IconSignIn /></span>
          <span className="mbb-item__label">Sign In</span>
        </Link>

        <Link to="/signup" className={`mbb-item ${isSignup ? "mbb-item--cta active" : ""}`}>
          <span className="mbb-item__icon"><IconSignUp /></span>
          <span className="mbb-item__label">Sign Up</span>
        </Link>
      </div>
    </nav>
  );
};

export const MobileBottomBarDashboard = () => {
  const location = useLocation();
  const { pathname } = location;
  const isActive = (path) => pathname === path || pathname.startsWith(path + "/");
  /** In-app area: main dashboard, settings, and all /user/* account screens */
  const dashActive =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname.startsWith("/user/");

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      <div className="mobile-bottom-bar__inner">
        <Link to="/" className={`mbb-item ${isActive("/") ? "active" : ""}`}>
          <span className="mbb-item__icon"><IconHome /></span>
          <span className="mbb-item__label">Home</span>
        </Link>

        <Link to="/auctions" className={`mbb-item ${isActive("/auctions") ? "active" : ""}`}>
          <span className="mbb-item__icon"><IconList /></span>
          <span className="mbb-item__label">Bids</span>
        </Link>

        <Link to="/dashboard" className={`mbb-item mbb-item--cta ${dashActive ? "active" : ""}`}>
          <span className="mbb-item__icon"><IconDashboard /></span>
          <span className="mbb-item__label">Dashboard</span>
        </Link>

        <Link to="/user/listings/new" className={`mbb-item ${isActive("/user/listings/new") ? "active" : ""}`}>
          <span className="mbb-item__icon"><IconPlus /></span>
          <span className="mbb-item__label">Add</span>
        </Link>

        <Link to="/dashboard/settings" className={`mbb-item ${isActive("/dashboard/settings") ? "active" : ""}`}>
          <span className="mbb-item__icon"><IconUser /></span>
          <span className="mbb-item__label">Account</span>
        </Link>
      </div>
    </nav>
  );
};

export const MobileBottomBarParts = ({
  activeFilterCount = 0,
  onFilterOpen,
  onSearchOpen,
}) => (
  <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
    <div className="mobile-bottom-bar__inner">
      <Link to="/" className="mbb-item">
        <span className="mbb-item__icon"><IconHome /></span>
        <span className="mbb-item__label">Home</span>
      </Link>

      <button className={`mbb-item ${activeFilterCount > 0 ? "active" : ""}`} onClick={onFilterOpen}>
        <span className="mbb-item__icon" style={{ position: "relative" }}>
          <IconFilter />
          {activeFilterCount > 0 && <span className="mbb-badge">{activeFilterCount}</span>}
        </span>
        <span className="mbb-item__label">Filter</span>
      </button>

      <Link to="/parts" className="mbb-item mbb-item--cta active">
        <span className="mbb-item__icon"><IconPackage /></span>
        <span className="mbb-item__label">Parts</span>
      </Link>

      <button className="mbb-item" onClick={onSearchOpen}>
        <span className="mbb-item__icon"><IconSearch /></span>
        <span className="mbb-item__label">Search</span>
      </button>

      <LastItem />
    </div>
  </nav>
);

export const MobileBottomBarPartDetail = ({
  onPrimaryAction,
  isInCart = false,
  canBuy = true,
}) => {
  const navigate = useNavigate();
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Part details", url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {}
  };

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      <div className="mobile-bottom-bar__inner">
        <button className="mbb-item" onClick={() => navigate("/parts")}>
          <span className="mbb-item__icon"><IconBack /></span>
          <span className="mbb-item__label">Back</span>
        </button>

        <button className={`mbb-item ${shared ? "active" : ""}`} onClick={handleShare}>
          <span className="mbb-item__icon"><IconSearch /></span>
          <span className="mbb-item__label">{shared ? "Copied!" : "Share"}</span>
        </button>

        <button className="mbb-item mbb-item--cta" onClick={onPrimaryAction} disabled={!canBuy}>
          <span className="mbb-item__icon">{isInCart ? <IconCart /> : <IconPackage />}</span>
          <span className="mbb-item__label">{canBuy ? (isInCart ? "In Cart" : "Add") : "Sold"}</span>
        </button>

        <Link to="/cart" className="mbb-item">
          <span className="mbb-item__icon"><IconCart /></span>
          <span className="mbb-item__label">Cart</span>
        </Link>

        <LastItem />
      </div>
    </nav>
  );
};

export default MobileBottomBarHome;
