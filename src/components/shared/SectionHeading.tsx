import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className={cn("eyebrow", light && "eyebrow--light")}>
          <span className="eyebrow-dot" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "section-title mt-3",
          light ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "body-lead mt-4",
            light ? "text-white/70" : "text-ink-soft"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
