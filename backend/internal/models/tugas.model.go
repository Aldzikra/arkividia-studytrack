package models

import "time"

type Tugas struct {
	Id           int       `json:"id" db:"id"`
	Judul        string    `json:"judul" db:"judul" binding:"required,max=30"`
	Deskripsi    string    `json:"deskripsi" db:"deskripsi"`
	Deadline     time.Time `json:"deadline" db:"deadline" binding:"required"`
	Status       string    `json:"status" db:"status" binding:"omitempty,oneof=belum selesai"`
	MataKuliahId int       `json:"matkul_id" db:"mata_kuliah_id" binding:"required"`
	MatkulNama   string    `json:"matkul_nama" db:"-"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`

	// Fitur Categorize Deadline
	DeadlineCategory string `json:"deadline_category,omitempty" db:"-"`
}
