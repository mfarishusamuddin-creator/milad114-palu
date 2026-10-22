import Image from "next/image";
import Link from "next/link";
import { aboutPath } from "@/i18n";
import type { Dictionary } from "@/i18n/types";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div className="container-page relative z-10 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo/logogram-white.png"
                alt=""
                width={512}
                height={512}
                className="h-12 w-12 object-contain"
              />
              <div>
                <p className="font-serif text-xl font-bold text-white">
                  Milad 114
                </p>
                <p className="mt-0.5 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/50">
                  Muhammadiyah
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              {dict.footer.tagline}
            </p>
            <div className="mt-5">
              <Link
                href={aboutPath(dict.lang)}
                className="inline-flex items-center gap-2 underline decoration-gold/60 decoration-2 underline-offset-4 text-sm font-semibold text-gold-light transition-colors hover:text-white"
              >
                {dict.nav.about}
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold-light">
              {dict.footer.explore}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {dict.nav.links.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="footer-link">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#kabar" className="footer-link">
                  {dict.kabar.title}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
