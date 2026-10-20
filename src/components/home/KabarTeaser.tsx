import Link from "next/link";
import { getKabar } from "@/lib/kabar";
import { KabarCard } from "@/components/shared/KabarCard";
import { SectionHeading } from "@/components/shared/SectionHeading";

export async function KabarTeaser() {
  const [milad, latest] = await Promise.all([
    getKabar("Tanwir Milad"),
    getKabar(),
  ]);
  const merged = [...milad, ...latest].filter(
    (item, index, all) =>
      all.findIndex((candidate) => candidate.id === item.id) === index
  );
  const items = merged.slice(0, 3);

  return (
    <section className="section scroll-mt-20" id="kabar">
      <div className="container-page">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Kabar"
            title="Kabar dari Muhammadiyah"
            description="Kabar terbaru dari kanal resmi Muhammadiyah. Ringkasan singkat, tautan tetap ke sumber asli."
          />
          <Link
            href="/layanan#kabar"
            className="btn btn-ghost btn-sm shrink-0 no-underline"
          >
            Lihat semua kabar
            <ArrowIcon />
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <KabarCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-9 rounded-2xl border border-line bg-bg-soft p-6">
            <p className="text-sm text-ink-soft">
              Kabar resmi sedang tidak dapat dimuat. Buka langsung{" "}
              <a
                href="https://muhammadiyah.or.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-navy underline"
              >
                muhammadiyah.or.id
              </a>
              .
            </p>
          </div>
        )}

        <p className="mt-5 text-xs text-ink-soft">
          Sumber:{" "}
          <a
            href="https://muhammadiyah.or.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal-deep underline"
          >
            muhammadiyah.or.id
          </a>{" "}
          · data diperbarui otomatis dengan cache satu jam.
        </p>
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
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
