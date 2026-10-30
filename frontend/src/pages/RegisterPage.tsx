import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "../components/AuthShell";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { getApiError } from "../lib/api";
import { login, register } from "../lib/auth";
import { useAuthStore } from "../stores/auth.store";

const MIN_PASSWORD = 8;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < MIN_PASSWORD) {
      setPasswordError(`Password minimal ${MIN_PASSWORD} karakter`);
      return;
    }
    setPasswordError("");
    setLoading(true);

    try {
      await register({ username, email, password });
      // Backend tidak mengembalikan token saat daftar, jadi langsung masuk.
      const { token, user } = await login({ email, password });
      setAuth(token, user);
      await navigate({ to: "/" });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4.5 md:flex-none md:gap-5">
        <div className="flex flex-col gap-1.5 md:gap-2">
          <h1 className="text-[26px] font-extrabold tracking-tight md:text-[30px]">Daftar</h1>
          <p className="text-sm text-muted md:text-[15px]">Buat akun untuk mulai mencatat tugas.</p>
        </div>

        <Input
          label="Username"
          placeholder="nama pengguna"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="nama@kampus.ac.id"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder={`Minimal ${MIN_PASSWORD} karakter`}
          autoComplete="new-password"
          required
          value={password}
          error={passwordError}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p
            role="alert"
            className="rounded-control border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm font-semibold text-danger"
          >
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={loading} className="mt-auto md:mt-0">
          {loading ? "Memproses…" : "Daftar"}
        </Button>

        <p className="text-center text-sm text-muted">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold">
            Masuk
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
