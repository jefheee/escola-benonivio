import { MessageSquare, Smile, BookOpen, FlaskConical, ChevronRight } from "lucide-react";
import { turmasData } from "@/lib/data/turmas";

export default function TurmasGrid() {
  return (
    <section id="turmas" className="max-w-[1200px] mx-auto py-16 w-full">
      
      {/* Header */}
      <div className="mb-12 border-b border-soft-border pb-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">
          Nossas Turmas & Grupos de Comunicação
        </h2>
        <p className="text-sm text-slate-500 font-semibold">
          Selecione sua turma para entrar no canal de avisos oficiais do WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Category 1: Anos Iniciais */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display text-lg md:text-xl font-bold text-primary flex items-center gap-2 mb-4">
              <Smile className="h-5 w-5 text-secondary" />
              <span>Anos Iniciais</span>
            </h3>
            
            <div className="space-y-3">
              {turmasData.anosIniciais.map((turma) => (
                <a
                  key={turma.nome}
                  href={turma.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pure-white border border-soft-border rounded-lg p-4 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
                >
                  <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">
                    {turma.nome}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-secondary transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Category 2: Ensino Fundamental II */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display text-lg md:text-xl font-bold text-primary flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-secondary" />
              <span>Ensino Fundamental II</span>
            </h3>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {turmasData.fundamentalII.map((turma) => (
                <a
                  key={turma.nome}
                  href={turma.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pure-white border border-soft-border rounded-lg p-4 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
                >
                  <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">
                    {turma.nome}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-secondary transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Category 3: Ensino Médio */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display text-lg md:text-xl font-bold text-primary flex items-center gap-2 mb-4">
              <FlaskConical className="h-5 w-5 text-secondary" />
              <span>Ensino Médio</span>
            </h3>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {turmasData.ensinoMedio.map((turma) => (
                <a
                  key={turma.nome}
                  href={turma.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pure-white border border-soft-border rounded-lg p-4 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
                >
                  <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">
                    {turma.nome}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-secondary transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
