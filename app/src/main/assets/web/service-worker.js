// FaceTube PWA Service Worker - Connect. Create. Share.
const CACHE_NAME = 'facetube-v1.0.0';
const ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './css/components.css',
  './css/dark-mode.css',
  './css/responsive.css',
  './js/app.js',
  './js/auth.js',
  './js/feed.js',
  './js/videos.js',
  './js/shorts.js',
  './js/messages.js',
  './js/creator.js',
  './js/admin.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => console.log('Asset cache warning:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
