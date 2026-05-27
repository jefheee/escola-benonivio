import Link from "next/link";
import { ArrowRight, MessageSquare, MapPin, GraduationCap, Calendar, Users, Award } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { SCHOOL_INFO } from "@/lib/constants";
import TurmasGrid from "@/components/features/turmas-grid";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-6rem)] flex flex-col bg-grid-pattern dark:bg-grid-pattern-dark">
      {/* Background Brand Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#1B2F78]/10 dark:bg-[#1B2F78]/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#F90000]/5 blur-[150px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-[#1B2F78]/10 border border-[#1B2F78]/20 text-[#1B2F78] dark:text-[#3049ab] px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
              <GraduationCap className="h-4 w-4" />
              <span>Portal Oficial • Santa Catarina</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-[#1B2F78] dark:text-white leading-[1.1] sm:leading-none">
              Educação Pública de{" "}
              <span className="text-gradient-primary">Excelência</span>.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0">
              Seja bem-vindo ao portal da <span className="font-bold text-[#1B2F78] dark:text-white">{SCHOOL_INFO.name}</span>. Acompanhe comunicados oficiais, eventos escolares, convites de grupos pedagógicos e canais de contato com a nossa equipe.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={SCHOOL_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#1B2F78] hover:bg-[#1B2F78]/90 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-[#1B2F78]/25 hover:-translate-y-0.5 outline-none"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Secretaria Digital</span>
              </a>
              <Link
                href="/sobre"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[#1B2F78] dark:text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-slate-100 dark:shadow-none"
              >
                <span>Conhecer Projeto</span>
                <ArrowRight className="h-4 w-4 text-[#F90000]" />
              </Link>
            </div>

            {/* Quick Contacts */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-xs text-slate-500 dark:text-slate-400 font-bold">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#F90000]" />
                <span>Palhoça, SC</span>
              </div>
              <div className="flex items-center space-x-2">
                <InstagramIcon className="h-4 w-4 text-[#1B2F78] dark:text-white" />
                <a href={SCHOOL_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {SCHOOL_INFO.instagramHandle}
                </a>
              </div>
            </div>
          </div>

          {/* Hero Right Visuals */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative z-10 bg-slate-950 p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/5 space-y-6">
              
              {/* Highlight cards */}
              <div className="flex items-start space-x-4 border-b border-white/10 pb-4">
                <div className="p-3 rounded-xl bg-white/5 text-white">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Ano Letivo 2026</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Acesse o calendário oficial de aulas, recessos e avaliações regulares.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 border-b border-white/10 pb-4">
                <div className="p-3 rounded-xl bg-[#F90000]/20 text-[#F90000]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Comunidade Escolar</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Participe ativamente das atividades e reuniões gerais do Grêmio e da APP.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-[#1B2F78]/40 text-[#1B2F78] dark:text-white">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Informativos & Avisos</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Confira novidades, projetos escolares e avisos oficiais integrados à comunidade.
                  </p>
                </div>
              </div>

            </div>

            {/* Visual background circle decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#1B2F78]/20 blur-[60px] pointer-events-none -z-10" />
          </div>

        </div>
      </section>

      {/* Turmas Grid Section */}
      <TurmasGrid />
    </div>
  );
}
