import { MessageSquareCode, FileArchive, ArrowRight, UserCheck, Globe, GraduationCap, FileText, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userEmail = user?.email || 'Administrador';

  // Fetch counts in parallel
  const [
    { count: turmasCount, error: errorTurmas },
    { count: documentosCount, error: errorDocs },
    { count: avisosCount, error: errorAvisos }
  ] = await Promise.all([
    supabase.from('escola_turmas').select('*', { count: 'exact', head: true }),
    supabase.from('escola_documentos').select('*', { count: 'exact', head: true }),
    supabase.from('escola_avisos').select('*', { count: 'exact', head: true }).eq('publicado', true)
  ]);

  if (errorTurmas || errorDocs || errorAvisos) {
    console.error('Erro ao buscar estatísticas do painel:', { errorTurmas, errorDocs, errorAvisos });
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <span className="bg-[#bc0100]/10 text-[#bc0100] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-[#bc0100]/20 inline-block">
            Painel Administrativo
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00185f] font-display">
            Beno Painel - Escola Benonívio
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base max-w-xl">
            Gerencie as informações públicas da escola, comunicados no mural, turmas, grupos de WhatsApp e documentos públicos de forma simples e rápida.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center md:items-stretch lg:items-center gap-4 shrink-0">
          {/* User Session Block */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sessão Iniciada</span>
              <span className="text-xs font-bold text-slate-700 block max-w-[150px] truncate">{userEmail}</span>
            </div>
          </div>
          {/* Public Preview Button */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#bc0100] hover:bg-[#bc0100]/90 text-white font-extrabold text-sm px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 outline-none"
          >
            <Globe className="h-4.5 w-4.5" />
            <span>Ir para o Site Público</span>
          </a>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1: Turmas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Turmas Cadastradas</span>
            <span className="text-3xl font-extrabold text-[#00185f] block">{turmasCount ?? 0}</span>
          </div>
          <div className="p-4 bg-blue-50 text-[#00185f] rounded-2xl">
            <GraduationCap className="h-7 w-7" />
          </div>
        </div>

        {/* Metric 2: Documentos */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Documentos Públicos</span>
            <span className="text-3xl font-extrabold text-[#00185f] block">{documentosCount ?? 0}</span>
          </div>
          <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl">
            <FileText className="h-7 w-7" />
          </div>
        </div>

        {/* Metric 3: Avisos Ativos */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Avisos no Mural</span>
            <span className="text-3xl font-extrabold text-[#00185f] block">{avisosCount ?? 0}</span>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <Megaphone className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Actionable cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: WhatsApp */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="p-3 bg-[#00185f]/5 text-[#00185f] w-fit rounded-xl">
              <MessageSquareCode className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#00185f] font-display">
                Grupos de WhatsApp & Turmas
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Atualize os links e os nomes das turmas que aparecem no site para garantir que pais, responsáveis e estudantes entrem nos grupos de comunicação corretos.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Resumo: Links Ativos</span>
            <Link
              href="/dashboard/turmas"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#00185f] hover:underline"
            >
              <span>Gerenciar Turmas</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Card: Documentos */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="p-3 bg-[#00185f]/5 text-[#00185f] w-fit rounded-xl">
              <FileArchive className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#00185f] font-display">
                Documentos Públicos
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Adicione novos editais, atas da APP, orçamentos, regulamentos escolares ou remova publicações antigas para manter a transparência da instituição escolar.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Resumo: Editais & Atas</span>
            <Link
              href="/dashboard/documentos"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#00185f] hover:underline"
            >
              <span>Gerenciar Documentos</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
