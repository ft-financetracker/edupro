# Education Finance v0.3.3 — Route Form Fix

## Masalah yang diperbaiki

1. Dropdown Jalur Pendaftaran pada Form Pendaftaran dapat terlihat kosong walaupun jalur sudah ada.
2. Jalur Pendaftaran belum memiliki aksi hapus.

## Fix Dropdown

- Jalur tidak lagi hilang diam-diam dari dropdown.
- Status route dan target dinormalisasi.
- Target lama dengan status kosong diperlakukan aktif untuk kompatibilitas, kecuali eksplisit INACTIVE/DELETED.
- Jalur nonaktif atau tanpa target tetap terlihat tetapi disabled dan diberi alasan.
- Tampil helper jumlah jalur yang siap digunakan.

## Fix Hapus Jalur

Endpoint baru:

- admission.delete

Aturan:

- Belum pernah dipakai pendaftar → boleh soft delete.
- Sudah dipakai pendaftar → tidak boleh dihapus.
- Jika sudah dipakai, ubah jalur menjadi Tidak Aktif.
- Tidak menggunakan deleteRow().
- Target ikut soft delete hanya ketika jalur memang aman dihapus.
- Audit trail: ADMISSION_DELETED.

## Backend

Ganti FULL:

- 00_Code.gs
- D04_Admissions.gs

Tidak perlu setup atau upgrade database.

Setelah paste:
Deploy → Manage deployments → Edit → New version → Deploy.

## Frontend

Upload isi ZIP frontend v0.3.3 ke GitHub Pages.

URL test:

https://ft-financetracker.github.io/edupro/?v=033

## Yang tidak diubah

- Schema Spreadsheet
- ID engine
- Form 1 → 2 → 3
- Timeline
- PDF/cache
- Offline draft
- ACTIVE → Master Peserta
- Menu lama
- Logic lain yang sudah LOCK
