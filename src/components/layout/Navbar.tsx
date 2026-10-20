"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/data/site";
import { cn } from "@/lib/cn";

const VISITED_KEYS: Record<string, string> = {
  "/": "m114:kanopi",
  "/sejarah": "m114:akar",
  "/layanan": "m114:batang",
};

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = VISITED_KEYS[pathname];
    if (!key) return;
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      // localStorage can be unavailable in private contexts.
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline"
          aria-label={`${SITE.name} — beranda`}
        >
          <Image
            src="/logo/logogram-color.png"
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

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 md:flex"
        >
          {SITE.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                data-active={active ? "true" : "false"}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/layanan#kabar" className="btn btn-ghost btn-sm">
            Kabar
          </Link>
          <Link href="/sejarah" className="btn btn-gold btn-sm">
            Jelajahi Jejak
            <ArrowIcon />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        id="menu-mobile"
        className={cn(
          "border-t border-line bg-white md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav
          aria-label="Navigasi seluler"
          className="container-page flex flex-col gap-1 py-4"
        >
          {SITE.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-semibold no-underline",
                  active
                    ? "bg-bg-soft text-navy"
                    : "text-ink-soft hover:bg-bg-soft hover:text-navy"
                )}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/layanan#kabar"
              className="btn btn-ghost btn-sm"
              onClick={() => setOpen(false)}
            >
              Kabar
            </Link>
            <Link
              href="/sejarah"
              className="btn btn-gold btn-sm"
              onClick={() => setOpen(false)}
            >
              Jejak 114
            </Link>
          </div>
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
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
