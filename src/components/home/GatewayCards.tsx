import Link from "next/link";
import { SectionHeading } from "@/components/shared/SectionHeading";

const GATES = [
  {
    number: "01",
    label: "Kanopi",
    title: "Milad 114",
    description:
      "Tema, makna logo, Palu, agenda, dan kabar terbaru seputar Milad ke-114.",
    href: "/#tentang",
    accent: "from-navy to-teal",
    icon: "leaf" as const,
  },
  {
    number: "02",
    label: "Akar",
    title: "Jejak 114 Tahun",
    description:
      "Dari Kauman 1912 ke Palu 2026, dibaca dalam enam bab yang saling menyambung.",
    href: "/sejarah",
    accent: "from-teal-deep to-kelor-deep",
    icon: "root" as const,
  },
  {
    number: "03",
    label: "Batang",
    title: "Layanan",
    description:
      "Kalender KHGT, kabar resmi Muhammadiyah, dan kuis Milad 114.",
    href: "/layanan",
    accent: "from-gold to-gold-light",
    icon: "calendar" as const,
  },
];

export function GatewayCards() {
  return (
    <section className="section scroll-mt-20" id="pintu">
      <div className="container-page">
        <SectionHeading
          eyebrow="Tiga pintu"
          title="Satu pohon, tiga cara menjelajah"
          description="Pilih pintu yang paling ingin dibuka. Setiap pintu menuntun ke satu bagian pohon yang sama."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {GATES.map((gate) => (
            <Link
              key={gate.number}
              href={gate.href}
              className="gateway-card no-underline"
              aria-label={`${gate.label} — ${gate.title}`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${gate.accent}`}
                aria-hidden="true"
              />
              <div className="flex items-start justify-between gap-3">
                <span className="gateway-number">{gate.number}</span>
                <span className="gateway-arrow">
                  <GateIcon name={gate.icon} />
                </span>
              </div>

              <p className="mt-8 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-teal-deep">
                {gate.label}
              </p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-ink">
                {gate.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {gate.description}
              </p>

              <span className="mt-6 inline-flex items-center gap-1.5 text-[0.74rem] font-bold text-navy">
                Buka pintu
                <ArrowIcon />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GateIcon({ name }: { name: "leaf" | "root" | "calendar" }) {
  if (name === "calendar") {
    return (
      <svg
        width="18"
        height="18"
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

  if (name === "root") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21V9" />
        <path d="M12 13l-4-3M12 16l4-3M12 10l3-2" />
        <path d="M12 9c0-3 2-5 5-5M12 9c0-3-2-5-5-5" />
      </svg>
    );
  }

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21c-4-4-7-8-7-12a7 7 0 0114 0c0 4-3 8-7 12z" />
      <path d="M12 21V9" />
      <path d="M12 13l-3-2M12 16l3-2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
