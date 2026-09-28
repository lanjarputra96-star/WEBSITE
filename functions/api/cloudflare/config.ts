// Cloudflare Pages Function for /api/cloudflare/config

interface Env {
  [key: string]: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env }) => {
  const env = context.env || {};
  return new Response(
    JSON.stringify({
      success: true,
      hasDirectCredentials: Boolean(env.SCHOOL_CMS_KV || env.KV || env.DATABASE || env.DB || (env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_API_TOKEN)),
      kvNamespaceId: env.CLOUDFLARE_KV_NAMESPACE_ID || '5b4256f6-8ce8-4a13-ae5c-0ae37fcd9b9b',
      message: 'Cloudflare Pages Functions aktif',
    }),
    { headers: CORS_HEADERS }
  );
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Konfigurasi diterima di Cloudflare Edge.',
    }),
    { headers: CORS_HEADERS }
  );
};
