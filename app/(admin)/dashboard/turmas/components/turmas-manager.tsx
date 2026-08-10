'use client';

import { useState, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, CheckCircle2, MessageSquare, Megaphone, Link as LinkIcon, RotateCcw, Trash } from 'lucide-react';
import { EscolaTurma, EscolaTurmaPost, saveTurma, deleteTurma, getPostsAdmin, savePost, moveToTrashPost, restorePost, deletePostPermanently } from '../actions';
import ImageCropper from '@/components/admin/image-cropper';

interface ManagerProps {
  initialTurmas: EscolaTurma[];
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

export default function TurmasManager({ initialTurmas }: ManagerProps) {
  const [turmas, setTurmas] = useState<EscolaTurma[]>(initialTurmas);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<EscolaTurma | null>(null);
  
  // Custom links state for the active form
  const [outrosLinks, setOutrosLinks] = useState<{ titulo: string; url: string }[]>([]);

  // Posts Feed state for a selected class
  const [selectedTurmaForPosts, setSelectedTurmaForPosts] = useState<EscolaTurma | null>(null);
  const [posts, setPosts] = useState<EscolaTurmaPost[]>([]);
  const [postActiveTab, setPostActiveTab] = useState<'ativos' | 'lixeira'>('ativos');

  // New post states
  const [newPostTitulo, setNewPostTitulo] = useState('');
  const [newPostConteudo, setNewPostConteudo] = useState('');
  const [postLinkReferencia, setPostLinkReferencia] = useState('');
  const [postImagens, setPostImagens] = useState<string[]>([]);
  const [postDataPublicacao, setPostDataPublicacao] = useState('');
  const [postDataExpiracao, setPostDataExpiracao] = useState('');
  const [postStatus, setPostStatus] = useState('ativo');

  const [, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Form State for Turma Save
  const [turmaFormState, turmaFormAction] = useFormState(async (state: unknown, formData: FormData) => {
    formData.append('outros_links', JSON.stringify(outrosLinks));
    const res = await saveTurma(state, formData);
    if (res.success) {
      setIsTurmaModalOpen(false);
      setEditingTurma(null);
      showFeedback('success', 'Turma salva com sucesso!');
      window.location.reload();
      return { error: null, success: true };
    } else {
      return { error: res.error || 'Erro ao salvar turma.', success: false };
    }
  }, formInitialState);

  // Form State for Post Save
  const [postFormState, postFormAction] = useFormState(async (state: unknown, formData: FormData) => {
    if (!selectedTurmaForPosts) return { error: 'Turma não selecionada.', success: false };
    formData.append('turma_id', selectedTurmaForPosts.id);
    formData.append('imagens', JSON.stringify(postImagens));
    formData.append('link_referencia', postLinkReferencia);
    formData.append('data_publicacao', postDataPublicacao ? new Date(postDataPublicacao).toISOString() : new Date().toISOString());
    formData.append('data_expiracao', postDataExpiracao ? new Date(postDataExpiracao).toISOString() : '');
    formData.append('status', postStatus);

    const res = await savePost(state, formData);
    if (res.success) {
      setNewPostTitulo('');
      setNewPostConteudo('');
      setPostLinkReferencia('');
      setPostImagens([]);
      setPostDataPublicacao(formatISOForDateTimeLocal(new Date().toISOString()));
      setPostDataExpiracao('');
      setPostStatus('ativo');
      showFeedback('success', 'Recado publicado com sucesso!');
      
      // Refresh posts list
      const freshPosts = await getPostsAdmin(selectedTurmaForPosts.id);
      setPosts(freshPosts);
      return { error: null, success: true };
    } else {
      return { error: res.error || 'Erro ao publicar recado.', success: false };
    }
  }, formInitialState);

  const handleOpenAddTurma = () => {
    setEditingTurma(null);
    setOutrosLinks([]);
    setIsTurmaModalOpen(true);
  };

  const handleOpenEditTurma = (turma: EscolaTurma) => {
    setEditingTurma(turma);
    setOutrosLinks(turma.outros_links || []);
    setIsTurmaModalOpen(true);
  };

  const handleRemoveLink = (index: number) => {
    setOutrosLinks(outrosLinks.filter((_, i) => i !== index));
  };

  const handleDeleteTurma = (id: string) => {
    if (confirm('Deseja excluir esta turma? Todos os recados atrelados a ela serão deletados permanentemente.')) {
      startTransition(async () => {
        const res = await deleteTurma(id);
        if (res.success) {
          setTurmas(turmas.filter(t => t.id !== id));
          showFeedback('success', 'Turma excluída com sucesso!');
          window.location.reload();
        } else {
          showFeedback('error', res.error || 'Erro ao excluir.');
        }
      });
    }
  };

  // Open posts modal and fetch posts
  const handleOpenPosts = (turma: EscolaTurma) => {
    setSelectedTurmaForPosts(turma);
    setPosts([]);
    setPostActiveTab('ativos');
    setPostImagens([]);
    setPostLinkReferencia('');
    setNewPostTitulo('');
    setNewPostConteudo('');
    setPostDataPublicacao(formatISOForDateTimeLocal(new Date().toISOString()));
    setPostDataExpiracao('');
    setPostStatus('ativo');
    
    startTransition(async () => {
      try {
        const data = await getPostsAdmin(turma.id);
        setPosts(data);
      } catch {
        showFeedback('error', 'Erro ao carregar recados.');
      }
    });
  };

  // Soft delete post
  const handleSoftDeletePost = (postId: string) => {
    if (!selectedTurmaForPosts) return;
    if (confirm('Tem certeza que deseja mover este recado para a lixeira?')) {
      startTransition(async () => {
        const res = await moveToTrashPost(postId, selectedTurmaForPosts.id);
        if (res.success) {
          showFeedback('success', 'Recado movido para a lixeira!');
          const freshPosts = await getPostsAdmin(selectedTurmaForPosts.id);
          setPosts(freshPosts);
        } else {
          showFeedback('error', res.error || 'Erro ao mover para a lixeira.');
        }
      });
    }
  };

  // Restore post
  const handleRestorePost = (postId: string) => {
    if (!selectedTurmaForPosts) return;
    startTransition(async () => {
      const res = await restorePost(postId, selectedTurmaForPosts.id);
      if (res.success) {
        showFeedback('success', 'Recado restaurado com sucesso!');
        const freshPosts = await getPostsAdmin(selectedTurmaForPosts.id);
        setPosts(freshPosts);
      } else {
        showFeedback('error', res.error || 'Erro ao restaurar.');
      }
    });
  };

  // Hard delete post
  const handleHardDeletePost = (postId: string) => {
    if (!selectedTurmaForPosts) return;
    if (confirm('Deseja excluir definitivamente este recado e apagar todas as fotos associadas do storage? Esta ação é irreversível.')) {
      startTransition(async () => {
        const res = await deletePostPermanently(postId, selectedTurmaForPosts.id);
        if (res.success) {
          showFeedback('success', 'Recado e mídias excluídos permanentemente!');
          const freshPosts = await getPostsAdmin(selectedTurmaForPosts.id);
          setPosts(freshPosts);
        } else {
          showFeedback('error', res.error || 'Erro ao excluir definitivamente.');
        }
      });
    }
  };

  const filteredTurmas = turmas.filter(t => 
    t.ano.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.turno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter posts based on active post tab
  const filteredPosts = posts.filter(p => {
    if (postActiveTab === 'lixeira') {
      return p.status === 'lixeira';
    }
    return p.status !== 'lixeira';
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {feedback && (
        <div className={`fixed bottom-5 right-5 z-[120] p-4 rounded-xl shadow-lg border flex items-center gap-3 max-w-sm animate-fadeIn ${
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
            placeholder="Pesquisar por ano escolar, turma ou turno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all shadow-sm"
          />
        </div>

        {/* Add Class Button */}
        <button
          onClick={handleOpenAddTurma}
          className="bg-[#00185f] hover:bg-[#001144] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 outline-none"
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar Turma</span>
        </button>
      </div>

      {/* Table grid card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ano / Série</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Identificador (Nome)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Turno</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Recursos Extras</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredTurmas.length > 0 ? (
                filteredTurmas.map((turma) => (
                  <tr key={turma.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Ano */}
                    <td className="px-6 py-4 font-semibold text-slate-900">{turma.ano}</td>
                    
                    {/* Nome */}
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        {turma.nome}
                      </span>
                    </td>

                    {/* Turno */}
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        turma.turno === 'Matutino' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : turma.turno === 'Vespertino'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : turma.turno === 'Noturno'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        {turma.turno}
                      </span>
                    </td>

                    {/* Extras summary */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500 space-y-1">
                      {turma.whatsapp_link && (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Grupo WhatsApp</span>
                        </div>
                      )}
                      {turma.outros_links && turma.outros_links.length > 0 && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <LinkIcon className="h-3.5 w-3.5" />
                          <span>{turma.outros_links.length} Link(s) Adicional(is)</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Mural button */}
                        <button
                          onClick={() => handleOpenPosts(turma)}
                          title="Recados da Turma"
                          className="px-3 py-1.5 bg-[#00185f]/5 text-[#00185f] hover:bg-[#00185f]/10 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Megaphone className="h-3.5 w-3.5" />
                          <span>Recados</span>
                        </button>
                        
                        <button
                          onClick={() => handleOpenEditTurma(turma)}
                          title="Editar turma"
                          className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-950 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTurma(turma.id)}
                          title="Excluir turma"
                          className="p-2 hover:bg-red-50 text-slate-600 hover:text-red-650 rounded-lg transition-colors"
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
                    Nenhuma turma encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Turma Add/Edit Form */}
      {isTurmaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleIn">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-display font-extrabold text-lg text-[#00185f]">
                {editingTurma ? 'Editar Turma' : 'Cadastrar Nova Turma'}
              </h3>
              <button 
                onClick={() => setIsTurmaModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form action={turmaFormAction} className="overflow-y-auto p-6 space-y-4 flex-grow">
              {editingTurma && <input type="hidden" name="id" value={editingTurma.id} />}

              {turmaFormState?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{turmaFormState.error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Ano */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Ano Escolar / Série</label>
                  <input
                    name="ano"
                    type="text"
                    required
                    placeholder="Ex: 6º Ano, 3º Médio"
                    defaultValue={editingTurma?.ano || ''}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-805 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                  />
                </div>

                {/* Nome */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Identificador (Turma)</label>
                  <input
                    name="nome"
                    type="text"
                    required
                    placeholder="Ex: 61, 302"
                    defaultValue={editingTurma?.nome || ''}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-805 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                  />
                </div>
              </div>

              {/* Turno Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase block">Turno</label>
                <select
                  name="turno"
                  defaultValue={editingTurma?.turno || 'Matutino'}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                >
                  <option value="Matutino">Matutino</option>
                  <option value="Vespertino">Vespertino</option>
                  <option value="Noturno">Noturno</option>
                  <option value="Geral">Geral (Ambos)</option>
                </select>
              </div>

              {/* Link do WhatsApp */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase block">Link de Convite do WhatsApp (Opcional)</label>
                <input
                  name="whatsapp_link"
                  type="url"
                  placeholder="https://chat.whatsapp.com/..."
                  defaultValue={editingTurma?.whatsapp_link || ''}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-805 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                />
              </div>

              {/* Outros Links (JSONB manager - Field Array) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Links de Recursos Extras (Opcional)</label>
                  <button
                    type="button"
                    onClick={() => setOutrosLinks([...outrosLinks, { titulo: '', url: '' }])}
                    className="text-[#00185f] hover:text-[#001144] font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Adicionar Link</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {outrosLinks.length > 0 ? (
                    outrosLinks.map((link, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                        <input
                          type="text"
                          required
                          placeholder="Título (Ex: Roteiro)"
                          value={link.titulo}
                          onChange={(e) => {
                            const updated = [...outrosLinks];
                            updated[idx].titulo = e.target.value;
                            setOutrosLinks(updated);
                          }}
                          className="w-1/3 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="url"
                          required
                          placeholder="URL (https://...)"
                          value={link.url}
                          onChange={(e) => {
                            const updated = [...outrosLinks];
                            updated[idx].url = e.target.value;
                            setOutrosLinks(updated);
                          }}
                          className="flex-grow px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(idx)}
                          className="p-1 text-red-500 hover:text-red-700 rounded-lg transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 font-medium py-1">Nenhum recurso extra adicionado.</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTurmaModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <SubmitButton label="Salvar Turma" />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Recados / Turma Posts Feed Manager */}
      {selectedTurmaForPosts && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleIn">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#00185f]">
                  Mural de Recados: {selectedTurmaForPosts.ano} - Turma {selectedTurmaForPosts.nome}
                </h3>
                <span className="text-xs text-slate-500 font-medium">Publique comunicados específicos para esta classe.</span>
              </div>
              <button 
                onClick={() => setSelectedTurmaForPosts(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-655 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Side: Create Announcement */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 space-y-4 h-fit">
                <h4 className="font-bold text-[#00185f] text-sm border-b border-slate-200 pb-2">
                  Publicar Novo Recado
                </h4>
                
                <form action={postFormAction} className="space-y-3.5">
                  {postFormState?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold">
                      {postFormState.error}
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 uppercase block">Título do Recado</label>
                    <input
                      name="titulo"
                      type="text"
                      required
                      placeholder="Ex: Tarefa de História para 12/06"
                      value={newPostTitulo}
                      onChange={(e) => setNewPostTitulo(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#00185f] font-semibold"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-655 uppercase block">Conteúdo / Recado</label>
                    <textarea
                      name="conteudo"
                      required
                      rows={3}
                      placeholder="Escreva a mensagem completa..."
                      value={newPostConteudo}
                      onChange={(e) => setNewPostConteudo(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none resize-none focus:border-[#00185f]"
                    />
                  </div>

                  {/* Link */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-655 uppercase block">Link de Referência (Opcional)</label>
                    <input
                      name="link_referencia"
                      type="url"
                      placeholder="https://exemplo.com/material"
                      value={postLinkReferencia}
                      onChange={(e) => setPostLinkReferencia(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#00185f]"
                    />
                  </div>

                  {/* Date fields */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-650 uppercase block">Publicação</label>
                      <input
                        type="datetime-local"
                        value={postDataPublicacao}
                        onChange={(e) => setPostDataPublicacao(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-650 uppercase block">Expiração</label>
                      <input
                        type="datetime-local"
                        value={postDataExpiracao}
                        onChange={(e) => setPostDataExpiracao(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Status select */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-650 uppercase block">Status</label>
                    <select
                      value={postStatus}
                      onChange={(e) => setPostStatus(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="arquivado">Arquivado</option>
                      <option value="lixeira">Lixeira</option>
                    </select>
                  </div>

                  {/* Multiple image gallery uploads */}
                  <div className="space-y-2 pt-1">
                    <label className="text-[10px] font-bold text-slate-655 uppercase block">Imagens do Recado (Até 5, 16:9)</label>
                    <div className="bg-white border border-slate-200 p-3 rounded-lg space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {postImagens.map((url, idx) => (
                          <div key={idx} className="relative w-16 h-10 border border-slate-300 rounded overflow-hidden shadow-sm flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Post ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setPostImagens(postImagens.filter((_, i) => i !== idx))}
                              className="absolute top-0 right-0 bg-[#bc0100] text-white rounded-full p-0.5"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                        {postImagens.length < 5 && (
                          <div className="w-16 h-10 border border-dashed border-slate-350 rounded flex items-center justify-center bg-slate-50 hover:bg-white hover:border-[#00185f] transition-all">
                            <ImageCropper
                              onUploadSuccess={(url) => {
                                setPostImagens([...postImagens, url]);
                                showFeedback('success', 'Imagem inserida no recado!');
                              }}
                              aspectRatio={16 / 9}
                              bucketName="escola_midias"
                              folderName="posts"
                              label="+"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <SubmitButton label="Publicar Recado" />
                </form>
              </div>

              {/* Right Side: Timeline/Feed with Tab filter */}
              <div className="space-y-4 flex flex-col h-[520px]">
                {/* Switch Tabs for posts */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 shrink-0">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPostActiveTab('ativos')}
                      className={`pb-1 text-xs font-bold border-b-2 px-1 ${
                        postActiveTab === 'ativos'
                          ? 'border-[#00185f] text-[#00185f]'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Recados Ativos
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostActiveTab('lixeira')}
                      className={`pb-1 text-xs font-bold border-b-2 px-1 flex items-center gap-1 ${
                        postActiveTab === 'lixeira'
                          ? 'border-[#bc0100] text-[#bc0100]'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Trash className="h-3 w-3" />
                      <span>Lixeira ({posts.filter(p => p.status === 'lixeira').length})</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 flex-grow overflow-y-auto pr-1">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <div key={post.id} className="bg-white border border-slate-150 rounded-xl p-4 space-y-2 shadow-sm relative group hover:border-[#00185f] transition-all">
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold text-slate-400 flex flex-col">
                            <span>Publicação: {new Date(post.data_publicacao || post.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                            {post.data_expiracao && (
                              <span className="text-red-500">Expira: {new Date(post.data_expiracao).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            )}
                          </span>
                          
                          {/* Post actions depending on Trash Tab */}
                          {postActiveTab === 'ativos' ? (
                            <button
                              type="button"
                              onClick={() => handleSoftDeletePost(post.id)}
                              className="text-[#bc0100] hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50"
                              title="Mover para Lixeira"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleRestorePost(post.id)}
                                className="text-emerald-600 hover:text-emerald-700 p-1 rounded hover:bg-emerald-50"
                                title="Restaurar Recado"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleHardDeletePost(post.id)}
                                className="text-red-650 hover:text-red-800 p-1 rounded hover:bg-red-100"
                                title="Excluir Definitivamente"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-[#00185f] text-sm leading-snug">{post.titulo}</h5>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase border ${
                            post.status === 'arquivado'
                              ? 'bg-slate-100 text-slate-500 border-slate-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {post.status}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">{post.conteudo}</p>
                        
                        {/* Imagens (Gallery layout) */}
                        {((post.imagens as string[]) || (post.imagem_url ? [post.imagem_url] : [])).length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {((post.imagens as string[]) || (post.imagem_url ? [post.imagem_url] : [])).map((url, i) => (
                              <div key={i} className="rounded-lg overflow-hidden border border-slate-200 h-16 bg-slate-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Foto recado ${i}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        {post.link_referencia && (
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-[#00185f] hover:underline">
                            <LinkIcon className="h-3 w-3 shrink-0" />
                            <a href={post.link_referencia} target="_blank" rel="noopener noreferrer" className="truncate max-w-[220px]">{post.link_referencia}</a>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-400 text-xs py-8">Nenhum recado nesta categoria.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedTurmaForPosts(null)}
                className="bg-[#00185f] hover:bg-[#001144] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function SubmitButton({ label = 'Salvar', disabled = false }: { label?: string, disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="bg-[#00185f] hover:bg-[#001144] disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors outline-none"
    >
      {pending ? 'Processando...' : label}
    </button>
  );
}
