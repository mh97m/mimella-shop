const CACHE_NAME = 'clickly-v2';
const STATIC_CACHE = 'clickly-static-v2';
const DYNAMIC_CACHE = 'clickly-dynamic-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/imgs/logo.svg',
  '/manifest.json'
];

const CACHEABLE_PAGES = [
  '/home2.html',
  '/all.html',
  '/fav.html',
  '/profile.html',
  '/cart.html',
  '/product.html',
  '/payment.html',
  '/blog.html',
  '/post.html',
  '/contact.html',
  '/about.html'
];

const CACHE_STRATEGIES = {
  images: 'cache-first',
  pages: 'network-first',
  assets: 'cache-first'
};

const urlsToCache = [
  './splash.html',
  './index.html',
  './home.html',
  './home2.html',
  './cart.html',
  './cart2.html',
  './cart3.html',
  './product.html',
  './profile.html',
  './profile2.html',
  './fav.html',
  './fav2.html',
  './fav3.html',
  './all.html',
  './all2.html',
  './all3.html',
  './payment.html',
  './payment_method.html',
  './payment_method2.html',
  './login.html',
  './register.html',
  './forget.html',
  './contact.html',
  './about.html',
  './near.html',
  './test_carousel.html',
  './assets/css/styles.css',
  './assets/js/app.js',
  './manifest.json',
  './assets/imgs/banner.jpg',
  './assets/imgs/b1.webp'
];


self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(DYNAMIC_CACHE)
    ]).then(() => self.skipWaiting())
  );
});


self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => 
        Promise.all(
          keys.filter(key => !key.includes('clickly-')).map(key => caches.delete(key))
        )
      ),
      self.clients.claim()
    ])
  );
});


self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then(response => response || fetch('/index.html'))
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  if (url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/)) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request).then(fetchResponse => {
          const responseClone = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, responseClone));
          return fetchResponse;
        }))
    );
    return;
  }

  if (CACHEABLE_PAGES.some(page => url.pathname.endsWith(page))) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(request))
  );
});
