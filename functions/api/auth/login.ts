// Cloudflare Pages Function for /api/auth/login

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
    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Username dan kata sandi wajib diisi.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Default admin credentials
    let currentAdmin = {
      username: 'admin',
      passwordHash: 'admin123',
      email: 'lanjarputra96@gmail.com',
      lastLogin: new Date().toISOString(),
    };

    // Check if KV binding has custom admin credentials
    const env = context.env || {};
    const kv = env.SCHOOL_CMS_KV || env.KV || env.DATABASE || env.DB;
    if (kv && typeof kv.get === 'function') {
      try {
        const storedAdmin = await kv.get('admin_user');
        if (storedAdmin) {
          const parsed = JSON.parse(storedAdmin);
          if (parsed && parsed.username) {
            currentAdmin = { ...currentAdmin, ...parsed };
          }
        }
      } catch (e) {
        // Fallback to default
      }
    }

    if (username === currentAdmin.username && password === currentAdmin.passwordHash) {
      const now = new Date().toLocaleString('id-ID');
      currentAdmin.lastLogin = now;

      // Update last login in KV if available
      if (kv && typeof kv.put === 'function') {
        try {
          await kv.put('admin_user', JSON.stringify(currentAdmin));
        } catch {}
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Login berhasil. Selamat datang ${currentAdmin.username}!`,
          admin: {
            username: currentAdmin.username,
            email: currentAdmin.email,
            lastLogin: now,
          },
        }),
        { headers: CORS_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Username atau kata sandi salah. Silakan coba lagi.' }),
      { status: 401, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: `Error autentikasi: ${err.message}` }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
