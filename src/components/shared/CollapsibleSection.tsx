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
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const pendingTargetRef = useRef<HTMLElement | null>(null);

  const revealTarget = useCallback((target: HTMLElement): void => {
    if (!sectionRef.current?.contains(target)) return;
    pendingTargetRef.current = target;
    if (open) {
      requestAnimationFrame(() => {
        if (pendingTargetRef.current !== target) return;
        pendingTargetRef.current = null;
        const reduce =
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
      return;
    }
    setOpen(true);
  }, [open]);

  const revealTargetRef = useRef(revealTarget);
  useEffect(() => {
    revealTargetRef.current = revealTarget;
  }, [revealTarget]);

  useEffect(() => {
    const revealFromHash = (): void => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const target = document.getElementById(decodeURIComponent(hash));
      if (target) revealTargetRef.current(target);
    };
    const frame = requestAnimationFrame(revealFromHash);
    const onHashChange = (): void => revealFromHash();
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

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

  useEffect(() => {
    const target = pendingTargetRef.current;
    if (!open || !target) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const scrollTarget = (): void => {
      if (pendingTargetRef.current !== target) return;
      pendingTargetRef.current = null;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };

    if (reduce || !panelRef.current) {
      requestAnimationFrame(scrollTarget);
      return;
    }

    const panel = panelRef.current;
    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.target === panel && event.propertyName === "grid-template-rows") {
        panel.removeEventListener("transitionend", onTransitionEnd);
        scrollTarget();
      }
    };
    panel.addEventListener("transitionend", onTransitionEnd);
    return () => panel.removeEventListener("transitionend", onTransitionEnd);
  }, [open]);

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
