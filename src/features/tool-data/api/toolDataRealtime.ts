import { supabase } from "@/lib/supabase";

export type ToolDataChange =
  | { type: "update"; key: string; value: string }
  | { type: "delete"; key: string };

/**
 * Berlangganan perubahan realtime tabel `tool_data` untuk satu tool (slug).
 *
 * Filter echo: perubahan yang datang dari device ini sendiri akan punya nilai
 * yang sudah sama dengan localStorage (karena tool menulis localStorage dulu
 * sebelum menembak ke cloud), sehingga diabaikan. Hanya perubahan yang benar-
 * benar datang dari device lain yang diterapkan ke localStorage lalu dilapor
 * lewat `onChange`. Operasi ini idempotent; race yang sangat jarang (dua tulis
 * beruntun ke key yang sama) akan terkoreksi sendiri oleh echo berikutnya.
 */
export function subscribeToToolData(
  slug: string,
  onChange: (change: ToolDataChange) => void,
): () => void {
  const channel = supabase
    .channel(`tool-data-${slug}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tool_data",
        filter: `tool_slug=eq.${slug}`,
      },
      (payload) => {
        const raw = (payload.new ?? payload.old) as
          | Record<string, unknown>
          | undefined;
        const key = raw?.key as string | undefined;
        if (!key) return;

        const isDelete = payload.eventType === "DELETE";
        const next = payload.new as Record<string, unknown> | undefined;
        const remoteValue = isDelete ? null : ((next?.value as string | undefined) ?? null);
        const localValue = window.localStorage.getItem(key);

        const differs = isDelete
          ? localValue !== null
          : localValue !== remoteValue;

        if (!differs) return;

        if (isDelete) {
          window.localStorage.removeItem(key);
          onChange({ type: "delete", key });
        } else {
          window.localStorage.setItem(key, remoteValue as string);
          onChange({ type: "update", key, value: remoteValue as string });
        }
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
