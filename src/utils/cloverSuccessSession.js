/**
 * Pure helpers for Clover success return handling (literal `{CHECKOUT_SESSION_ID}` etc.).
 */

export function isBadCloverSessionQueryValue(raw) {
  const v = String(raw ?? '').trim();
  if (!v) return true;
  const upper = v.toUpperCase();
  return upper.includes('CHECKOUT_SESSION_ID') || v === '{CHECKOUT_SESSION_ID}';
}

/** @param {(key: string) => string | null} get URLSearchParams.get bound or similar */
export function resolveSessionIdFromParams(get) {
  const raw =
    get('session_id') ||
    get('checkout_session_id') ||
    get('checkoutSessionId') ||
    get('id') ||
    '';
  const v = String(raw).trim();
  if (!v) return '';
  if (isBadCloverSessionQueryValue(v)) return '';
  return v;
}

/**
 * Relative path (+ query) suitable for history.replaceState when URL has a bogus/missing session_id.
 * Returns null when no rewrite is needed.
 * @param {string} currentHref window.location.href
 * @param {string} realSessionId
 */
export function buildCloverSuccessBrowserPath(currentHref, realSessionId) {
  if (!realSessionId || !currentHref) return null;
  let u;
  try {
    u = new URL(currentHref);
  } catch {
    return null;
  }
  const rawSid = String(u.searchParams.get('session_id') || '').trim();
  const upper = rawSid.toUpperCase();
  const isBad =
    !rawSid || upper.includes('CHECKOUT_SESSION_ID') || rawSid === '{CHECKOUT_SESSION_ID}';
  if (!isBad) return null;
  u.searchParams.set('session_id', realSessionId);
  const qs = u.searchParams.toString();
  return qs ? `${u.pathname}?${qs}` : u.pathname;
}
