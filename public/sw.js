self.addEventListener('push', (event) => {
  let data = { title: 'Beepbeep Auction', body: '', url: '/' };
  try {
    if (event.data) {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    }
  } catch {
    try {
      const t = event.data?.text();
      if (t) data.body = t;
    } catch {
      /* ignore */
    }
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Beepbeep Auction', {
      body: data.body || '',
      icon: '/assets/images/favicon.png',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.openWindow(url).catch(() => {
      /* ignore */
    })
  );
});
