import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Newspaper, Pin, Calendar, ArrowRight, User } from 'lucide-react';

export const BeritaSection: React.FC = () => {
  const { data, setSelectedNews } = useSchool();
  const { berita, sectionHeaders } = data;
  const header = sectionHeaders?.berita;
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Berita', 'Pengumuman', 'Prestasi', 'Kegiatan'];

  const filteredBerita = activeCategory === 'Semua'
    ? berita
    : berita.filter((b) => b.category === activeCategory);

  return (
    <section id="berita" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              <Newspaper className="w-3.5 h-3.5" />
              <span>{header?.badge || 'Kabar & Informasi Sekolah'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {header?.title || 'Berita & Pengumuman Terkini'}
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-xl">
              {header?.subtitle || 'Informasi kegiatan akademik, sosialisasi kurikulum, dan dinamika kehidupan civitas sekolah.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Berita Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBerita.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow-xs">
                      {item.category}
                    </span>
                    {item.isPinned && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <Pin className="w-2.5 h-2.5" />
                        <span>Sematkan</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="line-clamp-1">{item.author}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug line-clamp-2 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-50 mt-4">
                <span className="text-xs font-bold text-blue-700 group-hover:translate-x-1 transition flex items-center gap-1">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] text-slate-400">3 menit baca</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
