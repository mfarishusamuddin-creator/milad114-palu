"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { SITE } from "@/data/site";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";

/*
 * Tombol "bagikan karya" untuk hero kaligrafi.
 * - URL selalu halaman aktif (menghormati /, /en, /ar); bukan SITE.url.
 * - Web Share API dulu, lalu clipboard, lalu instruksi manual.
 * - Status hidup 2600 ms, timer dibersihkan saat unmount.
 * - Batal (AbortError) tidak menampilkan status dan tidak jatuh ke clipboard.
 */

const STATUS_DURATION = 2600;

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { name?: unknown }).name === "AbortError"
  );
}

export function useArtworkShare(dict: Dictionary): {
  share: () => Promise<void>;
  status: string;
} {
  const [status, setStatus] = useState("");
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const announce = useCallback(
    (message: string) => {
      clearTimer();
      setStatus(message);
      if (!message) return;
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
        setStatus("");
      }, STATUS_DURATION);
    },
    [clearTimer],
  );

  useEffect(() => clearTimer, [clearTimer]);

  const share = useCallback(async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    const title = `${dict.heroArtwork.title} — ${SITE.title}`;
    const text = dict.hero.shareText;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        announce(dict.heroArtwork.shareStatus.shared);
        return;
      } catch (error) {
        if (isAbortError(error)) {
          // Pengguna menutup dialog berbagi: jangan tampilkan status,
          // jangan salin ke clipboard.
          announce("");
          return;
        }
        // Kegagalan lain: lanjut ke clipboard di bawah.
      }
    }

    const clipboard =
      typeof navigator.clipboard === "undefined"
        ? undefined
        : navigator.clipboard;

    if (!clipboard || typeof clipboard.writeText !== "function") {
      announce(dict.heroArtwork.shareStatus.manual);
      return;
    }

    try {
      await clipboard.writeText(`${text} ${url}`);
      announce(dict.heroArtwork.shareStatus.copied);
    } catch {
      announce(dict.heroArtwork.shareStatus.manual);
    }
  }, [announce, dict]);

  return { share, status };
}

type HeroTitleShareProps = {
  onShare: () => void | Promise<void>;
  status: string;
  label: string;
  className?: string;
};

export function HeroTitleShare({
  onShare,
  status,
  label,
  className,
}: HeroTitleShareProps): ReactElement {
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => {
          void onShare();
        }}
        className="btn btn-ghost min-h-11 px-4 py-2 text-[0.8rem]"
      >
        <ShareIcon />
        <span>{label}</span>
      </button>
      <span
        aria-live="polite"
        aria-atomic="true"
        className="inline-flex min-h-6 min-w-[9rem] items-center text-xs font-semibold text-ocean"
      >
        {status}
      </span>
    </span>
  );
}

function ShareIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
