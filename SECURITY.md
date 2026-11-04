# Keamanan

Situs ini adalah situs statis (tanpa login, database, API publik, atau form
yang dikirim ke server). Hardening difokuskan pada header respons, penanganan
data eksternal, dan kebersihan dependensi.

## Kontrol yang diterapkan

### Header respons — `next.config.ts`

Berlaku untuk semua rute (`source: "/(.*)"`):

| Header | Nilai | Tujuan |
|---|---|---|
| `Content-Security-Policy` | lihat di bawah | Membatasi sumber skrip/gambar/font/frame |
| `X-Content-Type-Options` | `nosniff` | Mencegah MIME sniffing |
| `X-Frame-Options` | `DENY` | Anti clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Membatasi kebocoran URL |
| `Permissions-Policy` | kamera/mikrofon/lokasi/pembayaran/USB/topics dimatikan | Menutup API perangkat |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Memaksa HTTPS |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolasi browsing context |
| `Cross-Origin-Resource-Policy` | `same-origin` | Aset tidak bisa ditanam lintas origin |
| `Origin-Agent-Cluster` | `?1` | Isolasi agent cluster |
| `X-Permitted-Cross-Domain-Policies` | `none` | Menolak kebijakan lintas domain Flash/PDF |

CSP:

```text
default-src 'self';
script-src 'self' 'unsafe-inline' <'unsafe-eval' hanya development>;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self' data:;
media-src 'self';
object-src 'none';
frame-src 'none';
worker-src 'self' blob:;
manifest-src 'self';
connect-src 'self' <ws: wss: hanya development>;
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests (hanya saat berjalan di Vercel);
```

`'unsafe-inline'` masih diperlukan karena Next.js menyisipkan skrip bootstrap
hydration inline dan `layout.tsx` memasang skrip kecil penentu tema sebelum
render. `'unsafe-eval'` hanya aktif di `NODE_ENV=development`.

Alternatif CSP ketat berbasis nonce memerlukan `proxy.ts` dan **dynamic
rendering** (lihat `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`),
sehingga mematikan cache statis/CDN. Untuk situs statis ini trade-off tersebut
tidak diambil; CSP tetap memblokir sumber skrip eksternal dan pembingkaian.

### Konfigurasi Next.js

- `poweredByHeader: false` — `X-Powered-By` tidak dikirim.
- `reactStrictMode: true`.

### Data eksternal (Kabar Muhammadiyah)

`src/lib/kabar.ts` memperlakukan respons WP REST API sebagai input tak
tepercaya:

- Tautan hanya diterima bila `https:` dan host `muhammadiyah.or.id` (atau
  subdomainnya) — mencegah `javascript:`/open redirect.
- Tanggal harus ISO 8601 valid; item tanpa tanggal/judul/tautan aman dibuang.
- Judul dibatasi 200 karakter, kutipan 180 karakter.
- Respons wajib `application/json`, `Content-Length` maksimum 512 KB, dan
  berupa larik; maksimum 8 item.
- Decode entitas HTML dibatasi ke rentang Unicode valid (tidak melempar
  `RangeError` karena entitas jahat).
- Kegagalan apa pun jatuh ke snapshot `src/data/kabar-fallback.json`.

`scripts/sync-kabar.mjs` memakai validasi yang sama saat membuat snapshot.

### Markup dan tautan

- JSON-LD di-escape (`<` → `\u003c`) sebelum `dangerouslySetInnerHTML`.
- Skrip tema inline bersifat statis (tanpa input pengguna).
- Semua tautan `target="_blank"` memakai `rel="noopener noreferrer"`.
- Teks Kabar dirender sebagai teks (HTML dari API sudah dilucuti).

### Deterrent inspect/download — `src/components/security/ContentGuard.tsx`

Lapisan ini hanya **mempersulit**, bukan mencegah. Situs statis selalu bisa
diperiksa atau diunduh oleh pengguna yang bertekad (menu browser, JavaScript
dimatikan, atau permintaan jaringan langsung).

Yang dilakukan:

- Menu konteks (klik kanan/long-press) diblokir, kecuali pada `input`,
  `textarea`, `select`, dan elemen `contenteditable`.
- Pintasan DevTools diblokir: `F12`, `Ctrl/Cmd+Shift+I/J/C/K/E/M`.
- Pintasan simpan/cetak/sumber diblokir: `Ctrl/Cmd+S`, `Ctrl/Cmd+P`,
  `Ctrl/Cmd+U`.
- Gambar, video, dan kanvas tidak bisa diseret; klik tengah pada media tidak
  membuka tab baru; long-press callout iOS dimatikan lewat CSS.
- Teks tetap bisa dipilih dan disalin; kolom isian tetap bisa memakai menu
  konteks.

Yang **tidak** bisa dijamin: penyimpanan gambar lewat menu browser, unduhan
langsung URL aset, pembacaan HTML/CSS/JS dari jaringan, atau DevTools yang
dibuka lewat menu. Untuk materi yang benar-benar sensitif, lindungi di sisi
server/akses, bukan dengan JavaScript klien.

### Data dan rahasia

- Tidak ada autentikasi, database, cookie sesi, atau form yang dikirim ke
  server. `localStorage` hanya menyimpan preferensi tema.
- `.gitignore` mengabaikan `.env*`, `*.pem`, dan artefak build.
- Tidak ada kredensial/API key di repositori.

### Dependensi

- `npm audit --omit=dev` → **0 kerentanan** pada dependensi produksi.
- `npm audit` penuh melaporkan 16 kerentanan **moderate** pada `minimatch`
  yang hanya dipakai tooling ESLint (bukan runtime, tidak ikut ter-deploy).
  Perbaikannya menuntut downgrade ESLint yang merusak; dipantau dan tidak
  diberlakukan paksa.

## Verifikasi

```bash
# Header produksi (setelah deploy / next start)
curl -I https://milad114-palu.vercel.app/

# Dependensi
npm audit --omit=dev
```

Yang perlu terlihat: `content-security-policy`, `x-content-type-options`,
`x-frame-options`, `referrer-policy`, `permissions-policy`,
`strict-transport-security`; dan **tidak ada** `x-powered-by`.

## Rekomendasi lanjutan

1. Perbarui dependensi secara berkala (`npm outdated`, `npm audit`).
2. Bila situs kelak menerima input pengguna atau menambah analytics, tinjau
   ulang CSP dan pertimbangkan CSP berbasis nonce + reporting.
3. Aktifkan perlindungan deployment Vercel (Deployment Protection) bila
   pratinjau tidak boleh publik.
4. Laporkan dugaan masalah keamanan secara privat ke pemelihara situs, bukan
   melalui issue publik.
