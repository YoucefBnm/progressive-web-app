const cacheName = 'v1'
const cacheAssets = [
    'index.html',
    '/js/app.js',
    '/images/icons/sprite.svg'
]
// call install Event 
self.addEventListener('install', e => {
    console.log('Service Worker: Installed Successfully !!')
    // handle caching pages
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('Service Worker pre-caching assets')
                return cache.addAll(cacheAssets)
            })
    )
})
// call activate Event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated Successfully !!')
    // remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheName => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log('Service Worker: Clearing out old Cache ...')
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})
// call fetch event to show website on offline mode
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching ...')
    e.respondWith(
        caches.open(cacheName)
            .then(cache => {
                return cache.match(e.request)
                    .then(response => {
                        return response || fetch(e.request)
                            .then(response => {
                                const responseClone = response.clone()
                                cache.put(e.request, responseClone)
                            })
                    })
            })
    )
})