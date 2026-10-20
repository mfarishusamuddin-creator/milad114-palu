import type { ToolDataMap } from "../types";

/**
 * Snipet bootstrap yang disuntikkan ke dalam HTML tool (sebelum script tool
 * sendiri jalan). Berjalan di realm iframe, berbagi origin dengan parent
 * (karena sandbox menyertakan allow-same-origin), sehingga bisa:
 *   1. Membaca window.__TOOL_DATA__ (di-inject parent) -> seed localStorage
 *      agar data cloud tampil seolah-olah data lokal tool.
 *   2. Mem-patch Storage.prototype (setItem/removeItem/clear) agar setiap
 *      perubahan data tool dilaporkan ke parent (window.__toolDataBridge)
 *      -> parent meneruskannya ke Supabase. Dengan begitu tool tetap memakai
 *      localStorage apa adanya, tapi setiap perubahan tersimpan ke cloud.
 *
 * Tidak boleh memuat teks "</script>" di dalam string ini.
 */

export const BRIDGE_SHIM = (function () {
  var INITIAL_DATA_KEY = "__TOOL_DATA__";
  var SLUG_KEY = "__TOOL_SLUG__";
  var DEBOUNCE_MS = 400;

  return [
    "(function(){",
    "  var slug = window." + SLUG_KEY + ";",
    "  var initial = window." + INITIAL_DATA_KEY + " || {};",
    "  try {",
    "    for (var k in initial) {",
    "      try { localStorage.setItem(k, initial[k]); } catch (e) {}",
    "    }",
    "  } catch (e) {}",
    "",
    "  var bridge = (function(){ try { return window.parent && window.parent.__toolDataBridge; } catch (e) { return null; } })();",
    "  if (!bridge || !slug) return;",
    "",
    "  var pending = {};",
    "  var timer = null;",
    "  function flush() {",
    "    var entries = [];",
    "    for (var pk in pending) entries.push({ key: pk, value: pending[pk] });",
    "    pending = {};",
    "    timer = null;",
    "    if (entries.length) { try { bridge.write(slug, entries); } catch (e) {} }",
    "  }",
    "  function schedule(key, value) {",
    "    pending[key] = value;",
    "    if (timer) { clearTimeout(timer); }",
    "    timer = setTimeout(flush, " + DEBOUNCE_MS + ");",
    "  }",
    "  try { window.addEventListener('beforeunload', flush); } catch (e) {}",
    "  try { window.addEventListener('pagehide', flush); } catch (e) {}",
    "",
    "  var _set = Storage.prototype.setItem;",
    "  var _remove = Storage.prototype.removeItem;",
    "  var _clear = Storage.prototype.clear;",
    "",
    "  Storage.prototype.setItem = function (key, value) {",
    "    var isLocal = (this === window.localStorage);",
    "    _set.call(this, key, value);",
    "    if (isLocal) schedule(String(key), String(value));",
    "  };",
    "  Storage.prototype.removeItem = function (key) {",
    "    var isLocal = (this === window.localStorage);",
    "    _remove.call(this, key);",
    "    if (isLocal) { try { bridge.remove(slug, [String(key)]); } catch (e) {} }",
    "  };",
    "  Storage.prototype.clear = function () {",
    "    var isLocal = (this === window.localStorage);",
    "    _clear.call(this);",
    "    if (isLocal) { try { bridge.clear(slug); } catch (e) {} }",
    "  };",
    "})();",
  ].join("");
})();

/** Hindari `</script` dalam data yang di-inject agar tidak memutus tag script. */
function safeJson(value: unknown): string {
  return JSON.stringify(value ?? {}).replace(/</g, "\\u003c");
}

function injectAfterHead(html: string, snippet: string): string {
  const head = /<head[^>]*>/i.exec(html);
  if (head) {
    const idx = head.index + head[0].length;
    return html.slice(0, idx) + snippet + html.slice(idx);
  }
  const htmlTag = /<html[^>]*>/i.exec(html);
  if (htmlTag) {
    const idx = htmlTag.index + htmlTag[0].length;
    return html.slice(0, idx) + snippet + html.slice(idx);
  }
  return snippet + html;
}

/**
 * Bangun dokumen iframe final: HTML tool asli + bootstrap cloud (seed data +
 * intercept localStorage ke parent). Dipakai di render tool privat admin.
 */
export function buildToolSrcDoc(
  html: string,
  slug: string,
  data: ToolDataMap,
): string {
  const vars =
    "<script>window.__TOOL_SLUG__=" +
    safeJson(slug) +
    ";window.__TOOL_DATA__=" +
    safeJson(data) +
    ";</script>";

  return injectAfterHead(html, vars + "<script>" + BRIDGE_SHIM + "</scr" + "ipt>");
}
