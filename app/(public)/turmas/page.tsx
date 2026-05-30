import { MessageSquare, ChevronRight, GraduationCap } from "lucide-react";
import { getTurmasPublic, WhatsAppGrupoPublic } from "@/lib/data/whatsapp";

export const dynamic = 'force-dynamic';

interface GroupedTurmas {
  [serie: string]: WhatsAppGrupoPublic[];
}

export default async function TurmasPage() {
  const allGroups = await getTurmasPublic();

  // Group by 'serie'
  const grouped = allGroups.reduce((acc, current) => {
    const key = current.serie;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(current);
    return acc;
  }, {} as GroupedTurmas);

  const series = Object.keys(grouped).sort();

  return (
    <div className="py-6 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-block bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-indigo-200 mb-1">
          Canais Oficiais
        </div>
        <h1 className="text-4xl font-extrabold text-[#00185f] font-display">
          Grupos de WhatsApp das Turmas
        </h1>
        <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
        <p className="text-slate-600 font-medium">
          Acesse os canais de avisos e comunicados da escola. Encontre sua turma abaixo e clique para entrar no grupo oficial correspondente.
        </p>
      </div>

      {/* Grid of Categories (Series) */}
      <div className="space-y-16">
        {series.length > 0 ? (
          series.map((serie) => {
            const turmas = grouped[serie];

            return (
              <section key={serie} className="space-y-6">
                {/* Serie Title */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  <div className="p-1.5 bg-[#00185f]/5 text-[#00185f] rounded-lg">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#00185f] font-display">
                    {serie}
                  </h2>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200 uppercase">
                    {turmas.length} {turmas.length === 1 ? 'turma' : 'turmas'}
                  </span>
                </div>

                {/* Turmas Grid under Serie */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {turmas.map((turma) => {
                    const hasValidLink = turma.link && turma.link.startsWith('http');

                    if (hasValidLink) {
                      return (
                        <a
                          key={turma.id}
                          href={turma.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle flex flex-col justify-between hover:border-secondary transition-all cursor-pointer group outline-none min-h-[120px]"
                        >
                          <div className="space-y-2">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              turma.turno === 'Matutino'
                                ? 'bg-amber-50 text-amber-750 border border-amber-100'
                                : turma.turno === 'Vespertino'
                                ? 'bg-indigo-50 text-indigo-750 border border-indigo-100'
                                : 'bg-slate-50 text-slate-700 border border-slate-200'
                            }`}>
                              {turma.turno}
                            </span>
                            <h4 className="font-extrabold text-[#00185f] text-base group-hover:text-secondary transition-colors">
                              {turma.turma}
                            </h4>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2 text-slate-400 group-hover:text-secondary transition-colors">
                            <span className="text-xs font-bold">Entrar no grupo</span>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4 shrink-0" />
                              <ChevronRight className="h-4 w-4 shrink-0" />
                            </div>
                          </div>
                        </a>
                      );
                    } else {
                      return (
                        <div
                          key={turma.id}
                          className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-5 opacity-60 flex flex-col justify-between cursor-not-allowed select-none min-h-[120px]"
                          title="Link indisponível no momento"
                        >
                          <div className="space-y-2">
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">
                              {turma.turno}
                            </span>
                            <h4 className="font-extrabold text-slate-400 text-base">
                              {turma.turma}
                            </h4>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2 text-slate-350">
                            <span className="text-xs font-semibold">Indisponível</span>
                            <MessageSquare className="h-4 w-4 shrink-0" />
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </section>
            );
          })
        ) : (
          <p className="text-center text-slate-400 py-12 font-semibold">Nenhuma turma registrada no momento.</p>
        )}
      </div>
    </div>
  );
}
