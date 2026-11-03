"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import Image from "next/image";
import { AnchorLink } from "@/components/shared/AnchorLink";
import { AyatKursiDialog } from "@/components/home/AyatKursiDialog";
import { Countdown } from "@/components/home/Countdown";
import { HeroArtwork } from "@/components/home/HeroArtwork";
import { useArtworkShare } from "@/components/home/HeroTitleShare";
import {
  heroArtwork,
  type HeroDetailId,
  type HeroHotspotId,
} from "@/data/hero-artwork";
import { openHistory } from "@/lib/history-nav";
import { scrollToAnchor } from "@/lib/anchor";
import type { Dictionary } from "@/i18n/types";

/*
 * Hero versi poster karya — desain zoom-to-element (bukan preview panel/grid).
 *
 * Alur interaksi (spesifikasi P3 v2):
 *   klik/tap shape hotspot (atau item popover) → state zoom di sini →
 *   HeroArtwork meng-zoom karya ke zona itu (CSS transform, origin centroid
 *   bbox ENTRI yang diklik) + chip aksi melayang di bawah figure;
 *   aksi ada DI DALAM chip (tombol aksi + tutup). Aksi ke anchor/section/
 *   modal menutup zoom lebih dulu, baru dijalankan.
 *
 * - State zoom { id, index }: index = posisi entri di heroArtwork.hotspots,
 *   karena baju (04a/04b) dan mata (07a/07b) punya id sama — origin zoom
 *   dihitung dari bbox entri yang EKSAT diklik, bukan bbox gabungan id.
 * - previewId hanya korek hover/fokus (ring emas) + ring ikut menyala
 *   selama zoom pada zona yang sama.
 * - Destinasi aksi (kontrak P0): wajah → jalur Dahlan, matahari → jalur
 *   Muhammadiyah, sorban → tabel AUM, baju → modal Ayat Kursi (P7),
 *   janggut → #peta, telinga → #agenda, mata → #layanan, kelor → #tentang;
 *   judul → share, tanggal → tabel kepemimpinan pusat.
 * - Indeks 8 detail sekarang POPOVER menu aksesibel (bukan grid 8 item):
 *   Esc/klik luar menutup, tombol ≥ 44px, hover/fokus menyalakan ring.
 * - Layout: mobile H1 → figure → indeks → intro → CTA (order-);
 *   desktop grid 12 kolom, kiri teks+indeks+CTA, kanan figure.
 *   Countdown full width di bawah. Gambar TIDAK dibungkus
 *   Reveal/AnimatedContent (harus terlihat tanpa JS). Anchor target
 *   (#peta dst.) sudah ber-scroll-mt.
 */

/* Urutan nomor detail — sama dengan nomor debug/kartu (01-08). */
const DETAIL_ORDER: ReadonlyArray<HeroDetailId> = [
  "wajah", "matahari", "sorban", "baju",
  "janggut", "telinga", "mata", "kelor",
];

/* Indeks pertama tiap id di heroArtwork.hotspots — entri yang dibuka dari
   popover (baju dan mata punya dua entri, popover memakai yang pertama). */
const FIRST_INDEX = new Map<HeroHotspotId, number>();
heroArtwork.hotspots.forEach((hotspot, index) => {
  if (!FIRST_INDEX.has(hotspot.id)) FIRST_INDEX.set(hotspot.id, index);
});

type ZoomEntry = { id: HeroHotspotId; index: number };

export function Hero({ dict }: { dict: Dictionary }) {
  const [zoom, setZoom] = useState<ZoomEntry | null>(null);
  const [previewId, setPreviewId] = useState<HeroHotspotId | null>(null);
  const [ayatKursiOpen, setAyatKursiOpen] = useState(false);
  const { share } = useArtworkShare(dict);
  /* Pemicu zoom terakhir (item popover) untuk mengembalikan fokus saat
     zoom ditutup; klik shape tidak mengisi ini — fokus kembali ke figure. */
  const triggerRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [heroInView, setHeroInView] = useState(true);

  /* Semua animasi dekoratif hero di-pause saat hero keluar viewport. */
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const endPreview = (): void => setPreviewId(null);

  const executeAction = (id: HeroHotspotId): void => {
    if (id === "judul") {
      void share();
      return;
    }
    switch (id) {
      case "tanggal":
        openHistory({ table: "leadership" });
        break;
      case "wajah":
        openHistory({ track: "dahlan" });
        break;
      case "matahari":
        openHistory({ track: "muhammadiyah" });
        break;
      case "sorban":
        openHistory({ table: "aum" });
        break;
      case "baju":
        setAyatKursiOpen(true);
        break;
      case "janggut":
        scrollToAnchor("#peta");
        break;
      case "telinga":
        scrollToAnchor("#agenda");
        break;
      case "mata":
        scrollToAnchor("#layanan");
        break;
      case "kelor":
        scrollToAnchor("#tentang");
        break;
    }
  };

  /* Klik shape / item popover: buka zoom (dan biarkan ring menyala). */
  const openZoom = (id: HeroHotspotId, index: number): void => {
    setPreviewId(id);
    setZoom({ id, index });
  };

  /* Aksi dari chip: tutup zoom dulu, lalu jalankan aksinya. */
  const handleChipAction = (id: HeroHotspotId): void => {
    const trigger = triggerRef.current;
    if (trigger instanceof HTMLElement && trigger.isConnected) {
      trigger.focus();
    }
    setZoom(null);
    executeAction(id);
  };

  return (
    <section
      ref={heroRef}
      className={`hero-shell hero-gradient-border${heroInView ? " hero-in-view" : ""}`}
    >
      <div className="container-page relative z-10">
        <div className="hero-layout py-10 lg:py-14">
          <div className="hero-layout__text">
            {/* --- Eyebrow + judul ------------------------------------- */}
            <div className="hero-layout__title">
              <p className="hero-layout__eyebrow text-ocean">
                {dict.hero.eyebrow}
              </p>
              <h1 className="display-title mt-3 text-navy">
                <span className="block">{dict.hero.titleLine1}</span>
                <span className="block">{dict.hero.titleLine2}</span>
              </h1>
            </div>

            <p className="hero-layout__intro body-lead max-w-xl">
              {dict.hero.intro}
            </p>

            {/* --- CTA primer ------------------------------------------ */}
            <div className="hero-layout__cta">
              <AnchorLink
                href="#sejarah"
                className="btn btn-primary hero-cta"
              >
                {dict.hero.ctaPrimary}
                <ArrowIcon />
              </AnchorLink>
            </div>
          </div>

          {/* --- Figure karya (zoom + chip + indeks di bawah karya) --- */}
          <HeroArtwork
            className="hero-layout__figure"
            dict={dict}
            previewId={previewId}
            zoom={zoom}
            triggerRef={triggerRef}
            onPreview={setPreviewId}
            onPreviewEnd={endPreview}
            onZoom={openZoom}
            onZoomEnd={() => setZoom(null)}
            onChipAction={handleChipAction}
            index={
              <DetailIndex
                dict={dict}
                triggerRef={triggerRef}
                onPreview={setPreviewId}
                onPreviewEnd={endPreview}
                onZoom={openZoom}
                className="hero-artwork__index--overlay"
              />
            }
          />
        </div>

        <div id="countdown" className="scroll-mt-24 border-t border-line pb-6 pt-5">
          <Countdown dict={dict} />
        </div>
      </div>

      {/* Modal P7 milik sendiri; hanya dibuka dari chip/hotspot baju. */}
      <AyatKursiDialog
        open={ayatKursiOpen}
        onClose={() => setAyatKursiOpen(false)}
        dict={dict}
      />
    </section>
  );
}

/* --- Popover indeks 8 detail ---------------------------------------------- */

type DetailIndexProps = {
  dict: Dictionary;
  triggerRef: React.RefObject<HTMLElement | null>;
  onPreview: (id: HeroHotspotId) => void;
  onPreviewEnd: () => void;
  onZoom: (id: HeroHotspotId, index: number) => void;
  className?: string;
};

function DetailIndex({
  dict,
  triggerRef,
  onPreview,
  onPreviewEnd,
  onZoom,
  className,
}: DetailIndexProps): ReactElement {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  /* Esc + klik/tap di luar menutup popover. */
  useEffect(() => {
    if (!open) return;
    const close = (): void => setOpen(false);
    const onPointerDown = (event: PointerEvent): void => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        close();
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={`hero-artwork__index ${className ?? ""}`.trim()} ref={rootRef}>
      <button
        ref={toggleRef}
        type="button"
        className="hero-artwork__index-toggle"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="hero-artwork-index"
        onClick={() => setOpen((value) => !value)}
      >
        {dict.heroArtwork.indexToggle}
        <ChevronIcon />
      </button>
      <div
        id="hero-artwork-index"
        className="hero-artwork__index-menu"
        hidden={!open}
      >
        {DETAIL_ORDER.map((id, index) => {
          const { label, action } = dict.heroArtwork.details[id];
          const thumb = heroArtwork.details[id];
          return (
            <button
              key={id}
              type="button"
              className="hero-artwork__index-btn"
              aria-label={`${label} — ${action}`}
              onPointerEnter={() => onPreview(id)}
              onPointerLeave={onPreviewEnd}
              onFocus={() => onPreview(id)}
              onBlur={(event) => {
                if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
                  onPreviewEnd();
                }
              }}
              onClick={(event) => {
                triggerRef.current = toggleRef.current ?? event.currentTarget;
                onZoom(id, FIRST_INDEX.get(id) ?? 0);
                setOpen(false);
              }}
            >
              <span
                aria-hidden="true"
                className="hero-artwork__index-num"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <Image
                src={thumb.src}
                width={thumb.width}
                height={thumb.height}
                sizes="36px"
                loading="lazy"
                alt=""
                className="hero-artwork__index-thumb"
              />
              <span className="hero-artwork__index-label">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --- Ikon ------------------------------------------------------------------- */

function ChevronIcon(): ReactElement {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="hero-artwork__chevron"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowIcon(): ReactElement {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="rtl:rotate-180"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
