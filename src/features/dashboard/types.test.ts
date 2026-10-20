import { describe, expect, it } from "vitest";
import {
  dashboardItemSchema,
  dayPointSchema,
  makeItemId,
  type DashboardItem,
} from "./types";

describe("makeItemId", () => {
  it("stabil & deterministik untuk input yang sama", () => {
    const a = makeItemId("agenda", "events", "rec-1", "start");
    const b = makeItemId("agenda", "events", "rec-1", "start");
    expect(a).toBe(b);
    expect(a).toBe("agenda:events:rec-1:start");
  });

  it("segmen semantic membedakan beberapa item dari satu record yang sama", () => {
    expect(makeItemId("t", "c", "r", "start")).not.toBe(makeItemId("t", "c", "r", "end"));
  });

  it("provenance berbeda menghasilkan id berbeda", () => {
    expect(makeItemId("t1", "c", "r", "s")).not.toBe(makeItemId("t2", "c", "r", "s"));
    expect(makeItemId("t", "c1", "r", "s")).not.toBe(makeItemId("t", "c2", "r", "s"));
  });
});

describe("dayPointSchema", () => {
  it("menerima DayPoint valid", () => {
    expect(dayPointSchema.safeParse({ year: 2026, month: 9, day: 10 }).success).toBe(true);
  });

  it("menolak komponen mustahil & field hilang", () => {
    expect(dayPointSchema.safeParse({ year: 2026, month: 13, day: 1 }).success).toBe(false);
    expect(dayPointSchema.safeParse({ year: 2026, month: 0, day: 1 }).success).toBe(false);
    expect(dayPointSchema.safeParse({ year: 2026, month: 9, day: 32 }).success).toBe(false);
    expect(dayPointSchema.safeParse({ year: 2026, month: 9.5, day: 1 }).success).toBe(false);
    expect(dayPointSchema.safeParse({ year: 2026, month: 9 }).success).toBe(false);
  });

  it("strict: menolak key asing", () => {
    expect(
      dayPointSchema.safeParse({ year: 2026, month: 9, day: 10, timeZone: "UTC" }).success,
    ).toBe(false);
  });
});

describe("dashboardItemSchema (kontrak keamanan)", () => {
  const day = { year: 2026, month: 9, day: 10 };
  const base = {
    id: makeItemId("t", "c", "r", "s"),
    source: "t",
    collection: "c",
    title: "Judul",
  };

  it("menerima contoh valid keenam tipe dan kompatibel dua arah dengan interface TS", () => {
    // Array bertipe DashboardItem: kompilasi membuktikan interface → schema cocok.
    const samples: DashboardItem[] = [
      { ...base, id: makeItemId("t", "c", "r", "e"), type: "event", start: day, end: day, done: false },
      { ...base, id: makeItemId("t", "c", "r", "d"), type: "deadline", date: day, status: "open", priority: "high", progress: 40 },
      { ...base, id: makeItemId("t", "c", "r", "m"), type: "reminder", date: day, recurring: "weekly" },
      { ...base, id: makeItemId("t", "c", "r", "g"), type: "geo", lat: -2.5, lng: 118, label: "Jakarta", country: "indonesia", weight: 2 },
      { ...base, id: makeItemId("t", "c", "r", "x"), type: "metric", key: "saldo", value: 1500, unit: "IDR", asOf: day },
      { ...base, id: makeItemId("t", "c", "r", "a"), type: "alert", severity: "warn", message: "Hampir penuh" },
    ];
    expect(samples).toHaveLength(6);
    for (const sample of samples) {
      // Assignment bertipe DashboardItem: kompilasi membuktikan schema → interface cocok.
      const parsed: DashboardItem = dashboardItemSchema.parse(sample);
      // Strict: output identik dengan input valid (tidak ditambah/dibuang apa pun).
      expect(parsed).toEqual(sample);
    }
  });

  it("menerima field opsional yang dihilangkan", () => {
    const parsed = dashboardItemSchema.safeParse({ ...base, type: "event", start: day });
    expect(parsed.success).toBe(true);
  });

  it("MENOLAK key asing — field sensitif record tidak bisa lolos ke UI", () => {
    const leaked = {
      ...base,
      type: "alert",
      severity: "info",
      message: "ok",
      password: "hunter2",
      aiKey: "sk-secret",
    };
    expect(dashboardItemSchema.safeParse(leaked).success).toBe(false);
  });

  it("menolak tipe di luar union dan field wajib yang hilang", () => {
    expect(dashboardItemSchema.safeParse({ ...base, type: "unknown" }).success).toBe(false);
    expect(dashboardItemSchema.safeParse({ ...base, type: "deadline" }).success).toBe(false);
    expect(dashboardItemSchema.safeParse({ type: "deadline", date: day }).success).toBe(false);
  });

  it("menolak nilai enum/literal yang salah", () => {
    expect(
      dashboardItemSchema.safeParse({ ...base, type: "alert", severity: "fatal", message: "x" })
        .success,
    ).toBe(false);
    expect(
      dashboardItemSchema.safeParse({ ...base, type: "reminder", date: day, recurring: "hourly" })
        .success,
    ).toBe(false);
  });
});
