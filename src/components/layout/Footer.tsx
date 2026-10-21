import Image from "next/image";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SITE } from "@/data/site";
import type { Dictionary } from "@/i18n/types";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div className="pattern-strip h-2.5 w-full opacity-90" aria-hidden="true" />
      <div className="container-page relative z-10 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.7fr_0.9fr_0.9fr]">
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
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/40">
                {dict.footer.language}
              </p>
              <div className="mt-2">
                <LanguageSwitcher lang={dict.lang} />
              </div>
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

          <div>
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold-light">
              {dict.footer.sources}
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
                  {dict.history.title}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold-light">
              {dict.footer.event}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {dict.footer.eventLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/50">
              {dict.footer.credit}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{dict.footer.copyright}</p>
          <p>{dict.footer.dataNote}</p>
        </div>
      </div>
    </footer>
  );
}
