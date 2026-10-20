# Handoff untuk AI Lain — Penyempurnaan Halaman dan Fitur

Dokumen ini adalah brief eksekusi untuk AI pembangun berikutnya. Fokusnya bukan menambah fitur baru, tetapi membuat halaman yang sudah ada terasa lebih matang, tidak kaku, dan tidak seperti template. Setiap bagian memuat file, tujuan, perubahan yang diminta, kriteria selesai, dan aset yang diperlukan.

## 0. Aturan kerja

1. Baca `README.md`, `PANDUAN-EDIT.md`, dan `CONTENT-VERIFIED.md` sebelum mengubah apa pun.
2. Jangan mengubah fakta, tanggal, angka, ayat, atau sumber tanpa bukti baru.
3. Jangan mengganti logo resmi, warna brand, atau font resmi.
4. Jangan menambah dependency berat (Three.js, peta 3D, library animasi baru) tanpa alasan performa yang jelas.
5. Jangan membuat halaman baru. Semua konten tetap di satu index per bahasa: `/`, `/en`, `/ar`.
6. Jangan menghapus Scrollama, tema, bahasa, peta, atau QR bahasa.
7. Hormati `prefers-reduced-motion`.
8. Setelah selesai: `npm run lint`, `npm run typecheck`, `npm run build`, dan uji 390/768/1440 px.
9. Tulis perubahan di `HANDOFF-RESULT.md` (dibuat oleh AI pelaksana) berisi file yang diubah, keputusan, dan hasil uji.

## 1. Arah seni

Yang dihindari:

- Hero SaaS dengan gradient orb dan tiga kartu bulat.
- Card grid seragam untuk semua konten.
- Teks gradient berlebihan.
- Animasi yang menyorot sisi kiri/kanan tanpa makna.
- Ilustrasi pohon yang terlihat seperti cluster anggur.

Yang dipertahankan:

- Palet navy–teal–gold dari logo.
- Tipografi El Messiri untuk display dan Familjen Grotesk untuk body.
- Garis tipis, ruang kosong, nomor besar, dan ritme editorial.
- Supergraphic kelor sebagai blok, bukan hanya strip.
- Satu momen wow: pohon.

## 2. Hero dan plate logo

**File:** `src/components/home/Hero.tsx`, `src/components/theme/BrandLogo.tsx`, `src/app/globals.css`.

**Tujuan:** hero terasa seperti poster resmi, bukan landing page template.

**Prompt:**

> Perhalus hero menjadi poster editorial. Pertahankan garis edisi, judul dua baris, plate logo resmi, dan countdown. Kurangi kesan kartu: gunakan border tipis, bukan bayangan tebal. Pastikan plate logo tetap menampilkan logo resmi tanpa modifikasi. Di mode gelap, gunakan logo putih. Jangan menambah badge atau ikon dekoratif baru. Buat hierarki: edisi → judul → tagline → intro → CTA → bahasa → countdown. Pastikan H1 memiliki spasi teks yang benar untuk screen reader. Uji 390 px dan 1440 px.

**Kriteria selesai:**

- [ ] Logo resmi tidak diubah/diberi efek.
- [ ] H1 terbaca “Bersama Satukan Bangsa” (dengan spasi) di accessibility tree.
- [ ] Mode gelap memakai logo putih.
- [ ] Tidak ada overflow horizontal.
- [ ] Countdown tetap akurat.

**Aset:** logo horizontal color/white, font, pattern, warna brand.

## 3. Indeks Jelajah (Akar/Batang/Kanopi)

**File:** `src/components/home/GatewayCards.tsx`.

**Tujuan:** indeks tiga arah terasa seperti daftar editorial, bukan tiga kartu.

**Prompt:**

> Pertahankan struktur daftar bernomor. Perbaiki ritme vertikal: nomor, label, judul, deskripsi, dan panah harus sejajar secara optis. Di mobile, susun menjadi blok yang mudah dipindai. Tambahkan garis pemisah tipis dan hover yang halus. Jangan menambah ikon besar atau kartu baru. Pastikan tautan menuju `#sejarah`, `#layanan`, dan `#peta`.

**Kriteria selesai:**

- [ ] Tiga baris sejajar di desktop.
- [ ] Mobile tidak ada teks terpotong.
- [ ] Hover/focus terlihat.
- [ ] Tautan anchor benar.

## 4. Pohon di beranda

**File:** `src/components/home/GrowingTree.tsx`, `src/components/shared/SpaceTree.tsx`, `src/data/tree.ts`.

**Tujuan:** pohon terasa organik dan menjadi signature, bukan hiasan.

**Prompt:**

> Pertahankan komposisi teks kiri + pohon kanan. Perhalus transisi tumbuh dari bawah ke atas. Pastikan tiga anotasi (Akar, Batang, Kanopi) tidak menutupi daun. Jangan mengubah arah pertumbuhan menjadi kiri/kanan. Jangan menambahkan highlight lobe. Jika ingin mengganti animasi penuh, ikuti `PROMPT-ANIMASI-POHON.md`.

**Kriteria selesai:**

- [ ] Pohon tumbuh dari bawah saat masuk viewport.
- [ ] Tiga anotasi terbaca.
- [ ] Tidak ada layout shift.
- [ ] Reduced motion menampilkan pohon statis.
- [ ] Mobile tetap proporsional.

**Aset:** data pohon, warna brand, font, pattern.

## 5. Tentang Milad

**File:** `src/components/home/AboutMilad.tsx`.

**Tujuan:** spread editorial dengan angka 114 outline, fakta, dan kutipan.

**Prompt:**

> Perhalus tipografi dan jarak. Pastikan angka 114 outline tidak terlalu besar di mobile. Susun fakta sebagai definition list dengan garis tipis. Jangan mengubah fakta. Tambahkan tautan sumber yang sudah ada. Buat kutipan terasa seperti catatan margin, bukan card.

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
- [ ] Tanggal 13–15 Nov, 18 Nov, dan 2027 benar.
- [ ] Tautan Edaran berfungsi.

## 7. Sejarah dan Scrollama

**File:** `src/components/history/HistorySection.tsx`, `src/components/history/HistoryExperience.tsx`.

**Tujuan:** long-form editorial dengan sidebar yang hidup.

**Prompt:**

> Pertahankan Scrollama dan enam langkah. Perhalus sidebar: tahun besar, label cabang, pohon, timeline. Jangan menyorot kiri/kanan; gunakan pertumbuhan bawah→atas sesuai `PROMPT-ANIMASI-POHON.md`. Bab harus terasa seperti artikel, bukan card: nomor besar, judul, paragraf, fakta, sumber. Pastikan `history-step` tetap ada. Uji scroll ke atas.

**Kriteria selesai:**

- [ ] Enam langkah aktif bergantian dengan benar.
- [ ] Pohon mengikuti fase, bukan lobe.
- [ ] Tidak ada lompatan saat scroll naik.
- [ ] Anchor tiap bab berfungsi.
- [ ] Sumber tampil di tiap bab.

**Aset:** enam bab ID/EN/AR, data pohon, sumber resmi.

## 8. Kalender KHGT

**File:** `src/components/services/HijriCalendar.tsx`, `src/lib/khgt.ts`.

**Tujuan:** meja kalender yang mudah dibaca, bukan card besar.

**Prompt:**

> Pertahankan data KHGT dan konverter. Perbaiki keterbacaan sel di mobile. Pastikan 13–15 November 2026 bertanda “Milad” dan menampilkan 4–6 Jumadilakhir 1448 H. Jangan memakai library hijriah generik. Jangan mengubah data snapshot. Tambahkan catatan sumber dan tanggal snapshot.

**Kriteria selesai:**

- [ ] 7 kolom muat di 390 px.
- [ ] Konverter 13 Nov 2026 → 4 Jumadilakhir 1448 H.
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

## 10. Kuis

**File:** `src/components/services/QuizApp.tsx`, `src/data/quiz*.ts`.

**Tujuan:** lembar ujian editorial, bukan card SaaS.

**Prompt:**

> Pertahankan 10 soal, feedback, sumber, skor, dan localStorage. Perbaiki tipografi soal, opsi, dan hasil. Pastikan jawaban benar/salah tidak hanya dibedakan warna. Jangan mengubah jawaban benar. Tambahkan progress yang halus. Uji 10 jawaban benar → 100.

**Kriteria selesai:**

- [ ] Skor 100 untuk semua jawaban benar.
- [ ] Feedback menampilkan sumber.
- [ ] Mobile nyaman.
- [ ] Mode gelap kontras.

## 11. Peta 29 PCIM

**File:** `src/components/map/MapSection.tsx`, `src/components/map/WorldMap.tsx`, `src/data/pcim.ts`.

**Tujuan:** peta dunia yang jelas dan tidak terlalu ramai.

**Prompt:**

> Pertahankan 29 negara dan marker. Perbaiki layout agar daftar negara tidak meninggalkan kolom kosong: gunakan panel daftar yang bisa di-scroll atau susun ulang. Pastikan jumlah path PCIM = jumlah marker = 29. Tambahkan tooltip negara/kota. Jangan menambah peta 3D. Jangan mengubah koordinat tanpa data baru.

**Kriteria selesai:**

- [ ] 29 negara tersorot.
- [ ] 29 marker.
- [ ] Daftar 29 negara lengkap dan berurutan per kawasan.
- [ ] Mode gelap terbaca.
- [ ] Mobile tidak overflow.
- [ ] Sumber Natural Earth/world-atlas tampil.

**Aset:** `pcim.ts`, `world-atlas`, Natural Earth, daftar PCIM.

## 12. Tema dan bahasa

**File:** `src/components/theme/*`, `src/components/layout/LanguageSwitcher.tsx`, `src/i18n/*`, `src/app/layout.tsx`, `src/app/globals.css`.

**Prompt:**

> Pertahankan toggle tema dan tiga bahasa. Pastikan tidak ada flash tema yang mengganggu, logo berganti terang/gelap, dan bahasa Arab RTL. Jangan mengubah URL `/`, `/en`, `/ar`. Pastikan `html lang/dir` benar setelah hidrasi. Uji semua tombol di mobile.

**Kriteria selesai:**

- [ ] Tema tersimpan setelah reload.
- [ ] Logo terang/gelap benar.
- [ ] `/en` dan `/ar` punya `lang`/`dir` benar.
- [ ] Tidak ada teks yang tetap Indonesia di halaman EN/AR kecuali kutipan/sumber resmi.

## 13. Scroll reveal

**File:** `src/components/shared/ScrollReveal.tsx`, `src/app/globals.css`.

**Prompt:**

> Pertahankan reveal dari bawah ke atas. Jangan membuat elemen masuk dari samping. Pastikan konten tidak pernah permanen tersembunyi: fallback 5 detik sudah ada. Hormati reduced motion. Jangan menambahkan animasi ke elemen yang sudah punya animasi hero.

**Kriteria selesai:**

- [ ] Semua section muncul saat scroll.
- [ ] Tidak ada elemen yang tetap opacity 0 setelah 5 detik.
- [ ] Reduced motion langsung menampilkan konten.

## 14. Footer dan kolofon

**File:** `src/components/layout/Footer.tsx`.

**Prompt:**

> Perhalus footer sebagai kolofon: logo, tagline, bahasa, tautan, sumber, dan kredit. Pastikan tautan bahasa dan anchor benar. Jangan menambah tautan sosial yang belum diverifikasi.

**Kriteria selesai:**

- [ ] Semua tautan berfungsi.
- [ ] Kredit logo/font benar.
- [ ] Mode gelap dan RTL rapi.

## 15. Aset yang diperlukan

### Sudah tersedia

- `public/logo/horizontal-color.png`
- `public/logo/horizontal-white.png`
- `public/logo/logogram-color.png`
- `public/logo/logogram-white.png`
- `public/logo/vertical-color.png`
- `public/pattern/kelor-strip.png` + `.webp`
- `public/og/og-milad114.jpg` + `.png`
- `src/app/fonts/ElMessiri-VariableFont_wght.ttf`
- `src/app/fonts/FamiljenGrotesk-VariableFont_wght.ttf`
- `src/app/fonts/FamiljenGrotesk-Italic-VariableFont_wght.ttf`
- `public/licenses/OFL-ElMessiri.txt`
- `public/licenses/OFL-FamiljenGrotesk.txt`
- `public/licenses/Scrollama-MIT.txt`
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

## 16. Checklist akhir

- [ ] Tidak ada konten placeholder.
- [ ] Tiga bahasa lengkap dan RTL benar.
- [ ] Tema terang/gelap benar.
- [ ] Peta 29 negara.
- [ ] Pohon mengikuti prompt animasi (jika dieksekusi).
- [ ] Scroll reveal halus dan tidak menyembunyikan konten permanen.
- [ ] Semua tautan internal dan eksternal berfungsi.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` lolos.
- [ ] Uji 390/768/1440 px.
- [ ] Uji reduced motion.
- [ ] QR `/`, `/en`, `/ar` tetap valid.
