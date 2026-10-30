import api from "./api";
import type { ApiResult, StatusTugas, Tugas, TugasInput } from "../types";

// Urutan dan deadline_category dihitung backend; frontend hanya menampilkan.
export async function getTugas(): Promise<Tugas[]> {
  const { data } = await api.get<Tugas[]>("/tugas");
  return data;
}

export async function getTugasById(id: number): Promise<Tugas> {
  const { data } = await api.get<Tugas>(`/tugas/${id}`);
  return data;
}

export async function createTugas(body: TugasInput): Promise<Tugas> {
  const { data } = await api.post<ApiResult<Tugas>>("/tugas", body);
  return data.data;
}

export async function updateTugas(id: number, body: TugasInput): Promise<Tugas> {
  const { data } = await api.put<ApiResult<Tugas>>(`/tugas/${id}`, body);
  return data.data;
}

export async function updateStatusTugas(id: number, status: StatusTugas): Promise<Tugas> {
  const { data } = await api.patch<ApiResult<Tugas>>(`/tugas/${id}/status`, { status });
  return data.data;
}

export async function deleteTugas(id: number): Promise<void> {
  await api.delete(`/tugas/${id}`);
}
