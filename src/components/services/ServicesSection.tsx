import { Reveal } from "@/components/animation/Reveal";
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";
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
    <CollapsibleSection
      id="layanan"
      title={dict.services.title}
      description={dict.services.description}
    >
      <Reveal stagger={0.06}>
        <div className="mb-5">
          <h3 className="font-serif text-2xl font-bold text-ink">
            {dict.services.calendarTitle}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
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
              className="text-xs font-bold text-ocean underline"
            >
              {dict.services.highlightsLink}
            </a>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dict.highlights.map((item) => (
              <li
                key={`${item.date}-${item.title}`}
                className="rounded-sm border border-line bg-bg-soft/60 px-3 py-3"
              >
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-gold-text">
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
        className="mt-14 scroll-mt-24 border-t border-line pt-8"
        id="kabar"
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
    </CollapsibleSection>
  );
}
