importScripts('/workbox-sw.js');
importScripts('/config.js');

workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([]);

// app-shell
workbox.routing.registerRoute('/', new workbox.strategies.NetworkFirst());

// webfont-cache
const webFontHandler = new workbox.strategies.CacheFirst({
  cacheName: 'webfont-cache',
  plugins: [
    new workbox.expiration.Plugin({maxEntries: 20}),
    new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
  ],
});
workbox.routing.registerRoute(/https:\/\/fonts.googleapis.com\/.*/, webFontHandler);
workbox.routing.registerRoute(/https:\/\/fonts.gstatic.com\/.*/, webFontHandler);

// get-urls-cache
const API = new RegExp('https:\/\/' + config.endpointURL + '\/.*');
const apiHandler = new workbox.strategies.NetworkFirst({
  cacheName: 'get-urls-cache'
});
workbox.routing.registerRoute(API, apiHandler);

// work-images-cache
workbox.routing.registerRoute(/\.(?:jpg|png|json|ico|jpeg|svg)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'work-images-cache',
    plugins: [
      new workbox.expiration.Plugin({maxEntries: 60}),
      new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
    ],
  })
);
