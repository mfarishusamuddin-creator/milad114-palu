"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/data/site";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  label?: string;
  className?: string;
};

export function ShareButton({
  text,
  label = "Bagikan",
  className,
}: Props) {
  const [status, setStatus] = useState("");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function announce(message: string) {
    setStatus(message);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setStatus(""), 2600);
  }

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: SITE.title, text, url });
        announce("Terbagi");
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      announce("Tautan disalin");
    } catch {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        announce("Tautan disalin");
      } catch {
        announce("Salin URL di address bar");
      }
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className={cn("btn btn-ghost btn-sm", className)}
      >
        <ShareIcon />
        {label}
      </button>
      <span
        className="text-xs font-semibold text-ocean"
        aria-live="polite"
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
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
