import { authFetchInit, getAuthToken } from '../api/client';

const API = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerWebPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications are not supported in this browser.');
  }
  const keyRes = await fetch(`${API}/api/notifications/push/vapid-public`);
  const keyJson = await keyRes.json().catch(() => ({}));
  if (!keyJson.configured || !keyJson.publicKey) {
    throw new Error('Push is not configured on the server (set VAPID keys).');
  }
  if (!getAuthToken()) {
    throw new Error('Sign in to enable browser notifications.');
  }

  const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await reg.update();
  await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  const existing = await reg.pushManager.getSubscription();
  if (existing) {
    await existing.unsubscribe();
  }

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(keyJson.publicKey)
  });

  const res = await fetch(`${API}/api/notifications/push/subscribe`, authFetchInit({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: sub.toJSON() })
  }));
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Could not save push subscription.');
  }
  return true;
}

export async function unregisterWebPush() {
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await fetch(`${API}/api/notifications/push/unsubscribe`, authFetchInit({
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: sub.endpoint })
    })).catch(() => {});
    await sub.unsubscribe();
  }
}

export async function isPushSubscribed() {
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return false;
    const sub = await reg.pushManager.getSubscription();
    return Boolean(sub);
  } catch {
    return false;
  }
}
