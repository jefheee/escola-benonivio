import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from '../login/actions';
import { LogOut, GraduationCap } from 'lucide-react';
import SidebarNav from './components/sidebar-nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div className="flex flex-col">
          {/* Brand/Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-[#00185f]/5 text-[#00185f] rounded-xl">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-extrabold text-[#00185f] block text-sm leading-tight uppercase">
                Beno Painel
              </span>
              <span className="text-[11px] text-slate-400 font-bold block leading-none">
                Escola Benonívio
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <SidebarNav />
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="px-4 py-2.5 bg-slate-50 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Conectado como
            </span>
            <span className="text-xs font-semibold text-slate-700 block truncate">
              {user.email}
            </span>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 font-bold text-sm transition-all outline-none"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair do Sistema</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-[#00185f] uppercase tracking-wider">Painel de Administração</h2>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500 font-bold">Sistema Ativo</span>
          </div>
        </header>

        <div className="p-8 max-w-5xl w-full mx-auto flex-grow">
          {children}
        </div>
      </main>
    </div>
  );
}
