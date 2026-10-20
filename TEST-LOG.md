# Test Log

Tanggal uji: 20 Oktober 2026
Lingkungan: Windows, Node.js 22.23.2, Next.js 16.4.2, Edge headless.

## Build

- `npm run lint` — lolos tanpa error.
- `npm run typecheck` — lolos tanpa error.
- `npm run build` — lolos. Rute statis: `/`, `/sejarah`, `/layanan`, `/sitemap.xml`, `/robots.txt`, `/icon.png`.

## Rute

| Rute | Status | Catatan |
|---|---|---|
| `/` | 200 | Hero, countdown, tiga pintu, pohon, tentang, agenda, kabar |
| `/sejarah` | 200 | Enam bab, timeline, sumber |
| `/layanan` | 200 | Kalender KHGT, kabar, kuis |
| `/sitemap.xml` | 200 | Tiga URL |
| `/robots.txt` | 200 | Allow all + sitemap |

## Viewport

| Viewport | Lebar | scrollWidth | Overflow halaman |
|---|---|---|---|
| Mobile | 390 px | 390 px | Tidak ada |
| Tablet | 768 px | 768 px | Tidak ada |
| Desktop | 1440 px | 1440 px | Tidak ada |

Elemen dekoratif (orb/pattern) dan area scroll internal kalender/timeline tidak dihitung sebagai overflow halaman.

## Fungsional

- Beranda: H1 `Bersama Satukan Bangsa`; countdown menampilkan angka; ilustrasi space colonization berubah `is-grown` setelah masuk viewport.
- Sejarah: Scrollama mengaktifkan tahun `1868–1911 / Akar` saat bab pertama terlihat; enam tombol timeline; klik tahun terakhir mengaktifkan `2026–2027 / Buah`.
- Kalender: Masehi `2026-11-13` → `4 Jumadilakhir 1448 H · Wage`.
- Kalender: Hijriah `4 Jumadilakhir 1448` → `13 November 2026 · Wage`.
- Kabar: tab `Milad & Tanwir` menampilkan 6 item kompak.
- Kuis: 10 jawaban benar → skor `100`.
- Menu mobile: terbuka, navigasi ke `/sejarah`, lalu tertutup.
- Pohon: 321 cabang + 288 daun, SVG inline; tidak ada request gambar tambahan.
- Console error: tidak ada.

## Referensi desain

- Scrollytelling: `scrollama@3.2.0` (MIT); lisensi di `public/licenses/Scrollama-MIT.txt`.
- Ilustrasi pohon: algoritma space colonization (Runions dkk., 2007), diimplementasikan ulang di `scripts/generate-tree.mjs`; data kompak di `src/data/tree.ts`.
- Layout: mengikuti template identitas resmi (plate logo, pattern strip, proporsi tipografi), bukan template landing page generik.

## Catatan

- Lighthouse belum dijalankan pada mesin ini; target performa dan aksesibilitas masih perlu diukur di production.
- QR belum diuji karena payload dan pencetakan dikelola pemilik proyek.
- Uji perangkat fisik (Android mid-range, iOS Safari) masih perlu dilakukan sebelum submit.
