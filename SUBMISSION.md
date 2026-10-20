# Submission Pack

## URL

- Indonesia: `https://milad114-palu.vercel.app/`
- English: `https://milad114-palu.vercel.app/en`
- Arab: `https://milad114-palu.vercel.app/ar`
- Repo: `https://github.com/mfarishusamuddin-creator/milad114-palu`
- Satu index per bahasa. Rute lama `/sejarah` dan `/layanan` sudah dihapus; kontennya menjadi anchor `#sejarah` dan `#layanan`.

## Studi kasus satu halaman

**Masalah.** Milad ke-114 punya banyak lapisan: perayaan, sejarah 114 tahun, layanan Muhammadiyah, dan persebaran global. Website lomba perlu menampung semuanya tanpa kehilangan fokus, sekaligus membuka tiga gerbang bahasa untuk pengunjung Indonesia, Inggris, dan Arab.

**Konsep.** “Satu Pohon, Tiga Arah.”‌ Pohon kelor dari logo resmi menjadi metafora: Akar untuk sejarah, Batang untuk layanan, Kanopi untuk persebaran global. Satu index panjang, tiga bahasa, satu identitas.

**Eksekusi.**
- Tiga rute bahasa: `/`, `/en`, `/ar`; teks, istilah, dan layout Arab RTL.
- Tema terang/gelap dengan logo resmi yang berganti varian.
- Enam bab sejarah dengan Scrollama dan sumber resmi.
- Kalender KHGT (snapshot tersinkron) dan kabar Muhammadiyah (WP REST API, cache satu jam, fallback).
- Peta dunia Natural Earth yang menyorot 29 PCIM dengan marker kota.
- Kuis 10 soal, penjelasan, sumber, dan skor lokal.
- Scroll reveal, reduced motion, dan satu momen wow: pohon space colonization.

**Teknologi.** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Cache Components, Scrollama, world-atlas/topojson-client/d3-geo, font lokal OFL. Tanpa WebGL, tanpa database, tanpa login.

**Konten.** Fakta diverifikasi di `CONTENT-VERIFIED.md`. Tanggal acara 13–15 November 2026 / 4–6 Jumadilakhir 1448 H; milad historis 18 November 2026. Angka amal usaha yang belum seragam tidak ditampilkan. Terjemahan Arab masih perlu verifikasi native (lihat `TRANSLATION-REVIEW.md`).

## Video demo 60–90 detik

1. 0–10 detik: hero, tagline, tanggal, countdown.
2. 10–20 detik: indeks Jelajah dan pohon; sorot Akar, Batang, Kanopi.
3. 20–38 detik: scroll ke `#sejarah`; timeline dan satu bab dengan sumber.
4. 38–55 detik: `#layanan`; kalender KHGT, konverter, tab kabar.
5. 55–70 detik: kuis; jawab satu soal, tunjukkan hasil.
6. 70–82 detik: `#peta`; 29 negara dan marker; ganti tema.
7. 82–90 detik: ganti bahasa ke EN/AR; penutup “Bersama Satukan Bangsa”‌.

## Alur demo

1. Buka `/`; tunggu countdown.
2. Klik `Jelajahi Jejak 114 Tahun`.
3. Gulir satu bab; tunjukkan tautan sumber.
4. Buka `#layanan`; coba konverter 13 Nov 2026.
5. Buka tab `Milad & Tanwir`.
6. Mulai kuis; jawab satu soal.
7. Buka `#peta`; tunjukkan 29 PCIM.
8. Ganti tema dan bahasa.

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
- [ ] Pastikan tidak ada teks “27 Rajab 1330 H”‌ atau “19–21 November 2026”‌.
- [ ] Pastikan logo tidak diberi efek.

## Batasan yang jujur

- Lighthouse belum dijalankan di mesin pengembangan.
- QR dan lukisan fisik dikelola pemilik proyek.
- Terjemahan Arab adalah draf AI dan perlu verifikasi penutur asli.
- Jadwal rinci Tanwir menunggu Edaran/agenda resmi.
- Angka amal usaha nasional tidak ditampilkan karena sumbernya belum seragam.
- Animasi pohon penuh (bibit → berbuah) masih berupa prompt di `PROMPT-ANIMASI-POHON.md`; pohon sidebar saat ini statis tanpa highlight lobe.

