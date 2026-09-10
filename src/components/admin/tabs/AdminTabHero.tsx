import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { HeroSection, KepalaSekolah } from '../../../types';
import { Save, Sparkles, UserCheck, Image, Plus, Trash2, Check } from 'lucide-react';
import { ImageUploadInput } from '../../common/ImageUploadInput';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { defaultSectionHeaders } from '../../../data/initialData';

export const AdminTabHero: React.FC = () => {
  const { data, updateData, updateSectionHeader, toggleSectionVisibility } = useSchool();
  const [heroForm, setHeroForm] = useState<HeroSection>(data.hero);
  const [kepsekForm, setKepsekForm] = useState<KepalaSekolah>(data.kepalaSekolah);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData((prev) => ({
      ...prev,
      hero: heroForm,
      kepalaSekolah: kepsekForm,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleStatBadgeChange = (idx: number, field: string, val: string) => {
    const updated = [...heroForm.statsBadges];
    updated[idx] = { ...updated[idx], [field]: val };
    setHeroForm({ ...heroForm, statsBadges: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Pengaturan Hero Banner & Sambutan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola judul utama, teks promosi, tombol aksi, serta foto dan prakata Kepala Sekolah.
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

      {/* Hero Banner Visibility Control */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
            <span>Visibilitas Hero Banner Utama</span>
            {data.sectionVisibility?.hero !== false ? (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Tampil di Beranda</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">Disembunyikan</span>
            )}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Tentukan apakah banner hero utama di bagian paling atas ditampilkan atau disembunyikan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleSectionVisibility('hero', data.sectionVisibility?.hero === false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            data.sectionVisibility?.hero !== false
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {data.sectionVisibility?.hero !== false ? 'Sembunyikan Hero' : 'Tampilkan Hero'}
        </button>
      </div>

      {/* Hero Section Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Hero Banner Utama (Header)</span>
        </h3>

        {/* Badge Banner SPMB */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pita Pengumuman SPMB (Notification Pill)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={heroForm.badgeActive}
                onChange={(e) => setHeroForm({ ...heroForm, badgeActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>Tampilkan Pita</span>
            </label>
          </div>
          <input
            type="text"
            value={heroForm.badgeText}
            onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
            placeholder="Teks pengumuman di atas judul hero"
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Headline & Subheadline */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Judul Utama Hero (Headline) *
          </label>
          <textarea
            rows={2}
            required
            value={heroForm.headline}
            onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Sub-judul / Deskripsi Pendukung *
          </label>
          <textarea
            rows={3}
            required
            value={heroForm.subheadline}
            onChange={(e) => setHeroForm({ ...heroForm, subheadline: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teks Tombol Utama
            </label>
            <input
              type="text"
              value={heroForm.primaryBtnText}
              onChange={(e) => setHeroForm({ ...heroForm, primaryBtnText: e.target.value })}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm"
            />
            <label className="block text-[11px] font-semibold text-slate-500 mt-2 mb-1">
              Tautan Tombol Utama (contoh: #spmb)
            </label>
            <input
              type="text"
              value={heroForm.primaryBtnLink}
              onChange={(e) => setHeroForm({ ...heroForm, primaryBtnLink: e.target.value })}
              className="w-full px-3.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teks Tombol Sekunder
            </label>
            <input
              type="text"
              value={heroForm.secondaryBtnText}
              onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnText: e.target.value })}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm"
            />
            <label className="block text-[11px] font-semibold text-slate-500 mt-2 mb-1">
              Tautan Tombol Sekunder (contoh: #profil)
            </label>
            <input
              type="text"
              value={heroForm.secondaryBtnLink}
              onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnLink: e.target.value })}
              className="w-full px-3.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Background Image */}
        <div>
          <ImageUploadInput
            label="Foto Kampus / Siswa Hero Banner (Latar Belakang)"
            value={heroForm.bgImageUrl}
            onChange={(url) => setHeroForm({ ...heroForm, bgImageUrl: url })}
            placeholder="https://images.unsplash.com/..."
            helperText="Unggah foto panorama sekolah atau kegiatan siswa dari komputer."
            aspectRatio="wide"
          />
        </div>

        {/* Floating Stat Badges */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            3 Badge Metrik Melayang di Hero
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {heroForm.statsBadges.map((b, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <input
                  type="text"
                  value={b.label}
                  onChange={(e) => handleStatBadgeChange(idx, 'label', e.target.value)}
                  placeholder="Label"
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
                <input
                  type="text"
                  value={b.value}
                  onChange={(e) => handleStatBadgeChange(idx, 'value', e.target.value)}
                  placeholder="Nilai (e.g. 94.8%)"
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sambutan Section Dynamic Header & Visibility Controls */}
      <SectionHeaderCard
        sectionTitle="Prakata Kepala Sekolah"
        sectionKey="sambutan"
        header={data.sectionHeaders?.sambutan || defaultSectionHeaders.sambutan}
        isVisible={data.sectionVisibility?.sambutan !== false}
        onHeaderChange={(newHeader) => updateSectionHeader('sambutan', newHeader)}
        onVisibilityChange={(visible) => toggleSectionVisibility('sambutan', visible)}
      />

      {/* Headmaster Greeting Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>Sambutan & Profil Kepala Sekolah</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Kepala Sekolah Beserta Gelar *
            </label>
            <input
              type="text"
              required
              value={kepsekForm.name}
              onChange={(e) => setKepsekForm({ ...kepsekForm, name: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Jabatan / Titel *
            </label>
            <input
              type="text"
              required
              value={kepsekForm.title}
              onChange={(e) => setKepsekForm({ ...kepsekForm, title: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <ImageUploadInput
            label="Foto Resmi Kepala Sekolah"
            value={kepsekForm.photoUrl}
            onChange={(url) => setKepsekForm({ ...kepsekForm, photoUrl: url })}
            placeholder="https://images.unsplash.com/..."
            helperText="Unggah foto formal kepala sekolah dengan latar belakang rapi."
            aspectRatio="portrait"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Kutipan Inspiratif (Quote Mutiara)
          </label>
          <input
            type="text"
            value={kepsekForm.quote}
            onChange={(e) => setKepsekForm({ ...kepsekForm, quote: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white italic"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Teks Sambutan Lengkap Kepala Sekolah *
          </label>
          <textarea
            rows={5}
            required
            value={kepsekForm.greeting}
            onChange={(e) => setKepsekForm({ ...kepsekForm, greeting: e.target.value })}
            placeholder="Tuliskan kata sambutan bagi calon siswa dan wali murid..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Hero & Sambutan</span>
        </button>
      </div>
    </form>
  );
};
