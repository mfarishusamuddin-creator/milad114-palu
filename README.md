# Milad 114 — Satu Pohon, Tiga Arah

Website interaktif Tanwir dan Milad ke-114 Muhammadiyah.

- **Tema:** Bersama Satukan Bangsa
- **Tempat:** Palu, Sulawesi Tengah
- **Tanggal:** 19–21 November 2026 M | 10–12 Jumadilakhir 1448 H
- **URL:** https://milad114-palu.vercel.app
- **Gerbang bahasa:** `/` (Indonesia), `/en` (English), `/ar` (العربية)

## Satu index, tiga bahasa

Seluruh konten berada dalam satu halaman panjang per bahasa:

| Anchor | Isi |
|---|---|
| `#jelajah` | Indeks Akar, Batang, Kanopi |
| `#sejarah` | Enam bab sejarah 1868–2027 dengan Scrollama |
| `#layanan` | Kalender KHGT dan Kabar |
| `#peta` | Peta dunia 29 PCIM |
| `#kabar` | Kabar resmi Muhammadiyah |

Rute lama `/sejarah` dan `/layanan` sudah dihapus. QR fisik sekarang menjadi gerbang bahasa: `/`, `/en`, `/ar`.

## Fitur

- Tema terang/gelap dengan penyimpanan `localStorage` dan preferensi sistem.
- Bahasa Indonesia, Inggris, dan Arab dengan layout RTL.
- Scroll reveal untuk section dan kartu.
- Motion logo intro (horizontal/vertical, terang/gelap) — tampil setiap refresh; reduced motion/saveData otomatis dilewati.
- Peta dunia Natural Earth yang menyorot 29 Pimpinan Cabang Istimewa.
- Kalender KHGT dengan konverter Masehi–Hijriah.
- Kabar live dari kanal resmi Muhammadiyah, cache satu jam, fallback snapshot.
- Ilustrasi pohon space colonization yang dihasilkan dari skrip.

## Stack

- Next.js 16 App Router + TypeScript + Cache Components
- Tailwind CSS v4
- Scrollama (MIT)
- world-atlas + topojson-client + d3-geo untuk peta
- Font lokal: El Messiri dan Familjen Grotesk (OFL)
- Tanpa database, login, atau form publik

## Perintah

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

Sinkronisasi data:

```bash
npm run sync:kabar
npm run sync:khgt
```

Aset dan pohon:

```bash
npm run prepare:assets
npm run generate:tree
```

## Struktur

```text
src/app/                 layout, /, /en, /ar, sitemap, robots
src/components/          pages, layout, home, history, services, map, theme, shared
src/i18n/                types, id, en, ar, getDictionary
src/data/                site, milestones, calendar, pcim, tree, khgt, kabar
src/lib/                 kabar, khgt, date, metadata, cn
scripts/                 sync-kabar, sync-khgt, generate-tree, prepare-assets
public/                  logo, pattern, og, licenses
```

## Panduan edit

Panduan lengkap untuk mengedit teks, terjemahan, gambar, layout, tema, bahasa, peta, animasi, dan deploy ada di **[PANDUAN-EDIT.md](./PANDUAN-EDIT.md)**.

Mulai dari bagian:

- `3. Mengedit teks` untuk semua teks ID/EN/AR.
- `4. Mengedit gambar` untuk logo, pattern, OG, favicon, foto, dan video.
- `5. Mengedit layout` untuk urutan section, grid, warna, dan komponen.
- `7. Bahasa dan RTL` untuk menambah atau mengubah bahasa.
- `8. Peta dunia` untuk 29 PCIM.
- `11. Rute, QR, dan metadata` untuk URL gerbang bahasa.

## Sumber data

- **Kabar:** WP REST API `https://muhammadiyah.or.id/wp-json/wp/v2/posts`, cache satu jam, fallback snapshot.
- **Kalender:** snapshot KHGT `https://khgt.muhammadiyah.or.id/`, disinkronkan dengan `npm run sync:khgt`.
- **Sejarah:** halaman resmi `muhammadiyah.or.id` dan artikel resmi Milad 114.
- **Peta:** Natural Earth melalui `world-atlas`; daftar 29 PCIM dari data yang diberikan.
- **Logo/identitas:** aset resmi Tanwir dan Milad ke-114, digunakan apa adanya.

## Referensi dan lisensi

- **Scrollama** (`russellsamora/scrollama`, MIT) — scrollytelling di bagian sejarah. Lisensi: `public/licenses/Scrollama-MIT.txt`.
- **Space colonization** (Runions dkk., 2007; referensi `jasonwebb/2d-space-colonization-experiments`) — algoritma diimplementasikan ulang di `scripts/generate-tree.mjs`; tidak menyalin kode repo.
- **world-atlas** (ISC) dan **Natural Earth** (public domain) — geometri peta dunia.
- **GSAP** dan **folio-2019** tidak dipakai; animasi berat/WebGL tidak sepadan dengan target performa mobile.
- **Peta 38 provinsi Indonesia** tidak dipakai karena fokus peta adalah persebaran global PCIM.
- **Template identitas resmi** dari folder `drive-download-...` dipakai untuk plate logo, pattern strip, tipografi, dan proporsi layout.

## Uji

- `TEST-LOG.md` — hasil build, rute, viewport, bahasa, tema, peta, dan uji fungsional.
- `CONTENT-VERIFIED.md` — register fakta dan sumber.
- `SUBMISSION.md` — studi kasus, skrip video, payload QR, dan checklist submit.
- `TRANSLATION-REVIEW.md` — daftar teks Arab yang perlu diverifikasi penutur asli.
- `HANDOFF-AI.md` — brief per halaman/fitur untuk AI lain, termasuk daftar aset.
- `PROMPT-ANIMASI-POHON.md` — prompt lengkap animasi bibit→pohon berbuah.

## Deploy

1. Commit dan push ke GitHub.
2. Import repo di Vercel.
3. Nama project: `milad114-palu`.
4. Framework: Next.js; build: `npm run build`.
5. Setelah deploy, pastikan `/`, `/en`, `/ar` merespons 200 sebelum QR diserahkan.

## Kredit

Karya independen untuk lomba website. Logo dan identitas visual milik Pimpinan Pusat Muhammadiyah. Font El Messiri dan Familjen Grotesk berlisensi SIL Open Font License. Data kalender milik KHGT; data kabar milik Muhammadiyah.or.id.
