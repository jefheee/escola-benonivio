import { getTurmasPublic } from "@/lib/data/turmas";
import TurmasHub from "@/components/features/turmas-hub";

export const dynamic = 'force-dynamic';

export default async function TurmasPage() {
  const allGroups = await getTurmasPublic();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-block bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-indigo-200 mb-1">
          Canais & Murais
        </div>
        <h1 className="text-4xl font-extrabold text-[#00185f] font-display">
          Painéis e Grupos das Turmas
        </h1>
        <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
        <p className="text-slate-600 font-medium">
          Acesse os recados oficiais da escola e links de WhatsApp. Selecione seu ano/série abaixo e clique na turma para abrir o mural correspondente.
        </p>
      </div>

      {/* Interactive Turmas Hub */}
      <TurmasHub initialTurmas={allGroups} />
    </div>
  );
}
