"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./gradient-text.css";

const VARIANTS = ["linear", "flow", "conic"] as const;
const CIRCLE = Math.PI * 2;

export type GradientTextVariant = (typeof VARIANTS)[number];
export type GradientTextDirection = "horizontal" | "vertical" | "diagonal";

const ANGLES: Record<GradientTextDirection, number> = {
  horizontal: 90,
  vertical: 180,
  diagonal: 135,
};

const DEFAULT_COLORS = [
  "var(--gt-c1)",
  "var(--gt-c2)",
  "var(--gt-c3)",
  "var(--gt-c4)",
];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

type Setting = {
  colors: string[];
  speed: number;
  variant: GradientTextVariant;
  angle: number;
  scale: number;
  yoyo: boolean;
  pauseOnHover: boolean;
  followPointer: boolean;
};

type Props = {
  children: ReactNode;
  colors?: string[];
  animationSpeed?: number;
  variant?: GradientTextVariant;
  angle?: number;
  direction?: GradientTextDirection;
  scale?: number;
  yoyo?: boolean;
  glow?: number;
  showBorder?: boolean;
  borderWidth?: number;
  pauseOnHover?: boolean;
  followPointer?: boolean;
  block?: boolean;
  start?: boolean;
  className?: string;
  style?: CSSProperties;
};

type internalState = {
  time: number;
  inside: boolean;
  visible: boolean;
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  pull: number;
};

const imageFor = (
  setting: Setting,
  state: internalState
): string => {
  const list = setting.colors;
  const cycle = state.time / setting.speed;
  if (setting.variant === "flow") {
    const spin = cycle * CIRCLE;
    const blobs = list.map((color, index) => {
      const rate = 0.55 + ((index * 0.618) % 1) * 0.5;
      let x = 50 + 44 * Math.sin(spin * rate + index * 2.1);
      let y = 50 + 40 * Math.sin(spin * (rate * 0.83 + 0.21) + index * 1.3);
      if (index === 0) {
        x += (state.px * 100 - x) * state.pull;
        y += (state.py * 100 - y) * state.pull;
      }
      const width = (22 + 12 * setting.scale).toFixed(1);
      const height = (60 + 30 * setting.scale).toFixed(1);
      return `radial-gradient(ellipse ${width}% ${height}% at ${x.toFixed(2)}% ${y.toFixed(2)}%, ${color} 0%, transparent 100%)`;
    });
    return `${blobs.join(", ")}, linear-gradient(${setting.angle}deg, ${list.join(", ")})`;
  }
  if (setting.variant === "conic") {
    const sway = setting.yoyo
      ? Math.sin(cycle * Math.PI) * 50
      : cycle * 360;
    const cx = 50 + (state.px * 100 - 50) * state.pull;
    const cy = 260 + (state.py * 100 - 260) * state.pull;
    const stops =
      [...list, list[1] ?? list[0]]
        .map(
          (color, index) =>
            `${color} ${(((index / (list.length)) * 60 * (3 / setting.scale))).toFixed(2)}deg`
        )
        .join(", ");
    return `repeating-conic-gradient(from ${(sway - 30).toFixed(2)}deg at ${cx.toFixed(2)}% ${cy.toFixed(2)}%, ${stops})`;
  }
  const loop = [...list, list[1] ?? list[0] ?? list[0]];
  const period = 100 * setting.scale;
  let offset: number;
  if (setting.yoyo) {
    const swing = cycle % 2;
    const t = swing < 1 ? swing : 2 - swing;
    offset = (0.5 - Math.cos(Math.PI * t) / 2) * (period - 100);
  } else {
    offset = (cycle % 1) * period;
  }
  offset += (state.px - 0.5) * period * 0.5 * state.pull;
  const stops = loop
    .map(
      (color, index) =>
        `${color} ${(((index / (loop.length - 1)) * period) - offset).toFixed(2)}%`
    )
    .join(", ");
  return `repeating-linear-gradient(${setting.angle}deg, ${stops})`;
};

export default function GradientText({
  children,
  colors = DEFAULT_COLORS,
  animationSpeed = 8,
  variant = "linear",
  angle = 90,
  direction,
  scale = 3,
  yoyo = true,
  glow = 0,
  showBorder = false,
  borderWidth = 1.5,
  pauseOnHover = false,
  followPointer = false,
  block = false,
  start = false,
  className = "",
  style,
}: Props) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const wakeRef = useRef<(() => void) | null>(null);

  const palette =
    colors.length > 1
      ? colors
      : [colors[0] ?? DEFAULT_COLORS[0], colors[0] ?? DEFAULT_COLORS[0]];

  const setting: Setting = {
    colors: palette,
    speed: Math.max(0.2, animationSpeed),
    variant: VARIANTS.includes(variant) ? variant : "linear",
    angle: direction ? (ANGLES[direction] ?? angle) : angle,
    scale: clamp(scale, 1, 6),
    yoyo,
    pauseOnHover,
    followPointer,
  };
  const settingsRef = useRef<Setting>(setting);

  useEffect(() => {
    settingsRef.current = setting;
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const state: internalState = {
      time: 0,
      inside: false,
      visible: true,
      x: 0.5,
      y: 0.5,
      px: 0.5,
      py: 0.5,
      vx: 0,
      vy: 0,
      pull: 0,
    };
    let raf = 0;
    let last = 0;
    let alive = true;

    const paint = (): void => {
      root.style.setProperty("--gt-gradient", imageFor(settingsRef.current, state));
    };

    const tick = (now: number): void => {
      raf = 0;
      if (!alive) return;
      const current = settingsRef.current;
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      const paused = reduce || (current.pauseOnHover && state.inside);
      if (!paused) state.time += dt;
      const target = current.followPointer && state.inside ? 1 : 0;
      state.pull += (target - state.pull) * (1 - Math.exp(-dt * 6));
      const stiffness = 160;
      state.vx +=
        ((state.x - state.px) * stiffness - state.vx * 2 * Math.sqrt(stiffness)) *
        dt;
      state.vy +=
        ((state.y - state.py) * stiffness - state.vy * 2 * Math.sqrt(stiffness)) *
        dt;
      state.px += state.vx * dt;
      state.py += state.vy * dt;
      paint();
      const settling =
        Math.abs(state.pull - target) > 0.001 ||
        Math.abs(state.vx) + Math.abs(state.vy) > 0.001;
      if (!state.visible || (paused && !settling)) return;
      raf = requestAnimationFrame(tick);
    };

    const wake = (): void => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    wakeRef.current = () => {
      paint();
      wake();
    };

    const locate = (event: PointerEvent): void => {
      const rect = root.getBoundingClientRect();
      state.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      state.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    };
    const onEnter = (event: PointerEvent): void => {
      locate(event);
      if (!state.inside) {
        state.px = state.x;
        state.py = state.y;
      }
      state.inside = true;
      wake();
    };
    const onMove = (event: PointerEvent): void => {
      locate(event);
      wake();
    };
    const onLeave = (): void => {
      state.inside = false;
      wake();
    };

    const observer = new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
      if (state.visible) wake();
    });
    observer.observe(root);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    paint();
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      wakeRef.current = null;
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  const loop = [...palette, palette[palette.length - 1]];
  const baseAngle = direction ? ANGLES[direction] ?? angle : angle;
  const classes = [
    "gradient-text",
    showBorder ? "gradient-text--border" : "",
    block ? "gradient-text--fill" : "",
    start ? "gradient-text--start" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      ref={rootRef}
      className={classes}
      style={{
        "--gt-gradient": `linear-gradient(${baseAngle}deg, ${loop.join(", ")})`,
        "--gt-border": `${borderWidth}px`,
        "--gt-glow": clamp(glow, 0, 1),
        ...style,
      } as CSSProperties}
    >
      <span className="gradient-text__inner">
        <span className="gradient-text__content">{children}</span>
        {glow > 0 ? (
          <span className="gradient-text__glow" aria-hidden="true">
            {children}
          </span>
        ) : null}
      </span>
    </span>
  );
}
