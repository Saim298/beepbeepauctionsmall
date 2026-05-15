import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiActivity, FiDroplet, FiHeart } from "react-icons/fi";
import { getAuthToken } from "../../api/client";
import "./FeaturedAuctionsMobile.css";

const API_BASE = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

function toAbsUrl(url) {
  if (!url) return "";
  const s = String(url).trim();
  if (s.startsWith("http") || s.startsWith("data:")) return s;
  if (s.startsWith("//")) return `https:${s}`;
  const path = s.startsWith("/") ? s : `/${s}`;
  return `${String(API_BASE).replace(/\/$/, "")}${path}`;
}

function listingMakeModel(car) {
  if (!car) return "";
  const mk = typeof car.make === "object" && car.make?.name ? car.make.name : car.make;
  const md = typeof car.model === "object" && car.model?.name ? car.model.name : car.model;
  return [mk, md].filter(Boolean).join(" ");
}

function firstListingImage(car) {
  if (!car) return "";
  if (Array.isArray(car.images) && car.images[0]) return car.images[0];
  if (car.media?.length) {
    const m = car.media[0];
    return m?.url || "";
  }
  return "";
}

function formatTitle(car) {
  if (!car) return "Auction";
  const mm = listingMakeModel(car);
  const y = car.year != null ? String(car.year) : "";
  if (y && mm) return `${y} ${mm}`.trim();
  if (car.name) return car.name;
  return mm || "Auction listing";
}

function formatFuel(f) {
  if (f == null || f === "") return "—";
  return String(f)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMoney(n) {
  const v = Number(n);
  if (Number.isNaN(v)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(v);
}

function formatCountdown(endDate) {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;
  if (diff <= 0) return "00:00:00";
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((x) => String(x).padStart(2, "0")).join(":");
}

async function fetchActiveAuctions() {
  const token = getAuthToken();
  const qs = new URLSearchParams({
    limit: "6",
    page: "1",
    sortBy: "endDate",
    _t: String(Date.now())
  });
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/auctions/active?${qs}`, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store"
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to load auctions");
  }
  return Array.isArray(data.auctions) ? data.auctions : [];
}

const FeaturedAuctionsMobile = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const list = await fetchActiveAuctions();
        if (!cancelled) setAuctions(list);
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Could not load auctions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!auctions.length) return undefined;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [auctions.length]);

  return (
    <section className="fam2 d-lg-none" aria-label="Featured auctions">
      <div className="fam2-head">
        <h2 className="fam2-title">Featured</h2>
        <Link to="/auctions" className="fam2-viewall">
          View All
        </Link>
      </div>

      {loading && (
        <div className="fam2-scroll">
          {[1, 2, 3].map((i) => (
            <div key={i} className="fam2-skel" />
          ))}
        </div>
      )}

      {!loading && err && <div className="fam2-empty">{err}</div>}

      {!loading && !err && auctions.length === 0 && (
        <div className="fam2-empty">No live auctions right now.</div>
      )}

      {!loading && !err && auctions.length > 0 && (
        <div className="fam2-scroll">
          {auctions.map((a) => {
            const car = a.carListing;
            const title = formatTitle(car);
            const img = firstListingImage(car);
            const miles =
              car?.mileage != null && car.mileage !== ""
                ? `${Number(car.mileage).toLocaleString()} mi`
                : null;
            const fuel = formatFuel(car?.fuelType);
            const bid = Number(a.currentBid) > 0 ? a.currentBid : a.startingBid ?? 0;

            return (
              <div key={a._id} className="fam2-card">
                <Link to={`/auction-details/${a._id}`} className="fam2-card-link">
                  <div className="fam2-media">
                    <img
                      src={img ? toAbsUrl(img) : "/assets/images/handpicked-img-1.webp"}
                      alt={title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/images/handpicked-img-1.webp";
                      }}
                    />
                    <span className="fam2-live">
                      <span className="fam2-live-dot" aria-hidden />
                      Live
                    </span>
                  </div>
                  <div className="fam2-body">
                    <h3 className="fam2-car-title">{title}</h3>
                    <div className="fam2-specs">
                      {miles ? (
                        <div className="fam2-spec">
                          <FiActivity size={15} aria-hidden />
                          <span>{miles}</span>
                        </div>
                      ) : null}
                      <div className="fam2-spec">
                        <FiDroplet size={15} aria-hidden />
                        <span>{fuel}</span>
                      </div>
                    </div>
                    <div className="fam2-bid-row">
                      <div>
                        <div className="fam2-bid-label">Current Bid</div>
                        <div className="fam2-bid-value">{formatMoney(bid)}</div>
                      </div>
                      <div>
                        <div className="fam2-bid-label">Ends In</div>
                        <div className="fam2-ends-value">{formatCountdown(a.endDate)}</div>
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  className="fam2-heart"
                  aria-label="Favorite"
                  onClick={(e) => e.preventDefault()}
                >
                  <FiHeart size={18} strokeWidth={2} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !err && auctions.length > 0 && (
        <div className="fam2-foot">
          <Link to="/auctions" className="text-decoration-none">
            See all live auctions
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedAuctionsMobile;
