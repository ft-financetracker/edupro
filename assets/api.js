window.EduApi = (function () {
  'use strict';

  function request(action, params) {
    return new Promise(function (resolve, reject) {
      const apiUrl = String(window.EDU_CONFIG.API_URL || '').trim();

      if (
        !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(apiUrl)
      ) {
        reject(
          new Error(
            'API URL belum diisi pada assets/config.js.'
          )
        );
        return;
      }

      const callbackName =
        '__eduJsonp_' +
        Date.now() +
        '_' +
        Math.random().toString(36).slice(2);

      const query = new URLSearchParams();

      query.set('action', action);
      query.set('callback', callbackName);
      query.set('_', String(Date.now()));

      Object.keys(params || {}).forEach(function (key) {
        const value = params[key];

        if (
          value !== undefined &&
          value !== null &&
          value !== ''
        ) {
          query.set(
            key,
            typeof value === 'object'
              ? JSON.stringify(value)
              : String(value)
          );
        }
      });

      const script = document.createElement('script');

      const timeout = window.setTimeout(function () {
        cleanup();

        reject(
          new Error(
            'Server tidak merespons. Coba lagi.'
          )
        );
      }, 15000);

      function cleanup() {
        window.clearTimeout(timeout);

        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }

        try {
          delete window[callbackName];
        } catch (error) {
          window[callbackName] = undefined;
        }
      }

      window[callbackName] = function (payload) {
        cleanup();

        if (
          payload &&
          payload.success === true
        ) {
          resolve(payload);
          return;
        }

        reject(
          new Error(
            payload &&
            payload.message
              ? payload.message
              : 'Request gagal.'
          )
        );
      };

      script.onerror = function () {
        cleanup();

        reject(
          new Error(
            'Tidak dapat terhubung ke server.'
          )
        );
      };

      script.src =
        apiUrl +
        '?' +
        query.toString();

      document.head.appendChild(script);
    });
  }

  return {
    request: request
  };
})();
