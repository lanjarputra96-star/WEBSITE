/**
 * Script Sinkronisasi Otomatis Repositori GitHub ke Database Cloudflare KV
 * Dijalankan otomatis saat GitHub Actions deploy atau dapat dijalankan manual.
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'school_cms_data.json');
const DEFAULT_KV_NAMESPACE_ID = '5b4256f6-8ce8-4a13-ae5c-0ae37fcd9b9b';

async function syncToCloudflare() {
  console.log('--- Sinkronisasi Database Cloudflare Dimulai ---');

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`[ERROR] File data sekolah tidak ditemukan di: ${DATA_FILE}`);
    process.exit(0);
  }

  let schoolData;
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    schoolData = JSON.parse(raw);
    console.log(`[OK] Data sekolah berhasil dibaca: "${schoolData.schoolInfo?.name || 'SDN 1 PALAPA'}"`);
  } catch (err) {
    console.error('[ERROR] Gagal mem-parse JSON data sekolah:', err.message);
    process.exit(0);
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const kvId = process.env.CLOUDFLARE_KV_NAMESPACE_ID || DEFAULT_KV_NAMESPACE_ID;

  if (!accountId || !apiToken) {
    console.log('[INFO] CLOUDFLARE_API_TOKEN atau CLOUDFLARE_ACCOUNT_ID belum dikonfigurasi di GitHub Secrets.');
    console.log('Untuk mengaktifkan sinkronisasi otomatis dari GitHub Actions:');
    console.log('1. Buka Repositori GitHub -> Settings -> Secrets and variables -> Actions');
    console.log('2. Tambahkan CLOUDFLARE_ACCOUNT_ID dan CLOUDFLARE_API_TOKEN.');
    console.log('[INFO] Build tetap dilanjutkan dengan aman menggunakan data lokal SDN 1 PALAPA.');
    return;
  }

  if (accountId.includes('@')) {
    console.warn('[WARNING] CLOUDFLARE_ACCOUNT_ID tidak boleh berupa email. Gunakan 32 karakter hexadecimal Account ID.');
    return;
  }

  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvId}/values/school_cms_data`;
    console.log(`[SYNC] Mengirimkan data ke Cloudflare KV Namespace: ${kvId}...`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schoolData),
    });

    if (response.ok) {
      console.log('=================================================================');
      console.log('✅ [BERHASIL] Data SD Negeri 1 Palapa tersinkron ke Cloudflare KV!');
      console.log(`Namespace ID: ${kvId}`);
      console.log(`Waktu: ${new Date().toISOString()}`);
      console.log('=================================================================');
    } else {
      const errText = await response.text();
      console.warn(`[WARNING] Respon Cloudflare API (${response.status}):`, errText);
    }
  } catch (e) {
    console.warn('[WARNING] Gagal terhubung ke Cloudflare API:', e.message);
  }
}

syncToCloudflare();
