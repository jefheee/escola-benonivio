import { getRefeicoesCadastradas } from './actions';
import CardapioUploader from './components/cardapio-uploader';
import RefeicoesTabela from './components/refeicoes-tabela';
import { Utensils, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardCardapioPage() {
  const refeicoes = await getRefeicoesCadastradas();

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00185f]/5 text-[#00185f] text-xs font-bold uppercase tracking-wider">
            <Utensils className="h-3.5 w-3.5" />
            <span>Alimentação Escolar & PNAE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00185f] font-display">
            Cardápio Inteligente com IA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Ingestão automatizada de cardápios mensais através da API do Google Gemini 2.5 Flash.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Supabase RLS Ativo</span>
          </span>
        </div>
      </div>

      {/* Upload Component */}
      <CardapioUploader />

      {/* Table of Registered Meals */}
      <RefeicoesTabela initialRefeicoes={refeicoes} />
    </div>
  );
}
