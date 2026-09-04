'use client';

import { useState } from 'react';
import { Sun, Moon, Utensils, Clock, CheckCircle2, Info, Sparkles } from 'lucide-react';

export interface RefeicaoItem {
  id?: string;
  data?: string;
  turno: 'diurno' | 'noturno';
  descricao?: string;
  pratoPrincipal?: string;
  acompanhamentos?: string[];
  sobremesaOuBebida?: string;
  caloriasAprox?: string;
  observacaoNutricional?: string;
}

interface CardapioDoDiaProps {
  refeicoes?: RefeicaoItem[] | null;
  isLoading?: boolean;
}

export default function CardapioDoDia({ refeicoes, isLoading = false }: CardapioDoDiaProps) {
  const [selectedTurno, setSelectedTurno] = useState<'todos' | 'diurno' | 'noturno'>('todos');

  // Format today's date in pt-BR
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const itemDiurno = refeicoes?.find(r => r.turno === 'diurno');
  const itemNoturno = refeicoes?.find(r => r.turno === 'noturno');

  const temRefeicoesHoje = Boolean(itemDiurno || itemNoturno);

  return (
    <div className="space-y-6">
      {/* Date Banner Card */}
      <div className="bg-gradient-to-r from-[#00185f] to-[#002888] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cardápio do Dia</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold capitalize font-display">
              {dataFormatada}
            </h2>
            <p className="text-xs text-slate-200 font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-300" />
              <span>Cardápio oficial planejado por nutricionistas da SED/SC</span>
            </p>
          </div>

          {/* Quick Turno Filter */}
          {temRefeicoesHoje && (
            <div className="flex bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs font-bold self-start sm:self-auto">
              <button
                onClick={() => setSelectedTurno('todos')}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedTurno === 'todos' ? 'bg-white text-[#00185f] shadow-sm' : 'text-white/80 hover:text-white'}`}
              >
                Todos
              </button>
              {itemDiurno && (
                <button
                  onClick={() => setSelectedTurno('diurno')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${selectedTurno === 'diurno' ? 'bg-white text-[#00185f] shadow-sm' : 'text-white/80 hover:text-white'}`}
                >
                  <Sun className="h-3 w-3 text-amber-500" />
                  <span>Diurno</span>
                </button>
              )}
              {itemNoturno && (
                <button
                  onClick={() => setSelectedTurno('noturno')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${selectedTurno === 'noturno' ? 'bg-white text-[#00185f] shadow-sm' : 'text-white/80 hover:text-white'}`}
                >
                  <Moon className="h-3 w-3 text-indigo-400" />
                  <span>Noturno</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center space-y-3">
          <Utensils className="h-10 w-10 text-slate-400 mx-auto animate-pulse" />
          <h3 className="text-base font-bold text-slate-700">Carregando cardápio do dia...</h3>
          <p className="text-xs text-slate-400">Consultando o banco de dados oficial de alimentação escolar.</p>
        </div>
      ) : !temRefeicoesHoje ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm text-left">
          <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl w-fit mx-auto border border-amber-200/60">
            <Utensils className="h-8 w-8" />
          </div>
          <div className="text-center max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-extrabold text-[#00185f] font-display">
              Sem cardápio registrado para hoje
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Nos finais de semana, feriados ou recessos escolares, o serviço de alimentação escolar não opera. Em dias letivos normais, o cardápio é atualizado conforme o cronograma oficial da SED/SC.
            </p>
          </div>
          <div className="pt-2 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
              <Info className="h-3.5 w-3.5 text-slate-400" />
              <span>Consulte abaixo os editais e cronogramas mensais em PDF</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Card Turno Diurno */}
          {itemDiurno && (selectedTurno === 'todos' || selectedTurno === 'diurno') && (
            <div className={`bg-white border-2 border-amber-200/80 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between transition-all hover:border-amber-400 hover:shadow-md ${selectedTurno === 'diurno' || !itemNoturno ? 'md:col-span-2' : ''}`}>
              <div className="space-y-4">
                {/* Badge & Turno */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl">
                      <Sun className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Turnos Matutino & Vespertino</span>
                      <h3 className="text-lg font-extrabold text-slate-900 font-display">Almoço & Lanche</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Sincronizado
                  </span>
                </div>

                {/* Descrição Completa da Refeição */}
                <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wide block">
                    Refeição do Dia (SED/SC)
                  </span>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed">
                    {itemDiurno.descricao}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 font-medium">
                <Info className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Cardápio nutricional fiscalizado pelo Conselho de Alimentação Escolar (CAE) e nutricionistas da SED/SC.
                </span>
              </div>
            </div>
          )}

          {/* Card Turno Noturno */}
          {itemNoturno && (selectedTurno === 'todos' || selectedTurno === 'noturno') && (
            <div className={`bg-white border-2 border-indigo-200/80 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between transition-all hover:border-indigo-400 hover:shadow-md ${selectedTurno === 'noturno' || !itemDiurno ? 'md:col-span-2' : ''}`}>
              <div className="space-y-4">
                {/* Badge & Turno */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl">
                      <Moon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Turno Noturno</span>
                      <h3 className="text-lg font-extrabold text-slate-900 font-display">Jantar dos Estudantes</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Sincronizado
                  </span>
                </div>

                {/* Descrição Completa da Refeição */}
                <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wide block">
                    Refeição do Dia (SED/SC)
                  </span>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed">
                    {itemNoturno.descricao}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 font-medium">
                <Info className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Cardápio nutricional adaptado para o turno noturno e estudantes do Ensino Médio / EJA.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PNAE Institutional Assurance Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-xs text-slate-900 block">Padrão Nutricional FNDE / PNAE</span>
            <span className="text-[11px] text-slate-500 font-medium">
              Alimentos frescos da agricultura familiar catarinense, sem adição de corantes e conservantes artificiais.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
