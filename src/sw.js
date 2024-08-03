// version of service worker
const VERSION = "v0.1.1";

// cache name
const CACHE_NAME = "supanote-tracker-" + VERSION;

// static resources to cache
const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/style/main.css",
  "/src/app.js",
  "/manifest.json",
  "/public/imgs/icon-400.png",
];

// cache all static resources when install the service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

// delete old cache and change the controler of the application when activate the service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      await clients.claim();
    })()
  );
});

// intercept network requests and respond with cached content instead of going through the network
self.addEventListener("fetch", (event) => {
  // as a single page app, always redirect to the main page
  if (event.request.mode == "navigate") {
    event.respondWith(caches.match("/"));
    return;
  }

  // for other requests, first check the cache, then check the network
  event.respondWith(async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request.url);
    if (cachedResponse) {
      //return cached response
      return cachedResponse;
    } else {
      //not found
      return new Response(null, { status: 404 });
    }
  });
});
