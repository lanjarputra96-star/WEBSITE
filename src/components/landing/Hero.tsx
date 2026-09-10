import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { DynamicIcon } from '../../utils/iconHelper';
import { ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';

export const Hero: React.FC = () => {
  const { data } = useSchool();
  const { hero, schoolInfo } = data;

  return (
    <section id="beranda" className="relative overflow-hidden bg-slate-900 text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-indigo-500 blur-3xl" />
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* SPMB Alert Pill */}
            {hero.badgeActive && (
              <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-600/40 text-blue-300 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{hero.badgeText}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {hero.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {hero.subheadline}
            </p>

            {/* Key Quality Assurances */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-md border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Kurikulum Merdeka Berdiferensiasi</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-md border border-slate-700">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Akreditasi {schoolInfo.akreditasi}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href={hero.primaryBtnLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-base font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>{hero.primaryBtnText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={hero.secondaryBtnLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-base font-semibold px-6 py-3.5 rounded-xl transition"
              >
                <span>{hero.secondaryBtnText}</span>
              </a>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="relative rounded-2xl p-2 bg-gradient-to-tr from-blue-600/30 via-slate-700 to-indigo-600/30 shadow-2xl">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-slate-800">
                  <img
                    src={hero.bgImageUrl}
                    alt={schoolInfo.name}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                      Kampus Edukasi Terpadu
                    </span>
                    <p className="text-sm sm:text-base font-bold leading-snug">
                      {schoolInfo.name} — Didirikan Tahun {schoolInfo.tahunBerdiri}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badges */}
              {hero.statsBadges && hero.statsBadges.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 mt-4">
                  {hero.statsBadges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/95 border border-slate-700 p-3 rounded-xl flex items-center gap-3 backdrop-blur-sm shadow-md"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-900/60 border border-blue-700/40 text-blue-400 flex items-center justify-center shrink-0">
                        <DynamicIcon name={badge.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">{badge.label}</div>
                        <div className="text-base font-extrabold text-white">{badge.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
