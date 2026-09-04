'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteRefeicaoAction, RefeicaoRegistro } from '../actions';
import { Trash2, Sun, Moon, Calendar, Utensils, Loader2 } from 'lucide-react';

interface RefeicoesTabelaProps {
  initialRefeicoes: RefeicaoRegistro[];
}

export default function RefeicoesTabela({ initialRefeicoes }: RefeicoesTabelaProps) {
  const router = useRouter();
  const [refeicoes, setRefeicoes] = useState<RefeicaoRegistro[]>(initialRefeicoes);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id?: string) => {
    if (!id) return;
    if (!confirm('Deseja realmente remover esta refeição do cardápio?')) return;

    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteRefeicaoAction(id);
      if (res.success) {
        setRefeicoes((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      } else {
        alert(res.error || 'Erro ao remover refeição.');
      }
      setDeletingId(null);
    });
  };

  const formatarData = (dataStr: string) => {
    try {
      const [ano, mes, dia] = dataStr.split('-');
      const dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      return dataObj.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dataStr;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#00185f] font-display flex items-center gap-2">
            <Utensils className="h-5 w-5 text-slate-700" />
            <span>Refeições Cadastradas no Banco de Dados</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Últimas refeições registradas e ativas no site público.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-400 self-start sm:self-auto bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {refeicoes.length} {refeicoes.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      {refeicoes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Data</th>
                <th className="py-3 px-3">Turno</th>
                <th className="py-3 px-3">Descrição da Refeição</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {refeicoes.map((ref) => {
                const isDeleting = deletingId === ref.id;
                return (
                  <tr key={ref.id || `${ref.data}-${ref.turno}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold text-slate-900 whitespace-nowrap capitalize">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{formatarData(ref.data)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {ref.turno === 'diurno' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-800 border border-amber-200">
                          <Sun className="h-3 w-3 text-amber-600" />
                          <span>Diurno</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-indigo-50 text-indigo-800 border border-indigo-200">
                          <Moon className="h-3 w-3 text-indigo-600" />
                          <span>Noturno</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium max-w-md leading-relaxed">
                      {ref.descricao}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      {ref.id && (
                        <button
                          type="button"
                          onClick={() => handleDelete(ref.id)}
                          disabled={isDeleting || isPending}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Remover refeição"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50">
          <Utensils className="h-8 w-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">Nenhuma refeição cadastrada no momento</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Utilize o formulário acima para enviar o PDF oficial da SED/SC e alimentar automaticamente a base de dados.
          </p>
        </div>
      )}
    </div>
  );
}
