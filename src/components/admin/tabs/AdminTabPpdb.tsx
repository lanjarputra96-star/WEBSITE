import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { PpdbInfo, PpdbStep } from '../../../types';
import { Save, UserPlus, Plus, Trash2, Check, Calendar, HelpCircle, ExternalLink, Globe, Link2 } from 'lucide-react';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { defaultSectionHeaders } from '../../../data/initialData';

export const AdminTabPpdb: React.FC = () => {
  const { data, updateData, updateSectionHeader, toggleSectionVisibility } = useSchool();
  const [form, setForm] = useState<PpdbInfo>(data.ppdb);
  const [newRequirement, setNewRequirement] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData((prev) => ({
      ...prev,
      ppdb: form,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    setForm({ ...form, requirements: [...form.requirements, newRequirement.trim()] });
    setNewRequirement('');
  };

  const handleDeleteRequirement = (index: number) => {
    setForm({ ...form, requirements: form.requirements.filter((_, i) => i !== index) });
  };

  const handleStepChange = (index: number, field: keyof PpdbStep, value: any) => {
    const updated = [...form.steps];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, steps: updated });
  };

  const handleAddStep = () => {
    const nextStepNum = form.steps.length + 1;
    const newStep: PpdbStep = {
      step: nextStepNum,
      title: `Tahap ${nextStepNum}`,
      desc: 'Penjelasan tahapan seleksi peserta didik baru.',
    };
    setForm({ ...form, steps: [...form.steps, newStep] });
  };

  const handleDeleteStep = (index: number) => {
    const updated = form.steps
      .filter((_, i) => i !== index)
      .map((st, i) => ({ ...st, step: i + 1 }));
    setForm({ ...form, steps: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Pengaturan Informasi SPMB
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur status buka/tutup pendaftaran, jadwal seleksi, persyaratan dokumen, dan alur pendaftaran.
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
        sectionTitle="Informasi SPMB / PPDB"
        sectionKey="ppdb"
        header={data.sectionHeaders?.ppdb || defaultSectionHeaders.ppdb}
        isVisible={data.sectionVisibility?.ppdb !== false}
        onHeaderChange={(newHeader) => updateSectionHeader('ppdb', newHeader)}
        onVisibilityChange={(visible) => toggleSectionVisibility('ppdb', visible)}
      />

      {/* SPMB Status & Period */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-blue-600" />
          <span>Status & Jadwal Pendaftaran</span>
        </h3>

        {/* Toggle Switch */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900">
              Status Penerimaan Siswa Baru (SPMB)
            </div>
            <div className="text-xs text-slate-500">
              {form.isOpen
                ? 'Pendaftaran sedang dibuka di landing page (Tombol Daftar aktif).'
                : 'Pendaftaran ditutup sementara (Status non-aktif).'}
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.isOpen}
              onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tahun Ajaran *
            </label>
            <input
              type="text"
              required
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              placeholder="2026/2027"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Periode Pendaftaran *
            </label>
            <input
              type="text"
              required
              value={form.registrationPeriod}
              onChange={(e) => setForm({ ...form, registrationPeriod: e.target.value })}
              placeholder="01 September 2026 - 31 Desember 2026"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Deskripsi Pengantar SPMB
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Kontak Person / Helpdesk WhatsApp SPMB
          </label>
          <input
            type="text"
            value={form.contactPerson}
            onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            placeholder="Admin SPMB: 0812-XXXX-XXXX"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Pengaturan Tombol & Tautan Web Pendaftaran */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-600" />
            <span>Pengaturan Tombol & Link Web Pendaftaran SPMB</span>
          </h3>
          <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-200">
            Tautan Eksternal
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Ubah nama teks pada tombol pendaftaran dan tentukan alamat tautan (URL) web pendaftaran luar (misal: formulir Google Forms, portal SPMB Disdik, Siap-SPMB, dll.).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama / Teks Tombol Pendaftaran *
            </label>
            <input
              type="text"
              required
              value={form.registrationButtonText || ''}
              onChange={(e) => setForm({ ...form, registrationButtonText: e.target.value })}
              placeholder="Contoh: Daftar SPMB Online 2026/2027"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Teks yang tampil di dalam tombol pendaftaran pada landing page.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tautan / Link Web Tujuan Pendaftaran (URL) *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={form.registrationUrl}
                onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })}
                placeholder="https://spmb.jakarta.go.id atau https://forms.gle/..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono text-xs"
              />
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Pengunjung akan langsung dialihkan ke alamat website ini saat mengklik tombol.
            </p>
          </div>
        </div>

        {/* Tab Target Setting & Live Preview */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
            <input
              type="checkbox"
              checked={form.registrationOpenNewTab !== false}
              onChange={(e) => setForm({ ...form, registrationOpenNewTab: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>Buka tautan website tujuan di tab baru (direkomendasikan)</span>
          </label>

          {/* Test Link Button */}
          {form.registrationUrl && (
            <a
              href={form.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition"
            >
              <span>Uji Coba Tautan URL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Preview of Button */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-600 mb-2">
            Pratinjau Tampilan Tombol di Landing Page:
          </div>
          <div className="p-4 bg-slate-900 rounded-xl flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Target: <span className="text-blue-400 font-mono">{form.registrationUrl || 'Belum diisi'}</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md">
              <span>{form.registrationButtonText || 'Daftar SPMB Sekarang'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Alur Pendaftaran */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-800 uppercase tracking-wider block">
            Tahapan & Alur Pendaftaran ({form.steps.length} Langkah)
          </label>
          <button
            type="button"
            onClick={handleAddStep}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
          >
            + Tambah Langkah
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {form.steps.map((st, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-md bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                  {st.step}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteStep(idx)}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  title="Hapus langkah ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={st.title}
                onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                placeholder="Judul Langkah"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
              />

              <textarea
                rows={2}
                value={st.desc}
                onChange={(e) => handleStepChange(idx, 'desc', e.target.value)}
                placeholder="Keterangan alur langkah pendaftaran..."
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Persyaratan Berkas */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <label className="text-sm font-bold text-slate-800 uppercase tracking-wider block">
          Daftar Dokumen & Persyaratan Berkas ({form.requirements.length})
        </label>

        <div className="space-y-2">
          {form.requirements.map((req, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 ml-2" />
              <input
                type="text"
                value={req}
                onChange={(e) => {
                  const updated = [...form.requirements];
                  updated[idx] = e.target.value;
                  setForm({ ...form, requirements: updated });
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => handleDeleteRequirement(idx)}
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
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="Tambah syarat berkas baru..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddRequirement();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddRequirement}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Informasi SPMB</span>
        </button>
      </div>
    </form>
  );
};
