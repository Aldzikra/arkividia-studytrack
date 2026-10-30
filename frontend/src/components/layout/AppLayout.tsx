import { Outlet } from "@tanstack/react-router";
import { MobileHeader } from "./MobileHeader";
import { MobileTabBar } from "./MobileTabBar";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-page md:flex">
      <Sidebar />
      <MobileHeader />

      {/* pb-28: ruang untuk tab bar tetap di mobile */}
      <main className="min-w-0 flex-1 px-5 pt-5 pb-28 md:px-10 md:pt-9 md:pb-14">
        <div className="w-full max-w-230">
          <Outlet />
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
