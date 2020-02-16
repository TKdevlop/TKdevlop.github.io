var CACHE_STATIC_NAME = 'static-v2';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function (event) {
    console.log('Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                console.log('Precaching App Shell');
                cache.addAll([
                    'index.html',
                    // 'assets/fonts/ionicons790f.eot',
                    // 'assets/fonts/ionicons790f.svg',
                    // 'assets/fonts/ionicons790f.ttf',
                    // 'assets/fonts/ionicons790f.woff',
                    'assets/css/bootstrap.min.css',
                    'assets/css/ionicons.css',
                    // 'assets/images/Rolling-1s-200px.svg',
                    'assets/css/jquery.pagepiling.css',
                    'assets/css/main.css',
                    'assets/js/custom.js',
                    'assets/images/portfolio/favicon.png',
                    'assets/images/bg-about.jpg',
                    'assets/images/bg-home.jpg',
                    'assets/images/bg-skills.jpg',
                    'assets/images/bg-wood.jpg',
                    

                ]);
            })
    )
});

self.addEventListener('activate', function (event) {
    console.log('Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('Removing old cache.', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        // Try the network
        fetch(event.request)
            .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                    .then(function (cache) {
                        console.log("dyanmic",res.clone())
                        cache.put(event.request.url, res.clone());
                        return res;
                    })
            })
            .catch(function (err) {
                // Fallback to cache
                return caches.match(event.request);
            })
    );
});