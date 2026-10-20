import { describe, expect, it } from "vitest";
import type { DashboardReminder, DayPoint } from "../types";
import {
  addDays,
  compareDay,
  dayPointFromDate,
  formatDayShort,
  isSameDay,
  localDayPoint,
  matchesToday,
  toDate,
} from "./today";

// Helper — objek tanggal kanonik {year, month(1-12), day}.
const day = (year: number, month: number, d: number): DayPoint => ({ year, month, day: d });

// Reminder kanonik minimal — matchesToday hanya memandang `date` + `recurring`.
function reminder(date: DayPoint, recurring?: DashboardReminder["recurring"]): DashboardReminder {
  return {
    id: "s:c:r1:main",
    source: "s",
    collection: "c",
    title: "t",
    type: "reminder",
    date,
    recurring,
  };
}

describe("today", () => {
  it("localDayPoint mengikuti tanggal lokal perangkat saat ini", () => {
    // Dibaca diapit dua pembacaan jam: hanya persilangan tengah malam yang
    // bisa membuat hasil berbeda dari keduanya — tanpa perlu mock jam.
    const before = dayPointFromDate(new Date());
    const actual = localDayPoint();
    const after = dayPointFromDate(new Date());
    expect([before, after]).toContainEqual(actual);
  });

  it("dayPointFromDate/toDate round-trip komponen tanggal lokal", () => {
    const date = new Date(2026, 8, 10, 23, 30); // 10 Sep 2026 pukul 23:30 lokal
    expect(dayPointFromDate(date)).toEqual({ year: 2026, month: 9, day: 10 });
    expect(toDate({ year: 2026, month: 9, day: 10 })).toEqual(new Date(2026, 8, 10));
  });

  it("compareDay presisi -1|0|1 dengan prioritas year > month > day", () => {
    expect(compareDay(day(2026, 9, 10), day(2026, 9, 11))).toBe(-1);
    expect(compareDay(day(2026, 9, 11), day(2026, 9, 10))).toBe(1);
    expect(compareDay(day(2026, 9, 10), day(2026, 9, 10))).toBe(0);
    expect(compareDay(day(2025, 12, 31), day(2026, 1, 1))).toBe(-1); // year menang atas month/day
    expect(compareDay(day(2026, 10, 1), day(2026, 9, 30))).toBe(1); // month menang atas day
  });

  it("isSameDay hanya true bila ketiga komponen sama", () => {
    expect(isSameDay(day(2026, 9, 10), day(2026, 9, 10))).toBe(true);
    expect(isSameDay(day(2026, 9, 10), day(2027, 9, 10))).toBe(false);
    expect(isSameDay(day(2026, 9, 10), day(2026, 8, 10))).toBe(false);
    expect(isSameDay(day(2026, 9, 10), day(2026, 9, 11))).toBe(false);
  });

  it("addDays dalam bulan, lintas bulan, dan negatif", () => {
    expect(addDays(day(2026, 9, 10), 0)).toEqual(day(2026, 9, 10));
    expect(addDays(day(2026, 9, 10), 3)).toEqual(day(2026, 9, 13));
    expect(addDays(day(2026, 9, 30), 1)).toEqual(day(2026, 10, 1)); // 30 Sep → 1 Okt
    expect(addDays(day(2026, 9, 1), -1)).toEqual(day(2026, 8, 31)); // mundur lintas bulan
  });

  it("addDays lintas tahun dan Februari kabisat/non-kabisat", () => {
    expect(addDays(day(2026, 12, 31), 1)).toEqual(day(2027, 1, 1));
    expect(addDays(day(2027, 1, 1), -1)).toEqual(day(2026, 12, 31));
    expect(addDays(day(2028, 2, 28), 1)).toEqual(day(2028, 2, 29)); // 2028 kabisat
    expect(addDays(day(2026, 2, 28), 1)).toEqual(day(2026, 3, 1)); // 2026 bukan kabisat
    expect(addDays(day(2026, 9, 7), 7)).toEqual(day(2026, 9, 14)); // horizon 7 hari
  });

  it("matchesToday non-recurring: hanya tanggal persis", () => {
    const r = reminder(day(2026, 9, 10));
    expect(matchesToday(r, day(2026, 9, 10))).toBe(true);
    expect(matchesToday(r, day(2026, 9, 11))).toBe(false);
    expect(matchesToday(r, day(2027, 9, 10))).toBe(false); // tahun ikut dihitung
  });

  it("matchesToday yearly: month+day cocok, tahun diabaikan", () => {
    const r = reminder(day(2024, 9, 10), "yearly");
    expect(matchesToday(r, day(2026, 9, 10))).toBe(true);
    expect(matchesToday(r, day(2030, 9, 10))).toBe(true);
    expect(matchesToday(r, day(2026, 9, 11))).toBe(false);
    expect(matchesToday(r, day(2026, 10, 10))).toBe(false);
  });

  it("matchesToday monthly: day cocok, bulan diabaikan (tanpa clamping v1)", () => {
    const r = reminder(day(2026, 1, 15), "monthly");
    expect(matchesToday(r, day(2026, 9, 15))).toBe(true);
    expect(matchesToday(r, day(2027, 3, 15))).toBe(true);
    expect(matchesToday(r, day(2026, 9, 16))).toBe(false);
    // Kebijakan v1: anchor 31 tidak pernah jatuh di bulan yang lebih pendek.
    expect(matchesToday(reminder(day(2026, 1, 31), "monthly"), day(2026, 2, 28))).toBe(false);
  });

  it("matchesToday weekly: weekday tanggal anchor cocok", () => {
    // 7 Sep 2026 dan 14 Sep 2026 keduanya Senin; 8 Sep 2026 Selasa.
    const r = reminder(day(2026, 9, 7), "weekly");
    expect(matchesToday(r, day(2026, 9, 7))).toBe(true);
    expect(matchesToday(r, day(2026, 9, 14))).toBe(true);
    expect(matchesToday(r, day(2026, 9, 8))).toBe(false);
    // Deterministik lintas zona: weekday dihitung dari tengah malam lokal.
    expect(matchesToday(reminder(day(2026, 9, 11), "weekly"), day(2026, 9, 18))).toBe(true);
  });

  it("matchesToday daily: selalu true di hari mana pun", () => {
    const r = reminder(day(2020, 5, 5), "daily");
    expect(matchesToday(r, day(2026, 9, 10))).toBe(true);
    expect(matchesToday(r, day(2030, 1, 1))).toBe(true);
  });

  it("formatDayShort menghasilkan format pendek id-ID", () => {
    // 10 Sep 2026 adalah Kamis ("Kam").
    const label = formatDayShort(day(2026, 9, 10));
    expect(label).toMatch(/Kam/);
    expect(label).toMatch(/10/);
    expect(label).toMatch(/Sep/);
  });
});
