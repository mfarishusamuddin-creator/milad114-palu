# Panduan Edit Manual — Milad 114

Panduan ini menjelaskan cara mengedit seluruh website tanpa terkecuali: teks, terjemahan, gambar, layout, **ukuran font dan tipografi**, warna, ukuran/jarak/tap target, section collapsible, navigasi anchor, tema, bahasa, peta, animasi, rute, data, dan deploy. Tidak perlu memahami seluruh kode; cukup ikuti file dan contoh di bawah.

## Daftar isi

1. [Sebelum mulai](#1-sebelum-mulai)
2. [Peta file penting](#2-peta-file-penting)
3. [Mengedit teks](#3-mengedit-teks)
4. [Mengedit gambar](#4-mengedit-gambar)
5. [Mengedit layout](#5-mengedit-layout)
6. [Tipografi: font dan ukuran (detail)](#6-tipografi-font-dan-ukuran-detail)
7. [Ukuran, jarak, dan tap target (detail)](#7-ukuran-jarak-dan-tap-target-detail)
8. [Warna dan token](#8-warna-dan-token)
9. [Tema gelap/terang](#9-tema-gelapterang)
10. [Section collapsible dan navigasi anchor](#10-section-collapsible-dan-navigasi-anchor)
11. [Bahasa dan RTL](#11-bahasa-dan-rtl)
12. [Peta dunia](#12-peta-dunia)
13. [Animasi](#13-animasi)
14. [Data dinamis](#14-data-dinamis)
15. [Rute, QR, dan metadata](#15-rute-qr-dan-metadata)
16. [Menjalankan dan deploy](#16-menjalankan-dan-deploy)
17. [Troubleshooting](#17-troubleshooting)
18. [Checklist edit](#18-checklist-edit)

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
npm run lint        # pemeriksaan gaya kode
npm run typecheck   # pemeriksaan TypeScript (wajib lolos)
npm run build       # build produksi (wajib lolos)
npm run start       # jalankan hasil build
npm run sync:kabar  # perbarui snapshot kabar
npm run sync:khgt   # perbarui snapshot kalender
npm run prepare:assets
```

Setiap selesai mengedit, jalankan ketiganya:

```bash
npm run lint && npm run typecheck && npm run build
```

Jika mengubah kode dan build error karena rute lama, hapus `.next` lalu build lagi:

```powershell
Remove-Item -LiteralPath .next -Recurse -Force
npm run build
```

## 2. Peta file penting

```text
src/app/
  layout.tsx              root layout, font (localFont), metadata default, script tema, JSON-LD
  page.tsx                halaman Indonesia (/)
  en/page.tsx             halaman Inggris (/en)
  ar/page.tsx             halaman Arab (/ar)
  tentang/page.tsx        halaman Tentang Indonesia (/tentang)
  en/tentang/page.tsx     halaman Tentang Inggris (/en/tentang)
  ar/tentang/page.tsx     halaman Tentang Arab (/ar/tentang)
  globals.css             token warna, ukuran font, tema gelap, layout, animasi
  sitemap.ts              daftar URL
  robots.ts               aturan crawler
  icon.png                favicon
  fonts/                  berkas font (El Messiri, Familjen Grotesk)
src/components/
  pages/SiteShell.tsx     navbar + main + footer + locale (flex column setinggi viewport)
  pages/HomePage.tsx      urutan seluruh section di satu index
  pages/AboutPage.tsx     halaman Tentang (disclaimer, sumber, hak cipta)
  layout/Navbar.tsx       header: logo + nama, CardNav (menu kartu, di kanan)
  layout/Footer.tsx       footer minimalis dua kolom (identitas + acara/Tentang)
  layout/LanguageSwitcher.tsx
  layout/LocaleEffect.tsx
  theme/ThemeToggle.tsx
  theme/BrandLogo.tsx     logo terang/gelap otomatis
  theme/useTheme.ts
  home/Hero.tsx
  home/AboutMilad.tsx     section #tentang (collapsible)
  home/Agenda.tsx         section #agenda (collapsible)
  home/Countdown.tsx      hitung mundur (anchor #countdown)
  history/HistorySection.tsx   section #sejarah (collapsible)
  history/HistoryTimeline.tsx
  history/HistoryTables.tsx
  ui/timeline.tsx         timeline Aceternity (adaptasi, dipakai desktop)
  services/ServicesSection.tsx  section #layanan (SELANGGUHNYA TERBUKA, bukan collapsible)
  services/HijriCalendar.tsx
  services/KabarTabs.tsx  tab kabar (anchor #kabar di dalamnya)
  map/MapSection.tsx      section #peta (collapsible)
  map/WorldMap.tsx        SVG peta dunia interaktif
  shared/CardNav.tsx      menu kartu ReactBits (adaptasi) untuk header
  shared/card-nav.css     gaya CardNav + mode compact + slot footer
  shared/CollapsibleSection.tsx   pembungkus section yang bisa buka/tutup
  shared/collapsible-section.css  gaya + ukuran judul section collapsible
  shared/SectionHeading.tsx       judul section statis (h2.section-title)
  shared/GradientText.tsx + gradient-text.css   teks gradient beranimasi
  shared/AnchorLink.tsx   tautan #… yang membuka section tujuan
  shared/CountUp.tsx      animasi angka ReactBits (stempel hero 114, statistik peta 29)
  shared/Counter.tsx      mesin angka Counter ReactBits (dipakai Countdown)
src/lib/
  anchor.ts               scrollToAnchor: logika navigasi hash + auto-open section
  metadata.ts             metadata per bahasa
  cn.ts                   helper gabung className
src/i18n/
  types.ts                tipe Dictionary (struktur semua teks)
  id.ts                   semua teks Indonesia
  en.ts                   semua teks Inggris
  ar.ts                   semua teks Arab
  index.ts                getDictionary(), languagePath()
src/data/
  site.ts                 URL, tanggal, tautan resmi
  history.ts              sejarah dua jalur + tabel (Indonesia)
  history.en.ts           sejarah Inggris
  history.ar.ts           sejarah Arab
  calendar-highlights.ts  penanda kalender Indonesia
  calendar-highlights.en.ts
  calendar-highlights.ar.ts
  pcim.ts                 29 negara PCIM + koordinat + nama 3 bahasa
  khgt-2026.json          snapshot kalender (hasil sync)
  kabar-fallback.json     snapshot kabar (hasil sync)
scripts/
  sync-kabar.mjs
  sync-khgt.mjs
  prepare-assets.ps1
public/
  logo/                   logo horizontal, logogram, vertikal
  pattern/                supergraphic kelor
  og/                     gambar Open Graph
  media/intro/            video + poster intro
  licenses/               lisensi font
```

## 3. Mengedit teks

### 3.1 Teks antarmuka (UI)

Semua teks UI ada di tiga file:

- `src/i18n/id.ts`
- `src/i18n/en.ts`
- `src/i18n/ar.ts`

Struktur ketiganya sama (dijamin `types.ts`). Contoh mengubah judul hero Indonesia:

```ts
hero: {
  titleLine1: "Bersama",
  titleLine2: "Satukan Bangsa",
  ...
}
```

Ubah juga pasangan yang sama di `en.ts` dan `ar.ts` agar tidak ada teks yang tertinggal. `npm run typecheck` akan memberi tahu jika ada kunci yang hilang atau kelebihan.

Bagian penting:

| Kunci | Isi |
|---|---|
| `meta` | judul/deskripsi halaman |
| `nav` | header: `cards` (menu kartu CardNav), `about`, `menuAria`/`menuOpen`/`menuClose` |
| `hero` | judul, subjudul, intro, CTA, bagikan |
| `countdown` | label hitung waktu (termasuk `ramadhan`) |
| `about` | section Tentang Milad (makna logo) |
| `agenda` | agenda acara |
| `history` | judul/label sejarah |
| `services` | judul/label layanan (kalender, penanda, kabar) |
| `calendar` | label kalender, nama bulan, hari, event |
| `kabar` | label kabar |
| `map` | judul peta, label markas, tombol info |
| `footer` | footer: `brand`, `tagline`, `description`, `eventDate`, `madeIn`, `period` |
| `aboutPage` | halaman Tentang: `title`, `back`, `intro`, `disclaimer`, `sourcesTitle`, `sources[]`, `copyright` |
| `notFound` | halaman 404 |

### 3.2 Konten sejarah

Setiap bahasa punya file sendiri:

- `src/data/history.ts`
- `src/data/history.en.ts`
- `src/data/history.ar.ts`

Struktur: dua jalur (`tracks`) — jalur Muhammadiyah dan jalur KH Ahmad Dahlan — masing-masing berisi entri; lalu dua tabel (`leadership`, `aum`), dan konten section.

Entri timeline berbentuk:

```ts
{
  year: "1912",
  title: "...",
  description: "..."
}
```

Tabel berbentuk:

```ts
{
  title: "...",
  headings: ["...", "..."],
  rows: [["...", "..."], ...],
  note: "..."
}
```

Aturan:

- Urutan entri kronologis; tambahkan di ketiga bahasa dengan urutan sama.
- Fakta bersumber wajib: Khatib Amin 1890, MIDI 1 Desember 1911, AUM PCIM 29 (halaman resmi Cabang Istimewa Muhammadiyah).
- Judul/label section ada di `dict.history` (tiga file bahasa).
- Daftar sumber sejarah hanya di halaman Tentang (`/tentang`), bukan di section ini.

### 3.3 Agenda dan penanda kalender

- Agenda: `src/i18n/*.ts` bagian `agenda.items`.
- Penanda kalender: `src/data/calendar-highlights*.ts`.
- Tanggal memakai format `YYYY-MM-DD`; label boleh berbeda per bahasa.

### 3.4 Peta PCIM

File `src/data/pcim.ts`. Satu negara:

```ts
{
  id: "egypt",
  iso: "818",
  lat: 26.8,
  lng: 30.8,
  country: { id: "Mesir", en: "Egypt", ar: "مصر" },
}
```

- `iso` adalah kode numerik ISO 3166-1 tiga digit. Contoh: Mesir `818`, Inggris `826`, Australia `036`. Indonesia `360` dipakai khusus untuk markas Pimpinan Pusat (bukan bagian dari 29 PCIM).
- `lat`/`lng` adalah titik penanda negara di peta (pusat geografis). Bukan data kota — situs ini tidak menampilkan nama kota PCIM.
- Daftar resmi: halaman Cabang Istimewa Muhammadiyah (`SITE.links.pcim`), yang memuat tepat 29 PCIM.
- Peta dunia memakai `world-atlas` (Natural Earth). Tidak perlu mengunduh peta manual.

### 3.5 Metadata dan tautan resmi

- `src/data/site.ts` — URL situs, tanggal, tautan resmi.
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
| `public/logo/horizontal-color-1921.png` | Hero/plate mode terang (frame motion 19–21) |
| `public/logo/horizontal-white-1921.png` | Hero/plate mode gelap (frame motion 19–21) |
| `public/logo/logogram-color.png` | Navbar mode terang, favicon |
| `public/logo/logogram-white.png` | Navbar mode gelap, footer |
| `public/logo/vertical-color.png` | Cadangan/OG vertikal; masih versi 13–15, tidak dipakai |

Cara mengganti:

1. Siapkan PNG transparan.
2. Ukuran yang disarankan:
   - horizontal: 1600 × 900 px.
   - logogram: 512 × 512 px.
   - vertikal: 900 × 1600 px.
3. Timpa file dengan nama yang sama di `public/logo/`.
4. Jangan mengubah proporsi, warna, atau memberi shadow/glow/3D; ikuti aturan identitas resmi.

Logo otomatis berganti terang/gelap di `src/components/theme/BrandLogo.tsx`. Jika menambah varian baru, tambahkan path di `SOURCES`.

PENTING: ukuran/logo di header (`Navbar.tsx`) adalah hasil edit manual — jangan mengubah class, ukuran, atau aset logo di header tanpa persetujuan pemilik.

### 4.2 Pattern kelor

- `public/pattern/kelor-strip.png`
- `public/pattern/kelor-strip.webp`

Dipakai lewat class `.pattern-strip` dan `.pattern-soft` di `globals.css`. Ganti dengan gambar pattern resmi; jaga rasio dan warna. Jika mengganti, buat juga versi WebP agar ringan.

### 4.3 Gambar Open Graph

- `public/og/og-milad114-1921.jpg`
- `public/og/og-milad114-1921.png`

Ukuran 1200 × 630 px. Dipakai di WhatsApp, X, LinkedIn. Ganti dengan komposisi logo + tagline + tanggal. Metadata ada di `src/lib/metadata.ts`.

### 4.4 Favicon

- `src/app/icon.png` (512 × 512).
- Metadata ikon juga menunjuk `/logo/logogram-color.png`.

Ganti `src/app/icon.png` dengan logogram 512 × 512.

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
<SiteShell dict={dict}>
  <Hero dict={dict} />                                   {/* #countdown di dalamnya */}
  <AboutMilad dict={dict} />                             {/* #tentang, collapsible */}
  <Agenda dict={dict} />                                 {/* #agenda, collapsible */}
  <MapSection dict={dict} />                             {/* #peta, collapsible */}
  <HistorySection dict={dict} />                         {/* #sejarah, collapsible */}
  <ServicesSection dict={dict} latest={...} milad={...} /> {/* #layanan, selalu terbuka */}
</SiteShell>
```

`SiteShell` membungkus semuanya: `<MotionIntro>` → `<Navbar>` → `<main id="konten">` → `<Footer>`. Footer selalu elemen terakhir; `main` memakai `flex: 1 1 auto` sehingga footer menempel di dasar halaman tanpa ruang kosong setelahnya.

Untuk memindahkan section, pindahkan barisnya. Untuk menghapus, hapus barisnya. Untuk menambah section baru, buat komponen di `src/components/...`, terima `dict`, lalu tambahkan di sini.

### 5.2 Grid dan jarak

Komponen memakai Tailwind CSS. Contoh grid dua kolom:

```tsx
<div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
```

- `grid` — aktifkan grid.
- `gap-10` — jarak 2.5rem.
- `lg:grid-cols-[...]` — kolom di layar besar (fr menentukan porsi lebar).
- `lg:gap-16` — jarak di layar besar.

Contoh mengubah porsi kolom hero:

```tsx
className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-14"
```

Prefix breakpoint Tailwind (dari kecil ke besar): `sm:` 640px, `md:` 768px, `lg:` 1024px, `xl:` 1280px, `2xl:` 1536px. Tanpa prefix = semua ukuran.

Kontainer utama `.container-page` (di `globals.css`): `max-width: 76rem`, padding sisi `1.25rem` (mobile) / `2rem` (≥768px). Untuk mengubah lebar maksimum seluruh situs, edit class ini.

### 5.3 Navbar dan footer

- `src/components/layout/Navbar.tsx` — header sticky (`z-50`): logo + nama situs di kiri, `CardNav` (mode compact) di kanan. Pemilih bahasa, ThemeToggle, dan tautan "Tentang" hidup di dalam kartu **Pengaturan** pada panel CardNav — bukan di header.
- `src/components/shared/CardNav.tsx` + `card-nav.css` — menu kartu (adaptasi ReactBits). Tema panel mengikuti token terang/gelap otomatis. Label menu dari `dict.nav.menuOpen/menuClose`; kartu dari `dict.nav.cards`. Lebar panel terbuka: `min(720px, 100vw - 2rem)` — diatur lewat prop `compactWidth={720}` dan CSS `.card-nav--compact[data-open] .card-nav__panel`.
- `src/components/layout/Footer.tsx` — footer minimalis dua kolom: kiri logo + wordmark + tagline + deskripsi; kanan tanggal acara, info pembuatan, dan tautan Tentang. Sumber/kredit/hak cipta panjang tidak ada di footer (semuanya di halaman Tentang). Copy diambil dari `dict.footer` (`brand`, `tagline`, `description`, `eventDate`, `madeIn`, `period`).
- `src/components/pages/SiteShell.tsx` — pembungkus navbar + main + footer; memastikan halaman setinggi viewport (`min-height: 100vh/100dvh` di `.site-shell`).

Untuk menambah menu kartu di header:

1. Edit `dict.nav.cards` di tiga file bahasa (`label`, `description`, `links`).
2. Untuk tautan menuju halaman Tentang, pakai `about: true`; untuk anchor, pakai `anchor: "#…"`.
3. Pastikan `id` anchor ada di halaman (`#tentang`, `#agenda`, `#peta`, `#sejarah`, `#layanan`, `#kabar`, `#countdown`).
4. Tautan anchor otomatis membuka section tujuan bila tertutup (lihat bagian 10).

Untuk memperluas halaman Tentang: edit `dict.aboutPage` di tiga file bahasa dan `src/components/pages/AboutPage.tsx`. Sumber resmi diambil dari `SITE.links` (key cocok dengan `src/data/site.ts`).

### 5.4 Section sejarah

- `HistorySection.tsx` — judul collapsible + timeline + tabel.
- `HistoryTimeline.tsx` — dua jalur (tabs desktop, accordion `<details>` mobile), memakai `src/components/ui/timeline.tsx`.
- `HistoryTables.tsx` — tabel kepemimpinan dan AUM.
- Data: `src/data/history.ts` + `history.en.ts` + `history.ar.ts`.
- Desktop memakai tabs + timeline dengan scroll progress (`motion`); mobile memakai `<details>`.

### 5.5 Section layanan (selalu terbuka)

- `ServicesSection.tsx` — **section statis, bukan CollapsibleSection**. Judul "Layanan Muhammadiyah" memakai `h2.section-title` + GradientText, tanpa tombol buka/tutup.
- Isi: kalender (`HijriCalendar`), kartu Penanda Milad, lalu blok Kabar dengan `id="kabar"` + `scroll-mt-24`.
- Deskripsi section (`dict.services.description`) sengaja tidak dirender. Kalau ingin menampilkannya, tambahkan `<p>` di bawah judul.
- Anchor `#kabar` berada di dalam section ini.

### 5.6 Peta

- `MapSection.tsx` — judul collapsible, statistik CountUp `29`, tombol "i" ke halaman Tentang (`aboutPath`).
- `WorldMap.tsx` — SVG peta dunia (client component): dot interaktif + label negara.
- Interaksi label: hover/klik (mouse), fokus/Tab (`Enter`/`Space`) (keyboard), tap dot (sentuh); ketuk area kosong peta untuk menutup label.
- Label hanya tampil untuk marker yang sedang aktif; label Indonesia hanya saat marker HQ aktif.
- `HIT_RADIUS` (di `WorldMap.tsx`) mengatur luas area sentuh marker — jangan terlalu besar agar marker Eropa tidak saling tumpuk.
- Untuk mengubah warna peta, cari `.map-land`, `.map-country--pcim`, `.map-country--hq`, `.map-label` di `globals.css` (jangan lupa versi `[data-theme="dark"]`-nya).
- Sumber data peta (PCIM page, Natural Earth, world-atlas) hanya tercantum di halaman Tentang.

## 6. Tipografi: font dan ukuran (detail)

### 6.1 Dua font yang dipakai

Font dimuat sebagai local font di `src/app/layout.tsx`:

```tsx
const display = localFont({
  src: "./fonts/ElMessiri-VariableFont_wght.ttf",
  variable: "--font-display",   // font judul
  weight: "400 700",
});

const body = localFont({
  src: [...FamiljenGrotesk...],
  variable: "--font-body",      // font teks
});
```

| Token | Font | Dipakai untuk |
|---|---|---|
| `--font-display` | El Messiri | semua heading (h1–h4), angka countdown, judul kartu, font Arab (RTL) |
| `--font-body` | Familjen Grotesk | paragraf, tombol, label, navigasi |

Pemetaan ke utilitas Tailwind ada di `globals.css`:

```css
@theme inline {
  --font-sans: var(--font-body);   /* class `font-sans` */
  --font-serif: var(--font-display); /* class `font-serif` */
}
```

Jadi di JSX: `font-serif` = El Messiri (judul), `font-sans`/default = Familjen Grotesk. Halaman Arab (`.site-shell[dir="rtl"]`) memakai El Messiri untuk seluruh teks karena mendukung Arab.

Mengganti font: timpa `.ttf` di `src/app/fonts/` dengan nama file sama, atau tambah file baru dan ubah `src` di `layout.tsx`. Berkas lisensi font ada di `public/licenses/`.

### 6.2 Ukuran font utama (kelas global)

Semua ada di `src/app/globals.css` bagian `@layer components`. Ukuran memakai `clamp(min, ideal, max)` agar responsif tanpa media query:

```css
font-size: clamp(UKURAN-MINIMAL, UKURAN-IDEAL-vw, UKURAN-MAKSIMAL);
```

Browser memakai ukuran ideal (vw, tumbuh mengikuti lebar layar), dibatasi min dan max.

| Kelas | Nilai sekarang | Dipakai di |
|---|---|---|
| `.display-title` | `clamp(2.4rem, 6vw, 4.6rem)`, weight 700, letter-spacing -0.03em, line-height 1.12 (turunan h1) | judul Hero ("Bersama / Satukan Bangsa") — **paling besar di seluruh situs** |
| `.section-title` | `clamp(2.25rem, 4.5vw, 4rem)`, line-height 1.06, letter-spacing -0.025em | judul semua section statis: Layanan, Kabar, Tentang (via `SectionHeading`) |
| `.collapsible__title` | `clamp(2.25rem, 4.5vw, 4rem)`, line-height 1.06, letter-spacing -0.02em (di `collapsible-section.css`) | judul section collapsible: Tentang, Agenda, Peta, Sejarah |
| `.body-lead` | `clamp(1rem, 1.35vw, 1.16rem)`, line-height 1.75 | paragraf pengantar |
| `.navbar-brand` | `clamp(0.85rem, 1.9vw + 0.55rem, 1.3rem)` | nama situs di header |
| `.eyebrow` | `0.75rem`, uppercase, letter-spacing 0.18em | label kecil di atas judul |

Ukuran lain yang relevan (masih `globals.css`):

| Kelas | Nilai | Dipakai di |
|---|---|---|
| `.countdown-value` | `clamp(1.55rem, 4vw, 2.35rem)` | angka hari/jam/menit/detik |
| `.countdown-label` | `0.75rem`, uppercase | label di bawah angka |
| `.map-stat-value` | `clamp(2.1rem, 5vw, 3.2rem)` | angka besar "29" di Peta |
| `.map-stat-label` | `0.75rem`, uppercase | label "Negara PCIM" |
| `.kabar-title` | `1.08rem` | judul kartu kabar |
| `.kabar-excerpt` | `0.85rem` | ringkasan kabar |
| `.kabar-date` | `0.72rem`, uppercase | tanggal kabar |

Ukuran di CardNav (di `card-nav.css`, memakai px karena komponen ini punya basis sendiri):

| Kelas | Nilai |
|---|---|
| `.card-nav` | `14px` (basis seluruh menu) |
| `.card-nav__label` | `17px` (judul kartu menu) |
| `.card-nav__description` | `13px` |
| `.card-nav__link` | `14px` |

### 6.3 Cara mengubah ukuran font

**Contoh 1 — memperbesar semua judul section.** Ubah satu tempat; semua section ikut:

```css
/* globals.css */
.section-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem); /* sebelumnya 2.25rem–4rem */
}

/* collapsible-section.css */
.collapsible__title {
  font-size: clamp(2.5rem, 5vw, 4.5rem); /* samakan dengan .section-title */
}
```

**Contoh 2 — memperkecil judul hanya di ponsel.** Perkecil batas bawah clamp:

```css
.section-title {
  font-size: clamp(1.9rem, 4.5vw, 4rem); /* min 2.25rem → 1.9rem */
}
```

**Contoh 3 — mengubah ukuran satu teks saja.** Gunakan utilitas Tailwind di JSX:

```tsx
<p className="text-sm">...</p>           {/* 0.875rem */}
<p className="text-base">...</p>         {/* 1rem */}
<h3 className="text-xl font-bold">...</h3>
<p className="text-[0.95rem]">...</p>    {/* nilai khusus */}
```

Skala Tailwind: `text-xs` 0.75rem, `text-sm` 0.875rem, `text-base` 1rem, `text-lg` 1.125rem, `text-xl` 1.25rem, `text-2xl` 1.5rem, dst.

**Contoh 4 — judul sub-blok di dalam section.** Sudah ada polanya di kode:

```tsx
<h3 className="font-serif text-2xl font-bold text-ink">...</h3>   {/* sub-judul */}
<h4 className="font-serif text-xl font-bold text-ink">...</h4>    {/* kartu */}
```

### 6.4 Aturan hierarki yang harus dijaga

Dari besar ke kecil — jangan menyilangkan urutan:

```text
Hero (.display-title)      2.4–4.6rem   ← terbesar
Judul section              2.25–4rem    ← .section-title / .collapsible__title (samakan!)
Sub-judul (h3)             text-2xl     (1.5rem)
Judul kartu (h4)           text-xl      (1.25rem)
Body                       1rem
Body kecil                 text-sm      (0.875rem)
Label/eyebrow              0.72–0.75rem
```

Larangan:

- Jangan memakai `transform: scale()` untuk memperbesar teks (merusak layout dan aksesibilitas).
- Jangan memakai satuan `px` untuk ukuran font di konten (pakai `rem`/`clamp`); pengecualian: komponen CardNav yang memang berbasis px.
- Jangan memakai ukuran di bawah `0.72rem` untuk label apa pun.
- Jangan mengurangi `line-height` judul di bawah 1.02 atau di atas 1.2.
- Jika mengubah `.section-title`, samakan dengan `.collapsible__title` agar semua judul section konsisten.

### 6.5 Line-height, letter-spacing, dan keterbacaan

- Heading (h1–h4): `line-height: 1.12`, `letter-spacing: -0.015em` (aturan dasar di `@layer base`); `.section-title`/`.collapsible__title` memakai 1.06 agar terlihat rapat dan kokoh.
- Body: `line-height: 1.65` (`body` di `@layer base`); `.body-lead` 1.75; `.prose-milad p` 1.75.
- Halaman Arab/RTL memakai line-height lebih lega: `.site-shell[dir="rtl"] .prose-milad, .body-lead { line-height: 1.95 }`.
- `text-wrap: balance` dipakai pada judul agar pindah baris merata; `text-wrap: pretty` pada paragraf.

### 6.6 Teks gradient (judul section)

Judul section dibungkus `GradientText` (teks berwarna gradient beranimasi). Warna gradient dari token `--gt-c1`…`--gt-c4` di `globals.css` (versi terang di `:root`, versi gelap di `[data-theme="dark"]`). `animationSpeed={13}` adalah kecepatan animasi — makin kecil makin cepat. Reduced motion otomatis menuju gradient statis (aturan di `gradient-text.css`).

## 7. Ukuran, jarak, dan tap target (detail)

### 7.1 Jarak (spacing)

Tailwind memakai skala `--spacing: 0.25rem` (4px). `gap-10` = 40px, `py-5` = 20px, dst.

| Kebutuhan | Class | Hasil |
|---|---|---|
| Jarak antarsection | `section` (class sendiri) | `padding-block: clamp(3rem, 5vw, 4.5rem)` |
| Jarak judul → isi | `mt-8`/`mt-10` | 32/40px |
| Jarak antarkartu | `gap-2`–`gap-6` | 8–24px |
| Padding kartu | `p-5`/`p-6` | 20/24px |

Untuk mengubah jarak antarsection seluruh situs, edit `.section` di `globals.css`.

### 7.2 Tap target (area sentuh)

Standar situs ini: **minimal 44px (2.75rem)** untuk semua elemen interaktif di mobile. Pola yang dipakai:

```tsx
className="min-h-11 ..."      /* 2.75rem = 44px */
```

Elemen yang sudah memenuhi (jangan dikecilkan):

- Tab Kabar & tab Sejarah: `min-h-11`.
- Tombol tabel (`.tables-tab`): `min-height: 2.75rem`.
- Tombol info peta (`.map-info-button`): 2.75rem × 2.75rem.
- Select zona & toggle countdown: `min-height: 2.75rem`.
- Tombol hero: `.btn` `min-height: 2.9rem`.
- Trigger CardNav: tinggi bar 60px − inset 8px × 2 = 44px.
- Tautan panel CardNav (mobile): `padding: 12px 0` ≈ 44px.
- Tautan sumber di Tentang & link Tentang di footer: `min-h-11`.

### 7.3 Z-index (urutan tumpukan)

| Elemen | z-index |
|---|---|
| Skip link | 100 |
| MotionIntro (overlay) | 100 |
| Header sticky | 50 |
| Panel CardNav | 10 (di dalam header) |

Jika menambah elemen melayang baru, pilih z-index di antara lapisan ini.

### 7.4 Tinggi viewport dan footer

- `.site-shell` (di `globals.css`): `min-height: 100vh` dengan fallback `100dvh` — halaman selalu mengisi layar.
- `main`: `flex: 1 1 auto` — footer selalu di dasar, tidak ada ruang kosong setelahnya.
- Jangan menambah elemen setelah `<Footer>` di `SiteShell.tsx`.

### 7.5 Offset anchor (scroll-margin)

Section dan anchor memakai `scroll-mt-24` (96px) agar judul tidak tertutup header sticky (~76px) saat di-scroll. Jika tinggi header berubah banyak, sesuaikan nilai `scroll-mt-*` ini.

## 8. Warna dan token

Token ada di `src/app/globals.css` bagian `@theme`:

```css
--color-navy: #1c469f;
--color-navy-deep: #1a2c6f;
--color-ocean: #195c8d;
--color-gold: #ca9a00;
--color-gold-light: #e1b01a;
--color-kelor: #6dbc25;
--color-kelor-deep: #009c49;
--color-bg: #ffffff;
--color-bg-soft: #f0f3f8;
--color-surface: #ffffff;
--color-ink: #1a2138;
--color-ink-soft: #525b73;
--color-line: #dde3ee;
```

Mengubah token akan mengubah seluruh situs. Gunakan warna resmi dari identitas visual (navy, emas, kelor). Emas untuk teks kecil sebaiknya memakai `--color-gold-text` agar kontras.

Gradient khusus: `--grad-gold`, `--grad-navy`, `--grad-soft`, dan `--gt-c1…c4` (gradient teks). Latar section memakai tiga lapis: `--color-bg` (dasar), `--color-bg-soft` (section selang-seling), `--color-surface` (kartu/panel).

## 9. Tema gelap/terang

- Tombol: `src/components/theme/ThemeToggle.tsx`.
- State: `src/components/theme/useTheme.ts`.
- Token gelap: `src/app/globals.css` bagian `[data-theme="dark"]`.
- Script awal: `src/app/layout.tsx` (`theme-init`).
- Logo otomatis: `src/components/theme/BrandLogo.tsx`.

Cara mengubah warna gelap:

1. Cari `[data-theme="dark"]` di `globals.css`.
2. Ubah `--color-bg`, `--color-bg-soft`, `--color-surface`, `--color-ink`, `--color-ink-soft`, `--color-line`.
3. Untuk warna teks brand di atas permukaan gelap, ubah aturan `.text-navy`, `.text-ocean`, `.text-gold-text`, `.text-kelor-deep`.
4. Uji di `/`, `/en`, `/ar`.

Aturan khusus gelap yang perlu dijaga pasangannya: `.map-land`/`.map-country--*`/`.map-label`, `.tables-tab.is-active`, `.calendar-cell--event`/`--milestone`, `.motion-intro*`, `.about-back`. Setiap perubahan token terang yang berdampak kontras harus diperiksa pasangan gelapnya.

Tema disimpan di `localStorage` dengan kunci `m114:theme`. Jika tidak ada, mengikuti `prefers-color-scheme`.

## 10. Section collapsible dan navigasi anchor

### 10.1 Dua jenis section

| Jenis | Section | Komponen |
|---|---|---|
| Collapsible (tertutup default, judul sebagai tombol) | `#tentang`, `#agenda`, `#peta`, `#sejarah` | `CollapsibleSection` |
| Statis (selalu terbuka) | `#layanan` (dengan `#kabar` di dalamnya) | `ServicesSection` |
| Anchor langsung | `#countdown` (di Hero) | `Hero.tsx` |

### 10.2 Mengubah section collapsible

Bungkus konten dengan `CollapsibleSection`:

```tsx
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";

<CollapsibleSection
  id="agenda"                       // id anchor = hash URL
  title={dict.agenda.title}         // judul besar + GradientText + chevron
  description={dict.agenda.description} // opsional
  className="bg-bg-soft"            // opsional: latar section
  defaultOpen={false}               // ubah ke true agar terbuka sejak awal
>
  ...isi...
</CollapsibleSection>
```

Animasi buka/tutup memakai `grid-template-rows` (0fr → 1fr) di `collapsible-section.css`. Panel tertutup diberi `aria-hidden` + `inert` agar tidak bisa di-Tab.

Untuk menjadikan section statis (selalu terbuka) seperti Layanan: jangan pakai `CollapsibleSection`; render `<section id="..." className="section scroll-mt-24">` + `<h2 className="section-title"><GradientText block start animationSpeed={13}>{judul}</GradientText></h2>` + isi.

### 10.3 Alur "klik link → section terbuka → scroll"

Alur ini penting bagi menu CardNav, tombol hero, dan tautan apapun berawalan `#`:

1. Klik ditangkap `AnchorLink` (tautan biasa) atau `onLinkClick` Navbar (CardNav).
2. Keduanya memanggil `scrollToAnchor(hash)` di `src/lib/anchor.ts` — **tidak** mengandalkan `hashchange`, jadi klik hash yang sama berulang tetap bekerja.
3. `scrollToAnchor` menulis hash ke URL (`pushState`), lalu:
   - Target **di luar** `.collapsible` (mis. `#countdown`, `#layanan`, `#kabar`) → langsung `scrollIntoView` halus.
   - Target **di dalam** `.collapsible` (mis. `#sejarah`) → kirim event kustom `site:anchor-navigation`.
4. `CollapsibleSection` menerima event, membuka panelnya, menunggu `transitionend` (`grid-template-rows`), lalu scroll ke target. Fallback timer 700ms menjaga bila transisi tidak terpicu. `prefers-reduced-motion` → scroll instan.

Jika menambah section collapsible baru, tidak ada yang perlu didaftarkan — mekanisme otomatis mencari `id` target dan memeriksa `closest('.collapsible')`.

Jangan mengganti alur ini dengan `setTimeout` rapuh atau `href="#..."` telanjang tanpa `AnchorLink`.

## 11. Bahasa dan RTL

### 11.1 Rute

- `/` — Indonesia.
- `/en` — Inggris.
- `/ar` — Arab.

File halaman: `src/app/page.tsx`, `src/app/en/page.tsx`, `src/app/ar/page.tsx`.

### 11.2 Menambah/mengubah terjemahan

1. Buka `src/i18n/types.ts` untuk melihat struktur.
2. Edit `id.ts`, `en.ts`, `ar.ts` pada kunci yang sama.
3. Untuk konten panjang, edit file `src/data/*.en.ts` dan `*.ar.ts`.
4. Jalankan `npm run typecheck`; TypeScript akan memberi tahu jika ada kunci yang hilang.

### 11.3 RTL Arab

- `ar.ts` memiliki `dir: "rtl"`.
- `SiteShell` memberi `dir` dan `lang` pada pembungkus.
- `LocaleEffect` memperbarui `<html lang>` dan `<html dir>`.
- `languagePath()` menghasilkan `/`, `/en`, `/ar`.
- Panah/dll yang perlu dibalik memakai `rtl:rotate-180` atau `[dir="rtl"]` di CSS (contoh: `.card-nav__arrow`).

Jika menambah bahasa baru:

1. Tambah kode di `LanguageCode` (`src/i18n/types.ts`).
2. Buat file kamus baru.
3. Daftarkan di `src/i18n/index.ts`.
4. Buat halaman `src/app/<kode>/page.tsx`.
5. Tambah ke `LanguageSwitcher`, `sitemap`, dan metadata `alternates`.
6. Tentukan `dir` dan font yang sesuai.

### 11.4 Verifikasi Arab

Terjemahan Arab dibuat sebagai draf. Sebelum submit, minta penutur asli memeriksa `TRANSLATION-REVIEW.md`. Perhatikan istilah, harakat, dan arah teks.

## 12. Peta dunia

- Data negara: `src/data/pcim.ts`.
- Geometri: `world-atlas` (Natural Earth, ISC).
- Proyeksi: `d3-geo` (`geoNaturalEarth1`).
- Konversi TopoJSON: `topojson-client`.

Menambah negara:

1. Tambah objek di `pcimCountries`.
2. Isi `iso` numerik, `lat`, `lng`, dan nama 3 bahasa.
3. Jalankan `npm run typecheck` dan `npm run build`.
4. Cek jumlah highlight: buka `/`, scroll ke `#peta`. Jumlah path PCIM dan marker harus sama dengan jumlah data.
5. Diedit dari halaman resmi Cabang Istimewa Muhammadiyah; daftar 29 PCIM divalidasi terhadap halaman tersebut.

Mengganti sumber peta:

- Ganti import `world-atlas/countries-110m.json` di `WorldMap.tsx`.
- Pastikan struktur TopoJSON memiliki `objects.countries`.
- Sesuaikan `normalizeIso()` jika `id` bukan numerik.

## 13. Animasi

### 13.1 Animated content (GSAP)

- Komponen: `src/components/animation/AnimatedContent.tsx` (GSAP + ScrollTrigger) dan wrapper `src/components/animation/Reveal.tsx`.
- Default Reveal: `distance=48`, `duration=0.8`, `ease="power3.out"`, `threshold=0.12`, `direction="vertical"`, `reverse=false`, `blur=false`, `wipe=false`, `stagger=0.08`, `scale=1`, `trigger="once"` (diputar **sekali** per elemen, tidak mengulang saat scroll naik), `triggerOnMount=false`.
- Wrapper memakai atribut `data-animated-content` dengan `visibility: hidden` awal di `globals.css`; ScrollTrigger menampilkan dan menganimasikannya.
- Fallback tanpa JS: aturan `@media (scripting: none)` di `globals.css` dan `<noscript>` di `layout.tsx` memaksa semua konten terlihat.
- Reduced motion: konten langsung tampil tanpa animasi.
- Scope: section dan konten utama saja. Navbar, Footer, MotionIntro, `not-found.tsx`, timeline sejarah, tabel, kalender, dan tab kabar tidak dianimasikan.

Menambah animasi:

```tsx
import { Reveal } from "@/components/animation/Reveal";

<Reveal>...</Reveal>
```

Menghapus animasi: hapus pembungkus `<Reveal>` (elemen tanpa wrapper tidak dianimasikan).

### 13.2 Timeline sejarah

Desktop memakai progres garis berbasis scroll (`motion/react` di `src/components/ui/timeline.tsx`): `useScroll` pada pembungkus, `useTransform` memetakan `0–1` ke tinggi garis `0%–100%`. Tidak ada pengukuran tinggi dan tidak ada `setState` dalam efek. Mobile memakai `<details>` tanpa animasi khusus.

Jika ingin mengubah warna garis, ubah gradient inline di `src/components/ui/timeline.tsx` (emas `#ca9a00` → navy `#1c469f`).

### 13.3 Countdown

- `src/components/home/Countdown.tsx`.
- Target tanggal di `src/data/site.ts` (`startISO`, `endISO`, `miladISO`).
- Label di `dict.countdown`.

**Logika zona waktu (penting):** batas fase hitungan (buka acara, selesai acara, tengah malam Milad, maghrib Ramadhan) **tidak terkunci WITA**. Tanggal pada `SITE.*` dan `RAMADAN_TARGETS` dibaca sebagai *jam dinding acuan* (WITA = wilayah acuan KHGT), lalu dipetakan ke zona waktu aktif lewat `zonedWallClockToInstant()` — sehingga pergantian hari/fase terjadi pada jam yang sama dengan jam dinding acuan **di zona pengguna**:

- Zona aktif diambil otomatis dari zona perangkat pengunjung bila ada di daftar `TIMEZONES` (`src/data/timezones.ts`); jika tidak ada di daftar (mis. `Africa/Tripoli`), fallback ke `DEFAULT_TIMEZONE` (WITA).
- Pengunjung tetap bisa mengganti zona lewat select di kanan atas hitungan; batas fase langsung mengikuti zona yang dipilih.
- Contoh: target buka acara "19 Nov 2026, 08.00" — pengunjung WITA melihat hitungan habis pukul 08.00 WITA, pengunjung WIB pukul 08.00 WIB (bukan 05.00 WIB seperti logika instant-tetap lama).
- Konversi jam dinding → instant memakai iterasi `Intl.DateTimeFormat.formatToParts` (maks. 3 langkah, stabil di zona ber-DST); tanpa library baru.

### 13.4 Prinsip animasi

- Semua animasi masuk dari bawah ke atas, bukan dari samping, kecuali panah.
- Hormati `prefers-reduced-motion`.
- Uji di ponsel kelas menengah; hindari animasi berat.

### 13.5 Motion logo intro

Komponen: `src/components/intro/MotionIntro.tsx`.
Aset: `public/media/intro/`.
Pemicu awal: `data-intro` yang diatur oleh script di `src/app/layout.tsx`.

**Status default: aktif setiap refresh.** Video motion logo dan situs sama-sama memakai **19–21 November 2026 / 10–12 Jumadilakhir 1448 H**.

Catatan aset: logo statis di folder sumber (`HORIZONTAL-...-01/02/03`) masih mencantumkan **13–15 November 2026**. Karena itu `public/logo/horizontal-color-1921.png` dan `horizontal-white-1921.png` diturunkan dari **frame motion logo 19–21**, bukan dari PNG statis tersebut. Footer memakai logogram putih tanpa tanggal.

Perilaku intro:

- Refresh penuh (F5, Ctrl+R, Ctrl+Shift+R) → intro tampil lagi.
- Navigasi internal antar-anchor atau antar-bahasa → tidak tampil ulang, karena setelah intro selesai `MotionIntro` mengubah `document.documentElement.dataset.intro` menjadi `skip`.
- `prefers-reduced-motion` dan `saveData` otomatis melewati intro.
- Desktop memakai video horizontal; ponsel memakai vertikal.
- Mode terang memakai varian `light`; mode gelap `dark`.
- Video 5 detik, muted, autoplay, `playsInline`.
- Tombol "Lewati intro" selalu tersedia; tombol Escape juga menutup.
- Body scroll dikunci selama intro.

Jika ingin opsi "sekali per sesi" (intro hanya tampil sekali hingga tab ditutup), itu memerlukan penambahan `sessionStorage` secara manual di `themeScript` (`src/app/layout.tsx`) dan `MotionIntro.tsx`; default proyek sekarang **setiap refresh**.

Mengganti video:

- Timpa file dengan nama yang sama:
  - `horizontal-light.mp4`
  - `horizontal-dark.mp4`
  - `vertical-light.mp4`
  - `vertical-dark.mp4`
  - poster `.jpg` dengan nama yang sama.
- Video yang dipakai sudah dikompres: 131–157 KB; poster 112–204 KB.
- Jika membuat ulang dari sumber 3124×1440 / 1242×1596, gunakan H.264, `-crf 27`, `-preset slow`, `-an`, `-movflags +faststart`.

Menonaktifkan total:

- Hapus `<MotionIntro dict={dict} />` dari `src/components/pages/SiteShell.tsx`, atau biarkan default `skip`.

Catatan merek:

- Video, situs, logo horizontal, dan OG sekarang sama-sama 19–21.
- Logo statis di folder sumber masih 13–15; jangan memakainya untuk hero/OG.
- Jangan mengubah teks/tanggal di dalam video resmi.
- Jika nanti tersedia logo statis resmi 19–21 (PNG/vektor), ganti `horizontal-color-1921.png`, `horizontal-white-1921.png`, dan OG dengan aset resmi tersebut.
- `prepare:assets` mengambil logo horizontal/OG dari PNG statis 13–15; jangan jalankan setelah penyelarasan 19–21 kecuali script diperbarui.

## 14. Data dinamis

### 14.1 Kabar

- Sumber: WP REST API `muhammadiyah.or.id`.
- Kode: `src/lib/kabar.ts`.
- Cache: `use cache` + `cacheLife("hours")`.
- Fallback: `src/data/kabar-fallback.json`.
- Perbarui fallback:

```bash
npm run sync:kabar
```

### 14.2 Kalender

- Sumber: `khgt.muhammadiyah.or.id`.
- Snapshot: `src/data/khgt-2026.json`.
- Kode: `src/lib/khgt.ts`.
- Perbarui snapshot:

```bash
npm run sync:khgt
```

Jangan memakai library hijriah generik; data KHGT adalah acuan.

### 14.3 Hitungan Ramadhan

- Kode: `src/components/home/Countdown.tsx` (konstanta `RAMADAN_TARGETS`).
- Tombolnya adalah judul hitungan itu sendiri; klik untuk berganti mode Tanwir-Milad ke Ramadhan dan sebaliknya.
- Jika KHGT menerbitkan tanggal baru, perbarui isi `RAMADAN_TARGETS` (format ISO `+08:00`, jam perkiraan maghrib 18.00; offset dilepas otomatis dan dipetakan ke zona waktu aktif pengguna — lihat bagian 13.3) dan ketiga kamus (`countdown.ramadhan`). Jangan mengarang tanggal tanpa KHGT.

## 15. Rute, QR, dan metadata

Payload QR gerbang bahasa:

```text
Indonesia : https://milad114-palu.vercel.app/
English   : https://milad114-palu.vercel.app/en
Arab      : https://milad114-palu.vercel.app/ar
```

- Jangan memakai URL preview Vercel.
- Setelah domain final, jangan mengganti nama project.
- Anchors: `#tentang`, `#agenda`, `#peta`, `#sejarah`, `#layanan`, `#kabar`, `#countdown`.
- Metadata per bahasa: `src/lib/metadata.ts`.
- Sitemap: `src/app/sitemap.ts`.
- Robots: `src/app/robots.ts`.

## 16. Menjalankan dan deploy

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

## 17. Troubleshooting

**Build error "Cannot find module src/app/sejarah/page.js"**
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
Pastikan elemen dibungkus `<Reveal>` dari `src/components/animation/Reveal.tsx`. Jika JS nonaktif, fallback `@media (scripting: none)` menampilkan semuanya begitu saja.

**Terjemahan TypeScript error**
Bandingkan struktur `id.ts`, `en.ts`, `ar.ts`. Semua kunci harus sama.

**Klik link menu tidak membuka section**
Pastikan tautan memakai `AnchorLink` (atau lewat `onLinkClick` CardNav), target punya `id` yang cocok, dan section target memakai `CollapsibleSection` (untuk target di dalamnya, mis. `#kabar`). Periksa event `site:anchor-navigation` di DevTools.

**Judul tertutup header saat klik anchor**
Pastikan elemen target memakai `scroll-mt-24`. Jika header lebih tinggi dari semula, naikkan nilainya (`scroll-mt-28` dst.).

**Muncul ruang kosong setelah footer**
Pastikan tidak ada elemen setelah `<Footer>` di `SiteShell.tsx`, `.site-shell` masih `flex flex-col` dengan `min-height: 100vh/100dvh`, dan `main` memakai `flex: 1 1 auto`.

**Font terlalu kecil/besar setelah edit**
Periksa apakah Anda mengubah `clamp()` di `.section-title`/`.collapsible__title` tanpa menyamakan keduanya, atau menimpa dengan `text-*` Tailwind di JSX. Ukuran minimal label: 0.72rem.

## 18. Checklist edit

- [ ] Teks di tiga bahasa sudah sinkron.
- [ ] Tanggal dan angka sudah diverifikasi.
- [ ] Logo terang/gelap benar; logo header tidak berubah.
- [ ] Gambar OG 1200×630.
- [ ] Favicon 512×512.
- [ ] Tidak ada `bg-white` yang membuat kartu terang di mode gelap.
- [ ] Anchor `#tentang`, `#agenda`, `#peta`, `#sejarah`, `#layanan`, `#kabar`, `#countdown` ada.
- [ ] Ukuran `.section-title` dan `.collapsible__title` masih sama.
- [ ] Hierarki judul: Hero > judul section > sub-judul > body.
- [ ] Semua tombol/tautan tap target ≥ 44px di mobile.
- [ ] Layanan selalu terbuka; Footer elemen terakhir tanpa ruang kosong.
- [ ] Peta menampilkan jumlah negara yang benar.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` lolos.
- [ ] Uji `/`, `/en`, `/ar` di 320 px, 390 px, 768 px, 1366 px, 1920 px.
- [ ] Uji mode terang dan gelap.
- [ ] Uji klik semua link menu CardNav (section terbuka + scroll tepat).
- [ ] Uji QR dari layar dan cetak.
