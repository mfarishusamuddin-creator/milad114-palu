import Link from "next/link";
import { SiteShell } from "@/components/pages/SiteShell";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SITE } from "@/data/site";
import { languagePath } from "@/i18n";
import type { Dictionary } from "@/i18n/types";

export function AboutPage({ dict }: { dict: Dictionary }) {
  return (
    <SiteShell dict={dict}>
      <section className="section">
        <div className="container-page">
          <Link href={languagePath(dict.lang)} className="about-back">
            <BackArrow />
            {dict.aboutPage.back}
          </Link>

          <SectionHeading
            title={dict.aboutPage.title}
            description={dict.aboutPage.intro}
            className="mt-8"
          />

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-[0.95rem]">
            {dict.aboutPage.disclaimer}
          </p>

          <div className="mt-14">
            <AboutSectionTitle>{dict.aboutPage.sourcesTitle}</AboutSectionTitle>
            <ul className="mt-5 grid border-t border-line gap-x-12 sm:grid-cols-2">
              {dict.aboutPage.sources.map((source) => (
                <li key={source.label}>
                  <a
                    href={SITE.links[source.link]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center justify-between gap-4 border-b border-line py-3 text-sm text-ink no-underline transition-colors hover:text-navy"
                  >
                    <span>{source.label}</span>
                    <ExternalIcon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-16 border-t border-line pt-6 text-center font-serif text-sm font-semibold text-ink-soft">
            {dict.aboutPage.copyright}
          </p>
        </div>
      </section>
    </SiteShell>
  );
}

function AboutSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-ocean">
      {children}
    </h2>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
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
