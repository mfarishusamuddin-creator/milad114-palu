import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://muhammadiyah.or.id/wp-json/wp/v2/posts";
const OUT = path.join(process.cwd(), "src", "data", "kabar-fallback.json");
const ALLOWED_LINK_HOST = /(^|\.)muhammadiyah\.or\.id$/i;
const MAX_TITLE = 200;
const MAX_EXCERPT = 180;
const MAX_ITEMS = 12;

const ENTITIES = {
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

function fromCodePoint(value, fallbackText) {
  if (!Number.isInteger(value) || value < 0 || value > 0x10ffff) {
    return fallbackText;
  }
  try {
    return String.fromCodePoint(value);
  } catch {
    return fallbackText;
  }
}

function decodeEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (match, hex) =>
      fromCodePoint(parseInt(hex, 16), match)
    )
    .replace(/&#(\d+);/g, (match, dec) =>
      fromCodePoint(Number(dec), match)
    )
    .replace(/&[a-z]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity);
}

function plainText(value, maxLength) {
  if (typeof value !== "string") return "";
  return decodeEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function safeLink(value) {
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

function normalizeDate(value) {
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

function toItem(post) {
  const link = safeLink(post.link);
  const date = normalizeDate(post.date);
  const title = plainText(post.title?.rendered, MAX_TITLE);
  if (!link || !date || title.length === 0) return null;

  return {
    id:
      typeof post.id === "number" && Number.isSafeInteger(post.id)
        ? post.id
        : 0,
    date,
    link,
    title,
    excerpt: plainText(post.excerpt?.rendered, MAX_EXCERPT),
  };
}

async function fetchPosts(query = "") {
  const url = new URL(BASE);
  url.searchParams.set("per_page", String(MAX_ITEMS));
  url.searchParams.set("_fields", "id,date,link,title,excerpt");
  if (query) url.searchParams.set("search", query);

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "milad114-palu/1.0 (+https://milad114-palu.vercel.app)",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Kabar HTTP ${response.status}`);

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error("Kabar bukan JSON");
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) throw new Error("Kabar bukan larik");
  return payload;
}

const [latest, milad] = await Promise.all([
  fetchPosts(),
  fetchPosts("Tanwir Milad"),
]);

const map = new Map();
for (const raw of [...latest, ...milad]) {
  const item = toItem(raw);
  if (item && !map.has(item.id)) map.set(item.id, item);
}

const items = [...map.values()].slice(0, MAX_ITEMS);
if (items.length === 0) {
  throw new Error("Tidak ada item kabar valid dari API");
}

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(items, null, 2), "utf8");
console.log(`Kabar fallback OK: ${items.length} item -> ${OUT}`);
