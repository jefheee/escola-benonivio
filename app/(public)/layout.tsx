import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollProvider from "@/components/providers/scroll-provider";
import { WhatsAppDialogProvider } from "@/components/providers/whatsapp-dialog-provider";
import { getNotificacoesPublic } from "@/lib/data/notificacoes";
import { Bell } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const notifications = await getNotificacoesPublic();
  const activeNotif = notifications.length > 0 ? notifications[0] : null; // Get latest active

  const importanceBg = {
    Alta: "bg-[#F90000] text-white", // Vermelho
    Média: "bg-amber-450 text-slate-900", // Amarelo
    Baixa: "bg-[#1B2F78] text-white", // Azul
  };

  return (
    <WhatsAppDialogProvider>
      <ScrollProvider>
        {activeNotif && (
          <div className={`${importanceBg[activeNotif.importancia] || "bg-[#1B2F78] text-white"} w-full px-4 py-2.5 text-center text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 select-none z-50`}>
            <Bell className="h-4 w-4 shrink-0 animate-bounce" />
            <span>
              <strong>{activeNotif.titulo}:</strong> {activeNotif.mensagem}
            </span>
          </div>
        )}
        <Header />
        <main className="flex-grow pt-[73px]">
          {children}
        </main>
        <Footer />
      </ScrollProvider>
    </WhatsAppDialogProvider>
  );
}
