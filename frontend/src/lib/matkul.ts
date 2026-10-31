import api from "./api";
import type { ApiResult, Matkul } from "../types";

export type MatkulInput = Omit<Matkul, "id">;

export async function getMatkul(): Promise<Matkul[]> {
  const { data } = await api.get<Matkul[]>("/mata-kuliah");
  return data;
}

export async function createMatkul(body: MatkulInput): Promise<Matkul> {
  const { data } = await api.post<ApiResult<Matkul>>("/mata-kuliah", body);
  return data.data;
}

export async function updateMatkul(id: number, body: MatkulInput): Promise<Matkul> {
  const { data } = await api.put<ApiResult<Matkul>>(`/mata-kuliah/${id}`, body);
  return data.data;
}

export async function deleteMatkul(id: number): Promise<void> {
  await api.delete(`/mata-kuliah/${id}`);
}
