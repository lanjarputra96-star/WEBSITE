import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { VisiMisi } from '../../../types';
import { 
  Save, 
  Target, 
  Check, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Info,
  Sparkles 
} from 'lucide-react';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { defaultSectionHeaders } from '../../../data/initialData';

export const AdminTabVisiMisi: React.FC = () => {
  const { data, updateData, updateSectionHeader, toggleSectionVisibility } = useSchool();
  const [form, setForm] = useState<VisiMisi>(data.visiMisi);
  const [newMisi, setNewMisi] = useState('');
  const [newTujuan, setNewTujuan] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isTujuanActive = form.showTujuan !== false;
  const isNilaiUtamaActive = form.showNilaiUtama !== false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData((prev) => ({
      ...prev,
      visiMisi: form,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddMisi = () => {
    if (!newMisi.trim()) return;
    setForm({ ...form, misi: [...form.misi, newMisi.trim()] });
    setNewMisi('');
  };

  const handleDeleteMisi = (index: number) => {
    setForm({ ...form, misi: form.misi.filter((_, i) => i !== index) });
  };

  const handleAddTujuan = () => {
    if (!newTujuan.trim()) return;
    setForm({ ...form, tujuan: [...form.tujuan, newTujuan.trim()] });
    setNewTujuan('');
  };

  const handleDeleteTujuan = (index: number) => {
    setForm({ ...form, tujuan: form.tujuan.filter((_, i) => i !== index) });
  };

  const handleNilaiChange = (index: number, field: string, val: string) => {
    const updated = [...form.nilaiUtama];
    updated[index] = { ...updated[index], [field]: val };
    setForm({ ...form, nilaiUtama: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Visi, Misi & Nilai Utama Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan arah strategis, sasaran mutu lulusan, dan pilar karakter siswa.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-xs transition cursor-pointer"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      {/* Dynamic Header & Visibility Controls */}
      <SectionHeaderCard
        sectionTitle="Visi, Misi & Tujuan"
        sectionKey="visiMisi"
        header={data.sectionHeaders?.visiMisi || defaultSectionHeaders.visiMisi}
        isVisible={data.sectionVisibility?.visiMisi !== false}
        onHeaderChange={(newHeader) => updateSectionHeader('visiMisi', newHeader)}
        onVisibilityChange={(visible) => toggleSectionVisibility('visiMisi', visible)}
      />

      {/* Visi */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
        <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider">
          Rumusan Visi Sekolah *
        </label>
        <textarea
          rows={3}
          required
          value={form.visi}
          onChange={(e) => setForm({ ...form, visi: e.target.value })}
          placeholder="Tuliskan rumusan visi jangka panjang sekolah..."
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none font-medium"
        />
      </div>

      {/* Misi List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Daftar Butir Misi Sekolah ({form.misi.length})
          </label>
        </div>

        <div className="space-y-2.5">
          {form.misi.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...form.misi];
                  updated[idx] = e.target.value;
                  setForm({ ...form, misi: updated });
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => handleDeleteMisi(idx)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer shrink-0"
                title="Hapus butir misi ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new Misi */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={newMisi}
            onChange={(e) => setNewMisi(e.target.value)}
            placeholder="Tambah butir misi baru..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMisi();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddMisi}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Target & Sasaran Mutu */}
      <div className={`bg-white border rounded-2xl p-6 space-y-4 transition ${
        isTujuanActive ? 'border-slate-200' : 'border-amber-300 bg-amber-50/10'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Sasaran & Target Mutu Lulusan ({form.tujuan.length})
              </label>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isTujuanActive 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-slate-200 text-slate-700 border border-slate-300'
              }`}>
                {isTujuanActive ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                {isTujuanActive ? 'Tampil di Landing Page' : 'Dinonaktifkan'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur apakah kartu sasaran & target mutu ditampilkan di samping misi pada landing page.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setForm({ ...form, showTujuan: !isTujuanActive })}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border shadow-2xs shrink-0 ${
              isTujuanActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {isTujuanActive ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Status: Ditampilkan</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Status: Dinonaktifkan</span>
              </>
            )}
          </button>
        </div>

        {!isTujuanActive && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Bagian ini sedang dinonaktifkan:</strong> Sasaran & target mutu disembunyikan dari landing page. Daftar misi sekolah akan otomatis tampil melebar penuh secara proporsional. Anda tetap dapat mengedit atau menambah data sasaran di bawah ini.
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          {form.tujuan.map((t, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 ml-2" />
              <input
                type="text"
                value={t}
                onChange={(e) => {
                  const updated = [...form.tujuan];
                  updated[idx] = e.target.value;
                  setForm({ ...form, tujuan: updated });
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => handleDeleteTujuan(idx)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={newTujuan}
            onChange={(e) => setNewTujuan(e.target.value)}
            placeholder="Tambah target / sasaran mutu..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTujuan();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddTujuan}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* 4 Nilai Utama */}
      <div className={`bg-white border rounded-2xl p-6 space-y-4 transition ${
        isNilaiUtamaActive ? 'border-slate-200' : 'border-amber-300 bg-amber-50/10'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                4 Pilar Nilai Karakter Utama
              </label>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isNilaiUtamaActive 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-slate-200 text-slate-700 border border-slate-300'
              }`}>
                {isNilaiUtamaActive ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                {isNilaiUtamaActive ? 'Tampil di Landing Page' : 'Dinonaktifkan'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur apakah kartu 4 pilar karakter unggul ditampilkan pada bagian bawah visi-misi di landing page.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setForm({ ...form, showNilaiUtama: !isNilaiUtamaActive })}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border shadow-2xs shrink-0 ${
              isNilaiUtamaActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {isNilaiUtamaActive ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Status: Ditampilkan</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Status: Dinonaktifkan</span>
              </>
            )}
          </button>
        </div>

        {!isNilaiUtamaActive && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Bagian ini sedang dinonaktifkan:</strong> Seluruh kartu 4 pilar karakter disembunyikan dari landing page. Anda tetap dapat mengedit judul, ikon, dan deskripsi pilar di bawah ini.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.nilaiUtama.map((n, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={n.title}
                  onChange={(e) => handleNilaiChange(idx, 'title', e.target.value)}
                  placeholder="Judul Nilai"
                  className="w-2/3 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                />
                <input
                  type="text"
                  value={n.icon}
                  onChange={(e) => handleNilaiChange(idx, 'icon', e.target.value)}
                  placeholder="Nama Ikon (e.g. ShieldCheck)"
                  className="w-1/3 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
              <textarea
                rows={2}
                value={n.desc}
                onChange={(e) => handleNilaiChange(idx, 'desc', e.target.value)}
                placeholder="Penjelasan pilar nilai karakter..."
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Visi & Misi</span>
        </button>
      </div>
    </form>
  );
};
