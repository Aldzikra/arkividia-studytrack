# Brief — Video Assessment Academya Arkavidia 11.0 (Software Engineer)

Aku sedang mengerjakan Video Assessment seleksi Academya Arkavidia 11.0 path Software Engineer.
Guidebook PDF aku lampirkan. Bantu aku menyusun **slide deck (PDF)** dan **naskah video**.

## Deadline & ketentuan
- Submit paling lambat **16 Nov 2026 23.59 WIB** (targetku selesai 15 Nov).
- Video maks 15 menit, satu rekaman tanpa dipotong, MP4/MOV/AVI, min 480p, audio jelas.
- Urutan: Perkenalan (nama, kampus, jurusan, semester) → Motivasi memilih path SE + target → Pengalaman relevan → Studi kasus (±10 menit) → Penutup.
- Bobot: motivasi 21%, studi kasus 49% dari nilai akhir.

## Studi kasus
StudyTrack (sudah berjalan: auth, mata kuliah, tugas, daftar tugas urut `created_at DESC`).
Fitur baru: **Reminder Tugas Mendekati Deadline**.
- F01: mendekati deadline = sisa waktu < 24 jam dari sekarang
- F02: tugas mendekati tampil paling atas dengan penanda jelas
- F03: tugas overdue tetap tampil dengan penanda berbeda
- F04: berlaku untuk semua tugas milik user login, lintas mata kuliah

Yang harus ada di slide:
1. **Tugas 1 – Perencanaan (3P):** P1 Perubahan (data/logika/tampilan), P2 Pemetaan ke layer DB/BE/FE, P3 tabel task (No, Deskripsi, Layer, Ketergantungan, Catatan/Asumsi).
2. **Tugas 2 – Rancangan per layer:** DB (skema + alasan), BE (pseudocode fungsi/endpoint, input/output), FE (tampilan card normal/mendekati/overdue + kondisinya). Ketiga layer harus konsisten.
3. **Tugas 3 – Verifikasi:** min. 3 skenario (positif, negatif, edge case) memakai data contoh guidebook.

## Keputusan desain yang sudah kubuat (dan sudah kuimplementasikan)
Stack implementasi: Go (Gin + pgx) + PostgreSQL, React + Vite. Kode = bonus (tidak menambah nilai), tapi bisa jadi demo singkat.

**Database — skema tidak diubah.** Kategori dihitung saat request, tidak disimpan, karena nilainya berubah seiring waktu (kalau disimpan butuh cron untuk update). `deadline` bertipe `TIMESTAMPTZ` (UTC). Tabel: `users` (UUID), `matkul` (id SERIAL, name, kode, dosen, user_id FK), `tugas` (id SERIAL, judul, deskripsi, deadline, status enum belum/selesai, mata_kuliah_id FK, created_at). Kepemilikan tugas lewat JOIN ke `matkul.user_id`.

**Backend — service layer (`internal/services/tugas.service.go`):**
```
CategorizeDeadline(deadline, status, now):
    if status == "selesai":       return "normal"
    if deadline <= now:           return "overdue"
    if deadline - now < 24 jam:   return "mendekati"
    return "normal"

SortTugas(list, now):
    isi deadline_category tiap tugas
    stable sort: mendekati (deadline terdekat dulu) → overdue → normal
    urutan dalam grup lain tetap created_at DESC (dari DB)
```
Dipasang di `GET /api/tugas` → tiap item punya field `deadline_category`. `now` di-inject agar bisa diuji. Semua query difilter `user_id` dari JWT (mencegah IDOR).

**Frontend:** card membaca `deadline_category` dari API (FE tidak menghitung ulang).
- mendekati → border + badge oranye/merah "⏰ < 24 jam"
- overdue → badge abu gelap "Terlambat"
- normal → tampilan lama (badge Belum kuning / Selesai hijau)

**Asumsi (kolom Catatan/Asumsi):**
- Tugas `selesai` tidak diberi penanda reminder/overdue.
- Tepat 24 jam = normal (requirement: "kurang dari").
- Overdue di bawah mendekati, di atas normal; di dalam grup overdue urut created_at DESC.
- `now` = waktu server, bukan perangkat pengguna.
- `deadline_category` hanya di endpoint daftar tugas.

**Skenario verifikasi** (`now = 2026-07-02 09:00`):
| Kasus | Hasil | Jenis |
|---|---|---|
| Project 3 BSTMap, deadline 07-02 10:00, belum | mendekati, paling atas | Positif |
| Sprint 2, deadline 07-06 23:59 | normal | Negatif |
| now = 07-02 10:01, BSTMap lewat | overdue, tetap tampil | Positif (F03) |
| Deadline tepat now + 24 jam | normal | Edge |
| now + 23 jam 59 menit | mendekati | Edge |
| Deadline = now persis | overdue | Edge |
| Mendekati tapi status selesai | normal | Edge |
| Tugas milik user lain | tidak muncul | Negatif (F04) |

## Yang aku minta di chat ini
1. Outline slide (per slide: judul + isi).
2. Isi tabel P1, P2, P3 yang lengkap.
3. Naskah video per bagian dengan estimasi durasi (perkenalan/motivasi/pengalaman akan kuisi data pribadiku).
4. Tips rekaman & cek akhir sebelum submit.
