import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, Calendar, User, Tag, Share2 } from 'lucide-react';

export const NewsDetailModal: React.FC = () => {
  const { selectedNews, setSelectedNews, showToast } = useSchool();

  if (!selectedNews) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Tautan berita berhasil disalin ke clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded">
              {selectedNews.category}
            </span>
            {selectedNews.isPinned && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                Disematkan
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full transition cursor-pointer"
              title="Bagikan artikel"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedNews(null)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full transition cursor-pointer"
              title="Tutup jendela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {selectedNews.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 border-y border-slate-100 py-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{selectedNews.date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Penulis: {selectedNews.author}</span>
            </div>
          </div>

          {selectedNews.imageUrl && (
            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-slate-700 text-base leading-relaxed space-y-4">
            {selectedNews.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => setSelectedNews(null)}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            Tutup Berita
          </button>
        </div>
      </div>
    </div>
  );
};
