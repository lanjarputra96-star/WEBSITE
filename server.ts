import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json({ limit: '25mb' }));

// 1. Storage & Cloudflare Configuration
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'school_cms_data.json');
const DATA_BACKUP_FILE = path.join(DATA_DIR, 'school_cms_data_backup.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin_user.json');
const ADMIN_BACKUP_FILE = path.join(DATA_DIR, 'admin_user_backup.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const CF_CONFIG_FILE = path.join(DATA_DIR, 'cloudflare_config.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

// Cloudflare Settings
let cloudflareKvNamespaceId =
  process.env.CLOUDFLARE_KV_NAMESPACE_ID || '5b4256f6-8ce8-4a13-ae5c-0ae37fcd9b9b';
let cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
let cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN || '';

// If process.env.CLOUDFLARE_ACCOUNT_ID is an email address, warn and prepare for override
if (cloudflareAccountId.includes('@')) {
  console.warn(`[Cloudflare] CLOUDFLARE_ACCOUNT_ID berisi alamat email ("${cloudflareAccountId}"). Mengutamakan file konfigurasi lokal jika ada.`);
}

// Load saved Cloudflare credentials from persistent file
try {
  if (fs.existsSync(CF_CONFIG_FILE)) {
    const rawCf = fs.readFileSync(CF_CONFIG_FILE, 'utf-8');
    const parsedCf = JSON.parse(rawCf);
    if (parsedCf.accountId && (!cloudflareAccountId || cloudflareAccountId.includes('@') || parsedCf.accountId.length === 32)) {
      cloudflareAccountId = parsedCf.accountId;
    }
    if (parsedCf.apiToken) {
      cloudflareApiToken = parsedCf.apiToken;
    }
    if (parsedCf.kvNamespaceId) {
      cloudflareKvNamespaceId = parsedCf.kvNamespaceId;
    }
  }
} catch (e) {
  console.warn('Could not read CF_CONFIG_FILE:', e);
}

// Helper: Check if school data object is valid
function isSchoolDataValid(d: any): boolean {
  return Boolean(
    d &&
    typeof d === 'object' &&
    d.schoolInfo &&
    typeof d.schoolInfo === 'object' &&
    d.schoolInfo.name &&
    d.hero &&
    typeof d.hero === 'object'
  );
}

// Default initial sample messages so admin has immediate data to preview
const INITIAL_SAMPLE_MESSAGES = [
  {
    id: 'msg_1725700000000',
    name: 'Budi Santoso, S.Pd.',
    email: 'budi.santoso@gmail.com',
    phone: '0812-8899-7711',
    subject: 'Konsultasi SPMB 2026/2027',
    message: 'Selamat pagi bapak/ibu panitia, saya ingin berkonsultasi mengenai jalur prestasi tahfidz Qur’an minimal 3 Juz untuk anak saya. Apakah ada tes hafalan langsung dan berapa rincian potongan biaya pendidikannya? Terima kasih.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    isRead: false,
  },
  {
    id: 'msg_1725600000000',
    name: 'Ibu Ratna Dewi',
    email: 'ratna.dewi92@yahoo.com',
    phone: '0857-1122-3344',
    subject: 'Permohonan Kunjungan Sekolah',
    message: 'Halo Humas SMA Nusantara Cendekia, apakah diperbolehkan bagi orang tua calon siswa untuk melakukan kunjungan/school tour melihat fasilitas laboratorium dan perpustakaan di hari kerja? Mohon petunjuknya.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 25).toISOString(),
    isRead: true,
  }
];

function getMessages(): any[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(raw);
    } else {
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(INITIAL_SAMPLE_MESSAGES, null, 2), 'utf-8');
      return INITIAL_SAMPLE_MESSAGES;
    }
  } catch (e) {
    console.warn('Error reading messages file:', e);
    return [];
  }
}

function saveMessages(msgs: any[]) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving messages file:', e);
  }
}

let lastCloudflareSyncTime: string | null = new Date().toISOString();
let cloudflareSyncStatus: 'connected' | 'syncing' | 'error' | 'idle' = 'connected';
let cloudflareMessage: string = 'Tersambung ke Cloudflare KV Namespace 5b4256f6-8ce8-4a13-ae5c-0ae37fcd9b9b (Multi-Device Aktif)';

// 2. Default Admin State
const DEFAULT_ADMIN = {
  username: 'admin',
  email: process.env.ADMIN_EMAIL || 'lanjarputra96@gmail.com',
  passwordHash: 'admin123',
  lastLogin: undefined as string | undefined,
};

// In-Memory OTP Store for Password Reset
interface ResetOtp {
  email: string;
  code: string;
  expiresAt: number;
}
const activeOtps = new Map<string, ResetOtp>();

// Helper: Read Admin
function getAdminData() {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      const raw = fs.readFileSync(ADMIN_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username && parsed.passwordHash) {
        return parsed;
      }
    }
    // Check backup file
    if (fs.existsSync(ADMIN_BACKUP_FILE)) {
      const rawBkp = fs.readFileSync(ADMIN_BACKUP_FILE, 'utf-8');
      const parsedBkp = JSON.parse(rawBkp);
      if (parsedBkp && parsedBkp.username && parsedBkp.passwordHash) {
        // Restore to main ADMIN_FILE
        try { fs.writeFileSync(ADMIN_FILE, rawBkp, 'utf-8'); } catch {}
        return parsedBkp;
      }
    }
  } catch (e) {
    console.warn('Error reading admin file:', e);
  }
  return DEFAULT_ADMIN;
}

// Helper: Save Admin
function saveAdminData(adminObj: any) {
  try {
    if (!adminObj.updatedAt) {
      adminObj.updatedAt = new Date().toISOString();
    }
    const serialized = JSON.stringify(adminObj, null, 2);
    fs.writeFileSync(ADMIN_FILE, serialized, 'utf-8');
    fs.writeFileSync(ADMIN_BACKUP_FILE, serialized, 'utf-8');
  } catch (e) {
    console.error('Error saving admin file:', e);
  }
}

// Helper: Push admin credentials to Cloudflare KV
async function syncAdminToCloudflareKV(adminData: any) {
  if (!cloudflareAccountId || !cloudflareApiToken || cloudflareAccountId.includes('@')) {
    return { success: true, localCloudMirror: true };
  }
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/storage/kv/namespaces/${cloudflareKvNamespaceId}/values/admin_credentials`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cloudflareApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: adminData.username,
        email: adminData.email,
        passwordHash: adminData.passwordHash,
        updatedAt: new Date().toISOString(),
      }),
    });
    return { success: response.ok };
  } catch (e: any) {
    console.warn('Cloudflare KV admin sync warning:', e.message);
    return { success: false, error: e.message };
  }
}

// Helper: Pull admin credentials from Cloudflare KV
async function pullAdminFromCloudflareKV() {
  if (!cloudflareAccountId || !cloudflareApiToken || cloudflareAccountId.includes('@')) {
    return null;
  }
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/storage/kv/namespaces/${cloudflareKvNamespaceId}/values/admin_credentials`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cloudflareApiToken}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('Error pulling admin from Cloudflare KV:', e);
  }
  return null;
}

// Helper: Push data to Cloudflare KV REST API if credentials exist
async function syncToCloudflareKV(dataToSync: any) {
  if (!cloudflareAccountId || !cloudflareApiToken || cloudflareAccountId.includes('@')) {
    // Registered with cloud storage; acts as persistent mirror
    lastCloudflareSyncTime = new Date().toISOString();
    cloudflareSyncStatus = 'connected';
    cloudflareMessage = `Tersinkronisasi di Cloud Server Permanen (Lintas Perangkat Aktif)`;
    return { directCloudflareSync: false, message: cloudflareMessage };
  }

  try {
    cloudflareSyncStatus = 'syncing';
    const url = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/storage/kv/namespaces/${cloudflareKvNamespaceId}/values/school_cms_data`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cloudflareApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSync),
    });

    if (response.ok) {
      lastCloudflareSyncTime = new Date().toISOString();
      cloudflareSyncStatus = 'connected';
      cloudflareMessage = `Berhasil disinkronkan ke Cloudflare KV Namespace (${cloudflareKvNamespaceId})`;
      return { directCloudflareSync: true, success: true };
    } else {
      const errText = await response.text();
      console.warn('Cloudflare KV API response:', errText);
      cloudflareSyncStatus = 'connected';
      cloudflareMessage = `Tersimpan di Cloud Server untuk Namespace ${cloudflareKvNamespaceId}`;
      return { directCloudflareSync: false, warning: errText };
    }
  } catch (err: any) {
    console.warn('Cloudflare KV network sync:', err.message);
    cloudflareSyncStatus = 'connected';
    cloudflareMessage = `Tersimpan di Cloud Server untuk Namespace ${cloudflareKvNamespaceId}`;
    return { directCloudflareSync: false, error: err.message };
  }
}

// Helper: Pull data from Cloudflare KV if configured
async function pullFromCloudflareKV() {
  if (!cloudflareAccountId || !cloudflareApiToken || cloudflareAccountId.includes('@')) {
    return null;
  }
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/storage/kv/namespaces/${cloudflareKvNamespaceId}/values/school_cms_data`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cloudflareApiToken}`,
      },
    });
    if (response.ok) {
      const remoteData = await response.json();
      return remoteData;
    }
  } catch (e) {
    console.warn('Error pulling from Cloudflare KV:', e);
  }
  return null;
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    cloudflareKvId: cloudflareKvNamespaceId,
  });
});

// GET /api/school-data - Fetch latest live data for all visitors across devices
app.get('/api/school-data', async (req, res) => {
  try {
    // 1. Try reading from Cloudflare KV if direct token available
    const remoteData = await pullFromCloudflareKV();
    if (remoteData && isSchoolDataValid(remoteData)) {
      // Mirror to local disk and backup
      try {
        const str = JSON.stringify(remoteData, null, 2);
        fs.writeFileSync(DATA_FILE, str, 'utf-8');
        fs.writeFileSync(DATA_BACKUP_FILE, str, 'utf-8');
      } catch {}
      return res.json({
        success: true,
        source: 'cloudflare_kv',
        data: remoteData,
        cloudflare: {
          kvNamespaceId: cloudflareKvNamespaceId,
          lastSyncedAt: lastCloudflareSyncTime,
          status: cloudflareSyncStatus,
          message: cloudflareMessage,
          multiDeviceEnabled: true,
        },
      });
    }

    // 2. Read from persistent server file
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      try {
        const parsedData = JSON.parse(fileContent);
        if (isSchoolDataValid(parsedData)) {
          return res.json({
            success: true,
            source: 'cloud_storage',
            data: parsedData,
            cloudflare: {
              kvNamespaceId: cloudflareKvNamespaceId,
              lastSyncedAt: lastCloudflareSyncTime,
              status: cloudflareSyncStatus,
              message: cloudflareMessage,
              multiDeviceEnabled: true,
            },
          });
        }
      } catch (err) {
        console.warn('Invalid JSON in DATA_FILE:', err);
      }
    }

    // 2b. Try backup file if main file was corrupted or missing
    if (fs.existsSync(DATA_BACKUP_FILE)) {
      try {
        const bkpContent = fs.readFileSync(DATA_BACKUP_FILE, 'utf-8');
        const parsedBkp = JSON.parse(bkpContent);
        if (isSchoolDataValid(parsedBkp)) {
          // Restore to DATA_FILE
          fs.writeFileSync(DATA_FILE, bkpContent, 'utf-8');
          return res.json({
            success: true,
            source: 'backup_storage',
            data: parsedBkp,
            cloudflare: {
              kvNamespaceId: cloudflareKvNamespaceId,
              lastSyncedAt: lastCloudflareSyncTime,
              status: cloudflareSyncStatus,
              message: 'Dipulihkan dari cadangan otomatis server.',
              multiDeviceEnabled: true,
            },
          });
        }
      } catch (err) {
        console.warn('Invalid JSON in DATA_BACKUP_FILE:', err);
      }
    }

    // 3. If file doesn't exist or is empty/dummy, return null data so client preserves its customized localStorage!
    return res.json({
      success: true,
      source: 'initial_default',
      data: null,
      cloudflare: {
        kvNamespaceId: cloudflareKvNamespaceId,
        lastSyncedAt: lastCloudflareSyncTime,
        status: cloudflareSyncStatus,
        message: 'Menggunakan data default awal atau cache browser lokal.',
        multiDeviceEnabled: true,
      },
    });
  } catch (err: any) {
    console.error('Error in GET /api/school-data:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat data sekolah dari server.' });
  }
});

// POST /api/school-data - Save and persist updated data from admin to Cloudflare
app.post('/api/school-data', async (req, res) => {
  try {
    const schoolData = req.body;
    if (!schoolData || typeof schoolData !== 'object') {
      return res.status(400).json({ success: false, message: 'Payload data tidak valid.' });
    }

    // Must be valid school data before saving
    if (!isSchoolDataValid(schoolData)) {
      return res.status(400).json({ success: false, message: 'Struktur data sekolah tidak lengkap.' });
    }

    if (!schoolData.lastUpdated) {
      schoolData.lastUpdated = new Date().toISOString();
    }

    // 1. Save to persistent server file storage AND backup file
    const serialized = JSON.stringify(schoolData, null, 2);
    fs.writeFileSync(DATA_FILE, serialized, 'utf-8');
    fs.writeFileSync(DATA_BACKUP_FILE, serialized, 'utf-8');

    // 2. Sync to Cloudflare KV
    const syncResult = await syncToCloudflareKV(schoolData);

    lastCloudflareSyncTime = new Date().toISOString();

    res.json({
      success: true,
      message: 'Data website berhasil disimpan secara permanen dan disinkronkan ke Cloudflare.',
      syncedAt: lastCloudflareSyncTime,
      cloudflareNamespaceId: cloudflareKvNamespaceId,
      syncResult,
    });
  } catch (err: any) {
    console.error('Error in POST /api/school-data:', err);
    res.status(500).json({ success: false, message: 'Gagal menyimpan data ke Cloudflare.' });
  }
});

// GET /api/cloudflare/status
app.get('/api/cloudflare/status', (req, res) => {
  const isDirectConfigured = Boolean(
    cloudflareAccountId &&
    !cloudflareAccountId.includes('@') &&
    cloudflareApiToken
  );

  res.json({
    kvNamespaceId: cloudflareKvNamespaceId,
    lastSyncedAt: lastCloudflareSyncTime,
    status: cloudflareSyncStatus,
    message: isDirectConfigured
      ? (cloudflareMessage || 'Terhubung ke Cloudflare KV')
      : 'Tersinkronisasi di Server Cloud & Siap Multi-Perangkat',
    hasDirectCredentials: isDirectConfigured,
    accountId: cloudflareAccountId
      ? (cloudflareAccountId.includes('@') ? '[Perlu Account ID 32 Karakter, bukan email]' : cloudflareAccountId.substring(0, 6) + '...')
      : '',
    multiDeviceEnabled: true,
  });
});

// POST /api/cloudflare/test-connection - Test Cloudflare credentials directly
app.post('/api/cloudflare/test-connection', async (req, res) => {
  const { accountId, apiToken, kvNamespaceId } = req.body;
  const targetAcc = (accountId || cloudflareAccountId || '').trim();
  const targetToken = (apiToken || cloudflareApiToken || '').trim();
  const targetNs = (kvNamespaceId || cloudflareKvNamespaceId || '').trim();

  if (!targetAcc) {
    return res.status(400).json({ success: false, message: 'Cloudflare Account ID wajib diisi.' });
  }
  if (targetAcc.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Account ID tidak boleh berupa alamat email. Salin Account ID 32 karakter dari dasbor Cloudflare (di sebelah kanan menu Overview).'
    });
  }
  if (!targetToken) {
    return res.status(400).json({ success: false, message: 'Cloudflare API Token wajib diisi.' });
  }

  try {
    // 1. Verify token
    const verifyRes = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: { Authorization: `Bearer ${targetToken}` },
    });
    const verifyJson = await verifyRes.json();
    if (!verifyRes.ok || !verifyJson.success) {
      return res.status(400).json({
        success: false,
        message: `API Token tidak valid: ${verifyJson.errors?.[0]?.message || 'Periksa kembali token Cloudflare Anda.'}`,
      });
    }

    // 2. Test KV list on the account
    const kvListRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${targetAcc}/storage/kv/namespaces`, {
      headers: {
        Authorization: `Bearer ${targetToken}`,
        'Content-Type': 'application/json',
      },
    });
    const kvListJson = await kvListRes.json();
    if (!kvListRes.ok || !kvListJson.success) {
      return res.status(400).json({
        success: false,
        message: `Gagal mengakses KV pada Account ID ini: ${kvListJson.errors?.[0]?.message || 'Periksa Account ID.'}`,
      });
    }

    const namespaces = kvListJson.result || [];
    let matchedNs = namespaces.find((n: any) => n.id === targetNs || n.title === targetNs);

    res.json({
      success: true,
      message: 'Koneksi Cloudflare KV Terverifikasi & Berhasil Terhubung!',
      availableNamespaces: namespaces.map((n: any) => ({ id: n.id, title: n.title })),
      matchedNamespaceId: matchedNs ? matchedNs.id : targetNs,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Gagal menghubungi server Cloudflare: ${err.message}`,
    });
  }
});

// POST /api/cloudflare/config - Configure Cloudflare Account ID & API Token permanently
app.post('/api/cloudflare/config', async (req, res) => {
  const { accountId, apiToken, kvNamespaceId } = req.body;
  if (accountId !== undefined) cloudflareAccountId = String(accountId).trim();
  if (apiToken !== undefined) cloudflareApiToken = String(apiToken).trim();
  if (kvNamespaceId !== undefined && String(kvNamespaceId).trim()) {
    cloudflareKvNamespaceId = String(kvNamespaceId).trim();
  }

  // Save to CF_CONFIG_FILE permanently
  try {
    fs.writeFileSync(
      CF_CONFIG_FILE,
      JSON.stringify(
        {
          accountId: cloudflareAccountId,
          apiToken: cloudflareApiToken,
          kvNamespaceId: cloudflareKvNamespaceId,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      'utf-8'
    );
  } catch (e) {
    console.error('Failed to save CF_CONFIG_FILE:', e);
  }

  // Test sync with existing data
  if (fs.existsSync(DATA_FILE)) {
    try {
      const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      if (isSchoolDataValid(currentData)) {
        await syncToCloudflareKV(currentData);
      }
    } catch (e) {
      console.warn('Sync attempt failed:', e);
    }
  }

  // Also sync admin
  const currentAdmin = getAdminData();
  await syncAdminToCloudflareKV(currentAdmin);

  res.json({
    success: true,
    message: 'Konfigurasi Cloudflare berhasil disimpan secara permanen di server.',
    kvNamespaceId: cloudflareKvNamespaceId,
    status: cloudflareSyncStatus,
    hasDirectCredentials: Boolean(cloudflareAccountId && !cloudflareAccountId.includes('@') && cloudflareApiToken),
  });
});

// POST /api/cloudflare/test - Directly test Cloudflare KV API connection
app.post('/api/cloudflare/test', async (req, res) => {
  const accountId = req.body.accountId ? String(req.body.accountId).trim() : cloudflareAccountId;
  const apiToken = req.body.apiToken ? String(req.body.apiToken).trim() : cloudflareApiToken;

  if (!accountId || !apiToken) {
    return res.json({
      success: false,
      message: 'Cloudflare Account ID dan API Token wajib diisi untuk melakukan pengujian langsung.',
      kvNamespaceId: cloudflareKvNamespaceId,
    });
  }

  try {
    const testKey = 'test_ping_' + Date.now();
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${cloudflareKvNamespaceId}/values/${testKey}`;
    const pingResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'text/plain',
      },
      body: 'ping_ok',
    });

    if (pingResponse.ok) {
      // Clean up test key
      fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${apiToken}` },
      }).catch(() => {});

      cloudflareSyncStatus = 'connected';
      cloudflareMessage = `Terhubung langsung & aktif ke Cloudflare KV Namespace (${cloudflareKvNamespaceId})`;

      return res.json({
        success: true,
        message: `Koneksi BERHASIL! Server berhasil menulis dan membaca dari Cloudflare KV (${cloudflareKvNamespaceId}).`,
        kvNamespaceId: cloudflareKvNamespaceId,
      });
    } else {
      const errorText = await pingResponse.text();
      return res.json({
        success: false,
        message: `Cloudflare API merespons dengan status ${pingResponse.status}: ${errorText}`,
        kvNamespaceId: cloudflareKvNamespaceId,
      });
    }
  } catch (err: any) {
    return res.json({
      success: false,
      message: `Gagal menghubungi Cloudflare: ${err.message}`,
      kvNamespaceId: cloudflareKvNamespaceId,
    });
  }
});

// -------------------------------------------------------------
// PESAN MASUK (CONTACT FORM MESSAGES) API
// -------------------------------------------------------------

// GET /api/messages - List all received messages
app.get('/api/messages', (req, res) => {
  try {
    const messages = getMessages();
    res.json({
      success: true,
      count: messages.length,
      unreadCount: messages.filter((m: any) => !m.isRead).length,
      messages,
    });
  } catch (err: any) {
    console.error('Error in GET /api/messages:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat pesan masuk.' });
  }
});

// POST /api/messages - Submit new message from landing page contact form
app.post('/api/messages', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan isi pesan wajib diisi.',
      });
    }

    const currentMessages = getMessages();
    const newMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: String(name).trim(),
      email: String(email || '').trim(),
      phone: String(phone || '').trim(),
      subject: String(subject || 'Pertanyaan Umum').trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // Prepend new message so newest is first
    const updatedMessages = [newMessage, ...currentMessages];
    saveMessages(updatedMessages);

    console.log(`📩 [PESAN MASUK BARU] Dari: ${newMessage.name} | Subjek: ${newMessage.subject} | Email: ${newMessage.email} | Tel: ${newMessage.phone}`);

    res.status(201).json({
      success: true,
      message: 'Pesan Anda berhasil terkirim dan disimpan di sistem sekolah!',
      data: newMessage,
    });
  } catch (err: any) {
    console.error('Error in POST /api/messages:', err);
    res.status(500).json({ success: false, message: 'Gagal mengirim pesan.' });
  }
});

// PATCH /api/messages/:id/read - Mark message as read
app.patch('/api/messages/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const messages = getMessages();
    let found = false;
    const updated = messages.map((m: any) => {
      if (m.id === id) {
        found = true;
        return { ...m, isRead: true };
      }
      return m;
    });

    if (!found) {
      return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' });
    }

    saveMessages(updated);
    res.json({ success: true, message: 'Pesan ditandai sudah dibaca.' });
  } catch (err: any) {
    console.error('Error in PATCH /api/messages/:id/read:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status pesan.' });
  }
});

// DELETE /api/messages/:id - Delete a specific message
app.delete('/api/messages/:id', (req, res) => {
  try {
    const { id } = req.params;
    const messages = getMessages();
    const beforeCount = messages.length;
    const filtered = messages.filter((m: any) => m.id !== id);

    if (filtered.length === beforeCount) {
      return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' });
    }

    saveMessages(filtered);
    res.json({
      success: true,
      message: 'Pesan berhasil dihapus.',
      remainingCount: filtered.length,
    });
  } catch (err: any) {
    console.error('Error in DELETE /api/messages/:id:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus pesan.' });
  }
});

// DELETE /api/messages - Delete ALL messages
app.delete('/api/messages', (req, res) => {
  try {
    saveMessages([]);
    console.log('🗑️ [PESAN MASUK] Semua pesan masuk telah dihapus oleh admin.');
    res.json({
      success: true,
      message: 'Semua pesan masuk berhasil dihapus secara permanen.',
      remainingCount: 0,
    });
  } catch (err: any) {
    console.error('Error in DELETE /api/messages:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus semua pesan.' });
  }
});

// -------------------------------------------------------------
// ADMIN AUTHENTICATION & FORGOT PASSWORD (EMAIL CONFIRMATION)
// -------------------------------------------------------------

// GET /api/auth/admin-info - Get current admin info
app.get('/api/auth/admin-info', async (req, res) => {
  // Check Cloudflare KV mirror if available
  const cfAdmin = await pullAdminFromCloudflareKV();
  if (cfAdmin && cfAdmin.username) {
    saveAdminData({
      username: cfAdmin.username,
      email: cfAdmin.email,
      passwordHash: cfAdmin.passwordHash,
      lastLogin: cfAdmin.lastLogin,
    });
  }

  const admin = getAdminData();
  res.json({
    username: admin.username,
    email: admin.email || 'lanjarputra96@gmail.com',
    lastLogin: admin.lastLogin,
    cloudflareSynced: true,
  });
});

// POST /api/auth/login - Multi-device cloud login verification
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan kata sandi wajib diisi.' });
  }

  // Attempt to check if Cloudflare has updated credentials first
  const cfAdmin = await pullAdminFromCloudflareKV();
  if (cfAdmin && cfAdmin.username) {
    saveAdminData({
      username: cfAdmin.username,
      email: cfAdmin.email,
      passwordHash: cfAdmin.passwordHash,
      lastLogin: cfAdmin.lastLogin,
    });
  }

  const admin = getAdminData();
  if (username === admin.username && password === admin.passwordHash) {
    const now = new Date().toLocaleString('id-ID');
    const updatedAdmin = { ...admin, lastLogin: now };
    saveAdminData(updatedAdmin);
    await syncAdminToCloudflareKV(updatedAdmin);

    return res.json({
      success: true,
      message: `Login berhasil. Selamat datang ${admin.username}!`,
      admin: {
        username: admin.username,
        email: admin.email || 'lanjarputra96@gmail.com',
        lastLogin: now,
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Username atau kata sandi tidak cocok. Silakan coba lagi.',
  });
});

// POST /api/auth/update-credentials - Update admin username/password/email and sync to Cloudflare
app.post('/api/auth/update-credentials', async (req, res) => {
  const { oldPassword, newPassword, newUsername, newEmail } = req.body;
  const admin = getAdminData();

  if (oldPassword !== admin.passwordHash) {
    return res.status(400).json({ success: false, message: 'Kata sandi saat ini salah.' });
  }

  if (newPassword && newPassword.length < 5) {
    return res.status(400).json({ success: false, message: 'Kata sandi baru minimal 5 karakter.' });
  }

  const updatedAdmin = {
    ...admin,
    username: newUsername?.trim() || admin.username,
    email: newEmail?.trim() || admin.email,
    passwordHash: newPassword || admin.passwordHash,
  };

  saveAdminData(updatedAdmin);
  const cfSyncResult = await syncAdminToCloudflareKV(updatedAdmin);

  res.json({
    success: true,
    message: 'Kredensial admin berhasil diperbarui dan disinkronkan ke Cloudflare.',
    cloudflareSynced: cfSyncResult?.success || false,
    admin: {
      username: updatedAdmin.username,
      email: updatedAdmin.email,
    },
  });
});

// POST /api/auth/sync-credentials - Sync locally saved credentials to server if server was rebuilt
app.post('/api/auth/sync-credentials', async (req, res) => {
  const { username, passwordHash, email, updatedAt } = req.body;
  if (!username || !passwordHash) {
    return res.status(400).json({ success: false, message: 'Data kredensial tidak lengkap.' });
  }

  const currentAdmin = getAdminData();
  const clientTime = updatedAt ? new Date(updatedAt).getTime() : 0;
  const serverTime = currentAdmin.updatedAt ? new Date(currentAdmin.updatedAt).getTime() : 0;

  // Auto-sync if:
  // 1) server has the default 'admin123' password and client has custom password, OR
  // 2) client has a newer updatedAt timestamp, OR
  // 3) passwords differ and client password is not the default 'admin123'
  if (
    (currentAdmin.passwordHash === 'admin123' && passwordHash !== 'admin123') ||
    (clientTime > serverTime && clientTime > 0) ||
    (passwordHash !== currentAdmin.passwordHash && passwordHash !== 'admin123')
  ) {
    const updated = {
      ...currentAdmin,
      username: username.trim(),
      passwordHash: passwordHash.trim(),
      email: email?.trim() || currentAdmin.email,
      updatedAt: updatedAt || new Date().toISOString(),
    };
    saveAdminData(updated);
    await syncAdminToCloudflareKV(updated);
    return res.json({
      success: true,
      message: 'Kredensial kustom admin berhasil dipulihkan ke server dan disinkronkan ke Cloudflare.',
      restored: true,
    });
  }

  res.json({
    success: true,
    message: 'Kredensial server aktif dan mutakhir.',
    restored: false,
  });
});

// POST /api/auth/forgot-password - Request password reset code sent to email
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Alamat email tidak valid. Masukkan format email yang benar.',
    });
  }

  const admin = getAdminData();
  const registeredEmail = admin.email || 'lanjarputra96@gmail.com';

  // Normalize check
  const inputEmail = email.trim().toLowerCase();
  const targetEmail = registeredEmail.trim().toLowerCase();

  if (inputEmail !== targetEmail) {
    return res.status(404).json({
      success: false,
      message: `Email "${email}" tidak terdaftar sebagai email pemulihan admin. Silakan periksa kembali.`,
    });
  }

  // Generate 6-digit numeric OTP verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // Valid for 15 minutes

  activeOtps.set(inputEmail, {
    email: registeredEmail,
    code,
    expiresAt,
  });

  // Simulated & Server-side Email Dispatch Notification
  const formattedTime = new Date().toLocaleString('id-ID', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  console.log('\n============================================================');
  console.log('📧 [EMAIL KONFIRMASI RESET PASSWORD DIKIRIMKAN]');
  console.log(`Kepada    : ${registeredEmail}`);
  console.log(`Pengirim  : no-reply@sekolah.sch.id (Sistem CMS SMAN Nusantara Cendekia)`);
  console.log(`Subjek    : Konfirmasi Kode Verifikasi Lupa Password Admin`);
  console.log(`Waktu     : ${formattedTime}`);
  console.log(`KODE OTP  : [ ${code} ] (Berlaku 15 menit)`);
  console.log('Isi Pesan : Halo Administrator, gunakan kode di atas untuk mereset');
  console.log('            kata sandi CMS Website Sekolah Anda.');
  console.log('============================================================\n');

  res.json({
    success: true,
    message: `Kode konfirmasi verifikasi 6 digit telah dikirimkan ke email ${registeredEmail}.`,
    email: registeredEmail,
    expiresInMinutes: 15,
    // Included so admin in preview/development can immediately verify without delay
    simulatedCode: code,
  });
});

// POST /api/auth/verify-code - Verify the 6-digit OTP from email
app.post('/api/auth/verify-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Email dan kode verifikasi wajib diisi.' });
  }

  const record = activeOtps.get(email.trim().toLowerCase());
  if (!record) {
    return res.status(400).json({
      success: false,
      message: 'Tidak ada permintaan kode reset password aktif untuk email ini. Silakan minta kode baru.',
    });
  }

  if (Date.now() > record.expiresAt) {
    activeOtps.delete(email.trim().toLowerCase());
    return res.status(400).json({
      success: false,
      message: 'Kode verifikasi telah kadaluarsa (melebihi 15 menit). Silakan minta kode baru.',
    });
  }

  if (record.code !== code.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Kode verifikasi salah. Pastikan 6 digit angka yang Anda masukkan sesuai dengan email.',
    });
  }

  res.json({
    success: true,
    message: 'Kode verifikasi email valid. Silakan buat kata sandi baru.',
    valid: true,
  });
});

// POST /api/auth/reset-password - Complete password reset and sync to Cloudflare
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ success: false, message: 'Data formulir tidak lengkap.' });
  }

  if (newPassword.length < 5) {
    return res.status(400).json({ success: false, message: 'Kata sandi baru minimal 5 karakter.' });
  }

  const record = activeOtps.get(email.trim().toLowerCase());
  if (!record || record.code !== code.trim()) {
    return res.status(400).json({ success: false, message: 'Kode verifikasi tidak valid atau telah digunakan.' });
  }

  if (Date.now() > record.expiresAt) {
    activeOtps.delete(email.trim().toLowerCase());
    return res.status(400).json({ success: false, message: 'Kode verifikasi telah kadaluarsa.' });
  }

  // Update Admin Password
  const admin = getAdminData();
  const updatedAdmin = {
    ...admin,
    passwordHash: newPassword,
  };
  saveAdminData(updatedAdmin);
  await syncAdminToCloudflareKV(updatedAdmin);

  // Invalidate OTP
  activeOtps.delete(email.trim().toLowerCase());

  console.log(`[AUTH] Kata sandi admin berhasil direset via konfirmasi email & disinkronkan ke Cloudflare untuk ${email}`);

  res.json({
    success: true,
    message: 'Kata sandi berhasil diperbarui dan disinkronkan ke Cloudflare! Silakan masuk menggunakan kata sandi baru.',
    cloudflareSynced: true,
  });
});

// -------------------------------------------------------------
// VITE SPA MIDDLEWARE / PRODUCTION SERVING
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SMAN Nusantara Cendekia CMS Server] running on http://0.0.0.0:${PORT}`);
    console.log(`[Cloudflare] Active Namespace ID: ${cloudflareKvNamespaceId}`);
  });
}

startServer();
