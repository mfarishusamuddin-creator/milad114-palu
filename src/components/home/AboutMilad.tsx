import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceNote } from "@/components/shared/SourceNote";
import { SITE } from "@/data/site";

const FACTS = [
  { label: "Tuan rumah", value: "Palu, Sulawesi Tengah" },
  { label: "Tanggal", value: "13–15 November 2026" },
  { label: "Hijriah", value: "4–6 Jumadilakhir 1448 H" },
  { label: "Simbol", value: "Daun kelor & angka 114" },
];

export function AboutMilad() {
  return (
    <section className="section scroll-mt-20" id="tentang">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
          <div className="relative border-l border-gold pl-6 sm:pl-8">
            <div className="flex items-center justify-between gap-4">
              <Image
                src="/logo/logogram-color.png"
                alt=""
                width={512}
                height={512}
                className="h-12 w-12 object-contain"
              />
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-teal-deep">
                Berkas 114
              </span>
            </div>

            <p
              className="outline-number mt-8 font-serif text-[8rem] font-bold leading-none sm:text-[10rem]"
              aria-hidden="true"
            >
              114
            </p>
            <p className="mt-2 max-w-xs font-serif text-xl font-semibold leading-snug text-ink">
              tahun tumbuh bersama, satukan bangsa.
            </p>

            <div className="mt-8 border-t border-line pt-4">
              <p className="text-xs leading-relaxed text-ink-soft">
                Kelor dipilih karena kuat, sederhana, dan bermanfaat. Ia tumbuh
                di Palu dan menjadi simbol ketangguhan.
              </p>
              <a
                href={SITE.links.maknaLogo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gold-text no-underline"
              >
                Baca makna logo
                <ArrowIcon />
              </a>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Tentang Milad"
              title="Tumbuh dari satu daun"
              description="Logo Tanwir dan Milad ke-114 memadukan daun kelor dengan angka 114. Kelor bukan sekadar ornamen: ia tumbuh di Palu, tahan cuaca, dan memberi manfaat."
            />

            <div className="prose-milad mt-6 max-w-2xl text-[0.95rem]">
              <p>
                Tema <strong>“Bersama Satukan Bangsa”</strong> mengajak
                kebersamaan yang diarahkan pada keadilan, kemakmuran,
                kesejahteraan, moralitas, ilmu, dan teknologi. Tema ini
                dikaitkan dengan QS Al-Hujurat ayat 10 dan 13.
              </p>
              <p>
                Sebagai bagian dari rangkaian, panitia menanam{" "}
                <strong>114 pohon kelor</strong> di Palu. Angka 114 bertemu
                dengan akar, batang, dan kanopi: perjalanan panjang yang tetap
                berpijak pada manfaat.
              </p>
            </div>

            <dl className="mt-7 border-y border-line">
              {FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-1 border-b border-line py-3 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:items-baseline"
                >
                  <dt className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
                    {fact.label}
                  </dt>
                  <dd className="font-serif text-base font-bold text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <SourceNote
              className="mt-6"
              items={[
                { label: "Makna di Balik Logo", url: SITE.links.maknaLogo },
                { label: "114 Pohon Kelor di Palu", url: SITE.links.tanamKelor },
                { label: "Edaran 19/2026", url: SITE.links.edaran },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
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
