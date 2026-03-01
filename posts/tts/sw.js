/**
 * Service Worker — TTS Silang PWA
 * Handles: offline caching, background sync
 */

const CACHE_NAME = 'tts-silang-v1.0.0';
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/game.js',
  '/ui.js',
  '/loader.js',
  '/puzzles.json',
];

// Install: cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching assets');
        return cache.addAll(CACHE_ASSETS.filter(url => !url.startsWith('https://fonts')));
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests except fonts
  if (!event.request.url.startsWith(self.location.origin) &&
      !event.request.url.includes('fonts.googleapis.com') &&
      !event.request.url.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;

        return fetch(event.request)
          .then(response => {
            // Cache successful GET requests
            if (event.request.method === 'GET' && response.status === 200) {
              const cloned = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
            }
            return response;
          })
          .catch(() => {
            // Offline fallback
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});
