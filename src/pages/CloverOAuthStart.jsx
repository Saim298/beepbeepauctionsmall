import { useEffect } from 'react';

/**
 * Alternate Launch Path entry from Clover Merchant Dashboard.
 * Immediately redirects to Clover v2 OAuth authorize (sandbox or prod).
 *
 * Register redirect URI in Clover REST config as subpath of Site URL, e.g.
 * https://beepbeepauctionsmall.vercel.app/oauth-clover-callback
 */
const CloverOAuthStart = () => {
  useEffect(() => {
    const clientId = import.meta.env.VITE_CLOVER_APP_ID;
    if (!clientId) {
      console.error('Missing VITE_CLOVER_APP_ID');
      return;
    }

    const env = import.meta.env.VITE_CLOVER_ENV || 'sandbox';
    const authorizeBase =
      import.meta.env.VITE_CLOVER_OAUTH_AUTHORIZE_BASE ||
      (env === 'production' ? 'https://www.clover.com' : 'https://sandbox.dev.clover.com');

    const explicitRedirect = import.meta.env.VITE_CLOVER_OAUTH_REDIRECT_URI?.trim();
    const redirectUri = explicitRedirect || `${window.location.origin}/oauth-clover-callback`;

    const urlParams = new URLSearchParams(window.location.search);
    const merchantId = urlParams.get('merchant_id');

    const authParams = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri
    });
    if (merchantId) {
      authParams.set('merchant_id', merchantId);
    }

    const authorizeUrl = `${authorizeBase}/oauth/v2/authorize?${authParams.toString()}`;
    window.location.replace(authorizeUrl);
  }, []);

  return (
    <div className="container py-5 text-center">
      <p>Redirecting to Clover to authorize your app…</p>
      <p className="text-muted small">If nothing happens, set VITE_CLOVER_APP_ID and try again.</p>
    </div>
  );
};

export default CloverOAuthStart;
