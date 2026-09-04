'use client';

import { useState, useTransition, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, CheckCircle2, FileText, ExternalLink, UploadCloud } from 'lucide-react';
import { EscolaDocumento, saveDocumento, deleteDocumento } from '../actions';
import { uploadMediaAction } from '@/app/(admin)/dashboard/actions/upload';
import { validateAndSanitizeFile } from '@/lib/storage-security';

interface ManagerProps {
  initialDocs: EscolaDocumento[];
}

const formInitialState = {
  error: null as string | null,
  success: false as boolean,
};

export default function DocumentosManager({ initialDocs }: ManagerProps) {
  const router = useRouter();
  const [docs, setDocs] = useState<EscolaDocumento[]>(initialDocs);

  useEffect(() => {
    setDocs(initialDocs);
  }, [initialDocs]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<EscolaDocumento | null>(null);
  
  // File upload state
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const [, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Form submit state
  const [formState, formAction] = useFormState(async (state: unknown, formData: FormData) => {
    // Append the file URL from state
    formData.append('url_arquivo', fileUrl);
    const res = await saveDocumento(state, formData);
    if (res.success) {
      setIsModalOpen(false);
      setEditingDoc(null);
      setFileUrl('');
      showFeedback('success', 'Documento salvo com sucesso!');
      router.refresh();
      return { error: null, success: true };
    } else {
      return { error: res.error || 'Erro ao salvar documento.', success: false };
    }
  }, formInitialState);

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setFileUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: EscolaDocumento) => {
    setEditingDoc(doc);
    setFileUrl(doc.url_arquivo);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este documento permanentemente?')) {
      startTransition(async () => {
        setDocs(prev => prev.filter(d => d.id !== id));
        const res = await deleteDocumento(id);
        if (res.success) {
          showFeedback('success', 'Documento excluído com sucesso!');
          router.refresh();
        } else {
          showFeedback('error', res.error || 'Erro ao excluir.');
          router.refresh();
        }
      });
    }
  };

  // Direct File Upload to Storage with Security Bounds
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // 1. Strict MIME Whitelist, Size Limit (10MB) & Secure Filename Generation
      const valResult = validateAndSanitizeFile(file, 'document');
      if (!valResult.valid) {
        showFeedback('error', valResult.error || 'Arquivo inválido.');
        if (e.target) e.target.value = '';
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('bucketName', 'escola_midias');
        formData.append('folderName', 'documentos');
        formData.append('category', 'document');

        const res = await uploadMediaAction(formData);

        if (!res.success || !res.url) {
          throw new Error(res.error || 'Falha no upload do documento.');
        }

        setFileUrl(res.url);
        showFeedback('success', 'Arquivo carregado com sucesso!');
      } catch (err: unknown) {
        console.error('[STORAGE SECURITY ERROR] Upload do documento falhou:', err);
        showFeedback('error', err instanceof Error ? err.message : 'Falha no upload do arquivo. Verifique o tamanho e formato.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const filteredDocs = docs.filter(d => 
    d.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.categoria && d.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Feedback Toast */}
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
            placeholder="Pesquisar por título ou categoria..."
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
          <span>Adicionar Documento</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Envio</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Document Title */}
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-805 leading-snug">{doc.titulo}</span>
                          <a 
                            href={doc.url_arquivo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-slate-400 hover:text-[#00185f] hover:underline font-semibold flex items-center gap-1 mt-0.5"
                          >
                            <span>Ver arquivo</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 border border-slate-200 text-slate-750 text-xs font-bold px-2.5 py-1 rounded-md">
                        {doc.categoria || 'Geral'}
                      </span>
                    </td>

                    {/* Created date */}
                    <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                      {new Date(doc.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          title="Editar"
                          className="p-2 hover:bg-slate-100 text-slate-650 hover:text-slate-950 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          title="Excluir"
                          className="p-2 hover:bg-red-50 text-slate-650 hover:text-red-650 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                    Nenhum documento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden animate-scaleIn">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg text-[#00185f]">
                {editingDoc ? 'Editar Documento' : 'Cadastrar Documento'}
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
              {editingDoc && <input type="hidden" name="id" value={editingDoc.id} />}

              {formState?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{formState.error}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase block">Título do Documento</label>
                <input
                  name="titulo"
                  type="text"
                  required
                  placeholder="Ex: Ata de Prestação de Contas - 2025"
                  defaultValue={editingDoc?.titulo || ''}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-805 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                />
              </div>

              {/* Categoria */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase block">Categoria</label>
                <input
                  name="categoria"
                  type="text"
                  placeholder="Ex: Editais, APP, Prestação de Contas"
                  defaultValue={editingDoc?.categoria || ''}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-805 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                />
              </div>

              {/* File Selector & Upload Progress */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase block">Arquivo PDF / DOC / Planilha</label>
                
                <div className="flex flex-col gap-3">
                  <label className="border border-dashed border-slate-300 hover:border-[#00185f] rounded-lg p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors bg-slate-50 hover:bg-white group text-center shadow-inner">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-[#00185f] transition-colors" />
                    <span className="text-xs font-bold text-slate-600 group-hover:text-[#00185f] transition-colors">
                      {isUploading ? 'Enviando...' : 'Selecionar arquivo para upload'}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, DOC, DOCX, XLS, XLSX, PNG, JPG</span>
                  </label>

                  {/* File URL Input Preview */}
                  {fileUrl && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div className="truncate flex items-center gap-1.5 font-medium text-slate-650 pr-4">
                        <FileText className="h-4 w-4 text-[#00185f] shrink-0" />
                        <span className="truncate">{fileUrl}</span>
                      </div>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-[#00185f] hover:underline shrink-0"
                      >
                        Visualizar
                      </a>
                    </div>
                  )}
                </div>
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
                <SubmitButton label="Salvar Documento" disabled={!fileUrl || isUploading} />
              </div>
            </form>
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
