import { getTurmasAdmin } from './actions';
import TurmasManager from './components/turmas-manager';

export const dynamic = 'force-dynamic';

export default async function TurmasDashboardPage() {
  const turmas = await getTurmasAdmin();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#00185f] font-display">
          Gerenciar Turmas e Recados
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Cadastre turmas, gerencie links de WhatsApp, links adicionais e publique recados diretamente no mural de cada turma.
        </p>
      </div>

      <TurmasManager initialTurmas={turmas} />
    </div>
  );
}
