import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DataRecord } from "@/features/core/types";
import { ADAPTERS, type ToolAdapter } from "../adapters/registry";
import { loadDashboardSnapshot, listConnectedTools } from "./dashboardRepository";
import { makeItemId, type DashboardItem } from "../types";

// ============================================================================
// Test repository memakai ADAPTER FAKE + modul supabase/recordsApi/pages yang
// di-mock — tidak menyentuh jaringan; adapter nyata hanya lewat jalur default
// ADAPTERS (murni, I/O-nya di-mock).
// vi.hoisted: state test tersedia bagi factory vi.mock yang di-hoist (referensi
// DataRecord di bawah hanya anotasi tipe — ter-erase, aman saat hoisting).
// ============================================================================
const h = vi.hoisted(() => ({
  recordsByCollection: {} as Record<string, DataRecord[]>,
  failCollections: new Set<string>(),
  toolSlugRows: [] as { tool_slug: string }[],
  pages: [] as { slug: string; scope: string }[],
}));

vi.mock("@/features/core/recordsApi", () => ({
  listRecords: async (toolSlug: string, collection: string) => {
    const key = `${toolSlug}:${collection}`;
    if (h.failCollections.has(key)) throw new Error(`gagal load ${key}`);
    return h.recordsByCollection[key] ?? [];
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: h.toolSlugRows, error: null }),
      }),
    }),
  },
}));

vi.mock("@/features/pages/api/pages.api", () => ({
  fetchPages: async () => h.pages,
}));

function record(recordId: string, data: Record<string, unknown> = {}): DataRecord {
  return { id: `db-${recordId}`, record_id: recordId, data };
}

// --- Adapter FAKE (bukan adapter tool nyata) --------------------------------

/** Sukses: 1 reminder valid per record di "notes"; collection lain diabaikan. */
const okAdapter: ToolAdapter = {
  slug: "fake-ok",
  collections: ["notes", "archive"],
  description: "Adapter uji: reminder dari notes.",
  toItems: (recordsByCollection) =>
    (recordsByCollection["notes"] ?? []).map((r) => ({
      id: makeItemId("fake-ok", "notes", r.record_id, "reminder"),
      source: "fake-ok",
      collection: "notes",
      title: String(r.data["judul"] ?? "tanpa judul"),
      type: "reminder" as const,
      date: { year: 2026, month: 9, day: 10 },
    })),
};

/** Selalu melempar — mensimulasikan bug adapter di fase transform. */
const throwAdapter: ToolAdapter = {
  slug: "fake-throw",
  collections: ["whatever"],
  description: "Adapter uji: selalu melempar error.",
  toItems: () => {
    throw new Error("adapter meledak");
  },
};

/** Collection-nya gagal di-load (supabase error) — fase load, bukan transform. */
const loadFailAdapter: ToolAdapter = {
  slug: "fake-loadfail",
  collections: ["broken"],
  description: "Adapter uji: load records-nya gagal.",
  toItems: () => [],
};

/** Menghasilkan campuran item valid + item cacat (key asing "password"). */
const invalidAdapter: ToolAdapter = {
  slug: "fake-invalid",
  collections: ["raw"],
  description: "Adapter uji: bocor membawa field mentah record.",
  toItems: (recordsByCollection) => {
    const items: DashboardItem[] = [];
    for (const r of recordsByCollection["raw"] ?? []) {
      if (r.record_id === "valid") {
        items.push({
          id: makeItemId("fake-invalid", "raw", r.record_id, "m"),
          source: "fake-invalid",
          collection: "raw",
          title: "Metrik valid",
          type: "metric",
          key: "jumlah",
          value: 42,
        });
      } else {
        // Sengaja cacat: key asing harus ditolak schema strict.
        items.push({
          id: makeItemId("fake-invalid", "raw", r.record_id, "m"),
          source: "fake-invalid",
          collection: "raw",
          title: "Metrik bocor",
          type: "metric",
          key: "jumlah",
          value: 42,
          password: "hunter2",
        } as unknown as DashboardItem);
      }
    }
    return items;
  },
};

beforeEach(() => {
  h.recordsByCollection = {};
  h.failCollections = new Set();
  h.toolSlugRows = [];
  h.pages = [];
});

describe("registry", () => {
  it("ADAPTERS memuat 8 adapter tool nyata, urut prioritas data", () => {
    expect(ADAPTERS.map((a) => a.slug)).toEqual([
      "project-hub-v3",
      "dosen-ledger",
      "husam-jaringan",
      "murojaah-tracker",
      "tracker-sholat-99-hari",
      "finance-tracker-pro-1",
      "husam-social-account-manager-pro",
      "husam-product-catalog-pro",
    ]);
  });
});

describe("loadDashboardSnapshot", () => {
  it("tanpa argumen memakai ADAPTERS (8 adapter nyata) → snapshot berstruktur lengkap", async () => {
    const snapshot = await loadDashboardSnapshot();
    expect(snapshot.items).toEqual([]); // records mock kosong → tidak ada item
    expect(snapshot.diagnostics.map((d) => d.adapter)).toEqual(ADAPTERS.map((a) => a.slug));
    expect(snapshot.diagnostics.every((d) => d.success)).toBe(true);
    expect(new Date(snapshot.generatedAt).getTime()).not.toBeNaN();
  });

  it("(a) adapter sukses → item valid masuk snapshot + diagnostic success", async () => {
    h.recordsByCollection = {
      "fake-ok:notes": [record("n1", { judul: "Rapat" }), record("n2", { judul: "Bayar listrik" })],
      "fake-ok:archive": [record("old1")],
    };

    const snapshot = await loadDashboardSnapshot([okAdapter]);

    expect(snapshot.items).toHaveLength(2);
    expect(snapshot.items[0]?.title).toBe("Rapat");
    expect(snapshot.items[0]?.type).toBe("reminder");
    expect(snapshot.items[1]?.id).toBe("fake-ok:notes:n2:reminder");

    const diag = snapshot.diagnostics[0];
    expect(diag?.adapter).toBe("fake-ok");
    expect(diag?.success).toBe(true);
    expect(diag?.recordsRead).toBe(3); // notes + archive (allowlist dibaca semua)
    expect(diag?.recordsAccepted).toBe(2);
    expect(diag?.recordsRejected).toBe(0);
    expect(diag?.durationMs).toBeGreaterThanOrEqual(0);
    expect(diag?.error).toBeUndefined();
  });

  it("(b) adapter melempar → TERISOLASI: item adapter lain tetap ada + diagnostic error", async () => {
    h.recordsByCollection = { "fake-ok:notes": [record("n1", { judul: "Rapat" })] };

    const snapshot = await loadDashboardSnapshot([okAdapter, throwAdapter]);

    expect(snapshot.items).toHaveLength(1);
    expect(snapshot.items[0]?.source).toBe("fake-ok");

    const okDiag = snapshot.diagnostics.find((d) => d.adapter === "fake-ok");
    const badDiag = snapshot.diagnostics.find((d) => d.adapter === "fake-throw");
    expect(okDiag?.success).toBe(true);
    expect(badDiag?.success).toBe(false);
    expect(badDiag?.error).toContain("adapter meledak");
    expect(badDiag?.recordsAccepted).toBe(0);
    expect(badDiag?.recordsRead).toBe(0);
  });

  it("(b') gagal LOAD records juga terisolasi per adapter", async () => {
    h.recordsByCollection = { "fake-ok:notes": [record("n1")] };
    h.failCollections = new Set(["fake-loadfail:broken"]);

    const snapshot = await loadDashboardSnapshot([okAdapter, loadFailAdapter]);

    expect(snapshot.items).toHaveLength(1);
    const badDiag = snapshot.diagnostics.find((d) => d.adapter === "fake-loadfail");
    expect(badDiag?.success).toBe(false);
    expect(badDiag?.error).toContain("gagal load fake-loadfail:broken");
  });

  it("(c) item invalid ditolak TERHITUNG — tidak crash, tidak lolos diam-diam", async () => {
    h.recordsByCollection = {
      "fake-invalid:raw": [record("valid"), record("cacat")],
    };

    const snapshot = await loadDashboardSnapshot([invalidAdapter]);

    expect(snapshot.items).toHaveLength(1);
    expect(snapshot.items[0]?.title).toBe("Metrik valid");
    // KEAMANAN KONTRAK: key asing tidak pernah lolos ke snapshot.
    for (const item of snapshot.items) {
      expect(item).not.toHaveProperty("password");
    }

    const diag = snapshot.diagnostics[0];
    expect(diag?.success).toBe(true);
    expect(diag?.recordsRead).toBe(2);
    expect(diag?.recordsAccepted).toBe(1);
    expect(diag?.recordsRejected).toBe(1);
    expect(diag?.error).toBeUndefined();
  });

  it("diagnostic tidak membawa data record (hanya angka + pesan)", async () => {
    h.recordsByCollection = { "fake-ok:notes": [record("n1", { judul: "Rapat rahasia" })] };
    const snapshot = await loadDashboardSnapshot([okAdapter, throwAdapter]);
    for (const diag of snapshot.diagnostics) {
      const serialized = JSON.stringify(diag);
      expect(serialized).not.toContain("Rapat rahasia");
      expect(Object.keys(diag).sort()).toEqual(
        ["adapter", "durationMs", "error", "recordsAccepted", "recordsRead", "recordsRejected", "success"].filter(
          (key) => key !== "error" || diag.error !== undefined,
        ).sort(),
      );
    }
  });
});

describe("listConnectedTools", () => {
  it("union slug records + page admin, dedupe, tandai hasAdapter, urut slug", async () => {
    h.toolSlugRows = [{ tool_slug: "alpha" }, { tool_slug: "alpha" }, { tool_slug: "beta" }];
    h.pages = [
      { slug: "beta", scope: "admin" },
      { slug: "gamma", scope: "admin" },
      { slug: "publik", scope: "public" }, // non-admin tidak ikut
    ];
    const fakeAlpha: ToolAdapter = { ...okAdapter, slug: "alpha" };

    const tools = await listConnectedTools([fakeAlpha]);

    expect(tools).toEqual([
      { slug: "alpha", hasAdapter: true, recordCount: 2, inPages: false, inRecords: true },
      { slug: "beta", hasAdapter: false, recordCount: 1, inPages: true, inRecords: true },
      // page admin tanpa record → terdaftar tapi belum pernah menulis data
      { slug: "gamma", hasAdapter: false, recordCount: 0, inPages: true, inRecords: false },
    ]);
  });

  it("tanpa argumen memakai ADAPTERS → slug tak terdaftar tetap hasAdapter:false", async () => {
    h.toolSlugRows = [{ tool_slug: "alpha" }];
    const tools = await listConnectedTools();
    expect(tools).toEqual([
      { slug: "alpha", hasAdapter: false, recordCount: 1, inPages: false, inRecords: true },
    ]);
  });

  it("flag inRecords/inPages menandai kasus 'data yatim' dan 'tanpa data'", async () => {
    // Kasus nyata: qurantracker-pro menulis record tapi tidak terdaftar di pages.
    h.toolSlugRows = [{ tool_slug: "qurantracker-pro" }];
    h.pages = [{ slug: "empty-tool", scope: "admin" }];

    const tools = await listConnectedTools([]);

    expect(tools).toEqual([
      { slug: "empty-tool", hasAdapter: false, recordCount: 0, inPages: true, inRecords: false },
      { slug: "qurantracker-pro", hasAdapter: false, recordCount: 1, inPages: false, inRecords: true },
    ]);
  });
});
