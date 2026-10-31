import type { ReactNode } from "react";
import { AlarmIcon, AlertIcon, CheckIcon } from "./icons";

type BadgeType = "belum" | "selesai" | "mendekati" | "overdue";

const styles: Record<BadgeType, string> = {
  belum: "bg-belum-bg text-belum-fg",
  selesai: "bg-selesai-bg text-selesai-fg",
  mendekati: "bg-mendekati text-white",
  overdue: "bg-overdue text-white",
};

const icons: Partial<Record<BadgeType, ReactNode>> = {
  selesai: <CheckIcon />,
  mendekati: <AlarmIcon />,
  overdue: <AlertIcon />,
};

export function Badge({ type, children }: { type: BadgeType; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-bold ${styles[type]}`}
    >
      {icons[type]}
      {children}
    </span>
  );
}
