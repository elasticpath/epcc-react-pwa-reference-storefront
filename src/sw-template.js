importScripts('/workbox-sw.js');

workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([]);

// app-shell
workbox.routing.registerRoute('/', new workbox.strategies.NetworkFirst());
workbox.routing.registerRoute(/^\/$|category\/.*|product\/.*|compare-products|registration|account\/.*|search/, new workbox.strategies.NetworkFirst());

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
workbox.routing.registerRoute(/https:\/\/use.fontawesome.com\/.*/, webFontHandler);

// get-urls-cache
const API = /https:\/\/api.moltin.com\/.*/;
const apiHandler = new workbox.strategies.NetworkFirst({
  cacheName: 'get-urls-cache'
});
workbox.routing.registerRoute(API, apiHandler);
