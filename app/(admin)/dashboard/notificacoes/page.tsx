import { getNotificacoesAdmin } from './actions';
import NotificacoesManager from './components/notificacoes-manager';

export const dynamic = 'force-dynamic';

export default async function NotificacoesDashboardPage() {
  const notifications = await getNotificacoesAdmin();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#00185f] font-display">
          Gerenciar Notificações Globais
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Crie avisos que aparecerão em uma barra colorida no topo de todas as páginas públicas do portal, chamando a atenção de alunos e responsáveis.
        </p>
      </div>

      <NotificacoesManager initialNotifications={notifications} />
    </div>
  );
}
