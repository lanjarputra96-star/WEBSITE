// Cloudflare Pages Function for /api/auth/admin-info

interface Env {
  [key: string]: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env }) => {
  let admin = {
    username: 'admin',
    email: 'lanjarputra96@gmail.com',
    lastLogin: new Date().toISOString(),
  };

  const env = context.env || {};
  const kv = env.SCHOOL_CMS_KV || env.KV || env.DATABASE || env.DB;
  if (kv && typeof kv.get === 'function') {
    try {
      const stored = await kv.get('admin_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.username) {
          admin = {
            username: parsed.username,
            email: parsed.email || 'lanjarputra96@gmail.com',
            lastLogin: parsed.lastLogin || admin.lastLogin,
          };
        }
      }
    } catch {}
  }

  return new Response(
    JSON.stringify({
      success: true,
      admin,
    }),
    { headers: CORS_HEADERS }
  );
};
