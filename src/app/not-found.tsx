import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-bg-soft">
      <div
        className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-page relative z-10 flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          Halaman tidak ditemukan
        </p>
        <p className="mt-4 font-serif text-7xl font-bold text-navy sm:text-8xl">
          404
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-ink">
          Pintu ini belum ada di pohon.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          Kembali ke beranda, jelajahi jejak 114 tahun, atau buka layanan
          Muhammadiyah.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary no-underline">
            Kembali ke Milad
          </Link>
          <Link href="/sejarah" className="btn btn-ghost no-underline">
            Jejak 114 Tahun
          </Link>
          <Link href="/layanan" className="btn btn-ghost no-underline">
            Layanan
          </Link>
        </div>
      </div>
    </section>
  );
}
