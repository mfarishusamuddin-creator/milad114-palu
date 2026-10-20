import { z } from "zod";

// ============================================================================
// Model domain kanonik dashboard — KONTRAK BEKU.
//
// Aliran data: records → RecordsDashboardRepository → AdapterRegistry →
// DashboardItem → UI. Adapter tool memetakan record mentah (bentuk bebas milik
// tiap tool) ke salah satu tipe kanonik di bawah; UI HANYA mengenal tipe
// kanonik ini, sehingga menambah tool baru tidak pernah menyentuh UI (§18).
// ============================================================================

export type DashboardItemType =
  | "event"
  | "deadline"
  | "reminder"
  | "geo"
  | "metric"
  | "alert";

/**
 * Tanggal "date-only": TANPA komponen waktu dan TANPA timezone.
 *
 * KENAPA struct {year, month, day} bukan Date/ISO timestamp (§38): semantik
 * tanggal lintas tool adalah KALENDER ("10 September 2026"), bukan titik waktu.
 * Bila disimpan sebagai timestamp, perbedaan zona waktu perangkat (atau
 * konversi JSON↔Date di browser berbeda) dapat menggeser tanggal ±1 hari —
 * korupsi timezone yang diam-diam merusak kalender, deadline, dan pengingat
 * pengguna. Struct ini mempertahankan semantik "2026-09-10" apa adanya;
 * aritmetika tetap bisa memakai Date native (new Date(year, month - 1, day)).
 */
export interface DayPoint {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

/** Field yang wajib ada di SEMUA item: identitas + provenance (asal data). */
interface DashboardItemBase {
  /** ID kanonik stabil — buat dengan makeItemId() agar deterministik. */
  id: string;
  /** Tool asal (= tool_slug di tabel records). */
  source: string;
  /** Collection asal di dalam tool tersebut. */
  collection: string;
  /** Judul siap tampil — adapter yang merapikan, UI tidak memformat ulang. */
  title: string;
}

export interface DashboardEvent extends DashboardItemBase {
  type: "event";
  start: DayPoint;
  end?: DayPoint;
  done?: boolean;
}

export interface DashboardDeadline extends DashboardItemBase {
  type: "deadline";
  date: DayPoint;
  status?: string;
  priority?: string;
  /** Skala progress diserahkan ke adapter penghasil (v1 tidak dibatasi 0-100 vs 0-1); UI harus toleran. */
  progress?: number;
}

export interface DashboardReminder extends DashboardItemBase {
  type: "reminder";
  date: DayPoint;
  recurring?: "daily" | "weekly" | "monthly" | "yearly";
}

export interface DashboardGeoPoint extends DashboardItemBase {
  type: "geo";
  lat: number;
  lng: number;
  label: string;
  country?: string;
  weight?: number;
}

export interface DashboardMetric extends DashboardItemBase {
  type: "metric";
  key: string;
  value: number;
  unit?: string;
  asOf?: DayPoint;
}

export interface DashboardAlert extends DashboardItemBase {
  type: "alert";
  severity: "info" | "warn" | "error";
  message: string;
}

/** Discriminated union by `type` — UI men-switch tipe ini, exhaustive & type-safe. */
export type DashboardItem =
  | DashboardEvent
  | DashboardDeadline
  | DashboardReminder
  | DashboardGeoPoint
  | DashboardMetric
  | DashboardAlert;

// ============================================================================
// Schema Zod — gerbang validasi output adapter di repository.
//
// Semua object schema STRICT (z.strictObject): key asing = INVALID. Ini pagar
// keamanan kontrak: bila adapter bocor meneruskan field mentah record (mis.
// "password", "aiKey"), item ditolak repository dan tidak pernah mencapai UI.
// ============================================================================

export const dayPointSchema = z.strictObject({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
});

// Field dasar disebar ke tiap varian agar setiap objek bisa strict penuh
// (menolak key asing) tanpa kehilangan diskriminator union.
const baseFields = {
  id: z.string(),
  source: z.string(),
  collection: z.string(),
  title: z.string(),
};

export const dashboardEventSchema = z.strictObject({
  ...baseFields,
  type: z.literal("event"),
  start: dayPointSchema,
  end: dayPointSchema.optional(),
  done: z.boolean().optional(),
});

export const dashboardDeadlineSchema = z.strictObject({
  ...baseFields,
  type: z.literal("deadline"),
  date: dayPointSchema,
  status: z.string().optional(),
  priority: z.string().optional(),
  progress: z.number().optional(),
});

export const dashboardReminderSchema = z.strictObject({
  ...baseFields,
  type: z.literal("reminder"),
  date: dayPointSchema,
  recurring: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
});

export const dashboardGeoPointSchema = z.strictObject({
  ...baseFields,
  type: z.literal("geo"),
  lat: z.number(),
  lng: z.number(),
  label: z.string(),
  country: z.string().optional(),
  weight: z.number().optional(),
});

export const dashboardMetricSchema = z.strictObject({
  ...baseFields,
  type: z.literal("metric"),
  key: z.string(),
  value: z.number(),
  unit: z.string().optional(),
  asOf: dayPointSchema.optional(),
});

export const dashboardAlertSchema = z.strictObject({
  ...baseFields,
  type: z.literal("alert"),
  severity: z.enum(["info", "warn", "error"]),
  message: z.string(),
});

export const dashboardItemSchema = z.discriminatedUnion("type", [
  dashboardEventSchema,
  dashboardDeadlineSchema,
  dashboardReminderSchema,
  dashboardGeoPointSchema,
  dashboardMetricSchema,
  dashboardAlertSchema,
]);

/**
 * ID kanonik item dashboard: deterministik dari provenance + semantik.
 *
 * KENAPA bukan UUID acak: record yang sama dengan makna yang sama harus selalu
 * menghasilkan ID yang sama, agar React key, cache, dan diff antar-snapshot
 * stabil — perubahan data terlihat sebagai update, bukan item baru tiap
 * recompute. Segmen `semantic` membedakan beberapa item dari SATU record
 * (mis. "start" vs "end" dari satu event) agar tidak saling menimpa.
 */
export function makeItemId(
  source: string,
  collection: string,
  recordId: string,
  semantic: string,
): string {
  return `${source}:${collection}:${recordId}:${semantic}`;
}
