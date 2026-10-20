# Milad 114 — Satu Pohon, Tiga Pintu

Website interaktif Tanwir dan Milad ke-114 Muhammadiyah.

- **Tema:** Bersama Satukan Bangsa
- **Tempat:** Palu, Sulawesi Tengah
- **Tanggal:** 13–15 November 2026 M | 4–6 Jumadilakhir 1448 H
- **URL:** https://milad114-palu.vercel.app

## Tiga rute

| Rute | Nama | Isi |
|---|---|---|
| `/` | Kanopi | Microsite Milad, countdown, tiga pintu, pohon, agenda, kabar |
| `/sejarah` | Akar | Enam bab sejarah 1868–2027, timeline interaktif, sumber |
| `/layanan` | Batang | Kalender KHGT, kabar resmi, kuis Milad 114 |

## Stack

- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- Font lokal: El Messiri (display) dan Familjen Grotesk (body), lisensi OFL
- Cache Components (`cacheComponents: true`) dengan `use cache` + `cacheLife`
- Tanpa database, tanpa login, tanpa form publik

## Sumber data

- **Kabar:** WP REST API resmi `https://muhammadiyah.or.id/wp-json/wp/v2/posts`, cache satu jam, fallback snapshot.
- **Kalender:** snapshot data KHGT `https://khgt.muhammadiyah.or.id/`, disinkronkan saat build. Bukan library hijriah generik.
- **Sejarah:** halaman resmi `muhammadiyah.or.id` dan artikel resmi Milad 114.
- **Logo dan identitas:** aset resmi Tanwir dan Milad ke-114, digunakan apa adanya.

## Perintah

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

Sinkronisasi data resmi:

```bash
npm run sync:khgt
npm run sync:kabar
```

Siapkan ulang aset dari folder sumber:

```bash
npm run prepare:assets
```

## Struktur penting

```text
src/app/                 layout, beranda, sejarah, layanan, sitemap, robots
src/components/          layout, home, history, services, quiz, shared
src/data/                site, milestones, quiz, calendar, kabar, khgt snapshot
src/lib/                 kabar, khgt, date, cn
scripts/                 sync-khgt, sync-kabar, prepare-assets
public/logo/             logo horizontal, vertikal, logogram
public/pattern/          supergraphic kelor
public/og/               gambar Open Graph 1200x630
```

## Aturan konten

- Tanggal acara: **13–15 November 2026 / 4–6 Jumadilakhir 1448 H**.
- Milad historis: **18 November 2026**.
- Tanggal berdiri: **18 November 1912 / 8 Dzulhijjah 1330 H**. Jangan menulis 27 Rajab 1330 H.
- Jangan menampilkan angka amal usaha yang belum seragam atau tanpa sumber resmi.
- Setiap bab sejarah dan soal kuis memiliki tautan sumber.
- Logo tidak boleh diberi shadow, glow, 3D, opacity, rotasi, atau diubah warnanya.

## Uji

- `TEST-LOG.md` — hasil build, rute, viewport, dan uji fungsional.
- `CONTENT-VERIFIED.md` — register fakta dan sumber.
- `SUBMISSION.md` — studi kasus, skrip video, payload QR, dan checklist submit.
- Uji manual yang disarankan: 360/390 px, 768 px, 1440 px; Chrome Android, Safari iOS, Edge/Chrome desktop; mode `prefers-reduced-motion`.

## Deploy

1. Hubungkan repo GitHub ke Vercel.
2. Nama project: `milad114-palu`.
3. Framework: Next.js. Build: `npm run build`.
4. Pastikan ketiga rute merespons 200 sebelum QR diserahkan.
5. Jangan memakai URL preview Vercel untuk QR.

## Kredit

Karya independen untuk lomba website. Logo dan identitas visual milik Pimpinan Pusat Muhammadiyah. Font El Messiri dan Familjen Grotesk berlisensi SIL Open Font License. Data kalender milik KHGT; data kabar milik Muhammadiyah.or.id.
