import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiLock, FiCreditCard, FiMapPin, FiShoppingBag } from "react-icons/fi";
import { HiHome, HiChevronRight } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { apiRequest, authFetchInit } from "../api/client.js";
import PartsNavbar from "../components/PartsNavbar";
import "./cart-checkout-dark.css";

const API = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const CheckoutFront = () => {
  const navigate = useNavigate();
  const { items, total, clearCart, loading: cartLoading } = useCart();
  const unitCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    notes: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: "card",
    billingAddress: {
      sameAsShipping: true,
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const [cloverConfig, setCloverConfig] = useState(null);
  const [cloverConfigError, setCloverConfigError] = useState("");
  const [paymentSubmitLoading, setPaymentSubmitLoading] = useState(false);

  useEffect(() => {
    if (cartLoading) return;

    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, authFetchInit());
        const data = res.ok ? await res.json().catch(() => ({})) : {};
        if (cancelled) return;
        if (data.user) {
          setCurrentUser(data.user);
          setShippingInfo((prev) => ({
            ...prev,
            fullName: data.user.name || "",
            email: data.user.email || "",
          }));
        } else {
          navigate(`/signin?redirect=${encodeURIComponent("/checkout")}`);
        }
      } catch {
        if (!cancelled) navigate(`/signin?redirect=${encodeURIComponent("/checkout")}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate, items.length, cartLoading]);

  useEffect(() => {
    if (cartLoading || items.length === 0 || !currentUser) return;

    let cancelled = false;
    apiRequest("/api/payments/clover/config")
      .then((cfg) => {
        if (!cancelled) setCloverConfig(cfg);
      })
      .catch((err) => {
        if (!cancelled) setCloverConfigError(err.message || "Checkout cannot load Clover settings.");
      });

    return () => {
      cancelled = true;
    };
  }, [items.length, cartLoading, currentUser]);

  const skipClientPayment = Boolean(cloverConfig?.skipClientPayment);
  const totalSteps = skipClientPayment ? 3 : 2;

  useEffect(() => {
    if (cloverConfig && !skipClientPayment && step > 2) {
      setStep(2);
    }
  }, [cloverConfig, skipClientPayment, step]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!cloverConfig?.ready) {
      alert(cloverConfigError || "Payment is unavailable. Please try again later.");
      return;
    }

    if (cloverConfig.skipClientPayment) {
      setStep(3);
      return;
    }

    setPaymentSubmitLoading(true);
    try {
      const session = await apiRequest("/api/payments/clover/hosted-checkout", {
        method: "POST",
        body: {
          items: items.map((item) => ({
            partId: item.partId,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName: shippingInfo.fullName,
            email: shippingInfo.email,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zipCode: shippingInfo.zipCode,
            country: shippingInfo.country,
            phone: shippingInfo.phone,
          },
          billingAddress: paymentInfo.billingAddress,
          buyerNotes: shippingInfo.notes || "",
          paymentMethod: paymentInfo.method,
          tipsEnabled: false,
        },
      });

      if (!session?.href) throw new Error("Failed to create Clover Hosted Checkout session.");
      if (session?.checkoutSessionId) {
        try {
          localStorage.setItem("clover_checkout_session_id", String(session.checkoutSessionId));
        } catch (_) {}
      }
      window.location.href = session.href;
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to open Clover Hosted Checkout.");
    } finally {
      setPaymentSubmitLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          partId: item.partId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          email: shippingInfo.email,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone,
        },
        paymentMethod: paymentInfo.method,
        buyerNotes: shippingInfo.notes || "",
      };

      if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
        alert("Please fill in all required shipping information.");
        setLoading(false);
        return;
      }

      if (!items || items.length === 0) {
        alert("Your cart is empty.");
        setLoading(false);
        return;
      }

      const response = await apiRequest("/api/orders", {
        method: "POST",
        body: orderData,
      });

      if (response.success) {
        clearCart();
        alert(
          `Order placed successfully!\n\nOrder ID: ${response.order.orderNumber}\n\nYou will receive an email confirmation shortly.`
        );
        navigate("/user/orders");
      } else {
        throw new Error(response.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      const errorMessage = error.message || error.error || "Failed to place order. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const toAbsUrl = (u) => {
    if (!u) return "/assets/images/handpicked-img-1.webp";
    if (u.startsWith("http") || u.startsWith("data:")) return u;
    return `${API}${u}`;
  };

  const stepLabels =
    totalSteps === 3
      ? { 1: "Shipping", 2: "Payment", 3: "Review" }
      : { 1: "Shipping", 2: "Pay with Clover" };

  const renderStepper = () => (
    <div className="mp-cc-card" style={{ marginBottom: 24 }}>
      <div className="mp-cc-steps">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => {
          const done = step > stepNum;
          const active = step === stepNum;
          return (
            <React.Fragment key={stepNum}>
              <div className={`mp-cc-step ${done ? "mp-cc-step--done" : ""} ${active ? "mp-cc-step--active" : ""}`}>
                <div className="mp-cc-step-num">{done ? "✓" : stepNum}</div>
                <span>{stepLabels[stepNum]}</span>
              </div>
              {stepNum < totalSteps && <div className={`mp-cc-step-line ${step > stepNum ? "mp-cc-step-line--on" : ""}`} aria-hidden />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  const renderShippingForm = () => (
    <div className="mp-cc-card">
      <h2 className="mp-cc-card__title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <FiMapPin size={20} style={{ color: "var(--mp-p1)" }} aria-hidden />
        Shipping
      </h2>
      <form onSubmit={handleShippingSubmit}>
        <div className="mp-cc-grid mp-cc-grid--2">
          <div>
            <label className="mp-cc-label" htmlFor="co-fullname">
              Full name *
            </label>
            <input
              id="co-fullname"
              type="text"
              className="mp-cc-input"
              value={shippingInfo.fullName}
              onChange={(e) => setShippingInfo((prev) => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mp-cc-label" htmlFor="co-email">
              Email *
            </label>
            <input
              id="co-email"
              type="email"
              className="mp-cc-input"
              value={shippingInfo.email}
              onChange={(e) => setShippingInfo((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mp-cc-label" htmlFor="co-phone">
              Phone *
            </label>
            <input
              id="co-phone"
              type="tel"
              className="mp-cc-input"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo((prev) => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="mp-cc-label" htmlFor="co-address">
              Address *
            </label>
            <input
              id="co-address"
              type="text"
              className="mp-cc-input"
              placeholder="Street address"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo((prev) => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mp-cc-label" htmlFor="co-city">
              City *
            </label>
            <input id="co-city" type="text" className="mp-cc-input" value={shippingInfo.city} onChange={(e) => setShippingInfo((prev) => ({ ...prev, city: e.target.value }))} required />
          </div>
          <div>
            <label className="mp-cc-label" htmlFor="co-state">
              State *
            </label>
            <input id="co-state" type="text" className="mp-cc-input" value={shippingInfo.state} onChange={(e) => setShippingInfo((prev) => ({ ...prev, state: e.target.value }))} required />
          </div>
          <div>
            <label className="mp-cc-label" htmlFor="co-zip">
              ZIP *
            </label>
            <input id="co-zip" type="text" className="mp-cc-input" value={shippingInfo.zipCode} onChange={(e) => setShippingInfo((prev) => ({ ...prev, zipCode: e.target.value }))} required />
          </div>
        </div>
        <div className="mp-cc-form-actions" style={{ justifyContent: "flex-end" }}>
          <button type="submit" className="mp-cc-btn mp-cc-btn--primary" style={{ width: "auto", minWidth: 200 }}>
            Continue to payment
          </button>
        </div>
      </form>
    </div>
  );

  const renderPaymentForm = () => {
    const showDevSkip = Boolean(cloverConfig?.skipClientPayment);
    const showLoadingConfig = !cloverConfig && !cloverConfigError;
    const showError = !!cloverConfigError && step === 2;
    const canPay = cloverConfig?.ready && !cloverConfigError;

    return (
      <div className="mp-cc-card">
        <h2 className="mp-cc-card__title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FiCreditCard size={20} style={{ color: "var(--mp-p1)" }} aria-hidden />
          Payment
        </h2>

        {showLoadingConfig && <p className="mp-cc-muted" style={{ margin: "0 0 12px" }}>Loading secure checkout…</p>}
        {showError && (
          <div className="mp-cc-alert mp-cc-alert--danger" role="alert">
            {cloverConfigError}
          </div>
        )}
        {showDevSkip && (
          <div className="mp-cc-alert mp-cc-alert--muted">
            Development: <code>CLOVER_SKIP_PAYMENT</code> is on — you can complete the order without card charges.
          </div>
        )}

        <form onSubmit={handlePaymentSubmit}>
          {!showDevSkip && cloverConfig?.ready && (
            <div className="mp-cc-alert mp-cc-alert--info" role="status">
              You will be redirected to Clover Hosted Checkout to pay securely.
            </div>
          )}

          <div className="mp-cc-check">
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={paymentInfo.billingAddress.sameAsShipping}
              onChange={(e) =>
                setPaymentInfo((prev) => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, sameAsShipping: e.target.checked },
                }))
              }
            />
            <label htmlFor="sameAsShipping">Billing address same as shipping</label>
          </div>

          <p className="mp-cc-muted" style={{ margin: "16px 0 0", fontSize: 13 }}>
            Card data is never stored in this app — payment runs on Clover.
          </p>

          <div className="mp-cc-form-actions">
            <button type="button" className="mp-cc-btn mp-cc-btn--ghost" onClick={() => setStep(1)}>
              <FiArrowLeft size={16} aria-hidden />
              Back
            </button>
            <button type="submit" className="mp-cc-btn mp-cc-btn--primary" style={{ width: "auto", minWidth: 200 }} disabled={!canPay || paymentSubmitLoading}>
              {paymentSubmitLoading ? "Opening Clover…" : showDevSkip ? "Review order" : "Proceed to Clover"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderOrderReview = () => (
    <div className="mp-cc-card">
      <h2 className="mp-cc-card__title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <FiShoppingBag size={20} style={{ color: "var(--mp-p1)" }} aria-hidden />
        Review order
      </h2>

      <h3 className="mp-cc-label" style={{ marginTop: 8 }}>
        Items
      </h3>
      <div className="mp-cc-review-block" style={{ padding: 0 }}>
        {items.map((item) => (
          <div key={item.partId} className="mp-cc-order-line" style={{ padding: "12px 16px" }}>
            <img src={toAbsUrl(item.image)} alt="" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: "var(--mp-text)" }}>{item.name}</div>
              <div className="mp-cc-muted" style={{ fontSize: 13 }}>
                Qty {item.quantity}
              </div>
            </div>
            <div className="mp-cc-price">${(item.price * item.quantity).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <h3 className="mp-cc-label">Ship to</h3>
      <div className="mp-cc-review-block">
        <div>{shippingInfo.fullName}</div>
        <div>{shippingInfo.address}</div>
        <div>
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
        </div>
        <div>
          {shippingInfo.email} · {shippingInfo.phone}
        </div>
      </div>

      <h3 className="mp-cc-label">Payment</h3>
      <div className="mp-cc-review-block">{cloverConfig?.skipClientPayment ? "Dev: card skipped" : "Clover Hosted Checkout"}</div>

      <div className="mp-cc-form-actions">
        <button type="button" className="mp-cc-btn mp-cc-btn--ghost" onClick={() => setStep(2)}>
          Back
        </button>
        <button type="button" className="mp-cc-btn mp-cc-btn--primary" style={{ width: "auto", minWidth: 200 }} onClick={handlePlaceOrder} disabled={loading}>
          {loading ? "Placing order…" : `Place order ($${total.toLocaleString()})`}
        </button>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
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
        <span className="mp-cc-muted">$0.00</span>
      </div>
      <div className="mp-cc-line mp-cc-line--total">
        <span>Total</span>
        <span className="mp-cc-price">${total.toLocaleString()}</span>
      </div>
      <div className="mp-cc-trust" style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, color: "var(--mp-text)", marginBottom: 6 }}>Secure checkout</div>
        SSL encryption · Protected payment flow
      </div>
    </div>
  );

  if (cartLoading) {
    return (
      <div className="mp-checkout-root mp-cc-loading">
        <PartsNavbar variant="dark" q="" setQ={() => {}} />
        <div className="mp-cc-loading__box">
          <div>
            <div className="mp-cc-spinner" aria-hidden />
            <p style={{ margin: 0, textAlign: "center" }}>Loading cart…</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  if (!currentUser) {
    return (
      <div className="mp-checkout-root mp-cc-loading">
        <PartsNavbar variant="dark" q="" setQ={() => {}} />
        <div className="mp-cc-loading__box">
          <div>
            <div className="mp-cc-spinner" aria-hidden />
            <p style={{ margin: 0, textAlign: "center" }}>Verifying your session…</p>
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
            <Link to="/cart">Cart</Link>
            <HiChevronRight className="mp-cc-breadcrumb__sep" size={14} aria-hidden />
            <span className="mp-cc-breadcrumb__current">
              <FiLock size={16} aria-hidden />
              Checkout
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
                    <FiLock size={18} aria-hidden />
                    Secure checkout
                  </h1>
                  <p className="mp-cc-lead">
                    Step {step} of {totalSteps}
                    {stepLabels[step] ? ` — ${stepLabels[step]}` : ""}
                  </p>
                </div>
                <div className="mp-cc-actions">
                  <button type="button" className="mp-cc-btn mp-cc-btn--ghost" onClick={() => navigate("/cart")}>
                    <FiArrowLeft size={16} aria-hidden />
                    Back to cart
                  </button>
                </div>
              </div>

              {renderStepper()}

              <div className="row g-4">
                <div className="col-lg-8">
                  {step === 1 && renderShippingForm()}
                  {step === 2 && renderPaymentForm()}
                  {step === 3 && skipClientPayment && renderOrderReview()}
                </div>
                <div className="col-lg-4">{renderOrderSummary()}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutFront;
