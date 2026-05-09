const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

export function saveAuthToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token);
    window.dispatchEvent(new Event('auth-token-changed'));
  }
}

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token');
  window.dispatchEvent(new Event('auth-token-changed'));
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


