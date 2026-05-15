import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BeepVintageVideo from '../../assets/Videos/Beep Vintage Car.mp4';
import { BRAND_NAME_SHORT } from '../../constants/brand.js';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/**
 * Left hero uses the same cinematic loop as the home page Banner
 * (`src/assets/Videos/Beep Vintage Car.mp4`).
 */
export default function LuxuryAuthShell({ title, subtitle, brandLogo, heroKicker = 'Premium vehicle auctions', children, footerLegal }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="lux-auth-page">
      <div className="lux-auth-grid">
        <aside className="lux-auth-hero">
          <div className="lux-auth-hero-media" aria-hidden>
            {reducedMotion ? (
              <div className="lux-auth-hero-static-fallback" />
            ) : (
              <>
                <video
                  className="lux-auth-hero-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={BeepVintageVideo} type="video/mp4" />
                </video>
                <div className="lux-auth-hero-video-shade" />
              </>
            )}
            <div className="lux-auth-hero-vignette" />
          </div>
          <div className="lux-auth-noise" aria-hidden />
          <div className="lux-auth-ambient" aria-hidden />
          <div className="lux-hero-copy">
            <p className="lux-hero-kicker">{heroKicker}</p>
            <h1 className="lux-hero-title">Bid Beyond Limits</h1>
            <p className="lux-hero-sub">
              Live auctions for curated sports and luxury vehicles—verified listings, sealed deposits, trusted bidders worldwide.
            </p>
            <div className="lux-stats">
              <span className="lux-stat-chip">
                <span className="live-dot" />
                Auctions live now
              </span>
              <span className="lux-stat-chip">Instant bidding</span>
              <span className="lux-stat-chip">Bank-grade checkout</span>
            </div>
          </div>
        </aside>
        <div className="lux-auth-pane">
          <div className="lux-auth-card lux-auth-enter">
            <Link to="/" className="lux-auth-brand" aria-label="Home">
              {brandLogo ? <img src={brandLogo} alt="" /> : <span style={{ fontWeight: 900, letterSpacing: '-0.04em', fontSize: '1.25rem' }}>{BRAND_NAME_SHORT}</span>}
            </Link>
            <h2 className="lux-auth-heading">{title}</h2>
            <p className="lux-auth-lead">{subtitle}</p>
            {children}
            {footerLegal ? <div className="lux-footer-legalese">{footerLegal}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
