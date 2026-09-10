import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { PrestasiItem } from '../../../types';
import { Plus, Trash2, Edit3, X, Save, Trophy, Medal } from 'lucide-react';
import { ImageUploadInput } from '../../common/ImageUploadInput';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { defaultSectionHeaders } from '../../../data/initialData';

export const AdminTabPrestasi: React.FC = () => {
  const { data, updateData, showToast, updateSectionHeader, toggleSectionVisibility } = useSchool();
  const [list, setList] = useState<PrestasiItem[]>(data.prestasi);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PrestasiItem | null>(null);

  const handleCreate = () => {
    const newItem: PrestasiItem = {
      id: 'pr_' + Date.now(),
      title: '',
      category: 'Akademik',
      recipient: '',
      level: 'Nasional',
      year: new Date().getFullYear().toString(),
      imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=600&q=80',
      description: '',
    };
    setEditingItem(newItem);
    setIsEditorOpen(true);
  };

  const handleEdit = (item: PrestasiItem) => {
    setEditingItem({ ...item });
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus rekam jejak prestasi ini?')) {
      const updated = list.filter((p) => p.id !== id);
      setList(updated);
      updateData((prev) => ({ ...prev, prestasi: updated }));
      showToast('Prestasi berhasil dihapus.');
    }
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: PrestasiItem[];
    const exists = list.some((p) => p.id === editingItem.id);
    if (exists) {
      updated = list.map((p) => (p.id === editingItem.id ? editingItem : p));
    } else {
      updated = [editingItem, ...list];
    }

    setList(updated);
    updateData((prev) => ({ ...prev, prestasi: updated }));
    setIsEditorOpen(false);
    setEditingItem(null);
    showToast('Data prestasi berhasil disimpan.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Manajemen Prestasi Siswa & Guru
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar perolehan medali, kejuaraan sains, olahraga, seni, dan kompetisi tingkat dunia.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Prestasi Baru</span>
        </button>
      </div>

      {/* Dynamic Header & Visibility Controls */}
      <SectionHeaderCard
        sectionTitle="Rekam Jejak Prestasi"
        sectionKey="prestasi"
        header={data.sectionHeaders?.prestasi || defaultSectionHeaders.prestasi}
        isVisible={data.sectionVisibility?.prestasi !== false}
        onHeaderChange={(newHeader) => updateSectionHeader('prestasi', newHeader)}
        onVisibilityChange={(visible) => toggleSectionVisibility('prestasi', visible)}
      />

      {/* Prestasi Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Medal className="w-3 h-3 text-amber-600" />
                  <span>{item.level}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mb-3">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-200"
                  />
                )}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-blue-700 mt-1">
                    {item.recipient} ({item.year})
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Kategori: <b>{item.category}</b></span>
              <span>Tahun: <b>{item.year}</b></span>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingItem.title ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}
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
                  Nama Kejuaraan / Prestasi *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Contoh: Medali Emas OSN Fisika"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Peraih / Siswa / Tim *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.recipient}
                  onChange={(e) => setEditingItem({ ...editingItem, recipient: e.target.value })}
                  placeholder="Nama siswa atau nama tim pemenang"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as PrestasiItem['category'],
                      })
                    }
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Non-Akademik">Non-Akademik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tingkat
                  </label>
                  <select
                    value={editingItem.level}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        level: e.target.value as PrestasiItem['level'],
                      })
                    }
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Internasional">Internasional</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Kota/Kab">Kota/Kab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={editingItem.year}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="Foto Piagam / Trofi / Dokumentasi Prestasi"
                  value={editingItem.imageUrl}
                  onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Pilih foto bukti kejuaraan atau penyerahan trofi dari file komputer."
                  aspectRatio="video"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi / Keterangan Prestasi
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Rincian perolehan medali atau kejuaraan..."
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
                  <span>Simpan Prestasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
