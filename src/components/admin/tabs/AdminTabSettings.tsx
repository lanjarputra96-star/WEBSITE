import React, { useState, useEffect } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  KeyRound, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Copy,
  Mail,
  Smartphone,
  Server,
  Globe2,
  XCircle,
  HelpCircle
} from 'lucide-react';

export const AdminTabSettings: React.FC = () => {
  const { 
    adminUser, 
    updateAdminCredentials, 
    exportConfigAsJson, 
    importConfigFromJson, 
    resetToDefault,
    cloudflareSync,
    isSyncingCloudflare,
    syncToCloudflare,
    pullFromCloudflare,
    showToast 
  } = useSchool();

  const [username, setUsername] = useState(adminUser.username);
  const [email, setEmail] = useState(adminUser.email || 'lanjarputra96@gmail.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credMsg, setCredMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);

  // Cloudflare advanced settings
  const [showAdvancedCloudflare, setShowAdvancedCloudflare] = useState(false);
  const [cfAccountId, setCfAccountId] = useState('');
  const [cfApiToken, setCfApiToken] = useState('');
  const [cfKvNamespaceId, setCfKvNamespaceId] = useState(cloudflareSync.kvNamespaceId || '');
  const [cfSaveMsg, setCfSaveMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isTestingCf, setIsTestingCf] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    // Fetch current server cloudflare status
    fetch('/api/cloudflare/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.kvNamespaceId) {
          setCfKvNamespaceId(data.kvNamespaceId);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setCredMsg({ text: 'Konfirmasi password baru tidak cocok.', isError: true });
      return;
    }

    setIsUpdatingCreds(true);
    const res = await updateAdminCredentials(
      oldPassword, 
      newPassword || oldPassword, 
      username, 
      email
    );
    setIsUpdatingCreds(false);

    if (res.success) {
      setCredMsg({ text: 'Kredensial dan email pemulihan admin berhasil diperbarui!', isError: false });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setCredMsg({ text: res.message, isError: true });
    }
  };

  const copyCloudflareId = () => {
    navigator.clipboard.writeText(cloudflareSync.kvNamespaceId);
    showToast('Kode Cloudflare disalin ke clipboard!');
  };

  const handleTestConnection = async () => {
    setIsTestingCf(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/cloudflare/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: cfAccountId,
          apiToken: cfApiToken,
          kvNamespaceId: cfKvNamespaceId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ success: true, message: data.message });
        if (data.matchedNamespaceId) {
          setCfKvNamespaceId(data.matchedNamespaceId);
        }
      } else {
        setTestResult({ success: false, message: data.message || 'Gagal menguji koneksi Cloudflare.' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: 'Gagal menghubungi server untuk pengujian.' });
    } finally {
      setIsTestingCf(false);
    }
  };

  const handleSaveCfConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setCfSaveMsg(null);

    if (cfAccountId && cfAccountId.includes('@')) {
      setCfSaveMsg({
        text: 'Perhatian: Cloudflare Account ID bukan berupa email. Silakan gunakan 32 karakter Account ID dari dasbor Cloudflare Anda.',
        isError: true,
      });
      return;
    }

    try {
      const res = await fetch('/api/cloudflare/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: cfAccountId,
          apiToken: cfApiToken,
          kvNamespaceId: cfKvNamespaceId,
        }),
      });
      const data = await res.json();
      setCfSaveMsg({
        text: data.message || 'Konfigurasi Cloudflare berhasil disimpan.',
        isError: false,
      });
      showToast('Konfigurasi Cloudflare tersimpan!');
    } catch {
      setCfSaveMsg({ text: 'Gagal menyimpan konfigurasi Cloudflare.', isError: true });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importConfigFromJson(content);
        if (!res.success) {
          alert(res.message);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetClick = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mereset seluruh data website kembali ke kondisi bawaan awal? Semua perubahan kustom Anda akan ditimpa dan disinkronkan ke Cloudflare.'
      )
    ) {
      resetToDefault();
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-extrabold text-slate-900">
          Pengaturan Akun, Cloudflare & Cadangan Data
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola sinkronisasi cloud multi-perangkat, ubah kata sandi & email pemulihan, atau cadangkan data JSON.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 1. CLOUDFLARE PERSISTENCE & MULTI-DEVICE SYNC CARD */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Penyimpanan Cloudflare & Multi-Perangkat
                </h3>
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Aktif & Terhubung
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Semua data tersimpan di Cloudflare agar dapat dilihat oleh siapa saja di semua gawai (ponsel, laptop, tablet).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSyncingCloudflare}
              onClick={pullFromCloudflare}
              className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-white font-semibold text-xs px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloudflare ? 'animate-spin' : ''}`} />
              <span>Tarik Data Cloud</span>
            </button>
            <button
              type="button"
              disabled={isSyncingCloudflare}
              onClick={syncToCloudflare}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-md"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Sinkronkan Sekarang</span>
            </button>
          </div>
        </div>

        {/* Namespace ID Box */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Kode Cloudflare KV Storage
              </span>
              <span className="font-mono text-xs sm:text-sm text-amber-300 font-semibold break-all">
                {cloudflareSync.kvNamespaceId}
              </span>
            </div>
            <button
              type="button"
              onClick={copyCloudflareId}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition cursor-pointer w-fit"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Kode</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Responsif di seluruh gawai</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Server className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Penyimpanan awan permanen</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Globe2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sinkronisasi otomatis saat simpan</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 pt-1">
          <span>Status: <strong className="text-slate-200">{cloudflareSync.message || 'Tersinkronisasi'}</strong></span>
          {cloudflareSync.lastSyncedAt && (
            <span className="text-[11px] text-slate-400">
              Sinkronisasi Terakhir: {new Date(cloudflareSync.lastSyncedAt).toLocaleString('id-ID')}
            </span>
          )}
        </div>

        {/* Toggle Advanced Cloudflare Settings */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvancedCloudflare(!showAdvancedCloudflare)}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
          >
            {showAdvancedCloudflare ? 'Sembunyikan Pengaturan Lanjutan Cloudflare' : 'Pengaturan Lanjutan Cloudflare REST API (Opsional)'}
          </button>

          {showAdvancedCloudflare && (
            <form onSubmit={handleSaveCfConfig} className="mt-3 p-4 sm:p-5 bg-slate-950/90 rounded-2xl border border-slate-700 space-y-4">
              <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-3 text-xs text-blue-200 space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-blue-300">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>Panduan Menghubungkan Akun Cloudflare Pribadi:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-200/90">
                  1. <strong>Cloudflare Account ID</strong>: Buka dasbor Cloudflare Anda &rarr; klik domain Anda atau menu Workers &rarr; lihat di panel sebelah kanan untuk menyalin 32 karakter Account ID (<em>bukan alamat email</em>).<br />
                  2. <strong>API Token</strong>: Buka <em>My Profile &rarr; API Tokens &rarr; Create Token</em> (pilih template <em>Edit Cloudflare Workers</em> atau izin <em>Account: Workers KV Storage: Edit</em>).<br />
                  3. <strong>KV Namespace ID</strong>: ID Namespace KV (32 karakter) tempat data sekolah disimpan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Cloudflare Account ID (32 Karakter)
                  </label>
                  <input
                    type="text"
                    value={cfAccountId}
                    onChange={(e) => setCfAccountId(e.target.value)}
                    placeholder="Contoh: a8f9c1234567890abcdef..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Jangan gunakan email. Gunakan ID heksadesimal.</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Cloudflare API Token
                  </label>
                  <input
                    type="password"
                    value={cfApiToken}
                    onChange={(e) => setCfApiToken(e.target.value)}
                    placeholder="Bearer token Cloudflare"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Token berizin Workers KV Edit.</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    KV Namespace ID
                  </label>
                  <input
                    type="text"
                    value={cfKvNamespaceId}
                    onChange={(e) => setCfKvNamespaceId(e.target.value)}
                    placeholder="Contoh: 5b4256f6..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">ID KV Namespace Cloudflare.</span>
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    testResult.success
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              {cfSaveMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    !cfSaveMsg.isError
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  }`}
                >
                  {!cfSaveMsg.isError ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{cfSaveMsg.text}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingCf || !cfAccountId || !cfApiToken}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingCf ? 'animate-spin' : ''}`} />
                  <span>{isTestingCf ? 'Menguji Koneksi...' : 'Uji Koneksi Cloudflare KV'}</span>
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
                >
                  Simpan Konfigurasi Cloudflare
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. ADMIN ACCOUNT CREDENTIALS & RECOVERY EMAIL */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>Keamanan Akun Administrator & Email Pemulihan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ubah username, kata sandi, atau alamat email pemulihan yang menerima kode konfirmasi verifikasi.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 w-fit">
            <Cloud className="w-3.5 h-3.5 text-amber-600" />
            <span>Tersinkron ke Cloudflare (Semua Gawai)</span>
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Sinkronisasi Kata Sandi Multi-Perangkat Aktif:</strong> Ketika Anda mengganti kata sandi di sini, perubahan langsung disimpan ke Cloudflare dan cloud server. Anda dapat langsung masuk dengan kata sandi baru tersebut di semua perangkat lain (HP, laptop, komputer) secara otomatis.
          </div>
        </div>

        {credMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium ${
              credMsg.isError
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {credMsg.text}
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username Admin *
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Email Pemulihan Kata Sandi *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Menerima kode verifikasi jika lupa password
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kata Sandi Saat Ini (Current Password) *
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan kata sandi saat ini untuk verifikasi..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kata Sandi Baru (Opsional)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin diubah"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ulangi Kata Sandi Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi password baru"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingCreds}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isUpdatingCreds ? 'Menyimpan...' : 'Perbarui Kredensial & Email'}</span>
          </button>
        </form>
      </div>

      {/* ============================================================ */}
      {/* 3. BACKUP & RESTORE SECTION */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Cadangkan & Pulihkan Konten (Backup / Restore)</span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Anda dapat mengekspor seluruh konfigurasi website sekolah ini ke dalam file JSON untuk dicadangkan di komputer Anda, atau mengimpor file backup untuk memulihkan seluruh konten.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportConfigAsJson}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor File JSON (Unduh Cadangan)</span>
          </button>

          <label className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Impor File JSON (Pulihkan)</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. DANGER ZONE: RESET TO DEFAULTS */}
      {/* ============================================================ */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>Zona Pemulihan Awal (Reset Default)</span>
        </div>

        <p className="text-xs text-rose-700 leading-relaxed max-w-2xl">
          Tindakan ini akan mengembalikan seluruh teks, berita, guru, fasilitas, dan gambar ke data contoh awal sekolah (default preset) dan menyinkronkannya ke Cloudflare. Data kustom yang belum diekspor akan diganti.
        </p>

        <button
          onClick={handleResetClick}
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset ke Pengaturan Awal Pabrik</span>
        </button>
      </div>
    </div>
  );
};
