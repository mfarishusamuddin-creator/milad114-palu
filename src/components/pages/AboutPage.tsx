import Image from "next/image";
import Link from "next/link";
import { CreditsSection } from "@/components/about/CreditsSection";
import { SiteShell } from "@/components/pages/SiteShell";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { credits } from "@/data/credits";
import { SITE } from "@/data/site";
import { languagePath } from "@/i18n";
import type { Dictionary } from "@/i18n/types";

const ARTWORK = {
  src: "/media/hero/hero-artwork-hi.webp",
  width: 2063,
  height: 2952,
  name: "KH. Ahmad Dahlan",
} as const;

const WORLD_ATLAS_URL = "https://github.com/topojson/world-atlas";

const painter = credits.find((credit) => credit.id === "painter");

export function AboutPage({ dict }: { dict: Dictionary }) {
  const t = dict.aboutPage;

  const artworkJsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: ARTWORK.name,
    creator: {
      "@type": "Person",
      name: painter?.name.id,
      sameAs: painter?.links
        .filter((link) => link.kind === "instagram" || link.kind === "facebook")
        .map((link) => link.href),
    },
    dateCreated: t.artwork.year,
    size: t.artwork.size,
    image: `${SITE.url}${ARTWORK.src}`,
    inLanguage: dict.lang,
  };

  const licenseRows = [
    {
      label: t.assets.elMessiri,
      note: t.assets.fontLicense,
      href: "/licenses/OFL-ElMessiri.txt",
    },
    {
      label: t.assets.familjenGrotesk,
      note: t.assets.fontLicense,
      href: "/licenses/OFL-FamiljenGrotesk.txt",
    },
    {
      label: t.assets.worldMap,
      note: t.assets.mapLicense,
      href: WORLD_ATLAS_URL,
    },
  ];

  return (
    <SiteShell dict={dict}>
      <section className="section">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(artworkJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <div className="container-page">
          <Link href={languagePath(dict.lang)} className="about-back">
            <BackArrow />
            {t.back}
          </Link>

          <SectionHeading
            title={t.title}
            description={t.intro}
            className="mt-8"
          />

          <p className="mt-6 max-w-2xl rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm leading-relaxed text-ink-soft sm:text-[0.95rem]">
            {t.disclaimer}
          </p>

          <CreditsSection dict={dict} />

          <div className="mt-14">
            <AboutSectionTitle>{t.artwork.title}</AboutSectionTitle>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <Image
                src={ARTWORK.src}
                alt={t.artwork.alt}
                width={ARTWORK.width}
                height={ARTWORK.height}
                sizes="(max-width: 639px) 112px, 144px"
                loading="lazy"
                className="h-28 w-auto flex-none rounded-md border border-line object-contain sm:h-36"
              />

              <div className="min-w-0">
                <h3 className="font-serif text-xl font-bold text-ink">
                  {t.artwork.name}
                </h3>

                <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-ink-soft">{t.artwork.sizeLabel}</dt>
                    <dd className="font-semibold text-ink">
                      {t.artwork.size}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-ink-soft">{t.artwork.yearLabel}</dt>
                    <dd className="font-semibold text-ink">
                      {t.artwork.year}
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 text-[0.8rem] text-ink-soft">
                  {t.artwork.credit}
                </p>

                <Link
                  href={languagePath(dict.lang)}
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-navy underline decoration-gold/60 decoration-2 underline-offset-4 transition-colors hover:text-ocean"
                >
                  {t.artwork.view}
                  <ForwardArrow />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <AboutSectionTitle>{t.sourcesTitle}</AboutSectionTitle>
            <ul className="mt-5 grid border-t border-line gap-x-12 sm:grid-cols-2">
              {t.sources.map((source) => (
                <li key={source.label}>
                  <a
                    href={SITE.links[source.link]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${source.label}, ${t.opensInNewTab}`}
                    className="flex min-h-11 items-center justify-between gap-4 border-b border-line py-3 text-sm text-ink no-underline transition-colors hover:text-navy"
                  >
                    <span>{source.label}</span>
                    <ExternalIcon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14">
            <AboutSectionTitle>{t.assets.title}</AboutSectionTitle>
            <ul className="mt-5 grid border-t border-line gap-x-12 sm:grid-cols-2">
              {licenseRows.map((row) => (
                <li key={row.href}>
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${row.label}, ${row.note}, ${t.opensInNewTab}`}
                    className="flex min-h-11 items-center justify-between gap-4 border-b border-line py-3 text-sm text-ink no-underline transition-colors hover:text-navy"
                  >
                    <span className="flex min-w-0 flex-col">
                      <span>{row.label}</span>
                      <span className="text-[0.78rem] text-ink-soft">
                        {row.note}
                      </span>
                    </span>
                    <ExternalIcon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-16 border-t border-line pt-6 text-center font-serif text-sm font-semibold text-ink-soft">
            {t.copyright}
          </p>
        </div>
      </section>
    </SiteShell>
  );
}

function AboutSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ocean">
      {children}
    </h2>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none text-gold-text"
    >
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

function ForwardArrow() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none rtl:rotate-180"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none rtl:rotate-180"
    >
      <path d="M5 12h14M11 6l-6 6 6 6" />
    </svg>
  );
}
