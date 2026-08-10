'use client';

import { useState, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, CheckCircle2, Megaphone, Check } from 'lucide-react';
import { EscolaNotificacao, saveNotificacao, deleteNotificacao, toggleNotificacaoAtiva } from '../actions';

interface ManagerProps {
  initialNotifications: EscolaNotificacao[];
}

const formInitialState = {
  error: null as string | null,
  success: false as boolean,
};

export default function NotificacoesManager({ initialNotifications }: ManagerProps) {
  const [notifications, setNotifications] = useState<EscolaNotificacao[]>(initialNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState<EscolaNotificacao | null>(null);
  
  // Custom importance selection state
  const [selectedImportance, setSelectedImportance] = useState<'Alta' | 'Média' | 'Baixa'>('Baixa');
  const [isNotifActive, setIsNotifActive] = useState<boolean>(true);

  const [, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const [formState, formAction] = useFormState(async (state: unknown, formData: FormData) => {
    formData.append('importancia', selectedImportance);
    formData.append('ativa', isNotifActive ? 'true' : 'false');
    
    const res = await saveNotificacao(state, formData);
    if (res.success) {
      setIsModalOpen(false);
      setEditingNotif(null);
      showFeedback('success', 'Notificação salva com sucesso!');
      window.location.reload();
      return { error: null, success: true };
    } else {
      return { error: res.error || 'Erro ao salvar notificação.', success: false };
    }
  }, formInitialState);

  const handleOpenAdd = () => {
    setEditingNotif(null);
    setSelectedImportance('Baixa');
    setIsNotifActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (notif: EscolaNotificacao) => {
    setEditingNotif(notif);
    setSelectedImportance(notif.importancia);
    setIsNotifActive(notif.ativa);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const res = await toggleNotificacaoAtiva(id, !currentStatus);
      if (res.success) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, ativa: !currentStatus } : n));
        showFeedback('success', 'Status da notificação alterado!');
      } else {
        showFeedback('error', res.error || 'Erro ao alterar status.');
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta notificação?')) {
      startTransition(async () => {
        const res = await deleteNotificacao(id);
        if (res.success) {
          setNotifications(notifications.filter(n => n.id !== id));
          showFeedback('success', 'Notificação excluída com sucesso!');
          window.location.reload();
        } else {
          showFeedback('error', res.error || 'Erro ao excluir.');
        }
      });
    }
  };

  const filteredNotifs = notifications.filter(n => 
    n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.mensagem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const importanceColorMap = {
    Alta: {
      bg: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
      label: 'Alta Importância',
    },
    Média: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Média Importância',
    },
    Baixa: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      label: 'Baixa Importância',
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
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
            placeholder="Pesquisar por título ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all shadow-sm"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleOpenAdd}
          className="bg-[#00185f] hover:bg-[#001144] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 outline-none"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Notificação</span>
        </button>
      </div>

      {/* Grid Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Notificação</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Importância</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredNotifs.length > 0 ? (
                filteredNotifs.map((notif) => {
                  const style = importanceColorMap[notif.importancia];
                  return (
                    <tr key={notif.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Title & Msg */}
                      <td className="px-6 py-4 font-semibold text-slate-900 max-w-md">
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg shrink-0 h-fit ${
                            notif.importancia === 'Alta' ? 'bg-red-50 text-red-650' :
                            notif.importancia === 'Média' ? 'bg-amber-50 text-amber-650' : 'bg-blue-50 text-blue-650'
                          }`}>
                            <Megaphone className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-805 leading-snug">{notif.titulo}</span>
                            <span className="block text-xs text-slate-500 font-medium mt-1 whitespace-pre-wrap leading-relaxed">
                              {notif.mensagem}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Importance Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${style.bg}`}>
                          <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                          {notif.importancia}
                        </span>
                      </td>

                      {/* Active Status */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(notif.id, notif.ativa)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all border outline-none ${
                            notif.ativa 
                              ? 'bg-emerald-50 border-emerald-250 text-emerald-700 font-extrabold' 
                              : 'bg-slate-50 border-slate-200 text-slate-450'
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${notif.ativa ? 'bg-emerald-500' : 'bg-slate-350'}`} />
                          <span>{notif.ativa ? 'Ativa' : 'Inativa'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(notif)}
                            title="Editar"
                            className="p-2 hover:bg-slate-100 text-slate-650 hover:text-slate-950 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(notif.id)}
                            title="Excluir"
                            className="p-2 hover:bg-red-50 text-slate-650 hover:text-red-650 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                    Nenhuma notificação cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL Add/Edit Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden animate-scaleIn">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg text-[#00185f]">
                {editingNotif ? 'Editar Notificação' : 'Criar Notificação'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form action={formAction} className="p-6 space-y-4">
              {editingNotif && <input type="hidden" name="id" value={editingNotif.id} />}

              {formState?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{formState.error}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase block">Título do Alerta</label>
                <input
                  name="titulo"
                  type="text"
                  required
                  placeholder="Ex: Suspensão de Aulas devido a Chuvas"
                  defaultValue={editingNotif?.titulo || ''}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-805 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase block">Mensagem do Comunicado</label>
                <textarea
                  name="mensagem"
                  required
                  rows={4}
                  placeholder="Escreva a mensagem que aparecerá na barra superior do site..."
                  defaultValue={editingNotif?.mensagem || ''}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-805 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none resize-none"
                />
              </div>

              {/* Importance Visual Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase block">Grau de Importância</label>
                
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* Alta (Vermelho) */}
                  <button
                    type="button"
                    onClick={() => setSelectedImportance('Alta')}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-1 transition-all outline-none ${
                      selectedImportance === 'Alta'
                        ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full bg-red-500 shadow-sm" />
                    <span className="text-xs font-bold text-red-700 mt-1">Alta (Vermelho)</span>
                    {selectedImportance === 'Alta' && <Check className="h-3.5 w-3.5 text-red-600 mt-0.5" />}
                  </button>

                  {/* Média (Amarelo) */}
                  <button
                    type="button"
                    onClick={() => setSelectedImportance('Média')}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-1 transition-all outline-none ${
                      selectedImportance === 'Média'
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full bg-amber-500 shadow-sm" />
                    <span className="text-xs font-bold text-amber-700 mt-1">Média (Amarelo)</span>
                    {selectedImportance === 'Média' && <Check className="h-3.5 w-3.5 text-amber-600 mt-0.5" />}
                  </button>

                  {/* Baixa (Azul) */}
                  <button
                    type="button"
                    onClick={() => setSelectedImportance('Baixa')}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-1 transition-all outline-none ${
                      selectedImportance === 'Baixa'
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full bg-blue-500 shadow-sm" />
                    <span className="text-xs font-bold text-blue-700 mt-1">Baixa (Azul)</span>
                    {selectedImportance === 'Baixa' && <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5" />}
                  </button>

                </div>
              </div>

              {/* Status Switcher (Active) */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Exibir no site imediatamente?</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Habilita ou oculta este alerta de forma instantânea.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotifActive(!isNotifActive)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-all duration-200 outline-none ${
                    isNotifActive ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`h-4.5 w-4.5 rounded-full bg-white transition-all shadow-sm ${
                    isNotifActive ? 'translate-x-[22px]' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <SubmitButton label="Salvar Notificação" />
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function SubmitButton({ label = 'Salvar' }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#00185f] hover:bg-[#001144] disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors outline-none"
    >
      {pending ? 'Processando...' : label}
    </button>
  );
}
