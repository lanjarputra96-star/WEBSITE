// Cloudflare Pages Function for /api/messages

interface Env {
  [key: string]: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestGet = async (context: { env: Env }) => {
  let messages: any[] = [];
  const env = context.env || {};
  const kv = env.SCHOOL_CMS_KV || env.KV || env.DATABASE || env.DB;

  if (kv && typeof kv.get === 'function') {
    try {
      const raw = await kv.get('messages');
      if (raw) {
        messages = JSON.parse(raw);
      }
    } catch {}
  }

  return new Response(
    JSON.stringify({ success: true, count: messages.length, messages }),
    { headers: CORS_HEADERS }
  );
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json().catch(() => ({}));
    const { name, email, phone, subject, message } = body;

    if (!name || !message) {
      return new Response(
        JSON.stringify({ success: false, message: 'Nama dan pesan wajib diisi.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      subject: (subject || 'Pesan dari Website').trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    const env = context.env || {};
    const kv = env.SCHOOL_CMS_KV || env.KV || env.DATABASE || env.DB;
    if (kv && typeof kv.get === 'function' && typeof kv.put === 'function') {
      try {
        const raw = await kv.get('messages');
        const existing = raw ? JSON.parse(raw) : [];
        existing.unshift(newMessage);
        await kv.put('messages', JSON.stringify(existing.slice(0, 100)));
      } catch {}
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Pesan Anda berhasil dikirimkan.', data: newMessage }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: `Gagal mengirim pesan: ${err.message}` }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
