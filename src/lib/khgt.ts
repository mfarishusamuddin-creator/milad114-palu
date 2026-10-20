import snapshot from "@/data/khgt-2026.json";

export type KhgtDay = {
  masehi: string;
  masehi_short?: string;
  masehi_day?: string;
  hijri?: string;
  hijriah?: string;
  hijriah_short?: string;
  day?: string;
  pasaran?: string;
  tooltip?: string;
  is_event?: boolean;
};

export type KhgtSpecialDay = {
  tanggal_hijri: string;
  tanggal_masehi: string;
  keterangan: string;
};

export type KhgtMonth = {
  name: string;
  year: number;
  masehi_range?: string;
  hijri_range?: string;
  start_day_offset?: number;
  days: KhgtDay[];
  hariIstimewa?: KhgtSpecialDay[];
};

export type KhgtSnapshot = {
  source: string;
  fetchedAt: string;
  hijri: KhgtMonth[];
  masehi: KhgtMonth[];
};

export const khgtSnapshot = snapshot as KhgtSnapshot;

const ARABIC_DIGITS: Record<string, string> = {
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const MONTH_ABBR: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  Mei: 4,
  Jun: 5,
  Jul: 6,
  Agu: 7,
  Sep: 8,
  Okt: 9,
  Nov: 10,
  Des: 11,
};

export function toWesternDigits(value: string): string {
  return value
    .split("")
    .map((char) => ARABIC_DIGITS[char] ?? char)
    .join("");
}

export function toIsoDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [day, month, year] = value.split("-");
  const monthIndex = MONTH_ABBR[month];
  if (monthIndex === undefined) return value;
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function formatMasehi(
  value: string,
  months: string[] = MONTHS_ID
): string {
  const iso = toIsoDate(value);
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return value;
  return `${day} ${months[month - 1] ?? MONTHS_ID[month - 1]} ${year}`;
}

export function translateHijriString(
  value: string,
  months: Record<string, string>
): string {
  let translated = value;
  for (const [key, label] of Object.entries(months)) {
    translated = translated.replace(key, label);
  }
  return translated;
}

export function findHijriForMasehi(
  value: string
): { hijri: string; pasaran?: string } | null {
  const target = toIsoDate(value);
  for (const month of khgtSnapshot.masehi) {
    for (const day of month.days) {
      if (toIsoDate(day.masehi) === target && day.hijriah) {
        return { hijri: day.hijriah, pasaran: day.pasaran };
      }
    }
  }
  return null;
}

export function findMasehiForHijri(
  monthName: string,
  dayNumber: number,
  year: number
): { masehi: string; hijri: string; pasaran?: string } | null {
  for (const month of khgtSnapshot.hijri) {
    if (month.name !== monthName || month.year !== year) continue;
    for (const day of month.days) {
      const western = toWesternDigits(day.hijri ?? "");
      if (western === String(dayNumber)) {
        return {
          masehi: toIsoDate(day.masehi),
          hijri: `${dayNumber} ${month.name} ${month.year} H`,
          pasaran: day.pasaran,
        };
      }
    }
  }
  return null;
}

export function findMonthIndexForDate(
  months: KhgtMonth[],
  isoDate: string
): number {
  const target = toIsoDate(isoDate);
  return months.findIndex((month) =>
    month.days.some((day) => toIsoDate(day.masehi) === target)
  );
}

export function formatFetchedAt(value: string, locale = "id-ID"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}
