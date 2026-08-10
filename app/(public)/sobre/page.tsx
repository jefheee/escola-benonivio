import { getDocumentosPublic } from "@/lib/data/documentos";
import { getAcervoHistoricoPublic } from "@/lib/data/acervo";
import SobreHub from "./components/sobre-hub";
import { SCHOOL_INFO } from "@/lib/constants";

export const dynamic = 'force-dynamic';

export default async function SobrePage() {
  const [documentos, fotosHistoricas] = await Promise.all([
    getDocumentosPublic(),
    getAcervoHistoricoPublic()
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-block bg-slate-100 text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-slate-200 mb-1 tracking-wider">
          Quem Somos
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-display leading-tight">
          Nossa Escola, Nossa História
        </h1>
        <div className="h-1.5 w-24 bg-slate-800 mx-auto rounded-full" />
        <p className="text-slate-500 font-semibold text-lg max-w-2xl mx-auto leading-relaxed">
          Conheça o compromisso social, a proposta pedagógica e o acervo histórico da E.E.B. Professor Benonívio João Martins.
        </p>
      </div>

      {/* Intro Stats block */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-4 md:w-2/3 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-slate-300">
            <span>Polo Educacional</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
            {SCHOOL_INFO.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-350 leading-relaxed font-medium">
            MEC / INEP: <span className="font-extrabold text-white">{SCHOOL_INFO.inep}</span>. A instituição atua como um vital polo comunitário no bairro <span className="font-extrabold text-white">{SCHOOL_INFO.address.neighborhood}</span>, Palhoça/SC, atendendo cerca de <span className="font-extrabold text-white">1.300 alunos</span> nos turnos matutino, vespertino e noturno.
          </p>
        </div>
        <div className="md:w-1/3 w-full grid grid-cols-2 gap-3 text-center shrink-0">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="block text-2xl font-extrabold text-white font-display">1.300+</span>
            <span className="text-[10px] text-slate-300 font-bold uppercase block mt-1">Alunos Ativos</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="block text-2xl font-extrabold text-white font-display">3</span>
            <span className="text-[10px] text-slate-300 font-bold uppercase block mt-1">Turnos letivos</span>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Hub */}
      <SobreHub documentos={documentos} fotosHistoricas={fotosHistoricas} />

    </div>
  );
}
