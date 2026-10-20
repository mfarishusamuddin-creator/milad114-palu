import { useState } from "react";

import { useDashboardSnapshot } from "@/features/dashboard/hooks/useDashboardSnapshot";
import { isSameDay, localDayPoint, matchesToday, toDate } from "@/features/dashboard/lib/today";
import type { DashboardItem, DayPoint } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

// ============================================================================
// CalendarWidget — grid bulan + dot per hari + panel detail hari terpilih.
//
// HANYA mengonsumsi snapshot kanonik (useDashboardSnapshot). Pemetaan item →
// hari: event → tanggal mulai (start), deadline → date, reminder → kebijakan
// recurring v1 di lib/today.ts (matchesToday generik: kalender mengoper
// tanggal sel sebagai parameter `today`). geo/metric/alert bukan item
// kalender — tidak pernah tampil di sini.
// ============================================================================

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/** Chip filter tipe — state lokal, memfilter dot DAN panel sekaligus. */
const TYPE_FILTERS = ["Semua", "Deadline", "Event", "Reminder"] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

/** Warna dot per tipe (token desain). geo/metric/alert tak pernah muncul. */
const DOT_TONE: Record<DashboardItem["type"], string> = {
  deadline: "text-destructive",
  event: "text-kicker",
  reminder: "text-muted-foreground",
  geo: "text-muted-foreground",
  metric: "text-muted-foreground",
  alert: "text-muted-foreground",
};

/** Dot maks 3 per hari; bila item lebih, sisanya diringkas jadi "+n". */
const MAX_DOTS = 3;

/** Prioritas dot: deadline paling penting ditampilkan lebih dulu. */
function typeRank(type: DashboardItem["type"]): number {
  if (type === "deadline") return 0;
  if (type === "event") return 1;
  if (type === "reminder") return 2;
  return 3;
}

export function CalendarWidget() {
  const snapshot = useDashboardSnapshot();
  const items = snapshot.data?.items ?? [];
  const today = localDayPoint();

  // Bulan yang dilihat + hari terpilih — state lokal, default bulan berjalan
  // dan hari ini (panel selalu terisi sejak render pertama).
  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month); // 1-12
  const [selected, setSelected] = useState<DayPoint>(today);
  const [filter, setFilter] = useState<TypeFilter>("Semua");

  const shiftMonth = (delta: number) => {
    // Date native menormalkan bulan 0/13 → tahun sebelum/sesudahnya.
    const shifted = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(shifted.getFullYear());
    setViewMonth(shifted.getMonth() + 1);
  };

  const typeMatchesFilter = (type: DashboardItem["type"]): boolean => {
    if (filter === "Semua") return true;
    if (filter === "Deadline") return type === "deadline";
    if (filter === "Event") return type === "event";
    return type === "reminder";
  };

  /** Item (sudah terfilter tipe) yang jatuh pada satu tanggal, deadline dulu. */
  const itemsOnDay = (point: DayPoint): DashboardItem[] =>
    items
      .filter((item) => {
        if (!typeMatchesFilter(item.type)) return false;
        switch (item.type) {
          case "event":
            return isSameDay(item.start, point);
          case "deadline":
            return isSameDay(item.date, point);
          case "reminder":
            // Recurring v1: yearly → month+day, monthly → day, weekly → weekday,
            // daily → semua hari; non-recurring → tanggal persis (lihat today.ts).
            return matchesToday(item, point);
          default:
            return false; // geo/metric/alert tidak punya tanggal kalender
        }
      })
      .sort((a, b) => typeRank(a.type) - typeRank(b.type));

  const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedItems = itemsOnDay(selected);

  return (
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {new Date(viewYear, viewMonth - 1, 1).toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Bulan sebelumnya"
            className="rounded px-1.5 text-sm leading-none text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Bulan berikutnya"
            className="rounded px-1.5 text-sm leading-none text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {TYPE_FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={cn(
              "rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
              filter === option
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 text-muted-foreground">
            {d}
          </span>
        ))}
        {cells.map((dayNumber, index) => {
          if (dayNumber === null) return <span key={`pad-${index}`} />;
          const point: DayPoint = { year: viewYear, month: viewMonth, day: dayNumber };
          const dayItems = itemsOnDay(point);
          const dots = dayItems.slice(0, MAX_DOTS);
          const extra = dayItems.length - dots.length;
          const isToday = isSameDay(point, today);
          const isSelected = isSameDay(point, selected);
          return (
            <button
              key={dayNumber}
              type="button"
              onClick={() => setSelected(point)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-md py-1 transition-colors hover:bg-foreground/5",
                isSelected ? "bg-foreground/10 text-foreground" : "text-muted-foreground",
                isToday && "font-semibold text-foreground",
              )}
            >
              <span>{dayNumber}</span>
              {/* Baris dot: max 3 dot berwarna per tipe + "+n" bila lebih. */}
              <span className="flex h-2 items-center justify-center gap-0.5">
                {dots.map((item) => (
                  <span
                    key={item.id}
                    className={cn("text-[7px] leading-none", DOT_TONE[item.type])}
                  >
                    ●
                  </span>
                ))}
                {extra > 0 && (
                  <span className="text-[8px] leading-none text-muted-foreground">+{extra}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel detail hari terpilih (default: hari ini). */}
      <div className="mt-3 border-t border-border pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {toDate(selected).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        {snapshot.isLoading ? (
          <p className="mt-2 text-xs text-muted-foreground">Memuat…</p>
        ) : selectedItems.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">Tidak ada item pada tanggal ini.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1">
            {selectedItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span className="line-clamp-1 text-sm text-foreground">{item.title}</span>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground">{item.type}</span>
                  <span className="rounded border border-border px-1 py-px font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    {item.source}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        {snapshot.isError && (
          <p className="mt-2 text-xs text-destructive">
            Gagal memuat data kalender — grid tampil tanpa item.
          </p>
        )}
      </div>
    </div>
  );
}
