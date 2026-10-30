import { useCallback, useState, type SubmitEvent } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "../components/Button";
import { Select, Textarea } from "../components/Fields";
import { InfoIcon } from "../components/icons";
import { Input } from "../components/Input";
import { getApiError } from "../lib/api";
import { fromWibInputs, toWibInputs } from "../lib/date";
import { getMatkul } from "../lib/matkul";
import { createTugas, getTugasById, updateTugas } from "../lib/tugas";
import { useFetch } from "../lib/useFetch";
import type { Tugas } from "../types";

// Tambah (/tugas/baru) dan ubah (/tugas/$id/edit) memakai form yang sama.
export function TugasFormPage() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const editId = id ? Number(id) : undefined;

  const matkul = useFetch(getMatkul);
  const loadTugas = useCallback(() => (editId ? getTugasById(editId) : Promise.resolve(undefined)), [editId]);
  const tugas = useFetch(loadTugas);

  // Tunggu data tugas siap supaya form edit langsung terisi (tanpa effect + setState).
  if (matkul.error || tugas.error) {
    return <p role="alert" className="font-semibold text-danger">{matkul.error || tugas.error}</p>;
  }
  if (!matkul.data || (editId && !tugas.data)) return <p className="text-muted">Memuat…</p>;

  return <TugasForm editId={editId} initial={tugas.data} matkul={matkul.data} />;
}

function TugasForm({ editId, initial, matkul }: {
  editId?: number;
  initial?: Tugas;
  matkul: { id: number; kode: string; nama: string }[];
}) {
  const navigate = useNavigate();
  const wib = initial ? toWibInputs(initial.deadline) : { date: "", time: "" };

  const [judul, setJudul] = useState(initial?.judul ?? "");
  const [matkulId, setMatkulId] = useState(initial ? String(initial.matkul_id) : "");
  const [deskripsi, setDeskripsi] = useState(initial?.deskripsi ?? "");
  const [date, setDate] = useState(wib.date);
  const [time, setTime] = useState(wib.time);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = { judul, deskripsi, deadline: fromWibInputs(date, time), matkul_id: Number(matkulId) };

    try {
      if (editId) await updateTugas(editId, body);
      else await createTugas(body);

      await navigate({ to: "/" });
    } catch (err) {
      setError(getApiError(err));
      setSaving(false);
    }
  }

  return (
    <div className="flex max-w-170 flex-col gap-5 md:gap-6">
      <Link to="/" className="inline-flex min-h-11 items-center self-start text-sm font-bold">
        Kembali ke Daftar Tugas
      </Link>

      <h1 className="text-[26px] font-extrabold tracking-tight md:text-[32px]">
        {editId ? "Ubah Tugas" : "Tambah Tugas"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-card border border-line bg-surface p-5 md:p-7">
        <Input label="Judul tugas" placeholder="Lab 4: Query Optimization" maxLength={30} required
          value={judul} onChange={(e) => setJudul(e.target.value)} />

        <Select label="Mata kuliah" required value={matkulId} onChange={(e) => setMatkulId(e.target.value)}>
          <option value="" disabled>Pilih mata kuliah</option>
          {matkul.map((m) => (
            <option key={m.id} value={m.id}>{m.kode} · {m.nama}</option>
          ))}
        </Select>
        {matkul.length === 0 && (
          <p className="-mt-3 text-sm text-muted">
            Belum ada mata kuliah. <Link to="/matkul" className="font-bold">Tambah dulu</Link>.
          </p>
        )}

        <Textarea label="Deskripsi" hint="(opsional)" placeholder="Catatan atau detail tugas"
          value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />

        <fieldset className="m-0 flex flex-col gap-2 border-none p-0">
          <legend className="mb-1.5 p-0 text-[13px] font-bold text-text-2">Deadline</legend>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Tanggal" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            <Input label="Jam (WIB)" type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="flex items-start gap-2.5 rounded-control bg-brand-cyan-50 px-3.5 py-3 text-[13px] leading-normal font-medium text-[#0b4a5e]">
            <InfoIcon className="mt-px shrink-0" />
            <span>Saat sisa waktunya kurang dari 24 jam, tugas ini otomatis ditandai dan dipindah ke bagian paling atas daftar.</span>
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-control border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm font-semibold text-danger">
            {error}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 pt-1">
          <Link to="/">
            <Button variant="secondary" className="border-line-input text-text-2">Batal</Button>
          </Link>
          <Button type="submit" disabled={saving || matkul.length === 0}>Simpan Tugas</Button>
        </div>
      </form>
    </div>
  );
}
