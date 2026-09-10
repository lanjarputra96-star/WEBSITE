import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/landing/Navbar';
import { Hero } from './components/landing/Hero';
import { SchoolStats } from './components/landing/SchoolStats';
import { HeadmasterGreeting } from './components/landing/HeadmasterGreeting';
import { VisiMisiSection } from './components/landing/VisiMisiSection';
import { ProgramsSection } from './components/landing/ProgramsSection';
import { PrestasiSection } from './components/landing/PrestasiSection';
import { BeritaSection } from './components/landing/BeritaSection';
import { FasilitasSection } from './components/landing/FasilitasSection';
import { GuruSection } from './components/landing/GuruSection';
import { PpdbSection } from './components/landing/PpdbSection';
import { PusatInformasiSection } from './components/landing/PusatInformasiSection';
import { ContactSection } from './components/landing/ContactSection';
import { Footer } from './components/landing/Footer';
import { NewsDetailModal } from './components/landing/NewsDetailModal';
import { AdminLoginModal } from './components/landing/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Settings, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SectionVisibility } from './types';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, isAdminLoggedIn, toastMessage, data } = useSchool();
  const visibility: Partial<SectionVisibility> = data.sectionVisibility || {};

  if (currentView === 'admin' && isAdminLoggedIn) {
    return (
      <>
        <AdminDashboard />
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Landing Page Navbar */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-1">
        {visibility.hero !== false && <Hero />}
        {visibility.statistik !== false && <SchoolStats />}
        {visibility.sambutan !== false && <HeadmasterGreeting />}
        {visibility.visiMisi !== false && <VisiMisiSection />}
        {visibility.program !== false && <ProgramsSection />}
        {visibility.prestasi !== false && <PrestasiSection />}
        {visibility.berita !== false && <BeritaSection />}
        {visibility.fasilitas !== false && <FasilitasSection />}
        {visibility.guru !== false && <GuruSection />}
        {visibility.ppdb !== false && <PpdbSection />}
        {visibility.pusatInformasi !== false && <PusatInformasiSection />}
        {visibility.kontak !== false && <ContactSection />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <NewsDetailModal />
      <AdminLoginModal />

      {/* Floating Admin Quick Access Button when logged in */}
      {isAdminLoggedIn && (
        <aside aria-label="Admin floating menu" className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setCurrentView('admin')}
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-2xl border border-slate-700 font-semibold text-xs sm:text-sm transition transform hover:-translate-y-1 cursor-pointer group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Buka Panel Admin CMS</span>
          </button>
        </aside>
      )}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white border border-slate-700 px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 backdrop-blur-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
