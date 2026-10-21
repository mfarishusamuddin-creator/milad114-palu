"use client";

import Image from "next/image";
import { useTheme } from "@/components/theme/useTheme";

type Variant = "horizontal" | "logogram";

const SOURCES: Record<Variant, { light: string; dark: string }> = {
  horizontal: {
    light: "/logo/horizontal-color-1921.png",
    dark: "/logo/horizontal-white-1921.png",
  },
  logogram: {
    light: "/logo/logogram-color.png",
    dark: "/logo/logogram-white.png",
  },
};

type Props = {
  variant: Variant;
  width: number;
  height: number;
  alt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
};

export function BrandLogo({
  variant,
  width,
  height,
  alt,
  className,
  sizes,
  preload,
}: Props) {
  const theme = useTheme();
  const src = SOURCES[variant][theme];

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      preload={preload}
    />
  );
}
