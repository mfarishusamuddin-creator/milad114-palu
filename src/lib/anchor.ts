"use client";

type AnchorNavigationDetail = {
  targetId?: string;
};

/**
 * Helper navigasi anchor in-page.
 *
 * Dipakai oleh Navbar (CardNav) dan CTA Hero agar klik ke hash:
 *  - tidak bergantung pada event `hashchange` (klik hash yang sama dua
 *    kali tetap membuka/scroll);
 *  - membuka CollapsibleSection (section/judul atau elemen di dalamnya,
 *    mis. #kabar di dalam #layanan) terlebih dahulu, lalu scroll ke
 *    target setelah panel selesai terbuka (dikoordinasikan lewat event
 *    kustom `site:anchor-navigation` yang didengar CollapsibleSection);
 *  - target di luar section collapsible (mis. #countdown di Hero)
 *    langsung di-scroll, menghormati scroll-margin-top target;
 *  - menghormati prefers-reduced-motion.
 *
 * Pemanggil bertanggung jawab memanggil event.preventDefault() bila
 * menangani klik tautan (lihat pemakaian di Navbar dan Hero).
 */
export function scrollToAnchor(hash: string): void {
  if (typeof window === "undefined") return;

  const targetId = decodeURIComponent(
    hash.startsWith("#") ? hash.slice(1) : hash
  );
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  const fullHash = `#${targetId}`;
  if (window.location.hash !== fullHash) {
    window.history.pushState(null, "", fullHash);
  } else {
    window.history.replaceState(null, "", fullHash);
  }

  const insideCollapsible = Boolean(
    target instanceof Element && target.closest(".collapsible")
  );
  if (insideCollapsible) {
    window.dispatchEvent(
      new CustomEvent<AnchorNavigationDetail>("site:anchor-navigation", {
        detail: { targetId }
      })
    );
    return;
  }

  const reduce =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
