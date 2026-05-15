import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiAward,
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiEye,
  FiHeart,
  FiMapPin,
  FiMessageSquare,
  FiPackage,
  FiRotateCcw,
  FiRefreshCw,
  FiShare2,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiX,
} from "react-icons/fi";
import { HiChevronRight, HiHome } from "react-icons/hi";
import { BsFacebook, BsTwitterX, BsWhatsapp } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import "./PartDetailFront.css";
import "./PartDetailAuctionLayout.css";
import { getAuthToken } from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";
import ReviewsList from "../components/ReviewsList.jsx";
import { MobileBottomBarPartDetail } from "../components/MobileBottomBar";
import { collectPartImageUrls, toAbsUrl, PART_IMAGE_PLACEHOLDER } from "../utils/partMedia.js";

const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const CONDITION_MAP = {
  new: { cls: "pdf-badge-red", label: "New", icon: <FiAward size={13} /> },
  used_excellent: { cls: "pdf-badge-light", label: "Used - Excellent", icon: <FiStar size={13} /> },
  used_good: { cls: "pdf-badge-light", label: "Used - Good", icon: <FiCheckCircle size={13} /> },
  used_fair: { cls: "pdf-badge-light", label: "Used - Fair", icon: <FiCheck size={13} /> },
  refurbished: { cls: "pdf-badge-light", label: "Refurbished", icon: <FiRefreshCw size={13} /> },
  remanufactured: { cls: "pdf-badge-dark", label: "Remanufactured", icon: <FiRotateCcw size={13} /> },
};

const conditionBadge = (condition) =>
  CONDITION_MAP[condition] || { cls: "pdf-badge-gray", label: condition || "Unknown", icon: <FiPackage size={13} /> };

function ShareModal({ url, title, onClose }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const socialLinks = [
    {
      label: "WhatsApp",
      icon: <BsWhatsapp size={18} color="#25D366" />,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "Facebook",
      icon: <BsFacebook size={18} color="#1877F2" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Twitter / X",
      icon: <BsTwitterX size={18} />,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Email",
      icon: <MdEmail size={20} color="#D70007" />,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="pdf-overlay" onClick={onClose}>
      <div className="pdf-modal pdf-modal--dark" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="pdf-modal-close" onClick={onClose} aria-label="Close share modal">
          <FiX size={16} />
        </button>
        <h3>Share this Part</h3>
        <p>Share with friends or social media</p>
        <div className="pdf-share-grid">
          {socialLinks.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="pdf-share-btn">
              {s.icon} {s.label}
            </a>
          ))}
        </div>
        <div className="pdf-copy-row">
          <input className="pdf-copy-input" value={url} readOnly />
          <button type="button" className="pdf-copy-btn" onClick={copyLink}>
            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Lightbox({ images, startIdx, onClose }) {
  const [index, setIndex] = useState(startIdx);
  const prev = () => setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  return (
    <div className="pdf-lb-overlay" onClick={onClose}>
      <img
        className="pdf-lb-img"
        src={images[index] || PART_IMAGE_PLACEHOLDER}
        alt=""
        onClick={(e) => e.stopPropagation()}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
        }}
      />
      <button type="button" className="pdf-lb-close" onClick={onClose} aria-label="Close image viewer">
        <FiX size={20} />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" className="pdf-lb-nav pdf-lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image">
            <FiChevronLeft size={22} />
          </button>
          <button type="button" className="pdf-lb-nav pdf-lb-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image">
            <FiChevronRight size={22} />
          </button>
          <div className="pdf-lb-counter">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

const PartDetailFront = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, clearCart } = useCart();
  const [part, setPart] = useState(null);
  const [similarParts, setSimilarParts] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const syncCurrentUser = useCallback(async () => {
    setAuthLoading(true);
    try {
      const token = getAuthToken();
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${apiBase}/api/auth/me`, {
        headers,
        credentials: "include",
      });
      if (!res.ok) {
        setCurrentUser(null);
        return;
      }
      const data = await res.json();
      setCurrentUser(data?.user || null);
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    syncCurrentUser();
  }, [syncCurrentUser]);

  useEffect(() => {
    const handleFocus = () => syncCurrentUser();
    const handleStorage = (e) => {
      if (!e || e.key === "auth_token") {
        syncCurrentUser();
      }
    };
    const handleAuthTokenChange = () => syncCurrentUser();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-token-changed", handleAuthTokenChange);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-token-changed", handleAuthTokenChange);
    };
  }, [syncCurrentUser]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`${apiBase}/api/parts/${id}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d?.error || !d?.part) {
          setError(d?.error || "Part not found");
          return;
        }
        setPart(d.part);
        setSimilarParts(Array.isArray(d.similarParts) ? d.similarParts : []);
      })
      .catch(() => setError("Failed to load part details"))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!part?.seller?._id) return;
    fetch(`${apiBase}/api/parts?seller=${part.seller._id}&limit=3&sort=popular`)
      .then((r) => r.json())
      .then((d) => {
        const rows = Array.isArray(d?.parts) ? d.parts.filter((p) => p._id !== part._id).slice(0, 2) : [];
        setSellerProducts(rows);
      })
      .catch(() => {});
  }, [part]);

  const displayImages = useMemo(() => {
    const raw = collectPartImageUrls(part);
    const urls = raw.map((u) => toAbsUrl(u)).filter(Boolean);
    return urls.length ? urls : [PART_IMAGE_PLACEHOLDER];
  }, [part]);

  const sellerAvatarSrc = useMemo(() => {
    const u = part?.seller?.avatarUrl || part?.seller?.avatarFile;
    return u ? toAbsUrl(u) : PART_IMAGE_PLACEHOLDER;
  }, [part]);

  const badge = conditionBadge(part?.condition);
  const isSold = part?.status === "sold";
  const inStock =
    !isSold && (part?.quantity || 0) > 0 && part?.status === "active";
  const ownPart = Boolean(currentUser && part?.seller?._id && String(part.seller._id) === String(currentUser.id));
  const canBuy = Boolean(currentUser && inStock && !ownPart);
  const dailyPrice = Math.max(1, Math.round(Number(part?.price || 0) / 7));
  const stockPercent = Math.max(10, Math.min(100, ((part?.quantity || 0) / 25) * 100));

  useEffect(() => {
    if (part?._id) {
      const key = "beep_saved_parts";
      try {
        const arr = JSON.parse(localStorage.getItem(key) || "[]");
        setSaved(arr.includes(part._id));
      } catch {
        setSaved(false);
      }
    }
  }, [part]);

  const toggleSaved = () => {
    if (!part?._id) return;
    const key = "beep_saved_parts";
    let arr = [];
    try {
      arr = JSON.parse(localStorage.getItem(key) || "[]");
    } catch {}
    const next = arr.includes(part._id) ? arr.filter((x) => x !== part._id) : [...arr, part._id];
    localStorage.setItem(key, JSON.stringify(next));
    setSaved(next.includes(part._id));
  };

  const addCart = async () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    if (!canBuy) return;
    setAdding(true);
    try {
      await addToCart(part, qty);
    } catch {
      // keep existing silent behavior for now
    } finally {
      setAdding(false);
    }
  };

  const buyNow = async () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    if (!inStock || ownPart) return;

    setBuyingNow(true);
    try {
      clearCart();
      await addToCart(part, qty);
      navigate("/checkout");
    } catch (err) {
      alert(err?.message || "Unable to start checkout right now.");
    } finally {
      setBuyingNow(false);
    }
  };

  const chatSeller = () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    if (ownPart) return;
    navigate("/chat", {
      state: {
        partId: part._id,
        partName: part.name,
        partPrice: part.price,
        partImage: displayImages[0] || PART_IMAGE_PLACEHOLDER,
        vendorId: part.seller?._id,
        vendorName: part.seller?.username,
      },
    });
  };

  if (loading) {
    return (
      <div className="pdf-loader">
        <div className="pdf-spinner" />
        <p>Loading part details...</p>
      </div>
    );
  }

  if (error || !part) {
    return (
      <div className="pdf-loader">
        <h3>{error || "Part not found"}</h3>
        <button type="button" className="pdf-btn-chat" onClick={() => navigate("/parts")}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="adf-root mobile-content-pad">
      {showShare && <ShareModal url={window.location.href} title={part.name} onClose={() => setShowShare(false)} />}
      {showLightbox && <Lightbox images={displayImages} startIdx={galleryIdx} onClose={() => setShowLightbox(false)} />}

      <header className="adf-header">
        <nav className="adf-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">
            <HiHome size={14} /> Home
          </Link>
          <HiChevronRight size={14} />
          <Link to="/parts">Parts</Link>
          <HiChevronRight size={14} />
          <span>{part.name}</span>
        </nav>
        <div className="adf-header-actions">
          <span className="adf-live-badge" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
            <span className="adf-live-dot" />
            {isSold ? "Sold" : inStock ? "In stock" : "Unavailable"}
          </span>
          <button
            type="button"
            className={`adf-header-icon-btn ${saved ? "saved" : ""}`}
            onClick={toggleSaved}
            aria-label={saved ? "Unsave" : "Save"}
          >
            <FiHeart size={18} />
          </button>
          <button type="button" className="adf-header-icon-btn" onClick={() => setShowShare(true)} aria-label="Share">
            <FiShare2 size={18} />
          </button>
        </div>
      </header>

      <div className="adf-layout">
        <div>
          <div className="adf-card">
            <div className="adf-card-pad">
              <h1 className="adf-car-title">{part.name}</h1>
              <div className="adf-meta-row">
                <span className="adf-meta-item">
                  <FiMapPin size={14} /> {part.location || "Unknown location"}
                </span>
                <span className="adf-meta-item">
                  <FiPackage size={14} /> Stock: {part.quantity || 0}
                </span>
                <span className="adf-meta-item">
                  <FiEye size={14} /> {part.views || 0} views
                </span>
                <span className="adf-meta-item">{badge.icon} {badge.label}</span>
              </div>
              <div className="adf-quick-chips" style={{ marginTop: 8 }}>
                <span className="adf-chip">Free returns</span>
                <span className="adf-chip">Verified seller</span>
                <span className="adf-chip">Secure checkout</span>
              </div>
            </div>

            <div className="adf-gallery-main" onClick={() => setShowLightbox(true)} role="presentation">
              <img
                src={displayImages[galleryIdx]}
                alt={part.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
                }}
              />
              <div className="adf-gallery-overlay" aria-hidden />
              <div className="adf-gallery-badge">
                <span className="adf-live-badge" style={{ textTransform: "none", letterSpacing: "0" }}>
                  {badge.label}
                </span>
              </div>
              <div className="adf-gallery-counter">
                {Math.min(galleryIdx + 1, displayImages.length)} / {displayImages.length}
              </div>
              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="adf-gallery-nav prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryIdx((i) => (i > 0 ? i - 1 : displayImages.length - 1));
                    }}
                    aria-label="Previous image"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    className="adf-gallery-nav next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryIdx((i) => (i < displayImages.length - 1 ? i + 1 : 0));
                    }}
                    aria-label="Next image"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {displayImages.length > 1 ? (
              <div className="adf-thumbnails">
                {displayImages.map((img, idx) => (
                  <button
                    type="button"
                    key={`${img}-${idx}`}
                    className={`adf-thumb ${galleryIdx === idx ? "active" : ""}`}
                    onClick={() => setGalleryIdx(idx)}
                    aria-label={`Image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
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

          <div className="adf-card" style={{ marginTop: 24 }}>
            <div className="adf-card-pad">
              <div className="adf-section-title">
                <div className="adf-section-icon" aria-hidden>
                  <FiPackage size={18} />
                </div>
                Product details
              </div>
              <div className="adf-spec-grid">
                <div className="adf-spec-card">
                  <div className="adf-spec-icon">
                    <FiPackage />
                  </div>
                  <div className="adf-spec-value">{part.brand || "N/A"}</div>
                  <div className="adf-spec-label">Brand</div>
                </div>
                <div className="adf-spec-card">
                  <div className="adf-spec-icon">
                    <FiCheckCircle />
                  </div>
                  <div className="adf-spec-value">{badge.label}</div>
                  <div className="adf-spec-label">Condition</div>
                </div>
                <div className="adf-spec-card">
                  <div className="adf-spec-icon">
                    <FiEye />
                  </div>
                  <div className="adf-spec-value">{part.views || 0}</div>
                  <div className="adf-spec-label">Views</div>
                </div>
                <div className="adf-spec-card">
                  <div className="adf-spec-icon">
                    <FiMapPin />
                  </div>
                  <div className="adf-spec-value">{part.location || "N/A"}</div>
                  <div className="adf-spec-label">Location</div>
                </div>
              </div>

              <div className="adf-section-title" style={{ marginTop: 28 }}>
                <div className="adf-section-icon" aria-hidden>
                  <FiPackage size={18} />
                </div>
                Description
              </div>
              <div
                className="adf-description-html"
                dangerouslySetInnerHTML={{ __html: part.descriptionHtml || "<p>No description yet.</p>" }}
              />
            </div>
          </div>

          <div className="adf-card" style={{ marginTop: 24 }}>
            <div className="adf-card-pad">
              <div className="adf-section-title">
                <div className="adf-section-icon" aria-hidden>
                  <FiStar size={18} />
                </div>
                Customer reviews
              </div>
              <ReviewsList partId={part._id} partOwner={part.seller} currentUser={currentUser} />
            </div>
          </div>

          {similarParts.length > 0 && (
            <div className="adf-card" style={{ marginTop: 24 }}>
              <div className="adf-card-pad">
                <div className="adf-section-title">Similar products</div>
                <div className="adf-similar-grid">
                  {similarParts.slice(0, 3).map((p) => {
                    const first = collectPartImageUrls(p)[0];
                    const simSrc = first ? toAbsUrl(first) : PART_IMAGE_PLACEHOLDER;
                    return (
                      <div key={p._id} className="adf-spart-card" onClick={() => navigate(`/parts/${p._id}`)}>
                        <img
                          className="adf-spart-img"
                          src={simSrc}
                          alt={p.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
                          }}
                        />
                        <div className="adf-spart-body">
                          <h4 className="adf-spart-name">{p.name}</h4>
                          <p className="adf-spart-brand">{p.brand || "No brand"}</p>
                          <div className="adf-spart-footer">
                            <span className="adf-spart-price">${Number(p.price || 0).toLocaleString()}</span>
                            <span className={`adf-status-pill ${p.quantity > 0 ? "in-stock" : "out-stock"}`}>
                              {p.quantity > 0 ? "In stock" : "Out of stock"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="adf-bid-panel">
          <div className="adf-card">
            <div className="adf-card-pad">
              <div className="adf-section-title" style={{ marginBottom: 16 }}>
                Order preview
              </div>
              <div className="adf-preview-row">
                <span>Unit price</span>
                <strong>${Number(part.price || 0).toLocaleString()}</strong>
              </div>
              <div className="adf-preview-row">
                <span>Est. / day</span>
                <strong>${dailyPrice}</strong>
              </div>
              <div className="adf-preview-row">
                <span>Quantity</span>
                <strong>{qty}</strong>
              </div>
              <div className="adf-preview-row">
                <span>Total</span>
                <strong>${(Number(part.price || 0) * qty).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div className="adf-card adf-current-bid-card">
            <div className="adf-bid-label">Price</div>
            <div className="adf-bid-amount">
              <span>$</span>
              {Number(part.price || 0).toLocaleString()}
            </div>
            <div className="adf-bid-meta">Secure checkout · Buyer protection</div>

            <div className="adf-stock-bar-wrap">
              <div className="adf-stock-bar-labels">
                <span>Availability</span>
                <span>{part.quantity || 0} in stock</span>
              </div>
              <div className="adf-stock-bar-bg">
                <div className="adf-stock-bar-fill" style={{ width: `${stockPercent}%` }} />
              </div>
            </div>

            <div className="adf-status-pills" style={{ marginTop: 18 }}>
              <span className={`adf-status-pill ${isSold ? "out-stock" : inStock ? "in-stock" : "out-stock"}`}>
                {isSold ? "Sold" : inStock ? "In stock" : "Out of stock"}
              </span>
              {isInCart(part._id) ? <span className="adf-status-pill in-cart">In cart</span> : null}
            </div>

            {ownPart ? (
              <div className="adf-own-alert">This is your listing — buyer actions are disabled.</div>
            ) : (
              <>
                <div className="adf-qty-row">
                  <button type="button" className="adf-qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    −
                  </button>
                  <input
                    className="adf-qty-inp"
                    type="number"
                    value={qty}
                    min={1}
                    max={Math.max(1, part.quantity || 1)}
                    onChange={(e) =>
                      setQty(
                        Math.max(1, Math.min(Number(e.target.value || 1), Math.max(1, part.quantity || 1)))
                      )
                    }
                  />
                  <button
                    type="button"
                    className="adf-qty-btn"
                    onClick={() => setQty((q) => Math.min(Math.max(1, part.quantity || 1), q + 1))}
                  >
                    +
                  </button>
                </div>
                <div className="adf-subtotal">Subtotal · ${(Number(part.price || 0) * qty).toLocaleString()}</div>
              </>
            )}

            {authLoading ? (
              <button type="button" className="adf-btn-disabled" disabled>
                Checking sign-in…
              </button>
            ) : !currentUser ? (
              <button type="button" className="adf-btn-chat" onClick={() => navigate("/signin")}>
                Sign in to buy
              </button>
            ) : canBuy ? (
              <>
                <button type="button" className="adf-btn-bid" onClick={buyNow} disabled={buyingNow}>
                  <FiShoppingCart size={18} />
                  {buyingNow ? "Starting checkout…" : "Buy now"}
                </button>
                <button
                  type="button"
                  className={`adf-btn-add ${isInCart(part._id) ? "in-cart" : ""}`}
                  onClick={addCart}
                  disabled={adding}
                >
                  <FiShoppingCart size={16} />
                  {adding ? "Adding…" : isInCart(part._id) ? "In cart" : "Add to cart"}
                </button>
              </>
            ) : (
              <button type="button" className="adf-btn-disabled" disabled>
                {ownPart ? "Your listing" : isSold ? "Sold" : "Sold out"}
              </button>
            )}

            {!ownPart ? (
              <button type="button" className="adf-btn-chat" onClick={chatSeller}>
                <FiMessageSquare size={16} /> Chat with seller
              </button>
            ) : null}

            <div className="adf-trust-row">
              <span className="adf-trust-item">
                <FiTruck size={14} /> Fast shipping
              </span>
              <span className="adf-trust-item">
                <FiCheckCircle size={14} /> Verified listing
              </span>
            </div>

            <div className="adf-card" style={{ marginTop: 16, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="adf-card-pad" style={{ paddingTop: 16, paddingBottom: 16 }}>
                <details style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  <summary style={{ cursor: "pointer", fontWeight: 600, color: "#fff" }}>Quick facts</summary>
                  <p style={{ marginTop: 10, marginBottom: 0 }}>
                    Brand: {part.brand || "N/A"} · Condition: {badge.label} · Stock: {part.quantity || 0}
                  </p>
                </details>
              </div>
            </div>
          </div>

          <div className="adf-card">
            <div className="adf-card-pad">
              <div className="adf-section-title">
                <div className="adf-section-icon" aria-hidden>
                  <FiMessageSquare size={18} />
                </div>
                Seller
              </div>
              <div className="adf-seller-row">
                <div className="adf-seller-avatar">
                  <img
                    src={sellerAvatarSrc}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>
                    {part.seller?.username || "Seller"}
                  </div>
                  <span className="adf-verified-badge">Verified</span>
                  <div className="adf-meta-row" style={{ marginTop: 8, marginBottom: 0 }}>
                    <span className="adf-meta-item">
                      <FiMapPin size={14} /> {part.seller?.location || "Location unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {sellerProducts.length > 0 ? (
                <div style={{ marginTop: 16 }}>
                  {sellerProducts.map((sp) => {
                    const firstSp = collectPartImageUrls(sp)[0];
                    const miniSrc = firstSp ? toAbsUrl(firstSp) : PART_IMAGE_PLACEHOLDER;
                    return (
                      <div key={sp._id} className="adf-mini-prod" onClick={() => navigate(`/parts/${sp._id}`)}>
                        <img
                          className="adf-mini-prod-img"
                          src={miniSrc}
                          alt=""
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = PART_IMAGE_PLACEHOLDER;
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div className="adf-mini-prod-name">{sp.name}</div>
                          <div className="adf-mini-prod-price">${Number(sp.price || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      <MobileBottomBarPartDetail onPrimaryAction={buyNow} isInCart={false} canBuy={canBuy} />
    </div>
  );
};

export default PartDetailFront;
