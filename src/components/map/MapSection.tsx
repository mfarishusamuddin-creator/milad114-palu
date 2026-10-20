import { WorldMap } from "@/components/map/WorldMap";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceNote } from "@/components/shared/SourceNote";
import { pcimCountries, type PcimRegion } from "@/data/pcim";
import type { Dictionary } from "@/i18n/types";

const REGION_ORDER: PcimRegion[] = [
  "africa",
  "asia",
  "europe",
  "americas",
  "oceania",
];

export function MapSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="section scroll-mt-20 bg-bg-soft" id="peta">
      <div className="container-page">
        <div data-reveal>
          <SectionHeading
            eyebrow={dict.map.eyebrow}
            title={dict.map.title}
            description={dict.map.description}
          />
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div data-reveal>
            <WorldMap dict={dict} />
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              {dict.map.note}
            </p>
          </div>

          <div
            className="rounded-sm border border-line bg-surface p-5 sm:p-6 lg:max-h-[560px] lg:overflow-y-auto"
            data-reveal
          >
            <h3 className="font-serif text-xl font-bold text-ink">
              {dict.map.countryList}
            </h3>
            <div className="mt-4 space-y-5">
              {REGION_ORDER.map((region) => {
                const countries = pcimCountries.filter(
                  (country) => country.region === region
                );
                if (countries.length === 0) return null;
                return (
                  <div key={region}>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-gold-text">
                      {dict.map.regions[region]}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {countries.map((country) => (
                        <li
                          key={country.id}
                          className="flex items-baseline justify-between gap-3 border-b border-line/70 pb-1.5 text-xs"
                        >
                          <span className="font-semibold text-ink">
                            {country.country[dict.lang]}
                          </span>
                          <span className="text-right text-ink-soft">
                            {country.city[dict.lang]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <SourceNote
          className="mt-6"
          items={[
            {
              label: "Natural Earth",
              url: "https://www.naturalearthdata.com/",
            },
            {
              label: "world-atlas",
              url: "https://github.com/topojson/world-atlas",
            },
          ]}
        />
      </div>
    </section>
  );
}
