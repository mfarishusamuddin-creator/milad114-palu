"use client";

import { useState } from "react";
import { KabarCard } from "@/components/shared/KabarCard";
import { cn } from "@/lib/cn";
import type { KabarItem } from "@/lib/kabar";

type Props = {
  latest: KabarItem[];
  milad: KabarItem[];
};

export function KabarTabs({ latest, milad }: Props) {
  const [tab, setTab] = useState<"latest" | "milad">("latest");
  const source = tab === "latest" ? latest : milad.length > 0 ? milad : latest;
  const items = source.slice(0, 6);

  return (
    <div>
      <div
        className="flex flex-wrap items-center justify-between gap-3"
        role="tablist"
        aria-label="Kategori kabar"
      >
        <div className="inline-flex rounded-full border border-line bg-white p-1">
          <button
            type="button"
            role="tab"
            id="tab-terbaru"
            aria-selected={tab === "latest"}
            aria-controls="panel-kabar"
            onClick={() => setTab("latest")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
              tab === "latest"
                ? "bg-navy text-white"
                : "text-ink-soft hover:text-navy"
            )}
          >
            Terbaru
          </button>
          <button
            type="button"
            role="tab"
            id="tab-milad"
            aria-selected={tab === "milad"}
            aria-controls="panel-kabar"
            onClick={() => setTab("milad")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
              tab === "milad"
                ? "bg-navy text-white"
                : "text-ink-soft hover:text-navy"
            )}
          >
            Milad &amp; Tanwir
          </button>
        </div>

        <a
          href="https://muhammadiyah.or.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-teal-deep underline"
        >
          Buka muhammadiyah.or.id
        </a>
      </div>

      <div
        id="panel-kabar"
        role="tabpanel"
        aria-labelledby={tab === "latest" ? "tab-terbaru" : "tab-milad"}
        className="mt-6"
      >
        {items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <KabarCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-bg-soft p-6">
            <p className="text-sm text-ink-soft">
              Kabar resmi sedang tidak dapat dimuat. Silakan buka langsung{" "}
              <a
                href="https://muhammadiyah.or.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-navy underline"
              >
                muhammadiyah.or.id
              </a>
              .
            </p>
          </div>
        )}
      </div>

      <p className="mt-5 text-xs text-ink-soft">
        Judul, tanggal, dan ringkasan diambil dari kanal resmi Muhammadiyah.
        Artikel lengkap tetap berada di sumber asli. Cache data satu jam.
      </p>
    </div>
  );
}
