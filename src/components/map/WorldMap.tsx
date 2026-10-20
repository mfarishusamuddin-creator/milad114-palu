import { geoNaturalEarth1, geoPath } from "d3-geo";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countriesTopo from "world-atlas/countries-110m.json";
import landTopo from "world-atlas/land-110m.json";
import { pcimCountries } from "@/data/pcim";
import type { Dictionary } from "@/i18n/types";

const COUNTRIES = countriesTopo as unknown as Topology<{
  countries: GeometryCollection<{ name: string }>;
}>;

const LAND = landTopo as unknown as Topology<{
  land: GeometryCollection;
}>;

const ALL_COUNTRIES = feature(
  COUNTRIES,
  COUNTRIES.objects.countries
) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;

const LAND_FEATURE = feature(
  LAND,
  LAND.objects.land
) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;

const PCIM_ISO = new Set(
  pcimCountries.map((country) => country.iso.padStart(3, "0"))
);

const PCIM_FEATURES = ALL_COUNTRIES.features.filter((item) =>
  PCIM_ISO.has(normalizeIso(item.id))
);

function normalizeIso(id: string | number | undefined): string {
  if (id === undefined || id === null) return "";
  const numeric = Number(id);
  if (Number.isFinite(numeric)) return String(numeric).padStart(3, "0");
  return String(id);
}

export function WorldMap({ dict }: { dict: Dictionary }) {
  const projection = geoNaturalEarth1().fitSize([900, 500], LAND_FEATURE);
  const path = geoPath(projection);

  return (
    <div className="relative overflow-hidden rounded-sm border border-line bg-bg-soft p-2 sm:p-3">
      <svg
        viewBox="0 0 900 500"
        className="h-auto w-full"
        role="img"
        aria-label={dict.map.aria}
      >
        <g>
          <path
            d={path(LAND_FEATURE) ?? undefined}
            className="map-land"
            aria-hidden="true"
          />
          {PCIM_FEATURES.map((item, index) => {
            const iso = normalizeIso(item.id);
            const pcim = pcimCountries.find((country) => country.iso === iso);
            return (
              <path
                key={`${iso}-${index}`}
                d={path(item) ?? undefined}
                className="map-country--pcim"
              >
                <title>
                  {pcim
                    ? `${pcim.country[dict.lang]} — ${pcim.city[dict.lang]}`
                    : item.properties?.name as string | undefined}
                </title>
              </path>
            );
          })}
        </g>

        <g>
          {pcimCountries.map((country) => {
            const point = projection([country.lng, country.lat]);
            if (!point) return null;
            const [x, y] = point;
            const label = `${country.country[dict.lang]} — ${country.city[dict.lang]}`;
            return (
              <g key={country.id} className="map-marker">
                <circle cx={x} cy={y} r="8" className="map-marker-halo" />
                <circle cx={x} cy={y} r="3" className="map-marker-dot" />
                <title>{label}</title>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 rounded-sm border border-line bg-surface/90 px-2.5 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-teal-deep backdrop-blur">
        {dict.map.count}
      </div>
    </div>
  );
}
