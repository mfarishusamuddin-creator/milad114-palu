import { describe, expect, it } from "vitest";
import { parseDateOnly } from "./dateOnly";

describe("parseDateOnly", () => {
  it("menerima date-only YYYY-MM-DD", () => {
    expect(parseDateOnly("2026-09-10")).toEqual({ year: 2026, month: 9, day: 10 });
    expect(parseDateOnly("2026-01-01")).toEqual({ year: 2026, month: 1, day: 1 });
  });

  it("menerima ISO datetime — bagian tanggal diambil APA ADANYA, tanpa konversi zona", () => {
    // "23:30Z" bila dikonversi ke WIB (+7) akan jadi 11 September — TIDAK boleh.
    expect(parseDateOnly("2026-09-10T23:30:00Z")).toEqual({ year: 2026, month: 9, day: 10 });
    expect(parseDateOnly("2026-09-10T23:30:00+07:00")).toEqual({ year: 2026, month: 9, day: 10 });
    expect(parseDateOnly("2026-09-10T00:30:00-05:00")).toEqual({ year: 2026, month: 9, day: 10 });
    expect(parseDateOnly("2026-09-10T12:00:00")).toEqual({ year: 2026, month: 9, day: 10 });
  });

  it("menerima epoch-ms — diinterpretasikan UTC agar deterministik lintas perangkat", () => {
    expect(parseDateOnly(Date.UTC(2026, 8, 10, 12, 0, 0))).toEqual({ year: 2026, month: 9, day: 10 });
    expect(parseDateOnly(Date.UTC(2026, 8, 10, 23, 59, 59))).toEqual({ year: 2026, month: 9, day: 10 });
    expect(parseDateOnly(0)).toEqual({ year: 1970, month: 1, day: 1 });
  });

  it("menolak tanggal mustahil", () => {
    expect(parseDateOnly("2026-13-01")).toBeNull(); // bulan > 12
    expect(parseDateOnly("2026-00-10")).toBeNull(); // bulan < 1
    expect(parseDateOnly("2026-02-30")).toBeNull(); // 30 Februari tidak ada
    expect(parseDateOnly("2026-04-31")).toBeNull(); // April hanya 30 hari
    expect(parseDateOnly("2026-13-01T00:00:00Z")).toBeNull();
  });

  it("menolak string bukan tanggal", () => {
    expect(parseDateOnly("abc")).toBeNull();
    expect(parseDateOnly("")).toBeNull();
    expect(parseDateOnly("   ")).toBeNull();
    expect(parseDateOnly("10-09-2026")).toBeNull(); // format DD-MM-YYYY bukan kontrak
    expect(parseDateOnly("10/09/2026")).toBeNull();
  });

  it("menolak tipe lain secara fail-closed", () => {
    expect(parseDateOnly(null)).toBeNull();
    expect(parseDateOnly(undefined)).toBeNull();
    expect(parseDateOnly(NaN)).toBeNull();
    expect(parseDateOnly(Infinity)).toBeNull();
    expect(parseDateOnly(true)).toBeNull();
    expect(parseDateOnly({ year: 2026, month: 9, day: 10 })).toBeNull();
    expect(parseDateOnly([2026, 9, 10])).toBeNull();
  });

  it("pure: hasil tidak bergantung zona waktu lokal perangkat (epoch pakai UTC)", () => {
    // 2026-09-10T23:30Z — di zona mana pun, hasilnya tetap 10 September.
    const epoch = Date.UTC(2026, 8, 10, 23, 30);
    expect(parseDateOnly(epoch)).toEqual({ year: 2026, month: 9, day: 10 });
    expect(parseDateOnly(epoch)).toEqual(parseDateOnly(epoch));
  });
});
