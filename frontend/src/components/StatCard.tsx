type Tone = "mendekati" | "overdue" | "lainnya";

const tones: Record<Tone, { box: string; num: string; label: string }> = {
  mendekati: {
    box: "border-mendekati-border bg-mendekati-bg",
    num: "text-mendekati-fg",
    label: "text-[#7a2e00]",
  },
  overdue: {
    box: "border-overdue-border bg-overdue-bg",
    num: "text-overdue-fg",
    label: "text-overdue-fg",
  },
  lainnya: { box: "border-line bg-surface", num: "text-brand-600", label: "text-text-2" },
};

export function StatCard({ tone, count, label }: { tone: Tone; count: number; label: string }) {
  const t = tones[tone];

  return (
    <div
      className={`flex flex-col gap-0.5 rounded-[12px] border px-3 py-2.5 md:gap-1 md:rounded-[14px] md:px-4.5 md:py-4 ${t.box}`}
    >
      <span className={`text-[22px] font-extrabold md:text-[28px] ${t.num}`}>{count}</span>
      <span className={`text-[11px] font-bold md:text-[13px] md:font-semibold ${t.label}`}>{label}</span>
    </div>
  );
}
