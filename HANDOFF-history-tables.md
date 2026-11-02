# Handoff — Deep-link Tabel Sejarah dan Scroll (P5)

Tanggal: 2 November 2026
Cakupan: `openHistory({ table: "aum" | "leadership" })` memilih tab tabel tanpa toggle, membuka section Sejarah, dan menggulir ke `#tabel-sejarah` dengan offset sticky header.

## File yang diubah

| File | Status | Isi perubahan |
|---|---|---|
| `src/components/history/HistoryTables.tsx` | diubah | Listener `HISTORY_SELECT_EVENT`, `setActive` tanpa toggle, pending scroll ke `#tabel-sejarah`, `transitionend` + fallback 700 ms, rAF bila panel sudah terbuka, `scroll-mt-24` pada wadah tabel. |
| `src/components/history/HistorySection.tsx` | diubah | Wrapper `Reveal` di sekitar tabel dilepas (diganti `div.mt-12`) agar tabel langsung terlihat saat deep-link. Section lain tidak disentuh. |
| `src/lib/history-nav.ts` | diubah | `openHistory` membuka section **tanpa scroll** untuk `selection.table`, lalu `HistoryTables` menggulir ke tabel. Jalur/umum tetap `scrollToAnchor("#sejarah")`. |
| `src/components/shared/CollapsibleSection.tsx` | diubah | `site:anchor-navigation` menerima `scroll: false`: membuka panel tanpa menggulir. Perilaku lama (tanpa flag) tidak berubah. |

Tidak ada perubahan pada data sejarah, label i18n, urutan tab, fakta, palet, font, `HistoryTimeline.tsx`, atau `HistorySection` bagian timeline.

## Perilaku

1. `openHistory({ table })` mengirim `HISTORY_SELECT_EVENT`, lalu `site:anchor-navigation` `{ targetId: "sejarah", scroll: false }`, lalu menulis hash `#sejarah`.
2. `HistoryTables` mendengar event; bila `detail.table` ada, `setActive(table)` **tanpa toggle** (tab aktif tidak menutup).
3. `HistoryTables` menandai pending scroll lalu menunggu panel:
   - panel tertutup: `transitionend` `grid-template-rows` pada `.collapsible__panel`, fallback 700 ms;
   - panel sudah terbuka: langsung pada frame berikutnya;
   - `prefers-reduced-motion: reduce`: tidak menunggu transisi, langsung frame berikutnya.
4. Setelah panel terbuka, `scrollIntoView({ block: "start" })` ke `#tabel-sejarah`. `scroll-mt-24` (96 px) menjaga tabel tidak tertutup header sticky.
5. Klik manual tetap memakai `toggle`: klik tab aktif menutup tabel. `aria-expanded`, `aria-pressed`, dan `aria-controls="tabel-sejarah"` tetap benar.

### Catatan penyimpangan dari prompt

Prompt meminta `HistoryTables` menggulir setelah panel terbuka, tetapi `openHistory` versi P4 juga menggulir ke `#sejarah`. Dua animasi scroll bersaing dan hasilnya tidak stabil (kadang berhenti di section, kadang melewati tabel). Karena itu `openHistory({ table })` diubah agar section dibuka **tanpa scroll**, sehingga `HistoryTables` menjadi satu-satunya penggulir. Ini menyimpang dari file list prompt (menyentuh `history-nav.ts` dan `CollapsibleSection.tsx`) tetapi tidak mengubah perilaku deep-link jalur maupun anchor lain.

## Verifikasi

| Perintah | Hasil |
|---|---|
| `npm run lint` | Lolos, 0 error; 12 warning lama di `src/Contoh Timeline.tsx` |
| `npm run typecheck` | Lolos, tanpa error |
| `npm run build` | Lolos, 11 route statis |

Uji runtime di dev server, memakai rute sementara yang memanggil `openHistory` sungguhan (rute sudah dihapus):

| Skenario | Hasil |
|---|---|
| `openHistory({ table: "aum" })` dari section tertutup | Section terbuka, tab AUM aktif (`aria-expanded="true"`, `aria-pressed="true"`), tabel "Amal Usaha Muhammadiyah dalam angka" terlihat (`visibility: visible`), `tableTop` 96 px, hash `#sejarah`, tanpa error konsol |
| `openHistory({ table: "leadership" })` saat section terbuka | Tab berpindah ke Kepemimpinan, tabel "Kepemimpinan Pimpinan Pusat Muhammadiyah" terlihat, `tableTop` 96 px, tanpa error |
| Klik manual tab aktif | Tabel tertutup (`tableExists: false`), `aria-expanded`/`aria-pressed` menjadi `false` |
| Klik manual lagi | Tabel terbuka kembali |
| Keyboard (fokus tab + Enter) | Menutup lalu membuka tabel; Tab berpindah ke tombol tabel berikutnya |
| Reduced motion | Jalur kode memakai frame langsung, tanpa menunggu `transitionend` |

Uji stabilitas 3 kali berturut-turut dari section tertutup: `tableTop` konsisten 96 px setelah animasi selesai.

## Catatan integrasi untuk P3

- Gunakan `openHistory({ table: "aum" })` dan `openHistory({ table: "leadership" })` dari hotspot hero; jangan memanggil `scrollToAnchor` sendiri setelahnya.
- Untuk jalur, tetap `openHistory({ track: "dahlan" | "muhammadiyah" })`.
- Jangan menambahkan `Reveal` kembali di sekitar `HistoryTables`; itu membuat tabel tersembunyi saat deep-link.
