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
    color: "bg-navy",
  },
  {
    number: "02",
    label: "Akar",
    title: "Jejak 114 Tahun",
    description:
      "Dari Kauman 1912 ke Palu 2026, dibaca dalam enam bab yang saling menyambung.",
    href: "/sejarah",
    color: "bg-teal-deep",
  },
  {
    number: "03",
    label: "Batang",
    title: "Layanan",
    description:
      "Kalender KHGT, kabar resmi Muhammadiyah, dan kuis Milad 114.",
    href: "/layanan",
    color: "bg-gold",
  },
];

export function GatewayCards() {
  return (
    <section className="section scroll-mt-20" id="pintu">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <SectionHeading
            eyebrow="Indeks pintu"
            title="Satu pohon, tiga cara menjelajah"
          />
          <p className="body-lead max-w-md lg:pb-1">
            Pilih pintu yang paling ingin dibuka. Setiap pintu menuntun ke satu
            bagian pohon yang sama—tanpa halaman yang saling mengulang.
          </p>
        </div>

        <div className="mt-10">
          {GATES.map((gate) => (
            <Link
              key={gate.number}
              href={gate.href}
              className="group grid gap-3 border-t border-line py-6 no-underline transition-colors last:border-b hover:bg-bg-soft/70 sm:grid-cols-[4.5rem_0.7fr_1.3fr_auto] sm:items-center sm:gap-6 sm:px-3"
              aria-label={`${gate.label} — ${gate.title}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${gate.color}`}
                  aria-hidden="true"
                />
                <span className="font-serif text-xl font-bold text-ink">
                  {gate.number}
                </span>
              </div>

              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-teal-deep">
                  {gate.label}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-ink transition-colors group-hover:text-navy">
                  {gate.title}
                </h3>
              </div>

              <p className="max-w-lg text-sm leading-relaxed text-ink-soft">
                {gate.description}
              </p>

              <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-navy">
                Buka
                <span className="transition-transform group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
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
