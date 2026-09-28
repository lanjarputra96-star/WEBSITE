// Cloudflare Pages Function for /api/auth/update-credentials

interface Env {
  [key: string]: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json().catch(() => ({}));
    const { oldPassword, newPassword, username, email } = body;

    let currentAdmin = {
      username: 'admin',
      passwordHash: 'admin123',
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
            currentAdmin = { ...currentAdmin, ...parsed };
          }
        }
      } catch {}
    }

    if (oldPassword !== currentAdmin.passwordHash) {
      return new Response(
        JSON.stringify({ success: false, message: 'Kata sandi saat ini (current password) tidak sesuai.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const updated = {
      username: username ? username.trim() : currentAdmin.username,
      passwordHash: newPassword ? newPassword.trim() : currentAdmin.passwordHash,
      email: email ? email.trim() : currentAdmin.email,
      lastLogin: new Date().toISOString(),
    };

    if (kv && typeof kv.put === 'function') {
      try {
        await kv.put('admin_user', JSON.stringify(updated));
      } catch {}
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Kredensial admin berhasil diperbarui dan tersimpan.',
        admin: {
          username: updated.username,
          email: updated.email,
          lastLogin: updated.lastLogin,
        },
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: `Gagal memperbarui kredensial: ${err.message}` }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
