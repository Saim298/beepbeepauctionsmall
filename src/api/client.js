const API_BASE = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  
  // Use provided token or get from localStorage
  const authToken = token || getAuthToken();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  });
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
  if (token) localStorage.setItem('auth_token', token);
}

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token');
}

// Try to sync token from URL on app boot (OAuth flows)
export function bootstrapAuthTokenFromUrl() {
  try {
    const url = new URL(window.location.href);
    const t = url.searchParams.get('token');
    if (t) {
      saveAuthToken(t);
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.toString());
    }
  } catch (_) {}
}


