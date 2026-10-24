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
 * dalamnya). Isi dianimasikan dengan grid-template-rows agar naik/turun
 * halus dan tetap rendah biaya.
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
  const [pendingTarget, setPendingTarget] = useState<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  /** Buka section (bila tertutup) lalu scroll ke target di dalamnya. */
  const revealTarget = useCallback((target: HTMLElement): void => {
    if (!sectionRef.current?.contains(target)) return;
    if (openRef.current) {
      // Section sudah terbuka: scroll pada frame berikutnya.
      requestAnimationFrame(() => {
        const reduce =
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
          false;
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      });
      return;
    }
    setPendingTarget(target);
    setOpen(true);
  }, []);

  useEffect(() => {
    const revealFromHash = (): void => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const target = document.getElementById(decodeURIComponent(hash));
      if (target) revealTarget(target);
    };
    const frame = requestAnimationFrame(revealFromHash);
    const onHashChange = (): void => revealFromHash();
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [revealTarget]);

  useEffect(() => {
    const onAnchorNavigation = (event: Event): void => {
      const targetId = (event as CustomEvent<{ targetId?: string }>).detail
        ?.targetId;
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) revealTarget(target);
    };
    window.addEventListener("site:anchor-navigation", onAnchorNavigation);
    return () =>
      window.removeEventListener("site:anchor-navigation", onAnchorNavigation);
  }, [revealTarget]);

  /**
   * Scroll ke target setelah panel selesai terbuka: menunggu
   * transitionend grid-template-rows, dengan fallback frame agar tetap
   * berjalan bila transisi tidak terpicu (mis. prefers-reduced-motion).
   */
  useEffect(() => {
    if (!open || !pendingTarget) return undefined;
    const target = pendingTarget;
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let done = false;
    let fallback = 0;

    const scrollTarget = (): void => {
      if (done) return;
      done = true;
      setPendingTarget((current) => (current === target ? null : current));
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    };

    if (reduce || !panelRef.current) {
      const frame = requestAnimationFrame(scrollTarget);
      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(fallback);
      };
    }

    const panel = panelRef.current;
    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.target === panel && event.propertyName === "grid-template-rows") {
        scrollTarget();
      }
    };
    panel.addEventListener("transitionend", onTransitionEnd);
    fallback = window.setTimeout(scrollTarget, 700);
    return () => {
      panel.removeEventListener("transitionend", onTransitionEnd);
      window.clearTimeout(fallback);
    };
  }, [open, pendingTarget]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`collapsible scroll-mt-24 ${className}`.trim()}
    >
      <div className="container-page">
        <div className="collapsible__body" data-open={open ? "" : undefined}>
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

          <div
            ref={panelRef}
            id={panelId}
            className="collapsible__panel"
            aria-hidden={!open}
            inert={!open}
          >
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
