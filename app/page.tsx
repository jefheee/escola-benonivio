import Link from "next/link";
import {
  GraduationCap,
  MessageSquare,
  FileText,
  PhoneCall,
  History,
  BookOpen,
  FlaskConical,
  ChevronRight,
  Smile
} from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";

export default function Home() {
  return (
    <div className="bg-pure-white text-slate-text min-h-screen flex flex-col relative overflow-hidden">

      {/* Decorative Background Shapes */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full fill-primary" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="50,0 100,100 0,100"></polygon>
        </svg>
      </div>
      <div className="absolute bottom-[20%] left-0 -z-10 w-64 h-64 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full fill-secondary" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="50,0 100,100 0,100"></polygon>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-pure-white py-20 md:py-32 px-4 md:px-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="max-w-[800px] mx-auto flex flex-col items-center z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low border border-soft-border text-secondary font-semibold text-xs mb-8 shadow-sm">
            <GraduationCap className="h-4 w-4" />
            <span>Matrículas Abertas 2026</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Bem-vindo à E.E.B Prof. Benonívio João Martins
          </h1>

          {/* Paragraph */}
          <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-[640px] mb-10 font-medium leading-relaxed">
            Educação de excelência, focada na formação de cidadãos conscientes e preparados para o futuro. Um espaço dedicado ao desenvolvimento integral do aluno.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/sobre"
              className="bg-secondary text-white font-semibold px-8 py-3 rounded shadow-subtle hover:bg-opacity-95 transition-all text-center"
            >
              Conheça a Escola
            </Link>
            <a
              href={SCHOOL_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pure-white text-primary border border-primary font-semibold px-8 py-3 rounded shadow-subtle hover:bg-surface-container-low transition-all text-center flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Fale Conosco</span>
            </a>
          </div>

        </div>
      </section>

      {/* Quick Access (Bento Style Cards) */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 relative w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 - Editais APP */}
          <Link
            href="/app"
            className="bg-pure-white border border-soft-border rounded-xl p-8 shadow-subtle hover:shadow-md hover:border-secondary transition-all duration-300 group flex flex-col items-center text-center gap-4 outline-none"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-primary mb-2">Editais APP</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Consulte documentos, editais e publicações oficiais da Associação.
              </p>
            </div>
          </Link>

          {/* Card 2 - Contato */}
          <a
            href={SCHOOL_INFO.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pure-white border border-soft-border rounded-xl p-8 shadow-subtle hover:shadow-md hover:border-secondary transition-all duration-300 group flex flex-col items-center text-center gap-4 outline-none"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <PhoneCall className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-primary mb-2">Contato</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Fale com a secretaria, direção ou coordenação pedagógica via WhatsApp.
              </p>
            </div>
          </a>

          {/* Card 3 - Histórico */}
          <Link
            href="/sobre"
            className="bg-pure-white border border-soft-border rounded-xl p-8 shadow-subtle hover:shadow-md hover:border-secondary transition-all duration-300 group flex flex-col items-center text-center gap-4 outline-none"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <History className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-primary mb-2">Histórico</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Conheça a trajetória, o patrono e os valores da nossa instituição.
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* Classes Section */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 mb-16 relative w-full">
        <div className="mb-12 border-b border-soft-border pb-4 flex justify-between items-end">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">Nossas Turmas</h2>
            <p className="text-sm text-slate-500 font-medium">Estrutura curricular completa do básico ao avançado.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Category 1 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-lg md:text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <Smile className="h-5 w-5 text-secondary" />
              <span>Anos Iniciais</span>
            </h3>

            <a
              href="#"
              className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
            >
              <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                1º ao 5º Ano
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
            </a>

            <a
              href="#"
              className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
            >
              <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                Apoio Pedagógico
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
            </a>
          </div>

          {/* Category 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-lg md:text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-secondary" />
              <span>Ensino Fundamental II</span>
            </h3>

            <a
              href="#"
              className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
            >
              <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                6º ao 9º Ano
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
            </a>

            <a
              href="#"
              className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
            >
              <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                Projetos Extracurriculares
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
            </a>
          </div>

          {/* Category 3 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-lg md:text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <FlaskConical className="h-5 w-5 text-secondary" />
              <span>Ensino Médio</span>
            </h3>

            <a
              href="#"
              className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
            >
              <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                Novo Ensino Médio
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
            </a>

            <a
              href="#"
              className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
            >
              <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                Preparatório ENEM
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
