import { type ReactNode, useState } from "react";
import { Maximize2, Minimize2, Expand } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSettings } from "@/features/settings/hooks/useSettings";
import type { NavLayoutSettings } from "@/features/settings/types";
import { Button } from "@/components/ui/button";

export interface PanelZone {
  name: string;
  content: ReactNode;
}

interface PanelLayoutProps {
  title: string;
  kicker: string;
  /** Zones this page needs — declare only what's relevant, e.g. Resources
   * needs left+left2+bottom, Account & Role just needs left. */
  left?: PanelZone;
  left2?: PanelZone;
  right?: PanelZone;
  right2?: PanelZone;
  bottom?: PanelZone;
  sidePosition?: "left" | "right";
  children: ReactNode;
}

function ZoneBox({ zone }: { zone: PanelZone }) {
  return (
    <div className="flex w-48 shrink-0 flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {zone.name}
      </p>
      {zone.content}
    </div>
  );
}

// Navigation hierarchy: top (AdminTopNav, outside this) -> side, left/right,
// possibly doubled -> bottom. Zone structure is declared per-page in code;
// only the left/right flip and fullscreen state are settings-driven.
export function PanelLayout({
  title,
  kicker,
  left,
  left2,
  right,
  right2,
  bottom,
  sidePosition,
  children,
}: PanelLayoutProps) {
  const { data: settings } = useSettings();
  const resolvedSide =
    sidePosition ?? (settings?.nav_layout as NavLayoutSettings | undefined)?.sidePosition ?? "left";
  const [centerFullscreen, setCenterFullscreen] = useState(false);

  async function toggleBrowserFullscreen() {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }

  const firstSide = resolvedSide === "left" ? [left, left2] : [right, right2];
  const secondSide = resolvedSide === "left" ? [right, right2] : [left, left2];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-kicker">{kicker}</p>
          <h1 className="mt-1 text-xl font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCenterFullscreen((v) => !v)}
            aria-label="Fullscreen konten (sembunyikan panel)"
          >
            {centerFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleBrowserFullscreen}
            aria-label="Fullscreen tab browser"
          >
            <Expand size={14} />
          </Button>
        </div>
      </div>

      <div className={cn("flex flex-1 gap-6", centerFullscreen && "gap-0")}>
        {!centerFullscreen &&
          firstSide.map((z, i) => z && <ZoneBox key={`a${i}`} zone={z} />)}
        <div className="min-w-0 flex-1">{children}</div>
        {!centerFullscreen &&
          secondSide.map((z, i) => z && <ZoneBox key={`b${i}`} zone={z} />)}
      </div>

      {!centerFullscreen && bottom && (
        <div className="border-t border-border pt-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            {bottom.name}
          </p>
          {bottom.content}
        </div>
      )}
    </div>
  );
}
