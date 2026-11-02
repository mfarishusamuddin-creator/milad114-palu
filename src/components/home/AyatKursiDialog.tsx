"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ayatKursiContent } from "@/data/ayat-kursi";
import type { Dictionary } from "@/i18n/types";
import "./ayat-kursi.css";

type Props = {
  open: boolean;
  onClose: () => void;
  dict: Dictionary;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Modal "Fadhail Ayat Kursi" untuk hotspot baju pada karya hero.
 *
 * Isi hanya berupa tiga poin keutamaan, masing-masing dengan satu kalimat
 * penjelasan dan sumber singkat. Seluruh teks berasal dari
 * `src/data/ayat-kursi.ts`; tidak ada teks ayat atau teks hadits lengkap.
 */
export function AyatKursiDialog({ open, onClose, dict }: Props) {
  const mounted = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open || !mounted) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.getClientRects().length > 0);

      if (focusables.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside = active ? panel.contains(active) : false;

      if (event.shiftKey) {
        if (!inside || active === first || active === panel) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (!inside || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = previousOverflow;

      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      ) {
        previouslyFocused.focus();
      }
    };
  }, [open, mounted]);

  if (!open || !mounted) return null;

  const labels = dict.heroArtwork.ayatKursi;
  const lang = dict.lang;
  const { points, cta, related } = ayatKursiContent;
  const hasContent = points.length > 0;
  const relatedLabel = related?.label[lang];
  const relatedHref = related?.href[lang];

  return createPortal(
    <div className="ayat-kursi">
      <div
        className="ayat-kursi__backdrop"
        aria-hidden="true"
        onClick={() => onCloseRef.current()}
      />

      <div
        ref={panelRef}
        className="ayat-kursi__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ayat-kursi-title"
        dir={dict.dir}
        tabIndex={-1}
      >
        <div className="ayat-kursi__header">
          <h2 id="ayat-kursi-title" className="ayat-kursi__title font-serif">
            {labels.title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="ayat-kursi__close"
            onClick={() => onCloseRef.current()}
          >
            <span className="ayat-kursi__close-icon" aria-hidden="true">
              ×
            </span>
            <span>{labels.close}</span>
          </button>
        </div>

        {hasContent ? (
          <>
            <div className="ayat-kursi__body">
              <ol className="ayat-kursi__points">
                {points.map((point) => (
                  <li key={point.id} className="ayat-kursi__point">
                    <h3 className="ayat-kursi__point-title font-serif">
                      {point.title[lang]}
                    </h3>
                    <p className="ayat-kursi__point-summary">
                      {point.summary[lang]}
                    </p>
                    <a
                      className="ayat-kursi__source"
                      href={point.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${labels.sourceLabel}: ${point.source[lang]}`}
                    >
                      <span>{point.source[lang]}</span>
                      <span
                        className="ayat-kursi__source-icon"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="ayat-kursi__footer">
              <a
                className="ayat-kursi__cta"
                href={cta.href[lang]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{cta.label[lang]}</span>
                <span className="ayat-kursi__cta-icon" aria-hidden="true">
                  ↗
                </span>
              </a>

              {relatedLabel && relatedHref ? (
                <a
                  className="ayat-kursi__related"
                  href={relatedHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{relatedLabel}</span>
                  <span
                    className="ayat-kursi__related-icon"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
