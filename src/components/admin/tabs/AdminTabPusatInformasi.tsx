import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { PusatInformasiItem } from '../../../types';
import { SectionHeaderCard } from '../SectionHeaderCard';
import { defaultSectionHeaders } from '../../../data/initialData';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  ExternalLink, 
  Globe, 
  Laptop, 
  BookOpen, 
  FileCheck, 
  Download, 
  Users, 
  ShieldCheck, 
  GraduationCap, 
  Award,
  Link2,
  Search,
  CheckCircle,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';

const ICON_OPTIONS = [
  { id: 'Laptop', label: 'Laptop / Komputer', icon: Laptop },
  { id: 'BookOpen', label: 'Buku / Perpustakaan', icon: BookOpen },
  { id: 'FileCheck', label: 'Ujian / Asesmen', icon: FileCheck },
  { id: 'Download', label: 'Unduhan / File', icon: Download },
  { id: 'Users', label: 'Pengguna / Alumni', icon: Users },
  { id: 'ShieldCheck', label: 'Keamanan / BK', icon: ShieldCheck },
  { id: 'GraduationCap', label: 'Akademik / Wisuda', icon: GraduationCap },
  { id: 'Award', label: 'Prestasi / Piagam', icon: Award },
  { id: 'Globe', label: 'Web / Internet', icon: Globe },
];

export const AdminTabPusatInformasi: React.FC = () => {
  const { data, updateData, showToast, updateSectionHeader, toggleSectionVisibility } = useSchool();
  const [list, setList] = useState<PusatInformasiItem[]>(data.pusatInformasi || []);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PusatInformasiItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = () => {
    const newItem: PusatInformasiItem = {
      id: 'pi_' + Date.now(),
      title: '',
      category: 'Layanan Siswa',
      description: '',
      icon: 'Laptop',
      badge: 'Online',
      buttonText: 'Kunjungi Website',
      buttonUrl: 'https://',
      openInNewTab: true,
    };
    setEditingItem(newItem);
    setIsEditorOpen(true);
  };

  const handleEdit = (item: PusatInformasiItem) => {
    setEditingItem({ ...item });
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus pusat informasi ini?')) {
      const updated = list.filter((item) => item.id !== id);
      setList(updated);
      updateData((prev) => ({ ...prev, pusatInformasi: updated }));
      showToast('Pusat informasi berhasil dihapus.');
    }
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title.trim()) {
      alert('Judul pusat informasi wajib diisi.');
      return;
    }

    if (!editingItem.buttonText.trim()) {
      alert('Nama tombol wajib diisi.');
      return;
    }

    if (!editingItem.buttonUrl.trim()) {
      alert('Tautan link web tujuan wajib diisi.');
      return;
    }

    let updated: PusatInformasiItem[];
    const exists = list.some((item) => item.id === editingItem.id);
    if (exists) {
      updated = list.map((item) => (item.id === editingItem.id ? editingItem : item));
    } else {
      updated = [...list, editingItem];
    }

    setList(updated);
    updateData((prev) => ({ ...prev, pusatInformasi: updated }));
    setIsEditorOpen(false);
    setEditingItem(null);
    showToast('Pusat informasi berhasil disimpan.');
  };

  const filtered = list.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buttonText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderIcon = (iconName: string) => {
    const found = ICON_OPTIONS.find((opt) => opt.id === iconName);
    const IconComp = found ? found.icon : Globe;
    return <IconComp className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Pusat Informasi & Tautan Web Eksternal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola portal informasi sekolah, kartu layanan digital, nama tombol, dan alamat link web tujuan pengunjung.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pusat Informasi</span>
        </button>
      </div>

      {/* Dynamic Header & Visibility Controls */}
      <SectionHeaderCard
        sectionTitle="Pusat Informasi & Layanan Digital"
        sectionKey="pusatInformasi"
        header={data.sectionHeaders?.pusatInformasi || defaultSectionHeaders.pusatInformasi}
        isVisible={data.sectionVisibility?.pusatInformasi !== false}
        onHeaderChange={(newHeader) => updateSectionHeader('pusatInformasi', newHeader)}
        onVisibilityChange={(visible) => toggleSectionVisibility('pusatInformasi', visible)}
      />

      {/* Search & Counter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pusat informasi atau tombol..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="text-xs font-semibold text-slate-600">
          Total: <span className="text-blue-700 font-bold">{list.length}</span> portal informasi terdaftar
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    {renderIcon(item.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Edit / Delete actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit pusat informasi & tombol"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                {item.description}
              </p>
            </div>

            {/* Configured Button Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Teks Tombol:</span>
                <span className="font-bold text-slate-900">{item.buttonText}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] gap-2">
                <span className="text-slate-500 font-medium shrink-0">Link Tujuan:</span>
                <span className="text-blue-700 font-mono truncate text-[10px]" title={item.buttonUrl}>
                  {item.buttonUrl}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500">
                  {item.openInNewTab !== false ? '✓ Buka di Tab Baru' : 'Tab yang Sama'}
                </span>

                {/* Test button click */}
                <a
                  href={item.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                >
                  <span>Uji Buka Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm">
            Tidak ada pusat informasi yang ditemukan. Klik tombol <b>Tambah Pusat Informasi</b> di atas untuk menambahkan.
          </div>
        )}
      </div>

      {/* Editor Modal Popup */}
      {isEditorOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingItem.title ? 'Edit Pusat Informasi & Tombol' : 'Tambah Pusat Informasi Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atur nama tombol dan link web eksternal yang dituju
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveEditor} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Pusat Informasi *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Contoh: Portal Akademik Siswa (SIAKAD)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Informasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="Layanan Siswa / Akademik / Ujian"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Label Badge (Opsional)
                  </label>
                  <input
                    type="text"
                    value={editingItem.badge || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    placeholder="Contoh: Online 24 Jam / PDF"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Ikon Layanan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = editingItem.icon === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, icon: opt.id })}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <IconComp className="w-4 h-4 shrink-0" />
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Singkat Layanan *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Keterangan singkat fungsi dan kegunaan portal ini..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden resize-none"
                />
              </div>

              {/* Tombol & Link Web Eksternal */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span>Pengaturan Tombol & Tautan Web</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nama / Teks Tombol *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.buttonText}
                    onChange={(e) => setEditingItem({ ...editingItem, buttonText: e.target.value })}
                    placeholder="Contoh: Buka Portal SIAKAD / Unduh Berkas / Masuk Ujian"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Teks ini akan muncul di dalam tombol yang akan diklik oleh pengunjung.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tautan Link Web Tujuan (URL Lengkap) *
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={editingItem.buttonUrl}
                      onChange={(e) => setEditingItem({ ...editingItem, buttonUrl: e.target.value })}
                      placeholder="https://contoh-link-web.com/..."
                      className="w-full pl-8 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono text-xs"
                    />
                    <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Saat tombol diklik pengunjung, browser akan membuka alamat web ini.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 pt-1">
                  <input
                    type="checkbox"
                    checked={editingItem.openInNewTab !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, openInNewTab: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Buka di tab baru (jendela browser baru)</span>
                </label>

                {/* Pratinjau Tombol Langsung */}
                <div className="pt-2 border-t border-blue-200/60">
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                    Pratinjau Tampilan Tombol:
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500 truncate">
                      Link: <span className="font-mono text-blue-600">{editingItem.buttonUrl || 'Belum diisi'}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shrink-0 shadow-xs">
                      <span>{editingItem.buttonText || 'Buka Halaman Web'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pusat Informasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
