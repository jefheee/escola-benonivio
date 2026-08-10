'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Megaphone, FileArchive, Users, BellRing, Laptop, History } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    {
      href: '/dashboard',
      label: 'Início',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/turmas',
      label: 'Turmas e Recados',
      icon: Users,
    },
    {
      href: '/dashboard/avisos',
      label: 'Mural de Novidades',
      icon: Megaphone,
    },
    {
      href: '/dashboard/notificacoes',
      label: 'Notificações Globais',
      icon: BellRing,
    },
    {
      href: '/dashboard/acervo',
      label: 'Acervo Histórico',
      icon: History,
    },
    {
      href: '/dashboard/documentos',
      label: 'Documentos Públicos',
      icon: FileArchive,
    },
    {
      href: '/dashboard/paginas',
      label: 'Conteúdo de Páginas',
      icon: Laptop,
    },
  ];

  return (
    <nav className="p-4 space-y-1.5">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
              isActive
                ? "bg-[#00185f]/5 text-[#00185f] font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive ? "text-[#00185f]" : "text-slate-500")} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
