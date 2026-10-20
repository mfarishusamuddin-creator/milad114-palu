import {
  listRecords,
  removeRecord,
  subscribeRecords,
  upsertRecord,
} from "./recordsApi";
import type { DataRecord, RecordChange } from "./types";

type RecordOp =
  | {
      type: "upsert";
      tool_slug: string;
      collection: string;
      record_id: string;
      data: Record<string, unknown>;
    }
  | { type: "delete"; tool_slug: string; collection: string; record_id: string };

const QUEUE_KEY = "pm_record_sync_queue";
let flushing = false;

function loadQueue(): RecordOp[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQueue(q: RecordOp[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch {
    /* abaikan error kuota */
  }
}

async function runOp(op: RecordOp): Promise<void> {
  if (op.type === "upsert") {
    await upsertRecord(op.tool_slug, op.collection, op.record_id, op.data);
  } else {
    await removeRecord(op.tool_slug, op.collection, op.record_id);
  }
}

async function flushQueue() {
  if (flushing) return;
  flushing = true;
  try {
    let queue = loadQueue();
    while (queue.length > 0) {
      const op = queue[0];
      try {
        await runOp(op);
      } catch (err) {
        console.error("[records] sync tertunda (dicoba ulang nanti):", err);
        return;
      }
      queue = loadQueue();
      queue.shift();
      saveQueue(queue);
    }
  } finally {
    flushing = false;
  }
}

function enqueue(op: RecordOp) {
  const queue = loadQueue();
  queue.push(op);
  saveQueue(queue);
  void flushQueue();
}

export interface HusamStore {
  list(toolSlug: string, collection: string): Promise<DataRecord[]>;
  upsert(
    toolSlug: string,
    collection: string,
    recordId: string,
    data: Record<string, unknown>,
  ): Promise<void>;
  remove(toolSlug: string, collection: string, recordId: string): Promise<void>;
  subscribe(
    toolSlug: string,
    collection: string,
    onChange: (change: RecordChange) => void,
  ): () => void;
}

declare global {
  interface Window {
    __husamCore?: { store: HusamStore };
  }
}

/**
 * Pasang Shared Core global (`window.__husamCore.store`). Tool di dalam iframe
 * (same-origin) memanggilnya langsung lewat `window.parent.__husamCore.store`.
 * Tulis (upsert/remove) masuk antrian tahan-offline + dicoba ulang saat online.
 */
export function installCore() {
  if (window.__husamCore) return;

  const store: HusamStore = {
    list: listRecords,
    async upsert(toolSlug, collection, recordId, data) {
      // Tulis langsung ke cloud (cepat, tanpa antrian) — antri hanya bila gagal/offline.
      try {
        await upsertRecord(toolSlug, collection, recordId, data);
      } catch (err) {
        console.error("[records] upsert gagal, masuk antrian:", err);
        enqueue({
          type: "upsert",
          tool_slug: toolSlug,
          collection,
          record_id: recordId,
          data,
        });
        // Teruskan error ke pemanggil: kegagalan tulis tidak boleh sunyi —
        // tool perlu memberi umpan balik (mis. toast) alih-alih tampak berhasil.
        throw err;
      }
    },
    async remove(toolSlug, collection, recordId) {
      try {
        await removeRecord(toolSlug, collection, recordId);
      } catch (err) {
        console.error("[records] remove gagal, masuk antrian:", err);
        enqueue({ type: "delete", tool_slug: toolSlug, collection, record_id: recordId });
        throw err;
      }
    },
    subscribe: subscribeRecords,
  };

  window.__husamCore = { store };
  window.addEventListener("online", () => void flushQueue());
  void flushQueue();
}
