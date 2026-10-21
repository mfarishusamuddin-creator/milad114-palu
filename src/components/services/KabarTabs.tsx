"use client";

import { useState } from "react";
import { KabarCard } from "@/components/shared/KabarCard";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
import type { KabarItem } from "@/lib/kabar";

type Props = {
  latest: KabarItem[];
  milad: KabarItem[];
  dict: Dictionary;
};

export function KabarTabs({ latest, milad, dict }: Props) {
  const [tab, setTab] = useState<"latest" | "milad">("latest");
  const source = tab === "latest" ? latest : milad.length > 0 ? milad : latest;
  const items = source.slice(0, 6);

  return (
    <div>
      <div
        className="flex flex-wrap items-center justify-between gap-3"
        role="tablist"
        aria-label={dict.kabar.title}
      >
        <div className="inline-flex rounded-sm border border-line bg-surface p-1">
          <button
            type="button"
            role="tab"
            id="tab-terbaru"
            aria-selected={tab === "latest"}
            aria-controls="panel-kabar"
            onClick={() => setTab("latest")}
            className={cn(
              "rounded-sm px-4 py-1.5 text-xs font-bold transition-colors",
              tab === "latest"
                ? "bg-navy text-white"
                : "text-ink-soft hover:text-navy"
            )}
          >
            {dict.kabar.tabs.latest}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-milad"
            aria-selected={tab === "milad"}
            aria-controls="panel-kabar"
            onClick={() => setTab("milad")}
            className={cn(
              "rounded-sm px-4 py-1.5 text-xs font-bold transition-colors",
              tab === "milad"
                ? "bg-navy text-white"
                : "text-ink-soft hover:text-navy"
            )}
          >
            {dict.kabar.tabs.milad}
          </button>
        </div>

        <a
          href="https://muhammadiyah.or.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-ocean underline"
        >
          {dict.kabar.source}: muhammadiyah.or.id
        </a>
      </div>

      <div
        id="panel-kabar"
        role="tabpanel"
        aria-labelledby={tab === "latest" ? "tab-terbaru" : "tab-milad"}
        className="mt-6"
      >
        {items.length > 0 ? (
          <div className="grid gap-x-8 md:grid-cols-2">
            {items.map((item) => (
              <KabarCard key={item.id} item={item} dict={dict} variant="compact" />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-line bg-bg-soft p-6">
            <p className="text-sm text-ink-soft">{dict.kabar.empty}</p>
          </div>
        )}
      </div>

      <p className="mt-5 text-xs text-ink-soft">{dict.kabar.originalNote}</p>
    </div>
  );
}
