import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = "https://khgt.muhammadiyah.or.id/";
const OUT = path.join(process.cwd(), "src", "data", "khgt-2026.json");

function extractArray(html, name, marker) {
  const pattern = new RegExp(
    `const\\s+${name}\\s*=\\s*(\\[[\\s\\S]*?\\]);\\s*${marker}`,
    "m"
  );
  const match = html.match(pattern);
  if (!match) throw new Error(`Array ${name} tidak ditemukan di halaman KHGT`);
  const data = JSON.parse(match[1]);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`Array ${name} kosong atau bukan array`);
  }
  return data;
}

function validateMonths(months, label) {
  for (const month of months) {
    if (!month || typeof month.name !== "string") {
      throw new Error(`${label}: nama bulan tidak valid`);
    }
    if (!Array.isArray(month.days) || month.days.length === 0) {
      throw new Error(`${label}: hari bulan ${month.name} kosong`);
    }
  }
}

const response = await fetch(SOURCE, {
  headers: {
    "user-agent": "milad114-palu/1.0 (+https://milad114-palu.vercel.app)",
  },
  signal: AbortSignal.timeout(20000),
});

if (!response.ok) {
  throw new Error(`KHGT HTTP ${response.status}`);
}

const html = await response.text();
const hijri = extractArray(html, "calendarHijri", "let currentMonthIndexHijri");
const masehi = extractArray(html, "calendarMasehi", "let currentMonthIndexMasehi");

validateMonths(hijri, "calendarHijri");
validateMonths(masehi, "calendarMasehi");

const payload = {
  source: SOURCE,
  fetchedAt: new Date().toISOString(),
  hijri,
  masehi,
};

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(`${OUT}.tmp`, JSON.stringify(payload), "utf8");
await rename(`${OUT}.tmp`, OUT);

console.log(
  `KHGT OK: ${hijri.length} bulan hijriah, ${masehi.length} bulan masehi -> ${OUT}`
);
