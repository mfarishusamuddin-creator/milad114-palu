import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div className="pattern-strip h-2.5 w-full opacity-90" aria-hidden="true" />
      <div className="container-page relative z-10 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.7fr_0.9fr_0.9fr]">
          <div>
            <Image
              src="/logo/horizontal-white.png"
              alt="Tanwir dan Milad ke-114 Muhammadiyah"
              width={1600}
              height={900}
              className="h-auto w-[230px]"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              Satu pohon, tiga pintu: Milad, Sejarah, dan Layanan. Dibangun
              sebagai karya independen untuk lomba website.
            </p>
            <p className="mt-5 inline-flex rounded-sm border border-white/15 bg-white/8 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-gold-light">
              {SITE.tagline}
            </p>
          </div>

          <div>
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold-light">
              Jelajahi
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/layanan#kalender" className="footer-link">
                  Kalender KHGT
                </Link>
              </li>
              <li>
                <Link href="/layanan#kuis" className="footer-link">
                  Kuis Milad 114
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold-light">
              Sumber resmi
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={SITE.links.muhammadiyah}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  muhammadiyah.or.id
                </a>
              </li>
              <li>
                <a
                  href={SITE.links.khgt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  khgt.muhammadiyah.or.id
                </a>
              </li>
              <li>
                <a
                  href={SITE.links.edaran}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Edaran 19/2026
                </a>
              </li>
              <li>
                <a
                  href={SITE.links.sejarahSingkat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Sejarah Muhammadiyah
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold-light">
              Milad ke-114
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Palu, {SITE.province}
              <br />
              13â€“15 November 2026
              <br />
              4â€“6 Jumadilakhir 1448 H
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/50">
              Logo dan identitas visual milik PP Muhammadiyah. Font El Messiri
              dan Familjen Grotesk berlisensi OFL.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>آ© 2026 Milad 114 â€” karya independen untuk lomba website.</p>
          <p>
            Data kalender: KHGT. Data kabar: muhammadiyah.or.id. Diverifikasi
            ulang sebelum publikasi.
          </p>
        </div>
      </div>
    </footer>
  );
}

