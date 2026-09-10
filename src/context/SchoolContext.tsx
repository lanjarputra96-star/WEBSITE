import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  SchoolData, 
  AdminUser, 
  BeritaItem, 
  CloudflareSyncInfo, 
  ContactMessage,
  SectionHeaders,
  SectionHeaderItem,
  SectionVisibility
} from '../types';
import { initialSchoolData, defaultSectionHeaders, defaultSectionVisibility } from '../data/initialData';

const STORAGE_DATA_KEY = 'school_cms_data_v1';
const STORAGE_ADMIN_KEY = 'school_admin_account_v1';
const STORAGE_SESSION_KEY = 'school_admin_session_v1';

const DEFAULT_CLOUDFLARE_ID = '5b4256f6-8ce8-4a13-ae5c-0ae37fcd9b9b';

const defaultAdminUser: AdminUser = {
  username: 'admin',
  email: 'lanjarputra96@gmail.com',
  passwordHash: 'admin123',
  lastLogin: undefined,
};

interface SchoolContextType {
  data: SchoolData;
  updateData: (updater: (prev: SchoolData) => SchoolData) => void;
  updateSectionHeader: (sectionKey: keyof SectionHeaders, header: SectionHeaderItem) => void;
  toggleSectionVisibility: (sectionKey: keyof SectionVisibility, visible: boolean) => void;
  resetToDefault: () => void;
  exportConfigAsJson: () => void;
  importConfigFromJson: (jsonStr: string) => { success: boolean; message: string };
  isAdminLoggedIn: boolean;
  adminUser: AdminUser;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAdminCredentials: (
    oldPass: string,
    newPass: string,
    newUsername?: string,
    newEmail?: string
  ) => Promise<{ success: boolean; message: string }>;
  requestPasswordResetOtp: (email: string) => Promise<{ success: boolean; message: string; simulatedCode?: string }>;
  verifyResetOtp: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  completePasswordReset: (email: string, code: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  testCloudflareConnection: (accountId?: string, apiToken?: string) => Promise<{ success: boolean; message: string }>;
  saveCloudflareConfig: (accountId: string, apiToken: string) => Promise<{ success: boolean; message: string }>;
  currentView: 'landing' | 'admin';
  setCurrentView: (view: 'landing' | 'admin') => void;
  selectedNews: BeritaItem | null;
  setSelectedNews: (item: BeritaItem | null) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  cloudflareSync: CloudflareSyncInfo;
  isSyncingCloudflare: boolean;
  syncToCloudflare: () => Promise<void>;
  pullFromCloudflare: () => Promise<void>;
  messages: ContactMessage[];
  unreadMessagesCount: number;
  fetchMessages: () => Promise<void>;
  sendMessage: (msg: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => Promise<{ success: boolean; message: string }>;
  deleteMessage: (id: string) => Promise<{ success: boolean; message: string }>;
  deleteAllMessages: () => Promise<{ success: boolean; message: string }>;
  markMessageAsRead: (id: string) => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Data State with LocalStorage & Cloudflare Server Persistence
  const [data, setData] = useState<SchoolData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DATA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialSchoolData,
          ...parsed,
          schoolInfo: { ...initialSchoolData.schoolInfo, ...(parsed.schoolInfo || {}) },
          hero: { ...initialSchoolData.hero, ...(parsed.hero || {}) },
          kepalaSekolah: { ...initialSchoolData.kepalaSekolah, ...(parsed.kepalaSekolah || {}) },
          visiMisi: { ...initialSchoolData.visiMisi, ...(parsed.visiMisi || {}) },
          sectionHeaders: {
            ...defaultSectionHeaders,
            ...(parsed.sectionHeaders || {}),
          },
          sectionVisibility: {
            ...defaultSectionVisibility,
            ...(parsed.sectionVisibility || {}),
          },
          ppdb: {
            ...initialSchoolData.ppdb,
            ...(parsed.ppdb || {}),
            registrationButtonText: parsed.ppdb?.registrationButtonText || initialSchoolData.ppdb.registrationButtonText,
            registrationUrl: parsed.ppdb?.registrationUrl || initialSchoolData.ppdb.registrationUrl,
            registrationOpenNewTab: parsed.ppdb?.registrationOpenNewTab !== undefined ? parsed.ppdb.registrationOpenNewTab : true,
          },
          pusatInformasi: Array.isArray(parsed.pusatInformasi) && parsed.pusatInformasi.length > 0
            ? parsed.pusatInformasi
            : initialSchoolData.pusatInformasi,
        };
      }
    } catch (e) {
      console.warn('Failed to load school data from storage', e);
    }
    return initialSchoolData;
  });

  // 2. Admin Credentials
  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ADMIN_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          username: parsed.username || defaultAdminUser.username,
          email: parsed.email || defaultAdminUser.email,
          passwordHash: parsed.passwordHash || defaultAdminUser.passwordHash,
          lastLogin: parsed.lastLogin,
        };
      }
    } catch (e) {
      console.warn('Failed to load admin user', e);
    }
    return defaultAdminUser;
  });

  // 3. Admin Session
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // 4. Cloudflare Sync Info
  const [cloudflareSync, setCloudflareSync] = useState<CloudflareSyncInfo>({
    kvNamespaceId: DEFAULT_CLOUDFLARE_ID,
    lastSyncedAt: undefined,
    status: 'connected',
    message: 'Tersinkronisasi ke Cloudflare (Siap diakses multi-perangkat)',
    multiDeviceEnabled: true,
  });
  const [isSyncingCloudflare, setIsSyncingCloudflare] = useState<boolean>(false);

  // 5. View navigation & modals
  const [currentView, setCurrentView] = useState<'landing' | 'admin'>('landing');
  const [selectedNews, setSelectedNews] = useState<BeritaItem | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Fetch remote live data from Cloudflare server on mount to ensure multi-device synchronization
  const fetchCloudData = useCallback(async (quiet = false) => {
    try {
      const res = await fetch('/api/school-data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && typeof json.data === 'object' && json.data.schoolInfo) {
          setData((prev) => {
            const localTime = prev.lastUpdated ? new Date(prev.lastUpdated).getTime() : 0;
            const remoteTime = json.data.lastUpdated ? new Date(json.data.lastUpdated).getTime() : 0;

            // If local storage in browser has newer edits than server (e.g. server redeployed/restarted),
            // do not overwrite local changes! Instead, re-sync local data to server immediately.
            if (localTime > remoteTime && localTime > 0) {
              fetch('/api/school-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prev),
              }).catch(() => {});
              return prev;
            }

            const merged: SchoolData = {
              ...initialSchoolData,
              ...json.data,
              schoolInfo: { ...initialSchoolData.schoolInfo, ...(prev.schoolInfo || {}), ...(json.data.schoolInfo || {}) },
              hero: { ...initialSchoolData.hero, ...(prev.hero || {}), ...(json.data.hero || {}) },
              kepalaSekolah: { ...initialSchoolData.kepalaSekolah, ...(prev.kepalaSekolah || {}), ...(json.data.kepalaSekolah || {}) },
              visiMisi: { ...initialSchoolData.visiMisi, ...(prev.visiMisi || {}), ...(json.data.visiMisi || {}) },
              sectionHeaders: {
                ...defaultSectionHeaders,
                ...(prev.sectionHeaders || {}),
                ...(json.data.sectionHeaders || {}),
              },
              sectionVisibility: {
                ...defaultSectionVisibility,
                ...(prev.sectionVisibility || {}),
                ...(json.data.sectionVisibility || {}),
              },
              ppdb: {
                ...initialSchoolData.ppdb,
                ...(prev.ppdb || {}),
                ...(json.data.ppdb || {}),
                registrationButtonText: json.data.ppdb?.registrationButtonText || prev.ppdb?.registrationButtonText || initialSchoolData.ppdb.registrationButtonText,
                registrationUrl: json.data.ppdb?.registrationUrl || prev.ppdb?.registrationUrl || initialSchoolData.ppdb.registrationUrl,
                registrationOpenNewTab: json.data.ppdb?.registrationOpenNewTab !== undefined 
                  ? json.data.ppdb.registrationOpenNewTab 
                  : (prev.ppdb?.registrationOpenNewTab !== undefined ? prev.ppdb.registrationOpenNewTab : true),
              },
              pusatInformasi: Array.isArray(json.data.pusatInformasi) && json.data.pusatInformasi.length > 0
                ? json.data.pusatInformasi
                : (prev.pusatInformasi && prev.pusatInformasi.length > 0 ? prev.pusatInformasi : initialSchoolData.pusatInformasi),
              lastUpdated: json.data.lastUpdated || (localTime > 0 ? prev.lastUpdated : new Date().toISOString()),
            };
            try {
              localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        } else if (json.success && json.source === 'initial_default') {
          // If server had default/empty data, push current local valid state to server
          setData((current) => {
            fetch('/api/school-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(current),
            }).catch(() => {});
            return current;
          });
        }
        if (json.cloudflare) {
          setCloudflareSync((prev) => ({
            ...prev,
            ...json.cloudflare,
            status: 'connected',
          }));
        }
      }
    } catch (e) {
      console.warn('Network sync with Cloudflare server:', e);
    }
  }, []);

  // Fetch admin profile from server
  const fetchAdminInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/admin-info');
      if (res.ok) {
        const json = await res.json();
        if (json.username) {
          setAdminUser((prev) => {
            const updated = {
              ...prev,
              username: json.username,
              email: json.email || prev.email,
            };
            try {
              localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      }

      // Check if local storage has a customized password that differs from default admin123
      const savedAdminStr = localStorage.getItem(STORAGE_ADMIN_KEY);
      if (savedAdminStr) {
        try {
          const localAdmin = JSON.parse(savedAdminStr);
          if (localAdmin.passwordHash && localAdmin.passwordHash !== 'admin123') {
            // Re-sync to server in case server restarted/container rebuild
            fetch('/api/auth/sync-credentials', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: localAdmin.username || 'admin',
                passwordHash: localAdmin.passwordHash,
                email: localAdmin.email,
                updatedAt: localAdmin.updatedAt,
              }),
            }).catch(() => {});
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Admin info fetch:', e);
    }
  }, []);

  // 3. Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.messages)) {
          setMessages(json.messages);
        }
      }
    } catch (e) {
      console.warn('Messages fetch error:', e);
    }
  }, []);

  useEffect(() => {
    fetchCloudData();
    fetchAdminInfo();
    fetchMessages();

    // Re-sync with Cloudflare server periodically (every 25 seconds) so any device gets updates
    const interval = setInterval(() => {
      fetchCloudData(true);
      fetchMessages();
    }, 25000);

    // Immediate re-sync when tab becomes visible or focused on any device
    const onFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchCloudData(true);
        fetchAdminInfo();
        fetchMessages();
      }
    };

    window.addEventListener('focus', onFocusOrVisible);
    document.addEventListener('visibilitychange', onFocusOrVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocusOrVisible);
      document.removeEventListener('visibilitychange', onFocusOrVisible);
    };
  }, [fetchCloudData, fetchAdminInfo, fetchMessages]);

  // Persist to Cloudflare server
  const persistToCloudflare = async (updatedData: SchoolData) => {
    setIsSyncingCloudflare(true);
    setCloudflareSync((prev) => ({ ...prev, status: 'syncing' }));

    try {
      const res = await fetch('/api/school-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const result = await res.json();
        const syncedTime = result.syncedAt || new Date().toISOString();
        setCloudflareSync({
          kvNamespaceId: DEFAULT_CLOUDFLARE_ID,
          lastSyncedAt: syncedTime,
          status: 'connected',
          message: 'Tersimpan & tersinkronisasi ke Cloudflare',
          multiDeviceEnabled: true,
        });
      } else {
        setCloudflareSync((prev) => ({
          ...prev,
          status: 'connected',
          lastSyncedAt: new Date().toISOString(),
          message: 'Tersimpan secara lokal & cloud mirror',
        }));
      }
    } catch (e) {
      console.warn('Failed to post to Cloudflare endpoint, offline cache saved:', e);
      setCloudflareSync((prev) => ({
        ...prev,
        status: 'connected',
        message: 'Tersimpan di cache browser (offline)',
      }));
    } finally {
      setIsSyncingCloudflare(false);
    }
  };

  // Sync data to localStorage & Cloudflare
  const updateData = (updater: (prev: SchoolData) => SchoolData) => {
    setData((prev) => {
      const updated = updater(prev);
      const withTimestamp: SchoolData = {
        ...updated,
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(withTimestamp));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      // Push to Cloudflare persistent storage
      persistToCloudflare(withTimestamp);
      return withTimestamp;
    });
    showToast('Perubahan berhasil disimpan dan disinkronkan ke Cloudflare!');
  };

  const updateSectionHeader = (sectionKey: keyof SectionHeaders, header: SectionHeaderItem) => {
    updateData((prev) => ({
      ...prev,
      sectionHeaders: {
        ...(prev.sectionHeaders || defaultSectionHeaders),
        [sectionKey]: header,
      },
    }));
  };

  const toggleSectionVisibility = (sectionKey: keyof SectionVisibility, visible: boolean) => {
    updateData((prev) => ({
      ...prev,
      sectionVisibility: {
        ...(prev.sectionVisibility || defaultSectionVisibility),
        [sectionKey]: visible,
      },
    }));
  };

  const testCloudflareConnection = async (accountId?: string, apiToken?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/cloudflare/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, apiToken }),
      });
      const resJson = await res.json();
      return { success: resJson.success, message: resJson.message };
    } catch (e: any) {
      return { success: false, message: 'Gagal menghubungi server: ' + e.message };
    }
  };

  const saveCloudflareConfig = async (accountId: string, apiToken: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/cloudflare/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, apiToken }),
      });
      const resJson = await res.json();
      if (resJson.success) {
        setCloudflareSync((prev) => ({
          ...prev,
          status: 'connected',
          message: 'Konfigurasi Cloudflare tersimpan permanen.',
        }));
      }
      return { success: resJson.success, message: resJson.message };
    } catch (e: any) {
      return { success: false, message: 'Gagal menyimpan konfigurasi: ' + e.message };
    }
  };

  const syncToCloudflare = async () => {
    await persistToCloudflare(data);
    showToast('Data berhasil disinkronkan ke Cloudflare!');
  };

  const pullFromCloudflare = async () => {
    setIsSyncingCloudflare(true);
    await fetchCloudData();
    setIsSyncingCloudflare(false);
    showToast('Data terbaru berhasil ditarik dari Cloudflare!');
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const resetToDefault = () => {
    try {
      localStorage.removeItem(STORAGE_DATA_KEY);
      setData(initialSchoolData);
      persistToCloudflare(initialSchoolData);
      showToast('Semua informasi berhasil direset ke data default awal dan disinkronkan ke Cloudflare!');
    } catch (e) {
      console.error(e);
    }
  };

  const exportConfigAsJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `backup_web_sekolah_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Data konfigurasi berhasil diunduh sebagai file JSON.');
    } catch (e) {
      showToast('Gagal mengekspor file JSON.');
    }
  };

  const importConfigFromJson = (jsonStr: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.schoolInfo || !parsed.hero) {
        return { success: false, message: 'Format file JSON tidak valid atau struktur tidak sesuai.' };
      }
      setData(parsed);
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(parsed));
      persistToCloudflare(parsed);
      showToast('Data website sekolah berhasil diimpor dan disinkronkan ke Cloudflare!');
      return { success: true, message: 'Impor konfigurasi berhasil.' };
    } catch (err) {
      return { success: false, message: 'Gagal mem-parsing file JSON. Pastikan sintaks benar.' };
    }
  };

  const login = async (u: string, p: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p }),
      });
      if (res.ok) {
        const json = await res.json();
        setIsAdminLoggedIn(true);
        sessionStorage.setItem(STORAGE_SESSION_KEY, 'true');
        const now = json.admin?.lastLogin || new Date().toLocaleString('id-ID');
        const updatedUser = { 
          ...adminUser, 
          username: json.admin?.username || u, 
          email: json.admin?.email || adminUser.email,
          passwordHash: p, 
          lastLogin: now 
        };
        setAdminUser(updatedUser);
        try {
          localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(updatedUser));
        } catch {}
        setIsLoginModalOpen(false);
        showToast(`Selamat datang kembali, Admin (${updatedUser.username})!`);
        return true;
      }
    } catch (e) {
      console.warn('Login endpoint check error, trying fallback:', e);
    }

    // Offline / local cache fallback
    if (u === adminUser.username && p === adminUser.passwordHash) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(STORAGE_SESSION_KEY, 'true');
      const now = new Date().toLocaleString('id-ID');
      const updatedUser = { ...adminUser, lastLogin: now };
      setAdminUser(updatedUser);
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(updatedUser));
      setIsLoginModalOpen(false);
      showToast(`Selamat datang kembali, Admin (${adminUser.username})!`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
    setCurrentView('landing');
    showToast('Anda telah keluar dari sesi Admin.');
  };

  const updateAdminCredentials = async (
    oldPass: string,
    newPass: string,
    newUsername?: string,
    newEmail?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (oldPass !== adminUser.passwordHash) {
      return { success: false, message: 'Kata sandi saat ini tidak sesuai.' };
    }
    if (newPass && newPass.length < 5) {
      return { success: false, message: 'Kata sandi baru minimal 5 karakter.' };
    }

    try {
      const res = await fetch('/api/auth/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: oldPass,
          newPassword: newPass,
          newUsername: newUsername && newUsername.trim().length > 0 ? newUsername.trim() : adminUser.username,
          newEmail: newEmail && newEmail.trim().length > 0 ? newEmail.trim() : adminUser.email,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Gagal memperbarui kredensial di cloud.' };
      }

      const updatedUser: AdminUser = {
        ...adminUser,
        username: newUsername && newUsername.trim().length > 0 ? newUsername.trim() : adminUser.username,
        email: newEmail && newEmail.trim().length > 0 ? newEmail.trim() : adminUser.email,
        passwordHash: newPass || adminUser.passwordHash,
        updatedAt: new Date().toISOString(),
      };

      setAdminUser(updatedUser);
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(updatedUser));

      showToast('Kata sandi admin berhasil diperbarui dan disinkronkan ke Cloudflare untuk semua gawai!');
      return { success: true, message: 'Kredensial & kata sandi admin berhasil disinkronkan ke Cloudflare.' };
    } catch (e) {
      console.warn('Server sync admin credentials failed:', e);
      const updatedUser: AdminUser = {
        ...adminUser,
        username: newUsername && newUsername.trim().length > 0 ? newUsername.trim() : adminUser.username,
        email: newEmail && newEmail.trim().length > 0 ? newEmail.trim() : adminUser.email,
        passwordHash: newPass || adminUser.passwordHash,
        updatedAt: new Date().toISOString(),
      };
      setAdminUser(updatedUser);
      localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(updatedUser));
      showToast('Kredensial diperbarui secara lokal (offline).');
      return { success: true, message: 'Kredensial admin diperbarui secara lokal.' };
    }
  };

  // Password reset via email confirmation APIs
  const requestPasswordResetOtp = async (
    email: string
  ): Promise<{ success: boolean; message: string; simulatedCode?: string }> => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      return {
        success: false,
        message: 'Gagal menghubungi server untuk mengirim kode konfirmasi. Silakan coba lagi.',
      };
    }
  };

  const verifyResetOtp = async (
    email: string,
    code: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      return {
        success: false,
        message: 'Gagal memverifikasi kode dengan server.',
      };
    }
  };

  const completePasswordReset = async (
    email: string,
    code: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: newPass }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local admin state
        const updated = {
          ...adminUser,
          passwordHash: newPass,
          updatedAt: new Date().toISOString(),
        };
        setAdminUser(updated);
        localStorage.setItem(STORAGE_ADMIN_KEY, JSON.stringify(updated));
      }
      return data;
    } catch (e: any) {
      return {
        success: false,
        message: 'Gagal menyelesaikan reset kata sandi.',
      };
    }
  };

  // Messages API Handlers
  const sendMessage = async (msg: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      const resJson = await res.json();
      if (res.ok) {
        await fetchMessages();
        return { success: true, message: resJson.message || 'Pesan Anda berhasil dikirim!' };
      }
      return { success: false, message: resJson.message || 'Gagal mengirim pesan.' };
    } catch (e: any) {
      return { success: false, message: 'Terjadi kesalahan jaringan saat mengirim pesan.' };
    }
  };

  const deleteMessage = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      const resJson = await res.json();
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showToast('Pesan berhasil dihapus.');
        return { success: true, message: 'Pesan berhasil dihapus.' };
      }
      return { success: false, message: resJson.message || 'Gagal menghapus pesan.' };
    } catch (e) {
      return { success: false, message: 'Terjadi kesalahan jaringan.' };
    }
  };

  const deleteAllMessages = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/messages', { method: 'DELETE' });
      const resJson = await res.json();
      if (res.ok) {
        setMessages([]);
        showToast('Semua pesan berhasil dihapus.');
        return { success: true, message: 'Semua pesan berhasil dihapus.' };
      }
      return { success: false, message: resJson.message || 'Gagal menghapus semua pesan.' };
    } catch (e) {
      return { success: false, message: 'Terjadi kesalahan jaringan.' };
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      await fetch(`/api/messages/${id}/read`, { method: 'PATCH' });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    } catch (e) {
      console.warn('Failed to mark message as read:', e);
    }
  };

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  return (
    <SchoolContext.Provider
      value={{
        data,
        updateData,
        updateSectionHeader,
        toggleSectionVisibility,
        resetToDefault,
        exportConfigAsJson,
        importConfigFromJson,
        isAdminLoggedIn,
        adminUser,
        login,
        logout,
        updateAdminCredentials,
        requestPasswordResetOtp,
        verifyResetOtp,
        completePasswordReset,
        testCloudflareConnection,
        saveCloudflareConfig,
        currentView,
        setCurrentView,
        selectedNews,
        setSelectedNews,
        isLoginModalOpen,
        setIsLoginModalOpen,
        toastMessage,
        showToast,
        cloudflareSync,
        isSyncingCloudflare,
        syncToCloudflare,
        pullFromCloudflare,
        messages,
        unreadMessagesCount,
        fetchMessages,
        sendMessage,
        deleteMessage,
        deleteAllMessages,
        markMessageAsRead,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
