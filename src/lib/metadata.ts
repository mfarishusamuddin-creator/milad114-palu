import type { Metadata } from "next";
import { SITE } from "@/data/site";
import { getDictionary } from "@/i18n";
import type { LanguageCode } from "@/i18n/types";

const OPEN_GRAPH_LOCALE: Record<LanguageCode, string> = {
  id: "id_ID",
  en: "en_GB",
  ar: "ar_AR",
};

export function buildMetadata(lang: LanguageCode): Metadata {
  const dict = getDictionary(lang);
  const path = lang === "id" ? "/" : `/${lang}`;

  return {
    metadataBase: new URL(SITE.url),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: path,
      languages: {
        id: "/",
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      type: "website",
      locale: OPEN_GRAPH_LOCALE[lang],
      url: path,
      siteName: "Milad 114",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [
        {
          url: "/og/og-milad114.jpg",
          width: 1200,
          height: 630,
          alt: dict.hero.plate.logoAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/og/og-milad114.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
