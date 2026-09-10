import React from 'react';
import { Eye, EyeOff, Tag, Type, AlignLeft } from 'lucide-react';
import { SectionHeaderItem } from '../../types';

interface SectionHeaderCardProps {
  sectionTitle: string;
  sectionKey: string;
  header: SectionHeaderItem;
  isVisible: boolean;
  onHeaderChange: (newHeader: SectionHeaderItem) => void;
  onVisibilityChange: (visible: boolean) => void;
  badgeLabel?: string;
  titleLabel?: string;
  descLabel?: string;
}

export const SectionHeaderCard: React.FC<SectionHeaderCardProps> = ({
  sectionTitle,
  header,
  isVisible,
  onHeaderChange,
  onVisibilityChange,
  badgeLabel = 'Pita Kategori / Label Badge',
  titleLabel = 'Judul Utama Bagian',
  descLabel = 'Subjudul / Deskripsi Pengantar',
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Judul & Visibilitas Bagian: {sectionTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur judul, label pita, deskripsi yang tampil di landing page, serta tampilkan/sembunyikan bagian ini.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
            isVisible 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {isVisible ? 'Tampil di Landing Page' : 'Disembunyikan'}
          </span>
          <button
            type="button"
            onClick={() => onVisibilityChange(!isVisible)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              isVisible ? 'bg-blue-600' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={isVisible}
            title={isVisible ? 'Klik untuk sembunyikan dari landing page' : 'Klik untuk tampilkan di landing page'}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                isVisible ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {isVisible ? (
                <Eye className="w-3 h-3 text-blue-600" />
              ) : (
                <EyeOff className="w-3 h-3 text-slate-400" />
              )}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Badge Label */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span>{badgeLabel}</span>
          </label>
          <input
            type="text"
            value={header?.badge || ''}
            onChange={(e) => onHeaderChange({ ...header, badge: e.target.value })}
            placeholder="Contoh: Kurikulum & Peminatan"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Section Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-blue-600" />
            <span>{titleLabel}</span>
          </label>
          <input
            type="text"
            value={header?.title || ''}
            onChange={(e) => onHeaderChange({ ...header, title: e.target.value })}
            placeholder="Contoh: Program Unggulan Sekolah"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Section Subtitle / Description */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>{descLabel}</span>
          </label>
          <textarea
            rows={2}
            value={header?.subtitle || ''}
            onChange={(e) => onHeaderChange({ ...header, subtitle: e.target.value })}
            placeholder="Contoh: Didesain khusus untuk menggali potensi setiap siswa..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>
    </div>
  );
};
