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
  tentang/page.tsx        halaman Tentang Indonesia (/tentang)
  en/tentang/page.tsx     halaman Tentang Inggris (/en/tentang)
  ar/tentang/page.tsx     halaman Tentang Arab (/ar/tentang)
  globals.css             seluruh token warna, tema gelap, layout, animasi
  sitemap.ts              daftar URL
  robots.ts               aturan crawler
  icon.png                favicon
src/components/
  pages/SiteShell.tsx     navbar + footer + locale
  pages/HomePage.tsx      urutan seluruh section di satu index
  pages/AboutPage.tsx     halaman Tentang (sumber, aset/lisensi, catatan data, hak cipta)
  layout/Navbar.tsx       header: logo + nama satu baris, ThemeToggle, CardNav
  layout/Footer.tsx       footer ringkas (brand, jelajahi, acara)
  layout/LanguageSwitcher.tsx
  layout/LocaleEffect.tsx
  theme/ThemeToggle.tsx
  theme/BrandLogo.tsx     logo terang/gelap otomatis
  theme/useTheme.ts
  home/Hero.tsx
  home/AboutMilad.tsx
  home/Agenda.tsx
  history/HistorySection.tsx
  history/HistoryTimeline.tsx
  history/HistoryTables.tsx
  ui/timeline.tsx         timeline Aceternity (adaptasi, dipakai desktop)
  services/ServicesSection.tsx
  services/HijriCalendar.tsx
  services/KabarTabs.tsx
  map/MapSection.tsx
  map/WorldMap.tsx
  shared/                 komponen kecil (KabarCard, dll.)
  shared/CardNav.tsx      menu kartu ReactBits (adaptasi) untuk header
  shared/card-nav.css     gaya CardNav + mode compact + slot footer
  shared/CountUp.tsx      animasi angka ReactBits (stempel hero 114, statistik peta 29)
  shared/Counter.tsx      mesin angka Counter ReactBits (dipakai Countdown)
src/i18n/
  types.ts                tipe Dictionary
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
  licenses/               lisensi font
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
- `nav` — header: `cards` (menu kartu CardNav), `about`, `menuAria`/`menuOpen`/`menuClose`, CTA, tautan footer.
- `hero` — hero, plate logo, tombol, bahasa.
- `countdown` — label hitung waktu.
- `about` — section Tentang Milad.
- `aboutPage` — halaman Tentang (sumber, aset/lisensi, catatan data, hak cipta).
- `agenda` — agenda dan pilar.
- `history` — judul/label sejarah.
- `services` — judul/label layanan.
- `calendar` — semua label kalender, nama bulan, hari, event.
- `kabar` — label kabar.
- `map` — judul peta, label markas, tombol info.
- `footer` — footer ringkas.
- `notFound` — halaman 404.

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
- `sources` di `HistorySection` menunjuk halaman resmi Muhammadiyah.
- Judul/label section ada di `dict.history` (tiga file bahasa).

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
| `public/logo/horizontal-color-1921.png` | Hero/plate mode terang (frame motion 19–21) |
| `public/logo/horizontal-white-1921.png` | Hero/plate mode gelap (frame motion 19–21) |
| `public/logo/logogram-color.png` | Navbar mode terang, favicon |
| `public/logo/logogram-white.png` | Navbar mode gelap, footer |
| `public/logo/vertical-color.png` | Cadangan/OG vertikal; masih versi 13–15, tidak dipakai |

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

Dipakai di hero, section tentang, dan footer. Ganti dengan gambar pattern resmi; jaga rasio dan warna. Jika mengganti, buat juga versi WebP agar ringan.

### 4.3 Gambar Open Graph

- `public/og/og-milad114-1921.jpg`
- `public/og/og-milad114-1921.png`

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
<AboutMilad dict={dict} />
<Agenda dict={dict} />
<MapSection dict={dict} />
<HistorySection dict={dict} />
<ServicesSection dict={dict} latest={latest} milad={milad} />
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

Mengubah token akan mengubah seluruh situs. Gunakan warna resmi dari identitas visual (navy, emas, kelor). Emas untuk teks kecil sebaiknya memakai `--color-gold-text` agar kontras; colocated `--color-ocean` menggantikan teal lama.

### 5.4 Sudut, bayangan, dan border

- `rounded-sm` dipakai untuk panel utama.
- `border-line` adalah garis standar.
- `shadow-soft` ada di token.
- Hindari menambah `rounded-3xl` atau bayangan besar; gaya situs ini editorial dan datar.

### 5.5 Navbar dan footer

- `src/components/layout/Navbar.tsx` — header sticky: logo + nama situs satu baris, `ThemeToggle`, dan `CardNav` (mode compact). Tautan jalur, CTA `#sejarah`, pemilih bahasa, dan tautan “Tentang” hidup di dalam panel CardNav (slot footer) — bukan di header.
- `src/components/shared/CardNav.tsx` + `card-nav.css` — menu kartu (adaptasi ReactBits). Tema panel mengikuti token terang/gelap otomatis. Label menu diambil dari `dict.nav.menuOpen/menuClose`; kartu dari `dict.nav.cards`.
- `src/components/layout/Footer.tsx` — footer ringkas tiga kolom (brand + tautan Tentang, jelajahi, acara). Sumber/kredit tidak ada di footer.
- `src/components/pages/SiteShell.tsx` — pembungkus navbar + main + footer.

Untuk menambah menu kartu di header:

1. Edit `dict.nav.cards` di tiga file bahasa (`label`, `description`, `links`).
2. Untuk tautan menuju halaman Tentang, pakai `about: true`; untuk anchor, pakai `anchor: "#…"`.
3. Pastikan `id` anchor ada di halaman (`#sejarah`, `#layanan`, `#peta`, dll.).

Untuk memperluas halaman Tentang: edit `dict.aboutPage` di tiga file bahasa dan `src/components/pages/AboutPage.tsx`. Sumber resmi diambil dari `SITE.links` (key cocok dengan `src/data/site.ts`).

### 5.6 Section sejarah

- `HistorySection.tsx` — header, timeline, tabel, CTA.
- `HistoryTimeline.tsx` — dua jalur (tabs desktop, accordion mobile), memakai `src/components/ui/timeline.tsx`.
- `HistoryTables.tsx` — tabel kepemimpinan dan AUM.
- Data: `src/data/history.ts` + `history.en.ts` + `history.ar.ts`.
- Mobile memakai `<details>`; desktop memakai tabs + timeline with scroll progress (`motion`).
- Daftar sumber sejarah kini hanya di halaman Tentang (`/tentang`), bukan di section ini.

### 5.7 Section layanan

- `ServicesSection.tsx` — kalender, penanda, kabar.
- `HijriCalendar.tsx` — kalender dan konverter (catatan snapshot + disclaimer; sumber KHGT hanya di halaman Tentang).
- `KabarTabs.tsx` — tab kabar (item tetap bertaut ke artikel aslinya).
- Anchor `#kabar` berada di dalam section ini.

### 5.8 Peta

- `MapSection.tsx` — header, statistik CountUp `29`, tombol “i” ke halaman Tentang (`aboutPath`).
- `WorldMap.tsx` — SVG peta dunia (client component): dot interaktif + label negara.
- Peta dirender full-bleed (rata ke tepi) di luar `container-page`.
- Interaksi label: hover/klik (mouse), fokus/Tab (`Enter`/`Space`) (keyboard), tap dot (sentuh); ketuk area kosong peta untuk menutup label.
- Karakter khusus: Indonesia (ISO `360`) berwarna beda (`.map-country--hq`) dengan marker di Yogyakarta dan label `.map-label--hq` yang selalu tampil.
- Untuk mengubah warna peta, cari `.map-country`, `.map-country--pcim`, `.map-country--hq`, `.map-label` di `globals.css`.
- Sumber data peta (PCIM page, Natural Earth, world-atlas) hanya tercantum di halaman Tentang.

## 6. Tema gelap/terang

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
2. Isi `iso` numerik, `lat`, `lng`, dan nama 3 bahasa.
3. Jalankan `npm run typecheck` dan `npm run build`.
4. Cek jumlah highlight: buka `/`, scroll ke `#peta`. Jumlah path PCIM dan marker harus sama dengan jumlah data.
5. Diedit dari halaman resmi Cabang Istimewa Muhammadiyah; daftar 29 PCIM divalidasi terhadap halaman tersebut.

Mengganti sumber peta:

- Ganti import `world-atlas/countries-110m.json` di `WorldMap.tsx`.
- Pastikan struktur TopoJSON memiliki `objects.countries`.
- Sesuaikan `normalizeIso()` jika `id` bukan numerik.

## 9. Animasi

### 9.1 Animated content (GSAP)

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

Menghapus animasi: hapus pembungkus `<Reveal>` (attrs tidak ada; elemen tanpa wrapper tidak dianimasikan).

### 9.2 Timeline sejarah

Desktop memakai progres garis berbasis scroll (`motion/react` di `src/components/ui/timeline.tsx`): `useScroll` pada pembungkus, `useTransform` memetakan `0–1` ke tinggi garis `0%–100%`. Tidak ada pengukuran tinggi dan tidak ada `setState` dalam efek. Mobile memakai `<details>` tanpa animasi khusus.

Jika ingin mengubah warna garis, ubah gradient inline di `src/components/ui/timeline.tsx` (emas `#ca9a00` → navy `#1c469f`).

### 9.3 Countdown

- `src/components/home/Countdown.tsx`.
- Target tanggal di `src/data/site.ts` (`startISO`, `endISO`, `miladISO`).
- Label di `dict.countdown`.

### 9.4 Prinsip animasi

- Semua animasi masuk dari bawah ke atas, bukan dari samping, kecuali panah.
- Hormati `prefers-reduced-motion`.
- Uji di ponsel kelas menengah; hindari animasi berat.

### 9.5 Motion logo intro

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
- Tombol “Lewati intro” selalu tersedia; tombol Escape juga menutup.
- Body scroll dikunci selama intro.

Jika ingin opsi “sekali per sesi” (intro hanya tampil sekali hingga tab ditutup), itu memerlukan penambahan `sessionStorage` secara manual di `themeScript` (`src/app/layout.tsx`) dan `MotionIntro.tsx`; default proyek sekarang **setiap refresh**.

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

### 10.3 Hitungan Ramadhan

- Kode: `src/components/home/Countdown.tsx` (konstanta `RAMADAN_TARGETS`).
- Tombolnya adalah judul hitungan itu sendiri; klik untuk berganti mode Tanwir-Milad ke Ramadhan dan sebaliknya.
- Jika KHGT menerbitkan tanggal baru, perbarui isi `RAMADAN_TARGETS` (format ISO `+08:00`, jam perkiraan maghrib 18.00 WITA) dan ketiga kamus (`countdown.ramadhan`). Jangan mengarang tanggal tanpa KHGT.

## 11. Rute, QR, dan metadata

Payload QR gerbang bahasa:

```text
Indonesia : https://milad114-palu.vercel.app/
English   : https://milad114-palu.vercel.app/en
Arab      : https://milad114-palu.vercel.app/ar
```

- Jangan memakai URL preview Vercel.
- Setelah domain final, jangan mengganti nama project.
- Anchors: `#tentang`, `#agenda`, `#peta`, `#sejarah`, `#layanan`, `#kabar`.
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
Pastikan elemen dibungkus `<Reveal>` dari `src/components/animation/Reveal.tsx`. Jika JS nonaktif, fallback `@media (scripting: none)` menampilkan semuanya begitu saja.

**Terjemahan TypeScript error**
Bandingkan struktur `id.ts`, `en.ts`, `ar.ts`. Semua kunci harus sama.

## 14. Checklist edit

- [ ] Teks di tiga bahasa sudah sinkron.
- [ ] Tanggal dan angka sudah diverifikasi.
- [ ] Logo terang/gelap benar.
- [ ] Gambar OG 1200أ—630.
- [ ] Favicon 512أ—512.
- [ ] Tidak ada `bg-white` yang membuat kartu terang di mode gelap.
- [ ] Anchor `#sejarah`, `#layanan`, `#peta`, `#kabar` ada.
- [ ] Peta menampilkan jumlah negara yang benar.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` lolos.
- [ ] Uji `/`, `/en`, `/ar` di 390 px, 768 px, 1440 px.
- [ ] Uji mode terang dan gelap.
- [ ] Uji QR dari layar dan cetak.


