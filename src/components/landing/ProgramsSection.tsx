import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { DynamicIcon } from '../../utils/iconHelper';
import { BookOpen, Check, ArrowUpRight } from 'lucide-react';

export const ProgramsSection: React.FC = () => {
  const { data } = useSchool();
  const { program, sectionHeaders } = data;
  const header = sectionHeaders?.program;

  return (
    <section id="program" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{header?.badge || 'Kurikulum & Peminatan'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {header?.title || 'Program Unggulan Sekolah'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {header?.subtitle || 'Didesain khusus untuk menggali potensi setiap siswa melalui jalur peminatan yang terarah dan aplikatif.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {program.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                    <DynamicIcon name={p.icon} className="w-7 h-7" />
                  </div>
                  {p.badge && (
                    <span className="bg-blue-100/70 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                      {p.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition">
                  {p.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 mb-3">
                  {p.subtitle}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {p.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Keunggulan & Fasilitas Program:
                  </span>
                  {p.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href="#spmb"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800"
                >
                  <span>Informasi Seleksi Jalur Ini</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
