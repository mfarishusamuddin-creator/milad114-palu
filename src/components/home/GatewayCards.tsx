import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Dictionary } from "@/i18n/types";

const ACCENT: Record<string, string> = {
  teal: "bg-teal-deep",
  navy: "bg-navy",
  gold: "bg-gold",
};

export function GatewayCards({ dict }: { dict: Dictionary }) {
  return (
    <section className="section scroll-mt-20" id="jelajah">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <SectionHeading
            eyebrow={dict.gates.eyebrow}
            title={dict.gates.title}
          />
          <p className="body-lead max-w-md lg:pb-1">
            {dict.gates.description}
          </p>
        </div>

        <div className="mt-10">
          {dict.gates.items.map((gate) => (
            <a
              key={gate.number}
              href={gate.href}
              className="group grid gap-3 border-t border-line py-6 no-underline transition-colors last:border-b hover:bg-bg-soft/70 sm:grid-cols-[4.5rem_0.7fr_1.3fr_auto] sm:items-center sm:gap-6 sm:px-3"
              data-reveal
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${ACCENT[gate.accent] ?? "bg-navy"}`}
                  aria-hidden="true"
                />
                <span className="font-serif text-xl font-bold text-ink">
                  {gate.number}
                </span>
              </div>

              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-teal-deep">
                  {gate.label}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-ink transition-colors group-hover:text-navy">
                  {gate.title}
                </h3>
              </div>

              <p className="max-w-lg text-sm leading-relaxed text-ink-soft">
                {gate.description}
              </p>

              <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-navy">
                {dict.gates.open}
                <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <ArrowIcon />
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="rtl:rotate-180"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
