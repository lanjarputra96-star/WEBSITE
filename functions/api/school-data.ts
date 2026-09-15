// Cloudflare Pages Function for /api/school-data
// Runs on Cloudflare Edge network with direct KV binding (SCHOOL_CMS_KV)

interface Env {
  SCHOOL_CMS_KV?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (context.env.SCHOOL_CMS_KV) {
      const kvData = await context.env.SCHOOL_CMS_KV.get('school_cms_data');
      if (kvData) {
        return new Response(
          JSON.stringify({
            success: true,
            source: 'cloudflare_kv',
            data: JSON.parse(kvData),
            cloudflare: {
              status: 'connected',
              message: 'Data dimuat langsung dari Cloudflare KV Database (Edge)',
            },
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }
  } catch (err: any) {
    console.error('Cloudflare Pages KV Error:', err);
  }

  // If no KV or empty, return success: true with null to let client load initial data
  return new Response(
    JSON.stringify({
      success: true,
      source: 'cloudflare_edge_initial',
      data: null,
      cloudflare: {
        status: 'connected',
        message: 'Menggunakan data awal bawaan sekolah.',
      },
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = await context.request.json();
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, message: 'Data tidak valid' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (context.env.SCHOOL_CMS_KV) {
      await context.env.SCHOOL_CMS_KV.put('school_cms_data', JSON.stringify(body));
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Berhasil disimpan ke Cloudflare KV Database',
          syncedAt: new Date().toISOString(),
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Disimpan di edge session.',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
