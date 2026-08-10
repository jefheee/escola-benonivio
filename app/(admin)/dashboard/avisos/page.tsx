import { getAvisosAdmin } from './actions';
import AvisosManager from './components/avisos-manager';

export const dynamic = 'force-dynamic';

export default async function AvisosDashboardPage() {
  const notices = await getAvisosAdmin();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#00185f] font-display">
          Mural de Avisos & Comunicados
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Crie, gerencie e publique notícias e informativos importantes no mural público da escola.
        </p>
      </div>

      <AvisosManager initialNotices={notices} />
    </div>
  );
}
