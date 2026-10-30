# StudyTrack

Aplikasi pencatat tugas kuliah dengan **reminder deadline**: tugas yang tinggal kurang dari 24 jam otomatis naik ke paling atas, tugas yang lewat ditandai terlambat. Studi kasus Academya Arkavidia 11.0 (Software Engineer).

- **Backend:** Go (Gin + pgx) · PostgreSQL · JWT
- **Frontend:** React + Vite + TypeScript · TanStack Router · Tailwind CSS v4

```
backend/    API (cmd/api, internal/, migrations/, seeds/)
frontend/   Aplikasi web
docs/       Roadmap, ERD, desain UI
```

## Requirements

| Tools | Versi | Catatan |
|---|---|---|
| Go | 1.27+ | lihat `backend/go.mod` |
| Node.js + npm | 20+ | |
| PostgreSQL | 13+ | memakai `gen_random_uuid()` bawaan |
| [golang-migrate](https://github.com/golang-migrate/migrate) | v4.18 | untuk menjalankan migrasi |
| `make` | | opsional, hanya pintasan |

Install golang-migrate:

```bash
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.18.3
```

## 1. Database

Buat database kosong:

```bash
createdb study_track_db
```

## 2. Backend

```bash
cd backend
cp .env.example .env
```

Isi `backend/.env`:

```env
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/study_track_db?sslmode=disable
PORT=8000
JWT_SECRET=<string acak panjang>
```

- `PORT=8000` dipakai agar cocok dengan proxy dev frontend.
- Buat `JWT_SECRET` dengan: `openssl rand -base64 32`. Jangan pakai nilai contoh.

Jalankan migrasi dan backend:

```bash
make migrate-up           # buat tabel users, matkul, tugas
air                       # API di http://localhost:8000
```

Tanpa `make`: `migrate -path migrations -database "$DATABASE_URL" up` dan `go run ./cmd/api`.

Cek: `curl http://localhost:8000/api/health` harus membalas `"status":"success"`.

## 3. Frontend

```bash
cd frontend
cp .env.example .env     # VITE_API_URL=/api
npm install
npm run dev              # http://localhost:5173
```

Saat `npm run dev`, request `/api/*` diteruskan (proxy Vite) ke `http://localhost:8000`, jadi backend harus sudah jalan.

Buka http://localhost:5173, klik **Daftar**, buat akun, lalu mulai menambah mata kuliah dan tugas.

## Data contoh (opsional)

Isi 3 mata kuliah dan 3 tugas untuk akun yang sudah terdaftar:

```bash
cd backend
psql "$DATABASE_URL" -v email=email-akunmu@example.com -f seeds/tugas.sql
```

Deadline seed ada di bulan Juli 2026, jadi akan tampil **Terlambat**. Untuk melihat badge **Mendekati**, tambah satu tugas dengan deadline kurang dari 24 jam dari sekarang.



## Endpoint API

Semua di bawah `/api`. Selain register/login/health, wajib header `Authorization: Bearer <token>`.

| Method | Path | Fungsi |
|---|---|---|
| GET | `/health` | cek server |
| POST | `/auth/register` | daftar (`username`, `email`, `password` ≥ 8 karakter) |
| POST | `/auth/login` | masuk, mengembalikan `token` dan `user` |
| GET, POST | `/mata-kuliah` | daftar, tambah |
| GET, PUT, DELETE | `/mata-kuliah/:id` | detail, ubah, hapus |
| GET, POST | `/tugas` | daftar (sudah dengan `deadline_category` dan terurut), tambah |
| GET, PUT, DELETE | `/tugas/:id` | detail, ubah, hapus |
| PATCH | `/tugas/:id/status` | `{"status": "belum" \| "selesai"}` |

Data tiap user terpisah: mengakses data user lain dibalas `404`.

**Kategori deadline** (`deadline_category`), dihitung backend:

- `mendekati`: belum selesai dan sisa waktu < 24 jam (tepat 24 jam termasuk `normal`)
- `overdue`: belum selesai dan deadline sudah lewat
- `normal`: sisanya, termasuk tugas berstatus `selesai`

Urutan daftar: `mendekati` (deadline terdekat dulu) → `overdue` → `normal` (terbaru dulu).

## Masalah umum

- **`JWT_SECRET is not set`**: `backend/.env` belum dibuat atau kosong.
- **Frontend: request gagal / 502 di `/api`**: backend belum jalan, atau `PORT` di `backend/.env` bukan 8000.
- **`relation "matkul" does not exist`**: migrasi belum dijalankan (`make migrate-up`).
- **Migrasi `dirty`**: perbaiki dengan `make migrate-force version=<n>`, lalu jalankan ulang.

## Dokumentasi lain

- [`docs/ROADMAP.md`](docs/ROADMAP.md): rencana pengerjaan dan strategi branching
- [`docs/ERD.md`](docs/ERD.md): relasi tabel
- [`docs/UI_SPEC_FIGMA.md`](docs/UI_SPEC_FIGMA.md) dan `docs/design/`: spesifikasi dan mockup UI
