// Cloudflare Worker Entry Point (for Cloudflare Workers deployment)
// Supports Native KV bindings, Native D1 bindings, and env.ASSETS static serving

interface Env {
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
  SCHOOL_CMS_KV?: any;
  KV?: any;
  DATABASE?: any;
  DB?: any;
  D1?: any;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_KV_NAMESPACE_ID?: string;
  [key: string]: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function findKVBinding(env: Env): { name: string; binding: any } | null {
  if (!env || typeof env !== 'object') return null;
  const priorityNames = ['SCHOOL_CMS_KV', 'KV', 'DATABASE', 'DB', 'SCHOOL_KV', 'CMS_KV', 'DATA_KV'];
  for (const name of priorityNames) {
    const candidate = env[name];
    if (candidate && typeof candidate.get === 'function' && typeof candidate.put === 'function') {
      return { name, binding: candidate };
    }
  }
  for (const key of Object.keys(env)) {
    const candidate = env[key];
    if (candidate && typeof candidate.get === 'function' && typeof candidate.put === 'function') {
      return { name: key, binding: candidate };
    }
  }
  return null;
}

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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 1. Route: /api/school-data
    if (url.pathname === '/api/school-data') {
      if (request.method === 'GET') {
        // Try KV
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
                    message: `Terhubung langsung ke Cloudflare KV (binding: ${kv.name})`,
                    lastSyncedAt: parsed.lastUpdated || new Date().toISOString(),
                    multiDeviceEnabled: true,
                  },
                }),
                { headers: CORS_HEADERS }
              );
            }
          } catch (e: any) {}
        }

        // Try D1
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
          } catch (e: any) {}
        }

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
      }

      if (request.method === 'POST') {
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== 'object') {
          return new Response(
            JSON.stringify({ success: false, message: 'Payload data tidak valid.' }),
            { status: 400, headers: CORS_HEADERS }
          );
        }
        if (!body.lastUpdated) {
          body.lastUpdated = new Date().toISOString();
        }
        const payloadStr = JSON.stringify(body);
        let saved = false;

        const kv = findKVBinding(env);
        if (kv) {
          try {
            await kv.binding.put('school_cms_data', payloadStr);
            saved = true;
          } catch (e: any) {}
        }

        const d1 = findD1Binding(env);
        if (d1) {
          try {
            await d1.binding.prepare(
              'CREATE TABLE IF NOT EXISTS school_data (key TEXT PRIMARY KEY, value TEXT, updated_at TEXT)'
            ).run();
            await d1.binding.prepare(
              'INSERT INTO school_data (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
            ).bind('school_cms_data', payloadStr, body.lastUpdated).run();
            saved = true;
          } catch (e: any) {}
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: saved ? 'Data berhasil disimpan ke Database Cloudflare' : 'Data diterima.',
            syncedAt: body.lastUpdated,
          }),
          { headers: CORS_HEADERS }
        );
      }
    }

    // 2. Route: /api/cloudflare/status
    if (url.pathname === '/api/cloudflare/status') {
      const kv = findKVBinding(env);
      const d1 = findD1Binding(env);
      return new Response(
        JSON.stringify({
          status: 'connected',
          message: kv ? `Terhubung ke Cloudflare KV (${kv.name})` : d1 ? `Terhubung ke Cloudflare D1 (${d1.name})` : 'Cloudflare Worker aktif',
          isBound: Boolean(kv || d1),
          kvBindingName: kv ? kv.name : null,
          d1BindingName: d1 ? d1.name : null,
          multiDeviceEnabled: true,
        }),
        { headers: CORS_HEADERS }
      );
    }

    // 3. Fallback for Static Assets (Cloudflare Pages or Workers with Assets)
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
