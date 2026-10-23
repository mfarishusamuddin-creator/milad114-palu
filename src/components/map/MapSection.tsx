import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { WorldMap } from "@/components/map/WorldMap";
import CountUp from "@/components/shared/CountUp";
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";
import { aboutPath } from "@/i18n";
import type { Dictionary } from "@/i18n/types";

export function MapSection({ dict }: { dict: Dictionary }) {
  return (
    <CollapsibleSection
      id="peta"
      title={dict.map.title}
      description={dict.map.description}
      className="bg-bg-soft"
    >
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
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

      <Reveal className="map-breakout mt-4">
        <WorldMap dict={dict} />
      </Reveal>

      <p className="mt-4 text-xs leading-relaxed text-ink-soft">
        {dict.map.note}
      </p>
    </CollapsibleSection>
  );
}
