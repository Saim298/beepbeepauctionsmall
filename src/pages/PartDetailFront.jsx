import React, { useEffect, useMemo, useState } from "react";
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
import { getAuthToken } from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";
import ReviewsList from "../components/ReviewsList.jsx";
import { MobileBottomBarPartDetail } from "../components/MobileBottomBar";

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

const toAbs = (url) => {
  if (!url) return "/assets/images/handpicked-img-1.webp";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  const base = (apiBase || "").replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
};

const extractHtmlImages = (html = "") => {
  const regex = /<img[^>]+src="([^"]+)"/g;
  const images = [];
  let match;
  while ((match = regex.exec(html)) !== null) images.push(match[1]);
  return images;
};

const getPartImages = (part) => {
  if (!part) return [];
  const mediaImages =
    part.media?.filter((m) => m?.type === "image" || /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(m?.url || "")).map((m) => m.url) || [];
  if (mediaImages.length) return mediaImages;
  return extractHtmlImages(part.descriptionHtml);
};

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
      <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
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
      <img className="pdf-lb-img" src={toAbs(images[index])} alt="" onClick={(e) => e.stopPropagation()} />
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    fetch(`${apiBase}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setCurrentUser(d?.user || null))
      .catch(() => {});
  }, []);

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

  const images = useMemo(() => getPartImages(part), [part]);
  const badge = conditionBadge(part?.condition);
  const inStock = (part?.quantity || 0) > 0;
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
        partImage: images[0] ? toAbs(images[0]) : "/assets/images/handpicked-img-1.webp",
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
    <div className="pdf-page mobile-content-pad">
      {showShare && <ShareModal url={window.location.href} title={part.name} onClose={() => setShowShare(false)} />}
      {showLightbox && images.length > 0 && <Lightbox images={images} startIdx={galleryIdx} onClose={() => setShowLightbox(false)} />}

      <header className="pdf-header">
        <div className="pdf-header-inner">
          <ul className="pdf-breadcrumb">
            <li>
              <Link to="/">
                <HiHome size={15} /> Home
              </Link>
            </li>
            <li className="pdf-breadcrumb-sep">
              <HiChevronRight size={12} />
            </li>
            <li>
              <Link to="/parts">Parts</Link>
            </li>
            <li className="pdf-breadcrumb-sep">
              <HiChevronRight size={12} />
            </li>
            <li className="pdf-breadcrumb-cur">{part.name}</li>
          </ul>
          <div className="pdf-header-badges">
            <span className={`pdf-badge ${badge.cls}`}>
              {badge.icon} {badge.label}
            </span>
            <span className="pdf-badge pdf-badge-light">
              <FiEye size={13} /> {part.views || 0} views
            </span>
          </div>
        </div>
      </header>

      <div className="pdf-shell">
      <div className="pdf-layout">
        <section>
          <div className="pdf-card">
            <div className="pdf-card-body">
              <div className="pdf-title-row">
                <div>
                  <h1 className="pdf-title">{part.name}</h1>
                  <div className="pdf-meta-row">
                    <span className="pdf-meta-item">
                      <FiMapPin size={13} /> {part.location || "Unknown location"}
                    </span>
                    <span className="pdf-meta-item">
                      <FiPackage size={13} /> Stock: {part.quantity || 0}
                    </span>
                  </div>
                </div>
                <div className="pdf-action-btns">
                  <button type="button" className={`pdf-icon-btn ${saved ? "saved" : ""}`} onClick={toggleSaved}>
                    <FiHeart size={14} /> {saved ? "Saved" : "Save"}
                  </button>
                  <button type="button" className="pdf-icon-btn" onClick={() => setShowShare(true)}>
                    <FiShare2 size={14} /> Share
                  </button>
                </div>
              </div>
              <div className="pdf-quick-tags">
                <span className="pdf-chip">Free Returns</span>
                <span className="pdf-chip">Verified Seller</span>
                <span className="pdf-chip">Secure Checkout</span>
              </div>
            </div>

            <div className="pdf-gallery-main" onClick={() => setShowLightbox(true)}>
              <img className="pdf-gallery-img" src={toAbs(images[galleryIdx])} alt={part.name} />
              <div className="pdf-gallery-tl">
                <span className={`pdf-badge ${badge.cls}`}>{badge.label}</span>
              </div>
              <div className="pdf-gallery-bl">
                <span className="pdf-gallery-counter">
                  {Math.min(galleryIdx + 1, images.length || 1)} / {Math.max(images.length, 1)}
                </span>
              </div>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="pdf-gallery-nav pdf-gallery-prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryIdx((i) => (i > 0 ? i - 1 : images.length - 1));
                    }}
                    aria-label="Previous image"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    className="pdf-gallery-nav pdf-gallery-next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryIdx((i) => (i < images.length - 1 ? i + 1 : 0));
                    }}
                    aria-label="Next image"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="pdf-thumbs">
                {images.map((img, idx) => (
                  <button
                    type="button"
                    key={`${img}-${idx}`}
                    className={`pdf-thumb ${galleryIdx === idx ? "active" : ""}`}
                    onClick={() => setGalleryIdx(idx)}
                    aria-label={`Open image ${idx + 1}`}
                  >
                    <img src={toAbs(img)} alt={`${part.name}-${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pdf-card">
            <div className="pdf-card-body">
              <div className="pdf-sec-header">
                <div className="pdf-sec-icon pdf-sec-icon-red">
                  <FiPackage size={18} />
                </div>
                <div>
                  <h3 className="pdf-sec-title">Product details</h3>
                  <p className="pdf-sec-sub">Everything buyers need to know</p>
                </div>
              </div>
              <div className="pdf-specs-grid">
                <div className="pdf-spec-item">
                  <div className="pdf-spec-icon">
                    <FiPackage size={14} />
                  </div>
                  <div>
                    <div className="pdf-spec-label">Brand</div>
                    <div className="pdf-spec-value">{part.brand || "N/A"}</div>
                  </div>
                </div>
                <div className="pdf-spec-item">
                  <div className="pdf-spec-icon">
                    <FiCheckCircle size={14} />
                  </div>
                  <div>
                    <div className="pdf-spec-label">Condition</div>
                    <div className="pdf-spec-value">{badge.label}</div>
                  </div>
                </div>
                <div className="pdf-spec-item">
                  <div className="pdf-spec-icon">
                    <FiEye size={14} />
                  </div>
                  <div>
                    <div className="pdf-spec-label">Views</div>
                    <div className="pdf-spec-value">{part.views || 0}</div>
                  </div>
                </div>
                <div className="pdf-spec-item">
                  <div className="pdf-spec-icon">
                    <FiMapPin size={14} />
                  </div>
                  <div>
                    <div className="pdf-spec-label">Location</div>
                    <div className="pdf-spec-value">{part.location || "N/A"}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <h4 style={{ marginBottom: 10 }}>Description</h4>
                <div className="pdf-description-html" dangerouslySetInnerHTML={{ __html: part.descriptionHtml || "<p>No description yet.</p>" }} />
              </div>
            </div>
          </div>

          <div className="pdf-card">
            <div className="pdf-card-body">
              <h3 className="pdf-section-title">
                <FiStar size={22} /> Customer reviews
              </h3>
              <ReviewsList partId={part._id} partOwner={part.seller} currentUser={currentUser} />
            </div>
          </div>

          {similarParts.length > 0 && (
            <div className="pdf-card">
              <div className="pdf-card-body">
                <h3 className="pdf-section-title">Similar products</h3>
                <div className="pdf-similar-grid">
                  {similarParts.slice(0, 3).map((p) => {
                    const simImages = getPartImages(p);
                    return (
                      <div key={p._id} className="pdf-spart-card" onClick={() => navigate(`/parts/${p._id}`)}>
                        <img className="pdf-spart-img" src={toAbs(simImages[0])} alt={p.name} />
                        <div className="pdf-spart-body">
                          <h4 className="pdf-spart-name">{p.name}</h4>
                          <p className="pdf-spart-brand">{p.brand || "No brand"}</p>
                          <div className="pdf-spart-footer">
                            <span className="pdf-spart-price">${Number(p.price || 0).toLocaleString()}</span>
                            <span className={`pdf-badge ${p.quantity > 0 ? "pdf-badge-green" : "pdf-badge-gray"}`}>
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
        </section>

        <aside>
          <div className="pdf-card pdf-journey-card">
            <div className="pdf-card-body">
              <h3 className="pdf-section-title" style={{ marginBottom: 12 }}>Your Order Preview</h3>
              <div className="pdf-feature-grid">
                <div className="pdf-feature-row"><span>Unit price</span><strong>${Number(part.price || 0).toLocaleString()}</strong></div>
                <div className="pdf-feature-row"><span>Est. / day</span><strong>${dailyPrice}</strong></div>
                <div className="pdf-feature-row"><span>Quantity</span><strong>{qty}</strong></div>
                <div className="pdf-feature-row"><span>Total payment</span><strong>${(Number(part.price || 0) * qty).toLocaleString()}</strong></div>
              </div>
            </div>
          </div>
          <div className="pdf-buybox">
            <div className="pdf-buybox-top">
              <div className="pdf-price-lbl">Price</div>
              <div className="pdf-price">${Number(part.price || 0).toLocaleString()}</div>
              <div className="pdf-stock-bar-wrap">
                <div className="pdf-stock-bar-labels">
                  <span>Availability</span>
                  <span>{part.quantity || 0} items</span>
                </div>
                <div className="pdf-stock-bar-bg">
                  <div className="pdf-stock-bar-fill" style={{ width: `${stockPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="pdf-buybox-body">
              <div className="pdf-status-pills">
                <span className={`pdf-status-pill ${inStock ? "in-stock" : "out-stock"}`}>
                  {inStock ? "In stock" : "Out of stock"}
                </span>
                {isInCart(part._id) && <span className="pdf-status-pill in-cart">Already in cart</span>}
              </div>

              {ownPart ? (
                <div className="pdf-own-alert">This is your own listing. Buyer actions are disabled.</div>
              ) : (
                <>
                  <div className="pdf-qty-row">
                    <button type="button" className="pdf-qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                      -
                    </button>
                    <input
                      className="pdf-qty-inp"
                      type="number"
                      value={qty}
                      min={1}
                      max={Math.max(1, part.quantity || 1)}
                      onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value || 1), Math.max(1, part.quantity || 1))))}
                    />
                    <button
                      type="button"
                      className="pdf-qty-btn"
                      onClick={() => setQty((q) => Math.min(Math.max(1, part.quantity || 1), q + 1))}
                    >
                      +
                    </button>
                  </div>
                  <div className="pdf-qty-total">Subtotal: ${(Number(part.price || 0) * qty).toLocaleString()}</div>
                </>
              )}

              {!currentUser ? (
                <button type="button" className="pdf-btn-chat" onClick={() => navigate("/signin")}>
                  Sign in to buy
                </button>
              ) : canBuy ? (
                <>
                <button
                  type="button"
                  className="pdf-btn-add"
                  onClick={buyNow}
                  disabled={buyingNow}
                >
                  <FiShoppingCart size={16} />
                  {buyingNow ? "Starting checkout..." : "Buy Now"}
                </button>
                <button type="button" className={`pdf-btn-add ${isInCart(part._id) ? "in-cart" : ""}`} onClick={addCart} disabled={adding}>
                  <FiShoppingCart size={16} />
                  {adding ? "Adding..." : isInCart(part._id) ? "In Cart" : "Add to Cart"}
                </button>
                </>
              ) : (
                <button type="button" className="pdf-btn-disabled" disabled>
                  {ownPart ? "Your Listing" : "Sold Out"}
                </button>
              )}

              {!ownPart && (
                <button type="button" className="pdf-btn-chat" onClick={chatSeller}>
                  <FiMessageSquare size={16} /> Chat with Seller
                </button>
              )}

              <div className="pdf-trust-row">
                <span className="pdf-trust-item">
                  <FiTruck size={13} /> Fast shipping
                </span>
                <span className="pdf-trust-item">
                  <FiCheckCircle size={13} /> Verified listing
                </span>
              </div>
              <div className="pdf-accordion">
                <details open>
                  <summary>Product Description</summary>
                  <p>{part.descriptionHtml ? "See full description in details section." : "No detailed description provided yet."}</p>
                </details>
                <details>
                  <summary>Product Details</summary>
                  <p>Brand: {part.brand || "N/A"} · Condition: {badge.label} · Stock: {part.quantity || 0}</p>
                </details>
                <details>
                  <summary>Our Commitment</summary>
                  <p>Secure payments, verified sellers, and responsive support on every order.</p>
                </details>
              </div>
            </div>
          </div>

          <div className="pdf-card">
            <div className="pdf-card-body">
              <div className="pdf-sec-header">
                <div className="pdf-sec-icon pdf-sec-icon-green">
                  <FiMessageSquare size={18} />
                </div>
                <div>
                  <h3 className="pdf-sec-title">Seller info</h3>
                  <p className="pdf-sec-sub">Trusted marketplace vendor</p>
                </div>
              </div>
              <div className="pdf-seller-row">
                <img className="pdf-seller-avatar" src={toAbs(part.seller?.avatarUrl)} alt={part.seller?.username || "Seller"} />
                <div>
                  <p className="pdf-seller-name">{part.seller?.username || "Seller"}</p>
                  <div className="pdf-seller-meta">
                    <span className="pdf-meta-item">
                      <FiMapPin size={12} /> {part.seller?.location || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {sellerProducts.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  {sellerProducts.map((sp) => {
                    const imgs = getPartImages(sp);
                    return (
                      <div key={sp._id} className="pdf-mini-prod" onClick={() => navigate(`/parts/${sp._id}`)}>
                        <img className="pdf-mini-prod-img" src={toAbs(imgs[0])} alt={sp.name} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: "#111", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {sp.name}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: 12 }}>${Number(sp.price || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
      </div>

      <MobileBottomBarPartDetail onPrimaryAction={buyNow} isInCart={false} canBuy={canBuy} />
    </div>
  );
};

export default PartDetailFront;
