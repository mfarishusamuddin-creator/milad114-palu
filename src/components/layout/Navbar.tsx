"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { BrandLogo } from "@/components/theme/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { languagePath } from "@/i18n";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";

export function Navbar({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-surface/90 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href={languagePath(dict.lang)}
          className="flex items-center gap-2.5 no-underline"
          aria-label={`${dict.meta.tagline} — home`}
        >
          <BrandLogo
            variant="logogram"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
          />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.05rem] font-bold tracking-tight text-navy">
              Milad 114
            </span>
            <span className="mt-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-ink-soft">
              Muhammadiyah
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {dict.nav.links.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher lang={dict.lang} />
          <ThemeToggle dict={dict} />
          <a href="#sejarah" className="btn btn-gold btn-sm">
            {dict.nav.cta}
            <ArrowIcon />
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line bg-surface text-navy lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? dict.nav.menuClose : dict.nav.menuOpen}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        id="menu-mobile"
        className={cn(
          "border-t border-line bg-surface lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav
          aria-label="Mobile"
          className="container-page flex flex-col gap-1 py-4"
        >
          {dict.nav.links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-3 text-sm font-semibold text-ink-soft no-underline hover:bg-bg-soft hover:text-navy"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 flex items-center justify-between gap-3">
            <LanguageSwitcher lang={dict.lang} large />
            <ThemeToggle dict={dict} />
          </div>
          <a
            href="#sejarah"
            className="btn btn-gold mt-2"
            onClick={() => setOpen(false)}
          >
            {dict.nav.cta}
            <ArrowIcon />
          </a>
        </nav>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="rtl:rotate-180"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
