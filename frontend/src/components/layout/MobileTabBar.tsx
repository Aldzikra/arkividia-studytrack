import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CapIcon, ListIcon, LogoutIcon } from "../icons";
import { useLogout } from "./useLogout";

const itemClass =
  "flex min-h-13 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[12px] text-xs font-bold text-muted hover:text-muted";
const activeClass = "font-extrabold text-brand-600 hover:text-brand-600";

function Pill({ active, children }: { active?: boolean; children: ReactNode }) {
  return (
    <span className={`flex rounded-pill px-4 py-0.75 ${active ? "bg-brand-50" : ""}`}>
      {children}
    </span>
  );
}

// Mobile (< 768px).
export function MobileTabBar() {
  const logout = useLogout();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-3 gap-1 border-t border-line bg-surface px-3 pt-2 pb-5 md:hidden"
    >
      <Link
        to="/"
        activeOptions={{ exact: true }}
        className={itemClass}
        activeProps={{ className: `${itemClass} ${activeClass}`, "aria-current": "page" }}
      >
        {({ isActive }) => (
          <>
            <Pill active={isActive}>
              <ListIcon width={20} height={20} />
            </Pill>
            Tugas
          </>
        )}
      </Link>
      <Link
        to="/matkul"
        className={itemClass}
        activeProps={{ className: `${itemClass} ${activeClass}`, "aria-current": "page" }}
      >
        {({ isActive }) => (
          <>
            <Pill active={isActive}>
              <CapIcon width={20} height={20} />
            </Pill>
            Mata Kuliah
          </>
        )}
      </Link>
      <button type="button" onClick={logout} className={itemClass}>
        <Pill>
          <LogoutIcon width={20} height={20} />
        </Pill>
        Keluar
      </button>
    </nav>
  );
}
