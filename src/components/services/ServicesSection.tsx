import { Reveal } from "@/components/animation/Reveal";
import GradientText from "@/components/shared/GradientText";
import { HijriCalendar } from "@/components/services/HijriCalendar";
import { KabarTabs } from "@/components/services/KabarTabs";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SITE } from "@/data/site";
import type { Dictionary } from "@/i18n/types";
import type { KabarItem } from "@/lib/kabar";
import { khgtSnapshot } from "@/lib/khgt";

function formatHighlightDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

/**
 * Layanan selalu terbuka: section statis (bukan CollapsibleSection) agar
 * kalender dan Kabar langsung tampak, dengan judul sebesar section lain.
 * #kabar tetap berfungsi sebagai anchor di dalam #layanan.
 */
export function ServicesSection({
  dict,
  latest,
  milad,
}: {
  dict: Dictionary;
  latest: KabarItem[];
  milad: KabarItem[];
}) {
  return (
    <section id="layanan" className="section scroll-mt-24 bg-bg-soft">
      <div className="container-page">
        <h2 className="section-title text-ink">
          <GradientText block start animationSpeed={13}>
            {dict.services.title}
          </GradientText>
        </h2>

        <Reveal stagger={0.06} className="mt-8 sm:mt-10">
          <div className="mb-5">
            <h3 className="font-serif text-2xl font-bold text-ink">
              {dict.services.calendarTitle}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-[0.95rem]">
              {dict.services.calendarDescription}
            </p>
          </div>
          <HijriCalendar data={khgtSnapshot} dict={dict.calendar} />

          <div className="mt-6 rounded-sm border border-line bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-serif text-xl font-bold text-ink">
                {dict.services.highlightsTitle}
              </h4>
              <a
                href={SITE.links.khgt}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 text-xs font-bold text-ocean underline"
              >
                {dict.services.highlightsLink}
              </a>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {dict.highlights.map((item) => (
                <li
                  key={`${item.date}-${item.title}`}
                  className="rounded-sm border border-line bg-surface px-3 py-3"
                >
                  <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-gold-text">
                    {formatHighlightDate(item.date, dict.locale)}
                  </p>
                  <p className="mt-1 font-serif text-base font-bold text-ink">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                    {item.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div
          id="kabar"
          className="mt-14 scroll-mt-24 border-t border-line pt-8 sm:pt-10"
        >
          <Reveal>
            <SectionHeading
              title={dict.services.kabarTitle}
              description={dict.services.kabarDescription}
            />
            <div className="mt-7">
              <KabarTabs latest={latest} milad={milad} dict={dict} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
