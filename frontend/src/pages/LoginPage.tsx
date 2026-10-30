import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "../components/AuthShell";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { getApiError } from "../lib/api";
import { login } from "../lib/auth";
import { useAuthStore } from "../stores/auth.store";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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
          <h1 className="text-[26px] font-extrabold tracking-tight md:text-[30px]">Masuk</h1>
          <p className="text-sm text-muted md:text-[15px]">
            Masuk dengan email dan password akunmu.
          </p>
        </div>

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
          placeholder="Minimal 8 karakter"
          autoComplete="current-password"
          required
          value={password}
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
          {loading ? "Memproses…" : "Masuk"}
        </Button>

        <p className="text-center text-sm text-muted">
          Belum punya akun?{" "}
          <Link to="/register" className="font-bold">
            Daftar
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
