const cacheName = 'v2'
const cacheFiles = [
    './',
    './index.html',
    './style.css',
    './currencies.js',
    './https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'
]

self.addEventListener('install', function(e) {
    console.log("[ServiceWorker] Installed");

    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("[ServiceWorker] caching cacheFiles");
            return cache.addAll(cacheFiles);
        })
    )

})

self.addEventListener('activate', function(e) {
    console.log("[ServiceWorker} Activated");

    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(thisCacheName) {
                if (thisCacheName !== cacheName) {
                    console.log("[ServiceWorker] Removing Cached From  ", thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }))
        })
    )

    
})

self.addEventListener('fetch', function(e) {
    console.log("[ServiceWorker] Fetching", e.request.url);

    e.respondWith (
        caches.match(e.request).then(function(response){
            if (response) {
                console.log("[ServiceWorker] Found in Cache", e.request.url);
                return response;
            }

            let requestClone = e.request.clone();

            fetch(requestClone)
                .then(function(response) {
                    if (!response) {
                        console.log("[ServiceWorker] No response from fetch");
                        return response;
                    }

                        let requestClone = response.clone();
                        caches.open(cacheName).then(function(cache) {
                            console.log("[serviceWorker] New Data New", e.request.url);
                            cache.put(e.request, responseClone);

                            return response;
                        });
                    
                })

                .catch(function(err){
                    console.log("[ServiceWorker] Error fetching and caching New Data");
                })
        })
    )
})