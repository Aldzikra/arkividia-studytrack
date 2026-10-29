-- Modul 3: Manajemen Tugas
CREATE TYPE status_tugas AS ENUM ('belum', 'selesai');

CREATE TABLE IF NOT EXISTS tugas (
    id              SERIAL        PRIMARY KEY,
    judul           VARCHAR(255)  NOT NULL,
    deskripsi       TEXT          NOT NULL DEFAULT '',
    deadline        TIMESTAMPTZ   NOT NULL,              -- simpan UTC, tampilkan WIB di frontend
    status          status_tugas  NOT NULL DEFAULT 'belum',
    mata_kuliah_id  INT           NOT NULL REFERENCES matkul(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Modul 4: daftar tugas di-JOIN lewat matkul dan diurutkan created_at
CREATE INDEX IF NOT EXISTS idx_tugas_mata_kuliah_id ON tugas(mata_kuliah_id);
CREATE INDEX IF NOT EXISTS idx_tugas_created_at ON tugas(created_at DESC);
