const CACHE_NAME = 'todo-v6';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => 
      cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/manifest.json',
        '/favicon.ico',
        '/translations.json',
        '/icon-192.png',
        '/icon-512.png'
      ].filter(url => url))
    ).catch(err => console.log('Cache optional', err))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then((cached) => cached || fetch(e.request))
      .catch(() => new Response('', { status: 503, statusText: 'Offline' }))
  );
});
