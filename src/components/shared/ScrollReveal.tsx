"use client";

import { useEffect } from "react";

function reveal(node: Element) {
  node.setAttribute("data-revealed", "true");
}

export function ScrollReveal() {
  useEffect(() => {
    document.documentElement.setAttribute("data-js-reveal", "true");
    const nodes = Array.from(document.querySelectorAll("[data-reveal]"));

    if (typeof IntersectionObserver === "undefined") {
      for (const node of nodes) reveal(node);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px 96px 0px", threshold: 0.04 }
    );

    const fallback = globalThis.setTimeout(() => {
      for (const node of nodes) reveal(node);
    }, 1600);

    for (const node of nodes) observer.observe(node);
    return () => {
      globalThis.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return null;
}
