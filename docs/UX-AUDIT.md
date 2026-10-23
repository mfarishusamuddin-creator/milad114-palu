# Audit UX dan Layout — Milad 114 Palu

Tanggal audit: 23 Oktober 2026  
Ruang lingkup: layout, perilaku responsif, aksesibilitas, navigasi anchor,
tipografi, footer, dan peta. Naskah editorial, data, tanggal, aset, dan ukuran
logo tidak diubah.

## Temuan akar masalah

1. CardNav mode ringkas memakai root dengan lebar otomatis, sedangkan panel
   diposisikan absolut. Pada ukuran tertentu hal ini membuat panel tampak salah
   posisi atau terpotong.
2. `CollapsibleSection` sebelumnya memeriksa target hash terhadap elemen isi
   panel, sementara elemen `<section>` target berada di luarnya. Karena itu
   section tidak terbuka saat hash menuju section tersebut.
3. Klik hash yang sama tidak selalu menghasilkan event `hashchange`; CardNav
   membutuhkan mekanisme navigasi anchor eksplisit.
4. Shell halaman hanya mengandalkan tinggi viewport statis dan `flex-1`, yang
   kurang tahan terhadap variasi viewport dinamis saat seluruh section tertutup.
5. Map memakai clipping dan breakout selebar viewport di dalam section, yang
   berpotensi memotong label/marker atau menghasilkan overflow horizontal.
6. Sejumlah label metadata berada di bawah ukuran nyaman pada zoom 100%.

## Perbaikan yang diterapkan

### Header dan CardNav

- Root CardNav ringkas memiliki lebar trigger stabil (`--cn-bar`).
- Panel tetap menempel pada sisi inline-end header dan membuka ke bawah.
- Lebar panel sempit dibatasi dengan `min(..., calc(100vw - 2rem))`.
- Header menggunakan `min-height` dan padding, bukan tinggi kaku.
- Konten CardNav tertutup bersifat `inert`, sehingga tidak dapat difokuskan
  menggunakan keyboard.

### Anchor dan section collapsible

- Ref dipindahkan ke elemen `<section>`, sehingga target seperti `#tentang`,
  `#agenda`, `#peta`, `#sejarah`, dan `#layanan` dapat dikenali dengan benar.
- CardNav menerbitkan event anchor eksplisit setelah hash diperbarui.
- Section target dibuka, kemudian halaman di-scroll setelah transisi selesai.
- Target dalam section, termasuk `#kabar`, membuka parent section terlebih
  dahulu. Target `#countdown` tetap langsung di-scroll tanpa membuka section.
- Reduced motion memakai scroll non-animasi.

### Footer dan tinggi halaman

- `html` dan `body` memiliki tinggi viewport yang aman.
- `.site-shell` memakai fallback `100vh` dan `100dvh`.
- `main` memakai flex basis otomatis agar footer berada setelah konten.
- Overflow horizontal dicegah pada level halaman, tanpa menambahkan spacer atau
  latar buatan setelah footer.

### Peta

- Clipping pada wrapper map dihilangkan.
- Breakout `100vw` di dalam section diganti menjadi lebar container penuh.
- Marker tetap memiliki area klik transparan, label hanya muncul ketika marker
  aktif, dan animasi pulse yang ada tetap menghormati reduced motion.

### Tipografi dan tap target

- Label kecil yang berada di bawah batas nyaman dinaikkan menjadi sekitar
  `0.72–0.75rem` sesuai konteks.
- Link CTA sekunder Hero diberi tinggi tap target minimum 44px.
- Hierarki heading dan body/lead yang telah memenuhi batas nyaman dipertahankan.

## File yang diubah

- `src/app/globals.css`
- `src/components/history/HistoryTables.tsx`
- `src/components/history/HistoryTimeline.tsx`
- `src/components/home/AboutMilad.tsx`
- `src/components/home/Agenda.tsx`
- `src/components/home/Hero.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/map/MapSection.tsx`
- `src/components/map/WorldMap.tsx`
- `src/components/pages/AboutPage.tsx`
- `src/components/pages/SiteShell.tsx`
- `src/components/services/HijriCalendar.tsx`
- `src/components/services/ServicesSection.tsx`
- `src/components/shared/CardNav.tsx`
- `src/components/shared/CollapsibleSection.tsx`
- `src/components/shared/KabarCard.tsx`
- `src/components/shared/card-nav.css`

## Verifikasi

- `typecheck`: lulus.
- `lint`: lulus tanpa error. Ada 12 peringatan lama pada
  `src/Contoh Timeline.tsx` terkait elemen `<img>`.
- `git diff --check`: lulus.
- `build`: belum dapat dikonfirmasi selesai. Proses berhenti pada tahap
  optimasi produksi dan menggantung pada lingkungan audit; proses milik sesi
  audit dihentikan agar tidak meninggalkan lock.

## Verifikasi manual yang masih diperlukan

Lakukan pemeriksaan visual pada viewport 320, 360, 390, 414, 768, 1024, 1280,
1366, 1440, 1536, dan 1920 px; zoom 100%, 125%, dan 150%; tema terang/gelap;
serta bahasa ID/EN/AR (termasuk RTL). Pastikan setiap link CardNav membuka dan
men-scroll ke target, footer tidak diikuti ruang kosong, dan peta tidak
terpotong.

## Lokasi edit logo manual

- `src/components/layout/Navbar.tsx`: logo header.
- `src/components/layout/Footer.tsx`: logo footer.
- `src/components/theme/BrandLogo.tsx`: sumber aset BrandLogo.

Ukuran atau aset logo tidak diubah dalam audit ini.
