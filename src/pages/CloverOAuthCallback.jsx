import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Clover redirects here with ?code=...&merchant_id=... after authorization.
 * We exchange the code on your backend for access_token (requires APP_ID + APP_SECRET on server).
 */
const CloverOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    const err = searchParams.get('error');
    const desc = searchParams.get('error_description');

    if (err) {
      setError(desc || err);
      setLoading(false);
      return;
    }

    if (!code) {
      setError('No authorization code in URL. Did Clover redirect here after you approved access?');
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
      <p className="text-muted">
        Set this in Render (or your backend env) as <code>CLOVER_HOSTED_CHECKOUT_BEARER</code>. Treat it
        like a password; it expires — use <code>refresh_token</code> with Clover{' '}
        <code>/oauth/v2/refresh</code> for long-running servers.
      </p>

      <div className="mb-3">
        <label className="form-label fw-bold">access_token (use for Hosted Checkout API)</label>
        <textarea className="form-control font-monospace small" rows={4} readOnly value={accessToken} />
        <button type="button" className="btn btn-primary mt-2" onClick={() => copy(accessToken)}>
          Copy access_token
        </button>
      </div>

      {refreshToken ? (
        <div className="mb-3">
          <label className="form-label fw-bold">refresh_token (store securely; not in frontend in production)</label>
          <textarea className="form-control font-monospace small" rows={3} readOnly value={refreshToken} />
          <button type="button" className="btn btn-outline-secondary mt-2" onClick={() => copy(refreshToken)}>
            Copy refresh_token
          </button>
        </div>
      ) : null}

      <p className="small text-muted">
        After saving on Render, redeploy the service and retry checkout. Remove this page from bookmarks in
        production if you prefer not to expose token UI.
      </p>
    </div>
  );
};

export default CloverOAuthCallback;
