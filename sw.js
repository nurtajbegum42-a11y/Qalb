
const CACHE_NAME = 'qalb-v3-core';

// Assets that must be available for the app to "boot" offline
const PRE_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Qalb: Pre-caching core shell');
      return cache.addAll(PRE_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Navigation request (e.g. user refreshes the page)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  const url = event.request.url;
  const isCdn = url.includes('cdn.tailwindcss.com') || 
                url.includes('esm.sh') || 
                url.includes('fonts.googleapis.com') ||
                url.includes('fonts.gstatic.com');
  
  const isLocal = url.startsWith(self.location.origin);

  if (isLocal || isCdn) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const networkFetch = fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => null);

        // Return cached version immediately if available, otherwise wait for network
        return cachedResponse || networkFetch;
      })
    );
  }
});
