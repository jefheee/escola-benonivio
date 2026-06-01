import { createClient } from '@/lib/supabase/server';
import { FileText, Download, ExternalLink, RefreshCw, Calendar, Utensils } from 'lucide-react';

export const dynamic = 'force-dynamic';

export interface CardapioDoc {
  id: string;
  titulo: string;
  url_arquivo: string;
  categoria: string | null;
  created_at: string;
}

async function getCardapios() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('escola_documentos')
    .select('id, titulo, url_arquivo, categoria, created_at')
    .ilike('categoria', 'Cardápio')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar cardápios:', error);
    return [];
  }

  return (data || []) as CardapioDoc[];
}

export default async function CardapioPage() {
  const docs = await getCardapios();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-extrabold uppercase tracking-wider">
          <Utensils className="h-3.5 w-3.5" />
          <span>Alimentação Escolar</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 font-display leading-tight">
          Cardápio da Merenda 2026
        </h1>
        <div className="h-1.5 w-16 bg-slate-900 mx-auto rounded-full" />
        <p className="text-slate-500 font-semibold text-sm max-w-lg mx-auto leading-relaxed">
          Confira o cardápio e o cronograma nutricional oficial da merenda oferecida diariamente aos alunos da rede estadual de Santa Catarina.
        </p>
      </div>

      {docs.length > 0 ? (
        <div className="space-y-6 text-left">
          {/* Highlight card for the latest Cardápio */}
          <div className="bg-slate-50 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
            <div className="space-y-3 max-w-xl">
              <span className="bg-slate-900 text-white text-[9px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                Cardápio Mais Recente
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                {docs[0].titulo}
              </h2>
              <div className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase">
                <Calendar className="h-3.5 w-3.5" />
                <span>Atualizado em {new Date(docs[0].created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Nossa merenda escolar segue o Plano de Alimentação Escolar da SED/SC, planejado por nutricionistas visando refeições ricas em nutrientes e de alta aceitação.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <a
                href={docs[0].url_arquivo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-5 rounded-xl border border-slate-300 text-xs transition-colors outline-none shadow-sm"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Visualizar Online</span>
              </a>
              <a
                href={docs[0].url_arquivo}
                download
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-black text-white font-bold py-3 px-5 rounded-xl text-xs transition-colors outline-none shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Baixar Cardápio</span>
              </a>
            </div>
          </div>

          {/* List of older menu files if any */}
          {docs.length > 1 && (
            <div className="space-y-4 pt-4">
              <h3 className="font-display font-bold text-base text-slate-900">Cardápios Anteriores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docs.slice(1).map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white border border-slate-200 hover:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3 truncate pr-4">
                      <div className="p-2 bg-slate-105 text-slate-700 rounded-lg shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:underline truncate">
                          {doc.titulo}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase mt-0.5">
                          Enviado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <a
                        href={doc.url_arquivo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <a
                        href={doc.url_arquivo}
                        download
                        className="p-2 bg-slate-900 hover:bg-black text-white rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-10 text-center max-w-2xl mx-auto space-y-4">
          <Utensils className="h-10 w-10 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Cardápio em Atualização
          </h2>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
            O cronograma de alimentação escolar e os cardápios nutricionais oficiais de 2026 estão sendo preparados e serão publicados em breve pela secretaria da escola.
          </p>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full uppercase">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Atualizando cronograma de alimentação</span>
          </div>
        </div>
      )}
    </div>
  );
}
