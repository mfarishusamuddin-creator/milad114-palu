"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import CardNav from "@/components/shared/CardNav";
import { BrandLogo } from "@/components/theme/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { aboutPath, languagePath } from "@/i18n";
import type { Dictionary } from "@/i18n/types";

export function Navbar({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();

  const items = dict.nav.cards.map((card) => ({
    label: card.label,
    description: card.description,
    links: card.links.map((link) => ({
      label: link.label,
      href: link.about ? aboutPath(dict.lang) : link.anchor,
      ariaLabel: link.label
    }))
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-surface/90 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link
          href={languagePath(dict.lang)}
          className="flex items-center gap-2.5 no-underline"
          aria-label={`${dict.nav.brand} — ${dict.nav.home}`}
        >
          <BrandLogo
            variant="logogram"
            alt=""
            width={40}
            height={40}
            className="h-8 w-8 shrink-0 object-contain md:h-9 md:w-9"
          />
          <span className="navbar-brand whitespace-nowrap font-serif font-bold tracking-tight text-navy">
            {dict.nav.brand}
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle dict={dict} />
          <CardNav
            compact
            key={`${dict.lang}-${pathname}`}
            items={items}
            menuLabel={false}
            menuLabelOpen={dict.nav.menuOpen}
            menuLabelClose={dict.nav.menuClose}
            ariaLabel={dict.nav.menuAria}
            linkComponent={Link}
            compactWidth={680}
            footer={
              <div className="card-nav__footer">
                <a
                  href="#sejarah"
                  className="btn btn-gold btn-sm card-nav__footer-cta"
                >
                  {dict.nav.cta}
                </a>
                <LanguageSwitcher lang={dict.lang} className="card-nav__footer-lang" />
                <Link
                  href={aboutPath(dict.lang)}
                  className="card-nav__footer-link"
                  aria-label={dict.nav.about}
                >
                  {dict.nav.about}
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </header>
  );
}
