import type { DataRecord } from "@/features/core/types";
import type { DashboardItem } from "../types";
import { projectHubAdapter } from "./projectHub.adapter";
import { dosenLedgerAdapter } from "./dosenLedger.adapter";
import { jaringanAdapter } from "./jaringan.adapter";
import { murojaahAdapter } from "./murojaah.adapter";
import { sholat99Adapter } from "./sholat99.adapter";
import { financeAdapter } from "./finance.adapter";
import { socialAccountsAdapter } from "./socialAccounts.adapter";
import { productCatalogAdapter } from "./productCatalog.adapter";

// ============================================================================
// Kontrak adapter tool → item kanonik dashboard.
//
// Menambah tool baru ke dashboard = buat 1 file adapter di folder ini + push
// ke ADAPTERS. UI dashboard TIDAK berubah (§18) — ia hanya mengkonsumsi
// DashboardItem, tidak pernah tahu tool apa yang menghasilkan.
//
// `collections` adalah ALLOWLIST: repository HANYA membaca dan menyerahkan
// collection yang tercantum di sini. Allowlist > denylist (§6) karena
// fail-closed — data yang lupa dideklarasikan tidak ikut terbaca, sementara
// denylist bocor setiap kali tool menambah collection baru.
// ============================================================================

export interface ToolAdapter {
  /** = tool_slug di tabel records. */
  readonly slug: string;
  /** ALLOWLIST collection yang dibaca repository untuk tool ini. */
  readonly collections: readonly string[];
  /** Dokumentasi singkat sumber data (dipakai diagnostics/System Health). */
  readonly description: string;
  /**
   * PURE: tanpa side effect, tanpa UI, tanpa I/O — hanya memetakan record ke
   * item kanonik. Kemurnian membuat adapter bisa diuji terisolasi dan aman
   * dijalankan ulang setiap kali snapshot dihitung (v1 recompute penuh).
   * Output yang tidak lolos schema DashboardItem ditolak repository.
   */
  toItems(recordsByCollection: Record<string, DataRecord[]>): DashboardItem[];
}

/**
 * Pendaftaran adapter. Menambah tool baru = buat 1 file adapter di folder ini
 * lalu daftarkan di sini; UI/repository TIDAK perlu diubah (mereka hanya
 * mengkonsumsi DashboardItem). Tool yang belum punya adapter tetap terdeteksi
 * via listConnectedTools (System Health), hanya saja tidak menyumbang item.
 * Urutan = prioritas data.
 */
export const ADAPTERS: ToolAdapter[] = [
  projectHubAdapter,
  dosenLedgerAdapter,
  jaringanAdapter,
  murojaahAdapter,
  sholat99Adapter,
  financeAdapter,
  socialAccountsAdapter,
  productCatalogAdapter,
];
