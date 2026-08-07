// SU IT Guide - Progressive Web App Service Worker
const CACHE_NAME = "su-it-guide-v2";

// Install Event - Pre-cache core application shell
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate Event - Clean up stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Bypass Next.js Dev HMR & WebSockets
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // CRITICAL: Bypass Next.js dev server HMR, WebSockets, APIs and hot-reload requests to prevent infinite page reload loop in development
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("webpack-hmr") ||
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1"
  ) {
    return; // Pass through directly to network
  }

  // Network-First Strategy for Production Pages
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match("/");
        });
      })
  );
});
