import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { GuruItem } from '../../../types';
import { Plus, Trash2, Edit3, X, Save, GraduationCap } from 'lucide-react';
import { ImageUploadInput } from '../../common/ImageUploadInput';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { defaultSectionHeaders } from '../../../data/initialData';

export const AdminTabGuru: React.FC = () => {
  const { data, updateData, showToast, updateSectionHeader, toggleSectionVisibility } = useSchool();
  const [list, setList] = useState<GuruItem[]>(data.guru);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GuruItem | null>(null);

  const handleCreate = () => {
    const newItem: GuruItem = {
      id: 'g_' + Date.now(),
      name: '',
      role: 'Guru Mata Pelajaran',
      subject: 'Bidang Studi',
      education: 'S1 Pendidikan',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      bio: '',
    };
    setEditingItem(newItem);
    setIsEditorOpen(true);
  };

  const handleEdit = (item: GuruItem) => {
    setEditingItem({ ...item });
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus profil guru ini?')) {
      const updated = list.filter((g) => g.id !== id);
      setList(updated);
      updateData((prev) => ({ ...prev, guru: updated }));
      showToast('Profil guru berhasil dihapus.');
    }
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: GuruItem[];
    const exists = list.some((g) => g.id === editingItem.id);
    if (exists) {
      updated = list.map((g) => (g.id === editingItem.id ? editingItem : g));
    } else {
      updated = [...list, editingItem];
    }

    setList(updated);
    updateData((prev) => ({ ...prev, guru: updated }));
    setIsEditorOpen(false);
    setEditingItem(null);
    showToast('Profil guru berhasil disimpan.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Manajemen Dewan Guru & Tenaga Pendidik
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar profil pengajar, kualifikasi akademik, serta penugasan mata pelajaran.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Profil Guru</span>
        </button>
      </div>

      {/* Dynamic Header & Visibility Controls */}
      <SectionHeaderCard
        sectionTitle="Dewan Guru & Tenaga Pendidik"
        sectionKey="guru"
        header={data.sectionHeaders?.guru || defaultSectionHeaders.guru}
        isVisible={data.sectionVisibility?.guru !== false}
        onHeaderChange={(newHeader) => updateSectionHeader('guru', newHeader)}
        onVisibilityChange={(visible) => toggleSectionVisibility('guru', visible)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/5] bg-slate-100">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/90 p-1 rounded-lg shadow-xs">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 text-slate-600 hover:text-blue-600 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {item.name}
                </h3>
                <p className="text-[11px] font-semibold text-blue-700 mt-0.5">
                  {item.role}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mapel: <b>{item.subject}</b>
                </p>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {item.education}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditorOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingItem.name ? 'Edit Profil Guru' : 'Tambah Guru Baru'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditor} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Beserta Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Contoh: Dra. Sri Wahyuningsih, M.Si."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jabatan / Peran
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="Wakil Kepala / Koordinator"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mata Pelajaran Diampu
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.subject}
                    onChange={(e) => setEditingItem({ ...editingItem, subject: e.target.value })}
                    placeholder="Biologi & Sains"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kualifikasi Pendidikan Terakhir
                </label>
                <input
                  type="text"
                  value={editingItem.education}
                  onChange={(e) => setEditingItem({ ...editingItem, education: e.target.value })}
                  placeholder="S2 Bioteknologi ITB"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <ImageUploadInput
                  label="Foto Profil Guru / Tenaga Pendidik"
                  value={editingItem.photoUrl}
                  onChange={(url) => setEditingItem({ ...editingItem, photoUrl: url })}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Pilih foto formal guru (rasio 3:4 atau persegi) dari file komputer."
                  aspectRatio="portrait"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Biografi Singkat / Moto Mengajar
                </label>
                <textarea
                  rows={2}
                  value={editingItem.bio || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                  placeholder="Pengalaman mengajar atau kutipan motivasi..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Guru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
