# HANDOFF — P7: Modal Ayat Kursi

Tanggal: 2 November 2026
Status kode: selesai dan terverifikasi (`lint`, `typecheck`, `build` lolos)
Status konten: **READY**, disetujui pemilik 2 November 2026
Status integrasi: **belum diintegrasikan ke hero** (menunggu P3)

## Perubahan terbaru

P7 diubah dari daftar hadits + teks ayat menjadi **tiga poin keutamaan**:

- Tanpa teks Ayat Kursi.
- Tanpa teks hadits lengkap.
- Tiap poin: judul pendek + satu kalimat + sumber singkat yang netral.
- Sumber poin dapat diklik ke halaman dorar.net yang spesifik.
- Satu tombol utama di bawah ke halaman dorar.net yang spesifik per bahasa.
- Khusus halaman Indonesia, ada tombol artikel Muhammadiyah terkait.
- Format ringkas, minimalis, tanpa catatan derajat panjang di dalam popup.
- Tidak ada label derajat di sumber; nomor an-Nasa'i yang dipakai 9848.

## File

| File | Status | Isi |
|---|---|---|
| `src/components/home/AyatKursiDialog.tsx` | DIUBAH | Dialog portal + focus trap + tiga kartu poin + tombol dorar + artikel ID |
| `src/components/home/ayat-kursi.css` | DIUBAH | Layout tiga poin, nomor, sumber, dua tombol, mode gelap, mobile |
| `src/data/ayat-kursi.ts` | DIUBAH | Tipe `AyatKursiText`, `AyatKursiPoint`, `AyatKursiContent`; data tiga poin + artikel ID |
| `AYAT-KURSI-CONTENT.md` | DIUBAH | Teks final ID/EN/AR, tautan, catatan verifikasi, checklist READY |
| `HANDOFF-ayat-kursi.md` | DIUBAH | Dokumen ini |

Tidak ada perubahan pada `MotionIntro.tsx`, `SiteShell.tsx`, `layout.tsx`, `globals.css`, `Hero.tsx`, aset, i18n, atau sejarah. Tidak ada dependency baru. Tidak ada commit/push.

## API komponen

```tsx
import { AyatKursiDialog } from "@/components/home/AyatKursiDialog";

<AyatKursiDialog open={open} onClose={() => setOpen(false)} dict={dict} />
```

| Prop | Tipe | Keterangan |
|---|---|---|
| `open` | `boolean` | `false` → komponen mengembalikan `null` (tidak ada listener/scroll lock) |
| `onClose` | `() => void` | Dipanggil oleh Escape, klik backdrop, dan tombol tutup |
| `dict` | `Dictionary` | Sumber judul/label + `dict.lang`/`dict.dir` |

Perilaku yang tetap dipertahankan:

- Portal ke `document.body`; render ditunda sampai hidrasi selesai (`useSyncExternalStore`, snapshot server `false`).
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby="ayat-kursi-title"`.
- Fokus awal ke tombol tutup; Tab/Shift+Tab berputar di dalam panel; Escape menutup; klik backdrop menutup; klik di dalam panel tidak menutup.
- Fokus sebelumnya disimpan dan dikembalikan saat dialog ditutup/unmount.
- `document.body.style.overflow` disimpan, di-set `hidden`, dan dipulihkan saat cleanup.
- Mobile (< 640 px): sheet penuh layar (`100dvh`, sudut 0, padding aman); desktop: `min(39rem, 100%)`, `max-height: 85vh/85dvh`, isi menggulir sendiri.
- Animasi hanya fade 180 ms; `prefers-reduced-motion: reduce` mematikan animasi.
- z-index 60 (di atas header sticky 50, di bawah skip link/intro 100).

## Model data

```ts
type AyatKursiText = Record<LanguageCode, string>;

type AyatKursiPoint = {
  id: string;
  title: AyatKursiText;
  summary: AyatKursiText;
  source: AyatKursiText;
  href: string; // halaman dorar.net paling spesifik untuk poin ini
};

type AyatKursiContent = {
  points: AyatKursiPoint[];
  cta: {
    label: AyatKursiText;
    href: Record<LanguageCode, string>; // spesifik per bahasa, bukan beranda
  };
  related?: {
    label: Partial<AyatKursiText>; // saat ini hanya ID
    href: Partial<Record<LanguageCode, string>>; // saat ini hanya ID
  };
};
```

Semua teks yang tampil diambil dari `src/data/ayat-kursi.ts` memakai `dict.lang`. Tidak ada fallback antar-bahasa di komponen karena ketiga bahasa sudah lengkap. Label UI tetap dari `dict.heroArtwork.ayatKursi` (`title`, `close`, `sourceLabel`); `gradeLabel` dan `narratorLabel` tidak lagi dipakai oleh P7.

Sumber poin sengaja netral: `Muslim 810`, `al-Bukhari 3275`, `An-Nasa'i 9848`. Tidak ada label `sahih`, `mu'allaq`, atau nama penilai di popup.

## Tautan yang dipakai

| Kebutuhan | Tautan | Catatan |
|---|---|---|
| Poin 1 — Muslim 810 | <https://dorar.net/hadith/sharh/64099> | Terverifikasi, judul cocok dengan riwayat Ubay bin Ka'b |
| Poin 2 — al-Bukhari 3275 | <https://dorar.net/hadith/sharh/1767> | Terverifikasi, memuat 3275 dan 2311 |
| Poin 3 — Abu Umamah | <https://dorar.net/feqhia/1064> | Terverifikasi, memuat lafaz, takhrij, dan penilaian al-Albani |
| Tombol ID | <https://dorar.net/hadith-category/cat/5c8227ee3d> | Kategori fadhail ayat dan surah versi Arab |
| Tombol EN | <https://dorar.net/en/tafseer/1234> | Halaman Inggris spesifik tentang Surah Al-Baqarah dan keutamaan Ayat Kursi |
| Tombol AR | <https://dorar.net/hadith-category/cat/5c8227ee3d> | Kategori fadhail ayat dan surah versi Arab |
| Artikel ID | <https://muhammadiyah.or.id/2024/12/setiap-tidur-malam-umat-islam-dianjurkan-membaca-ayat-kursi/> | Terverifikasi aktif; tombol tambahan hanya dirender di halaman Indonesia |

Tidak ada tautan ke beranda dorar.net.

Catatan: dorar.net tidak punya versi Indonesia. Halaman syarah per hadits juga tidak tersedia dalam bahasa Inggris (`/en/hadith/sharh/...` 404). Karena itu tautan poin memakai halaman Arab yang spesifik, sesuai aturan fallback: bahasa halaman → Inggris spesifik → Arab spesifik, bukan beranda.

## Verifikasi

| Perintah | Hasil |
|---|---|
| `npm run lint` | Lolos, 0 error; 12 warning lama di `src/Contoh Timeline.tsx` |
| `npm run typecheck` | Lolos, tanpa error |
| `npm run build` | Lolos, 11 route statis |

Uji visual manual belum dilakukan karena komponen belum dirender di hero. Saat integrasi, cek: buka/tutup via Escape, backdrop, tombol; Tab cycle; fokus kembali ke pemicu; scroll body terkunci; mode gelap; `/ar` RTL; 390 px dan 1440 px; reduced motion; tautan poin dan tombol membuka tab baru.

## Catatan integrasi untuk P3

- Render **satu** instance di level yang sama dengan karya hero (bukan di dalam setiap hotspot):

  ```tsx
  const [ayatKursiOpen, setAyatKursiOpen] = useState(false);

  // hotspot baju / item index "Ayat Kursi"
  onActivate={() => setAyatKursiOpen(true)}

  <AyatKursiDialog
    open={ayatKursiOpen}
    onClose={() => setAyatKursiOpen(false)}
    dict={dict}
  />
  ```

- Pasang pemicu pada hotspot `baju` (atau item indeks detail `baju`) yang sudah ada; jangan mengubah `Hero.tsx` dari sisi P7.
- Jangan render dialog per hotspot: id `ayat-kursi-title` harus unik dan focus trap mengasumsikan satu panel aktif.
- Konten sudah **READY** (lihat `AYAT-KURSI-CONTENT.md`), jadi hotspot boleh diaktifkan setelah integrasi.
- Komponen mengurus portal, scroll lock, focus trap, dan restore fokus; P3 tidak perlu menambahkan logika tersebut.
- Jangan menambahkan teks hadits/ayat di komponen atau i18n; seluruh isi berasal dari `src/data/ayat-kursi.ts`.
