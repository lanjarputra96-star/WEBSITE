import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  Laptop, 
  BookOpen, 
  FileCheck, 
  Download, 
  Users, 
  ShieldCheck, 
  Globe, 
  HelpCircle, 
  GraduationCap, 
  Award, 
  ExternalLink, 
  Search,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const PusatInformasiSection: React.FC = () => {
  const { data } = useSchool();
  const { pusatInformasi = [], sectionHeaders } = data;
  const header = sectionHeaders?.pusatInformasi;
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories
  const categories = ['Semua', ...Array.from(new Set(pusatInformasi.map((item) => item.category)))];

  // Filter items
  const filteredItems = pusatInformasi.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buttonText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-blue-600" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-emerald-600" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6 text-violet-600" />;
      case 'Download':
        return <Download className="w-6 h-6 text-amber-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-cyan-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-teal-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-indigo-600" />;
      case 'Award':
        return <Award className="w-6 h-6 text-rose-600" />;
      default:
        return <Globe className="w-6 h-6 text-blue-600" />;
    }
  };

  const getCardTheme = (index: number) => {
    const themes = [
      'hover:border-blue-300 hover:shadow-blue-500/10',
      'hover:border-emerald-300 hover:shadow-emerald-500/10',
      'hover:border-violet-300 hover:shadow-violet-500/10',
      'hover:border-amber-300 hover:shadow-amber-500/10',
      'hover:border-cyan-300 hover:shadow-cyan-500/10',
      'hover:border-teal-300 hover:shadow-teal-500/10',
    ];
    return themes[index % themes.length];
  };

  return (
    <section id="pusat-informasi" className="py-20 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-800 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{header?.badge || 'Layanan & Akses Cepat'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {header?.title || 'Pusat Informasi & Portal Digital'}
          </h2>

          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            {header?.subtitle || 'Akses langsung seluruh sistem informasi akademik, perpustakaan daring, ruang ujian mandiri, arsip dokumen, serta saluran konsultasi resmi sekolah.'}
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pusat informasi..."
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Information Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${getCardTheme(idx)} group`}
              >
                <div>
                  {/* Top row: Icon & Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {getIconComponent(item.icon)}
                    </div>
                    {item.badge && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                    {item.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Card Action Button: Configurable by Admin to open external web */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href={item.buttonUrl || '#'}
                    target={item.openInNewTab !== false ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-colors cursor-pointer group/btn"
                    title={`Dialihkan ke: ${item.buttonUrl}`}
                  >
                    <span>{item.buttonText || 'Buka Halaman Web'}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>
                  <div className="text-[10px] text-slate-400 mt-2 text-center truncate px-1">
                    Tujuan: <span className="font-mono">{item.buttonUrl || 'Belum diatur'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 max-w-md mx-auto">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada informasi yang sesuai</p>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian lain atau pilih kategori Semua.</p>
          </div>
        )}
      </div>
    </section>
  );
};
