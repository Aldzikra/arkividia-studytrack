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
