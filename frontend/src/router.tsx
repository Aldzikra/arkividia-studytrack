import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useAuthStore } from "./stores/auth.store";

// Tiap halaman jadi chunk terpisah, dimuat saat route dibuka.
const AppLayout = lazyRouteComponent(() => import("./components/layout/AppLayout"), "AppLayout");
const LoginPage = lazyRouteComponent(() => import("./pages/LoginPage"), "LoginPage");
const RegisterPage = lazyRouteComponent(() => import("./pages/RegisterPage"), "RegisterPage");
const TugasPage = lazyRouteComponent(() => import("./pages/TugasPage"), "TugasPage");
const TugasFormPage = lazyRouteComponent(() => import("./pages/TugasFormPage"), "TugasFormPage");
const MatkulPage = lazyRouteComponent(() => import("./pages/MatkulPage"), "MatkulPage");

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

const tugasRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  // ?matkul=<id> dipakai tautan "Lihat tugas" di halaman Mata Kuliah.
  validateSearch: (search: Record<string, unknown>): { matkul?: number } => {
    const id = Number(search.matkul);
    return Number.isInteger(id) && id > 0 ? { matkul: id } : {};
  },
  component: TugasPage,
});
const tugasBaruRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/tugas/baru",
  component: TugasFormPage,
});
const tugasEditRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/tugas/$id/edit",
  component: TugasFormPage,
});
const matkulRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/matkul",
  component: MatkulPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  appRoute.addChildren([tugasRoute, tugasBaruRoute, tugasEditRoute, matkulRoute]),
]);

export const router = createRouter({
  routeTree,
  defaultPendingMs: 200, // jangan kedip untuk muat cepat
  defaultPendingComponent: () => (
    <div className="grid min-h-screen place-items-center text-muted">Memuat…</div>
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
