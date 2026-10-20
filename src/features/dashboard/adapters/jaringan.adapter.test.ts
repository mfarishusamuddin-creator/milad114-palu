import { describe, expect, it } from "vitest";
import type { DataRecord } from "@/features/core/types";
import { dashboardItemSchema, makeItemId } from "../types";
import { jaringanAdapter } from "./jaringan.adapter";

const SLUG = "husam-jaringan";

function rec(recordId: string, data: Record<string, unknown> = {}): DataRecord {
  return { id: `db-${recordId}`, record_id: recordId, data };
}

describe("jaringanAdapter", () => {
  it("kontrak: slug, allowlist collections, description terisi", () => {
    expect(jaringanAdapter.slug).toBe("husam-jaringan");
    expect(jaringanAdapter.collections).toEqual(["contacts"]);
    expect(jaringanAdapter.description.length).toBeGreaterThan(0);
  });

  it("(1) valid: birthDate → reminder ulang tahun recurring yearly, id deterministik", () => {
    const items = jaringanAdapter.toItems({
      contacts: [
        rec("c-1", { id: 7, name: "Fulan", birthDate: "1990-05-17" }),
        // Tanpa name → fallback "Kontak"; ISO datetime → bagian tanggal apa adanya.
        rec("c-2", { birthDate: "2000-12-01T23:30:00Z" }),
      ],
    });

    expect(items).toEqual([
      {
        id: makeItemId(SLUG, "contacts", "c-1", "birthday"),
        source: SLUG,
        collection: "contacts",
        title: "Ulang tahun: Fulan",
        type: "reminder",
        date: { year: 1990, month: 5, day: 17 },
        recurring: "yearly",
      },
      {
        id: makeItemId(SLUG, "contacts", "c-2", "birthday"),
        source: SLUG,
        collection: "contacts",
        title: "Ulang tahun: Kontak",
        type: "reminder",
        date: { year: 2000, month: 12, day: 1 },
        recurring: "yearly",
      },
    ]);

    // Semua output lolos schema beku (strict → mustahil membawa key asing).
    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }
  });

  it("(1b) deterministik: dua kali panggil → output identik", () => {
    const input = {
      contacts: [rec("c-1", { name: "Fulan", birthDate: "1990-05-17" })],
    };
    expect(jaringanAdapter.toItems(input)).toEqual(jaringanAdapter.toItems(input));
  });

  it("(2) field hilang: tanpa birthDate → skip; name kosong → fallback 'Kontak'", () => {
    expect(
      jaringanAdapter.toItems({
        contacts: [rec("c-1", { name: "Tanpa Tanggal" }), rec("c-2", {})],
      }),
    ).toEqual([]);

    const items = jaringanAdapter.toItems({
      contacts: [rec("c-3", { name: "", birthDate: "1990-05-17" })],
    });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ title: "Ulang tahun: Kontak" });
  });

  it("(2b) record_id kosong: fallback data.id; tanpa keduanya → skip", () => {
    const withDataId = jaringanAdapter.toItems({
      contacts: [
        { id: "db-1", record_id: "", data: { id: "kontak-9", birthDate: "1990-05-17" } },
      ],
    });
    expect(withDataId).toHaveLength(1);
    expect(withDataId[0]).toMatchObject({
      id: makeItemId(SLUG, "contacts", "kontak-9", "birthday"),
    });

    expect(
      jaringanAdapter.toItems({
        contacts: [{ id: "db-1", record_id: "", data: { birthDate: "1990-05-17" } }],
      }),
    ).toEqual([]);
  });

  it("(3) malformed: data null/string, name numerik → tidak crash, fail-soft per field", () => {
    const malformed = [
      { id: "db-1", record_id: "c-1", data: null },
      { id: "db-2", record_id: "c-2", data: "bukan objek" },
      { id: "db-3", record_id: "c-3", data: { name: 42, birthDate: "1990-05-17" } },
    ] as unknown as DataRecord[];

    const items = jaringanAdapter.toItems({ contacts: malformed });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      // name bukan string → fallback; birthDate valid tetap menghasilkan reminder.
      title: "Ulang tahun: Kontak",
      date: { year: 1990, month: 5, day: 17 },
    });
  });

  it("(4) kosong: tanpa collection / array kosong → []", () => {
    expect(jaringanAdapter.toItems({})).toEqual([]);
    expect(jaringanAdapter.toItems({ contacts: [] })).toEqual([]);
  });

  it("(5) tanggal invalid → skip", () => {
    expect(
      jaringanAdapter.toItems({
        contacts: [
          rec("c-1", { name: "A", birthDate: "2026-02-30" }), // 30 Februari tidak ada
          rec("c-2", { birthDate: "bukan-tanggal" }),
          rec("c-3", { birthDate: null }),
          rec("c-4", { birthDate: "17/05/1990" }), // format non-ISO bukan kontrak
        ],
      }),
    ).toEqual([]);
  });

  it("(6) KEAMANAN: key asing sensitif di-strip — tidak bocor ke output", () => {
    const items = jaringanAdapter.toItems({
      contacts: [
        rec("c-1", {
          name: "Fulan",
          birthDate: "1990-05-17",
          password: "P4SS",
          aiKey: "SECRET",
          email: "fulan@example.com",
        }),
      ],
    });

    expect(items).toHaveLength(1);
    const json = JSON.stringify(items);
    expect(json).not.toContain("P4SS");
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("password");
    expect(json).not.toContain("aiKey");
    expect(json).not.toContain("fulan@example.com"); // PII di luar allowlist
  });

  it("(7) unexpected schema aman: collection bukan array & collection asing diabaikan", () => {
    expect(
      jaringanAdapter.toItems({ contacts: "bukan array" as unknown as DataRecord[] }),
    ).toEqual([]);

    const items = jaringanAdapter.toItems({
      contacts: [rec("c-1", { birthDate: "1990-05-17" })],
      privateNotes: [rec("p-1", { birthDate: "1980-01-01" })],
    });
    expect(items).toHaveLength(1); // HANYA allowlist "contacts" yang dibaca
    expect(items[0]).toMatchObject({
      id: makeItemId(SLUG, "contacts", "c-1", "birthday"),
    });
  });
});
