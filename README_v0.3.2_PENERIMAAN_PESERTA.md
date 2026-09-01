# Education Finance Frontend v0.3.2
## SAFE CANDIDATE — Penerimaan Peserta

Frontend only. Backend v0.3.0 tidak diubah.

## Menu lama tetap ada

- Periode
- Pendaftaran
- Penerimaan Baru

## Menu kandidat baru

- Penerimaan Peserta

## Alur UI

```text
Tabel Tahun Ajaran
→ klik row
→ Room Tahun Ajaran
→ Ringkasan | Jalur Pendaftaran | Pendaftar
```

## Fokus visual

- Hero satu keluarga dengan Dashboard, tetapi proporsional.
- Icon utama diperbesar.
- Text menu baru dibuat lebih terbaca.
- Tombol utama minimal sekitar 44–46 px.
- Card/tabel memiliki border + background kontras.
- Desktop memakai tampilan tabel.
- Tablet/mobile berubah menjadi record-card tanpa horizontal overflow.
- Form Periode/Jalur yang dibuka dari menu kandidat mendapat ukuran text/icon lebih besar secara scoped.
- Menu lama tidak terkena style enhancement tersebut.

## Logic yang tetap LOCK

- T.A tetap entitas backend sendiri.
- Jalur tetap entitas sendiri.
- Target tetap entitas sendiri.
- Pendaftar bukan Peserta Aktif.
- ACTIVE baru masuk Master Peserta.
- Form pendaftaran 1 → 2 → 3 tetap.
- Timeline tetap.
- PDF/cache tetap.
- Offline draft tetap.
- Audit trail tetap.
- ID otomatis tetap.

## Deploy

Tidak perlu Apps Script redeploy.

Upload isi ZIP ke repo `edupro`.

Buka:

```text
https://ft-financetracker.github.io/edupro/?v=032
```

Service Worker:

```text
education-finance-v0-3-2
```

## Test awal

1. Pastikan Periode masih ada.
2. Pastikan Pendaftaran masih ada.
3. Pastikan Penerimaan Baru masih ada.
4. Pastikan Penerimaan Peserta muncul.
5. Buka Penerimaan Peserta.
6. Halaman awal harus berupa tabel Tahun Ajaran.
7. Klik satu row T.A.
8. Pastikan muncul Room T.A dengan tab Ringkasan, Jalur Pendaftaran, Pendaftar.
9. Cek desktop dan mobile.
