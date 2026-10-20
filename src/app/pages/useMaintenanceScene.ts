import { useEffect, type RefObject } from "react";

import { setBeamLightSampler } from "@/lib/beam-light";

interface SceneRefs {
  atmosphere: RefObject<HTMLCanvasElement | null>;
  reveals: RefObject<HTMLElement | null>[];
  /** Effect body waits until this is true — used so the letter-split only
   * runs once the real content (from settings, async) is actually rendered,
   * never on placeholder/loading text. */
  ready: boolean;
}

interface Beam {
  angle: number;
  spread: number;
  reach: number;
}

// Ported from the original vanilla "Under Maintenance" script.
// The particle-swarm part now lives in components/effects/SwarmCursor.tsx
// (global, page-independent) — this hook only handles the light-beam sweep
// and the per-letter reveal it drives.

/** Splits every text node under `root` into individually-lit <span class="home-letter"> characters. */
function splitIntoLetters(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    nodes.push(node as Text);
    node = walker.nextNode();
  }
  nodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    [...(textNode.nodeValue ?? "")].forEach((char) => {
      if (/\s/.test(char)) {
        fragment.append(document.createTextNode(char));
        return;
      }
      const letter = document.createElement("span");
      letter.className = "home-letter";
      letter.textContent = char;
      fragment.append(letter);
    });
    textNode.replaceWith(fragment);
  });
}

export function useMaintenanceScene({ atmosphere, reveals, ready }: SceneRefs) {
  useEffect(() => {
    if (!ready) return;

    const atmosphereCanvas = atmosphere.current;
    const targets = reveals.map((r) => r.current).filter((el): el is HTMLElement => el !== null);
    if (!atmosphereCanvas || targets.length === 0) return;

    const a = atmosphereCanvas.getContext("2d")!;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let origin = { x: 0, y: 0 };
    let sweepRange = { min: 0, max: Math.PI / 2 };
    let currentBeam: Beam = { angle: 0, spread: 0.285, reach: 0 };
    let rafId = 0;

    targets.forEach(splitIntoLetters);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      atmosphereCanvas!.width = w * dpr;
      atmosphereCanvas!.height = h * dpr;
      atmosphereCanvas!.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
      origin = { x: Math.max(38, w * 0.13), y: h * 0.76 };
      updateSweepRange();
    }

    // One shared geometry source drives both the light beam and the content reveal.
    function updateSweepRange() {
      const points = targets
        .flatMap((el) => [...el.querySelectorAll<HTMLElement>(".home-letter")])
        .map((letter) => {
          const r = letter.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        });
      if (points.length === 0) return;
      const angles = points.map((p) => Math.atan2(p.y - origin.y, p.x - origin.x));
      sweepRange = { min: Math.min(...angles) - 0.17, max: Math.max(...angles) + 0.17 };
    }

    function beam(now: number): Beam {
      const cycle = reduceMotion ? 0.47 : (Math.sin(now * 0.00046) + 1) / 2;
      const angle = sweepRange.min + cycle * (sweepRange.max - sweepRange.min);
      return { angle, spread: 0.285, reach: Math.hypot(w, h) * 1.12 };
    }

    function lightAt(x: number, y: number, b: Beam) {
      const dx = x - origin.x;
      const dy = y - origin.y;
      const dist = Math.hypot(dx, dy);
      if (!dist || dist > b.reach) return 0;
      const delta = Math.atan2(
        Math.sin(Math.atan2(dy, dx) - b.angle),
        Math.cos(Math.atan2(dy, dx) - b.angle),
      );
      const angular = Math.max(0, 1 - Math.abs(delta) / b.spread);
      const range = Math.max(0, 1 - dist / b.reach);
      return Math.pow(angular, 0.55) * (0.3 + 0.7 * range);
    }

    function targetLight(el: HTMLElement, b: Beam) {
      const r = el.getBoundingClientRect();
      const points: Array<[number, number]> = [
        [0.5, 0.5],
        [0.2, 0.5],
        [0.8, 0.5],
        [0.5, 0.18],
        [0.5, 0.82],
      ];
      return Math.max(...points.map(([x, y]) => lightAt(r.left + r.width * x, r.top + r.height * y, b)));
    }

    function paintAtmosphere(now: number, b: Beam) {
      a.clearRect(0, 0, w, h);

      const bg = a.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#06090a");
      bg.addColorStop(0.58, "#0a1010");
      bg.addColorStop(1, "#030505");
      a.fillStyle = bg;
      a.fillRect(0, 0, w, h);

      for (let i = 0; i < 4; i++) {
        const x = w * (0.15 + i * 0.27) + Math.sin(now * 0.00009 + i) * w * 0.07;
        const y = h * (0.2 + (i % 2) * 0.48);
        const g = a.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * 0.42);
        g.addColorStop(0, "rgba(86,116,110,.10)");
        g.addColorStop(1, "rgba(5,8,8,0)");
        a.fillStyle = g;
        a.fillRect(0, 0, w, h);
      }

      const p1 = {
        x: origin.x + Math.cos(b.angle - b.spread) * b.reach,
        y: origin.y + Math.sin(b.angle - b.spread) * b.reach,
      };
      const p2 = {
        x: origin.x + Math.cos(b.angle + b.spread) * b.reach,
        y: origin.y + Math.sin(b.angle + b.spread) * b.reach,
      };
      a.save();
      a.beginPath();
      a.moveTo(origin.x, origin.y);
      a.lineTo(p1.x, p1.y);
      a.lineTo(p2.x, p2.y);
      a.closePath();
      a.clip();
      const glow = a.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, b.reach);
      glow.addColorStop(0, "rgba(224,255,247,.36)");
      glow.addColorStop(0.32, "rgba(186,223,216,.12)");
      glow.addColorStop(1, "rgba(186,223,216,0)");
      a.fillStyle = glow;
      a.fillRect(0, 0, w, h);
      a.restore();

      const lens = a.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, 32);
      lens.addColorStop(0, "rgba(244,255,252,.95)");
      lens.addColorStop(0.18, "rgba(204,245,235,.6)");
      lens.addColorStop(1, "rgba(175,228,215,0)");
      a.fillStyle = lens;
      a.beginPath();
      a.arc(origin.x, origin.y, 32, 0, Math.PI * 2);
      a.fill();

      const vignette = a.createRadialGradient(
        w * 0.52,
        h * 0.5,
        Math.min(w, h) * 0.12,
        w * 0.52,
        h * 0.5,
        Math.max(w, h) * 0.78,
      );
      vignette.addColorStop(0.48, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,.66)");
      a.fillStyle = vignette;
      a.fillRect(0, 0, w, h);
    }

    function frame(now: number) {
      const b = beam(now);
      currentBeam = b;
      paintAtmosphere(now, b);

      targets.forEach((el) => {
        const l = targetLight(el, b);
        el.classList.toggle("is-lit", l > 0.15);
        if (el.classList.contains("home-login")) {
          el.style.opacity = String(Math.max(0, Math.min(1, (l - 0.045) * 2.3)));
        }
        el.querySelectorAll<HTMLElement>(".home-letter").forEach((letter) => {
          const r = letter.getBoundingClientRect();
          const light = lightAt(r.left + r.width / 2, r.top + r.height / 2, b);
          letter.style.opacity = String(Math.max(0, Math.min(1, (light - 0.025) * 2.35)));
          letter.classList.toggle("is-lit", light > 0.14);
        });
      });

      rafId = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    setBeamLightSampler((x, y) => lightAt(x, y, currentBeam));
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      setBeamLightSampler(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
}
