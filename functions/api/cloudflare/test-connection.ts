// Cloudflare Pages Function for /api/cloudflare/test-connection

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

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json().catch(() => ({}));
    const accountId = (body.accountId || context.env.CLOUDFLARE_ACCOUNT_ID || '').trim();
    const apiToken = (body.apiToken || context.env.CLOUDFLARE_API_TOKEN || '').trim();
    const kvNamespaceId = (body.kvNamespaceId || context.env.CLOUDFLARE_KV_NAMESPACE_ID || '5b4256f6-8ce8-4a13-ae5c-0ae37fcd9b9b').trim();

    if (!accountId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Cloudflare Account ID wajib diisi (32 karakter).' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }
    if (accountId.includes('@')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Account ID tidak boleh berupa email. Gunakan Account ID 32 karakter dari dasbor Cloudflare.',
        }),
        { status: 400, headers: CORS_HEADERS }
      );
    }
    if (!apiToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'Cloudflare API Token wajib diisi.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 1. Verify token
    const verifyRes = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: { Authorization: `Bearer ${apiToken}` },
    });
    const verifyJson = (await verifyRes.json().catch(() => ({}))) as any;
    if (!verifyRes.ok || !verifyJson.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'API Token Cloudflare tidak valid atau sudah kedaluwarsa.',
          detail: verifyJson.errors,
        }),
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // 2. Test KV access
    const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvNamespaceId}/values/school_cms_data`;
    const kvRes = await fetch(kvUrl, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Koneksi ke Cloudflare KV terverifikasi dan aktif!',
        matchedNamespaceId: kvNamespaceId,
        kvStatus: kvRes.ok ? 'data_found' : 'ready_to_write',
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: `Gagal menguji koneksi: ${err.message}` }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
