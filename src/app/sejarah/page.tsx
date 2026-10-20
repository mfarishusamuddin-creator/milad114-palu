import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HistoryExperience } from "@/components/history/HistoryExperience";
import { SourceNote } from "@/components/shared/SourceNote";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Jejak 114 Tahun",
  description:
    "Perjalanan Muhammadiyah dari Kauman 1912 ke Palu 2026: enam bab sejarah, sumber resmi, dan timeline interaktif.",
  alternates: {
    canonical: "/sejarah",
  },
  openGraph: {
    title: "Jejak 114 Tahun â€” Milad 114",
    description:
      "Perjalanan Muhammadiyah dari Kauman 1912 ke Palu 2026 dalam enam bab.",
    url: "/sejarah",
    images: ["/og/og-milad114.jpg"],
  },
};

const STATS = [
  { value: "1868", label: "Ahmad Dahlan lahir" },
  { value: "1912", label: "Muhammadiyah berdiri" },
  { value: "2026", label: "Milad ke-114, Palu" },
  { value: "2027", label: "Muktamar ke-49" },
];

export default function SejarahPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="absolute -right-24 -top-20 h-80 w-80 rounded-full bg-teal/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="pattern-strip h-2.5 w-full opacity-90" aria-hidden="true" />

        <div className="container-page relative z-10 grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:py-20">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex items-center gap-2 text-[0.68rem] font-semibold text-white/50">
                <li>
                  <Link href="/" className="hover:text-gold-light no-underline">
                    Pohon
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gold-light" aria-current="page">
                  Akar
                </li>
              </ol>
            </nav>

            <p className="eyebrow eyebrow--light">
              <span className="eyebrow-dot" aria-hidden="true" />
              Akar â€” 1868â€“2026
            </p>
            <h1 className="display-title mt-4 text-white">
              Jejak
              <span className="block text-gold-light">114 Tahun</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
              Dari ruang tamu di Kauman sampai kanopi yang menaungi Palu.
              Enam bab ini menyusuri akar, batang, dan kanopi Muhammadiyah
              dengan sumber resmi di setiap langkah.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/layanan" className="btn btn-gold no-underline">
                Buka Layanan
              </Link>
              <Link href="/" className="btn btn-light no-underline">
                Kembali ke Milad
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-sm border border-white/15 bg-white/8 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold-light">
                    Perjalanan
                  </p>
                  <p className="mt-2 font-serif text-3xl font-bold text-white">
                    1912 <span className="text-gold-light">â†’</span> 2026
                  </p>
                </div>
                <Image
                  src="/logo/logogram-white.png"
                  alt=""
                  width={512}
                  height={512}
                  className="h-14 w-14 object-contain"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {STATS.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-sm border border-white/10 bg-white/5 px-3 py-3"
                  >
                    <p className="font-serif text-2xl font-bold text-gold-light">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white/55">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pattern-strip h-2.5 w-full opacity-90" aria-hidden="true" />
      </section>

      <HistoryExperience />

      <section className="pb-16">
        <div className="container-page">
          <div className="rounded-sm border border-line bg-bg-soft p-6 sm:p-8">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Catatan sumber
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
              Fakta pada halaman ini diambil dari halaman resmi Muhammadiyah
              dan artikel resmi tentang Milad ke-114. Angka amal usaha yang
              belum seragam tidak ditampilkan.
            </p>
            <SourceNote
              className="mt-4"
              items={[
                { label: "Sejarah Singkat Muhammadiyah", url: SITE.links.sejarahSingkat },
                { label: "Sejarah Berdirinya Muhammadiyah", url: SITE.links.sejarahBerdiri },
                { label: "Program 25 Tahun", url: SITE.links.program25 },
                { label: "Persiapan Muktamar 2027", url: SITE.links.muktamar2027 },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

