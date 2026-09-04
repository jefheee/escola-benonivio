'use client';

import { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { parseCardapioPDF } from '../actions';
import { Upload, FileText, Sparkles, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function CardapioUploader() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string; count?: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setFeedback({ type: 'error', message: 'Selecione exclusivamente um arquivo em formato PDF (.pdf).' });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFeedback({ type: 'error', message: 'O arquivo excede o limite máximo permitido de 10 MB.' });
        return;
      }
      setSelectedFile(file);
      setFeedback(null);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFeedback({ type: 'error', message: 'Por favor, selecione um arquivo PDF antes de enviar.' });
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await parseCardapioPDF(formData);

      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Cardápio processado com sucesso! ${res.count || 0} refeições foram extraídas e sincronizadas no banco de dados.`,
          count: res.count,
        });
        handleClearFile();
        router.refresh();
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Ocorreu um erro ao processar o cardápio com inteligência artificial.',
        });
      }
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Automação via Google Gemini 1.5 Flash</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#00185f] font-display">
          Importar Cardápio Oficial (PDF)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Envie o PDF mensal enviado pelas nutricionistas da SED/SC. A inteligência artificial lerá todas as tabelas e datas, inserindo os pratos diretamente no banco de dados.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          disabled={isPending}
          className="hidden"
          id="pdf-upload-input"
        />

        {/* Dropzone / Upload Area */}
        {!selectedFile ? (
          <label
            htmlFor="pdf-upload-input"
            className="border-2 border-dashed border-slate-300 hover:border-[#00185f] rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50 hover:bg-slate-100/60 group"
          >
            <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-[#00185f] group-hover:scale-110 transition-all border border-slate-200 mb-3">
              <Upload className="h-8 w-8" />
            </div>
            <span className="text-sm font-bold text-slate-800 block">
              Clique para selecionar o PDF do Cardápio
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Arquivo oficial da SED/SC em formato .PDF (até 10 MB)
            </span>
          </label>
        ) : (
          <div className="border border-slate-200 bg-slate-50 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 truncate">
              <div className="p-3 bg-red-100 text-red-700 rounded-xl shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div className="truncate">
                <span className="text-sm font-extrabold text-slate-900 block truncate">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Pronto para leitura com IA
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearFile}
              disabled={isPending}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              title="Remover arquivo"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-start gap-3 border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">
              {feedback.message}
            </div>
          </div>
        )}

        {/* Submit Button & Progress Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-400 font-medium order-2 sm:order-1">
            * O processo substitui ou atualiza os dias já cadastrados sem duplicar registros.
          </span>

          <button
            type="submit"
            disabled={!selectedFile || isPending}
            className="w-full sm:w-auto bg-[#00185f] hover:bg-[#001144] disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 outline-none order-1 sm:order-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Processando com IA (Aguarde)...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Iniciar Extração com IA</span>
              </>
            )}
          </button>
        </div>

        {/* Active AI processing notification */}
        {isPending && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center gap-3 text-xs text-indigo-900 animate-pulse">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600 shrink-0" />
            <div>
              <span className="font-bold block">A IA está interpretando o documento oficial...</span>
              <span className="text-[11px] text-indigo-700">
                O modelo Gemini 1.5 Flash está convertendo o PDF, identificando dias úteis e organizando os pratos dos turnos diurno e noturno. Esse processo leva cerca de 5 a 10 segundos.
              </span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
