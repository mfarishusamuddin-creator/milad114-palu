"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  findHijriForMasehi,
  findMasehiForHijri,
  formatFetchedAt,
  formatMasehi,
  toIsoDate,
  toWesternDigits,
  type KhgtSnapshot,
} from "@/lib/khgt";

type Mode = "hijri" | "masehi";

const WEEKDAYS = ["Ahd", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MILESTONE_DATES = new Set([
  "2026-11-13",
  "2026-11-14",
  "2026-11-15",
  "2026-11-18",
]);

export function HijriCalendar({ data }: { data: KhgtSnapshot }) {
  const initialHijri = Math.max(
    0,
    data.hijri.findIndex(
      (month) => month.name === "Jumadilakhir" && month.year === 1448
    )
  );
  const initialMasehi = Math.max(
    0,
    data.masehi.findIndex(
      (month) => month.name === "November" && month.year === 2026
    )
  );

  const [mode, setMode] = useState<Mode>("hijri");
  const [hijriIndex, setHijriIndex] = useState(initialHijri);
  const [masehiIndex, setMasehiIndex] = useState(initialMasehi);

  const [masehiInput, setMasehiInput] = useState("2026-11-13");
  const [hijriMonth, setHijriMonth] = useState("Jumadilakhir");
  const [hijriDay, setHijriDay] = useState("4");
  const [hijriYear, setHijriYear] = useState("1448");
  const [converter, setConverter] = useState<{
    title: string;
    detail: string;
  } | null>(null);

  const months = mode === "hijri" ? data.hijri : data.masehi;
  const activeIndex = mode === "hijri" ? hijriIndex : masehiIndex;
  const month = months[activeIndex];
  const offset = month?.start_day_offset ?? 0;
  const years = Array.from(new Set(data.hijri.map((item) => item.year))).sort();

  function setActiveIndex(index: number) {
    if (mode === "hijri") setHijriIndex(index);
    else setMasehiIndex(index);
  }

  function convertMasehi() {
    if (!masehiInput) return;
    const result = findHijriForMasehi(masehiInput);
    setConverter(
      result
        ? {
            title: formatMasehi(masehiInput),
            detail: `${result.hijri}${result.pasaran ? ` · ${result.pasaran}` : ""}`,
          }
        : {
            title: formatMasehi(masehiInput),
            detail: "Tanggal tidak ditemukan dalam snapshot KHGT 2026.",
          }
    );
  }

  function convertHijri() {
    const day = Number(hijriDay);
    const year = Number(hijriYear);
    if (!Number.isFinite(day) || !Number.isFinite(year)) return;
    const result = findMasehiForHijri(hijriMonth, day, year);
    setConverter(
      result
        ? {
            title: `${day} ${hijriMonth} ${year} H`,
            detail: `${formatMasehi(result.masehi)}${result.pasaran ? ` · ${result.pasaran}` : ""}`,
          }
        : {
            title: `${day} ${hijriMonth} ${year} H`,
            detail: "Tanggal tidak ditemukan dalam snapshot KHGT.",
          }
    );
  }

  if (!month) {
    return (
      <div className="rounded-2xl border border-line bg-bg-soft p-6 text-sm text-ink-soft">
        Data kalender belum tersedia.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_16px_44px_rgba(28,70,158,0.08)]">
      <div className="flex flex-col gap-4 border-b border-line bg-bg-soft/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="inline-flex rounded-full border border-line bg-white p-1">
          <button
            type="button"
            onClick={() => setMode("hijri")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
              mode === "hijri"
                ? "bg-navy text-white"
                : "text-ink-soft hover:text-navy"
            )}
            aria-pressed={mode === "hijri"}
          >
            Hijriah KHGT
          </button>
          <button
            type="button"
            onClick={() => setMode("masehi")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
              mode === "masehi"
                ? "bg-navy text-white"
                : "text-ink-soft hover:text-navy"
            )}
            aria-pressed={mode === "masehi"}
          >
            Masehi
          </button>
        </div>

        <a
          href="https://khgt.muhammadiyah.or.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-teal-deep underline"
        >
          Lihat kalender lengkap di KHGT
        </a>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-navy disabled:opacity-30"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft />
          </button>

          <div className="text-center">
            <p className="font-serif text-xl font-bold text-ink sm:text-2xl">
              {month.name} {month.year}
              {mode === "hijri" ? " H" : ""}
            </p>
            <p className="mt-1 text-[0.7rem] font-semibold text-ink-soft">
              {mode === "hijri" ? month.masehi_range : month.hijri_range}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveIndex(Math.min(months.length - 1, activeIndex + 1))
            }
            disabled={activeIndex === months.length - 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-navy disabled:opacity-30"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="mt-5">
          <div>
            <div className="calendar-grid">
              {WEEKDAYS.map((day) => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}

              {Array.from({ length: offset }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="calendar-cell calendar-cell--empty"
                  aria-hidden="true"
                />
              ))}

              {month.days.map((day) => {
                const iso = toIsoDate(day.masehi);
                const isMilestone = MILESTONE_DATES.has(iso);
                const isEvent = Boolean(day.is_event);
                const dayNumber =
                  mode === "hijri"
                    ? toWesternDigits(day.hijri ?? "")
                    : day.masehi_day ?? String(Number(iso.slice(-2)));
                const sub =
                  mode === "hijri"
                    ? day.masehi_short ?? formatMasehi(day.masehi)
                    : day.hijriah_short ?? "";
                const hijriLabel =
                  mode === "hijri"
                    ? `${toWesternDigits(day.hijri ?? "")} ${month.name} ${month.year} H`
                    : day.hijriah ?? "";
                const label = `${formatMasehi(day.masehi)} · ${hijriLabel}`;

                return (
                  <div
                    key={`${day.masehi}-${dayNumber}`}
                    className={cn(
                      "calendar-cell",
                      isEvent && "calendar-cell--event",
                      isMilestone && "calendar-cell--milestone"
                    )}
                    aria-label={label}
                    title={day.tooltip || label}
                  >
                    {(isEvent || isMilestone) && (
                      <span className="calendar-event-dot" aria-hidden="true" />
                    )}
                    <span className="calendar-day-number">{dayNumber}</span>
                    <span className="calendar-day-sub">{sub}</span>
                    {isMilestone ? (
                      <span className="text-[0.52rem] font-bold uppercase tracking-[0.08em] text-gold-text">
                        Milad
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div>
            <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
              Hari istimewa
            </h3>
            {month.hariIstimewa?.length ? (
              <ul className="mt-3 space-y-2">
                {month.hariIstimewa.map((event) => (
                  <li
                    key={`${event.tanggal_masehi}-${event.keterangan}`}
                    className="rounded-xl border border-line bg-bg-soft/60 px-3 py-2.5"
                  >
                    <p className="text-[0.7rem] font-bold text-navy">
                      {event.tanggal_hijri} · {formatMasehi(event.tanggal_masehi)}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {event.keterangan}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-ink-soft">
                Tidak ada hari istimewa pada bulan ini.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
              Konverter tanggal
            </h3>

            <form
              className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                convertMasehi();
              }}
            >
              <label className="sr-only" htmlFor="masehi-input">
                Tanggal Masehi
              </label>
              <input
                id="masehi-input"
                type="date"
                min="2026-01-01"
                max="2026-12-31"
                value={masehiInput}
                onChange={(event) => setMasehiInput(event.target.value)}
                className="h-10 rounded-xl border border-line bg-white px-3 text-sm text-ink"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Cari Hijriah
              </button>
            </form>

            <form
              className="mt-2 grid gap-2 sm:grid-cols-[1fr_4.5rem_4.5rem_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                convertHijri();
              }}
            >
              <label className="sr-only" htmlFor="hijri-month">
                Bulan Hijriah
              </label>
              <select
                id="hijri-month"
                value={hijriMonth}
                onChange={(event) => setHijriMonth(event.target.value)}
                className="h-10 rounded-xl border border-line bg-white px-2 text-sm text-ink"
              >
                {data.hijri.map((item) => (
                  <option key={`${item.name}-${item.year}`} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor="hijri-day">
                Tanggal
              </label>
              <input
                id="hijri-day"
                type="number"
                min={1}
                max={30}
                value={hijriDay}
                onChange={(event) => setHijriDay(event.target.value)}
                className="h-10 rounded-xl border border-line bg-white px-2 text-sm text-ink"
              />

              <label className="sr-only" htmlFor="hijri-year">
                Tahun
              </label>
              <select
                id="hijri-year"
                value={hijriYear}
                onChange={(event) => setHijriYear(event.target.value)}
                className="h-10 rounded-xl border border-line bg-white px-2 text-sm text-ink"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <button type="submit" className="btn btn-gold btn-sm">
                Cari Masehi
              </button>
            </form>

            <div
              className="mt-3 min-h-[4.2rem] rounded-xl border border-line bg-bg-soft/60 px-3 py-3"
              aria-live="polite"
            >
              {converter ? (
                <>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-teal-deep">
                    {converter.title}
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">
                    {converter.detail}
                  </p>
                </>
              ) : (
                <p className="text-xs text-ink-soft">
                  Pilih tanggal untuk melihat padanan Masehi–Hijriah.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-5 text-[0.68rem] leading-relaxed text-ink-soft">
          Sumber:{" "}
          <a
            href={data.source}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal-deep underline"
          >
            khgt.muhammadiyah.or.id
          </a>{" "}
          · snapshot {formatFetchedAt(data.fetchedAt)}. Kalender ini bukan
          pengganti kalender resmi KHGT.
        </p>
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
