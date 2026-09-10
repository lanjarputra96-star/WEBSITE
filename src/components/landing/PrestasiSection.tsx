import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Trophy, Medal, Award, Calendar, User } from 'lucide-react';

export const PrestasiSection: React.FC = () => {
  const { data } = useSchool();
  const { prestasi, sectionHeaders } = data;
  const header = sectionHeaders?.prestasi;
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Akademik', 'Olahraga', 'Seni & Budaya', 'Non-Akademik'];

  const filteredPrestasi = selectedCategory === 'Semua'
    ? prestasi
    : prestasi.filter((p) => p.category === selectedCategory);

  return (
    <section id="prestasi" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>{header?.badge || 'Rekam Jejak Prestasi'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {header?.title || 'Prestasi Membanggakan Siswa'}
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-xl">
              {header?.subtitle || 'Dedikasi pembinaan talenta membuahkan ratusan gelar juara dari kancah regional hingga panggung internasional.'}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prestasi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPrestasi.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Medal className="w-3 h-3" />
                    <span>{item.level}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {item.year}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug mb-2 group-hover:text-blue-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium line-clamp-1">{item.recipient}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
