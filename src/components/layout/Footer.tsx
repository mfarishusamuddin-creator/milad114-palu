import Image from "next/image";
import Link from "next/link";
import { aboutPath } from "@/i18n";
import type { Dictionary } from "@/i18n/types";

/**
 * Footer minimalis: kiri identitas + deskripsi singkat, kanan info acara
 * dan tautan Tentang. Sumber, kredit, hak cipta, dan pengalih bahasa/tema
 * sengaja tidak ditampilkan di sini — semuanya ada di halaman Tentang.
 */
export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="relative mt-auto overflow-hidden bg-navy-deep text-white">
      <div className="container-page relative z-10 py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="flex max-w-md items-start gap-4">
            <Image
              src="/logo/logogram-white.png"
              alt=""
              width={512}
              height={512}
              className="h-14 w-14 flex-none object-contain md:h-16 md:w-16"
            />
            <div className="min-w-0">
              <p className="font-serif text-lg font-bold leading-snug text-white">
                {dict.footer.brand}
              </p>
              <p className="mt-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-gold-light">
                {dict.footer.tagline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {dict.footer.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end md:text-end">
            <p className="text-sm font-semibold text-white/85">
              {dict.footer.eventInfo}
            </p>
            <Link
              href={aboutPath(dict.lang)}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold-light underline decoration-gold/60 decoration-2 underline-offset-4 transition-colors hover:text-white"
            >
              {dict.nav.about}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
