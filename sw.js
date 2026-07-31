const CACHE_NAME = 'cami-emi-wedding-v1';
const ASSETS = [
  './',
  './index.html',
  './fundal_intro.png',
  './muzica.mp3',
  './manifest.json',
  './Nunta_Cami_si_Emi.ics'
];

// Instaleaza Service Worker si salveaza resursele in cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching assets...');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activeaza si curata cache-ul vechi
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepteaza cererile si serveste din cache daca suntem offline
self.addEventListener('fetch', event => {
  // Evitam interceptarea resurselor din retele externe (cum ar fi fonturile google sau fontawesome)
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then(networkResponse => {
            // Putem salva resurse noi in cache in mod dinamic daca dorim
            return networkResponse;
          });
        }).catch(() => {
          // Fallback in caz de eroare totala
        })
    );
  }
});
