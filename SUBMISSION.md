# Submission Pack

## URL

- Indonesia: `https://milad114-palu.vercel.app/`
- English: `https://milad114-palu.vercel.app/en`
- Arab: `https://milad114-palu.vercel.app/ar`
- Repo: `https://github.com/mfarishusamuddin-creator/milad114-palu`
- Satu index per bahasa. Rute lama `/sejarah` dan `/layanan` sudah dihapus; kontennya menjadi anchor `#sejarah` dan `#layanan`.

## Studi kasus satu halaman

**Masalah.** Milad ke-114 punya banyak lapisan: perayaan, sejarah 114 tahun, layanan Muhammadiyah, dan persebaran global. Website lomba perlu menampung semuanya tanpa kehilangan fokus, sekaligus membuka tiga gerbang bahasa untuk pengunjung Indonesia, Inggris, dan Arab.

**Konsep.** “Dua Jalur, Satu Gerakan.”‌ Alur naratif: kisah jika-sesungguhnya (Makna Logo) → agenda (Tanwir Palu, Milad historis, Muktamar Medan) → jangkauan dunia (Peta 29 PCIM) → sejarah dua jalur (Muhammadiyah & KH Ahmad Dahlan) → layanan (Kalender KHGT, Kabar). Satu index panjang, tiga bahasa, satu identitas.

**Eksekusi.**
- Tiga rute bahasa: `/`, `/en`, `/ar`; teks, istilah, dan layout Arab RTL.
- Tema terang/gelap dengan logo resmi yang berganti varian.
- Sejarah dua jalur dengan timeline Aceternity (progres scroll) di desktop, accordion di mobile, tabel kepemimpinan dan AUM, sumber resmi.
- Kalender KHGT (snapshot tersinkron) dan kabar Muhammadiyah (WP REST API, cache satu jam, fallback).
- Peta dunia Natural Earth yang menyorot 29 PCIM dengan marker kota.
- Animated content (GSAP dan motion), reduced motion, dan satu momen wow: timeline dua jalur.

**Teknologi.** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Cache Components, GSAP, Motion, world-atlas/topojson-client/d3-geo, font lokal OFL. Tanpa WebGL, tanpa database, tanpa login.

**Konten.** Fakta diverifikasi di `CONTENT-VERIFIED.md`. Tanggal acara 19–21 November 2026 / 10–12 Jumadilakhir 1448 H; milad historis 18 November 2026. Angka amal usaha yang belum seragam tidak ditampilkan. Terjemahan Arab masih perlu verifikasi native (lihat `TRANSLATION-REVIEW.md`).

## Video demo 60–90 detik

1. 0–10 detik: hero, tagline, tanggal, countdown.
2. 10–20 detik: `#tentang` (makna logo) dan `#agenda` (tiga momen + pilar).
3. 20–38 detik: `#peta`; sorot 29 PCIM, lalu `#sejarah`; timeline dua jalur dan tabel.
4. 38–55 detik: `#layanan`; kalender KHGT, konverter, tab kabar.
5. 55–70 detik: scroll timeline sejarah menunjukkan progres garis; ganti tab jalur.
6. 70–82 detik: ganti bahasa ke EN/AR; penutup “Bersama Satukan Bangsa”‌.

## Alur demo

1. Buka `/`; tunggu countdown.
2. Scroll `#tentang` dan `#agenda`; tunjukkan pilar aksi.
3. Buka `#peta`; tunjukkan 29 PCIM.
4. Buka `#sejarah`; geser tab dua jalur, tunjukkan progres garis, buka tabel AUM.
5. Buka `#layanan`; coba konverter 19 Nov 2026.
6. Buka tab `Milad & Tanwir`.
7. Ganti tema dan bahasa.

## Payload QR

```
Indonesia : https://milad114-palu.vercel.app/
English   : https://milad114-palu.vercel.app/en
Arab      : https://milad114-palu.vercel.app/ar
```

Gunakan QR hitam-putih, error correction H, quiet zone 4 modul, tanpa logo di tengah, dan uji 3 ponsel. Jangan memakai URL preview Vercel. Setelah dilukis, jangan mengganti nama project/domain.

## Checklist submit

- [ ] Deploy production dan pastikan `/`, `/en`, `/ar` 200.
- [ ] Pastikan repo GitHub berisi commit terbaru.
- [ ] Jalankan Lighthouse mobile; catat skor aktual.
- [ ] Uji QR dari layar dan cetak/lukisan.
- [ ] Uji iPhone Safari dan Android Chrome.
- [ ] Uji mode terang/gelap.
- [ ] Uji RTL Arab.
- [ ] Rekam video 60–90 detik.
- [ ] Lampirkan `TEST-LOG.md`, `CONTENT-VERIFIED.md`, dan `TRANSLATION-REVIEW.md`.
- [ ] Pastikan tidak ada placeholder “sedang disiapkan”.
- [ ] Pastikan tidak ada teks “27 Rajab 1330 H” atau “13–15 November 2026” (versi lama).
- [ ] Pastikan logo tidak diberi efek.

## Batasan yang jujur

- Lighthouse belum dijalankan di mesin pengembangan.
- QR dan lukisan fisik dikelola pemilik proyek.
- Terjemahan Arab adalah draf AI dan perlu verifikasi penutur asli.
- Jadwal rinci Tanwir menunggu Edaran/agenda resmi.
- Angka amal usaha nasional tidak ditampilkan; tabel AUM PCIM memakai halaman resmi Cabang Istimewa Muhammadiyah (29 negara, catatan "Data dokumen 2026").
- Tahun kegiatan Khatib Amin (1890) mengikuti tabel dokumen resmi; catat bahwa riset online belum menemukan diverifikasi internet untuk tahun ini (rentang literatur 1888–1896).
- Logo horizontal dan OG 19–21 diturunkan dari frame motion logo resmi; logo statis di folder sumber masih 13–15 dan tidak dipakai untuk hero/OG.

