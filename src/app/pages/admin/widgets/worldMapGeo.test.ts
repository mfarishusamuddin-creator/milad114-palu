import { describe, expect, it } from "vitest";
import type { DashboardGeoPoint } from "@/features/dashboard/types";
import {
  FALLBACK_COLOR,
  escapeXmlText,
  groupGeoPoints,
  groupTitle,
  humanizeSlug,
  labelForSource,
  radiusForCount,
  summarizeGeoSources,
} from "./worldMapGeo";

// ============================================================================
// Test logika pure WorldMapWidget: grouping koordinat, tooltip "×n", agregasi
// weight, ringkasan source (chip/legenda/warna), dan escape XML — semuanya
// tanpa DOM, mengikuti pola test foundation dashboard.
// ============================================================================

function geo(overrides: Partial<DashboardGeoPoint> & { lat: number; lng: number; label: string }): DashboardGeoPoint {
  return {
    id: `${overrides.label}:geo`,
    source: "finance-tracker-pro-1",
    collection: "accounts",
    title: `${overrides.label} — lokasi`,
    type: "geo",
    ...overrides,
  };
}

describe("escapeXmlText", () => {
  it("menetralkan & < > agar label tool tidak memecah markup SVG", () => {
    expect(escapeXmlText("BNI <utama> & cabang")).toBe("BNI &lt;utama&gt; &amp; cabang");
  });

  it("& di-escape pertama — tidak ada double-escape", () => {
    expect(escapeXmlText("&lt;")).toBe("&amp;lt;");
  });

  it("teks biasa tidak berubah", () => {
    expect(escapeXmlText("Jakarta · Basis")).toBe("Jakarta · Basis");
  });
});

describe("groupGeoPoints", () => {
  it("koordinat yang dibulatkan 1 desimal identik → satu grup berisi semua label", () => {
    const groups = groupGeoPoints([
      geo({ lat: -6.21, lng: 106.84, label: "BNI" }),
      geo({ lat: -6.18, lng: 106.81, label: "Mandiri" }), // bulat → -6.2, 106.8
      geo({ lat: 1.35, lng: 103.82, label: "DBS" }), // lokasi lain
    ]);

    expect(groups).toHaveLength(2);
    const jakarta = groups.find((g) => g.key === "-6.2,106.8");
    expect(jakarta?.count).toBe(2);
    expect(jakarta?.labels).toEqual(["BNI", "Mandiri"]);
    expect(jakarta?.lat).toBe(-6.2);
    expect(jakarta?.lng).toBe(106.8);
  });

  it("weight diagregasi (sigma) bila ada; tanpa weight → tidak muncul", () => {
    const withWeight = groupGeoPoints([
      geo({ lat: 10, lng: 20, label: "A", weight: 1000 }),
      geo({ lat: 10.02, lng: 20.03, label: "B", weight: 2500 }),
    ]);
    expect(withWeight[0]?.weight).toBe(3500);

    const withoutWeight = groupGeoPoints([geo({ lat: 10, lng: 20, label: "A" })]);
    expect(withoutWeight[0]?.weight).toBeUndefined();

    const mixed = groupGeoPoints([
      geo({ lat: 10, lng: 20, label: "A", weight: 7 }),
      geo({ lat: 10, lng: 20, label: "B" }),
    ]);
    expect(mixed[0]?.weight).toBe(7);
  });

  it("sources unik urut alfabet; hasil diurutkan menurut key (deterministik)", () => {
    const groups = groupGeoPoints([
      geo({ lat: 50, lng: 10, label: "X", source: "project-hub-v3" }),
      geo({ lat: 50.01, lng: 10.01, label: "Y", source: "finance-tracker-pro-1" }),
      geo({ lat: -20, lng: 30, label: "Z", source: "finance-tracker-pro-1" }),
    ]);

    expect(groups.map((g) => g.key)).toEqual(["-20.0,30.0", "50.0,10.0"]);
    expect(groups[1]?.sources).toEqual(["finance-tracker-pro-1", "project-hub-v3"]);
  });
});

describe("groupTitle", () => {
  it("satu titik → hanya labelnya", () => {
    const [group] = groupGeoPoints([geo({ lat: 1, lng: 2, label: "Singapura" })]);
    expect(groupTitle(group!)).toBe("Singapura");
  });

  it("grup gabungan → semua label + ×n", () => {
    const [group] = groupGeoPoints([
      geo({ lat: 1, lng: 2, label: "BNI" }),
      geo({ lat: 1, lng: 2, label: "Mandiri" }),
      geo({ lat: 1, lng: 2, label: "DBS" }),
    ]);
    expect(groupTitle(group!)).toBe("BNI · Mandiri · DBS ×3");
  });
});

describe("radiusForCount", () => {
  it("satu titik = radius dasar; membesar terbatas maksimal 4 langkah", () => {
    expect(radiusForCount(1)).toBe(4.4);
    expect(radiusForCount(3)).toBeCloseTo(5.4);
    expect(radiusForCount(10)).toBeCloseTo(6.4); // cap — tidak tumbuh selamanya
  });
});

describe("summarizeGeoSources", () => {
  const points = [
    geo({ lat: 1, lng: 1, label: "a", source: "finance-tracker-pro-1" }),
    geo({ lat: 2, lng: 2, label: "b", source: "finance-tracker-pro-1" }),
    geo({ lat: 3, lng: 3, label: "c", source: "husam-social-account-manager-pro" }),
    geo({ lat: 4, lng: 4, label: "d", source: "husam-product-catalog-pro" }),
    geo({ lat: 5, lng: 5, label: "e", source: "project-hub-v3" }),
    geo({ lat: 6, lng: 6, label: "f", source: "qurantracker-pro" }),
  ];

  it("source nyata dari data: urut slug, hitungan titik, warna palet stabil", () => {
    const summary = summarizeGeoSources(points);
    expect(summary.map((s) => s.slug)).toEqual([
      "finance-tracker-pro-1",
      "husam-product-catalog-pro",
      "husam-social-account-manager-pro",
      "project-hub-v3",
      "qurantracker-pro",
    ]);
    expect(summary[0]).toMatchObject({ label: "Finance", color: "#aef8eb", count: 2 });
    expect(summary[1]).toMatchObject({ label: "Produk", color: "#9fd8ff", count: 1 });
    expect(summary[2]).toMatchObject({ label: "Sosial", color: "#c9b6ff", count: 1 });
    expect(summary[3]).toMatchObject({ label: "Proyek", color: "#ffd9a0", count: 1 });
  });

  it("source ke-5 (palet habis) → warna fallback putih", () => {
    const summary = summarizeGeoSources(points);
    expect(summary[4]?.color).toBe(FALLBACK_COLOR);
  });

  it("tanpa titik → daftar kosong (legenda tidak mengarang source)", () => {
    expect(summarizeGeoSources([])).toEqual([]);
  });
});

describe("labelForSource / humanizeSlug", () => {
  it("slug dikenal memakai label pendek kurasi", () => {
    expect(labelForSource("finance-tracker-pro-1")).toBe("Finance");
  });

  it("slug tak dikenal dilabeli otomatis: token branding/version dibuang", () => {
    expect(labelForSource("qurantracker-pro")).toBe("Qurantracker");
    expect(humanizeSlug("husam-jaringan")).toBe("Jaringan");
    expect(humanizeSlug("catatan-harian-v2")).toBe("Catatan harian");
  });
});
