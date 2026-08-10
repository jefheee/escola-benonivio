import { getAcervoAdmin } from './actions';
import AcervoManager from './components/acervo-manager';

export const dynamic = 'force-dynamic';

export default async function AcervoDashboardPage() {
  const items = await getAcervoAdmin();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#00185f] font-display">
          Gerenciar Acervo Histórico e Memória
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Publique e arquive fotos de eventos culturais, feiras de matemática, olimpíadas, conquistas esportivas e aprovações históricas.
        </p>
      </div>

      <AcervoManager initialItems={items} />
    </div>
  );
}
