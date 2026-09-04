import { createClient } from '@/lib/supabase/server';
import { FileText, Download, ExternalLink, Utensils, Apple } from 'lucide-react';
import CardapioDoDia from './components/cardapio-do-dia';

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

async function getRefeicoesHoje() {
  const supabase = createClient();
  // Formatar data no fuso oficial de SC/Brasil (America/Sao_Paulo: YYYY-MM-DD)
  const hojeStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const { data, error } = await supabase
    .from('refeicoes')
    .select('id, data, turno, descricao')
    .eq('data', hojeStr);

  if (error || !data) {
    return [];
  }
  return data;
}

export default async function CardapioPage() {
  const [docs, refeicoesHoje] = await Promise.all([
    getCardapios(),
    getRefeicoesHoje(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header Oficial SED/SC & PNAE */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
          <Utensils className="h-3.5 w-3.5 text-amber-600" />
          <span>Programa Nacional de Alimentação Escolar (PNAE)</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00185f] font-display leading-tight">
          Alimentação Escolar
        </h1>
        
        <div className="h-1.5 w-16 bg-[#00185f] mx-auto rounded-full" />
        
        <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
          A alimentação em nossa escola conta com cardápios cuidadosamente planejados por nutricionistas. O objetivo é atender às necessidades nutricionais dos estudantes, promovendo saúde, bem-estar e o desenvolvimento durante o período de aulas, respeitando as diretrizes do Programa Nacional de Alimentação Escolar (PNAE).
        </p>
      </div>

      {/* Componente Interativo Cardápio do Dia (Mobile & Desktop) */}
      <CardapioDoDia refeicoes={refeicoesHoje} />

      {/* Seção Oficial de Cronogramas e PDFs da SED/SC */}
      <div className="space-y-6 pt-6 border-t border-slate-200 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-extrabold text-xl text-[#00185f] flex items-center gap-2">
              <Apple className="h-5 w-5 text-emerald-600" />
              <span>Cronograma Mensal & Documentos Oficiais da SED/SC</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Confira os editais nutricionais e tabelas nutricionais completas enviadas pela Secretaria de Estado da Educação de Santa Catarina.
            </p>
          </div>
        </div>

        {docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 hover:border-[#00185f] rounded-2xl p-5 shadow-subtle flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3.5 truncate pr-4">
                  <div className="p-2.5 bg-slate-100 group-hover:bg-[#00185f]/10 text-[#00185f] rounded-xl shrink-0 transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#00185f] transition-colors truncate">
                      {doc.titulo}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase mt-0.5">
                      Atualizado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={doc.url_arquivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-[#00185f] transition-colors"
                    title="Visualizar documento online"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href={doc.url_arquivo}
                    download
                    className="p-2.5 bg-[#00185f] hover:bg-[#001144] text-white rounded-xl transition-colors shadow-sm"
                    title="Baixar arquivo PDF"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 text-center space-y-2">
            <FileText className="h-8 w-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Arquivos em atualização</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Os arquivos em PDF do cronograma mensal oficial estão sendo disponibilizados pela equipe técnica.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
