import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { BeritaItem } from '../../../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Pin, 
  X, 
  Save, 
  Check, 
  Search,
  ExternalLink
} from 'lucide-react';
import { ImageUploadInput } from '../../common/ImageUploadInput';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { defaultSectionHeaders } from '../../../data/initialData';

export const AdminTabBerita: React.FC = () => {
  const { data, updateData, showToast, updateSectionHeader, toggleSectionVisibility } = useSchool();
  const [beritaList, setBeritaList] = useState<BeritaItem[]>(data.berita);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BeritaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Open modal to create new article
  const handleCreate = () => {
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const newItem: BeritaItem = {
      id: 'b_' + Date.now(),
      title: '',
      category: 'Berita',
      date: today,
      author: 'Humas Sekolah',
      summary: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
      isPinned: false,
    };
    setEditingItem(newItem);
    setIsEditorOpen(true);
  };

  const handleEdit = (item: BeritaItem) => {
    setEditingItem({ ...item });
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus artikel berita ini?')) {
      const updated = beritaList.filter((b) => b.id !== id);
      setBeritaList(updated);
      updateData((prev) => ({ ...prev, berita: updated }));
      showToast('Artikel berita berhasil dihapus.');
    }
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: BeritaItem[];
    const exists = beritaList.some((b) => b.id === editingItem.id);
    if (exists) {
      updated = beritaList.map((b) => (b.id === editingItem.id ? editingItem : b));
    } else {
      updated = [editingItem, ...beritaList];
    }

    setBeritaList(updated);
    updateData((prev) => ({ ...prev, berita: updated }));
    setIsEditorOpen(false);
    setEditingItem(null);
    showToast('Artikel berita berhasil disimpan.');
  };

  const filtered = beritaList.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Manajemen Berita & Pengumuman
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publikasikan artikel, kabar prestasi, kegiatan kesiswaan, atau surat edaran resmi.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Dynamic Header & Visibility Controls */}
      <SectionHeaderCard
        sectionTitle="Berita & Pengumuman"
        sectionKey="berita"
        header={data.sectionHeaders?.berita || defaultSectionHeaders.berita}
        isVisible={data.sectionVisibility?.berita !== false}
        onHeaderChange={(newHeader) => updateSectionHeader('berita', newHeader)}
        onVisibilityChange={(visible) => toggleSectionVisibility('berita', visible)}
      />

      {/* Search Filter */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari judul, ringkasan atau kategori..."
          className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Articles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  {item.isPinned && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" />
                      <span>Sematkan</span>
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit artikel"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Hapus artikel"
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
                    className="w-20 h-16 object-cover rounded-lg shrink-0 border border-slate-200"
                  />
                )}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {item.summary}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Penulis: <b className="text-slate-600">{item.author}</b></span>
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Edit Konten
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm">
            Tidak ada artikel yang cocok dengan pencarian.
          </div>
        )}
      </div>

      {/* Editor Modal Popup */}
      {isEditorOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingItem.title ? 'Edit Artikel Berita' : 'Tulis Artikel Berita Baru'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditor} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Berita / Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Masukkan judul artikel..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as BeritaItem['category'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                  >
                    <option value="Berita">Berita</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Kegiatan">Kegiatan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Publikasi
                  </label>
                  <input
                    type="text"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Penulis / Pengunggah
                  </label>
                  <input
                    type="text"
                    value={editingItem.author}
                    onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="Foto Sampul / Banner Berita"
                  value={editingItem.imageUrl}
                  onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Pilih foto dokumentasi kegiatan atau ilustrasi artikel dari komputer."
                  aspectRatio="video"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan Singkat (Summary) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.summary}
                  onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Konten Lengkap Berita (Mendukung paragraf baru) *
                </label>
                <textarea
                  rows={7}
                  required
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Tuliskan isi berita selengkapnya di sini..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinCheckbox"
                  checked={editingItem.isPinned}
                  onChange={(e) => setEditingItem({ ...editingItem, isPinned: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="pinCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Sematkan artikel ini di bagian teratas (Pinned Post)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Artikel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
