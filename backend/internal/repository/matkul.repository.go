package repository

import (
	"arkavidia-studytrack/internal/models"
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetAllMatkul(pool *pgxpool.Pool, userId string) ([]models.Matkul, error) {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
		SELECT id, name, kode, dosen FROM matkul WHERE user_id = $1 ORDER BY id;
	`

	var rows, err = pool.Query(ctx, query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var course []models.Matkul = []models.Matkul{}

	for rows.Next() {
		var matkul models.Matkul

		err = rows.Scan(
			&matkul.Id,
			&matkul.Nama,
			&matkul.Kode,
			&matkul.Dosen,
		)

		if err != nil {
			return nil, err
		}

		course = append(course, matkul)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return course, nil
}

func CreateMatkul(pool *pgxpool.Pool, userId string, matkul *models.Matkul) (*models.Matkul, error) {
	var ctx context.Context
	var cancel context.CancelFunc
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
		INSERT INTO matkul (name, kode, dosen, user_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name, kode, dosen
	`

	var err error = pool.QueryRow(ctx, query, matkul.Nama, matkul.Kode, matkul.Dosen, userId).Scan(
		&matkul.Id,
		&matkul.Nama,
		&matkul.Kode,
		&matkul.Dosen,
	)

	if err != nil {
		return nil, err
	}

	return matkul, nil
}

func GetMatkulByID(pool *pgxpool.Pool, id int, userId string) (*models.Matkul, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
		SELECT id, name, kode, dosen FROM matkul
		WHERE id = $1 AND user_id = $2
	`

	var matkul models.Matkul
	err := pool.QueryRow(ctx, query, id, userId).Scan(
		&matkul.Id,
		&matkul.Nama,
		&matkul.Kode,
		&matkul.Dosen,
	)
	if err != nil {
		return nil, err
	}

	return &matkul, nil
}

func UpdateMatkul(pool *pgxpool.Pool, userId string, matkul *models.Matkul) (*models.Matkul, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
		UPDATE matkul SET name = $1, kode = $2, dosen = $3
		WHERE id = $4 AND user_id = $5
		RETURNING id, name, kode, dosen
	`

	err := pool.QueryRow(ctx, query, matkul.Nama, matkul.Kode, matkul.Dosen, matkul.Id, userId).Scan(
		&matkul.Id,
		&matkul.Nama,
		&matkul.Kode,
		&matkul.Dosen,
	)
	if err != nil {
		return nil, err
	}

	return matkul, nil
}

func DeleteMatkul(pool *pgxpool.Pool, userId string, id int) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tag, err := pool.Exec(ctx, `DELETE FROM matkul WHERE id = $1 AND user_id = $2`, id, userId)
	if err != nil {
		return false, err
	}

	return tag.RowsAffected() > 0, nil
}
