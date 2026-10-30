-- Seed 3 contoh tugas (guidebook). Pakai: psql "$DATABASE_URL" -v email=user@example.com -f seeds/tugas.sql
-- Idempotent: aman dijalankan ulang.
WITH u AS (
    SELECT id FROM users WHERE email = :'email'
), m AS (
    INSERT INTO matkul (name, kode, dosen, user_id)
    SELECT v.name, v.kode, 'TBA', u.id
    FROM u, (VALUES
        ('Basis Data', 'CS186'),
        ('Struktur Data', 'CS61B'),
        ('Rekayasa Perangkat Lunak', 'CS169')
    ) AS v(name, kode)
    ON CONFLICT (user_id, kode) DO NOTHING
    RETURNING id
)
SELECT count(*) AS matkul_baru FROM m;

INSERT INTO tugas (judul, deskripsi, deadline, mata_kuliah_id)
SELECT v.judul, v.deskripsi, v.deadline::timestamptz, m.id
FROM users u
JOIN matkul m ON m.user_id = u.id
JOIN (VALUES
    ('CS186',  'Project 2 Buffer Manager', 'Implementasi buffer manager',      '2026-07-04 23:59+07'),
    ('CS61B',  'Project 3 BSTMap',         'Implementasi BSTMap',              '2026-07-02 10:00+07'),
    ('CS169',  'Sprint 2',                 'Deliverable sprint 2',             '2026-07-06 23:59+07')
) AS v(kode, judul, deskripsi, deadline) ON v.kode = m.kode
WHERE u.email = :'email'
  AND NOT EXISTS (SELECT 1 FROM tugas t WHERE t.mata_kuliah_id = m.id AND t.judul = v.judul);
