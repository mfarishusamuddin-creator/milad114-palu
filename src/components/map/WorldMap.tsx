"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
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

const HQ_FEATURES = ALL_COUNTRIES.features.filter(
  (item) => normalizeIso(item.id) === "360"
);

// Markas Pimpinan Pusat Muhammadiyah — Kauman, Yogyakarta.
const HQ_POINT = { lat: -7.7828, lng: 110.3671 } as const;

function normalizeIso(id: string | number | undefined): string {
  if (id === undefined || id === null) return "";
  const numeric = Number(id);
  if (Number.isFinite(numeric)) return String(numeric).padStart(3, "0");
  return String(id);
}

const VIEW = { width: 900, height: 500 } as const;
const LABEL_EDGE = 70;
const HIT_RADIUS = 18;

function clampX(x: number): number {
  return Math.min(VIEW.width - LABEL_EDGE, Math.max(LABEL_EDGE, x));
}

export function WorldMap({ dict }: { dict: Dictionary }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const projection = geoNaturalEarth1().fitSize(
    [VIEW.width, VIEW.height],
    LAND_FEATURE
  );
  const path = geoPath(projection);

  const hqPoint = projection([HQ_POINT.lng, HQ_POINT.lat]);
  const hqX = hqPoint ? hqPoint[0] : 0;
  const hqY = hqPoint ? hqPoint[1] : 0;

  const activeCountry =
    activeId === null
      ? null
      : pcimCountries.find((country) => country.id === activeId) ?? null;
  const activePoint = activeCountry
    ? projection([activeCountry.lng, activeCountry.lat])
    : null;

  const activate = (id: string): void => setActiveId(id);
  const deactivate = (id: string): void =>
    setActiveId((value) => (value === id ? null : value));

  const handlePointerEnter = (
    event: PointerEvent<SVGGElement>,
    id: string
  ): void => activate(id);

  const handlePointerLeave = (
    event: PointerEvent<SVGGElement>,
    id: string
  ): void => {
    if (event.pointerType === "mouse") deactivate(id);
  };

  const handleKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    id: string
  ): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      activate(id);
    }
  };

  const markerProps = (id: string) => ({
    role: "button" as const,
    tabIndex: 0,
    onPointerEnter: (event: PointerEvent<SVGGElement>) =>
      handlePointerEnter(event, id),
    onPointerLeave: (event: PointerEvent<SVGGElement>) =>
      handlePointerLeave(event, id),
    onFocus: () => activate(id),
    onBlur: () => deactivate(id),
    onClick: (event: React.MouseEvent<SVGGElement>) => {
      event.stopPropagation();
      activate(id);
    },
    onKeyDown: (event: KeyboardEvent<SVGGElement>) =>
      handleKeyDown(event, id)
  });

  return (
    <div className="map-fullbleed relative overflow-visible border-y border-line bg-bg-soft p-2 sm:p-4">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        className="map-svg h-auto w-full"
        role="group"
        aria-label={dict.map.aria}
        onClick={() => setActiveId(null)}
      >
        <path
          d={path(LAND_FEATURE) ?? undefined}
          className="map-land"
          aria-hidden="true"
          pointerEvents="none"
        />
        <g>
          {PCIM_FEATURES.map((item, index) => (
            <path
              key={`${normalizeIso(item.id)}-${index}`}
              d={path(item) ?? undefined}
              className="map-country--pcim"
              pointerEvents="none"
            />
          ))}
          {HQ_FEATURES.map((item, index) => (
            <path
              key={`hq-${index}`}
              d={path(item) ?? undefined}
              className="map-country--hq"
              pointerEvents="none"
            />
          ))}
        </g>

        <g>
          {pcimCountries.map((country) => {
            const point = projection([country.lng, country.lat]);
            if (!point) return null;
            const [x, y] = point;
            const isActive = activeId === country.id;
            return (
              <g
                key={country.id}
                className={
                  isActive ? "map-marker map-marker--active" : "map-marker"
                }
                aria-label={`${country.country[dict.lang]} — ${dict.map.countries}`}
                {...markerProps(country.id)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={HIT_RADIUS}
                  fill="transparent"
                  pointerEvents="all"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 11 : 8}
                  className="map-marker-halo"
                  pointerEvents="none"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 4 : 3}
                  className="map-marker-dot"
                  pointerEvents="none"
                />
                <title>{country.country[dict.lang]}</title>
              </g>
            );
          })}

          {hqPoint && (
            <g
              className={`map-marker map-marker--hq${
                activeId === "hq" ? " map-marker--active" : ""
              }`}
              aria-label={`${dict.map.hq} — ${dict.map.countries}`}
              {...markerProps("hq")}
            >
              <circle
                cx={hqX}
                cy={hqY}
                r={HIT_RADIUS}
                fill="transparent"
                pointerEvents="all"
              />
              <circle
                cx={hqX}
                cy={hqY}
                r={activeId === "hq" ? 12 : 9}
                className="map-marker-halo"
                pointerEvents="none"
              />
              <circle
                cx={hqX}
                cy={hqY}
                r={activeId === "hq" ? 5 : 4.2}
                className="map-marker-dot"
                pointerEvents="none"
              />
              <circle
                cx={hqX}
                cy={hqY}
                r="1.8"
                className="map-marker-core"
                pointerEvents="none"
              />
              <title>{dict.map.hq}</title>
            </g>
          )}
        </g>

        <g aria-hidden="true">
          {activePoint && activeCountry && (
            <text
              className="map-label map-label--active"
              x={clampX(activePoint[0])}
              y={Math.max(20, activePoint[1] - 16)}
              textAnchor="middle"
            >
              <tspan>{activeCountry.country[dict.lang]}</tspan>
            </text>
          )}
          {activeId === "hq" && hqPoint && (
            <text
              className="map-label map-label--hq"
              x={clampX(hqX)}
              y={Math.min(VIEW.height - 12, hqY + 24)}
              textAnchor="middle"
            >
              <tspan>{dict.map.hq}</tspan>
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
