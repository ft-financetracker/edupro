# Education Finance v0.3.4 — Performance & Idempotency

## Masalah yang diperbaiki

1. Menu Penerimaan terasa lama / loading berulang / kadang RTO.
2. Browser timeout 15 detik sementara Apps Script masih menyelesaikan write.
3. User menekan Simpan lagi karena terlihat gagal.
4. Akibatnya satu pendaftaran dapat menghasilkan beberapa row duplikat.
5. Upload file memblokir proses Kirim Pendaftaran.
6. Submit membuat PDF sebelum response sehingga request berat.

## Arsitektur baru

### Cache First

Penerimaan Peserta:

IndexedDB cache
→ tampilkan data terakhir
→ reception.bootstrap berjalan background
→ UI diperbarui setelah server selesai

Tidak lagi 3 request:
- period.list
- admission.list
- application.list

Menjadi 1 request:
- reception.bootstrap

Backend bootstrap membaca masing-masing sheet utama satu kali.

### Offline-first Save

Klik Simpan / Kirim:

IndexedDB
→ modal langsung ditutup
→ user tidak menunggu Apps Script
→ application.save background
→ PHOTO diupload lebih dahulu
→ application.submit
→ dokumen lain upload satu-per-satu background

Jika server RTO:
- local draft tetap ada
- retry aman
- tidak membuat application baru

### Idempotency

ADMISSION_APPLICATIONS:
- client_request_id

Nilainya berasal dari LOCAL draft ID.

Retry dengan client_request_id yang sama:
→ kembali ke application_id yang sama
→ tidak append application baru.

ADMISSION_DOCUMENTS:
- client_upload_id

Retry upload yang sama:
→ tidak membuat row/file baru.

Drive file memakai nama deterministik untuk recovery bila request pertama sempat createFile sebelum error.

### Submit

application.submit sekarang idempotent.

Retry submit:
→ tidak menambah stage history berulang.

PDF tidak dibuat saat submit.

PDF tetap:
→ generate saat Cetak pertama
→ cache
→ Cetak berikutnya reuse cache.

### Spreadsheet Write

- Application row: 1 row / 1 write.
- Update row: full row / 1 setValues.
- Guardian baru: beberapa row sekaligus / 1 setValues.
- Tidak ada setValue per kolom pada flow pendaftaran ini.

## File Backend yang berubah / baru

GANTI FULL:
- 00_Code.gs
- A01_Config.gs
- B01_Data.gs
- D06_Applications.gs
- D07_DocumentsPdf.gs

FILE BARU:
- A07_Upgrade_v034.gs
- D08_Performance.gs

PRESERVE:
- file backend lainnya.

## WAJIB setelah paste backend

Jalankan SEKALI:

upgradeEducationPlatformV034()

Lalu redeploy Web App existing.

## Bersihkan duplikat RTO lama

STEP AMAN 1:
scanRtoDuplicateDraftsV034()

Fungsi ini READ ONLY.

Ia hanya mendeteksi kandidat yang:
- DRAFT
- REGISTRATION
- belum submitted
- belum punya participant
- belum punya dokumen aktif
- fingerprint sama
- user pembuat sama
- dibuat dalam rentang <= 30 menit

Jika hasil scan memang baris retry/RTO, jalankan:

cleanupRtoDuplicateDraftsV034()

Cleanup menggunakan SOFT DELETE.

## Frontend

Upload ZIP v0.3.4 ke GitHub.

Buka:

https://ft-financetracker.github.io/edupro/?v=034

Service Worker:

education-finance-v0-3-4
