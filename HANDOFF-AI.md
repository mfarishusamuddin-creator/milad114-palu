# Handoff untuk AI Lain — Penyempurnaan Halaman dan Fitur

Dokumen ini adalah brief eksekusi untuk AI pembangun berikutnya. Fokusnya bukan menambah fitur baru, tetapi membuat halaman yang sudah ada terasa lebih matang, tidak kaku, dan tidak seperti template. Setiap bagian memuat file, tujuan, perubahan yang diminta, kriteria selesai, dan aset yang diperlukan.

## 0. Aturan kerja

1. Baca `README.md`, `PANDUAN-EDIT.md`, dan `CONTENT-VERIFIED.md` sebelum mengubah apa pun.
2. Jangan mengubah fakta, tanggal, angka, ayat, atau sumber tanpa bukti baru.
3. Jangan mengganti logo resmi, warna brand, atau font resmi.
4. Jangan menambah dependency berat (Three.js, peta 3D, library animasi baru) tanpa alasan performa yang jelas.
5. Jangan membuat halaman baru. Semua konten tetap di satu index per bahasa: `/`, `/en`, `/ar`.
6. Jangan menghapus tema, bahasa, peta, atau QR bahasa.
7. Hormati `prefers-reduced-motion`.
8. Setelah selesai: `npm run lint`, `npm run typecheck`, `npm run build`, dan uji 390/768/1440 px.
9. Tulis perubahan di `HANDOFF-RESULT.md` (dibuat oleh AI pelaksana) berisi file yang diubah, keputusan, dan hasil uji.

## 1. Arah seni

Yang dihindari:

- Hero SaaS dengan gradient orb dan tiga kartu bulat.
- Card grid seragam untuk semua konten.
- Teks gradient berlebihan.
- Metafora pohon/akar/batang/kanopi (sudah diganti dua jalur sejarah dan tabel).

Yang dipertahankan:

- Palet navy–emas–kelor (ocean `#195c8d` untuk aksen biru laut) dari logo.
- Tipografi El Messiri untuk display dan Familjen Grotesk untuk body.
- Garis tipis, ruang kosong, nomor besar, dan ritme editorial.
- Supergraphic kelor sebagai blok, bukan hanya strip.
- Momen wow: timeline dua jalur dengan progres scroll.

## 2. Hero dan plate logo

**File:** `src/components/home/Hero.tsx`, `src/components/theme/BrandLogo.tsx`, `src/app/globals.css`.

**Tujuan:** hero terasa seperti poster resmi, bukan landing page template.

**Prompt:**

> Perhalus hero menjadi poster editorial. Pertahankan garis edisi, judul dua baris, plate logo resmi, dan countdown. Kurangi kesan kartu: gunakan border tipis, bukan bayangan tebal. Pastikan plate logo tetap menampilkan logo resmi tanpa modifikasi. Di mode gelap, gunakan logo putih. Jangan menambah badge atau ikon dekoratif baru. Buat hierarki: edisi → judul → tagline → intro → CTA → bahasa → countdown. Pastikan H1 memiliki spasi teks yang benar untuk screen reader. Uji 390 px dan 1440 px.

**Kriteria selesai:**

- [ ] Logo resmi tidak diubah/diberi efek.
- [ ] H1 terbaca “Bersama Satukan Bangsa”‌ (dengan spasi) di accessibility tree.
- [ ] Mode gelap memakai logo putih.
- [ ] Tidak ada overflow horizontal.
- [ ] Countdown tetap akurat.

**Aset:** logo horizontal color/white, font, pattern, warna brand.

## 3. Tentang, Agenda, Peta

**File:** `src/components/home/AboutMilad.tsx`, `src/components/home/Agenda.tsx`, `src/components/map/MapSection.tsx`.

**Tujuan:** alur naratif jika-sesungguhnya: kisah → agenda → jangkauan dunia.

**Prompt:**

> Pertahankan struktur About (makna logo, fakta bersumber), Agenda (ledger waktu + pilar aksi), dan Peta (29 PCIM sebagai dot interaktif per negara + Indonesia sebagai markas; tanpa daftar negara/kota). Perbaiki ritme vertikal antar-section. Jangan menambah kartu baru. Semua tautan sumber resmi (termasuk halaman Cabang Istimewa Muhammadiyah) hanya di halaman Tentang — jangan menampilkan daftar sumber di section manapun.

**Kriteria selesai:**

- [ ] Urutan section sungguh Hero → About → Agenda → Peta → Sejarah → Layanan.
- [ ] Pilar agenda tampil.
- [ ] Tautan anchor benar.
- [ ] Reduced motion aman.

## 4. Timeline sejarah dua jalur

**File:** `src/components/history/HistorySection.tsx`, `HistoryTimeline.tsx`, `HistoryTables.tsx`, `src/components/ui/timeline.tsx`, `src/data/history*.ts`.

**Tujuan:** dua jalur sejarah terasa editorial, bukan slideshow.

**Prompt:**

> Pertahankan dua tab jalur (Muhammadiyah & KH Ahmad Dahlan) di desktop dan accordion `<details>` di mobile. Garis progres timeline berbasis scroll (motion), muncul sekali, tidak membalik. Tabel kepemimpinan dan AUM tetap overflow-x-auto. Jangan mengubah fakta tanpa sumber baru.

**Kriteria selesai:**

- [ ] Tab bergantian tanpa layout shift.
- [ ] Accordion mobile terbuka/tutup mulus.
- [ ] Progres garis tidak jatuh ke 0 saat scroll naik (~(0,1) → ("0%","100%")).
- [ ] Tabel terbaca di 390 px.
- [ ] Sumber resmi tampil.

**Aset:** history.ts/history.en.ts/history.ar.ts, warna brand.

## 5. Tentang Milad

**File:** `src/components/home/AboutMilad.tsx`.

**Tujuan:** spread editorial dengan angka 114 outline, fakta, dan kutipan.

**Prompt:**

> Perhalus tipografi dan jarak. Pastikan angka 114 outline tidak terlalu besar di mobile. Susun fakta sebagai definition list dengan garis tipis. Jangan mengubah fakta. Jangan menambah tautan sumber di section ini (sudah dipindah ke halaman Tentang). Buat kutipan terasa seperti catatan margin, bukan card.

**Kriteria selesai:**

- [ ] Angka 114 tidak overflow di 390 px.
- [ ] Fakta terbaca dan bersumber.
- [ ] Tautan resmi berfungsi.
- [ ] Mode gelap tetap kontras.

## 6. Agenda

**File:** `src/components/home/Agenda.tsx`.

**Tujuan:** ledger waktu, bukan tiga kartu.

**Prompt:**

> Pertahankan format baris tanggal–judul–deskripsi–tag. Perbaiki alignment tanggal dan tag di desktop. Di mobile, tanggal dan tag harus tetap mudah dipindai. Jangan mengubah tanggal. Tambahkan garis pemisah tipis.

**Kriteria selesai:**

- [ ] Tiga baris rapi di desktop dan mobile.
- [ ] Tanggal 19–21 Nov, 18 Nov, dan 2027 benar.
- [ ] Tautan Edaran berfungsi.

## 7. Sejarah dua jalur

**File:** `src/components/history/HistorySection.tsx`, `src/components/history/HistoryTimeline.tsx`.

**Tujuan:** long-form editorial dua jalur dengan timeline yang hidup.

**Prompt:**

> Lihat bagian 4. Section ini sudah selesai; jangan mengganti komponen timeline tanpa alasan performa. Pertahankan anchor `#sejarah` dan urutan dua jalur + dua tabel. Tidak ada blok sumber di section ini.

**Kriteria selesai:**

- [ ] Tab bekerja dua arah tanpa bug.
- [ ] Tidak ada lompatan saat scroll naik.
- [ ] Anchor `#sejarah` berfungsi.
- [ ] Sumber tampil di section.

**Aset:** history ID/EN/AR, sumber resmi.

## 8. Kalender KHGT

**File:** `src/components/services/HijriCalendar.tsx`, `src/lib/khgt.ts`.

**Tujuan:** meja kalender yang mudah dibaca, bukan card besar.

**Prompt:**

> Pertahankan data KHGT dan konverter. Perbaiki keterbacaan sel di mobile. Pastikan 19–21 November 2026 bertanda “Milad”‌ dan menampilkan 10–12 Jumadilakhir 1448 H. Jangan memakai library hijriah generik. Jangan mengubah data snapshot. Pertahankan catatan tanggal snapshot dan disclaimer tanpa tautan sumber inline (sumber hanya di halaman Tentang).

**Kriteria selesai:**

- [ ] 7 kolom muat di 390 px.
- [ ] Konverter 19 Nov 2026 → 10 Jumadilakhir 1448 H.
- [ ] Konverter sebaliknya benar.
- [ ] Nama bulan mengikuti bahasa.
- [ ] Mode gelap kontras.

**Aset:** `src/data/khgt-2026.json`, `scripts/sync-khgt.mjs`.

## 9. Kabar

**File:** `src/components/services/KabarTabs.tsx`, `src/components/shared/KabarCard.tsx`, `src/lib/kabar.ts`.

**Tujuan:** indeks kabar seperti surat kabar, bukan grid kartu.

**Prompt:**

> Pertahankan dua tab: Terbaru dan Milad & Tanwir. Gunakan daftar dua kolom dengan tanggal, judul, dan panah. Jangan menyalin artikel penuh. Tampilkan catatan bahwa teks asli berbahasa Indonesia untuk halaman EN/AR. Jangan mengubah API atau cache. Pastikan fallback tampil jika API gagal.

**Kriteria selesai:**

- [ ] Enam item per tab.
- [ ] Tautan keluar benar.
- [ ] Fallback teruji.
- [ ] Tanggal mengikuti locale.

**Aset:** WP REST API, `kabar-fallback.json`.

## 10. Peta 29 PCIM

**File:** `src/components/map/MapSection.tsx`, `src/components/map/WorldMap.tsx`, `src/data/pcim.ts`.

**Tujuan:** peta dunia yang jelas dan tidak terlalu ramai.

**Prompt:**

> Pertahankan 29 negara dan dot interaktif (label nama negara via hover/klik/fokus/tap; tanpa nama kota). Peta full-bleed tanpa kolom daftar negara; tombol “i” mengarah ke `/tentang`. Indonesia (ISO 360) ditandai sebagai markas Pimpinan Pusat dengan warna dan label tersendiri. Pastikan jumlah path PCIM = jumlah dot = 29. Jangan menambah peta 3D. Jangan mengubah koordinat tanpa data baru.

**Kriteria selesai:**

- [ ] 29 negara tersorot.
- [ ] 29 dot + 1 dot/mar­ker markas Indonesia.
- [ ] Label negara muncul via mouse, keyboard, dan sentuh; tidak ada nama kota.
- [ ] Mode gelap terbaca.
- [ ] Mobile tidak overflow.
- [ ] Sumber Natural Earth/world-atlas tampil.

**Aset:** `pcim.ts`, `world-atlas`, Natural Earth, daftar PCIM.

## 11. Tema dan bahasa

**File:** `src/components/theme/*`, `src/components/layout/LanguageSwitcher.tsx`, `src/i18n/*`, `src/app/layout.tsx`, `src/app/globals.css`.

**Prompt:**

> Pertahankan toggle tema dan tiga bahasa. Pastikan tidak ada flash tema yang mengganggu, logo berganti terang/gelap, dan bahasa Arab RTL. Jangan mengubah URL `/`, `/en`, `/ar`. Pastikan `html lang/dir` benar setelah hidrasi. Uji semua tombol di mobile.

**Kriteria selesai:**

- [ ] Tema tersimpan setelah reload.
- [ ] Logo terang/gelap benar.
- [ ] `/en` dan `/ar` punya `lang`/`dir` benar.
- [ ] Tidak ada teks yang tetap Indonesia di halaman EN/AR kecuali kutipan/sumber resmi.

## 12. Animated content (GSAP)

**File:** `src/components/animation/AnimatedContent.tsx`, `src/components/animation/Reveal.tsx`, `src/app/globals.css`.

**Prompt:**

> Pertahankan reveal dari bawah ke atas memakai AnimatedContent (GSAP + ScrollTrigger). Setiap elemen hanya dianimasikan sekali; jangan mengulang saat scroll naik. Jangan membuat elemen masuk dari samping dan jangan menambah blur/tilt/scrub. Pastikan konten tidak pernah permanen tersembunyi: fallback `@media (scripting: none)` dan `<noscript>` sudah ada. Hormati reduced motion.

**Kriteria selesai:**

- [ ] Section utama muncul saat scroll (Hero, AboutMilad, Agenda, Map, History, Services).
- [ ] Tidak ada elemen yang tetap `visibility: hidden` atau opacity 0.
- [ ] Reduced motion langsung menampilkan konten.

## 13. Footer dan kolofon

**File:** `src/components/layout/Footer.tsx`.

**Prompt:**

> Footer ringkas tiga kolom: logo + tagline + tautan “Tentang”, daftar jelajah, dan kolom acara. Bahasa hanya via pemilih bahasa di panel CardNav header (satu pemilih untuk seluruh situs). Sumber/kredit/hak cipta tidak ada di footer — semuanya di halaman Tentang. Pastikan tautan bahasa dan anchor benar. Jangan menambah tautan sosial yang belum diverifikasi.

**Kriteria selesai:**

- [ ] Semua tautan berfungsi, termasuk tautan Tentang ke `aboutPath`.
- [ ] Footer tidak menampilkan daftar sumber, bahasa, atau hak cipta.
- [ ] Mode gelap dan RTL rapi.

## 13a. Halaman Tentang

**File:** `src/components/pages/AboutPage.tsx`, route `/tentang`, `/en/tentang`, `/ar/tentang`.

**Prompt:**

> Halaman Tentang menyatukan seluruh sumber informasi (`dict.aboutPage.sources` → `SITE.links`), aset & lisensi, catatan riset internal, catatan data, dan hak cipta (`© 2026 Faris Husamuddin. Hak cipta dilindungi.` — teks persis di bahasa Indonesia). Halaman ini MINIMALIS dan elegan, tanpa menyebut teknologi/framework/library sama sekali. Setiap bahasa memakai metadata inline di `page.tsx` (jangan sentuh `src/lib/metadata.ts` atau `sitemap.ts`).

**Kriteria selesai:**

- [ ] Daftar sumber lengkap dan terbuka di tab baru.
- [ ] Hak cipta ID persis: `© 2026 Faris Husamuddin. Hak cipta dilindungi.`
- [ ] Tidak ada leak teknologi di halaman.
- [ ] Metadata inline per bahasa; sitemap tidak berubah.

## 13b. Mode Ramadhan, GradientText, minimalisasi, tabel collapsible, logo penutup

**File:** `src/components/home/Countdown.tsx`, `src/components/shared/GradientText.tsx` + `gradient-text.css`, `Hero.tsx`, `Agenda.tsx`, `HistorySection.tsx` + `HistoryTables.tsx`, `ServicesSection.tsx`, `Footer.tsx`, `SectionHeading.tsx`.

**Ringkasan:**

- Judul section memakai komponen `GradientText` (adaptasi ReactBits, warna dari token `--gt-c1..c4` terang/gelap; shell countdown memakai palet terbaca versi gelap).
- Counter punya dua mode: `event` (Tanwir/Milad) dan `ramadhan` (target KHGT di `RAMADAN_TARGETS`, maghrib perkiraan 18.00 WITA); judul toggle adalah tombol `aria-pressed`; ganti mode/zona memainkan ulang intro Counter.
- Halaman minimalis: Hero satu kolom, Agenda tanpa pilar/CTA, Sejarah tanpa blok CTA dan catatan sumber, Footer dua kolom; sumber tetap hanya di Tentang.
- Tabel sejarah: satu tombol (aria-expanded/aria-controls) membuka/menutup KEDUA tabel, tersembunyi default.
- Logo penutup: BrandLogo `.closing-logo` di akhir Layanan (horizontal desktop, logogram di seluler, alt dari `services.closingLogoAlt`).

## 14. Aset yang diperlukan

### Sudah tersedia

- `public/logo/horizontal-color-1921.png`
- `public/logo/horizontal-white-1921.png`
- Catatan: PNG/JPG statis di folder sumber masih memakai 13–15; jangan dipakai untuk hero/OG. Logo horizontal/OG situs diturunkan dari frame motion logo 19–21.
- `public/logo/logogram-color.png`
- `public/logo/logogram-white.png`
- `public/logo/vertical-color.png`
- `public/pattern/kelor-strip.png` + `.webp`
- `public/og/og-milad114-1921.jpg` + `.png`
- `src/app/fonts/ElMessiri-VariableFont_wght.ttf`
- `src/app/fonts/FamiljenGrotesk-VariableFont_wght.ttf`
- `src/app/fonts/FamiljenGrotesk-Italic-VariableFont_wght.ttf`
- `public/licenses/OFL-ElMessiri.txt`
- `public/licenses/OFL-FamiljenGrotesk.txt`
- Motion logo di folder sumber (belum dipakai): `Motion Logo 114 Horizontal [BG putih].mp4` (2,06 MB), `[BG Hitam]` (1,74 MB), vertikal (1,83/1,57 MB), alpha MOV 88,53 MB (jangan dipakai langsung).

### Belum tersedia dan perlu diminta ke pemilik

- Foto resmi Palu pasca-gempa dan kegiatan Tanwir/Milad.
- Foto penanaman 114 pohon kelor.
- Foto/arsip sejarah Muhammadiyah berlisensi.
- Video resmi Tanwir/Milad.
- Logo/identitas resmi versi vektor final untuk web.
- Teks pidato/tema resmi dari Edaran 19/2026.
- Verifikator bahasa Arab (native speaker).
- Data PCIM terbaru (jika ada perubahan).
- Tabel kalender Muhammadiyah 1448 H resmi (jika ingin konverter penuh).

Setiap foto/video wajib menyertakan:

- Sumber.
- Pemegang hak.
- Izin pakai.
- Kredit.
- Tanggal.
- Alt text.

### Font

Gunakan hanya El Messiri dan Familjen Grotesk dari folder proyek. Jangan memakai font baru tanpa izin. Untuk Arab, El Messiri sudah mendukung Arab; jika ingin body Arab yang lebih nyaman, tambahkan Noto Naskh Arabic (OFL) dan daftarkan di `layout.tsx` serta `PANDUAN-EDIT.md`.

### Peta

- `world-atlas/countries-110m.json` (ISC).
- `topojson-client`.
- `d3-geo`.
- Data 29 PCIM di `src/data/pcim.ts`.

## 15. Checklist akhir

- [ ] Tidak ada konten placeholder.
- [ ] Tiga bahasa lengkap dan RTL benar.
- [ ] Tema terang/gelap benar.
- [ ] Peta 29 negara, tanpa nama kota; label negara interaktif; tombol “i” ke halaman Tentang.
- [ ] Header: logo + nama satu baris di 390 px, CardNav terbuka dengan tiga kartu, CTA, bahasa, dan “Tentang” di slot footer.
- [ ] Satu-satunya pemilih bahasa ada di panel CardNav.
- [ ] Tidak ada daftar sumber di mana pun kecuali halaman Tentang; hak cipta ID persis di sana.
- [ ] Timeline sejarah dua jalur sesuai arahan bagian 4.
- [ ] Animated content halus dan tidak menyembunyikan konten permanen.
- [ ] Semua tautan internal dan eksternal berfungsi.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` lolos.
- [ ] Uji 390/768/1440 px.
- [ ] Uji reduced motion.
- [ ] QR `/`, `/en`, `/ar` tetap valid.

