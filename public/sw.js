const CACHE_NAME = 'lifeboat-student-v2';
const STATIC_CACHE = 'lifeboat-static-v2';
const DYNAMIC_CACHE = 'lifeboat-dynamic-v2';

// Install event - cache basic resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Static cache opened');
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/favicon.ico',
          '/placeholder.svg'
        ]);
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('Dynamic cache opened');
        return cache;
      })
    ]).catch((error) => {
      console.log('Cache install failed:', error);
    })
  );
});

// Fetch event - only handle specific requests
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip all development and external requests
  const url = new URL(event.request.url);
  const isDevelopment = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isExternal = url.origin !== self.location.origin;
  const isDevFile = url.pathname.includes('node_modules') || 
                   url.pathname.includes('.vite') ||
                   url.pathname.includes('firebase') ||
                   url.pathname.includes('@vite') ||
                   url.pathname.includes('browserPolyfillWrapper');

  // Skip development files and external requests
  if (isDevelopment && (isExternal || isDevFile)) {
    return;
  }

  // Only handle same-origin requests
  if (isExternal) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Only cache successful responses
            if (!response || response.status !== 200) {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.log('Cache put failed:', error);
              });

            return response;
          })
          .catch((error) => {
            console.log('Fetch failed:', error);
            // Return a simple offline response
            return new Response('Offline', { 
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 