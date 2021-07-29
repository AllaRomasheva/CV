const cache_name = "romasheva.cv.v9";

const updateCache = () => {
    return caches.keys().then(function (cacheNames) {
        return Promise.all(
            cacheNames
                .filter(function (cacheName) {
                    console.log(cacheName,cache_name);
                    return cacheName !== cache_name;
                })
                .map(function (cacheName) {
                    return caches.delete(cacheName);
                }),
        );
    })
}


self.addEventListener('install', function(event) {
    console.log('install',event);
    event.waitUntil(
        caches.open(cache_name).then(function(cache) {
            console.log(cache);
            return cache.addAll(
                [
                    '/assets/css/main.css',
                    '/assets/css/app.css',
                    '/assets/js/app.js',
                    '/assets/sprite.svg',
                    '/assets/images/profile.jpg',
                    '/en/',
                    '/uk/',
                    '/ru/',
                    '/'
                ]
            );
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(updateCache());
});

self.addEventListener('sync', function (event) {
    console.log(event);
    if (event.tag === 'clean') {
        event.waitUntil(updateCache());
    }
    if (event.tag === 'cache-check') {
        event.waitUntil(updateCache());
    }
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(cache_name).then(function(cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function(response) {
                    if(event.request.method !== 'POST'){
                        cache.put(event.request, response.clone());
                    }
                    return response;
                });
            }).catch(function(){

            });
        })
    );
});

updateCache();



