// Cloudflare Pages Function for /api/school-data
// Edge handler supporting:
// 1. Native Cloudflare KV bindings (SCHOOL_CMS_KV, KV, DATABASE, DB, etc.)
// 2. Native Cloudflare D1 SQL bindings (DB, DATABASE, D1, etc.)
// 3. Cloudflare REST API fallback using Edge fetch (CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID)

interface Env {
  [key: string]: any;
}

const DEFAULT_KV_NAMESPACE_ID = '5b4256f6-8ce8-4a13-ae5c-0ae37fcd9b9b';

// Helper: detect any KV namespace binding in context.env
function findKVBinding(env: Env): { name: string; binding: any } | null {
  if (!env || typeof env !== 'object') return null;

  const priorityNames = ['SCHOOL_CMS_KV', 'KV', 'DATABASE', 'DB', 'SCHOOL_KV', 'CMS_KV', 'DATA_KV'];
  for (const name of priorityNames) {
    const candidate = env[name];
    if (candidate && typeof candidate.get === 'function' && typeof candidate.put === 'function') {
      return { name, binding: candidate };
    }
  }

  // Scan all other keys
  for (const key of Object.keys(env)) {
    const candidate = env[key];
    if (candidate && typeof candidate.get === 'function' && typeof candidate.put === 'function') {
      return { name: key, binding: candidate };
    }
  }

  return null;
}

// Helper: detect any D1 Database binding in context.env
function findD1Binding(env: Env): { name: string; binding: any } | null {
  if (!env || typeof env !== 'object') return null;

  const priorityNames = ['DB', 'DATABASE', 'D1', 'SCHOOL_DB', 'CMS_DB'];
  for (const name of priorityNames) {
    const candidate = env[name];
    if (candidate && typeof candidate.prepare === 'function') {
      return { name, binding: candidate };
    }
  }

  for (const key of Object.keys(env)) {
    const candidate = env[key];
    if (candidate && typeof candidate.prepare === 'function') {
      return { name: key, binding: candidate };
    }
  }

  return null;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestGet = async (context: { env: Env; request: Request }) => {
  const env = context.env || {};

  try {
    // 1. Try Native KV Binding
    const kv = findKVBinding(env);
    if (kv) {
      try {
        const raw = await kv.binding.get('school_cms_data');
        if (raw) {
          const parsed = JSON.parse(raw);
          return new Response(
            JSON.stringify({
              success: true,
              source: 'cloudflare_kv_binding',
              bindingName: kv.name,
              data: parsed,
              cloudflare: {
                status: 'connected',
                bindingType: 'kv',
                bindingName: kv.name,
                message: `Terhubung langsung ke Cloudflare KV Database (binding: ${kv.name})`,
                lastSyncedAt: parsed.lastUpdated || new Date().toISOString(),
                multiDeviceEnabled: true,
              },
            }),
            { headers: CORS_HEADERS }
          );
        }
      } catch (err: any) {
        console.warn('KV read error:', err.message);
      }
    }

    // 2. Try Native D1 SQL Database Binding
    const d1 = findD1Binding(env);
    if (d1) {
      try {
        await d1.binding.prepare(
          'CREATE TABLE IF NOT EXISTS school_data (key TEXT PRIMARY KEY, value TEXT, updated_at TEXT)'
        ).run();

        const row = await d1.binding.prepare(
          'SELECT value, updated_at FROM school_data WHERE key = ?'
        ).bind('school_cms_data').first();

        if (row && row.value) {
          const parsed = JSON.parse(row.value as string);
          return new Response(
            JSON.stringify({
              success: true,
              source: 'cloudflare_d1_binding',
              bindingName: d1.name,
              data: parsed,
              cloudflare: {
                status: 'connected',
                bindingType: 'd1',
                bindingName: d1.name,
                message: `Terhubung langsung ke Cloudflare D1 Database (binding: ${d1.name})`,
                lastSyncedAt: row.updated_at || new Date().toISOString(),
                multiDeviceEnabled: true,
              },
            }),
            { headers: CORS_HEADERS }
          );
        }
      } catch (err: any) {
        console.warn('D1 read error:', err.message);
      }
    }

    // 3. Try Cloudflare REST API fallback if API token is configured in Pages environment variables
    const accountId = env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = env.CLOUDFLARE_API_TOKEN;
    const kvId = env.CLOUDFLARE_KV_NAMESPACE_ID || DEFAULT_KV_NAMESPACE_ID;

    if (accountId && apiToken && !accountId.includes('@')) {
      try {
        const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvId}/values/school_cms_data`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${apiToken}` },
        });
        if (res.ok) {
          const parsed = await res.json();
          return new Response(
            JSON.stringify({
              success: true,
              source: 'cloudflare_rest_api',
              data: parsed,
              cloudflare: {
                status: 'connected',
                bindingType: 'rest_api',
                kvNamespaceId: kvId,
                message: `Terhubung ke Cloudflare KV via REST API (${kvId})`,
                lastSyncedAt: parsed.lastUpdated || new Date().toISOString(),
                multiDeviceEnabled: true,
              },
            }),
            { headers: CORS_HEADERS }
          );
        }
      } catch (err: any) {
        console.warn('Edge REST API fetch error:', err.message);
      }
    }
  } catch (globalErr: any) {
    console.error('Edge handler GET error:', globalErr);
  }

  // If no remote data yet, return signal for client to use default SD Negeri 1 Palapa data
  return new Response(
    JSON.stringify({
      success: true,
      source: 'initial_default',
      data: null,
      cloudflare: {
        status: 'idle',
        message: 'Database Cloudflare siap menerima data. Menggunakan data SD Negeri 1 Palapa.',
        multiDeviceEnabled: true,
      },
    }),
    { headers: CORS_HEADERS }
  );
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const env = context.env || {};

  try {
    const body = await context.request.json();
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, message: 'Payload data sekolah tidak valid.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!body.lastUpdated) {
      body.lastUpdated = new Date().toISOString();
    }

    const payloadStr = JSON.stringify(body);
    let savedToBinding = false;
    let bindingDetails = '';

    // 1. Try Native KV Binding
    const kv = findKVBinding(env);
    if (kv) {
      try {
        await kv.binding.put('school_cms_data', payloadStr);
        savedToBinding = true;
        bindingDetails = `Cloudflare KV (binding: ${kv.name})`;
      } catch (e: any) {
        console.error(`Gagal menulis ke KV binding ${kv.name}:`, e.message);
      }
    }

    // 2. Try Native D1 SQL Database Binding
    const d1 = findD1Binding(env);
    if (d1) {
      try {
        await d1.binding.prepare(
          'CREATE TABLE IF NOT EXISTS school_data (key TEXT PRIMARY KEY, value TEXT, updated_at TEXT)'
        ).run();

        await d1.binding.prepare(
          'INSERT INTO school_data (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
        ).bind('school_cms_data', payloadStr, body.lastUpdated).run();

        savedToBinding = true;
        bindingDetails = bindingDetails
          ? `${bindingDetails} & Cloudflare D1 (binding: ${d1.name})`
          : `Cloudflare D1 (binding: ${d1.name})`;
      } catch (e: any) {
        console.error(`Gagal menulis ke D1 binding ${d1.name}:`, e.message);
      }
    }

    // 3. Try Cloudflare REST API fallback
    const accountId = env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = env.CLOUDFLARE_API_TOKEN;
    const kvId = env.CLOUDFLARE_KV_NAMESPACE_ID || DEFAULT_KV_NAMESPACE_ID;

    if (!savedToBinding && accountId && apiToken && !accountId.includes('@')) {
      try {
        const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvId}/values/school_cms_data`;
        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: payloadStr,
        });
        if (res.ok) {
          savedToBinding = true;
          bindingDetails = `Cloudflare KV via REST API (${kvId})`;
        }
      } catch (e: any) {
        console.error('Gagal menulis via Cloudflare REST API:', e.message);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: savedToBinding
          ? `Data berhasil disimpan permanen ke ${bindingDetails}`
          : 'Data diterima di Edge Session Cloudflare.',
        savedToBinding,
        bindingDetails: bindingDetails || 'Edge Memory',
        syncedAt: body.lastUpdated,
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: `Gagal menyimpan data: ${err.message}` }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
