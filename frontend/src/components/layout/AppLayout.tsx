import { Outlet, useRouterState } from "@tanstack/react-router";
import { MobileHeader } from "./MobileHeader";
import { MobileTabBar } from "./MobileTabBar";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  // key = path agar animasi masuk berulang tiap pindah halaman.
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-page md:flex">
      <Sidebar />
      <MobileHeader />

      {/* pb-28: ruang untuk tab bar tetap di mobile */}
      <main className="min-w-0 flex-1 px-5 pt-5 pb-28 md:px-10 md:pt-9 md:pb-14">
        <div key={pathname} className="animate-fade-up">
          <Outlet />
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
