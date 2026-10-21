import Link from "next/link";
import { getDictionary } from "@/i18n";

export default function NotFound() {
  const dict = getDictionary("id");

  return (
    <section className="relative overflow-hidden bg-bg-soft">
      <div
        className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-ocean/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-page relative z-10 flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          404
        </p>
        <p className="mt-4 font-serif text-7xl font-bold text-navy sm:text-8xl">
          404
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-ink">
          {dict.notFound.title}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          {dict.notFound.description}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary no-underline">
            {dict.notFound.home}
          </Link>
          <Link href="/#sejarah" className="btn btn-ghost no-underline">
            {dict.notFound.history}
          </Link>
          <Link href="/#layanan" className="btn btn-ghost no-underline">
            {dict.notFound.services}
          </Link>
        </div>
      </div>
    </section>
  );
}
