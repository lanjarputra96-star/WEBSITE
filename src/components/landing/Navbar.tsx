import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  Phone, 
  Mail, 
  Clock, 
  UserCheck, 
  Lock, 
  Menu, 
  X, 
  ChevronRight, 
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { SectionVisibility } from '../../types';

export const Navbar: React.FC = () => {
  const { data, isAdminLoggedIn, setIsLoginModalOpen, setCurrentView, logout } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { schoolInfo, ppdb, sectionVisibility, sectionHeaders } = data;
  const visibility: Partial<SectionVisibility> = sectionVisibility || {};

  const allNavLinks = [
    { label: 'Beranda', href: '#beranda', visible: visibility.hero !== false },
    { label: sectionHeaders?.visiMisi?.badge || 'Profil & Visi', href: '#profil', visible: visibility.visiMisi !== false },
    { label: sectionHeaders?.sambutan?.badge || 'Sambutan', href: '#sambutan', visible: visibility.sambutan !== false },
    { label: sectionHeaders?.program?.badge || 'Program Unggulan', href: '#program', visible: visibility.program !== false },
    { label: sectionHeaders?.prestasi?.badge || 'Prestasi', href: '#prestasi', visible: visibility.prestasi !== false },
    { label: sectionHeaders?.fasilitas?.badge || 'Fasilitas', href: '#fasilitas', visible: visibility.fasilitas !== false },
    { label: sectionHeaders?.berita?.badge || 'Berita', href: '#berita', visible: visibility.berita !== false },
    { label: sectionHeaders?.guru?.badge || 'Dewan Guru', href: '#guru', visible: visibility.guru !== false },
    { label: sectionHeaders?.ppdb?.badge || 'SPMB', href: '#spmb', visible: visibility.ppdb !== false },
    { label: sectionHeaders?.pusatInformasi?.badge || 'Pusat Informasi', href: '#pusat-informasi', visible: visibility.pusatInformasi !== false },
    { label: sectionHeaders?.kontak?.badge || 'Kontak', href: '#kontak', visible: visibility.kontak !== false },
  ];

  const navLinks = allNavLinks.filter((link) => link.visible);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{schoolInfo.phone}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{schoolInfo.email}</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{schoolInfo.operatingHours}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('admin')}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded font-medium transition cursor-pointer"
                  title="Buka panel pengelolaan CMS"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Panel Admin</span>
                </button>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-rose-300 transition cursor-pointer text-xs"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Login Admin CMS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#beranda" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-md overflow-hidden shrink-0 border border-blue-800">
            {schoolInfo.logoUrl ? (
              <img
                src={schoolInfo.logoUrl}
                alt={schoolInfo.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <GraduationCap className="w-6 h-6 text-blue-300" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight group-hover:text-blue-700 transition">
                {schoolInfo.name}
              </span>
              <span className="hidden sm:inline-block bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {schoolInfo.akreditasi}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-sm">
              NPSN: {schoolInfo.npsn} • Terakreditasi Unggul
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <a
            href="#spmb"
            className="hidden sm:inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 active:scale-98 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs transition"
          >
            <span>{ppdb.isOpen ? 'SPMB Online' : 'Info SPMB'}</span>
            <ChevronRight className="w-4 h-4" />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="pb-3 mb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Navigasi Halaman
            </span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {schoolInfo.akreditasi}
            </span>
          </div>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="#spmb"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold"
            >
              Daftar SPMB 2026/2027
            </a>
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('admin');
                }}
                className="w-full text-center bg-slate-800 text-white py-2 rounded-lg text-sm font-medium"
              >
                Masuk ke Panel Admin
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="w-full text-center border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Login Admin Pengaturan
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
