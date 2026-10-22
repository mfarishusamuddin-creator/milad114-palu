import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { WorldMap } from "@/components/map/WorldMap";
import CountUp from "@/components/shared/CountUp";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { aboutPath } from "@/i18n";
import type { Dictionary } from "@/i18n/types";

export function MapSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="section scroll-mt-20 bg-bg-soft" id="peta">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={dict.map.eyebrow}
            title={dict.map.title}
            description={dict.map.description}
          />
        </Reveal>

        <Reveal className="mt-7 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <CountUp
              from={0}
              to={29}
              duration={1.6}
              easing="easeOut"
              trigger="view"
              separator=""
              className="map-stat-value"
            />
            <span className="map-stat-label">{dict.map.countries}</span>
          </div>

          <Link
            href={aboutPath(dict.lang)}
            className="map-info-button"
            aria-label={dict.map.info}
            title={dict.map.info}
          >
            <span aria-hidden="true">i</span>
          </Link>
        </Reveal>
      </div>

      <Reveal>
        <WorldMap dict={dict} />
      </Reveal>

      <div className="container-page">
        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          {dict.map.note}
        </p>
      </div>
    </section>
  );
}
