import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { DashboardAppChrome, DashboardMenuButton } from "../components/DashboardAppChrome.jsx";
import { authFetchInit, getAuthToken } from "../api/client";
import "../pages/dashboard.css";
import "./DashboardNotifications.css";

const API = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

export default function DashboardNotifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p = 1) => {
    if (!getAuthToken()) {
      navigate("/signin", { replace: true });
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "25" });
      const res = await fetch(`${API}/api/notifications?${params}`, authFetchInit({}));
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setItems(data.notifications || []);
      setTotalPages(typeof data.totalPages === "number" ? data.totalPages : 1);
      setUnread(typeof data.unreadCount === "number" ? data.unreadCount : 0);
      setPage(typeof data.page === "number" ? data.page : p);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load(1);
  }, [load]);

  const markRead = async (id) => {
    await fetch(`${API}/api/notifications/${id}/read`, authFetchInit({ method: "PATCH" })).catch(() => {});
    window.dispatchEvent(new CustomEvent("inbox-updated"));
    load(page);
  };

  const onItemClick = async (n) => {
    await markRead(n._id);
    if (n.link) {
      if (n.link.startsWith("http")) window.location.href = n.link;
      else navigate(n.link);
    }
  };

  const markAll = async () => {
    await fetch(`${API}/api/notifications/read-all`, authFetchInit({ method: "PATCH" })).catch(() => {});
    window.dispatchEvent(new CustomEvent("inbox-updated"));
    load(page);
  };

  return (
    <DashboardAppChrome>
      <main className="dashboard-main dash-notifications">
        <header className="dash-notifications__header">
          <div className="dash-notifications__title-row">
            <DashboardMenuButton />
            <h1 className="dash-notifications__page-title">Notifications</h1>
          </div>
          <p className="dash-notifications__sub">
            {unread > 0 ? `${unread} unread` : "You are all caught up"}
          </p>
          <div className="dash-notifications__actions">
            {unread > 0 ? (
              <button type="button" className="dash-notifications__btn" onClick={markAll}>
                Mark all read
              </button>
            ) : null}
            <Link to="/dashboard/settings" className="dash-notifications__link">
              Notification settings
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="dash-notifications__loading">Loading…</div>
        ) : !items.length ? (
          <div className="dash-notifications__empty">
            <FiBell size={40} className="dash-notifications__empty-icon" aria-hidden />
            <p>No notifications yet</p>
            <p className="dash-notifications__empty-hint">Alerts for orders, payouts, and messages will show up here.</p>
          </div>
        ) : (
          <ul className="dash-notifications__list">
            {items.map((n) => (
              <li key={n._id}>
                <button
                  type="button"
                  className={`dash-notifications__item ${n.readAt ? "read" : ""}`}
                  onClick={() => onItemClick(n)}
                >
                  <span className="dash-notifications__item-title">{n.title}</span>
                  {n.body ? <span className="dash-notifications__item-body">{n.body}</span> : null}
                  <span className="dash-notifications__item-time">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 ? (
          <div className="dash-notifications__pager">
            <button
              type="button"
              className="dash-notifications__btn"
              disabled={page <= 1}
              onClick={() => load(page - 1)}
            >
              Previous
            </button>
            <span className="dash-notifications__page-label">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="dash-notifications__btn"
              disabled={page >= totalPages}
              onClick={() => load(page + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </main>
    </DashboardAppChrome>
  );
}
