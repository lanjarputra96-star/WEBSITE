import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Quote, Award, Sparkles } from 'lucide-react';

export const HeadmasterGreeting: React.FC = () => {
  const { data } = useSchool();
  const { kepalaSekolah, schoolInfo, sectionHeaders } = data;
  const header = sectionHeaders?.sambutan;

  return (
    <section id="sambutan" className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Portrait Side */}
            <div className="lg:col-span-4 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-700/50 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5" />
                  <span>{header?.badge || 'Kepemimpinan Sekolah'}</span>
                </div>

                <div className="relative mx-auto max-w-[260px] aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border-2 border-slate-700 bg-slate-800">
                  <img
                    src={kepalaSekolah.photoUrl}
                    alt={kepalaSekolah.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>

                <div className="text-center pt-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {kepalaSekolah.name}
                  </h3>
                  <p className="text-sm text-blue-300 font-medium mt-0.5">
                    {kepalaSekolah.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {schoolInfo.name}
                  </p>
                </div>
              </div>

              {/* Quote pill */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 relative z-10">
                <div className="flex items-start gap-2 text-xs italic text-slate-300">
                  <Quote className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>"{kepalaSekolah.quote}"</span>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-8 p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>{header?.badge || 'Prakata Kepala Sekolah'}</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
                {header?.title || 'Membangun Generasi Emas yang Berilmu, Beradab, dan Siap Memimpin Peradaban'}
              </h2>

              {header?.subtitle && (
                <p className="text-sm text-slate-500 mb-6 italic">
                  {header.subtitle}
                </p>
              )}

              <div className="prose prose-slate max-w-none text-slate-600 text-base leading-relaxed space-y-4">
                {kepalaSekolah.greeting.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Akreditasi Resmi Sekolah
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {schoolInfo.akreditasi}
                  </div>
                </div>

                <a
                  href="#profil"
                  className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold text-sm hover:underline"
                >
                  <span>Baca Visi & Misi Selengkapnya</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
