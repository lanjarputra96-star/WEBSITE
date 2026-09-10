import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  X, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';

type ModalMode = 'login' | 'forgot_request' | 'forgot_verify' | 'forgot_new_password' | 'forgot_success';

export const AdminLoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    login, 
    adminUser, 
    setCurrentView,
    requestPasswordResetOtp,
    verifyResetOtp,
    completePasswordReset
  } = useSchool();

  // Mode state
  const [mode, setMode] = useState<ModalMode>('login');

  // Login form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot password form states
  const [recoveryEmail, setRecoveryEmail] = useState(adminUser.email || 'lanjarputra96@gmail.com');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedCodePreview, setSimulatedCodePreview] = useState<string | null>(null);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        setCurrentView('admin');
        resetModalStates();
      } else {
        setErrorMsg('Username atau kata sandi tidak cocok. Silakan coba lagi.');
      }
    } catch (err: any) {
      setErrorMsg('Gagal memverifikasi login dengan cloud. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModalStates = () => {
    setMode('login');
    setErrorMsg(null);
    setUsername('');
    setPassword('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setSimulatedCodePreview(null);
    setForgotSuccessMsg(null);
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    resetModalStates();
  };

  // 1. Request Reset Code via Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await requestPasswordResetOtp(recoveryEmail);
    setIsLoading(false);

    if (res.success) {
      setForgotSuccessMsg(res.message);
      setMode('forgot_verify');
    } else {
      setErrorMsg(res.message || 'Gagal mengirim kode verifikasi ke email.');
    }
  };

  // 2. Verify 6-digit Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await verifyResetOtp(recoveryEmail, verificationCode);
    setIsLoading(false);

    if (res.success) {
      setMode('forgot_new_password');
    } else {
      setErrorMsg(res.message || 'Kode verifikasi tidak cocok atau telah kadaluarsa.');
    }
  };

  // 3. Complete Reset with New Password
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 5) {
      setErrorMsg('Kata sandi baru minimal 5 karakter.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setIsLoading(true);
    const res = await completePasswordReset(recoveryEmail, verificationCode, newPassword);
    setIsLoading(false);

    if (res.success) {
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setMode('forgot_success');
    } else {
      setErrorMsg(res.message || 'Gagal mereset kata sandi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              {mode === 'login' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : mode === 'forgot_success' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Mail className="w-6 h-6 text-sky-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {mode === 'login' && 'Login Admin CMS'}
                {mode === 'forgot_request' && 'Lupa Kata Sandi'}
                {mode === 'forgot_verify' && 'Konfirmasi Email'}
                {mode === 'forgot_new_password' && 'Buat Sandi Baru'}
                {mode === 'forgot_success' && 'Reset Berhasil'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'login' && 'Kelola konten website sekolah & sinkronisasi cloud'}
                {mode === 'forgot_request' && 'Kode konfirmasi akan dikirim ke email terdaftar'}
                {mode === 'forgot_verify' && 'Masukkan 6 digit kode dari kotak masuk email'}
                {mode === 'forgot_new_password' && 'Tentukan kata sandi baru untuk akun administrator'}
                {mode === 'forgot_success' && 'Kata sandi berhasil diperbarui'}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: NORMAL LOGIN */}
        {/* ============================================================ */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-4">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Kata Sandi / Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setMode('forgot_request');
                  }}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold hover:underline cursor-pointer"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-70 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Memverifikasi Cloud...' : 'Masuk ke Panel Pengaturan'}</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Kata sandi terhubung dan tersinkronisasi otomatis via Cloudflare ke semua gawai.
              </p>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
              >
                Kembali ke Landing Page
              </button>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: FORGOT PASSWORD - STEP 1 REQUEST EMAIL */}
        {/* ============================================================ */}
        {mode === 'forgot_request' && (
          <form onSubmit={handleRequestOtp} className="p-6 sm:p-8 space-y-4">
            <div className="bg-sky-50 border border-sky-200 text-sky-900 text-xs p-3.5 rounded-xl leading-relaxed flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                Masukkan alamat email administrator yang terdaftar (misal: <b>{adminUser.email}</b>). Sistem akan mengirimkan kode konfirmasi verifikasi 6 digit ke kotak masuk email Anda.
              </span>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="admin@sekolah.sch.id"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengirimkan Kode...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Kirim Kode Konfirmasi ke Email</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setMode('login');
                }}
                className="w-full py-2.5 text-xs text-slate-600 hover:text-slate-800 font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-100 rounded-xl transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Login</span>
              </button>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: FORGOT PASSWORD - STEP 2 VERIFY 6-DIGIT CODE */}
        {/* ============================================================ */}
        {mode === 'forgot_verify' && (
          <form onSubmit={handleVerifyOtp} className="p-6 sm:p-8 space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-3.5 rounded-xl leading-relaxed flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Kode Konfirmasi Terkirim!</p>
                <p className="text-emerald-800 mt-0.5">
                  Kode 6-digit telah dikirimkan ke <b>{recoveryEmail}</b>. Silakan cek kotak masuk email Anda.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                Masukkan 6 Digit Kode Konfirmasi
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full py-3 px-4 text-center font-mono text-xl tracking-[0.5em] font-bold bg-slate-50 border-2 border-blue-500 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              <p className="text-[11px] text-slate-500 text-center mt-1.5">
                Kode berlaku selama 15 menit
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading || verificationCode.length < 6}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Kode...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verifikasi Kode Email</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-blue-700 hover:text-blue-900 hover:underline font-semibold cursor-pointer"
                >
                  Kirim Ulang Kode
                </button>
                <button
                  type="button"
                  onClick={() => setMode('forgot_request')}
                  className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                >
                  Ubah Alamat Email
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: FORGOT PASSWORD - STEP 3 ENTER NEW PASSWORD */}
        {/* ============================================================ */}
        {mode === 'forgot_new_password' && (
          <form onSubmit={handleSaveNewPassword} className="p-6 sm:p-8 space-y-4">
            <div className="bg-blue-50 border border-blue-200 text-blue-900 text-xs p-3 rounded-xl flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Verifikasi email berhasil! Silakan masukkan kata sandi baru Anda.</span>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi Baru *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 5 karakter"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ulangi Kata Sandi Baru *
              </label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Konfirmasi password baru"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menyimpan ke Cloud...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan & Terapkan Sandi Baru</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* VIEW 5: FORGOT PASSWORD - STEP 4 SUCCESS */}
        {/* ============================================================ */}
        {mode === 'forgot_success' && (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                Kata Sandi Berhasil Diperbarui!
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                Kata sandi baru telah tersimpan permanen di cloud server dan Cloudflare. Anda sekarang dapat masuk kembali.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk dengan Kata Sandi Baru</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
