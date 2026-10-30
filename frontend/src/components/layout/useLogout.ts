import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth.store";

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return () => {
    logout();
    void navigate({ to: "/login" });
  };
}
