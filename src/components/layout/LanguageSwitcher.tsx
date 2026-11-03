"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import GlideSelect from "@/components/shared/GlideSelect";
import { aboutPath, isLanguage, languagePath } from "@/i18n";
import type { LanguageCode } from "@/i18n/types";
import { cn } from "@/lib/cn";

const LANGUAGES: Array<{
  code: LanguageCode;
  short: string;
  name: string;
}> = [
  { code: "id", short: "ID", name: "Indonesia" },
  { code: "en", short: "EN", name: "English" },
  { code: "ar", short: "AR", name: "العربية" },
];

type Props = {
  lang: LanguageCode;
  className?: string;
  large?: boolean;
  ariaLabel?: string;
};

export function LanguageSwitcher({
  lang,
  className,
  large = false,
  ariaLabel = "Language",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(lang);
  const [prevLang, setPrevLang] = useState(lang);

  if (prevLang !== lang) {
    setPrevLang(lang);
    setValue(lang);
  }

  const targetPath = (next: LanguageCode): string => {
    const current = (pathname || "/").replace(/\/+$/, "") || "/";
    const isAbout =
      current === "/tentang" ||
      current === "/en/tentang" ||
      current === "/ar/tentang";

    if (isAbout) return aboutPath(next);

    const base = languagePath(next);
    if (typeof window !== "undefined" && window.location.hash) {
      return `${base}${window.location.hash}`;
    }
    return base;
  };

  return (
    <div dir="ltr" className={cn("language-glide", className)}>
      <GlideSelect
        value={value}
        options={LANGUAGES.map((item) => ({
          value: item.code,
          label: item.short,
          tag: item.name,
        }))}
        onChange={(next) => {
          if (!isLanguage(next)) return;
          setValue(next);
          if (next !== lang) router.push(targetPath(next));
        }}
        ariaLabel={ariaLabel}
        size={large ? "md" : "sm"}
        accentColor="var(--color-gold)"
        surfaceColor="var(--color-surface)"
        highlightColor="var(--color-bg-soft)"
        textColor="var(--color-ink)"
        menuWidth={188}
        align="left"
        placement="bottom"
        rememberPosition
        showTags
      />
    </div>
  );
}
