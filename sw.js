// PapaTalk Service Worker
// DEVELOPMENT: keep DEV_MODE=true to avoid stale files while building mini apps.
// PRODUCTION: the GitHub Pages deploy workflow (.github/workflows/deploy.yml) sets DEV_MODE=false
// and CACHE_NAME='papatalk-<commit>' on every release; keep both lines as they are.
const DEV_MODE = true;
const CACHE_NAME = 'papatalk-v12';

const CORE = [
  './',
  './index.html',
  './manifest.json',
  './img/icon-192.png',
  './img/icon-512.png',
  './vuela.html',
  './salta.html',
  './ladrillos.html',
  './curiosidades.html',
  './data/facts/facts.json',
  './fonts/atkinson-hyperlegible-400.woff2',
  './fonts/atkinson-hyperlegible-700.woff2',
];

const PICTOS = [
  'group_general','group_donde_duele','group_que_quiero','group_letras','group_juegos','group_curiosidades',
  'dolor','pica','beber','si','no_item','no_se','calor','frio','hora',
  'cabeza','cuello','espalda','brazos','barriga','culo','piernas','sonda','via',
  'pis','movil','enfermedad','musica','pelicula','descansar','dormir','compania','no_visitas',
].map(n => './img/pictograms/' + n + '.png');

const ALL_ASSETS = CORE.concat(PICTOS);

async function deleteAllCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.map(key => caches.delete(key)));
}

if (DEV_MODE) {
  self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(deleteAllCaches());
  });

  self.addEventListener('activate', event => {
    event.waitUntil(deleteAllCaches().then(() => self.clients.claim()));
  });

  self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    // Development is network-only: never read from or write to Cache Storage.
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
  });
} else {
  self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
      // cache: 'reload' skips the browser's HTTP cache so a release never stores stale files
      caches.open(CACHE_NAME).then(cache =>
        cache.addAll(ALL_ASSETS.map(url => new Request(url, { cache: 'reload' }))))
    );
  });

  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
      ).then(() => self.clients.claim())
    );
  });

  self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      }).catch(() => caches.match('./index.html'))
    );
  });
}
