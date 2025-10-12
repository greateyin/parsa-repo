// Service Worker for advanced caching and performance optimization
const CACHE_NAME = 'parsa-redesigned-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/css/style.css',
  '/js/bundle.js',
  '/images/logo.svg',
  '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for caching
            const responseToCache = response.clone();
            
            // Determine cache strategy based on request type
            const cacheName = isStaticAsset(request.url) ? STATIC_CACHE : DYNAMIC_CACHE;
            
            caches.open(cacheName)
              .then(cache => cache.put(request, responseToCache));

            return response;
          });
      })
  );
});

// Helper function to determine if asset is static
function isStaticAsset(url) {
  return /\.(css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i.test(url);
}