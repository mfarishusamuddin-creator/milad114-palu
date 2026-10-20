import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceNote } from "@/components/shared/SourceNote";
import { SITE } from "@/data/site";

const AGENDA = [
  {
    date: "13–15 Nov 2026",
    title: "Tanwir dan Milad ke-114",
    description:
      "Palu, Sulawesi Tengah. Rangkaian utama Tanwir dan Milad, bertepatan dengan 4–6 Jumadilakhir 1448 H.",
    tag: "Palu",
  },
  {
    date: "18 Nov 2026",
    title: "Milad ke-114 Muhammadiyah",
    description:
      "Milad historis, mengenang pendirian Muhammadiyah pada 18 November 1912 / 8 Dzulhijjah 1330 H.",
    tag: "Milad",
  },
  {
    date: "2027",
    title: "Muktamar ke-49",
    description:
      "Medan, Sumatera Utara. Tanwir 2026 menjadi forum evaluasi dan persiapan menuju Muktamar.",
    tag: "2027",
  },
];

export function Agenda() {
  return (
    <section className="section scroll-mt-20 bg-bg-soft" id="agenda">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <SectionHeading eyebrow="Agenda" title="Tiga penanda waktu" />
          <p className="max-w-md text-sm leading-relaxed text-ink-soft lg:pb-1">
            Tanggal acara, tanggal historis, dan arah berikutnya. Jadwal rinci
            mengikuti Edaran PP Muhammadiyah No. 19/EDR/I.0/B/2026.
          </p>
        </div>

        <div className="mt-10 border-t border-line">
          {AGENDA.map((item) => (
            <article
              key={item.title}
              className="grid gap-2 border-b border-line py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-6"
            >
              <p className="font-serif text-lg font-bold text-navy">
                {item.date}
              </p>
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </div>
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
                {item.tag}
              </span>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SourceNote
            items={[
              { label: "Edaran 19/2026", url: SITE.links.edaran },
              { label: "Program 25 Tahun", url: SITE.links.program25 },
              { label: "Persiapan Muktamar 2027", url: SITE.links.muktamar2027 },
            ]}
          />
          <a
            href={SITE.links.edaran}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm shrink-0 no-underline"
          >
            Buka Edaran
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
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
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}
