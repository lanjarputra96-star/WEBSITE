import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'portrait' | 'video' | 'wide' | 'auto';
  required?: boolean;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://...',
  helperText,
  aspectRatio = 'auto',
  required = false,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and optimize image file to Base64 to save localStorage space
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Harap pilih file gambar (JPG, PNG, WebP, GIF, SVG).');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);

    // SVG can be read directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setUploadError('Gagal membaca file SVG.');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    // Raster image: downscale with Canvas if larger than 1200px
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          onChange(e.target?.result as string);
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use webp or jpeg compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        onChange(compressedBase64);
        setIsProcessing(false);
      };
      img.onerror = () => {
        setUploadError('Gagal memproses file gambar.');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca file dari komputer.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square w-24 sm:w-28';
      case 'portrait':
        return 'aspect-3/4 w-28 sm:w-32';
      case 'video':
        return 'aspect-video w-44 sm:w-56';
      case 'wide':
        return 'aspect-21/9 w-52 sm:w-64';
      default:
        return 'h-24 w-32';
    }
  };

  const isBase64 = value?.startsWith('data:image/');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {/* Toggle mode button */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 text-[11px] font-semibold rounded transition cursor-pointer flex items-center gap-1 ${
              activeMode === 'upload'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Upload Komputer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 text-[11px] font-semibold rounded transition cursor-pointer flex items-center gap-1 ${
              activeMode === 'url'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Tautan URL</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Upload from Computer */}
      {activeMode === 'upload' ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-blue-500 bg-blue-50/70'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {isProcessing
                  ? 'Memproses gambar...'
                  : 'Klik untuk pilih foto dari komputer'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Atau seret & lepas berkas di sini (JPG, PNG, WebP, SVG maks 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Paste URL */
        <div>
          <div className="relative">
            <input
              type="url"
              value={isBase64 ? '' : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={isBase64 ? '(Foto diunggah dari file lokal komputer)' : placeholder}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          {isBase64 && (
            <p className="text-[11px] text-amber-600 mt-1">
              Saat ini menggunakan foto upload lokal. Ketik URL di atas jika ingin mengganti ke URL web eksternal.
            </p>
          )}
        </div>
      )}

      {/* Error display */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Image Preview & Actions */}
      {value ? (
        <div className="flex items-start gap-3 bg-white border border-slate-200 p-2.5 rounded-xl shadow-2xs">
          <div className={`relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 ${getAspectRatioClass()}`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Foto Terpasang</span>
                {isBase64 ? (
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full font-semibold">
                    File Komputer
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-semibold">
                    Tautan Web
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate" title={value}>
                {isBase64 ? 'Tersimpan dalam sistem penyimpanan lokal' : value}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Ganti Foto</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer hover:underline"
              >
                <X className="w-3 h-3" />
                <span>Hapus Foto</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        helperText && (
          <p className="text-[11px] text-slate-500">{helperText}</p>
        )
      )}
    </div>
  );
};
