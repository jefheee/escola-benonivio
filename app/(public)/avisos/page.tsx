import { getAvisosPublic } from '@/lib/data/avisos';
import AvisosList from './components/avisos-list';

export const dynamic = 'force-dynamic';

export default async function PublicAvisosPage() {
  const avisos = await getAvisosPublic();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-block bg-[#00185f]/5 text-[#00185f] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-[#00185f]/15 mb-1">
          Mural de Comunicados
        </div>
        <h1 className="text-4xl font-extrabold text-[#00185f] font-display">
          Avisos & Novidades da Escola
        </h1>
        <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
        <p className="text-slate-600 font-medium">
          Acompanhe todos os comunicados oficiais, cronogramas, calendários e notícias importantes sobre a E.E.B. Professor Benonívio João Martins.
        </p>
      </div>

      {/* Grid List */}
      <AvisosList initialAvisos={avisos} />
    </div>
  );
}
