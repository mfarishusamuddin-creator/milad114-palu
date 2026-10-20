import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://muhammadiyah.or.id/wp-json/wp/v2/posts";
const OUT = path.join(process.cwd(), "src", "data", "kabar-fallback.json");

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

function decodeEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&[a-z]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity);
}

function stripHtml(value) {
  return decodeEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDate(value) {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value)) {
    return `${value}+07:00`;
  }
  return value;
}

async function fetchPosts(query = "") {
  const url = new URL(BASE);
  url.searchParams.set("per_page", "8");
  url.searchParams.set("_fields", "id,date,link,title,excerpt");
  if (query) url.searchParams.set("search", query);

  const response = await fetch(url, {
    headers: {
      "user-agent": "milad114-palu/1.0 (+https://milad114-palu.vercel.app)",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Kabar HTTP ${response.status}`);
  return response.json();
}

const [latest, milad] = await Promise.all([
  fetchPosts(),
  fetchPosts("Tanwir Milad"),
]);

const map = new Map();
for (const item of [...latest, ...milad]) {
  if (!map.has(item.id)) {
    map.set(item.id, {
      id: item.id,
      date: normalizeDate(item.date),
      link: item.link,
      title: stripHtml(item.title?.rendered ?? ""),
      excerpt: stripHtml(item.excerpt?.rendered ?? "").slice(0, 180),
    });
  }
}

const items = [...map.values()].slice(0, 12);
await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(items, null, 2), "utf8");
console.log(`Kabar fallback OK: ${items.length} item -> ${OUT}`);
