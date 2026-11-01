# Handoff P2 — i18n Hero

Tanggal: 1 November 2026
Lingkup: hanya `src/i18n/*` (types + tiga kamus). Tidak ada komponen, aset, CSS, data, atau konfigurasi yang disentuh.

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
7. **Nilai diambil persis dari tabel P2**, termasuk ejaan `K.H. Ahmad Dahlan`, `Al-Ma’un`/`Al-Ma’un`, `Ayat Kursi`/`Ayat al-Kursi`, `AUM`, dan `Kepemimpinan Pusat Muhammadiyah`.

## Tabel key

### Umum / aksi karya

| Key | ID | EN | AR |
|---|---|---|---|
| `heroArtwork.title` | K.H. Ahmad Dahlan | K.H. Ahmad Dahlan | K.H. Ahmad Dahlan |
| `heroArtwork.imageAlt` | Lukisan kaligrafi K.H. Ahmad Dahlan dengan sorban berisi Surah Al-Ma’un, baju berisi Ayat Kursi, lambang kelor, dan matahari Muhammadiyah. | A calligraphy painting of K.H. Ahmad Dahlan, with Surah Al-Ma’un on his turban, Ayat al-Kursi on his robe, the moringa emblem, and the Muhammadiyah sun. | لوحة خطية لـ K.H. Ahmad Dahlan، على عمامته سورة الماعون، وعلى ثوبه آية الكرسي، مع رمز المورينغا وشمس المحمدية. |
| `heroArtwork.shareLabel` | Bagikan karya | Share the artwork | شارك العمل |
| `heroArtwork.shareStatus.shared` | Terbagi | Shared | تمت المشاركة |
| `heroArtwork.shareStatus.copied` | Tautan disalin | Link copied | تم نسخ الرابط |
| `heroArtwork.shareStatus.manual` | Salin URL di address bar | Copy the URL from the address bar | انسخ الرابط من شريط العنوان |
| `heroArtwork.actions.judul.label` | K.H. Ahmad Dahlan | K.H. Ahmad Dahlan | K.H. Ahmad Dahlan |
| `heroArtwork.actions.judul.action` | Bagikan karya | Share the artwork | شارك العمل |
| `heroArtwork.actions.tanggal.label` | Tanggal lahir–wafat | Birth–death dates | تاريخ الميلاد والوفاة |
| `heroArtwork.actions.tanggal.action` | Buka Kepemimpinan Pusat Muhammadiyah | Open the Central Leadership of Muhammadiyah | افتح القيادة المركزية للمحمدية |

### Detail karya

| Key | ID | EN | AR |
|---|---|---|---|
| `details.wajah.label` | Wajah | Face | الوجه |
| `details.wajah.action` | Buka sejarah K.H. Ahmad Dahlan | Open the history of K.H. Ahmad Dahlan | افتح تاريخ K.H. Ahmad Dahlan |
| `details.matahari.label` | Matahari | Sun | الشمس |
| `details.matahari.action` | Buka sejarah Muhammadiyah | Open the history of Muhammadiyah | افتح تاريخ المحمدية |
| `details.sorban.label` | Al-Ma’un | Al-Ma’un | الماعون |
| `details.sorban.action` | Buka tabel AUM | Open the AUM table | افتح جدول الأعمال الخيرية |
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

1. **Nama diri.** Tabel P2 memakai bentuk Latin `K.H. Ahmad Dahlan` di `title`, `actions.judul.label`, dan `details.wajah.action`. Sementara `src/data/history.ar.ts` dan `src/i18n/ar.ts` yang sudah ada memakai `KH أحمد دهلان` (mis. `label` jalur dan tabel kepemimpinan). Dua bentuk ini kini hidup berdampingan. Perlu keputusan pemilik: samakan ke Latin (sesuai P2) atau ke `KH أحمد دهلان` (sesuai konvensi Arab internal).
2. **AUM.** `details.sorban.action` memakai `جدول الأعمال الخيرية` (tabel amal usaha), konsisten dengan `history.ar.ts` yang memakai `الأعمال الخيرية` untuk AUM. Alternatif yang lebih ringkas: `جدول AUM`; belum dipakai agar tidak menambah singkatan baru.
3. **Kepemimpinan Pusat.** `actions.tanggal.action` memakai `القيادة المركزية للمحمدية`, sejalan dengan `map.hq` dan `history.ar.ts`. `history.tables.leadership` di `ar.ts` saat ini berbunyi `قيادة قيادة المحمدية المركزية` (duplikasi kata `قيادة`) — **bukan bagian tugas P2** dan sengaja tidak diubah; perlu perbaikan terpisah oleh pemilik.
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

Uji visual 360/390/768/1024/1440 px **belum relevan** untuk P2 karena tidak ada komponen yang dirender; verifikasi visual menjadi tanggung jawab P3/P8 setelah komponen memakai kamus ini. Yang bisa dipastikan dari P2: tidak ada teks Indonesia yang tersisa di `en.ts`/`ar.ts` untuk blok `heroArtwork` (semua nilai EN/AR diisi eksplisit; satu-satunya aksara Latin di AR adalah nama diri dan `K.H.`).

## Pertanyaan terbuka

1. **`subtitle` vs `actions`.** Ringkasan kontrak global mencantumkan `heroArtwork.subtitle` dan tidak mencantumkan `actions`; prompt P2 menghapus `subtitle` dan mewajibkan `actions`. Implementasi mengikuti P2. Jika P3 butuh `subtitle`, perlu penambahan terpisah di keempat file i18n.
2. **Ejaan nama Arab.** Pakai `K.H. Ahmad Dahlan` (P2) atau `KH أحمد دهلان` (konvensi `history.ar.ts`)? Lihat catatan review no. 1.
3. **`shareStatus.shared` ID = “Terbagi”.** Secara tata bahasa, “Terkirim”/“Dibagikan” mungkin lebih lazim untuk status berbagi. Nilai dipertahankan persis dari tabel P2; mohon konfirmasi bila ingin diubah.
4. **`details.sorban.label` = “Al-Ma’un”.** Surah Al-Ma’un ditulis pada sorban; label detail memakai nama surah, bukan kata “Sorban”. Ini sesuai P2 dan disengaja, tetapi perlu dipastikan konsisten dengan niat desain P3.
5. **Duplikasi `قيادة قيادة`** di `history.tables.leadership` (`ar.ts`) ditemukan saat audit; tidak diperbaiki karena di luar lingkup dan dilarang mengubah teks lama.
