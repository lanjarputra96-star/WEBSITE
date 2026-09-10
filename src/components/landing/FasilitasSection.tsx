import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Building2, Layers } from 'lucide-react';

export const FasilitasSection: React.FC = () => {
  const { data } = useSchool();
  const { fasilitas, sectionHeaders } = data;
  const header = sectionHeaders?.fasilitas;
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Akademik', 'Laboratorium', 'Olahraga', 'Ibadah & Seni', 'Fasilitas Umum'];

  const filteredFasilitas = activeCategory === 'Semua'
    ? fasilitas
    : fasilitas.filter((f) => f.category === activeCategory);

  return (
    <section id="fasilitas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>{header?.badge || 'Sarana & Prasarana'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {header?.title || 'Fasilitas Kampus Modern'}
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-xl">
              {header?.subtitle || 'Didukung infrastruktur teknologi terkini untuk menunjang kenyamanan eksplorasi akademik dan bakat non-akademik.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Fasilitas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFasilitas.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                  {item.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
