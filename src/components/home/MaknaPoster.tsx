"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/components/theme/useTheme";

const NARROW_MEDIA = "(max-width: 767px)";

/**
 * Poster tanwir/Milad untuk section Makna Logo:
 * horizontal (desktop) atau vertical (mobile), versi terang/gelap sesuai tema.
 */
export function MaknaPoster({ alt }: { alt: string }) {
  const theme = useTheme();
  const [narrow, setNarrow] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(NARROW_MEDIA).matches;
  });

  useEffect(() => {
    const query = window.matchMedia(NARROW_MEDIA);
    const listener = (event: MediaQueryListEvent): void =>
      setNarrow(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  const orientation = narrow ? "vertical" : "horizontal";
  const variant = theme === "dark" ? "dark" : "light";
  const src = `/media/intro/${orientation}-${variant}.jpg`;
  const isVertical = narrow;

  return (
    <div className="makna-poster">
      <Image
        src={src}
        alt={alt}
        width={isVertical ? 1242 : 3124}
        height={isVertical ? 1596 : 1440}
        sizes={isVertical ? "92vw" : "(max-width: 1024px) 0px, 44vw"}
        priority={false}
        className="makna-poster__image"
      />
    </div>
  );
}
