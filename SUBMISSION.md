# Submission Pack

## URL

- Produksi: `https://milad114-palu.vercel.app`
- Repo: `https://github.com/mfarishusamuddin-creator/milad114-palu`
- Rute: `/`, `/sejarah`, `/layanan`

## Studi kasus satu halaman

**Masalah.** Milad ke-114 punya banyak lapisan: perayaan, sejarah 114 tahun, dan layanan Muhammadiyah yang hidup sehari-hari. Website lomba perlu menampung ketiganya tanpa menjadi satu halaman panjang yang kehilangan fokus.

**Konsep.** “Satu Pohon, Tiga Pintu.” Pohon kelor dari logo resmi dipecah menjadi tiga bagian: Kanopi untuk Milad, Akar untuk sejarah, Batang untuk layanan. Pengunjung memilih pintu, bukan menebak menu.

**Eksekusi.**
- Tiga rute dengan identitas visual resmi: El Messiri, Familjen Grotesk, palet navy–teal–gold, dan supergraphic kelor.
- Beranda memuat countdown, tiga kartu pintu, pohon interaktif, agenda, dan kabar.
- Sejarah disusun dalam enam bab dengan sumber resmi di setiap bab; scrollytelling memakai **Scrollama** (MIT).
- Ilustrasi pohon memakai algoritma **space colonization** (Runions dkk., 2007) yang diimplementasikan ulang, bukan salinan kode repo.
- Layanan memakai data resmi: kalender KHGT (snapshot tersinkron) dan kabar Muhammadiyah (WP REST API, cache satu jam, fallback).
- Kuis 10 soal dengan penjelasan dan tautan sumber.
- Progres 3/3 disimpan di perangkat; tidak ada backend, login, atau database.

**Teknologi.** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Cache Components, font lokal OFL, Scrollama. Tanpa library peta/animasi berat. Layout mengikuti template identitas resmi (plate logo, pattern strip, proporsi tipografi), bukan template landing page generik.

**Konten.** Fakta diverifikasi di `CONTENT-VERIFIED.md`. Tanggal acara 13–15 November 2026 / 4–6 Jumadilakhir 1448 H; milad historis 18 November 2026. Angka amal usaha yang belum seragam tidak ditampilkan.

**Hasil uji.** Lihat `TEST-LOG.md`: build, lint, typecheck, 3 rute 200, viewport 390/768/1440 tanpa overflow halaman, konverter kalender, kuis 100, menu mobile, tanpa console error.

## Video demo 60–90 detik

1. 0–10 detik: hero, tagline, tanggal, countdown.
2. 10–22 detik: tiga kartu pintu dan pohon tumbuh; sorot tiga cabang.
3. 22–38 detik: `/sejarah`; timeline dan satu bab dengan sumber.
4. 38–55 detik: `/layanan`; kalender KHGT, konverter, tab kabar.
5. 55–70 detik: kuis; jawab satu soal, tunjukkan hasil/skor.
6. 70–82 detik: QR/progres 3/3 dan tombol bagikan.
7. 82–90 detik: penutup “Bersama Satukan Bangsa” + sumber data.

## Alur demo

1. Buka `/`; tunggu countdown.
2. Klik `Jelajahi Jejak 114 Tahun`.
3. Gulir satu bab; tunjukkan tautan sumber.
4. Klik `Buka Layanan`; ganti bulan kalender; coba konverter 13 Nov 2026.
5. Buka tab `Milad & Tanwir`.
6. Mulai kuis; jawab satu soal; tunjukkan penjelasan.
7. Kembali ke beranda; tunjukkan progres 3/3.

## Payload QR

```
Kanopi : https://milad114-palu.vercel.app/
Akar   : https://milad114-palu.vercel.app/sejarah
Batang : https://milad114-palu.vercel.app/layanan
```

Gunakan QR hitam-putih, error correction H, quiet zone 4 modul, tanpa logo di tengah, dan uji 3 ponsel. Jangan memakai URL preview Vercel.

## Checklist submit

- [ ] Deploy production dan pastikan 3 rute 200.
- [ ] Pastikan repo GitHub sudah berisi commit terbaru.
- [ ] Jalankan Lighthouse mobile; catat skor aktual.
- [ ] Uji QR dari layar dan cetak/lukisan.
- [ ] Uji iPhone Safari dan Android Chrome.
- [ ] Rekam video 60–90 detik.
- [ ] Lampirkan `TEST-LOG.md` dan `CONTENT-VERIFIED.md`.
- [ ] Pastikan tidak ada placeholder “sedang disiapkan”.
- [ ] Pastikan tidak ada teks “27 Rajab 1330 H” atau “19–21 November 2026”.
- [ ] Pastikan logo tidak diberi efek.

## Batasan yang jujur

- Lighthouse belum dijalankan di mesin pengembangan.
- QR dan lukisan fisik dikelola pemilik proyek.
- Jadwal rinci Tanwir menunggu Edaran/agenda resmi.
- Angka amal usaha nasional tidak ditampilkan karena sumbernya belum seragam.
