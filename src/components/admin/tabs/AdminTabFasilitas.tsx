import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { FasilitasItem } from '../../../types';
import { Plus, Trash2, Edit3, X, Save, Building2 } from 'lucide-react';
import { ImageUploadInput } from '../../common/ImageUploadInput';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { defaultSectionHeaders } from '../../../data/initialData';

export const AdminTabFasilitas: React.FC = () => {
  const { data, updateData, showToast, updateSectionHeader, toggleSectionVisibility } = useSchool();
  const [list, setList] = useState<FasilitasItem[]>(data.fasilitas);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FasilitasItem | null>(null);

  const handleCreate = () => {
    const newItem: FasilitasItem = {
      id: 'f_' + Date.now(),
      name: '',
      category: 'Akademik',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    };
    setEditingItem(newItem);
    setIsEditorOpen(true);
  };

  const handleEdit = (item: FasilitasItem) => {
    setEditingItem({ ...item });
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus fasilitas ini dari profil sekolah?')) {
      const updated = list.filter((f) => f.id !== id);
      setList(updated);
      updateData((prev) => ({ ...prev, fasilitas: updated }));
      showToast('Fasilitas berhasil dihapus.');
    }
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: FasilitasItem[];
    const exists = list.some((f) => f.id === editingItem.id);
    if (exists) {
      updated = list.map((f) => (f.id === editingItem.id ? editingItem : f));
    } else {
      updated = [...list, editingItem];
    }

    setList(updated);
    updateData((prev) => ({ ...prev, fasilitas: updated }));
    setIsEditorOpen(false);
    setEditingItem(null);
    showToast('Data fasilitas berhasil disimpan.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Manajemen Fasilitas & Sarana Kampus
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola laboratorium, ruang belajar pintar, sarana olahraga, dan perpustakaan digital.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Fasilitas Baru</span>
        </button>
      </div>

      {/* Dynamic Header & Visibility Controls */}
      <SectionHeaderCard
        sectionTitle="Sarana & Fasilitas"
        sectionKey="fasilitas"
        header={data.sectionHeaders?.fasilitas || defaultSectionHeaders.fasilitas}
        isVisible={data.sectionVisibility?.fasilitas !== false}
        onHeaderChange={(newHeader) => updateSectionHeader('fasilitas', newHeader)}
        onVisibilityChange={(visible) => toggleSectionVisibility('fasilitas', visible)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.category}
                </span>

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
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3">
                  {item.description}
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
                {editingItem.name ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
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
                  Nama Fasilitas / Sarana *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Contoh: Laboratorium Komputer & AI Center"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Fasilitas
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      category: e.target.value as FasilitasItem['category'],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Akademik">Akademik</option>
                  <option value="Laboratorium">Laboratorium</option>
                  <option value="Olahraga">Olahraga</option>
                  <option value="Ibadah & Seni">Ibadah & Seni</option>
                  <option value="Fasilitas Umum">Fasilitas Umum</option>
                </select>
              </div>

              <div>
                <ImageUploadInput
                  label="Foto Fasilitas / Sarana Sekolah"
                  value={editingItem.imageUrl}
                  onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Unggah foto gedung, laboratorium, lapangan, atau ruang kelas dari komputer."
                  aspectRatio="video"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi & Spesifikasi Fasilitas
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Rincian perlengkapan dan kapasitas fasilitas..."
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
                  <span>Simpan Fasilitas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
