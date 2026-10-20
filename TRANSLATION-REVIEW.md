# Translation Review — Arabic

Terjemahan Arab di proyek ini adalah **draf AI**. Sebelum submit, wajib diperiksa penutur asli Arab (fusha) yang memahami konteks Muhammadiyah. Dokumen ini adalah daftar periksa, bukan bukti verifikasi.

## Prinsip

- Gunakan bahasa Arab fusha yang jelas, bukan dialek.
- Pertahankan nama resmi: Muhammadiyah (المحمدية), Tanwir (تنوير), Milad (الذكرى), PCIM (قيادة الفرع الخاص), KHGT (التقويم الهجري العالمي الموحد).
- Jangan mengubah tanggal, angka, nama tempat, atau kutipan ayat.
- Nama sumber resmi boleh tetap dalam bahasa Indonesia jika merupakan judul artikel; jelaskan jika perlu.
- Pastikan arah teks, harakat, dan tanda baca konsisten.

## Area yang perlu diperiksa

| Area | File | Status | Catatan |
|---|---|---|---|
| Metadata | `src/i18n/ar.ts` bagian `meta` | Draf | Judul dan deskripsi |
| Navigasi | `src/i18n/ar.ts` bagian `nav` | Draf | Menu, CTA, tema |
| Hero | `src/i18n/ar.ts` bagian `hero` | Draf | Judul, intro, plate, bahasa |
| Countdown | `src/i18n/ar.ts` bagian `countdown` | Draf | Label hari/jam/menit/detik |
| Indeks Jelajah | `src/i18n/ar.ts` bagian `gates` | Draf | Akar/Batang/Kanopi |
| Pohon | `src/i18n/ar.ts` bagian `tree` | Draf | Legenda dan anotasi |
| Tentang Milad | `src/i18n/ar.ts` bagian `about` | Draf | Paragraf, fakta, kutipan |
| Agenda | `src/i18n/ar.ts` bagian `agenda` | Draf | Tiga item |
| Sejarah | `src/i18n/ar.ts` + `src/data/milestones.ar.ts` | Draf | Enam bab |
| Layanan | `src/i18n/ar.ts` bagian `services` | Draf | Judul dan deskripsi |
| Kalender | `src/i18n/ar.ts` bagian `calendar` | Draf | Nama bulan, hari, event |
| Kabar | `src/i18n/ar.ts` bagian `kabar` | Draf | Label dan catatan sumber |
| Kuis | `src/i18n/ar.ts` + `src/data/quiz.ar.ts` | Draf | 10 soal dan penjelasan |
| Peta | `src/i18n/ar.ts` bagian `map` + `src/data/pcim.ts` | Draf | Nama negara/kota |
| Footer | `src/i18n/ar.ts` bagian `footer` | Draf | Kredit dan copyright |
| 404 | `src/i18n/ar.ts` bagian `notFound` | Draf | Pesan 404 |

## Istilah kunci

| Indonesia | Inggris | Arab | Catatan |
|---|---|---|---|
| Muhammadiyah | Muhammadiyah | المحمدية | Nama resmi |
| Tanwir | Tanwir | تنوير | Nama forum |
| Milad | Milad | الذكرى | Bisa “الذكرى السنوية” |
| Pimpinan Cabang Istimewa | Special Branch Leadership | قيادة الفرع الخاص | PCIM |
| Kalender Hijriah Global Tunggal | Global Unified Hijri Calendar | التقويم الهجري العالمي الموحد | KHGT |
| Daun kelor | Moringa leaf | ورقة المورينغا | Simbol logo |
| Bersama Satukan Bangsa | Together, Unite the Nation | معًا نوحّد الأمة | Tema resmi |
| Amal usaha | Amal usaha | الأعمال الخيرية | Bisa dipertahankan sebagai istilah |
| Kauman | Kauman | كاومان | Nama tempat |
| Palu | Palu | بالو | Nama kota |

## Yang harus dicek khusus

1. **Judul hero**: “معًا نوحّد الأمة” harus terasa natural dan tidak memotong makna.
2. **Nama tempat**: Kauman, Yogyakarta, Palu, Sulawesi Tengah, Medan.
3. **Nama tokoh**: KH Ahmad Dahlan, KH Ibrahim, KH Hisyam, KH Mas Mansur, Ki Bagus Hadikusuma.
4. **Nama lembaga**: Madrasah Ibtidaiyah Diniyah Islamiyah, Universitas Muhammadiyah Palu, Muktamar ke-49.
5. **Ayat**: QS Al-Hujurat 10 dan 13 — jangan menulis ulang ayat; cukup rujukannya.
6. **Tanggal Hijriah**: 4–6 Jumadilakhir 1448 H; 9 Jumadilakhir 1448 H.
7. **Angka**: 114, 29, 1912, 2026, 2027.
8. **Nama event**: Tanwir, Milad, Muktamar.
9. **Nada**: hormat, informatif, tidak bombastis.
10. **RTL**: pastikan tanda baca tidak terbalik dan angka tetap terbaca.

## Checklist reviewer

- [ ] Semua teks di `src/i18n/ar.ts` sudah dibaca.
- [ ] Enam bab di `src/data/milestones.ar.ts` sudah dibaca.
- [ ] Sepuluh soal di `src/data/quiz.ar.ts` sudah dibaca.
- [ ] Nama 29 negara/kota di `src/data/pcim.ts` sudah dicek.
- [ ] Tidak ada campuran dialek.
- [ ] Tidak ada terjemahan yang mengubah fakta.
- [ ] Tidak ada teks Inggris/Indonesia yang tertinggal di halaman `/ar` kecuali nama resmi/sumber.
- [ ] Tanda baca dan harakat konsisten.
- [ ] Halaman `/ar` diuji di 390 px dan 1440 px.
- [ ] RTL tidak memotong teks.

## Cara memperbaiki

1. Edit `src/i18n/ar.ts` untuk UI.
2. Edit `src/data/milestones.ar.ts` untuk sejarah.
3. Edit `src/data/quiz.ar.ts` untuk kuis.
4. Edit `src/data/calendar-highlights.ar.ts` untuk penanda kalender.
5. Edit `src/data/pcim.ts` untuk nama negara/kota.
6. Jalankan `npm run typecheck`, `npm run lint`, `npm run build`.
7. Buka `/ar` dan periksa ulang.

## Catatan kejujuran

Tidak ada verifikasi native yang dilakukan dalam pembuatan draf ini. Status semua item di atas adalah **draf**. Jangan mengklaim “sudah diverifikasi” sampai penutur asli menandatangani checklist ini.
