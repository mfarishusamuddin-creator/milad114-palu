# Handoff P2 — i18n Hero

Tanggal: 1 November 2026; revisi istilah 2 November 2026
Lingkup: hanya `src/i18n/*` (types + tiga kamus). Tidak ada komponen, aset, CSS, data, atau konfigurasi yang disentuh.

Revisi 2 November 2026: istilah organisasi di `heroArtwork` diselaraskan dengan Edaran Pimpinan Pusat Muhammadiyah No. 10/EDR/I.0/D/2023 (diverifikasi dari PDF halaman 2–6) melalui `Glossary/muhammadiyah-glossary.md`. Tidak ada key yang berubah; hanya nilai EN/AR/ID pada tiga baris aksi dan nama diri Arab.

## File yang diubah

| File | Perubahan |
|---|---|
| `src/i18n/types.ts` | Tambah type-only import `HeroActionId, HeroDetailId` dari `@/data/hero-artwork`; tambah `Dictionary.heroArtwork` |
| `src/i18n/id.ts` | Tambah objek `heroArtwork` (ID) |
| `src/i18n/en.ts` | Tambah objek `heroArtwork` (EN) |
| `src/i18n/ar.ts` | Tambah objek `heroArtwork` (AR, draf) |

Tidak ada key lama yang diubah, dihapus, atau diurutkan ulang. Hanya penambahan.

Catatan working tree: `src/i18n/id.ts` sudah memiliki satu perubahan belum ter-commit sebelum P2 (`services.highlightsTitle` berubah dari `"Penanda Saat Milad"` menjadi `"Penanda Milad"`). Perubahan itu **bukan** hasil P2 dan tidak disentuh; diff P2 murni penambahan blok `heroArtwork`.

## Keputusan

1. **Mengikuti bentuk di prompt P2, bukan ringkasan kontrak di atasnya.** Prompt P2 tidak memuat `subtitle` dan memuat `actions`; ringkasan kontrak global memuat `subtitle` dan tidak memuat `actions`. Yang dipakai: bentuk P2 (`title`, `imageAlt`, `shareLabel`, `shareStatus`, `details`, `actions`, `ayatKursi`). Lihat "Pertanyaan terbuka".
2. **`kelor` disertakan.** `HeroDetailId` aktual di `src/data/hero-artwork.ts` (milik P1) berisi 8 detail: `wajah`, `matahari`, `sorban`, `baju`, `janggut`, `telinga`, `mata`, `kelor`. Karena `details` bertipe `Record<HeroDetailId, …>`, `kelor` wajib ada; tabel P2 juga mencantumkannya.
3. **`actions` bertipe `Record<HeroActionId, …>`** dengan `judul` dan `tanggal`, sesuai `HeroActionId` P1.
4. **Tidak ada teks hadits/derajat/terjemahan** di `ayatKursi`; hanya label UI (`title`, `close`, `sourceLabel`, `gradeLabel`, `narratorLabel`). Isi hadits tetap milik P7.
5. **Tidak ada kredit, nama seniman, tahun, media, atau hak cipta** di `heroArtwork`.
6. **Tidak ada subtitle/figcaption.** Judul karya dibaca dari dalam gambar; `title` hanya untuk aksesibilitas/alt-like usage oleh komponen.
7. **Nilai awal diambil dari tabel P2**, lalu istilah organisasi diselaraskan dengan EDR 10/2023 (lihat bagian berikut). Ejaan nama `K.H. Ahmad Dahlan` dipertahankan untuk ID/EN; AR memakai `KH أحمد دهلان` agar konsisten dengan `history.ar.ts`.

## Penyelarasan istilah (EDR 10/EDR/I.0/D/2023)

Sumber: `C:\Users\faras\Downloads\10-EDR Istilah Istilah di Persyarikatan bhs Inggris Arab 2024.pdf` halaman 2–6 (Lampiran 1 no. 1–71 dan Lampiran 2 no. 1–18), dicocokkan dengan `Glossary/muhammadiyah-glossary.md`. Halaman 5–6 (UPP) tidak dipakai karena tidak ada istilah UPP di `heroArtwork`.

| Istilah | ID (glosarium) | EN (glosarium) | AR (glosarium) | Dipakai di |
|---|---|---|---|---|
| Pimpinan Pusat Muhammadiyah | Pimpinan Pusat Muhammadiyah | Central Board of Muhammadiyah | الرئاسة المركزية للجمعية المحمدية | `actions.tanggal.action` |
| Amal Usaha Muhammadiyah | Amal Usaha Muhammadiyah | Muhammadiyah Social Enterprise | المشروعات الخيرية للمحمدية | `details.sorban.action` |
| Muhammadiyah | Muhammadiyah | Muhammadiyah | المحمدية | label lain |

Keputusan:

- ID `actions.tanggal.action`: `Kepemimpinan Pusat` → **`Pimpinan Pusat Muhammadiyah`** (bentuk resmi EDR).
- EN `actions.tanggal.action`: `Central Leadership` → **`Central Board of Muhammadiyah`**.
- AR `actions.tanggal.action`: `القيادة المركزية للمحمدية` → **`الرئاسة المركزية للجمعية المحمدية`**.
- ID `details.sorban.action`: `Buka tabel AUM` → **`Buka tabel Amal Usaha Muhammadiyah`** (AUM tetap singkatan internal, tetapi label memakai istilah resmi).
- EN `details.sorban.action`: `Open the AUM table` → **`Open the Muhammadiyah Social Enterprise table`**.
- AR `details.sorban.action`: `افتح جدول الأعمال الخيرية` → **`افتح جدول المشروعات الخيرية للمحمدية`**.
- AR nama diri: `K.H. Ahmad Dahlan` → **`KH أحمد دهلان`** di `title`, `imageAlt`, `actions.judul.label`, dan `details.wajah.action`, mengikuti `src/data/history.ar.ts` dan `src/i18n/ar.ts`.
- Istilah yang tidak ada di glosarium (Al-Ma’un, Ayat Kursi, kelor/moringa, wajah, mata, telinga, janggut, matahari, agenda, layanan, makna logo) tetap memakai bentuk paling umum dan sudah dipakai konsisten di ketiga kamus.

## Tabel key

### Umum / aksi karya

| Key | ID | EN | AR |
|---|---|---|---|
| `heroArtwork.title` | K.H. Ahmad Dahlan | K.H. Ahmad Dahlan | KH أحمد دهلان |
| `heroArtwork.imageAlt` | Lukisan kaligrafi K.H. Ahmad Dahlan dengan sorban berisi Surah Al-Ma’un, baju berisi Ayat Kursi, lambang kelor, dan matahari Muhammadiyah. | A calligraphy painting of K.H. Ahmad Dahlan, with Surah Al-Ma’un on his turban, Ayat al-Kursi on his robe, the moringa emblem, and the Muhammadiyah sun. | لوحة خطية لـ KH أحمد دهلان، على عمامته سورة الماعون، وعلى ثوبه آية الكرسي، مع رمز المورينغا وشمس المحمدية. |
| `heroArtwork.shareLabel` | Bagikan karya | Share the artwork | شارك العمل |
| `heroArtwork.shareStatus.shared` | Terbagi | Shared | تمت المشاركة |
| `heroArtwork.shareStatus.copied` | Tautan disalin | Link copied | تم نسخ الرابط |
| `heroArtwork.shareStatus.manual` | Salin URL di address bar | Copy the URL from the address bar | انسخ الرابط من شريط العنوان |
| `heroArtwork.actions.judul.label` | K.H. Ahmad Dahlan | K.H. Ahmad Dahlan | KH أحمد دهلان |
| `heroArtwork.actions.judul.action` | Bagikan karya | Share the artwork | شارك العمل |
| `heroArtwork.actions.tanggal.label` | Tanggal lahir–wafat | Birth–death dates | تاريخ الميلاد والوفاة |
| `heroArtwork.actions.tanggal.action` | Buka Pimpinan Pusat Muhammadiyah | Open the Central Board of Muhammadiyah | افتح الرئاسة المركزية للجمعية المحمدية |

### Detail karya

| Key | ID | EN | AR |
|---|---|---|---|
| `details.wajah.label` | Wajah | Face | الوجه |
| `details.wajah.action` | Buka sejarah K.H. Ahmad Dahlan | Open the history of K.H. Ahmad Dahlan | افتح تاريخ KH أحمد دهلان |
| `details.matahari.label` | Matahari | Sun | الشمس |
| `details.matahari.action` | Buka sejarah Muhammadiyah | Open the history of Muhammadiyah | افتح تاريخ المحمدية |
| `details.sorban.label` | Al-Ma’un | Al-Ma’un | الماعون |
| `details.sorban.action` | Buka tabel Amal Usaha Muhammadiyah | Open the Muhammadiyah Social Enterprise table | افتح جدول المشروعات الخيرية للمحمدية |
| `details.baju.label` | Ayat Kursi | Ayat Kursi | آية الكرسي |
| `details.baju.action` | Buka fadhail Ayat Kursi | Open the virtues of Ayat Kursi | افتح فضائل آية الكرسي |
| `details.janggut.label` | Janggut | Beard | اللحية |
| `details.janggut.action` | Buka persebaran Muhammadiyah | Open Muhammadiyah’s reach | افتح انتشار المحمدية |
| `details.telinga.label` | Telinga | Ear | الأذن |
| `details.telinga.action` | Buka agenda | Open the agenda | افتح جدول الأعمال |
| `details.mata.label` | Mata | Eyes | العين |
| `details.mata.action` | Buka layanan Muhammadiyah | Open Muhammadiyah services | افتح خدمات المحمدية |
| `details.kelor.label` | Kelor | Moringa | المورينغا |
| `details.kelor.action` | Buka makna logo | Open the logo meaning | افتح معنى الشعار |

### Modal Ayat Kursi (label UI saja)

| Key | ID | EN | AR |
|---|---|---|---|
| `ayatKursi.title` | Fadhail Ayat Kursi | The Virtues of Ayat Kursi | فضائل آية الكرسي |
| `ayatKursi.close` | Tutup | Close | إغلاق |
| `ayatKursi.sourceLabel` | Sumber | Source | المصدر |
| `ayatKursi.gradeLabel` | Derajat | Grade | الدرجة |
| `ayatKursi.narratorLabel` | Perawi | Narrator | الراوي |

## Catatan review bahasa Arab (draf)

Semua string Arab di atas adalah **draf** dan perlu diverifikasi penutur asli. Yang perlu diperhatikan:

1. **Nama diri (selesai).** AR kini memakai `KH أحمد دهلان` di `title`, `imageAlt`, `actions.judul.label`, dan `details.wajah.action`, konsisten dengan `history.ar.ts` dan `ar.ts`. ID/EN tetap `K.H. Ahmad Dahlan` sesuai tabel P2. Mohon native speaker memastikan bentuk `KH` tanpa titik diterima untuk konteks Arab.
2. **AUM (selesai).** `details.sorban.action` kini memakai istilah resmi EDR: ID `Amal Usaha Muhammadiyah`, EN `Muhammadiyah Social Enterprise`, AR `المشروعات الخيرية للمحمدية`. Catatan: `history.tables.aum` lama masih EN `AUM` dan AR `الأعمال الخيرية`; itu teks lama di luar lingkup P2 dan perlu diselaraskan oleh pemilik/P4–P5.
3. **Pimpinan Pusat (selesai di heroArtwork).** `actions.tanggal.action` kini memakai `Pimpinan Pusat Muhammadiyah` / `Central Board of Muhammadiyah` / `الرئاسة المركزية للجمعية المحمدية` sesuai EDR. Catatan lama: `history.tables.leadership` di `ar.ts` masih berbunyi `قيادة قيادة المحمدية المركزية` (duplikasi `قيادة`) dan EN `Muhammadiyah Central Leadership`; **bukan bagian P2** dan sengaja tidak diubah.
4. **Istilah seni.** `لوحة خطية` (lukisan kaligrafi) dan `العمل` (karya) dipilih netral; belum ada istilah baku internal untuk “karya lukisan”. Perlu konfirmasi apakah `العمل` atau `اللوحة` lebih tepat untuk `shareLabel`.
5. **Matahari/kelor.** `شمس المحمدية` mengikuti `about.title`/`map`; `المورينغا` mengikuti `about`/`footer` yang sudah ada. Ejaan `المورينغا` dipertahankan (bukan `المورينجا`).
6. **Harakat.** Tidak ditambahkan harakat baru pada istilah yang sudah ada tanpa harakat; perlu keputusan gaya konsisten.
7. **EN.** `Ayat al-Kursi` dipakai di `imageAlt`, sedangkan `details.baju.label` tetap `Ayat Kursi` sesuai tabel P2. Ini disengaja (alt deskriptif vs label pendek), tetapi bisa diseragamkan bila pemilik mau.

## Hasil uji

| Perintah | Hasil |
|---|---|
| `npm run typecheck` | Lolos (tanpa error) |
| `npm run lint` | Lolos; 0 error, 12 warning lama di `src/Contoh Timeline.tsx` (`@next/next/no-img-element`) |
| `npm run build` | Lolos; Next.js 16.4.2, 11 halaman statis (`/`, `/en`, `/ar`, `/tentang`, `/en/tentang`, `/ar/tentang`, dll.) |

Uji visual 360/390/768/1024/1440 px **belum relevan** untuk P2 karena tidak ada komponen yang dirender; verifikasi visual menjadi tanggung jawab P3/P8 setelah komponen memakai kamus ini. Yang bisa dipastikan dari P2: tidak ada teks Indonesia yang tersisa di `en.ts`/`ar.ts` untuk blok `heroArtwork` (semua nilai EN/AR diisi eksplisit; satu-satunya aksara Latin di AR adalah singkatan nama `KH`). Ketiga perintah di atas dijalankan ulang setelah revisi istilah 2 November 2026 dan tetap lolos.

## Pertanyaan terbuka

1. **`subtitle` vs `actions`.** Ringkasan kontrak global mencantumkan `heroArtwork.subtitle` dan tidak mencantumkan `actions`; prompt P2 menghapus `subtitle` dan mewajibkan `actions`. Implementasi mengikuti P2. Jika P3 butuh `subtitle`, perlu penambahan terpisah di keempat file i18n.
2. **`shareStatus.shared` ID = “Terbagi”.** Secara tata bahasa, “Terkirim”/“Dibagikan” mungkin lebih lazim untuk status berbagi. Nilai dipertahankan persis dari tabel P2; mohon konfirmasi bila ingin diubah.
3. **`details.sorban.label` = “Al-Ma’un”.** Surah Al-Ma’un ditulis pada sorban; label detail memakai nama surah, bukan kata “Sorban”. Ini sesuai P2 dan disengaja, tetapi perlu dipastikan konsisten dengan niat desain P3.
4. **Duplikasi `قيادة قيادة`** di `history.tables.leadership` (`ar.ts`) dan istilah lama `Muhammadiyah Central Leadership`/`AUM`/`الأعمال الخيرية` di `history.tables` ditemukan saat audit; tidak diperbaiki karena di luar lingkup dan dilarang mengubah teks lama. Perlu tugas terpisah agar seluruh kamus memakai EDR 10/2023.
5. **Ejaan nama Arab** sudah diputuskan ke `KH أحمد دهلان`; yang tersisa hanya konfirmasi native speaker (catatan review no. 1).
