const CACHE_NAME = "firstpwa-v9";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/article.html",
  "/pages/home.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/api.js",
  "/icon.png"
];
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

//fetch has edited
self.addEventListener("fetch", function(event) {
  var base_url = "https://readerapi.codepolitan.com/";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
  });

  self.addEventListener("activate", function(event) {
      event.waitUntil(

        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName){
                    if(cacheName != CACHE_NAME){
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            )
        })

      )
  })