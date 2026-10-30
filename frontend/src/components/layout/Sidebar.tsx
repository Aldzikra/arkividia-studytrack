import { Link } from "@tanstack/react-router";
import { initials } from "../../lib/initials";
import { useAuthStore } from "../../stores/auth.store";
import { CapIcon, ListIcon, LogoutIcon } from "../icons";
import { Logo } from "../Logo";
import { useLogout } from "./useLogout";

const navClass =
  "flex min-h-11 items-center gap-3 rounded-control px-3.5 text-[15px] font-semibold text-text-2 hover:bg-page hover:text-text-2";
const activeClass = "bg-brand-50 font-bold text-brand-600 hover:bg-brand-50 hover:text-brand-600";

// Desktop (>= 768px).
export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <nav
      aria-label="Navigasi utama"
      className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-8 border-r border-line bg-surface px-5 py-7 md:flex"
    >
      <Logo />

      <div className="flex flex-col gap-1">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className={navClass}
          activeProps={{ className: `${navClass} ${activeClass}`, "aria-current": "page" }}
        >
          <ListIcon />
          Daftar Tugas
        </Link>
        <Link
          to="/matkul"
          className={navClass}
          activeProps={{ className: `${navClass} ${activeClass}`, "aria-current": "page" }}
        >
          <CapIcon />
          Mata Kuliah
        </Link>
      </div>

      <div className="mt-auto flex items-center gap-3 rounded-[12px] bg-page p-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-cyan-400 text-sm font-extrabold text-[#0b3a4a]">
          {initials(user?.username ?? "")}
        </div>
        <div className="flex min-w-0 grow flex-col">
          <span className="truncate text-sm font-bold">{user?.username}</span>
          <span className="truncate text-xs text-muted">{user?.email}</span>
        </div>
        <button
          type="button"
          onClick={logout}
          aria-label="Keluar"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted hover:bg-line hover:text-ink"
        >
          <LogoutIcon />
        </button>
      </div>
    </nav>
  );
}
