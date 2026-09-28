// Cloudflare Pages Function fallback for unhandled /api/* routes

interface Env {
  [key: string]: any;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequest = async (context: { request: Request; env: Env }) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(context.request.url);

  return new Response(
    JSON.stringify({
      success: true,
      message: `Endpoint ${url.pathname} aktif di Cloudflare Edge.`,
      path: url.pathname,
    }),
    { headers: CORS_HEADERS }
  );
};
