import axios from "axios";

const TOKEN_KEY = "et_token";
const USER_KEY = "et_user";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // Login/register yang gagal juga 401: biarkan halamannya menampilkan pesan.
      const { pathname } = window.location;
      if (pathname !== "/login" && pathname !== "/register") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// Backend membalas error sebagai { "error": "..." }.
export function getApiError(err: unknown): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? "Tidak dapat terhubung ke server";
  }

  return "Terjadi kesalahan, coba lagi";
}

export default api;
export { TOKEN_KEY, USER_KEY };
