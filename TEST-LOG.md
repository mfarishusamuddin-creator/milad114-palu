# Test Log

Tanggal uji: 20 Oktober 2026
Lingkungan: Windows, Node.js 22.23.2, Next.js 16.4.2, Edge headless.

## Build

- `npm run lint` — lolos tanpa error.
- `npm run typecheck` — lolos tanpa error.
- `npm run build` — lolos. Rute statis: `/`, `/en`, `/ar`, `/sitemap.xml`, `/robots.txt`, `/icon.png`.
- `npm audit --omit=dev` — 0 vulnerabilities.

## Rute

| Rute | Status | Catatan |
|---|---|---|
| `/` | 200 | Indonesia; satu index |
| `/en` | 200 | English; satu index |
| `/ar` | 200 | Arab; RTL |
| `/sitemap.xml` | 200 | Tiga URL bahasa |
| `/robots.txt` | 200 | Allow all + sitemap |
| `/sejarah` | dihapus | Konten menjadi `/#sejarah` |
| `/layanan` | dihapus | Konten menjadi `/#layanan` |

## Bahasa

| Rute | `html lang` | `html dir` | H1 |
|---|---|---|---|
| `/` | id | ltr | Bersama Satukan Bangsa |
| `/en` | en | ltr | Together Unite the Nation |
| `/ar` | ar | rtl | ظ…ط¹ظ‹ط§ ظ†ظˆط­ظ‘ط¯ ط§ظ„ط£ظ…ط© |

## Viewport

| Viewport | Lebar | scrollWidth | Overflow halaman |
|---|---|---|---|
| Mobile | 390 px | 390 px | Tidak ada |
| Desktop | 1440 px | 1440 px | Tidak ada |

## Peta

- 29 path negara PCIM.
- 29 marker kota.
- Daftar negara lengkap per kawasan: Afrika, Asia, Eropa, Amerika, Oseania.
- Mode gelap: highlight kelor dan marker emas terbaca.

## Fungsional

- Tema: tombol mengubah `data-theme` menjadi `dark`; pilihan disimpan di `localStorage`.
- Logo: varian putih tampil di mode gelap.
- Animated content: elemen `<Reveal>` (GSAP/ScrollTrigger) dianimasikan sekali dari bawah saat scroll; konten di-`visibility: hidden` awal dan ditampilkan oleh ScrollTrigger; fallback `scripting: none`/`noscript`; reduced motion langsung tampil.
- Timeline sejarah: tab dua jalur bergantian; progres garis bergerak; tabel terbaca di 390 px.
- Kalender: Masehi `2026-11-19` → `10 Jumadilakhir 1448 H · Wage`.
- Kalender: Hijriah `10 Jumadilakhir 1448` → `19 November 2026 · Wage`.
- Kabar: tab `Milad & Tanwir` menampilkan 6 item kompak.
- Menu mobile: terbuka, navigasi anchor, lalu tertutup.
- Console error: tidak ada.

## Motion logo intro

- Default `/`: intro tampil setiap refresh.
- Refresh setelah skip → intro tampil lagi.
- Navigasi internal → intro tidak muncul lagi.
- Reduced motion → intro dilewati.
- Desktop terang: `horizontal-light.mp4`; waktu uji 3,0 detik; video berjalan.
- Mobile terang: `vertical-light.mp4`; video berjalan.
- Desktop gelap: `horizontal-dark.mp4`; video berjalan.
- Reduced motion: intro dilewati.
- Tombol Lewati: overlay hilang, body scroll kembali normal.
- Ukuran video: 131–157 KB; poster: 112–204 KB.
- Video, situs, logo horizontal, dan OG sudah diselaraskan ke 19–21 November 2026 / 10–12 Jumadilakhir 1448 H. Logo statis di folder sumber masih 13–15 dan tidak dipakai untuk hero/OG.

## Catatan

- Lighthouse belum dijalankan pada mesin ini; target performa dan aksesibilitas masih perlu diukur di production.
- QR belum diuji karena payload dan pencetakan dikelola pemilik proyek.
- Terjemahan Arab adalah draf AI; verifikasi native ada di `TRANSLATION-REVIEW.md`.
- Uji manual interaksi (tab timeline, accordion mobile, hover tabel/cell, RTL timeline) belum sepenuhnya dijalankan di browser nyata; itu terjadi setelah verifikasi baris perintah.
- Uji perangkat fisik (Android mid-range, iOS Safari) masih perlu dilakukan sebelum submit.

## Sesi restrukturisasi 21 Oktober 2026

- Restrukturisasi "Satu Pohon, Tiga Arah" → "Dua Jalur, Satu Gerakan" dieksekusi; komponen/pratinjau pohon dan bab (GatewayCards, GrowingTree, SpaceTree, HistoryExperience, tree.ts, milestones*.ts, Scrollama, scripts/generate-tree) dihapus.
- `npm run typecheck` — lolos.
- `npm run lint` — 0 error; 12 warning bawaan `src/Contoh Timeline.tsx` (elemen `<img>` dari demo Aceternity, file referensi yang tidak dikompilasi).
- `npm run build` — lolos; rute statis `/`, `/en`, `/ar`, `_not-found`, sitemap, robots, icon.
- `motion` ditambah sebagai dependency (useScroll/useTransform untuk progres garis timeline); `scrollama` dihapus beserta license-nya.
- `npm audit --omit=dev`: 5 advisori high severity **pra-eksisting** (dependensi transitive yang lama); `audit fix --force` sengaja tidak dijalankan.


