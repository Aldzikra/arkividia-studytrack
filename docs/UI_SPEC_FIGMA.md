# StudyTrack — UI Spec untuk Figma (FigCraft)

Spesifikasi ini sama persis dengan desain di canvas Claude "StudyTrack UI". Pakai sebagai instruksi ke FigCraft untuk membangun file Figma.

## 1. Setup file
- Halaman: `🎨 Foundations`, `🧩 Components`, `📱 Screens`
- Semua layout pakai **Auto Layout**. Frame layar: **1280 × tinggi bebas** (Desktop).
- Font: **Plus Jakarta Sans** (Google Fonts) — weight 400, 500, 600, 700, 800.

## 2. Color variables (collection `StudyTrack`)

### Brand (palet colorhunt)
| Variable | Hex | Pakai untuk |
|---|---|---|
| `brand/blue-500` | `#2373F4` | Logo, panel login, aksen besar |
| `brand/blue-400` | `#578EF5` | Dekorasi |
| `brand/cyan-400` | `#65D0F4` | Avatar, dekorasi |
| `brand/lemon-200` | `#F2F7A0` | Badge "Belum" |
| `brand/blue-600` | `#1A5FD6` | Tombol utama, link, nav aktif (lolos kontras 4.5:1 dgn putih) |
| `brand/blue-50` | `#E8F0FE` | Latar nav aktif, chip kode MK |
| `brand/cyan-50` | `#EAF8FD` | Info box |

### Neutral
| Variable | Hex |
|---|---|
| `neutral/ink` | `#0F1B33` (teks utama) |
| `neutral/text-2` | `#3B4863` (label, teks sekunder kuat) |
| `neutral/muted` | `#55627A` (teks sekunder) |
| `neutral/border-input` | `#C4D2EC` |
| `neutral/border` | `#DCE5F5` |
| `neutral/bg` | `#F4F7FD` (latar halaman) |
| `neutral/surface` | `#FFFFFF` |

### Status (fungsional)
| Variable | Hex | Keterangan |
|---|---|---|
| `status/belum-bg` / `-fg` | `#F2F7A0` / `#4D4A00` | Badge Belum (kuning, sesuai guidebook) |
| `status/selesai-bg` / `-fg` | `#DDF4E4` / `#14632C` | Badge Selesai (hijau) |
| `status/mendekati` | `#E2580B` | Border card + badge "Sisa X jam" (teks putih) |
| `status/mendekati-bg` / `-fg` / `-border` | `#FFF1E6` / `#9A3A00` / `#F7C9A6` | Kartu ringkasan & judul seksi |
| `status/overdue` | `#3A4256` | Badge "Terlambat" (teks putih) |
| `status/overdue-card-bg` / `-border` | `#F7F8FA` / `#8D96A8` (dashed) | Card overdue |
| `status/overdue-bg` / `-fg` / `-border` | `#ECEFF4` / `#2E3546` / `#CDD3DE` | Kartu ringkasan |

> Oranye dipakai untuk "mendekati" karena palet tidak punya warna peringatan; oranye vs abu gelap juga beda kecerahan, jadi tetap terbaca oleh pengguna buta warna.

## 3. Text styles
| Style | Size / Line | Weight | Letter spacing |
|---|---|---|---|
| `Display` | 40 / 46 | 800 | -2% |
| `H1` | 32 / 40 | 800 | -2% |
| `H2 Login` | 30 / 38 | 800 | -2% |
| `Card title` | 18 / 24 | 700 | 0 |
| `Body` | 15 / 22 | 500 | 0 |
| `Body small` | 14 / 20 | 500–600 | 0 |
| `Label` | 13 / 18 | 700 | 0 |
| `Section label` | 14 / 18 | 700, UPPERCASE | +6% |
| `Badge` | 12 / 16 | 700 | 0 |
| `Stat number` | 28 / 32 | 800 | 0 |

## 4. Radius, spacing, shadow
- Radius: input/tombol `10–12`, card `16`, badge `999` (pill), chip kode `8`, logo `10`.
- Spacing (kelipatan 4): 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40.
- Shadow card mendekati: `0 6 18` warna `#E2580B` opacity 12%.
- Tinggi minimum elemen yang bisa diklik: **44 px**.

## 5. Components

### `Badge` — variant `type`
| Variant | Fill | Teks | Ikon |
|---|---|---|---|
| `belum` | belum-bg | belum-fg | — |
| `selesai` | selesai-bg | selesai-fg | check |
| `mendekati` | status/mendekati | putih | alarm-clock, teks "Sisa {n} jam" |
| `overdue` | status/overdue | putih | alert-circle, teks "Terlambat {n} jam" |
Padding 4 × 10, gap 6, radius 999.

### `Button` — variant `primary` / `secondary`
- Primary: fill blue-600, teks putih 15/700, padding 0 × 20, tinggi 44, radius 12.
- Secondary: fill putih, stroke border 1, teks blue-600 14/700, tinggi 44, radius 10.

### `Input` (label + field)
Label `Label` warna text-2, gap 6; field tinggi 44, padding 0 × 14, stroke border-input, radius 10.

### `TaskCard` — variant `state` = `normal` | `mendekati` | `overdue` | `selesai`
Auto Layout horizontal, wrap, padding 20 × 22, gap 16, radius 16.
- Kiri (fill): baris badge → judul (`Card title`) → "KODE · Nama MK" (`Body small`, muted).
- Kanan (hug, rata kanan): deadline "Kam, 2 Jul 2026 · 10.00" (14/700) → tombol secondary "Tandai selesai".

| State | Fill | Stroke | Badge | Deadline |
|---|---|---|---|---|
| normal | surface | border 1 | belum | text-2 |
| mendekati | surface | status/mendekati **2** + shadow | mendekati + belum | mendekati-fg |
| overdue | overdue-card-bg | overdue-card-border 1 **dashed** | overdue + belum | #3A4256, **coret** |
| selesai | surface | border 1 | selesai | muted, tombol "Batalkan selesai" |

### `Sidebar`
Lebar 240, fill surface, stroke kanan border, padding 28 × 20, gap 32.
Logo (kotak 36 blue-500 + "StudyTrack" 19/800) → nav item (tinggi 44, radius 10; aktif: fill blue-50, teks blue-600 700) → kartu user di bawah (avatar cyan-400 inisial, nama, email, tombol keluar 44×44).

### `StatCard`
Padding 16 × 18, radius 14, gap 4: angka (`Stat number`) + label (13/600). Varian mendekati / overdue / lainnya (warna pada tabel status).

## 6. Screens (halaman `📱 Screens`)

1. **Masuk** — dua kolom 50/50. Kiri: panel blue-500, padding 48, logo putih, headline "Semua tugas kuliah, satu daftar." (Display, putih), subteks 17; dekorasi lingkaran blue-400 (280), kotak miring cyan-400 (120, rotasi 12°), lingkaran lemon (64). Kanan: form lebar 400 — H2 "Masuk", Email, Password, tombol primary penuh tinggi 48, "Belum punya akun? **Daftar**".
2. **Daftar Tugas** (layar utama) — Sidebar + konten (padding 36 × 40, max-width 920, gap 28):
   - Header: tanggal kecil + H1 "Daftar Tugas", tombol primary "+ Tambah Tugas" di kanan.
   - 3 StatCard: Mendekati deadline (1), Terlambat (1), Tugas lainnya (3).
   - Seksi "MENDEKATI DEADLINE · KURANG DARI 24 JAM" → TaskCard mendekati (Project 3: BSTMap).
   - Seksi "TERLAMBAT" → TaskCard overdue (Homework 2: SQL Basics).
   - Seksi "TUGAS LAINNYA · TERBARU DI ATAS" → TaskCard normal (Sprint 2, Lab 4) + selesai (Quiz 1).
3. **Mata Kuliah** — Sidebar + H1, form satu baris (Kode, Nama, Dosen, tombol Tambah), grid card 3 kolom (chip kode, tombol ubah/hapus ikon, nama MK, dosen, link "Lihat tugas →").
4. **Tambah Tugas** — Sidebar + konten max-width 680: link kembali, H1, card form: Judul, Mata kuliah (dropdown), Deskripsi (textarea, opsional), Deadline (tanggal + jam WIB, 2 kolom), info box cyan-50 "Saat sisa waktunya kurang dari 24 jam, tugas ini otomatis ditandai…", tombol Batal (outline) + Simpan Tugas (primary).
5. **Status Card Tugas** (untuk slide Layer C) — frame 1040 × 640, 3 kolom: Normal / Mendekati / Terlambat, masing-masing TaskCard + kotak "Kapan:" berisi kondisinya.

## 7. Prompt siap-tempel untuk FigCraft
```
Buat file Figma "StudyTrack UI" mengikuti UI_SPEC_FIGMA.md:
1) Buat color variables dan text styles di bagian 2–3.
2) Buat komponen Badge, Button, Input, TaskCard (4 state), Sidebar, StatCard di bagian 5, pakai Auto Layout dan variable.
3) Susun 5 layar di bagian 6 memakai komponen tersebut, frame lebar 1280 (Status Card 1040×640).
Font Plus Jakarta Sans. Semua elemen interaktif minimal 44px.
```
