import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { StatistikItem } from '../../../types';
import { Save, Plus, Trash2, Check, BarChart3 } from 'lucide-react';
import { DynamicIcon } from '../../../utils/iconHelper';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { defaultSectionHeaders } from '../../../data/initialData';

export const AdminTabStatistik: React.FC = () => {
  const { data, updateData, updateSectionHeader, toggleSectionVisibility } = useSchool();
  const [items, setItems] = useState<StatistikItem[]>(data.statistik);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData((prev) => ({
      ...prev,
      statistik: items,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddItem = () => {
    const newItem: StatistikItem = {
      id: Date.now().toString(),
      label: 'Indikator Baru',
      value: '100+',
      subtext: 'Keterangan tambahan',
      icon: 'Award',
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleChange = (id: string, field: keyof StatistikItem, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Pengaturan Statistik & Angka Kunci
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola metrik angka capaian sekolah yang ditampilkan pada pita beranda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Metrik</span>
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-xs transition cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Header & Visibility Controls */}
      <SectionHeaderCard
        sectionTitle="Statistik & Indikator Angka"
        sectionKey="statistik"
        header={data.sectionHeaders?.statistik || defaultSectionHeaders.statistik}
        isVisible={data.sectionVisibility?.statistik !== false}
        onHeaderChange={(newHeader) => updateSectionHeader('statistik', newHeader)}
        onVisibilityChange={(visible) => toggleSectionVisibility('statistik', visible)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 relative shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <DynamicIcon name={item.icon} className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                title="Hapus metrik ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Angka / Nilai Utama *
              </label>
              <input
                type="text"
                required
                value={item.value}
                onChange={(e) => handleChange(item.id, 'value', e.target.value)}
                placeholder="Misal: 1.050+"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-base font-extrabold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Label Indikator *
              </label>
              <input
                type="text"
                required
                value={item.label}
                onChange={(e) => handleChange(item.id, 'label', e.target.value)}
                placeholder="Misal: Siswa Aktif"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Keterangan Tambahan (Subtext)
              </label>
              <input
                type="text"
                value={item.subtext}
                onChange={(e) => handleChange(item.id, 'subtext', e.target.value)}
                placeholder="Rincian singkat"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Nama Ikon Lucide
              </label>
              <input
                type="text"
                value={item.icon}
                onChange={(e) => handleChange(item.id, 'icon', e.target.value)}
                placeholder="Users, Trophy, Cpu, dll"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Angka Statistik</span>
        </button>
      </div>
    </form>
  );
};
