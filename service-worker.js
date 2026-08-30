/**
 * ============================================================
 * EDUCATION FINANCE & MANAGEMENT PLATFORM
 * SERVICE WORKER v0.1.1
 * ============================================================
 */

const CACHE_NAME =
  'education-finance-v0-1-1';

const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './assets/app.css',
  './assets/config.js',
  './assets/api.js',
  './assets/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];


self.addEventListener(
  'install',
  function (event) {

    event.waitUntil(
      caches
        .open(
          CACHE_NAME
        )
        .then(
          function (cache) {

            return cache.addAll(
              APP_SHELL
            );
          }
        )
    );


    self.skipWaiting();
  }
);


self.addEventListener(
  'activate',
  function (event) {

    event.waitUntil(
      caches
        .keys()
        .then(
          function (keys) {

            return Promise.all(
              keys
                .filter(
                  function (key) {

                    return (
                      key !==
                      CACHE_NAME
                    );
                  }
                )
                .map(
                  function (key) {

                    return caches.delete(
                      key
                    );
                  }
                )
            );
          }
        )
    );


    self.clients.claim();
  }
);


self.addEventListener(
  'fetch',
  function (event) {

    const request =
      event.request;


    if (
      request.method !==
      'GET'
    ) {

      return;
    }


    const url =
      new URL(
        request.url
      );


    /*
     * Jangan intercept / cache API Apps Script.
     */
    if (
      url.hostname ===
        'script.google.com' ||
      url.hostname ===
        'script.googleusercontent.com'
    ) {

      return;
    }


    /*
     * Navigasi:
     * network first + offline fallback.
     */
    if (
      request.mode ===
      'navigate'
    ) {

      event.respondWith(
        fetch(
          request
        )
          .then(
            function (response) {

              return response;
            }
          )
          .catch(
            function () {

              return caches.match(
                './offline.html'
              );
            }
          )
      );


      return;
    }


    /*
     * Asset statis:
     * cache first, network fallback.
     */
    event.respondWith(
      caches
        .match(
          request
        )
        .then(
          function (cached) {

            if (
              cached
            ) {

              return cached;
            }


            return fetch(
              request
            )
              .then(
                function (response) {

                  if (
                    !response ||
                    response.status !== 200 ||
                    response.type ===
                      'opaque'
                  ) {

                    return response;
                  }


                  const copy =
                    response.clone();


                  caches
                    .open(
                      CACHE_NAME
                    )
                    .then(
                      function (cache) {

                        cache.put(
                          request,
                          copy
                        );
                      }
                    );


                  return response;
                }
              );
          }
        )
    );
  }
);
