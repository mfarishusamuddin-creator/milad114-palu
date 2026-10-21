"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GlideSelect from "@/components/shared/GlideSelect";
import { isLanguage, languagePath } from "@/i18n";
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
};

export function LanguageSwitcher({ lang, className, large = false }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(lang);
  const [prevLang, setPrevLang] = useState(lang);

  if (prevLang !== lang) {
    setPrevLang(lang);
    setValue(lang);
  }

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
          if (next !== lang) router.push(languagePath(next));
        }}
        ariaLabel="Language"
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
