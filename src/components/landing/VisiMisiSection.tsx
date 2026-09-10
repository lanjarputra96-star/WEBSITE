import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { DynamicIcon } from '../../utils/iconHelper';
import { Target, Compass, CheckCircle, Flag } from 'lucide-react';

export const VisiMisiSection: React.FC = () => {
  const { data } = useSchool();
  const { visiMisi, schoolInfo, sectionHeaders } = data;
  const header = sectionHeaders?.visiMisi;

  const showTujuan = visiMisi.showTujuan !== false;
  const showNilaiUtama = visiMisi.showNilaiUtama !== false;

  return (
    <section id="profil" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>{header?.badge || 'Landasan Filosofi & Tujuan'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {header?.title || (showNilaiUtama 
              ? `Visi, Misi & Nilai Luhur ${schoolInfo.name}` 
              : `Visi & Misi ${schoolInfo.name}`)}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {header?.subtitle || 'Arah strategis pembelajaran untuk mengoptimalkan potensi intelektual, emosional, dan spiritual setiap peserta didik.'}
          </p>
        </div>

        {/* Visi Block */}
        <div className="mb-12 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-800/60 px-3 py-1 rounded-full border border-blue-600/40">
              <Flag className="w-3.5 h-3.5" />
              Visi Utama Sekolah
            </span>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed text-white font-serif italic">
              "{visiMisi.visi}"
            </p>
          </div>
        </div>

        {/* Misi & Tujuan Grid */}
        <div className={`grid grid-cols-1 ${showTujuan ? 'lg:grid-cols-12' : 'max-w-4xl mx-auto'} gap-8 ${showNilaiUtama ? 'mb-16' : 'mb-0'}`}>
          {/* Misi List */}
          <div className={`${showTujuan ? 'lg:col-span-7' : 'w-full'} bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Misi Institusi</h3>
                <p className="text-xs text-slate-500">Langkah operasional pencapaian visi</p>
              </div>
            </div>

            <ul className="space-y-4">
              {visiMisi.misi.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sasaran & Target Mutu */}
          {showTujuan && (
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Sasaran & Target Mutu</h3>
                    <p className="text-xs text-slate-500">Indikator keberhasilan lulusan</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {visiMisi.tujuan.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0" />
                      <span className="text-sm text-slate-700 leading-normal font-medium">
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
                * Dievaluasi secara berkelanjutan mengikuti standar mutu Badan Akreditasi Nasional.
              </div>
            </div>
          )}
        </div>

        {/* 4 Nilai Karakter */}
        {showNilaiUtama && (
          <div>
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">4 Pilar Nilai Karakter Unggul</h3>
              <p className="text-sm text-slate-500 mt-1">Ditanamkan dalam setiap interaksi dan pembelajaran siswa</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visiMisi.nilaiUtama.map((nilai, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition group hover:border-blue-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                    <DynamicIcon name={nilai.icon} className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {nilai.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {nilai.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
