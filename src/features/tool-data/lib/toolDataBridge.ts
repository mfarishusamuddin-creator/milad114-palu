import {
  clearToolData,
  deleteToolDataKeys,
  upsertToolData,
} from "../api/toolData.api";

export interface ToolDataBridgeEntry {
  key: string;
  value: string;
}

export interface ToolDataBridge {
  write: (slug: string, entries: ToolDataBridgeEntry[]) => void;
  remove: (slug: string, keys: string[]) => void;
  clear: (slug: string) => void;
}

declare global {
  interface Window {
    __toolDataBridge?: ToolDataBridge;
  }
}

type SyncOp =
  | { type: "upsert"; slug: string; entries: ToolDataBridgeEntry[] }
  | { type: "delete"; slug: string; keys: string[] }
  | { type: "clear"; slug: string };

/**
 * Antrian tulis yang tahan-offline. Setiap perubahan data tool dimasukkan ke
 * antrian lalu langsung dicoba-kirim; bila gagal (offline/error) operasi tetap
 * tersimpan di localStorage dan dicoba ulang saat `online` kembali atau saat
 * aplikasi dimuat berikutnya. Operasi upsert/delete/clear semuanya idempotent,
 * sehingga pengulangan aman (tidak menimbulkan duplikasi data).
 */
const QUEUE_KEY = "pm_tool_sync_queue";
let flushing = false;

function loadQueue(): SyncOp[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: SyncOp[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    /* abaikan error kuota/parse */
  }
}

async function runOp(op: SyncOp): Promise<void> {
  switch (op.type) {
    case "upsert":
      await upsertToolData(op.slug, op.entries);
      return;
    case "delete":
      await deleteToolDataKeys(op.slug, op.keys);
      return;
    case "clear":
      await clearToolData(op.slug);
      return;
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
        console.error("[tool-data] sync tertunda (dicoba ulang nanti):", err);
        return;
      }
      // Baca ulang dari localStorage agar operasi yang masuk bersamaan tidak hilang.
      queue = loadQueue();
      queue.shift();
      saveQueue(queue);
    }
  } finally {
    flushing = false;
  }
}

function enqueue(op: SyncOp) {
  const queue = loadQueue();
  queue.push(op);
  saveQueue(queue);
  void flushQueue();
}

/**
 * Pasang jembatan global yang dipanggil tool (di dalam iframe, same-origin)
 * untuk meneruskan perubahan localStorage ke Supabase. Dipanggil sekali di
 * main.tsx (sebelum app render) sehingga selalu tersedia saat tool dimuat.
 */
export function installToolDataBridge() {
  if (window.__toolDataBridge) return;

  window.__toolDataBridge = {
    write(slug, entries) {
      if (entries.length) enqueue({ type: "upsert", slug, entries });
    },
    remove(slug, keys) {
      if (keys.length) enqueue({ type: "delete", slug, keys });
    },
    clear(slug) {
      enqueue({ type: "clear", slug });
    },
  };

  window.addEventListener("online", () => void flushQueue());
  void flushQueue();
}
