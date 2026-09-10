import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GraduationCap, Lock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, setIsLoginModalOpen, isAdminLoggedIn, setCurrentView } = useSchool();
  const { schoolInfo } = data;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: School Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  {schoolInfo.name}
                </span>
                <div className="text-xs text-blue-400 font-semibold">
                  Akreditasi {schoolInfo.akreditasi}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {schoolInfo.tagline}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div>NPSN: <span className="text-slate-200 font-semibold">{schoolInfo.npsn}</span></div>
              <div>Didirikan: <span className="text-slate-200 font-semibold">Tahun {schoolInfo.tahunBerdiri}</span></div>
              <div>Alamat: <span className="text-slate-200">{schoolInfo.address}</span></div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Tautan Halaman
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#beranda" className="hover:text-blue-400 transition">Beranda</a></li>
              <li><a href="#profil" className="hover:text-blue-400 transition">Visi & Misi</a></li>
              <li><a href="#sambutan" className="hover:text-blue-400 transition">Sambutan Kepala Sekolah</a></li>
              <li><a href="#program" className="hover:text-blue-400 transition">Program Unggulan</a></li>
              <li><a href="#prestasi" className="hover:text-blue-400 transition">Daftar Prestasi Siswa</a></li>
              <li><a href="#fasilitas" className="hover:text-blue-400 transition">Sarana & Fasilitas</a></li>
            </ul>
          </div>

          {/* Col 3: Layanan & Informasi */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Pusat Layanan & Akses
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#spmb" className="hover:text-blue-400 transition">Penerimaan Siswa Baru (SPMB)</a></li>
              <li><a href="#berita" className="hover:text-blue-400 transition">Berita & Pengumuman</a></li>
              <li><a href="#guru" className="hover:text-blue-400 transition">Profil Dewan Guru</a></li>
              <li><a href="#kontak" className="hover:text-blue-400 transition">Hubungi Sekolah & Peta</a></li>
            </ul>

            <div className="pt-4">
              {isAdminLoggedIn ? (
                <button
                  onClick={() => setCurrentView('admin')}
                  className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Buka Panel Admin CMS</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg transition cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Login Pengelola Website</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {schoolInfo.name}. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <span>Sistem Informasi Profil Sekolah Terpadu</span>
            <span>•</span>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="hover:text-slate-300 underline cursor-pointer"
            >
              CMS Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
