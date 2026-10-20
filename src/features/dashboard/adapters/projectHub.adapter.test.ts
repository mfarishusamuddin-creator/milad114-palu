import { describe, expect, it } from "vitest";
import type { DataRecord } from "@/features/core/types";
import { dashboardItemSchema, makeItemId } from "../types";
import { projectHubAdapter } from "./projectHub.adapter";

// ============================================================================
// Test projectHubAdapter — TERISOLASI (pure, tanpa mock I/O).
// Fokus: pemetaan benar, skip fail-closed, dan KEAMANAN (key asing/sensitif
// dari record mentah — termasuk collection prefs/cats — tidak pernah bocor).
// ============================================================================

const SLUG = "project-hub-v3";

function record(recordId: string, data: Record<string, unknown>): DataRecord {
  return { id: `db-${recordId}`, record_id: recordId, data };
}

function itemsFor(data: Record<string, unknown>) {
  return projectHubAdapter.toItems({ projects: [record("p1", data)] });
}

describe("projectHubAdapter — kontrak dasar", () => {
  it("slug & collections sesuai deklarasi", () => {
    expect(projectHubAdapter.slug).toBe(SLUG);
    expect(projectHubAdapter.collections).toEqual(["projects"]);
  });
});

describe("projectHubAdapter — record valid", () => {
  it("record lengkap → item deadline + geo dengan field benar", () => {
    const items = itemsFor({
      id: "p1",
      name: "Situs Katalog",
      status: "aktif",
      priority: "tinggi",
      progress: 40,
      deadline: "2026-09-10",
      country: "Indonesia",
    });

    expect(items).toEqual([
      {
        id: makeItemId(SLUG, "projects", "p1", "deadline"),
        source: SLUG,
        collection: "projects",
        title: "Situs Katalog",
        type: "deadline",
        date: { year: 2026, month: 9, day: 10 },
        status: "aktif",
        priority: "tinggi",
        progress: 40,
      },
      {
        id: makeItemId(SLUG, "projects", "p1", "geo"),
        source: SLUG,
        collection: "projects",
        title: "Situs Katalog",
        type: "geo",
        lat: -2.5,
        lng: 118,
        label: "Situs Katalog",
        country: "Indonesia",
      },
    ]);
    expect(items[0].id).toBe(`${SLUG}:projects:p1:deadline`);
  });

  it("deadline epoch-ms diterima (parseDateOnly, UTC deterministik)", () => {
    const items = itemsFor({ name: "Rilis", deadline: Date.UTC(2026, 8, 10, 23, 30) });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "deadline", date: { year: 2026, month: 9, day: 10 } });
  });

  it("name kosong → title fallback '(Tanpa judul)'", () => {
    const items = itemsFor({ deadline: "2026-09-10" });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ title: "(Tanpa judul)", type: "deadline" });
  });

  it("field opsional hilang/null → key-nya tidak muncul di item (bukan undefined)", () => {
    const items = itemsFor({ name: "Proyek", status: null, deadline: "2026-09-10" });
    expect(items).toHaveLength(1);
    expect(items[0]).not.toHaveProperty("status");
    expect(items[0]).not.toHaveProperty("priority");
    expect(items[0]).not.toHaveProperty("progress");
  });

  it("semua item lolos schema kanonik strict (gate repository)", () => {
    const items = itemsFor({
      name: "Proyek",
      status: "aktif",
      progress: 10,
      deadline: "2026-09-10",
      country: "id",
    });
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }
  });
});

describe("projectHubAdapter — field hilang → skip", () => {
  it("tanpa deadline → tidak ada item deadline, geo tetap dihasilkan", () => {
    const items = itemsFor({ name: "Proyek", country: "id" });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "geo" });
  });

  it("tanpa country → hanya deadline", () => {
    const items = itemsFor({ name: "Proyek", deadline: "2026-09-10" });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "deadline" });
  });

  it("tanpa deadline dan country → record tidak menghasilkan item", () => {
    expect(itemsFor({ name: "Proyek", status: "aktif" })).toEqual([]);
  });

  it("country string kosong/whitespace → tidak ada geo", () => {
    expect(itemsFor({ deadline: "2026-09-10", country: "   " })).toHaveLength(1); // deadline saja
  });
});

describe("projectHubAdapter — tipe salah/malformed → skip", () => {
  it("tipe field allowlist salah → record di-skip utuh", () => {
    expect(itemsFor({ name: 123, deadline: "2026-09-10" })).toEqual([]);
    expect(itemsFor({ name: "X", deadline: true })).toEqual([]);
    expect(itemsFor({ name: "X", deadline: "2026-09-10", progress: "50" })).toEqual([]);
    expect(itemsFor({ name: "X", deadline: "2026-09-10", country: 42 })).toEqual([]);
    expect(itemsFor({ name: "X", deadline: "2026-09-10", status: { v: 1 } })).toEqual([]);
  });

  it("progress NaN/Infinity → record di-skip (number valid saja)", () => {
    expect(itemsFor({ name: "X", deadline: "2026-09-10", progress: NaN })).toEqual([]);
    expect(itemsFor({ name: "X", deadline: "2026-09-10", progress: Infinity })).toEqual([]);
  });

  it("data null/bukan objek → skip tanpa crash, record sehat tetap diproses", () => {
    const broken = { id: "db-x", record_id: "x", data: null } as unknown as DataRecord;
    const broken2 = null as unknown as DataRecord;
    const items = projectHubAdapter.toItems({
      projects: [broken, broken2, record("ok", { deadline: "2026-01-01" })],
    });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: makeItemId(SLUG, "projects", "ok", "deadline") });
  });
});

describe("projectHubAdapter — collection kosong", () => {
  it("projects kosong → []", () => {
    expect(projectHubAdapter.toItems({ projects: [] })).toEqual([]);
  });

  it("key projects tidak ada → []", () => {
    expect(projectHubAdapter.toItems({})).toEqual([]);
  });
});

describe("projectHubAdapter — tanggal invalid → skip", () => {
  it("tanggal mustahil/bukan tanggal → tanpa item deadline", () => {
    expect(itemsFor({ name: "X", deadline: "2026-13-45" })).toEqual([]);
    expect(itemsFor({ name: "X", deadline: "abc" })).toEqual([]);
    expect(itemsFor({ name: "X", deadline: "2026-02-30" })).toEqual([]);
  });

  it("deadline invalid tidak mematikan geo yang valid", () => {
    const items = itemsFor({ name: "X", deadline: "2026-13-45", country: "jp" });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "geo", lat: 36.2, lng: 138.25 });
  });

  it("country tak dikenal → geo di-skip, deadline tetap jalan", () => {
    const items = itemsFor({ name: "X", deadline: "2026-09-10", country: "Atlantis" });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: "deadline" });
  });
});

describe("projectHubAdapter — KEAMANAN", () => {
  it("key asing sensitif di data → di-strip, tidak muncul di output", () => {
    const items = itemsFor({
      name: "Proyek",
      deadline: "2026-09-10",
      country: "id",
      aiKey: "SECRET",
      password: "P4SS",
      apiKey: "SECRET",
    });

    const json = JSON.stringify(items);
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("P4SS");
    expect(json).not.toContain("aiKey");
    expect(json).not.toContain("password");
    // Tidak ada key asing lolos: schema strict kanonik menolak bila ada.
    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }
    const allowedKeys = ["id", "source", "collection", "title"];
    for (const item of items) {
      for (const key of Object.keys(item)) {
        expect(
          [...allowedKeys, "type", "date", "status", "priority", "progress", "lat", "lng", "label", "country"].includes(key),
        ).toBe(true);
      }
    }
  });

  it("collection di luar allowlist (prefs/cats) TIDAK dibaca sama sekali", () => {
    const items = projectHubAdapter.toItems({
      prefs: [record("pref1", { aiKey: "SECRET", aiEndpoint: "https://ai", gcalClientId: "P4SS" })],
      cats: [record("c1", { name: "Kategori", password: "P4SS" })],
    } as unknown as Record<string, DataRecord[]>);
    expect(items).toEqual([]);
    expect(JSON.stringify(items)).not.toContain("SECRET");
    expect(JSON.stringify(items)).not.toContain("P4SS");
  });

  it("prefs sensitif berdampingan dengan projects → hanya projects yang jadi item", () => {
    const items = projectHubAdapter.toItems({
      projects: [record("p1", { name: "Proyek", deadline: "2026-09-10" })],
      prefs: [record("pref1", { aiKey: "SECRET" })],
    } as unknown as Record<string, DataRecord[]>);
    expect(items).toHaveLength(1);
    expect(JSON.stringify(items)).not.toContain("SECRET");
  });
});

describe("projectHubAdapter — unexpected schema tetap aman", () => {
  it("key ekstra tak dikenal (objek/array bersarang) → output tetap bersih", () => {
    const items = itemsFor({
      name: "Proyek",
      deadline: "2026-09-10",
      country: "id",
      foo: "BAR-VALUE",
      nested: { secret: "P4SS", deep: { token: "SECRET" } },
      list: [1, 2, { x: "P4SS" }],
      subtasks: [{ title: "bocor?" }],
    });

    const json = JSON.stringify(items);
    expect(items).toHaveLength(2);
    expect(json).not.toContain("BAR-VALUE");
    expect(json).not.toContain("P4SS");
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("foo");
    expect(json).not.toContain("nested");
    expect(json).not.toContain("subtasks");
    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }
  });
});
