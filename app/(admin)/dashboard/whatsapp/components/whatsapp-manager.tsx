'use client';

import { useState, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Plus, Search, Edit2, Trash2, X, ExternalLink, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WhatsAppGrupo, saveTurma, deleteTurma } from '../actions';

interface ManagerProps {
  initialGroups: WhatsAppGrupo[];
}

const formInitialState = {
  error: null as string | null,
  success: false as boolean,
};

export default function WhatsappManager({ initialGroups }: ManagerProps) {
  const [groups, setGroups] = useState<WhatsAppGrupo[]>(initialGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<WhatsAppGrupo | null>(null);
  const [, startTransition] = useTransition();

  // Toast notifications state
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formState, formAction] = useFormState(async (state: unknown, formData: FormData) => {
    const res = await saveTurma(state, formData);
    if (res.success) {
      // Refresh state locally
      setIsModalOpen(false);
      setEditingGroup(null);
      showFeedback('success', 'Grupo de WhatsApp salvo com sucesso!');
      
      // Update local array or let Next.js refresh it. Since actions call revalidate,
      // it is best to just reload or update the state.
      // We can reload the page or update state from a fresh query.
      // For instant response, we reload the window or reload the state:
      window.location.reload();
      return { error: null, success: true };
    } else {
      return { error: res.error || 'Ocorreu um erro.', success: false };
    }
  }, formInitialState);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (group: WhatsAppGrupo) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta turma e link de WhatsApp? Esta ação não pode ser desfeita.')) {
      startTransition(async () => {
        const res = await deleteTurma(id);
        if (res.success) {
          setGroups(groups.filter(g => g.id !== id));
          showFeedback('success', 'Turma excluída com sucesso!');
          window.location.reload();
        } else {
          showFeedback('error', res.error || 'Erro ao excluir turma.');
        }
      });
    }
  };

  // Filter groups based on search
  const filteredGroups = groups.filter(g => 
    g.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.turno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {feedback && (
        <div className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 max-w-sm animate-fadeIn ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span className="text-sm font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar por turma, série ou turno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all shadow-sm"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleOpenAddModal}
          className="bg-[#00185f] hover:bg-[#001144] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 outline-none"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Turma</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Série / Nível</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome da Turma</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Turno</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Link do WhatsApp</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Serie */}
                    <td className="px-6 py-4 font-semibold text-slate-900">{group.serie}</td>
                    
                    {/* Turma */}
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        {group.turma}
                      </span>
                    </td>

                    {/* Turno */}
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        group.turno === 'Matutino' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : group.turno === 'Vespertino'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        {group.turno}
                      </span>
                    </td>

                    {/* Link */}
                    <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-500">
                      <a 
                        href={group.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#00185f] hover:underline flex items-center gap-1.5 inline-flex"
                      >
                        <span className="truncate max-w-[200px]">{group.link}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(group)}
                          title="Editar turma"
                          className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-950 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(group.id)}
                          title="Excluir turma"
                          className="p-2 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    Nenhuma turma cadastrada ou encontrada na pesquisa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay & Card (Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden animate-scaleIn">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg text-[#00185f]">
                {editingGroup ? 'Editar Turma' : 'Cadastrar Nova Turma'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form action={formAction} className="p-6 space-y-4">
              {/* Hidden ID */}
              {editingGroup && <input type="hidden" name="id" value={editingGroup.id} />}

              {/* Error messages */}
              {formState?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{formState.error}</span>
                </div>
              )}

              {/* Serie Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Série / Ano Escolar</label>
                <input
                  name="serie"
                  type="text"
                  required
                  placeholder="Ex: 6º Ano, Anos Iniciais, Ensino Médio"
                  defaultValue={editingGroup?.serie || ''}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
                />
              </div>

              {/* Turma Text Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nome da Turma</label>
                <input
                  name="turma"
                  type="text"
                  required
                  placeholder="Ex: Turma 61 ou 2º ao 5º Ano"
                  defaultValue={editingGroup?.turma || ''}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
                />
              </div>

              {/* Turno Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Turno</label>
                <select
                  name="turno"
                  defaultValue={editingGroup?.turno || 'Matutino'}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
                >
                  <option value="Matutino">Matutino</option>
                  <option value="Vespertino">Vespertino</option>
                  <option value="Geral">Geral (Ambos os turnos)</option>
                </select>
              </div>

              {/* Link Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Link do WhatsApp</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <input
                    name="link"
                    type="url"
                    required
                    placeholder="https://chat.whatsapp.com/..."
                    defaultValue={editingGroup?.link || ''}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#00185f] hover:bg-[#001144] disabled:opacity-50 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors outline-none"
    >
      {pending ? 'Salvando...' : 'Salvar Turma'}
    </button>
  );
}
