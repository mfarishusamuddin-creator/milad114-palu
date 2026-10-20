# Panduan Edit Manual — Milad 114

Panduan ini menjelaskan cara mengedit seluruh website tanpa terkecuali: teks, terjemahan, gambar, layout, warna, font, tema, bahasa, peta, animasi, rute, data, dan deploy. Tidak perlu memahami seluruh kode; cukup ikuti file dan contoh di bawah.

## 1. Sebelum mulai

Prasyarat:

- Node.js 20.9 atau lebih baru (disarankan Node 22).
- npm.
- Editor kode, disarankan VS Code.
- Git (untuk push ke GitHub/Vercel).

Perintah utama:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Perintah lain:

```bash
npm run lint
npm run typecheck
npm run build
npm run start
npm run sync:kabar
npm run sync:khgt
npm run generate:tree
npm run prepare:assets
```

Jika mengubah kode dan build error karena rute lama, hapus `.next` lalu build lagi:

```powershell
Remove-Item -LiteralPath .next -Recurse -Force
npm run build
```

## 2. Peta file penting

```text
src/app/
  layout.tsx              root layout, font, metadata default, script tema, JSON-LD
  page.tsx                halaman Indonesia (/)
  en/page.tsx             halaman Inggris (/en)
  ar/page.tsx             halaman Arab (/ar)
  globals.css             seluruh token warna, tema gelap, layout, animasi
  sitemap.ts              daftar URL
  robots.ts               aturan crawler
  icon.png                favicon
src/components/
  pages/SiteShell.tsx     navbar + footer + locale + scroll reveal
  pages/HomePage.tsx      urutan seluruh section di satu index
  layout/Navbar.tsx       navigasi, bahasa, tema
  layout/Footer.tsx       footer, sumber, kredit
  layout/LanguageSwitcher.tsx
  layout/LocaleEffect.tsx
  theme/ThemeToggle.tsx
  theme/BrandLogo.tsx     logo terang/gelap otomatis
  theme/useTheme.ts
  home/Hero.tsx
  home/GatewayCards.tsx   indeks Jelajah (Akar/Batang/Kanopi)
  home/GrowingTree.tsx    section pohon
  home/AboutMilad.tsx
  home/Agenda.tsx
  history/HistorySection.tsx
  history/HistoryExperience.tsx
  services/ServicesSection.tsx
  services/HijriCalendar.tsx
  services/KabarTabs.tsx
  services/QuizApp.tsx
  map/MapSection.tsx
  map/WorldMap.tsx
  shared/                 komponen kecil (KabarCard, SourceNote, SpaceTree, dll.)
src/i18n/
  types.ts                tipe Dictionary
  id.ts                   semua teks Indonesia
  en.ts                   semua teks Inggris
  ar.ts                   semua teks Arab
  index.ts                getDictionary(), languagePath()
src/data/
  site.ts                 URL, tanggal, tautan resmi
  milestones.ts           ع¤onten sejarah Indonesia
  milestones.en.ts        konten sejarah Inggris
  milestones.ar.ts        konten sejarah Arab
  quiz.ts                 soal kuis Indonesia
  quiz.en.ts              soal kuis Inggris
  quiz.ar.ts              soal kuis Arab
  calendar-highlights.ts  penanda kalender Indonesia
  calendar-highlights.en.ts
  calendar-highlights.ar.ts
  pcim.ts                 29 negara PCIM + koordinat + nama 3 bahasa
  tree.ts                 data pohon (hasil generate; jangan diedit manual)
  khgt-2026.json          snapshot kalender (hasil sync)
  kabar-fallback.json     snapshot kabar (hasil sync)
scripts/
  sync-kabar.mjs
  sync-khgt.mjs
  generate-tree.mjs
  prepare-assets.ps1
public/
  logo/                   logo horizontal, logogram, vertikal
  pattern/                supergraphic kelor
  og/                     gambar Open Graph
  licenses/               lisensi font dan Scrollama
```

## 3. Mengedit teks

### 3.1 Teks antarmuka (UI)

Semua teks UI ada di tiga file:

- `src/i18n/id.ts`
- `src/i18n/en.ts`
- `src/i18n/ar.ts`

Struktur ketiganya sama. Contoh mengubah judul hero Indonesia:

```ts
hero: {
  titleLine1: "Bersama",
  titleLine2: "Satukan Bangsa",
  ...
}
```

Ubah juga pasangan yang sama di `en.ts` dan `ar.ts` agar tidak ada teks yang tertinggal.

Bagian penting:

- `meta` — judul/deskripsi halaman.
- `nav` — menu, CTA, label tema.
- `hero` — hero, plate logo, tombol, bahasa.
- `countdown` — label hitung waktu.
- `gates` — indeks Jelajah.
- `tree` — section pohon.
- `about` — section Tentang Milad.
- `agenda` — agenda.
- `history` — judul/label sejarah.
- `services` — judul/label layanan.
- `calendar` — semua label kalender, nama bulan, hari, event.
- `kabar` — label kabar.
- `quiz` — label kuis, badge, dan soal.
- `map` — judul peta dan nama kawasan.
- `footer` — footer.
- `notFound` — halaman 404.

### 3.2 Konten sejarah

Setiap bahasa punya file sendiri:

- `src/data/milestones.ts`
- `src/data/milestones.en.ts`
- `src/data/milestones.ar.ts`

Satu bab berbentuk:

```ts
{
  id: "akar-kauman",
  year: "1868–1911",
  kicker: "Akar",
  title: "Kauman dan ruang tamu yang menjadi sekolah",
  paragraphs: ["...", "..."],
  facts: ["...", "..."],
  sources: [{ label: "...", url: "https://..." }],
  branch: "akar",
  verified: true,
}
```

Aturan:

- `id` dipakai sebagai anchor; jangan diubah sembarangan.
- `branch` harus `akar`, `batang`, atau `kanopi`; dipakai untuk animasi pohon sisi.
- `sources` wajib berisi URL resmi.
- Jika menambah bab, tambahkan di ketiga bahasa dan pastikan urutannya sama.
- Jika ingin mengubah jumlah bab, sesuaikan juga `dict.history.chapters` (otomatis mengikuti file) dan animasi pohon.

### 3.3 Kuis

File:

- `src/data/quiz.ts`
- `src/data/quiz.en.ts`
- `src/data/quiz.ar.ts`

Satu soal:

```ts
{
  id: 1,
  question: "...",
  options: ["A", "B", "C", "D"],
  answerIndex: 1,
  explanation: "...",
  source: "...",
  sourceUrl: "https://...",
}
```

`answerIndex` dimulai dari 0. Pastikan urutan opsi dan jawaban benar di ketiga bahasa sama.

### 3.4 Agenda dan penanda kalender

- Agenda: `src/i18n/*.ts` bagian `agenda.items`.
- Penanda kalender: `src/data/calendar-highlights*.ts`.
- Tanggal memakai format `YYYY-MM-DD`; label boleh berbeda per bahasa.

### 3.5 Peta PCIM

File `src/data/pcim.ts`. Satu negara:

```ts
{
  id: "egypt",
  iso: "818",
  region: "africa",
  lat: 30.0444,
  lng: 31.2357,
  country: { id: "Mesir", en: "Egypt", ar: "ظ…طµط±" },
  city: { id: "Kairo", en: "Cairo", ar: "ط§ظ„ظ‚ط§ظ‡ط±ط©" },
}
```

- `iso` adalah kode numerik ISO 3166-1 tiga digit. Contoh: Mesir `818`, Inggris `826`, Australia `036`.
- `lat`/`lng` adalah koordinat kota pusat PCIM.
- `region` harus `africa`, `asia`, `europe`, `americas`, atau `oceania`.
- Jika menambah negara, tambahkan juga nama kota dan terjemahannya.
- Peta dunia memakai `world-atlas` (Natural Earth). Tidak perlu mengunduh peta manual.

### 3.6 Metadata dan tautan resmi

- `src/data/site.ts` — URL situs, tanggal, tautan resmi, daftar nav internal.
- `src/lib/metadata.ts` — metadata per bahasa.
- `src/app/layout.tsx` — metadata default, JSON-LD, script tema.
- `src/app/sitemap.ts` — daftar URL.
- `src/app/robots.ts` — crawler.

Jika mengganti domain, ubah `SITE.url` dan pastikan QR memakai domain final.

## 4. Mengedit gambar

### 4.1 Logo

File yang dipakai:

| File | Fungsi |
|---|---|
| `public/logo/horizontal-color.png` | Hero/plate mode terang |
| `public/logo/horizontal-white.png` | Hero/plate mode gelap dan footer |
| `public/logo/logogram-color.png` | Navbar mode terang, favicon |
| `public/logo/logogram-white.png` | Navbar mode gelap |
| `public/logo/vertical-color.png` | Cadangan/OG vertikal |

Cara mengganti:

1. Siapkan PNG transparan.
2. Ukuran yang disarankan:
   - horizontal: 1600 أ— 900 px.
   - logogram: 512 أ— 512 px.
   - vertikal: 900 أ— 1600 px.
3. Timpa file dengan nama yang sama di `public/logo/`.
4. Jangan mengubah proporsi, warna, atau memberi shadow/glow/3D; ikuti aturan identitas resmi.

Logo otomatis berganti terang/gelap di `src/components/theme/BrandLogo.tsx`. Jika menambah varian baru, tambahkan path di `SOURCES`.

### 4.2 Pattern kelor

- `public/pattern/kelor-strip.png`
- `public/pattern/kelor-strip.webp`

Dipakai di hero, section pohon, dan footer. Ganti dengan gambar pattern resmi; jaga rasio dan warna. Jika mengganti, buat juga versi WebP agar ringan.

### 4.3 Gambar Open Graph

- `public/og/og-milad114.jpg`
- `public/og/og-milad114.png`

Ukuran 1200 أ— 630 px. Dipakai di WhatsApp, X, LinkedIn. Ganti dengan komposisi logo + tagline + tanggal. Metadata ada di `src/lib/metadata.ts`.

### 4.4 Favicon

- `src/app/icon.png` (512 أ— 512).
- Metadata ikon juga menunjuk `/logo/logogram-color.png`.

Ganti `src/app/icon.png` dengan logogram 512 أ— 512.

### 4.5 Menambah foto

Belum ada foto resmi di repo. Jika menambahkan:

1. Simpan di `public/media/nama-file.webp` atau `.jpg`.
2. Gunakan ukuran wajar: lebar 1600–2400 px, kualitas 80–85.
3. Tambahkan kredit dan izin di `CONTENT-VERIFIED.md`.
4. Gunakan `next/image`:

```tsx
import Image from "next/image";

<Image
  src="/media/palu.webp"
  alt="Deskripsi foto"
  width={1600}
  height={1067}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="h-auto w-full"
/>
```

Jangan memakai `<img>` biasa untuk foto utama; `next/image` mengoptimasi ukuran.

### 4.6 Menambah video

Simpan MP4 di `public/media/`. Gunakan `muted`, `loop`, `playsInline`, `preload="none"`, dan poster. Hormati `prefers-reduced-motion`. Jangan memakai video sebagai elemen LCP.

### 4.7 Menyiapkan ulang aset dari folder sumber

Jika ingin membuat ulang logo/pattern/OG dari folder `drive-download-...`:

```bash
npm run prepare:assets
```

Script ada di `scripts/prepare-assets.ps1`. Script membutuhkan Windows PowerShell dan `System.Drawing`. Untuk WebP pattern, script memakai `ffmpeg` jika tersedia.

## 5. Mengedit layout

### 5.1 Urutan section

Buka `src/components/pages/HomePage.tsx`. Urutan JSX menentukan urutan halaman:

```tsx
<Hero dict={dict} />
<GatewayCards dict={dict} />
<GrowingTree dict={dict} />
<AboutMilad dict={dict} />
<Agenda dict={dict} />
<HistorySection dict={dict} />
<ServicesSection dict={dict} latest={latest} milad={milad} />
<MapSection dict={dict} />
```

Untuk memindahkan section, pindahkan barisnya. Untuk menghapus, hapus barisnya. Untuk menambah section baru, buat komponen di `src/components/...`, terima `dict`, lalu tambahkan di sini.

### 5.2 Grid dan jarak

Komponen memakai Tailwind CSS. Contoh grid dua kolom:

```tsx
<div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
```

- `grid` — aktifkan grid.
- `gap-10` — jarak 2.5rem.
- `lg:grid-cols-[...]` — kolom di layar besar.
- `lg:gap-16` — jarak di layar besar.

Contoh mengubah lebar hero:

```tsx
className="grid gap-12 py-12 lg:grid-cols-[1.2fr_0.8fr]"
```

### 5.3 Warna dan token

Token ada di `src/app/globals.css` bagian `@theme`:

```css
--color-navy: #1c469e;
--color-navy-deep: #293a88;
--color-teal: #41847d;
--color-teal-deep: #0b8170;
--color-gold: #d49b0f;
--color-gold-light: #eab749;
--color-kelor: #6dbd25;
--color-bg: #ffffff;
--color-bg-soft: #f0f3f8;
--color-surface: #ffffff;
--color-ink: #1a2138;
--color-ink-soft: #525b73;
--color-line: #dde3ee;
```

Mengubah token akan mengubah seluruh situs. Gunakan warna resmi dari identitas visual. Emas untuk teks kecil sebaiknya memakai `--color-gold-text` agar kontras.

### 5.4 Sudut, bayangan, dan border

- `rounded-sm` dipakai untuk panel utama.
- `border-line` adalah garis standar.
- `shadow-soft` ada di token.
- Hindari menambah `rounded-3xl` atau bayangan besar; gaya situs ini editorial dan datar.

### 5.5 Navbar dan footer

- `src/components/layout/Navbar.tsx` — menu, bahasa, tema, CTA.
- `src/components/layout/Footer.tsx` — kolom footer, sumber, bahasa.
- `src/components/pages/SiteShell.tsx` — pembungkus navbar + main + footer.

Untuk menambah menu:

1. Tambah `href` dan `label` di `dict.nav.links` pada tiga file bahasa.
2. Pastikan anchor `id` ada di halaman (`#sejarah`, `#layanan`, `#peta`, dll.).

### 5.6 Section sejarah

- `HistorySection.tsx` — header section.
- `HistoryExperience.tsx` — sidebar sticky, timeline, bab, Scrollama.
- `chapters` berasal dari `dict.history.chapters`.
- Jangan mengubah `className="history-step"` pada artikel; Scrollama membutuhkannya.

### 5.7 Section layanan

- `ServicesSection.tsx` — kalender, penanda, kabar, kuis.
- `HijriCalendar.tsx` — kalender dan konverter.
- `KabarTabs.tsx` — tab kabar.
- `QuizApp.tsx` — kuis.
- Anchor `#kabar` dan `#kuis` berada di dalam section ini.

### 5.8 Peta

- `MapSection.tsx` — header, peta, daftar negara.
- `WorldMap.tsx` — SVG peta dunia.
- Untuk mengubah tinggi daftar negara, ubah `lg:max-h-[560px]` di `MapSection.tsx`.
- Untuk mengubah warna peta, cari `.map-country` dan `.map-country--pcim` di `globals.css`.

## 6. Tema gelap/terang

- Tombol: `src/components/theme/ThemeToggle.tsx`.
- State: `src/components/theme/useTheme.ts`.
- Token gelap: `src/app/globals.css` bagian `[data-theme="dark"]`.
- Script awal: `src/app/layout.tsx` (`theme-init`).
- Logo otomatis: `src/components/theme/BrandLogo.tsx`.

Cara mengubah warna gelap:

1. Cari `[data-theme="dark"]` di `globals.css`.
2. Ubah `--color-bg`, `--color-bg-soft`, `--color-surface`, `--color-ink`, `--color-ink-soft`, `--color-line`.
3. Untuk warna teks brand di atas permukaan gelap, ubah aturan `.text-navy`, `.text-teal-deep`, `.text-gold-text`, `.text-kelor-deep`.
4. Uji di `/`, `/en`, `/ar`.

Tema disimpan di `localStorage` dengan kunci `m114:theme`. Jika tidak ada, mengikuti `prefers-color-scheme`.

## 7. Bahasa dan RTL

### 7.1 Rute

- `/` — Indonesia.
- `/en` — Inggris.
- `/ar` — Arab.

File halaman: `src/app/page.tsx`, `src/app/en/page.tsx`, `src/app/ar/page.tsx`.

### 7.2 Menambah/mengubah terjemahan

1. Buka `src/i18n/types.ts` untuk melihat struktur.
2. Edit `id.ts`, `en.ts`, `ar.ts` pada kunci yang sama.
3. Untuk konten panjang, edit file `src/data/*.en.ts` dan `*.ar.ts`.
4. Jalankan `npm run typecheck`; TypeScript akan memberi tahu jika ada kunci yang hilang.

### 7.3 RTL Arab

- `ar.ts` memiliki `dir: "rtl"`.
- `SiteShell` memberi `dir` dan `lang` pada pembungkus.
- `LocaleEffect` memperbarui `<html lang>` dan `<html dir>`.
- `languagePath()` menghasilkan `/`, `/en`, `/ar`.

Jika menambah bahasa baru:

1. Tambah kode di `LanguageCode` (`src/i18n/types.ts`).
2. Buat file kamus baru.
3. Daftarkan di `src/i18n/index.ts`.
4. Buat halaman `src/app/<kode>/page.tsx`.
5. Tambah ke `LanguageSwitcher`, `sitemap`, dan metadata `alternates`.
6. Tentukan `dir` dan font yang sesuai.

### 7.4 Verifikasi Arab

Terjemahan Arab dibuat sebagai draf. Sebelum submit, minta penutur asli memeriksa `TRANSLATION-REVIEW.md`. Perhatikan istilah, harakat, dan arah teks.

## 8. Peta dunia

- Data negara: `src/data/pcim.ts`.
- Geometri: `world-atlas` (Natural Earth, ISC).
- Proyeksi: `d3-geo` (`geoNaturalEarth1`).
- Konversi TopoJSON: `topojson-client`.

Menambah negara:

1. Tambah objek di `pcimCountries`.
2. Isi `iso` numerik, `region`, `lat`, `lng`, dan nama 3 bahasa.
3. Jalankan `npm run typecheck` dan `npm run build`.
4. Cek jumlah highlight: buka `/`, scroll ke `#peta`. Jumlah path PCIM dan marker harus sama dengan jumlah data.

Mengganti sumber peta:

- Ganti import `world-atlas/countries-110m.json` di `WorldMap.tsx`.
- Pastikan struktur TopoJSON memiliki `objects.countries`.
- Sesuaikan `normalizeIso()` jika `id` bukan numerik.

## 9. Animasi

### 9.1 Scroll reveal

- Komponen: `src/components/shared/ScrollReveal.tsx`.
- Atribut: `data-reveal` pada elemen.
- CSS: `.js-reveal [data-reveal]` di `globals.css`.
- Fallback: semua elemen ditampilkan setelah 5 detik agar konten tidak pernah hilang.
- Reduced motion: konten langsung tampil.

Menambah elemen reveal:

```tsx
<div data-reveal>...</div>
```

Menghapus animasi dari elemen: hapus `data-reveal`.

### 9.2 Pohon

Status saat ini: ilustrasi pohon memakai `SpaceTree` dan data `src/data/tree.ts`. Pohon sidebar statis tanpa highlight sisi. Animasi bibit → pohon berbuah **belum** dieksekusi. Jangan mengubahnya secara manual jika Anda ingin memakai prompt AI yang sudah disiapkan.

Prompt lengkap ada di `PROMPT-ANIMASI-POHON.md`. Handoff ada di `HANDOFF-AI.md`. Setelah AI lain mengeksekusi prompt, ganti `SpaceTree`/`HistoryExperience` sesuai hasilnya.

Jika ingin membuat ulang data pohon:

```bash
npm run generate:tree
```

File `src/data/tree.ts` dihasilkan ulang. Jangan mengedit file itu manual; edit `scripts/generate-tree.mjs`.

### 9.3 Countdown

- `src/components/home/Countdown.tsx`.
- Target tanggal di `src/data/site.ts` (`startISO`, `endISO`, `miladISO`).
- Label di `dict.countdown`.

### 9.4 Prinsip animasi

- Semua animasi masuk dari bawah ke atas, bukan dari samping, kecuali panah.
- Jangan membalik arah highlight akar/batang/kanopi.
- Hormati `prefers-reduced-motion`.
- Uji di ponsel kelas menengah; hindari animasi berat.

## 10. Data dinamis

### 10.1 Kabar

- Sumber: WP REST API `muhammadiyah.or.id`.
- Kode: `src/lib/kabar.ts`.
- Cache: `use cache` + `cacheLife("hours")`.
- Fallback: `src/data/kabar-fallback.json`.
- Perbarui fallback:

```bash
npm run sync:kabar
```

### 10.2 Kalender

- Sumber: `khgt.muhammadiyah.or.id`.
- Snapshot: `src/data/khgt-2026.json`.
- Kode: `src/lib/khgt.ts`.
- Perbarui snapshot:

```bash
npm run sync:khgt
```

Jangan memakai library hijriah generik; data KHGT adalah acuan.

## 11. Rute, QR, dan metadata

Payload QR gerbang bahasa:

```text
Indonesia : https://milad114-palu.vercel.app/
English   : https://milad114-palu.vercel.app/en
Arab      : https://milad114-palu.vercel.app/ar
```

- Jangan memakai URL preview Vercel.
- Setelah domain final, jangan mengganti nama project.
- Anchors: `#jelajah`, `#sejarah`, `#layanan`, `#peta`, `#kabar`, `#kuis`.
- Metadata per bahasa: `src/lib/metadata.ts`.
- Sitemap: `src/app/sitemap.ts`.
- Robots: `src/app/robots.ts`.

## 12. Menjalankan dan deploy

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Deploy:

1. Commit dan push ke GitHub.
2. Import repo di Vercel.
3. Nama project: `milad114-palu`.
4. Build command: `npm run build`.
5. Setelah deploy, cek:
   - `/`
   - `/en`
   - `/ar`
   - `/sitemap.xml`
   - `/robots.txt`
6. Pastikan ketiganya 200 sebelum QR diserahkan.

## 13. Troubleshooting

**Build error “Cannot find module src/app/sejarah/page.js”‌**
Rute lama sudah dihapus. Hapus `.next` lalu build lagi.

**Gambar tidak muncul**
Pastikan file ada di `public/...` dan path diawali `/`. Untuk logo mode gelap, gunakan `BrandLogo`, bukan `Image` langsung.

**Warna gelap tidak berubah**
Periksa `[data-theme="dark"]` dan token `--color-surface`. Pastikan elemen memakai `bg-surface`, bukan `bg-white`.

**Teks Arab tidak terbaca**
Pastikan `dir="rtl"` aktif dan font El Messiri termuat. Periksa `LocaleEffect` dan `SiteShell`.

**Peta tidak menampilkan negara**
Cek `iso` tiga digit dan apakah `world-atlas` memiliki negara tersebut. Buka DevTools dan cari `.map-country--pcim`.

**Animasi tidak muncul**
Pastikan elemen memiliki `data-reveal` dan `ScrollReveal` terpasang di `SiteShell`. Fallback menampilkan semua setelah 5 detik.

**Terjemahan TypeScript error**
Bandingkan struktur `id.ts`, `en.ts`, `ar.ts`. Semua kunci harus sama.

## 14. Checklist edit

- [ ] Teks di tiga bahasa sudah sinkron.
- [ ] Tanggal dan angka sudah diverifikasi.
- [ ] Logo terang/gelap benar.
- [ ] Gambar OG 1200أ—630.
- [ ] Favicon 512أ—512.
- [ ] Tidak ada `bg-white` yang membuat kartu terang di mode gelap.
- [ ] Anchor `#sejarah`, `#layanan`, `#peta`, `#kabar`, `#kuis` ada.
- [ ] Peta menampilkan jumlah negara yang benar.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` lolos.
- [ ] Uji `/`, `/en`, `/ar` di 390 px, 768 px, 1440 px.
- [ ] Uji mode terang dan gelap.
- [ ] Uji QR dari layar dan cetak.

