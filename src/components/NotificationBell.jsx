import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { authFetchInit, getAuthToken } from "../api/client";
import "./NotificationBell.css";

const API = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";

const PANEL_W = 340;
const PANEL_MAX_H = 420;

function computePanelPosition(triggerEl) {
  if (!triggerEl || typeof window === "undefined") {
    return { top: 16, left: 16, width: PANEL_W, placeAbove: true };
  }
  const r = triggerEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(PANEL_W, vw - 24);
  let left = r.left + r.width / 2 - width / 2;
  left = Math.max(12, Math.min(left, vw - width - 12));

  const margin = 8;
  const estH = Math.min(PANEL_MAX_H, vh * 0.65);
  let placeAbove = true;
  let top = r.top - margin - estH;
  if (top < 12) {
    top = r.bottom + margin;
    placeAbove = false;
    if (top + estH > vh - 12) {
      top = Math.max(12, vh - estH - 12);
    }
  }

  return { top, left, width, placeAbove };
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [panelStyle, setPanelStyle] = useState({ top: 0, left: 0, width: PANEL_W });
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const btnRef = useRef(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    if (!getAuthToken()) return;
    try {
      const res = await fetch(`${API}/api/notifications?limit=15`, authFetchInit({}));
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications || []);
      setUnread(typeof data.unreadCount === "number" ? data.unreadCount : 0);
    } catch {
      /* ignore */
    }
  }, []);

  const syncPanelPosition = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const pos = computePanelPosition(el);
    setPanelStyle(pos);
  }, []);

  useEffect(() => {
    load();
    const t = window.setInterval(load, 60000);
    const onInbox = () => load();
    window.addEventListener("inbox-updated", onInbox);
    return () => {
      window.clearInterval(t);
      window.removeEventListener("inbox-updated", onInbox);
    };
  }, [load]);

  useEffect(() => {
    const onDoc = (e) => {
      const t = e.target;
      if (wrapRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    syncPanelPosition();
    const onScroll = () => syncPanelPosition();
    const onResize = () => syncPanelPosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, items.length, syncPanelPosition]);

  const markRead = async (id) => {
    await fetch(`${API}/api/notifications/${id}/read`, authFetchInit({ method: "PATCH" })).catch(() => {});
    window.dispatchEvent(new CustomEvent("inbox-updated"));
    load();
  };

  const onItemClick = async (n) => {
    await markRead(n._id);
    setOpen(false);
    if (n.link) {
      if (n.link.startsWith("http")) {
        window.location.href = n.link;
      } else {
        navigate(n.link);
      }
    }
  };

  if (!getAuthToken()) return null;

  const panel = open ? (
    <div
      ref={panelRef}
      className="notify-bell-panel notify-bell-panel--portal"
      role="menu"
      style={{
        position: "fixed",
        top: panelStyle.top,
        left: panelStyle.left,
        width: panelStyle.width,
        zIndex: 100050,
        maxHeight: Math.min(PANEL_MAX_H, typeof window !== "undefined" ? window.innerHeight * 0.65 : PANEL_MAX_H),
      }}
    >
      <div className="notify-bell-panel-head">
        <span>Notifications</span>
        {unread > 0 ? (
          <button
            type="button"
            className="notify-bell-markall"
                onClick={async () => {
                  await fetch(`${API}/api/notifications/read-all`, authFetchInit({ method: "PATCH" })).catch(
                    () => {}
                  );
                  window.dispatchEvent(new CustomEvent("inbox-updated"));
                  load();
                }}
          >
            Mark all read
          </button>
        ) : null}
      </div>
      <div className="notify-bell-list">
        {!items.length ? (
          <div className="notify-bell-empty">No notifications yet</div>
        ) : (
          items.map((n) => (
            <button
              key={n._id}
              type="button"
              className={`notify-bell-item ${n.readAt ? "read" : ""}`}
              onClick={() => onItemClick(n)}
            >
              <span className="notify-bell-item-title">{n.title}</span>
              {n.body ? <span className="notify-bell-item-body">{n.body}</span> : null}
            </button>
          ))
        )}
      </div>
      <div className="notify-bell-panel-foot notify-bell-panel-foot--split">
        <Link to="/dashboard/notifications" onClick={() => setOpen(false)}>
          View all
        </Link>
        <Link to="/dashboard/settings" onClick={() => setOpen(false)}>
          Notification settings
        </Link>
      </div>
    </div>
  ) : null;

  return (
    <div className="notify-bell-wrap" ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        className="notify-bell-btn"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          requestAnimationFrame(() => syncPanelPosition());
        }}
      >
        <FiBell size={18} />
        {unread > 0 ? <span className="notify-bell-badge">{unread > 99 ? "99+" : unread}</span> : null}
      </button>
      {open && typeof document !== "undefined" ? createPortal(panel, document.body) : null}
    </div>
  );
}
