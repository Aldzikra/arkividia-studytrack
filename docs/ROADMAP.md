# StudyTrack — Roadmap Pengerjaan & Branching

Rencana pengerjaan studi kasus **[StudyTrack] Reminder Tugas Mendekati Deadline** (Academya Arkavidia 11.0 — Software Engineer).

- **Stack:** Go (Gin + pgx) · PostgreSQL · React + Vite + TanStack Router + Tailwind
- **Deadline submit:** Senin, 16 Nov 2026 23.59 WIB (target selesai **15 Nov**, 1 hari buffer)
- **Wajib:** slide deck (PDF) + video. **Bonus:** kode yang benar-benar jalan, fitur AI, deployment, git history yang rapi.

> Kalau waktu mepet: Phase 1–3 bisa dilewati dengan memakai starter kit resmi
> (`github.com/ZulfaNurhuda/StudyTrack`), lalu langsung ke Phase 4. Slide + video (Phase 9) tidak boleh dikorbankan.

---

## Strategi Branching

**Satu phase = satu branch.** Semua pekerjaan phase itu di-commit di branch tersebut, lalu digabung ke `main` lewat Pull Request di akhir phase.

```
main ── phase-0 ── phase-1 ── phase-2 ── ... ── phase-9
         (tiap merge diberi tag)
```

**Aturan:**
1. Buat branch phase dari `main` terbaru.
2. Commit kecil-kecil dengan pesan yang jelas (Conventional Commits).
3. Akhir phase: buka PR ke `main`, merge (`--no-ff`), beri tag, hapus branch.

**Contoh commit message:**
```
feat(tugas): add deadline category calculation
fix(config): read env keys for DATABASE_URL and PORT
chore(db): add migration for mata_kuliah table
test(tugas): cover 24h boundary for deadline category
docs(readme): add setup instructions
```

---

## Ringkasan Phase

| Phase | Tanggal | Branch | Fokus | Tag |
|---|---|---|---|---|
| **Backend** | | | | |
| 0 | 29–30 Okt | `chore/setup` | Setup & fondasi | `v0.0.1` |
| 1 | 31 Okt–1 Nov | `feature/be-auth` | Modul 1 — Autentikasi | `v0.1.0` |
| 2 | 2 Nov | `feature/be-mata-kuliah` | Modul 2 — Mata Kuliah | `v0.2.0` |
| 3 | 3–4 Nov | `feature/be-tugas` | Modul 3 & 4 — Tugas + Daftar Tugas | `v0.3.0` |
| 4 | 5–6 Nov | `feature/be-deadline-reminder` | **Fitur inti — Reminder Deadline** (logika + test) | `v0.4.0` |
| **Frontend** | | | | |
| 5 | 7–8 Nov | `feature/fe-setup-auth` | Setup FE + halaman Auth | `v0.5.0` |
| 6 | 9–10 Nov | `feature/fe-mata-kuliah-tugas` | Halaman Mata Kuliah & Tugas | `v0.6.0` |
| 7 | 11 Nov | `feature/fe-deadline-reminder` | **Fitur inti — Reminder Deadline** (UI) | `v1.0.0` |
| **Penutup** | | | | |
| 8 | 12–13 Nov | `chore/deploy` | Bonus — CI, Deploy, AI | `v1.1.0` |
| 9 | 14–15 Nov | `docs/final` | Dokumentasi, slide, video, submit | `v1.1.1` |

---

## Phase 0 — `chore/setup` (29–30 Okt)

Tujuan: backend jalan dan terkoneksi ke DB, frontend bisa memanggil API.

- [x] Isi `README.md`, tambah `.env.example`
- [x] `config.go`: `os.Getenv("")` → `DATABASE_URL`, `PORT`, `JWT_SECRET`
- [x] `postgres.go`: `log.Panicln` saat **berhasil** konek bikin crash → ganti `log.Println`; sambungkan config + DB di `main.go`
- [x] `user.model.go`: import `"uuid"` → `github.com/google/uuid`; tag `UpdatedAt` → `db:"updated_at"`
- [x] Pasang tool migrasi (`golang-migrate` / `goose`)
- [x] Router group `/api`, `GET /api/health`, CORS, format error seragam
- [x] Frontend: struktur folder, `lib/api.ts` dengan `VITE_API_URL`, layout dasar

**Selesai bila:** frontend bisa menampilkan respons `GET /api/health`.

---

## Phase 1 — `feature/be-auth` (31 Okt–1 Nov)

- [x] **DB:** migrasi `users` (`id`, `email` unique, `password_hash`, `created_at`, `updated_at`)
- [x] **BE:** `POST /api/auth/register` (bcrypt), `POST /api/auth/login` (JWT), `GET /api/auth/me`
- [x] **BE:** middleware JWT → simpan `user_id` di context

> Field password jangan pernah ikut di response JSON (`json:"-"`).

---

## Phase 2 — `feature/be-mata-kuliah` (2 Nov)

- [x] **DB:** tabel `mata_kuliah` (`id`, `name`, `kode`, `dosen`, **`user_id` FK**)
- [x] **BE:** `GET/POST /api/mata-kuliah`, `PUT/DELETE /api/mata-kuliah/:id` — selalu filter `user_id`

> Asumsi: `user_id` ditambahkan agar data tiap mahasiswa terpisah (dibutuhkan untuk F04).

---

## Phase 3 — `feature/be-tugas` (3–4 Nov)

Hasil phase ini = setara starter kit (baseline sebelum fitur baru).

- [x] **DB:** tabel `tugas` (`id`, `judul`, `deskripsi`, `deadline TIMESTAMPTZ`, `status` enum `belum`/`selesai`, `mata_kuliah_id` FK, `created_at`)
- [ ] **DB:** seed 3 contoh tugas dari guidebook (CS 186, CS 61B, CS 169)
- [ ] **BE:** CRUD `/api/tugas/:id` + `PATCH /api/tugas/:id/status`
- [ ] **BE:** `GET /api/tugas` — semua tugas user lintas MK, JOIN nama MK, urut `created_at DESC`

> Simpan `deadline` sebagai `TIMESTAMPTZ` (UTC) agar perhitungan "< 24 jam" tidak kacau karena zona waktu; tampilkan dalam WIB di frontend.

---

## Phase 4 — `feature/be-deadline-reminder` (5–6 Nov)

Bagian yang dinilai. Kerjakan berurutan DB → BE → test.

- [ ] **DB:** tidak ada kolom baru — kategori dihitung, bukan disimpan (nilainya berubah seiring waktu). Cukup tambah index pada `deadline` (F01)
- [ ] **BE:** fungsi murni `CategorizeDeadline(deadline, status, now)` → `"mendekati" | "overdue" | "normal"`; `now` di-inject supaya mudah dites (F01, F03)
- [ ] **BE:** `GET /api/tugas` menambah field `deadline_category` dan mengurutkan: **mendekati** (deadline terdekat dulu) → **overdue** → **normal** (`created_at DESC`) (F02, F04)
- [ ] **Test:** unit test tabel untuk `CategorizeDeadline` + test urutan endpoint

**Logika kategori (pseudocode):**
```
func CategorizeDeadline(deadline, status, now):
    if status == "selesai":          return "normal"     // asumsi
    if deadline <= now:              return "overdue"
    if deadline - now < 24 jam:      return "mendekati"
    return "normal"
```

**Asumsi yang ditulis di slide (kolom Catatan/Asumsi):**
- Tugas berstatus `selesai` tidak diberi penanda reminder/overdue.
- Tepat 24 jam masuk **normal** (requirement: "kurang dari").
- Overdue diletakkan di bawah "mendekati", di atas "normal".
- Waktu acuan `now` diambil dari server, bukan jam perangkat pengguna.

**Skenario verifikasi** (acuan data guidebook, `now = 2026-07-02 09:00`):

| No | Kondisi | Hasil yang diharapkan | Jenis |
|---|---|---|---|
| 1 | Project 3 BSTMap, deadline 07-02 10:00, belum | `mendekati`, tampil paling atas | Positif |
| 2 | Sprint 2, deadline 07-06 23:59 | `normal`, tanpa penanda | Negatif |
| 3 | `now = 07-02 10:01`, BSTMap sudah lewat | `overdue`, penanda berbeda, tetap tampil | Positif (F03) |
| 4 | Deadline tepat `now + 24 jam` | `normal` | Edge case |
| 5 | Mendekati deadline tapi status `selesai` | Tidak ada penanda | Edge case |
| 6 | Tugas milik user lain | Tidak muncul di daftar | Negatif (F04) |

**Selesai bila:** semua test lulus → merge, tag `v0.4.0`.

---

## Phase 5 — `feature/fe-setup-auth` (7–8 Nov)

- [ ] **FE:** struktur folder, `lib/api.ts` dengan `VITE_API_URL`, layout dasar (jika belum selesai di Phase 0)
- [ ] **FE:** halaman Register & Login, simpan token, protected route, logout

---

## Phase 6 — `feature/fe-mata-kuliah-tugas` (9–10 Nov)

- [ ] **FE:** halaman daftar Mata Kuliah + form tambah/edit
- [ ] **FE:** form tambah/edit tugas (deadline tanggal + jam)
- [ ] **FE:** halaman daftar tugas — card judul, nama MK, deadline, badge **Belum (kuning)** / **Selesai (hijau)**

---

## Phase 7 — `feature/fe-deadline-reminder` (11 Nov)

- [ ] **FE:** card memakai `deadline_category` dari API — mendekati = badge oranye/merah "⏰ < 24 jam"; overdue = badge abu gelap "Terlambat"; normal = tampilan lama (F02, F03)
- [ ] Verifikasi manual skenario di tabel Phase 4

**Selesai bila:** semua skenario terlihat benar di UI → merge, tag `v1.0.0`.

---

## Phase 8 — `chore/deploy` (12–13 Nov)

- [ ] GitHub Actions: `go test ./...`, `go vet`, `npm run lint`, `npm run build`
- [ ] Deploy backend + Postgres ke Railway/Render (free tier), env lewat dashboard
- [ ] Deploy frontend ke Vercel, set `VITE_API_URL`, perbarui CORS
- [ ] *(Opsional, paling akhir)* Fitur AI "Pecah tugas": LLM memberi langkah pengerjaan dari judul + deskripsi; dipanggil dari **backend** (API key jangan di frontend)

---

## Phase 9 — `docs/final` (14–15 Nov)

- [ ] `README.md`: deskripsi, cara menjalankan lokal, env vars, link deploy
- [ ] `docs/API.md`: daftar endpoint + contoh request/response
- [ ] Slide deck (PDF): Tugas 1 (3P + tabel task), Tugas 2 (rancangan DB/BE/FE), Tugas 3 (tabel skenario), link repo + demo
- [ ] Video ≤ 15 menit, satu take: ±4 menit perkenalan & motivasi → ±10 menit studi kasus (+ demo) → ±1 menit penutup
- [ ] Upload di website Academya, pastikan status **Submitted** sebelum 16 Nov 23.59 WIB

---

## Checklist Akhir

- [ ] `.env` tidak ada di git history
- [ ] 10 branch phase sudah di-merge lewat PR dan dihapus
- [ ] Tag `v0.0.1` … `v1.1.1` ada di `main`
- [ ] Test Phase 4 (BE) lulus
- [ ] App bisa diakses lewat URL publik
- [ ] Slide sudah diekspor PDF, video ≥ 480p dengan audio jelas
