import { cacheLife, cacheTag } from "next/cache";
import fallback from "@/data/kabar-fallback.json";

export type KabarItem = {
  id: number;
  date: string;
  link: string;
  title: string;
  excerpt: string;
};

type WpPost = {
  id: number;
  date: string;
  link: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
};

const WP_ENDPOINT = "https://muhammadiyah.or.id/wp-json/wp/v2/posts";
const FALLBACK_ITEMS = fallback as KabarItem[];

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

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      String.fromCodePoint(Number(dec))
    )
    .replace(/&[a-z]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity);
}

function stripHtml(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value)) {
    return `${value}+07:00`;
  }
  return value;
}

function toItem(post: WpPost): KabarItem {
  return {
    id: post.id,
    date: normalizeDate(post.date),
    link: post.link,
    title: stripHtml(post.title?.rendered ?? ""),
    excerpt: stripHtml(post.excerpt?.rendered ?? "").slice(0, 180),
  };
}

function fromFallback(search?: string): KabarItem[] {
  if (!search) return FALLBACK_ITEMS.slice(0, 8);
  const filtered = FALLBACK_ITEMS.filter((item) =>
    /tanwir|milad/i.test(item.title)
  );
  return filtered.length > 0 ? filtered : FALLBACK_ITEMS.slice(0, 8);
}

export async function getKabar(search?: string): Promise<KabarItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("kabar-muhammadiyah");

  const url = new URL(WP_ENDPOINT);
  url.searchParams.set("per_page", "8");
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

    const posts = (await response.json()) as WpPost[];
    const items = posts
      .map(toItem)
      .filter((item) => item.title.length > 0 && item.link.length > 0);

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
