// Push satu file HTML tool standalone ke tabel `pages` lewat file SQL,
// untuk dijalankan dengan Supabase CLI (tanpa service_role key):
//
//   node scripts/push-tool-html.mjs <nama-file.html> [slug]
//   supabase db query --linked -f <path-output-yang-dicetak>
//
// Contoh:
//   node scripts/push-tool-html.mjs dosen-ledger.html
//   supabase db query --linked -f C:\Users\...\Temp\...\dosen-ledger.push.sql
//
// Prasyarat: sudah `supabase login` di terminal ini (project sudah linked).
// Aman dijalankan berulang (UPDATE per slug; baris dibuat bila belum ada).

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, basename, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const DEFAULT_TOOLS_DIR = resolve(ROOT, "..", "Husam Path Standalone");

const file = process.argv[2];
if (!file) {
  console.error("Pakai: node scripts/push-tool-html.mjs <nama-file.html> [slug]");
  process.exit(1);
}

let srcPath = resolve(file);
if (!existsSync(srcPath)) srcPath = join(DEFAULT_TOOLS_DIR, file);
if (!existsSync(srcPath)) {
  console.error("File tidak ditemukan:", srcPath);
  process.exit(1);
}

function slugify(name) {
  return name
    .replace(/\.html$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function humanize(name) {
  return name
    .replace(/\.html$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const html = readFileSync(srcPath, "utf8");
const slug = process.argv[3] || slugify(basename(srcPath));
const title = humanize(basename(srcPath));

// Dollar-quote dengan tag yang tidak mungkin muncul di konten HTML.
const TAG = "husam_html_push";
if (html.includes(`$${TAG}$`)) {
  console.error("Konten HTML memuat tag dollar-quote; pilih tag lain di script.");
  process.exit(1);
}

const esc = (s) => s.replace(/'/g, "''");

// INSERT ... ON CONFLICT: satu statement, tanpa blok `do $$` — tag `$$` di
// dalam konten HTML (mis. helper `const $$=`) tidak lagi merusak parsing.
const sql = [
  `-- push-tool-html: ${basename(srcPath)} -> pages.slug='${slug}'`,
  `insert into public.pages (slug, title, html_content, scope, is_published, sort_order, is_home)`,
  `values ('${esc(slug)}', '${esc(title)}', $${TAG}$${html}$${TAG}$, 'admin', true, 999, false)`,
  `on conflict (slug) do update set`,
  `  html_content = excluded.html_content,`,
  `  title = excluded.title,`,
  `  scope = excluded.scope,`,
  `  is_published = true,`,
  `  updated_at = now();`,
  `select slug, title, length(html_content) as html_len, updated_at from public.pages where slug = '${esc(slug)}';`,
  "",
].join("\n");

const outDir = join(tmpdir(), "husam-push");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `${slug}.push.sql`);
writeFileSync(outPath, sql, "utf8");

console.log(`SQL siap: ${outPath}`);
console.log(`Jalankan:  supabase db query --linked -f "${outPath}"`);
