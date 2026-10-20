import { describe, expect, it } from "vitest";
import type { DataRecord } from "@/features/core/types";
import { dashboardItemSchema } from "../types";
import { socialAccountsAdapter } from "./socialAccounts.adapter";

function rec(recordId: string, data: Record<string, unknown>): DataRecord {
  return { id: `uuid-${recordId}`, record_id: recordId, data };
}

const SLUG = "husam-social-account-manager-pro";

describe("socialAccountsAdapter", () => {
  it("metadata kontrak: slug, collections, description", () => {
    expect(socialAccountsAdapter.slug).toBe(SLUG);
    expect(socialAccountsAdapter.collections).toEqual(["accounts"]);
    expect(socialAccountsAdapter.description.length).toBeGreaterThan(0);
  });

  it("(1) valid: auditDate → deadline 'audit', countryCode → geo", () => {
    const items = socialAccountsAdapter.toItems({
      accounts: [
        rec("acc-1", {
          name: "TikTok Shop",
          handle: "@tokoshop",
          platform: "tiktok",
          status: "scheduled",
          priority: "high",
          auditDate: "2026-09-10T23:30:00Z",
          countryCode: "id",
          country: "Indonesia",
          subs: [{ password: "bocor?" }], // di luar allowlist → wajib di-strip
        }),
      ],
    });

    for (const item of items) {
      expect(dashboardItemSchema.safeParse(item).success).toBe(true);
    }

    const deadline = items.find((i) => i.id === `${SLUG}:accounts:acc-1:audit`);
    expect(deadline).toMatchObject({
      type: "deadline",
      title: "Audit sosial: TikTok Shop",
      date: { year: 2026, month: 9, day: 10 }, // bagian tanggal ISO apa adanya, tanpa geser zona
      status: "scheduled",
      priority: "high",
    });

    // countryCode "id" diprioritaskan atas country "Indonesia".
    const geo = items.find((i) => i.id === `${SLUG}:accounts:acc-1:geo`);
    expect(geo).toMatchObject({
      type: "geo",
      lat: -2.5,
      lng: 118,
      label: "TikTok Shop",
      country: "id",
    });
    expect(items).toHaveLength(2);
  });

  it("(2) field hilang: fallback label berjenjang; tanpa auditDate/negara → item terkait skip", () => {
    const items = socialAccountsAdapter.toItems({
      accounts: [
        rec("a-handle", { handle: "@handleku", auditDate: "2026-10-01" }), // label = handle
        rec("a-user", { username: "user_bisnis", country: "Malaysia" }), // label = username
        rec("a-plat", { platform: "instagram" }), // label = platform, tanpa geo (tak ada negara)
        rec("a-anon", { status: "active" }), // label = "Akun sosial", tanpa deadline & geo
      ],
    });

    expect(items.find((i) => i.id === `${SLUG}:accounts:a-handle:audit`)).toMatchObject({
      title: "Audit sosial: @handleku",
    });
    expect(items.find((i) => i.id === `${SLUG}:accounts:a-user:geo`)).toMatchObject({
      label: "user_bisnis",
      country: "Malaysia",
    });
    expect(items.find((i) => i.id === `${SLUG}:accounts:a-plat:geo`)).toBeUndefined();
    // a-anon: tidak menghasilkan item sama sekali.
    expect(items.filter((i) => i.id.includes("a-anon"))).toEqual([]);
    // status tanpa auditDate TIDAK menciptakan deadline.
    expect(items.find((i) => i.type === "deadline" && i.id.includes("a-plat"))).toBeUndefined();
  });

  it("(3) malformed: status/priority non-string dibuang; countryCode non-string fallback country", () => {
    const items = socialAccountsAdapter.toItems({
      accounts: [
        rec("a-types", {
          name: "Akun Aneh",
          status: 123,
          priority: { level: 1 },
          auditDate: "2026-11-05",
          countryCode: 42,
          country: "Thailand",
        }),
      ],
    });
    const deadline = items.find((i) => i.id === `${SLUG}:accounts:a-types:audit`);
    expect(deadline).toMatchObject({ type: "deadline", title: "Audit sosial: Akun Aneh" });
    expect(deadline && "status" in deadline).toBe(false);
    expect(deadline && "priority" in deadline).toBe(false);
    // countryCode 42 dibuang → lookup memakai country "Thailand".
    expect(items.find((i) => i.id === `${SLUG}:accounts:a-types:geo`)).toMatchObject({
      lat: 15.87,
      lng: 100.99,
      country: "Thailand",
    });
  });

  it("(4) kosong: input {} maupun accounts kosong → []", () => {
    expect(socialAccountsAdapter.toItems({})).toEqual([]);
    expect(socialAccountsAdapter.toItems({ accounts: [] })).toEqual([]);
  });

  it("(5) tanggal invalid: format salah/mustahil → deadline skip, geo tetap jalan", () => {
    const items = socialAccountsAdapter.toItems({
      accounts: [
        rec("a-fmt", { name: "Format Salah", auditDate: "10/09/2026", country: "ID" }),
        rec("a-cal", { name: "Kalender Mustahil", auditDate: "2026-02-30" }),
        rec("a-mon", { name: "Bulan 13", auditDate: "2026-13-01" }),
        rec("a-null", { name: "Null", auditDate: null }),
      ],
    });
    expect(items.find((i) => i.type === "deadline")).toBeUndefined();
    // a-fmt tetap punya geo meski tanggalnya rusak.
    expect(items.find((i) => i.id === `${SLUG}:accounts:a-fmt:geo`)).toBeDefined();
    expect(items).toHaveLength(1);
  });

  it("(6) KEAMANAN: key asing sensitif tidak bocor ke output", () => {
    const items = socialAccountsAdapter.toItems({
      accounts: [
        rec("a-sec", {
          name: "Akun Rahasia",
          auditDate: "2026-09-10",
          country: "ID",
          password: "P4SS",
          aiKey: "SECRET",
          monetization: { token: "abc" },
          tags: ["P4SS"],
        }),
      ],
    });
    expect(items.length).toBeGreaterThan(0);
    const dumped = JSON.stringify(items);
    expect(dumped).not.toContain("P4SS");
    expect(dumped).not.toContain("SECRET");
    expect(dumped).not.toContain("password");
    expect(dumped).not.toContain("aiKey");
    expect(dumped).not.toContain("monetization");
    expect(dumped).not.toContain("tags");
  });

  it("(7) unexpected schema: data null/array/string/tipe acak → aman, tidak melempar", () => {
    const items = socialAccountsAdapter.toItems({
      accounts: [
        rec("bad-null", null as unknown as Record<string, unknown>),
        rec("bad-arr", [1, 2] as unknown as Record<string, unknown>),
        rec("bad-str", "bukan objek" as unknown as Record<string, unknown>),
        rec("bad-types", { name: 42, handle: true, auditDate: [], country: { x: 1 } }),
      ],
      unknownCollection: [rec("x", { a: 1 })],
    });
    expect(items).toEqual([]);
  });
});
