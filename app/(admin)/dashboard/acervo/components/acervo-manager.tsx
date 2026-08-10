'use client';

import { useState, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, CheckCircle2, Eye, Folder, RotateCcw, Trash, Archive } from 'lucide-react';
import { EscolaAcervoItem, saveAcervo, moveToTrashAcervo, restoreAcervo, deleteAcervoPermanently, archiveYear } from '../actions';
import ImageCropper from '@/components/admin/image-cropper';

interface ManagerProps {
  initialItems: EscolaAcervoItem[];
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

export default function AcervoManager({ initialItems }: ManagerProps) {
  const [items, setItems] = useState<EscolaAcervoItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ativos' | 'lixeira'>('ativos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EscolaAcervoItem | null>(null);
  const [, startTransition] = useTransition();

  // Form fields
  const [previewTitulo, setPreviewTitulo] = useState('');
  const [previewDescricao, setPreviewDescricao] = useState('');
  const [anoValue, setAnoValue] = useState('');
  const [categoriaValue, setCategoriaValue] = useState('');
  const [imagens, setImagens] = useState<string[]>([]);
  const [dataPublicacao, setDataPublicacao] = useState('');
  const [statusValue, setStatusValue] = useState('ativo');

  // Archive Year input state
  const [archiveYearInput, setArchiveYearInput] = useState('');

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
    formData.append('status', statusValue);

    const res = await saveAcervo(state, formData);
    if (res.success) {
      setIsFormOpen(false);
      setEditingItem(null);
      showFeedback('success', 'Registro do acervo salvo com sucesso!');
      window.location.reload();
      return { error: null, success: true };
    } else {
      return { error: res.error || 'Ocorreu um erro.', success: false };
    }
  }, formInitialState);

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setPreviewTitulo('');
    setPreviewDescricao('');
    setAnoValue(new Date().getFullYear().toString());
    setCategoriaValue('Eventos Culturais');
    setImagens([]);
    setDataPublicacao(formatISOForDateTimeLocal(new Date().toISOString()));
    setStatusValue('ativo');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: EscolaAcervoItem) => {
    setEditingItem(item);
    setPreviewTitulo(item.titulo);
    setPreviewDescricao(item.descricao || '');
    setAnoValue(item.ano);
    setCategoriaValue(item.categoria);
    setImagens(item.imagens || []);
    setDataPublicacao(formatISOForDateTimeLocal(item.data_publicacao || item.created_at));
    setStatusValue(item.status || 'ativo');
    setIsFormOpen(true);
  };

  // Soft Delete (move to trash)
  const handleSoftDelete = (id: string) => {
    if (confirm('Tem certeza que deseja mover este item para a lixeira?')) {
      startTransition(async () => {
        const res = await moveToTrashAcervo(id);
        if (res.success) {
          setItems(items.map(i => i.id === id ? { ...i, status: 'lixeira' } : i));
          showFeedback('success', 'Item movido para a lixeira!');
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
      const res = await restoreAcervo(id);
      if (res.success) {
        setItems(items.map(i => i.id === id ? { ...i, status: 'ativo' } : i));
        showFeedback('success', 'Item restaurado com sucesso!');
        window.location.reload();
      } else {
        showFeedback('error', res.error || 'Erro ao restaurar item.');
      }
    });
  };

  // Hard Delete
  const handleHardDelete = (id: string) => {
    if (confirm('Deseja EXCLUIR DEFINITIVAMENTE este registro de acervo e apagar todas as mídias correspondentes no storage?')) {
      startTransition(async () => {
        const res = await deleteAcervoPermanently(id);
        if (res.success) {
          setItems(items.filter(i => i.id !== id));
          showFeedback('success', 'Item e mídias excluídos permanentemente!');
          window.location.reload();
        } else {
          showFeedback('error', res.error || 'Erro ao excluir definitivamente.');
        }
      });
    }
  };

  // Bulk Archive Year
  const handleArchiveYear = () => {
    if (!archiveYearInput) return;
    if (confirm(`Tem certeza que deseja arquivar todos os itens do ano ${archiveYearInput}?`)) {
      startTransition(async () => {
        const res = await archiveYear(archiveYearInput);
        if (res.success) {
          setItems(items.map(i => i.ano === archiveYearInput && i.status !== 'lixeira' ? { ...i, status: 'arquivado' } : i));
          showFeedback('success', `Todos os registros do ano ${archiveYearInput} foram arquivados!`);
          setArchiveYearInput('');
          window.location.reload();
        } else {
          showFeedback('error', res.error || 'Erro ao arquivar ano.');
        }
      });
    }
  };

  // Tab filtering
  const tabFilteredItems = items.filter(i => {
    if (activeTab === 'lixeira') {
      return i.status === 'lixeira';
    }
    return i.status !== 'lixeira';
  });

  const filteredItems = tabFilteredItems.filter(i => 
    i.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.ano.includes(searchTerm) ||
    i.categoria.toLowerCase().includes(searchTerm.toLowerCase())
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
              Itens do Acervo (Ativos/Arquivados)
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
              {items.filter(i => i.status === 'lixeira').length > 0 && (
                <span className="bg-[#bc0100] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {items.filter(i => i.status === 'lixeira').length}
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder={activeTab === 'lixeira' ? "Procurar na lixeira..." : "Pesquisar por ano, título ou categoria..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Archive Year Box */}
              {activeTab === 'ativos' && (
                <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Ano (Ex: 2025)"
                    value={archiveYearInput}
                    onChange={(e) => setArchiveYearInput(e.target.value.replace(/\D/g, ''))}
                    className="px-3 py-2 text-xs w-28 bg-white outline-none"
                  />
                  <button
                    onClick={handleArchiveYear}
                    disabled={!archiveYearInput}
                    className="bg-slate-100 hover:bg-slate-200 text-[#00185f] text-xs font-bold px-3 py-2 border-l border-slate-200 flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    <span>Arquivar Ano</span>
                  </button>
                </div>
              )}

              {/* Add Button */}
              {activeTab === 'ativos' && (
                <button
                  onClick={handleOpenAddForm}
                  className="bg-[#00185f] hover:bg-[#001144] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 outline-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Novo Registro</span>
                </button>
              )}
            </div>
          </div>

          {/* Table List Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item / Título</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Ano</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                    {activeTab === 'ativos' && (
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                    )}
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Publicação</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Notice Title & Summary */}
                        <td className="px-6 py-4 max-w-sm">
                          <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                            <span>{item.titulo}</span>
                            {(item.imagens?.length || 0) > 0 && (
                              <span className="bg-[#00185f]/10 text-[#00185f] text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                {item.imagens?.length} fotos
                              </span>
                            )}
                          </div>
                          {item.descricao && (
                            <div className="text-xs text-slate-500 truncate mt-0.5">{item.descricao}</div>
                          )}
                        </td>

                        {/* Ano */}
                        <td className="px-6 py-4 text-center font-bold text-slate-800">
                          {item.ano}
                        </td>

                        {/* Categoria */}
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                          {item.categoria}
                        </td>

                        {activeTab === 'ativos' && (
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              item.status === 'arquivado'
                                ? 'bg-slate-150 border-slate-350 text-slate-550'
                                : 'bg-emerald-50 border-emerald-250 text-emerald-700'
                            }`}>
                              {item.status === 'arquivado' ? 'Arquivado' : 'Ativo'}
                            </span>
                          </td>
                        )}

                        {/* Publicado em */}
                        <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                          {new Date(item.data_publicacao || item.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {activeTab === 'ativos' ? (
                              <>
                                <button
                                  onClick={() => handleOpenEditForm(item)}
                                  title="Editar item"
                                  className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-950 rounded-lg transition-colors"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleSoftDelete(item.id)}
                                  title="Mover para Lixeira"
                                  className="p-2 hover:bg-red-50 text-slate-650 hover:text-[#bc0100] rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleRestore(item.id)}
                                  title="Restaurar item"
                                  className="px-2.5 py-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg border border-slate-200 hover:border-emerald-200 transition-colors flex items-center gap-1 text-xs font-bold"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  <span>Restaurar</span>
                                </button>
                                <button
                                  onClick={() => handleHardDelete(item.id)}
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
                      <td colSpan={activeTab === 'ativos' ? 6 : 5} className="px-6 py-12 text-center text-slate-400 font-medium">
                        Nenhum registro encontrado.
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
                {editingItem ? 'Editar Registro do Acervo' : 'Novo Registro de Acervo'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-655 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              {editingItem && <input type="hidden" name="id" value={editingItem.id} />}

              {formState?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{formState.error}</span>
                </div>
              )}

              {/* Title input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Título do Projeto / Evento</label>
                <input
                  name="titulo"
                  type="text"
                  required
                  placeholder="Ex: 36ª Feira Catarinense de Matemática"
                  value={previewTitulo}
                  onChange={(e) => setPreviewTitulo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all font-semibold"
                />
              </div>

              {/* Description textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Descrição do Evento (Opcional)</label>
                <textarea
                  name="descricao"
                  rows={4}
                  placeholder="Escreva detalhes sobre o projeto, fotos, alunos envolvidos..."
                  value={previewDescricao}
                  onChange={(e) => setPreviewDescricao(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Ano */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Ano do Acervo</label>
                  <input
                    name="ano"
                    type="text"
                    required
                    maxLength={4}
                    placeholder="Ex: 2026"
                    value={anoValue}
                    onChange={(e) => setAnoValue(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-808 outline-none focus:bg-white focus:border-[#00185f]"
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Categoria</label>
                  <select
                    name="categoria"
                    value={categoriaValue}
                    onChange={(e) => setCategoriaValue(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-808 outline-none focus:bg-white focus:border-[#00185f]"
                  >
                    <option value="Eventos Culturais">Eventos Culturais</option>
                    <option value="Aprovações">Aprovações</option>
                    <option value="Projetos Científicos">Projetos Científicos</option>
                    <option value="Esporte">Esportes e JESC</option>
                    <option value="Histórico Geral">Histórico Geral</option>
                  </select>
                </div>
              </div>

              {/* Upload Galeria de Imagens JSONB */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Álbum de Imagens (Até 10 fotos 4:3)</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap gap-2.5">
                    {imagens.map((url, index) => (
                      <div key={index} className="relative group w-20 h-16 border border-slate-300 rounded-lg overflow-hidden bg-slate-200 flex items-center justify-center shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Galeria ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImagens(imagens.filter((_, i) => i !== index))}
                          className="absolute -top-1 -right-1 bg-[#bc0100] text-white rounded-full p-1 shadow hover:bg-[#bc0100]/90 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {imagens.length < 10 && (
                      <div className="w-20 h-16 border border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-white hover:border-[#00185f] transition-all">
                        <ImageCropper
                          onUploadSuccess={(url) => {
                            setImagens([...imagens, url]);
                            showFeedback('success', 'Imagem adicionada ao álbum!');
                          }}
                          aspectRatio={4 / 3}
                          bucketName="escola_midias"
                          folderName="acervo"
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
                </div>
              </div>

              {/* Data de Publicação e Status */}
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
                  <label className="text-[11px] font-bold text-slate-700 uppercase block">Status</label>
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
                <SubmitButton label="Salvar Registro" />
              </div>
            </form>
          </div>

          {/* Right Panel: Side-by-Side Live Preview */}
          <div className="space-y-4 sticky top-20">
            <div className="flex items-center gap-2 text-[#00185f]">
              <Eye className="h-4.5 w-4.5" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visualização do Item</span>
            </div>

            {/* Simulated Acervo Card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-subtle p-5 space-y-4">
              <div className="flex justify-between items-center border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-[#bc0100]" />
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{categoriaValue}</span>
                </div>
                <span className="bg-[#00185f] text-white text-xs font-extrabold px-3 py-0.5 rounded-full">{anoValue || 'Ano'}</span>
              </div>

              <h3 className="font-display font-extrabold text-lg text-[#00185f] leading-snug">
                {previewTitulo || 'Título do Evento...'}
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed whitespace-pre-wrap">
                {previewDescricao || 'Descrição detalhada das atividades e aprovações...'}
              </p>

              {imagens.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {imagens.slice(0, 4).map((url, i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-slate-250 aspect-video bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SubmitButton({ label = 'Salvar Registro' }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#00185f] hover:bg-[#001144] disabled:opacity-50 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors outline-none"
    >
      {pending ? 'Salvando...' : label}
    </button>
  );
}
