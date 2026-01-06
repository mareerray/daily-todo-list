const CACHE_NAME = 'todo-v20';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => 
      cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/js/app.js',
        '/js/i18n.js',
        '/js/storage.js',
        '/js/calendar.js',
        '/js/todos.js',
        '/js/ui.js',
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
