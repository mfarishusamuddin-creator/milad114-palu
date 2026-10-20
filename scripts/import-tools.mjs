// Import 14 tool HTML standalone ke tabel `pages` (scope admin) di Supabase.
//
// Persyaratan:
//   - Sudah menjalankan SQL: supabase/fase-pages-tools.sql, fase-publication-and-metrics.sql,
//     dan fase-tool-data.sql (untuk tabel tool_data).
//   - Environment: SUPABASE_SERVICE_ROLE_KEY (service_role, hanya utk seed lokal),
//     dan VITE_SUPABASE_URL (diambil dari .env otomatis).
//
// Jalankan (PowerShell):
//   $env:SUPABASE_SERVICE_ROLE_KEY = "sb_secret_...."
//   node scripts/import-tools.mjs
//
// Idempotent: upsert per slug; dijalankan ulang aman.

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, basename, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");

const DEFAULT_TOOLS_DIR = resolve(ROOT, "..", "Husam Path Standalone");
const TOOLS_DIR = process.env.TOOLS_DIR || DEFAULT_TOOLS_DIR;

// ---------------------------------------------------------------------------
// .env sederhana (cukup untuk membaca VITE_SUPABASE_URL)
// ---------------------------------------------------------------------------
function loadDotEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return {};
  const out = {};
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

const dotenv = loadDotEnv();
const SUPABASE_URL = process.env.SUPABASE_URL || dotenv.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error("ERROR: VITE_SUPABASE_URL tidak ditemukan di .env / environment.");
  process.exit(1);
}
if (!SERVICE_ROLE_KEY) {
  console.error("ERROR: SUPABASE_SERVICE_ROLE_KEY belum di-set (service_role).");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------
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

async function collectHtmlFiles(dir) {
  const result = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await collectHtmlFiles(full)));
    } else if (entry.isFile() && extname(entry.name).toLowerCase() === ".html") {
      result.push(full);
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!existsSync(TOOLS_DIR)) {
    console.error("ERROR: Folder tool tidak ditemukan:", TOOLS_DIR);
    process.exit(1);
  }

  const files = await collectHtmlFiles(TOOLS_DIR);
  const htmlFiles = files.filter((f) => extname(f).toLowerCase() === ".html");

  console.log(`Menemukan ${htmlFiles.length} file HTML di:\n  ${TOOLS_DIR}\n`);

  // Slug unik (tambah suffix bila bentrok).
  const used = new Set();
  const rows = [];
  for (const file of htmlFiles.sort((a, b) => a.localeCompare(b))) {
    let slug = slugify(basename(file));
    if (used.has(slug)) {
      let i = 2;
      while (used.has(`${slug}-${i}`)) i += 1;
      slug = `${slug}-${i}`;
    }
    used.add(slug);

    const html_content = await readFile(file, "utf8");
    rows.push({
      slug,
      title: humanize(basename(file)),
      html_content,
      scope: "admin",
      is_published: true,
    });
  }

  let ok = 0;
  let fail = 0;
  for (let i = 0; i < rows.length; i += 1) {
    const r = rows[i];
    const { error } = await supabase.from("pages").upsert(
      {
        slug: r.slug,
        title: r.title,
        html_content: r.html_content,
        scope: r.scope,
        is_published: r.is_published,
        sort_order: i,
        is_home: false,
      },
      { onConflict: "slug" },
    );

    if (error) {
      fail += 1;
      console.error(`  [GAGAL] ${r.slug}: ${error.message}`);
    } else {
      ok += 1;
      console.log(`  [OK]   ${r.slug}  <-  ${r.title}`);
    }
  }

  console.log(`\nSelesai: ${ok} berhasil, ${fail} gagal (total ${rows.length}).`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("ERROR fatal:", err);
  process.exit(1);
});
