'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, GraduationCap, ArrowRight } from 'lucide-react';
import { EscolaTurmaPublic, GRADE_RANK } from '@/lib/data/turmas';

interface TurmasHubProps {
  initialTurmas: EscolaTurmaPublic[];
}

export default function TurmasHub({ initialTurmas }: TurmasHubProps) {
  // Group by 'ano'
  const grouped = initialTurmas.reduce((acc, current) => {
    const key = current.ano;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(current);
    return acc;
  }, {} as Record<string, EscolaTurmaPublic[]>);

  // Sort grades based on GRADE_RANK (highest to lowest)
  const sortedGrades = Object.keys(grouped).sort((a, b) => {
    const rankA = GRADE_RANK[a] || 0;
    const rankB = GRADE_RANK[b] || 0;
    return rankB - rankA;
  });

  // Track expanded grades
  const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({});

  const toggleGrade = (grade: string) => {
    setExpandedGrades(prev => ({
      ...prev,
      [grade]: !prev[grade]
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {sortedGrades.length > 0 ? (
        sortedGrades.map((grade) => {
          const classes = grouped[grade];
          const isExpanded = !!expandedGrades[grade];

          return (
            <div 
              key={grade} 
              className="bg-white border border-slate-205 rounded-2xl shadow-sm overflow-hidden hover:border-[#00185f]/30 transition-all duration-300"
            >
              {/* Header / Clickable parent card */}
              <button
                onClick={() => toggleGrade(grade)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-slate-50 outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#00185f]/5 text-[#00185f] rounded-xl shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-[#00185f] leading-tight">
                      {grade}
                    </h3>
                    <span className="text-xs text-slate-450 font-bold block mt-1">
                      {classes.length} {classes.length === 1 ? 'Turma cadastrada' : 'Turmas cadastradas'}
                    </span>
                  </div>
                </div>

                <div className="text-slate-400">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-[#00185f]" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              {/* Child classes (Expandable panel) */}
              <div className={`transition-all duration-350 ease-in-out ${
                isExpanded ? 'border-t border-slate-100 max-h-[1000px] py-5 px-6' : 'max-h-0 overflow-hidden'
              }`}>
                {isExpanded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn">
                    {classes.map((turma) => (
                      <Link
                        key={turma.id}
                        href={`/turmas/${turma.id}`}
                        className="border border-slate-150 rounded-xl p-4 bg-slate-50 hover:bg-white hover:border-[#00185f] hover:shadow-md transition-all flex flex-col justify-between group h-28"
                      >
                        <div className="space-y-1">
                          <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            turma.turno === 'Matutino'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : turma.turno === 'Vespertino'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : turma.turno === 'Noturno'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {turma.turno}
                          </span>
                          <h4 className="font-extrabold text-slate-805 text-sm group-hover:text-[#00185f] transition-colors leading-tight">
                            Turma {turma.nome}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-450 group-hover:text-secondary transition-colors border-t border-slate-200/50 pt-2 mt-2">
                          <span className="flex items-center gap-1">
                            {turma.whatsapp_link && (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Grupo WhatsApp Disponível" />
                            )}
                            Mural de Recados
                          </span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-slate-400 py-12 font-semibold">Nenhuma turma cadastrada no momento.</p>
      )}
    </div>
  );
}
