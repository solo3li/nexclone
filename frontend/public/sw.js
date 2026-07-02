// NexMedia Service Worker - PWA Caching Strategy
// Version: 1.0.0 - Update this version to force cache refresh

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `nexmedia-static-${CACHE_VERSION}`;
const IMAGES_CACHE = `nexmedia-images-${CACHE_VERSION}`;
const FONTS_CACHE = `nexmedia-fonts-${CACHE_VERSION}`;
const PAGES_CACHE = `nexmedia-pages-${CACHE_VERSION}`;

const ALL_CACHES = [STATIC_CACHE, IMAGES_CACHE, FONTS_CACHE, PAGES_CACHE];

// Static assets to precache on install
const PRECACHE_URLS = [
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Silently fail if precache fails (e.g. offline during install)
      });
    }).then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !ALL_CACHES.includes(name))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ===== FETCH =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith('http')) return;

  // NEVER cache API calls - always NetworkOnly
  if (url.pathname.startsWith('/api/')) {
    return; // Let browser handle normally
  }

  // Skip Next.js internal routes
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;

  // Google Fonts stylesheets - StaleWhileRevalidate
  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(request, FONTS_CACHE, 4, 7 * 24 * 60 * 60));
    return;
  }

  // Google Fonts webfonts - CacheFirst (1 year)
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONTS_CACHE, 20, 365 * 24 * 60 * 60));
    return;
  }

  // Next.js static assets (_next/static) - CacheFirst (immutable, have hash)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 500, 365 * 24 * 60 * 60));
    return;
  }

  // Images in /public - CacheFirst (30 days)
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    event.respondWith(cacheFirst(request, IMAGES_CACHE, 64, 30 * 24 * 60 * 60));
    return;
  }

  // HTML pages - NetworkFirst with 10s timeout, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGES_CACHE, 32, 24 * 60 * 60));
    return;
  }
});

// ===== CACHE STRATEGIES =====

async function cacheFirst(request, cacheName, maxEntries, maxAge) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    const dateHeader = cached.headers.get('sw-cached-at');
    if (dateHeader) {
      const age = (Date.now() - parseInt(dateHeader)) / 1000;
      if (age > maxAge) {
        // Stale — fetch in background and update cache
        fetchAndCache(request, cache, maxEntries).catch(() => {});
      }
    }
    return cached;
  }

  return fetchAndCache(request, cache, maxEntries);
}

async function networkFirst(request, cacheName, maxEntries, maxAge) {
  const cache = await caches.open(cacheName);
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
    ]);
    if (response.ok) {
      await cacheResponse(cache, request, response.clone(), maxEntries);
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function staleWhileRevalidate(request, cacheName, maxEntries, maxAge) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetchAndCache(request, cache, maxEntries).catch(() => null);

  return cached || networkPromise;
}

async function fetchAndCache(request, cache, maxEntries) {
  const response = await fetch(request);
  if (response.ok) {
    await cacheResponse(cache, request, response.clone(), maxEntries);
  }
  return response;
}

async function cacheResponse(cache, request, response, maxEntries) {
  // Add timestamp header for cache expiry tracking
  const headers = new Headers(response.headers);
  headers.set('sw-cached-at', Date.now().toString());

  const cachedResponse = new Response(await response.blob(), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });

  await cache.put(request, cachedResponse);

  // Enforce max entries
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
  }
}
