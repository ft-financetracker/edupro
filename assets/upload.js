/**
 * ============================================================
 * EDUCATION FINANCE
 * FILE UPLOAD BRIDGE v0.3.4 — IDEMPOTENT BACKGROUND
 * ============================================================
 *
 * GitHub Pages
 * → hidden form POST
 * → Apps Script
 * → postMessage
 */

window.EduUpload = (function () {
  'use strict';

  const TIMEOUT_MS =
    120000;


  function randomId() {
    return (
      'UP-' +
      Date.now() +
      '-' +
      Math.random()
        .toString(36)
        .slice(2, 9)
    );
  }


  function fileToBase64(
    file
  ) {
    return new Promise(
      function (resolve, reject) {
        const reader =
          new FileReader();

        reader.onload =
          function () {
            const text =
              String(
                reader.result ||
                ''
              );

            const comma =
              text.indexOf(
                ','
              );

            resolve(
              comma >=
              0
                ? text.slice(
                    comma +
                    1
                  )
                : text
            );
          };

        reader.onerror =
          function () {
            reject(
              reader.error ||
              new Error(
                'File tidak dapat dibaca.'
              )
            );
          };

        reader.readAsDataURL(
          file
        );
      }
    );
  }


  function addField(
    form,
    name,
    value
  ) {
    const input =
      document.createElement(
        'textarea'
      );

    input.name =
      name;

    input.value =
      String(
        value ??
        ''
      );

    input.hidden =
      true;

    form.appendChild(
      input
    );
  }


  function send(
    action,
    fields,
    file
  ) {
    if (
      !navigator.onLine
    ) {
      return Promise.reject(
        new Error(
          'Perangkat sedang offline.'
        )
      );
    }

    return fileToBase64(
      file
    )
      .then(
        function (base64) {
          return new Promise(
            function (resolve, reject) {
              const requestId =
                randomId();

              const frameName =
                'edu_upload_frame_' +
                requestId;

              const iframe =
                document.createElement(
                  'iframe'
                );

              iframe.name =
                frameName;

              iframe.hidden =
                true;

              const form =
                document.createElement(
                  'form'
                );

              form.method =
                'POST';

              form.action =
                window.EDU_CONFIG.API_URL;

              form.target =
                frameName;

              form.hidden =
                true;

              addField(
                form,
                'action',
                action
              );

              addField(
                form,
                'request_id',
                requestId
              );

              addField(
                form,
                'origin',
                window.location.origin
              );

              Object
                .keys(
                  fields ||
                  {}
                )
                .forEach(
                  function (key) {
                    addField(
                      form,
                      key,
                      fields[key]
                    );
                  }
                );

              addField(
                form,
                'file_name',
                file.name
              );

              addField(
                form,
                'mime_type',
                file.type ||
                'application/octet-stream'
              );

              addField(
                form,
                'file_base64',
                base64
              );

              let settled =
                false;

              const timeout =
                window.setTimeout(
                  function () {
                    cleanup();

                    reject(
                      new Error(
                        'Upload terlalu lama. Coba kembali.'
                      )
                    );
                  },
                  TIMEOUT_MS
                );

              function cleanup() {
                if (
                  settled
                ) {
                  return;
                }

                settled =
                  true;

                window.clearTimeout(
                  timeout
                );

                window.removeEventListener(
                  'message',
                  onMessage
                );

                form.remove();
                iframe.remove();
              }


              function onMessage(
                event
              ) {
                if (
                  !event.data ||
                  event.data.source !==
                    'EDU_UPLOAD'
                ) {
                  return;
                }

                const payload =
                  event.data.payload;

                if (
                  !payload ||
                  payload.request_id !==
                    requestId
                ) {
                  return;
                }

                cleanup();

                if (
                  payload.success
                ) {
                  resolve(
                    payload.data
                  );

                  return;
                }

                reject(
                  new Error(
                    payload.message ||
                    'Upload gagal.'
                  )
                );
              }


              window.addEventListener(
                'message',
                onMessage
              );

              document.body.appendChild(
                iframe
              );

              document.body.appendChild(
                form
              );

              form.submit();
            }
          );
        }
      );
  }


  return {
    send:
      send
  };
})();
