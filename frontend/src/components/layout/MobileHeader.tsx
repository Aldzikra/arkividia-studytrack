import { initials } from "../../lib/initials";
import { useAuthStore } from "../../stores/auth.store";
import { LogoutIcon } from "../icons";
import { Logo } from "../Logo";
import { useLogout } from "./useLogout";

// Mobile (< 768px). Keluar ada di sini, bukan di tab bar bawah.
export function MobileHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface py-2 pr-2 pl-5 md:hidden">
      <Logo size="sm" />
      <div className="flex items-center gap-1">
        <div
          aria-label={user?.username}
          className="flex size-9 items-center justify-center rounded-full bg-brand-cyan-400 text-[13px] font-extrabold text-[#0b3a4a]"
        >
          {initials(user?.username ?? "")}
        </div>
        <button
          type="button"
          onClick={logout}
          aria-label="Keluar"
          className="flex size-11 cursor-pointer items-center justify-center rounded-control text-muted transition-colors hover:bg-line hover:text-ink"
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
}
