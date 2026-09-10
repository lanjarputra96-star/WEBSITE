import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  UserPlus, 
  CheckCircle2, 
  Download, 
  MessageCircle, 
  Calendar, 
  Clock, 
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const PpdbSection: React.FC = () => {
  const { data, showToast } = useSchool();
  const { ppdb, schoolInfo, sectionHeaders } = data;
  const header = sectionHeaders?.ppdb;
  const [activeTab, setActiveTab] = useState<'alur' | 'syarat'>('alur');

  const handleDownloadBrochure = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Brosur SPMB sedang disiapkan atau buka tautan unduhan.');
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Membuka portal formulir pendaftaran siswa baru!');
  };

  return (
    <section id="spmb" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Anchor for backward compatibility */}
      <span id="ppdb" className="absolute -top-24 pointer-events-none" />
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header and status banner */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-950 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 shadow-inner">
            <UserPlus className="w-3.5 h-3.5 text-blue-400" />
            <span>{header?.badge || 'Seleksi Penerimaan Murid Baru'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {header?.title || `SPMB Tahun Ajaran ${ppdb.academicYear}`}
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-300">
            {header?.subtitle || ppdb.description}
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 bg-slate-800/90 border border-slate-700 px-5 py-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${ppdb.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-sm font-bold text-white">
                Status: {ppdb.isOpen ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
              </span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Periode: {ppdb.registrationPeriod}</span>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-10 backdrop-blur-xs">
          {/* Tab Switcher */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-700 flex gap-2">
              <button
                onClick={() => setActiveTab('alur')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                  activeTab === 'alur'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Alur & Tahapan Pendaftaran
              </button>
              <button
                onClick={() => setActiveTab('syarat')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                  activeTab === 'syarat'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Persyaratan Berkas
              </button>
            </div>
          </div>

          {/* Tab 1: Alur */}
          {activeTab === 'alur' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ppdb.steps.map((st) => (
                <div
                  key={st.step}
                  className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-extrabold text-base mb-4">
                      {st.step}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-blue-400 font-semibold">
                    Langkah {st.step} dari {ppdb.steps.length}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Syarat */}
          {activeTab === 'syarat' && (
            <div className="max-w-3xl mx-auto space-y-3">
              {ppdb.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 flex items-start gap-3.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200 leading-relaxed">
                    {req}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-12 pt-8 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/50 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Pusat Bantuan & Konsultasi SPMB:</div>
                <div className="text-sm sm:text-base font-bold text-white">
                  {ppdb.contactPerson}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadBrochure}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-3 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Brosur SPMB</span>
              </button>
              
              {ppdb.isOpen ? (
                <a
                  href={ppdb.registrationUrl || '#'}
                  target={ppdb.registrationOpenNewTab !== false ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition cursor-pointer bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 group"
                  title={`Buka web pendaftaran: ${ppdb.registrationUrl}`}
                >
                  <span>{ppdb.registrationButtonText || 'Daftar SPMB Sekarang'}</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <button
                  disabled
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-slate-700 text-slate-400 cursor-not-allowed"
                >
                  <span>Pendaftaran Sedang Ditutup</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
