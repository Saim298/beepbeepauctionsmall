import React, { useEffect, useState, useRef } from "react";
import { DashboardAppChrome, DashboardMenuButton } from "../components/DashboardAppChrome.jsx";
import { apiRequest, getAuthToken } from "../api/client";
import { useNotify } from "../context/NotificationContext.jsx";
import {
  registerWebPush,
  unregisterWebPush,
  isPushSubscribed,
} from "../utils/pushRegistration.js";
import "../pages/dashboard.css";

const Settings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaQR, setMfaQR] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const fileInput = useRef(null);
  const apiBase = import.meta.env.VITE_API_URL || "https://beep-auctions-backend.onrender.com";
  const { notify } = useNotify();
  const [pushBusy, setPushBusy] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushServerOk, setPushServerOk] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;
        const { user } = await apiRequest("/api/auth/me", { token });
        setName(user.name || "");
        setEmail(user.email || "");
        setUsername(user.username || "");
        setMfaEnabled(!!user.mfaEnabled);
        // Prefer uploaded file, else OAuth avatar
        const abs = user.avatarFile
          ? `${apiBase}${user.avatarFile}`
          : user.avatarUrl || "";
        setAvatarUrl(abs);
      } catch (e) {
        setError(e.message);
      }
    };
    load();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${apiBase}/api/notifications/push/vapid-public`);
        const j = await r.json().catch(() => ({}));
        setPushServerOk(!!j.configured);
        if (getAuthToken()) {
          setPushSubscribed(await isPushSubscribed());
        }
      } catch {
        setPushServerOk(false);
      }
    })();
  }, [apiBase]);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      setSaving(true);
      const token = getAuthToken();
      // Upload avatar if selected
      const file = fileInput.current?.files?.[0];
      if (file) {
        const form = new FormData();
        form.append("avatar", file);
        const uploadRes = await fetch(apiBase + "/api/auth/avatar", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
          credentials: "include",
        });
        if (uploadRes.ok) {
          const json = await uploadRes.json();
          if (json?.avatar) setAvatarUrl(json.avatar);
          else if (json?.avatarFile) setAvatarUrl(apiBase + json.avatarFile);
        }
      }
      // Save name/username
      const res = await apiRequest("/api/auth/profile", {
        method: "PATCH",
        token,
        body: { name, username },
      });
      if (res?.user?.avatarFile) setAvatarUrl(apiBase + res.user.avatarFile);
      setMessage("Your profile has been updated!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const enableBrowserPush = async () => {
    try {
      setPushBusy(true);
      await registerWebPush();
      setPushSubscribed(true);
      notify({
        title: "Browser notifications on",
        message: "You will get alerts for bids, messages, and auction results.",
        severity: "success",
      });
    } catch (err) {
      notify({
        title: "Could not enable notifications",
        message: err?.message || "Try again or use another browser.",
        severity: "error",
      });
    } finally {
      setPushBusy(false);
    }
  };

  const disableBrowserPush = async () => {
    try {
      setPushBusy(true);
      await unregisterWebPush();
      setPushSubscribed(false);
      notify({
        title: "Browser notifications off",
        message: "Push subscription removed from this device.",
        severity: "info",
      });
    } catch (err) {
      notify({
        title: "Disable failed",
        message: err?.message || "Try again.",
        severity: "error",
      });
    } finally {
      setPushBusy(false);
    }
  };

  const startMfa = async () => {
    try {
      setError("");
      const token = getAuthToken();
      const res = await apiRequest("/api/auth/mfa/enable", {
        method: "POST",
        token,
      });
      setMfaQR(res.qr);
    } catch (e) {
      setError(e.message);
    }
  };

  const verifyMfa = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const token = getAuthToken();
      await apiRequest("/api/auth/mfa/verify-setup", {
        method: "POST",
        token,
        body: { token: mfaCode },
      });
      setMfaEnabled(true);
      setMfaQR("");
      setMfaCode("");
      setMessage("Two‑factor authentication enabled!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <DashboardAppChrome theme="dark">
      <main className="dashboard-main">
        <div className="dashboard-container">
          <header className="dashboard-topbar">
            <div className="topbar-left">
              <DashboardMenuButton />
              <h1 className="page-title">Settings</h1>
              <span className="page-subtitle">Manage your account profile</span>
            </div>
            <div className="topbar-right">
              {message && (
                <span
                  className="badge soft"
                  style={{ color: "var(--success-500)" }}
                >
                  Saved
                </span>
              )}
            </div>
          </header>

          <section className="grid content-grid">
            <div className="panel glass">
              <div className="panel-header space-between">
                <h3>Profile</h3>
                {message && (
                  <span
                    className="badge soft"
                    style={{ color: "var(--success-500)" }}
                  >
                    Profile updated
                  </span>
                )}
              </div>
              <div className="panel-body">
                <form onSubmit={save} className="form-grid">
                  <div className="form-row">
                    <label>Name</label>
                    <input
                      className="input glass"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-row">
                    <label>Email</label>
                    <input className="input glass" value={email} disabled />
                  </div>
                  <div className="form-row">
                    <label>Username</label>
                    <input
                      className="input glass"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                    />
                  </div>
                  <div className="form-row">
                    <label>Avatar</label>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <img
                        src={
                          avatarUrl
                            ? /^https?:\/\//.test(avatarUrl)
                              ? avatarUrl
                              : apiBase + avatarUrl
                            : "/assets/images/user-img-1.webp"
                        }
                        onError={(e) => {
                          e.currentTarget.src =
                            "/assets/images/user-img-1.webp";
                        }}
                        alt="avatar"
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1px solid var(--glass-300)",
                        }}
                      />
                      <input ref={fileInput} type="file" accept="image/*" />
                    </div>
                  </div>
                  {error && (
                    <p className="error" style={{ color: "var(--danger-500)" }}>
                      {error}
                    </p>
                  )}
                  <div
                    className="actions"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <button className="pill" disabled={saving}>
                      {saving ? "Saving…" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="panel glass">
              <div className="panel-header space-between">
                <h3>Security</h3>
                {mfaEnabled ? (
                  <span
                    className="badge soft"
                    style={{ color: "var(--success-500)" }}
                  >
                    2FA enabled
                  </span>
                ) : (
                  <span
                    className="badge soft"
                    style={{ color: "var(--muted)" }}
                  >
                    2FA off
                  </span>
                )}
              </div>
              <div className="panel-body">
                {!mfaEnabled && !mfaQR && (
                  <button className="pill" onClick={startMfa}>
                    Enable Two‑Factor Authentication
                  </button>
                )}
                {mfaQR && (
                  <div className="form-grid">
                    <div className="form-row">
                      <label>Scan QR with Authenticator app</label>
                      <img
                        src={mfaQR}
                        alt="MFA QR"
                        style={{
                          width: 180,
                          background: "#fff",
                          borderRadius: 12,
                          padding: 8,
                        }}
                      />
                    </div>
                    <form onSubmit={verifyMfa} className="form-row">
                      <label>Enter 6‑digit code</label>
                      <input
                        className="input glass"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        placeholder="000000"
                      />
                      <div
                        className="actions"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <button className="pill">Verify</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            <div className="panel glass">
              <div className="panel-header space-between">
                <h3>Notifications</h3>
                {pushSubscribed ? (
                  <span className="badge soft" style={{ color: "var(--success-500)" }}>
                    Push on
                  </span>
                ) : (
                  <span className="badge soft" style={{ color: "var(--muted)" }}>
                    Push off
                  </span>
                )}
              </div>
              <div className="panel-body">
                <p style={{ color: "var(--muted)", marginTop: 0, lineHeight: 1.5 }}>
                  In-app toasts appear while you use the site. Enable{" "}
                  <strong>browser push</strong> for alerts when the tab is closed (permission required).
                </p>
                {!pushServerOk ? (
                  <p style={{ color: "var(--muted)", fontSize: 14 }}>
                    Push requires server <code>VAPID_PUBLIC_KEY</code> and <code>VAPID_PRIVATE_KEY</code>.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                    {!pushSubscribed ? (
                      <button
                        type="button"
                        className="pill primary"
                        disabled={pushBusy || !getAuthToken()}
                        onClick={enableBrowserPush}
                      >
                        {pushBusy ? "Working…" : "Enable browser push"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="pill"
                        disabled={pushBusy}
                        onClick={disableBrowserPush}
                      >
                        {pushBusy ? "Working…" : "Disable browser push on this device"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
          {showToast && (
            <div className="toast success">{message || "Saved"}</div>
          )}
        </div>
      </main>
    </DashboardAppChrome>
  );
};

export default Settings;