'use client';

import { useState, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, CheckCircle2, Eye, Star, Megaphone, RotateCcw, Trash } from 'lucide-react';
import { EscolaAviso, saveAviso, toggleAvisoDestaque, toggleAvisoPublicado, moveToTrashAviso, restoreAviso, deleteAvisoPermanently } from '../actions';
import ImageCropper from '@/components/admin/image-cropper';

interface ManagerProps {
  initialNotices: EscolaAviso[];
}

const formInitialState = {
  error: null as string | null,
  success: false as boolean,
};

function formatISOForDateTimeLocal(isoString?: string) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISODate = new Date(date.getTime() - tzOffset).toISOString();
  return localISODate.slice(0, 16); // YYYY-MM-DDTHH:MM
}

export default function AvisosManager({ initialNotices }: ManagerProps) {
  const [notices, setNotices] = useState<EscolaAviso[]>(initialNotices);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ativos' | 'lixeira'>('ativos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<EscolaAviso | null>(null);
  const [, startTransition] = useTransition();

  // Form states
  const [previewTitulo, setPreviewTitulo] = useState('');
  const [previewResumo, setPreviewResumo] = useState('');
  const [imagens, setImagens] = useState<string[]>([]);
  const [previewDestaque, setPreviewDestaque] = useState(false);
  const [previewPublicado, setPreviewPublicado] = useState(true);
  const [dataPublicacao, setDataPublicacao] = useState('');
  const [dataExpiracao, setDataExpiracao] = useState('');
  const [statusValue, setStatusValue] = useState('ativo');

  // Toast feedback state
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Form Submission
  const [formState, formAction] = useFormState(async (state: unknown, formData: FormData) => {
    formData.append('imagens', JSON.stringify(imagens));
    formData.append('data_publicacao', dataPublicacao ? new Date(dataPublicacao).toISOString() : new Date().toISOString());
    formData.append('data_expiracao', dataExpiracao ? new Date(dataExpiracao).toISOString() : '');
    formData.append('status', statusValue);

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
    setImagens([]);
    setPreviewDestaque(false);
    setPreviewPublicado(true);
    setDataPublicacao(formatISOForDateTimeLocal(new Date().toISOString()));
    setDataExpiracao('');
    setStatusValue('ativo');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (notice: EscolaAviso) => {
    setEditingNotice(notice);
    setPreviewTitulo(notice.titulo);
    setPreviewResumo(notice.resumo);
    setImagens((notice.imagens as string[]) || (notice.imagem_url ? [notice.imagem_url] : []));
    setPreviewDestaque(notice.destaque_home);
    setPreviewPublicado(notice.publicado);
    setDataPublicacao(formatISOForDateTimeLocal(notice.data_publicacao || notice.created_at));
    setDataExpiracao(notice.data_expiracao ? formatISOForDateTimeLocal(notice.data_expiracao) : '');
    setStatusValue(notice.status || 'ativo');
    setIsFormOpen(true);
  };

  // Soft Delete (move to trash)
  const handleSoftDelete = (id: string) => {
    if (confirm('Tem certeza que deseja mover este aviso para a lixeira?')) {
      startTransition(async () => {
        const res = await moveToTrashAviso(id);
        if (res.success) {
          setNotices(notices.map(n => n.id === id ? { ...n, status: 'lixeira', publicado: false } : n));
          showFeedback('success', 'Aviso movido para a lixeira com sucesso!');
          window.location.reload();
        } else {
          showFeedback('error', res.error || 'Erro ao mover para a lixeira.');
        }
      });
    }
  };

  // Restore from trash
  const handleRestore = (id: string) => {
    startTransition(async () => {
      const res = await restoreAviso(id);
      if (res.success) {
        setNotices(notices.map(n => n.id === id ? { ...n, status: 'ativo', publicado: true } : n));
        showFeedback('success', 'Aviso restaurado com sucesso!');
        window.location.reload();
      } else {
        showFeedback('error', res.error || 'Erro ao restaurar aviso.');
      }
    });
  };

  // Hard Delete (permanently delete from DB and Storage)
  const handleHardDelete = (id: string) => {
    if (confirm('Deseja EXCLUIR DEFINITIVAMENTE este aviso e deletar todas as mídias associadas do storage? Esta ação é irreversível.')) {
      startTransition(async () => {
        const res = await deleteAvisoPermanently(id);
        if (res.success) {
          setNotices(notices.filter(n => n.id !== id));
          showFeedback('success', 'Aviso e mídias excluídos permanentemente!');
          window.location.reload();
        } else {
          showFeedback('error', res.error || 'Erro ao excluir definitivamente.');
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

  // Filters depending on active tab
  const tabFilteredNotices = notices.filter(n => {
    if (activeTab === 'lixeira') {
      return n.status === 'lixeira';
    }
    return n.status !== 'lixeira';
  });

  const filteredNotices = tabFilteredNotices.filter(n => 
    n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.resumo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {feedback && (
        <div className={`fixed bottom-5 right-5 z-[110] p-4 rounded-xl shadow-lg border flex items-center gap-3 max-w-sm animate-fadeIn ${
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

      {/* Tabs Menu */}
      {!isFormOpen && (
        <div className="flex items-center justify-between border-b border-slate-200 pb-px">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('ativos')}
              className={`pb-3 text-sm font-bold border-b-2 px-1 transition-all ${
                activeTab === 'ativos'
                  ? 'border-[#00185f] text-[#00185f]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Avisos Ativos & Arquivados
            </button>
            <button
              onClick={() => setActiveTab('lixeira')}
              className={`pb-3 text-sm font-bold border-b-2 px-1 transition-all flex items-center gap-1.5 ${
                activeTab === 'lixeira'
                  ? 'border-[#bc0100] text-[#bc0100]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Trash className="h-4 w-4" />
              <span>Lixeira</span>
              {notices.filter(n => n.status === 'lixeira').length > 0 && (
                <span className="bg-[#bc0100] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {notices.filter(n => n.status === 'lixeira').length}
                </span>
              )}
            </button>
          </div>
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
                placeholder={activeTab === 'lixeira' ? "Procurar na lixeira..." : "Pesquisar por título ou resumo..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all shadow-sm"
              />
            </div>

            {/* Add Button */}
            {activeTab === 'ativos' && (
              <button
                onClick={handleOpenAddForm}
                className="bg-[#00185f] hover:bg-[#001144] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 outline-none"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Aviso</span>
              </button>
            )}
          </div>

          {/* Table List Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aviso</th>
                    {activeTab === 'ativos' && (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Destaque na Home</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Publicado</th>
                      </>
                    )}
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Publicação</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => (
                      <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Notice Title & Summary */}
                        <td className="px-6 py-4 max-w-sm">
                          <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                            <span>{notice.titulo}</span>
                            {((notice.imagens as string[])?.length || (notice.imagem_url ? 1 : 0)) > 1 && (
                              <span className="bg-[#00185f]/10 text-[#00185f] text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                +{(notice.imagens as string[]).length} fotos
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 truncate mt-0.5">{notice.resumo}</div>
                        </td>

                        {activeTab === 'ativos' && (
                          <>
                            {/* Status */}
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                notice.status === 'arquivado'
                                  ? 'bg-slate-100 border-slate-350 text-slate-550'
                                  : 'bg-emerald-50 border-emerald-250 text-emerald-700'
                              }`}>
                                {notice.status === 'arquivado' ? 'Arquivado' : 'Ativo'}
                              </span>
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
                          </>
                        )}

                        {/* Publicado em */}
                        <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                          {new Date(notice.data_publicacao || notice.created_at).toLocaleDateString('pt-BR', {
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
                            {activeTab === 'ativos' ? (
                              <>
                                <button
                                  onClick={() => handleOpenEditForm(notice)}
                                  title="Editar aviso"
                                  className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-950 rounded-lg transition-colors"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleSoftDelete(notice.id)}
                                  title="Mover para Lixeira"
                                  className="p-2 hover:bg-red-50 text-slate-650 hover:text-[#bc0100] rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleRestore(notice.id)}
                                  title="Restaurar Aviso"
                                  className="px-2.5 py-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg border border-slate-200 hover:border-emerald-200 transition-colors flex items-center gap-1 text-xs font-bold"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  <span>Restaurar</span>
                                </button>
                                <button
                                  onClick={() => handleHardDelete(notice.id)}
                                  title="Excluir Definitivamente"
                                  className="p-2 hover:bg-red-50 text-[#bc0100] rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab === 'ativos' ? 6 : 4} className="px-6 py-12 text-center text-slate-400 font-medium">
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
                className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-655 transition-colors"
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all font-semibold"
                />
              </div>

              {/* Summary textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Resumo Curto (Card)</label>
                <textarea
                  name="resumo"
                  required
                  rows={2}
                  maxLength={180}
                  placeholder="Resumo de até 180 caracteres para a chamada na Home..."
                  value={previewResumo}
                  onChange={(e) => setPreviewResumo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all resize-none"
                />
              </div>

              {/* Content textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Conteúdo Completo (Informativo)</label>
                <textarea
                  name="conteudo"
                  rows={5}
                  placeholder="Detalhes completos do comunicado oficial..."
                  defaultValue={editingNotice?.conteudo || ''}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
                />
              </div>

              {/* Upload Galeria de Imagens JSONB */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Galeria de Imagens (Até 5 fotos vertical 3:4)</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  {/* Grid de miniaturas */}
                  <div className="flex flex-wrap gap-3">
                    {imagens.map((url, index) => (
                      <div key={index} className="relative group w-20 h-24 border border-slate-300 rounded-lg overflow-hidden bg-slate-200 flex items-center justify-center shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Galeria ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImagens(imagens.filter((_, i) => i !== index))}
                          className="absolute -top-1 -right-1 bg-[#bc0100] text-white rounded-full p-1 shadow-md hover:bg-[#bc0100]/90 transition-colors"
                          title="Remover imagem"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {imagens.length < 5 && (
                      <div className="w-20 h-24 border border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-white hover:border-[#00185f] transition-all">
                        <ImageCropper
                          onUploadSuccess={(url) => {
                            setImagens([...imagens, url]);
                            showFeedback('success', 'Imagem adicionada à galeria!');
                          }}
                          aspectRatio={3 / 4}
                          bucketName="escola_midias"
                          folderName="banners"
                          label="+"
                        />
                      </div>
                    )}
                  </div>
                  <input
                    type="hidden"
                    name="imagens"
                    value={JSON.stringify(imagens)}
                  />
                  <p className="text-[10px] text-slate-400 font-semibold">O primeiro arquivo será exibido como a imagem principal no mural.</p>
                </div>
              </div>

              {/* Data de Publicação e Expiração */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase block">Data de Publicação</label>
                  <input
                    type="datetime-local"
                    value={dataPublicacao}
                    onChange={(e) => setDataPublicacao(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:border-[#00185f]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase block">Data de Expiração (Opcional)</label>
                  <input
                    type="datetime-local"
                    value={dataExpiracao}
                    onChange={(e) => setDataExpiracao(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:border-[#00185f]"
                  />
                </div>
              </div>

              {/* Status e Destaques */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Select de Status */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase block">Status do Aviso</label>
                  <select
                    value={statusValue}
                    onChange={(e) => setStatusValue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:border-[#00185f]"
                  >
                    <option value="ativo">Ativo (Público)</option>
                    <option value="arquivado">Arquivado</option>
                    <option value="lixeira">Lixeira</option>
                  </select>
                </div>

                {/* Destaque Home / Publicado */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase block">Configurações Rápidas</label>
                  <div className="flex gap-2 text-xs">
                    <label className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-lg cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="destaque_home"
                        value="true"
                        checked={previewDestaque}
                        onChange={(e) => setPreviewDestaque(e.target.checked)}
                        className="h-3.5 w-3.5 text-[#00185f] focus:ring-[#00185f] rounded"
                      />
                      <span className="font-semibold text-slate-600">Destaque</span>
                    </label>
                    <label className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-lg cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="publicado"
                        value="true"
                        checked={previewPublicado}
                        onChange={(e) => setPreviewPublicado(e.target.checked)}
                        className="h-3.5 w-3.5 text-[#00185f] focus:ring-[#00185f] rounded"
                      />
                      <span className="font-semibold text-slate-600">Publicado</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <SubmitButton />
              </div>
            </form>
          </div>

          {/* Right Panel: Side-by-Side Live Preview */}
          <div className="space-y-4 sticky top-20">
            <div className="flex items-center gap-2 text-[#00185f]">
              <Eye className="h-4.5 w-4.5" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pré-visualização em Tempo Real</span>
            </div>

            {/* Simulated Notice Card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-subtle flex flex-col h-[400px] justify-between relative group hover:border-[#00185f] transition-all">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {previewDestaque && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border border-amber-200 flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                    <span>Destaque</span>
                  </span>
                )}
                {statusValue === 'arquivado' && (
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border border-slate-200 shadow-sm">
                    Arquivado
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
                {imagens.length > 0 ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imagens[0]}
                    alt={previewTitulo || 'Imagem Principal'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center w-full h-full bg-slate-50">
                    <Megaphone className="h-10 w-10 text-[#00185f]/15" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sem Imagem</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    {dataPublicacao ? new Date(dataPublicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Data de hoje'}
                  </span>
                  <h3 className="font-display text-lg font-extrabold text-[#00185f] leading-snug truncate">
                    {previewTitulo || 'Título do aviso...'}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3">
                    {previewResumo || 'Insira o resumo curto para a pré-visualização do conteúdo.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00185f]">
                    Ler notícia completa
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
