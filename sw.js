const CACHE_NAME = 'sheicustoms-v3';

// Recursos esenciales que se guardarán para uso offline
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './logo.webp',
  './favicon.ico'
];

// 1. Instalar el Service Worker y guardar recursos esenciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Shei Customs: Archivos almacenados en caché con éxito.');
      return cache.addAll(urlsToCache);
    })
  );
  // Fuerza al SW recién instalado a activarse inmediatamente
  self.skipWaiting();
});

// 2. Limpiar cachés antiguos cuando actualices la versión (ej. 'sheicustoms-v2')
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Shei Customs: Eliminando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Estrategia de respuesta: Buscar en caché -> Si no existe, buscar en internet
self.addEventListener('fetch', event => {
  // Ignoramos peticiones que no sean GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      // Si está en caché, lo devuelve; de lo contrario, realiza la petición a internet
      return response || fetch(event.request).then(fetchResponse => {
        // Opcional: si la respuesta es válida, podemos guardarla dinámicamente
        return fetchResponse;
      });
    }).catch(() => {
      // Si no hay red ni caché, puedes devolver una respuesta por defecto
      console.log('Shei Customs: Sin conexión a internet.');
    })
  );
});
