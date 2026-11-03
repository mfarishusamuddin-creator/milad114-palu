"use client";

import { useEffect, useRef, useState } from "react";
import "./back-to-top.css";

/**
 * Tombol mengapung transparan untuk kembali ke atas.
 * Muncul setelah pengguna menggulir melewati ambang; hilang di posisi teratas.
 */
export function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = (): void => {
      frame = 0;
      setVisible((current) => {
        if (window.scrollY > 480) return true;
        if (window.scrollY < 80) return false;
        return current;
      });
    };

    const onScroll = (): void => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleClick = (): void => {
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    buttonRef.current?.blur();
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`back-to-top${visible ? " is-visible" : ""}`}
      aria-label={label}
      onClick={handleClick}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
