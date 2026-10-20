import { describe, expect, it } from "vitest";
import type { DataRecord } from "@/features/core/types";
import { dashboardItemSchema, makeItemId } from "../types";
import { murojaahAdapter } from "./murojaah.adapter";

const SLUG = "murojaah-tracker";

function rec(recordId: string, data: Record<string, unknown> = {}): DataRecord {
  return { id: `db-${recordId}`, record_id: recordId, data };
}

describe("murojaahAdapter", () => {
  it("kontrak: slug, allowlist collections, description terisi", () => {
    expect(murojaahAdapter.slug).toBe("murojaah-tracker");
    expect(murojaahAdapter.collections).toEqual(["sessions"]);
    expect(murojaahAdapter.description.length).toBeGreaterThan(0);
  });

  it("(1) valid: agregat count, rating-avg (2 desimal), duration-total (menit)", () => {
    const items = murojaahAdapter.toItems({
      sessions: [
        rec("s-1", { date: "2026-09-01", duration: 15, rating: 5 }),
        rec("s-2", { date: "2026-09-02", duration: 25, rating: 4 }),
        rec("s-3", { date: "2026-09-03", duration: 20, rating: 4 }),
      ],
    });

    // (5+4+4)/3 = 4.333… → 4.33; 15+25+20 = 60 menit.
    expect(items).toEqual([
      {
        id: makeItemId(SLUG, "sessions", "all", "count"),
        source: SLUG,
        collection: "sessions",
        title: "Total sesi murojaah tercatat",
        type: "metric",
        key: "murojaah-sessions-total",
        value: 3,
      },
      {
        id: makeItemId(SLUG, "sessions", "all", "rating-avg"),
        source: SLUG,
        collection: "sessions",
        title: "Rata-rata rating sesi murojaah",
        type: "metric",
        key: "murojaah-rating-avg",
        value: 4.33,
      },
      {
        id: makeItemId(SLUG, "sessions", "all", "duration-total"),
        source: SLUG,
        collection: "sessions",
        title: "Total durasi sesi murojaah",
        type: "metric",
        key: "murojaah-duration-total",
        value: 60,
        unit: "menit",
      },
    ]);

    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }
  });

  it("(1b) deterministik: dua kali panggil → output identik", () => {
    const input = {
      sessions: [rec("s-1", { date: "2026-09-01", duration: 10, rating: 4 })],
    };
    expect(murojaahAdapter.toItems(input)).toEqual(murojaahAdapter.toItems(input));
  });

  it("(2) field hilang: tanpa date tak dihitung total; tanpa rating/duration → metric-nya absen", () => {
    const items = murojaahAdapter.toItems({
      sessions: [rec("s-1", { duration: 10 }), rec("s-2", { rating: 4 }), rec("s-3", {})],
    });
    expect(items).toEqual([
      expect.objectContaining({ key: "murojaah-sessions-total", value: 0 }),
      expect.objectContaining({ key: "murojaah-rating-avg", value: 4 }),
      expect.objectContaining({ key: "murojaah-duration-total", value: 10, unit: "menit" }),
    ]);

    const onlyCount = murojaahAdapter.toItems({
      sessions: [rec("s-1", { date: "2026-09-01" })],
    });
    expect(onlyCount).toHaveLength(1);
    expect(onlyCount[0]).toMatchObject({ key: "murojaah-sessions-total", value: 1 });
  });

  it("(3) malformed: rating/duration non-number, NaN/Infinity, rating<1, duration<0 → diabaikan", () => {
    const sessions = [
      { id: "db-1", record_id: "s-1", data: null }, // data rusak → skip penuh
      rec("s-2", { date: "2026-09-01", rating: "5", duration: "30" }), // string
      rec("s-3", { date: "2026-09-02", rating: 0, duration: -5 }), // di luar batas valid
      rec("s-4", { date: "2026-09-03", rating: NaN, duration: Infinity }), // non-finite
    ] as unknown as DataRecord[];

    const items = murojaahAdapter.toItems({ sessions });
    // s-2..s-4 punya date valid → count 3; tidak ada rating/duration valid.
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ key: "murojaah-sessions-total", value: 3 });
  });

  it("(4) kosong: tanpa collection / array kosong → []", () => {
    expect(murojaahAdapter.toItems({})).toEqual([]);
    expect(murojaahAdapter.toItems({ sessions: [] })).toEqual([]);
  });

  it("(5) tanggal invalid: tidak dihitung di total; rating valid tetap masuk agregat", () => {
    const items = murojaahAdapter.toItems({
      sessions: [
        rec("s-1", { date: "2026-02-30", rating: 5 }), // 30 Februari tidak ada
        rec("s-2", { date: "abc" }),
      ],
    });
    expect(items).toEqual([
      expect.objectContaining({ key: "murojaah-sessions-total", value: 0 }),
      expect.objectContaining({ key: "murojaah-rating-avg", value: 5 }),
    ]);
  });

  it("(6) KEAMANAN: key asing sensitif di-strip — tidak bocor ke output", () => {
    const items = murojaahAdapter.toItems({
      sessions: [
        rec("s-1", {
          date: "2026-09-01",
          duration: 10,
          rating: 5,
          password: "P4SS",
          aiKey: "SECRET",
          catatan: "doa pribadi user",
        }),
      ],
    });

    expect(items.length).toBeGreaterThan(0);
    const json = JSON.stringify(items);
    expect(json).not.toContain("P4SS");
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("password");
    expect(json).not.toContain("aiKey");
    expect(json).not.toContain("doa pribadi");
  });

  it("(7) unexpected schema aman: collection bukan array & collection asing diabaikan", () => {
    expect(
      murojaahAdapter.toItems({ sessions: 42 as unknown as DataRecord[] }),
    ).toEqual([]);

    const items = murojaahAdapter.toItems({
      sessions: [rec("s-1", { date: "2026-09-01" })],
      settings: [rec("set-1", { interval: 3 })], // tidak dibaca (di luar allowlist)
    });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ key: "murojaah-sessions-total", value: 1 });
  });
});
