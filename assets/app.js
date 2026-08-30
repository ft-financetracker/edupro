window.EduApp = (function () {
  'use strict';

  const SESSION_KEY =
    window.EDU_CONFIG.SESSION_KEY;

  const pages = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      permission: 'dashboard.view'
    },
    {
      id: 'institution',
      label: 'Institusi',
      icon: 'account_balance',
      permission: 'institution.view'
    },
    {
      id: 'periods',
      label: 'Periode',
      icon: 'calendar_month',
      permission: 'period.view'
    },
    {
      id: 'participants',
      label: 'Peserta',
      icon: 'groups',
      permission: 'participant.view',
      comingSoon: true
    },
    {
      id: 'billing',
      label: 'Tagihan',
      icon: 'receipt_long',
      permission: 'billing.view',
      comingSoon: true
    },
    {
      id: 'payments',
      label: 'Pembayaran',
      icon: 'payments',
      permission: 'payment.view',
      comingSoon: true
    },
    {
      id: 'receivables',
      label: 'Piutang',
      icon: 'request_quote',
      permission: 'receivable.view',
      comingSoon: true
    },
    {
      id: 'reports',
      label: 'Laporan',
      icon: 'monitoring',
      permission: 'report.view',
      comingSoon: true
    }
  ];

  let currentUser = null;
  let permissions = [];
  let activePage = 'dashboard';

  const bootScreen =
    document.getElementById('bootScreen');

  const bootMessage =
    document.getElementById('bootMessage');

  const loginPage =
    document.getElementById('loginPage');

  const appShell =
    document.getElementById('appShell');

  const desktopNav =
    document.getElementById('desktopNav');

  const mobileNav =
    document.getElementById('mobileNav');

  const pageContent =
    document.getElementById('pageContent');

  const pageTitle =
    document.getElementById('pageTitle');

  const pageEyebrow =
    document.getElementById('pageEyebrow');

  const modalBackdrop =
    document.getElementById('modalBackdrop');

  const modalCard =
    document.getElementById('modalCard');

  const toastElement =
    document.getElementById('toast');

  let toastTimer;


  document.addEventListener(
    'DOMContentLoaded',
    start
  );


  function start() {
    bindGlobalEvents();
    bindLogin();
    registerServiceWorker();

    bootMessage.textContent =
      'Menghubungkan ke server…';

    window.EduApi
      .request('health', {})
      .then(function () {
        const token = getToken();

        if (!token) {
          throw new Error('NO_SESSION');
        }

        bootMessage.textContent =
          'Memeriksa sesi pengguna…';

        return window.EduApi.request(
          'session',
          { token: token }
        );
      })
      .then(function (response) {
        setSessionData(response);
        enterApp();
      })
      .catch(function () {
        clearToken();
        showLogin();
      });
  }


  function bindLogin() {
    const form =
      document.getElementById('loginForm');

    const toggle =
      document.getElementById('togglePassword');

    form.addEventListener(
      'submit',
      function (event) {
        event.preventDefault();
        login();
      }
    );

    toggle.addEventListener(
      'click',
      function () {
        const input =
          document.getElementById('loginPassword');

        const hidden =
          input.type === 'password';

        input.type =
          hidden
            ? 'text'
            : 'password';

        toggle.querySelector(
          '.material-symbols-rounded'
        ).textContent =
          hidden
            ? 'visibility_off'
            : 'visibility';
      }
    );
  }


  function login() {
    const username =
      document
        .getElementById('loginUsername')
        .value
        .trim();

    const password =
      document
        .getElementById('loginPassword')
        .value;

    const button =
      document.getElementById('loginButton');

    const errorBox =
      document.getElementById('loginError');

    button.disabled = true;
    button.textContent = 'Memeriksa…';
    errorBox.hidden = true;

    window.EduApi
      .request(
        'login',
        {
          username: username,
          password: password
        }
      )
      .then(function (response) {
        localStorage.setItem(
          SESSION_KEY,
          response.token
        );

        setSessionData(response);
        enterApp();
      })
      .catch(function (error) {
        errorBox.textContent =
          error.message;

        errorBox.hidden = false;
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = 'Masuk';
      });
  }


  function setSessionData(response) {
    currentUser =
      response.user || null;

    permissions =
      Array.isArray(response.permissions)
        ? response.permissions
        : [];
  }


  function getToken() {
    return String(
      localStorage.getItem(
        SESSION_KEY
      ) || ''
    );
  }


  function clearToken() {
    localStorage.removeItem(
      SESSION_KEY
    );
  }


  function can(permission) {
    return (
      permissions.indexOf('*') !== -1 ||
      permissions.indexOf(permission) !== -1
    );
  }


  function showLogin() {
    bootScreen.hidden = true;
    appShell.hidden = true;
    loginPage.hidden = false;
  }


  function enterApp() {
    bootScreen.hidden = true;
    loginPage.hidden = true;
    appShell.hidden = false;

    renderUser();
    renderNavigation();
    openPage('dashboard');
  }


  function renderUser() {
    const user =
      currentUser || {};

    document
      .querySelectorAll('[data-user-name]')
      .forEach(function (element) {
        element.textContent =
          user.name || 'User';
      });

    document
      .querySelectorAll('[data-user-role]')
      .forEach(function (element) {
        element.textContent =
          user.role_name ||
          user.role_code ||
          '';
      });

    document
      .querySelectorAll('[data-user-initials]')
      .forEach(function (element) {
        element.textContent =
          initials(user.name || 'U');
      });
  }


  function renderNavigation() {
    const allowed =
      pages.filter(function (page) {
        return (
          !page.permission ||
          can(page.permission)
        );
      });

    desktopNav.innerHTML =
      allowed
        .map(navButton)
        .join('');

    mobileNav.innerHTML =
      allowed
        .filter(function (page) {
          return [
            'dashboard',
            'participants',
            'billing',
            'payments'
          ].indexOf(page.id) !== -1;
        })
        .slice(0, 4)
        .map(navButton)
        .join('');

    document
      .querySelectorAll('[data-page]')
      .forEach(function (button) {
        button.addEventListener(
          'click',
          function () {
            openPage(
              button.dataset.page
            );
          }
        );
      });
  }


  function navButton(page) {
    return `
      <button
        class="nav-button"
        type="button"
        data-page="${escapeHtml(page.id)}"
      >
        <span class="material-symbols-rounded">
          ${escapeHtml(page.icon)}
        </span>

        <span>
          ${escapeHtml(page.label)}
        </span>
      </button>
    `;
  }


  function openPage(pageId) {
    const page =
      pages.find(function (item) {
        return item.id === pageId;
      });

    if (!page) return;

    activePage = pageId;

    document
      .querySelectorAll('[data-page]')
      .forEach(function (button) {
        button.classList.toggle(
          'is-active',
          button.dataset.page === pageId
        );
      });

    pageEyebrow.textContent =
      page.label.toUpperCase();

    pageTitle.textContent =
      page.label;

    if (page.comingSoon) {
      renderComingSoon(page);
      return;
    }

    if (pageId === 'dashboard') {
      loadDashboard();
      return;
    }

    if (pageId === 'institution') {
      loadInstitution();
      return;
    }

    if (pageId === 'periods') {
      loadPeriods();
    }
  }


  function loadDashboard() {
    pageContent.innerHTML =
      loadingCard('Memuat dashboard…');

    window.EduApi
      .request(
        'dashboard',
        {
          token: getToken()
        }
      )
      .then(function (response) {
        renderDashboard(
          response.data
        );
      })
      .catch(renderPageError);
  }


  function renderDashboard(data) {
    const metrics =
      data.metrics || {};

    const ready =
      data.readiness || {};

    pageContent.innerHTML = `
      <section class="hero-panel">

        <p class="eyebrow">
          FOUNDATION V0.1.0
        </p>

        <h2>
          ${
            data.institution
              ? escapeHtml(
                  data.institution.institution_name
                )
              : 'Siapkan institusi pertama'
          }
        </h2>

        <p>
          ${
            data.active_period
              ? 'Periode aktif: ' +
                escapeHtml(
                  data.active_period.period_name
                )
              : 'Lengkapi Profil Institusi dan Periode Akademik untuk memulai Core Payment.'
          }
        </p>

      </section>


      <section class="metric-grid">

        ${metricCard(
          'Peserta Aktif',
          numberFormat(
            metrics.participants || 0
          )
        )}

        ${metricCard(
          'Tagihan',
          numberFormat(
            metrics.bills || 0
          )
        )}

        ${metricCard(
          'Piutang',
          rupiah(
            metrics.outstanding || 0
          )
        )}

        ${metricCard(
          'Pembayaran',
          rupiah(
            metrics.payments || 0
          )
        )}

      </section>


      <section class="content-grid">

        <article class="content-card">

          <div class="card-head">
            <div>
              <h3>Kesiapan Core Payment</h3>
              <p>
                Foundation yang harus selesai sebelum Billing Engine.
              </p>
            </div>
          </div>

          <div class="readiness-list">

            ${readinessItem(
              'Profil Institusi',
              ready.institution
            )}

            ${readinessItem(
              'Periode Akademik Aktif',
              ready.academic_period
            )}

            ${readinessItem(
              'Data Peserta',
              ready.participants
            )}

            ${readinessItem(
              'Billing Engine',
              ready.billing
            )}

          </div>

        </article>


        <article class="content-card">

          <div class="card-head">
            <div>
              <h3>Fase Aktif</h3>
              <p>System Concept Lock</p>
            </div>
          </div>

          <div class="empty-state">
            <strong>FASE 1 — CORE PAYMENT</strong>
            <br><br>
            Login, institusi, periode, peserta, wali,
            tarif, tagihan, pembayaran, kas, laporan, audit.
          </div>

        </article>

      </section>
    `;
  }


  function metricCard(label, value) {
    return `
      <article class="metric-card">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </article>
    `;
  }


  function readinessItem(label, ready) {
    return `
      <div class="readiness-item">
        <span>${escapeHtml(label)}</span>

        <span
          class="state-badge ${
            ready
              ? 'is-ready'
              : 'is-pending'
          }"
        >
          ${
            ready
              ? 'SIAP'
              : 'BELUM'
          }
        </span>
      </div>
    `;
  }


  function loadInstitution() {
    pageContent.innerHTML =
      loadingCard('Memuat profil institusi…');

    window.EduApi
      .request(
        'institution.get',
        {
          token: getToken()
        }
      )
      .then(function (response) {
        renderInstitution(
          response.data || {}
        );
      })
      .catch(renderPageError);
  }


  function renderInstitution(data) {
    pageContent.innerHTML = `
      <article class="content-card">

        <div class="card-head">
          <div>
            <h3>Profil Institusi</h3>
            <p>
              Identitas utama yang digunakan seluruh modul.
            </p>
          </div>
        </div>

        <form
          id="institutionForm"
          class="form-grid"
        >

          ${inputField(
            'Nama Institusi',
            'institution_name',
            data.institution_name || '',
            true
          )}

          ${institutionTypeField(
            data.institution_type || ''
          )}

          ${inputField(
            'Nama Legal',
            'legal_name',
            data.legal_name || ''
          )}

          ${inputField(
            'Nama Singkat',
            'short_name',
            data.short_name || ''
          )}

          <label class="field is-full">
            <span>Alamat</span>

            <textarea
              class="textarea-input"
              name="address"
            >${escapeHtml(data.address || '')}</textarea>
          </label>

          ${inputField(
            'Kota',
            'city',
            data.city || ''
          )}

          ${inputField(
            'Provinsi',
            'province',
            data.province || ''
          )}

          ${inputField(
            'Telepon',
            'phone',
            data.phone || ''
          )}

          ${inputField(
            'Email',
            'email',
            data.email || '',
            false,
            'email'
          )}

          ${inputField(
            'Website',
            'website',
            data.website || ''
          )}

        </form>

        <div class="page-actions">

          <button
            id="saveInstitutionButton"
            class="primary-button"
            type="button"
          >
            Simpan Profil
          </button>

        </div>

      </article>
    `;

    document
      .getElementById('saveInstitutionButton')
      .addEventListener(
        'click',
        saveInstitution
      );
  }


  function saveInstitution() {
    const form =
      document.getElementById('institutionForm');

    const payload =
      Object.fromEntries(
        new FormData(form).entries()
      );

    toast('Menyimpan profil…');

    window.EduApi
      .request(
        'institution.save',
        {
          token: getToken(),
          payload: payload
        }
      )
      .then(function () {
        toast(
          'Profil institusi berhasil disimpan.'
        );

        loadInstitution();
      })
      .catch(function (error) {
        toast(error.message);
      });
  }


  function inputField(
    label,
    name,
    value,
    required,
    type
  ) {
    return `
      <label class="field">
        <span>${escapeHtml(label)}</span>

        <input
          class="text-input"
          type="${type || 'text'}"
          name="${escapeHtml(name)}"
          value="${escapeHtml(value)}"
          ${required ? 'required' : ''}
        >
      </label>
    `;
  }


  function institutionTypeField(value) {
    const options = [
      '',
      'TK / PAUD',
      'SD / MI',
      'SMP / MTs',
      'SMA / SMK / MA',
      'Pesantren',
      'Lembaga Kursus',
      'Perguruan Tinggi',
      'Multi Unit'
    ];

    return `
      <label class="field">
        <span>Jenis Institusi</span>

        <select
          class="select-input"
          name="institution_type"
        >
          ${options.map(function (item) {
            return `
              <option
                value="${escapeHtml(item)}"
                ${item === value ? 'selected' : ''}
              >
                ${escapeHtml(item || 'Pilih jenis')}
              </option>
            `;
          }).join('')}
        </select>
      </label>
    `;
  }


  function loadPeriods() {
    pageContent.innerHTML =
      loadingCard('Memuat periode akademik…');

    window.EduApi
      .request(
        'period.list',
        {
          token: getToken()
        }
      )
      .then(function (response) {
        renderPeriods(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      })
      .catch(renderPageError);
  }


  function renderPeriods(rows) {
    pageContent.innerHTML = `
      <article class="content-card">

        <div class="card-head">

          <div>
            <h3>Periode Akademik</h3>
            <p>
              Tahun ajaran atau tahun akademik aktif.
            </p>
          </div>

          <button
            id="newPeriodButton"
            class="primary-button"
            type="button"
          >
            Tambah Periode
          </button>

        </div>

        ${
          rows.length
            ? periodTable(rows)
            : `
              <div class="empty-state">
                Belum ada periode akademik.
              </div>
            `
        }

      </article>
    `;

    document
      .getElementById('newPeriodButton')
      .addEventListener(
        'click',
        function () {
          openPeriodForm(null);
        }
      );

    document
      .querySelectorAll('[data-edit-period]')
      .forEach(function (button) {
        button.addEventListener(
          'click',
          function () {
            const row =
              rows.find(function (item) {
                return (
                  item.period_id ===
                  button.dataset.editPeriod
                );
              });

            openPeriodForm(row || null);
          }
        );
      });
  }


  function periodTable(rows) {
    return `
      <div class="table-wrap">

        <table class="data-table">

          <thead>
            <tr>
              <th>Kode</th>
              <th>Periode</th>
              <th>Mulai</th>
              <th>Selesai</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            ${rows.map(function (row) {
              return `
                <tr>
                  <td>${escapeHtml(row.period_code)}</td>
                  <td>${escapeHtml(row.period_name)}</td>
                  <td>${dateText(row.start_date)}</td>
                  <td>${dateText(row.end_date)}</td>
                  <td>
                    ${
                      String(row.is_active).toLowerCase() === 'true'
                        ? '<span class="state-badge is-ready">AKTIF</span>'
                        : '<span class="state-badge is-pending">NONAKTIF</span>'
                    }
                  </td>
                  <td>
                    <button
                      class="secondary-button"
                      type="button"
                      data-edit-period="${escapeHtml(row.period_id)}"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>

        </table>

      </div>
    `;
  }


  function openPeriodForm(row) {
    modal(`
      <h3>
        ${row ? 'Edit Periode Akademik' : 'Tambah Periode Akademik'}
      </h3>

      <p>
        Hanya satu periode dapat ditandai aktif.
      </p>

      <form id="periodForm" class="form-grid">

        <input
          type="hidden"
          name="period_id"
          value="${escapeHtml(row?.period_id || '')}"
        >

        ${inputField(
          'Kode Periode',
          'period_code',
          row?.period_code || '',
          true
        )}

        ${inputField(
          'Nama Periode',
          'period_name',
          row?.period_name || '',
          true
        )}

        ${inputField(
          'Tanggal Mulai',
          'start_date',
          dateInput(row?.start_date),
          false,
          'date'
        )}

        ${inputField(
          'Tanggal Selesai',
          'end_date',
          dateInput(row?.end_date),
          false,
          'date'
        )}

        <label class="field is-full">
          <span>
            <input
              type="checkbox"
              name="is_active"
              value="true"
              ${
                String(row?.is_active).toLowerCase() === 'true'
                  ? 'checked'
                  : ''
              }
            >
            Jadikan periode aktif
          </span>
        </label>

      </form>

      <div class="modal-actions">

        <button
          class="secondary-button"
          type="button"
          data-modal-close
        >
          Batal
        </button>

        <button
          id="savePeriodButton"
          class="primary-button"
          type="button"
        >
          Simpan
        </button>

      </div>
    `);

    document
      .getElementById('savePeriodButton')
      .addEventListener(
        'click',
        savePeriod
      );
  }


  function savePeriod() {
    const form =
      document.getElementById('periodForm');

    const payload =
      Object.fromEntries(
        new FormData(form).entries()
      );

    payload.is_active =
      form.querySelector(
        '[name="is_active"]'
      ).checked;

    toast('Menyimpan periode…');

    window.EduApi
      .request(
        'period.save',
        {
          token: getToken(),
          payload: payload
        }
      )
      .then(function () {
        closeModal();

        toast(
          'Periode akademik berhasil disimpan.'
        );

        loadPeriods();
      })
      .catch(function (error) {
        toast(error.message);
      });
  }


  function renderComingSoon(page) {
    pageContent.innerHTML = `
      <article class="content-card">
        <div class="empty-state">

          <span
            class="material-symbols-rounded"
            style="
              font-size:34px;
              color:var(--primary);
            "
          >
            construction
          </span>

          <p>
            Modul <strong>${escapeHtml(page.label)}</strong>
            masuk pembangunan berikutnya pada Fase 1 Core Payment.
          </p>

        </div>
      </article>
    `;
  }


  function loadingCard(message) {
    return `
      <article class="content-card">
        <div class="empty-state">
          ${escapeHtml(message)}
        </div>
      </article>
    `;
  }


  function renderPageError(error) {
    pageContent.innerHTML = `
      <article class="content-card">
        <div class="empty-state">
          <strong>Gagal memuat data</strong>
          <br><br>
          ${escapeHtml(
            error && error.message
              ? error.message
              : String(error || '')
          )}
        </div>
      </article>
    `;
  }


  function bindGlobalEvents() {
    document
      .getElementById('refreshButton')
      .addEventListener(
        'click',
        function () {
          toast('Memperbarui data…');
          openPage(activePage);
        }
      );

    document.addEventListener(
      'click',
      function (event) {
        const logoutButton =
          event.target.closest(
            '[data-action="logout"]'
          );

        if (logoutButton) {
          confirmLogout();
          return;
        }

        const closeButton =
          event.target.closest(
            '[data-modal-close]'
          );

        if (closeButton) {
          closeModal();
        }
      }
    );
  }


  function confirmLogout() {
    modal(`
      <h3>Keluar dari aplikasi?</h3>

      <p>
        Session pada perangkat ini akan diakhiri.
      </p>

      <div class="modal-actions">

        <button
          class="secondary-button"
          type="button"
          data-modal-close
        >
          Batal
        </button>

        <button
          id="confirmLogoutButton"
          class="primary-button"
          type="button"
        >
          Ya, Keluar
        </button>

      </div>
    `);

    document
      .getElementById('confirmLogoutButton')
      .addEventListener(
        'click',
        function () {
          const token = getToken();

          clearToken();
          closeModal();

          window.EduApi
            .request(
              'logout',
              { token: token }
            )
            .catch(function () {
              return null;
            })
            .finally(function () {
              currentUser = null;
              permissions = [];
              showLogin();
            });
        }
      );
  }


  function modal(html) {
    modalCard.innerHTML = html;
    modalBackdrop.hidden = false;
  }


  function closeModal() {
    modalBackdrop.hidden = true;
    modalCard.innerHTML = '';
  }


  function toast(message) {
    window.clearTimeout(toastTimer);

    toastElement.textContent =
      message;

    toastElement.hidden = false;

    toastTimer =
      window.setTimeout(
        function () {
          toastElement.hidden = true;
        },
        3200
      );
  }


  function initials(name) {
    return String(name || 'U')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (part) {
        return part[0];
      })
      .join('')
      .toUpperCase();
  }


  function dateInput(value) {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date
      .toISOString()
      .slice(0, 10);
  }


  function dateText(value) {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return escapeHtml(value);
    }

    return new Intl.DateTimeFormat(
      'id-ID',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(date);
  }


  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener(
      'load',
      function () {
        navigator.serviceWorker
          .register('./service-worker.js')
          .catch(function (error) {
            console.warn(
              'Service Worker:',
              error
            );
          });
      }
    );
  }


  return {
    openPage: openPage,
    toast: toast,
    modal: modal,
    closeModal: closeModal
  };
})();


window.escapeHtml = function (value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};


window.numberFormat = function (value) {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(
    Number(value || 0)
  );
};


window.rupiah = function (value) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }
  ).format(
    Number(value || 0)
  );
};
