import { createRootRoute, createRoute, createRouter, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { MatkulPage } from "./pages/MatkulPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TugasPage } from "./pages/TugasPage";
import { useAuthStore } from "./stores/auth.store";

const rootRoute = createRootRoute({ component: Outlet });

const hasToken = () => useAuthStore.getState().token !== null;

// Sudah masuk: tidak perlu lihat halaman masuk/daftar lagi.
const redirectIfAuthed = () => {
  if (hasToken()) throw redirect({ to: "/" });
};

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: redirectIfAuthed,
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: redirectIfAuthed,
  component: RegisterPage,
});

// Semua halaman di bawah layout ini butuh token.
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  beforeLoad: () => {
    if (!hasToken()) throw redirect({ to: "/login" });
  },
  component: AppLayout,
});

const tugasRoute = createRoute({ getParentRoute: () => appRoute, path: "/", component: TugasPage });
const matkulRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/matkul",
  component: MatkulPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  appRoute.addChildren([tugasRoute, matkulRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
