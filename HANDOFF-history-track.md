# Handoff — Deep-link Jalur Sejarah (P4)

Tanggal: 2 November 2026
Cakupan: pemilihan **jalur** sejarah (`muhammadiyah` / `dahlan`) lewat event, plus titik integrasi untuk hotspot hero dan pemilihan tabel (milik P5).

## File yang diubah

| File | Status | Isi perubahan |
|---|---|---|
| `src/lib/history-nav.ts` | **baru** | Tipe `HistoryTrackId`, `HistoryTableId`, `HistorySelection`, konstanta `HISTORY_SELECT_EVENT = "site:history-select"`, dan fungsi `openHistory(selection)`. |
| `src/components/history/HistoryTimeline.tsx` | diubah | Tambah `useEffect` yang mendengar `HISTORY_SELECT_EVENT`; bila `detail.track` ada, cari index di `content.tracks` lalu `setActive(index)`. Listener dilepas saat unmount. |

Tidak ada perubahan pada data, label, urutan tab, fakta, `HistoryTables.tsx`, `HistorySection.tsx`, `src/data/history*.ts`, `src/i18n/**`, palet, font, atau file milik pelaksana lain.

## API

```ts
import { openHistory } from "@/lib/history-nav";

openHistory({ track: "dahlan" });        // jalur KH Ahmad Dahlan
openHistory({ track: "muhammadiyah" });  // jalur Muhammadiyah
openHistory({ table: "aum" });           // tabel AUM + scroll ke #tabel-sejarah (P5)
```

`openHistory` **mengirim event lebih dulu, baru** membuka/menggulir. Alasannya: isi section sudah ter-mount di dalam `CollapsibleSection` (hanya panelnya yang `aria-hidden` + `inert`), jadi `HistoryTimeline` bisa langsung mengganti tab, lalu panel dibuka setelahnya. Urutan sebaliknya akan membuat tinggi panel berubah di tengah animasi buka.

Untuk `selection.table`, `openHistory` membuka section **tanpa scroll** (`site:anchor-navigation` dengan `scroll: false`) dan `HistoryTables` yang menggulir ke `#tabel-sejarah` setelah panel terbuka. Ini mencegah dua animasi scroll bersaing antara section dan tabel (lihat `HANDOFF-history-tables.md`). Untuk jalur/umum, alur lama `scrollToAnchor("#sejarah")` tetap dipakai.

## Perilaku yang diverifikasi lewat penalaran + bukti SSR

1. **Section tertutup** (kasus utama deep-link): `openHistory` → event → `setActive` → `scrollToAnchor("#sejarah")` menulis hash, mendeteksi target di dalam `.collapsible`, mengirim `site:anchor-navigation`; `CollapsibleSection` membuka panel, menunggu `transitionend` (fallback 700 ms), lalu menggulir ke `#sejarah`. Hasil: panel terbuka, tab yang diminta sudah aktif, **satu** scroll (tidak ada scroll ganda karena tidak ada komponen lain yang memanggil `scrollIntoView`).
2. **Section sudah terbuka**: event tetap mengganti tab, lalu `scrollToAnchor` memakai jalur "sudah terbuka" (`revealTarget` → `requestAnimationFrame` → satu `scrollIntoView`). `pushState`/`replaceState` ke hash yang sama tidak memicu `hashchange`, jadi tidak ada reveal kedua.
3. **Event hanya berisi `table`**: `if (!detail?.track) return;` → timeline tidak berubah (tabel tetap urusan P5).
4. **Section tidak pernah ditutup** oleh event ini; buka/tutup tetap milik `CollapsibleSection`.
5. **Bukti prasyarat SSR**: saat `next dev` dijalankan, HTML awal `/` memang sudah memuat markup panel sejarah yang tertutup (`aria-hidden="true"` + `inert`, berisi `id="history-tab-dahlan"`), sehingga listener timeline aktif sebelum panel dibuka.
6. **Tab manual tetap bekerja** seperti sebelumnya (`onClick={() => setActive(index)}` tidak disentuh).

## Cara menguji manual (bila ada browser)

1. `npm run dev`, buka `/`.
2. Dari konsol: `document.querySelector('#sejarah button[aria-expanded]').click()` lalu klik tab "KH Ahmad Dahlan" — harus tetap normal.
3. Untuk menguji deep-link, buat pemicu sementara (tombol dev) yang memanggil `openHistory({ track: "dahlan" })`:
   - dengan section **tertutup**: panel harus terbuka, tab Dahlan aktif, halaman menggulir sekali ke `#sejarah` (URL menjadi `#sejarah`);
   - dengan section **terbuka** dan tab Muhammadiyah aktif: tab harus berpindah ke Dahlan tanpa menutup panel dan tanpa lompatan ganda.
4. Ulangi untuk `openHistory({ track: "muhammadiyah" })` dari tab Dahlan, dan cek `/en`, `/ar` (label mengikuti locale, urutan tab tetap sama).
5. Tombol dev sementara **sudah dihapus** dari `HistoryTimeline.tsx` sebelum handoff (diverifikasi: tidak ada sisa `DEV dahlan`, `__openHistory`, atau penanda `TEMP DEV`).

## Hasil verifikasi

- `npx eslint src/lib/history-nav.ts src/components/history/HistoryTimeline.tsx` → **lolos, 0 masalah**.
- `npx tsc --noEmit --incremental false` → **lolos, exit 0** pada run terakhir (setelah pelaksana lain menyelesaikan `AyatKursiDialog.tsx`; sebelumnya sempat ada `TS2304: Cannot find name 'useState'` di file tersebut — bukan file P4).
- `npm run build` **tidak** dijalankan (sesuai instruksi; orchestrator menjalankannya setelah semua pelaksana selesai).
- Uji klik di browser tidak dapat dilakukan di sesi ini karena tidak ada desktop browser yang terhubung ke tool browser (`browser.disconnected`). Dev server sementara di port 3123 sudah dimatikan.

## Catatan untuk pelaksana lain

- **P3 (hotspot hero)**: gunakan `openHistory` sebagai satu-satunya titik integrasi — `openHistory({ track: "dahlan" })` untuk hotspot **wajah**, `openHistory({ track: "muhammadiyah" })` untuk hotspot **matahari**. Jangan memanggil `scrollToAnchor("#sejarah")` sendiri setelahnya; `openHistory` sudah melakukannya.
- **P5 (tabel)**: sudah selesai. `HistoryTables.tsx` mendengar `HISTORY_SELECT_EVENT`, memilih tab tanpa toggle, lalu menggulir ke `#tabel-sejarah` setelah panel terbuka. `openHistory({ table })` membuka section tanpa scroll agar tidak terjadi scroll ganda. Detail di `HANDOFF-history-tables.md`.
- `openHistory` aman dipanggil dari komponen client mana pun (ada guard `typeof window === "undefined"`), tetapi jangan dipanggil saat render — panggil di handler klik.
