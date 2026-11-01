# Test Log

Tanggal uji: 20 Oktober 2026
Lingkungan: Windows, Node.js 22.23.2, Next.js 16.4.2, Edge headless.

## Build

- `npm run lint` — lolos tanpa error.
- `npm run typecheck` — lolos tanpa error.
- `npm run build` — lolos. Rute statis: `/`, `/en`, `/ar`, `/tentang`, `/sitemap.xml`, `/robots.txt`, `/icon.png`.
- `npm audit --omit=dev` — 0 vulnerabilities.

## Rute

| Rute | Status | Catatan |
|---|---|---|
| `/` | 200 | Indonesia; satu index |
| `/en` | 200 | English; satu index |
| `/ar` | 200 | Arab; RTL |
| `/sitemap.xml` | 200 | Tiga URL bahasa |
| `/robots.txt` | 200 | Allow all + sitemap |
| `/sejarah` | dihapus | Konten menjadi `/#sejarah` |
| `/layanan` | dihapus | Konten menjadi `/#layanan` |
| `/tentang` | 200 | Halaman Tentang Indonesia; target tombol “i” peta |

## Bahasa

| Rute | `html lang` | `html dir` | H1 |
|---|---|---|---|
| `/` | id | ltr | Bersama Satukan Bangsa |
| `/en` | en | ltr | Together Unite the Nation |
| `/ar` | ar | rtl | معًا نوحّد الأمة |

## Viewport

| Viewport | Lebar | scrollWidth | Overflow halaman |
|---|---|---|---|
| Mobile | 390 px | 390 px | Tidak ada |
| Desktop | 1440 px | 1440 px | Tidak ada |

## Peta

- 29 path negara PCIM.
- 29 dot interaktif (negara) + 1 dot/markas Indonesia di Yogyakarta, tanpa nama kota.
- Label nama negara muncul saat hover, fokus (keyboard), atau tap tabel perangkat; tap area kosong menutup label.
- Indonesia (ISO 360) berwarna beda dengan label dua baris yang selalu tampil.
- Mode gelap: highlight kelor dan marker emas terbaca.

## Fungsional

- Tema: tombol mengubah `data-theme` menjadi `dark`; pilihan disimpan di `localStorage`.
- Logo: varian putih tampil di mode gelap.
- Animated content: elemen `<Reveal>` (GSAP/ScrollTrigger) dianimasikan sekali dari bawah saat scroll; konten di-`visibility: hidden` awal dan ditampilkan oleh ScrollTrigger; fallback `scripting: none`/`noscript`; reduced motion langsung tampil.
- Timeline sejarah: tab dua jalur bergantian; progres garis bergerak; tabel terbaca di 390 px.
- Kalender: Masehi `2026-11-19` → `10 Jumadilakhir 1448 H · Wage`.
- Kalender: Hijriah `10 Jumadilakhir 1448` → `19 November 2026 · Wage`.
- Kabar: tab `Milad & Tanwir` menampilkan 6 item kompak.
- Menu mobile: terbuka, navigasi anchor, lalu tertutup.
- Console error: tidak ada.

## Motion logo intro

- Default `/`: intro tampil setiap refresh.
- Refresh setelah skip → intro tampil lagi.
- Navigasi internal → intro tidak muncul lagi.
- Reduced motion → intro dilewati.
- Desktop terang: `horizontal-light.mp4`; waktu uji 3,0 detik; video berjalan.
- Mobile terang: `vertical-light.mp4`; video berjalan.
- Desktop gelap: `horizontal-dark.mp4`; video berjalan.
- Reduced motion: intro dilewati.
- Tombol Lewati: overlay hilang, body scroll kembali normal.
- Ukuran video: 131–157 KB; poster: 112–204 KB.
- Video, situs, logo horizontal, dan OG sudah diselaraskan ke 19–21 November 2026 / 10–12 Jumadilakhir 1448 H. Logo statis di folder sumber masih 13–15 dan tidak dipakai untuk hero/OG.

## Catatan

- Lighthouse belum dijalankan pada mesin ini; target performa dan aksesibilitas masih perlu diukur di production.
- QR belum diuji karena payload dan pencetakan dikelola pemilik proyek.
- Terjemahan Arab adalah draf AI; verifikasi native ada di `TRANSLATION-REVIEW.md`.
- Uji manual interaksi (tab timeline, accordion mobile, hover tabel/cell, RTL timeline) belum sepenuhnya dijalankan di browser nyata; itu terjadi setelah verifikasi baris perintah.
- Uji perangkat fisik (Android mid-range, iOS Safari) masih perlu dilakukan sebelum submit.

## Sesi restrukturisasi 21 Oktober 2026

- Restrukturisasi "Satu Pohon, Tiga Arah" → "Dua Jalur, Satu Gerakan" dieksekusi; komponen/pratinjau pohon dan bab (GatewayCards, GrowingTree, SpaceTree, HistoryExperience, tree.ts, milestones*.ts, Scrollama, scripts/generate-tree) dihapus.
- `npm run typecheck` — lolos.
- `npm run lint` — 0 error; 12 warning bawaan `src/Contoh Timeline.tsx` (elemen `<img>` dari demo Aceternity, file referensi yang tidak dikompilasi).
- `npm run build` — lolos; rute statis `/`, `/en`, `/ar`, `_not-found`, sitemap, robots, icon.
- `motion` ditambah sebagai dependency (useScroll/useTransform untuk progres garis timeline); `scrollama` dihapus beserta license-nya.
- `npm audit --omit=dev`: 5 advisori high severity **pra-eksisting** (dependensi transitive yang lama); `audit fix --force` sengaja tidak dijalankan.

## Sesi CountUp + peta 21–22 Oktober 2026

- CountUp ReactBits (`src/components/shared/CountUp.tsx` + `count-up.css`) adaptasi strict TS: angka 114 pada stempel hero (ganti stempel statis; faktor “tahun” tetap, sr-only di luar bungkus `aria-hidden` agar terbaca sekali) dan angka 29 pada statistik section peta.
- Peta: kolom daftar negara dihapus; label kota dihapus dari data (`pcim.ts` kini `id, iso, lat, lng, country` tanpa `PcimRegion`/`city`), `<title>`, tooltip, dan label peta — markup hanya memuat nama negara.
- Daftar 29 PCIM divalidasi terhadap halaman resmi `muhammadiyah.or.id/cabang-istimewa/` (live fetch): 29/29 cocok tepat, urutan sama; Indonesia ISO 360 bukan anggota ke-30.
- Peta menjadi full-bleed (di luar `container-page`); dot interaktif `role="button" tabIndex 0` dengan `aria-label` nama negara; satu label aktif via hover/klik/fokus/Tap, tap area kosong menutup; Indonesia (markas Pimpinan Pusat, Yogyakarta) berwarna khusus dengan label dua baris selalu tampil.
- Tombol “i” (`map-info-button`, `dict.map.info`) mengarah ke `/tentang`; halaman `/tentang` dibuat sebagai placeholder minimal. Key i18n baru: `map.countries`, `map.hq`, `map.info`; `map.count/countryList/cityLabel/regions` dan tipe `RegionKey` dihapus.
- SSR spot-check: 30 `role="button"` (29 negara + 1 markas), semua `<title>` hanya nama negara/tanda markas, `sr-only` “114 tahun” di hero, `href="/tentang"` ada di `id/en/ar`.
- `npm run typecheck` — lolos (1x fix `as RollColumn` di JSX digit CountUp).
- `npm run lint` — lolos; 0 error; 12 warning lama bawaan `src/Contoh Timeline.tsx`.
- `npm run build` — lolos; rute statis `/`, `/en`, `/ar`, `/tentang`, `_not-found`, sitemap, robots, icon.
- `src/proxy.ts` sempat tampil terhapus di `git status` (bukan perubahan yang disengaja); dipulihkan dengan `git restore src/proxy.ts` sesuai HEAD.
- Interaksi peta (hover/klik/tap/fokus/tap area kosong) belum diuji di browser nyata; ditandai di bagian Catatan.

## Sesi CardNav + Tentang 22 Oktober 2026

- Stage 1 (audit kredit) dilaporkan dan disetujui; keputusan: seluruh sumber/lisensi/hak cipta terpusat di halaman Tentang, tautan/daftar sumber dihapus dari halaman lain, `sitemap.ts` dan `src/lib/metadata.ts` tidak diubah, halaman Tentang tanpa penyebutan teknologi.
- CardNav ReactBits diadaptasi (`src/components/shared/CardNav.tsx` + `card-nav.css`): strict TS, tema panel dari token terang/gelap situs, mode compact untuk header, slot `footer` (CTA `#sejarah`, pemilih bahasa, tautan Tentang), label menu dari `dict.nav.menuOpen/menuClose`.
- Header baru (`Navbar.tsx`): logo + nama situs satu baris (`.navbar-brand` clamp), ThemeToggle, CardNav compact `key="{lang}-{path}"` — panel terbuka ulang tertutup saat ganti bahasa/rute; pemilih bahasa kini hanya ada di panel CardNav.
- Footer ringkas tiga kolom; kolom sumber/kredit/bahasa/hak cipta dan strip bawah dihapus; tautan Tentang via `aboutPath(dict.lang)`.
- Halaman Tentang baru (`AboutPage.tsx`) dengan route `/tentang`, `/en/tentang`, `/ar/tentang`; konten dari `dict.aboutPage` (sumber `SITE.links`, aset/lisensi, arsip riset internal, catatan data, hak cipta persis `© 2026 Faris Husamuddin. Hak cipta dilindungi.`); metadata inline per bahasa; tanpa penyebutan teknologi (tanpa penanda nama pustaka/lisans teknis selain satu baris lisensi font).
- Sumber dibersihkan dari semua halaman: `SourceNote.tsx` dihapus dari AboutMilad/Agenda/History/Services/Map lalu filenya dihapus; baris sumber KHGT di HijriCalendar dan tautan sumber muhammadiyah.or.id di KabarTabs dihapus; penyebutan Natural Earth dan world-atlas dihapus dari catatan peta; label `map.info` kini menuju `aboutPath`. Key i18n sumber (`common.source`, `history.source`, `services.sourceTitle/sourceDescription`, `calendar.source`, `kabar.source/sourceNote`, `map.source`, `footer.sources/credit/copyright/dataNote/language`, `about.link`) dihapus dari types + tiga bahasa. CTA layanan (KHGT, Edaran) dan tautan artikel kabar tetap sebagai tautan konten.
- Lint menandai pattern compiler React: setState-dalam-effect (penutupan Navbar, state `shown`/`narrow` CardNav) diganti pattern tanpa effect (remount via `key`, lazy init + listener callback) dan akses ref saat render (ctaButton) diganti `setOpen` langsung di handler.
- `npm run typecheck` — lolos. `npm run lint` — 0 error, 12 warning lama. `npm run build` — lolos; rute `/`, `/en`, `/ar`, `/tentang`, `/en/tentang`, `/ar/tentang`, `_not-found`, sitemap, robots, icon.
- SSR spot-check `.next/server/app/*.html`: markup panel card-nav ada; footer tanpa hak cipta/sumber, memuat tautan Tentang; pemilih bahasa tepat satu (di panel CardNav); `/tentang` memuat sumber + aset + hak cipta persis dengan 0 kejadian token teknologi (React/Next/GSAP/Tailwind/dll.); `/ar/tentang` memuat `dir="rtl"` dan hak cipta Arab.
- Uji visual browser (buka/tutup panel CardNav, tata letak 390 px, RTL, tema gelap, oper pendengar sentuh GlideSelect di slot footer) belum dilakukan; ditandai di bagian Catatan.



## Sesi GradientText + mode Ramadhan + minimalisasi + tabel collapsible + logo penutup 22 Oktober 2026

- GradientText ReactBits diadaptasi (`src/components/shared/GradientText.tsx` + `gradient-text.css`): strict TS, klien, ekspor CSS dari komponen (jejak gradasi dibawa via `--gt-gradient`, tanpa `getComputedStyle`), yoyo, id/EN/AR RTL, reduced motion, pause saat tak terlihat, warna dari token `--gt-c1..c4` (terang: navy `#1c469f`, ocean `#195c8d`, hijau daun `#6dbc25`, kuning tua `#e1b01a`; gelap: versi pucat agar terbaca). Dipakai pada: judul hero (satu instance per baris) dan satu-satunya seluruh judul section via `SectionHeading`, serta teks judul toggle Countdown. Tidak dipakai pada body/label/nav/tabel/footer.
- Counter Ramadhan di `Countdown.tsx`: mode `event` (default) dan `ramadhan`. Judul toggle sendiri adalah tombol (`class="countdown-toggle"`, `aria-pressed`, aria-label ganti mode); fokus ganti zona waktu tetap di `<select>`. Ganti mode atau zona waktu memainkan ulang intro Counter (kunci di grid digit memuat mode+zona+replay); interval 1 detik dan aria-live utama tetap. Tanpa tombol toggle terpisah.
- Tanggal Ramadhan (KHGT, maghrib diperkirakan 18.00 WITA, target ISO `+08:00`): `2027-02-07T18:00:00+08:00` (menuju 1 Ramadhan 1448 = 8 Feb 2027), `2027-03-08T18:00:00+08:00` (menuju Awal Syawal 1448 = 9 Mar 2027), `2028-01-27T18:00:00+08:00` (menuju 1 Ramadhan 1449 = 28 Jan 2028), `2028-02-25T18:00:00+08:00` (menuju Awal Syawal 1449 = 26 Feb 2028). Fase `done` tanpa tanggal Ramadhan 1450 yang diada-adakan; catatan setiap fase menyebut ?tanggal mengikuti KHGT? (tanpa link).
- Countdown shell `.countdown-shell` selalu brand navy di kedua tema, dengan `--gt-c*` versi terbaca (mint/pudar) yang timpa default terang agar teks gradient terbaca pada latar gelap.
- Minimalisasi: Hero mono-kolom (`hero.edition/eventLine/dateLine/eyebrow/plate` dihapus); Agenda: `agenda.description/pillars/button` dihapus; Sejarah: `history.ctaEyebrow/ctaTitle/ctaDescription/ctaButton` dihapus; Footer: `footer.event/eventLines` dihapus. Key baru: `history.tablesShow/tablesHide`, `services.closingLogoAlt`, `countdown.modeToggle`, `countdown.ramadhan.{beforeLabel,beforeNote,farewell1448Label,farewell1448Note,before1449Label,before1449Note,farewell1449Label,farewell1449Note,doneLabel,doneNote}` (types + id/en/ar). Dampak ke pemakai key lama: logo alt OG memakai `dict.meta.title`, aria-label/teks intro memakai `dict.hero.subtitle`, alt BrandLogo intro memakai `dict.services.closingLogoAlt`.
- Tabel sejarah collapsible: `HistoryTables.tsx` kini komponen klien; KEDUA tabel tersembunyi secara default dan dibuka/tutup dengan SATU tombol (`aria-expanded` + `aria-controls="tabel-sejarah"`, teks `history.tablesShow`/`tablesHide`); isi tabel tidak dirender saat tertutup; Reveal dan overflow-x tetap.
- Logo penutup: BrandLogo di akhir section Layanan (`.closing-logo`) sebelum Footer ? horizontal di desktop (alt kosong, dekoratif) dan logogram 80 px di seluler (alt `services.closingLogoAlt`); tanpa bayangan/glow/outline/3D.
- Cek: `npm run typecheck` ? lolos. `npm run lint` ? 0 error, 12 warning lama `src/Contoh Timeline.tsx` (satu warning baru yang muncul lalu dihilangkan dengan useMemo untuk map label ramadhan). `npm run build` ? lolos; 11 halaman statis (tambah 2 route `/ar|/en` tentang sebelumnya).
- SSR spot-check `.next/server/app/*.html`: `id/en/ar` masing-masing 44 kejadian `gradient-`, 1 toggle `aria-pressed`, 1 `tables-toggle` dengan `aria-controls`, 2 BrandLogo closing-logo, 0 teks Edisi/plate/statistik dan 0 catatan sumber; tabel tidak dirender default.
- Belum diuji di browser: interaksi toggle mode/zona waktu, animasi gradient pada judul (terang/gelap/RTL/tilt mouse? semua varian linear/yoyo sesuai pilihan pembuat), Buka/Tutup tabel, tata letak 390 px dan tema gelap dengan versi token gradient yang baru; ditandai di bagian Catatan.



## Sesi collapsible + peta + CardNav baru 23 Oktober 2026

- CollapsibleSection (baru, src/components/shared/CollapsibleSection.tsx + collapsible-section.css): lima section (tentang/agenda/peta/sejarah/layanan) tertutup default. Judul menjadi tombol (aria-expanded + aria-controls, chevron berputar), deskripsi dan isi di belakang panel grid-template-rows 0fr -> 1fr dengan inert saat tertutup. Hash (#tentang/#agenda/#peta/#sejarah/#layanan) membuka section; #kabar membuka Layanan lalu scroll ke elemen #kabar setelah transisi; hashchange dipantau.
- SectionHeading tanpa eyebrow; judul/deskripsi pindah ke CollapsibleSection untuk 5 section; Kabar sebagai sub-heading Layanan tanpa eyebrow; halaman Tentang tanpa eyebrow.
- Key i18n dihapus: about.eyebrow/quote, agenda.eyebrow, history.eyebrow, services.eyebrow, map.eyebrow, kabar.eyebrow, aboutPage.eyebrow, footer.explore, nav.links, nav.cta, history.tablesShow/tablesHide. Key baru: about.posterAlt, aboutPage.back, history.tables.leadership/aum.
- Hero: lebar penuh, grid dua kolom di lg (kiri judul + subjudul, kanan intro + CTA + Bagikan), max-w-3xl hilang; wrapper #countdown dengan scroll-mt-24.
- Makna Logo: kolom lama (logogram, eyebrow, angka 114, judul kecil, quote) dihapus; diganti poster public/media/intro (horizontal light/dark desktop, vertical light/dark mobile) via client component MaknaPoster (useTheme + matchMedia max-width 767px), next/image object-contain.
- Navbar: hanya logo + Milad 114 Muhammadiyah + CardNav. ThemeToggle dan pemilih bahasa pindah ke card Pengaturan dalam CardNav melalui slot item.content (ReactNode, prop tambahan di CardNav); card Peta dan footer CardNav (CTA/language/Tentang) dihapus.
- Label card: Jejak & Makna (#sejarah, #tentang, #agenda), Layanan (#layanan, #kabar, #peta, #countdown), Pengaturan (bahasa + tema + Tentang). Tiga bahasa disinkron; EN Tracks & Meaning, AR ط§ظ„ظ…ط³ط§ط± ظˆط§ظ„ظ…ط¹ظ†ظ‰.
- Footer: brand, tagline, dan Tentang saja; Jelajahi dan seluruh tautan di bawahnya dihapus; closing logo dihapus (CSS .closing-logo dihapus juga).
- Tabel: dua tab (aria-expanded/aria-controls/aria-pressed), default tanpa tabel tampil; klik tab menampilkan tabelnya, klik tab aktif menutup kembali; warna aktif kepemimpinan = ocean, AUM = kelor.
- Peta: hit circle transparan r=16 pointer-events=all per titik (29 PCIM + HQ); label negara dan label Indonesia hanya muncul saat titik itu aktif; halo marker pulse CSS keyframes (transform-box fill-box), lebih cepat saat aktif, hormati prefers-reduced-motion; klik titik stopPropagation, klik area kosong menutup.
- Counter: chevron kecil di tombol toggle, underline gradient via ::after pada hover/focus, focus ring jelas; perilaku mode/tanggal tidak diubah.
- Halaman Tentang: tombol pill Kembali ke Beranda (about-back, panah rtl:rotate-180), heading tanpa eyebrow.
- Light theme: wash gradient sangat halus (ocean/gold/kelor) pada body; padding .section menjadi clamp(3rem, 5vw, 4.5rem); CSS yatim (hero-plate, hero-orb, tables-toggle, closing-logo, animate-fade-in/float-slow/pulse-soft) dibuang.
- SSR spot-check id/en/ar + /tentang: 5 collapsible per halaman dengan aria-expanded=false dan inert; footer tanpa Jelajahi/list; 30 hit-circle per peta; /tentang about-back ada, eyebrow 0; dua tab tabel default tertutup; hero dua kolom gradient.
- npm run typecheck: lolos. npm run lint: 0 error, 12 warning lama. npm run build: lolos, 11 route statis.
- Belum diuji di browser: interaksi card Pengaturan dalam panel CardNav, tap label peta di perangkat sentuh, perilaku scroll hash (kabar) di perangkat nyata, kontras tema gelap, dan tata letak 390px/1440p.
