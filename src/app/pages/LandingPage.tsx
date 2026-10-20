import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useSession } from "@/features/auth/hooks/useSession";

// TODO(user): isi URL project baru di sini setelah project publik baru live.
const NEW_PROJECT_URL = "";

/** Reveal saat elemen masuk viewport — animasi halus bawaan halaman lama. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// Halaman publik minimal bertema "301": proyek ini sudah dipindahkan ke
// project baru. Angka 301 murni elemen visual (BUKAN redirect HTTP) agar
// pengunjung paham kontennya pindah; CTA di bawah mengarah ke URL baru.
export function LandingPage() {
  const { isSuperAdmin } = useSession();
  const heroReveal = useReveal<HTMLDivElement>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <style>{`
        .reveal{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease;}
        .reveal.is-visible{opacity:1;transform:none;}
        @media (prefers-reduced-motion: reduce){.reveal{opacity:1;transform:none;transition:none;}}
      `}</style>

      <div ref={heroReveal} className="flex flex-col items-center gap-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-kicker">Project Module</p>

        {/* Fokus utama hero: angka 301 raksasa sebagai penanda "moved". */}
        <h1 className="text-[7rem] font-bold leading-none tracking-tight sm:text-[11rem]">
          <span className="text-foreground">3</span>
          <span className="text-kicker">0</span>
          <span className="text-foreground">1</span>
        </h1>

        <p className="text-base text-muted-foreground sm:text-lg">Halaman dipindahkan</p>

        {/* Tombol disusun vertikal: Dashboard (kondisional) selalu di ATAS CTA. */}
        <div className="flex flex-col items-center gap-3">
          {/* Pintu masuk privat: HANYA dirender untuk superadmin (bukan
              disembunyikan via CSS), supaya pengunjung publik tidak melihat
              tombol ini sama sekali. Auth memakai useSession yang sudah ada. */}
          {isSuperAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-input px-5 py-2.5 text-[0.79rem] font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Dashboard
            </Link>
          )}

          {/* CTA ke project baru. Selama NEW_PROJECT_URL masih kosong, tombol
              dirender disabled agar tidak memicu navigasi ke URL rusak;
              otomatis aktif (jadi anchor) setelah konstanta di atas diisi. */}
          {NEW_PROJECT_URL ? (
            <a
              href={NEW_PROJECT_URL}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[0.79rem] font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Kunjungi Halaman Baru <ArrowRight size={14} />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-primary/50 px-5 py-2.5 text-[0.79rem] font-semibold text-primary-foreground"
            >
              Kunjungi Halaman Baru <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
