import { listRecords } from "@/features/core/recordsApi";
import { fetchPages } from "@/features/pages/api/pages.api";
import { supabase } from "@/lib/supabase";
import type { DataRecord } from "@/features/core/types";
import { ADAPTERS, type ToolAdapter } from "../adapters/registry";
import { dashboardItemSchema, type DashboardItem } from "../types";

// ============================================================================
// RecordsDashboardRepository — satu-satunya jalur data dashboard.
//
// records → listRecords (allowlist per adapter) → adapter (pure) → validasi
// Zod → DashboardSnapshot. UI tidak pernah menyentuh supabase untuk
// dashboard; semua provenance & isolasi error ditangani di sini.
// ============================================================================

/**
 * Hasil eksekusi SATU adapter. Sengaja hanya angka + pesan error — TANPA isi
 * record, agar data pengguna tidak pernah bocor lewat diagnostics.
 */
export interface AdapterDiagnostic {
  adapter: string;
  success: boolean;
  recordsRead: number;
  recordsAccepted: number;
  recordsRejected: number;
  durationMs: number;
  error?: string;
}

export interface DashboardSnapshot {
  items: DashboardItem[];
  diagnostics: AdapterDiagnostic[];
  /** ISO timestamp saat snapshot selesai dihitung. */
  generatedAt: string;
}

/**
 * Hitung snapshot penuh: jalankan semua adapter paralel tapi TERISOLASI —
 * kegagalan satu adapter (error load records maupun bug di toItems) hanya
 * menghasilkan diagnostic error; item adapter lain tetap masuk snapshot (§20).
 * Dashboard harus tetap berguna saat salah satu sumber data rusak.
 *
 * Parameter `adapters` opsional untuk keterujian (test menyuntik adapter
 * fake); produksi memakai ADAPTERS dari registry.
 *
 * BATASAN v1 (diagnostics): adapter tidak punya mekanisme melaporkan record
 * input yang ia SKIP, sehingga recordsAccepted = jumlah item valid yang
 * dihasilkan dan recordsRejected = jumlah item output yang GAGAL schema —
 * bukan jumlah record input yang dilewati adapter. Bila kelak butuh angka
 * skip yang jujur, kontrak adapter diperluas (mis. hasil {items, skipped}).
 */
export async function loadDashboardSnapshot(
  adapters: readonly ToolAdapter[] = ADAPTERS,
): Promise<DashboardSnapshot> {
  const results = await Promise.all(adapters.map((adapter) => runAdapter(adapter)));

  const items: DashboardItem[] = [];
  const diagnostics: AdapterDiagnostic[] = [];
  for (const result of results) {
    items.push(...result.items);
    diagnostics.push(result.diagnostic);
  }

  return { items, diagnostics, generatedAt: new Date().toISOString() };
}

/** Eksekusi satu adapter dalam try/catch terisolasi — TIDAK pernah melempar. */
async function runAdapter(
  adapter: ToolAdapter,
): Promise<{ items: DashboardItem[]; diagnostic: AdapterDiagnostic }> {
  const startedAt = performance.now();
  const counters = {
    adapter: adapter.slug,
    recordsRead: 0,
    recordsAccepted: 0,
    recordsRejected: 0,
  };

  try {
    // Allowlist: hanya collection yang dideklarasikan adapter yang dibaca.
    const recordSets = await Promise.all(
      adapter.collections.map((collection) => listRecords(adapter.slug, collection)),
    );
    const recordsByCollection: Record<string, DataRecord[]> = {};
    adapter.collections.forEach((collection, index) => {
      recordsByCollection[collection] = recordSets[index];
    });
    const recordsRead = recordSets.reduce((total, records) => total + records.length, 0);

    const produced = adapter.toItems(recordsByCollection);

    // Validasi output: HANYA item yang lolos schema diterima; yang invalid
    // ditolak TERHITUNG (tidak dibuang diam-diam) agar bug adapter teramati.
    // Yang disimpan adalah hasil parse (sudah strict — mustahil membawa key
    // asing seperti "password"/"aiKey" dari record mentah).
    const items: DashboardItem[] = [];
    let recordsRejected = 0;
    for (const candidate of produced) {
      const parsed = dashboardItemSchema.safeParse(candidate);
      if (parsed.success) {
        items.push(parsed.data);
      } else {
        recordsRejected += 1;
      }
    }

    return {
      items,
      diagnostic: {
        ...counters,
        success: true,
        recordsRead,
        recordsAccepted: items.length,
        recordsRejected,
        durationMs: Math.round(performance.now() - startedAt),
      },
    };
  } catch (err) {
    // Error load (supabase) maupun lemparan adapter berakhir di sini —
    // diisolasi, tidak menular ke adapter lain.
    return {
      items: [],
      diagnostic: {
        ...counters,
        success: false,
        durationMs: Math.round(performance.now() - startedAt),
        error: err instanceof Error ? err.message : String(err),
      },
    };
  }
}

export interface ConnectedToolInfo {
  slug: string;
  hasAdapter: boolean;
  recordCount: number;
  /** slug terdaftar sebagai page scope='admin' (Kelola Tools mengenalinya). */
  inPages: boolean;
  /** slug punya minimal satu record aktif di tabel records. */
  inRecords: boolean;
}

/**
 * Deteksi tool terhubung (D10) — sumber data System Health.
 *
 * Dua sumber truth digabung (paralel):
 *  1. distinct tool_slug dari records — PostgREST tidak punya SELECT DISTINCT,
 *     jadi dedupe + hitung dilakukan client-side (tabel masih kecil; bila
 *     membesar, pindahkan ke RPC/view agregat).
 *  2. page scope='admin' — tool bisa terdaftar sebagai page tapi belum pernah
 *     menulis record (recordCount 0); tetap dianggap "terhubung".
 *
 * Tool dengan hasAdapter:false = tool baru/belum terdukung dashboard —
 * sinyal kesehatan, bukan error. Flag `inPages`/`inRecords` mengekspos asal
 * slug (union yang sudah dihitung di sini) agar System Health bisa menandai
 * "data yatim" (punya record tapi tool tak terdaftar di pages) vs "tanpa data"
 * (terdaftar tapi belum pernah menulis record). `adapters` opsional untuk keterujian.
 */
export async function listConnectedTools(
  adapters: readonly ToolAdapter[] = ADAPTERS,
): Promise<ConnectedToolInfo[]> {
  const [{ data: rows, error }, pages] = await Promise.all([
    // deleted=false: recordCount menghitung record AKTIF saja — selaras
    // dengan data yang dibaca dashboard.
    supabase.from("records").select("tool_slug").eq("deleted", false),
    fetchPages(),
  ]);
  if (error) throw error;

  const counts = new Map<string, number>();
  const inRecords = new Set<string>();
  for (const row of (rows ?? []) as { tool_slug: string }[]) {
    counts.set(row.tool_slug, (counts.get(row.tool_slug) ?? 0) + 1);
    inRecords.add(row.tool_slug);
  }

  const inPages = new Set<string>();
  for (const page of pages) {
    if (page.scope !== "admin") continue;
    inPages.add(page.slug);
    if (!counts.has(page.slug)) counts.set(page.slug, 0);
  }

  return [...counts.entries()]
    .map(([slug, recordCount]) => ({
      slug,
      hasAdapter: adapters.some((adapter) => adapter.slug === slug),
      recordCount,
      inPages: inPages.has(slug),
      inRecords: inRecords.has(slug),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
