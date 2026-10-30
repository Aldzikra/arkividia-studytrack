import { initials } from "../../lib/initials";
import { useAuthStore } from "../../stores/auth.store";
import { Logo } from "../Logo";

// Mobile (< 768px).
export function MobileHeader() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface px-5 py-4 md:hidden">
      <Logo size="sm" />
      <div
        aria-label={user?.username}
        className="flex size-9 items-center justify-center rounded-full bg-brand-cyan-400 text-[13px] font-extrabold text-[#0b3a4a]"
      >
        {initials(user?.username ?? "")}
      </div>
    </header>
  );
}
