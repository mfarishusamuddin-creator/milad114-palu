"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

export type TimelineItem = {
  title: string;
  content: ReactNode;
};

type Props = {
  data: TimelineItem[];
};

export function Timeline({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 12%", "end 55%"],
  });

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-clip"
    >
      <div className="relative">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative flex gap-4 pb-12 last:pb-0 sm:gap-6 md:pb-16"
          >
            <div className="relative z-10 flex w-10 flex-none justify-center self-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface">
                <div
                  className="h-2.5 w-2.5 rounded-full bg-gold"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="w-full">
              <h3 className="font-serif text-xl font-bold text-gold-text md:text-2xl">
                {item.title}
              </h3>
              <div className="mt-3">{item.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 start-5 w-[2px] -translate-x-1/2 rtl:translate-x-1/2"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-line) 8%, var(--color-line) 92%, transparent)",
        }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-x-0 top-0 w-full"
          style={{
            height: progressHeight,
            background:
              "linear-gradient(to bottom, transparent 0%, #ca9a00 10%, #1c469f 100%)",
          }}
        />
      </div>
    </div>
  );
}
