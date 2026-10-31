// Semua tampilan waktu dalam WIB. Backend menyimpan UTC; frontend hanya memformat.
const TZ = "Asia/Jakarta";

function parts(date: Date, opts: Intl.DateTimeFormatOptions) {
  const map: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat("id-ID", { timeZone: TZ, ...opts }).formatToParts(date)) {
    map[p.type] = p.value;
  }
  return map;
}

// "Kam, 2 Jul 2026 · 10.00"
export function formatDeadline(iso: string): string {
  const p = parts(new Date(iso), {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${p.weekday}, ${p.day} ${p.month} ${p.year} · ${p.hour}.${p.minute}`;
}

// "Kamis, 2 Juli 2026 · 09.00 WIB"
export function formatNow(now: Date): string {
  const p = parts(now, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${p.weekday}, ${p.day} ${p.month} ${p.year} · ${p.hour}.${p.minute} WIB`;
}

function durasi(ms: number): string {
  const menit = Math.max(Math.floor(ms / 60000), 1);
  if (menit < 60) return `${menit} menit`;

  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam`;

  return `${Math.floor(jam / 24)} hari`;
}

// Hanya label tampilan; kategori tetap dari backend.
export const sisaLabel = (iso: string, now: Date) => `Sisa ${durasi(new Date(iso).getTime() - now.getTime())}`;
export const terlambatLabel = (iso: string, now: Date) =>
  `Terlambat ${durasi(now.getTime() - new Date(iso).getTime())}`;

// ISO -> nilai untuk <input type="date"> dan <input type="time"> dalam WIB.
export function toWibInputs(iso: string): { date: string; time: string } {
  const s = new Date(iso).toLocaleString("sv-SE", { timeZone: TZ }); // "2026-07-02 10:00:00"
  return { date: s.slice(0, 10), time: s.slice(11, 16) };
}

// Tanggal + jam WIB -> RFC 3339 untuk backend.
export const fromWibInputs = (date: string, time: string) => `${date}T${time}:00+07:00`;
