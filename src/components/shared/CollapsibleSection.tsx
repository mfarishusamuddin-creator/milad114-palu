"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import GradientText from "@/components/shared/GradientText";
import "./collapsible-section.css";

type Props = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
};

/**
 * Section collapsible: tertutup default, judul sebagai tombol aksesibel.
 * Terbuka otomatis bila URL hash menuju section ini (maupun elemen di
 * dalamnya, mis. #kabar di Layanan). Isi dianimasikan dengan
 * grid-template-rows agar naik/turun halus dan tetap rendah biaya.
 */
export function CollapsibleSection({
  id,
  title,
  description,
  children,
  className = "",
  defaultOpen = false,
}: Props) {
  const panelId = `${id}__panel`;
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const revealFromHash = useCallback((): void => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const target = document.getElementById(
      decodeURIComponent(hash)
    );
    if (!target || !rootRef.current) return;
    const inside =
      target === rootRef.current ||
      rootRef.current.contains(target);
    if (!inside || open) return;
    if (target === rootRef.current) {
      setOpen(true);
      return;
    }
    setOpen(true);
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
      false;
    window.setTimeout(
      () =>
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start"
        }),
      reduce ? 0 : 480
    );
  }, [open]);

  useEffect(() => {
    revealFromHash();
    const onHashChange = (): void => revealFromHash();
    window.addEventListener("hashchange", onHashChange);
    return () =>
      window.removeEventListener("hashchange", onHashChange);
  }, [revealFromHash]);

  return (
    <section id={id} className={`collapsible scroll-mt-20 ${className}`.trim()}>
      <div className="container-page">
        <div ref={rootRef} className="collapsible__body" data-open={open ? "" : undefined}>
          <h2 className="collapsible__title">
            <button
              type="button"
              className="collapsible__button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((value) => !value)}
            >
              <GradientText block start animationSpeed={13}>
                {title}
              </GradientText>
              <ChevronIcon open={open} />
            </button>
          </h2>

          <div id={panelId} className="collapsible__panel" aria-hidden={!open} inert={!open}>
            <div className="collapsible__panel-inner">
              <div className="collapsible__panel-content">
                {description ? <p className="body-lead max-w-2xl">{description}</p> : null}
                <div className={description ? "mt-8" : undefined}>{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`collapsible__chevron${open ? " is-open" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
