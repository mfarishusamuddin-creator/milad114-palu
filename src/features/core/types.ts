/** Satu record milik tool. `data` adalah objek record (bukan array/blob utuh). */
export interface DataRecord {
  id: string;
  record_id: string;
  data: Record<string, unknown>;
}

export type RecordChange =
  | { type: "upsert"; record: DataRecord }
  | { type: "delete"; recordId: string };
