import { MessageSquare, BookOpen, Layers, ShieldCheck } from "lucide-react";

interface TurmaGroup {
  name: string;
  link: string;
}

interface Nivel {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  turmas: TurmaGroup[];
  color: "blue" | "red" | "slate";
}

const NIVEIS_ENSINO: Nivel[] = [
  {
    title: "Anos Iniciais",
    description: "1º ao 5º Ano do Ensino Fundamental",
    icon: BookOpen,
    color: "blue",
    turmas: [
      { name: "1º Ano", link: "#" },
      { name: "2º Ano", link: "#" },
      { name: "3º Ano", link: "#" },
      { name: "4º Ano", link: "#" },
      { name: "5º Ano", link: "#" },
    ],
  },
  {
    title: "Anos Finais",
    description: "6º ao 9º Ano do Ensino Fundamental",
    icon: Layers,
    color: "slate",
    turmas: [
      { name: "6º Ano", link: "#" },
      { name: "7º Ano", link: "#" },
      { name: "8º Ano", link: "#" },
      { name: "9º Ano", link: "#" },
    ],
  },
  {
    title: "Ensino Médio",
    description: "1º ao 3º Ano do Ensino Médio",
    icon: ShieldCheck,
    color: "red",
    turmas: [
      { name: "1º Ano EM", link: "#" },
      { name: "2º Ano EM", link: "#" },
      { name: "3º Ano EM", link: "#" },
    ],
  },
];

export default function TurmasGrid() {
  return (
    <section id="grupos" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1B2F78] dark:text-white">
            Canais de Comunicação por Turma
          </h2>
          <div className="h-1 w-20 bg-[#F90000] mx-auto rounded-full" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Selecione a turma correspondente para ingressar no grupo oficial de avisos do WhatsApp. Mantenha-se informado sobre aulas, projetos e reuniões.
          </p>
        </div>

        {/* Grid of Níveis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {NIVEIS_ENSINO.map((nivel) => {
            const Icon = nivel.icon;
            
            // Setup dynamic visual identity borders/background elements based on school colors
            const cardStyles = 
              nivel.color === "blue" 
                ? "border-t-4 border-t-[#1B2F78]" 
                : nivel.color === "red" 
                ? "border-t-4 border-t-[#F90000]" 
                : "border-t-4 border-t-slate-500";

            const iconBg = 
              nivel.color === "blue"
                ? "bg-[#1B2F78]/10 text-[#1B2F78]"
                : nivel.color === "red"
                ? "bg-[#F90000]/10 text-[#F90000]"
                : "bg-slate-500/10 text-slate-600 dark:text-slate-300";

            return (
              <div 
                key={nivel.title} 
                className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none p-6 sm:p-8 flex flex-col justify-between border border-slate-100 dark:border-slate-800/50 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-none hover:-translate-y-1 ${cardStyles}`}
              >
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`p-3 rounded-xl ${iconBg}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg sm:text-xl text-[#1B2F78] dark:text-white">
                        {nivel.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {nivel.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {nivel.turmas.map((turma) => (
                      <a
                        key={turma.name}
                        href={turma.link}
                        className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#1B2F78]/30 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 outline-none"
                      >
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#1B2F78] dark:group-hover:text-white transition-colors">
                          {turma.name}
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Grupo WhatsApp</span>
                          <MessageSquare className="h-4 w-4 shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 text-xs text-center text-slate-400">
                  Grupos moderados pela equipe pedagógica.
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
