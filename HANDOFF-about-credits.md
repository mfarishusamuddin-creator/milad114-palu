# HANDOFF — Halaman Tentang: Kredit, Kontak, Lukisan, Sumber, Copyright

Tanggal: 4 November 2026
Lingkup: halaman Tentang (`/tentang`, `/en/tentang`, `/ar/tentang`), data kredit, i18n terkait, aset foto profil, JSON-LD `VisualArtwork`.
Tidak menyentuh: `Hero.tsx`, MotionIntro, `MapSection`/`WorldMap`, `Footer.tsx`, `site.ts`, route `/l`, QR, analytics, OG, `SectionHeading`, `SiteShell`.

## 1. File

### Baru

| File | Isi |
|---|---|
| `src/data/credits.ts` | Tipe `CreditLinkKind`, `CreditLink`, `Credit`; array `credits` (pelukis + pengembang); subjek email dan pesan WhatsApp di-encode sekali di sini. |
| `src/components/about/CreditsSection.tsx` | Client component: dua kartu kredit, tombol Kontak gaya burger, panel kontak accordion (satu panel terbuka), `inert` + `aria-hidden` saat tertutup, ikon Hugeicons. |
| `src/components/about/about-credits.css` | Gaya kartu, tombol, panel (`grid-template-rows` 0fr→1fr + opacity), ikon burger→X, reduced motion. |
| `public/media/credits/ghusan-azry.webp` | Foto profil pelukis, 360 × 360 px, 23.312 byte (≈23 KB). |

### Diubah

| File | Perubahan |
|---|---|
| `src/components/pages/AboutPage.tsx` | Urutan baru: `CreditsSection` → Tentang lukisan → Sumber Informasi → Aset & lisensi → copyright ganda. Label section 0,8 rem, ikon eksternal 15 px. `aria-label` sumber & lisensi menyebut “buka di tab baru”. JSON-LD `VisualArtwork` + escape `<`. |
| `src/i18n/types.ts` | Tambahan `aboutPage.creditsTitle`, `contact`, `opensInNewTab`, `channels`, `artwork`, `assets`. |
| `src/i18n/id.ts` | String ID baru + copyright ganda. |
| `src/i18n/en.ts` | String EN baru + copyright ganda. |
| `src/i18n/ar.ts` | String AR baru + copyright ganda. |

Tidak ada dependency baru. `Footer.tsx` dan OG tidak diubah.

## 2. Data kredit

### Muhammad Ghusan Azry — pelukis
- Nama: ID/EN `Muhammad Ghusan Azry`, AR `محمد غسان أزري`.
- Role: `Pelukis` / `Painter` / `الفنان`.
- Foto: `/media/credits/ghusan-azry.webp`, 360 × 360, alt `Muhammad Ghusan Azry`.
- Email: `ghusanazri@gmail.com` (`mailto:` + `?subject=Milad%20114`).
- WhatsApp: `https://wa.me/6282130824037?text=…` dengan pesan `Assalamu'alaikum, saya menghubungi dari situs Milad 114.` (ter-encode).
- Instagram: `https://www.instagram.com/ghusanazry21/` (handle `@ghusanazry21` untuk `title`).
- Facebook: `https://www.facebook.com/muhammadghusanazry`.

### Faris Husamuddin — pengembang
- Nama: ID/EN `Faris Husamuddin`, AR `فارس حسام الدين`.
- Role: `Pengembang & Desainer Web` / `Web Developer & Designer` / `مطور ومصمم ويب`.
- Tanpa foto. Avatar berupa lingkaran hitam penuh 88 px (dekoratif, `aria-hidden`) agar tinggi kartu seimbang dengan kartu pelukis; tanpa monogram atau inisial.
- Email: `faras.hasamaddan@gmail.com` (`mailto:` + `?subject=Milad%20114`).
- Instagram: `https://www.instagram.com/faris_husamuddin/` (handle `@faris_husamuddin`).
- Facebook: `https://www.facebook.com/faris.husamuddin.1`.
- LinkedIn: `https://www.linkedin.com/in/faris-husamuddin-357663326/`.

Masing-masing kartu berisi tepat 4 kanal (grid 2 × 2). Teks tombol selalu nama platform; email/WhatsApp tidak menampilkan alamat/nomor. `target="_blank"`, `rel="noopener noreferrer"`, dan `aria-label` berisi platform, nama orang, serta frasa “buka di tab baru” sesuai bahasa.

## 3. Foto profil

- Sumber: `Profile/WhatsApp Image 2026-11-04 at 09.16.00.jpeg` (963 × 1280).
- Proses: crop persegi 360 × 360 pada `x=267, y=870` (kepala + bahu, subjek di tengah), resize Lanczos, encode WebP kualitas 88 via `ffmpeg`.
- Tidak ada AI edit/beautify, tidak ada retouch. File akhir 23 KB.
- Jika kelak perlu diganti, timpa `public/media/credits/ghusan-azry.webp` dengan crop persegi 320–400 px; jangan ubah `width`/`height` di `credits.ts` kecuali ukurannya berubah.

## 4. Perilaku UI

- Grid kartu 2 kolom ≥640 px, 1 kolom di mobile (`items-start`, tinggi kartu mengikuti isi).
- Tombol Kontak: `aria-expanded`, `aria-controls`, `aria-label` “Kontak — nama”; tinggi 44 px; ikon burger tiga garis berubah menjadi X.
- Panel: transisi `grid-template-rows` + `opacity`; `prefers-reduced-motion` mematikan transisi. Saat tertutup: `inert` + `aria-hidden="true"`, sehingga tautan tidak bisa di-Tab.
- Hanya satu panel terbuka: state `openId` di `CreditsSection`; membuka kartu lain menutup yang sebelumnya, klik tombol yang sama menutup panel.
- Semua tautan kanal minimal 44 px; focus ring memakai aturan global `:focus-visible` (emas).
- RTL: grid dan flex mengikuti `dir="rtl"`; panah tautan karya memakai `rtl:rotate-180`.

## 5. Tentang lukisan

- Thumbnail: `/media/hero/hero-artwork-hi.webp` (2063 × 2952), `next/image`, `loading="lazy"`, `alt` “Lukisan KH. Ahmad Dahlan karya Muhammad Ghusan Azry”.
- Judul: `KH. Ahmad Dahlan`; ukuran `98,5 × 78,5 cm` (ID), `98.5 × 78.5 cm` (EN), `98.5 × 78.5 سم` (AR); tahun `2026`.
- Kredit kecil: `Karya: Muhammad Ghusan Azry.`
- Tautan `Lihat karya interaktif` → `languagePath(dict.lang)` (beranda bahasa aktif), bukan viewer baru.
- Tidak ada statement, media tambahan, atau catatan publikasi/penjurian.

## 6. Sumber, aset, copyright

- Daftar Sumber Informasi tetap 12 baris; label section 0,8 rem; ikon eksternal 15 px; seluruh baris tetap satu tautan; `aria-label` menyebut “buka di tab baru”.
- Aset & lisensi:
  - Font El Messiri → `/licenses/OFL-ElMessiri.txt` (SIL Open Font License).
  - Font Familjen Grotesk → `/licenses/OFL-FamiljenGrotesk.txt` (SIL Open Font License).
  - Peta dunia → `https://github.com/topojson/world-atlas` (Natural Earth / world-atlas, ISC).
  - Logo Milad tidak diduplikasi (sudah ada di Sumber Informasi).
- Copyright:
  - ID: `Lukisan © 2026 Muhammad Ghusan Azry · Antarmuka digital © 2026 Faris Husamuddin`
  - EN: `Painting © 2026 Muhammad Ghusan Azry · Digital interface © 2026 Faris Husamuddin`
  - AR: `اللوحة © 2026 محمد غسان أزري · الواجهة الرقمية © 2026 فارس حسام الدين`

## 7. JSON-LD

`VisualArtwork` dirender di halaman Tentang (ketiga bahasa), `<` di-escape menjadi `\u003c`:

```json
{
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  "name": "KH. Ahmad Dahlan",
  "creator": {
    "@type": "Person",
    "name": "Muhammad Ghusan Azry",
    "sameAs": [
      "https://www.instagram.com/ghusanazry21/",
      "https://www.facebook.com/muhammadghusanazry"
    ]
  },
  "dateCreated": "2026",
  "size": "98,5 × 78,5 cm",
  "image": "https://milad114-palu.vercel.app/media/hero/hero-artwork-hi.webp",
  "inLanguage": "id"
}
```

`size` dan `inLanguage` mengikuti bahasa halaman; `sameAs` dibaca dari `credits.ts` (bukan string ganda). Tidak ada `artMedium` atau field karangan. OG dan tombol share tidak ditambah.

## 8. Hasil uji

Perintah (dijalankan dari root proyek):

| Perintah | Hasil |
|---|---|
| `npm run lint` | 0 error; 12 warning lama di `src/Contoh Timeline.tsx` (`no-img-element`), tidak terkait perubahan ini. |
| `npm run typecheck` | Lolos tanpa error. |
| `npm run build` | Lolos; 11 halaman statis, termasuk `/tentang`, `/en/tentang`, `/ar/tentang`. |

Uji browser (dev server lokal, halaman ID/EN/AR):

- Dua kartu tampil; pelukis memakai foto 88 px bulat; Faris memakai lingkaran hitam dekoratif 88 px tanpa monogram/inisial.
- Panel tertutup: `aria-expanded="false"`, `inert`, `aria-hidden="true"`, tinggi baris 0 px.
- Klik/tombol keyboard: `aria-expanded="true"`, `inert` hilang, panel terbuka; Tab dari tombol masuk ke tautan Email (bukan kartu berikutnya).
- Membuka kartu kedua menutup kartu pertama (hanya satu `aria-expanded="true"`).
- Semua tautan kanal berukuran 44 px; `href` email memakai subjek `Milad%20114`; WhatsApp memakai pesan ter-encode.
- `aria-label` kanal: `Email — Muhammad Ghusan Azry — buka di tab baru` (ID), `… opens in a new tab` (EN), `… يفتح في تبويب جديد` (AR).
- `title` handle hanya pada Instagram; tidak ada alamat email/nomor WhatsApp sebagai teks.
- Layout RTL `/ar/tentang` rapi: kartu, tombol, panel 2 × 2, thumbnail, dan panah mengikuti arah kanan-ke-kiri.
- Mode terang dan gelap diuji; warna memakai token (`surface`, `bg-soft`, `line`, `ink`, `ink-soft`, `ocean`) tanpa `bg-white`/shadow berat.
- JSON-LD `VisualArtwork` ditemukan di DOM dan field-nya sesuai; tidak ada error console.

Catatan: rename `credits-section.css` → `about-credits.css` sempat memicu error module-not-found di dev server yang sedang berjalan; setelah import diperbarui, typecheck/lint/build dijalankan ulang dan semuanya lolos. Tidak ada perubahan pada `Hero.tsx`/`Navbar.tsx` (keduanya sudah termodifikasi sebelum tugas ini).
