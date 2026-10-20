import { useMemo, useState } from "react";

import { useDashboardSnapshot } from "@/features/dashboard/hooks/useDashboardSnapshot";
import type { DashboardGeoPoint } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";
import {
  FALLBACK_COLOR,
  escapeXmlText,
  groupGeoPoints,
  groupTitle,
  radiusForCount,
  summarizeGeoSources,
  type GeoGroup,
} from "./worldMapGeo";

// ============================================================================
// World map berbasis SVG dot-matrix (diadopsi dari HTML tool "Finance Tracker
// Pro"). PURE SVG — TIDAK memakai WebGL/MapLibre/tile eksternal/API key, jadi
// bebas dari error worker/WebGL yang terjadi di beberapa perangkat.
//
// Sumber titik = DATA NYATA: item kanonik type "geo" dari useDashboardSnapshot
// (tidak ada seed demo). Titik yang lokasinya praktis sama digabung jadi satu
// marker (worldMapGeo.groupGeoPoints), dan pengguna bisa menyembunyikan
// source lewat chip filter (state lokal — bukan preferensi yang di-persist).
// ============================================================================

const W = 920;
const H = 420;

// Wilayah daratan (batas lat/lon per benua) untuk menyusun dot-matrix.
const LAND_REGIONS = [
  { lat1: 60, lat2: 72, lon1: -165, lon2: -60 },
  { lat1: 45, lat2: 60, lon1: -140, lon2: -55 },
  { lat1: 30, lat2: 45, lon1: -125, lon2: -70 },
  { lat1: 15, lat2: 30, lon1: -118, lon2: -85 },
  { lat1: 7, lat2: 15, lon1: -92, lon2: -77 },
  { lat1: 0, lat2: 7, lon1: -80, lon2: -50 },
  { lat1: -20, lat2: 0, lon1: -82, lon2: -35 },
  { lat1: -35, lat2: -20, lon1: -75, lon2: -53 },
  { lat1: -55, lat2: -35, lon1: -73, lon2: -63 },
  { lat1: 30, lat2: 37, lon1: -10, lon2: 35 },
  { lat1: 15, lat2: 30, lon1: -17, lon2: 38 },
  { lat1: 0, lat2: 15, lon1: -17, lon2: 45 },
  { lat1: -20, lat2: 0, lon1: 10, lon2: 42 },
  { lat1: -35, lat2: -20, lon1: 12, lon2: 33 },
  { lat1: 60, lat2: 71, lon1: 5, lon2: 30 },
  { lat1: 45, lat2: 60, lon1: -8, lon2: 40 },
  { lat1: 36, lat2: 45, lon1: -9, lon2: 30 },
  { lat1: 55, lat2: 70, lon1: 30, lon2: 180 },
  { lat1: 45, lat2: 55, lon1: 30, lon2: 140 },
  { lat1: 12, lat2: 36, lon1: 35, lon2: 60 },
  { lat1: 8, lat2: 35, lon1: 60, lon2: 92 },
  { lat1: 20, lat2: 45, lon1: 95, lon2: 145 },
  { lat1: -10, lat2: 20, lon1: 92, lon2: 141 },
  { lat1: -39, lat2: -10, lon1: 113, lon2: 154 },
];

function mapProject(lat: number, lon: number): [number, number] {
  const x = ((lon + 180) / 360) * W;
  const y = ((83 - lat) / (83 - -58)) * H;
  return [x, y];
}

function seededRand(x: number, y: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

// ANCHOR DESAIN — BUKAN DATA. "Basis" adalah rumah pengguna di peta: elemen
// visual konstan agar peta selalu punya titik orientasi dan garis bezier
// home→titik data punya pangkal. Lokasinya sengaja hardcoded di sini dan
// kelak boleh diubah pengguna (mis. lewat settings) tanpa menyentuh logika
// data — marker ini tidak pernah berasal dari snapshot tool.
const HOME = { lat: -6.2, lng: 106.8, label: "Jakarta", color: "#ffffff" };

function linePath(p1: [number, number], p2: [number, number], color: string) {
  const mx = (p1[0] + p2[0]) / 2;
  const my = (p1[1] + p2[1]) / 2 - 24;
  return `<path class="map-link" d="M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}" stroke="${color}"></path>`;
}

/**
 * `label` DISISIPKAN ke string SVG (dangerouslySetInnerHTML) — pemanggil WAJIB
 * meng-escape teks yang berasal dari data (escapeXmlText); warna & koordinat
 * berasal dari palet/angka internal sehingga aman apa adanya.
 */
function markerCircle(p: [number, number], color: string, label: string, radius = 4.4, home = false) {
  const cls = home ? "map-marker-home" : "map-marker";
  return `<circle class="${cls}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${radius.toFixed(1)}" fill="${color}" stroke="#06090a" stroke-width="1.4"><title>${label}</title></circle>`;
}

/** Dot-matrix daratan — murni dekoratif & statis, dihitung sekali seumur komponen. */
function buildLandDots(): string {
  const dots: string[] = [];
  LAND_REGIONS.forEach((r) => {
    for (let la = r.lat1; la < r.lat2; la += 4) {
      for (let lo = r.lon1; lo < r.lon2; lo += 4) {
        if (seededRand(la, lo) > 0.4) {
          const jLat = la + (seededRand(la + 1, lo) - 0.5) * 3;
          const jLon = lo + (seededRand(la, lo + 1) - 0.5) * 3;
          const p = mapProject(jLat, jLon);
          dots.push(`<circle class="map-dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="1.3"></circle>`);
        }
      }
    }
  });
  return dots.join("");
}

/** Warna grup = warna source pertamanya (urut alfabet); tak dikenal → putih. */
function colorOfGroup(group: GeoGroup, colorBySource: ReadonlyMap<string, string>): string {
  const first = group.sources[0];
  return (first === undefined ? undefined : colorBySource.get(first)) ?? FALLBACK_COLOR;
}

export function WorldMapWidget() {
  const snapshot = useDashboardSnapshot();
  const items = snapshot.data?.items;

  // Item kanonik type "geo" = SATU-SATUNYA sumber titik peta (data nyata).
  const geoPoints = useMemo(
    () => (items ?? []).filter((item): item is DashboardGeoPoint => item.type === "geo"),
    [items],
  );

  // Ringkasan source NYATA (urut slug → warna stabil) untuk chip + legenda.
  const sources = useMemo(() => summarizeGeoSources(geoPoints), [geoPoints]);
  const colorBySource = useMemo(() => new Map(sources.map((s) => [s.slug, s.color])), [sources]);

  // Filter lokal: slug yang DISEMBUNYIKAN pengguna; set kosong = semua aktif.
  const [hiddenSources, setHiddenSources] = useState<ReadonlySet<string>>(() => new Set());

  const toggleSource = (slug: string) => {
    setHiddenSources((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const groups = useMemo(() => {
    const visible = geoPoints.filter((point) => !hiddenSources.has(point.source));
    return groupGeoPoints(visible);
  }, [geoPoints, hiddenSources]);

  const landDots = useMemo(() => buildLandDots(), []);

  // Overlay = garis home→grup + marker. Label grup masuk <title> sehingga
  // di-escape (data berasal dari tool pengguna — anti pecah markup).
  const overlay = useMemo(() => {
    const homeP = mapProject(HOME.lat, HOME.lng);
    let lines = "";
    let markers = "";
    for (const group of groups) {
      const p = mapProject(group.lat, group.lng);
      const color = colorOfGroup(group, colorBySource);
      lines += linePath(homeP, p, color);
      markers += markerCircle(p, color, escapeXmlText(groupTitle(group)), radiusForCount(group.count));
    }
    // Label HOME konstanta internal (bukan data) — tidak perlu di-escape.
    return lines + markerCircle(homeP, HOME.color, `${HOME.label} · Basis`, 5.5, true) + markers;
  }, [groups, colorBySource]);

  const svg = landDots + overlay;

  // Peta SELALU terrender (daratan + basis); status data hanya menambah
  // catatan kecil di bawah peta — peta kosong tetap berguna sebagai orientasi.
  let note: string | null = null;
  if (snapshot.isLoading) {
    note = "Memuat titik geografis dari tool…";
  } else if (snapshot.isError) {
    note = "Gagal memuat data tool — peta hanya menampilkan basis.";
  } else if (geoPoints.length === 0) {
    note = "Belum ada titik geografis dari tool.";
  } else if (groups.length === 0) {
    note = "Semua sumber disembunyikan — aktifkan kembali chip di atas.";
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="px-4 pb-2 pt-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-white" /> Basis: {HOME.label}
          </span>
          {/* Chip = source nyata dari data; klik untuk menyembunyikan/menampilkan. */}
          {sources.map((source) => {
            const active = !hiddenSources.has(source.slug);
            return (
              <button
                key={source.slug}
                type="button"
                aria-pressed={active}
                onClick={() => toggleSource(source.slug)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 transition-opacity hover:text-foreground",
                  !active && "opacity-40",
                )}
              >
                <span className="size-2 rounded-sm" style={{ background: source.color }} />
                {source.label} {source.count}
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-[320px] w-full bg-[#050809]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
      {note !== null && (
        <p
          className={cn(
            "px-4 py-2 text-xs",
            snapshot.isError ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {note}
        </p>
      )}
      <style>{`
        .map-dot{fill:rgba(174,248,235,.16);}
        .map-marker-home{fill:#fff;filter:drop-shadow(0 0 6px rgba(174,248,235,.9));}
        .map-marker{cursor:pointer;}
        .map-link{fill:none;stroke-width:1.2;opacity:.55;}
      `}</style>
    </div>
  );
}
