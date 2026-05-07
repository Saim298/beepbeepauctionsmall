import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { apiRequest } from '../api/client.js';
import PartsNavbar from '../components/PartsNavbar';

const POLL_MS = 1500;
const MAX_POLLS = 40;

function resolveSessionId(searchParams) {
  const raw =
    searchParams.get('session_id') ||
    searchParams.get('checkout_session_id') ||
    searchParams.get('checkoutSessionId') ||
    searchParams.get('id') ||
    '';
  const v = String(raw).trim();
  if (!v) return '';
  const upper = v.toUpperCase();
  if (upper.includes('CHECKOUT_SESSION_ID') || upper === '{CHECKOUT_SESSION_ID}') {
    return '';
  }
  return v;
}

const CloverCheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = resolveSessionId(searchParams);
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [message, setMessage] = useState('Confirming your payment…');
  const [failed, setFailed] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setFailed(true);
      setMessage(
        'Missing or invalid checkout session in the URL (Clover did not replace {CHECKOUT_SESSION_ID}, or use session_id / checkout_session_id). Set success URL in Clover or env to use placeholders. Return to cart and complete checkout again.'
      );
      return undefined;
    }

    let cancelled = false;
    let timeoutId;
    let polls = 0;

    const tick = async () => {
      if (cancelled || doneRef.current) return;
      try {
        const data = await apiRequest(
          `/api/checkout/hosted-intent/${encodeURIComponent(sessionId)}/status`
        );
        if (cancelled || doneRef.current) return;

        if (data.status === 'completed' && data.order) {
          doneRef.current = true;
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
