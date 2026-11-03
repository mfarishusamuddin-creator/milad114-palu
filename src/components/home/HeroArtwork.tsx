"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import Image from "next/image";
import {
  heroArtwork,
  type HeroActionId,
  type HeroDetailId,
  type HeroHotspot,
  type HeroHotspotId,
} from "@/data/hero-artwork";
import type { Dictionary } from "@/i18n/types";
import "./hero-artwork.css";

/*
 * Figure karya kaligrafi + overlay SVG hotspot + zoom-to-element (P3 v2).
 *
 * - Sumber koordinat: src/data/hero-artwork.ts (milik P1, JANGAN diubah).
 *   Persen (x/y/w/h) dikonversi ke px viewBox 0 0 1386 1984; `points`
 *   (polygon, persen) dikonversi; `path` SUDAH px — dipakai apa adanya,
 *   fillRule default "evenodd". RTL tidak mengubah koordinat SVG.
 * - Zoom-to-element: klik hotspot membuka zoom (state milik Hero.tsx).
 *   Pembungkus dalam (Image + SVG) di-scale via CSS transform dengan
 *   transform-origin di CENTROID bbox ENTRI yang diklik, sehingga entri
 *   bermata dua (baju 04a/04b, mata 07a/07b, id sama) punya origin dari
 *   wilayahnya sendiri selama `index` entri yang dipilih disertakan.
 * - Kelor aman: semua shape fill="transparent" (fill-rule mengikuti
 *   evenodd), lubang wajah/sorban tetap lolos ke bentuk di bawahnya;
 *   `kelor` dirender terakhir (paling atas) sehingga klik kontur/lubang
 *   kelor selalu milik kelor, bukan baju.
 * - Chip aksi kecil melayang DI BAWAH figure (top:100%), bukan menutupi
 *   karya: nomor + label + teks aksi + tombol aksi + tutup. Tombol aksi
 *   fokus-mengarah saat zoom terbuka; pada tutup fokus kembali ke pemicu
 *   (item popover via triggerRef, atau ke figure bila pemicunya shape).
 * - Keluar zoom: Escape, tombol tutup chip, klik latar tipis (backdrop),
 *   atau klik bagian gambar di luar hotspot. Aksi anchor/section/modal
 *   menutup zoom dulu (Hero.tsx) sebelum dijalankan.
 * - Shape TIDAK focusable: kontrol aksesibelnya adalah popover indeks
 *   (Hero.tsx) + chip.
 * - Debug ?heroDebug=1 (hanya non-produksi): semua ring menyala + label
 *   nomor/id teknis (01-08, A1-A2) untuk pemeriksaan P8.
 */

const VIEW_W = heroArtwork.width;
const VIEW_H = heroArtwork.height;

/* Sumber resolusi tinggi untuk zoom. Rasio & framing sama dengan
   hero-artwork.jpg; koordinat hotspot tetap memakai ruang logis 1386×1984.
   File ini dimuat lebih awal lewat `preload` agar siap sebelum intro selesai. */
const HERO_IMAGE_SRC = "/media/hero/hero-artwork-hi.webp";

/* Padding hit area tak terlihat (px viewBox, bukan px layar) untuk ring mata
   yang memang kecil (07a ≈ 32 px, 07b ≈ 27 px). Nilainya sengaja kecil:
   lubang evenodd wajah hanya ±3 px lebih besar dari ring mata, dan jarak
   antarmata (pusat ke pusat) ±104 px — padding ≥44px layar pasti menabrak
   area wajah/mata pasangannya, jadi presisi didahulukan; jalur sentuh
   andalannya tetap popover item 07 (≥44px). Dicatat di
   HANDOFF-hero-component.md. */
const EYE_PAD_X = 10;
const EYE_PAD_Y = 4;

const ACTION_ID_LIST: ReadonlyArray<string> = ["judul", "tanggal"];

const DETAIL_NUMBER: Record<HeroDetailId, string> = {
  wajah: "01",
  matahari: "02",
  sorban: "03",
  baju: "04",
  janggut: "05",
  telinga: "06",
  mata: "07",
  kelor: "08",
};

const SUFFIX = "abcdefghijkl";

/* Zona yang konturnya "kurang presisi" (wajah, mata, janggut, telinga) TIDAK
   digambar bergaris penuh agar lebih elegan; hanya disisakan 2-4 potong garis
   yang tetap MENGIKUTI kontur aslinya (memakai pathLength=100 + dash), sehingga
   terlihat seperti aksen, bukan kotak/garis acak. Zona presisi (baju, sorban,
   matahari, kelor) tetap bergaris penuh. Permintaan pemilik. */
const PARTIAL_RING: Partial<
  Record<HeroDetailId, { dash: string; offset: number }>
> = {
  wajah: { dash: "11 22.33", offset: 8 },   // 3 potong garis
  janggut: { dash: "12 38", offset: 34 },   // 2 potong garis
  telinga: { dash: "14 36", offset: 22 },   // 2 potong garis
  mata: { dash: "24 76", offset: 40 },      // 1 potong per mata (2 total)
};

export type ZoomEntry = { id: HeroHotspotId; index: number };

type HeroArtworkProps = {
  dict: Dictionary;
  previewId: HeroHotspotId | null;
  zoom: ZoomEntry | null;
  triggerRef: React.RefObject<HTMLElement | null>;
  onPreview: (id: HeroHotspotId) => void;
  onPreviewEnd: () => void;
  onZoom: (id: HeroHotspotId, index: number) => void;
  onZoomEnd: () => void;
  onChipAction: (id: HeroHotspotId) => void;
  className?: string;
};

export function HeroArtwork({
  dict,
  previewId,
  zoom,
  triggerRef,
  onPreview,
  onPreviewEnd,
  onZoom,
  onZoomEnd,
  onChipAction,
  className,
}: HeroArtworkProps): ReactElement {
  const [debugMode, setDebugMode] = useState<"off" | "rings" | "labels">("off");
  const frameRef = useRef<HTMLDivElement | null>(null);
  const chipActionRef = useRef<HTMLButtonElement | null>(null);

  /* Aliran gradien ring (mengikuti GradientText): aktif hanya bila pengguna
     tidak meminta reduced motion. Dibaca lewat setTimeout agar tidak
     setState sinkron di dalam efek (aturan lint proyek). */
  const [ringFlow, setRingFlow] = useState(false);
  useEffect(() => {
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduce) return;
    const timer = window.setTimeout(() => setRingFlow(true), 0);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* ?heroDebug=1 hanya non-produksi. Dibaca lewat setTimeout (bukan setState
     sinkron dalam efek — larangan lint) dan diulang saat navigasi popstate. */
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const readFlag = (): void => {
      const value = new URLSearchParams(window.location.search).get("heroDebug");
      setDebugMode(value === null ? "off" : value === "labels" ? "labels" : "rings");
    };
    const timer = window.setTimeout(readFlag, 0);
    window.addEventListener("popstate", readFlag);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", readFlag);
    };
  }, []);

  /* Tutup zoom + kembalikan fokus ke pemicu (popover atau figure). */
  const stopZoom = useCallback(() => {
    const trigger = triggerRef.current;
    if (trigger instanceof HTMLElement && trigger.isConnected) {
      trigger.focus();
    } else {
      frameRef.current?.focus();
    }
    onZoomEnd();
  }, [triggerRef, onZoomEnd]);

  /* Escape keluar zoom. */
  useEffect(() => {
    if (!zoom) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        stopZoom();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [zoom, stopZoom]);

  /* Fokus-mengarah: tombol aksi chip menerima fokus saat zoom terbuka. */
  useEffect(() => {
    if (!zoom) return;
    const frame = window.requestAnimationFrame(() => {
      chipActionRef.current?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [zoom]);

  const zoomEntry = zoom ? heroArtwork.hotspots[zoom.index] : undefined;
  const zoomStyle: CSSProperties | undefined = zoomEntry
    ? {
        transform: `scale(${zoomScale(zoomEntry)})`,
        transformOrigin: `${zoomEntry.x + zoomEntry.w / 2}% ${
          zoomEntry.y + zoomEntry.h / 2
        }%`,
      }
    : undefined;

  /* Debug: `?heroDebug=1` menampilkan RING saja (bersih, tanpa teks).
     Nomor kecil 01-08/A1-A2 hanya bila `?heroDebug=labels` — opsional
     untuk QA, tidak pernah tampil pada mode debug biasa. */
  const heroDebug = debugMode !== "off";
  const showLabels = debugMode === "labels";
  const occurrence = new Map<string, number>();
  const debugLabels = showLabels
    ? heroArtwork.hotspots.map((hotspot): string => {
        const count = occurrence.get(hotspot.id) ?? 0;
        occurrence.set(hotspot.id, count + 1);
        return debugLabel(hotspot, count);
      })
    : [];

  return (
    <figure
      className={
        `hero-artwork ${className ?? ""}`.trim() +
        (zoom ? " hero-artwork--zoomed" : "")
      }
    >
      {zoom ? (
        <button
          type="button"
          className="hero-artwork__backdrop"
          aria-label={dict.heroArtwork.chipClose}
          onClick={stopZoom}
        />
      ) : null}
      <div className="hero-artwork__stage">
        <div
          className="hero-artwork__frame"
          ref={frameRef}
          tabIndex={-1}
          onPointerLeave={onPreviewEnd}
          onClick={(event) => {
            /* Klik bagian gambar di luar hotspot juga keluar zoom. */
            if (!zoom) return;
            if (
              event.target instanceof Element &&
              event.target.closest("[data-hotspot]")
            ) {
              return;
            }
            stopZoom();
          }}
        >
          <div className="hero-artwork__inner" style={zoomStyle}>
            <Image
              src={HERO_IMAGE_SRC}
              width={heroArtwork.width}
              height={heroArtwork.height}
              preload
              unoptimized
              alt={dict.heroArtwork.imageAlt}
              className="h-auto w-full"
            />
            <svg
              className="hero-artwork__overlay"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              {/* Batas (ring) hotspot memakai gradien dari GradientText.tsx —
                  palet yang sama (biru -> ocean -> hijau -> emas), namun versi
                  LEMBUT (pastel) dipakai tetap di kedua tema agar batas selalu
                  halus (keputusan pemilik). Aliran yoyo seperti varian "linear"
                  komponennya: gradien dibentang 2x lebar karya lalu digeser satu
                  periode agar mulus tanpa jahitan. Saat prefers-reduced-motion,
                  aliran dimatikan (gradien statis) — sejalan dengan fallback
                  gradient-text.css. */}
              <defs>
                <linearGradient
                  id="hero-ring-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2={VIEW_W * 2}
                  y2="0"
                >
                  <stop offset="0%" stopColor="var(--hero-ring-1)" />
                  <stop offset="12.5%" stopColor="var(--hero-ring-2)" />
                  <stop offset="25%" stopColor="var(--hero-ring-3)" />
                  <stop offset="37.5%" stopColor="var(--hero-ring-4)" />
                  <stop offset="50%" stopColor="var(--hero-ring-1)" />
                  <stop offset="62.5%" stopColor="var(--hero-ring-2)" />
                  <stop offset="75%" stopColor="var(--hero-ring-3)" />
                  <stop offset="87.5%" stopColor="var(--hero-ring-4)" />
                  <stop offset="100%" stopColor="var(--hero-ring-1)" />
                  {ringFlow && Boolean(previewId || zoom) ? (
                    <animateTransform
                      attributeName="gradientTransform"
                      type="translate"
                      values={`0 0; -${VIEW_W} 0; 0 0`}
                      keyTimes="0;0.5;1"
                      dur="12s"
                      repeatCount="indefinite"
                    />
                  ) : null}
                </linearGradient>
              </defs>
              {heroArtwork.hotspots.map((hotspot, index) => (
                <HotspotShape
                  key={`${hotspot.id}-${index}`}
                  hotspot={hotspot}
                  index={index}
                  active={previewId === hotspot.id}
                  debug={heroDebug}
                  label={showLabels ? debugLabels[index] : undefined}
                  onPreview={onPreview}
                  onZoom={onZoom}
                />
              ))}
            </svg>
          </div>
        </div>
        {zoom ? (
          <ZoomChip
            dict={dict}
            zoom={zoom}
            onAction={onChipAction}
            onClose={stopZoom}
            actionRef={chipActionRef}
          />
        ) : null}
      </div>
    </figure>
  );
}

/* --- Skala zoom: bbox zona mengisi viewport figure, clamp 1.8-3.5 ----------
   Rasio inner = rasio karya (Image h-auto w-full; SVG preserveAspectRatio
   none mengikuti frame), jadi persen bbox bisa dipakai langsung. Margin
   visual 90%. */

function zoomScale(hotspot: HeroHotspot): number {
  const largest = Math.max(hotspot.w, hotspot.h) / 100;
  const raw = 0.9 / largest;
  return Math.round(Math.min(3.5, Math.max(1.8, raw)) * 100) / 100;
}

/* --- Chip dalam zoom -------------------------------------------------------- */

function ZoomChip({
  dict,
  zoom,
  onAction,
  onClose,
  actionRef,
}: {
  dict: Dictionary;
  zoom: ZoomEntry;
  onAction: (id: HeroHotspotId) => void;
  onClose: () => void;
  actionRef: React.RefObject<HTMLButtonElement | null>;
}): ReactElement {
  const isAction = ACTION_ID_LIST.includes(zoom.id);
  const crop = isAction
    ? heroArtwork.actions[zoom.id as HeroActionId]
    : heroArtwork.details[zoom.id as HeroDetailId];

  const { label, action } = isAction
    ? dict.heroArtwork.actions[zoom.id as HeroActionId]
    : dict.heroArtwork.details[zoom.id as HeroDetailId];

  return (
    <div className="hero-artwork__chip" role="group">
      <Image
        src={crop.src}
        width={crop.width}
        height={crop.height}
        sizes="56px"
        loading="lazy"
        alt=""
        className="hero-artwork__chip-img"
      />
      <div className="hero-artwork__chip-text">
        <p className="hero-artwork__chip-label">
          <span aria-hidden="true" className="hero-artwork__chip-num">
            {chipNumber(zoom.id)}
          </span>
          {label}
        </p>
        <p className="hero-artwork__chip-action">{action}</p>
      </div>
      <button
        type="button"
        ref={actionRef}
        className="hero-artwork__chip-btn"
        onClick={() => onAction(zoom.id)}
      >
        {action}
      </button>
      <button
        type="button"
        className="hero-artwork__chip-close"
        aria-label={dict.heroArtwork.chipClose}
        onClick={onClose}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}

/* Nomor chip: 01-08 untuk detail, A1/A2 untuk aksi (teknis, bukan konten). */
function chipNumber(id: HeroHotspotId): string {
  if (ACTION_ID_LIST.includes(id)) {
    return id === "judul" ? "A1" : "A2";
  }
  return DETAIL_NUMBER[id as HeroDetailId];
}

/* --- Rendering satu hotspot ------------------------------------------------ */

type HotspotShapeProps = {
  hotspot: HeroHotspot;
  index: number;
  active: boolean;
  debug: boolean;
  label?: string;
  onPreview: (id: HeroHotspotId) => void;
  onZoom: (id: HeroHotspotId, index: number) => void;
};

/* `index` = posisi entri di array heroArtwork.hotspots — wajib untuk zoom
   (origin dari bbox entri yang dipilih) walaupun id sama (baju 04a/04b,
   mata 07a/07b). */
function HotspotShape({
  hotspot,
  index,
  active,
  debug,
  label,
  onPreview,
  onZoom,
}: HotspotShapeProps): ReactElement {
  const px = (value: number, base: number): number => (value / 100) * base;
  const x = px(hotspot.x, VIEW_W);
  const y = px(hotspot.y, VIEW_H);
  const w = px(hotspot.w, VIEW_W);
  const h = px(hotspot.h, VIEW_H);
  const isAction = ACTION_ID_LIST.includes(hotspot.id);
  const strokeOpacity = active || debug ? 1 : 0;

  /* Zona "kurang presisi" hanya disisakan beberapa potong garis kontur. */
  const partialRing = PARTIAL_RING[hotspot.id as HeroDetailId];
  const ringExtras = partialRing
    ? {
        pathLength: 100,
        strokeDasharray: partialRing.dash,
        strokeDashoffset: partialRing.offset,
      }
    : {};

  /* Hover desktop: cukup ring emas menyala (tanpa zoom/preview). Klik mem-
     buka zoom ke zona itu. */
  const pointerProps = {
    onPointerEnter: () => onPreview(hotspot.id),
    onClick: () => onZoom(hotspot.id, index),
  };

  /* A1/A2 (shape rect) TIDAK digambar sebagai kotak — hanya garis bawah
     tipis bergradien, baik normal maupun saat debug (permintaan pemilik:
     hapus semua batas berbentuk kotak). */
  const underline: ReactElement | null =
    hotspot.shape === "rect" ? (
      <line
        className="hero-artwork__ring"
        x1={x}
        y1={y + h}
        x2={x + w}
        y2={y + h}
        stroke="url(#hero-ring-gradient)"
        strokeWidth={isAction ? 1.6 : 1.2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        strokeOpacity={active || debug ? 1 : 0}
        data-active={active || debug ? "true" : undefined}
        pointerEvents="none"
      />
    ) : null;

  let shape: ReactElement;
  if (hotspot.shape === "rect") {
    shape = (
      <rect
        data-hotspot=""
        x={x}
        y={y}
        width={w}
        height={h}
        fill="transparent"
        pointerEvents="all"
        {...pointerProps}
      />
    );
  } else if (hotspot.shape === "ellipse") {
    shape = (
      <>
        <ellipse
          data-hotspot=""
          cx={x + w / 2}
          cy={y + h / 2}
          rx={w / 2}
          ry={h / 2}
          fill="transparent"
          pointerEvents="all"
          {...pointerProps}
        />
        {hotspot.id === "mata" ? (
          /* Hit area diperlebar tanpa menggambar apa pun: lihat EYE_PAD_*. */
          <ellipse
            cx={x + w / 2}
            cy={y + h / 2}
            rx={w / 2 + EYE_PAD_X}
            ry={h / 2 + EYE_PAD_Y}
            fill="transparent"
            pointerEvents="all"
            {...pointerProps}
          />
        ) : null}
        <ellipse
          className="hero-artwork__ring"
          cx={x + w / 2}
          cy={y + h / 2}
          rx={w / 2}
          ry={h / 2}
          fill="transparent"
          stroke="url(#hero-ring-gradient)"
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
          strokeOpacity={strokeOpacity}
          data-active={active || debug ? "true" : undefined}
          pointerEvents="none"
          {...ringExtras}
        />
      </>
    );
  } else if (hotspot.shape === "polygon") {
    shape = (
      <polygon
        data-hotspot=""
        className="hero-artwork__ring"
        points={polygonPoints(hotspot, px)}
        fill="transparent"
        pointerEvents="all"
        stroke="url(#hero-ring-gradient)"
        strokeWidth={1.2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        strokeOpacity={strokeOpacity}
        data-active={active || debug ? "true" : undefined}
        {...pointerProps}
      />
    );
  } else {
    shape = (
      <path
        data-hotspot=""
        className="hero-artwork__ring"
        d={hotspot.path ?? ""}
        fillRule={hotspot.fillRule ?? "evenodd"}
        fill="transparent"
        pointerEvents="all"
        stroke="url(#hero-ring-gradient)"
        strokeWidth={1.2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        strokeOpacity={strokeOpacity}
        data-active={active || debug ? "true" : undefined}
        {...ringExtras}
        {...pointerProps}
      />
    );
  }

  return (
    <g>
      {shape}
      {underline}
      {label ? (
        <text
          className="hero-artwork__debug-label"
          x={x + 6}
          y={y < 60 || h < 60 ? y - 14 : y + 52}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

/* --- Label debug (nomor + id teknis, bukan konten) ------------------------ */

function debugLabel(hotspot: HeroHotspot, occurrence: number): string {
  if (ACTION_ID_LIST.includes(hotspot.id)) {
    return hotspot.id === "judul" ? "A1 judul" : "A2 tanggal";
  }
  const number = DETAIL_NUMBER[hotspot.id as HeroDetailId];
  return `${number}${SUFFIX[occurrence] ?? "?"} ${hotspot.id}`;
}

function polygonPoints(
  hotspot: HeroHotspot,
  px: (value: number, base: number) => number,
): string {
  if (!hotspot.points) return "";
  return hotspot.points
    .split(/\s+/)
    .filter(Boolean)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return `${px(x, VIEW_W)},${px(y, VIEW_H)}`;
    })
    .join(" ");
}
