'use client';

import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  deleteRefeicaoAction,
  updateRefeicaoAction,
  createRefeicaoAction,
  RefeicaoRegistro
} from '../actions';
import {
  Trash2,
  Pencil,
  Plus,
  Sun,
  Moon,
  Calendar,
  Utensils,
  Loader2,
  X,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';

interface RefeicoesTabelaProps {
  initialRefeicoes: RefeicaoRegistro[];
}

export default function RefeicoesTabela({ initialRefeicoes }: RefeicoesTabelaProps) {
  const router = useRouter();
  const [refeicoes, setRefeicoes] = useState<RefeicaoRegistro[]>(initialRefeicoes);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingRefeicao, setEditingRefeicao] = useState<RefeicaoRegistro | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('todos');

  // Form State para Edição / Criação
  const [formData, setFormData] = useState<{
    id?: string;
    data: string;
    turno: 'diurno' | 'noturno';
    descricao: string;
  }>({
    data: new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date()),
    turno: 'diurno',
    descricao: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sincroniza estado quando a lista pai for revalidada
  useEffect(() => {
    setRefeicoes(initialRefeicoes);
  }, [initialRefeicoes]);

  // Body scroll lock quando modal de edição/criação estiver ativo
  useEffect(() => {
    if (editingRefeicao || isCreating) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingRefeicao, isCreating]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Obter meses únicos disponíveis nas refeições cadastradas
  const mesesDisponiveis = Array.from(
    new Set(
      refeicoes.map((r) => {
        try {
          return r.data.slice(0, 7); // 'YYYY-MM'
        } catch {
          return '';
        }
      }).filter(Boolean)
    )
  ).sort().reverse();

  // Filtragem
  const filteredRefeicoes = refeicoes.filter((r) => {
    const matchSearch =
      r.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.data.includes(searchTerm);

    const matchMonth =
      selectedMonth === 'todos' || r.data.startsWith(selectedMonth);

    return matchSearch && matchMonth;
  });

  // Abrir Modal de Edição
  const handleOpenEdit = (ref: RefeicaoRegistro) => {
    setFormData({
      id: ref.id,
      data: ref.data,
      turno: ref.turno,
      descricao: ref.descricao,
    });
    setEditingRefeicao(ref);
  };

  // Abrir Modal de Nova Refeição Manual
  const handleOpenCreate = () => {
    setFormData({
      data: new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date()),
      turno: 'diurno',
      descricao: '',
    });
    setIsCreating(true);
  };

  const handleCloseModal = () => {
    setEditingRefeicao(null);
    setIsCreating(false);
  };

  // Salvar Edição
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return;
    if (!formData.descricao.trim()) {
      alert('A descrição da refeição não pode estar em branco.');
      return;
    }

    startTransition(async () => {
      const res = await updateRefeicaoAction(formData.id!, {
        data: formData.data,
        turno: formData.turno,
        descricao: formData.descricao,
      });

      if (res.success) {
        setRefeicoes((prev) =>
          prev.map((r) =>
            r.id === formData.id
              ? { ...r, data: formData.data, turno: formData.turno, descricao: formData.descricao }
              : r
          )
        );
        showFeedback('success', 'Refeição atualizada com sucesso!');
        handleCloseModal();
        router.refresh();
      } else {
        showFeedback('error', res.error || 'Erro ao atualizar refeição.');
      }
    });
  };

  // Salvar Nova Refeição
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao.trim()) {
      alert('A descrição da refeição não pode estar em branco.');
      return;
    }

    startTransition(async () => {
      const res = await createRefeicaoAction({
        data: formData.data,
        turno: formData.turno,
        descricao: formData.descricao,
      });

      if (res.success) {
        showFeedback('success', 'Nova refeição cadastrada no cardápio!');
        handleCloseModal();
        router.refresh();
      } else {
        showFeedback('error', res.error || 'Erro ao cadastrar refeição.');
      }
    });
  };

  // Excluir
  const handleDelete = (id?: string) => {
    if (!id) return;
    if (!confirm('Deseja realmente remover esta refeição do cardápio?')) return;

    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteRefeicaoAction(id);
      if (res.success) {
        setRefeicoes((prev) => prev.filter((r) => r.id !== id));
        showFeedback('success', 'Refeição removida com sucesso!');
        router.refresh();
      } else {
        showFeedback('error', res.error || 'Erro ao remover refeição.');
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

  const formatarMesRotulo = (mesStr: string) => {
    try {
      const [ano, mes] = mesStr.split('-');
      const dataObj = new Date(parseInt(ano), parseInt(mes) - 1, 1);
      return dataObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    } catch {
      return mesStr;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left relative">
      {/* Toast Alert Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-5 right-5 z-[10000] p-4 rounded-2xl shadow-xl border flex items-center gap-3 max-w-sm animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Header & Controles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#00185f] font-display flex items-center gap-2">
            <Utensils className="h-5 w-5 text-slate-700" />
            <span>Refeições Cadastradas no Banco de Dados</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Visualize, filtre pelo mês completo e edite os cardápios cadastrados manualmente ou pela IA.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-[#00185f] hover:bg-[#001144] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Refeição</span>
          </button>

          <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
            {filteredRefeicoes.length} {filteredRefeicoes.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>
      </div>

      {/* Filtros: Busca e Mês */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar prato, guarnição ou data (YYYY-MM-DD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
          />
        </div>

        {/* Month Selector */}
        <div className="relative w-full flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all cursor-pointer capitalize"
          >
            <option value="todos">Todos os meses cadastrados</option>
            {mesesDisponiveis.map((m) => (
              <option key={m} value={m}>
                Mês: {formatarMesRotulo(m)} ({m})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Refeições */}
      {filteredRefeicoes.length > 0 ? (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-36">Data</th>
                <th className="py-3.5 px-4 w-28">Turno</th>
                <th className="py-3.5 px-4">Descrição da Refeição</th>
                <th className="py-3.5 px-4 text-right w-28">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRefeicoes.map((ref) => {
                const isDeleting = deletingId === ref.id;
                return (
                  <tr key={ref.id || `${ref.data}-${ref.turno}`} className="hover:bg-slate-50/80 transition-colors">
                    {/* Data */}
                    <td className="py-3 px-4 font-bold text-slate-900 capitalize align-top">
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{formatarData(ref.data)}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block pl-5">
                        {ref.data}
                      </span>
                    </td>

                    {/* Turno */}
                    <td className="py-3 px-4 align-top">
                      {ref.turno === 'diurno' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-800 border border-amber-200 mt-0.5">
                          <Sun className="h-3 w-3 text-amber-600" />
                          <span>Diurno</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-indigo-50 text-indigo-800 border border-indigo-200 mt-0.5">
                          <Moon className="h-3 w-3 text-indigo-600" />
                          <span>Noturno</span>
                        </span>
                      )}
                    </td>

                    {/* Descrição com quebra de linha natural */}
                    <td className="py-3 px-4 text-slate-700 font-medium leading-relaxed align-top">
                      {ref.descricao}
                    </td>

                    {/* Ações: Editar e Excluir */}
                    <td className="py-3 px-4 text-right align-top">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ref)}
                          className="p-1.5 text-slate-600 hover:text-[#00185f] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar prato e cardápio do dia"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {ref.id && (
                          <button
                            type="button"
                            onClick={() => handleDelete(ref.id)}
                            disabled={isDeleting || isPending}
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                            title="Remover refeição"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
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
          <h4 className="text-sm font-bold text-slate-700">Nenhuma refeição encontrada</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || selectedMonth !== 'todos'
              ? 'Tente ajustar os termos de pesquisa ou o filtro de mês para localizar os registros.'
              : 'Utilize o formulário acima para enviar o PDF oficial da SED/SC ou cadastre manualmente através do botão "+ Nova Refeição".'}
          </p>
        </div>
      )}

      {/* Modal de Edição ou Criação */}
      {(editingRefeicao || isCreating) && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col text-left relative z-[10000] my-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#00185f]/10 text-[#00185f] rounded-xl">
                  {isCreating ? <Plus className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#00185f]">
                    {isCreating ? 'Cadastrar Nova Refeição' : 'Editar Refeição do Cardápio'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {isCreating
                      ? 'Preencha os campos para adicionar um cardápio manualmente.'
                      : 'Altere a descrição, turno ou data conforme necessário.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={isCreating ? handleSaveCreate : handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Data */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Data da Refeição
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
                  />
                </div>

                {/* Turno */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Turno Escolar
                  </label>
                  <select
                    value={formData.turno}
                    onChange={(e) => setFormData({ ...formData, turno: e.target.value as 'diurno' | 'noturno' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all cursor-pointer"
                  >
                    <option value="diurno">Diurno (Matutino / Vespertino)</option>
                    <option value="noturno">Noturno (Jantar EJA / Ensino Médio)</option>
                  </select>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Descrição Completa da Refeição
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Prato Principal: Arroz integral, feijão carioca e filé de frango ao molho. Guarnições: Salada de alface e beterraba ralada. Sobremesa: Maçã gala."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all leading-relaxed resize-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  * Este texto é exatamente o que será exibido aos alunos e responsáveis no site público.
                </span>
              </div>

              {/* Ações do Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isPending}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-[#00185f] hover:bg-[#001144] disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isCreating ? 'Cadastrar Refeição' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
