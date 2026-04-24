// PlaneRadar Service Worker v1.0
const CACHE_NAME = 'planespotter-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
];

// ── INSTALL: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS.filter(u => !u.startsWith('https://fonts'))))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: serve from cache or network
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Don't cache OpenSky API calls
  if (url.includes('opensky-network.org')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ── PUSH NOTIFICATIONS (if using push server later)
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'plane',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: '/' },
  });
});

// ── NOTIFICATION CLICK
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

// ── BACKGROUND SYNC (periodic check when supported)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'plane-check') {
    event.waitUntil(checkPlanesInBackground());
  }
});

async function checkPlanesInBackground() {
  // This would require stored coordinates from the main app
  // For now, just wake the app
  const clientList = await clients.matchAll({ type: 'window' });
  for (const client of clientList) {
    client.postMessage({ type: 'background-check' });
  }
}
