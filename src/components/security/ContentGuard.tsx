"use client";

import { useEffect } from "react";

/**
 * Lapisan deterrent sisi klien, bukan kontrol keamanan sebenarnya.
 *
 * Tujuan: mempersulit inspect element dan permintaan simpan/unduh dari menu
 * konteks browser. Determined user tetap bisa membuka DevTools lewat menu
 * browser, menonaktifkan JavaScript, atau mengambil aset lewat jaringan.
 * Karena itu jangan pernah mengandalkan komponen ini untuk melindungi data
 * rahasia; gunakan kontrol server/akses bila materinya benar-benar sensitif.
 */

/* Pintasan DevTools lintas browser: Chrome/Edge (I, J, C), Firefox (K, E, M). */
const DEVTOOLS_KEYS = new Set(["i", "j", "c", "k", "e", "m"]);

/* Simpan halaman, cetak, dan lihat sumber. */
const BROWSER_KEYS = new Set(["s", "p", "u"]);

function closest(target: EventTarget | null, selector: string): boolean {
  return target instanceof Element && target.closest(selector) !== null;
}

function isEditable(target: EventTarget | null): boolean {
  return closest(target, "input, textarea, select, [contenteditable='true']");
}

function isMedia(target: EventTarget | null): boolean {
  return closest(target, "img, picture, video, canvas, a[download]");
}

export function ContentGuard() {
  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => {
      /* Kolom isian tetap boleh memakai menu konteks (mis. tempel tanggal). */
      if (isEditable(event.target)) return;
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;
      const blocked =
        key === "f12" ||
        (modifier &&
          ((event.shiftKey && DEVTOOLS_KEYS.has(key)) ||
            BROWSER_KEYS.has(key)));

      if (!blocked) return;
      event.preventDefault();
      event.stopPropagation();
    };

    /* Cegah gambar/video diseret ke desktop atau tab lain. */
    const onDragStart = (event: DragEvent) => {
      if (!isMedia(event.target)) return;
      event.preventDefault();
    };

    /* Klik tengah pada media biasanya membuka gambar di tab baru. */
    const onAuxClick = (event: MouseEvent) => {
      if (event.button !== 1 || !isMedia(event.target)) return;
      event.preventDefault();
    };

    const options: AddEventListenerOptions = { capture: true };
    document.addEventListener("contextmenu", onContextMenu, options);
    document.addEventListener("keydown", onKeyDown, options);
    document.addEventListener("dragstart", onDragStart, options);
    document.addEventListener("auxclick", onAuxClick, options);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu, options);
      document.removeEventListener("keydown", onKeyDown, options);
      document.removeEventListener("dragstart", onDragStart, options);
      document.removeEventListener("auxclick", onAuxClick, options);
    };
  }, []);

  return null;
}
