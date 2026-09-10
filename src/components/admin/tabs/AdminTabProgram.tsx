import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { ProgramSekolah } from '../../../types';
import { Save, Plus, Trash2, Check, BookOpen } from 'lucide-react';
import { DynamicIcon } from '../../../utils/iconHelper';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { defaultSectionHeaders } from '../../../data/initialData';

export const AdminTabProgram: React.FC = () => {
  const { data, updateData, updateSectionHeader, toggleSectionVisibility } = useSchool();
  const [programs, setPrograms] = useState<ProgramSekolah[]>(data.program);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData((prev) => ({
      ...prev,
      program: programs,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddProgram = () => {
    const newProg: ProgramSekolah = {
      id: 'p_' + Date.now(),
      title: 'Program Peminatan Baru',
      subtitle: 'Deskripsi singkat program',
      description: 'Penjelasan mendalam mengenai kurikulum dan manfaat program bagi siswa.',
      icon: 'BookOpen',
      features: ['Fasilitas ruang dan kurikulum khusus', 'Guru pembimbing bersertifikat'],
      badge: 'Program Baru',
    };
    setPrograms([...programs, newProg]);
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter((p) => p.id !== id));
  };

  const handleUpdateField = (id: string, field: keyof ProgramSekolah, value: any) => {
    setPrograms(programs.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleFeatureChange = (progId: string, featureIndex: number, text: string) => {
    setPrograms(
      programs.map((p) => {
        if (p.id === progId) {
          const updatedFeatures = [...p.features];
          updatedFeatures[featureIndex] = text;
          return { ...p, features: updatedFeatures };
        }
        return p;
      })
    );
  };

  const handleAddFeature = (progId: string) => {
    setPrograms(
      programs.map((p) => {
        if (p.id === progId) {
          return { ...p, features: [...p.features, 'Poin keunggulan baru'] };
        }
        return p;
      })
    );
  };

  const handleDeleteFeature = (progId: string, featureIndex: number) => {
    setPrograms(
      programs.map((p) => {
        if (p.id === progId) {
          return { ...p, features: p.features.filter((_, i) => i !== featureIndex) };
        }
        return p;
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Pengaturan Program Unggulan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola kelas peminatan, program khusus, kurikulum internasional, dan fasilitasnya.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddProgram}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program</span>
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
        sectionTitle="Program Unggulan"
        sectionKey="program"
        header={data.sectionHeaders?.program || defaultSectionHeaders.program}
        isVisible={data.sectionVisibility?.program !== false}
        onHeaderChange={(newHeader) => updateSectionHeader('program', newHeader)}
        onVisibilityChange={(visible) => toggleSectionVisibility('program', visible)}
      />

      <div className="space-y-6">
        {programs.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <DynamicIcon name={p.icon} className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <input
                    type="text"
                    required
                    value={p.title}
                    onChange={(e) => handleUpdateField(p.id, 'title', e.target.value)}
                    placeholder="Judul Program Unggulan"
                    className="text-base sm:text-lg font-bold text-slate-900 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteProgram(p.id)}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition cursor-pointer shrink-0"
                title="Hapus program ini"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Sub-Judul Singkat
                </label>
                <input
                  type="text"
                  value={p.subtitle}
                  onChange={(e) => handleUpdateField(p.id, 'subtitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Badge Label (e.g. Favorit Sains)
                </label>
                <input
                  type="text"
                  value={p.badge || ''}
                  onChange={(e) => handleUpdateField(p.id, 'badge', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Nama Ikon Lucide (e.g. Atom, Languages, Code2)
                </label>
                <input
                  type="text"
                  value={p.icon}
                  onChange={(e) => handleUpdateField(p.id, 'icon', e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Deskripsi Lengkap Program
              </label>
              <textarea
                rows={2}
                value={p.description}
                onChange={(e) => handleUpdateField(p.id, 'description', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs resize-none"
              />
            </div>

            {/* Features list */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase">
                  Poin Fasilitas & Keunggulan
                </span>
                <button
                  type="button"
                  onClick={() => handleAddFeature(p.id)}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
                >
                  + Tambah Poin
                </button>
              </div>

              <div className="space-y-1.5">
                {p.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleFeatureChange(p.id, fIdx, e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFeature(p.id, fIdx)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
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
          <span>Simpan Seluruh Program Unggulan</span>
        </button>
      </div>
    </form>
  );
};
