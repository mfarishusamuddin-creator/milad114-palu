import { describe, expect, it } from "vitest";

import type { PageMeta } from "@/features/pages/types";
import { filterTools, orderToolsByRecent, orderToolsForDashboard } from "./tool-order";

/** Buat PageMeta minimal untuk pengujian (field lain tidak relevan di sini). */
function tool(slug: string, title: string): PageMeta {
  return {
    id: slug,
    slug,
    title,
    scope: "admin",
    is_published: false,
    sort_order: 0,
    is_home: false,
  };
}

const a = tool("alpha", "Alpha");
const b = tool("bravo", "Bravo");
const c = tool("charlie", "Charlie");

describe("filterTools", () => {
  it("mengembalikan semua tool saat query kosong / spasi", () => {
    expect(filterTools([a, b, c], "")).toEqual([a, b, c]);
    expect(filterTools([a, b, c], "   ")).toEqual([a, b, c]);
  });

  it("mencocokkan judul secara case-insensitive", () => {
    expect(filterTools([a, b, c], "BRAV")).toEqual([b]);
  });

  it("mencocokkan slug juga", () => {
    expect(filterTools([a, b, c], "charl")).toEqual([c]);
  });

  it("mengembalikan kosong bila tidak ada yang cocok", () => {
    expect(filterTools([a, b, c], "zzz")).toEqual([]);
  });
});

describe("orderToolsForDashboard", () => {
  it("memin favorit di atas, lalu urut terakhir dibuka, lalu A-Z", () => {
    const recent = { alpha: 300, charlie: 100 };
    const ordered = orderToolsForDashboard([a, b, c], ["charlie"], recent);
    // charlie favorit (pin) -> alpha (dibuka terbaru) -> bravo (belum pernah) -> ... 
    expect(ordered.map((t) => t.slug)).toEqual(["charlie", "alpha", "bravo"]);
  });

  it("tanpa favorit/riwayat: urut A-Z", () => {
    const ordered = orderToolsForDashboard([c, a, b], [], {});
    expect(ordered.map((t) => t.slug)).toEqual(["alpha", "bravo", "charlie"]);
  });

  it("tidak memutasi array masukan", () => {
    const input = [c, a, b];
    orderToolsForDashboard(input, [], {});
    expect(input.map((t) => t.slug)).toEqual(["charlie", "alpha", "bravo"]);
  });
});

describe("orderToolsByRecent", () => {
  it("urut menurun berdasarkan timestamp buka", () => {
    const recent = { alpha: 10, bravo: 30, charlie: 20 };
    expect(orderToolsByRecent([a, b, c], recent).map((t) => t.slug)).toEqual([
      "bravo",
      "charlie",
      "alpha",
    ]);
  });

  it("seri timestamp dipecah A-Z", () => {
    expect(orderToolsByRecent([c, a, b], {}).map((t) => t.slug)).toEqual([
      "alpha",
      "bravo",
      "charlie",
    ]);
  });
});
