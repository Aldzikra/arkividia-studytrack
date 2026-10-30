package models

type Matkul struct {
	Id    int    `json:"id" db:"id"`
	Nama  string `json:"nama" db:"nama" binding:"required,max=50"`
	Kode  string `json:"kode" db:"kode" binding:"required,max=10"`
	Dosen string `json:"dosen" db:"dosen" binding:"required,max=30"`
}
