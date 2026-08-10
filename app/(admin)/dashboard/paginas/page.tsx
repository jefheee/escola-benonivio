import { getPaginasAdmin } from './actions';
import PaginasManager from './components/paginas-manager';

export const dynamic = 'force-dynamic';

export default async function PaginasDashboardPage() {
  const pages = await getPaginasAdmin();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#00185f] font-display">
          Gerenciar Páginas Estáticas
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Edite as informações textuais do banner principal da Página Inicial e as biografias/dados do painel Quem Somos de forma simplificada e visual.
        </p>
      </div>

      <PaginasManager initialPages={pages} />
    </div>
  );
}
