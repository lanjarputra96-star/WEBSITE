import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  Inbox, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  AlertTriangle,
  Send,
  User,
  Clock,
  Filter
} from 'lucide-react';
import { ContactMessage } from '../../../types';

export const AdminTabMessages: React.FC = () => {
  const { 
    messages, 
    unreadMessagesCount, 
    deleteMessage, 
    deleteAllMessages, 
    markMessageAsRead,
    fetchMessages 
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'read'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMessages();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleDeleteSingle = async (id: string, name: string) => {
    if (window.confirm(`Hapus pesan masuk dari "${name}"?`)) {
      setDeletingId(id);
      await deleteMessage(id);
      setDeletingId(null);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleConfirmDeleteAll = async () => {
    await deleteAllMessages();
    setShowDeleteAllModal(false);
    setSelectedMessage(null);
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    if (filterTab === 'unread' && msg.isRead) return false;
    if (filterTab === 'read' && !msg.isRead) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = msg.name?.toLowerCase().includes(q);
      const matchSubject = msg.subject?.toLowerCase().includes(q);
      const matchMsg = msg.message?.toLowerCase().includes(q);
      const matchEmail = msg.email?.toLowerCase().includes(q);
      const matchPhone = msg.phone?.toLowerCase().includes(q);
      return matchName || matchSubject || matchMsg || matchEmail || matchPhone;
    }
    return true;
  });

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  // Clean phone number for WhatsApp link
  const cleanPhoneForWa = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return clean;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>Pesan Masuk Pengunjung</span>
                {unreadMessagesCount > 0 && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadMessagesCount} Baru
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar pesan, pertanyaan, dan konsultasi yang dikirimkan oleh masyarakat melalui formulir kontak landing page.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            title="Muat Ulang Pesan"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Perbarui</span>
          </button>

          {messages.length > 0 && (
            <button
              onClick={() => setShowDeleteAllModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Pesan</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({messages.length})
          </button>
          <button
            onClick={() => setFilterTab('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterTab === 'unread'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Belum Dibaca ({unreadMessagesCount})
          </button>
          <button
            onClick={() => setFilterTab('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterTab === 'read'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sudah Dibaca ({messages.length - unreadMessagesCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengirim, subjek, isi pesan..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Messages List / Grid */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {messages.length === 0
              ? 'Belum Ada Pesan Masuk'
              : 'Tidak Ada Pesan yang Sesuai Filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5">
            {messages.length === 0
              ? 'Pesan atau pertanyaan yang dikirimkan pengunjung dari formulir kontak landing page website sekolah akan langsung masuk dan tersimpan di sini.'
              : 'Silakan ubah kata kunci pencarian atau ganti filter status pesan.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isUnread = !msg.isRead;
            return (
              <div
                key={msg.id}
                className={`bg-white border rounded-2xl p-5 transition shadow-xs hover:border-slate-300 ${
                  isUnread
                    ? 'border-blue-300 bg-blue-50/20 ring-1 ring-blue-100'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Sender Info & Subject */}
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isUnread ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {msg.name}
                        </span>

                        {isUnread && (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            Baru
                          </span>
                        )}

                        <span className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-slate-200">
                          {msg.subject || 'Pertanyaan Umum'}
                        </span>
                      </div>

                      {/* Contact Channels */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        {msg.email && (
                          <a
                            href={`mailto:${msg.email}`}
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-700 transition"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{msg.email}</span>
                          </a>
                        )}

                        {msg.phone && (
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{msg.phone}</span>
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDateTime(msg.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Delete Single & Mark Read */}
                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                    {isUnread && (
                      <button
                        onClick={() => markMessageAsRead(msg.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition cursor-pointer"
                        title="Tandai Sudah Dibaca"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span className="hidden md:inline">Tandai Dibaca</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteSingle(msg.id, msg.name)}
                      disabled={deletingId === msg.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
                      title="Hapus Pesan Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  </div>
                </div>

                {/* Message Content Body */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 bg-slate-50/70 p-4 rounded-xl text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>

                {/* Response Quick Action Links */}
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  {msg.phone && (
                    <a
                      href={`https://wa.me/${cleanPhoneForWa(msg.phone)}?text=${encodeURIComponent(
                        `Halo Bapak/Ibu ${msg.name}, kami dari pihak sekolah menindaklanjuti pesan Anda terkait "${msg.subject}":`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Balas via WhatsApp</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  )}

                  {msg.email && (
                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent(
                        `Re: ${msg.subject} - SMA Nusantara Cendekia`
                      )}`}
                      className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Balas via Email</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Konfirmasi Hapus Semua Pesan */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900">
                Hapus Semua Pesan Masuk?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tindakan ini akan menghapus seluruh <b>{messages.length} pesan masuk</b> secara permanen dari server sekolah dan tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition cursor-pointer shadow-xs"
              >
                Ya, Hapus Semua Pesan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
