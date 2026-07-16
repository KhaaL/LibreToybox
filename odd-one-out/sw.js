/* LibreToybox — Odd One Out service worker · GNU GPL v3.0; see ../LICENSE */
const CACHE = 'odd-one-out-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html'])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: answer from cache instantly (offline-first, no
// network wait), refresh the cache in the background — the next visit gets
// the new version. Bumping CACHE is only needed as an emergency
// "everyone must get this now" lever.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(e.request).then((cached) => {
        const network = fetch(e.request)
          .then((resp) => {
            if (resp && resp.ok) cache.put(e.request, resp.clone());
            return resp;
          })
          .catch(() => cached || cache.match('./'));
        if (cached) e.waitUntil(network);
        return cached || network;
      })
    )
  );
});
