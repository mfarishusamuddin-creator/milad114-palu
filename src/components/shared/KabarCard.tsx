import type { KabarItem } from "@/lib/kabar";
import { formatDateID } from "@/lib/date";

type Props = {
  item: KabarItem;
};

export function KabarCard({ item }: Props) {
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
      </span>
    </a>
  );
}
