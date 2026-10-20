import { supabase } from "@/lib/supabase";
import type { DataRecord, RecordChange } from "./types";

/** Ambil semua record satu koleksi (diurutkan stabil by created_at). */
export async function listRecords(
  toolSlug: string,
  collection: string,
): Promise<DataRecord[]> {
  const { data, error } = await supabase
    .from("records")
    .select("id, record_id, data")
    .eq("tool_slug", toolSlug)
    .eq("collection", collection)
    .eq("deleted", false)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;
  return (data ?? []) as DataRecord[];
}

/** Buat/perbarui satu record (per-record, independen antar device). */
export async function upsertRecord(
  toolSlug: string,
  collection: string,
  recordId: string,
  data: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from("records").upsert(
    {
      tool_slug: toolSlug,
      collection,
      record_id: recordId,
      data,
      deleted: false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "tool_slug,collection,record_id" },
  );
  if (error) {
    console.error("[records] upsert GAGAL:", {
      toolSlug,
      collection,
      recordId,
      code: error.code,
      message: error.message,
    });
    throw error;
  }
  console.info("[records] upsert OK:", { toolSlug, collection, recordId });
}

/** Hapus satu record (soft-delete). */
export async function removeRecord(
  toolSlug: string,
  collection: string,
  recordId: string,
): Promise<void> {
  // .select() agar jumlah baris terdampak terlihat: UPDATE yang mengenai 0 baris
  // berarti tidak ada event realtime — kegagalan yang tadinya sunyi jadi teramati.
  const { data, error } = await supabase
    .from("records")
    .update({ deleted: true, updated_at: new Date().toISOString() })
    .eq("tool_slug", toolSlug)
    .eq("collection", collection)
    .eq("record_id", recordId)
    .select("record_id");
  if (error) {
    console.error("[records] remove GAGAL:", {
      toolSlug,
      collection,
      recordId,
      code: error.code,
      message: error.message,
    });
    throw error;
  }
  const affected = data?.length ?? 0;
  if (affected === 0) {
    console.warn(
      "[records] remove TIDAK mengenai baris apa pun (record tidak ada di cloud) — tidak akan ada event realtime:",
      { toolSlug, collection, recordId },
    );
    return;
  }
  console.info("[records] remove OK (soft-delete):", {
    toolSlug,
    collection,
    recordId,
    affected,
  });
}

/**
 * Berlangganan perubahan realtime koleksi `records` untuk (tool, collection).
 * Mengembalikan fungsi unsubscribe. Filter collection dilakukan client-side
 * (Realtime filter satu kolom sudah dipakai untuk tool_slug).
 */
export function subscribeRecords(
  toolSlug: string,
  collection: string,
  onChange: (change: RecordChange) => void,
): () => void {
  // Topik unik per langganan: mencegah bentrok dengan channel lama yang belum
  // ter-unsubscribe, yang akan melempar "cannot add postgres_changes … after subscribe()".
  const topic = `records-${toolSlug}-${collection}-${Math.random().toString(36).slice(2, 10)}`;
  const channel = supabase
    .channel(topic)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "records",
        filter: `tool_slug=eq.${toolSlug}`,
      },
      (payload) => {
        const newRow = payload.new as Record<string, unknown> | undefined;
        const oldRow = payload.old as Record<string, unknown> | undefined;
        // Debug marker: buktikan apakah event sampai, dan APA bentuk nilai `deleted`
        // di payload (boolean vs string vs lainnya). JANGAN dihapus sebelum
        // sinkronisasi delete terverifikasi end-to-end di 2 device.
        console.info("[records-rt] event diterima:", {
          topic,
          eventType: payload.eventType,
          newCollection: newRow?.collection,
          newRecordId: newRow?.record_id,
          deleted: newRow?.deleted,
          deletedType: typeof newRow?.deleted,
          oldCollection: oldRow?.collection,
          oldRecordId: oldRow?.record_id,
        });

        if (payload.eventType === "DELETE") {
          // Pengaman (hard delete, mis. dibersihkan manual): butuh REPLICA IDENTITY.
          const old = payload.old as Record<string, unknown> | undefined;
          if (old?.collection !== collection) return;
          onChange({ type: "delete", recordId: old.record_id as string });
          return;
        }

        const row = payload.new as Record<string, unknown> | undefined;
        if (row?.collection !== collection) return;

        if (row.deleted === true) {
          onChange({ type: "delete", recordId: row.record_id as string });
        } else {
          onChange({
            type: "upsert",
            record: {
              id: row?.id as string,
              record_id: row?.record_id as string,
              data: row?.data as Record<string, unknown>,
            },
          });
        }
      },
    )
    .subscribe((status, err) => {
      if (status === "SUBSCRIBED") {
        console.info("[records-rt] channel aktif:", topic);
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        console.error("[records-rt] channel bermasalah:", topic, status, err);
      } else if (status === "CLOSED") {
        console.warn("[records-rt] channel ditutup:", topic);
      }
    });

  return () => {
    void supabase.removeChannel(channel);
  };
}
