'use client';

import { useState, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, CheckCircle2, Eye, Star, Megaphone } from 'lucide-react';
import { EscolaAviso, saveAviso, deleteAviso, toggleAvisoDestaque, toggleAvisoPublicado } from '../actions';

interface ManagerProps {
  initialNotices: EscolaAviso[];
}

const formInitialState = {
  error: null as string | null,
  success: false as boolean,
};

export default function AvisosManager({ initialNotices }: ManagerProps) {
  const [notices, setNotices] = useState<EscolaAviso[]>(initialNotices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<EscolaAviso | null>(null);
  const [, startTransition] = useTransition();

  // Real-time form preview state
  const [previewTitulo, setPreviewTitulo] = useState('');
  const [previewResumo, setPreviewResumo] = useState('');
  const [previewImagemUrl, setPreviewImagemUrl] = useState('');
  const [previewDestaque, setPreviewDestaque] = useState(false);
  const [previewPublicado, setPreviewPublicado] = useState(true);

  // Toast feedback state
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Form Submission
  const [formState, formAction] = useFormState(async (state: unknown, formData: FormData) => {
    const res = await saveAviso(state, formData);
    if (res.success) {
      setIsFormOpen(false);
      setEditingNotice(null);
      showFeedback('success', 'Aviso salvo com sucesso!');
      window.location.reload();
      return { error: null, success: true };
    } else {
      return { error: res.error || 'Ocorreu um erro.', success: false };
    }
  }, formInitialState);

  const handleOpenAddForm = () => {
    setEditingNotice(null);
    setPreviewTitulo('');
    setPreviewResumo('');
    setPreviewImagemUrl('');
    setPreviewDestaque(false);
    setPreviewPublicado(true);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (notice: EscolaAviso) => {
    setEditingNotice(notice);
    setPreviewTitulo(notice.titulo);
    setPreviewResumo(notice.resumo);
    setPreviewImagemUrl(notice.imagem_url || '');
    setPreviewDestaque(notice.destaque_home);
    setPreviewPublicado(notice.publicado);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir permanentemente este aviso?')) {
      startTransition(async () => {
        const res = await deleteAviso(id);
        if (res.success) {
          setNotices(notices.filter(n => n.id !== id));
          showFeedback('success', 'Aviso excluído com sucesso!');
          window.location.reload();
        } else {
          showFeedback('error', res.error || 'Erro ao excluir aviso.');
        }
      });
    }
  };

  const handleToggleDestaque = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleAvisoDestaque(id, !current);
      if (res.success) {
        setNotices(notices.map(n => n.id === id ? { ...n, destaque_home: !current } : n));
        showFeedback('success', `Destaque ${!current ? 'ativado' : 'desativado'} com sucesso!`);
        window.location.reload();
      } else {
        showFeedback('error', res.error || 'Erro ao alterar destaque.');
      }
    });
  };

  const handleTogglePublicado = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleAvisoPublicado(id, !current);
      if (res.success) {
        setNotices(notices.map(n => n.id === id ? { ...n, publicado: !current } : n));
        showFeedback('success', `Aviso ${!current ? 'publicado' : 'despublicado'} com sucesso!`);
        window.location.reload();
      } else {
        showFeedback('error', res.error || 'Erro ao alterar publicação.');
      }
    });
  };

  const filteredNotices = notices.filter(n => 
    n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.resumo.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Conditional Rendering: List vs Form */}
      {!isFormOpen ? (
        <>
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar por título ou resumo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all shadow-sm"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={handleOpenAddForm}
              className="bg-[#00185f] hover:bg-[#001144] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 outline-none"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Aviso</span>
            </button>
          </div>

          {/* Table List Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aviso</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Destaque na Home</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Publicado</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Criação</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => (
                      <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Notice Title & Summary */}
                        <td className="px-6 py-4 max-w-sm">
                          <div className="font-bold text-slate-900 truncate">{notice.titulo}</div>
                          <div className="text-xs text-slate-500 truncate mt-0.5">{notice.resumo}</div>
                        </td>

                        {/* Featured Quick Toggle */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleDestaque(notice.id, notice.destaque_home)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              notice.destaque_home
                                ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                            }`}
                            title={notice.destaque_home ? 'Remover destaque da Home' : 'Destacar na Home'}
                          >
                            <Star className={`h-4.5 w-4.5 ${notice.destaque_home ? 'fill-amber-500' : ''}`} />
                          </button>
                        </td>

                        {/* Published Quick Toggle */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleTogglePublicado(notice.id, notice.publicado)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                              notice.publicado
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                            }`}
                          >
                            {notice.publicado ? 'Publicado' : 'Rascunho'}
                          </button>
                        </td>

                        {/* Created At */}
                        <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                          {new Date(notice.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditForm(notice)}
                              title="Editar aviso"
                              className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-950 rounded-lg transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(notice.id)}
                              title="Excluir aviso"
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
                        Nenhum aviso registrado ou encontrado na pesquisa.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Edit/Create Form with live side-by-side preview */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel: Inputs Form */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-subtle p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-display font-extrabold text-lg text-[#00185f]">
                {editingNotice ? 'Editar Aviso' : 'Criar Novo Aviso'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              {editingNotice && <input type="hidden" name="id" value={editingNotice.id} />}

              {formState?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{formState.error}</span>
                </div>
              )}

              {/* Title input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Título do Aviso</label>
                <input
                  name="titulo"
                  type="text"
                  required
                  placeholder="Ex: Entrega de Boletins ou Mudança no Cronograma"
                  value={previewTitulo}
                  onChange={(e) => setPreviewTitulo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
                />
              </div>

              {/* Summary textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Resumo Curto (Aparece no Card)</label>
                <textarea
                  name="resumo"
                  required
                  rows={2}
                  maxLength={180}
                  placeholder="Escreva um breve resumo de até 180 caracteres para chamar atenção na listagem..."
                  value={previewResumo}
                  onChange={(e) => setPreviewResumo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all resize-none"
                />
              </div>

              {/* Content textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Conteúdo Completo (Opcional)</label>
                <textarea
                  name="conteudo"
                  rows={5}
                  placeholder="Detalhes completos do aviso..."
                  defaultValue={editingNotice?.conteudo || ''}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
                />
              </div>

              {/* Image URL input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">URL da Imagem de Destaque (Opcional)</label>
                <input
                  name="imagem_url"
                  type="url"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={previewImagemUrl}
                  onChange={(e) => setPreviewImagemUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Destaque Home */}
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <input
                    type="checkbox"
                    id="destaque_home"
                    name="destaque_home"
                    value="true"
                    checked={previewDestaque}
                    onChange={(e) => setPreviewDestaque(e.target.checked)}
                    className="h-4 w-4 text-[#00185f] focus:ring-[#00185f] border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="destaque_home" className="text-xs font-bold text-slate-700 cursor-pointer block select-none">
                    Destaque na Home
                  </label>
                </div>

                {/* Publicado */}
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <input
                    type="checkbox"
                    id="publicado"
                    name="publicado"
                    value="true"
                    checked={previewPublicado}
                    onChange={(e) => setPreviewPublicado(e.target.checked)}
                    className="h-4 w-4 text-[#00185f] focus:ring-[#00185f] border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="publicado" className="text-xs font-bold text-slate-700 cursor-pointer block select-none">
                    Publicar Ativo
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors animate-all"
                >
                  Cancelar
                </button>
                <SubmitButton />
              </div>
            </form>
          </div>

          {/* Right Panel: Side-by-Side Live Preview */}
          <div className="space-y-4 sticky top-20">
            <div className="flex items-center gap-2 text-slate-400">
              <Eye className="h-4.5 w-4.5 text-[#00185f]" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visualização em Tempo Real</span>
            </div>

            {/* Simulated Notice Card exact style as public page */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-subtle flex flex-col h-[400px] justify-between relative group hover:border-[#00185f] transition-all">
              
              {/* Optional Badges in preview */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {previewDestaque && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border border-amber-200 flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                    <span>Destaque</span>
                  </span>
                )}
                {!previewPublicado && (
                  <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border border-red-200 shadow-sm">
                    Rascunho
                  </span>
                )}
              </div>

              {/* Card Image Area */}
              <div className="h-44 bg-slate-100 relative shrink-0 overflow-hidden flex items-center justify-center">
                {previewImagemUrl && previewImagemUrl.startsWith('http') ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewImagemUrl}
                    alt={previewTitulo || 'Imagem de Destaque'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
                    <Megaphone className="h-10 w-10 text-[#00185f]/15" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Comunicado Oficial</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                  <h3 className="font-display text-lg font-extrabold text-[#00185f] leading-snug truncate group-hover:text-secondary transition-colors">
                    {previewTitulo || 'Digite um título para o aviso...'}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3">
                    {previewResumo || 'Insira o resumo curto para a pré-visualização do conteúdo que os pais e alunos verão.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00185f] flex items-center gap-1 group-hover:text-secondary transition-colors">
                    <span>Ler notícia</span>
                    <Plus className="h-3 w-3" />
                  </span>
                </div>
              </div>

            </div>
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
      {pending ? 'Salvando...' : 'Salvar Aviso'}
    </button>
  );
}
