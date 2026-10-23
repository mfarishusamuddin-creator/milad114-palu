import Image from "next/image";
import Link from "next/link";
import { aboutPath } from "@/i18n";
import type { Dictionary } from "@/i18n/types";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div className="container-page relative z-10 py-12">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/logogram-white.png"
              alt=""
              width={512}
              height={512}
              className="h-15 w-15 object-contain"
            />
            <div>
              <p className="font-serif text-lg font-bold text-white">
                Milad 114
              </p>
              <p className="mt-0.5 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/50">
                Muhammadiyah
              </p>
            </div>
          </div>

          <div className="flex max-w-xl flex-col gap-3 sm:items-end">
            <p className="max-w-md text-sm leading-relaxed text-white/65">
              {dict.footer.tagline}
            </p>
            <Link
              href={aboutPath(dict.lang)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-light underline decoration-gold/60 decoration-2 underline-offset-4 transition-colors hover:text-white"
            >
              {dict.nav.about}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
