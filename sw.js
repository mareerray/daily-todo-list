self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('todo-v1').then((cache) => 
  cache.addAll([
    '/', '/index.html', '/style.css', '/app.js'
    // Icons optional
  ].filter(url => url)) // Safe
).catch(err => console.log('Cache optional', err))

    // caches.open('todo-v1').then((cache) => cache.addAll([
    //   '/', '/index.html', '/style.css', '/app.js', '/icon-192.png', '/icon-512.png'
    // ])),
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});
