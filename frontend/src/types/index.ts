// Bentuk response backend: backend/internal/models dan handlers.

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  username: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Matkul {
  id: number;
  nama: string;
  kode: string;
  dosen: string;
}

export type StatusTugas = "belum" | "selesai";

export type DeadlineCategory = "mendekati" | "overdue" | "normal";

export interface Tugas {
  id: number;
  judul: string;
  deskripsi: string;
  deadline: string; // RFC 3339
  status: StatusTugas;
  matkul_id: number;
  matkul_nama: string;
  created_at: string;
  // Hanya ada di GET /tugas.
  deadline_category?: DeadlineCategory;
}

// Body create/update tugas. Status diubah lewat PATCH /tugas/:id/status.
export interface TugasInput {
  judul: string;
  deskripsi: string;
  deadline: string;
  matkul_id: number;
}

// PUT/POST/PATCH membungkus hasilnya di { message, data }.
export interface ApiResult<T> {
  message: string;
  data: T;
}

export interface ApiError {
  error: string;
}
