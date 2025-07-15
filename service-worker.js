const cacheName = "block-game-cache-v1";
const assets = [
  "./",
  "./index.html",
  "./script.js",
  "./manifest.json",
  "./assets/icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});
