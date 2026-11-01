# HANDOFF-hero-assets.md — P1 (Aset Hero)

Prompt: siapkan aset hero dari folder `Hero Image/` tanpa reshoot.
Status: **selesai + revisi keempat (P1 v4) + penajaman v4.1/v4.2/v4.3 selesai** —
`npm run lint` / `typecheck` / `build` lolos; tidak ada berkas > 1 MB di
`public/media/hero`; tiga overlay approval siap; bukti intersection
antar-hotspot = 0 px. §6–§8 di bawah adalah catatan revisi v2/v3/v4(.1);
§1–§5 adalah rekam basis v1 (ukuran yang dipatenkan v1 jangan dipakai lagi —
lihat tabel di `HERO-ASSETS.md` §3–§4 untuk nilai terkini).

## 6. Revisi kedua (P0 v2) — aset, kontrak, dan overlay baru

Perubahan tanpa menyentuh `hero-artwork.jpg` (1386 × 1984, tetap persis v1):

| Berkas | Status v2 | Keterangan |
|---|---|---|
| `details/judul.jpg` | BARU | 689 × 171, q88, 28,1 KB. Crop native hero "K.H. Ahmad Dahlan" (x 29,3–79,0%, y 3,4–12,0%), tanpa upscale, kertas dipertahankan; untuk preview/share |
| `details/tanggal.jpg` | BARU | 802 × 71, q88, 14,7 KB. Crop native baris tanggal lahir–wafat (x 25,8–83,7%, y 13,0–16,6%); band pertama dibuang karena terkontaminasi florish judul |
| `details/kelor.jpg` | BARU | 687 × 700, q79, 95,3 KB. Dari `054826559` |
| `details/sorban.jpg` | DIGANTI | 603 × 486, q85, 72,9 KB. Massa kaligrafi sorban mengelilingi kepala (bukan baris tanggal/wordmark) |
| `details/baju.jpg` | DIGANTI | 408 × 700, q85, 91,0 KB. Dari `055102973` (blok ayat, kontrak mengarah ke situ); crop pertama masih memuat sliver biru kelor — diperketat mulai x 38,2% sumber, hasil terverifikasi bersih (tanpa kelor/tanpa matahari) |
| `hotspots-preview.jpg` | DIGANTI | 1386 × 1984, 522,6 KB. 11 kotak (10 target unik + 1 entri mata ekstra), aksi emas / detail merah, chip + leader line di margin kiri/kanan (label tidak menutupi wajah) |
| `hotspots-face-preview.jpg` | BARU | 827 × 774, 145,9 KB. Zoom wajah (x 36–74, y 27–62) dengan ring 01/03/05/06/07a/07b untuk memeriksa batas wajah/sorban/telinga/mata/janggut |
| `src/data/hero-artwork.ts` | DITULIS ULANG | Kontrak v2: `HeroDetailId` + `"kelor"`, `HeroActionId = "judul" | "tanggal"`, `HeroHotspotId`, `shape: "ellipse" | "rect" | "polygon"` + `points?: string`, `details` (8) + `actions` (2), 11 entri hotspot (termasuk dua entri `mata`) |
| `HERO-ASSETS.md` | DIPERBARUI | §1 peta sumber, §3 ukuran terkini, §4 tabel 11 entri + polygon + hit area + catatan 11 kotak vs 10 target, §5 deviasi indikatif |

Detail lama dipertahankan apa adanya: `wajah`, `matahari`, `janggut`,
`telinga`, `mata`.

**Ukuran hotspot v2 (persen hero; 1% lebar = 13,86 px, 1% tinggi = 19,84 px)**
sudah diukur ulang (bukan menyalin nilai indikatif): A1 judul rect
(29.5, 3.8, 49.6, 8.2); A2 tanggal rect (25.8, 13.0, 57.9, 3.6); 01 wajah
(43.5, 31.5, 24.7, 23.5); 02 matahari (57.2, 59.0, 18.3, 24.8); 03 sorban
(25.0, 19.0, 43.5, 24.5); 04 baju polygon
`24.3,62.5 27.8,57.7 46.8,57.4 56.6,58.8 56.4,70.6 53.2,76.3 49.6,81.9
43.7,80.6 41.7,70.5 41.6,64.7 27.4,64.7 27.3,62.2` (pusat kelor di luar
polygon — diverifikasi ray-casting; ink matahari juga di luar); 05 janggut
(54.5, 44.5, 12.5, 13.5); 06 telinga (40.2, 38.7, 7.6, 7.0); 07 mata dua
ellipse: kiri-gambar (54.5, 34.8, 6.2, 5.4) + kanan-gambar (61.2, 35.3,
7.0, 4.9); 08 kelor (27.5, 64.8, 13.8, 15.7). Baris teks judul/tanggal
diukur objektif lewat pita tinta (ambang piksel gelap). Hit area terkecil:
mata kanan ≈ 97 px, tanggal ≈ 71 px — semua ≥ 44 px.

**Deviasi dari nilai indikatif prompt**: judul x sampai 79,1 (ink 78,2);
tanggal y 13,0–16,6 (indikatif 13–18; band 16,1–18 kosong); wajah x 43,5–68,2
(indikatif 44–72); janggut x 54,5–67,0, y 44,5–58,0 (indikatif x 47–65,
y 48–58); matahari y 59,0–83,8 (indikatif 70–87; lingkarannya naik ke dada);
kelor y 64,8–80,5 (indikatif 76–90; lambang lebih tinggi). Daftar lengkap +
alasan di `HERO-ASSETS.md` §5.

**Pertanyaan terbuka untuk pemilik (spesifik v2):**
1. Approval dua overlay (`hotspots-preview.jpg`, `hotspots-face-preview.jpg`)
   dan crop `judul`/`tanggal`/`sorban`/`kelor`/`baju`.
2. Kontrak menulis "dua kotak" untuk `mata`; saya bentuk ellipse (konsisten
   dengan ring detail lain). Sedia ubah ke rect bila diminta — cukup geser
   `shape` dua entri `mata`.
3. Overlay punya 11 kotak vs target "10 hotspot": karena kontrak minta dua
   entri id `mata`; kedua entri digambar.
4. `sorban.jpg` downscale dari 982 × 789 ke 603 × 486 demi batas < 100 KB;
   bila lebih besar diinginkan, quality/batas berat dentialkan.

## 7. Revisi ketiga (v3) — masukan langsung pemilik, 1 Nov 2026

**Kutipan masukan pemilik** (ditandai sebagai masukan langsung agar dipahami
semua AI orkestra; disalin ke `HERO-ASSETS.md` §5):

> "Bisakah Anda memperketat logo Muhammadiyah agar menjadi bulat saja karena
> baju itu ada kanan dan kiri; kemudian letak telinga, kedua mata, janggut,
> dan daun kelor dibuat lebih presisi … intinya tidak perlu mencakup semua
> tapi jangan sampai menyentuh bagian lain atau terletak pada yang bukan
> bagiannya … hotspot tidak perlu mencakup semuanya jika susah tapi nanti
> bagian yang menjadi cakupan klik harus diberi tanda agar orang tahu."

Pemahaman yang mengikat (catat ke brief AI lain):
1. **Hotspot boleh tidak mencakup seluruh objek**, tetapi tidak boleh
   menyentuh bagian lain / terletak pada yang bukan bagiannya.
2. **Cakupan klik harus diberi tanda** — overlay kini menandai area klik
   dengan ring + isian warna transparan + legenda
   ("Daerah berwarna = cakupan klik; merah = detail; emas = aksi").

Perubahan nilai `src/data/hero-artwork.ts` (v2 → v3; hero-artwork tetap
tidak disentuh):

| Hotspot | v2 | v3 | Metode |
|---|---|---|---|
| 02 `matahari` | ellipse (57.2, 59.0, 18.3, 24.8) — tepiannya masuk teks baju kiri | **bulat** (62.85, 70.11, 12.70, 8.87) — cakram pusat + lingkaran teks logo, r ≈ 88 px, pusat (69.2, 74.55); sinar di luar ring bukan cakupan klik | mask biru + erosi/fill-holes (objektif) |
| 05 `janggut` | (54.5, 44.5, 12.5, 13.5) — ikut menyentuh misai | (56.4, 49.9, 9.9, 5.8) — massa jenggot dagu saja | grid 0,5% |
| 06 `telinga` | (40.2, 38.7, 7.6, 7.0) — menyentuh sorban di atas | (38.4, 41.5, 5.2, 6.1) — palung telinga saja | grid 0,5% |
| 07a `mata` | (54.5, 34.8, 6.2, 5.4) — menutup alis | (59.1, 37.9, 3.6, 1.6) — mata kiri-gambar persis | grid 0,25% |
| 07b `mata` | (61.2, 35.3, 7.0, 4.9) | (66.8, 37.95, 3.2, 1.35) — mata kanan-gambar persis | grid 0,25% |
| 08 `kelor` | (27.5, 64.8, 13.8, 15.7) — banyak area kosong di atas | (29.2, 70.0, 15.0, 11.1) — blob biru lambang kelor | mask biru (objektif) |

Tanpa perubahan: A1 `judul`, A2 `tanggal`, 01 `wajah`, 03 `sorban`,
04 `baju` (polygon). Overlay: `hotspots-preview.jpg` (492,4 KB) dan
`hotspots-face-preview.jpg` (127,1 KB) dibuat ulang dengan isian cakupan
klik + legenda.

**Konsekuensi ukuran ketuk**: kedua ring `mata` kini sisi terkecilnya
≈ 27–32 px (di bawah syarat 44 px lama) karena presisi didahulukan per
masukan pemilik. Untuk AI komponen (P2/P3): implementasikan padding sentuh
tidak terlihat ≥ 44 px di sekitar ring `mata` (mis. perluas bounding box
hit-test min. 44 px tanpa memperbesar ring visual).

## 8. Revisi keempat (P1 v4) — presisi sorban + dua area baju, 1 Nov 2026

Prompt P1 v4 menuntut: 03 sorban polygon batas sorban/hairline (tanpa
menyentuh wajah), 04a baju segitiga/trapesium dengan lubang bulat kelor
(`path` + `fillRule: "evenodd"`), 04b entri `baju` kedua di atas logo
matahari, manifest 12 entri, tiga overlay, dan **bukti intersection
antar-ID = 0 px** (bukan "terlihat kira-kira").

**Perubahan (`src/data/hero-artwork.ts` v3 → v4; `hero-artwork.jpg` tetap):**

| Entri | v3 | v4 | Metode |
|---|---|---|---|
| 01 `wajah` | ellipse (43.5, 31.5, 24.7, 23.5) — MENUMPUK 05/06/07a/07b | **path evenodd**: poligon profil wajah (54.9–71.0, 32.5–49.7; tepi atas = garis rambut + gap) + LUBANG mata 07a/07b (+ ~3 px) | profil mask tinta per kolom (g < 138) |
| 03 `sorban` | ellipse (25.0, 19.0, 43.5, 24.5) — menumpuk 01/06 | **path evenodd**: poligon batas sorban/hairline 78 titik (29.5–71.5, 20.8–53.8) + LUBANG telinga (06 + ~2 px); berhenti di garis rambut, gap ke 01 = 15,7 px | profil mask tinta per kolom/baris |
| 04a `baju` | polygon 12 titik (kotak besar) | **path evenodd**: trapesium miring blok Ayat Kursi (20.6–57.8, 55.7–82.3) + LUBANG BULAT kelor (ellipse c(622.8, 1497.9) px, rx 103, ry 125 = 08 + ~2 px) | mask baju + bbox kelor |
| 04b `baju` | — (tidak ada) | BARU: polygon kecil `60.8,58.5 69.8,58.5 71.2,63.5 70.2,65.9 61.5,65.9 59.8,62.0` — gugus kaligrafi di atas logo matahari; gap ke 04a 39,8 px, ke ring 02 83 px, ke 05 55 px | grid + mask |
| 05 `janggut` | (56.4, 49.9, 9.9, 5.8) — memotong jenggot kanan | (56.4, 49.9, **14.1**, 5.8) — massa jenggot utuh sampai x 70,5 | profil tinta |
| 08 `kelor` | (29.2, 70.0, 15.0, 11.1) — bbox masih memuat ekor kata "wa" | (30.2, 69.3, 14.6, 12.4) — bunga + kepala; sayap kiri tak lagi terpotong | mask biru |

Tipe `HeroHotspot` v4: `shape: "ellipse" | "rect" | "polygon" | "path"`,
`points?`, **`path?: string`** (px, viewBox 0 0 1386 1984),
**`fillRule?: "nonzero" | "evenodd"`**. Total 12 entri: judul, tanggal,
wajah, matahari, sorban, baju ×2, janggut, telinga, mata ×2, kelor.
`HeroDetailId`/`HeroActionId` tetap.

**Hasil uji (skrip rasterisasi 1386 × 1984):** 66/66 pasangan entri
beririsan **0 px** (toleransi AA 0,02% tidak terpakai — rasterisasi biner);
jarak minimum antar entri **2,2 px** (sorban↔telinga, baju_a↔kelor);
pasangan rawan lain: wajah↔mata 3,2 px, wajah↔janggut 4,0 px. Tabel
lengkap di `HERO-ASSETS.md` §8.

**Aset:** `details/sorban.jpg` di-crop ulang (590 × 662, 88,5 KB) dari
polygon 03 v4; piksel di luar polygon dimask warna kertas (feather 1,2 px)
— **bebas mata/alis/kulit wajah** (telinga ikut terlihat; bukan wajah).
`details/baju.jpg` dipertahankan (sudah mewakili blok ayat, sesuai prompt).
`hero-artwork.jpg` tidak diubah.

**Overlay (3, semua dengan isian cakupan klik + garis biru lubang + legenda):**
`hotspots-preview.jpg` (1386 × 1984, 12 hotspot, chip 04a/04b & 07a/07b
berbeda), `hotspots-face-preview.jpg` (1354 × 1468; 01/03/05/06/07a/07b +
gap), `hotspots-baju-preview.jpg` (BARU, 1980 × 1668; 04a + lubang kelor,
04b, 02, 05, 08 + gap).

**Catatan jujur (presisi > jumlah):**
1. Ring 02 (nilai v3 disetujui pemilik) memotong pita kaligrafi miring logo
   yang ternyata tidak konsentris; pita luar diperlakukan seperti sinar
   (tidak dicakup). Bila pemilik ingin pita ikut dicakup → minta revisi v5.
2. Ekor keruntitan sorban di bawah telinga + rosette kerah (x 43–53,
   y 40–57) sengaja tidak dicakup (zona ambigu antara sorban/kerah/baju).
3. Ekor kata "wa" menyentuh kepala kelor di karya; segmen kecilnya ikut
   dalam ellipse 08 (tak terpisahkan tanpa memotong lambang).
4. 04b memuat gugus teks utama di atas logo; beberapa huruf pinggiran di
   kiri/kanannya tidak dicakup demi menjaga gap (prinsip pemilik).

**Pertanyaan terbuka (v4):** approval tiga overlay + `sorban.jpg` baru;
putusan pemilik atas butuh tidaknya pita kaligrafi logo masuk ring 02 (v5).

### 8a. Penajaman v4.1 — kontur ketat 04a/04b/08 (arahan langsung pemilik)

Pemilik memberi contoh anotasi pada `Hero Image/Contoh pada baju.jpg`:
**garis merah** = poligon ketat mengikuti kontur kaligrafi baju, **garis
hijau** = poligon ketat kontur kelor; tuntutan: **baju tidak boleh mencakup
kelor ataupun kertas putih kosong**.

Implementasi (objektif, bukan taksiran):
- teks = tinta gelap **non-biru** (memisahkan kaligrafi dari sinar/logo biru);
  kelor = komponen mask biru di sekitar bunga.
- Kontur eksak tingkat piksel (crack boundary, interior-left, loop ditutup
  benar di sadel; tervalidasi unit test: persegi/L/diagonal/donat/sadel).
- Douglas-Peucker: 04a/04b tol 4 px, kelor tol 3 px → 04a 2 loop/159 titik,
  04b 5 loop/116 titik, 08 1 loop/44 titik.
- Jaring jarak: teks dipangkas 8 px dari blob kelor, ring 02, dan ellipse 05;
  poligon +2 px → gap ≥ 2,0 px terukur.

Hasil: **04a** (23.59, 56.35, 34.78, 25.25) 2 loop — blok Ayat Kursi tanpa
kertas kosong tanpa kelor; **04b** (58.59, 56.35, 25.33, 22.43) 5 loop —
gugus kaligrafi di sekeliling logo (atas/kanan/bawah-kanan bintang); **08**
(28.64, 69.76, 15.87, 11.69) kontur bunga+kepala. Ulang uji: **66/66
pasangan 0 px**, gap terkecil 2,0 px (sorban↔telinga), baju_a↔kelor 3,0,
baju_a↔baju_b 4,0. Tabel lengkap: `HERO-ASSETS.md` §8.

Tiga overlay dibuat ulang; `hotspots-baju-preview.jpg` kini crop (14–90,
50–88) memperlihatkan kontur ketat + gap. Manifest TS: ketiga entri =
`shape: "path"` + `fillRule: "evenodd"` (multi subpath; disjoint = union).

### 8b. Penajaman v4.2 — 02 matahari jadi poligon bintang (arahan pemilik)

Pemilik: `Hero Image/Contoh V2 Sun.jpg` — area hijau = SELURUH lambang
matahari, **bukan lagi bulat**, dibuat dengan sedikit titik karena "tinggal
ditarik garis lurus saja".

Implementasi: bintang = komponen biru terbesar (cakram + pita + sinar; teks
biru lepas = komponen terpisah, tidak ikut); blob dipangkas 14 px dari semua
poligon hotspot lain; r(θ) disampel tiap 2°; Douglas-Peucker 6 px → **1 loop,
38 titik, garis lurus antar ujung sinar**. Ulang uji: 66/66 pasangan 0 px;
gap terkecil 2,0 px (sorban↔telinga); matahari↔baju_b 4,5 px;
matahari↔baju_a 9,9 px. Tabel: `HERO-ASSETS.md` §8.

### 8c. Penajaman v4.3 — poligon 02 = siluet bintang 12 sinar (arahan pemilik, mengikat)

**Arahan pemilik (dikonfirmasi eksplisit):** lambang matahari pada lukisan =
**bintang 12 sudut** (logo Muhammadiyah). Tidak ada vertex di dalam lambang:
kaligrafi "Muhammad" di cakram, pita teks keliling, dan seluruh isi bintang
TIDAK diberi titik dan TIDAK dipotong boundary (berada di dalam poligon —
disengaja). Posisi diukur objektif dari mask biru, menghormati
ketidaksempurnaan tangan pelukis (bukan bintang geometris kaku). Poligon
kontur 133 titik (v4.2) DIGANTI.

**Koreksi kedua (pembatalan poligon 12-vertex-chord):** percobaan pertama
v4.3 membuat poligon TEPAT 12 vertex di ujung sinar dengan chord lurus —
SALAH. Pemilik menegaskan: **"bintang 12 sudut BERBEDA dengan poligon 12
vertex. Bintang 12 sudut dengan garis lurus PASTI memunculkan LEMBAH —
sehingga bintang 12 sudut bisa memunculkan LEBIH BANYAK titik poligon.
Perhatikan warna biru pada logo matahari."** Chord antar ujung memotong
lembah sehingga tidak membentuk bintang. Kontur 133 titik (DP 3, ikut
tekstur) juga salah (berkeliuk, merusak bentuk). Bentuk benar = SILUET
bintang: puncak berselang-seling lembah.

**Metode final:**
- Blob bintang = komponen biru terbesar di jendela x 54–88%, y 58–90%,
  **closing 6** (bukan closing 3: dengan closing 3, dua-tiga sinar
  kanan-bawah yang dicat dengan biru keabu-abuan ternyata komponen TERPISAH
  sehingga profil r(θ) kolaps di sektor 35–70° dan hanya 11 sinar
  terdeteksi; dengan closing 6 seluruh 12 sinar menyatu — teks biru lepas
  tetap tidak ikut). Blob TIDAK dipangkas — konflik diselesaikan di sisi
  04a/04b.
- Profil radial r(θ) dari pusat cakram (960.6, 1487.2) px, 360 sampel per 1°.
- **12 UJUNG**: `scipy.signal.find_peaks` **prominence 20, distance 8 →
  TEPAT 12 puncak** (parameter pertama yang dicoba; jarak antar puncak
  26–35°, tanpa dua puncak dalam 8°; 12/12 tervalidasi maksimum lokal nyata
  pada jendela ±5°); tiap puncak di-refine ±3° ke piksel blob terjauh —
  semua di rim (r minimum 161,4 px).
- **12 LEMBAH**: untuk tiap sektor antara dua ujung berurutan, sudut lembah
  = argmin r(θ) DI TENGAH sektor (pencarian dibatasi 20–80% span agar tidak
  menciut ke ujung); radius lembah = r(θ lembah) = tepi luar biru di lembah
  (r 105,0–137,7 px — mengikuti warna biru, seperti garis hijau pemilik).
- Poligon final = **24 vertex** (12 ujung + 12 lembah) diurutkan per sudut,
  semua garis lurus, ditutup — TANPA DP, tanpa vertex tambahan (diagnostik
  overshoot badan sinar terhadap chord ujung→lembah maksimum 11,2 px —
  tidak mencolok secara visual, jadi tidak ada sisipan vertex; opsi maks 1
  vertex per sisi tidak terpakai).
- 04a/04b dibangun ulang dengan pipeline v4.1 (closing 7, split x=58.5%
  ±4 px, drop_small 220, margin 2, DP 4) dengan exclusions baru:
  `dil(mask_02_baru, 10) | dil(kelor_blob, 8) | dil(ellipse 05, 8)`.
  **Kelor tidak diubah.**

**Keputusan "fragmen mengalah" (pemilik):** fragmen kecil teks 04b yang
jatuh di dalam siluet bintang DIKELUARKAN dari 04b; bentuk bintang TIDAK
ditekuk untuk menghindari mereka. 04b kini 4 subpath (99 titik) — fragmen
kiri kecil (x ≈ 58,6–59,8, y ≈ 71,2–73,4) dan bagian gugus kanan yang
menembus ke dalam siluet diambil dari 04b; bagian gugus kanan di luar
lembah tetap di 04b (bbox 04b kembali ke h 22,43).

**Hasil uji (skema rasterisasi yang sama):** 66/66 pasangan beririsan
**0 px**; gap terkecil **2,0 px** (sorban↔telinga, warisan v4); pasangan
terkait 02: **matahari↔baju_b 4,2 px, matahari↔baju_a 7,8 px**. Verifikasi
visual (`hero-inspect/v43b-baju.jpg`, `v43b-sun.jpg`): terlihat sebagai
BINTANG 12 SINAR dengan lembah jelas, garis lurus, ujung sinar tercakup,
tidak menempel poligon merah, tidak menelusuri kaligrafi. Tabel:
`HERO-ASSETS.md` §8. Tiga overlay dibuat ulang (chip 02 menunjuk ujung
sinar kanan 80,74, 73,39). Manifest TS: 02 = path evenodd 24 titik
(bbox 56.64, 65.07, 24.10, 19.20); 04a/04b path diperbarui.

## 1. Berkas yang diubah/dibuat (basis v1)

| Berkas | Status | Keterangan |
|---|---|---|
| `public/media/hero/hero-artwork.jpg` | BARU | 1386 × 1984, q88, 465,5 KB. Hero utama dari satu-satunya foto yang memuat seluruh karya |
| `public/media/hero/hotspots-preview.jpg` | BARU | 1386 × 1984, 472,8 KB. Overlay ring/box bernomor 01–07 untuk approval |
| `public/media/hero/details/wajah.jpg` | BARU | 597 × 700, 59,7 KB |
| `public/media/hero/details/matahari.jpg` | BARU | 545 × 700, 91,8 KB |
| `public/media/hero/details/sorban.jpg` | BARU | 786 × 642, 93,7 KB |
| `public/media/hero/details/baju.jpg` | BARU | 698 × 700, 89,2 KB |
| `public/media/hero/details/janggut.jpg` | BARU | 612 × 605, 68,6 KB |
| `public/media/hero/details/telinga.jpg` | BARU | 363 × 524, 46,0 KB |
| `public/media/hero/details/mata.jpg` | BARU | 386 × 323, 20,0 KB |
| `src/data/hero-artwork.ts` | BARU | Tipe & data sesuai kontrak P0 + komentar cara pengukuran |
| `HERO-ASSETS.md` | BARU | Peta sumber, edit, ukuran, catatan kualitas |

Tidak ada file lain yang disentuh. Tidak ada dependency baru (pemrosesan gambar
memakai Python/Pillow yang sudah ada di lingkungan; proyek tidak menambah paket).

## 2. Keputusan penting (basis v1)

1. **Rotasi +CCW 90°** pada `PXL_20261030_053757743.MP.jpg.jpeg` agar wajah tegak
   (nama "K.H. Ahmad Dahlan" di atas, lambang kelor kiri-bawah, matahari
   kanan-bawah — terverifikasi konsisten dengan close-up `054601618`).
2. **Koreksi perspektif** ke rasio kertas nyata (≈ 2058 × 2944) berbasis empat
   sudut kertas hasil deteksi otomatis + verifikasi visual; lanjutan:
   crop tepi 0,4%, color balance konservatif (gain ±8% maks; kertas memang
   nyaris netral), gamma 1,20 + kontras 1,04 (kertas p95 ~205 → ~211;
   goresan tetap kontras, tidak ada highlight terbuang).
3. **Hero memakai foto landscape utuh** — tidak bugil zona. Semua tujuh zona
   terlihat dan terbaik di hero; tidak perlu switch ke `054601618` sebagai hero.
4. **Detail**: wajah/mata/telinga/janggut/baju dari close-up `054601618`,
   matahari dari `054742732` (bintang paling utuh), sorban crop dari pipeline
   hero (framing persis sama dengan zona 03) sesuai instruksi. Semua detail
   hanya crop + pipeline warna identik dengan hero, hanya downscale (tidak ada
   upscaling), < 100 KB.
5. **Nomor 01–07 mengikuti urutan `HeroDetailId` di kontrak P0**:
   wajah, matahari, sorban, baju, janggut, telinga, mata.
6. **`054826559` (kelor) & `055102973` (ayat) tidak dipakai** karena kontrak P0
   tidak punya id detail `kelor`/`ayat`. Aset close-nya tersimpan di folder
   sumber bila nanti produk menyetuju untuk menambah zona.
7. **Strip barcode tidak dipakai; tidak ada QR**; kaligrafi tidak diubah; tidak
   ada kredit/tahun/media di aset hero.

## 3. Cara pengukuran hotspot (juga tertulis di `src/data/hero-artwork.ts`)

- Grid 5% vertikal/horizontal di-overlay di atas gambar final; x/y/w/h dibaca
  dari grid, lalu diverifikasi dengan menggambar ring/box pada
  `hotspots-preview.jpg` dan membandingkannya pada zoom.
- Koordinat dalam persen gambar final (1386 × 1984). Metrik: ring 07 mengapit
  mata + alis, ring 06 mengapit telinga, dst. (tabel lengkap di HERO-ASSETS.md §4).

## 4. Hasil uji

- `npm run lint`: **lolos** (hanya warning pendahuluan di `src/Contoh Timeline.tsx`, sebelum perubahan ini sudah ada; bukan berkas saya).
- `npm run typecheck`: **lolos**.
- `npm run build`: **lolos** (11 halaman statis, tanpa error).
- Smoke test server produksi (`npm run start`): `/` tanpa console error, dan
  semua aset baru terlayani HTTP 200 — `/media/hero/hero-artwork.jpg`,
  `/media/hero/hotspots-preview.jpg`, `/media/hero/details/mata.jpg`,
  `/media/hero/details/sorban.jpg` (contoh yang diuji). Halaman belum
  merender hero-artwork (itu bagian P2/P3); tidak ada dampak layout.
- Tidak ada file > 1 MB di `public/media/hero`; semua detail < 100 KB.

## 5. Pertanyaan terbuka (minta konfirmasi pemilik)

1. **Approval overlay**: buka `public/media/hero/hotspots-preview.jpg` — posisi
   01–07 sesuai yang diharapkan? Perubahan penempatan cukup diedit satu tempat
   di `src/data/hero-artwork.ts` (komentar §cara pengukuran).
2. **Resolusi detail `mata` (386 × 323), `telinga` (363 × 524), `matahari`
   (545 × 700) di bawah target 600–800 px** — folder sumber tidak punya
   close-up lebih dekat, dan upscaling dilarang. Reshoot disarankan bila ingin
   detail lebih tajam (bukan barcode/QR).
3. **Zona `kelor`/`ayat`**: apakah kelak ditambahkan ke `HeroDetailId`? Sumber
   sudah teridentifikasi (`054826559`, `055102973`).
4. **Sorban detail dari hero** — bila pemilik ingin lebih tajam, alternatifnya
   crop close-up `054601618` (framing agak berbeda ditambah satu eksekusi baru);
   belum dilakukan sebelum ada keputusan.
5. **Toleransi warna**: foto punyai bayangan di tepi bawah kertas; bila pemilik
   ingin lebih terang, gamma tinggal digeser, tapi warna natural diprioritaskan.
6. Hero-artwork belum dirender oleh komponen (bagian P2/P3); kalau mereka
   membutuhkan metadata aset tambahan (misal alt text), konfirmasi karena
   semua teks baru harus ID/EN/AR.
