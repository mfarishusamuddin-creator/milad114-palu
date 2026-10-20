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
      <div className="container-page grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-navy p-7 text-white shadow-[0_28px_70px_rgba(28,70,158,0.22)] sm:p-9">
          <div
            className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-teal/30 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-gold/15 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <Image
              src="/logo/logogram-white.png"
              alt=""
              width={512}
              height={512}
              className="h-16 w-16 object-contain"
            />
            <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-gold-light">
              Milad 114
            </span>
          </div>

          <p className="relative z-10 mt-8 font-serif text-[7.5rem] font-bold leading-none text-gold-light sm:text-[9rem]">
            114
          </p>
          <p className="relative z-10 mt-2 max-w-xs font-serif text-xl font-semibold leading-snug text-white">
            tahun tumbuh bersama, satukan bangsa.
          </p>

          <div className="relative z-10 mt-8 border-t border-white/15 pt-5">
            <p className="text-xs leading-relaxed text-white/60">
              Kelor dipilih karena kuat, sederhana, dan bermanfaat. Ia tumbuh
              di Palu dan menjadi simbol ketangguhan.
            </p>
            <a
              href={SITE.links.maknaLogo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[0.7rem] font-bold text-gold-light no-underline"
            >
              Baca makna logo
              <ArrowIcon />
            </a>
          </div>

          <div
            className="pattern-strip absolute inset-x-0 bottom-0 h-2.5 opacity-90"
            aria-hidden="true"
          />
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
              kesejahteraan, moralitas, ilmu, dan teknologi. Tema ini dikaitkan
              dengan QS Al-Hujurat ayat 10 dan 13.
            </p>
            <p>
              Sebagai bagian dari rangkaian, panitia menanam{" "}
              <strong>114 pohon kelor</strong> di Palu. Angka 114 bertemu
              dengan akar, batang, dan kanopi: perjalanan panjang yang tetap
              berpijak pada manfaat.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {FACTS.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-line bg-white px-4 py-3.5"
              >
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
                  {fact.label}
                </p>
                <p className="mt-1 font-serif text-base font-bold text-ink">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>

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
