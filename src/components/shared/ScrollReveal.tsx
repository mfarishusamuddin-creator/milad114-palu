"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    document.documentElement.classList.add("js-reveal");
    const nodes = Array.from(document.querySelectorAll("[data-reveal]"));

    if (typeof IntersectionObserver === "undefined") {
      for (const node of nodes) node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const fallback = globalThis.setTimeout(() => {
      for (const node of nodes) node.classList.add("is-visible");
    }, 5000);

    for (const node of nodes) observer.observe(node);
    return () => {
      globalThis.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return null;
}
