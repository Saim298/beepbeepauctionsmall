import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import io from 'socket.io-client';
import { authFetchInit, getAuthToken } from '../api/client';
import './NotificationHost.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

const NotificationContext = createContext(null);

function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return createPortal(
    <div className="notify-host" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`notify-card notify-card--${t.severity}`}
          role="status"
        >
          <div className="notify-card__body">
            {t.title ? <p className="notify-card__title">{t.title}</p> : null}
            {t.message ? <p className="notify-card__msg">{t.message}</p> : null}
          </div>
          <button
            type="button"
            className="notify-card__x"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const seq = useRef(0);
  const socketRef = useRef(null);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const notifyRef = useRef(() => {});

  const notify = useCallback((payload) => {
    const p =
      typeof payload === 'string'
        ? { message: payload, severity: 'info', duration: 5200 }
        : {
            message: payload.message ?? '',
            title: payload.title,
            severity: payload.severity ?? 'info',
            duration: payload.duration ?? 5200
          };
    const id = ++seq.current;
    setToasts((prev) => [...prev, { id, ...p }]);
    if (p.duration) {
      window.setTimeout(() => dismiss(id), p.duration);
    }
    return id;
  }, [dismiss]);

  notifyRef.current = notify;

  useEffect(() => {
    let cancelled = false;

    const connect = async () => {
      const token = getAuthToken();
      if (!token) {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        return;
      }

      const meRes = await fetch(`${API_BASE}/api/auth/me`, authFetchInit({}));
      if (!meRes.ok || cancelled) return;
      const data = await meRes.json().catch(() => ({}));
      const user = data.user;
      if (!user?.id || cancelled) return;

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const socket = io(API_BASE, {
        withCredentials: true,
        auth: { token }
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        socket.emit('join', {
          userId: user.id,
          userName: user.name || user.email || 'User'
        });
      });

      socket.on('app-notification', (payload) => {
        notifyRef.current({
          title: payload.title,
          message: payload.body,
          severity: 'info',
          duration: 6500
        });
        try {
          window.dispatchEvent(new CustomEvent('inbox-updated'));
        } catch {
          /* ignore */
        }
      });
    };

    connect();

    const onAuth = () => connect();
    window.addEventListener('storage', onAuth);
    window.addEventListener('auth-token-changed', onAuth);

    return () => {
      cancelled = true;
      window.removeEventListener('storage', onAuth);
      window.removeEventListener('auth-token-changed', onAuth);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    return {
      notify: (p) => {
        const msg = typeof p === 'string' ? p : p?.message || p?.title || '';
        if (msg) console.info('[notify]', msg);
      },
      dismiss: () => {}
    };
  }
  return ctx;
}
