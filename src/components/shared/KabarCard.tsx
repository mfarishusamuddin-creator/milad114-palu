import type { KabarItem } from "@/lib/kabar";
import { formatDateID, formatDateShortID } from "@/lib/date";

type Props = {
  item: KabarItem;
  variant?: "grid" | "lead" | "compact";
};

export function KabarCard({ item, variant = "grid" }: Props) {
  if (variant === "lead") {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block border-t-2 border-navy pt-4 no-underline"
      >
        <span className="kabar-date">{formatDateID(item.date)}</span>
        <span className="mt-2 block font-serif text-2xl font-bold leading-tight text-ink transition-colors group-hover:text-navy sm:text-3xl">
          {item.title}
        </span>
        <span className="mt-3 block max-w-2xl text-sm leading-relaxed text-ink-soft">
          {item.excerpt}
        </span>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-navy">
          Baca di muhammadiyah.or.id
          <ArrowIcon />
        </span>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-4 border-b border-line py-3.5 no-underline"
      >
        <span className="w-20 shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-teal-deep">
          {formatDateShortID(item.date)}
        </span>
        <span className="flex-1 font-serif text-base font-bold leading-snug text-ink transition-colors group-hover:text-navy">
          {item.title}
        </span>
        <span className="mt-0.5 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-navy">
          <ArrowIcon />
        </span>
      </a>
    );
  }

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="kabar-card"
    >
      <span className="kabar-date">{formatDateID(item.date)}</span>
      <span className="kabar-title">{item.title}</span>
      <span className="kabar-excerpt line-clamp-3">{item.excerpt}</span>
      <span className="mt-1 inline-flex items-center gap-1.5 text-[0.72rem] font-bold text-navy">
        Baca di muhammadiyah.or.id
        <ArrowIcon />
      </span>
    </a>
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
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}
