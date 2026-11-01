# HERO-ASSETS.md — Kepemilikan P1

Peta sumber, edit yang dilakukan, ukuran, dan catatan kualitas untuk aset hero
interaktif. Berkas dalam kepemilikan P1: `public/media/hero/**`,
`src/data/hero-artwork.ts`, dan dokumen ini.

Status: **revisi keempat (P1 v4) + penajaman v4.1/v4.2/v4.3** — presisi antar-hotspot:
03 `sorban` path evenodd (batas sorban/hairline + lubang telinga), 01 `wajah`
path evenodd (profil wajah + lubang kedua mata), 04 `baju` DUA entri
(**v4.1: poligon ketat mengikuti kontur kaligrafi — tanpa kertas kosong,
tanpa kelor**; 04a blok Ayat Kursi 2 loop, 04b gugus sekeliling logo 4 loop),
08 `kelor` **v4.1: poligon kontur bunga** (bukan ellipse), 02 `matahari`
**v4.3: siluet bintang 12 sinar — 24 vertex (12 ujung + 12 lembah), semua
garis lurus** (arahan pemilik; bukan bulat), `sorban.jpg` di-crop ulang,
tiga overlay approval, dan **bukti rasterisasi: 66 pasangan entri beririsan
0 px** (jarak minimum antar entri 2,0 px). Contoh arahan pemilik:
`Hero Image/Contoh pada baju.jpg` (garis merah = teks, hijau = kelor) dan
`Hero Image/Contoh V2 Sun.jpg` (hijau = seluruh lambang matahari, ikut
lembah). `hero-artwork.jpg` tidak diubah.

## 1. Peta sumber (folder `Hero Image/`)

| File sumber | Isi | Dipakai untuk |
|---|---|---|
| `PXL_20261030_053757743.MP.jpg.jpeg` (4032 × 2268) | Satu-satunya foto landscape yang memuat **seluruh karya** | Hero utama; crop native `sorban`, `judul`, `tanggal` |
| `PXL_20261030_054601618.MP.jpg.jpeg` (2268 × 4032) | Close-up kepala/pundak | Detail `wajah`, `mata`, `telinga`, `janggut` |
| `PXL_20261030_054742732.MP.jpg.jpeg` (2268 × 4032) | Close-up matahari (bintang Muhammadiyah) utuh | Detail `matahari` |
| `PXL_20261030_054826559.MP.jpg.jpeg` (2268 × 4032) | Close-up lambang kelor | Detail `kelor` (revisi v2) |
| `PXL_20261030_055102973.MP.jpg.jpeg` (2268 × 4032) | Close-up blok ayat pada baju | Detail `baju` (diganti di revisi v2; sebelumnya dari `054601618`) |
| `PXL_20261030_055008270`, `PXL_20261030_055155215` | Varian close-up matahari/lambang | Cadangan; `055155215` tidak dipakai (bagian bintang terpotong di pinggir; `054742732` lebih utuh) |
| `PXL_20261030_054058189.MP~2`, `PXL_20261030_054244147.MP~2` | Strip close-up teks Gothic "K.H. Ahmad Dahlan" | Tidak dipakai: bukan strip barcode (dikecualikan dari pemakaian), dan resolusinya rendah; `judul`/`tanggal` di-crop native dari hero |

Tidak ada reshoot; semua proses memakai foto yang ada.

## 2. Edit yang dilakukan (cukup crop/rotate/perspective/exposure/color balance)

Pipeline (dikerjakan dengan Python/Pillow, tanpa generative fill/AI upscaling,
kaligrafi tidak diubah):

1. **Rotasi 90° berlawanan arah jarum jam** (CCW) — foto landscape memuat karya
   berbaring; setelah rotasi wajah tegak, nama "K.H. Ahmad Dahlan" di atas.
2. **Koreksi perspektif** berbasis empat sudut kertas yang dideteksi otomatis
   (threshold terang pada latar karpet), tervalidasi visual:
   TL (109, 314), TR (2120, 336), BR (2238, 3229), BL (135, 3306) — pada piksel
   asli hasil rotasi (2268 × 4032). Peta menjadi (2058 × 2944), rasio ≈ 0,699.
3. **Crop tepi 0,4%** dari tiap sisi untuk membuang serat/tepi kertas dan
   bagian kaki/karpet/lantai di sekeliling.
4. **Color balance konservatif**: gain per kanal dihitung agar p95 area terang
   miring netral (gain dibatasi maksimal ±8%). Kertas aslinya nyaris netral,
   jadi perubahan kecil.
5. **Exposure konservatif**: gamma 1,20 + kontras 1,04. Hasil: kertas p95 dari
   ~205 → ~211; goresan tetap kontras, tidak ada highlight yang terbuang.
6. **Detail warna konsisten**: semua crop dari close-up di-filter pipeline
   warna yang sama (gain ke target p95 205, clip ±8%; gamma 1,20; kontras 1,04)
   agar seragam dengan hero; hanya downscale (tidak ada upscale).
7. **Revisi v2**:
   - `judul.jpg` — crop native dari hero "K.H. Ahmad Dahlan" tanpa upscale,
     kertas ikut dipertahankan (untuk preview/share, bukan tombol visual).
   - `tanggal.jpg` — crop native baris kaligrafi tanggal lahir–wafat di bawah
     judul; band pertama (y 11–13%) dibuang karena terkontaminasi florish
     judul; band bersih di y ≈ 13,0–16,6%.
   - `sorban.jpg` — diganti: kini massa kaligrafi sorban yang mengelilingi
     kepala (bukan baris tanggal, bukan wordmark).
   - `kelor.jpg` — baru, dari close-up `054826559`.
   - `baju.jpg` — diganti: kini dari `055102973` (blok ayat Kursi pada baju);
     crop pertama masih memuat sliver biru kelor di pojok kiri-bawah,
     diperketat mulai x 38,2% sumber hingga bersih (tanpa kelor, tanpa
     matahari).
   - Dua overlay approval dibuat ulang (lihat §3).

## 3. Daftar berkas hasil

| Berkas | Ukuran (px) | Berat | Sumber |
|---|---|---|---|
| `public/media/hero/hero-artwork.jpg` (q88) | 1386 × 1984 | 465,5 KB | `053757743` (rotasi + perspektif) — **tidak diubah di v2–v4** |
| `public/media/hero/hotspots-preview.jpg` (q85, approval) | 1386 × 1984 | 522,2 KB | Hero + overlay **12 hotspot** (isian cakupan klik + garis biru lubang + chip + legenda) — revisi v4.2 |
| `public/media/hero/hotspots-face-preview.jpg` (q85, approval) | 1354 × 1468 | 301,9 KB | Zoom wajah (crop x 36–74, y 27–62, zoom 2×) + 01/03/05/06/07a/07b + lubang mata & telinga — revisi v4 |
| `public/media/hero/hotspots-baju-preview.jpg` (q85, approval, **baru v4**) | 2366 × 1668 | 557,1 KB | Zoom baju + matahari (crop x 14–80, y 50–88, zoom 2×) + 04a + 04b + 02 + 05 + 08 + gap |
| `details/wajah.jpg` | 597 × 700 | 59,7 KB | `054601618` |
| `details/matahari.jpg` | 545 × 700 | 91,8 KB | `054742732` |
| `details/sorban.jpg` (diganti v4) | 590 × 662 | 88,5 KB | crop hero dari polygon 03 v4 (x 29,2–71,8%, y 20,6–54,0%); piksel di luar polygon dimask warna kertas (feather 1,2 px) — bebas mata/alis/kulit wajah; telinga ikut terlihat (bukan wajah) |
| `details/baju.jpg` (diganti v2) | 408 × 700 | 91,0 KB | `055102973` crop 38,2,10,5 + 50,2 × 48,5% |
| `details/janggut.jpg` | 612 × 605 | 68,6 KB | `054601618` |
| `details/telinga.jpg` | 363 × 524 | 46,0 KB | `054601618` |
| `details/mata.jpg` | 386 × 323 | 20,0 KB | `054601618` |
| `details/kelor.jpg` (baru v2) | 687 × 700 | 95,3 KB | `054826559` crop 11,5,30,5 + 71,5 × 41% |
| `details/judul.jpg` (baru v2) | 689 × 171 | 28,1 KB | crop hero 29,3,3,4 + 49,7 × 8,6% (q88) |
| `details/tanggal.jpg` (baru v2) | 802 × 71 | 14,7 KB | crop hero 25,8,13,0 + 57,9 × 3,6% (q88) |

Tidak ada satu berkas pun di `public/media/hero/` yang melebihi 1 MB; semua
detail/aksi < 100 KB (quality dikendorkan per berkas tebal: matahari q76,
kelor q79, baju q85, sorban q85 — bebas artefak terlihat pada 100%).

## 4. Manifes koordinat (`src/data/hero-artwork.ts`)

Revisi v4 — presisi antar-hotspot tanpa irisan (dasar: masukan pemilik
1 Nov 2026 + prompt P1 v4). Metode: profil mask tinta per kolom/baris
(langkah 0,5–1%) untuk sorban/hairline/wajah; mask biru/navy + fit ellipse
untuk lambang; **shape `path` (koordinat px, viewBox 0 0 1386 1984) dengan
`fillRule: "evenodd"` untuk bentuk berlubang** (lubang = subpath kedua dst.).

| # | id | bbox (x, y, w, h) % | shape | Bentuk & keterangan |
|---|---|---|---|---|
| A1 | `judul` | 29.5, 3.8, 49.6, 8.2 | rect | "K.H. Ahmad Dahlan"; tinta x 30,09–78,21%, y 4,54–11,44% |
| A2 | `tanggal` | 25.8, 13.0, 57.9, 3.6 | rect | baris tanggal lahir–wafat (tinta y ≈ 13,3–16,1%) |
| 01 | `wajah` | 54.9, 32.5, 16.1, 17.2 | **path evenodd** | poligon profil wajah (17 titik); tepi atas mengikuti garis rambut + gap ≥ 15 px dari 03; DUA LUBANG mata (07a/07b + ~3 px) — wajah tak menumpuk hotspot mata; bawah y 49,7 (gap 4,0 px dari 05) |
| 02 | `matahari` | 56.64, 65.07, 24.10, 19.20 | **path evenodd** | **v4.3** SILUET bintang 12 sinar (arahan pemilik: lambang pada lukisan = bintang 12 sudut logo Muhammadiyah; bintang 12 sudut ber-garis-lurus PASTI memunculkan lembah → jumlah vertex LEBIH BANYAK dari 12): **24 vertex berselang-seling** — 12 UJUNG sinar (diukur objektif dari mask biru: blob lambang utuh closing 6; profil r(θ) per 1°; find_peaks prominence 20, distance 8; jarak antar sinar 26–35°; semua di rim, r ≥ 161 px) + 12 LEMBAH di tepi luar biru antar sinar (argmin r(θ) di tengah sektor, pencarian 20–80% span; r 105–138 px) — semua dihubungkan garis lurus, tanpa vertex lain, TANPA DP; kaligrafi cakram + pita + isi bintang berada di dalam poligon tanpa vertex/potongan (disengaja); teks biru lepas tidak ikut |
| 03 | `sorban` | 29.5, 20.8, 42.0, 33.0 | **path evenodd** | poligon batas sorban/hairline (78 titik, hasil profil tinta per kolom/baris); berhenti di garis rambut (tidak masuk wajah); LUBANG telinga (06 + ~2 px); ekor keruntitan di bawah telinga & rosette kerah sengaja tidak dicakup (zona ambigu, prinsip presisi) |
| 04a | `baju` | 23.59, 56.35, 34.78, 25.25 | **path evenodd** | **v4.1** poligon KETAT mengikuti kontur kaligrafi blok Ayat Kursi (2 subpath disjoint = union; kontur eksak mask tinta non-biru + Douglas-Peucker 4 px) — **tanpa kertas kosong, tanpa kelor** (blob dipangkas 8 px dari kontur kelor); v4.3: tepi kanan ikut dipangkas 10 px dari poligon 02 baru; teks "wa" ikut konturnya |
| 04b | `baju` | 58.59, 56.35, 25.33, 22.43 | **path evenodd** | **v4.1** gugus kaligrafi di sekeliling logo matahari (4 subpath disjoint: atas, kanan-atas, kanan, kanan-bawah) — masing-masing mengikuti kontur teks; **v4.3: fragmen yang jatuh di dalam SILUET bintang 02 DIKELUARKAN** ("fragmen mengalah" — keputusan pemilik; teks dipangkas 10 px dari poligon 02) — bagian gugus kanan di luar lembah tetap di 04b; gap ke 04a 4,0 px, ke 02 4,2 px |
| 05 | `janggut` | 56.4, 49.9, 14.1, 5.8 | ellipse | massa jenggot dagu **diperpanjang ke kanan (v4: sampai x 70,5)** — massa jenggot terukur sampai situ; misai/bibir di luar |
| 06 | `telinga` | 38.4, 41.5, 5.2, 6.1 | ellipse | palung telinga; terkecuali dari 03 via lubang evenodd (gap 2,0 px) |
| 07a | `mata` | 59.1, 37.9, 3.6, 1.6 | ellipse | mata kiri-gambar; jadi LUBANG dalam 01 (+ ~3 px) |
| 07b | `mata` | 66.8, 37.95, 3.2, 1.35 | ellipse | mata kanan-gambar; jadi LUBANG dalam 01 (+ ~3 px) |
| 08 | `kelor` | 28.64, 69.76, 15.87, 11.69 | **path evenodd** | **v4.1** poligon KETAT mengikuti kontur bunga + kepala kelor (mask biru, kontur eksak + margin 2 px, Douglas-Peucker 3 px) — menggantikan ellipse; ekor kata "wa" yang menyentuh kepala ikut kontur biru sehingga tidak memotong kaligrafi lain; gap ke 04a 3,0 px |

**Hit area**: semua ≥ 44 px KECUALI kedua ring `mata` (07a ≈ 32 px,
07b ≈ 27 px) — sengaja, presisi didahulukan (masukan pemilik). Rekomendasi
P2/P3: padding sentuh tidak terlihat ≥ 44 px di sekitar ring mata.

**Larangan yang dipatuhi**: `hero-artwork.jpg`, `src/i18n/**`, komponen,
palet, font tidak diubah; tanpa upscale/generative fill; kaligrafi tak
disentuh; tanpa strip barcode.

## 5. Masukan langsung pemilik (1 Nov 2026) — dasar revisi v3

Kutipan pemilik (unsur umum): *"Bisakah Anda memperketat logo Muhammadiyah
agar menjadi bulat saja karena baju itu ada kanan dan kiri; kemudian letak
telinga, kedua mata, janggut, dan daun kelor dibuat lebih presisi … hotspot
tidak perlu mencakup semuanya jika susah, tapi jangan sampai menyentuh
bagian lain atau terletak pada yang bukan bagiannya … bagian yang menjadi
cakupan klik harus diberi tanda agar orang tahu."*

Tindakan yang diambil:
1. `matahari` → ring **bulat** pada cakram pusat + lingkaran teks logo;
   tepi kiri/kanan tidak lagi masuk area teks baju.
2. `telinga`, `mata` ×2, `janggut`, `kelor` → dipersempit ke objek itu saja
   (tabel §4).
3. Overlay: isian warna transparan di dalam tiap ring + legenda
   "Daerah berwarna = cakupan klik, merah = detail, emas = aksi".

**Adendum v4 (prompt P1 v4, 1 Nov 2026)** — pelaksanaan masukan di atas
sampai level bukti: 03 jadi polygon/path batas sorban-hairline tanpa
menyentuh wajah; 04a segitiga/trapesium + lubang bulat kelor (`path` +
`fillRule: "evenodd"`); 04b entri `baju` kedua untuk baju kecil di atas
logo; manifest 12 entri; **bukti intersection antar-ID = 0 px** (§8);
`sorban.jpg` di-crop ulang dari polygon baru (bebas mata/alis/kulit wajah);
tiga overlay dengan tanda cakupan klik.

**Adendum v4.1 (arahan langsung pemilik, 1 Nov 2026)** — pemilik memberi
contoh anotasi `Hero Image/Contoh pada baju.jpg`: **garis merah** = poligon
ketat mengikuti kontur kaligrafi baju, **garis hijau** = poligon ketat kontur
kelor. Tuntutan: baju tidak boleh mencakup kelor ataupun kertas putih
kosong. Pelaksanaan: kontur eksak (crack boundary) dari mask tinta non-biru
(baju) dan mask biru (kelor), margin 2 px, Douglas-Peucker; teks dipangkas
8 px dari kelor/ring 02/05 sehingga gap poligon ≥ 2-4 px; hasil lihat §4
(04a, 04b, 08) dan bukti §8.

**Adendum v4.3 (arahan langsung pemilik, mengikat & dikonfirmasi eksplisit,
1 Nov 2026; dikoreksi kedua kali oleh orkestrator atas penegasan pemilik)** —
lambang matahari pada lukisan = **bintang 12 sudut** (logo Muhammadiyah).
Dua percobaan yang DITOLAK: (a) poligon kontur 133 titik v4.2 (berkeliuk
ikut tekstur, merusak bentuk bintang); (b) poligon 12-vertex-chord (ujung
sinar dihubungkan chord lurus) — pemilik menegaskan: **bintang 12 sudut
BERBEDA dengan poligon 12 vertex; bintang 12 sudut dengan garis lurus PASTI
memunculkan LEMBAH, sehingga bisa memunculkan LEBIH BANYAK titik poligon**
("perhatikan warna biru pada logo matahari"). Bentuk final yang disetujui
resepnya: poligon 02 = **SILUET bintang — 24 vertex berselang-seling**: 12
UJUNG sinar + 12 LEMBAH (cekungan antara dua sinar) yang turun ke tepi luar
biru dekat pita — semua dihubungkan garis lurus, tanpa vertex lain, tanpa DP.
Tidak ada vertex di dalam lambang: kaligrafi "Muhammad" di cakram, pita teks
keliling, dan seluruh isi bintang TIDAK diberi titik dan TIDAK dipotong
boundary (berada di dalam poligon — memang disengaja). Pengukuran objektif
dari mask biru, menghormati ketidaksempurnaan tangan pelukis (bukan bintang
geometris kaku): blob lambang utuh (closing 6 — dengan closing 3, dua-tiga
sinar kanan-bawah yang dicat dengan biru berbeda ternyata komponen terpisah
sehingga profil kolaps di sektor 35–70°), profil radial r(θ) 360 sampel per
1° dari pusat cakram (960.6, 1487.2) px; 12 ujung = find_peaks **prominence
20 / distance 8** (jarak antar sinar 26–35°, semua di rim r ≥ 161 px); 12
lembah = argmin r(θ) di tengah sektor (pencarian 20–80% span; r 105–138 px).
**Keputusan "fragmen mengalah"**: fragmen kecil teks 04b yang jatuh di dalam
siluet bintang DIKELUARKAN dari 04b (teks dipangkas 10 px dari poligon 02);
bentuk bintang TIDAK ditekuk untuk menghindari mereka. Blob bintang TIDAK
dipangkas — konflik diselesaikan di sisi 04a/04b. Ulang uji: 66/66 pasangan
0 px (§8).

## 6. Deviasi dari posisi indikatif prompt (diakui + alasan)

Peta indikatif diukur ulang; penyimpangan berikut dianggap lebih akurat:

1. **judul**: tinta memanjang sampai x 78,2% (indikatif 27–79% — cocok); rect
   final x 29,5–79,1%. Preview crop native `judul.jpg` memakai 29,3–79,0%.
2. **tanggal**: indikatif y 13–18%; tinta terukur y ≈ 13,3–16,1%. Band 16,1–18%
   kosong, jadi rect final y 13,0–16,6%.
3. **wajah**: indikatif x 44–72%, y 31–58%; v4 poligon profil x 54,9–71,0%,
   y 32,5–49,7% (wajah tampak profil; tepi atas mengikuti garis rambut,
   bawah berhenti di atas 05 — area kiri x 43–55 adalah massa sorban/rosette
   kerah, bukan wajah).
4. **janggut**: indikatif x 47–65%, y 48–58%; massa jenggot terukur x
   56,4–70,5%, y 49,9–55,7% (v4 diperpanjang ke kanan; sebelumnya v3 berhenti
   di x 66,3 dan memotong jenggot).
5. **matahari**: indikatif x 58–79%, y 70–87%; seluruh lambang biru terukur
   x 56,6–80,7%, y 65,1–84,3%; **v4.3** siluet bintang 12 sinar
   x 56,64–80,74%, y 65,07–84,27% (24 vertex: 12 ujung + 12 lembah,
   garis lurus).
6. **kelor**: indikatif x 24–43%, y 76–90%; bunga + kepala terukur
   x 28,9–44,4%, y 69,9–81,4% (mask biru); **v4.1** poligon kontur ketat
   x 28,64–44,52%, y 69,76–81,45% (+margin 2 px) — menggantikan ellipse.

## 7. Catatan kualitas & trade-off (harus dilaporkan, tidak di-diam-diamkan)

1. **Resolusi detail `mata` (386 × 323), `telinga` (363 × 524), dan
   `matahari` (545 × 700) di bawah target 600–800 px.** Penyebabnya bukan
   teknis melainkan fisik: tidak ada close-up lebih dekat di folder sumber;
   memperbesar (upscaling) dilarang. Opsi tindak lanjut yang direkomendasikan
   bila dipandang perlu: reshoot close-up mata dan telinga (bukan strip
   barcode, bukan QR).
2. **Foto hero punyai bayangan di tepi bawah kertas** (sisi bawah agak suram);
   hasil koreksi tetap natural tanpa pengangkatan agresif.
3. **`sorban.jpg` didownscale**: sumber crop hero 982 × 789 px discale ke
   603 × 486 agar < 100 KB; bila ingin lebih besar, quality bisa dikorbankan
   atau batas berat dilonggarkan (putusan pemilik).
4. Karakteristik warna dipertahankan; biru lambang/matahari tetap natural,
   tidak ada desaturasi atau saturasi tambahan.
5. Tidak ada baris kredit/fotografer/tahun/media/hak cipta di aset hero —
   hal itu kewenangan pemilik di halaman Tentang. Tidak ada QR; strip
   barcode tidak dipakai; nama `muhammadiyah.jpg` tidak dibuat.
6. **(v4.3) `matahari` = siluet bintang 12 sinar** (arahan pemilik): 24
   vertex — 12 ujung di rim + 12 lembah di tepi biru antar sinar — semua
   garis lurus, tanpa DP; menggantikan poligon kontur 38 titik v4.2 (yang
   sebelumnya menggantikan ring bulat v3); percobaan antara poligon
   12-vertex-chord ditolak pemilik ("bintang 12 sudut dengan garis lurus
   pasti memunculkan lembah"). Kaligrafi cakram + pita teks berada di dalam
   poligon tanpa dipotong (disengaja); fragmen 04b di dalam siluet
   dikalahkan (dikeluarkan dari 04b); gap terukur ke 04a 7,8 px, ke 04b
   4,2 px (§8). Teks biru lepas di sekitar sinar tetap tidak dicakup.
7. **(v4) Zona ambigu sengaja tak dicakup**: (a) ekor keruntitan sorban di
   bawah telinga (x 43–48, y 48–57) yang menunjuk ke blok teks; (b) rosette
   kerah x 46,8–53, y 40–55; (c) beberapa huruf pinggiran di kanan 04b dan
   di koridor antara 04a/04b. Semua mengikuti prinsip pemilik: presisi >
   cakupan penuh; tidak ada yang salah target.
8. **(v4.1) Poligon kontur ketat 04a/04b/08** mengikuti anotasi pemilik
   (`Contoh pada baju.jpg`): baju = kontur kaligrafi (tanpa kertas kosong,
   tanpa kelor), kelor = kontur bunga. Konsekuensi: area antar-huruf/antargaris
   di dalam blok tetap masuk poligon (tak mungkin menghindari tiap huruf —
   contoh pemilik juga demikian); teks pinggiran yang < 220 px tinta tidak
   dicakup; teks yang menyentuh kelor dipangkas 8 px dari kontur kelor.

## 8. Bukti presisi: intersection antar-hotspot (v4.3, wajib)

Metode: seluruh 12 entri dirasterisasi pada 1386 × 1984 px sesuai semantik
`shape` (path difill evenodd: setiap loop dirasterisasi lalu di-XOR, jadi
loop bersarang = lubang dan loop disjoint = union). Untuk setiap pasangan
entri berbeda dihitung luas irisan (px dan % dari area terkecil) serta
jarak minimum antar bentuk (distance transform). Toleransi 0,02% hanya
untuk antialiasing — rasterisasi di sini biner (tanpa AA), jadi targetnya
0 px bulat.

**Hasil: 66/66 pasangan beririsan 0 px; jarak minimum antar entri 2,0 px.**
Pasangan dengan jarak < 6 px (paling rawan, semua lulus):

| Pasangan | Irisan (px) | Irisan (% terkecil) | Jarak min (px) | Status | Tindakan |
|---|---|---|---|---|---|
| wajah x janggut | 0 | 0,000% | 4,0 | LULUS | — |
| wajah x mata_a | 0 | 0,000% | 2,8 | LULUS | — |
| wajah x mata_b | 0 | 0,000% | 2,8 | LULUS | — |
| matahari x baju_b | 0 | 0,000% | 4,2 | LULUS | — |
| sorban x telinga | 0 | 0,000% | 2,0 | LULUS | — |
| baju_a x baju_b | 0 | 0,000% | 4,0 | LULUS | — |
| baju_a x kelor | 0 | 0,000% | 3,0 | LULUS | — |

Tabel lengkap 66 pasangan:

| Pasangan | Irisan (px) | Irisan (% terkecil) | Jarak min (px) | Status | Tindakan |
|---|---|---|---|---|---|
| judul x tanggal | 0 | 0,000% | 19,0 | LULUS | — |
| judul x wajah | 0 | 0,000% | 406,0 | LULUS | — |
| judul x matahari | 0 | 0,000% | 1052,0 | LULUS | — |
| judul x sorban | 0 | 0,000% | 174,0 | LULUS | — |
| judul x baju_a | 0 | 0,000% | 880,0 | LULUS | — |
| judul x baju_b | 0 | 0,000% | 880,0 | LULUS | — |
| judul x janggut | 0 | 0,000% | 752,0 | LULUS | — |
| judul x telinga | 0 | 0,000% | 585,0 | LULUS | — |
| judul x mata_a | 0 | 0,000% | 513,0 | LULUS | — |
| judul x mata_b | 0 | 0,000% | 514,0 | LULUS | — |
| judul x kelor | 0 | 0,000% | 1145,0 | LULUS | — |
| tanggal x wajah | 0 | 0,000% | 315,0 | LULUS | — |
| tanggal x matahari | 0 | 0,000% | 961,0 | LULUS | — |
| tanggal x sorban | 0 | 0,000% | 83,0 | LULUS | — |
| tanggal x baju_a | 0 | 0,000% | 789,0 | LULUS | — |
| tanggal x baju_b | 0 | 0,000% | 789,0 | LULUS | — |
| tanggal x janggut | 0 | 0,000% | 661,0 | LULUS | — |
| tanggal x telinga | 0 | 0,000% | 494,0 | LULUS | — |
| tanggal x mata_a | 0 | 0,000% | 422,0 | LULUS | — |
| tanggal x mata_b | 0 | 0,000% | 423,0 | LULUS | — |
| tanggal x kelor | 0 | 0,000% | 1054,0 | LULUS | — |
| wajah x matahari | 0 | 0,000% | 304,0 | LULUS | — |
| wajah x sorban | 0 | 0,000% | 15,7 | LULUS | — |
| wajah x baju_a | 0 | 0,000% | 134,0 | LULUS | — |
| wajah x baju_b | 0 | 0,000% | 132,0 | LULUS | — |
| wajah x janggut | 0 | 0,000% | 4,0 | LULUS | — |
| wajah x telinga | 0 | 0,000% | 158,0 | LULUS | — |
| wajah x mata_a | 0 | 0,000% | 2,8 | LULUS | — |
| wajah x mata_b | 0 | 0,000% | 2,8 | LULUS | — |
| wajah x kelor | 0 | 0,000% | 474,6 | LULUS | — |
| matahari x sorban | 0 | 0,000% | 375,0 | LULUS | — |
| matahari x baju_a | 0 | 0,000% | 7,8 | LULUS | — |
| matahari x baju_b | 0 | 0,000% | 4,2 | LULUS | — |
| matahari x janggut | 0 | 0,000% | 189,1 | LULUS | — |
| matahari x telinga | 0 | 0,000% | 481,7 | LULUS | — |
| matahari x mata_a | 0 | 0,000% | 514,1 | LULUS | — |
| matahari x mata_b | 0 | 0,000% | 511,0 | LULUS | — |
| matahari x kelor | 0 | 0,000% | 173,0 | LULUS | — |
| sorban x baju_a | 0 | 0,000% | 51,0 | LULUS | — |
| sorban x baju_b | 0 | 0,000% | 211,3 | LULUS | — |
| sorban x janggut | 0 | 0,000% | 161,4 | LULUS | — |
| sorban x telinga | 0 | 0,000% | 2,0 | LULUS | — |
| sorban x mata_a | 0 | 0,000% | 121,6 | LULUS | — |
| sorban x mata_b | 0 | 0,000% | 47,5 | LULUS | — |
| sorban x kelor | 0 | 0,000% | 323,9 | LULUS | — |
| baju_a x baju_b | 0 | 0,000% | 4,0 | LULUS | — |
| baju_a x janggut | 0 | 0,000% | 28,8 | LULUS | — |
| baju_a x telinga | 0 | 0,000% | 174,9 | LULUS | — |
| baju_a x mata_a | 0 | 0,000% | 338,3 | LULUS | — |
| baju_a x mata_b | 0 | 0,000% | 365,8 | LULUS | — |
| baju_a x kelor | 0 | 0,000% | 3,0 | LULUS | — |
| baju_b x janggut | 0 | 0,000% | 18,4 | LULUS | — |
| baju_b x telinga | 0 | 0,000% | 290,9 | LULUS | — |
| baju_b x mata_a | 0 | 0,000% | 335,0 | LULUS | — |
| baju_b x mata_b | 0 | 0,000% | 355,6 | LULUS | — |
| baju_b x kelor | 0 | 0,000% | 240,2 | LULUS | — |
| janggut x telinga | 0 | 0,000% | 217,8 | LULUS | — |
| janggut x mata_a | 0 | 0,000% | 207,7 | LULUS | — |
| janggut x mata_b | 0 | 0,000% | 215,9 | LULUS | — |
| janggut x kelor | 0 | 0,000% | 412,1 | LULUS | — |
| telinga x mata_a | 0 | 0,000% | 234,7 | LULUS | — |
| telinga x mata_b | 0 | 0,000% | 336,3 | LULUS | — |
| telinga x kelor | 0 | 0,000% | 441,4 | LULUS | — |
| mata_a x mata_b | 0 | 0,000% | 56,0 | LULUS | — |
| mata_a x kelor | 0 | 0,000% | 678,5 | LULUS | — |
| mata_b x kelor | 0 | 0,000% | 735,0 | LULUS | — |

Tidak ada pasangan yang memerlukan tindakan. Geometri v4.3 (02 = siluet
bintang 12 sinar: 12 ujung sinar + 12 lembah di tepi biru, 24 vertex garis
lurus tanpa vertex lain; 04a/04b/08 kontur ketat mengikuti anotasi pemilik;
fragmen teks 04b yang jatuh di dalam siluet 02 dikeluarkan — keputusan
pemilik "fragmen mengalah") lulus dengan jaring jarak (teks dipangkas 10 px
dari poligon 02, 8 px dari kelor dan ellipse 05) dan kontur eksak diterapkan.
