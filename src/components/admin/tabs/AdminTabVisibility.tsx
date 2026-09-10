import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { 
  Sliders, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Info,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SectionHeaders, SectionVisibility, SectionHeaderItem } from '../../../types';
import { defaultSectionHeaders, defaultSectionVisibility } from '../../../data/initialData';

interface SectionConfigMeta {
  key: keyof SectionHeaders;
  visibilityKey: keyof SectionVisibility;
  label: string;
  category: string;
  description: string;
  hasBadge?: boolean;
}

export const AdminTabVisibility: React.FC = () => {
  const { data, updateSectionHeader, toggleSectionVisibility, setCurrentView, showToast, updateData } = useSchool();
  const headers = data.sectionHeaders || defaultSectionHeaders;
  const visibility = data.sectionVisibility || defaultSectionVisibility;

  const [activeFilter, setActiveFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  const sections: SectionConfigMeta[] = [
    {
      key: 'statistik',
      visibilityKey: 'statistik',
      label: 'Statistik & Angka Sekolah',
      category: 'Beranda Atas',
      description: 'Pita ringkasan data kuantitatif seperti jumlah siswa, guru, akreditasi, dan laboratorium.',
    },
    {
      key: 'sambutan',
      visibilityKey: 'sambutan',
      label: 'Prakata Kepala Sekolah',
      category: 'Profil & Filosofi',
      description: 'Foto resmi kepala sekolah, kutipan inspiratif, dan pesan pengantar kepemimpinan.',
    },
    {
      key: 'visiMisi',
      visibilityKey: 'visiMisi',
      label: 'Visi, Misi & Tujuan',
      category: 'Profil & Filosofi',
      description: 'Fondasi visi masa depan, butir-butir misi strategis, dan nilai-nilai luhur budaya sekolah.',
    },
    {
      key: 'program',
      visibilityKey: 'program',
      label: 'Program Unggulan',
      category: 'Akademik',
      description: 'Daftar konsentrasi jurusan atau kurikulum peminatan khusus yang ditawarkan kepada siswa.',
    },
    {
      key: 'prestasi',
      visibilityKey: 'prestasi',
      label: 'Rekam Jejak Prestasi',
      category: 'Prestasi & Reputasi',
      description: 'Koleksi penghargaan lomba akademik, sains, olahraga, seni budaya siswa di kancah nasional/internasional.',
    },
    {
      key: 'berita',
      visibilityKey: 'berita',
      label: 'Berita & Pengumuman',
      category: 'Informasi Publik',
      description: 'Artikel kabar kegiatan sekolah terkini, edaran penting, dan agenda akademik sekolah.',
    },
    {
      key: 'fasilitas',
      visibilityKey: 'fasilitas',
      label: 'Sarana & Fasilitas',
      category: 'Infrastruktur',
      description: 'Galeri dan deskripsi gedung, laboratorium, lapangan olahraga, perpustakaan, dan masjid.',
    },
    {
      key: 'guru',
      visibilityKey: 'guru',
      label: 'Dewan Guru & Pendidik',
      category: 'SDM & Pengajar',
      description: 'Daftar profil bapak/ibu guru pengampu bidang studi beserta kualifikasi pendidikannya.',
    },
    {
      key: 'ppdb',
      visibilityKey: 'ppdb',
      label: 'Informasi SPMB / PPDB',
      category: 'Pendaftaran Siswa Baru',
      description: 'Jalur pendaftaran, tanggal pembukaan, syarat dokumen, dan tombol akses formulir pendaftaran.',
    },
    {
      key: 'pusatInformasi',
      visibilityKey: 'pusatInformasi',
      label: 'Pusat Informasi & Portal Digital',
      category: 'Layanan Digital',
      description: 'Kumpulan tautan sistem informasi, perpustakaan digital, CBT ujian, dan hotline layanan resmi.',
    },
    {
      key: 'kontak',
      visibilityKey: 'kontak',
      label: 'Kontak & Lokasi Sekolah',
      category: 'Layanan Publik',
      description: 'Alamat lengkap, peta Google Maps interaktif, jam operasional, dan formulir kirim pesan.',
    },
  ];

  const totalSectionsCount = sections.length + 1; // 11 sections with custom headers + 1 hero banner
  const visibleCount = Object.values(visibility).filter((v) => v !== false).length;
  const hiddenCount = Math.max(0, totalSectionsCount - visibleCount);

  const isHeroVisible = visibility.hero !== false;
  const showHeroCard = 
    activeFilter === 'all' || 
    (activeFilter === 'visible' && isHeroVisible) || 
    (activeFilter === 'hidden' && !isHeroVisible);

  const filteredSections = sections.filter((sec) => {
    const isVis = visibility[sec.visibilityKey] !== false;
    if (activeFilter === 'visible') return isVis;
    if (activeFilter === 'hidden') return !isVis;
    return true;
  });

  const handleToggleAll = (showAll: boolean) => {
    const newVisibility: SectionVisibility = {
      hero: showAll,
      statistik: showAll,
      sambutan: showAll,
      visiMisi: showAll,
      program: showAll,
      prestasi: showAll,
      berita: showAll,
      fasilitas: showAll,
      guru: showAll,
      ppdb: showAll,
      pusatInformasi: showAll,
      kontak: showAll,
    };
    updateData((prev) => ({
      ...prev,
      sectionVisibility: newVisibility,
    }));
    showToast(showAll ? 'Semua bagian diatur TAMPIL di landing page' : 'Semua bagian diatur SEMBUNYI');
  };

  const handleResetSectionHeader = (key: keyof SectionHeaders) => {
    const def = defaultSectionHeaders[key];
    if (def) {
      updateSectionHeader(key, def);
      showToast(`Judul bagian "${key}" dikembalikan ke default awal`);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
              <Sliders className="w-3.5 h-3.5" />
              <span>Manajemen Konten & Tata Letak</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pengaturan Tampilan & Judul Landing Page
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Kendalikan seluruh judul bagian informasi dan tentukan bagian mana saja yang ingin ditampilkan atau disembunyikan di halaman depan website sekolah Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-blue-300" />
              <span>Lihat Halaman Depan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Summary & Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Bagian Halaman</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalSectionsCount}</div>
            <span className="text-[11px] text-slate-400">Komponen landing page</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Sedang Ditampilkan</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{visibleCount}</div>
            <span className="text-[11px] text-slate-400">Aktif di landing page</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Sedang Disembunyikan</span>
            <div className="text-2xl font-extrabold text-slate-600 mt-1">{hiddenCount}</div>
            <span className="text-[11px] text-slate-400">Tidak tampil di web</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <EyeOff className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Bulk Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Bagian ({sections.length})
          </button>
          <button
            onClick={() => setActiveFilter('visible')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeFilter === 'visible'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tampil ({visibleCount})
          </button>
          <button
            onClick={() => setActiveFilter('hidden')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeFilter === 'hidden'
                ? 'bg-white text-slate-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Disembunyikan ({hiddenCount})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => handleToggleAll(true)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Tampilkan Semua
          </button>
          <button
            onClick={() => handleToggleAll(false)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Sembunyikan Semua
          </button>
        </div>
      </div>

      {/* Notification Note */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Perubahan Langsung Tersimpan:</strong> Setiap teks judul atau status tampil/sembunyi yang Anda ubah di sini akan langsung disimpan di database server & Cloudflare. Saat Anda mematikan suatu bagian, menu navigasi terkait di bar atas juga akan otomatis disesuaikan.
        </p>
      </div>

      {/* Section List */}
      <div className="space-y-6">
        {/* Special Hero Banner Card */}
        {showHeroCard && (
          <div className="relative">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Beranda Atas • Hero Banner Utama
              </span>
            </div>
            <div className={`p-5 rounded-2xl border transition-all duration-200 ${
              isHeroVisible
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-slate-50/80 border-dashed border-slate-300 opacity-80'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Hero Banner Utama
                    </h4>
                    {isHeroVisible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                        <Eye className="w-3 h-3" />
                        Tampil di Landing Page
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-600">
                        <EyeOff className="w-3 h-3" />
                        Disembunyikan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bagian paling atas halaman landing page dengan judul besar, foto latar, badge informasi, dan tombol aksi pendaftaran SPMB.
                  </p>
                  <p className="text-[11px] text-blue-700 font-medium pt-1">
                    Judul saat ini: "{data.hero?.headline || 'Membentuk Generasi Unggul'}"
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility('hero', !isHeroVisible)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isHeroVisible
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                    }`}
                  >
                    {isHeroVisible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Sembunyikan</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tampilkan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredSections.map((sec) => {
          const itemHeader = headers[sec.key] || defaultSectionHeaders[sec.key] || { badge: '', title: '', subtitle: '' };
          const isVis = visibility[sec.visibilityKey] !== false;

          return (
            <div key={sec.key} className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  {sec.category} • {sec.label}
                </span>
                <button
                  type="button"
                  onClick={() => handleResetSectionHeader(sec.key)}
                  className="text-[11px] text-slate-500 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  title="Kembalikan judul default"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default Judul</span>
                </button>
              </div>

              <SectionHeaderCard
                sectionTitle={sec.label}
                sectionKey={sec.key}
                header={itemHeader}
                isVisible={isVis}
                onHeaderChange={(newHeader) => updateSectionHeader(sec.key, newHeader)}
                onVisibilityChange={(visible) => toggleSectionVisibility(sec.visibilityKey, visible)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
