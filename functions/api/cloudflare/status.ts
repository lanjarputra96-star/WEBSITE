// Cloudflare Pages Function for /api/cloudflare/status

interface Env {
  SCHOOL_CMS_KV?: {
    get(key: string): Promise<string | null>;
  };
}

export const onRequestGet = async (context: { env: Env }) => {
  const isKvBound = Boolean(context.env.SCHOOL_CMS_KV);
  return new Response(
    JSON.stringify({
      kvNamespaceId: '5b4256f6-8ce8-4a13-ae5c-0ae37fcd9b9b',
      lastSyncedAt: new Date().toISOString(),
      status: 'connected',
      message: isKvBound
        ? 'Terhubung langsung ke Cloudflare KV Database (SCHOOL_CMS_KV)'
        : 'Berjalan di Cloudflare Pages Edge',
      hasDirectCredentials: isKvBound,
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
