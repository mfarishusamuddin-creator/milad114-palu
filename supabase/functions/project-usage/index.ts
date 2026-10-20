// ============================================================================
// project-usage — ringkasan pemakaian project Supabase via Management API.
//
// CATATAN TOKEN:
//   Management API (api.supabase.com) memakai Personal Access Token (sbp_…).
//   Set di Edge Function secret:
//     supabase secrets set MANAGEMENT_API_TOKEN=sbp_xxx
//   (nama secret TIDAK boleh berawalan SUPABASE_ — reserved oleh Supabase.)
//   Bila belum diatur, fungsi mengembalikan { error: "not_configured" }.
//
// ENDPOINT (persis dari OpenAPI Management API v1):
//   GET /v1/projects/{ref}/analytics/endpoints/usage.api-requests-count
//   GET /v1/projects/{ref}/analytics/endpoints/usage.api-counts
//   GET /v1/projects/{ref}/config/disk/util
//   GET /v1/projects/{ref}/functions
//
// CATATAN CORS: supabase.functions.invoke dari browser = cross-origin, browser
// kirim preflight OPTIONS. Wajib tangani OPTIONS + header CORS.
// ============================================================================

const MANAGEMENT_TOKEN = Deno.env.get("MANAGEMENT_API_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const projectRef = (SUPABASE_URL.replace(/^https?:\/\//, "").split(".")[0] || "").trim();

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function json(body: unknown, status = 200, origin = "*") {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...corsHeaders(origin) },
  });
}

type MgmtResult = { data?: unknown; error?: { status: number; message: string } };

async function mgmt(path: string): Promise<MgmtResult> {
  const res = await fetch(`https://api.supabase.com${path}`, {
    headers: { Authorization: `Bearer ${MANAGEMENT_TOKEN}` },
  });
  if (!res.ok) {
    return { error: { status: res.status, message: (await res.text()).slice(0, 400) } };
  }
  return { data: await res.json() };
}

function sumArrayNumbers(arr: unknown, key: string): number {
  if (!Array.isArray(arr)) return 0;
  return arr.reduce((a, r) => a + (Number((r as Record<string, unknown>)?.[key]) || 0), 0);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "*";

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "GET" && req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, origin);
  }
  if (!MANAGEMENT_TOKEN || !projectRef) {
    return json({ error: "not_configured", message: "Supabase Management token belum dikonfigurasi." }, 200, origin);
  }

  try {
    const requests = await mgmt(`/v1/projects/${projectRef}/analytics/endpoints/usage.api-requests-count`);
    const counts = await mgmt(`/v1/projects/${projectRef}/analytics/endpoints/usage.api-counts`);
    const disk = await mgmt(`/v1/projects/${projectRef}/config/disk/util`);
    const funcs = await mgmt(`/v1/projects/${projectRef}/functions`);

    const totalApiRequests = sumArrayNumbers(
      (requests.data as { result?: unknown } | undefined)?.result,
      "count",
    );

    const breakdown = { auth: 0, rest: 0, storage: 0, realtime: 0 };
    const countsResult = (counts.data as { result?: unknown } | undefined)?.result;
    if (Array.isArray(countsResult)) {
      for (const r of countsResult) {
        const rec = r as Record<string, number>;
        breakdown.auth += rec.total_auth_requests || 0;
        breakdown.rest += rec.total_rest_requests || 0;
        breakdown.storage += rec.total_storage_requests || 0;
        breakdown.realtime += rec.total_realtime_requests || 0;
      }
    }

    const diskMetrics = (disk.data as { metrics?: { fs_used_bytes?: number; fs_size_bytes?: number } } | undefined)
      ?.metrics;
    const diskUsedBytes = diskMetrics?.fs_used_bytes ?? 0;
    const diskSizeBytes = diskMetrics?.fs_size_bytes ?? 0;

    const functionCount = Array.isArray(funcs.data) ? (funcs.data as unknown[]).length : null;

    return json(
      {
        ok: true,
        projectRef,
        summary: {
          totalApiRequests,
          authRequests: breakdown.auth,
          restRequests: breakdown.rest,
          storageRequests: breakdown.storage,
          realtimeRequests: breakdown.realtime,
          diskUsedBytes,
          diskSizeBytes,
          functionCount,
        },
        errors: {
          requests: requests.error ?? null,
          counts: counts.error ?? null,
          disk: disk.error ?? null,
          functions: funcs.error ?? null,
        },
      },
      200,
      origin,
    );
  } catch (err) {
    return json({ error: "exception", message: String(err instanceof Error ? err.message : err) }, 200, origin);
  }
});
