import { cacheLife, cacheTag } from "next/cache";
import fallback from "@/data/kabar-fallback.json";

export type KabarItem = {
  id: number;
  date: string;
  link: string;
  title: string;
  excerpt: string;
};

const WP_ENDPOINT = "https://muhammadiyah.or.id/wp-json/wp/v2/posts";
const FALLBACK_ITEMS = fallback as KabarItem[];

/* Data dari API WordPress eksternal diperlakukan sebagai input tak tepercaya:
   tautan hanya boleh HTTPS ke domain Muhammadiyah, teks dibatasi panjangnya,
   dan entitas HTML tidak boleh membuat proses gagal. */
const ALLOWED_LINK_HOST = /(^|\.)muhammadiyah\.or\.id$/i;
const MAX_TITLE = 200;
const MAX_EXCERPT = 180;
const MAX_ITEMS = 8;
const MAX_RESPONSE_BYTES = 512 * 1024;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#039;": "'",
  "&#39;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&nbsp;": " ",
  "&hellip;": "…",
  "&mdash;": "—",
  "&ndash;": "–",
  "&lsquo;": "‘",
  "&rsquo;": "’",
  "&ldquo;": "“",
  "&rdquo;": "”",
};

/* String.fromCodePoint melempar RangeError untuk nilai di luar Unicode;
   pertahankan entitas aslinya alih-alih menggagalkan render. */
function fromCodePoint(value: number, fallbackText: string): string {
  if (!Number.isInteger(value) || value < 0 || value > 0x10ffff) {
    return fallbackText;
  }
  try {
    return String.fromCodePoint(value);
  } catch {
    return fallbackText;
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (match, hex: string) =>
      fromCodePoint(parseInt(hex, 16), match)
    )
    .replace(/&#(\d+);/g, (match, dec: string) =>
      fromCodePoint(Number(dec), match)
    )
    .replace(/&[a-z]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity);
}

function plainText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return decodeEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function safeLink(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (!ALLOWED_LINK_HOST.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const iso = value.trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(iso)) {
    return `${iso}+07:00`;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(iso)) {
    return iso;
  }
  return null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function rendered(value: unknown): unknown {
  return asRecord(value).rendered;
}

function toItem(value: unknown): KabarItem | null {
  const post = asRecord(value);
  const link = safeLink(post.link);
  const date = normalizeDate(post.date);
  const title = plainText(rendered(post.title), MAX_TITLE);

  /* Item tanpa tautan aman, tanggal valid, atau judul dibuang. */
  if (!link || !date || title.length === 0) return null;

  return {
    id:
      typeof post.id === "number" && Number.isSafeInteger(post.id)
        ? post.id
        : 0,
    date,
    link,
    title,
    excerpt: plainText(rendered(post.excerpt), MAX_EXCERPT),
  };
}

function fromFallback(search?: string): KabarItem[] {
  if (!search) return FALLBACK_ITEMS.slice(0, MAX_ITEMS);
  const filtered = FALLBACK_ITEMS.filter((item) =>
    /tanwir|milad/i.test(item.title)
  );
  return filtered.length > 0
    ? filtered.slice(0, MAX_ITEMS)
    : FALLBACK_ITEMS.slice(0, MAX_ITEMS);
}

export async function getKabar(search?: string): Promise<KabarItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("kabar-muhammadiyah");

  const url = new URL(WP_ENDPOINT);
  url.searchParams.set("per_page", String(MAX_ITEMS));
  url.searchParams.set("_fields", "id,date,link,title,excerpt");
  if (search) url.searchParams.set("search", search);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent":
          "milad114-palu/1.0 (+https://milad114-palu.vercel.app)",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      throw new Error(`Kabar HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      throw new Error("Kabar bukan JSON");
    }

    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) {
      throw new Error("Kabar terlalu besar");
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error("Kabar bukan larik");
    }

    const items = payload
      .map((post: unknown) => toItem(post))
      .filter((item): item is KabarItem => item !== null)
      .slice(0, MAX_ITEMS);

    if (items.length === 0) return fromFallback(search);

    if (search) {
      const filtered = items.filter((item) =>
        /tanwir|milad/i.test(item.title)
      );
      if (filtered.length > 0) return filtered;
    }

    return items;
  } catch {
    return fromFallback(search);
  }
}
