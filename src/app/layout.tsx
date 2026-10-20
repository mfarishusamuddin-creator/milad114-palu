import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/data/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.title} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "Karya independen untuk lomba website" }],
  keywords: [
    "Milad Muhammadiyah 114",
    "Tanwir Muhammadiyah 2026",
    "Bersama Satukan Bangsa",
    "Palu",
    "Sulawesi Tengah",
    "KHGT",
    "Muhammadiyah",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/",
    siteName: SITE.name,
    title: `${SITE.title} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: "/og/og-milad114.jpg",
        width: 1200,
        height: 630,
        alt: "Tanwir dan Milad ke-114 Muhammadiyah — Bersama Satukan Bangsa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.title} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/og/og-milad114.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
  themeColor: "#1C469E",
  colorScheme: "light",
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: SITE.title,
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
  image: [`${SITE.url}/og/og-milad114.jpg`],
  description: SITE.description,
  organizer: {
    "@type": "Organization",
    name: SITE.organizer,
    url: SITE.links.muhammadiyah,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-bg text-ink antialiased">
        <a href="#konten" className="skip-link">
          Lewati ke konten
        </a>
        <Navbar />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <Footer />
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
