// Version of SOPTE's offline application cache.
//
// Change this when releasing a new version of cached application resources.
// Old SOPTE caches will be removed by the activate handler.
const CACHE_VERSION = '1.24';

const CACHE_PREFIX = 'sopte-v';
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];


// =========================
// Install
// =========================

self.addEventListener('install', event => {

  event.waitUntil(
    (async () => {

      const cache = await caches.open(CACHE_NAME);

      await cache.addAll(APP_SHELL);

      // Activate this service worker as soon as installation succeeds.
      await self.skipWaiting();

    })()
  );

});


// =========================
// Activate
// =========================

self.addEventListener('activate', event => {

  event.waitUntil(
    (async () => {

      const keys = await caches.keys();

      // Delete only old SOPTE caches.
      //
      // Do not delete unrelated caches belonging to other tools or pages
      // hosted on dibeneditto.com.
      await Promise.all(
        keys
          .filter(key =>
            key.startsWith(CACHE_PREFIX) &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      );

      // Immediately control already-open SOPTE pages.
      await self.clients.claim();

    })()
  );

});


// =========================
// Fetch
// =========================

self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only handle resources from dibeneditto.com itself.
  if (url.origin !== self.location.origin) return;


  // Navigation requests:
  //
  // Try the live SOPTE page first. If the computer is offline,
  // return the cached application instead.
  //
  // This also handles:
  //     ./?file-handler=1
  //
  // when Windows launches SOPTE while offline.
  if (event.request.mode === 'navigate') {

    event.respondWith(
      (async () => {

        const cache = await caches.open(CACHE_NAME);

        try {

          const response = await fetch(event.request);

          // Do not replace the known-good offline copy with an error response.
          if (response.ok) {
            await cache.put('./', response.clone());
          }

          return response;

        } catch {

          const cached = await cache.match('./');

          return cached || Response.error();

        }

      })()
    );

    return;

  }


  // Static application files:
  // use the current SOPTE cache when possible.
  event.respondWith(
    (async () => {

      const cache = await caches.open(CACHE_NAME);

      const cached = await cache.match(event.request);

      return cached || fetch(event.request);

    })()
  );

});