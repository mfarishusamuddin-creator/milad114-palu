import { cn } from "@/lib/cn";

type Source = {
  label: string;
  url: string;
};

type Props = {
  title?: string;
  items: Source[];
  light?: boolean;
  className?: string;
};

export function SourceNote({
  title = "Sumber",
  items,
  light = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "source-note",
        light && "border-gold-light/70 text-white/60",
        className
      )}
    >
      <p className={cn("font-semibold", light ? "text-white/80" : "text-ink")}>
        {title}
      </p>
      <ul className="mt-1 space-y-1">
        {items.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(light && "text-gold-light")}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
