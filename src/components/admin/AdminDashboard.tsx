import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  LayoutDashboard, 
  Building2, 
  Sparkles, 
  Target, 
  BarChart3, 
  BookOpen, 
  Newspaper, 
  Trophy, 
  Building, 
  Users, 
  UserPlus, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X,
  CheckCircle,
  GraduationCap,
  Link2,
  Cloud,
  Inbox,
  Sliders
} from 'lucide-react';

import { AdminTabOverview } from './tabs/AdminTabOverview';
import { AdminTabVisibility } from './tabs/AdminTabVisibility';
import { AdminTabMessages } from './tabs/AdminTabMessages';
import { AdminTabSchoolInfo } from './tabs/AdminTabSchoolInfo';
import { AdminTabHero } from './tabs/AdminTabHero';
import { AdminTabVisiMisi } from './tabs/AdminTabVisiMisi';
import { AdminTabStatistik } from './tabs/AdminTabStatistik';
import { AdminTabProgram } from './tabs/AdminTabProgram';
import { AdminTabBerita } from './tabs/AdminTabBerita';
import { AdminTabPrestasi } from './tabs/AdminTabPrestasi';
import { AdminTabFasilitas } from './tabs/AdminTabFasilitas';
import { AdminTabGuru } from './tabs/AdminTabGuru';
import { AdminTabPpdb } from './tabs/AdminTabPpdb';
import { AdminTabPusatInformasi } from './tabs/AdminTabPusatInformasi';
import { AdminTabSettings } from './tabs/AdminTabSettings';

export const AdminDashboard: React.FC = () => {
  const { data, setCurrentView, logout, adminUser, toastMessage, cloudflareSync, isSyncingCloudflare, unreadMessagesCount, messages } = useSchool();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Ringkasan Dasbor', icon: LayoutDashboard },
    { id: 'tampilan', label: 'Judul & Tampilan Web', icon: Sliders },
    { id: 'pesan', label: 'Pesan Masuk', icon: Inbox, badge: unreadMessagesCount, total: messages.length },
    { id: 'identitas', label: 'Identitas & Kontak', icon: Building2 },
    { id: 'hero', label: 'Hero & Sambutan', icon: Sparkles },
    { id: 'visimisi', label: 'Visi & Misi', icon: Target },
    { id: 'statistik', label: 'Statistik Angka', icon: BarChart3 },
    { id: 'program', label: 'Program Unggulan', icon: BookOpen },
    { id: 'berita', label: 'Berita & Pengumuman', icon: Newspaper },
    { id: 'prestasi', label: 'Prestasi Siswa', icon: Trophy },
    { id: 'fasilitas', label: 'Sarana & Fasilitas', icon: Building },
    { id: 'guru', label: 'Dewan Guru & Staf', icon: Users },
    { id: 'ppdb', label: 'Informasi SPMB', icon: UserPlus },
    { id: 'pusat-informasi', label: 'Pusat Informasi & Link', icon: Link2 },
    { id: 'settings', label: 'Akun & Backup JSON', icon: Settings },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminTabOverview setActiveTab={setActiveTab} />;
      case 'tampilan':
        return <AdminTabVisibility />;
      case 'pesan':
        return <AdminTabMessages />;
      case 'identitas':
        return <AdminTabSchoolInfo />;
      case 'hero':
        return <AdminTabHero />;
      case 'visimisi':
        return <AdminTabVisiMisi />;
      case 'statistik':
        return <AdminTabStatistik />;
      case 'program':
        return <AdminTabProgram />;
      case 'berita':
        return <AdminTabBerita />;
      case 'prestasi':
        return <AdminTabPrestasi />;
      case 'fasilitas':
        return <AdminTabFasilitas />;
      case 'guru':
        return <AdminTabGuru />;
      case 'ppdb':
        return <AdminTabPpdb />;
      case 'pusat-informasi':
        return <AdminTabPusatInformasi />;
      case 'settings':
        return <AdminTabSettings />;
      default:
        return <AdminTabOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
                  Panel CMS Admin Sekolah
                </h1>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {data.schoolInfo.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cloudflare Status Indicator */}
            <button
              onClick={() => setActiveTab('settings')}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-[11px] text-amber-300 hover:bg-slate-700 transition cursor-pointer"
              title={`Cloudflare Namespace: ${cloudflareSync.kvNamespaceId} - Klik untuk kelola`}
            >
              <Cloud className={`w-3.5 h-3.5 text-amber-400 ${isSyncingCloudflare ? 'animate-pulse' : ''}`} />
              <span className="font-mono font-medium">Cloudflare Aktif</span>
            </button>

            {/* View Landing Page Button */}
            <button
              onClick={() => setCurrentView('landing')}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
              title="Buka tampilan landing page website"
            >
              <span>Lihat Landing Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-300 px-2 py-1 rounded-lg text-xs font-medium transition cursor-pointer"
              title="Keluar dari sesi admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 pt-16 lg:pt-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
            <div className="space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Modul Pengaturan Konten
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                        {item.badge}
                      </span>
                    )}
                    {item.badge === 0 && item.total !== undefined && item.total > 0 && (
                      <span className="ml-auto bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.total}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Admin Info Card */}
            <div className="pt-4 mt-4 border-t border-slate-100 bg-slate-50 p-3 rounded-xl">
              <div className="text-[11px] font-semibold text-slate-400">Pengguna Aktif:</div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{adminUser.username} (Super Admin)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Data tersimpan otomatis di browser lokal.
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/40 z-20 lg:hidden"
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
};
