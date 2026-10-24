# Karya untuk Milad 114 PCIM Libya

Website interaktif untuk Tanwir dan Milad ke-114 Muhammadiyah.

- **Tema:** Bersama Satukan Bangsa
- **Tempat:** Palu, Sulawesi Tengah
- **Tanggal:** 19–21 November 2026 M | 10–12 Jumadilakhir 1448 H
- **URL:** https:/miladmu.husam.it.com
- **Gerbang bahasa:** `/` (Indonesia), `/en` (English), `/ar` (العربية)

## Satu index, tiga bahasa

| Anchor | Isi |
|---|---|
| `#tentang` | Makna logo: kelor, 114, dan pencerahan |
| `#agenda` | Tanwir Palu, Milad historis, Muktamar Medan |
| `#peta` | Peta dunia 29 PCIM |
| `#sejarah` | Dua jalur (Muhammadiyah & KH Ahmad Dahlan) + tabel kepemimpinan dan AUM |
| `#layanan` | Kalender KHGT dan Kabar |
| `#kabar` | Kabar resmi Muhammadiyah |

 Rute `/tentang`, `/en/tentang`, dan `/ar/tentang` adalah halaman Tentang situs: semua sumber, lisensi, dan hak cipta terpusat di sini.

## Fitur

- Tema terang/gelap dengan penyimpanan `localStorage` dan preferensi sistem.
- Bahasa Indonesia, Inggris, dan Arab dengan layout RTL.
- Animated content (GSAP/ScrollTrigger), sekali per viewport, dari bawah; reduced motion langsung menampilkan konten.
- Motion logo intro (horizontal/vertical, terang/gelap) — tampil setiap refresh; reduced motion/saveData otomatis dilewati.
- Peta dunia Natural Earth yang menyorot 29 Pimpinan Cabang Istimewa: dot interaktif dengan label nama negara (hover/fokus/tap), Indonesia ditandai sebagai markas Pimpinan Pusat, tanpa nama kota.
- CountUp (ReactBits): angka 114 di stempel hero dan 29 di section peta dihidupkan saat masuk viewport.
- Header CardNav (ReactBits, adaptasi): logo + nama situs satu baris, toggle tema, menu kartu tiga jalur, CTA, dan pemilih bahasa di dalam panel; tautan “Tentang” di ujung menu dan footer.
- Halaman Tentang per bahasa (`/tentang`, `/en/tentang`, `/ar/tentang`): sumber informasi, aset & lisensi, catatan data, dan hak cipta — satu-satunya tempat daftar sumber.
- Kalender KHGT dengan konverter Masehi–Hijriah.
- Kabar live dari kanal resmi Muhammadiyah, cache satu jam, fallback snapshot.
- Sejarah dua jalur dengan timeline Aceternity (desktop) dan accordion (mobile).

## Stack

- Next.js 16 App Router + TypeScript + Cache Components
- Tailwind CSS v4
- GSAP (ScrollTrigger) untuk animated content
- Motion untuk timeline sejarah (pola Aceternity Timeline)
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

Aset:

```bash
npm run prepare:assets
```

## Struktur

```text
src/app/                 layout, /, /en, /ar, sitemap, robots
src/components/          pages, layout, home, history, services, map, theme, shared, ui
src/i18n/                types, id, en, ar, getDictionary
src/data/                site, history, calendar, pcim, khgt, kabar
src/lib/                 kabar, khgt, date, metadata, cn
scripts/                 sync-kabar, sync-khgt, prepare-assets
public/                  logo, pattern, og, licenses
```

## Sumber data

- **Kabar:** WP REST API `https://muhammadiyah.or.id/wp-json/wp/v2/posts`, cache satu jam, fallback snapshot.
- **Kalender:** snapshot KHGT `https://khgt.muhammadiyah.or.id/`, disinkronkan dengan `npm run sync:khgt`.
- **Sejarah:** halaman resmi `muhammadiyah.or.id` dan artikel resmi Milad 114.
- **Peta:** Natural Earth melalui `world-atlas`; daftar 29 PCIM divalidasi terhadap halaman resmi Cabang Istimewa Muhammadiyah.
- **Logo/identitas:** aset resmi Tanwir dan Milad ke-114, digunakan apa adanya.

## Referensi dan lisensi

- **Timeline Aceternity** (pola komponen Timeline) — diadaptasi ulang di `src/components/ui/timeline.tsx` (tanpa gambar, palet proyek, progres scroll `motion`). Komponen demo asli tersimpan sebagai referensi di `src/Contoh Timeline.tsx`.
- **world-atlas** (ISC) dan **Natural Earth** (public domain) — geometri peta dunia.
- **GSAP** (Standard License "no charge") — AnimatedContent/ScrollTrigger untuk animated content sekali per viewport. **folio-2019** tidak dipakai; WebGL tidak sepadan dengan target performa mobile.
- **Motion** (MIT, paket `motion`) — useScroll/useTransform untuk progres garis timeline sejarah.

## Kredit

©️ 2026 Faris Husamuddin. Logo dan identitas visual milik Pimpinan Pusat Muhammadiyah. Font El Messiri dan Familjen Grotesk berlisensi SIL Open Font License. Data kalender milik KHGT; data kabar milik Muhammadiyah.or.id.
