import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

function parseHashParams() {
  const raw = window.location.hash || '';
  const fragment = raw.startsWith('#') ? raw.slice(1) : raw;
  return new URLSearchParams(fragment);
}

/**
 * Clover returns either:
 * - Authorization code: ?code=... (exchange on backend)
 * - Implicit / Token (Testing): #access_token=...&refresh_token=... (fragment only; not sent to server)
 */
const CloverOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const err = searchParams.get('error');
    const desc = searchParams.get('error_description');

    if (err) {
      setError(desc || err);
      setLoading(false);
      return;
    }

    const mid = searchParams.get('merchant_id') || '';
    setMerchantId(mid);

    const hashParams = parseHashParams();
    const tokenFromHash = (hashParams.get('access_token') || '').trim();
    const refreshFromHash = (hashParams.get('refresh_token') || '').trim();

    if (tokenFromHash) {
      setAccessToken(tokenFromHash);
      setRefreshToken(refreshFromHash);
      setLoading(false);
      try {
        const url = new URL(window.location.href);
        url.hash = '';
        window.history.replaceState({}, '', url.toString());
      } catch (_) {
        // ignore
      }
      return;
    }

    const code = searchParams.get('code');
    if (!code) {
      setError(
        'No authorization code in the URL query and no access_token in the URL hash. If you use Clover "Token (Testing Only)", approve again and ensure you land on this page with #access_token= in the address bar.'
      );
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetch(`${API}/api/clover/oauth/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || 'Exchange failed');
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        setAccessToken(data.access_token || '');
        setRefreshToken(data.refresh_token || '');
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Exchange failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch {
      alert('Could not copy');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Exchanging authorization code for access token…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <h4>Clover OAuth error</h4>
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h4 className="mb-3">Clover merchant token</h4>
      {merchantId ? (
        <p className="text-muted small">
          merchant_id from redirect: <code>{merchantId}</code>
        </p>
      ) : null}
      <p className="text-muted">
        Set this in Render as <code>CLOVER_HOSTED_CHECKOUT_BEARER</code> using the{' '}
        <strong>access_token</strong> below. Rotate it if you shared this URL; hash tokens are sensitive.
      </p>

      <div className="mb-3">
        <label className="form-label fw-bold">access_token (Hosted Checkout API)</label>
        <textarea className="form-control font-monospace small" rows={4} readOnly value={accessToken} />
        <button type="button" className="btn btn-primary mt-2" onClick={() => copy(accessToken)}>
          Copy access_token
        </button>
      </div>

      {refreshToken ? (
        <div className="mb-3">
          <label className="form-label fw-bold">refresh_token (store securely)</label>
          <textarea className="form-control font-monospace small" rows={3} readOnly value={refreshToken} />
          <button type="button" className="btn btn-outline-secondary mt-2" onClick={() => copy(refreshToken)}>
            Copy refresh_token
          </button>
        </div>
      ) : null}

      <p className="small text-muted">
        After saving on Render, redeploy the API and retry checkout.
      </p>
    </div>
  );
};

export default CloverOAuthCallback;
