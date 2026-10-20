import type { Metadata } from "next";
import Link from "next/link";
import { HijriCalendar } from "@/components/services/HijriCalendar";
import { KabarTabs } from "@/components/services/KabarTabs";
import { QuizApp } from "@/components/services/QuizApp";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceNote } from "@/components/shared/SourceNote";
import { calendarHighlights } from "@/data/calendar-highlights";
import { SITE } from "@/data/site";
import { getKabar } from "@/lib/kabar";
import { khgtSnapshot } from "@/lib/khgt";
import { formatDateID } from "@/lib/date";

export const metadata: Metadata = {
  title: "Layanan Muhammadiyah",
  description:
    "Kalender Hijriah Global Tunggal, kabar resmi Muhammadiyah, dan kuis Milad ke-114 dalam satu halaman.",
  alternates: {
    canonical: "/layanan",
  },
  openGraph: {
    title: "Layanan Muhammadiyah â€” Milad 114",
    description:
      "Kalender KHGT, kabar resmi Muhammadiyah, dan kuis Milad ke-114.",
    url: "/layanan",
    images: ["/og/og-milad114.jpg"],
  },
};

const ANCHORS = [
  { href: "#kalender", label: "Kalender KHGT" },
  { href: "#kabar", label: "Kabar resmi" },
  { href: "#kuis", label: "Kuis Milad 114" },
];

export default async function LayananPage() {
  const [latest, milad] = await Promise.all([
    getKabar(),
    getKabar("Tanwir Milad"),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-bg-soft">
        <div
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-page relative z-10 grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex items-center gap-2 text-[0.68rem] font-semibold text-ink-soft">
                <li>
                  <Link href="/" className="hover:text-navy no-underline">
                    Pohon
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-teal-deep" aria-current="page">
                  Batang
                </li>
              </ol>
            </nav>

            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Batang â€” Layanan
            </p>
            <h1 className="display-title mt-4">
              Layanan
              <span className="block text-gold-text">Muhammadiyah</span>
            </h1>
            <p className="body-lead mt-5 max-w-xl">
              Tiga layanan yang menopang pohon: kalender resmi KHGT, kabar
              terbaru dari Muhammadiyah, dan kuis untuk menguji jejak
              pengetahuanmu.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {ANCHORS.map((anchor) => (
                <a
                  key={anchor.href}
                  href={anchor.href}
                  className="rounded-sm border border-line bg-white px-3.5 py-2 text-[0.7rem] font-bold text-ink-soft no-underline transition-colors hover:border-navy/25 hover:text-navy"
                >
                  {anchor.label}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-line">
            <div className="flex items-center justify-between gap-3 border-b border-line py-3">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
                Indeks layanan
              </p>
              <span className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
                Sumber resmi
              </span>
            </div>

            <ServiceRow
              href="#kalender"
              number="01"
              title="Kalender KHGT"
              description="Hijriah global tunggal, konverter, dan hari istimewa."
              icon="calendar"
            />
            <ServiceRow
              href="#kabar"
              number="02"
              title="Kabar Muhammadiyah"
              description="Kabar terbaru dan sorotan Tanwirâ€“Milad."
              icon="news"
            />
            <ServiceRow
              href="#kuis"
              number="03"
              title="Kuis Milad 114"
              description="Sepuluh soal, penjelasan, dan skor terbaik."
              icon="quiz"
            />
          </div>
        </div>
      </section>

      <section className="section scroll-mt-20" id="kalender">
        <div className="container-page">
          <SectionHeading
            eyebrow="Kalender"
            title="Kalender Hijriah Global Tunggal"
            description="Data kalender disinkronkan dari KHGT. Tampilan bulan, hari istimewa, dan konverter Masehiâ€“Hijriah memakai snapshot resmi, bukan library generik."
          />

          <div className="mt-8">
            <HijriCalendar data={khgtSnapshot} />
          </div>

          <div className="mt-6 rounded-sm border border-line bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-serif text-xl font-bold text-ink">
                Penanda Milad
              </h3>
              <a
                href={SITE.links.khgt}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-teal-deep underline"
              >
                Buka KHGT
              </a>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {calendarHighlights.map((item) => (
                <li
                  key={`${item.date}-${item.title}`}
                  className="rounded-sm border border-line bg-bg-soft/60 px-3 py-3"
                >
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-gold-text">
                    {formatDateID(item.date)}
                  </p>
                  <p className="mt-1 font-serif text-base font-bold text-ink">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                    {item.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section scroll-mt-20 bg-bg-soft" id="kabar">
        <div className="container-page">
          <SectionHeading
            eyebrow="Kabar"
            title="Kabar resmi Muhammadiyah"
            description="Ditarik dari kanal resmi Muhammadiyah, dengan cache satu jam dan fallback snapshot. Artikel lengkap tetap di sumber asli."
          />
          <div className="mt-8">
            <KabarTabs latest={latest} milad={milad} />
          </div>
        </div>
      </section>

      <section className="section scroll-mt-20" id="kuis">
        <div className="container-page">
          <SectionHeading
            eyebrow="Kuis"
            title="Kuis Milad 114"
            description="Uji pengetahuan tentang sejarah, logo, Palu, dan tema Milad. Setiap jawaban disertai penjelasan dan sumber."
          />
          <div className="mt-8">
            <QuizApp />
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <div className="rounded-sm border border-line bg-bg-soft p-6 sm:p-8">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Catatan sumber
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
              Kalender bersumber dari KHGT; kabar dari kanal resmi
              Muhammadiyah. Jika data resmi tidak dapat dimuat, halaman
              menampilkan snapshot terakhir dan tautan ke sumber asli.
            </p>
            <SourceNote
              className="mt-4"
              items={[
                { label: "Kalender Hijriah Global Tunggal", url: SITE.links.khgt },
                { label: "Muhammadiyah.or.id", url: SITE.links.muhammadiyah },
                { label: "Edaran 19/2026", url: SITE.links.edaran },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceRow({
  href,
  number,
  title,
  description,
  icon,
}: {
  href: string;
  number: string;
  title: string;
  description: string;
  icon: "calendar" | "news" | "quiz";
}) {
  return (
    <a
      href={href}
      className="group grid grid-cols-[2.2rem_1fr_auto] items-center gap-3 border-b border-line py-4 no-underline"
    >
      <span className="font-serif text-sm font-bold text-gold-text">
        {number}
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-base font-bold text-ink transition-colors group-hover:text-navy">
          {title}
        </span>
        <span className="mt-0.5 block text-[0.7rem] leading-snug text-ink-soft">
          {description}
        </span>
      </span>
      <span className="flex items-center gap-2 text-navy" aria-hidden="true">
        <ServiceIcon name={icon} />
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}

function ServiceIcon({ name }: { name: "calendar" | "news" | "quiz" }) {
  if (name === "news") {
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 5h13v14H4z" />
        <path d="M17 8h2a2 2 0 012 2v7a2 2 0 01-2 2h-2" />
        <path d="M7 9h6M7 12h6M7 15h4" />
      </svg>
    );
  }

  if (name === "quiz") {
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 1.7-2.5 3.5" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
      <path d="M8 15h2M14 15h2M8 18h2" />
    </svg>
  );
}


