CREATE TABLE IF NOT EXISTS matkul (
    id          SERIAL       PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    kode        VARCHAR(10)  NOT NULL,
    dosen       VARCHAR(30) NOT NULL,
    user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- kode unik per mahasiswa
    CONSTRAINT matkul_user_kode_key UNIQUE (user_id, kode)
);

CREATE INDEX IF NOT EXISTS idx_matkul_user_id ON matkul(user_id);
