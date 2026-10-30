package repository

import (
	"arkavidia-studytrack/internal/models"
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const tugasColumns = `t.id, t.judul, t.deskripsi, t.deadline, t.status::text, t.mata_kuliah_id, m.name, t.created_at`

func scanTugas(row pgx.Row) (*models.Tugas, error) {
	var t models.Tugas

	err := row.Scan(
		&t.Id,
		&t.Judul,
		&t.Deskripsi,
		&t.Deadline,
		&t.Status,
		&t.MataKuliahId,
		&t.MatkulNama,
		&t.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &t, nil
}

func GetAllTugas(pool *pgxpool.Pool, userId string) ([]models.Tugas, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
		SELECT ` + tugasColumns + `
		FROM tugas t
		JOIN matkul m ON m.id = t.mata_kuliah_id
		WHERE m.user_id = $1
		ORDER BY t.created_at DESC
	`

	rows, err := pool.Query(ctx, query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tugas := []models.Tugas{}

	for rows.Next() {
		t, err := scanTugas(rows)
		if err != nil {
			return nil, err
		}

		tugas = append(tugas, *t)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tugas, nil
}

func GetTugasByID(pool *pgxpool.Pool, id int, userId string) (*models.Tugas, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
		SELECT ` + tugasColumns + `
		FROM tugas t
		JOIN matkul m ON m.id = t.mata_kuliah_id
		WHERE t.id = $1 AND m.user_id = $2
	`

	return scanTugas(pool.QueryRow(ctx, query, id, userId))
}

func CreateTugas(pool *pgxpool.Pool, userId string, tugas *models.Tugas) (*models.Tugas, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
		WITH t AS (
			INSERT INTO tugas (judul, deskripsi, deadline, mata_kuliah_id)
			SELECT $1, $2, $3, m.id FROM matkul m WHERE m.id = $4 AND m.user_id = $5
			RETURNING *
		)
		SELECT ` + tugasColumns + `
		FROM t JOIN matkul m ON m.id = t.mata_kuliah_id
	`

	return scanTugas(pool.QueryRow(ctx, query, tugas.Judul, tugas.Deskripsi, tugas.Deadline, tugas.MataKuliahId, userId))
}

func UpdateTugas(pool *pgxpool.Pool, userId string, tugas *models.Tugas) (*models.Tugas, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
		WITH t AS (
			UPDATE tugas SET judul = $1, deskripsi = $2, deadline = $3, mata_kuliah_id = $4
			WHERE id = $5
			  AND mata_kuliah_id IN (SELECT id FROM matkul WHERE user_id = $6)
			  AND $4 IN (SELECT id FROM matkul WHERE user_id = $6)
			RETURNING *
		)
		SELECT ` + tugasColumns + `
		FROM t JOIN matkul m ON m.id = t.mata_kuliah_id
	`

	return scanTugas(pool.QueryRow(ctx, query, tugas.Judul, tugas.Deskripsi, tugas.Deadline, tugas.MataKuliahId, tugas.Id, userId))
}

func UpdateStatusTugas(pool *pgxpool.Pool, id int, userId string, status string) (*models.Tugas, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
		WITH t AS (
			UPDATE tugas SET status = $1::status_tugas
			WHERE id = $2 AND mata_kuliah_id IN (SELECT id FROM matkul WHERE user_id = $3)
			RETURNING *
		)
		SELECT ` + tugasColumns + `
		FROM t JOIN matkul m ON m.id = t.mata_kuliah_id
	`

	return scanTugas(pool.QueryRow(ctx, query, status, id, userId))
}

func DeleteTugas(pool *pgxpool.Pool, id int, userId string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tag, err := pool.Exec(ctx, `
		DELETE FROM tugas
		WHERE id = $1 AND mata_kuliah_id IN (SELECT id FROM matkul WHERE user_id = $2)
	`, id, userId)
	if err != nil {
		return false, err
	}

	return tag.RowsAffected() > 0, nil
}
