import api from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest, User } from "../types";

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", body);
  return data;
}

export async function register(body: RegisterRequest): Promise<User> {
  const { data } = await api.post<User>("/auth/register", body);
  return data;
}
