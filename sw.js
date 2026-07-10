/**
 * STYLE HUB — SERVICE WORKER
 * ------------------------------------------------------------------
 * Caches the app shell (HTML/CSS/JS/icons) for offline access and a
 * fast repeat-visit load. Firestore reads still need network — when
 * offline, js/firebase.js already falls back to demo data, so pages
 * remain usable even without a connection.
 *
 * Bump CACHE_VERSION whenever shell files change to force an update.
 * ------------------------------------------------------------------
 */
const CACHE_VERSION = "stylehub-v1";
const SHELL_FILES = [
  "/",
  "/index.html",
  "/gallery.html",
  "/services.html",
  "/booking.html",
  "/favorites.html",
  "/contact.html",
  "/about.html",
  "/404.html",
  "/css/style.css",
  "/css/responsive.css",
  "/css/animations.css",
  "/js/main.js",
  "/js/icons.js",
  "/js/render.js",
  "/js/firebase.js",
  "/js/demo-data.js",
  "/js/gallery.js",
  "/js/booking.js",
  "/js/favorites.js",
  "/assets/logo.svg",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Never cache Firestore/Firebase network calls — always go to network.
  if (request.url.includes("firestore.googleapis.com") || request.url.includes("googleapis.com")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached || caches.match("/404.html"));
      return cached || networkFetch;
    })
  );
});
