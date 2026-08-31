# Education Finance Frontend v0.3.1 — Penerimaan Baru (Safe Additive)

## Tujuan

Menambahkan menu baru `Penerimaan Baru` sebagai workspace gabungan untuk:

- Tahun Ajaran
- Jalur Pendaftaran
- Pendaftar
- Ringkasan keputusan

Tanpa menghapus atau mengganti menu lama.

## SAFE / ROLLBACK

Menu lama tetap tersedia:

- `Periode`
- `Pendaftaran`

Backend v0.3.0 tidak diubah.
Database tidak diubah.
Endpoint tidak diubah.
Admission Workflow tidak diubah.

Jika konsep menu baru dibatalkan, cukup kembali ke frontend v0.3.0 atau abaikan menu `Penerimaan Baru`.

## Menu Baru

`Penerimaan Baru`

Alur:

```text
T.A Card
  ↓
Ringkasan / Jalur Pendaftaran / Pendaftar
```

## Card T.A

Menampilkan:

- Calon Siswa
- Diterima
- Pertimbangan
- Diterima Bersyarat
- Tidak Diterima
- Jumlah Jalur

`Calon Siswa` = seluruh pendaftar pada T.A tersebut.

Pendaftar tetap BUKAN Peserta Aktif.
Master Peserta tetap dibuat hanya saat Admission Workflow mencapai `ACTIVE`.

## Status ringkasan

Frontend v0.3.1 tidak mengubah engine keputusan backend.
Ringkasan membaca data application yang sudah tersedia.

Mapping saat ini:

- `ACCEPTED`, `REREGISTRATION`, `ACTIVE` → Diterima
- status belum final → Pertimbangan
- jika data memiliki status conditional → Diterima Bersyarat
- jika data memiliki status rejected → Tidak Diterima

Tidak ada data keputusan palsu yang dibuat oleh frontend.

## Jalur Pendaftaran Baru

Form pada menu baru dibuat lebih rapi dan kontekstual:

1. Identitas Jalur
2. Target Masuk
3. Periode Pendaftaran
4. Status Jalur

Jika membuka jalur dari T.A 2026/2027, user tidak perlu memilih T.A lagi.
T.A ditampilkan read-only.

Form lama pada menu `Pendaftaran` tetap dipertahankan.

## Pendaftaran Baru

Menggunakan Admission Wizard v0.3.0 yang sudah LOCK:

1. Data Santri
2. Data Wali
3. Berkas & Review

Tidak ada perubahan pada:

- foto
- berkas
- timeline
- PDF/cache
- offline draft
- activation → Master Participant

## Version

Frontend: `0.3.1`
Backend: tetap `0.3.0`
Service Worker: `education-finance-v0-3-1`

## Deploy

Tidak perlu Apps Script deploy.

Upload seluruh isi ZIP frontend ke repo `edupro`.

Buka:

```text
https://ft-financetracker.github.io/edupro/?v=031
```

Hard refresh sekali.

## Test pertama

1. Pastikan menu lama `Periode` masih ada.
2. Pastikan menu lama `Pendaftaran` masih ada.
3. Buka `Penerimaan Baru`.
4. Pastikan card T.A muncul.
5. Klik card T.A.
6. Pastikan tab Ringkasan / Jalur Pendaftaran / Pendaftar muncul.
7. Edit jalur dari menu baru.
8. Pastikan tidak ada horizontal overflow.
9. Coba `Pendaftaran Baru` dan pastikan wizard 1 → 2 → 3 tetap sama.
10. Buka menu lama lagi dan pastikan tetap bekerja.
