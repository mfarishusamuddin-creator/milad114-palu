# HANDOFF — Hero Polish (setelah P8)

Status: **eksekusi tambahan** — belum divalidasi oleh pelaksana; pemilik akan
memvalidasi.

## 1. Berkas yang diubah/dibuat

| Berkas | Status | Keterangan |
|---|---|---|
| `public/media/hero/hero-artwork-hi.webp` | BARU | 2063 × 2952, 480.774 byte. Turunan resolusi tinggi dari `Hero Image/PXL_20261030_053757743.MP.jpg.jpeg`, pipeline P1 (rotasi, QUAD, color balance, gamma 1.20, kontras 1.04, crop 0.4%). WebP dipakai langsung oleh komponen (unoptimized). |
| `src/components/home/Hero.tsx` | DIUBAH | Layout hero memakai `hero-layout` (teks satu kolom + figure di kanan); urutan mobile title → figure → indeks → intro → CTA. |
| `src/components/home/HeroArtwork.tsx` | DIUBAH | Gambar memakai `hero-artwork-hi.webp` + `preload` + `unoptimized`; animasi gradien ring hanya saat preview/zoom; `data-active` untuk filter ring. |
| `src/components/home/hero-artwork.css` | DIUBAH | Grid layout, frame lebih tipis, chip/menu memakai token surface + shadow lembut, chip button kontras di tema gelap, RTL letter-spacing, mobile index menu membuka ke atas. |

## 2. Keputusan

1. **Resolusi zoom.** Sumber hero dinaikkan dari 1386 × 1984 ke 2063 × 2952
   (1.49×) memakai pipeline P1 dari raw yang sama. Koordinat hotspot tetap
   memakai ruang logis 1386 × 1984; `path` tidak berubah. `width`/`height`
   komponen tetap 1386/1984 (rasio), sumber gambar beresolusi tinggi.
2. **Preload sebelum intro.** `next/image` memakai `preload` + `unoptimized`
   agar file WebP resolusi tinggi masuk ke `<head>` dan mulai dimuat sebelum
   intro selesai. Tidak memakai `priority` (deprecated di Next 16).
3. **Layout.** Sebelumnya figure berada di row 1 grid dan mendorong intro/indeks
   ke bawah figure. Sekarang kolom teks mengalir natural (H1 → intro → indeks →
   CTA) dan figure berdiri di kolom kanan. Mobile memakai `display: contents`
   agar urutan title → figure → indeks → intro → CTA tanpa duplikasi markup.
4. **Integrasi visual.** Frame karya memakai border tipis + radius kecil
   (mount, bukan kartu); chip dan popover memakai `--color-surface` dan
   `--shadow-soft`; chip memakai aksen gold tipis; tombol chip memakai teks
   putih agar kontras di tema gelap; toggle indeks memakai bahasa tombol situs
   (uppercase, tracking, radius kecil).
5. **Optimasi.** `will-change` hanya saat zoom; animasi gradien ring hanya saat
   preview/zoom; filter drop-shadow hanya pada ring aktif; detail crop tetap
   lazy; menu indeks dibatasi tinggi + scroll.

## 3. Yang tidak diubah

- Intro (`MotionIntro`, CSS, timing, `SiteShell`, `layout.tsx`).
- Gradient text: tidak ada perubahan pada `GradientText` atau gradient judul.
- Palet/font/token `globals.css`.
- QR/barcode dan kredit.
- Data hotspot P1, i18n P2, history P4/P5, share P6, modal P7.

## 4. Catatan validasi

Belum menjalankan lint/typecheck/build/QA. Pemilik akan memvalidasi.
