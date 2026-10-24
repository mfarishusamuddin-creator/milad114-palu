"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { scrollToAnchor } from "@/lib/anchor";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

/**
 * Tautan anchor in-page (#…) dengan perilaku klik yang konsisten:
 * membuka CollapsibleSection tujuan (mis. #sejarah atau #agenda) lalu
 * scroll halus, tanpa bergantung pada event hashchange sehingga klik
 * hash yang sama berulang tetap bekerja. Perilaku default browser
 * dipertahankan untuk modifier keys (Ctrl/Cmd/klik tengah) dan untuk
 * href non-hash (skip link, URL route).
 */
export function AnchorLink({ children, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        const href = rest.href;
        if (!href?.startsWith("#")) return;
        event.preventDefault();
        scrollToAnchor(href);
      }}
    >
      {children}
    </a>
  );
}
