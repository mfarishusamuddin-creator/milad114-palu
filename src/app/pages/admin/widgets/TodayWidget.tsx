import { useDashboardSnapshot } from "@/features/dashboard/hooks/useDashboardSnapshot";
import {
  addDays,
  compareDay,
  formatDayShort,
  localDayPoint,
  matchesToday,
} from "@/features/dashboard/lib/today";
import type { DashboardItem, DayPoint } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

// ============================================================================
// TodayWidget — "Today / Action Center": menjawab "Apa yang perlu saya
// perhatikan sekarang?". HANYA mengonsumsi snapshot kanonik dari
// useDashboardSnapshot (tidak pernah membaca records/supabase langsung).
//
// Tiga section berurutan (keputusan pemetaan, terdokumentasi):
//  (a) "Perlu Tindakan" — alert severity error/warn + deadline overdue.
//      Overdue murni tanggal (date < hari ini): deadline kanonik TIDAK punya
//      flag done, dan status bebas per tool sehingga tidak dipercaya sebagai
//      penanda selesai di v1.
//  (b) "Hari Ini" — deadline jatuh tempo hari ini + event mulai hari ini
//      (done !== true) + reminder yang jatuh hari ini (recurring mengikuti
//      kebijakan v1 di lib/today.ts).
//  (c) "7 Hari ke Depan" — deadline/event/reminders dengan tanggal dalam
//      (today, today+7]. Reminder recurring memakai TANGGAL ANCHOR aslinya
//      untuk rentang ini — kemunculannya yang berulang sudah direpresentasi
//      di section "Hari Ini", jadi tidak dihitung ganda di sini.
// ============================================================================

/** Satu baris tampilan: item kanonik + tanggal yang relevan untuk baris itu. */
interface Row {
  item: DashboardItem;
  /** Tanggal relevan (overdue/jatuh tempo/mulai/anchor) — alert tidak punya. */
  date?: DayPoint;
  /** Tanggal overdue diwarnai destructive agar langsung terbaca. */
  overdue?: boolean;
}

/** Label id-ID untuk recurring reminder (badge kecil di baris). */
const RECURRING_LABEL: Record<"daily" | "weekly" | "monthly" | "yearly", string> = {
  daily: "harian",
  weekly: "mingguan",
  monthly: "bulanan",
  yearly: "tahunan",
};

export function TodayWidget() {
  const snapshot = useDashboardSnapshot();
  const today = localDayPoint();
  const horizon = addDays(today, 7);
  const items = snapshot.data?.items ?? [];

  // Pemetaan item → section dalam satu pass; urutan snapshot dipertahankan
  // (deterministik dari adapter), khusus "7 Hari" diurutkan kronologis.
  const actionRows: Row[] = [];
  const todayRows: Row[] = [];
  const weekRows: Row[] = [];

  for (const item of items) {
    switch (item.type) {
      case "alert":
        // Hanya error/warn yang "perlu tindakan"; info bukan panggilan aksi.
        if (item.severity === "error" || item.severity === "warn") {
          actionRows.push({ item });
        }
        break;
      case "deadline": {
        const cmp = compareDay(item.date, today);
        if (cmp < 0) actionRows.push({ item, date: item.date, overdue: true });
        else if (cmp === 0) todayRows.push({ item, date: item.date });
        else if (compareDay(item.date, horizon) <= 0) weekRows.push({ item, date: item.date });
        break;
      }
      case "event": {
        // Event selesai bukan sesuatu yang "perlu diperhatikan" — dilewati.
        if (item.done === true) break;
        const cmp = compareDay(item.start, today);
        if (cmp === 0) todayRows.push({ item, date: item.start });
        else if (cmp > 0 && compareDay(item.start, horizon) <= 0) {
          weekRows.push({ item, date: item.start });
        }
        break;
      }
      case "reminder": {
        if (matchesToday(item, today)) {
          // Jatuh hari ini — tanggal anchor tidak ditampilkan (redundan),
          // badge recurring sudah menjelaskan sifatnya.
          todayRows.push({ item });
        } else {
          const cmp = compareDay(item.date, today);
          if (cmp > 0 && compareDay(item.date, horizon) <= 0) {
            weekRows.push({ item, date: item.date });
          }
        }
        break;
      }
      // geo/metric/alert-info: tidak punya semantik "hari" — bukan urusan widget ini.
      default:
        break;
    }
  }

  weekRows.sort((a, b) => (a.date && b.date ? compareDay(a.date, b.date) : 0));

  const sections = [
    { label: "Perlu Tindakan", rows: actionRows },
    { label: "Hari Ini", rows: todayRows },
    { label: "7 Hari ke Depan", rows: weekRows },
  ].filter((section) => section.rows.length > 0);

  return (
    <div className="rounded-lg border border-border bg-card/40 p-4 sm:col-span-2 lg:col-span-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Pusat Tindakan — Hari Ini
      </p>

      {snapshot.isLoading && <p className="mt-3 text-xs text-muted-foreground">Memuat…</p>}

      {snapshot.isError && (
        <div className="mt-3">
          <p className="text-xs text-destructive">Gagal memuat ringkasan hari ini.</p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {snapshot.error instanceof Error ? snapshot.error.message : String(snapshot.error)}
          </p>
        </div>
      )}

      {snapshot.data && sections.length === 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Tidak ada yang perlu diperhatikan hari ini.
        </p>
      )}

      {snapshot.data && sections.length > 0 && (
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <section key={section.label}>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {section.label}
              </p>
              <ul className="mt-2 flex flex-col gap-0.5">
                {section.rows.map((row) => (
                  <ItemRow key={row.item.id} row={row} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {snapshot.data && (
        <p className="mt-4 border-t border-border pt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {snapshot.data.diagnostics.filter((d) => d.success).length}/
          {snapshot.data.diagnostics.length} sumber · diperbarui{" "}
          {new Date(snapshot.data.generatedAt).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}

/** Satu baris item: judul + badge (severity/status/priority/recurring) + tanggal + sumber. */
function ItemRow({ row }: { row: Row }) {
  const { item } = row;
  return (
    <li className="flex items-start justify-between gap-2 rounded-md px-2 py-1.5">
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm text-foreground">{item.title}</p>
        {item.type === "alert" && item.message !== item.title && (
          <p className="line-clamp-1 text-xs text-muted-foreground">{item.message}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {badgesFor(item).map((badge) => (
          <span
            key={badge.label}
            className={cn("font-mono text-[10px] uppercase tracking-[0.1em]", badge.tone)}
          >
            {badge.label}
          </span>
        ))}
        {row.date && (
          <span
            className={cn(
              "font-mono text-[10px]",
              row.overdue ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {formatDayShort(row.date)}
          </span>
        )}
        <span className="rounded border border-border px-1 py-px font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
          {item.source}
        </span>
      </div>
    </li>
  );
}

/**
 * Badge kecil per tipe (hanya bila datanya ada). Palet terbatas token desain:
 * error → destructive; warn → kicker (tidak ada token amber di tema);
 * priority → kicker; status/recurring → muted.
 */
function badgesFor(item: DashboardItem): { label: string; tone: string }[] {
  switch (item.type) {
    case "alert":
      return [
        {
          label: item.severity,
          tone: item.severity === "error" ? "text-destructive" : "text-kicker",
        },
      ];
    case "deadline": {
      const badges: { label: string; tone: string }[] = [];
      if (item.status !== undefined) badges.push({ label: item.status, tone: "text-muted-foreground" });
      if (item.priority !== undefined) badges.push({ label: item.priority, tone: "text-kicker" });
      return badges;
    }
    case "reminder":
      return item.recurring !== undefined
        ? [{ label: RECURRING_LABEL[item.recurring], tone: "text-muted-foreground" }]
        : [];
    default:
      return [];
  }
}
