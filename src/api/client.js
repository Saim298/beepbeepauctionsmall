const API_BASE = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  // Use provided token or get from localStorage
  const authToken = token || getAuthToken();
  const hasAuthToken = Boolean(authToken);
  if (hasAuthToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  });

  // If a stale bearer token causes 401, retry once with cookie-only auth.
  if (res.status === 401 && hasAuthToken) {
    const retryHeaders = { 'Content-Type': 'application/json' };
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: retryHeaders,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    });
    if (res.ok && !token) {
      // Local token is stale; clear it so future requests use valid auth.
      clearAuthToken();
    }
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = isJson ? data.message || 'Request failed' : 'Request failed';
    throw new Error(message);
  }
  return data;
}

const AUTH_KEY = 'auth_token';

export function saveAuthToken(token, { persistent = true } = {}) {
  if (!token) return;
  try {
    if (persistent) {
      localStorage.setItem(AUTH_KEY, token);
      sessionStorage.removeItem(AUTH_KEY);
    } else {
      sessionStorage.setItem(AUTH_KEY, token);
      localStorage.removeItem(AUTH_KEY);
    }
    window.dispatchEvent(new Event('auth-token-changed'));
  } catch (_) {}
}

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
  } catch (_) {
    return null;
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event('auth-token-changed'));
  } catch (_) {}
}

/** Bearer from storage + cookies for protected routes (matches apiRequest behavior). */
export function authFetchInit(init = {}) {
  const token = getAuthToken();
  const headers = { ...(init.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  return {
    ...init,
    headers,
    credentials: init.credentials ?? 'include'
  };
}

// Try to sync token from URL on app boot (OAuth flows)
export function bootstrapAuthTokenFromUrl() {
  try {
    const url = new URL(window.location.href);
    const t = url.searchParams.get('token');
    // Only bootstrap token if we're NOT on the OAuth success page
    // The OAuth success page needs to handle the token itself
    if (t && !window.location.pathname.includes('/oauth-success')) {
      saveAuthToken(t);
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.toString());
    }
  } catch (_) {}
}


