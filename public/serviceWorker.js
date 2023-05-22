const CACHE_NAME = 'version-1';
const urlsToCache = ['../index.html','offline.html'];

const self = this;

// INSTALL SW
 self.addEventListener('install', (event)=>{
    event.waitUntil(                     // Open the cache and add all the urls that we've created
        caches.open(CACHE_NAME)
            .then((cache)=>{
                console.log("Opened Cache");
                return cache.addAll(urlsToCache)
            })
    )

 })


// LISTEN TO REQUESTS
self.addEventListener('fetch',(event)=>{
    event.respondWith(
        caches.match(event.request)
            .then(()=>{
                return fetch(event.request)
                    .catch(()=> caches.match('offline.html'))
            })
    )
})


// ACTIVATE THE SW
self.addEventListener('activate', (event)=>{
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME)

    event.waitUntil(
        caches.keys().then((cacheNames)=> Promise.all(
            cacheNames.map((cacheName)=>{
                if(!cacheWhitelist.includes(cacheName)){    // Only return the most recent cache
                    return caches.delete(cacheName)         // delete all other previous caches
                }
            })
        ))
    )
})