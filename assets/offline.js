/**
 * ============================================================
 * EDUCATION FINANCE
 * OFFLINE DRAFT STORE v0.3.0
 * ============================================================
 *
 * IndexedDB:
 * - application draft
 * - file Blob
 *
 * Dipakai agar form dapat disimpan ketika jaringan terputus.
 */

window.EduOffline = (function () {
  'use strict';

  const DB_NAME =
    'edu-finance-offline-v030';

  const DB_VERSION =
    1;

  const DRAFT_STORE =
    'drafts';

  const FILE_STORE =
    'files';


  function openDb() {
    return new Promise(
      function (resolve, reject) {
        const request =
          indexedDB.open(
            DB_NAME,
            DB_VERSION
          );

        request.onupgradeneeded =
          function () {
            const db =
              request.result;

            if (
              !db.objectStoreNames.contains(
                DRAFT_STORE
              )
            ) {
              db.createObjectStore(
                DRAFT_STORE,
                {
                  keyPath:
                    'id'
                }
              );
            }

            if (
              !db.objectStoreNames.contains(
                FILE_STORE
              )
            ) {
              const store =
                db.createObjectStore(
                  FILE_STORE,
                  {
                    keyPath:
                      'id'
                  }
                );

              store.createIndex(
                'draft_id',
                'draft_id',
                {
                  unique:
                    false
                }
              );
            }
          };

        request.onsuccess =
          function () {
            resolve(
              request.result
            );
          };

        request.onerror =
          function () {
            reject(
              request.error
            );
          };
      }
    );
  }


  function withStore(
    storeName,
    mode,
    handler
  ) {
    return openDb()
      .then(
        function (db) {
          return new Promise(
            function (resolve, reject) {
              const transaction =
                db.transaction(
                  storeName,
                  mode
                );

              const store =
                transaction.objectStore(
                  storeName
                );

              let result;

              try {
                result =
                  handler(
                    store
                  );

              } catch (
                error
              ) {
                reject(
                  error
                );

                return;
              }

              transaction.oncomplete =
                function () {
                  resolve(
                    result
                  );

                  db.close();
                };

              transaction.onerror =
                function () {
                  reject(
                    transaction.error
                  );

                  db.close();
                };
            }
          );
        }
      );
  }


  function requestResult(
    request
  ) {
    return new Promise(
      function (resolve, reject) {
        request.onsuccess =
          function () {
            resolve(
              request.result
            );
          };

        request.onerror =
          function () {
            reject(
              request.error
            );
          };
      }
    );
  }


  function saveDraft(
    id,
    data
  ) {
    return openDb()
      .then(
        function (db) {
          return new Promise(
            function (resolve, reject) {
              const tx =
                db.transaction(
                  DRAFT_STORE,
                  'readwrite'
                );

              tx.objectStore(
                DRAFT_STORE
              ).put(
                {
                  id:
                    id,

                  data:
                    data,

                  updated_at:
                    Date.now()
                }
              );

              tx.oncomplete =
                function () {
                  db.close();
                  resolve();
                };

              tx.onerror =
                function () {
                  const error =
                    tx.error;

                  db.close();
                  reject(
                    error
                  );
                };
            }
          );
        }
      );
  }


  function getDraft(
    id
  ) {
    return openDb()
      .then(
        function (db) {
          return requestResult(
            db
              .transaction(
                DRAFT_STORE,
                'readonly'
              )
              .objectStore(
                DRAFT_STORE
              )
              .get(
                id
              )
          )
            .then(
              function (row) {
                db.close();

                return row
                  ? row.data
                  : null;
              }
            );
        }
      );
  }


  function listDrafts() {
    return openDb()
      .then(
        function (db) {
          return requestResult(
            db
              .transaction(
                DRAFT_STORE,
                'readonly'
              )
              .objectStore(
                DRAFT_STORE
              )
              .getAll()
          )
            .then(
              function (rows) {
                db.close();

                return (
                  rows ||
                  []
                )
                  .sort(
                    function (a, b) {
                      return (
                        Number(
                          b.updated_at ||
                          0
                        ) -
                        Number(
                          a.updated_at ||
                          0
                        )
                      );
                    }
                  );
              }
            );
        }
      );
  }


  function deleteDraft(
    id
  ) {
    return openDb()
      .then(
        function (db) {
          return new Promise(
            function (resolve, reject) {
              const tx =
                db.transaction(
                  [
                    DRAFT_STORE,
                    FILE_STORE
                  ],
                  'readwrite'
                );

              tx
                .objectStore(
                  DRAFT_STORE
                )
                .delete(
                  id
                );

              const fileStore =
                tx.objectStore(
                  FILE_STORE
                );

              const index =
                fileStore.index(
                  'draft_id'
                );

              const request =
                index.openCursor(
                  IDBKeyRange.only(
                    id
                  )
                );

              request.onsuccess =
                function () {
                  const cursor =
                    request.result;

                  if (
                    cursor
                  ) {
                    cursor.delete();
                    cursor.continue();
                  }
                };

              tx.oncomplete =
                function () {
                  db.close();
                  resolve();
                };

              tx.onerror =
                function () {
                  const error =
                    tx.error;

                  db.close();
                  reject(
                    error
                  );
                };
            }
          );
        }
      );
  }


  function saveFile(
    draftId,
    documentType,
    file
  ) {
    const id =
      draftId +
      '|' +
      documentType;

    return openDb()
      .then(
        function (db) {
          return new Promise(
            function (resolve, reject) {
              const tx =
                db.transaction(
                  FILE_STORE,
                  'readwrite'
                );

              tx
                .objectStore(
                  FILE_STORE
                )
                .put(
                  {
                    id:
                      id,

                    draft_id:
                      draftId,

                    document_type:
                      documentType,

                    file_name:
                      file.name,

                    mime_type:
                      file.type,

                    file_size:
                      file.size,

                    blob:
                      file,

                    updated_at:
                      Date.now()
                  }
                );

              tx.oncomplete =
                function () {
                  db.close();
                  resolve();
                };

              tx.onerror =
                function () {
                  const error =
                    tx.error;

                  db.close();
                  reject(
                    error
                  );
                };
            }
          );
        }
      );
  }


  function getFiles(
    draftId
  ) {
    return openDb()
      .then(
        function (db) {
          return requestResult(
            db
              .transaction(
                FILE_STORE,
                'readonly'
              )
              .objectStore(
                FILE_STORE
              )
              .index(
                'draft_id'
              )
              .getAll(
                IDBKeyRange.only(
                  draftId
                )
              )
          )
            .then(
              function (rows) {
                db.close();

                return rows ||
                  [];
              }
            );
        }
      );
  }


  return {
    saveDraft:
      saveDraft,

    getDraft:
      getDraft,

    listDrafts:
      listDrafts,

    deleteDraft:
      deleteDraft,

    saveFile:
      saveFile,

    getFiles:
      getFiles,

    isOnline:
      function () {
        return navigator.onLine;
      }
  };
})();
