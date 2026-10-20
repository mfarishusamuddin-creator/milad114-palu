import { useEffect, useMemo, useRef, useState } from "react";
import { GripHorizontal } from "lucide-react";

import { buildToolSrcDoc } from "@/features/tool-data/lib/storage-bridge";
import type { ToolDataMap } from "@/features/tool-data/types";

const MIN_HEIGHT = 200;
const MAX_HEIGHT = 100000;

function heightKey(slug: string) {
  return `pm_tool_h_${slug}`;
}

function defaultHeight() {
  return Math.round((window.innerHeight || 800) * 0.75);
}

interface ResizableHtmlToolFrameProps {
  html: string;
  title: string;
  slug: string;
  /** Bila disediakan, tool dirender dengan persistensi cloud (seed + bridge). */
  toolData?: ToolDataMap;
}

/**
 * HtmlToolFrame + kontrol tinggi manual.
 *
 * Dipakai di admin (bukan publik): karena tool standalone banyak memakai layout
 * fixed-viewport (height:100vh), auto-resize via postMessage tidak andal — tinggi
 * diukur dari scrollHeight sering menipu. Solusi: pengguna menggeser handle di
 * bawah iframe untuk mengatur tinggi, dan ukurannya diingat per-slug (localStorage).
 *
 * Pengingat keamanan (sama seperti HtmlToolFrame): sandbox menyertakan
 * allow-same-origin → iframe berbagi origin dengan aplikasi; hanya untuk tool
 * milik sendiri, bukan sumber tak dikenal.
 */
export function ResizableHtmlToolFrame({ html, title, slug, toolData }: ResizableHtmlToolFrameProps) {
  const [height, setHeight] = useState<number>(() => {
    const stored = Number(localStorage.getItem(heightKey(slug)));
    return Number.isFinite(stored) && stored > 0 ? stored : defaultHeight();
  });
  const dragging = useRef(false);

  const srcDoc = useMemo(
    () => (toolData ? buildToolSrcDoc(html, slug, toolData) : html),
    [html, slug, toolData],
  );

  useEffect(() => {
    localStorage.setItem(heightKey(slug), String(Math.round(height)));
  }, [height, slug]);

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    dragging.current = true;
    const startY = e.clientY;
    const startH = height;

    const onMove = (ev: PointerEvent) => {
      if (!dragging.current) return;
      const next = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startH + (ev.clientY - startY)));
      setHeight(next);
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div className="flex w-full flex-col">
      <div className="w-full overflow-hidden rounded-lg border border-border bg-background">
        <iframe
          srcDoc={srcDoc}
          title={title}
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals allow-downloads"
          style={{ height, width: "100%" }}
          className="block border-0 bg-background"
        />
      </div>
      <button
        type="button"
        onPointerDown={onPointerDown}
        onDoubleClick={() => setHeight(defaultHeight())}
        aria-label="Seret untuk mengubah tinggi tool (klik ganda = reset)"
        title="Seret untuk mengubah tinggi · klik ganda untuk reset"
        className="group mt-1 flex h-6 w-full touch-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <GripHorizontal size={18} className="opacity-60 group-hover:opacity-100" />
      </button>
    </div>
  );
}
