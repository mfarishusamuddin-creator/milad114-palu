import { cn } from "@/lib/cn";
import GradientText from "@/components/shared/GradientText";

type Props = {
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
};

export function SectionHeading({
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
      <h2
        className={cn(
          "section-title mt-3",
          light ? "text-white" : "text-ink"
        )}
      >
        <GradientText block start animationSpeed={13}>
          {title}
        </GradientText>
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
