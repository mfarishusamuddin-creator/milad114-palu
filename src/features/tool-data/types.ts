/** Satu entri data tool. `value` menyimpan string localStorage apa adanya. */
export interface ToolDataEntry {
  tool_slug: string;
  key: string;
  value: string;
}

/** Snapshot seluruh data satu tool: key -> string value (localStorage). */
export type ToolDataMap = Record<string, string>;
