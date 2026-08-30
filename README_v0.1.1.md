# EDUCATION FINANCE FRONTEND v0.1.1

## PATCH

Frontend only.

Apps Script backend v0.1.0 TIDAK DIUBAH.

Perubahan:

- Mobile menu sekarang dapat membuka Institusi dan Periode.
- Bottom navigation menjadi:
  Dashboard | Peserta | CTA | Tagihan | Menu
- CTA tengah membuka Quick Action.
- Menu membuka seluruh modul sesuai permission.
- Dashboard Hero dibuat premium.
- Hero memiliki CTA sesuai readiness:
  - Lengkapi Institusi
  - Atur Periode Akademik
  - Lanjut ke Data Peserta
- Loading diperjelas:
  - top progress
  - loading status
  - skeleton shimmer
  - refresh icon spin
  - button loading
- Dashboard menegaskan:
  Admin & Staff Workspace.
- Portal Peserta/Wali bukan tampilan ini.
- Service Worker naik:
  education-finance-v0-1-1

## INSTALL

HANYA GITHUB.

Overwrite seluruh isi repo dengan isi ZIP ini.

Tidak perlu:
- edit Apps Script
- deploy Apps Script ulang
- setup database ulang
- bootstrap user ulang

Setelah GitHub Pages selesai:

1. Tutup PWA.
2. Buka URL browser.
3. Hard refresh.
4. Buka ulang PWA.

Target mobile:

- Dashboard
- Peserta
- CTA tengah
- Tagihan
- Menu

Menu → Institusi / Periode / Pembayaran / Piutang / Laporan.
