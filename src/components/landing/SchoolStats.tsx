import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { DynamicIcon } from '../../utils/iconHelper';

export const SchoolStats: React.FC = () => {
  const { data } = useSchool();
  const { statistik } = data;

  if (!statistik || statistik.length === 0) return null;

  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {statistik.map((stat, idx) => (
            <div
              key={stat.id || idx}
              className={`flex flex-col items-center text-center ${idx !== 0 ? 'sm:pl-4 pt-4 sm:pt-0' : ''}`}
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <DynamicIcon name={stat.icon} className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-700 mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 max-w-[140px] leading-tight">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
