/**
 * ============================================================
 * EDUCATION FINANCE & MANAGEMENT PLATFORM
 * FRONTEND APP v0.3.4 — PERFORMANCE / IDEMPOTENCY — PENERIMAAN PESERTA (SAFE CANDIDATE)
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
      id: 'reception_new',
      label: 'Penerimaan Baru',
      icon: 'event_note',
      permission: 'admission.view'
    },

    {
      id: 'reception_hub',
      label: 'Penerimaan Peserta',
      icon: 'person_search',
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
   * ENTRY PROGRAM / LEVEL CATALOG
   * =========================================================
   *
   * Ini dipilih ADMIN saat membuat Jalur Pendaftaran.
   * Wali tidak mengetik Program/Tingkat secara bebas.
   */
  const entryProgramCatalog = [
    {
      code: 'PAUD',
      name: 'PAUD / Kelompok Bermain',
      levels: [
        {
          code: 'AWAL',
          name: 'Tingkat Awal'
        }
      ]
    },

    {
      code: 'TK',
      name: 'TK / RA',
      levels: [
        {
          code: 'A',
          name: 'Kelompok A'
        },

        {
          code: 'B',
          name: 'Kelompok B'
        }
      ]
    },

    {
      code: 'SD',
      name: 'SD / MI',
      levels: [
        { code: 'K1', name: 'Kelas 1' },
        { code: 'K2', name: 'Kelas 2' },
        { code: 'K3', name: 'Kelas 3' },
        { code: 'K4', name: 'Kelas 4' },
        { code: 'K5', name: 'Kelas 5' },
        { code: 'K6', name: 'Kelas 6' }
      ]
    },

    {
      code: 'SMP',
      name: 'SMP / MTs',
      levels: [
        { code: 'K7', name: 'Kelas 7' },
        { code: 'K8', name: 'Kelas 8' },
        { code: 'K9', name: 'Kelas 9' }
      ]
    },

    {
      code: 'SMA',
      name: 'SMA / SMK / MA',
      levels: [
        { code: 'K10', name: 'Kelas 10' },
        { code: 'K11', name: 'Kelas 11' },
        { code: 'K12', name: 'Kelas 12' }
      ]
    },

    {
      code: 'DIP',
      name: 'Diploma',
      levels: [
        { code: 'S1', name: 'Semester 1' },
        { code: 'S2', name: 'Semester 2' },
        { code: 'S3', name: 'Semester 3' },
        { code: 'S4', name: 'Semester 4' },
        { code: 'S5', name: 'Semester 5' },
        { code: 'S6', name: 'Semester 6' },
        { code: 'S7', name: 'Semester 7' },
        { code: 'S8', name: 'Semester 8' }
      ]
    },

    {
      code: 'S1',
      name: 'Sarjana / S1',
      levels: [
        { code: 'S1', name: 'Semester 1' },
        { code: 'S2', name: 'Semester 2' },
        { code: 'S3', name: 'Semester 3' },
        { code: 'S4', name: 'Semester 4' },
        { code: 'S5', name: 'Semester 5' },
        { code: 'S6', name: 'Semester 6' },
        { code: 'S7', name: 'Semester 7' },
        { code: 'S8', name: 'Semester 8' }
      ]
    },

    {
      code: 'S2',
      name: 'Magister / S2',
      levels: [
        { code: 'S1', name: 'Semester 1' },
        { code: 'S2', name: 'Semester 2' },
        { code: 'S3', name: 'Semester 3' },
        { code: 'S4', name: 'Semester 4' }
      ]
    },

    {
      code: 'S3',
      name: 'Doktor / S3',
      levels: [
        { code: 'S1', name: 'Semester 1' },
        { code: 'S2', name: 'Semester 2' },
        { code: 'S3', name: 'Semester 3' },
        { code: 'S4', name: 'Semester 4' },
        { code: 'S5', name: 'Semester 5' },
        { code: 'S6', name: 'Semester 6' }
      ]
    },

    {
      code: 'KURSUS',
      name: 'Kursus / Program Khusus',
      levels: [
        {
          code: 'AWAL',
          name: 'Level Awal'
        }
      ]
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
        'Pendaftaran sekarang memisahkan Jalur, Pendaftar, Target Masuk, Berkas, dan Timeline.',
      steps: [
        'Admin membuat Jalur Pendaftaran untuk suatu T.A.',
        'Admin menentukan satu atau beberapa Target Masuk: Program/Jenjang + Tingkat Awal.',
        'Form pendaftaran memakai 3 langkah: Data Santri → Data Wali → Berkas & Review.',
        'Foto wajib sebelum form dikirim. Berkas lain dapat dilengkapi sebelum Verifikasi Berkas selesai.',
        'Peserta baru masuk Master Peserta setelah tahap Aktif.'
      ],
      note:
        'Program, Tingkat, Kelas/Rombel, dan tanggal efektif tidak dibebankan kepada wali sebagai isian bebas.'
    },

    reception_new: {
      eyebrow: 'PENERIMAAN BARU',
      title: 'Panduan Penerimaan Terpadu',
      intro:
        'Menu percobaan ini menggabungkan tracking T.A, jalur, dan pendaftar tanpa menghapus menu Periode dan Pendaftaran lama.',
      steps: [
        'Pilih card T.A untuk melihat ringkasan penerimaan pada tahun tersebut.',
        'Buka Jalur Pendaftaran untuk melihat target masuk dan ringkasan keputusan per jalur.',
        'Buka Pendaftar untuk mencari calon peserta dan memantau prosesnya.',
        'Calon Siswa adalah seluruh pendaftar, bukan peserta aktif.',
        'Peserta baru menjadi Master Peserta setelah workflow mencapai tahap Aktif.'
      ],
      note:
        'Diterima tidak sama dengan Aktif. Daftar ulang dan aktivasi tetap mengikuti Admission Workflow yang sudah dikunci.'
    },

    reception_hub: {
      eyebrow: 'PENERIMAAN PESERTA',
      title: 'Panduan Penerimaan Peserta',
      intro:
        'Menu kandidat ini memakai alur tabel Tahun Ajaran lalu room detail T.A untuk Ringkasan, Jalur Pendaftaran, dan Pendaftar.',
      steps: [
        'Lihat semua Tahun Ajaran dalam satu tabel tracking.',
        'Klik satu baris T.A untuk membuka room penerimaan tahun tersebut.',
        'Gunakan Ringkasan untuk melihat posisi keputusan penerimaan.',
        'Gunakan Jalur Pendaftaran untuk melihat target dan statistik per jalur.',
        'Gunakan Pendaftar untuk membuka calon peserta tanpa menganggapnya otomatis aktif.'
      ],
      note:
        'Pendaftar tetap berbeda dari Peserta Aktif. Hanya workflow tahap Aktif yang masuk Master Peserta.'
    },

    participants: {
      eyebrow: 'MASTER PESERTA',
      title: 'Panduan Data Peserta',
      intro:
        'Master Peserta berisi peserta yang sudah mencapai tahap Aktif.',
      steps: [
        'Data awal dibuat melalui menu Pendaftaran.',
        'Program dan Tingkat berasal dari Target Jalur Pendaftaran.',
        'Kelas/Rombel ditentukan belakangan melalui proses penempatan.',
        'Tanggal masuk efektif berasal dari jalur/keputusan admin.',
        'Wali ikut dipindahkan otomatis saat pendaftar diaktifkan.'
      ],
      note:
        'Jangan membuat peserta aktif untuk pendaftar yang masih berada dalam proses seleksi.'
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


  let admissionUiState = {
    tab: 'applications'
  };

  let receptionNewUiState = {
    period_id: '',
    tab: 'routes',
    route_filter: ''
  };

  let receptionHubUiState = {
    period_id: '',
    tab: 'summary',
    route_filter: '',
    stage_filter: '',
    decision_filter: '',
    search: ''
  };

  let applicationWizardState =
    null;

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
      'reception_hub'
    ) {
      loadReceptionHub(
        Boolean(
          config.force
        )
      );

      return;
    }

    if (
      pageId ===
      'reception_new'
    ) {
      loadReceptionNew(
        Boolean(
          config.force
        )
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

        <div class="institution-logo-card">

          <span class="institution-logo-card__icon">
            <span class="material-symbols-rounded">
              image
            </span>
          </span>

          <div>

            <strong>
              Logo Institusi
            </strong>

            <small>
              Dipakai pada PDF formulir dan dokumen resmi.
            </small>

            <span class="institution-logo-card__file">
              ${
                data.logo_file_name
                  ? escapeHtml(data.logo_file_name)
                  : 'Belum ada logo'
              }
            </span>

          </div>

          <input
            id="institutionLogoFile"
            type="file"
            accept="image/*"
            hidden
          >

          <button
            id="chooseInstitutionLogoButton"
            class="secondary-button"
            type="button"
          >
            <span class="material-symbols-rounded">
              upload
            </span>

            Upload Logo
          </button>

        </div>


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

    const logoInput =
      document.getElementById(
        'institutionLogoFile'
      );

    document
      .getElementById(
        'chooseInstitutionLogoButton'
      )
      ?.addEventListener(
        'click',
        function () {
          logoInput.click();
        }
      );

    logoInput
      ?.addEventListener(
        'change',
        function () {
          const file =
            logoInput.files?.[0];

          if (
            file
          ) {
            uploadInstitutionLogo(
              file
            );
          }
        }
      );
  }


  function uploadInstitutionLogo(
    file
  ) {
    if (
      !navigator.onLine
    ) {
      toast(
        'Upload logo membutuhkan koneksi internet.'
      );

      return;
    }

    startLoading();

    window.EduUpload
      .send(
        'upload.institution_logo',
        {
          token:
            getToken()
        },
        file
      )
      .then(
        function () {
          invalidatePageCache(
            'institution'
          );

          toast(
            'Logo institusi berhasil disimpan.'
          );

          loadInstitution(
            true
          );
        }
      )
      .catch(
        function (error) {
          toast(
            error.message
          );
        }
      )
      .finally(
        stopLoading
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

        invalidatePageCache(
          'reception_new'
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

  function loadAdmissions(
    force
  ) {
    const cached =
      getPageCache(
        'admissions'
      );

    if (
      cached &&
      !force
    ) {
      renderAdmissions(
        cached
      );

      return;
    }

    if (
      !cached
    ) {
      showPageLoading(
        'Membuka Pendaftaran…'
      );
    }

    startLoading();

    Promise.all([
      window.EduApi.request(
        'admission.list',
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
        'application.list',
        {
          token:
            getToken()
        }
      )
    ])
      .then(
        function (responses) {
          const data = {
            admissions:
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

            applications:
              Array.isArray(
                responses[2].data
              )
                ? responses[2].data
                : []
          };

          setPageCache(
            'admissions',
            data
          );

          renderAdmissions(
            data
          );
        }
      )
      .catch(
        renderPageError
      )
      .finally(
        stopLoading
      );
  }


  function renderAdmissions(
    data
  ) {
    pageContent.innerHTML = `
      <section class="module-hero">

        <span class="module-hero__icon">
          <span class="material-symbols-rounded">
            how_to_reg
          </span>
        </span>

        <div>

          <p class="section-kicker">
            ADMISSION WORKFLOW
          </p>

          <h2>
            Pendaftaran
          </h2>

          <p>
            Jalur → Form 1-2-3 → Verifikasi → Wawancara →
            Keputusan → Daftar Ulang → Aktif.
          </p>

        </div>

        <button
          id="newApplicationButton"
          class="primary-button module-hero__action"
          type="button"
        >
          <span class="material-symbols-rounded">
            person_add
          </span>

          Pendaftaran Baru
        </button>

      </section>


      <div class="module-tabs">

        <button
          class="module-tab ${
            admissionUiState.tab ===
            'applications'
              ? 'is-active'
              : ''
          }"
          type="button"
          data-admission-tab="applications"
        >
          <span class="material-symbols-rounded">
            assignment_ind
          </span>

          Pendaftar

          <span class="module-tab__count">
            ${numberFormat(data.applications.length)}
          </span>
        </button>

        <button
          class="module-tab ${
            admissionUiState.tab ===
            'routes'
              ? 'is-active'
              : ''
          }"
          type="button"
          data-admission-tab="routes"
        >
          <span class="material-symbols-rounded">
            account_tree
          </span>

          Jalur & Target

          <span class="module-tab__count">
            ${numberFormat(data.admissions.length)}
          </span>
        </button>

      </div>


      <div
        id="admissionOfflineDraftArea"
        class="offline-draft-area"
      ></div>


      <div
        id="admissionTabContent"
      ></div>
    `;

    document
      .getElementById(
        'newApplicationButton'
      )
      .addEventListener(
        'click',
        function () {
          openApplicationWizard(
            data,
            null
          );
        }
      );

    document
      .querySelectorAll(
        '[data-admission-tab]'
      )
      .forEach(
        function (button) {
          button.addEventListener(
            'click',
            function () {
              admissionUiState.tab =
                button.dataset.admissionTab;

              renderAdmissions(
                data
              );
            }
          );
        }
      );

    if (
      admissionUiState.tab ===
      'routes'
    ) {
      renderAdmissionRoutesTab(
        data
      );

    } else {
      renderApplicationsTab(
        data
      );
    }

    renderOfflineApplicationDrafts(
      data
    );
  }


  /* =========================================================
   * TAB: PENDAFTAR
   * ========================================================= */

  function renderApplicationsTab(
    data
  ) {
    const container =
      document.getElementById(
        'admissionTabContent'
      );

    const rows =
      data.applications ||
      [];

    container.innerHTML = `
      <article class="content-card">

        <div class="application-toolbar">

          <div class="participant-search">

            <span class="material-symbols-rounded">
              search
            </span>

            <input
              id="applicationSearch"
              type="search"
              placeholder="Cari nama atau ID pendaftaran…"
            >

          </div>

          <select
            id="applicationStageFilter"
            class="select-input"
          >
            <option value="">
              Semua Tahap
            </option>

            ${[
              'Pendaftaran',
              'Verifikasi Berkas',
              'Proses Administrasi',
              'Proses Wawancara',
              'Tes / Seleksi',
              'Keputusan',
              'Daftar Ulang',
              'Aktif'
            ]
              .map(
                function (label) {
                  return `
                    <option value="${escapeHtml(label)}">
                      ${escapeHtml(label)}
                    </option>
                  `;
                }
              )
              .join('')}
          </select>

          <select
            id="applicationRouteFilter"
            class="select-input"
          >
            <option value="">
              Semua Jalur
            </option>

            ${data.admissions
              .map(
                function (admission) {
                  return `
                    <option value="${escapeHtml(admission.admission_id)}">
                      ${escapeHtml(admission.admission_name)}
                    </option>
                  `;
                }
              )
              .join('')}
          </select>

        </div>

        <div
          id="applicationList"
          class="application-list"
        ></div>

      </article>
    `;

    const redraw =
      function () {
        renderApplicationRows(
          rows,
          data
        );
      };

    [
      'applicationSearch',
      'applicationStageFilter',
      'applicationRouteFilter'
    ].forEach(
      function (id) {
        const element =
          document.getElementById(
            id
          );

        element.addEventListener(
          'input',
          redraw
        );

        element.addEventListener(
          'change',
          redraw
        );
      }
    );

    redraw();
  }


  function renderApplicationRows(
    rows,
    data
  ) {
    const root =
      document.getElementById(
        'applicationList'
      );

    const search =
      String(
        document
          .getElementById(
            'applicationSearch'
          )
          ?.value ||
        ''
      )
        .trim()
        .toLowerCase();

    const stage =
      document
        .getElementById(
          'applicationStageFilter'
        )
        ?.value ||
      '';

    const route =
      document
        .getElementById(
          'applicationRouteFilter'
        )
        ?.value ||
      '';

    const filtered =
      rows.filter(
        function (row) {
          if (
            stage &&
            row.stage_label !==
            stage
          ) {
            return false;
          }

          if (
            route &&
            row.admission_id !==
            route
          ) {
            return false;
          }

          if (
            search
          ) {
            const text = [
              row.application_id,
              row.full_name,
              row.admission_name,
              row.program_name,
              row.level_name
            ]
              .join(
                ' '
              )
              .toLowerCase();

            if (
              !text.includes(
                search
              )
            ) {
              return false;
            }
          }

          return true;
        }
      );

    if (
      !filtered.length
    ) {
      root.innerHTML = `
        <div class="empty-state empty-state--large">

          <span class="empty-state__icon">
            <span class="material-symbols-rounded">
              assignment_ind
            </span>
          </span>

          <strong>
            Belum ada pendaftar
          </strong>

          <p>
            Gunakan tombol Pendaftaran Baru untuk membuka form
            Data Santri → Data Wali → Berkas.
          </p>

        </div>
      `;

      return;
    }

    root.innerHTML =
      filtered
        .map(
          function (row) {
            const documentComplete =
              Boolean(
                row.document_status &&
                row.document_status.complete
              );

            return `
              <button
                class="application-row"
                type="button"
                data-application-id="${escapeHtml(row.application_id)}"
              >

                <span class="application-row__avatar">
                  ${escapeHtml(initials(row.full_name))}
                </span>

                <span class="application-row__main">

                  <strong>
                    ${escapeHtml(row.full_name)}
                  </strong>

                  <small>
                    ${escapeHtml(row.application_id)}
                  </small>

                </span>

                <span class="application-row__target">

                  <strong>
                    ${escapeHtml(row.program_name || '—')}
                  </strong>

                  <small>
                    ${escapeHtml(row.level_name || '—')}
                    •
                    ${escapeHtml(row.admission_code || '—')}
                  </small>

                </span>

                <span class="application-row__stage">

                  <strong>
                    ${escapeHtml(row.stage_label)}
                  </strong>

                  <small class="${
                    documentComplete
                      ? 'is-complete'
                      : 'is-incomplete'
                  }">
                    ${
                      documentComplete
                        ? 'Berkas lengkap'
                        : 'Berkas belum lengkap'
                    }
                  </small>

                </span>

                <span class="material-symbols-rounded">
                  chevron_right
                </span>

              </button>
            `;
          }
        )
        .join('');

    root
      .querySelectorAll(
        '[data-application-id]'
      )
      .forEach(
        function (button) {
          button.addEventListener(
            'click',
            function () {
              openApplicationDetail(
                button.dataset.applicationId,
                data
              );
            }
          );
        }
      );
  }


  /* =========================================================
   * TAB: JALUR & TARGET
   * ========================================================= */

  function renderAdmissionRoutesTab(
    data
  ) {
    const container =
      document.getElementById(
        'admissionTabContent'
      );

    container.innerHTML = `
      <article class="content-card">

        <div class="card-head">

          <div>

            <p class="section-kicker">
              KONFIGURASI
            </p>

            <h3>
              Jalur dan Target Masuk
            </h3>

            <p>
              Program dan Tingkat ditentukan sekali oleh Admin.
              Wali cukup memilih target yang tersedia.
            </p>

          </div>

          <button
            id="newAdmissionRouteButton"
            class="secondary-button"
            type="button"
          >
            <span class="material-symbols-rounded">
              add
            </span>

            Tambah Jalur
          </button>

        </div>

        ${
          data.admissions.length
            ? `
              <div class="admission-grid">

                ${data.admissions
                  .map(
                    function (item) {
                      return admissionRouteCard(
                        item
                      );
                    }
                  )
                  .join('')}

              </div>
            `
            : `
              <div class="empty-state empty-state--large">

                <span class="empty-state__icon">
                  <span class="material-symbols-rounded">
                    account_tree
                  </span>
                </span>

                <strong>
                  Belum ada jalur pendaftaran
                </strong>

                <p>
                  Buat jalur lalu tentukan target masuknya.
                </p>

              </div>
            `
        }

      </article>
    `;

    document
      .getElementById(
        'newAdmissionRouteButton'
      )
      .addEventListener(
        'click',
        function () {
          openAdmissionRouteForm(
            null,
            data.periods
          );
        }
      );

    document
      .querySelectorAll(
        '[data-edit-admission-route]'
      )
      .forEach(
        function (button) {
          button.addEventListener(
            'click',
            function () {
              const row =
                data.admissions.find(
                  function (item) {
                    return (
                      item.admission_id ===
                      button.dataset.editAdmissionRoute
                    );
                  }
                );

              openAdmissionRouteForm(
                row ||
                null,
                data.periods
              );
            }
          );
        }
      );

    document
      .querySelectorAll(
        '[data-apply-route]'
      )
      .forEach(
        function (button) {
          button.addEventListener(
            'click',
            function (event) {
              event.stopPropagation();

              openApplicationWizard(
                data,
                {
                  admission_id:
                    button.dataset.applyRoute
                }
              );
            }
          );
        }
      );
  }


  function admissionRouteCard(
    item
  ) {
    const targets =
      Array.isArray(
        item.targets
      )
        ? item.targets
        : [];

    return `
      <article class="admission-card admission-card--route">

        <button
          class="admission-card__edit"
          type="button"
          data-edit-admission-route="${escapeHtml(item.admission_id)}"
          aria-label="Edit jalur"
        >
          <span class="material-symbols-rounded">
            edit
          </span>
        </button>

        <div class="admission-card__top">

          <span class="admission-card__code">
            ${escapeHtml(item.admission_id)}
          </span>

          <span
            class="state-badge ${
              String(item.status).toUpperCase() ===
              'ACTIVE'
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
          ${escapeHtml(item.period_name || item.period_code)}
        </span>

        <div class="route-target-list">

          ${
            targets.length
              ? targets
                  .map(
                    function (target) {
                      return `
                        <span class="route-target-chip">

                          <span class="material-symbols-rounded">
                            school
                          </span>

                          ${escapeHtml(target.program_name)}
                          •
                          ${escapeHtml(target.level_name)}

                        </span>
                      `;
                    }
                  )
                  .join('')
              : `
                <span class="route-target-chip is-empty">
                  Target masuk belum diatur
                </span>
              `
          }

        </div>

        <div class="admission-card__footer">

          <span>
            ${numberFormat(item.application_count || 0)}
            pendaftar
          </span>

          <button
            class="route-apply-button"
            type="button"
            data-apply-route="${escapeHtml(item.admission_id)}"
            ${targets.length ? '' : 'disabled'}
          >
            Daftarkan
          </button>

        </div>

      </article>
    `;
  }


  function openAdmissionRouteForm(
    item,
    periods
  ) {
    const editing =
      Boolean(
        item
      );

    const targets =
      editing &&
      Array.isArray(
        item.targets
      ) &&
      item.targets.length
        ? item.targets
        : [
            {
              target_id:
                '',

              program_code:
                'SMP',

              program_name:
                'SMP / MTs',

              level_code:
                'K7',

              level_name:
                'Kelas 7',

              default_entry_date:
                ''
            }
          ];

    modal(
      `
        <div class="admission-form-intro">

          <span class="admission-form-intro__icon">
            <span class="material-symbols-rounded">
              account_tree
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
              Tentukan jalur dan satu atau beberapa target masuk.
            </p>

          </div>

        </div>


        <form
          id="admissionRouteForm"
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
                .map(
                  function (period) {
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
                  }
                )
                .join('')}

            </select>

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

          </div>


          <div class="admission-auto-preview is-full">

            <div>

              <span>
                Jalur
              </span>

              <strong id="admissionPreviewName">
                ${escapeHtml(item?.admission_name || 'Belum dipilih')}
              </strong>

            </div>

            <div>

              <span>
                ID Otomatis
              </span>

              <strong id="admissionPreviewId">
                ${escapeHtml(item?.admission_id || 'Akan dibuat sistem')}
              </strong>

            </div>

            <span class="auto-badge">

              <span class="material-symbols-rounded">
                lock
              </span>

              Otomatis

            </span>

          </div>


          <div class="target-editor-section is-full">

            <div class="target-editor-head">

              <div>

                <span class="form-section-label">
                  Target Masuk
                </span>

                <small>
                  Program + Tingkat ditentukan Admin
                </small>

              </div>

              <button
                id="addAdmissionTargetButton"
                class="secondary-button compact-button"
                type="button"
              >
                <span class="material-symbols-rounded">
                  add
                </span>

                Tambah Target
              </button>

            </div>

            <div
              id="admissionTargetEditor"
              class="target-editor-list"
            >
              ${renderAdmissionTargetEditorRows(
                targets
              )}
            </div>

          </div>


          <div class="form-section-label is-full">
            Periode Pendaftaran
            <small>
              Opsional
            </small>
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
                  String(item?.status || 'ACTIVE') ===
                  'ACTIVE'
                    ? 'selected'
                    : ''
                }
              >
                Aktif
              </option>

              <option
                value="INACTIVE"
                ${
                  String(item?.status || '') ===
                  'INACTIVE'
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
            id="saveAdmissionRouteButton"
            class="primary-button"
            type="button"
          >
            Simpan Jalur
          </button>

        </div>
      `,
      'sheet'
    );

    if (
      !editing
    ) {
      bindAdmissionPresetForm();
    }

    bindAdmissionTargetEditor();

    document
      .getElementById(
        'addAdmissionTargetButton'
      )
      .addEventListener(
        'click',
        addAdmissionTargetRow
      );

    document
      .getElementById(
        'saveAdmissionRouteButton'
      )
      .addEventListener(
        'click',
        saveAdmissionRoute
      );
  }


  function renderAdmissionPresetOptions(
    selectedCode
  ) {
    const groups =
      {};

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
    return (
      admissionPresets.find(
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
      ) ||
      null
    );
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


  /* =========================================================
   * TARGET EDITOR
   * ========================================================= */

  function renderAdmissionTargetEditorRows(
    targets
  ) {
    return targets
      .map(
        function (target, index) {
          return admissionTargetEditorRow(
            target,
            index
          );
        }
      )
      .join('');
  }


  function admissionTargetEditorRow(
    target,
    index
  ) {
    return `
      <div
        class="target-editor-row"
        data-target-row
      >

        <input
          type="hidden"
          data-target-id
          value="${escapeHtml(target.target_id || '')}"
        >

        <label class="field">

          <span>
            Program / Jenjang
          </span>

          <select
            class="select-input"
            data-target-program
            required
          >

            ${entryProgramCatalog
              .map(
                function (program) {
                  return `
                    <option
                      value="${escapeHtml(program.code)}"
                      ${
                        String(target.program_code || '') ===
                        String(program.code)
                          ? 'selected'
                          : ''
                      }
                    >
                      ${escapeHtml(program.name)}
                    </option>
                  `;
                }
              )
              .join('')}

          </select>

        </label>


        <label class="field">

          <span>
            Tingkat Masuk
          </span>

          <select
            class="select-input"
            data-target-level
            data-selected-level="${escapeHtml(target.level_code || '')}"
            required
          ></select>

        </label>


        <label class="field">

          <span>
            Tanggal Masuk Default
          </span>

          <input
            class="text-input"
            type="date"
            data-target-date
            value="${escapeHtml(dateInput(target.default_entry_date))}"
          >

        </label>


        <button
          class="target-remove-button"
          type="button"
          data-remove-target
          aria-label="Hapus target"
        >
          <span class="material-symbols-rounded">
            delete
          </span>
        </button>

      </div>
    `;
  }


  function bindAdmissionTargetEditor() {
    document
      .querySelectorAll(
        '[data-target-row]'
      )
      .forEach(
        bindAdmissionTargetRow
      );
  }


  function bindAdmissionTargetRow(
    row
  ) {
    const programSelect =
      row.querySelector(
        '[data-target-program]'
      );

    const levelSelect =
      row.querySelector(
        '[data-target-level]'
      );

    const removeButton =
      row.querySelector(
        '[data-remove-target]'
      );

    function renderLevels() {
      const program =
        entryProgramCatalog.find(
          function (item) {
            return (
              item.code ===
              programSelect.value
            );
          }
        );

      const selectedLevel =
        levelSelect.dataset.selectedLevel ||
        levelSelect.value ||
        '';

      levelSelect.innerHTML =
        (
          program
            ? program.levels
            : []
        )
          .map(
            function (level) {
              return `
                <option
                  value="${escapeHtml(level.code)}"
                  ${
                    String(selectedLevel) ===
                    String(level.code)
                      ? 'selected'
                      : ''
                  }
                >
                  ${escapeHtml(level.name)}
                </option>
              `;
            }
          )
          .join('');

      delete levelSelect.dataset.selectedLevel;
    }

    programSelect.addEventListener(
      'change',
      renderLevels
    );

    removeButton.addEventListener(
      'click',
      function () {
        const rows =
          document.querySelectorAll(
            '[data-target-row]'
          );

        if (
          rows.length <=
          1
        ) {
          toast(
            'Minimal satu target masuk harus tersedia.'
          );

          return;
        }

        row.remove();
      }
    );

    renderLevels();
  }


  function addAdmissionTargetRow() {
    const editor =
      document.getElementById(
        'admissionTargetEditor'
      );

    editor.insertAdjacentHTML(
      'beforeend',
      admissionTargetEditorRow(
        {
          target_id:
            '',

          program_code:
            'SMP',

          level_code:
            'K7',

          default_entry_date:
            ''
        },
        editor.children.length
      )
    );

    bindAdmissionTargetRow(
      editor.lastElementChild
    );
  }


  function collectAdmissionTargets() {
    return Array
      .from(
        document.querySelectorAll(
          '[data-target-row]'
        )
      )
      .map(
        function (row) {
          const programCode =
            row.querySelector(
              '[data-target-program]'
            ).value;

          const levelCode =
            row.querySelector(
              '[data-target-level]'
            ).value;

          const program =
            entryProgramCatalog.find(
              function (item) {
                return (
                  item.code ===
                  programCode
                );
              }
            );

          const level =
            program
              ? program.levels.find(
                  function (item) {
                    return (
                      item.code ===
                      levelCode
                    );
                  }
                )
              : null;

          return {
            target_id:
              row.querySelector(
                '[data-target-id]'
              ).value,

            program_code:
              programCode,

            program_name:
              program
                ? program.name
                : programCode,

            level_code:
              levelCode,

            level_name:
              level
                ? level.name
                : levelCode,

            default_entry_date:
              row.querySelector(
                '[data-target-date]'
              ).value,

            status:
              'ACTIVE'
          };
        }
      );
  }


  function saveAdmissionRoute() {
    const form =
      document.getElementById(
        'admissionRouteForm'
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

    const existingId =
      form.querySelector(
        '[name="admission_id"]'
      ).value;

    if (
      existingId
    ) {
      payload.admission_id =
        existingId;
    }

    payload.targets =
      collectAdmissionTargets();

    const button =
      document.getElementById(
        'saveAdmissionRouteButton'
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
          token:
            getToken(),

          payload:
            payload
        }
      )
      .then(
        function () {
          closeModal();

          invalidatePageCache(
            'admissions'
          );

          invalidatePageCache(
            'reception_new'
          );

          invalidatePageCache(
            'participants'
          );

          toast(
            'Jalur dan target masuk berhasil disimpan.'
          );

          admissionUiState.tab =
            'routes';

          loadAdmissions(
            true
          );
        }
      )
      .catch(
        function (error) {
          toast(
            error.message
          );
        }
      )
      .finally(
        function () {
          setButtonLoading(
            button,
            false
          );

          stopLoading();
        }
      );
  }


  /* =========================================================
   * APPLICATION WIZARD 1 → 2 → 3
   * ========================================================= */

  function openApplicationWizard(
    moduleData,
    options
  ) {
    const opts =
      options ||
      {};

    const draftId =
      opts.draft_id ||
      (
        'LOCAL-' +
        Date.now()
      );

    const preselectedAdmission =
      opts.admission_id ||
      '';

    applicationWizardState = {
      draft_id:
        draftId,

      application_id:
        opts.application_id ||
        '',

      step:
        Number(
          opts.step ||
          1
        ),

      module_data:
        moduleData,

      data:
        Object.assign(
          {
            admission_id:
              preselectedAdmission,

            target_id:
              '',

            source_type:
              'ADMIN',

            channel:
              navigator.onLine
                ? 'ONLINE'
                : 'OFFLINE_SYNC',

            full_name:
              '',

            nik:
              '',

            official_number:
              '',

            gender:
              '',

            birth_place:
              '',

            birth_date:
              '',

            previous_institution:
              '',

            previous_level:
              '',

            previous_graduation_year:
              '',

            guardians: [
              {
                guardian_name:
                  '',

                relationship:
                  '',

                is_primary:
                  true,

                phone:
                  '',

                email:
                  '',

                occupation:
                  '',

                address:
                  ''
              }
            ]
          },
          opts.data ||
          {}
        ),

      submit_requested:
        Boolean(
          opts.submit_requested
        ),

      pending_file_promises:
        [],

      autosave_promise:
        null,

      file_sync_chains:
        {},

      server_documents:
        Array.isArray(
          opts.server_documents
        )
          ? opts.server_documents
          : [],

      was_submitted:
        Boolean(
          opts.was_submitted
        )
    };

    renderApplicationWizard();
  }


  function renderApplicationWizard() {
    const state =
      applicationWizardState;

    const data =
      state.module_data;

    modal(
      `
        <div class="application-wizard">

          ${renderApplicationWizardStepper(
            state.step
          )}

          <div
            id="applicationWizardBody"
            class="application-wizard__body"
          >
            ${
              state.step ===
              1
                ? renderApplicationStepOne(
                    state,
                    data
                  )
                : state.step ===
                    2
                  ? renderApplicationStepTwo(
                      state
                    )
                  : renderApplicationStepThree(
                      state,
                      data
                    )
            }
          </div>


          <div class="wizard-actions">

            ${
              state.step >
              1
                ? `
                  <button
                    id="wizardBackButton"
                    class="secondary-button"
                    type="button"
                  >
                    <span class="material-symbols-rounded">
                      arrow_back
                    </span>

                    Kembali
                  </button>
                `
                : `
                  <button
                    class="secondary-button"
                    type="button"
                    data-modal-close
                  >
                    Batal
                  </button>
                `
            }

            <button
              id="wizardSaveDraftButton"
              class="secondary-button"
              type="button"
            >
              <span class="material-symbols-rounded">
                save
              </span>

              Simpan Draft
            </button>

            <button
              id="wizardNextButton"
              class="primary-button"
              type="button"
            >
              ${
                state.step <
                3
                  ? `
                    Lanjut

                    <span class="material-symbols-rounded">
                      arrow_forward
                    </span>
                  `
                  : state.was_submitted
                    ? `
                      <span class="material-symbols-rounded">
                        save
                      </span>

                      Simpan Perubahan
                    `
                    : `
                      <span class="material-symbols-rounded">
                        send
                      </span>

                      Kirim Pendaftaran
                    `
              }
            </button>

          </div>

        </div>
      `,
      'sheet'
    );

    bindApplicationWizardStep();

    document
      .getElementById(
        'wizardBackButton'
      )
      ?.addEventListener(
        'click',
        function () {
          saveCurrentWizardStepToState();

          applicationWizardState.step =
            Math.max(
              1,
              applicationWizardState.step -
              1
            );

          saveApplicationDraftOffline();

          renderApplicationWizard();
        }
      );

    document
      .getElementById(
        'wizardSaveDraftButton'
      )
      .addEventListener(
        'click',
        function () {
          saveCurrentWizardStepToState();

          saveApplicationWizard(
            false
          );
        }
      );

    document
      .getElementById(
        'wizardNextButton'
      )
      .addEventListener(
        'click',
        function () {
          if (
            !validateCurrentWizardStep()
          ) {
            return;
          }

          saveCurrentWizardStepToState();

          if (
            applicationWizardState.step <
            3
          ) {
            applicationWizardState.step +=
              1;

            saveApplicationDraftOffline();

            /*
             * PERFORMANCE:
             * pindah step langsung.
             * Save server berjalan di background dan tidak
             * memblokir form.
             */
            queueApplicationWizardAutosave();

            renderApplicationWizard();

            return;
          }

          saveApplicationWizard(
            true
          );
        }
      );
  }


  function renderApplicationWizardStepper(
    activeStep
  ) {
    const steps = [
      {
        number:
          1,

        title:
          'Data Santri',

        subtitle:
          'Identitas & asal pendidikan'
      },

      {
        number:
          2,

        title:
          'Data Wali',

        subtitle:
          'Kontak orang tua / wali'
      },

      {
        number:
          3,

        title:
          'Berkas & Review',

        subtitle:
          'Dokumen dan konfirmasi'
      }
    ];

    return `
      <div class="wizard-stepper">

        ${steps
          .map(
            function (step) {
              const state =
                step.number <
                activeStep
                  ? 'is-done'
                  : step.number ===
                      activeStep
                    ? 'is-active'
                    : '';

              return `
                <div class="wizard-step ${state}">

                  <span class="wizard-step__number">
                    ${
                      step.number <
                      activeStep
                        ? `
                          <span class="material-symbols-rounded">
                            check
                          </span>
                        `
                        : step.number
                    }
                  </span>

                  <span>

                    <strong>
                      ${escapeHtml(step.title)}
                    </strong>

                    <small>
                      ${escapeHtml(step.subtitle)}
                    </small>

                  </span>

                </div>
              `;
            }
          )
          .join('')}

      </div>
    `;
  }


  function renderApplicationStepOne(
    state,
    moduleData
  ) {
    const selectedAdmission =
      moduleData.admissions.find(
        function (item) {
          return (
            item.admission_id ===
            state.data.admission_id
          );
        }
      );

    return `
      <div class="wizard-section-head">

        <p class="section-kicker">
          LANGKAH 1
        </p>

        <h3>
          Data Santri / Peserta
        </h3>

        <p>
          Program dan Tingkat tidak diketik bebas.
          Nilainya mengikuti Target Jalur yang dipilih.
        </p>

      </div>


      <form
        id="applicationStepForm"
        class="form-grid"
      >

        <label class="field">

          <span>
            Jalur Pendaftaran
            <b class="required-mark">*</b>
          </span>

          <select
            id="wizardAdmissionSelect"
            class="select-input"
            name="admission_id"
            ${
              state.application_id
                ? 'disabled'
                : ''
            }
            required
          >

            <option value="">
              Pilih jalur
            </option>

            ${renderWizardAdmissionOptions(
              moduleData.admissions,
              state.data.admission_id
            )}

          </select>

          <small class="wizard-route-helper">
            ${wizardAdmissionHelperText(
              moduleData.admissions
            )}
          </small>

        </label>


        <label class="field">

          <span>
            Target Masuk
            <b class="required-mark">*</b>
          </span>

          <select
            id="wizardTargetSelect"
            class="select-input"
            name="target_id"
            ${
              state.application_id
                ? 'disabled'
                : ''
            }
            required
          >
            ${renderWizardTargetOptions(
              selectedAdmission,
              state.data.target_id
            )}
          </select>

        </label>


        <div
          id="wizardTargetPreview"
          class="wizard-target-preview is-full"
        >
          ${renderWizardTargetPreview(
            selectedAdmission,
            state.data.target_id
          )}
        </div>


        ${inputField(
          'Nama Lengkap',
          'full_name',
          state.data.full_name ||
          '',
          true
        )}


        ${inputField(
          'NIK',
          'nik',
          state.data.nik ||
          ''
        )}


        ${inputField(
          'NIS / NISN / NIM',
          'official_number',
          state.data.official_number ||
          ''
        )}


        <label class="field">

          <span>
            Jenis Kelamin
          </span>

          <select
            class="select-input"
            name="gender"
          >

            <option value="">
              Pilih
            </option>

            <option
              value="L"
              ${
                state.data.gender ===
                'L'
                  ? 'selected'
                  : ''
              }
            >
              Laki-laki
            </option>

            <option
              value="P"
              ${
                state.data.gender ===
                'P'
                  ? 'selected'
                  : ''
              }
            >
              Perempuan
            </option>

          </select>

        </label>


        ${inputField(
          'Tempat Lahir',
          'birth_place',
          state.data.birth_place ||
          ''
        )}


        ${inputField(
          'Tanggal Lahir',
          'birth_date',
          state.data.birth_date ||
          '',
          false,
          'date'
        )}


        <div class="form-section-label is-full">
          Pendidikan Sebelumnya
          <small>
            Data pendukung
          </small>
        </div>


        ${inputField(
          'Asal Sekolah / Institusi',
          'previous_institution',
          state.data.previous_institution ||
          ''
        )}


        ${inputField(
          'Jenjang / Tingkat Terakhir',
          'previous_level',
          state.data.previous_level ||
          ''
        )}


        ${inputField(
          'Tahun Lulus / Keluar',
          'previous_graduation_year',
          state.data.previous_graduation_year ||
          ''
        )}


        <label class="field is-full file-field">

          <span>
            Foto Santri / Peserta
            <b class="required-mark">*</b>
          </span>

          <input
            id="wizardPhotoInput"
            class="file-input"
            type="file"
            accept="image/*"
            data-wizard-file="PHOTO"
          >

          <small>
            Foto disimpan bersama draft.
            Wajib tersedia sebelum pendaftaran dikirim.
          </small>

          <span
            class="file-state"
            data-file-state="PHOTO"
          >
            Belum memilih file
          </span>

        </label>

      </form>
    `;
  }


  function wizardNormalizedStatus(
    value,
    fallback
  ) {
    return String(
      value ||
      fallback ||
      ''
    )
      .trim()
      .toUpperCase();
  }


  function wizardActiveTargets(
    admission
  ) {
    return (
      Array.isArray(
        admission?.targets
      )
        ? admission.targets
        : []
    ).filter(
      function (target) {
        const status =
          wizardNormalizedStatus(
            target.status,
            'ACTIVE'
          );

        return (
          status !==
            'DELETED' &&
          status !==
            'INACTIVE'
        );
      }
    );
  }


  function renderWizardAdmissionOptions(
    admissions,
    selectedAdmissionId
  ) {
    const rows =
      Array.isArray(
        admissions
      )
        ? admissions
        : [];

    return rows
      .filter(
        function (admission) {
          return (
            wizardNormalizedStatus(
              admission.status,
              'ACTIVE'
            ) !==
            'DELETED'
          );
        }
      )
      .map(
        function (admission) {
          const status =
            wizardNormalizedStatus(
              admission.status,
              'ACTIVE'
            );

          const activeTargets =
            wizardActiveTargets(
              admission
            );

          const selectable =
            status ===
              'ACTIVE' &&
            activeTargets.length >
              0;

          let reason =
            '';

          if (
            status !==
            'ACTIVE'
          ) {
            reason =
              ' — Jalur nonaktif';
          } else if (
            !activeTargets.length
          ) {
            reason =
              ' — Target masuk belum aktif';
          }

          return `
            <option
              value="${escapeHtml(admission.admission_id)}"
              ${
                String(
                  selectedAdmissionId ||
                  ''
                ) ===
                String(
                  admission.admission_id
                )
                  ? 'selected'
                  : ''
              }
              ${
                selectable
                  ? ''
                  : 'disabled'
              }
            >
              ${escapeHtml(admission.admission_name)}
              ${
                admission.period_name
                  ? ' • ' +
                    escapeHtml(
                      admission.period_name
                    )
                  : ''
              }
              ${escapeHtml(reason)}
            </option>
          `;
        }
      )
      .join('');
  }


  function wizardAdmissionHelperText(
    admissions
  ) {
    const rows =
      Array.isArray(
        admissions
      )
        ? admissions
        : [];

    const visible =
      rows.filter(
        function (admission) {
          return (
            wizardNormalizedStatus(
              admission.status,
              'ACTIVE'
            ) !==
            'DELETED'
          );
        }
      );

    const selectable =
      visible.filter(
        function (admission) {
          return (
            wizardNormalizedStatus(
              admission.status,
              'ACTIVE'
            ) ===
              'ACTIVE' &&
            wizardActiveTargets(
              admission
            ).length >
              0
          );
        }
      );

    if (
      selectable.length
    ) {
      return (
        selectable.length +
        ' jalur siap digunakan.'
      );
    }

    if (
      visible.length
    ) {
      return (
        visible.length +
        ' jalur ditemukan, tetapi belum memiliki target masuk aktif atau status jalurnya nonaktif.'
      );
    }

    return (
      'Belum ada jalur pendaftaran pada konteks Tahun Ajaran ini.'
    );
  }


  function renderWizardTargetOptions(
    admission,
    selectedTargetId
  ) {
    if (
      !admission
    ) {
      return `
        <option value="">
          Pilih jalur terlebih dahulu
        </option>
      `;
    }

    const activeTargets =
      wizardActiveTargets(
        admission
      );

    if (
      !activeTargets.length
    ) {
      return `
        <option value="">
          Target masuk belum tersedia
        </option>
      `;
    }

    return `
      <option value="">
        Pilih target
      </option>

      ${activeTargets
        .map(
          function (target) {
            return `
              <option
                value="${escapeHtml(target.target_id)}"
                ${
                  String(
                    selectedTargetId ||
                    ''
                  ) ===
                  String(
                    target.target_id
                  )
                    ? 'selected'
                    : ''
                }
              >
                ${escapeHtml(target.program_name)}
                •
                ${escapeHtml(target.level_name)}
              </option>
            `;
          }
        )
        .join('')}
    `;
  }

  function renderWizardTargetPreview(
    admission,
    targetId
  ) {
    const target =
      admission
        ? (
            admission.targets ||
            []
          ).find(
            function (item) {
              return (
                item.target_id ===
                targetId
              );
            }
          )
        : null;

    if (
      !target
    ) {
      return `
        <span class="material-symbols-rounded">
          info
        </span>

        <div>
          <strong>
            Program & Tingkat otomatis
          </strong>

          <small>
            Pilih target masuk.
          </small>
        </div>
      `;
    }

    return `
      <span class="material-symbols-rounded">
        auto_awesome
      </span>

      <div>

        <strong>
          ${escapeHtml(target.program_name)}
          •
          ${escapeHtml(target.level_name)}
        </strong>

        <small>
          ${
            target.default_entry_date
              ? 'Tanggal masuk default: ' +
                escapeHtml(
                  dateText(
                    target.default_entry_date
                  )
                )
              : 'Tanggal masuk efektif ditentukan sistem/admin saat aktivasi.'
          }
        </small>

      </div>
    `;
  }


  function renderApplicationStepTwo(
    state
  ) {
    const guardians =
      state.data.guardians &&
      state.data.guardians.length
        ? state.data.guardians
        : [
            {
              is_primary:
                true
            }
          ];

    const primary =
      guardians[0] ||
      {};

    const secondary =
      guardians[1] ||
      {};

    return `
      <div class="wizard-section-head">

        <p class="section-kicker">
          LANGKAH 2
        </p>

        <h3>
          Data Orang Tua / Wali
        </h3>

        <p>
          Minimal satu kontak utama harus tersedia.
        </p>

      </div>


      <form
        id="applicationStepForm"
        class="form-grid"
      >

        <div class="guardian-form-card is-full">

          <div class="guardian-form-card__head">

            <span class="material-symbols-rounded">
              contact_phone
            </span>

            <div>

              <strong>
                Wali Utama
              </strong>

              <small>
                Digunakan untuk komunikasi utama.
              </small>

            </div>

          </div>


          <div class="form-grid">

            ${inputField(
              'Nama Wali',
              'guardian_primary_name',
              primary.guardian_name ||
              '',
              true
            )}

            ${inputField(
              'Hubungan',
              'guardian_primary_relationship',
              primary.relationship ||
              '',
              true
            )}

            ${inputField(
              'No. HP / WhatsApp',
              'guardian_primary_phone',
              primary.phone ||
              '',
              true
            )}

            ${inputField(
              'Email',
              'guardian_primary_email',
              primary.email ||
              '',
              false,
              'email'
            )}

            ${inputField(
              'Pekerjaan',
              'guardian_primary_occupation',
              primary.occupation ||
              ''
            )}

            <label class="field is-full">

              <span>
                Alamat
              </span>

              <textarea
                class="textarea-input"
                name="guardian_primary_address"
              >${escapeHtml(primary.address || '')}</textarea>

            </label>

          </div>

        </div>


        <label class="toggle-field is-full">

          <input
            id="secondaryGuardianToggle"
            type="checkbox"
            ${
              guardians.length >
              1
                ? 'checked'
                : ''
            }
          >

          <span class="toggle-field__control"></span>

          <span>

            <strong>
              Tambahkan wali kedua
            </strong>

            <small>
              Opsional: ayah, ibu, atau wali lainnya.
            </small>

          </span>

        </label>


        <div
          id="secondaryGuardianFields"
          class="guardian-form-card is-full"
          ${
            guardians.length >
            1
              ? ''
              : 'hidden'
          }
        >

          <div class="guardian-form-card__head">

            <span class="material-symbols-rounded">
              person
            </span>

            <div>

              <strong>
                Wali Tambahan
              </strong>

              <small>
                Data kontak kedua.
              </small>

            </div>

          </div>


          <div class="form-grid">

            ${inputField(
              'Nama Wali',
              'guardian_secondary_name',
              secondary.guardian_name ||
              ''
            )}

            ${inputField(
              'Hubungan',
              'guardian_secondary_relationship',
              secondary.relationship ||
              ''
            )}

            ${inputField(
              'No. HP / WhatsApp',
              'guardian_secondary_phone',
              secondary.phone ||
              ''
            )}

            ${inputField(
              'Email',
              'guardian_secondary_email',
              secondary.email ||
              '',
              false,
              'email'
            )}

            ${inputField(
              'Pekerjaan',
              'guardian_secondary_occupation',
              secondary.occupation ||
              ''
            )}

            <label class="field is-full">

              <span>
                Alamat
              </span>

              <textarea
                class="textarea-input"
                name="guardian_secondary_address"
              >${escapeHtml(secondary.address || '')}</textarea>

            </label>

          </div>

        </div>

      </form>
    `;
  }


  function renderApplicationStepThree(
    state,
    moduleData
  ) {
    const admission =
      moduleData.admissions.find(
        function (item) {
          return (
            item.admission_id ===
            state.data.admission_id
          );
        }
      );

    const target =
      admission
        ? (
            admission.targets ||
            []
          ).find(
            function (item) {
              return (
                item.target_id ===
                state.data.target_id
              );
            }
          )
        : null;

    const socialRoute =
      admission &&
      (
        admission.admission_type ===
          'SOCIAL' ||
        admission.admission_type ===
          'SCHOLARSHIP'
      );

    return `
      <div class="wizard-section-head">

        <p class="section-kicker">
          LANGKAH 3
        </p>

        <h3>
          Berkas & Review
        </h3>

        <p>
          Berkas dapat diunggah sejak awal.
          Jika belum lengkap, pendaftaran tetap bisa masuk,
          tetapi tidak dapat melewati Verifikasi Berkas.
        </p>

      </div>


      <div class="document-upload-grid">

        ${applicationDocumentField(
          'KK',
          'Kartu Keluarga',
          'PDF / JPG / PNG'
        )}

        ${applicationDocumentField(
          'AKTA',
          'Akta Kelahiran',
          'PDF / JPG / PNG'
        )}

        ${applicationDocumentField(
          'PREV_EDU',
          'Berkas Jenjang Sebelumnya',
          'Ijazah / SKL / Rapor / Transkrip'
        )}

        ${applicationDocumentField(
          'KTP_GUARDIAN',
          'KTP Orang Tua / Wali',
          'Opsional'
        )}

        ${
          socialRoute
            ? applicationDocumentField(
                'SOCIAL_PROOF',
                'Berkas Pendukung Jalur Sosial / Beasiswa',
                'Surat yatim / dhuafa / rekomendasi / bukti lain'
              )
            : ''
        }

        ${applicationDocumentField(
          'OTHER',
          'Berkas Lainnya',
          'Opsional'
        )}

      </div>


      <div class="application-review-card">

        <p class="section-kicker">
          REVIEW
        </p>

        <div class="application-review-grid">

          ${reviewItem(
            'Nama',
            state.data.full_name
          )}

          ${reviewItem(
            'Jalur',
            admission
              ? admission.admission_name
              : '—'
          )}

          ${reviewItem(
            'Program',
            target
              ? target.program_name
              : '—'
          )}

          ${reviewItem(
            'Tingkat Masuk',
            target
              ? target.level_name
              : '—'
          )}

          ${reviewItem(
            'Wali Utama',
            state.data.guardians?.[0]?.guardian_name ||
            '—'
          )}

          ${reviewItem(
            'Kontak',
            state.data.guardians?.[0]?.phone ||
            '—'
          )}

        </div>

      </div>


      <label class="declaration-check">

        <input
          id="wizardDeclaration"
          type="checkbox"
          required
        >

        <span>

          <strong>
            Data sudah diperiksa
          </strong>

          <small>
            Data dapat diperbaiki kemudian oleh Admin.
            Origin T.A, Jalur, dan Target tetap dikunci.
          </small>

        </span>

      </label>
    `;
  }


  function applicationDocumentField(
    type,
    label,
    help
  ) {
    return `
      <label class="document-upload-card">

        <span class="document-upload-card__icon">

          <span class="material-symbols-rounded">
            upload_file
          </span>

        </span>

        <span class="document-upload-card__text">

          <strong>
            ${escapeHtml(label)}
          </strong>

          <small>
            ${escapeHtml(help)}
          </small>

          <span
            class="file-state"
            data-file-state="${escapeHtml(type)}"
          >
            Belum memilih file
          </span>

        </span>

        <input
          class="document-upload-card__input"
          type="file"
          accept=".pdf,image/*"
          data-wizard-file="${escapeHtml(type)}"
        >

      </label>
    `;
  }


  function reviewItem(
    label,
    value
  ) {
    return `
      <div>

        <span>
          ${escapeHtml(label)}
        </span>

        <strong>
          ${escapeHtml(value || '—')}
        </strong>

      </div>
    `;
  }


  function bindApplicationWizardStep() {
    const admissionSelect =
      document.getElementById(
        'wizardAdmissionSelect'
      );

    if (
      admissionSelect
    ) {
      const targetSelect =
        document.getElementById(
          'wizardTargetSelect'
        );

      admissionSelect.addEventListener(
        'change',
        function () {
          const admission =
            applicationWizardState
              .module_data
              .admissions
              .find(
                function (item) {
                  return (
                    item.admission_id ===
                    admissionSelect.value
                  );
                }
              );

          targetSelect.innerHTML =
            renderWizardTargetOptions(
              admission,
              ''
            );

          document
            .getElementById(
              'wizardTargetPreview'
            )
            .innerHTML =
              renderWizardTargetPreview(
                admission,
                ''
              );
        }
      );

      targetSelect.addEventListener(
        'change',
        function () {
          const admission =
            applicationWizardState
              .module_data
              .admissions
              .find(
                function (item) {
                  return (
                    item.admission_id ===
                    admissionSelect.value
                  );
                }
              );

          document
            .getElementById(
              'wizardTargetPreview'
            )
            .innerHTML =
              renderWizardTargetPreview(
                admission,
                targetSelect.value
              );
        }
      );
    }

    const secondaryToggle =
      document.getElementById(
        'secondaryGuardianToggle'
      );

    if (
      secondaryToggle
    ) {
      secondaryToggle.addEventListener(
        'change',
        function () {
          document
            .getElementById(
              'secondaryGuardianFields'
            )
            .hidden =
              !secondaryToggle.checked;
        }
      );
    }

    document
      .querySelectorAll(
        '[data-wizard-file]'
      )
      .forEach(
        function (input) {
          input.addEventListener(
            'change',
            function () {
              const file =
                input.files?.[0];

              if (
                !file
              ) {
                return;
              }

              const type =
                input.dataset.wizardFile;

              const stateLabel =
                document.querySelector(
                  `[data-file-state="${type}"]`
                );

              if (
                stateLabel
              ) {
                stateLabel.textContent =
                  'Menyimpan ke draft…';
              }

              const filePromise =
                window.EduOffline
                  .saveFile(
                    applicationWizardState.draft_id,
                    type,
                    file
                  )
                  .then(
                    function () {
                      if (
                        stateLabel
                      ) {
                        stateLabel.textContent =
                          file.name +
                          ' • tersimpan di perangkat';
                      }

                      /*
                       * File sudah aman secara lokal.
                       * Upload server berjalan background.
                       */
                      queueApplicationWizardSingleFileUpload(
                        type,
                        stateLabel
                      );
                    }
                  )
                  .catch(
                    function (error) {
                      toast(
                        error.message
                      );

                      throw error;
                    }
                  );

              applicationWizardState
                .pending_file_promises
                .push(
                  filePromise
                );
            }
          );
        }
      );

    restoreWizardFileStates();
  }


  function restoreWizardFileStates() {
    (
      applicationWizardState.server_documents ||
      []
    ).forEach(
      function (documentRow) {
        const label =
          document.querySelector(
            `[data-file-state="${documentRow.document_type}"]`
          );

        if (
          label
        ) {
          label.textContent =
            documentRow.file_name +
            ' • tersimpan di server';
        }
      }
    );

    window.EduOffline
      .getFiles(
        applicationWizardState.draft_id
      )
      .then(
        function (files) {
          files.forEach(
            function (fileRow) {
              const label =
                document.querySelector(
                  `[data-file-state="${fileRow.document_type}"]`
                );

              if (
                label
              ) {
                label.textContent =
                  fileRow.file_name +
                  ' • tersimpan di perangkat';
              }
            }
          );
        }
      );
  }


  function validateCurrentWizardStep() {
    const form =
      document.getElementById(
        'applicationStepForm'
      );

    if (
      form &&
      !form.reportValidity()
    ) {
      return false;
    }

    if (
      applicationWizardState.step ===
      3
    ) {
      const declaration =
        document.getElementById(
          'wizardDeclaration'
        );

      if (
        declaration &&
        !declaration.checked
      ) {
        toast(
          'Centang konfirmasi data sebelum mengirim.'
        );

        return false;
      }
    }

    return true;
  }


  function saveCurrentWizardStepToState() {
    const state =
      applicationWizardState;

    const form =
      document.getElementById(
        'applicationStepForm'
      );

    if (
      state.step ===
      1 &&
      form
    ) {
      const values =
        Object.fromEntries(
          new FormData(
            form
          ).entries()
        );

      Object.assign(
        state.data,
        values
      );

      if (
        state.application_id
      ) {
        state.data.admission_id =
          state.data.admission_id ||
          applicationWizardState.data.admission_id;

        state.data.target_id =
          state.data.target_id ||
          applicationWizardState.data.target_id;
      }

      return;
    }

    if (
      state.step ===
      2 &&
      form
    ) {
      const values =
        Object.fromEntries(
          new FormData(
            form
          ).entries()
        );

      const guardians = [
        {
          application_guardian_id:
            state.data.guardians?.[0]
              ?.application_guardian_id ||
            '',

          guardian_name:
            values.guardian_primary_name ||
            '',

          relationship:
            values.guardian_primary_relationship ||
            '',

          is_primary:
            true,

          phone:
            values.guardian_primary_phone ||
            '',

          email:
            values.guardian_primary_email ||
            '',

          occupation:
            values.guardian_primary_occupation ||
            '',

          address:
            values.guardian_primary_address ||
            ''
        }
      ];

      const secondaryEnabled =
        document.getElementById(
          'secondaryGuardianToggle'
        )?.checked;

      if (
        secondaryEnabled &&
        values.guardian_secondary_name
      ) {
        guardians.push(
          {
            application_guardian_id:
              state.data.guardians?.[1]
                ?.application_guardian_id ||
              '',

            guardian_name:
              values.guardian_secondary_name,

            relationship:
              values.guardian_secondary_relationship ||
              '',

            is_primary:
              false,

            phone:
              values.guardian_secondary_phone ||
              '',

            email:
              values.guardian_secondary_email ||
              '',

            occupation:
              values.guardian_secondary_occupation ||
              '',

            address:
              values.guardian_secondary_address ||
              ''
          }
        );
      }

      state.data.guardians =
        guardians;
    }
  }


  function saveApplicationDraftOffline() {
    if (
      !applicationWizardState
    ) {
      return Promise.resolve();
    }

    return window.EduOffline.saveDraft(
      applicationWizardState.draft_id,
      {
        application_id:
          applicationWizardState.application_id,

        step:
          applicationWizardState.step,

        data:
          applicationWizardState.data,

        submit_requested:
          applicationWizardState.submit_requested
      }
    );
  }


  function wizardApiRequestWithRetry(
    action,
    params,
    retries
  ) {
    const remaining =
      Number(
        retries == null
          ? 1
          : retries
      );

    return window.EduApi
      .request(
        action,
        params
      )
      .catch(
        function (error) {
          if (
            remaining <=
            0
          ) {
            throw error;
          }

          return new Promise(
            function (resolve) {
              window.setTimeout(
                resolve,
                1200
              );
            }
          ).then(
            function () {
              return wizardApiRequestWithRetry(
                action,
                params,
                remaining -
                  1
              );
            }
          );
        }
      );
  }


  function buildApplicationSyncContext() {
    return {
      draft_id:
        applicationWizardState.draft_id,

      application_id:
        applicationWizardState.application_id,

      step:
        applicationWizardState.step,

      data:
        JSON.parse(
          JSON.stringify(
            applicationWizardState.data
          )
        ),

      submit_requested:
        Boolean(
          applicationWizardState.submit_requested
        ),

      was_submitted:
        Boolean(
          applicationWizardState.was_submitted
        ),

      module_data:
        applicationWizardState.module_data
    };
  }


  function validWizardServerPayload(
    data
  ) {
    return Boolean(
      data &&
      data.full_name &&
      data.admission_id &&
      data.target_id
    );
  }


  function ensureApplicationServerRecord(
    context
  ) {
    const payload =
      Object.assign(
        {},
        context.data,
        {
          client_request_id:
            context.draft_id
        }
      );

    if (
      context.application_id
    ) {
      payload.application_id =
        context.application_id;
    }

    return wizardApiRequestWithRetry(
      'application.save',
      {
        token:
          getToken(),

        payload:
          payload
      },
      1
    )
      .then(
        function (response) {
          const ack =
            response.data;

          const application =
            ack.application ||
            {};

          context.application_id =
            application.application_id ||
            context.application_id;

          if (
            applicationWizardState &&
            applicationWizardState.draft_id ===
              context.draft_id
          ) {
            applicationWizardState.application_id =
              context.application_id;
          }

          return window.EduOffline
            .saveDraft(
              context.draft_id,
              {
                application_id:
                  context.application_id,

                step:
                  context.step,

                data:
                  context.data,

                submit_requested:
                  context.submit_requested
              }
            )
            .then(
              function () {
                optimisticPatchReceptionApplication(
                  context,
                  application
                );

                return application;
              }
            );
        }
      );
  }


  function queueApplicationWizardAutosave() {
    if (
      !applicationWizardState ||
      !navigator.onLine ||
      !validWizardServerPayload(
        applicationWizardState.data
      )
    ) {
      return Promise.resolve(
        null
      );
    }

    if (
      applicationWizardState.autosave_promise
    ) {
      return applicationWizardState.autosave_promise;
    }

    const context =
      buildApplicationSyncContext();

    const promise =
      ensureApplicationServerRecord(
        context
      )
        .then(
          function () {
            return uploadApplicationFilesFromContext(
              context,
              {
                only_type:
                  'PHOTO',

                silent:
                  true
              }
            );
          }
        )
        .catch(
          function () {
            /*
             * Autosave tidak mengganggu user.
             * Draft IndexedDB tetap menjadi sumber recovery.
             */
            return null;
          }
        )
        .finally(
          function () {
            if (
              applicationWizardState &&
              applicationWizardState.draft_id ===
                context.draft_id
            ) {
              applicationWizardState.autosave_promise =
                null;
            }
          }
        );

    applicationWizardState.autosave_promise =
      promise;

    return promise;
  }


  function queueApplicationWizardSingleFileUpload(
    documentType,
    stateLabel
  ) {
    if (
      !applicationWizardState ||
      !navigator.onLine
    ) {
      return;
    }

    const state =
      applicationWizardState;

    const previous =
      state.file_sync_chains[
        documentType
      ] ||
      Promise.resolve();

    state.file_sync_chains[
      documentType
    ] =
      previous
        .catch(
          function () {
            return null;
          }
        )
        .then(
          function () {
            if (
              stateLabel
            ) {
              stateLabel.textContent =
                'Mengunggah di background…';
            }

            return queueApplicationWizardAutosave();
          }
        )
        .then(
          function () {
            if (
              !state.application_id
            ) {
              return null;
            }

            const context =
              buildApplicationSyncContext();

            context.application_id =
              state.application_id;

            return uploadApplicationFilesFromContext(
              context,
              {
                only_type:
                  documentType,

                silent:
                  true
              }
            );
          }
        )
        .then(
          function () {
            if (
              stateLabel
            ) {
              stateLabel.textContent =
                'Tersimpan di server';
            }
          }
        )
        .catch(
          function () {
            if (
              stateLabel
            ) {
              stateLabel.textContent =
                'Tersimpan di perangkat • sinkronisasi tertunda';
            }
          }
        );
  }


  function saveApplicationWizard(
    submit
  ) {
    applicationWizardState.submit_requested =
      Boolean(
        submit
      );

    applicationWizardState.data.channel =
      navigator.onLine
        ? 'ONLINE'
        : 'OFFLINE_SYNC';

    const context =
      buildApplicationSyncContext();

    /*
     * OFFLINE-FIRST / OPTIMISTIC:
     *
     * Klik Simpan/Kirim tidak menunggu Apps Script.
     * Data masuk IndexedDB dulu, modal langsung ditutup.
     * Backend melakukan sinkronisasi setelahnya.
     */
    window.EduOffline
      .saveDraft(
        context.draft_id,
        {
          application_id:
            context.application_id,

          step:
            context.step,

          data:
            context.data,

          submit_requested:
            context.submit_requested
        }
      )
      .then(
        function () {
          closeModal();

          if (
            !navigator.onLine
          ) {
            toast(
              submit
                ? 'Pendaftaran aman di perangkat. Akan disinkronkan saat online.'
                : 'Draft tersimpan di perangkat.'
            );

            renderOfflineApplicationDrafts(
              context.module_data
            );

            return;
          }

          toast(
            submit
              ? 'Pendaftaran tersimpan. Sinkronisasi berkas berjalan di background.'
              : 'Draft tersimpan. Sinkronisasi server berjalan di background.'
          );

          runApplicationBackgroundSync(
            context,
            {
              announce:
                true
            }
          );
        }
      )
      .catch(
        function (error) {
          toast(
            'Draft lokal gagal disimpan: ' +
            error.message
          );
        }
      );
  }


  function runApplicationBackgroundSync(
    context,
    options
  ) {
    const opts =
      options ||
      {};

    if (
      !navigator.onLine ||
      !validWizardServerPayload(
        context.data
      )
    ) {
      return Promise.resolve(
        null
      );
    }

    return ensureApplicationServerRecord(
      context
    )
      .then(
        function () {
          /*
           * PHOTO didahulukan karena SUBMIT hanya
           * membutuhkan foto sebagai dokumen wajib awal.
           */
          return uploadApplicationFilesFromContext(
            context,
            {
              only_type:
                'PHOTO',

              silent:
                true
            }
          );
        }
      )
      .then(
        function () {
          if (
            !context.submit_requested ||
            context.was_submitted
          ) {
            return null;
          }

          return wizardApiRequestWithRetry(
            'application.submit',
            {
              token:
                getToken(),

              application_id:
                context.application_id
            },
            1
          )
            .then(
              function (response) {
                const application =
                  response.data.application ||
                  {};

                optimisticPatchReceptionApplication(
                  context,
                  application
                );

                if (
                  opts.announce
                ) {
                  toast(
                    'Pendaftaran berhasil dikirim: ' +
                    context.application_id
                  );
                }

                return application;
              }
            );
        }
      )
      .then(
        function () {
          /*
           * Dokumen selain PHOTO tidak memblokir submit.
           * Upload dilanjutkan satu-per-satu di background
           * agar Apps Script tidak dibanjiri request paralel.
           */
          return uploadApplicationFilesFromContext(
            context,
            {
              exclude_type:
                'PHOTO',

              silent:
                true
            }
          );
        }
      )
      .then(
        function () {
          return window.EduOffline
            .deleteDraft(
              context.draft_id
            );
        }
      )
      .then(
        function () {
          refreshReceptionHubSilently(
            false
          );

          return true;
        }
      )
      .catch(
        function (error) {
          /*
           * Jangan hapus draft.
           * Retry dengan client_request_id yang sama aman.
           */
          if (
            opts.announce
          ) {
            toast(
              'Sinkronisasi tertunda. Data tetap aman di perangkat. ' +
              error.message
            );
          }

          return false;
        }
      );
  }


  function uploadApplicationFilesFromContext(
    context,
    options
  ) {
    const opts =
      options ||
      {};

    if (
      !context.application_id
    ) {
      return Promise.resolve();
    }

    return window.EduOffline
      .getFiles(
        context.draft_id
      )
      .then(
        function (files) {
          let selected =
            files ||
            [];

          if (
            opts.only_type
          ) {
            selected =
              selected.filter(
                function (row) {
                  return (
                    String(
                      row.document_type
                    ) ===
                    String(
                      opts.only_type
                    )
                  );
                }
              );
          }

          if (
            opts.exclude_type
          ) {
            selected =
              selected.filter(
                function (row) {
                  return (
                    String(
                      row.document_type
                    ) !==
                    String(
                      opts.exclude_type
                    )
                  );
                }
              );
          }

          let chain =
            Promise.resolve();

          selected.forEach(
            function (row) {
              chain =
                chain.then(
                  function () {
                    const file =
                      new File(
                        [
                          row.blob
                        ],
                        row.file_name,
                        {
                          type:
                            row.mime_type ||
                            row.blob.type
                        }
                      );

                    const clientUploadId =
                      String(
                        row.id
                      ) +
                      '|' +
                      String(
                        row.updated_at ||
                        0
                      );

                    return window.EduUpload.send(
                      'upload.application_file',
                      {
                        token:
                          getToken(),

                        application_id:
                          context.application_id,

                        document_type:
                          row.document_type,

                        client_upload_id:
                          clientUploadId
                      },
                      file
                    );
                  }
                );
            }
          );

          return chain;
        }
      );
  }


  function optimisticPatchReceptionApplication(
    context,
    applicationAck
  ) {
    const cached =
      getPageCache(
        'reception_new'
      );

    if (
      !cached ||
      !context.application_id
    ) {
      return;
    }

    const admission =
      (
        cached.admissions ||
        []
      ).find(
        function (row) {
          return (
            String(
              row.admission_id
            ) ===
            String(
              context.data.admission_id
            )
          );
        }
      );

    const target =
      admission &&
      Array.isArray(
        admission.targets
      )
        ? admission.targets.find(
            function (row) {
              return (
                String(
                  row.target_id
                ) ===
                String(
                  context.data.target_id
                )
              );
            }
          )
        : null;

    const period =
      (
        cached.periods ||
        []
      ).find(
        function (row) {
          return (
            admission &&
            String(
              row.period_id
            ) ===
            String(
              admission.period_id
            )
          );
        }
      );

    const nextRow =
      Object.assign(
        {},
        context.data,
        applicationAck ||
        {},
        {
          application_id:
            context.application_id,

          entry_period_id:
            admission
              ? admission.period_id
              : '',

          admission_name:
            admission
              ? admission.admission_name
              : '',

          admission_code:
            admission
              ? admission.admission_code
              : '',

          admission_type:
            admission
              ? admission.admission_type
              : '',

          period_name:
            period
              ? period.period_name
              : '',

          program_name:
            target
              ? target.program_name
              : '',

          level_name:
            target
              ? target.level_name
              : '',

          status:
            applicationAck?.status ||
            'DRAFT',

          stage_code:
            applicationAck?.stage_code ||
            'REGISTRATION',

          stage_label:
            applicationAck?.stage_label ||
            'Pendaftaran',

          updated_at:
            applicationAck?.updated_at ||
            new Date().toISOString()
        }
      );

    const rows =
      Array.isArray(
        cached.applications
      )
        ? cached.applications.slice()
        : [];

    const index =
      rows.findIndex(
        function (row) {
          return (
            String(
              row.application_id
            ) ===
            String(
              context.application_id
            )
          );
        }
      );

    if (
      index >=
      0
    ) {
      rows[
        index
      ] =
        Object.assign(
          {},
          rows[
            index
          ],
          nextRow
        );

    } else {
      rows.unshift(
        nextRow
      );
    }

    const nextCache =
      Object.assign(
        {},
        cached,
        {
          applications:
            rows
        }
      );

    setPageCache(
      'reception_new',
      nextCache
    );

    window.EduOffline
      .saveCache(
        'reception_hub',
        nextCache
      )
      .catch(
        function () {}
      );

    if (
      activePage ===
      'reception_hub'
    ) {
      renderReceptionHub(
        nextCache
      );
    }
  }


  function syncPendingApplicationDraftsSilently(
    moduleData
  ) {
    if (
      !navigator.onLine
    ) {
      return;
    }

    window.EduOffline
      .listDrafts()
      .then(
        function (rows) {
          const eligible =
            (
              rows ||
              []
            )
              .filter(
                function (row) {
                  return (
                    row &&
                    row.data &&
                    validWizardServerPayload(
                      row.data.data
                    )
                  );
                }
              )
              .slice(
                0,
                3
              );

          let chain =
            Promise.resolve();

          eligible.forEach(
            function (row) {
              chain =
                chain.then(
                  function () {
                    return runApplicationBackgroundSync(
                      {
                        draft_id:
                          row.id,

                        application_id:
                          row.data.application_id ||
                          '',

                        step:
                          row.data.step ||
                          1,

                        data:
                          row.data.data ||
                          {},

                        submit_requested:
                          Boolean(
                            row.data.submit_requested
                          ),

                        was_submitted:
                          false,

                        module_data:
                          moduleData
                      },
                      {
                        announce:
                          false
                      }
                    );
                  }
                );
            }
          );

          return chain;
        }
      )
      .catch(
        function () {}
      );
  }


  /* =========================================================
   * OFFLINE DRAFT LIST
   * ========================================================= */

  function renderOfflineApplicationDrafts(
    moduleData
  ) {
    const root =
      document.getElementById(
        'admissionOfflineDraftArea'
      );

    if (
      !root
    ) {
      return;
    }

    window.EduOffline
      .listDrafts()
      .then(
        function (drafts) {
          if (
            !drafts.length
          ) {
            root.innerHTML =
              '';

            return;
          }

          root.innerHTML = `
            <div class="offline-draft-banner">

              <span class="offline-draft-banner__icon">
                <span class="material-symbols-rounded">
                  cloud_off
                </span>
              </span>

              <div>

                <strong>
                  ${drafts.length}
                  draft pendaftaran tersimpan di perangkat
                </strong>

                <small>
                  Bisa dilanjutkan tanpa mengisi ulang.
                </small>

              </div>

              <button
                class="secondary-button compact-button"
                type="button"
                data-resume-offline-draft="${escapeHtml(drafts[0].id)}"
              >
                Lanjutkan
              </button>

            </div>
          `;

          root
            .querySelector(
              '[data-resume-offline-draft]'
            )
            .addEventListener(
              'click',
              function () {
                const draft =
                  drafts[0];

                openApplicationWizard(
                  moduleData,
                  {
                    draft_id:
                      draft.id,

                    application_id:
                      draft.data.application_id ||
                      '',

                    step:
                      draft.data.step ||
                      1,

                    data:
                      draft.data.data ||
                      {},

                    submit_requested:
                      draft.data.submit_requested
                  }
                );
              }
            );
        }
      );
  }


  /* =========================================================
   * APPLICATION DETAIL + TIMELINE
   * ========================================================= */

  function openApplicationDetail(
    applicationId,
    moduleData
  ) {
    startLoading();

    window.EduApi
      .request(
        'application.get',
        {
          token:
            getToken(),

          application_id:
            applicationId
        }
      )
      .then(
        function (response) {
          renderApplicationDetail(
            response.data,
            moduleData
          );
        }
      )
      .catch(
        function (error) {
          toast(
            error.message
          );
        }
      )
      .finally(
        stopLoading
      );
  }


  function renderApplicationDetail(
    detail,
    moduleData
  ) {
    const application =
      detail.application;

    const complete =
      Boolean(
        application.document_status &&
        application.document_status.complete
      );

    modal(
      `
        <div class="application-detail">

          <div class="application-detail__hero">

            <span class="application-detail__avatar">
              ${escapeHtml(initials(application.full_name))}
            </span>

            <div>

              <span class="application-detail__id">
                ${escapeHtml(application.application_id)}
              </span>

              <h3>
                ${escapeHtml(application.full_name)}
              </h3>

              <p>
                ${escapeHtml(application.admission_name)}
                •
                ${escapeHtml(application.program_name)}
                •
                ${escapeHtml(application.level_name)}
              </p>

            </div>

            <span class="application-stage-badge">
              ${escapeHtml(application.stage_label)}
            </span>

          </div>


          <div class="application-detail-grid">

            ${detailItem(
              'T.A Masuk',
              application.period_name ||
              application.entry_period_id
            )}

            ${detailItem(
              'Jalur',
              application.admission_name
            )}

            ${detailItem(
              'Program',
              application.program_name
            )}

            ${detailItem(
              'Tingkat',
              application.level_name
            )}

            ${detailItem(
              'Status Berkas',
              complete
                ? 'Lengkap'
                : 'Belum Lengkap'
            )}

            ${detailItem(
              'Peserta ID',
              application.participant_id ||
              'Belum aktif'
            )}

          </div>


          <section class="timeline-card">

            <div class="card-head">

              <div>

                <p class="section-kicker">
                  TIMELINE
                </p>

                <h3>
                  Progres Pendaftaran
                </h3>

                <p>
                  Timeline ini nantinya juga dipakai Portal Wali.
                </p>

              </div>

            </div>

            <div class="application-timeline">

              ${detail.timeline
                .map(
                  function (stage) {
                    return `
                      <div
                        class="timeline-step ${
                          stage.state ===
                          'DONE'
                            ? 'is-done'
                            : stage.state ===
                                'CURRENT'
                              ? 'is-current'
                              : ''
                        }"
                      >

                        <span class="timeline-step__dot">

                          ${
                            stage.state ===
                            'DONE'
                              ? `
                                <span class="material-symbols-rounded">
                                  check
                                </span>
                              `
                              : ''
                          }

                        </span>

                        <span>

                          <strong>
                            ${escapeHtml(stage.label)}
                          </strong>

                          <small>
                            ${
                              stage.state ===
                              'DONE'
                                ? 'Selesai'
                                : stage.state ===
                                    'CURRENT'
                                  ? 'Sedang diproses'
                                  : 'Menunggu'
                            }
                          </small>

                        </span>

                      </div>
                    `;
                  }
                )
                .join('')}

            </div>

          </section>


          <section class="document-status-section">

            <div class="card-head">

              <div>

                <p class="section-kicker">
                  BERKAS
                </p>

                <h3>
                  Kelengkapan Dokumen
                </h3>

              </div>

            </div>

            <div class="document-status-list">

              ${renderApplicationDocumentStatus(
                detail
              )}

            </div>

          </section>


          <div class="application-detail-actions">

            ${
              application.stage_code ===
                'REGISTRATION' ||
              application.stage_code ===
                'DOCUMENT_VERIFICATION'
                ? `
                  <button
                    id="editApplicationButton"
                    class="secondary-button"
                    type="button"
                  >
                    <span class="material-symbols-rounded">
                      edit
                    </span>

                    Lengkapi Form
                  </button>
                `
                : ''
            }

            <button
              id="printApplicationButton"
              class="secondary-button"
              type="button"
            >
              <span class="material-symbols-rounded">
                print
              </span>

              Cetak Form
            </button>

            ${
              application.stage_code !==
              'ACTIVE'
                ? `
                  <button
                    id="advanceApplicationButton"
                    class="primary-button"
                    type="button"
                  >
                    Lanjut Tahap

                    <span class="material-symbols-rounded">
                      arrow_forward
                    </span>
                  </button>
                `
                : ''
            }

          </div>

        </div>
      `,
      'sheet'
    );

    document
      .getElementById(
        'editApplicationButton'
      )
      ?.addEventListener(
        'click',
        function () {
          const wizardData = {
            admission_id:
              application.admission_id,

            target_id:
              application.target_id,

            source_type:
              application.source_type ||
              'ADMIN',

            channel:
              navigator.onLine
                ? 'ONLINE'
                : 'OFFLINE_SYNC',

            full_name:
              application.full_name,

            nik:
              application.nik,

            official_number:
              application.official_number,

            gender:
              application.gender,

            birth_place:
              application.birth_place,

            birth_date:
              dateInput(
                application.birth_date
              ),

            previous_institution:
              application.previous_institution,

            previous_level:
              application.previous_level,

            previous_graduation_year:
              application.previous_graduation_year,

            guardians:
              detail.guardians ||
              []
          };

          openApplicationWizard(
            moduleData,
            {
              draft_id:
                'EDIT-' +
                application.application_id,

              application_id:
                application.application_id,

              step:
                1,

              data:
                wizardData,

              server_documents:
                detail.documents ||
                [],

              was_submitted:
                application.status !==
                'DRAFT'
            }
          );
        }
      );

    document
      .getElementById(
        'printApplicationButton'
      )
      .addEventListener(
        'click',
        function () {
          printApplication(
            application.application_id
          );
        }
      );

    document
      .getElementById(
        'advanceApplicationButton'
      )
      ?.addEventListener(
        'click',
        function () {
          advanceApplicationStage(
            application.application_id,
            moduleData
          );
        }
      );
  }


  function renderApplicationDocumentStatus(
    detail
  ) {
    const documents =
      detail.documents ||
      [];

    const admissionType =
      detail.application.admission_type;

    const types = [
      {
        code:
          'PHOTO',

        label:
          'Foto Santri / Peserta',

        required:
          true
      },

      {
        code:
          'KK',

        label:
          'Kartu Keluarga',

        required:
          true
      },

      {
        code:
          'AKTA',

        label:
          'Akta Kelahiran',

        required:
          true
      },

      {
        code:
          'PREV_EDU',

        label:
          'Berkas Jenjang Sebelumnya',

        required:
          true
      },

      {
        code:
          'KTP_GUARDIAN',

        label:
          'KTP Wali',

        required:
          false
      }
    ];

    if (
      admissionType ===
        'SOCIAL' ||
      admissionType ===
        'SCHOLARSHIP'
    ) {
      types.push(
        {
          code:
            'SOCIAL_PROOF',

          label:
            'Berkas Pendukung Jalur',

          required:
            true
        }
      );
    }

    return types
      .map(
        function (type) {
          const document =
            documents.find(
              function (row) {
                return (
                  row.document_type ===
                  type.code
                );
              }
            );

          return `
            <div class="document-status-row">

              <span class="document-status-row__icon">

                <span class="material-symbols-rounded">
                  ${
                    document
                      ? 'check_circle'
                      : 'pending'
                  }
                </span>

              </span>

              <span>

                <strong>
                  ${escapeHtml(type.label)}
                </strong>

                <small>
                  ${
                    type.required
                      ? 'Wajib sebelum Verifikasi Berkas selesai'
                      : 'Opsional'
                  }
                </small>

              </span>

              <span
                class="state-badge ${
                  document
                    ? 'is-ready'
                    : 'is-pending'
                }"
              >
                ${
                  document
                    ? 'ADA'
                    : 'BELUM'
                }
              </span>

            </div>
          `;
        }
      )
      .join('');
  }


  function printApplication(
    applicationId
  ) {
    startLoading();

    window.EduApi
      .request(
        'application.printlink',
        {
          token:
            getToken(),

          application_id:
            applicationId
        }
      )
      .then(
        function (response) {
          const url =
            response.data.print_url;

          window.open(
            url,
            '_blank',
            'noopener'
          );
        }
      )
      .catch(
        function (error) {
          toast(
            error.message
          );
        }
      )
      .finally(
        stopLoading
      );
  }


  function advanceApplicationStage(
    applicationId,
    moduleData
  ) {
    const button =
      document.getElementById(
        'advanceApplicationButton'
      );

    setButtonLoading(
      button,
      true,
      'Memproses…'
    );

    startLoading();

    window.EduApi
      .request(
        'application.stage',
        {
          token:
            getToken(),

          application_id:
            applicationId
        }
      )
      .then(
        function (response) {
          invalidatePageCache(
            'admissions'
          );

          invalidatePageCache(
            'reception_new'
          );

          invalidatePageCache(
            'participants'
          );

          invalidatePageCache(
            'dashboard'
          );

          toast(
            'Tahap berhasil diperbarui.'
          );

          renderApplicationDetail(
            response.data,
            moduleData
          );
        }
      )
      .catch(
        function (error) {
          toast(
            error.message
          );
        }
      )
      .finally(
        function () {
          setButtonLoading(
            button,
            false
          );

          stopLoading();
        }
      );
  }



  /* =========================================================
   * PENERIMAAN BARU — SAFE ADDITIVE MENU v0.3.1
   * =========================================================
   *
   * PENTING:
   * - Menu Periode lama TETAP ADA.
   * - Menu Pendaftaran lama TETAP ADA.
   * - Backend / schema / workflow lama TIDAK DIUBAH.
   * - Menu ini hanya menjadi workspace gabungan baru.
   */

  function loadReceptionNew(
    force
  ) {
    const cached =
      getPageCache(
        'reception_new'
      );

    if (
      cached &&
      !force
    ) {
      renderReceptionNew(
        cached
      );

      return;
    }

    if (
      !cached
    ) {
      showPageLoading(
        'Membuka Penerimaan…'
      );
    }

    startLoading();

    Promise.all([
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
      ),

      window.EduApi.request(
        'application.list',
        {
          token:
            getToken()
        }
      )
    ])
      .then(
        function (responses) {
          const data = {
            periods:
              Array.isArray(
                responses[0].data
              )
                ? responses[0].data
                : [],

            admissions:
              Array.isArray(
                responses[1].data
              )
                ? responses[1].data
                : [],

            applications:
              Array.isArray(
                responses[2].data
              )
                ? responses[2].data
                : []
          };

          setPageCache(
            'reception_new',
            data
          );

          renderReceptionNew(
            data
          );
        }
      )
      .catch(
        renderPageError
      )
      .finally(
        stopLoading
      );
  }


  function renderReceptionNew(
    data
  ) {
    const periods =
      receptionSortedPeriods(
        data.periods
      );

    if (
      receptionNewUiState.period_id &&
      !periods.some(
        function (period) {
          return (
            period.period_id ===
            receptionNewUiState.period_id
          );
        }
      )
    ) {
      receptionNewUiState.period_id =
        '';
    }

    if (
      !receptionNewUiState.period_id &&
      periods.length
    ) {
      const active =
        periods.find(
          function (period) {
            return (
              String(
                period.is_active
              ).toLowerCase() ===
              'true'
            );
          }
        );

      receptionNewUiState.period_id =
        (
          active ||
          periods[0]
        ).period_id;
    }

    const selectedPeriod =
      periods.find(
        function (period) {
          return (
            period.period_id ===
            receptionNewUiState.period_id
          );
        }
      ) ||
      null;

    pageContent.innerHTML = `
      <section class="reception-new-hero">

        <div class="reception-new-hero__identity">

          <span class="reception-new-hero__icon">
            <span class="material-symbols-rounded">
              event_note
            </span>
          </span>

          <div>

            <div class="reception-new-hero__eyebrow">
              <span>
                PENERIMAAN TERPADU
              </span>

              <span class="reception-new-beta">
                BARU
              </span>
            </div>

            <h2>
              Penerimaan
            </h2>

            <p>
              Tracking Tahun Ajaran, Jalur Pendaftaran,
              dan calon peserta dalam satu workspace.
            </p>

          </div>

        </div>

        <div class="reception-new-hero__actions">

          <button
            id="receptionNewPeriodButton"
            class="secondary-button"
            type="button"
          >
            <span class="material-symbols-rounded">
              add
            </span>

            Tambah T.A.
          </button>

          <button
            id="receptionNewApplicationButton"
            class="primary-button"
            type="button"
            ${
              selectedPeriod
                ? ''
                : 'disabled'
            }
          >
            <span class="material-symbols-rounded">
              person_add
            </span>

            Pendaftaran Baru
          </button>

        </div>

      </section>


      <div class="reception-new-safe-note">

        <span class="material-symbols-rounded">
          shield
        </span>

        <div>
          <strong>
            Mode baru tanpa menghapus menu lama
          </strong>

          <span>
            Periode dan Pendaftaran lama tetap tersedia sebagai fallback.
          </span>
        </div>

      </div>


      ${
        periods.length
          ? `
            <section class="reception-period-section">

              <div class="reception-section-head">

                <div>
                  <p class="section-kicker">
                    TAHUN AJARAN
                  </p>

                  <h3>
                    Tracking Penerimaan
                  </h3>

                  <p>
                    Klik Tahun Ajaran untuk membuka jalur dan pendaftarnya.
                  </p>
                </div>

              </div>

              <div class="reception-period-grid">

                ${periods
                  .map(
                    function (period) {
                      return receptionPeriodCard(
                        period,
                        data,
                        selectedPeriod &&
                        selectedPeriod.period_id ===
                          period.period_id
                      );
                    }
                  )
                  .join('')}

              </div>

            </section>


            ${
              selectedPeriod
                ? renderReceptionPeriodWorkspace(
                    selectedPeriod,
                    data
                  )
                : ''
            }
          `
          : `
            <article class="content-card">

              <div class="empty-state empty-state--large">

                <span class="empty-state__icon">
                  <span class="material-symbols-rounded">
                    calendar_add_on
                  </span>
                </span>

                <strong>
                  Belum ada Tahun Ajaran
                </strong>

                <p>
                  Tambahkan T.A pertama untuk mulai mengelola penerimaan.
                </p>

                <button
                  id="receptionEmptyPeriodButton"
                  class="primary-button"
                  type="button"
                >
                  Tambah T.A.
                </button>

              </div>

            </article>
          `
      }
    `;

    bindReceptionNew(
      data,
      selectedPeriod
    );
  }


  function receptionSortedPeriods(
    periods
  ) {
    return (
      periods ||
      []
    )
      .slice()
      .sort(
        function (a, b) {
          const aActive =
            String(
              a.is_active
            ).toLowerCase() ===
            'true'
              ? 1
              : 0;

          const bActive =
            String(
              b.is_active
            ).toLowerCase() ===
            'true'
              ? 1
              : 0;

          if (
            aActive !==
            bActive
          ) {
            return (
              bActive -
              aActive
            );
          }

          const aTime =
            new Date(
              a.start_date ||
              0
            ).getTime();

          const bTime =
            new Date(
              b.start_date ||
              0
            ).getTime();

          return (
            bTime -
            aTime
          );
        }
      );
  }


  function receptionPeriodCard(
    period,
    data,
    selected
  ) {
    const applications =
      receptionApplicationsForPeriod(
        data,
        period.period_id
      );

    const stats =
      receptionDecisionStats(
        applications
      );

    const routeCount =
      receptionAdmissionsForPeriod(
        data,
        period.period_id
      ).length;

    const active =
      String(
        period.is_active
      ).toLowerCase() ===
      'true';

    return `
      <button
        class="reception-period-card ${
          selected
            ? 'is-selected'
            : ''
        }"
        type="button"
        data-reception-period="${escapeHtml(period.period_id)}"
      >

        <span class="reception-period-card__head">

          <span>
            <strong>
              ${escapeHtml(period.period_name)}
            </strong>

            <small>
              ${numberFormat(routeCount)} jalur pendaftaran
            </small>
          </span>

          ${
            active
              ? `
                <span class="reception-period-active">
                  <span></span>
                  Aktif
                </span>
              `
              : ''
          }

        </span>

        <span class="reception-period-card__stats">

          ${receptionMiniMetric(
            'Calon Siswa',
            stats.total,
            'groups'
          )}

          ${receptionMiniMetric(
            'Diterima',
            stats.accepted,
            'check_circle'
          )}

          ${receptionMiniMetric(
            'Pertimbangan',
            stats.consideration,
            'schedule'
          )}

          ${receptionMiniMetric(
            'Bersyarat',
            stats.conditional,
            'verified_user'
          )}

          ${receptionMiniMetric(
            'Tidak Diterima',
            stats.rejected,
            'cancel'
          )}

        </span>

        <span class="reception-period-card__footer">
          <span>
            ${dateText(period.start_date)}
            —
            ${dateText(period.end_date)}
          </span>

          <span class="material-symbols-rounded">
            arrow_forward
          </span>
        </span>

      </button>
    `;
  }


  function receptionMiniMetric(
    label,
    value,
    icon
  ) {
    return `
      <span class="reception-mini-metric">

        <span class="material-symbols-rounded">
          ${escapeHtml(icon)}
        </span>

        <span>
          <small>
            ${escapeHtml(label)}
          </small>

          <strong>
            ${numberFormat(value)}
          </strong>
        </span>

      </span>
    `;
  }


  function renderReceptionPeriodWorkspace(
    period,
    data
  ) {
    const applications =
      receptionApplicationsForPeriod(
        data,
        period.period_id
      );

    const admissions =
      receptionAdmissionsForPeriod(
        data,
        period.period_id
      );

    const stats =
      receptionDecisionStats(
        applications
      );

    return `
      <section class="reception-workspace">

        <div class="reception-workspace__titlebar">

          <div>

            <div class="reception-workspace__meta">
              <span>
                ${escapeHtml(period.period_id)}
              </span>

              ${
                String(
                  period.is_active
                ).toLowerCase() ===
                'true'
                  ? '<span class="state-badge is-ready">AKTIF</span>'
                  : '<span class="state-badge is-pending">NONAKTIF</span>'
              }
            </div>

            <h3>
              ${escapeHtml(period.period_name)}
            </h3>

            <p>
              ${dateText(period.start_date)}
              —
              ${dateText(period.end_date)}
            </p>

          </div>

          <div class="reception-workspace__actions">

            <button
              id="receptionAddRouteButton"
              class="secondary-button"
              type="button"
            >
              <span class="material-symbols-rounded">
                add
              </span>

              Tambah Jalur
            </button>

            <button
              id="receptionEditPeriodButton"
              class="secondary-button"
              type="button"
            >
              <span class="material-symbols-rounded">
                edit_calendar
              </span>

              Edit T.A.
            </button>

          </div>

        </div>


        <div class="reception-important-note">

          <span class="material-symbols-rounded">
            info
          </span>

          <p>
            <strong>Pendaftar bukan berarti sudah diterima dan menjadi peserta aktif.</strong>
            Diterima tetap harus mengikuti Daftar Ulang sampai tahap Aktif.
          </p>

        </div>


        <div class="reception-tabs">

          ${receptionTabButton(
            'summary',
            'Ringkasan',
            'analytics',
            receptionNewUiState.tab ===
              'summary'
          )}

          ${receptionTabButton(
            'routes',
            'Jalur Pendaftaran',
            'account_tree',
            receptionNewUiState.tab ===
              'routes',
            admissions.length
          )}

          ${receptionTabButton(
            'applicants',
            'Pendaftar',
            'assignment_ind',
            receptionNewUiState.tab ===
              'applicants',
            applications.length
          )}

        </div>


        <div class="reception-tab-panel">

          ${
            receptionNewUiState.tab ===
            'summary'
              ? renderReceptionSummaryTab(
                  stats,
                  admissions,
                  applications
                )
              : receptionNewUiState.tab ===
                  'applicants'
                ? renderReceptionApplicantsTab(
                    period,
                    data,
                    applications,
                    admissions
                  )
                : renderReceptionRoutesTab(
                    period,
                    data,
                    admissions,
                    applications
                  )
          }

        </div>

      </section>
    `;
  }


  function receptionTabButton(
    id,
    label,
    icon,
    active,
    count
  ) {
    return `
      <button
        class="reception-tab ${
          active
            ? 'is-active'
            : ''
        }"
        type="button"
        data-reception-tab="${escapeHtml(id)}"
      >
        <span class="material-symbols-rounded">
          ${escapeHtml(icon)}
        </span>

        <span>
          ${escapeHtml(label)}
        </span>

        ${
          Number.isFinite(
            Number(count)
          )
            ? `
              <small>
                ${numberFormat(count)}
              </small>
            `
            : ''
        }
      </button>
    `;
  }


  function renderReceptionSummaryTab(
    stats,
    admissions,
    applications
  ) {
    return `
      <div class="reception-summary-layout">

        <article class="reception-summary-primary">

          <span class="reception-summary-primary__icon">
            <span class="material-symbols-rounded">
              groups
            </span>
          </span>

          <div>
            <small>
              CALON SISWA / PENDAFTAR
            </small>

            <strong>
              ${numberFormat(stats.total)}
            </strong>

            <p>
              Seluruh pendaftar pada T.A ini.
              Angka ini bukan jumlah peserta aktif.
            </p>
          </div>

        </article>


        <div class="reception-summary-decisions">

          ${receptionDecisionCard(
            'Diterima',
            stats.accepted,
            'check_circle',
            'Sudah mendapat keputusan diterima.'
          )}

          ${receptionDecisionCard(
            'Pertimbangan',
            stats.consideration,
            'schedule',
            'Belum mendapat keputusan akhir.'
          )}

          ${receptionDecisionCard(
            'Diterima Bersyarat',
            stats.conditional,
            'verified_user',
            'Diterima dengan syarat yang harus dipenuhi.'
          )}

          ${receptionDecisionCard(
            'Tidak Diterima',
            stats.rejected,
            'cancel',
            'Keputusan akhir tidak diterima.'
          )}

        </div>


        <article class="reception-summary-info">

          <div>
            <span class="material-symbols-rounded">
              account_tree
            </span>

            <span>
              <strong>
                ${numberFormat(admissions.length)}
              </strong>

              <small>
                Jalur Pendaftaran
              </small>
            </span>
          </div>

          <div>
            <span class="material-symbols-rounded">
              pending_actions
            </span>

            <span>
              <strong>
                ${numberFormat(
                  applications.filter(
                    function (application) {
                      return (
                        String(
                          application.stage_code
                        ) !==
                        'ACTIVE'
                      );
                    }
                  ).length
                )}
              </strong>

              <small>
                Belum Aktif
              </small>
            </span>
          </div>

          <div>
            <span class="material-symbols-rounded">
              school
            </span>

            <span>
              <strong>
                ${numberFormat(
                  applications.filter(
                    function (application) {
                      return (
                        String(
                          application.stage_code
                        ) ===
                        'ACTIVE'
                      );
                    }
                  ).length
                )}
              </strong>

              <small>
                Sudah Aktif
              </small>
            </span>
          </div>

        </article>

      </div>
    `;
  }


  function receptionDecisionCard(
    label,
    value,
    icon,
    subtitle
  ) {
    return `
      <article class="reception-decision-card">

        <span class="reception-decision-card__icon">
          <span class="material-symbols-rounded">
            ${escapeHtml(icon)}
          </span>
        </span>

        <span>
          <small>
            ${escapeHtml(label)}
          </small>

          <strong>
            ${numberFormat(value)}
          </strong>

          <p>
            ${escapeHtml(subtitle)}
          </p>
        </span>

      </article>
    `;
  }


  function renderReceptionRoutesTab(
    period,
    data,
    admissions,
    applications
  ) {
    if (
      !admissions.length
    ) {
      return `
        <div class="empty-state empty-state--large">

          <span class="empty-state__icon">
            <span class="material-symbols-rounded">
              account_tree
            </span>
          </span>

          <strong>
            Belum ada Jalur Pendaftaran
          </strong>

          <p>
            Tambahkan jalur untuk ${escapeHtml(period.period_name)}.
          </p>

          <button
            class="primary-button"
            type="button"
            data-reception-empty-route
          >
            Tambah Jalur
          </button>

        </div>
      `;
    }

    return `
      <div class="reception-route-panel">

        <div class="reception-section-head reception-section-head--compact">

          <div>
            <p class="section-kicker">
              JALUR PENDAFTARAN
            </p>

            <h3>
              Jalur pada ${escapeHtml(period.period_name)}
            </h3>

            <p>
              Target masuk dan ringkasan calon peserta per jalur.
            </p>
          </div>

          <button
            class="secondary-button"
            type="button"
            data-reception-add-route-inline
          >
            <span class="material-symbols-rounded">
              add
            </span>

            Tambah Jalur
          </button>

        </div>


        <div class="reception-route-grid">

          ${admissions
            .map(
              function (admission) {
                const routeApplications =
                  applications.filter(
                    function (application) {
                      return (
                        String(
                          application.admission_id
                        ) ===
                        String(
                          admission.admission_id
                        )
                      );
                    }
                  );

                return receptionRouteCard(
                  admission,
                  routeApplications
                );
              }
            )
            .join('')}

        </div>

      </div>
    `;
  }


  function receptionRouteCard(
    admission,
    applications
  ) {
    const stats =
      receptionDecisionStats(
        applications
      );

    const targets =
      Array.isArray(
        admission.targets
      )
        ? admission.targets
        : [];

    return `
      <article class="reception-route-card">

        <div class="reception-route-card__head">

          <span class="reception-route-card__icon">
            <span class="material-symbols-rounded">
              ${
                admission.admission_type ===
                'SOCIAL'
                  ? 'volunteer_activism'
                  : admission.admission_type ===
                      'SCHOLARSHIP'
                    ? 'workspace_premium'
                    : 'groups'
              }
            </span>
          </span>

          <div>
            <strong>
              ${escapeHtml(admission.admission_name)}
            </strong>

            <small>
              ${escapeHtml(admission.admission_id)}
            </small>
          </div>

          <span
            class="state-badge ${
              String(
                admission.status
              ) ===
              'ACTIVE'
                ? 'is-ready'
                : 'is-pending'
            }"
          >
            ${
              String(
                admission.status
              ) ===
              'ACTIVE'
                ? 'AKTIF'
                : 'NONAKTIF'
            }
          </span>

        </div>


        <div class="reception-route-card__targets">

          <span>
            Target Masuk
          </span>

          <div>
            ${
              targets.length
                ? targets
                    .map(
                      function (target) {
                        return `
                          <span class="reception-target-chip">
                            ${escapeHtml(target.program_name)}
                            <b>•</b>
                            ${escapeHtml(target.level_name)}
                          </span>
                        `;
                      }
                    )
                    .join('')
                : `
                  <span class="reception-target-chip is-empty">
                    Target belum diatur
                  </span>
                `
            }
          </div>

        </div>


        <div class="reception-route-card__stats">

          ${receptionRouteMetric(
            'Calon',
            stats.total
          )}

          ${receptionRouteMetric(
            'Diterima',
            stats.accepted
          )}

          ${receptionRouteMetric(
            'Pertimbangan',
            stats.consideration
          )}

          ${receptionRouteMetric(
            'Bersyarat',
            stats.conditional
          )}

          ${receptionRouteMetric(
            'Tidak Diterima',
            stats.rejected
          )}

        </div>


        <div class="reception-route-card__actions">

          <button
            class="secondary-button compact-button"
            type="button"
            data-reception-route-applicants="${escapeHtml(admission.admission_id)}"
          >
            Lihat Pendaftar
          </button>

          <button
            class="secondary-button compact-button"
            type="button"
            data-reception-edit-route="${escapeHtml(admission.admission_id)}"
          >
            <span class="material-symbols-rounded">
              edit
            </span>

            Edit Jalur
          </button>

        </div>

      </article>
    `;
  }


  function receptionRouteMetric(
    label,
    value
  ) {
    return `
      <span>
        <small>
          ${escapeHtml(label)}
        </small>

        <strong>
          ${numberFormat(value)}
        </strong>
      </span>
    `;
  }


  function renderReceptionApplicantsTab(
    period,
    data,
    applications,
    admissions
  ) {
    const routeFilter =
      receptionNewUiState.route_filter ||
      '';

    return `
      <div class="reception-applicant-panel">

        <div class="reception-section-head reception-section-head--compact">

          <div>
            <p class="section-kicker">
              CALON PESERTA
            </p>

            <h3>
              Pendaftar ${escapeHtml(period.period_name)}
            </h3>

            <p>
              Pendaftar tetap terpisah dari Master Peserta aktif.
            </p>
          </div>

          <button
            id="receptionApplicantNewButton"
            class="primary-button"
            type="button"
          >
            <span class="material-symbols-rounded">
              person_add
            </span>

            Pendaftaran Baru
          </button>

        </div>


        <div class="reception-applicant-toolbar">

          <div class="participant-search">

            <span class="material-symbols-rounded">
              search
            </span>

            <input
              id="receptionApplicantSearch"
              type="search"
              placeholder="Cari nama atau ID pendaftaran…"
            >

          </div>

          <select
            id="receptionApplicantRouteFilter"
            class="select-input"
          >
            <option value="">
              Semua Jalur
            </option>

            ${admissions
              .map(
                function (admission) {
                  return `
                    <option
                      value="${escapeHtml(admission.admission_id)}"
                      ${
                        routeFilter ===
                        admission.admission_id
                          ? 'selected'
                          : ''
                      }
                    >
                      ${escapeHtml(admission.admission_name)}
                    </option>
                  `;
                }
              )
              .join('')}
          </select>

          <select
            id="receptionApplicantDecisionFilter"
            class="select-input"
          >
            <option value="">
              Semua Keputusan
            </option>

            <option value="accepted">
              Diterima
            </option>

            <option value="consideration">
              Pertimbangan
            </option>

            <option value="conditional">
              Diterima Bersyarat
            </option>

            <option value="rejected">
              Tidak Diterima
            </option>
          </select>

        </div>


        <div
          id="receptionApplicantList"
          class="application-list reception-applicant-list"
        ></div>

      </div>
    `;
  }


  function renderReceptionApplicantRows(
    data
  ) {
    const root =
      document.getElementById(
        'receptionApplicantList'
      );

    if (
      !root
    ) {
      return;
    }

    const search =
      String(
        document
          .getElementById(
            'receptionApplicantSearch'
          )
          ?.value ||
        ''
      )
        .trim()
        .toLowerCase();

    const route =
      document
        .getElementById(
          'receptionApplicantRouteFilter'
        )
        ?.value ||
      '';

    const decision =
      document
        .getElementById(
          'receptionApplicantDecisionFilter'
        )
        ?.value ||
      '';

    receptionNewUiState.route_filter =
      route;

    const rows =
      receptionApplicationsForPeriod(
        data,
        receptionNewUiState.period_id
      )
        .filter(
          function (application) {
            if (
              route &&
              String(
                application.admission_id
              ) !==
              String(
                route
              )
            ) {
              return false;
            }

            if (
              decision &&
              receptionDecisionBucket(
                application
              ) !==
              decision
            ) {
              return false;
            }

            if (
              search
            ) {
              const text = [
                application.application_id,
                application.full_name,
                application.admission_name,
                application.program_name,
                application.level_name,
                application.stage_label
              ]
                .join(
                  ' '
                )
                .toLowerCase();

              if (
                !text.includes(
                  search
                )
              ) {
                return false;
              }
            }

            return true;
          }
        );

    if (
      !rows.length
    ) {
      root.innerHTML = `
        <div class="empty-state empty-state--large">

          <span class="empty-state__icon">
            <span class="material-symbols-rounded">
              assignment_ind
            </span>
          </span>

          <strong>
            Tidak ada pendaftar
          </strong>

          <p>
            Ubah filter atau tambahkan pendaftaran baru.
          </p>

        </div>
      `;

      return;
    }

    root.innerHTML =
      rows
        .map(
          function (application) {
            const bucket =
              receptionDecisionBucket(
                application
              );

            return `
              <button
                class="reception-applicant-row"
                type="button"
                data-reception-application="${escapeHtml(application.application_id)}"
              >

                <span class="reception-applicant-row__avatar">
                  ${escapeHtml(initials(application.full_name))}
                </span>

                <span class="reception-applicant-row__identity">
                  <strong>
                    ${escapeHtml(application.full_name)}
                  </strong>

                  <small>
                    ${escapeHtml(application.application_id)}
                  </small>
                </span>

                <span class="reception-applicant-row__route">
                  <strong>
                    ${escapeHtml(application.admission_name || '—')}
                  </strong>

                  <small>
                    ${escapeHtml(application.program_name || '—')}
                    •
                    ${escapeHtml(application.level_name || '—')}
                  </small>
                </span>

                <span class="reception-applicant-row__decision ${escapeHtml(bucket)}">
                  ${escapeHtml(receptionDecisionLabel(bucket))}
                </span>

                <span class="reception-applicant-row__stage">
                  ${escapeHtml(application.stage_label || 'Pendaftaran')}
                </span>

                <span class="material-symbols-rounded">
                  chevron_right
                </span>

              </button>
            `;
          }
        )
        .join('');

    root
      .querySelectorAll(
        '[data-reception-application]'
      )
      .forEach(
        function (button) {
          button.addEventListener(
            'click',
            function () {
              openApplicationDetail(
                button.dataset.receptionApplication,
                receptionModuleDataForPeriod(
                  data,
                  receptionNewUiState.period_id
                )
              );
            }
          );
        }
      );
  }


  function receptionDecisionStats(
    applications
  ) {
    const result = {
      total:
        0,

      accepted:
        0,

      consideration:
        0,

      conditional:
        0,

      rejected:
        0
    };

    (
      applications ||
      []
    ).forEach(
      function (application) {
        result.total +=
          1;

        const bucket =
          receptionDecisionBucket(
            application
          );

        result[bucket] +=
          1;
      }
    );

    return result;
  }


  function receptionDecisionBucket(
    application
  ) {
    const decision =
      String(
        application.decision_status ||
        application.decision ||
        ''
      )
        .trim()
        .toUpperCase();

    const status =
      String(
        application.status ||
        ''
      )
        .trim()
        .toUpperCase();

    const stage =
      String(
        application.stage_code ||
        ''
      )
        .trim()
        .toUpperCase();

    const combined =
      [
        decision,
        status
      ].join(
        '|'
      );

    if (
      [
        'CONDITIONAL_ACCEPTED',
        'ACCEPTED_CONDITIONAL',
        'ACCEPTED_WITH_CONDITION',
        'DITERIMA_DENGAN_SYARAT',
        'BERSYARAT'
      ].some(
        function (value) {
          return combined.includes(
            value
          );
        }
      )
    ) {
      return 'conditional';
    }

    if (
      [
        'REJECTED',
        'NOT_ACCEPTED',
        'DITOLAK',
        'TIDAK_DITERIMA'
      ].some(
        function (value) {
          return combined.includes(
            value
          );
        }
      )
    ) {
      return 'rejected';
    }

    if (
      [
        'ACCEPTED',
        'DITERIMA'
      ].some(
        function (value) {
          return combined.includes(
            value
          );
        }
      ) ||
      stage ===
        'REREGISTRATION' ||
      stage ===
        'ACTIVE'
    ) {
      return 'accepted';
    }

    /*
     * Seluruh pendaftar yang belum mendapat keputusan final
     * dimasukkan ke Pertimbangan / masih proses.
     * Ini menjaga total breakdown tetap mudah dibaca.
     */
    return 'consideration';
  }


  function receptionDecisionLabel(
    bucket
  ) {
    const labels = {
      accepted:
        'Diterima',

      consideration:
        'Pertimbangan',

      conditional:
        'Diterima Bersyarat',

      rejected:
        'Tidak Diterima'
    };

    return labels[bucket] ||
      'Pertimbangan';
  }


  function receptionApplicationsForPeriod(
    data,
    periodId
  ) {
    return (
      data.applications ||
      []
    ).filter(
      function (application) {
        return (
          String(
            application.entry_period_id
          ) ===
          String(
            periodId
          )
        );
      }
    );
  }


  function receptionAdmissionsForPeriod(
    data,
    periodId
  ) {
    return (
      data.admissions ||
      []
    ).filter(
      function (admission) {
        return (
          String(
            admission.period_id
          ) ===
          String(
            periodId
          )
        );
      }
    );
  }


  function receptionModuleDataForPeriod(
    data,
    periodId
  ) {
    return {
      periods:
        (
          data.periods ||
          []
        ).filter(
          function (period) {
            return (
              String(
                period.period_id
              ) ===
              String(
                periodId
              )
            );
          }
        ),

      admissions:
        receptionAdmissionsForPeriod(
          data,
          periodId
        ),

      applications:
        receptionApplicationsForPeriod(
          data,
          periodId
        )
    };
  }


  function bindReceptionNew(
    data,
    selectedPeriod
  ) {
    document
      .getElementById(
        'receptionNewPeriodButton'
      )
      ?.addEventListener(
        'click',
        function () {
          openReceptionPeriodForm(
            null
          );
        }
      );

    document
      .getElementById(
        'receptionEmptyPeriodButton'
      )
      ?.addEventListener(
        'click',
        function () {
          openReceptionPeriodForm(
            null
          );
        }
      );

    document
      .querySelectorAll(
        '[data-reception-period]'
      )
      .forEach(
        function (button) {
          button.addEventListener(
            'click',
            function () {
              receptionNewUiState.period_id =
                button.dataset.receptionPeriod;

              receptionNewUiState.route_filter =
                '';

              receptionNewUiState.tab =
                'routes';

              renderReceptionNew(
                data
              );
            }
          );
        }
      );

    document
      .querySelectorAll(
        '[data-reception-tab]'
      )
      .forEach(
        function (button) {
          button.addEventListener(
            'click',
            function () {
              receptionNewUiState.tab =
                button.dataset.receptionTab;

              renderReceptionNew(
                data
              );
            }
          );
        }
      );

    if (
      !selectedPeriod
    ) {
      return;
    }

    document
      .getElementById(
        'receptionNewApplicationButton'
      )
      ?.addEventListener(
        'click',
        function () {
          openReceptionApplicationWizard(
            data,
            selectedPeriod.period_id
          );
        }
      );

    document
      .getElementById(
        'receptionApplicantNewButton'
      )
      ?.addEventListener(
        'click',
        function () {
          openReceptionApplicationWizard(
            data,
            selectedPeriod.period_id
          );
        }
      );

    document
      .getElementById(
        'receptionAddRouteButton'
      )
      ?.addEventListener(
        'click',
        function () {
          openReceptionRouteForm(
            null,
            selectedPeriod
          );
        }
      );

    document
      .querySelector(
        '[data-reception-add-route-inline]'
      )
      ?.addEventListener(
        'click',
        function () {
          openReceptionRouteForm(
            null,
            selectedPeriod
          );
        }
      );

    document
      .querySelector(
        '[data-reception-empty-route]'
      )
      ?.addEventListener(
        'click',
        function () {
          openReceptionRouteForm(
            null,
            selectedPeriod
          );
        }
      );

    document
      .getElementById(
        'receptionEditPeriodButton'
      )
      ?.addEventListener(
        'click',
        function () {
          openReceptionPeriodForm(
            selectedPeriod
          );
        }
      );

    document
      .querySelectorAll(
        '[data-reception-edit-route]'
      )
      .forEach(
        function (button) {
          button.addEventListener(
            'click',
            function () {
              const admission =
                (
                  data.admissions ||
                  []
                ).find(
                  function (row) {
                    return (
                      row.admission_id ===
                      button.dataset.receptionEditRoute
                    );
                  }
                );

              if (
                admission
              ) {
                openReceptionRouteForm(
                  admission,
                  selectedPeriod
                );
              }
            }
          );
        }
      );

    document
      .querySelectorAll(
        '[data-reception-route-applicants]'
      )
      .forEach(
        function (button) {
          button.addEventListener(
            'click',
            function () {
              receptionNewUiState.route_filter =
                button.dataset.receptionRouteApplicants;

              receptionNewUiState.tab =
                'applicants';

              renderReceptionNew(
                data
              );
            }
          );
        }
      );

    [
      'receptionApplicantSearch',
      'receptionApplicantRouteFilter',
      'receptionApplicantDecisionFilter'
    ].forEach(
      function (id) {
        const element =
          document.getElementById(
            id
          );

        element?.addEventListener(
          'input',
          function () {
            renderReceptionApplicantRows(
              data
            );
          }
        );

        element?.addEventListener(
          'change',
          function () {
            renderReceptionApplicantRows(
              data
            );
          }
        );
      }
    );

    if (
      receptionNewUiState.tab ===
      'applicants'
    ) {
      renderReceptionApplicantRows(
        data
      );
    }
  }


  function openReceptionApplicationWizard(
    data,
    periodId
  ) {
    const moduleData =
      receptionModuleDataForPeriod(
        data,
        periodId
      );

    if (
      !moduleData.admissions.length
    ) {
      toast(
        'Buat Jalur Pendaftaran terlebih dahulu.'
      );

      return;
    }

    openApplicationWizard(
      moduleData,
      null
    );
  }


  /* =========================================================
   * PENERIMAAN BARU — FORM T.A.
   * ========================================================= */

  function openReceptionPeriodForm(
    row
  ) {
    modal(
      `
        <div class="reception-form-head">

          <span class="reception-form-head__icon">
            <span class="material-symbols-rounded">
              calendar_month
            </span>
          </span>

          <div>
            <p class="section-kicker">
              TAHUN AJARAN
            </p>

            <h3>
              ${
                row
                  ? 'Edit Tahun Ajaran'
                  : 'Tambah Tahun Ajaran'
              }
            </h3>

            <p>
              User mengisi kode sederhana. ID dibuat otomatis oleh sistem.
            </p>
          </div>

        </div>


        <form
          id="receptionPeriodForm"
          class="form-grid reception-clean-form"
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

          <div class="reception-auto-info is-full">
            <span class="material-symbols-rounded">
              lock
            </span>

            <div>
              <strong>
                ID Sistem
              </strong>

              <small>
                ${
                  row?.period_id
                    ? escapeHtml(row.period_id)
                    : 'Contoh: 26/27 → TA-2627'
                }
              </small>
            </div>
          </div>

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
                Jadikan T.A aktif
              </strong>

              <small>
                T.A aktif sebelumnya otomatis dinonaktifkan.
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
            id="saveReceptionPeriodButton"
            class="primary-button"
            type="button"
          >
            Simpan T.A.
          </button>

        </div>
      `,
      'sheet'
    );

    document
      .getElementById(
        'saveReceptionPeriodButton'
      )
      .addEventListener(
        'click',
        saveReceptionPeriod
      );
  }


  function saveReceptionPeriod() {
    const form =
      document.getElementById(
        'receptionPeriodForm'
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
        'saveReceptionPeriodButton'
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
      .then(
        function (response) {
          const rows =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];

          const saved =
            rows.find(
              function (period) {
                return (
                  String(
                    period.period_code
                  ) ===
                  String(
                    payload.period_code
                  )
                );
              }
            );

          if (
            saved
          ) {
            if (
              activePage ===
              'reception_hub'
            ) {
              receptionHubUiState.period_id =
                saved.period_id;

              receptionHubUiState.tab =
                'summary';
            } else {
              receptionNewUiState.period_id =
                saved.period_id;
            }
          }

          invalidatePageCache(
            'periods'
          );

          invalidatePageCache(
            'admissions'
          );

          invalidatePageCache(
            'reception_new'
          );

          invalidatePageCache(
            'dashboard'
          );

          closeModal();

          toast(
            'Tahun Ajaran berhasil disimpan.'
          );

          if (
            activePage ===
            'reception_hub'
          ) {
            loadReceptionHub(
              true
            );
          } else {
            loadReceptionNew(
              true
            );
          }
        }
      )
      .catch(
        function (error) {
          toast(
            error.message
          );
        }
      )
      .finally(
        function () {
          setButtonLoading(
            button,
            false
          );

          stopLoading();
        }
      );
  }


  /* =========================================================
   * PENERIMAAN BARU — FORM JALUR RAPIH
   * ========================================================= */

  function openReceptionRouteForm(
    item,
    period
  ) {
    const editing =
      Boolean(
        item
      );

    const targets =
      editing &&
      Array.isArray(
        item.targets
      ) &&
      item.targets.length
        ? item.targets
        : [
            {
              target_id:
                '',

              program_code:
                'SMP',

              program_name:
                'SMP / MTs',

              level_code:
                'K7',

              level_name:
                'Kelas 7',

              default_entry_date:
                ''
            }
          ];

    modal(
      `
        <div class="reception-form-head">

          <span class="reception-form-head__icon">
            <span class="material-symbols-rounded">
              account_tree
            </span>
          </span>

          <div>
            <p class="section-kicker">
              JALUR PENDAFTARAN
            </p>

            <h3>
              ${
                editing
                  ? 'Edit Jalur Pendaftaran'
                  : 'Tambah Jalur Pendaftaran'
              }
            </h3>

            <p>
              ${escapeHtml(period.period_name)} • Program dan tingkat ditentukan Admin.
            </p>
          </div>

        </div>


        <form
          id="receptionRouteForm"
          class="reception-clean-form"
        >

          <input
            type="hidden"
            name="admission_id"
            value="${escapeHtml(item?.admission_id || '')}"
          >

          <input
            type="hidden"
            name="period_id"
            value="${escapeHtml(period.period_id)}"
          >

          <input
            id="receptionRouteCode"
            type="hidden"
            name="admission_code"
            value="${escapeHtml(item?.admission_code || '')}"
          >

          <input
            id="receptionRouteName"
            type="hidden"
            name="admission_name"
            value="${escapeHtml(item?.admission_name || '')}"
          >

          <input
            id="receptionRouteType"
            type="hidden"
            name="admission_type"
            value="${escapeHtml(item?.admission_type || '')}"
          >


          <section class="reception-form-section">

            <div class="reception-form-section__head">
              <span class="reception-form-section__number">
                1
              </span>

              <div>
                <strong>
                  Identitas Jalur
                </strong>

                <small>
                  T.A dan ID sistem tidak perlu diketik ulang.
                </small>
              </div>
            </div>

            <div class="reception-route-identity-grid">

              <div class="reception-readonly-field">
                <span>
                  Tahun Ajaran
                </span>

                <strong>
                  ${escapeHtml(period.period_name)}
                </strong>

                <small>
                  ${escapeHtml(period.period_id)} • dikunci
                </small>
              </div>

              <label class="field">

                <span>
                  Jalur Pendaftaran
                  <b class="required-mark">*</b>
                </span>

                <select
                  id="receptionRoutePreset"
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

              </label>

            </div>

            <div
              id="receptionCustomRoute"
              class="custom-admission-fields"
              hidden
            >
              ${inputField(
                'Nama Jalur Lainnya',
                'reception_custom_name',
                '',
                false
              )}

              ${inputField(
                'Kode Singkat',
                'reception_custom_code',
                '',
                false
              )}
            </div>

            <div class="reception-route-meta">

              <span>
                <small>
                  Jalur
                </small>

                <strong id="receptionRoutePreviewName">
                  ${escapeHtml(item?.admission_name || 'Belum dipilih')}
                </strong>
              </span>

              <span>
                <small>
                  ID Otomatis
                </small>

                <strong id="receptionRoutePreviewId">
                  ${escapeHtml(item?.admission_id || 'Akan dibuat sistem')}
                </strong>
              </span>

              <span class="reception-lock-chip">
                <span class="material-symbols-rounded">
                  lock
                </span>

                Otomatis
              </span>

            </div>

          </section>


          <section class="reception-form-section">

            <div class="reception-form-section__head">

              <span class="reception-form-section__number">
                2
              </span>

              <div>
                <strong>
                  Target Masuk
                </strong>

                <small>
                  Program / Jenjang dan Tingkat ditetapkan di sini.
                </small>
              </div>

              <button
                id="receptionAddTargetButton"
                class="secondary-button compact-button reception-section-action"
                type="button"
              >
                <span class="material-symbols-rounded">
                  add
                </span>

                Tambah Target
              </button>

            </div>

            <div
              id="admissionTargetEditor"
              class="target-editor-list reception-target-editor"
            >
              ${renderAdmissionTargetEditorRows(
                targets
              )}
            </div>

          </section>


          <section class="reception-form-section">

            <div class="reception-form-section__head">

              <span class="reception-form-section__number">
                3
              </span>

              <div>
                <strong>
                  Periode Pendaftaran
                </strong>

                <small>
                  Opsional. Atur jika jalur hanya dibuka pada tanggal tertentu.
                </small>
              </div>

            </div>

            <div class="form-grid">
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
            </div>

          </section>


          <section class="reception-form-section">

            <div class="reception-form-section__head">

              <span class="reception-form-section__number">
                4
              </span>

              <div>
                <strong>
                  Status Jalur
                </strong>

                <small>
                  Jalur nonaktif tetap tersimpan tetapi tidak digunakan untuk pendaftaran baru.
                </small>
              </div>

            </div>

            <label class="field reception-status-field">
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
                    String(item?.status || 'ACTIVE') ===
                    'ACTIVE'
                      ? 'selected'
                      : ''
                  }
                >
                  Aktif
                </option>

                <option
                  value="INACTIVE"
                  ${
                    String(item?.status || '') ===
                    'INACTIVE'
                      ? 'selected'
                      : ''
                  }
                >
                  Tidak Aktif
                </option>
              </select>
            </label>

          </section>

        </form>


        <div class="modal-actions reception-modal-actions">

          <button
            class="secondary-button"
            type="button"
            data-modal-close
          >
            Batal
          </button>

          <button
            id="saveReceptionRouteButton"
            class="primary-button"
            type="button"
          >
            Simpan Jalur
          </button>

        </div>
      `,
      'sheet'
    );

    if (
      !editing
    ) {
      bindReceptionRoutePreset(
        period
      );
    }

    bindAdmissionTargetEditor();

    document
      .getElementById(
        'receptionAddTargetButton'
      )
      .addEventListener(
        'click',
        addAdmissionTargetRow
      );

    document
      .getElementById(
        'saveReceptionRouteButton'
      )
      .addEventListener(
        'click',
        function () {
          saveReceptionRoute(
            period
          );
        }
      );
  }


  function bindReceptionRoutePreset(
    period
  ) {
    const presetSelect =
      document.getElementById(
        'receptionRoutePreset'
      );

    const customRoot =
      document.getElementById(
        'receptionCustomRoute'
      );

    const customName =
      document.querySelector(
        '[name="reception_custom_name"]'
      );

    const customCode =
      document.querySelector(
        '[name="reception_custom_code"]'
      );

    function sync() {
      const preset =
        findAdmissionPreset(
          presetSelect.value
        );

      const custom =
        preset &&
        preset.code ===
        'OTHER';

      customRoot.hidden =
        !custom;

      customName.required =
        Boolean(
          custom
        );

      customCode.required =
        Boolean(
          custom
        );

      const code =
        custom
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

      const name =
        custom
          ? String(
              customName.value ||
              ''
            ).trim()
          : preset
            ? preset.name
            : '';

      const type =
        custom
          ? 'CUSTOM'
          : preset
            ? preset.type
            : '';

      document
        .getElementById(
          'receptionRouteCode'
        )
        .value =
          code;

      document
        .getElementById(
          'receptionRouteName'
        )
        .value =
          name;

      document
        .getElementById(
          'receptionRouteType'
        )
        .value =
          type;

      document
        .getElementById(
          'receptionRoutePreviewName'
        )
        .textContent =
          name ||
          'Belum dipilih';

      document
        .getElementById(
          'receptionRoutePreviewId'
        )
        .textContent =
          receptionRoutePreviewId(
            period,
            code
          );
    }

    presetSelect.addEventListener(
      'change',
      sync
    );

    customName.addEventListener(
      'input',
      sync
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

        sync();
      }
    );

    sync();
  }


  function receptionRoutePreviewId(
    period,
    code
  ) {
    if (
      !code
    ) {
      return 'Akan dibuat sistem';
    }

    const digits =
      String(
        period.period_code ||
        ''
      ).replace(
        /\D/g,
        ''
      );

    if (
      digits.length <
      4
    ) {
      return (
        'JP-…-' +
        code
      );
    }

    return (
      'JP-' +
      digits.slice(
        0,
        4
      ) +
      '-' +
      code
    );
  }


  function saveReceptionRoute(
    period
  ) {
    const form =
      document.getElementById(
        'receptionRouteForm'
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

    payload.period_id =
      period.period_id;

    payload.targets =
      collectAdmissionTargets();

    const button =
      document.getElementById(
        'saveReceptionRouteButton'
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
          token:
            getToken(),

          payload:
            payload
        }
      )
      .then(
        function () {
          invalidatePageCache(
            'admissions'
          );

          invalidatePageCache(
            'reception_new'
          );

          closeModal();

          toast(
            'Jalur Pendaftaran berhasil disimpan.'
          );

          if (
            activePage ===
            'reception_hub'
          ) {
            receptionHubUiState.tab =
              'routes';

            loadReceptionHub(
              true
            );
          } else {
            receptionNewUiState.tab =
              'routes';

            loadReceptionNew(
              true
            );
          }
        }
      )
      .catch(
        function (error) {
          toast(
            error.message
          );
        }
      )
      .finally(
        function () {
          setButtonLoading(
            button,
            false
          );

          stopLoading();
        }
      );
  }


  /* =========================================================
   * PENERIMAAN PESERTA — SAFE CANDIDATE v0.3.2
   * ========================================================= */

  function loadReceptionHub(
    force
  ) {
    const memoryCache =
      getPageCache(
        'reception_new'
      );

    if (
      memoryCache
    ) {
      /*
       * CACHE FIRST:
       * tampilkan data yang sudah ada sebelum backend bergerak.
       */
      renderReceptionHub(
        memoryCache
      );

      refreshReceptionHubSilently(
        Boolean(
          force
        )
      );

      return;
    }

    /*
     * Tidak memakai global loading overlay.
     * Coba data IndexedDB terlebih dahulu.
     */
    renderReceptionHubWarmShell();

    window.EduOffline
      .getCache(
        'reception_hub',
        24 *
        60 *
        60 *
        1000
      )
      .then(
        function (cached) {
          if (
            cached
          ) {
            setPageCache(
              'reception_new',
              cached
            );

            renderReceptionHub(
              cached
            );
          }

          return refreshReceptionHubSilently(
            Boolean(
              force
            )
          );
        }
      )
      .catch(
        function () {
          refreshReceptionHubSilently(
            Boolean(
              force
            )
          );
        }
      );
  }


  function renderReceptionHubWarmShell() {
    pageContent.innerHTML = `
      <section class="rx-hero rx-hero--warm">
        <div>
          <p class="rx-kicker">
            PENERIMAAN PESERTA
          </p>

          <h2>
            Menyiapkan workspace penerimaan…
          </h2>

          <p>
            Data terakhir akan langsung tampil jika sudah pernah dibuka.
            Server memperbarui data di background.
          </p>
        </div>
      </section>
    `;
  }


  function refreshReceptionHubSilently(
    force
  ) {
    if (
      !navigator.onLine
    ) {
      return Promise.resolve(
        null
      );
    }

    return window.EduApi
      .request(
        'reception.bootstrap',
        {
          token:
            getToken(),

          force:
            force
              ? '1'
              : ''
        }
      )
      .then(
        function (response) {
          const data =
            response.data ||
            {
              periods:
                [],

              admissions:
                [],

              applications:
                []
            };

          setPageCache(
            'reception_new',
            data
          );

          window.EduOffline
            .saveCache(
              'reception_hub',
              data
            )
            .catch(
              function () {}
            );

          if (
            activePage ===
            'reception_hub'
          ) {
            renderReceptionHub(
              data
            );
          }

          syncPendingApplicationDraftsSilently(
            data
          );

          return data;
        }
      )
      .catch(
        function (error) {
          const cached =
            getPageCache(
              'reception_new'
            );

          if (
            !cached &&
            activePage ===
              'reception_hub'
          ) {
            pageContent.innerHTML = `
              <div class="rx-sync-error">
                <span class="material-symbols-rounded">
                  cloud_off
                </span>

                <strong>
                  Server sedang lambat
                </strong>

                <p>
                  Data lokal tetap aman. Coba refresh beberapa saat lagi.
                </p>
              </div>
            `;
          }

          return null;
        }
      );
  }


  function renderReceptionHub(data) {
    const periods = receptionSortedPeriods(data.periods);

    if (
      receptionHubUiState.period_id &&
      !periods.some(function (period) {
        return String(period.period_id) === String(receptionHubUiState.period_id);
      })
    ) {
      receptionHubUiState.period_id = '';
    }

    if (!receptionHubUiState.period_id) {
      renderReceptionHubIndex(periods, data);
      return;
    }

    const period = periods.find(function (row) {
      return String(row.period_id) === String(receptionHubUiState.period_id);
    });

    if (!period) {
      receptionHubUiState.period_id = '';
      renderReceptionHubIndex(periods, data);
      return;
    }

    renderReceptionHubRoom(period, data);
  }


  function renderReceptionHubIndex(periods, data) {
    const activePeriod =
      periods.find(function (period) {
        return String(period.is_active).toLowerCase() === 'true';
      }) || periods[0] || null;

    pageContent.innerHTML = `
      ${receptionHubIndexHero(activePeriod, data)}

      <section class="rx-section">
        <div class="rx-section__head">
          <div>
            <p class="rx-kicker">MASTER PENERIMAAN</p>
            <h3>Tahun Ajaran</h3>
            <p>
              Klik satu Tahun Ajaran untuk membuka room Ringkasan,
              Jalur Pendaftaran, dan Pendaftar.
            </p>
          </div>

          <button
            id="rxAddPeriodButton"
            class="rx-button rx-button--secondary"
            type="button"
          >
            <span class="material-symbols-rounded">add</span>
            Tambah Tahun Ajaran
          </button>
        </div>

        ${
          periods.length
            ? `
              <div class="rx-table" role="table">
                <div class="rx-table__head" role="row">
                  <span>Tahun Ajaran</span>
                  <span>Status</span>
                  <span>Jalur</span>
                  <span>Calon</span>
                  <span>Diterima</span>
                  <span>Pertimbangan</span>
                  <span>Bersyarat</span>
                  <span>Tidak Diterima</span>
                  <span>Aksi</span>
                </div>

                <div class="rx-table__body">
                  ${periods.map(function (period) {
                    return receptionHubPeriodRow(period, data);
                  }).join('')}
                </div>
              </div>
            `
            : receptionHubEmpty(
                'calendar_add_on',
                'Belum ada Tahun Ajaran',
                'Tambahkan Tahun Ajaran pertama untuk mulai mengelola penerimaan peserta.',
                'rxEmptyPeriodButton',
                'Tambah Tahun Ajaran'
              )
        }
      </section>

      <div class="rx-principle">
        <span class="rx-principle__icon">
          <span class="material-symbols-rounded">verified_user</span>
        </span>
        <div>
          <strong>Pendaftar bukan Peserta Aktif</strong>
          <p>
            Diterima belum membuat calon peserta masuk Master Peserta.
            Aktivasi tetap mengikuti workflow sampai tahap Aktif.
          </p>
        </div>
      </div>
    `;

    bindReceptionHubIndex(data, activePeriod);
  }


  function receptionHubIndexHero(activePeriod, data) {
    return `
      <section class="rx-hero">
        <div class="rx-hero__ring rx-hero__ring--a"></div>
        <div class="rx-hero__ring rx-hero__ring--b"></div>

        <div class="rx-hero__top">
          <span class="rx-hero__icon">
            <span class="material-symbols-rounded">person_search</span>
          </span>

          <span class="rx-hero__badge">
            <span></span>
            Kandidat Workspace
          </span>
        </div>

        <div class="rx-hero__grid">
          <div>
            <p class="rx-hero__kicker">PENERIMAAN PESERTA</p>
            <h2>Tracking penerimaan dalam satu alur yang jelas.</h2>
            <p class="rx-hero__copy">
              Mulai dari Tahun Ajaran, buka jalur, lalu pantau calon peserta
              dan keputusan tanpa mencampurnya dengan Peserta Aktif.
            </p>
          </div>

          <div class="rx-hero__side">
            <div class="rx-hero__metrics">
              ${receptionHubHeroMetric(
                'calendar_month',
                activePeriod ? activePeriod.period_name : '—',
                'Tahun aktif'
              )}
              ${receptionHubHeroMetric(
                'account_tree',
                numberFormat((data.admissions || []).length),
                'Total jalur'
              )}
              ${receptionHubHeroMetric(
                'groups',
                numberFormat((data.applications || []).length),
                'Total calon'
              )}
            </div>

            <div class="rx-hero__actions">
              <button
                id="rxHeroPeriodButton"
                class="rx-hero-button rx-hero-button--secondary"
                type="button"
              >
                <span class="material-symbols-rounded">add</span>
                Tambah T.A.
              </button>

              <button
                id="rxHeroApplicationButton"
                class="rx-hero-button rx-hero-button--primary"
                type="button"
                ${activePeriod ? '' : 'disabled'}
              >
                <span class="material-symbols-rounded">person_add</span>
                Pendaftaran Baru
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }


  function receptionHubHeroMetric(icon, value, label) {
    return `
      <span class="rx-hero-metric">
        <span class="material-symbols-rounded">${escapeHtml(icon)}</span>
        <span>
          <strong>${escapeHtml(String(value))}</strong>
          <small>${escapeHtml(label)}</small>
        </span>
      </span>
    `;
  }


  function receptionHubPeriodRow(period, data) {
    const applications = receptionApplicationsForPeriod(data, period.period_id);
    const stats = receptionDecisionStats(applications);
    const routeCount = receptionAdmissionsForPeriod(data, period.period_id).length;
    const active = String(period.is_active).toLowerCase() === 'true';

    return `
      <button
        class="rx-table__row"
        type="button"
        data-rx-period="${escapeHtml(period.period_id)}"
      >
        <span class="rx-table__identity" data-label="Tahun Ajaran">
          <span class="rx-table__identity-icon">
            <span class="material-symbols-rounded">calendar_month</span>
          </span>
          <span>
            <strong>${escapeHtml(period.period_name)}</strong>
            <small>
              ${escapeHtml(period.period_id)} •
              ${dateText(period.start_date)} — ${dateText(period.end_date)}
            </small>
          </span>
        </span>

        <span data-label="Status">
          ${receptionHubStatus(active)}
        </span>

        ${receptionHubCell('Jalur', routeCount, 'account_tree')}
        ${receptionHubCell('Calon', stats.total, 'groups')}
        ${receptionHubCell('Diterima', stats.accepted, 'check_circle')}
        ${receptionHubCell('Pertimbangan', stats.consideration, 'schedule')}
        ${receptionHubCell('Bersyarat', stats.conditional, 'verified')}
        ${receptionHubCell('Tidak Diterima', stats.rejected, 'cancel')}

        <span class="rx-table__open" data-label="Aksi">
          <span>Buka</span>
          <span class="material-symbols-rounded">arrow_forward</span>
        </span>
      </button>
    `;
  }


  function receptionHubCell(label, value, icon) {
    return `
      <span class="rx-table__metric" data-label="${escapeHtml(label)}">
        <span class="material-symbols-rounded">${escapeHtml(icon)}</span>
        <strong>${numberFormat(value)}</strong>
      </span>
    `;
  }


  function receptionHubStatus(active) {
    return `
      <span class="rx-status ${active ? 'is-active' : 'is-inactive'}">
        <span></span>
        ${active ? 'Aktif' : 'Nonaktif'}
      </span>
    `;
  }


  function bindReceptionHubIndex(data, activePeriod) {
    ['rxAddPeriodButton', 'rxEmptyPeriodButton', 'rxHeroPeriodButton']
      .forEach(function (id) {
        document.getElementById(id)?.addEventListener('click', function () {
          openReceptionHubPeriodForm(null);
        });
      });

    document.getElementById('rxHeroApplicationButton')
      ?.addEventListener('click', function () {
        if (activePeriod) {
          openReceptionApplicationWizard(data, activePeriod.period_id);
        }
      });

    document.querySelectorAll('[data-rx-period]').forEach(function (button) {
      button.addEventListener('click', function () {
        receptionHubUiState.period_id = button.dataset.rxPeriod;
        receptionHubUiState.tab = 'summary';
        receptionHubUiState.route_filter = '';
        receptionHubUiState.stage_filter = '';
        receptionHubUiState.decision_filter = '';
        receptionHubUiState.search = '';
        renderReceptionHub(data);
      });
    });
  }


  function renderReceptionHubRoom(period, data) {
    const applications = receptionApplicationsForPeriod(data, period.period_id);
    const admissions = receptionAdmissionsForPeriod(data, period.period_id);
    const stats = receptionDecisionStats(applications);

    pageContent.innerHTML = `
      <div class="rx-breadcrumb">
        <button id="rxBackButton" class="rx-back" type="button">
          <span class="material-symbols-rounded">arrow_back</span>
          Semua Tahun Ajaran
        </button>
        <span class="material-symbols-rounded">chevron_right</span>
        <strong>${escapeHtml(period.period_name)}</strong>
      </div>

      ${receptionHubRoomHero(period, stats, admissions.length)}

      <div class="rx-principle rx-principle--room">
        <span class="rx-principle__icon">
          <span class="material-symbols-rounded">info</span>
        </span>
        <div>
          <strong>Keputusan penerimaan berbeda dari status Peserta Aktif</strong>
          <p>
            Diterima, Pertimbangan, Bersyarat, dan Tidak Diterima adalah hasil penerimaan.
            Hanya tahap Aktif yang masuk Master Peserta.
          </p>
        </div>
      </div>

      <nav class="rx-tabs">
        ${receptionHubTab('summary', 'Ringkasan', 'analytics', receptionHubUiState.tab === 'summary')}
        ${receptionHubTab('routes', 'Jalur Pendaftaran', 'account_tree', receptionHubUiState.tab === 'routes', admissions.length)}
        ${receptionHubTab('applicants', 'Pendaftar', 'groups', receptionHubUiState.tab === 'applicants', applications.length)}
      </nav>

      <div>
        ${
          receptionHubUiState.tab === 'routes'
            ? renderReceptionHubRoutes(period, admissions, applications)
            : receptionHubUiState.tab === 'applicants'
              ? renderReceptionHubApplicants(period, admissions, applications)
              : renderReceptionHubSummary(period, admissions, applications, stats)
        }
      </div>
    `;

    bindReceptionHubRoom(period, data, admissions, applications);
  }


  function receptionHubRoomHero(period, stats, routeCount) {
    const active = String(period.is_active).toLowerCase() === 'true';

    return `
      <section class="rx-room-hero">
        <div>
          <div class="rx-room-hero__top">
            <span class="rx-room-hero__icon">
              <span class="material-symbols-rounded">calendar_month</span>
            </span>
            ${receptionHubStatus(active)}
          </div>
          <p class="rx-room-hero__kicker">ROOM PENERIMAAN</p>
          <h2>${escapeHtml(period.period_name)}</h2>
          <p class="rx-room-hero__copy">
            ${dateText(period.start_date)} — ${dateText(period.end_date)} •
            ${escapeHtml(period.period_id)}
          </p>
        </div>

        <div class="rx-room-hero__side">
          <div class="rx-room-hero__metrics">
            ${receptionHubRoomMetric('Calon', stats.total)}
            ${receptionHubRoomMetric('Jalur', routeCount)}
            ${receptionHubRoomMetric('Diterima', stats.accepted)}
          </div>
          <div class="rx-room-hero__actions">
            <button id="rxAddRouteButton" class="rx-hero-button rx-hero-button--secondary" type="button">
              <span class="material-symbols-rounded">add</span>
              Tambah Jalur
            </button>
            <button id="rxNewApplicationButton" class="rx-hero-button rx-hero-button--primary" type="button">
              <span class="material-symbols-rounded">person_add</span>
              Pendaftaran Baru
            </button>
          </div>
        </div>
      </section>
    `;
  }


  function receptionHubRoomMetric(label, value) {
    return `
      <span>
        <small>${escapeHtml(label)}</small>
        <strong>${numberFormat(value)}</strong>
      </span>
    `;
  }


  function receptionHubTab(tab, label, icon, active, count) {
    return `
      <button
        class="rx-tab ${active ? 'is-active' : ''}"
        type="button"
        data-rx-tab="${escapeHtml(tab)}"
      >
        <span class="material-symbols-rounded">${escapeHtml(icon)}</span>
        <strong>${escapeHtml(label)}</strong>
        ${Number.isFinite(Number(count)) ? `<span class="rx-tab__count">${numberFormat(count)}</span>` : ''}
      </button>
    `;
  }


  function renderReceptionHubSummary(period, admissions, applications, stats) {
    const activeCount = applications.filter(function (row) {
      return String(row.stage_code).toUpperCase() === 'ACTIVE';
    }).length;

    return `
      <section class="rx-section rx-section--inside">
        <div class="rx-section__head">
          <div>
            <p class="rx-kicker">RINGKASAN</p>
            <h3>Posisi Penerimaan</h3>
            <p>Calon Siswa adalah total pendaftar, bukan jumlah Peserta Aktif.</p>
          </div>
        </div>

        <div class="rx-summary-grid">
          ${receptionHubSummaryCard('Calon Siswa', stats.total, 'Seluruh pendaftar pada T.A ini', 'groups', 'primary')}
          ${receptionHubSummaryCard('Diterima', stats.accepted, 'Sudah mendapat keputusan diterima', 'check_circle', 'success')}
          ${receptionHubSummaryCard('Pertimbangan', stats.consideration, 'Masih diproses / belum final', 'schedule', 'warning')}
          ${receptionHubSummaryCard('Diterima Bersyarat', stats.conditional, 'Diterima dengan syarat tertentu', 'verified', 'gold')}
          ${receptionHubSummaryCard('Tidak Diterima', stats.rejected, 'Keputusan akhir tidak diterima', 'cancel', 'danger')}
        </div>

        <div class="rx-summary-bottom">
          ${receptionHubInfoCard('account_tree', 'Jalur Pendaftaran', admissions.length, `Terhubung ke ${period.period_name}`)}
          ${receptionHubInfoCard('person_check', 'Sudah Aktif', activeCount, 'Benar-benar sudah mencapai tahap Aktif')}
        </div>
      </section>
    `;
  }


  function receptionHubSummaryCard(label, value, description, icon, tone) {
    return `
      <article class="rx-summary-card is-${escapeHtml(tone)}">
        <span class="rx-summary-card__icon">
          <span class="material-symbols-rounded">${escapeHtml(icon)}</span>
        </span>
        <div>
          <span class="rx-summary-card__label">${escapeHtml(label)}</span>
          <strong class="rx-summary-card__value">${numberFormat(value)}</strong>
          <p>${escapeHtml(description)}</p>
        </div>
      </article>
    `;
  }


  function receptionHubInfoCard(icon, label, value, copy) {
    return `
      <article class="rx-info-card">
        <span class="rx-info-card__icon">
          <span class="material-symbols-rounded">${escapeHtml(icon)}</span>
        </span>
        <div>
          <span>${escapeHtml(label)}</span>
          <strong>${numberFormat(value)}</strong>
          <p>${escapeHtml(copy)}</p>
        </div>
      </article>
    `;
  }


  function renderReceptionHubRoutes(period, admissions, applications) {
    return `
      <section class="rx-section rx-section--inside">
        <div class="rx-section__head">
          <div>
            <p class="rx-kicker">JALUR PENDAFTARAN</p>
            <h3>Jalur ${escapeHtml(period.period_name)}</h3>
            <p>Target masuk dan statistik keputusan per jalur.</p>
          </div>
          <button id="rxInlineAddRoute" class="rx-button rx-button--primary" type="button">
            <span class="material-symbols-rounded">add</span>
            Tambah Jalur
          </button>
        </div>

        ${
          admissions.length
            ? `<div class="rx-route-list">${admissions.map(function (admission) {
                return receptionHubRouteRow(admission, applications);
              }).join('')}</div>`
            : receptionHubEmpty(
                'account_tree',
                'Belum ada Jalur Pendaftaran',
                'Tambahkan jalur untuk Tahun Ajaran ini.',
                'rxEmptyRouteButton',
                'Tambah Jalur'
              )
        }
      </section>
    `;
  }


  function receptionHubRouteRow(admission, periodApplications) {
    const applications = periodApplications.filter(function (row) {
      return String(row.admission_id) === String(admission.admission_id);
    });
    const stats = receptionDecisionStats(applications);
    const targets = (admission.targets || []).filter(function (row) {
      return String(row.status) !== 'DELETED';
    });
    const active = String(admission.status).toUpperCase() === 'ACTIVE';
    const targetText = targets.length
      ? targets.map(function (target) {
          return `${target.program_name} • ${target.level_name}`;
        }).join(' / ')
      : 'Target belum diatur';

    return `
      <article class="rx-route-row">
        <div class="rx-route-row__identity">
          <span class="rx-route-row__icon">
            <span class="material-symbols-rounded">account_tree</span>
          </span>
          <div>
            <strong>${escapeHtml(admission.admission_name)}</strong>
            <small>${escapeHtml(admission.admission_id)}</small>
          </div>
        </div>

        <div class="rx-route-row__target">
          <span>Target Masuk</span>
          <strong>${escapeHtml(targetText)}</strong>
          <small>${numberFormat(targets.length)} target</small>
        </div>

        <div class="rx-route-row__stats">
          ${receptionHubRouteStat('Calon', stats.total)}
          ${receptionHubRouteStat('Diterima', stats.accepted)}
          ${receptionHubRouteStat('Pertimbangan', stats.consideration)}
          ${receptionHubRouteStat('Bersyarat', stats.conditional)}
          ${receptionHubRouteStat('Tidak', stats.rejected)}
        </div>

        <div class="rx-route-row__end">
          ${receptionHubStatus(active)}
          <div class="rx-route-row__actions">
            <button
              class="rx-icon-button"
              type="button"
              title="Lihat pendaftar"
              data-rx-route-applicants="${escapeHtml(admission.admission_id)}"
            >
              <span class="material-symbols-rounded">groups</span>
            </button>
            <button
              class="rx-icon-button"
              type="button"
              title="Edit jalur"
              data-rx-edit-route="${escapeHtml(admission.admission_id)}"
            >
              <span class="material-symbols-rounded">edit</span>
            </button>

            <button
              class="rx-icon-button is-danger"
              type="button"
              title="Hapus jalur"
              data-rx-delete-route="${escapeHtml(admission.admission_id)}"
            >
              <span class="material-symbols-rounded">delete</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }


  function receptionHubRouteStat(label, value) {
    return `
      <span>
        <small>${escapeHtml(label)}</small>
        <strong>${numberFormat(value)}</strong>
      </span>
    `;
  }


  function renderReceptionHubApplicants(period, admissions, applications) {
    return `
      <section class="rx-section rx-section--inside">
        <div class="rx-section__head">
          <div>
            <p class="rx-kicker">DATA PENDAFTAR</p>
            <h3>Calon Peserta ${escapeHtml(period.period_name)}</h3>
            <p>Cari dan filter calon peserta berdasarkan jalur, tahap, dan keputusan.</p>
          </div>
          <button id="rxInlineNewApplication" class="rx-button rx-button--primary" type="button">
            <span class="material-symbols-rounded">person_add</span>
            Pendaftaran Baru
          </button>
        </div>

        <div class="rx-filters">
          <label class="rx-search">
            <span class="material-symbols-rounded">search</span>
            <input id="rxApplicantSearch" type="search" placeholder="Cari nama atau nomor pendaftaran…" value="${escapeHtml(receptionHubUiState.search)}">
          </label>

          <select id="rxRouteFilter" class="rx-select">
            <option value="">Semua Jalur</option>
            ${admissions.map(function (admission) {
              return `<option value="${escapeHtml(admission.admission_id)}" ${String(receptionHubUiState.route_filter) === String(admission.admission_id) ? 'selected' : ''}>${escapeHtml(admission.admission_name)}</option>`;
            }).join('')}
          </select>

          <select id="rxStageFilter" class="rx-select">
            <option value="">Semua Tahap</option>
            ${['Pendaftaran','Verifikasi Berkas','Proses Administrasi','Proses Wawancara','Tes / Seleksi','Keputusan','Daftar Ulang','Aktif'].map(function (label) {
              return `<option value="${escapeHtml(label)}" ${receptionHubUiState.stage_filter === label ? 'selected' : ''}>${escapeHtml(label)}</option>`;
            }).join('')}
          </select>

          <select id="rxDecisionFilter" class="rx-select">
            <option value="">Semua Keputusan</option>
            <option value="accepted" ${receptionHubUiState.decision_filter === 'accepted' ? 'selected' : ''}>Diterima</option>
            <option value="consideration" ${receptionHubUiState.decision_filter === 'consideration' ? 'selected' : ''}>Pertimbangan</option>
            <option value="conditional" ${receptionHubUiState.decision_filter === 'conditional' ? 'selected' : ''}>Diterima Bersyarat</option>
            <option value="rejected" ${receptionHubUiState.decision_filter === 'rejected' ? 'selected' : ''}>Tidak Diterima</option>
          </select>
        </div>

        <div id="rxApplicantList">
          ${renderReceptionHubApplicantRows(applications)}
        </div>
      </section>
    `;
  }


  function renderReceptionHubApplicantRows(applications) {
    const search = String(receptionHubUiState.search || '').trim().toLowerCase();
    const filtered = applications.filter(function (application) {
      if (receptionHubUiState.route_filter && String(application.admission_id) !== String(receptionHubUiState.route_filter)) return false;
      if (receptionHubUiState.stage_filter && String(application.stage_label) !== String(receptionHubUiState.stage_filter)) return false;
      const bucket = receptionDecisionBucket(application);
      if (receptionHubUiState.decision_filter && bucket !== receptionHubUiState.decision_filter) return false;
      if (search) {
        const text = [application.application_id, application.full_name, application.admission_name, application.program_name, application.level_name, application.stage_label].join(' ').toLowerCase();
        if (!text.includes(search)) return false;
      }
      return true;
    });

    if (!filtered.length) {
      return receptionHubEmpty(
        'person_search',
        'Pendaftar tidak ditemukan',
        'Ubah filter atau tambahkan pendaftaran baru.'
      );
    }

    return `
      <div class="rx-applicant-list">
        ${filtered.map(function (application) {
          const bucket = receptionDecisionBucket(application);
          return `
            <button
              class="rx-applicant-row"
              type="button"
              data-rx-application="${escapeHtml(application.application_id)}"
            >
              <span class="rx-applicant-row__identity">
                <span class="rx-applicant-row__avatar">${escapeHtml(initials(application.full_name))}</span>
                <span>
                  <strong>${escapeHtml(application.full_name)}</strong>
                  <small>${escapeHtml(application.application_id)}</small>
                </span>
              </span>
              <span class="rx-applicant-row__route">
                <strong>${escapeHtml(application.admission_name || '—')}</strong>
                <small>${escapeHtml([application.program_name, application.level_name].filter(Boolean).join(' • ') || 'Target belum tersedia')}</small>
              </span>
              <span class="rx-pill">${escapeHtml(application.stage_label || '—')}</span>
              <span class="rx-decision is-${escapeHtml(bucket)}">${escapeHtml(receptionDecisionLabel(bucket))}</span>
              <span class="material-symbols-rounded rx-applicant-row__arrow">chevron_right</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }


  function receptionHubEmpty(icon, title, copy, buttonId, buttonLabel) {
    return `
      <div class="rx-empty">
        <span class="rx-empty__icon">
          <span class="material-symbols-rounded">${escapeHtml(icon)}</span>
        </span>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(copy)}</p>
        ${buttonId ? `<button id="${escapeHtml(buttonId)}" class="rx-button rx-button--primary" type="button"><span class="material-symbols-rounded">add</span>${escapeHtml(buttonLabel)}</button>` : ''}
      </div>
    `;
  }


  function bindReceptionHubRoom(period, data, admissions, applications) {
    document.getElementById('rxBackButton')?.addEventListener('click', function () {
      receptionHubUiState.period_id = '';
      receptionHubUiState.tab = 'summary';
      receptionHubUiState.route_filter = '';
      renderReceptionHub(data);
    });

    document.querySelectorAll('[data-rx-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        receptionHubUiState.tab = button.dataset.rxTab;
        renderReceptionHub(data);
      });
    });

    ['rxAddRouteButton', 'rxInlineAddRoute', 'rxEmptyRouteButton']
      .forEach(function (id) {
        document.getElementById(id)?.addEventListener('click', function () {
          openReceptionHubRouteForm(null, period);
        });
      });

    ['rxNewApplicationButton', 'rxInlineNewApplication']
      .forEach(function (id) {
        document.getElementById(id)?.addEventListener('click', function () {
          openReceptionApplicationWizard(data, period.period_id);
        });
      });

    document.querySelectorAll('[data-rx-edit-route]').forEach(function (button) {
      button.addEventListener('click', function () {
        const admission = admissions.find(function (row) {
          return String(row.admission_id) === String(button.dataset.rxEditRoute);
        });
        if (admission) openReceptionHubRouteForm(admission, period);
      });
    });

    document.querySelectorAll('[data-rx-route-applicants]').forEach(function (button) {
      button.addEventListener('click', function () {
        receptionHubUiState.route_filter = button.dataset.rxRouteApplicants;
        receptionHubUiState.tab = 'applicants';
        renderReceptionHub(data);
      });
    });

    document.querySelectorAll('[data-rx-delete-route]').forEach(function (button) {
      button.addEventListener('click', function () {
        const admission = admissions.find(function (row) {
          return String(row.admission_id) === String(button.dataset.rxDeleteRoute);
        });

        if (admission) {
          openReceptionHubDeleteRouteConfirm(
            admission
          );
        }
      });
    });

    const search = document.getElementById('rxApplicantSearch');
    const route = document.getElementById('rxRouteFilter');
    const stage = document.getElementById('rxStageFilter');
    const decision = document.getElementById('rxDecisionFilter');

    function refilter() {
      receptionHubUiState.search = search?.value || '';
      receptionHubUiState.route_filter = route?.value || '';
      receptionHubUiState.stage_filter = stage?.value || '';
      receptionHubUiState.decision_filter = decision?.value || '';
      const root = document.getElementById('rxApplicantList');
      if (root) {
        root.innerHTML = renderReceptionHubApplicantRows(applications);
        bindReceptionHubApplicantRows(data, period);
      }
    }

    search?.addEventListener('input', refilter);
    route?.addEventListener('change', refilter);
    stage?.addEventListener('change', refilter);
    decision?.addEventListener('change', refilter);

    bindReceptionHubApplicantRows(data, period);
  }


  function bindReceptionHubApplicantRows(data, period) {
    document.querySelectorAll('[data-rx-application]').forEach(function (button) {
      button.addEventListener('click', function () {
        openApplicationDetail(
          button.dataset.rxApplication,
          receptionModuleDataForPeriod(data, period.period_id)
        );
      });
    });
  }




  function openReceptionHubDeleteRouteConfirm(
    admission
  ) {
    const applicationCount =
      Number(
        admission.application_count ||
        0
      );

    if (
      applicationCount >
      0
    ) {
      modal(
        `
          <div class="rx-delete-dialog">

            <span class="rx-delete-dialog__icon is-warning">
              <span class="material-symbols-rounded">
                lock
              </span>
            </span>

            <div>
              <p class="rx-kicker">
                JALUR SUDAH DIGUNAKAN
              </p>

              <h3>
                Jalur tidak dapat dihapus
              </h3>

              <p>
                <strong>
                  ${escapeHtml(admission.admission_name)}
                </strong>
                sudah digunakan oleh
                <strong>
                  ${numberFormat(applicationCount)}
                </strong>
                pendaftar.
              </p>

              <p>
                Demi riwayat dan audit, jalur yang sudah memiliki
                pendaftar tidak dihapus. Jika tidak dipakai lagi,
                ubah statusnya menjadi
                <strong>Tidak Aktif</strong>.
              </p>
            </div>

            <div class="rx-delete-dialog__actions">
              <button
                class="rx-button rx-button--primary"
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

      return;
    }

    modal(
      `
        <div class="rx-delete-dialog">

          <span class="rx-delete-dialog__icon is-danger">
            <span class="material-symbols-rounded">
              delete
            </span>
          </span>

          <div>
            <p class="rx-kicker">
              HAPUS JALUR
            </p>

            <h3>
              Hapus ${escapeHtml(admission.admission_name)}?
            </h3>

            <p>
              Jalur ini belum digunakan oleh pendaftar sehingga
              aman untuk dihapus.
            </p>

            <p>
              Sistem menggunakan
              <strong>soft delete</strong>.
              Record tidak dihapus fisik dari database dan tetap
              tercatat pada audit trail.
            </p>
          </div>

          <div class="rx-delete-dialog__actions">

            <button
              class="rx-button rx-button--secondary"
              type="button"
              data-modal-close
            >
              Batal
            </button>

            <button
              id="rxConfirmDeleteRouteButton"
              class="rx-button rx-button--danger"
              type="button"
            >
              <span class="material-symbols-rounded">
                delete
              </span>

              Hapus Jalur
            </button>

          </div>

        </div>
      `,
      'sheet'
    );

    document
      .getElementById(
        'rxConfirmDeleteRouteButton'
      )
      ?.addEventListener(
        'click',
        function () {
          deleteReceptionHubRoute(
            admission.admission_id
          );
        }
      );
  }


  function deleteReceptionHubRoute(
    admissionId
  ) {
    const button =
      document.getElementById(
        'rxConfirmDeleteRouteButton'
      );

    setButtonLoading(
      button,
      true,
      'Menghapus…'
    );

    startLoading();

    window.EduApi
      .request(
        'admission.delete',
        {
          token:
            getToken(),

          admission_id:
            admissionId
        }
      )
      .then(
        function () {
          closeModal();

          invalidatePageCache(
            'admissions'
          );

          invalidatePageCache(
            'reception_new'
          );

          invalidatePageCache(
            'participants'
          );

          toast(
            'Jalur Pendaftaran berhasil dihapus.'
          );

          receptionHubUiState.tab =
            'routes';

          loadReceptionHub(
            true
          );
        }
      )
      .catch(
        function (error) {
          toast(
            error.message
          );
        }
      )
      .finally(
        function () {
          setButtonLoading(
            button,
            false
          );

          stopLoading();
        }
      );
  }



  function openReceptionHubPeriodForm(row) {
    document.body.classList.add('rx-enhanced-modal');
    openReceptionPeriodForm(row);
  }


  function openReceptionHubRouteForm(item, period) {
    document.body.classList.add('rx-enhanced-modal');
    openReceptionRouteForm(item, period);
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

          Pendaftaran Baru
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
          admissionUiState.tab =
            'applications';

          openPage(
            'admissions'
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
    window.addEventListener(
      'online',
      function () {
        toast(
          'Koneksi kembali online. Draft offline siap dilanjutkan.'
        );
      }
    );

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
    document.body.classList.remove(
      'rx-enhanced-modal'
    );

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
            './service-worker.js?v=034'
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
