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
- Scroll reveal: elemen `data-reveal` dianimasikan saat scroll; konten default terlihat dan tidak pernah disembunyikan permanen; fallback 1,6 detik.
- Sejarah: Scrollama mengaktifkan tahun sesuai bab.
- Kalender: Masehi `2026-11-19` → `10 Jumadilakhir 1448 H · Wage`.
- Kalender: Hijriah `10 Jumadilakhir 1448` → `19 November 2026 · Wage`.
- Kabar: tab `Milad & Tanwir` menampilkan 6 item kompak.
- Kuis: 10 jawaban benar → skor `100`.
- Menu mobile: terbuka, navigasi anchor, lalu tertutup.
- Console error: tidak ada.

## Motion logo intro

- Default `/`: intro tampil sekali per sesi (`sessionStorage` `m114:intro-seen`).
- Paksa `/?intro=1`: intro tetap tampil.
- Desktop terang: `horizontal-light.mp4`; waktu uji 3,0 detik; video berjalan.
- Mobile terang: `vertical-light.mp4`; video berjalan.
- Desktop gelap: `horizontal-dark.mp4`; video berjalan.
- Reduced motion: intro dilewati.
- Tombol Lewati: overlay hilang, `sessionStorage` terisi, body scroll kembali normal.
- Ukuran video: 131–157 KB; poster: 112–204 KB.
- Video, situs, logo horizontal, dan OG sudah diselaraskan ke 19–21 November 2026 / 10–12 Jumadilakhir 1448 H. Logo statis di folder sumber masih 13–15 dan tidak dipakai untuk hero/OG.

## Catatan

- Lighthouse belum dijalankan pada mesin ini; target performa dan aksesibilitas masih perlu diukur di production.
- QR belum diuji karena payload dan pencetakan dikelola pemilik proyek.
- Terjemahan Arab adalah draf AI; verifikasi native ada di `TRANSLATION-REVIEW.md`.
- Animasi pohon bibit → berbuah belum dieksekusi; prompt ada di `PROMPT-ANIMASI-POHON.md`. Pohon sidebar saat ini statis tanpa highlight lobe.
- Uji perangkat fisik (Android mid-range, iOS Safari) masih perlu dilakukan sebelum submit.


