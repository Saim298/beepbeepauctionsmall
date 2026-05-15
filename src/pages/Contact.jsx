import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../utils/Header";
import Footer from "../components/frontComponents/Footer";
import { useNotify } from "../context/NotificationContext.jsx";
import { BRAND_NAME } from "../constants/brand.js";
import "./ContactPremium.css";

const HERO_IMG =
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85";
const FINALE_IMG =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80";

const SUPPORT_PHONE_DISPLAY = "+ 111 222 333";
const SUPPORT_PHONE_TEL = "+111222333";
const SUPPORT_EMAIL = "beepbeepauctions@gmail.com";
const WHATSAPP_LINK = "https://wa.me/111222333";

const API_BASE = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const INQUIRY_TYPES = [
  { value: "", label: "Select inquiry type" },
  { value: "auction", label: "Auction Support" },
  { value: "seller", label: "Seller Assistance" },
  { value: "dealer", label: "Dealer Registration" },
  { value: "technical", label: "Technical Support" },
  { value: "payment", label: "Payment Issue" },
  { value: "general", label: "General Inquiry" },
];

const FAQ_ITEMS = [
  {
    q: "How do I buy parts on the marketplace?",
    a: "Browse listings, add items to your cart, and complete checkout. Verified sellers ship with tracked updates in your dashboard.",
  },
  {
    q: "How do I list products as a seller?",
    a: "Create an account, open your seller dashboard, and add parts with photos and pricing. Our team reviews new listings when required.",
  },
  {
    q: "How do payments work?",
    a: "Secure checkout processes your payment; sellers receive payout per platform rules. Contact us if you need help with an order.",
  },
  {
    q: "How can I reach support?",
    a: "Use this form, live chat when signed in, or email us directly. We typically reply within two business hours.",
  },
];

const SOCIAL = [
  { id: "ig", label: "Instagram", href: "https://www.instagram.com/beepbeepauctions", icon: "ph-instagram-logo" },
  { id: "fb", label: "Facebook", href: "https://www.facebook.com/", icon: "ph-facebook-logo" },
  { id: "li", label: "LinkedIn", href: "https://www.linkedin.com/company/beepbeepauctions", icon: "ph-linkedin-logo" },
  { id: "x", label: "X", href: "https://x.com/beepbeepauctions", icon: "ph-x-logo" },
];

function Contact() {
  const { notify } = useNotify();
  const [openFaq, setOpenFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    inquiryType: "",
    message: "",
  });

  const inquiryLabel = useMemo(() => {
    const row = INQUIRY_TYPES.find((x) => x.value === form.inquiryType);
    return row?.label || "";
  }, [form.inquiryType]);

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      notify({ title: "Missing details", message: "Please enter your name and email.", severity: "warning" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      notify({ title: "Invalid email", message: "Please enter a valid email address.", severity: "warning" });
      return;
    }
    if (!form.message.trim()) {
      notify({ title: "Missing message", message: "Please enter a short message.", severity: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject.trim(),
          inquiryType: form.inquiryType,
          message: form.message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data.message === "string"
            ? data.message
            : Array.isArray(data.errors)
              ? data.errors.map((err) => err.msg || err.path).filter(Boolean).join(" · ")
              : "Could not send. Try again.";
        notify({ title: "Send failed", message: msg, severity: "warning" });
        return;
      }
      notify({
        title: "Message received",
        message: "Our team will respond shortly.",
        severity: "success",
      });
      setForm({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        inquiryType: "",
        message: "",
      });
    } catch {
      notify({
        title: "Network error",
        message: "Check that the API is running and CORS allows this site.",
        severity: "warning",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("cc-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="cc-root">
      <Header />
      <main>
        <section className="cc-hero" aria-labelledby="cc-hero-heading">
          <div className="cc-ambient" aria-hidden />
          <div className="cc-hero-grid">
            <div className="cc-reveal">
              <div className="cc-live-dot" role="status">
                <span aria-hidden />
                Live support online
              </div>
              <h1 id="cc-hero-heading" className="cc-hero-title">
                {BRAND_NAME} — concierge support.
              </h1>
              <p className="cc-hero-sub">
                Parts, orders, sellers, and payments—our specialists route your request with care.
              </p>
              <div className="cc-quick-row">
                <a className="cc-quick-btn" href={`tel:${SUPPORT_PHONE_TEL}`}>
                  <i className="ph ph-phone" aria-hidden />
                  {SUPPORT_PHONE_DISPLAY}
                </a>
                <Link className="cc-quick-btn" to="/chat">
                  <i className="ph ph-chats-circle" aria-hidden />
                  Live chat
                </Link>
                <a className="cc-quick-btn" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  <i className="ph ph-whatsapp-logo" aria-hidden />
                  WhatsApp
                </a>
                <a className="cc-quick-btn" href={`mailto:${SUPPORT_EMAIL}?subject=Support%20inquiry`}>
                  <i className="ph ph-envelope-simple" aria-hidden />
                  Email
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="cc-split" aria-label="Contact and form">
          <div className="cc-visual cc-reveal">
            <div className="cc-ambient" aria-hidden />
            <img className="cc-visual-img" src={HERO_IMG} alt="" loading="lazy" decoding="async" />
            <div className="cc-visual-overlay" aria-hidden />
            <div className="cc-visual-content">
              <h2>Contact {BRAND_NAME}</h2>
              <p>
                Questions about parts listings, orders, or your account—we are here to help.
              </p>
              <div className="cc-badges">
                <span className="cc-badge">Fast replies</span>
                <span className="cc-badge">Verified marketplace</span>
                <span className="cc-badge">Secure assistance</span>
              </div>
            </div>
          </div>

          <div id="cc-form" className="cc-glass-card cc-reveal">
            <h2 className="cc-form-title">Compose your inquiry</h2>
            <p className="cc-form-hint">All fields help us route you faster.</p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="cc-field">
                <input
                  id="cc-fullName"
                  type="text"
                  autoComplete="name"
                  placeholder=" "
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  disabled={submitting}
                />
                <label htmlFor="cc-fullName">Full name</label>
              </div>
              <div className="cc-field">
                <input
                  id="cc-email"
                  type="email"
                  autoComplete="email"
                  placeholder=" "
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  disabled={submitting}
                />
                <label htmlFor="cc-email">Email address</label>
              </div>
              <div className="cc-field">
                <input
                  id="cc-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder=" "
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  disabled={submitting}
                />
                <label htmlFor="cc-phone">Phone number</label>
              </div>
              <div className="cc-field">
                <input
                  id="cc-subject"
                  type="text"
                  autoComplete="off"
                  placeholder=" "
                  value={form.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  disabled={submitting}
                />
                <label htmlFor="cc-subject">Subject</label>
              </div>
              <div className="cc-field cc-field--select">
                <label htmlFor="cc-inquiry">Inquiry type</label>
                <select
                  id="cc-inquiry"
                  value={form.inquiryType}
                  onChange={(e) => setField("inquiryType", e.target.value)}
                  disabled={submitting}
                  aria-label={`Inquiry type${inquiryLabel ? `: ${inquiryLabel}` : ""}`}
                >
                  {INQUIRY_TYPES.map((opt) => (
                    <option key={opt.value || "empty"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="cc-field">
                <textarea
                  id="cc-message"
                  placeholder=" "
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  disabled={submitting}
                />
                <label htmlFor="cc-message">Message</label>
              </div>
              <button type="submit" className={`cc-submit${submitting ? " cc-skel" : ""}`} disabled={submitting}>
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          </div>
        </section>

        <section className="cc-section" aria-labelledby="cc-faq-heading">
          <div className="cc-section-head cc-reveal">
            <h2 id="cc-faq-heading">Quick answers</h2>
            <p>Common questions about the marketplace.</p>
          </div>
          <div>
            {FAQ_ITEMS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className={`cc-faq-item${open ? " is-open" : ""}`}>
                  <button
                    type="button"
                    className="cc-faq-q"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                    id={`cc-faq-btn-${i}`}
                    aria-controls={`cc-faq-panel-${i}`}
                  >
                    {item.q}
                    <i className="ph ph-caret-down" aria-hidden />
                  </button>
                  <div className="cc-faq-a" id={`cc-faq-panel-${i}`} role="region" aria-labelledby={`cc-faq-btn-${i}`}>
                    <div className="cc-faq-a-inner">{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="cc-section" aria-labelledby="cc-social-heading">
          <div className="cc-section-head cc-reveal">
            <h2 id="cc-social-heading">Follow us</h2>
          </div>
          <div className="cc-social-grid">
            {SOCIAL.map((s) => (
              <a key={s.id} className="cc-social-tile cc-reveal" href={s.href} target="_blank" rel="noopener noreferrer">
                <i className={`ph ${s.icon}`} aria-hidden />
                {s.label}
              </a>
            ))}
          </div>
        </section>

        <section className="cc-finale" aria-labelledby="cc-finale-heading">
          <div className="cc-finale-inner">
            <h2 id="cc-finale-heading">Browse premium parts today</h2>
            <p>Explore listings or send us a message.</p>
            <div className="cc-finale-btns">
              <Link to="/parts">Browse parts</Link>
              <button type="button" onClick={scrollToForm}>
                Contact support
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <div className="cc-mobile-sticky" role="navigation" aria-label="Quick support">
        <button type="button" onClick={scrollToForm}>
          Message
        </button>
        <Link to="/chat">Chat</Link>
        <a href={`tel:${SUPPORT_PHONE_TEL}`}>Call</a>
      </div>
    </div>
  );
}

export default Contact;
