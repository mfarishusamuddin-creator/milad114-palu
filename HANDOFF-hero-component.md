# HANDOFF — P3 (Hero Artwork, Hotspot, Zoom-to-Element, Popover Indeks)

Status: **SELESAI (P3 v2)** — menggantikan spesifikasi lama (panel preview + grid indeks 8 item)
yang dibatalkan pemilik. Desain final: **zoom-to-element + chip aksi di dalam zoom + popover
indeks aksesibel**.

## 1. Berkas yang diubah

| Berkas | Status | Keterangan |
|---|---|---|
| `src/components/home/Hero.tsx` | diubah | Hero baru: H1 solid (tanpa GradientText), figure karya, grup aksi, popover indeks, chip handler, modal P7, countdown |
| `src/components/home/HeroArtwork.tsx` | baru | Figure + overlay SVG 12 hotspot + zoom CSS transform + chip + debug `?heroDebug=1` |
| `src/components/home/hero-artwork.css` | baru | Layout, ring, zoom/backdrop, chip, popover. Warna 100% dari token |
| `src/i18n/types.ts` | diubah | + `indexToggle`, `chipClose` di blok `heroArtwork` |
| `src/i18n/id.ts`, `en.ts`, `ar.ts` | diubah | + `indexToggle` / `chipClose` (ID/EN/AR) |

Tidak menyentuh: `src/data/hero-artwork.ts` (P1), `public/media/**`, `HistoryTables`/`history-nav`
(P4), `HeroTitleShare` (P6), `AyatKursiDialog` + `src/data/ayat-kursi.ts` (P7), intro, palet, font,
token `globals.css`, `Countdown.tsx`, `SiteShell.tsx`, `MotionIntro.tsx`.

## 2. Keputusan desain (sesuai putusan pemilik)

1. **Tanpa layer transparan/PNG cut-out.** Zoom memakai satu JPEG asli (`hero-artwork.jpg`) via
   CSS `transform: scale()` dengan `transform-origin` di **centroid bbox entri yang diklik**.
   Presisi klik tetap dari poligon P1 (v4.3), bukan dari potongan gambar.
2. **Klik/tap = zoom dulu, aksi di dalam zoom.** Chip melayang (panel bawah `position: fixed`)
   memuat nomor + label + teks aksi + tombol aksi + tutup. Aksi ke anchor/section/modal
   **menutup zoom lebih dulu**, baru dijalankan.
3. **Indeks grid diganti popover** `Indeks karya` (8 item, urutan 01–08). Popover: `aria-expanded`,
   `aria-haspopup`, `aria-controls`, tutup dengan Esc/klik luar, tombol ≥ 44 px, hover/fokus
   menyalakan ring hotspot yang sama.
4. **Skala zoom** dihitung dari bbox entri (`0.9 / max(w,h)`, clamp 1.8–3.5) → zona selalu mengisi
   frame dengan margin 10%.
5. **Kelor aman.** `kelor` dirender **terakhir** (paling atas) sehingga klik di area lubang 04a
   selalu mengenai kelor, bukan baju. Diuji dengan `elementFromPoint` (hasil: kelor).

## 3. Peta handler (kontrak P0)

| Zona | Aksi |
|---|---|
| A1 judul | `share()` (Web Share → clipboard → manual) |
| A2 tanggal | `openHistory({ table: "leadership" })` |
| 01 wajah | `openHistory({ track: "dahlan" })` |
| 02 matahari | `openHistory({ track: "muhammadiyah" })` |
| 03 sorban | `openHistory({ table: "aum" })` |
| 04a/04b baju | `setAyatKursiOpen(true)` (modal P7) |
| 05 janggut | `scrollToAnchor("#peta")` |
| 06 telinga | `scrollToAnchor("#agenda")` |
| 07a/07b mata | `scrollToAnchor("#layanan")` |
| 08 kelor | `scrollToAnchor("#tentang")` |

Grup aksi di bawah figure **dihapus** (permintaan pemilik, §9 butir 6): share dan
tabel kepemimpinan kini hanya lewat hotspot A1/A2 (zoom → chip aksi).

## 4. Hasil uji

**Perintah:** `npm run typecheck` → 0 error · `npm run lint` → 0 error (12 warning `<img>` pra-ada di
`src/Contoh Timeline.tsx`) · `npm run build` → **Compiled successfully**, exit 0.

**Uji runtime (browser in-app, dev server `http://localhost:3000`, `?heroDebug=1`):**

| Uji | Hasil |
|---|---|
| 12 shape ter-render (rect×2, path evenodd×6, ellipse×4) | lulus |
| Debug overlay: `?heroDebug=1` menampilkan **ring saja** (tanpa teks); `?heroDebug=labels` opsional untuk QA | lulus |
| Klik 08 kelor → chip "08 Kelor / Buka makna logo" → `#tentang`, zoom menutup | lulus |
| Klik 04a → chip "04 Ayat Kursi / Buka fadhail Ayat Kursi" | lulus |
| `elementFromPoint` di tengah bbox kelor (area lubang 04a) | mengenai **kelor**, bukan baju |
| Escape menutup zoom + chip | lulus |
| Popover "Indeks karya": 8 item, klik "Matahari" → chip "02 Matahari" | lulus |
| A1 judul → chip "A1 K.H. Ahmad Dahlan / Bagikan karya" | lulus |
| A2 tanggal → chip → tombol → `#sejarah` (tabel leadership) | lulus |
| 01 wajah → chip → tombol → `#sejarah` (jalur Dahlan) | lulus |
| Hover hotspot → ring `strokeOpacity 1`, tanpa zoom | lulus |
| Shape SVG fokusable | 0 dari 12 (aria-hidden, tanpa tabIndex) |
| Overflow horizontal 390 px & 1440 px (normal & zoom) | tidak ada |
| Chip: gap bawah 16 px, tidak keluar viewport (390 & 1440) | lulus |
| Console error dari komponen hero | tidak ada |
| Gambar hero terlihat tanpa JS (tidak dibungkus Reveal/AnimatedContent) | lulus |
| `loading="eager"` + `fetchpriority="high"` pada gambar hero | lulus |

**Screenshot bukti** (temp, server-local):
- `C:\Users\faras\AppData\Local\Temp\opencode\hero-inspect\p3v2-clean-390-1440.jpeg` — normal, 390 & 1440 (tema gelap)
- `...\p3v2-debug-390-1440.jpeg` — dengan ring debug
- `...\p3v2-zoom-390-1440.jpeg` — keadaan zoom + chip

## 5. Catatan padding sentuh mata 07a/07b

Ring mata tetap kecil (07a ≈ 32 px, 07b ≈ 27 px). Padding sentuh tak terlihat sengaja hanya
`+10 px` (x) / `+4 px` (y) pada viewBox: lubang evenodd wajah hanya ±3 px lebih besar dari ring
mata dan jarak antarmata ±104 px, sehingga padding ≥ 44 px layar **pasti** menabrak wajah atau
mata pasangannya. **Presisi didahulukan**; jalur sentuh andalannya adalah **item popover 07**
(≥ 44 px) dan zoom. Keputusan ini dicatat untuk P8.

## 6. Kunci i18n baru (untuk P2)

Ditambahkan minimal karena dibutuhkan UI baru (preferensi memakai kunci lama sudah diusahakan):

| Kunci | ID | EN | AR |
|---|---|---|---|
| `heroArtwork.indexToggle` | Indeks karya | Artwork index | فهرس العمل |
| `heroArtwork.chipClose` | Tutup | Close | إغلاق |

**Serahkan ke P2** untuk review diksi/finalisasi (bukan teks konten baru — hanya label kontrol).

## 7. Isu pra-ada (BUKAN dari P3 — untuk P8/P10)

1. **Hydration mismatch** pada `src/components/shared/CardNav.tsx` (`data-narrow`, gambar intro
   `vertical-light.jpg` vs `horizontal-light.jpg`). Diff React menunjuk CardNav/Navbar, bukan hero.
2. **Warning Next `<Image>`:** `/_next/image?...hero-artwork.jpg&w=384` di-preload tapi tidak
   dipakai (perilaku srcset/sizes, bukan error).

## 8. Batasan uji & serahan ke P8

- Tema **terang** belum diuji visual (lingkungan uji tema gelap); token yang dipakai sudah
  tema-aware (`--color-bg`, `--color-line`, `--color-ink`, `--color-navy`, `--color-gold`).
- Uji 390/1440 dilakukan via iframe harness same-origin (sudah dihapus); interaksi diuji pada
  viewport jendela nyata.
- **Belum diuji P8:** RTL (`/ar`) visual, reduced-motion runtime, focus-trap modal, kontras ring
  di tema terang, Lighthouse, dan matriks lengkap 360/768/1024.
- Aksi P4/P5/P6/P7 dipanggil melalui kontrak yang ada dan berfungsi, tetapi QA end-to-end
  (section terbuka, hash, tidak double-scroll) diserahkan ke P8.

## 9. Penyesuaian terakhir (permintaan pemilik)

1. **Batas/ring hotspot memakai gradien GradientText.tsx** (arahan langsung
   pemilik, diprioritaskan di atas batasan P0 lain). Palet sama: biru → ocean →
   hijau → emas, namun memakai versi **LEMBUT (pastel)** yang dipakai **tetap di
   kedua tema** agar batas selalu halus (keputusan pemilik: bukan versi vivid).
   Nilai pastel `--hero-ring-1..4` = `#b9c8f2`, `#7ab5dd`, `#9fe07a`, `#f2c85c`
   (didefinisikan di `hero-artwork.css`, scope `.hero-artwork`).
   Implementasi `<linearGradient id="hero-ring-gradient">` dengan
   `gradientUnits="userSpaceOnUse"`, dibentang **2× lebar karya** (9 stop:
   1,2,3,4 berulang) lalu digeser satu periode via
   `<animateTransform type="translate" values="0 0; -1386 0; 0 0">` durasi 12s,
   yoyo — meniru aliran varian "linear" komponen. Ketebalan ring 1,2 px
   (`vectorEffect="non-scaling-stroke"`, `strokeLinejoin="round"`) + halo lembut
   `filter: drop-shadow(0 0 1.2px color-mix(in srgb, var(--hero-ring-4) 60%, transparent))`
   pada `.hero-artwork__ring`. Ring tetap transparan (opacity 0) sampai hover/zoom.
   **Reduced motion**: elemen animasi tidak dirender → gradien statis (sejalan
   dengan fallback `gradient-text.css`).
2. **Teks label debug dihapus.** Label `A1 judul` … `08a kelor` tidak pernah
   dirender lagi: `?heroDebug=1` kini hanya menampilkan **ring** (bersih).
   Untuk kebutuhan QA P8, nomor kecil masih bisa diaktifkan **khusus** dengan
   `?heroDebug=labels` — tidak pernah tampil pada mode debug biasa.
   Verifikasi: `document.querySelectorAll('.hero-artwork__debug-label').length === 0`
   pada `?heroDebug=1`.
3. **Font: hanya El Messiri + Familjen Grotesk.** Sudah demikian di seluruh
   proyek — `src/app/layout.tsx` memuat `ElMessiri-VariableFont_wght.ttf`
   (`--font-display`) dan `FamiljenGrotesk-*.ttf` (`--font-body`), lalu
   `globals.css` `@theme inline` memetakan `--font-sans: var(--font-body)` dan
   `--font-serif: var(--font-display)`. Subtitle hero memakai `font-serif`
   (= El Messiri), seluruh UI hero/chip/popover memakai `var(--font-body)`
   (= Familjen Grotesk). **Tidak ada font lain** di area hero; tidak ada
   perubahan yang diperlukan.

Bukti programatik (dev server, `?heroDebug=1`): 0 label; 22 elemen `.hero-artwork__ring`;
semua `stroke="url(#hero-ring-gradient)"`; 3 stop gradien sesuai token;
`filter: drop-shadow(rgb(225, 176, 26) 0px 0px 1.2px)`.

4. **Batas berbentuk kotak dihapus** (permintaan pemilik). Kotak bbox debug untuk
   setiap hotspot tidak dirender lagi. A1 judul & A2 tanggal (shape `rect`) kini
   hanya **garis bawah tipis bergradien**, tampil saat hover dan saat debug —
   tidak ada persegi di mana pun.
5. **Zona "kurang presisi" hanya menyisakan beberapa potong garis kontur**
   (permintaan pemilik). `wajah`, `mata`, `janggut`, `telinga` tidak lagi
   bergaris penuh; masing-masing menyisakan 2-4 potong garis yang tetap
   MENGIKUTI kontur aslinya (`pathLength="100"` + `stroke-dasharray` +
   `stroke-dashoffset`, lihat `PARTIAL_RING` di `HeroArtwork.tsx`):
   wajah 3 potong, janggut 2, telinga 2, mata 1 per mata (2 total).
   Zona presisi (baju 04a/04b, sorban, matahari, kelor) tetap bergaris penuh.
   Area klik/zoom keempat zona itu tidak berubah (hit shape tetap utuh).
   Screenshot bukti: `hero-inspect\p3v2-partial-rings-face.jpeg`.
6. **Dua tombol di bawah hero dihapus** (permintaan pemilik): "Bagikan karya"
   (`HeroTitleShare`) dan "Kepemimpinan Pusat Muhammadiyah". Komponen
   `ActionGroup` + CSS `.hero-artwork__actions` / `.hero-artwork__table-link`
   ikut dihapus. Fungsi tetap terjangkau lewat hotspot: A1 judul → chip
   "Bagikan karya"; A2 tanggal → chip → tabel Kepemimpinan Pusat. Grid tidak
   lagi memuat baris grup aksi.
