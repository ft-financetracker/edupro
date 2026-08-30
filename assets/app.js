/**
 * ============================================================
 * EDUCATION FINANCE & MANAGEMENT PLATFORM
 * FRONTEND APP v0.1.1
 * ============================================================
 *
 * PATCH:
 * - Mobile navigation access to Institution / Period
 * - Center CTA / Quick Actions
 * - More menu
 * - Stronger loading feedback
 * - Premium dashboard hero
 * - Admin/Staff workspace identity
 */

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
  let activeRequestCount = 0;
  let toastTimer = null;

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

  const refreshButton =
    document.getElementById('refreshButton');

  const modalBackdrop =
    document.getElementById('modalBackdrop');

  const modalCard =
    document.getElementById('modalCard');

  const toastElement =
    document.getElementById('toast');


  document.addEventListener(
    'DOMContentLoaded',
    start
  );


  function start() {
    createGlobalProgress();
    bindGlobalEvents();
    bindLogin();
    registerServiceWorker();

    bootMessage.textContent =
      'Menghubungkan ke server…';

    window.EduApi
      .request(
        'health',
        {}
      )
      .then(function () {
        const token =
          getToken();

        if (!token) {
          throw new Error(
            'NO_SESSION'
          );
        }

        bootMessage.textContent =
          'Memeriksa sesi pengguna…';

        return window.EduApi.request(
          'session',
          {
            token: token
          }
        );
      })
      .then(function (response) {
        bootMessage.textContent =
          'Menyiapkan workspace…';

        setSessionData(
          response
        );

        enterApp();
      })
      .catch(function () {
        clearToken();
        showLogin();
      });
  }


  /* =========================================================
   * AUTH
   * ========================================================= */

  function bindLogin() {
    const form =
      document.getElementById(
        'loginForm'
      );

    const toggle =
      document.getElementById(
        'togglePassword'
      );

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
          document.getElementById(
            'loginPassword'
          );

        const hidden =
          input.type ===
          'password';

        input.type =
          hidden
            ? 'text'
            : 'password';

        toggle
          .querySelector(
            '.material-symbols-rounded'
          )
          .textContent =
            hidden
              ? 'visibility_off'
              : 'visibility';
      }
    );
  }


  function login() {
    const username =
      document
        .getElementById(
          'loginUsername'
        )
        .value
        .trim();

    const password =
      document
        .getElementById(
          'loginPassword'
        )
        .value;

    const button =
      document.getElementById(
        'loginButton'
      );

    const errorBox =
      document.getElementById(
        'loginError'
      );

    button.disabled =
      true;

    button.innerHTML = `
      <span class="button-spinner"></span>
      Memeriksa akun…
    `;

    errorBox.hidden =
      true;

    startLoading(
      'Memverifikasi akun…'
    );

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

        setSessionData(
          response
        );

        enterApp();
      })
      .catch(function (error) {
        errorBox.textContent =
          error.message;

        errorBox.hidden =
          false;
      })
      .finally(function () {
        button.disabled =
          false;

        button.textContent =
          'Masuk';

        stopLoading();
      });
  }


  function setSessionData(
    response
  ) {
    currentUser =
      response.user ||
      null;

    permissions =
      Array.isArray(
        response.permissions
      )
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


  function can(
    permission
  ) {
    return (
      permissions.indexOf(
        '*'
      ) !== -1 ||
      permissions.indexOf(
        permission
      ) !== -1
    );
  }


  function showLogin() {
    bootScreen.hidden =
      true;

    appShell.hidden =
      true;

    loginPage.hidden =
      false;
  }


  function enterApp() {
    bootScreen.hidden =
      true;

    loginPage.hidden =
      true;

    appShell.hidden =
      false;

    renderUser();
    renderNavigation();

    openPage(
      'dashboard'
    );
  }


  function renderUser() {
    const user =
      currentUser ||
      {};

    document
      .querySelectorAll(
        '[data-user-name]'
      )
      .forEach(function (element) {
        element.textContent =
          user.name ||
          'User';
      });

    document
      .querySelectorAll(
        '[data-user-role]'
      )
      .forEach(function (element) {
        element.textContent =
          user.role_name ||
          user.role_code ||
          '';
      });

    document
      .querySelectorAll(
        '[data-user-initials]'
      )
      .forEach(function (element) {
        element.textContent =
          initials(
            user.name ||
            'U'
          );
      });
  }


  /* =========================================================
   * NAVIGATION
   * ========================================================= */

  function renderNavigation() {
    const allowed =
      pages.filter(
        function (page) {
          return (
            !page.permission ||
            can(
              page.permission
            )
          );
        }
      );

    desktopNav.innerHTML =
      allowed
        .map(
          navButton
        )
        .join('');

    /*
     * Mobile structure:
     * Dashboard | Peserta | CTA | Tagihan | Menu
     *
     * Institusi dan Periode tetap dapat dibuka melalui Menu
     * dan Quick Action CTA.
     */
    const dashboardPage =
      allowed.find(
        function (page) {
          return (
            page.id ===
            'dashboard'
          );
        }
      );

    const participantPage =
      allowed.find(
        function (page) {
          return (
            page.id ===
            'participants'
          );
        }
      );

    const billingPage =
      allowed.find(
        function (page) {
          return (
            page.id ===
            'billing'
          );
        }
      );

    const mobileItems = [];

    if (
      dashboardPage
    ) {
      mobileItems.push(
        navButton(
          dashboardPage
        )
      );
    }

    if (
      participantPage
    ) {
      mobileItems.push(
        navButton(
          participantPage
        )
      );
    }

    mobileItems.push(
      mobileCtaButton()
    );

    if (
      billingPage
    ) {
      mobileItems.push(
        navButton(
          billingPage
        )
      );
    }

    mobileItems.push(
      mobileMoreButton()
    );

    mobileNav.innerHTML =
      mobileItems.join('');

    bindNavigationButtons();
  }


  function navButton(
    page
  ) {
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


  function mobileCtaButton() {
    return `
      <button
        class="mobile-cta"
        type="button"
        data-mobile-cta
        aria-label="Aksi cepat"
      >
        <span class="mobile-cta__icon">
          <span class="material-symbols-rounded">
            add
          </span>
        </span>

        <span class="mobile-cta__label">
          Aksi
        </span>
      </button>
    `;
  }


  function mobileMoreButton() {
    return `
      <button
        class="nav-button"
        type="button"
        data-mobile-menu
      >
        <span class="material-symbols-rounded">
          grid_view
        </span>

        <span>
          Menu
        </span>
      </button>
    `;
  }


  function bindNavigationButtons() {
    document
      .querySelectorAll(
        '[data-page]'
      )
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

    document
      .querySelectorAll(
        '[data-mobile-cta]'
      )
      .forEach(function (button) {
        button.addEventListener(
          'click',
          openQuickActions
        );
      });

    document
      .querySelectorAll(
        '[data-mobile-menu]'
      )
      .forEach(function (button) {
        button.addEventListener(
          'click',
          openMoreMenu
        );
      });
  }


  function openQuickActions() {
    const actions = [];

    if (
      can(
        'institution.view'
      )
    ) {
      actions.push({
        page: 'institution',
        icon: 'account_balance',
        title: 'Profil Institusi',
        subtitle:
          'Lengkapi identitas lembaga.'
      });
    }

    if (
      can(
        'period.view'
      )
    ) {
      actions.push({
        page: 'periods',
        icon: 'calendar_month',
        title: 'Periode Akademik',
        subtitle:
          'Atur tahun ajaran aktif.'
      });
    }

    modal(
      `
        <div class="sheet-handle"></div>

        <div class="sheet-head">
          <p class="eyebrow">
            QUICK ACTION
          </p>

          <h3>
            Mau mengerjakan apa?
          </h3>

          <p>
            Aksi utama akan bertambah mengikuti modul yang aktif.
          </p>
        </div>

        <div class="quick-action-list">
          ${actions
            .map(
              function (action) {
                return `
                  <button
                    class="quick-action-card"
                    type="button"
                    data-quick-page="${escapeHtml(action.page)}"
                  >
                    <span class="quick-action-card__icon">
                      <span class="material-symbols-rounded">
                        ${escapeHtml(action.icon)}
                      </span>
                    </span>

                    <span class="quick-action-card__text">
                      <strong>
                        ${escapeHtml(action.title)}
                      </strong>

                      <small>
                        ${escapeHtml(action.subtitle)}
                      </small>
                    </span>

                    <span class="material-symbols-rounded">
                      chevron_right
                    </span>
                  </button>
                `;
              }
            )
            .join('')}
        </div>
      `,
      'sheet'
    );

    document
      .querySelectorAll(
        '[data-quick-page]'
      )
      .forEach(function (button) {
        button.addEventListener(
          'click',
          function () {
            const page =
              button.dataset.quickPage;

            closeModal();
            openPage(
              page
            );
          }
        );
      });
  }


  function openMoreMenu() {
    const allowed =
      pages.filter(
        function (page) {
          return (
            !page.permission ||
            can(
              page.permission
            )
          );
        }
      );

    modal(
      `
        <div class="sheet-handle"></div>

        <div class="sheet-head">
          <p class="eyebrow">
            MENU
          </p>

          <h3>
            Semua Modul
          </h3>

          <p>
            Workspace administrasi dan keuangan institusi.
          </p>
        </div>

        <div class="more-menu-grid">
          ${allowed
            .map(
              function (page) {
                return `
                  <button
                    class="more-menu-card"
                    type="button"
                    data-more-page="${escapeHtml(page.id)}"
                  >
                    <span class="material-symbols-rounded">
                      ${escapeHtml(page.icon)}
                    </span>

                    <strong>
                      ${escapeHtml(page.label)}
                    </strong>
                  </button>
                `;
              }
            )
            .join('')}
        </div>

        <button
          class="sheet-logout-button"
          type="button"
          data-sheet-logout
        >
          <span class="material-symbols-rounded">
            logout
          </span>

          Keluar dari aplikasi
        </button>
      `,
      'sheet'
    );

    document
      .querySelectorAll(
        '[data-more-page]'
      )
      .forEach(function (button) {
        button.addEventListener(
          'click',
          function () {
            const page =
              button.dataset.morePage;

            closeModal();
            openPage(
              page
            );
          }
        );
      });

    const logoutButton =
      document.querySelector(
        '[data-sheet-logout]'
      );

    if (
      logoutButton
    ) {
      logoutButton.addEventListener(
        'click',
        function () {
          closeModal();
          confirmLogout();
        }
      );
    }
  }


  function openPage(
    pageId
  ) {
    const page =
      pages.find(
        function (item) {
          return (
            item.id ===
            pageId
          );
        }
      );

    if (
      !page
    ) {
      return;
    }

    activePage =
      pageId;

    document
      .querySelectorAll(
        '[data-page]'
      )
      .forEach(function (button) {
        button.classList.toggle(
          'is-active',
          button.dataset.page ===
            pageId
        );
      });

    pageEyebrow.textContent =
      page.label.toUpperCase();

    pageTitle.textContent =
      page.label;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    if (
      page.comingSoon
    ) {
      renderComingSoon(
        page
      );

      return;
    }

    if (
      pageId ===
      'dashboard'
    ) {
      loadDashboard();
      return;
    }

    if (
      pageId ===
      'institution'
    ) {
      loadInstitution();
      return;
    }

    if (
      pageId ===
      'periods'
    ) {
      loadPeriods();
    }
  }


  /* =========================================================
   * DASHBOARD
   * ========================================================= */

  function loadDashboard() {
    showPageLoading(
      'Menyiapkan dashboard…'
    );

    startLoading(
      'Memuat dashboard…'
    );

    window.EduApi
      .request(
        'dashboard',
        {
          token:
            getToken()
        }
      )
      .then(function (response) {
        renderDashboard(
          response.data
        );
      })
      .catch(
        renderPageError
      )
      .finally(
        stopLoading
      );
  }


  function renderDashboard(
    data
  ) {
    const metrics =
      data.metrics ||
      {};

    const ready =
      data.readiness ||
      {};

    const institutionReady =
      Boolean(
        ready.institution
      );

    const periodReady =
      Boolean(
        ready.academic_period
      );

    const heroAction =
      getDashboardHeroAction(
        institutionReady,
        periodReady
      );

    pageContent.innerHTML = `
      <section class="hero-panel hero-panel--premium">

        <div class="hero-decoration hero-decoration--one"></div>
        <div class="hero-decoration hero-decoration--two"></div>

        <div class="hero-content">

          <div class="hero-topline">

            <span class="hero-icon">
              <span class="material-symbols-rounded">
                account_balance
              </span>
            </span>

            <span class="hero-status">
              <span class="hero-status__dot"></span>
              Admin Workspace
            </span>

          </div>

          <p class="hero-kicker">
            EDUCATION FINANCE • CORE PAYMENT
          </p>

          <h2>
            ${
              data.institution
                ? escapeHtml(
                    data.institution.institution_name
                  )
                : 'Bangun fondasi keuangan institusi'
            }
          </h2>

          <p class="hero-copy">
            ${
              data.active_period
                ? 'Periode aktif ' +
                  escapeHtml(
                    data.active_period.period_name
                  ) +
                  '. Sistem siap dilanjutkan ke tahap data peserta.'
                : data.institution
                  ? 'Profil institusi sudah siap. Tentukan periode akademik aktif berikutnya.'
                  : 'Mulai dari Profil Institusi, kemudian tentukan Periode Akademik aktif.'
            }
          </p>

          <div class="hero-meta">

            <span>
              <span class="material-symbols-rounded">
                calendar_month
              </span>

              ${
                data.active_period
                  ? escapeHtml(
                      data.active_period.period_name
                    )
                  : 'Periode belum ditentukan'
              }
            </span>

            <span>
              <span class="material-symbols-rounded">
                verified_user
              </span>

              ${
                currentUser
                  ? escapeHtml(
                      currentUser.role_name ||
                      currentUser.role_code ||
                      'Administrator'
                    )
                  : 'Administrator'
              }
            </span>

          </div>

          <div class="hero-actions">

            <button
              class="hero-primary-button"
              type="button"
              data-hero-page="${escapeHtml(heroAction.page)}"
            >
              <span class="material-symbols-rounded">
                ${escapeHtml(heroAction.icon)}
              </span>

              ${escapeHtml(heroAction.label)}
            </button>

            ${
              institutionReady
                ? `
                  <button
                    class="hero-secondary-button"
                    type="button"
                    data-hero-page="institution"
                  >
                    <span class="material-symbols-rounded">
                      tune
                    </span>

                    Profil Institusi
                  </button>
                `
                : ''
            }

          </div>

        </div>

      </section>


      <section class="metric-grid">

        ${metricCard(
          'Peserta Aktif',
          numberFormat(
            metrics.participants ||
            0
          ),
          'groups'
        )}

        ${metricCard(
          'Tagihan',
          numberFormat(
            metrics.bills ||
            0
          ),
          'receipt_long'
        )}

        ${metricCard(
          'Piutang',
          rupiah(
            metrics.outstanding ||
            0
          ),
          'request_quote'
        )}

        ${metricCard(
          'Pembayaran',
          rupiah(
            metrics.payments ||
            0
          ),
          'payments'
        )}

      </section>


      <section class="content-grid">

        <article class="content-card">

          <div class="card-head">

            <div>
              <p class="section-kicker">
                SETUP PROGRESS
              </p>

              <h3>
                Kesiapan Core Payment
              </h3>

              <p>
                Selesaikan foundation sebelum Billing Engine diaktifkan.
              </p>
            </div>

            <span class="progress-badge">
              ${readinessPercent(ready)}%
            </span>

          </div>

          <div class="readiness-list">

            ${readinessItem(
              'Profil Institusi',
              ready.institution,
              'account_balance'
            )}

            ${readinessItem(
              'Periode Akademik Aktif',
              ready.academic_period,
              'calendar_month'
            )}

            ${readinessItem(
              'Data Peserta',
              ready.participants,
              'groups'
            )}

            ${readinessItem(
              'Billing Engine',
              ready.billing,
              'receipt_long'
            )}

          </div>

        </article>


        <article class="content-card">

          <div class="card-head">
            <div>
              <p class="section-kicker">
                WORKSPACE
              </p>

              <h3>
                Admin & Staff
              </h3>

              <p>
                Ini bukan tampilan Peserta/Wali.
              </p>
            </div>
          </div>

          <div class="workspace-info">

            <span class="workspace-info__icon">
              <span class="material-symbols-rounded">
                admin_panel_settings
              </span>
            </span>

            <p>
              Portal Peserta & Wali akan memakai role,
              navigasi, dan dashboard tersendiri.
            </p>

          </div>

        </article>

      </section>
    `;

    document
      .querySelectorAll(
        '[data-hero-page]'
      )
      .forEach(function (button) {
        button.addEventListener(
          'click',
          function () {
            openPage(
              button.dataset.heroPage
            );
          }
        );
      });
  }


  function getDashboardHeroAction(
    institutionReady,
    periodReady
  ) {
    if (
      !institutionReady
    ) {
      return {
        page:
          'institution',
        icon:
          'account_balance',
        label:
          'Lengkapi Institusi'
      };
    }

    if (
      !periodReady
    ) {
      return {
        page:
          'periods',
        icon:
          'calendar_month',
        label:
          'Atur Periode Akademik'
      };
    }

    return {
      page:
        'participants',
      icon:
        'person_add',
      label:
        'Lanjut ke Data Peserta'
    };
  }


  function metricCard(
    label,
    value,
    icon
  ) {
    return `
      <article class="metric-card">

        <span class="metric-card__icon">
          <span class="material-symbols-rounded">
            ${escapeHtml(icon)}
          </span>
        </span>

        <div>
          <span class="metric-card__label">
            ${escapeHtml(label)}
          </span>

          <strong>
            ${escapeHtml(value)}
          </strong>
        </div>

      </article>
    `;
  }


  function readinessItem(
    label,
    ready,
    icon
  ) {
    return `
      <div class="readiness-item">

        <span class="readiness-item__label">

          <span class="readiness-item__icon">
            <span class="material-symbols-rounded">
              ${escapeHtml(icon)}
            </span>
          </span>

          ${escapeHtml(label)}

        </span>

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


  function readinessPercent(
    ready
  ) {
    const keys = [
      'institution',
      'academic_period',
      'participants',
      'billing'
    ];

    const total =
      keys.filter(
        function (key) {
          return Boolean(
            ready[key]
          );
        }
      ).length;

    return Math.round(
      total /
      keys.length *
      100
    );
  }


  /* =========================================================
   * INSTITUTION
   * ========================================================= */

  function loadInstitution() {
    showPageLoading(
      'Membuka Profil Institusi…'
    );

    startLoading(
      'Memuat profil institusi…'
    );

    window.EduApi
      .request(
        'institution.get',
        {
          token:
            getToken()
        }
      )
      .then(function (response) {
        renderInstitution(
          response.data ||
          {}
        );
      })
      .catch(
        renderPageError
      )
      .finally(
        stopLoading
      );
  }


  function renderInstitution(
    data
  ) {
    pageContent.innerHTML = `
      <section class="module-hero">

        <span class="module-hero__icon">
          <span class="material-symbols-rounded">
            account_balance
          </span>
        </span>

        <div>
          <p class="section-kicker">
            MASTER DATA
          </p>

          <h2>
            Profil Institusi
          </h2>

          <p>
            Identitas utama yang digunakan seluruh modul,
            dokumen, laporan, dan konfigurasi sistem.
          </p>
        </div>

      </section>


      <article class="content-card">

        <form
          id="institutionForm"
          class="form-grid"
        >

          ${inputField(
            'Nama Institusi',
            'institution_name',
            data.institution_name ||
              '',
            true
          )}

          ${institutionTypeField(
            data.institution_type ||
            ''
          )}

          ${inputField(
            'Nama Legal',
            'legal_name',
            data.legal_name ||
            ''
          )}

          ${inputField(
            'Nama Singkat',
            'short_name',
            data.short_name ||
            ''
          )}

          <label class="field is-full">
            <span>
              Alamat
            </span>

            <textarea
              class="textarea-input"
              name="address"
            >${escapeHtml(data.address || '')}</textarea>
          </label>

          ${inputField(
            'Kota',
            'city',
            data.city ||
            ''
          )}

          ${inputField(
            'Provinsi',
            'province',
            data.province ||
            ''
          )}

          ${inputField(
            'Telepon',
            'phone',
            data.phone ||
            ''
          )}

          ${inputField(
            'Email',
            'email',
            data.email ||
            '',
            false,
            'email'
          )}

          ${inputField(
            'Website',
            'website',
            data.website ||
            ''
          )}

        </form>

        <div class="page-actions">

          <button
            id="saveInstitutionButton"
            class="primary-button"
            type="button"
          >
            <span class="material-symbols-rounded">
              save
            </span>

            Simpan Profil
          </button>

        </div>

      </article>
    `;

    document
      .getElementById(
        'saveInstitutionButton'
      )
      .addEventListener(
        'click',
        saveInstitution
      );
  }


  function saveInstitution() {
    const form =
      document.getElementById(
        'institutionForm'
      );

    if (
      !form.reportValidity()
    ) {
      return;
    }

    const payload =
      Object.fromEntries(
        new FormData(
          form
        ).entries()
      );

    const button =
      document.getElementById(
        'saveInstitutionButton'
      );

    setButtonLoading(
      button,
      true,
      'Menyimpan…'
    );

    startLoading(
      'Menyimpan Profil Institusi…'
    );

    window.EduApi
      .request(
        'institution.save',
        {
          token:
            getToken(),
          payload:
            payload
        }
      )
      .then(function () {
        toast(
          'Profil institusi berhasil disimpan.'
        );

        loadInstitution();
      })
      .catch(function (error) {
        toast(
          error.message
        );
      })
      .finally(function () {
        setButtonLoading(
          button,
          false
        );

        stopLoading();
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

        <span>
          ${escapeHtml(label)}
          ${required ? '<b class="required-mark">*</b>' : ''}
        </span>

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


  function institutionTypeField(
    value
  ) {
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

        <span>
          Jenis Institusi
        </span>

        <select
          class="select-input"
          name="institution_type"
        >
          ${options
            .map(
              function (item) {
                return `
                  <option
                    value="${escapeHtml(item)}"
                    ${item === value ? 'selected' : ''}
                  >
                    ${escapeHtml(item || 'Pilih jenis')}
                  </option>
                `;
              }
            )
            .join('')}
        </select>

      </label>
    `;
  }


  /* =========================================================
   * ACADEMIC PERIOD
   * ========================================================= */

  function loadPeriods() {
    showPageLoading(
      'Membuka Periode Akademik…'
    );

    startLoading(
      'Memuat periode akademik…'
    );

    window.EduApi
      .request(
        'period.list',
        {
          token:
            getToken()
        }
      )
      .then(function (response) {
        renderPeriods(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );
      })
      .catch(
        renderPageError
      )
      .finally(
        stopLoading
      );
  }


  function renderPeriods(
    rows
  ) {
    pageContent.innerHTML = `
      <section class="module-hero">

        <span class="module-hero__icon">
          <span class="material-symbols-rounded">
            calendar_month
          </span>
        </span>

        <div>
          <p class="section-kicker">
            AKADEMIK
          </p>

          <h2>
            Periode Akademik
          </h2>

          <p>
            Kelola tahun ajaran atau tahun akademik.
            Hanya satu periode yang dapat aktif.
          </p>
        </div>

        <button
          id="newPeriodButton"
          class="primary-button module-hero__action"
          type="button"
        >
          <span class="material-symbols-rounded">
            add
          </span>

          Tambah Periode
        </button>

      </section>


      <article class="content-card">

        ${
          rows.length
            ? periodTable(
                rows
              )
            : `
              <div class="empty-state empty-state--large">

                <span class="empty-state__icon">
                  <span class="material-symbols-rounded">
                    calendar_add_on
                  </span>
                </span>

                <strong>
                  Belum ada periode akademik
                </strong>

                <p>
                  Tambahkan periode pertama dan tandai sebagai aktif.
                </p>

              </div>
            `
        }

      </article>
    `;

    document
      .getElementById(
        'newPeriodButton'
      )
      .addEventListener(
        'click',
        function () {
          openPeriodForm(
            null
          );
        }
      );

    document
      .querySelectorAll(
        '[data-edit-period]'
      )
      .forEach(function (button) {
        button.addEventListener(
          'click',
          function () {
            const row =
              rows.find(
                function (item) {
                  return (
                    item.period_id ===
                    button.dataset.editPeriod
                  );
                }
              );

            openPeriodForm(
              row ||
              null
            );
          }
        );
      });
  }


  function periodTable(
    rows
  ) {
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
            ${rows
              .map(
                function (row) {
                  return `
                    <tr>
                      <td>
                        ${escapeHtml(row.period_code)}
                      </td>

                      <td>
                        <strong>
                          ${escapeHtml(row.period_name)}
                        </strong>
                      </td>

                      <td>
                        ${dateText(row.start_date)}
                      </td>

                      <td>
                        ${dateText(row.end_date)}
                      </td>

                      <td>
                        ${
                          String(
                            row.is_active
                          ).toLowerCase() ===
                          'true'
                            ? '<span class="state-badge is-ready">AKTIF</span>'
                            : '<span class="state-badge is-pending">NONAKTIF</span>'
                        }
                      </td>

                      <td>
                        <button
                          class="secondary-button compact-button"
                          type="button"
                          data-edit-period="${escapeHtml(row.period_id)}"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  `;
                }
              )
              .join('')}
          </tbody>

        </table>

      </div>
    `;
  }


  function openPeriodForm(
    row
  ) {
    modal(
      `
        <h3>
          ${
            row
              ? 'Edit Periode Akademik'
              : 'Tambah Periode Akademik'
          }
        </h3>

        <p>
          Kode harus unik. Hanya satu periode dapat ditandai aktif.
        </p>

        <form
          id="periodForm"
          class="form-grid"
        >

          <input
            type="hidden"
            name="period_id"
            value="${escapeHtml(row?.period_id || '')}"
          >

          ${inputField(
            'Kode Periode',
            'period_code',
            row?.period_code ||
              '',
            true
          )}

          ${inputField(
            'Nama Periode',
            'period_name',
            row?.period_name ||
              '',
            true
          )}

          ${inputField(
            'Tanggal Mulai',
            'start_date',
            dateInput(
              row?.start_date
            ),
            false,
            'date'
          )}

          ${inputField(
            'Tanggal Selesai',
            'end_date',
            dateInput(
              row?.end_date
            ),
            false,
            'date'
          )}

          <label class="toggle-field is-full">

            <input
              type="checkbox"
              name="is_active"
              value="true"
              ${
                String(
                  row?.is_active
                ).toLowerCase() ===
                'true'
                  ? 'checked'
                  : ''
              }
            >

            <span class="toggle-field__control"></span>

            <span>
              <strong>
                Jadikan periode aktif
              </strong>

              <small>
                Periode aktif sebelumnya otomatis dinonaktifkan.
              </small>
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
      `
    );

    document
      .getElementById(
        'savePeriodButton'
      )
      .addEventListener(
        'click',
        savePeriod
      );
  }


  function savePeriod() {
    const form =
      document.getElementById(
        'periodForm'
      );

    if (
      !form.reportValidity()
    ) {
      return;
    }

    const payload =
      Object.fromEntries(
        new FormData(
          form
        ).entries()
      );

    payload.is_active =
      form
        .querySelector(
          '[name="is_active"]'
        )
        .checked;

    const button =
      document.getElementById(
        'savePeriodButton'
      );

    setButtonLoading(
      button,
      true,
      'Menyimpan…'
    );

    startLoading(
      'Menyimpan Periode Akademik…'
    );

    window.EduApi
      .request(
        'period.save',
        {
          token:
            getToken(),
          payload:
            payload
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
        toast(
          error.message
        );
      })
      .finally(function () {
        setButtonLoading(
          button,
          false
        );

        stopLoading();
      });
  }


  /* =========================================================
   * LOADING / UI FEEDBACK
   * ========================================================= */

  function createGlobalProgress() {
    if (
      document.getElementById(
        'appProgress'
      )
    ) {
      return;
    }

    const progress =
      document.createElement(
        'div'
      );

    progress.id =
      'appProgress';

    progress.className =
      'app-progress';

    progress.innerHTML = `
      <div class="app-progress__bar"></div>

      <div class="app-progress__label">
        <span class="button-spinner"></span>
        <span data-progress-text>
          Memuat…
        </span>
      </div>
    `;

    document.body.appendChild(
      progress
    );
  }


  function startLoading(
    message
  ) {
    activeRequestCount +=
      1;

    const progress =
      document.getElementById(
        'appProgress'
      );

    const label =
      progress?.querySelector(
        '[data-progress-text]'
      );

    if (
      label
    ) {
      label.textContent =
        message ||
        'Memuat data…';
    }

    if (
      progress
    ) {
      progress.classList.add(
        'is-active'
      );
    }

    refreshButton.disabled =
      true;

    refreshButton.classList.add(
      'is-loading'
    );
  }


  function stopLoading() {
    activeRequestCount =
      Math.max(
        0,
        activeRequestCount -
        1
      );

    if (
      activeRequestCount >
      0
    ) {
      return;
    }

    const progress =
      document.getElementById(
        'appProgress'
      );

    if (
      progress
    ) {
      progress.classList.remove(
        'is-active'
      );
    }

    refreshButton.disabled =
      false;

    refreshButton.classList.remove(
      'is-loading'
    );
  }


  function showPageLoading(
    message
  ) {
    pageContent.innerHTML = `
      <section class="page-loading">

        <div class="page-loading__head">

          <span class="page-loading__spinner">
            <span class="button-spinner"></span>
          </span>

          <div>
            <strong>
              ${escapeHtml(message || 'Memuat data…')}
            </strong>

            <small>
              Menyiapkan data terbaru dari server.
            </small>
          </div>

        </div>

        <div class="skeleton skeleton--hero"></div>

        <div class="skeleton-grid">
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
          <div class="skeleton skeleton--card"></div>
        </div>

        <div class="skeleton skeleton--panel"></div>

      </section>
    `;
  }


  function setButtonLoading(
    button,
    loading,
    text
  ) {
    if (
      !button
    ) {
      return;
    }

    if (
      loading
    ) {
      if (
        !button.dataset.originalHtml
      ) {
        button.dataset.originalHtml =
          button.innerHTML;
      }

      button.disabled =
        true;

      button.innerHTML = `
        <span class="button-spinner"></span>
        ${escapeHtml(text || 'Memproses…')}
      `;

      return;
    }

    button.disabled =
      false;

    if (
      button.dataset.originalHtml
    ) {
      button.innerHTML =
        button.dataset.originalHtml;

      delete button.dataset.originalHtml;
    }
  }


  /* =========================================================
   * COMMON
   * ========================================================= */

  function renderComingSoon(
    page
  ) {
    pageContent.innerHTML = `
      <section class="module-hero">

        <span class="module-hero__icon">
          <span class="material-symbols-rounded">
            ${escapeHtml(page.icon)}
          </span>
        </span>

        <div>
          <p class="section-kicker">
            NEXT MODULE
          </p>

          <h2>
            ${escapeHtml(page.label)}
          </h2>

          <p>
            Modul ini sudah masuk roadmap Fase 1 Core Payment
            dan akan dibangun setelah Foundation v0.1.x dikunci.
          </p>
        </div>

      </section>


      <article class="content-card">

        <div class="empty-state empty-state--large">

          <span class="empty-state__icon">
            <span class="material-symbols-rounded">
              construction
            </span>
          </span>

          <strong>
            ${escapeHtml(page.label)} belum diaktifkan
          </strong>

          <p>
            Struktur menu sudah tersedia agar navigasi final
            dapat diuji sejak awal.
          </p>

        </div>

      </article>
    `;
  }


  function renderPageError(
    error
  ) {
    stopLoading();

    pageContent.innerHTML = `
      <article class="content-card">

        <div class="empty-state empty-state--large">

          <span class="empty-state__icon is-danger">
            <span class="material-symbols-rounded">
              error
            </span>
          </span>

          <strong>
            Gagal memuat data
          </strong>

          <p>
            ${escapeHtml(
              error &&
              error.message
                ? error.message
                : String(
                    error ||
                    'Terjadi kesalahan.'
                  )
            )}
          </p>

          <button
            class="secondary-button"
            type="button"
            data-retry-page
          >
            <span class="material-symbols-rounded">
              refresh
            </span>

            Coba Lagi
          </button>

        </div>

      </article>
    `;

    const retry =
      document.querySelector(
        '[data-retry-page]'
      );

    if (
      retry
    ) {
      retry.addEventListener(
        'click',
        function () {
          openPage(
            activePage
          );
        }
      );
    }
  }


  function bindGlobalEvents() {
    refreshButton.addEventListener(
      'click',
      function () {
        if (
          refreshButton.disabled
        ) {
          return;
        }

        toast(
          'Memperbarui data…'
        );

        openPage(
          activePage
        );
      }
    );

    document.addEventListener(
      'click',
      function (event) {
        const logoutButton =
          event.target.closest(
            '[data-action="logout"]'
          );

        if (
          logoutButton
        ) {
          confirmLogout();
          return;
        }

        const closeButton =
          event.target.closest(
            '[data-modal-close]'
          );

        if (
          closeButton
        ) {
          closeModal();
        }
      }
    );

    modalBackdrop.addEventListener(
      'click',
      function (event) {
        if (
          event.target ===
          modalBackdrop
        ) {
          closeModal();
        }
      }
    );

    document.addEventListener(
      'keydown',
      function (event) {
        if (
          event.key ===
            'Escape' &&
          !modalBackdrop.hidden
        ) {
          closeModal();
        }
      }
    );
  }


  function confirmLogout() {
    modal(
      `
        <h3>
          Keluar dari aplikasi?
        </h3>

        <p>
          Session pada perangkat ini akan diakhiri.
          Anda perlu login kembali untuk membuka workspace.
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
      `
    );

    document
      .getElementById(
        'confirmLogoutButton'
      )
      .addEventListener(
        'click',
        function () {
          const token =
            getToken();

          clearToken();
          closeModal();

          startLoading(
            'Mengakhiri session…'
          );

          window.EduApi
            .request(
              'logout',
              {
                token: token
              }
            )
            .catch(
              function () {
                return null;
              }
            )
            .finally(
              function () {
                currentUser =
                  null;

                permissions =
                  [];

                stopLoading();
                showLogin();
              }
            );
        }
      );
  }


  function modal(
    html,
    mode
  ) {
    modalCard.innerHTML =
      html;

    modalBackdrop.hidden =
      false;

    modalBackdrop.classList.toggle(
      'is-sheet',
      mode ===
        'sheet'
    );

    modalCard.classList.toggle(
      'is-sheet',
      mode ===
        'sheet'
    );
  }


  function closeModal() {
    modalBackdrop.hidden =
      true;

    modalBackdrop.classList.remove(
      'is-sheet'
    );

    modalCard.classList.remove(
      'is-sheet'
    );

    modalCard.innerHTML =
      '';
  }


  function toast(
    message
  ) {
    window.clearTimeout(
      toastTimer
    );

    toastElement.textContent =
      message;

    toastElement.hidden =
      false;

    toastElement.classList.add(
      'is-visible'
    );

    toastTimer =
      window.setTimeout(
        function () {
          toastElement.classList.remove(
            'is-visible'
          );

          window.setTimeout(
            function () {
              toastElement.hidden =
                true;
            },
            180
          );
        },
        3200
      );
  }


  function initials(
    name
  ) {
    return String(
      name ||
      'U'
    )
      .split(
        /\s+/
      )
      .filter(
        Boolean
      )
      .slice(
        0,
        2
      )
      .map(
        function (part) {
          return part[0];
        }
      )
      .join('')
      .toUpperCase();
  }


  function dateInput(
    value
  ) {
    if (
      !value
    ) {
      return '';
    }

    const date =
      new Date(
        value
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '';
    }

    return date
      .toISOString()
      .slice(
        0,
        10
      );
  }


  function dateText(
    value
  ) {
    if (
      !value
    ) {
      return '—';
    }

    const date =
      new Date(
        value
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return escapeHtml(
        value
      );
    }

    return new Intl.DateTimeFormat(
      'id-ID',
      {
        day:
          '2-digit',
        month:
          'short',
        year:
          'numeric'
      }
    ).format(
      date
    );
  }


  function registerServiceWorker() {
    if (
      !(
        'serviceWorker' in
        navigator
      )
    ) {
      return;
    }

    window.addEventListener(
      'load',
      function () {
        navigator
          .serviceWorker
          .register(
            './service-worker.js'
          )
          .catch(
            function (error) {
              console.warn(
                'Service Worker:',
                error
              );
            }
          );
      }
    );
  }


  return {
    openPage:
      openPage,

    toast:
      toast,

    modal:
      modal,

    closeModal:
      closeModal
  };
})();


window.escapeHtml = function (
  value
) {
  return String(
    value ??
    ''
  )
    .replaceAll(
      '&',
      '&amp;'
    )
    .replaceAll(
      '<',
      '&lt;'
    )
    .replaceAll(
      '>',
      '&gt;'
    )
    .replaceAll(
      '"',
      '&quot;'
    )
    .replaceAll(
      "'",
      '&#039;'
    );
};


window.numberFormat = function (
  value
) {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(
    Number(
      value ||
      0
    )
  );
};


window.rupiah = function (
  value
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style:
        'currency',
      currency:
        'IDR',
      maximumFractionDigits:
        0
    }
  ).format(
    Number(
      value ||
      0
    )
  );
};
