import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/data/site";
import { getDictionary } from "@/i18n";

const display = localFont({
  src: "./fonts/ElMessiri-VariableFont_wght.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "400 700",
});

const body = localFont({
  src: [
    {
      path: "./fonts/FamiljenGrotesk-VariableFont_wght.ttf",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "./fonts/FamiljenGrotesk-Italic-VariableFont_wght.ttf",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

const idDict = getDictionary("id");

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: idDict.meta.title,
  description: idDict.meta.description,
  applicationName: "Milad 114",
  keywords: [
    "Milad Muhammadiyah 114",
    "Tanwir Muhammadiyah 2026",
    "Bersama Satukan Bangsa",
    "Palu",
    "Sulawesi Tengah",
    "KHGT",
    "Muhammadiyah",
    "PCIM",
  ],
  alternates: {
    canonical: "/",
    languages: { id: "/", en: "/en", ar: "/ar" },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Milad 114",
    title: idDict.meta.title,
    description: idDict.meta.description,
    images: [
      {
        url: "/og/og-milad114-1921.jpg",
        width: 1200,
        height: 630,
        alt: idDict.meta.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: idDict.meta.title,
    description: idDict.meta.description,
    images: ["/og/og-milad114-1921.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      {
        url: "/logo/logogram-color.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logo/logogram-color.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1C469F" },
    { media: "(prefers-color-scheme: dark)", color: "#081226" },
  ],
  colorScheme: "light dark",
};

const themeScript = `(function(){try{var t=localStorage.getItem("m114:theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var save=!!(navigator.connection&&navigator.connection.saveData);document.documentElement.dataset.intro=(!reduce&&!save)?"play":"skip";}catch(e){document.documentElement.dataset.intro="skip";}})();`;

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Tanwir dan Milad ke-114 Muhammadiyah",
  startDate: SITE.startISO,
  endDate: SITE.endISO,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: `${SITE.city}, ${SITE.province}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.province,
      addressCountry: "ID",
    },
  },
  image: [`${SITE.url}/og/og-milad114-1921.jpg`],
  description: idDict.meta.description,
  organizer: {
    "@type": "Organization",
    name: SITE.organizer,
    url: SITE.links.muhammadiyah,
  },
  inLanguage: "id",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      dir="ltr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable}`}
    >
      <body className="min-h-screen bg-bg text-ink antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <noscript>
          <style>{`.motion-intro{display:none!important}[data-animated-content]{visibility:visible!important}`}</style>
        </noscript>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}

