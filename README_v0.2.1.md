# Education Finance Frontend v0.2.1

FRONTEND ONLY.
Backend v0.2.0 tidak diubah.

## 1. Tutorial di setiap menu

Tombol `Panduan` tersedia pada header.

Tutorial mengikuti menu aktif:
- Dashboard
- Institusi
- Periode
- Pendaftaran
- Peserta
- Tagihan
- Pembayaran
- Piutang
- Laporan
- Pengaturan

## 2. Form Jalur Pendaftaran disederhanakan

User hanya memilih:

- T.A Masuk
- Jalur Pendaftaran
- Tanggal Mulai (opsional)
- Tanggal Selesai (opsional)
- Status

Frontend otomatis mengisi data backend:

- admission_code
- admission_name
- admission_type

ID tetap dibuat backend.

## Jalur bawaan

### Umum
- PSB Reguler

### Beasiswa & Sosial
- Beasiswa Umum
- Yatim
- Piatu
- Yatim Piatu
- Dhuafa

### Prestasi
- Prestasi Akademik / Nonakademik
- Tahfizh / Keagamaan

### Lanjutan Internal
- PSB Khusus SD → SMP
- PSB Khusus SMP → SMA
- PSB Khusus SMA → Kuliah
- Internal / Lanjutan Lainnya

### Perpindahan
- Pindahan
- Mutasi Masuk

### Jalur Khusus
- PSB Khusus
- Mitra / Kerja Sama
- Rekomendasi

### Lainnya
- Lainnya

Jika memilih Lainnya, baru muncul:
- Nama Jalur
- Kode Singkat

## Contoh otomatis

T.A 26/27 + Yatim:
JP-2627-YTM

T.A 26/27 + Dhuafa:
JP-2627-DHF

T.A 26/27 + PSB Khusus SD → SMP:
JP-2627-PSBSMP

## Deploy

Tidak perlu Apps Script redeploy.

Upload isi ZIP ke repo edupro.

Buka:
https://ft-financetracker.github.io/edupro/?v=021

Service Worker:
education-finance-v0-2-1
