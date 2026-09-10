import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GraduationCap, Award, BookOpen } from 'lucide-react';

export const GuruSection: React.FC = () => {
  const { data } = useSchool();
  const { guru, sectionHeaders } = data;
  const header = sectionHeaders?.guru;

  return (
    <section id="guru" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{header?.badge || 'Pendidik Berdedikasi'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {header?.title || 'Dewan Guru & Tenaga Ahli'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {header?.subtitle || 'Dididik oleh praktisi pendidikan berpengalaman dari lulusan universitas terkemuka dalam dan luar negeri.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {guru.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group text-center"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={g.photoUrl}
                    alt={g.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4 text-left">
                    <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">
                      {g.subject}
                    </span>
                  </div>
                </div>

                <div className="p-5 text-left">
                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-1 group-hover:text-blue-700 transition">
                    {g.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 mb-2">
                    {g.role}
                  </p>
                  <p className="text-xs text-slate-500 mb-3 flex items-start gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{g.education}</span>
                  </p>
                  {g.bio && (
                    <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 italic">
                      "{g.bio}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
