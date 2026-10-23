"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import CardNav from "@/components/shared/CardNav";
import { BrandLogo } from "@/components/theme/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { aboutPath, languagePath } from "@/i18n";
import type { Dictionary } from "@/i18n/types";
import type { MouseEvent } from "react";

export function Navbar({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();

  const handleCardNavLink = (
    href: string | undefined,
    event: MouseEvent<HTMLElement>
  ): void => {
    if (!href?.startsWith("#")) return;
    const targetId = decodeURIComponent(href.slice(1));
    if (!targetId) return;
    event.preventDefault();
    window.history.pushState(null, "", href);
    window.dispatchEvent(
      new CustomEvent("site:anchor-navigation", { detail: { targetId } })
    );
  };

  const items = dict.nav.cards.map((card, index) => ({
    label: card.label,
    description: card.description,
    links: card.links.map((link) => ({
      label: link.label,
      href: link.about ? aboutPath(dict.lang) : link.anchor,
      ariaLabel: link.label
    })),
    content:
      index === dict.nav.cards.length - 1 ? (
        <PengaturanContent dict={dict} />
      ) : undefined
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-surface/90 backdrop-blur-xl">
      <div className="container-page flex min-h-14 items-center justify-between gap-3 py-2">
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
            className="h-0 w-0 shrink-0 object-contain md:h-0 md:w-0"
          />
          <span className="navbar-brand whitespace-nowrap font-serif font-bold tracking-tight text-navy">
            {dict.nav.brand}
          </span>
        </Link>

        <CardNav
          compact
          key={`${dict.lang}-${pathname}`}
          items={items}
          menuLabel={false}
          menuLabelOpen={dict.nav.menuOpen}
          menuLabelClose={dict.nav.menuClose}
          ariaLabel={dict.nav.menuAria}
          linkComponent={Link}
          compactWidth={720}
          onLinkClick={(link, _item, event) =>
            handleCardNavLink(link.href, event)
          }
        />
      </div>
    </header>
  );
}

function PengaturanContent({ dict }: { dict: Dictionary }) {
  return (
    <>
      <LanguageSwitcher lang={dict.lang} className="w-full" />
      <ThemeToggle dict={dict} />
      <Link
        href={aboutPath(dict.lang)}
        className="card-nav__footer-link"
        aria-label={dict.nav.about}
      >
        {dict.nav.about}
      </Link>
    </>
  );
}
