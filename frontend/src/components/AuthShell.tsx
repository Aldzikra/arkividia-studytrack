import type { ReactNode } from "react";
import { Logo } from "./Logo";

// Kerangka halaman masuk/daftar: panel biru (desktop kiri, mobile atas) + form.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface md:flex-row">
      <section
        aria-hidden="true"
        className="relative flex h-75 shrink-0 flex-col justify-between overflow-hidden rounded-b-[28px] bg-brand-500 px-6 pt-8 pb-7 text-white md:h-auto md:flex-1 md:gap-10 md:rounded-none md:p-12"
      >
        <div className="absolute -top-15 -right-15 size-50 rounded-full bg-brand-400 md:-top-20 md:-right-20 md:size-70" />
        <div className="absolute right-7 bottom-10 size-18 rotate-12 rounded-[18px] bg-brand-cyan-400 md:right-15 md:bottom-22 md:size-30 md:rounded-[28px]" />
        <div className="absolute right-29 bottom-5.5 size-9 rounded-full bg-brand-lemon-200 md:right-50 md:bottom-10 md:size-16" />

        <div className="relative">
          <Logo tone="light" size="sm" />
        </div>

        <div className="relative flex max-w-60 flex-col gap-3.5 md:max-w-105">
          <h2 className="text-[28px] leading-[1.15] font-extrabold tracking-tight md:text-[40px]">
            Semua tugas kuliah, satu daftar.
          </h2>
          <p className="hidden text-[17px] leading-relaxed md:block">
            Deadline yang tinggal kurang dari 24 jam langsung naik ke paling atas, jadi tidak ada
            yang terlewat.
          </p>
        </div>
      </section>

      <main className="flex flex-1 items-stretch justify-center px-6 pt-7 pb-8 md:items-center md:p-12">
        <div className="flex w-full max-w-100 flex-col">{children}</div>
      </main>
    </div>
  );
}
