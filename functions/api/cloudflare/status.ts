// Cloudflare Pages Function for /api/cloudflare/status
// Reports connection status for KV bindings, D1 bindings, or REST API

interface Env {
  [key: string]: any;
}

const DEFAULT_KV_NAMESPACE_ID = '5b4256f6-8ce8-4a13-ae5c-0ae37fcd9b9b';

export const onRequestGet = async (context: { env: Env }) => {
  const env = context.env || {};

  // Check KV bindings
  let kvBindingName: string | null = null;
  const kvPriority = ['SCHOOL_CMS_KV', 'KV', 'DATABASE', 'DB', 'SCHOOL_KV', 'CMS_KV', 'DATA_KV'];
  for (const name of kvPriority) {
    if (env[name] && typeof env[name].get === 'function') {
      kvBindingName = name;
      break;
    }
  }
  if (!kvBindingName) {
    for (const k of Object.keys(env)) {
      if (env[k] && typeof env[k].get === 'function' && typeof env[k].put === 'function') {
        kvBindingName = k;
        break;
      }
    }
  }

  // Check D1 bindings
  let d1BindingName: string | null = null;
  const d1Priority = ['DB', 'DATABASE', 'D1', 'SCHOOL_DB', 'CMS_DB'];
  for (const name of d1Priority) {
    if (env[name] && typeof env[name].prepare === 'function') {
      d1BindingName = name;
      break;
    }
  }

  const hasDirectBinding = Boolean(kvBindingName || d1BindingName);
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const hasRestCreds = Boolean(accountId && env.CLOUDFLARE_API_TOKEN && !accountId.includes('@'));

  let message = 'Berjalan di Cloudflare Pages Edge';
  if (kvBindingName && d1BindingName) {
    message = `Terhubung langsung ke Cloudflare KV (${kvBindingName}) & D1 Database (${d1BindingName})`;
  } else if (kvBindingName) {
    message = `Terhubung langsung ke Cloudflare KV Binding (${kvBindingName})`;
  } else if (d1BindingName) {
    message = `Terhubung langsung ke Cloudflare D1 Database Binding (${d1BindingName})`;
  } else if (hasRestCreds) {
    message = 'Terhubung ke Cloudflare KV via REST API';
  }

  return new Response(
    JSON.stringify({
      kvNamespaceId: DEFAULT_KV_NAMESPACE_ID,
      lastSyncedAt: new Date().toISOString(),
      status: 'connected',
      message,
      hasDirectCredentials: hasDirectBinding || hasRestCreds,
      isBound: hasDirectBinding,
      kvBindingName,
      d1BindingName,
      multiDeviceEnabled: true,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};
