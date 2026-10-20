# Prompt Lengkap — Animasi Bibit Menjadi Pohon Berbuah

Salin seluruh isi dokumen ini ke AI pembangun. Prompt ini mandiri; AI tidak perlu membaca dokumen lain selain file proyek yang disebutkan.

---

## Peran

Kamu adalah AI pembangun front-end senior untuk proyek Next.js 16 App Router + TypeScript + Tailwind CSS v4. Tugasmu **hanya** mengerjakan animasi pohon dan integrasinya dengan scrollytelling. Jangan mengubah konten, terjemahan, rute, atau data selain yang diperlukan.

## Konteks proyek

Website Milad Muhammadiyah ke-114, satu index panjang dengan tiga bahasa (`/`, `/en`, `/ar`). Bagian sejarah memakai Scrollama. Di sidebar sejarah ada ilustrasi pohon statis. Highlight sisi kiri/kanan yang lama sudah dihapus. Tugasmu adalah mengganti ilustrasi statis itu dengan animasi pertumbuhan penuh.

File penting:

- `src/components/history/HistoryExperience.tsx` — scrollytelling, sidebar, timeline.
- `src/components/shared/SpaceTree.tsx` — ilustrasi pohon saat ini.
- `src/data/tree.ts` — data pohon hasil generate (branch/leaf).
- `scripts/generate-tree.mjs` — generator space colonization.
- `src/i18n/*.ts` — teks; jangan diubah.
- `src/app/globals.css` — animasi dan tema.
- `src/components/home/GrowingTree.tsx` — pohon besar di beranda.

## Masalah yang harus diperbaiki

1. Pohon sidebar saat ini statis dan belum mengikuti narasi pertumbuhan.
2. Akar dan perintisan harus tumbuh **dari bawah ke atas**.
3. Saat mencapai bagian atas, jangan menyorot kanan/kiri. Tampilkan pohon yang **berbuah**.
4. Animasi harus sinkron dengan enam bab sejarah, bukan sekadar masuk viewport.
5. Saat pengguna scroll ke atas, animasi harus mundur dengan mulus (bukan melompat atau terbalik).

## Tujuan visual

Buat animasi satu pohon yang berkembang dalam enam fase:

| Fase | Bab sejarah | Visual |
|---|---|---|
| 0 | 1868–1911 | Biji di tanah, akar rambut mulai keluar |
| 1 | 1912 | Akar menyebar, batang kecil muncul |
| 2 | 1912–1953 | Batang menguat, cabang utama mulai terbentuk |
| 3 | 1953–2026 | Cabang menyebar, daun pertama terbuka |
| 4 | 2026 | Kanopi penuh, daun rimbun |
| 5 | 2026–2027 | Buah emas muncul di kanopi, pohon selesai |

Arah pertumbuhan selalu **bawah → atas**. Tidak ada highlight kiri/kanan. Yang berubah adalah jumlah akar, tinggi batang, jumlah cabang, jumlah daun, lalu buah.

## Perilaku yang diminta

### Sinkronisasi dengan Scrollama

- Gunakan Scrollama yang sudah terpasang (`scrollama@3.2.0`).
- `HistoryExperience` sudah memanggil Scrollama dengan `step: ".history-step"`.
- Gunakan indeks langkah aktif (`active`) untuk menentukan `growthProgress` 0–1.
- Mapping yang disarankan:
  - langkah 0 → 0.08
  - langkah 1 → 0.24
  - langkah 2 → 0.42
  - langkah 3 → 0.62
  - langkah 4 → 0.82
  - langkah 5 → 1.0
- Progress harus berubah halus saat pengguna scroll, bukan hanya saat step enter. Gunakan `onStepProgress` dari Scrollama atau IntersectionObserver + scroll position.
- Saat scroll ke atas, progress harus berkurang dan pohon mengecil/mundur secara alami.

### Tahapan animasi

Gunakan satu state `progress` (0–1) dan turunkan nilai animasi:

- `rootProgress`: 0–0.24
- `sproutProgress`: 0.18–0.42
- `trunkProgress`: 0.35–0.62
- `branchProgress`: 0.55–0.82
- `leafProgress`: 0.68–0.95
- `fruitProgress`: 0.88–1.0

Jangan memakai highlight per lobe. Semua elemen tumbuh bersama secara proporsional.

### Visual

- Gunakan SVG inline, bukan WebGL.
- Akar: garis tipis bercabang ke bawah, tumbuh dari titik tengah tanah.
- Biji: bentuk oval kecil di tanah, memudar saat akar tumbuh.
- Batang: garis tebal dari tanah ke atas, bertambah tinggi dan tebal.
- Cabang: mengikuti data `tree.ts` atau data baru yang dihasilkan `scripts/generate-tree.mjs`.
- Daun: elips kecil di ujung cabang, muncul bertahap dari bawah ke atas.
- Buah: lingkaran emas kecil (8–12 buah) di kanopi, muncul hanya pada fase 5.
- Warna:
  - akar/batang: gradasi hijau → teal → navy.
  - daun: hijau kelor `#6DBD25` → teal `#0B8170`.
  - buah: emas `#D49B0F` / `#EAB749`.
  - latar: transparan; parent memberi latar navy atau surface.
- Jangan memakai logo resmi sebagai pohon. Ilustrasi harus orisinal.

### Ukuran dan responsif

- ViewBox tetap `0 0 900 720`.
- Di sidebar sejarah, pohon tampil dalam panel 300–340 px.
- Di beranda, pohon tampil besar di `GrowingTree`.
- Gunakan `preserveAspectRatio` yang sesuai.
- Jangan membuat layout shift; wrapper harus punya rasio tetap.

### Aksesibilitas

- SVG dekoratif: `aria-hidden="true"` dan `focusable="false"`.
- Sediakan teks alternatif di sekitar pohon (heading/legend).
- Hormati `prefers-reduced-motion`:
  - Jika reduced motion, tampilkan pohon final dengan buah (atau fase statis sesuai langkah aktif) tanpa animasi.
- Jangan mengandalkan warna saja untuk menyampaikan fase; teks bab sudah menjelaskan.

### Performa

- Target 60 fps di Android kelas menengah.
- Maksimal ~350 elemen SVG aktif; gunakan path gabungan atau data kompak.
- Jangan memuat library animasi baru. Scrollama sudah ada. CSS + requestAnimationFrame cukup.
- Jangan memakai `filter`, `blur`, atau bayangan berat pada animasi.
- Jika memakai `will-change`, batasi pada wrapper, bukan setiap elemen.

## Implementasi yang disarankan

1. Buat komponen baru `src/components/history/GrowingTreeStory.tsx` (client).
2. Props:
   ```ts
   type Props = {
     progress: number; // 0..1
     reducedMotion?: boolean;
     className?: string;
   };
   ```
3. Di `HistoryExperience`, hitung `progress` dari Scrollama `onStepProgress` atau dari step aktif + scroll position.
4. Render:
   - `<g className="story-roots" style={{ opacity: ... }}>`
   - `<g className="story-seed">`
   - `<g className="story-trunk" style={{ clipPath: ... }}>`
   - `<g className="story-branches">`
   - `<g className="story-leaves">`
   - `<g className="story-fruit">`
5. Gunakan `clip-path: inset()` atau `stroke-dasharray` untuk pertumbuhan bawah→atas.
6. Gunakan `transform: scaleY()` pada batang dengan `transform-origin` di tanah; jangan membalik arah.
7. Buah muncul dengan `opacity` dan `scale` dari 0 ke 1 pada fase akhir.
8. Jangan memakai `activeLobe`/`dimInactive`; pertumbuhan harus berlaku untuk seluruh pohon.
9. Pertahankan `SpaceTree` untuk beranda jika masih cocok, atau gunakan komponen baru untuk keduanya. Jangan merusak beranda.

## Data pohon

Kamu boleh memakai `src/data/tree.ts` yang sudah ada, tetapi data itu tidak memiliki akar dan buah. Lengkapi dengan:

- akar: 12–20 segmen dari titik `(450, 650)` ke bawah/kiri/kanan.
- buah: 8–12 titik di area kanopi atas (`y < 300`).

Jika perlu, ubah `scripts/generate-tree.mjs` agar menghasilkan:
- `treeRoots`
- `treeBranches`
- `treeLeaves`
- `treeFruit`

Jangan mengedit `src/data/tree.ts` manual; hasilkan lewat script.

## Acceptance criteria

- [ ] Bab 1 hanya menampilkan biji dan akar.
- [ ] Bab 2 menampilkan akar + batang kecil.
- [ ] Bab 3 menampilkan batang + cabang utama.
- [ ] Bab 4 menampilkan cabang + daun pertama.
- [ ] Bab 5 menampilkan kanopi penuh.
- [ ] Bab 6 menampilkan buah emas.
- [ ] Tidak ada highlight kiri/kanan.
- [ ] Pertumbuhan selalu dari bawah ke atas.
- [ ] Scroll ke atas mengurangi progress dengan mulus.
- [ ] Tidak ada lompatan saat berpindah step.
- [ ] Reduced motion menampilkan pohon final/statis.
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` lolos.
- [ ] Tidak ada console error.
- [ ] Di viewport 390 px dan 1440 px tidak ada overflow.
- [ ] Animasi tidak membuat layout shift.

## Yang dilarang

- Jangan memakai WebGL/Three.js.
- Jangan menyalin kode repo space colonization; implementasikan dari paper atau gunakan data yang sudah ada.
- Jangan mengubah teks, terjemahan, rute, atau data PCIM.
- Jangan menghapus Scrollama.
- Jangan membuat animasi yang menyorot sisi kiri/kanan.
- Jangan menampilkan buah sebelum fase terakhir.
- Jangan memakai `setInterval` untuk animasi scroll.
- Jangan menambahkan dependensi animasi baru tanpa alasan kuat.

## Aset yang tersedia

- `public/logo/logogram-white.png`
- `public/logo/logogram-color.png`
- `public/pattern/kelor-strip.webp`
- Font El Messiri dan Familjen Grotesk di `src/app/fonts/`.
- Warna brand di `src/app/globals.css`.

Tidak ada video pohon resmi. Jika ingin memakai video, pemilik proyek harus menyediakan file dan izinnya. Untuk saat ini, gunakan SVG.

## Hasil yang diharapkan

Serahkan:

1. Komponen baru/ubahan.
2. Data pohon yang diperbarui (jika ada).
3. CSS animasi.
4. Catatan pengujian: viewport, reduced motion, hasil build.
5. Screenshot/video singkat yang menunjukkan enam fase.

Jangan mengubah file lain di luar lingkup animasi pohon dan integrasi Scrollama.

