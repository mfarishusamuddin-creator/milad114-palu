import Link from "next/link";
import { languagePath } from "@/i18n";
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
  return (
    <div
      dir="ltr"
      className={cn(
        "inline-flex items-center rounded-sm border border-line bg-surface p-0.5",
        className
      )}
      aria-label="Language"
    >
      {LANGUAGES.map((item) => (
        <Link
          key={item.code}
          href={languagePath(item.code)}
          lang={item.code}
          hrefLang={item.code}
          aria-label={item.name}
          aria-current={item.code === lang ? "page" : undefined}
          className={cn(
            "inline-flex items-center justify-center rounded-[2px] font-bold no-underline transition-colors",
            large ? "h-8 px-3 text-[0.72rem]" : "h-7 px-2 text-[0.62rem]",
            item.code === lang
              ? "bg-navy text-white"
              : "text-ink-soft hover:text-navy"
          )}
        >
          {item.short}
        </Link>
      ))}
    </div>
  );
}
