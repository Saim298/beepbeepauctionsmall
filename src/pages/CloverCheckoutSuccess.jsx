import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { apiRequest } from '../api/client.js';
import PartsNavbar from '../components/PartsNavbar';
import {
  buildCloverSuccessBrowserPath,
  isBadCloverSessionQueryValue,
  resolveSessionIdFromParams
} from '../utils/cloverSuccessSession.js';

const POLL_MS = 1500;
const MAX_POLLS = 40;

function resolveSessionId(searchParams) {
  return resolveSessionIdFromParams((k) => searchParams.get(k));
}

function resolveStoredSessionId() {
  try {
    const raw = localStorage.getItem('clover_checkout_session_id') || '';
    const v = String(raw).trim();
    if (!v) return '';
    if (isBadCloverSessionQueryValue(v)) return '';
    return v;
  } catch {
    return '';
  }
}

const CloverCheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionIdFromUrl = resolveSessionId(searchParams);
  const sessionId = sessionIdFromUrl || resolveStoredSessionId();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [message, setMessage] = useState('Confirming your payment…');
  const [failed, setFailed] = useState(false);
  const doneRef = useRef(false);
  const urlCleanedRef = useRef(false);

  /**
   * Replace literal `{CHECKOUT_SESSION_ID}` (or missing param) with a real id in the address bar for clarity.
   */
  const normalizeSuccessUrlOnce = (realId) => {
    if (!realId || urlCleanedRef.current) return;
    try {
      const next = buildCloverSuccessBrowserPath(window.location.href, realId);
      if (next) {
        window.history.replaceState({}, '', next);
      }
      urlCleanedRef.current = true;
    } catch (_) {}
  };

  useEffect(() => {
    let cancelled = false;
    let timeoutId;
    let polls = 0;
    let activeSessionId = sessionId;

    const resolveLatestIntentSession = async () => {
      const latest = await apiRequest('/api/checkout/hosted-intent/latest/status');
      if (latest?.checkoutSessionId) {
        const id = String(latest.checkoutSessionId).trim();
        if (id) {
          try {
            localStorage.setItem('clover_checkout_session_id', id);
          } catch (_) {}
          return id;
        }
      }
      return '';
    };

    const tick = async () => {
      if (cancelled || doneRef.current) return;
      try {
        if (!activeSessionId) {
          activeSessionId = await resolveLatestIntentSession();
          if (!activeSessionId) {
            throw new Error(
              'Missing checkout session in URL and no recent checkout session found for your account.'
            );
          }
        }

        normalizeSuccessUrlOnce(activeSessionId);

        const data = await apiRequest(
          `/api/checkout/hosted-intent/${encodeURIComponent(activeSessionId)}/status`
        );
        if (cancelled || doneRef.current) return;

        if (data.status === 'completed' && data.order) {
          doneRef.current = true;
          try {
            localStorage.removeItem('clover_checkout_session_id');
          } catch (_) {}
          clearCart();
          setMessage(`Order ${data.order.orderNumber || ''} confirmed. Redirecting…`);
          navigate('/user/orders', { replace: true });
          return;
        }

        if (data.status === 'failed') {
          doneRef.current = true;
          setFailed(true);
          setMessage(data.failureReason || 'We could not complete your order after payment.');
          return;
        }

        polls += 1;
        if (polls >= MAX_POLLS) {
          setMessage(
            'Your payment is still being processed. Check My Orders in a minute or contact support if this persists.'
          );
          return;
        }
        timeoutId = window.setTimeout(tick, POLL_MS);
      } catch (e) {
        if (
          String(e?.message || '').toLowerCase().includes('not found') &&
          !sessionId &&
          !cancelled &&
          !doneRef.current
        ) {
          // Latest intent could be racing with webhook writes; retry polling.
          polls += 1;
          if (polls < MAX_POLLS) {
            timeoutId = window.setTimeout(tick, POLL_MS);
            return;
          }
        }
        if (!cancelled && !doneRef.current) {
          setFailed(true);
          setMessage(e.message || 'Could not verify checkout status.');
        }
      }
    };

    tick();
    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [sessionId, navigate, clearCart]);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <PartsNavbar q="" setQ={() => {}} filters={{}} setFilters={() => {}} brands={[]} categories={[]} activeFilterCount={0} />
      <section className="section-sidebar details-section position-relative" style={{ marginTop: '110px' }}>
        <div className="container-fluid py-10 px-3 px-md-6">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center">
                {failed ? (
                  <div className="text-danger mb-3" style={{ fontSize: '3rem' }}>
                    ✕
                  </div>
                ) : (
                  <FiLoader className="mb-3 text-primary" style={{ fontSize: '3rem' }} />
                )}
                <h4 className="n4-color mb-3">{failed ? 'Something went wrong' : 'Almost there'}</h4>
                <p className="n5-color mb-4">{message}</p>
                {!failed && (
                  <p className="small text-muted mb-0">This usually takes a few seconds after you pay.</p>
                )}
                <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">
                  <Link to="/user/orders" className="btn btn-outline-secondary rounded-pill px-4">
                    My orders
                  </Link>
                  <Link to="/cart" className="btn btn-primary rounded-pill px-4">
                    Back to cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CloverCheckoutSuccess;
