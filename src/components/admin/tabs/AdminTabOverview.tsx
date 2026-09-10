import React from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  Building2, 
  Newspaper, 
  Trophy, 
  Users, 
  UserPlus, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Inbox
} from 'lucide-react';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const AdminTabOverview: React.FC<Props> = ({ setActiveTab }) => {
  const { data, setCurrentView, adminUser, messages, unreadMessagesCount } = useSchool();
  const { schoolInfo, berita, prestasi, guru, fasilitas, ppdb, program } = data;

  const quickStats = [
    { 
      label: 'Pesan Masuk Pengunjung', 
      count: messages.length, 
      sublabel: unreadMessagesCount > 0 ? `${unreadMessagesCount} Belum Dibaca` : 'Semua Terbaca',
      icon: Inbox, 
      tab: 'pesan', 
      color: unreadMessagesCount > 0 ? 'text-rose-600 bg-rose-50 ring-1 ring-rose-200' : 'text-slate-600 bg-slate-50' 
    },
    { label: 'Total Berita & Pengumuman', count: berita.length, sublabel: 'Artikel aktif', icon: Newspaper, tab: 'berita', color: 'text-blue-600 bg-blue-50' },
    { label: 'Prestasi Tercatat', count: prestasi.length, sublabel: 'Penghargaan', icon: Trophy, tab: 'prestasi', color: 'text-amber-600 bg-amber-50' },
    { label: 'Dewan Guru & Staf', count: guru.length, sublabel: 'Pendidik aktif', icon: Users, tab: 'guru', color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Pusat Kendali Administrator Web</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Halo, {adminUser.username}!
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Kelola seluruh konten, berita, profil, sambutan, program, dan pendaftaran SPMB untuk <b>{schoolInfo.name}</b> secara langsung dan realtime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('landing')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-md"
            >
              <span>Lihat Hasil di Landing Page</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => setActiveTab(stat.tab)}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition cursor-pointer group flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className="text-3xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-2">
                  <span>{stat.count}</span>
                  {stat.sublabel && (
                    <span className="text-xs font-bold text-slate-400">
                      {stat.sublabel}
                    </span>
                  )}
                </div>
                <div className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1 group-hover:translate-x-1 transition">
                  <span>Kelola item</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Status Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SPMB Status summary */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Status SPMB {ppdb.academicYear}</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              ppdb.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {ppdb.isOpen ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Periode:</span>
              <span className="font-semibold text-slate-800">{ppdb.registrationPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kontak Panitia:</span>
              <span className="font-semibold text-slate-800">{ppdb.contactPerson}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tahapan Alur:</span>
              <span className="font-semibold text-slate-800">{ppdb.steps.length} Langkah Terjadwal</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ppdb')}
            className="w-full mt-2 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer"
          >
            Ubah Pengaturan SPMB
          </button>
        </div>

        {/* Right: Quick School Info Check */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Identitas Sekolah Saat Ini</span>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-bold">
              {schoolInfo.akreditasi}
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div>
              <div className="font-bold text-slate-800 text-base">{schoolInfo.name}</div>
              <div className="text-xs text-slate-500">{schoolInfo.tagline}</div>
            </div>
            <div className="pt-2 text-xs space-y-1 text-slate-500">
              <div>NPSN: <span className="text-slate-800 font-semibold">{schoolInfo.npsn}</span></div>
              <div>Email: <span className="text-slate-800 font-semibold">{schoolInfo.email}</span></div>
              <div>Telp: <span className="text-slate-800 font-semibold">{schoolInfo.phone}</span></div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('identitas')}
            className="w-full mt-2 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer"
          >
            Ubah Identitas & Kontak
          </button>
        </div>
      </div>

      {/* Quick Nav Shortcuts */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Pintasan Cepat Pengaturan Konten
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Pesan Masuk', tab: 'pesan' },
            { label: 'Judul & Tampilan', tab: 'visibility' },
            { label: 'Hero & Banner', tab: 'hero' },
            { label: 'Pusat Info & Link', tab: 'pusat-informasi' },
            { label: 'Pendaftaran SPMB', tab: 'ppdb' },
            { label: 'Program Sekolah', tab: 'program' },
            { label: 'Prestasi Siswa', tab: 'prestasi' },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 text-xs font-bold text-center transition cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
