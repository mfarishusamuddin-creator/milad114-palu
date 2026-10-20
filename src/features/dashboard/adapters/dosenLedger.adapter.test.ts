import { describe, expect, it } from "vitest";
import type { DataRecord } from "@/features/core/types";
import { dashboardItemSchema, makeItemId } from "../types";
import { dosenLedgerAdapter } from "./dosenLedger.adapter";

// ============================================================================
// Test dosenLedgerAdapter — TERISOLASI (pure, tanpa mock I/O).
// Fokus: pemetaan benar, skip fail-closed, dan KEAMANAN (key asing/sensitif
// tidak pernah bocor; field privat seperti notes/isbn tidak dibaca).
// ============================================================================

const SLUG = "dosen-ledger";

function record(recordId: string, data: Record<string, unknown>): DataRecord {
  return { id: `db-${recordId}`, record_id: recordId, data };
}

function tesisItems(data: Record<string, unknown>) {
  return dosenLedgerAdapter.toItems({ tesis: [record("t1", data)] });
}

describe("dosenLedgerAdapter — kontrak dasar", () => {
  it("slug & collections sesuai deklarasi", () => {
    expect(dosenLedgerAdapter.slug).toBe(SLUG);
    expect(dosenLedgerAdapter.collections).toEqual(["tesis", "buku"]);
  });
});

describe("dosenLedgerAdapter — record valid", () => {
  it("tesis lengkap → deadline + event per milestone, urutan & id benar", () => {
    const items = dosenLedgerAdapter.toItems({
      tesis: [
        record("t1", {
          id: "t1",
          title: "Revisi Bab 3",
          status: "berjalan",
          jenis: "tesis",
          stageIndex: 2,
          targetDate: "2026-10-01",
          milestones: [
            { title: "Draft awal", date: "2026-09-05", done: true },
            { title: "Sidang", date: "2026-09-20" },
          ],
        }),
      ],
      buku: [record("b1", { title: "Buku AI", jenis: "buku", targetDate: "2026-12-31" })],
    });

    expect(items).toEqual([
      {
        id: makeItemId(SLUG, "tesis", "t1", "deadline"),
        source: SLUG,
        collection: "tesis",
        title: "tesis: Revisi Bab 3",
        type: "deadline",
        date: { year: 2026, month: 10, day: 1 },
        status: "berjalan",
      },
      {
        id: makeItemId(SLUG, "tesis", "t1", "milestone-0"),
        source: SLUG,
        collection: "tesis",
        title: "Revisi Bab 3 — Draft awal",
        type: "event",
        start: { year: 2026, month: 9, day: 5 },
        done: true,
      },
      {
        id: makeItemId(SLUG, "tesis", "t1", "milestone-1"),
        source: SLUG,
        collection: "tesis",
        title: "Revisi Bab 3 — Sidang",
        type: "event",
        start: { year: 2026, month: 9, day: 20 },
        done: false,
      },
      {
        id: makeItemId(SLUG, "buku", "b1", "deadline"),
        source: SLUG,
        collection: "buku",
        title: "buku: Buku AI",
        type: "deadline",
        date: { year: 2026, month: 12, day: 31 },
      },
    ]);
    expect(items[0].id).toBe(`${SLUG}:tesis:t1:deadline`);
  });

  it("targetDate epoch-ms diterima (parseDateOnly, UTC deterministik)", () => {
    const items = tesisItems({ title: "Tesis", targetDate: Date.UTC(2026, 9, 1, 23, 30) });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "deadline", date: { year: 2026, month: 10, day: 1 } });
  });

  it("jenis kosong/hilang → title tanpa prefix", () => {
    const items = tesisItems({ title: "Revisi", targetDate: "2026-10-01" });
    expect(items[0]).toMatchObject({ title: "Revisi" });
  });

  it("title hilang → fallback '(Tanpa judul)'; judul milestone kosong → 'Milestone'", () => {
    const items = tesisItems({
      jenis: "tesis",
      targetDate: "2026-10-01",
      milestones: [{ date: "2026-09-05" }, { title: "  ", date: "2026-09-06" }],
    });
    expect(items[0]).toMatchObject({ title: "tesis: (Tanpa judul)" });
    expect(items[1]).toMatchObject({ title: "(Tanpa judul) — Milestone" });
    expect(items[2]).toMatchObject({ title: "(Tanpa judul) — Milestone" });
  });

  it("done hanya true bila m.done === true persis", () => {
    const items = tesisItems({
      title: "T",
      milestones: [
        { date: "2026-09-01", done: true },
        { date: "2026-09-02", done: false },
        { date: "2026-09-03" },
      ],
    });
    expect(items.map((i) => (i.type === "event" ? i.done : null))).toEqual([true, false, false]);
  });

  it("status null → key status tidak muncul; semua item lolos schema kanonik strict", () => {
    const items = tesisItems({ title: "T", status: null, targetDate: "2026-10-01" });
    expect(items[0]).not.toHaveProperty("status");
    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }
  });
});

describe("dosenLedgerAdapter — field hilang → skip", () => {
  it("tanpa targetDate → hanya milestones", () => {
    const items = tesisItems({ title: "T", milestones: [{ date: "2026-09-05" }] });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "event" });
  });

  it("milestones hilang → hanya deadline", () => {
    const items = tesisItems({ title: "T", targetDate: "2026-10-01" });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "deadline" });
  });

  it("tanpa targetDate dan milestones → record tidak menghasilkan item", () => {
    expect(tesisItems({ title: "T", status: "berjalan" })).toEqual([]);
  });
});

describe("dosenLedgerAdapter — tipe salah/malformed → skip", () => {
  it("tipe field allowlist salah → record di-skip utuh", () => {
    expect(tesisItems({ title: 123, targetDate: "2026-10-01" })).toEqual([]);
    expect(tesisItems({ title: "T", targetDate: true })).toEqual([]);
    expect(tesisItems({ title: "T", status: 1, targetDate: "2026-10-01" })).toEqual([]);
    expect(tesisItems({ title: "T", jenis: {}, targetDate: "2026-10-01" })).toEqual([]);
  });

  it("milestones bukan array → hanya deadline (record TIDAK di-skip)", () => {
    const items = tesisItems({ title: "T", targetDate: "2026-10-01", milestones: "bukan-array" });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "deadline" });
  });

  it("element milestone cacat → hanya element itu di-skip, deadline & element valid tetap ada", () => {
    const items = tesisItems({
      title: "T",
      targetDate: "2026-10-01",
      milestones: [
        "bukan-objek",
        null,
        { title: { aneh: true }, date: "2026-09-05" }, // tipe title salah
        { title: "Valid", date: "2026-09-06", done: "yes" }, // tipe done salah
        { title: "Juga valid", date: "2026-09-07", done: false },
      ],
    });
    expect(items).toHaveLength(2);
    expect(items.map((i) => i.type)).toEqual(["deadline", "event"]);
    expect(items[1].id).toBe(makeItemId(SLUG, "tesis", "t1", "milestone-4")); // index array ASLI
  });

  it("data null/record cacat → skip tanpa crash, record sehat tetap diproses", () => {
    const broken = { id: "db-x", record_id: "x", data: null } as unknown as DataRecord;
    const broken2 = null as unknown as DataRecord;
    const items = dosenLedgerAdapter.toItems({
      tesis: [broken, broken2, record("ok", { targetDate: "2026-01-01" })],
    });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: makeItemId(SLUG, "tesis", "ok", "deadline") });
  });
});

describe("dosenLedgerAdapter — collection kosong", () => {
  it("tesis & buku kosong → []", () => {
    expect(dosenLedgerAdapter.toItems({ tesis: [], buku: [] })).toEqual([]);
  });

  it("key collection tidak ada → []", () => {
    expect(dosenLedgerAdapter.toItems({})).toEqual([]);
  });
});

describe("dosenLedgerAdapter — tanggal invalid → skip", () => {
  it("targetDate mustahil/bukan tanggal → tanpa deadline", () => {
    expect(tesisItems({ title: "T", targetDate: "2026-13-45" })).toEqual([]);
    expect(tesisItems({ title: "T", targetDate: "abc" })).toEqual([]);
    expect(tesisItems({ title: "T", targetDate: "2026-02-30" })).toEqual([]);
  });

  it("date milestone invalid → element di-skip, element lain tetap ada", () => {
    const items = tesisItems({
      title: "T",
      milestones: [
        { title: "A", date: "2026-13-45" },
        { title: "B", date: "abc" },
        { title: "C", date: "2026-09-07" },
      ],
    });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ title: "T — C" });
    expect(items[0].id).toBe(makeItemId(SLUG, "tesis", "t1", "milestone-2"));
  });

  it("targetDate invalid tidak mematikan milestones yang valid", () => {
    const items = tesisItems({
      title: "T",
      targetDate: "2026-13-45",
      milestones: [{ title: "A", date: "2026-09-05" }],
    });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "event" });
  });
});

describe("dosenLedgerAdapter — KEAMANAN", () => {
  it("key asing sensitif di data → di-strip, tidak muncul di output", () => {
    const items = tesisItems({
      title: "T",
      targetDate: "2026-10-01",
      milestones: [{ title: "A", date: "2026-09-05", owner: "P4SS" }],
      aiKey: "SECRET",
      password: "P4SS",
      notes: "catatan privat pengguna SECRET",
      isbn: "P4SS-ISBN",
    });

    const json = JSON.stringify(items);
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("P4SS");
    expect(json).not.toContain("aiKey");
    expect(json).not.toContain("password");
    expect(json).not.toContain("notes");
    expect(json).not.toContain("isbn");
    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
      for (const key of Object.keys(item)) {
        expect(
          ["id", "source", "collection", "title", "type", "date", "status", "start", "end", "done"].includes(key),
        ).toBe(true);
      }
    }
  });

  it("collection di luar allowlist TIDAK dibaca sama sekali", () => {
    const items = dosenLedgerAdapter.toItems({
      catatan: [record("c1", { title: "bocor", password: "P4SS", targetDate: "2026-01-01" })],
      prefs: [record("p1", { aiKey: "SECRET" })],
    } as unknown as Record<string, DataRecord[]>);
    expect(items).toEqual([]);
    expect(JSON.stringify(items)).not.toContain("SECRET");
    expect(JSON.stringify(items)).not.toContain("P4SS");
  });
});

describe("dosenLedgerAdapter — unexpected schema tetap aman", () => {
  it("key ekstra tak dikenal (objek/array bersarang, createdAt epoch-ms) → output bersih", () => {
    const items = tesisItems({
      title: "T",
      targetDate: "2026-10-01",
      createdAt: Date.UTC(2024, 0, 1), // record lama — tidak dibaca
      publisher: { name: "P4SS-PRESS" },
      peopleIds: ["SECRET-ID"],
      foo: "BAR-VALUE",
      milestones: [{ title: "A", date: "2026-09-05", extra: "SECRET" }],
    });

    const json = JSON.stringify(items);
    expect(items).toHaveLength(2);
    expect(json).not.toContain("BAR-VALUE");
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("P4SS");
    expect(json).not.toContain("publisher");
    expect(json).not.toContain("peopleIds");
    expect(json).not.toContain("createdAt");
    expect(json).not.toContain("extra");
    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }
  });
});
