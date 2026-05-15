import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiPackage } from "react-icons/fi";
import { HiHome, HiChevronRight } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { authFetchInit } from "../api/client.js";
import PartsNavbar from "../components/PartsNavbar";
import "./cart-checkout-dark.css";

const API = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const CartFront = () => {
  const navigate = useNavigate();
  const { items, total, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const lineCount = items.length;
  const unitCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, authFetchInit());
        if (cancelled || !res.ok) return;
        await res.json();
      } catch (_) {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toAbsUrl = (u) => {
    if (!u) return "/assets/images/handpicked-img-1.webp";
    if (u.startsWith("http") || u.startsWith("data:")) return u;
    return `${API}${u}`;
  };

  const handleQuantityChange = (partId, newQuantity, maxQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(partId);
    } else if (newQuantity <= maxQuantity) {
      updateQuantity(partId, newQuantity);
    } else {
      alert(`Only ${maxQuantity} items available in stock`);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    try {
      const res = await fetch(`${API}/api/auth/me`, authFetchInit());
      const data = res.ok ? await res.json().catch(() => ({})) : {};
      if (data.user) {
        navigate("/checkout");
        return;
      }
    } catch (_) {}
    navigate(`/signin?redirect=${encodeURIComponent("/checkout")}`);
  };

  if (loading) {
    return (
      <div className="mp-checkout-root mp-cc-loading">
        <PartsNavbar variant="dark" q="" setQ={() => {}} />
        <div className="mp-cc-loading__box">
          <div>
            <div className="mp-cc-spinner" aria-hidden />
            <p style={{ margin: 0, textAlign: "center" }}>Loading your cart…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mp-checkout-root">
      <PartsNavbar variant="dark" q="" setQ={() => {}} />

      <div className="mp-cc-breadcrumb">
        <div className="container-fluid px-3 px-md-4 px-lg-5">
          <nav className="mp-cc-breadcrumb__inner" aria-label="Breadcrumb">
            <Link to="/">
              <HiHome size={16} aria-hidden />
              Home
            </Link>
            <HiChevronRight className="mp-cc-breadcrumb__sep" size={14} aria-hidden />
            <span className="mp-cc-breadcrumb__current">
              <FiShoppingCart size={16} aria-hidden />
              Shopping cart
            </span>
          </nav>
        </div>
      </div>

      <section className="mp-cc-body">
        <div className="container-fluid px-3 px-md-4 px-lg-5">
          <div className="row justify-content-center">
            <div className="col-12 col-xxl-10">
              <div className="mp-cc-page-head">
                <div>
                  <h1 className="mp-cc-h1">
                    <FiShoppingCart size={18} aria-hidden />
                    Shopping cart
                  </h1>
                  <p className="mp-cc-lead">
                    {lineCount} {lineCount === 1 ? "product" : "products"} · {unitCount} {unitCount === 1 ? "unit" : "units"}
                  </p>
                </div>
                <div className="mp-cc-actions">
                  <button type="button" className="mp-cc-btn mp-cc-btn--ghost" onClick={() => navigate("/parts")}>
                    ← Continue shopping
                  </button>
                  {items.length > 0 && (
                    <button type="button" className="mp-cc-btn mp-cc-btn--danger" onClick={clearCart}>
                      Clear cart
                    </button>
                  )}
                </div>
              </div>

              {items.length === 0 ? (
                <div className="mp-cc-card mp-cc-empty">
                  <div className="mp-cc-empty__icon">
                    <FiShoppingCart size={40} aria-hidden />
                  </div>
                  <h2>Your cart is empty</h2>
                  <p className="mp-cc-muted" style={{ margin: "0 auto", maxWidth: 400 }}>
                    Browse the parts catalog and add items you need. Secure checkout when you are ready.
                  </p>
                  <button type="button" className="mp-cc-btn mp-cc-btn--primary" style={{ marginTop: 24 }} onClick={() => navigate("/parts")}>
                    <FiPackage size={18} aria-hidden />
                    Browse parts
                  </button>
                </div>
              ) : (
                <div className="row g-4">
                  <div className="col-lg-8">
                    <div className="mp-cc-card">
                      <h2 className="mp-cc-card__title">Cart items ({items.length})</h2>
                      <div>
                        {items.map((item) => (
                          <div key={item.partId} className="mp-cc-cart-item">
                            <div className="mp-cc-thumb" onClick={() => navigate(`/parts/${item.partId}`)} role="presentation">
                              <img
                                src={toAbsUrl(item.image)}
                                alt=""
                                onError={(e) => {
                                  e.target.src = "/assets/images/handpicked-img-1.webp";
                                }}
                              />
                            </div>
                            <div className="mp-cc-item-body">
                              <h3 className="mp-cc-item-title" onClick={() => navigate(`/parts/${item.partId}`)}>
                                {item.name}
                              </h3>
                              {item.brand && <p className="mp-cc-item-meta">Brand: {item.brand}</p>}
                              {item.partNumber && <p className="mp-cc-item-meta">Part #: {item.partNumber}</p>}
                              {item.sellerName && <p className="mp-cc-item-meta">Seller: {item.sellerName}</p>}
                              <div className="mp-cc-qty-row">
                                <button
                                  type="button"
                                  className="mp-cc-btn mp-cc-btn--icon"
                                  aria-label="Decrease quantity"
                                  onClick={() => handleQuantityChange(item.partId, item.quantity - 1, item.maxQuantity)}
                                >
                                  <FiMinus size={16} />
                                </button>
                                <input
                                  type="number"
                                  className="mp-cc-qty-input"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.partId, parseInt(e.target.value, 10) || 1, item.maxQuantity)}
                                  min={1}
                                  max={item.maxQuantity}
                                />
                                <button
                                  type="button"
                                  className="mp-cc-btn mp-cc-btn--icon"
                                  aria-label="Increase quantity"
                                  disabled={item.quantity >= item.maxQuantity}
                                  onClick={() => handleQuantityChange(item.partId, item.quantity + 1, item.maxQuantity)}
                                >
                                  <FiPlus size={16} />
                                </button>
                                <span className="mp-cc-muted" style={{ fontSize: 13 }}>
                                  Max {item.maxQuantity}
                                </span>
                              </div>
                            </div>
                            <div className="mp-cc-side">
                              <p className="mp-cc-side-price">${(item.price * item.quantity).toLocaleString()}</p>
                              <p className="mp-cc-side-each">${item.price.toLocaleString()} each</p>
                              <button
                                type="button"
                                className="mp-cc-btn mp-cc-btn--icon mp-cc-btn--danger"
                                style={{ marginTop: 10 }}
                                title="Remove from cart"
                                aria-label="Remove from cart"
                                onClick={() => removeFromCart(item.partId)}
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mp-cc-card mp-cc-sticky">
                      <h2 className="mp-cc-card__title">Order summary</h2>
                      <div className="mp-cc-line">
                        <span className="mp-cc-muted">Subtotal ({unitCount} units)</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                      <div className="mp-cc-line">
                        <span className="mp-cc-muted">Shipping</span>
                        <span className="mp-cc-free">FREE</span>
                      </div>
                      <div className="mp-cc-line">
                        <span className="mp-cc-muted">Tax</span>
                        <span className="mp-cc-muted">At checkout</span>
                      </div>
                      <div className="mp-cc-line mp-cc-line--total">
                        <span>Total</span>
                        <span className="mp-cc-price">${total.toLocaleString()}</span>
                      </div>
                      <button type="button" className="mp-cc-btn mp-cc-btn--primary" onClick={handleCheckout}>
                        Proceed to checkout
                      </button>
                      <div className="mp-cc-trust">
                        <div style={{ fontWeight: 600, color: "var(--mp-text)", marginBottom: 6 }}>Secure checkout</div>
                        Encrypted payments · Buyer protection · Fast fulfillment
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CartFront;
