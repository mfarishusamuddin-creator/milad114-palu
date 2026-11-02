# Handoff P6 — Bagikan Karya Hero (HeroTitleShare)

Tanggal: 2 November 2026
Lingkup: hanya komponen baru `src/components/home/HeroTitleShare.tsx` dan dokumen ini. Tidak ada file lain yang diubah.

## File yang dibuat

| File | Isi |
|---|---|
| `src/components/home/HeroTitleShare.tsx` | Client component: hook `useArtworkShare` + komponen `HeroTitleShare` |
| `HANDOFF-hero-share.md` | Dokumen ini |

Tidak diubah: `Hero.tsx`, `HeroArtwork.tsx` (belum ada di working tree), `hero-artwork.ts`, `ShareButton.tsx`, seluruh `src/i18n/*`, `globals.css`, aset, konfigurasi, dan `package.json`. Tidak ada dependency baru; ikon share adalah SVG inline yang disalin dari `ShareButton.tsx`.

## API yang diekspor

```tsx
"use client";

export function useArtworkShare(dict: Dictionary): {
  share: () => Promise<void>;
  status: string;
};

export function HeroTitleShare(props: {
  onShare: () => void | Promise<void>;
  status: string;
  label: string;
  className?: string;
}): ReactElement;
```

### `useArtworkShare(dict)`

- `url` = `window.location.href` → otomatis benar di `/`, `/en`, `/ar`. **Tidak** memakai `SITE.url`.
- `title` = `` `${dict.heroArtwork.title} — ${SITE.title}` `` (em dash).
- `text` = `dict.hero.shareText`.
- Alur:
  1. Jika `navigator.share` tersedia → `navigator.share({ title, text, url })`.
     - sukses → `dict.heroArtwork.shareStatus.shared`;
     - `AbortError` (batal oleh pengguna) → **tanpa status**, tidak jatuh ke clipboard, timer status lama dibatalkan;
     - error lain → lanjut ke clipboard.
  2. Clipboard → `navigator.clipboard.writeText(`${text} ${url}`)` → `shareStatus.copied`.
  3. Clipboard tidak tersedia / gagal → `shareStatus.manual`.
- Status hidup `2600` ms; timer lama selalu dibersihkan sebelum status baru; timer dibersihkan saat unmount (`useEffect` cleanup). Tidak ada timer yang bocor.
- Error tidak ditelan diam-diam: setiap jalur gagal berakhir pada status yang terlihat (`manual`), dan `AbortError` sengaja tidak menampilkan apa pun sesuai spesifikasi.
- Guard `typeof window === "undefined"` hanya untuk keamanan pemanggilan di luar browser; `share()` normalnya hanya dipanggil dari klik.

### `HeroTitleShare(props)`

- `<span class="inline-flex flex-wrap items-center gap-2">` berisi:
  - `<button type="button" class="btn btn-ghost min-h-11 px-4 py-2 text-[0.8rem]">` dengan `<ShareIcon />` (15×15, `aria-hidden`, `flex-none`) lalu `<span>{label}</span>`;
  - `<span aria-live="polite" aria-atomic="true" class="inline-flex min-h-6 min-w-[9rem] items-center text-xs font-semibold text-ocean">{status}</span>`.
- Tap target: `.btn` sudah `min-height: 2.9rem`, ditambah eksplisit `min-h-11` (2.75rem = 44px) agar aturan PANDUAN §7.2 terpenuhi di semua viewport (`.btn-sm` tidak dipakai karena hanya 2.35rem).
- Tidak ada warna/font baru: memakai token `.btn`/`.btn-ghost` dan utilitas `text-ocean` (punya override `[data-theme="dark"] .text-ocean` di `globals.css`), serta font body bawaan `.btn`.
- RTL aman: flex + `gap` dan urutan DOM ikon → teks; pada `dir="rtl"` ikon otomatis berada di kanan teks tanpa pembalikan manual.
- Komponen tidak merender judul karya dan tidak pernah menampilkan teks "K.H. Ahmad Dahlan"; hanya label tombol (dari `dict.heroArtwork.shareLabel`) dan status.
- `className` diterapkan ke **wrapper grup** (bukan ke `<button>`), sehingga integrasi bisa memberi jarak/posisi untuk tombol + status sekaligus. Bila P3 butuh styling khusus tombol, bungkus dengan elemen sendiri.

## Keputusan teknis

1. **Deteksi batal lewat `error.name === "AbortError"`** (bukan `instanceof DOMException`) agar tetap menangkap DOMException maupun `Error` biasa dengan nama yang sama; `navigator.share` di beberapa browser/WebView melempar objek non-DOMException.
2. **Batal membersihkan status lama.** Jika sebelumnya ada status "Tautan disalin" yang masih tampil lalu pengguna membatalkan share, status lama dihapus supaya tidak menyesatkan; hasil akhirnya tetap "tanpa status".
3. **Cadangan clipboard hanya setelah share gagal** (bukan setelah batal), sesuai spesifikasi.
4. **Reservasi ruang status** memakai `min-h-6` + `min-w-[9rem]`; tidak ada `position: absolute`, jadi status tidak pernah menimpa tombol/judul. Untuk teks manual Arab yang lebih panjang, span boleh melebar/melipat satu baris tanpa menutupi konten lain.
5. **Ikon disalin inline** dari `ShareButton.tsx` (3 circle + 1 path, stroke `currentColor`) tanpa paket ikon baru, walaupun repo memiliki `@hugeicons`.
6. **Tidak menyentuh `ShareButton.tsx`.** Komponen lama tetap dipakai di CTA hero; `HeroTitleShare` berdiri sendiri untuk hotspot judul karya.

## Integrasi (jangan diedit di sini — untuk P3/P8)

```tsx
// di komponen klien yang memuat hero artwork
import {
  HeroTitleShare,
  useArtworkShare,
} from "@/components/home/HeroTitleShare";

const { share, status } = useArtworkShare(dict);

// hotspot judul (overlay) — onClick memanggil share
<button type="button" onClick={share} aria-label={dict.heroArtwork.actions.judul.action}>
  {/* area hotspot */}
</button>

// tombol kecil + status di bawah/atas artwork
<HeroTitleShare
  onShare={share}
  status={status}
  label={dict.heroArtwork.shareLabel}
/>
```

Catatan: `useArtworkShare` harus dipanggil di komponen klien (file sudah `"use client"`), dan `dict` harus kamus bahasa halaman aktif agar label/status ikut bahasa.

## Hasil verifikasi

| Perintah | Hasil |
|---|---|
| `npx tsc --noEmit --incremental false` | Lolos, exit 0, tanpa error (dijalankan ulang setelah executor lain menyelesaikan `HistoryTimeline.tsx`/`AyatKursiDialog.tsx`; sebelumnya sempat gagal hanya karena file executor lain yang sedang ditulis, bukan `HeroTitleShare.tsx`). |
| `npx eslint src/components/home/HeroTitleShare.tsx` | Lolos, exit 0, tanpa warning/error. |
| `npm run build` | Tidak dijalankan (sesuai instruksi; orchestrator menjalankan setelah semua executor selesai). |

Tidak ada perubahan pada `globals.css`, tema, intro, atau aset. `git status` untuk tugas ini hanya menambah dua file di atas.

## Skenario uji manual untuk P8

Uji di `http://localhost:3000` setelah integrasi Hero selesai. Untuk memaksa tiap cabang, buka DevTools Console dan tempel helper berikut (refresh untuk mengembalikan perilaku asli):

```js
// A. share sukses
navigator.share = async () => {};
// B. pengguna membatalkan dialog
navigator.share = async () => { throw new DOMException("Share canceled", "AbortError"); };
// C. share gagal (harus lanjut ke clipboard)
navigator.share = async () => { throw new Error("share failed"); };
// D. clipboard tidak tersedia (harus jatuh ke status manual)
Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
```

| # | Skenario | Langkah | Hasil yang diharapkan |
|---|---|---|---|
| 1 | Share sukses | Desktop/mobile yang mendukung Web Share; klik "Bagikan karya" lalu selesaikan dialog | Tidak ada error di console; status `Terbagi` / `Shared` / `تمت المشاركة` muncul; timer mulai. |
| 2 | Batal / AbortError | Pakai helper B, klik tombol | **Tidak ada status baru** (status lama, bila ada, hilang); clipboard **tidak** dipanggil; tidak ada error di console. |
| 3 | Clipboard sukses | Browser tanpa `navigator.share` (mis. Firefox desktop) atau helper C dengan izin clipboard; klik tombol | Status `Tautan disalin`; clipboard berisi `"{shareText} {URL halaman aktif}"`. Tempel ke editor untuk memastikan URL = `window.location.href` (bukan `SITE.url`). |
| 4 | Clipboard ditolak | Helper C + D, atau tolak izin clipboard di prompt browser; klik tombol | Status `Salin URL di address bar` (EN/AR sesuai bahasa); tidak ada exception yang lolos ke console. |
| 5 | Status auto-clear | Setelah skenario 1/3/4 | Status hilang otomatis ±2,6 detik; tidak muncul kembali. Klik dua kali cepat: timer lama tidak memotong status baru lebih awal. |
| 6 | Keyboard & fokus | Tab sampai tombol, cek ring fokus emas, tekan Enter lalu Space | Ring fokus terlihat (outline emas 3px, offset 3px); Enter dan Space sama-sama memicu share; urutan Tab masuk akal dan status dibacakan (`aria-live="polite"`). |
| 7 | RTL `/ar` | Buka `/ar`, cek tombol + status | Arah teks kanan–kiri; ikon berada di sisi kanan teks (sebelum teks secara baca), jarak `gap` konsisten; status Arab tampil rata kanan tanpa tumpang tindih. |
| 8 | `/en` dan `/ar` | Ulangi skenario 1, 3, 4 di `/en` dan `/ar` | Label dan status mengikuti bahasa; URL yang dibagikan/disalin memuat `/en` atau `/ar` sesuai halaman. |
| 9 | Tanpa layout shift | DevTools → Performance/rendering → Layout Shift regions; klik tombol berulang, bandingkan saat status kosong/terisi | Tidak ada pergeseran tombol atau konten sekitar; area status sudah dipesan (`min-h-6` × `min-w-[9rem]`). Uji juga 320 px dan 390 px (status manual panjang boleh melipat, tidak menimpa). |
| 10 | Tap target & mode gelap | 390 px, mode terang + gelap, ukur tombol di DevTools | Tinggi tombol ≥ 44 px; kontras label/status terbaca di kedua tema (status memakai `text-ocean` yang punya override gelap). |
| 11 | Timer saat unmount | Picu status lalu langsung navigasi ke `/en` atau halaman Tentang | Tidak ada warning React "state update on unmounted component"; timer dibersihkan. |
| 12 | Judul berbagi | Skenario 1/3, periksa payload | `title` = `"{heroArtwork.title} — {SITE.title}"`; `text` = `dict.hero.shareText`; tidak memakai `SITE.url`. |

## Catatan terbuka

1. `HeroTitleShare` belum diintegrasikan ke `Hero.tsx`/`HeroArtwork.tsx` (di luar kepemilikan P6). Sampai integrasi dilakukan, komponen belum dirender dan uji visual belum bisa dijalankan.
2. Preview tautan (OG) saat dibagikan tetap memakai metadata situs; `navigator.share` hanya mengirim `title`/`text`/`url` — tidak ada perubahan metadata.
3. Sempat ada error typecheck sementara dari file executor lain (`openHistory` di `HistoryTimeline.tsx`, lalu `useState` di `AyatKursiDialog.tsx`) saat pekerjaan paralel berlangsung; keduanya hilang pada jalankan terakhir (`tsc` exit 0).
