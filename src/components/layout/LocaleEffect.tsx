"use client";

import { useEffect } from "react";
import type { Direction, LanguageCode } from "@/i18n/types";

export function LocaleEffect({
  lang,
  dir,
}: {
  lang: LanguageCode;
  dir: Direction;
}) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return null;
}
