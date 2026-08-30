/**
 * ============================================================
 * EDUCATION FINANCE & MANAGEMENT PLATFORM
 * FRONTEND APP v0.2.1
 * ============================================================
 *
 * FOCUS:
 * - No stacked loading indicators
 * - In-memory module cache
 * - Instant back navigation
 * - Settings module
 * - Module ACTIVE / MAINTENANCE / INACTIVE
 * - Dynamic credit title
 * - Compact dashboard hero
 */

window.EduApp = (function () {
  'use strict';

  const SESSION_KEY =
    window.EDU_CONFIG.SESSION_KEY;

  const CACHE_TTL =
    5 *
    60 *
    1000;

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
      id: 'admissions',
      label: 'Pendaftaran',
      icon: 'how_to_reg',
      permission: 'admission.view'
    },

    {
      id: 'participants',
      label: 'Peserta',
      icon: 'groups',
      permission: 'participant.view'
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
    },

    {
      id: 'settings',
      label: 'Pengaturan',
      icon: 'settings',
      permission: 'settings.view'
    }
  ];


  /*
   * =========================================================
   * ADMISSION PRESETS
   * =========================================================
   *
   * User memilih nama jalur.
   * Code + type disusun otomatis oleh frontend.
   */
  const admissionPresets = [
    {
      group: 'Umum',
      code: 'PSB',
      name: 'PSB Reguler',
      type: 'REGULAR'
    },

    {
      group: 'Beasiswa & Sosial',
      code: 'BEA',
      name: 'Beasiswa Umum',
      type: 'SCHOLARSHIP'
    },

    {
      group: 'Beasiswa & Sosial',
      code: 'YTM',
      name: 'Yatim',
      type: 'SOCIAL'
    },

    {
      group: 'Beasiswa & Sosial',
      code: 'PTU',
      name: 'Piatu',
      type: 'SOCIAL'
    },

    {
      group: 'Beasiswa & Sosial',
      code: 'YTP',
      name: 'Yatim Piatu',
      type: 'SOCIAL'
    },

    {
      group: 'Beasiswa & Sosial',
      code: 'DHF',
      name: 'Dhuafa',
      type: 'SOCIAL'
    },

    {
      group: 'Prestasi',
      code: 'PREST',
      name: 'Prestasi Akademik / Nonakademik',
      type: 'ACHIEVEMENT'
    },

    {
      group: 'Prestasi',
      code: 'TAHF',
      name: 'Tahfizh / Keagamaan',
      type: 'ACHIEVEMENT'
    },

    {
      group: 'Lanjutan Internal',
      code: 'PSBSMP',
      name: 'PSB Khusus SD → SMP',
      type: 'INTERNAL_CONTINUATION'
    },

    {
      group: 'Lanjutan Internal',
      code: 'PSBSMA',
      name: 'PSB Khusus SMP → SMA',
      type: 'INTERNAL_CONTINUATION'
    },

    {
      group: 'Lanjutan Internal',
      code: 'PSBKUL',
      name: 'PSB Khusus SMA → Kuliah',
      type: 'INTERNAL_CONTINUATION'
    },

    {
      group: 'Lanjutan Internal',
      code: 'INT',
      name: 'Internal / Lanjutan Lainnya',
      type: 'INTERNAL_CONTINUATION'
    },

    {
      group: 'Perpindahan',
      code: 'PIND',
      name: 'Pindahan',
      type: 'TRANSFER'
    },

    {
      group: 'Perpindahan',
      code: 'MUT',
      name: 'Mutasi Masuk',
      type: 'TRANSFER'
    },

    {
      group: 'Jalur Khusus',
      code: 'KHS',
      name: 'PSB Khusus',
      type: 'SPECIAL'
    },

    {
      group: 'Jalur Khusus',
      code: 'MITRA',
      name: 'Mitra / Kerja Sama',
      type: 'PARTNER'
    },

    {
      group: 'Jalur Khusus',
      code: 'REKOM',
      name: 'Rekomendasi',
      type: 'RECOMMENDATION'
    },

    {
      group: 'Lainnya',
      code: 'OTHER',
      name: 'Lainnya',
      type: 'CUSTOM'
    }
  ];


  /*
   * =========================================================
   * CONTEXTUAL TUTORIALS
   * =========================================================
   */
  const tutorials = {

    dashboard: {
      eyebrow: 'MULAI DI SINI',
      title: 'Panduan Dashboard',
      intro:
        'Dashboard menunjukkan kesiapan Core Payment dan ringkasan data utama.',
      steps: [
        'Lengkapi Profil Institusi.',
        'Buat dan aktifkan Periode Akademik.',
        'Buat Jalur Pendaftaran.',
        'Tambahkan Peserta dan Wali.',
        'Gunakan tombol refresh hanya jika ingin memaksa update data.'
      ],
      note:
        'Menu yang sudah pernah dibuka memakai cache agar perpindahan halaman tetap cepat.'
    },

    institution: {
      eyebrow: 'MASTER DATA',
      title: 'Panduan Profil Institusi',
      intro:
        'Profil Institusi adalah identitas lembaga yang dipakai seluruh modul, dokumen, dan laporan.',
      steps: [
        'Isi nama institusi dan jenis lembaga.',
        'Lengkapi nama legal, alamat, kontak, dan website bila tersedia.',
        'Simpan satu kali lalu perbarui hanya jika identitas lembaga berubah.'
      ],
      note:
        'Jangan membuat institusi baru hanya karena tahun ajaran berganti.'
    },

    periods: {
      eyebrow: 'TAHUN AKADEMIK',
      title: 'Panduan Periode Akademik',
      intro:
        'Periode Akademik menentukan T.A atau tahun akademik yang menjadi konteks transaksi.',
      steps: [
        'Kode Periode diisi sederhana, contoh 26/27.',
        'Nama Periode dapat ditulis T.A 2026/2027.',
        'Sistem otomatis membuat ID seperti TA-2627.',
        'Hanya satu periode yang ditandai aktif.'
      ],
      note:
        'Kode Periode bukan ID. User mengisi 26/27; sistem yang membuat TA-2627.'
    },

    admissions: {
      eyebrow: 'PENERIMAAN',
      title: 'Panduan Jalur Pendaftaran',
      intro:
        'T.A Masuk dan Jalur Pendaftaran adalah dua data berbeda dan keduanya disimpan sampai akhir.',
      steps: [
        'Pilih T.A Masuk.',
        'Pilih Jalur Pendaftaran dari daftar.',
        'Kode jalur dan ID dibuat otomatis oleh sistem.',
        'Tanggal pendaftaran bersifat opsional.',
        'Satu T.A boleh memiliki banyak jalur seperti PSB, Yatim, Dhuafa, atau Lanjutan Internal.'
      ],
      note:
        'Contoh: T.A 26/27 + Yatim menjadi JP-2627-YTM. User tidak perlu mengetik ID tersebut.'
    },

    participants: {
      eyebrow: 'MASTER PESERTA',
      title: 'Panduan Data Peserta',
      intro:
        'Peserta mencakup siswa, santri, mahasiswa, dan peserta program lain.',
      steps: [
        'Pilih T.A Masuk peserta.',
        'Pilih Jalur Pendaftaran.',
        'Isi nama dan data akademik.',
        'NIS/NIM/ID resmi boleh diisi jika sudah tersedia.',
        'Setelah tersimpan, T.A Masuk dan Jalur Pendaftaran menjadi origin history.',
        'Buka Detail Peserta untuk menambahkan satu atau beberapa wali.'
      ],
      note:
        'ID peserta dibuat otomatis, misalnya P-2627-PSB-001.'
    },

    billing: {
      eyebrow: 'BILLING',
      title: 'Panduan Tagihan',
      intro:
        'Tagihan akan dibangun dari Komponen Biaya, Tarif, target peserta, dan periode.',
      steps: [
        'Tentukan komponen biaya.',
        'Tentukan tarif.',
        'Generate tagihan kepada target.',
        'Pembayaran nantinya dialokasikan ke tagihan.'
      ],
      note:
        'Tagihan dan pembayaran adalah dua entitas berbeda.'
    },

    payments: {
      eyebrow: 'PAYMENT',
      title: 'Panduan Pembayaran',
      intro:
        'Pembayaran mencatat uang yang diterima dan harus dialokasikan ke tagihan.',
      steps: [
        'Pilih peserta atau tagihan.',
        'Pilih metode pembayaran.',
        'Validasi nominal dari backend.',
        'Simpan transaksi dan alokasi.'
      ],
      note:
        'Uang masuk saja tidak otomatis membuat semua tagihan peserta menjadi lunas.'
    },

    receivables: {
      eyebrow: 'PIUTANG',
      title: 'Panduan Piutang',
      intro:
        'Piutang menunjukkan tagihan yang belum lunas atau baru dibayar sebagian.',
      steps: [
        'Filter peserta atau periode.',
        'Lihat umur piutang.',
        'Buka detail sebelum melakukan penagihan.'
      ],
      note:
        'Status piutang berasal dari sisa alokasi tagihan, bukan input manual.'
    },

    reports: {
      eyebrow: 'REPORTING',
      title: 'Panduan Laporan',
      intro:
        'Laporan menyajikan transaksi yang sudah diposting dan data operasional yang relevan.',
      steps: [
        'Pilih periode.',
        'Pilih jenis laporan.',
        'Periksa filter sebelum export.'
      ],
      note:
        'Laporan tidak boleh mengubah data transaksi sumber.'
    },

    settings: {
      eyebrow: 'SYSTEM',
      title: 'Panduan Pengaturan',
      intro:
        'Pengaturan dipakai untuk identitas aplikasi dan kontrol ketersediaan modul.',
      steps: [
        'Atur Credit Title dan Credit Subtitle.',
        'ACTIVE berarti menu normal.',
        'MAINTENANCE berarti menu terlihat tetapi sementara tidak dapat digunakan.',
        'INACTIVE berarti menu disembunyikan.'
      ],
      note:
        'Menu Pengaturan sendiri dikunci tetap aktif agar Administrator tidak kehilangan akses.'
    }

  };


  let currentUser =
    null;

  let permissions =
    [];

  let activePage =
    'dashboard';

  let runtimeConfig = {
    app: {
      credit_title:
        'Qulaimun.id',

      credit_subtitle:
        'Education Finance Platform'
    },

    modules: []
  };

  const pageCache =
    new Map();

  let activeRequestCount =
    0;

  let toastTimer =
    null;


  const bootScreen =
    document.getElementById(
      'bootScreen'
    );

  const bootMessage =
    document.getElementById(
      'bootMessage'
    );

  const loginPage =
    document.getElementById(
      'loginPage'
    );

  const appShell =
    document.getElementById(
      'appShell'
    );

  const desktopNav =
    document.getElementById(
      'desktopNav'
    );

  const mobileNav =
    document.getElementById(
      'mobileNav'
    );

  const pageContent =
    document.getElementById(
      'pageContent'
    );

  const pageTitle =
    document.getElementById(
      'pageTitle'
    );

  const pageEyebrow =
    document.getElementById(
      'pageEyebrow'
    );

  const tutorialButton =
    document.getElementById(
      'tutorialButton'
    );

  const refreshButton =
    document.getElementById(
      'refreshButton'
    );

  const modalBackdrop =
    document.getElementById(
      'modalBackdrop'
    );

  const modalCard =
    document.getElementById(
      'modalCard'
    );

  const toastElement =
    document.getElementById(
      'toast'
    );


  document.addEventListener(
    'DOMContentLoaded',
    start
  );


  /* =========================================================
   * BOOT
   * ========================================================= */

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

        if (
          !token
        ) {
          throw new Error(
            'NO_SESSION'
          );
        }

        bootMessage.textContent =
          'Memeriksa sesi pengguna…';

        return window.EduApi
          .request(
            'session',
            {
              token:
                token
            }
          );
      })
      .then(function (response) {
        setSessionData(
          response
        );

        bootMessage.textContent =
          'Menyiapkan menu…';

        return loadRuntimeConfig();
      })
      .then(function () {
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

    errorBox.hidden =
      true;

    setButtonLoading(
      button,
      true,
      'Memeriksa…'
    );

    startLoading();

    window.EduApi
      .request(
        'login',
        {
          username:
            username,

          password:
            password
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

        return loadRuntimeConfig();
      })
      .then(function () {
        enterApp();
      })
      .catch(function (error) {
        errorBox.textContent =
          error.message;

        errorBox.hidden =
          false;
      })
      .finally(function () {
        setButtonLoading(
          button,
          false
        );

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
    renderCredit();
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
   * RUNTIME CONFIG
   * ========================================================= */

  function loadRuntimeConfig() {
    return window.EduApi
      .request(
        'app.config',
        {
          token:
            getToken()
        }
      )
      .then(function (response) {
        runtimeConfig =
          response.data ||
          runtimeConfig;

        return runtimeConfig;
      });
  }


  function moduleStatus(
    moduleId
  ) {
    const row =
      (
        runtimeConfig.modules ||
        []
      ).find(
        function (item) {
          return (
            item.module_id ===
            moduleId
          );
        }
      );

    return String(
      row
        ? row.status
        : 'ACTIVE'
    ).toUpperCase();
  }


  function renderCredit() {
    const credit =
      document.getElementById(
        'appCredit'
      );

    if (
      !credit
    ) {
      return;
    }

    credit.innerHTML = `
      <strong>
        ${escapeHtml(
          runtimeConfig.app?.credit_title ||
          'Qulaimun.id'
        )}
      </strong>

      <small>
        ${escapeHtml(
          runtimeConfig.app?.credit_subtitle ||
          'Education Finance Platform'
        )}
      </small>
    `;
  }


  /* =========================================================
   * CACHE
   * ========================================================= */

  function setPageCache(
    key,
    data
  ) {
    pageCache.set(
      key,
      {
        data:
          data,

        saved_at:
          Date.now()
      }
    );
  }


  function getPageCache(
    key
  ) {
    const item =
      pageCache.get(
        key
      );

    if (
      !item
    ) {
      return null;
    }

    if (
      Date.now() -
      item.saved_at >
      CACHE_TTL
    ) {
      pageCache.delete(
        key
      );

      return null;
    }

    return item.data;
  }


  function invalidatePageCache(
    key
  ) {
    pageCache.delete(
      key
    );
  }


  /* =========================================================
   * NAVIGATION
   * ========================================================= */

  function availablePages() {
    return pages.filter(
      function (page) {
        if (
          page.permission &&
          !can(
            page.permission
          )
        ) {
          return false;
        }

        return (
          moduleStatus(
            page.id
          ) !==
          'INACTIVE'
        );
      }
    );
  }


  function renderNavigation() {
    const allowed =
      availablePages();

    desktopNav.innerHTML =
      allowed
        .map(
          navButton
        )
        .join('');

    const mobilePrimaryIds = [
      'dashboard',
      'participants',
      'billing'
    ];

    const mobileItems = [];

    mobilePrimaryIds.forEach(
      function (pageId) {
        const page =
          allowed.find(
            function (item) {
              return (
                item.id ===
                pageId
              );
            }
          );

        if (
          page
        ) {
          mobileItems.push(
            navButton(
              page
            )
          );
        }
      }
    );

    /*
     * Pastikan urutannya:
     * Dashboard | Peserta | CTA | Tagihan | Menu
     */
    const dashboard =
      allowed.find(
        item =>
          item.id ===
          'dashboard'
      );

    const participant =
      allowed.find(
        item =>
          item.id ===
          'participants'
      );

    const billing =
      allowed.find(
        item =>
          item.id ===
          'billing'
      );

    const finalItems = [];

    if (dashboard) {
      finalItems.push(
        navButton(
          dashboard
        )
      );
    }

    if (participant) {
      finalItems.push(
        navButton(
          participant
        )
      );
    }

    finalItems.push(
      mobileCtaButton()
    );

    if (billing) {
      finalItems.push(
        navButton(
          billing
        )
      );
    }

    finalItems.push(
      mobileMoreButton()
    );

    mobileNav.innerHTML =
      finalItems.join('');

    bindNavigationButtons();
  }


  function navButton(
    page
  ) {
    const status =
      moduleStatus(
        page.id
      );

    return `
      <button
        class="nav-button ${
          status === 'MAINTENANCE'
            ? 'is-maintenance'
            : ''
        }"
        type="button"
        data-page="${escapeHtml(page.id)}"
      >
        <span class="material-symbols-rounded">
          ${escapeHtml(page.icon)}
        </span>

        <span>
          ${escapeHtml(page.label)}
        </span>

        ${
          status ===
          'MAINTENANCE'
            ? `
              <span class="nav-maintenance-dot"></span>
            `
            : ''
        }
      </button>
    `;
  }


  function mobileCtaButton() {
    return `
      <button
        class="mobile-cta"
        type="button"
        data-mobile-cta
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


  function openPage(
    pageId,
    options
  ) {
    const config =
      options ||
      {};

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

    const status =
      moduleStatus(
        pageId
      );

    if (
      status ===
      'INACTIVE'
    ) {
      toast(
        'Modul sedang tidak aktif.'
      );

      return;
    }

    activePage =
      pageId;

    markActiveNavigation(
      pageId
    );

    pageEyebrow.textContent =
      page.label.toUpperCase();

    pageTitle.textContent =
      page.label;

    if (
      status ===
      'MAINTENANCE'
    ) {
      renderMaintenance(
        page
      );

      return;
    }

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
      'admissions'
    ) {
      loadAdmissions(
        Boolean(
          config.force
        )
      );

      return;
    }

    if (
      pageId ===
      'participants'
    ) {
      loadParticipants(
        Boolean(
          config.force
        )
      );

      return;
    }

    if (
      pageId ===
      'dashboard'
    ) {
      loadDashboard(
        Boolean(
          config.force
        )
      );

      return;
    }

    if (
      pageId ===
      'institution'
    ) {
      loadInstitution(
        Boolean(
          config.force
        )
      );

      return;
    }

    if (
      pageId ===
      'periods'
    ) {
      loadPeriods(
        Boolean(
          config.force
        )
      );

      return;
    }

    if (
      pageId ===
      'settings'
    ) {
      loadSettings(
        Boolean(
          config.force
        )
      );
    }
  }


  function markActiveNavigation(
    pageId
  ) {
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
  }


  /* =========================================================
   * DASHBOARD
   * ========================================================= */

  function loadDashboard(
    force
  ) {
    const cached =
      getPageCache(
        'dashboard'
      );

    if (
      cached &&
      !force
    ) {
      renderDashboard(
        cached
      );

      return;
    }

    /*
     * Refresh dengan cache:
     * biarkan UI lama tetap terlihat.
     * Hanya progress bar + icon refresh.
     */
    if (
      !cached
    ) {
      showPageLoading(
        'Menyiapkan dashboard…'
      );
    }

    startLoading();

    window.EduApi
      .request(
        'dashboard',
        {
          token:
            getToken()
        }
      )
      .then(function (response) {
        setPageCache(
          'dashboard',
          response.data
        );

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
      <section class="hero-panel hero-panel--premium hero-panel--compact">

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

          <div class="hero-main-row">

            <div class="hero-main-copy">

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

            </div>

            <div class="hero-side">

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

                  ${escapeHtml(
                    currentUser?.role_name ||
                    currentUser?.role_code ||
                    'Administrator'
                  )}
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

  function loadInstitution(
    force
  ) {
    const cached =
      getPageCache(
        'institution'
      );

    if (
      cached &&
      !force
    ) {
      renderInstitution(
        cached
      );

      return;
    }

    if (
      !cached
    ) {
      showPageLoading(
        'Membuka Profil Institusi…'
      );
    }

    startLoading();

    window.EduApi
      .request(
        'institution.get',
        {
          token:
            getToken()
        }
      )
      .then(function (response) {
        const data =
          response.data ||
          {};

        setPageCache(
          'institution',
          data
        );

        renderInstitution(
          data
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

    startLoading();

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
      .then(function (response) {
        const data =
          response.data ||
          payload;

        setPageCache(
          'institution',
          data
        );

        invalidatePageCache(
          'dashboard'
        );

        renderInstitution(
          data
        );

        toast(
          'Profil institusi berhasil disimpan.'
        );
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
   * PERIODS
   * ========================================================= */

  function loadPeriods(
    force
  ) {
    const cached =
      getPageCache(
        'periods'
      );

    if (
      cached &&
      !force
    ) {
      renderPeriods(
        cached
      );

      return;
    }

    if (
      !cached
    ) {
      showPageLoading(
        'Membuka Periode Akademik…'
      );
    }

    startLoading();

    window.EduApi
      .request(
        'period.list',
        {
          token:
            getToken()
        }
      )
      .then(function (response) {
        const rows =
          Array.isArray(
            response.data
          )
            ? response.data
            : [];

        setPageCache(
          'periods',
          rows
        );

        renderPeriods(
          rows
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

    startLoading();

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
      .then(function (response) {
        const rows =
          Array.isArray(
            response.data
          )
            ? response.data
            : [];

        setPageCache(
          'periods',
          rows
        );

        invalidatePageCache(
          'dashboard'
        );

        closeModal();

        renderPeriods(
          rows
        );

        toast(
          'Periode akademik berhasil disimpan.'
        );
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
   * ADMISSIONS / JALUR PENDAFTARAN
   * ========================================================= */

  function loadAdmissions(force) {
    const cached = getPageCache('admissions');

    if (cached && !force) {
      renderAdmissions(cached);
      return;
    }

    if (!cached) {
      showPageLoading('Membuka Pendaftaran…');
    }

    startLoading();

    Promise.all([
      window.EduApi.request(
        'admission.list',
        { token: getToken() }
      ),
      window.EduApi.request(
        'period.list',
        { token: getToken() }
      )
    ])
      .then(function (responses) {
        const data = {
          admissions: Array.isArray(responses[0].data)
            ? responses[0].data
            : [],
          periods: Array.isArray(responses[1].data)
            ? responses[1].data
            : []
        };

        setPageCache(
          'admissions',
          data
        );

        renderAdmissions(data);
      })
      .catch(renderPageError)
      .finally(stopLoading);
  }


  function renderAdmissions(data) {
    const admissions = data.admissions || [];
    const periods = data.periods || [];

    pageContent.innerHTML = `
      <section class="module-hero">

        <span class="module-hero__icon">
          <span class="material-symbols-rounded">
            how_to_reg
          </span>
        </span>

        <div>
          <p class="section-kicker">
            PENERIMAAN PESERTA
          </p>

          <h2>
            Jalur Pendaftaran
          </h2>

          <p>
            Satu T.A dapat memiliki beberapa jalur masuk:
            PSB, BEA, Internal, Pindahan, dan lainnya.
          </p>
        </div>

        <button
          id="newAdmissionButton"
          class="primary-button module-hero__action"
          type="button"
        >
          <span class="material-symbols-rounded">
            add
          </span>

          Tambah Jalur
        </button>

      </section>


      <article class="content-card">

        ${
          admissions.length
            ? `
              <div class="admission-grid">

                ${admissions
                  .map(function (item) {
                    return `
                      <button
                        class="admission-card"
                        type="button"
                        data-edit-admission="${escapeHtml(item.admission_id)}"
                      >

                        <div class="admission-card__top">

                          <span class="admission-card__code">
                            ${escapeHtml(item.admission_id)}
                          </span>

                          <span
                            class="state-badge ${
                              String(item.status).toUpperCase() === 'ACTIVE'
                                ? 'is-ready'
                                : 'is-pending'
                            }"
                          >
                            ${escapeHtml(item.status)}
                          </span>

                        </div>

                        <strong>
                          ${escapeHtml(item.admission_name)}
                        </strong>

                        <span class="admission-card__period">
                          T.A ${escapeHtml(item.period_name || item.period_code)}
                        </span>

                        <div class="admission-card__meta">

                          <span>
                            <span class="material-symbols-rounded">
                              badge
                            </span>

                            ${escapeHtml(item.admission_code)}
                          </span>

                          <span>
                            <span class="material-symbols-rounded">
                              groups
                            </span>

                            ${numberFormat(item.participant_count || 0)}
                            peserta
                          </span>

                        </div>

                      </button>
                    `;
                  })
                  .join('')}

              </div>
            `
            : `
              <div class="empty-state empty-state--large">

                <span class="empty-state__icon">
                  <span class="material-symbols-rounded">
                    how_to_reg
                  </span>
                </span>

                <strong>
                  Belum ada jalur pendaftaran
                </strong>

                <p>
                  Contoh: PSB 26/27 dan BEA 26/27 tetap masuk
                  ke T.A yang sama tetapi memiliki jalur berbeda.
                </p>

              </div>
            `
        }

      </article>
    `;

    document
      .getElementById('newAdmissionButton')
      .addEventListener(
        'click',
        function () {
          openAdmissionForm(
            null,
            periods
          );
        }
      );

    document
      .querySelectorAll('[data-edit-admission]')
      .forEach(function (button) {
        button.addEventListener(
          'click',
          function () {
            const item = admissions.find(function (row) {
              return (
                row.admission_id ===
                button.dataset.editAdmission
              );
            });

            openAdmissionForm(
              item || null,
              periods
            );
          }
        );
      });
  }


  function openAdmissionForm(item, periods) {
    const editing =
      Boolean(
        item
      );

    const selectedPreset =
      findAdmissionPreset(
        item?.admission_code
      );

    modal(
      `
        <div class="admission-form-intro">

          <span class="admission-form-intro__icon">
            <span class="material-symbols-rounded">
              auto_awesome
            </span>
          </span>

          <div>
            <h3>
              ${
                editing
                  ? 'Edit Jalur Pendaftaran'
                  : 'Tambah Jalur Pendaftaran'
              }
            </h3>

            <p>
              Anda cukup memilih T.A dan jalur.
              Kode serta ID dibuat otomatis oleh sistem.
            </p>
          </div>

        </div>


        <form
          id="admissionForm"
          class="form-grid"
        >

          <input
            type="hidden"
            name="admission_id"
            value="${escapeHtml(item?.admission_id || '')}"
          >

          <input
            id="admissionCodeHidden"
            type="hidden"
            name="admission_code"
            value="${escapeHtml(item?.admission_code || '')}"
          >

          <input
            id="admissionNameHidden"
            type="hidden"
            name="admission_name"
            value="${escapeHtml(item?.admission_name || '')}"
          >

          <input
            id="admissionTypeHidden"
            type="hidden"
            name="admission_type"
            value="${escapeHtml(item?.admission_type || '')}"
          >


          <label class="field">

            <span>
              T.A Masuk
              <b class="required-mark">*</b>
            </span>

            <select
              id="admissionPeriodSelect"
              class="select-input"
              name="period_id"
              ${editing ? 'disabled' : ''}
              required
            >

              <option value="">
                Pilih T.A
              </option>

              ${periods
                .map(function (period) {
                  return `
                    <option
                      value="${escapeHtml(period.period_id)}"
                      data-period-code="${escapeHtml(period.period_code)}"
                      ${
                        String(item?.period_id || '') ===
                        String(period.period_id)
                          ? 'selected'
                          : ''
                      }
                    >
                      ${escapeHtml(period.period_name)}
                    </option>
                  `;
                })
                .join('')}

            </select>

            <small class="field-help">
              ID T.A dibuat otomatis oleh sistem.
            </small>

          </label>


          <label class="field">

            <span>
              Jalur Pendaftaran
              <b class="required-mark">*</b>
            </span>

            <select
              id="admissionPresetSelect"
              class="select-input"
              ${editing ? 'disabled' : ''}
              required
            >

              <option value="">
                Pilih jalur
              </option>

              ${renderAdmissionPresetOptions(
                item?.admission_code
              )}

            </select>

            <small class="field-help">
              Tidak perlu mengisi kode jalur secara manual.
            </small>

          </label>


          <div
            id="customAdmissionFields"
            class="custom-admission-fields is-full"
            hidden
          >

            ${inputField(
              'Nama Jalur Lainnya',
              'custom_admission_name',
              '',
              false
            )}

            ${inputField(
              'Kode Singkat',
              'custom_admission_code',
              '',
              false
            )}

            <p class="custom-admission-note is-full">
              Contoh: Jalur Alumni → ALUM.
              Maksimal 8 karakter, tanpa spasi.
            </p>

          </div>


          <div class="admission-auto-preview is-full">

            <div>

              <span>
                Jalur terpilih
              </span>

              <strong id="admissionPreviewName">
                ${
                  item
                    ? escapeHtml(item.admission_name)
                    : 'Belum dipilih'
                }
              </strong>

            </div>

            <div>

              <span>
                ID Otomatis
              </span>

              <strong id="admissionPreviewId">
                ${
                  item
                    ? escapeHtml(item.admission_id)
                    : 'Akan dibuat sistem'
                }
              </strong>

            </div>

            <span class="auto-badge">
              <span class="material-symbols-rounded">
                lock
              </span>

              Otomatis
            </span>

          </div>


          <div class="form-section-label is-full">
            Periode Pendaftaran
            <small>Opsional</small>
          </div>


          ${inputField(
            'Tanggal Mulai',
            'start_date',
            dateInput(item?.start_date),
            false,
            'date'
          )}


          ${inputField(
            'Tanggal Selesai',
            'end_date',
            dateInput(item?.end_date),
            false,
            'date'
          )}


          <label class="field">

            <span>
              Status
            </span>

            <select
              class="select-input"
              name="status"
            >

              <option
                value="ACTIVE"
                ${
                  String(item?.status || 'ACTIVE') === 'ACTIVE'
                    ? 'selected'
                    : ''
                }
              >
                Aktif
              </option>

              <option
                value="INACTIVE"
                ${
                  String(item?.status || '') === 'INACTIVE'
                    ? 'selected'
                    : ''
                }
              >
                Tidak Aktif
              </option>

            </select>

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
            id="saveAdmissionButton"
            class="primary-button"
            type="button"
          >
            Simpan
          </button>

        </div>
      `
    );

    if (
      !editing
    ) {
      bindAdmissionPresetForm();
    }

    document
      .getElementById(
        'saveAdmissionButton'
      )
      .addEventListener(
        'click',
        saveAdmission
      );
  }


  function renderAdmissionPresetOptions(
    selectedCode
  ) {
    const groups = {};

    admissionPresets.forEach(
      function (preset) {
        if (
          !groups[preset.group]
        ) {
          groups[preset.group] =
            [];
        }

        groups[preset.group].push(
          preset
        );
      }
    );

    return Object
      .keys(
        groups
      )
      .map(
        function (group) {
          return `
            <optgroup label="${escapeHtml(group)}">

              ${groups[group]
                .map(
                  function (preset) {
                    return `
                      <option
                        value="${escapeHtml(preset.code)}"
                        ${
                          String(selectedCode || '') ===
                          String(preset.code)
                            ? 'selected'
                            : ''
                        }
                      >
                        ${escapeHtml(preset.name)}
                      </option>
                    `;
                  }
                )
                .join('')}

            </optgroup>
          `;
        }
      )
      .join('');
  }


  function findAdmissionPreset(
    code
  ) {
    return admissionPresets.find(
      function (preset) {
        return (
          String(
            preset.code
          ) ===
          String(
            code ||
            ''
          )
        );
      }
    ) || null;
  }


  function bindAdmissionPresetForm() {
    const periodSelect =
      document.getElementById(
        'admissionPeriodSelect'
      );

    const presetSelect =
      document.getElementById(
        'admissionPresetSelect'
      );

    const customFields =
      document.getElementById(
        'customAdmissionFields'
      );

    const customName =
      document.querySelector(
        '[name="custom_admission_name"]'
      );

    const customCode =
      document.querySelector(
        '[name="custom_admission_code"]'
      );

    function syncAdmissionFields() {
      const preset =
        findAdmissionPreset(
          presetSelect.value
        );

      const isCustom =
        preset &&
        preset.code ===
        'OTHER';

      customFields.hidden =
        !isCustom;

      if (
        isCustom
      ) {
        customName.required =
          true;

        customCode.required =
          true;
      } else {
        customName.required =
          false;

        customCode.required =
          false;
      }

      const finalCode =
        isCustom
          ? String(
              customCode.value ||
              ''
            )
              .trim()
              .toUpperCase()
              .replace(
                /[^A-Z0-9]/g,
                ''
              )
              .substring(
                0,
                8
              )
          : preset
            ? preset.code
            : '';

      const finalName =
        isCustom
          ? String(
              customName.value ||
              ''
            ).trim()
          : preset
            ? preset.name
            : '';

      const finalType =
        isCustom
          ? 'CUSTOM'
          : preset
            ? preset.type
            : '';

      document
        .getElementById(
          'admissionCodeHidden'
        )
        .value =
          finalCode;

      document
        .getElementById(
          'admissionNameHidden'
        )
        .value =
          finalName;

      document
        .getElementById(
          'admissionTypeHidden'
        )
        .value =
          finalType;

      document
        .getElementById(
          'admissionPreviewName'
        )
        .textContent =
          finalName ||
          'Belum dipilih';

      document
        .getElementById(
          'admissionPreviewId'
        )
        .textContent =
          buildAdmissionPreviewId(
            periodSelect,
            finalCode
          );
    }

    presetSelect.addEventListener(
      'change',
      syncAdmissionFields
    );

    periodSelect.addEventListener(
      'change',
      syncAdmissionFields
    );

    customName.addEventListener(
      'input',
      syncAdmissionFields
    );

    customCode.addEventListener(
      'input',
      function () {
        customCode.value =
          customCode.value
            .toUpperCase()
            .replace(
              /[^A-Z0-9]/g,
              ''
            )
            .substring(
              0,
              8
            );

        syncAdmissionFields();
      }
    );

    syncAdmissionFields();
  }


  function buildAdmissionPreviewId(
    periodSelect,
    routeCode
  ) {
    if (
      !periodSelect.value ||
      !routeCode
    ) {
      return 'Akan dibuat sistem';
    }

    const selected =
      periodSelect.options[
        periodSelect.selectedIndex
      ];

    const periodCode =
      selected?.dataset?.periodCode ||
      '';

    const digits =
      String(
        periodCode
      ).replace(
        /\D/g,
        ''
      );

    const yearKey =
      digits.length >=
      4
        ? digits.slice(
            0,
            4
          )
        : '';

    if (
      !yearKey
    ) {
      return (
        'JP-…-' +
        routeCode
      );
    }

    return (
      'JP-' +
      yearKey +
      '-' +
      routeCode
    );
  }


  function saveAdmission() {
    const form = document.getElementById(
      'admissionForm'
    );

    if (!form.reportValidity()) {
      return;
    }

    const payload = Object.fromEntries(
      new FormData(form).entries()
    );

    const button = document.getElementById(
      'saveAdmissionButton'
    );

    setButtonLoading(
      button,
      true,
      'Menyimpan…'
    );

    startLoading();

    window.EduApi
      .request(
        'admission.save',
        {
          token: getToken(),
          payload: payload
        }
      )
      .then(function () {
        closeModal();

        invalidatePageCache('admissions');
        invalidatePageCache('participants');

        toast(
          'Jalur pendaftaran berhasil disimpan.'
        );

        loadAdmissions(true);
      })
      .catch(function (error) {
        toast(error.message);
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
   * PARTICIPANTS
   * ========================================================= */

  function loadParticipants(force) {
    const cached =
      getPageCache(
        'participants'
      );

    if (
      cached &&
      !force
    ) {
      renderParticipants(
        cached
      );

      return;
    }

    if (
      !cached
    ) {
      showPageLoading(
        'Membuka Data Peserta…'
      );
    }

    startLoading();

    Promise.all([
      window.EduApi.request(
        'participant.list',
        {
          token:
            getToken()
        }
      ),

      window.EduApi.request(
        'period.list',
        {
          token:
            getToken()
        }
      ),

      window.EduApi.request(
        'admission.list',
        {
          token:
            getToken()
        }
      )
    ])
      .then(function (responses) {
        const data = {
          participants:
            Array.isArray(
              responses[0].data
            )
              ? responses[0].data
              : [],

          periods:
            Array.isArray(
              responses[1].data
            )
              ? responses[1].data
              : [],

          admissions:
            Array.isArray(
              responses[2].data
            )
              ? responses[2].data
              : []
        };

        setPageCache(
          'participants',
          data
        );

        renderParticipants(
          data
        );
      })
      .catch(
        renderPageError
      )
      .finally(
        stopLoading
      );
  }


  function renderParticipants(data) {
    const participants =
      data.participants ||
      [];

    pageContent.innerHTML = `
      <section class="module-hero">

        <span class="module-hero__icon">
          <span class="material-symbols-rounded">
            groups
          </span>
        </span>

        <div>

          <p class="section-kicker">
            MASTER PESERTA
          </p>

          <h2>
            Data Peserta
          </h2>

          <p>
            Berlaku global untuk siswa, santri, mahasiswa,
            peserta kursus, dan peserta lembaga lainnya.
          </p>

        </div>

        <button
          id="newParticipantButton"
          class="primary-button module-hero__action"
          type="button"
        >
          <span class="material-symbols-rounded">
            person_add
          </span>

          Tambah Peserta
        </button>

      </section>


      <article class="content-card">

        <div class="participant-toolbar">

          <div class="participant-search">

            <span class="material-symbols-rounded">
              search
            </span>

            <input
              id="participantSearch"
              type="search"
              placeholder="Cari nama, ID, NIS/NIM, wali…"
            >

          </div>


          <select
            id="participantPeriodFilter"
            class="select-input"
          >
            <option value="">
              Semua T.A Masuk
            </option>

            ${data.periods
              .map(function (period) {
                return `
                  <option value="${escapeHtml(period.period_id)}">
                    ${escapeHtml(period.period_name)}
                  </option>
                `;
              })
              .join('')}
          </select>


          <select
            id="participantAdmissionFilter"
            class="select-input"
          >
            <option value="">
              Semua Jalur
            </option>

            ${data.admissions
              .map(function (admission) {
                return `
                  <option value="${escapeHtml(admission.admission_id)}">
                    ${escapeHtml(admission.admission_code)}
                    — ${escapeHtml(admission.admission_name)}
                  </option>
                `;
              })
              .join('')}
          </select>


          <select
            id="participantStatusFilter"
            class="select-input"
          >
            <option value="">
              Semua Status
            </option>

            <option value="ACTIVE">
              Aktif
            </option>

            <option value="INACTIVE">
              Tidak Aktif
            </option>
          </select>

        </div>


        <div
          id="participantList"
          class="participant-list"
        ></div>

      </article>
    `;

    document
      .getElementById(
        'newParticipantButton'
      )
      .addEventListener(
        'click',
        function () {
          openParticipantForm(
            null,
            data
          );
        }
      );

    const refreshList =
      function () {
        renderParticipantRows(
          participants,
          data
        );
      };

    [
      'participantSearch',
      'participantPeriodFilter',
      'participantAdmissionFilter',
      'participantStatusFilter'
    ].forEach(
      function (id) {
        const element =
          document.getElementById(
            id
          );

        element.addEventListener(
          'input',
          refreshList
        );

        element.addEventListener(
          'change',
          refreshList
        );
      }
    );

    renderParticipantRows(
      participants,
      data
    );
  }


  function renderParticipantRows(
    participants,
    data
  ) {
    const search =
      String(
        document
          .getElementById(
            'participantSearch'
          )
          ?.value ||
        ''
      )
        .trim()
        .toLowerCase();

    const periodId =
      document
        .getElementById(
          'participantPeriodFilter'
        )
        ?.value ||
      '';

    const admissionId =
      document
        .getElementById(
          'participantAdmissionFilter'
        )
        ?.value ||
      '';

    const status =
      document
        .getElementById(
          'participantStatusFilter'
        )
        ?.value ||
      '';

    const filtered =
      participants.filter(
        function (participant) {
          if (
            periodId &&
            String(
              participant.entry_period_id
            ) !==
            periodId
          ) {
            return false;
          }

          if (
            admissionId &&
            String(
              participant.admission_id
            ) !==
            admissionId
          ) {
            return false;
          }

          if (
            status &&
            String(
              participant.status
            ) !==
            status
          ) {
            return false;
          }

          if (
            search
          ) {
            const haystack = [
              participant.participant_id,
              participant.participant_number,
              participant.full_name,
              participant.program_name,
              participant.level_name,
              participant.group_name,
              participant.admission_name,
              participant.primary_guardian_name,
              participant.primary_guardian_phone
            ]
              .join(' ')
              .toLowerCase();

            if (
              !haystack.includes(
                search
              )
            ) {
              return false;
            }
          }

          return true;
        }
      );

    const root =
      document.getElementById(
        'participantList'
      );

    if (
      !filtered.length
    ) {
      root.innerHTML = `
        <div class="empty-state">
          Tidak ada peserta yang sesuai filter.
        </div>
      `;

      return;
    }

    root.innerHTML =
      filtered
        .map(function (participant) {
          return `
            <button
              class="participant-row"
              type="button"
              data-participant-id="${escapeHtml(participant.participant_id)}"
            >

              <span class="participant-row__avatar">
                ${escapeHtml(initials(participant.full_name))}
              </span>

              <span class="participant-row__main">

                <strong>
                  ${escapeHtml(participant.full_name)}
                </strong>

                <small>
                  ${escapeHtml(participant.participant_id)}
                  ${
                    participant.participant_number
                      ? ' • ' + escapeHtml(participant.participant_number)
                      : ''
                  }
                </small>

              </span>

              <span class="participant-row__academic">

                <strong>
                  ${escapeHtml(participant.program_name || '—')}
                </strong>

                <small>
                  ${
                    [
                      participant.level_name,
                      participant.group_name
                    ]
                      .filter(Boolean)
                      .map(escapeHtml)
                      .join(' • ') ||
                    'Belum diatur'
                  }
                </small>

              </span>

              <span class="participant-row__entry">

                <strong>
                  ${escapeHtml(participant.entry_period_name || '—')}
                </strong>

                <small>
                  ${escapeHtml(participant.admission_code || '—')}
                </small>

              </span>

              <span
                class="state-badge ${
                  participant.status === 'ACTIVE'
                    ? 'is-ready'
                    : 'is-pending'
                }"
              >
                ${escapeHtml(participant.status)}
              </span>

              <span class="material-symbols-rounded">
                chevron_right
              </span>

            </button>
          `;
        })
        .join('');

    root
      .querySelectorAll(
        '[data-participant-id]'
      )
      .forEach(function (button) {
        button.addEventListener(
          'click',
          function () {
            openParticipantDetail(
              button.dataset.participantId,
              data
            );
          }
        );
      });
  }


  function openParticipantForm(
    participant,
    data
  ) {
    const editing =
      Boolean(
        participant
      );

    modal(
      `
        <h3>
          ${
            editing
              ? 'Edit Peserta'
              : 'Tambah Peserta'
          }
        </h3>

        <p>
          T.A masuk dan jalur pendaftaran adalah origin history
          dan tidak dapat diubah setelah peserta dibuat.
        </p>

        <form
          id="participantForm"
          class="form-grid"
        >

          <input
            type="hidden"
            name="participant_id"
            value="${escapeHtml(participant?.participant_id || '')}"
          >


          <label class="field">

            <span>
              T.A Masuk
              <b class="required-mark">*</b>
            </span>

            <select
              id="participantEntryPeriod"
              class="select-input"
              name="entry_period_id"
              ${editing ? 'disabled' : ''}
              required
            >
              <option value="">
                Pilih T.A
              </option>

              ${data.periods
                .map(function (period) {
                  return `
                    <option
                      value="${escapeHtml(period.period_id)}"
                      ${
                        String(participant?.entry_period_id || '') ===
                        String(period.period_id)
                          ? 'selected'
                          : ''
                      }
                    >
                      ${escapeHtml(period.period_name)}
                    </option>
                  `;
                })
                .join('')}

            </select>

          </label>


          <label class="field">

            <span>
              Jalur Pendaftaran
              <b class="required-mark">*</b>
            </span>

            <select
              id="participantAdmission"
              class="select-input"
              name="admission_id"
              ${editing ? 'disabled' : ''}
              required
            >
              <option value="">
                Pilih jalur
              </option>

              ${data.admissions
                .filter(function (admission) {
                  return (
                    !participant ||
                    String(admission.period_id) ===
                    String(participant.entry_period_id)
                  );
                })
                .map(function (admission) {
                  return `
                    <option
                      value="${escapeHtml(admission.admission_id)}"
                      data-period="${escapeHtml(admission.period_id)}"
                      ${
                        String(participant?.admission_id || '') ===
                        String(admission.admission_id)
                          ? 'selected'
                          : ''
                      }
                    >
                      ${escapeHtml(admission.admission_code)}
                      — ${escapeHtml(admission.admission_name)}
                    </option>
                  `;
                })
                .join('')}

            </select>

          </label>


          ${inputField(
            'Nama Lengkap',
            'full_name',
            participant?.full_name || '',
            true
          )}


          ${inputField(
            'NIS / NIM / ID Resmi',
            'participant_number',
            participant?.participant_number || ''
          )}


          <label class="field">
            <span>Jenis Kelamin</span>

            <select
              class="select-input"
              name="gender"
            >
              <option value="">
                Pilih
              </option>

              <option
                value="L"
                ${participant?.gender === 'L' ? 'selected' : ''}
              >
                Laki-laki
              </option>

              <option
                value="P"
                ${participant?.gender === 'P' ? 'selected' : ''}
              >
                Perempuan
              </option>
            </select>
          </label>


          ${inputField(
            'Tempat Lahir',
            'birth_place',
            participant?.birth_place || ''
          )}


          ${inputField(
            'Tanggal Lahir',
            'birth_date',
            dateInput(participant?.birth_date),
            false,
            'date'
          )}


          ${inputField(
            'Program / Jenjang',
            'program_name',
            participant?.program_name || ''
          )}


          ${inputField(
            'Tingkat / Semester',
            'level_name',
            participant?.level_name || ''
          )}


          ${inputField(
            'Grup / Kelas',
            'group_name',
            participant?.group_name || ''
          )}


          ${inputField(
            'Tanggal Masuk',
            'enrollment_date',
            dateInput(participant?.enrollment_date),
            false,
            'date'
          )}


          <label class="field">
            <span>Status</span>

            <select
              class="select-input"
              name="status"
            >
              <option
                value="ACTIVE"
                ${
                  String(participant?.status || 'ACTIVE') === 'ACTIVE'
                    ? 'selected'
                    : ''
                }
              >
                Aktif
              </option>

              <option
                value="INACTIVE"
                ${
                  String(participant?.status || '') === 'INACTIVE'
                    ? 'selected'
                    : ''
                }
              >
                Tidak Aktif
              </option>
            </select>
          </label>

        </form>


        ${
          editing
            ? `
              <div class="id-preview">

                <span>ID Peserta</span>

                <strong>
                  ${escapeHtml(participant.participant_id)}
                </strong>

              </div>
            `
            : ''
        }


        <div class="modal-actions">

          <button
            class="secondary-button"
            type="button"
            data-modal-close
          >
            Batal
          </button>

          <button
            id="saveParticipantButton"
            class="primary-button"
            type="button"
          >
            Simpan
          </button>

        </div>
      `,
      'sheet'
    );

    if (
      !editing
    ) {
      bindParticipantAdmissionFilter(
        data.admissions
      );
    }

    document
      .getElementById(
        'saveParticipantButton'
      )
      .addEventListener(
        'click',
        saveParticipant
      );
  }


  function bindParticipantAdmissionFilter(
    admissions
  ) {
    const periodSelect =
      document.getElementById(
        'participantEntryPeriod'
      );

    const admissionSelect =
      document.getElementById(
        'participantAdmission'
      );

    function refreshAdmissionOptions() {
      const periodId =
        periodSelect.value;

      admissionSelect.innerHTML = `
        <option value="">
          Pilih jalur
        </option>

        ${admissions
          .filter(function (admission) {
            return (
              !periodId ||
              String(admission.period_id) === String(periodId)
            );
          })
          .map(function (admission) {
            return `
              <option value="${escapeHtml(admission.admission_id)}">
                ${escapeHtml(admission.admission_code)}
                — ${escapeHtml(admission.admission_name)}
              </option>
            `;
          })
          .join('')}
      `;
    }

    periodSelect.addEventListener(
      'change',
      refreshAdmissionOptions
    );

    refreshAdmissionOptions();
  }


  function saveParticipant() {
    const form =
      document.getElementById(
        'participantForm'
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

    const participantId =
      form.querySelector(
        '[name="participant_id"]'
      ).value;

    if (
      participantId
    ) {
      payload.participant_id =
        participantId;
    }

    const button =
      document.getElementById(
        'saveParticipantButton'
      );

    setButtonLoading(
      button,
      true,
      'Menyimpan…'
    );

    startLoading();

    window.EduApi
      .request(
        'participant.save',
        {
          token:
            getToken(),

          payload:
            payload
        }
      )
      .then(function (response) {
        const detail =
          response.data;

        closeModal();

        invalidatePageCache(
          'participants'
        );

        invalidatePageCache(
          'dashboard'
        );

        toast(
          participantId
            ? 'Data peserta berhasil diperbarui.'
            : 'Peserta berhasil dibuat: ' +
              detail.participant.participant_id
        );

        loadParticipants(
          true
        );
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


  function openParticipantDetail(
    participantId,
    listData
  ) {
    const cacheKey =
      'participant:' +
      participantId;

    const cached =
      getPageCache(
        cacheKey
      );

    if (
      cached
    ) {
      renderParticipantDetail(
        cached,
        listData
      );

      return;
    }

    startLoading();

    window.EduApi
      .request(
        'participant.get',
        {
          token:
            getToken(),

          participant_id:
            participantId
        }
      )
      .then(function (response) {
        setPageCache(
          cacheKey,
          response.data
        );

        renderParticipantDetail(
          response.data,
          listData
        );
      })
      .catch(function (error) {
        toast(
          error.message
        );
      })
      .finally(
        stopLoading
      );
  }


  function renderParticipantDetail(
    detail,
    listData
  ) {
    const participant =
      detail.participant;

    const guardians =
      detail.guardians ||
      [];

    modal(
      `
        <div class="participant-detail">

          <div class="participant-detail__hero">

            <span class="participant-detail__avatar">
              ${escapeHtml(initials(participant.full_name))}
            </span>

            <div>

              <span class="participant-detail__id">
                ${escapeHtml(participant.participant_id)}
              </span>

              <h3>
                ${escapeHtml(participant.full_name)}
              </h3>

              <p>
                T.A ${escapeHtml(participant.entry_period_name || '—')}
                •
                ${escapeHtml(participant.admission_code || '—')}
              </p>

            </div>

            <button
              id="editParticipantButton"
              class="secondary-button compact-button"
              type="button"
            >
              Edit Peserta
            </button>

          </div>


          <div class="participant-detail-grid">

            ${detailItem(
              'ID Resmi',
              participant.participant_number || '—'
            )}

            ${detailItem(
              'Program / Jenjang',
              participant.program_name || '—'
            )}

            ${detailItem(
              'Tingkat / Semester',
              participant.level_name || '—'
            )}

            ${detailItem(
              'Grup / Kelas',
              participant.group_name || '—'
            )}

            ${detailItem(
              'Asal Pendaftaran',
              participant.admission_name || '—'
            )}

            ${detailItem(
              'Status',
              participant.status || '—'
            )}

          </div>


          <div class="guardian-section">

            <div class="card-head">

              <div>
                <p class="section-kicker">
                  KONTAK
                </p>

                <h3>
                  Orang Tua / Wali
                </h3>
              </div>

              <button
                id="addGuardianButton"
                class="secondary-button compact-button"
                type="button"
              >
                <span class="material-symbols-rounded">
                  person_add
                </span>

                Tambah Wali
              </button>

            </div>


            <div class="guardian-list">

              ${
                guardians.length
                  ? guardians
                      .map(guardianCard)
                      .join('')
                  : `
                    <div class="empty-state">
                      Belum ada data wali.
                    </div>
                  `
              }

            </div>

          </div>

        </div>
      `,
      'sheet'
    );

    document
      .getElementById(
        'editParticipantButton'
      )
      .addEventListener(
        'click',
        function () {
          openParticipantForm(
            participant,
            listData
          );
        }
      );

    document
      .getElementById(
        'addGuardianButton'
      )
      .addEventListener(
        'click',
        function () {
          openGuardianForm(
            participant,
            null,
            listData
          );
        }
      );

    document
      .querySelectorAll(
        '[data-guardian-id]'
      )
      .forEach(function (button) {
        button.addEventListener(
          'click',
          function () {
            const guardian =
              guardians.find(function (item) {
                return (
                  item.guardian_id ===
                  button.dataset.guardianId
                );
              });

            openGuardianForm(
              participant,
              guardian || null,
              listData
            );
          }
        );
      });
  }


  function guardianCard(guardian) {
    return `
      <button
        class="guardian-card"
        type="button"
        data-guardian-id="${escapeHtml(guardian.guardian_id)}"
      >

        <span class="guardian-card__icon">
          <span class="material-symbols-rounded">
            contact_phone
          </span>
        </span>

        <span>

          <strong>
            ${escapeHtml(guardian.guardian_name)}
          </strong>

          <small>
            ${escapeHtml(guardian.relationship || 'Wali')}
            ${
              String(guardian.is_primary).toLowerCase() === 'true'
                ? ' • Utama'
                : ''
            }
          </small>

        </span>

        <span class="guardian-card__phone">
          ${escapeHtml(guardian.phone || '—')}
        </span>

        <span class="material-symbols-rounded">
          chevron_right
        </span>

      </button>
    `;
  }


  function openGuardianForm(
    participant,
    guardian,
    listData
  ) {
    modal(
      `
        <h3>
          ${
            guardian
              ? 'Edit Wali'
              : 'Tambah Wali'
          }
        </h3>

        <p>
          Peserta:
          <strong>
            ${escapeHtml(participant.full_name)}
          </strong>
        </p>

        <form
          id="guardianForm"
          class="form-grid"
        >

          <input
            type="hidden"
            name="participant_id"
            value="${escapeHtml(participant.participant_id)}"
          >

          <input
            type="hidden"
            name="guardian_id"
            value="${escapeHtml(guardian?.guardian_id || '')}"
          >


          ${inputField(
            'Nama Wali',
            'guardian_name',
            guardian?.guardian_name || '',
            true
          )}


          ${inputField(
            'Hubungan',
            'relationship',
            guardian?.relationship || ''
          )}


          ${inputField(
            'No. HP / WhatsApp',
            'phone',
            guardian?.phone || ''
          )}


          ${inputField(
            'Email',
            'email',
            guardian?.email || '',
            false,
            'email'
          )}


          <label class="field is-full">

            <span>
              Alamat
            </span>

            <textarea
              class="textarea-input"
              name="address"
            >${escapeHtml(guardian?.address || '')}</textarea>

          </label>


          <label class="toggle-field is-full">

            <input
              type="checkbox"
              name="is_primary"
              value="true"
              ${
                String(guardian?.is_primary || '').toLowerCase() === 'true'
                  ? 'checked'
                  : ''
              }
            >

            <span class="toggle-field__control"></span>

            <span>

              <strong>
                Kontak Utama
              </strong>

              <small>
                Diprioritaskan untuk informasi tagihan dan komunikasi.
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
            id="saveGuardianButton"
            class="primary-button"
            type="button"
          >
            Simpan
          </button>

        </div>
      `,
      'sheet'
    );

    document
      .getElementById(
        'saveGuardianButton'
      )
      .addEventListener(
        'click',
        function () {
          saveGuardian(
            participant,
            listData
          );
        }
      );
  }


  function saveGuardian(
    participant,
    listData
  ) {
    const form =
      document.getElementById(
        'guardianForm'
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

    payload.is_primary =
      form
        .querySelector(
          '[name="is_primary"]'
        )
        .checked;

    const button =
      document.getElementById(
        'saveGuardianButton'
      );

    setButtonLoading(
      button,
      true,
      'Menyimpan…'
    );

    startLoading();

    window.EduApi
      .request(
        'guardian.save',
        {
          token:
            getToken(),

          payload:
            payload
        }
      )
      .then(function (response) {
        const detail =
          response.data;

        setPageCache(
          'participant:' +
          participant.participant_id,
          detail
        );

        invalidatePageCache(
          'participants'
        );

        renderParticipantDetail(
          detail,
          listData
        );

        toast(
          'Data wali berhasil disimpan.'
        );
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


  function detailItem(
    label,
    value
  ) {
    return `
      <div class="participant-detail-item">

        <span>
          ${escapeHtml(label)}
        </span>

        <strong>
          ${escapeHtml(value)}
        </strong>

      </div>
    `;
  }



  /* =========================================================
   * CONTEXTUAL TUTORIAL
   * ========================================================= */

  function openCurrentTutorial() {
    const tutorial =
      tutorials[
        activePage
      ] ||
      tutorials.dashboard;

    modal(
      `
        <div class="tutorial-sheet">

          <div class="tutorial-sheet__head">

            <span class="tutorial-sheet__icon">
              <span class="material-symbols-rounded">
                school
              </span>
            </span>

            <div>

              <p class="section-kicker">
                ${escapeHtml(tutorial.eyebrow)}
              </p>

              <h3>
                ${escapeHtml(tutorial.title)}
              </h3>

              <p>
                ${escapeHtml(tutorial.intro)}
              </p>

            </div>

          </div>


          <div class="tutorial-step-list">

            ${tutorial.steps
              .map(
                function (step, index) {
                  return `
                    <div class="tutorial-step">

                      <span class="tutorial-step__number">
                        ${index + 1}
                      </span>

                      <p>
                        ${escapeHtml(step)}
                      </p>

                    </div>
                  `;
                }
              )
              .join('')}

          </div>


          <div class="tutorial-note">

            <span class="material-symbols-rounded">
              lightbulb
            </span>

            <p>
              ${escapeHtml(tutorial.note)}
            </p>

          </div>


          <div class="modal-actions">

            <button
              class="primary-button"
              type="button"
              data-modal-close
            >
              Mengerti
            </button>

          </div>

        </div>
      `,
      'sheet'
    );
  }


  /* =========================================================
   * SETTINGS
   * ========================================================= */

  function loadSettings(
    force
  ) {
    const cached =
      getPageCache(
        'settings'
      );

    if (
      cached &&
      !force
    ) {
      renderSettings(
        cached
      );

      return;
    }

    if (
      !cached
    ) {
      showPageLoading(
        'Membuka Pengaturan…'
      );
    }

    startLoading();

    window.EduApi
      .request(
        'settings.get',
        {
          token:
            getToken()
        }
      )
      .then(function (response) {
        const data =
          response.data ||
          {};

        setPageCache(
          'settings',
          data
        );

        renderSettings(
          data
        );
      })
      .catch(
        renderPageError
      )
      .finally(
        stopLoading
      );
  }


  function renderSettings(
    data
  ) {
    const app =
      data.app ||
      {};

    const modules =
      Array.isArray(
        data.modules
      )
        ? data.modules
        : [];

    pageContent.innerHTML = `
      <section class="module-hero">

        <span class="module-hero__icon">
          <span class="material-symbols-rounded">
            settings
          </span>
        </span>

        <div>

          <p class="section-kicker">
            SYSTEM
          </p>

          <h2>
            Pengaturan
          </h2>

          <p>
            Atur identitas credit aplikasi dan ketersediaan modul.
          </p>

        </div>

      </section>


      <section class="settings-grid">

        <article class="content-card">

          <div class="card-head">

            <div>

              <p class="section-kicker">
                APP CREDIT
              </p>

              <h3>
                Credit Title
              </h3>

              <p>
                Identitas pengembang/ekosistem yang tampil pada aplikasi.
              </p>

            </div>

          </div>


          <form
            id="creditSettingsForm"
            class="form-grid"
          >

            ${inputField(
              'Credit Title',
              'credit_title',
              app.credit_title ||
              'Qulaimun.id',
              true
            )}

            ${inputField(
              'Credit Subtitle',
              'credit_subtitle',
              app.credit_subtitle ||
              'Education Finance Platform',
              true
            )}

          </form>

          <div class="credit-preview">

            <span>
              PREVIEW
            </span>

            <strong id="creditPreviewTitle">
              ${escapeHtml(
                app.credit_title ||
                'Qulaimun.id'
              )}
            </strong>

            <small id="creditPreviewSubtitle">
              ${escapeHtml(
                app.credit_subtitle ||
                'Education Finance Platform'
              )}
            </small>

          </div>

        </article>


        <article class="content-card">

          <div class="card-head">

            <div>

              <p class="section-kicker">
                MODULE CONTROL
              </p>

              <h3>
                Status Menu
              </h3>

              <p>
                Active tampil normal, Maintenance tetap terlihat,
                Inactive disembunyikan.
              </p>

            </div>

          </div>


          <div class="module-setting-list">

            ${modules
              .map(
                function (module) {
                  const locked =
                    module.module_id ===
                    'settings';

                  return `
                    <div
                      class="module-setting-row"
                      data-module-row="${escapeHtml(module.module_id)}"
                    >

                      <div class="module-setting-row__identity">

                        <span class="module-setting-row__icon">
                          <span class="material-symbols-rounded">
                            ${escapeHtml(
                              getPageIcon(
                                module.module_id
                              )
                            )}
                          </span>
                        </span>

                        <div>

                          <strong>
                            ${escapeHtml(module.module_name)}
                          </strong>

                          <small>
                            ${escapeHtml(module.module_id)}
                          </small>

                        </div>

                      </div>


                      <select
                        class="select-input module-status-select"
                        data-module-status="${escapeHtml(module.module_id)}"
                        ${locked ? 'disabled' : ''}
                      >

                        <option
                          value="ACTIVE"
                          ${module.status === 'ACTIVE' ? 'selected' : ''}
                        >
                          Aktif
                        </option>

                        <option
                          value="MAINTENANCE"
                          ${module.status === 'MAINTENANCE' ? 'selected' : ''}
                        >
                          Maintenance
                        </option>

                        <option
                          value="INACTIVE"
                          ${module.status === 'INACTIVE' ? 'selected' : ''}
                        >
                          Tidak Aktif
                        </option>

                      </select>

                    </div>
                  `;
                }
              )
              .join('')}

          </div>


          <div class="module-status-note">

            <span class="status-legend is-active">
              Active
            </span>

            <span>
              Menu normal
            </span>


            <span class="status-legend is-maintenance">
              Maintenance
            </span>

            <span>
              Menu tampil, tetapi tidak bisa digunakan
            </span>


            <span class="status-legend is-inactive">
              Inactive
            </span>

            <span>
              Menu disembunyikan
            </span>

          </div>

        </article>

      </section>


      <div class="settings-save-bar">

        <span>
          Perubahan berlaku untuk menu aplikasi setelah disimpan.
        </span>

        <button
          id="saveSettingsButton"
          class="primary-button"
          type="button"
        >
          <span class="material-symbols-rounded">
            save
          </span>

          Simpan Pengaturan
        </button>

      </div>
    `;

    bindSettingsPreview();

    document
      .getElementById(
        'saveSettingsButton'
      )
      .addEventListener(
        'click',
        saveSettings
      );
  }


  function bindSettingsPreview() {
    const titleInput =
      document.querySelector(
        '[name="credit_title"]'
      );

    const subtitleInput =
      document.querySelector(
        '[name="credit_subtitle"]'
      );

    const titlePreview =
      document.getElementById(
        'creditPreviewTitle'
      );

    const subtitlePreview =
      document.getElementById(
        'creditPreviewSubtitle'
      );

    titleInput?.addEventListener(
      'input',
      function () {
        titlePreview.textContent =
          titleInput.value ||
          'Qulaimun.id';
      }
    );

    subtitleInput?.addEventListener(
      'input',
      function () {
        subtitlePreview.textContent =
          subtitleInput.value ||
          'Education Finance Platform';
      }
    );
  }


  function saveSettings() {
    const form =
      document.getElementById(
        'creditSettingsForm'
      );

    if (
      !form.reportValidity()
    ) {
      return;
    }

    const appData =
      Object.fromEntries(
        new FormData(
          form
        ).entries()
      );

    const modules =
      Array.from(
        document.querySelectorAll(
          '[data-module-status]'
        )
      ).map(
        function (select) {
          return {
            module_id:
              select.dataset.moduleStatus,

            status:
              select.value
          };
        }
      );

    const button =
      document.getElementById(
        'saveSettingsButton'
      );

    setButtonLoading(
      button,
      true,
      'Menyimpan…'
    );

    startLoading();

    window.EduApi
      .request(
        'settings.save',
        {
          token:
            getToken(),

          payload: {
            credit_title:
              appData.credit_title,

            credit_subtitle:
              appData.credit_subtitle,

            modules:
              modules
          }
        }
      )
      .then(function (response) {
        const data =
          response.data ||
          {};

        runtimeConfig =
          data;

        setPageCache(
          'settings',
          data
        );

        renderCredit();
        renderNavigation();

        /*
         * Dashboard dapat berubah jika module status berubah.
         */
        invalidatePageCache(
          'dashboard'
        );

        renderSettings(
          data
        );

        markActiveNavigation(
          'settings'
        );

        toast(
          'Pengaturan berhasil disimpan.'
        );
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


  function getPageIcon(
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

    return page
      ? page.icon
      : 'widgets';
  }


  /* =========================================================
   * QUICK ACTION / MENU
   * ========================================================= */

  function openQuickActions() {
    const actions = [];

    [
      {
        page:
          'institution',

        icon:
          'account_balance',

        title:
          'Profil Institusi',

        subtitle:
          'Lengkapi identitas lembaga.'
      },

      {
        page:
          'periods',

        icon:
          'calendar_month',

        title:
          'Periode Akademik',

        subtitle:
          'Atur tahun ajaran aktif.'
      }
    ].forEach(
      function (action) {
        if (
          moduleStatus(
            action.page
          ) ===
          'INACTIVE'
        ) {
          return;
        }

        const page =
          pages.find(
            item =>
              item.id ===
              action.page
          );

        if (
          page?.permission &&
          !can(
            page.permission
          )
        ) {
          return;
        }

        actions.push(
          action
        );
      }
    );

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
            Aksi utama bertambah mengikuti modul yang aktif.
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
      availablePages();

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
                const status =
                  moduleStatus(
                    page.id
                  );

                return `
                  <button
                    class="more-menu-card ${
                      status === 'MAINTENANCE'
                        ? 'is-maintenance'
                        : ''
                    }"
                    type="button"
                    data-more-page="${escapeHtml(page.id)}"
                  >

                    <span class="material-symbols-rounded">
                      ${escapeHtml(page.icon)}
                    </span>

                    <strong>
                      ${escapeHtml(page.label)}
                    </strong>

                    ${
                      status === 'MAINTENANCE'
                        ? `
                          <small>
                            Maintenance
                          </small>
                        `
                        : ''
                    }

                  </button>
                `;
              }
            )
            .join('')}

        </div>


        <div class="menu-credit">

          <strong>
            ${escapeHtml(
              runtimeConfig.app?.credit_title ||
              ''
            )}
          </strong>

          <small>
            ${escapeHtml(
              runtimeConfig.app?.credit_subtitle ||
              ''
            )}
          </small>

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

    document
      .querySelector(
        '[data-sheet-logout]'
      )
      ?.addEventListener(
        'click',
        function () {
          closeModal();
          confirmLogout();
        }
      );
  }


  /* =========================================================
   * STATES
   * ========================================================= */

  function renderMaintenance(
    page
  ) {
    pageContent.innerHTML = `
      <section class="module-hero">

        <span class="module-hero__icon is-warning">
          <span class="material-symbols-rounded">
            construction
          </span>
        </span>

        <div>

          <p class="section-kicker">
            MAINTENANCE
          </p>

          <h2>
            ${escapeHtml(page.label)}
          </h2>

          <p>
            Modul sementara ditutup oleh Administrator.
          </p>

        </div>

      </section>


      <article class="content-card">

        <div class="empty-state empty-state--large">

          <span class="empty-state__icon is-warning">
            <span class="material-symbols-rounded">
              engineering
            </span>
          </span>

          <strong>
            Sedang Maintenance
          </strong>

          <p>
            Data tidak dihapus. Modul dapat diaktifkan kembali
            melalui menu Pengaturan.
          </p>

        </div>

      </article>
    `;
  }


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
            Modul ini masuk roadmap Fase 1 Core Payment.
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
            ${escapeHtml(page.label)} belum dibangun
          </strong>

          <p>
            Struktur menu disiapkan dari awal,
            tetapi business logic belum diaktifkan.
          </p>

        </div>

      </article>
    `;
  }


  /* =========================================================
   * FORM HELPERS
   * ========================================================= */

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
          ${
            required
              ? '<b class="required-mark">*</b>'
              : ''
          }
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
   * LOADING
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
      'app-progress app-progress--bar-only';

    progress.innerHTML = `
      <div class="app-progress__bar"></div>
    `;

    document.body.appendChild(
      progress
    );
  }


  function startLoading() {
    activeRequestCount +=
      1;

    document
      .getElementById(
        'appProgress'
      )
      ?.classList.add(
        'is-active'
      );

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

    document
      .getElementById(
        'appProgress'
      )
      ?.classList.remove(
        'is-active'
      );

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
      <section class="page-loading page-loading--clean">

        <div class="page-loading__head">

          <div>

            <strong>
              ${escapeHtml(message || 'Memuat data…')}
            </strong>

            <small>
              Mengambil data terbaru dari server.
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

    document
      .querySelector(
        '[data-retry-page]'
      )
      ?.addEventListener(
        'click',
        function () {
          openPage(
            activePage,
            {
              force:
                true
            }
          );
        }
      );
  }


  /* =========================================================
   * GLOBAL UI
   * ========================================================= */

  function bindGlobalEvents() {
    tutorialButton?.addEventListener(
      'click',
      openCurrentTutorial
    );

    refreshButton.addEventListener(
      'click',
      function () {
        if (
          refreshButton.disabled
        ) {
          return;
        }

        /*
         * Refresh sengaja tidak menghapus tampilan lama.
         * Hanya reload data page aktif.
         */
        openPage(
          activePage,
          {
            force:
              true
          }
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

          startLoading();

          window.EduApi
            .request(
              'logout',
              {
                token:
                  token
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

                pageCache.clear();

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
        3000
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
            './service-worker.js?v=021'
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
