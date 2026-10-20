import { createContext, useContext } from "react";

/**
 * Kata kunci pencarian Tools Hub, dibagikan dari layout (`ToolsHubPage`) ke
 * view anak yang dirender lewat `<Outlet/>` (Overview & Favorit).
 *
 * Dipakai agar satu input pencarian di header bisa menyaring panel sisi
 * sekaligus grid konten tanpa prop drilling melalui router.
 */
export const ToolsSearchContext = createContext<string>("");

/** Ambil kata kunci pencarian Tools Hub saat ini. */
export function useToolsSearch(): string {
  return useContext(ToolsSearchContext);
}
