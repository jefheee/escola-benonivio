import Link from "next/link";
import {
  GraduationCap,
  MessageSquare,
  FileText,
  PhoneCall,
  History,
  BookOpen,
  Users,
  Award,
  Globe,
  Smile,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { getAvisosDestaqueHome } from "@/lib/data/avisos";
import { getPaginaConteudoPublic } from "@/lib/data/paginas";
import AvisosCarousel from "@/components/features/avisos-carousel";
import WhatsAppTrigger from "@/components/features/whatsapp-trigger";
import ServicosGrid from "./components/servicos-grid";

export const dynamic = 'force-dynamic';

const ICON_MAP = {
  FileText: FileText,
  PhoneCall: PhoneCall,
  History: History,
  BookOpen: BookOpen,
  Users: Users,
  Award: Award,
  Globe: Globe,
  Smile: Smile,
  HelpCircle: HelpCircle,
};

interface DynamicCard {
  icone_nome: string;
  titulo: string;
  descricao: string;
  link_url: string;
}

interface HomeHeroSettings {
  mostrar_hero: boolean;
  mostrar_avisos: boolean;
  mostrar_acessos_rapidos: boolean;
  mostrar_turmas: boolean;
  badge: string;
  titulo: string;
  paragrafo: string;
  bento_titulo: string;
  turmas_titulo: string;
  turmas_subtitulo: string;
  cards_dinamicos: DynamicCard[];
}

const DEFAULT_HOME_HERO: HomeHeroSettings = {
  mostrar_hero: true,
  mostrar_avisos: true,
  mostrar_acessos_rapidos: true,
  mostrar_turmas: true,
  badge: 'Matrículas Abertas 2026',
  titulo: 'Bem-vindo à E.E.B Prof. Benonívio João Martins',
  paragrafo: 'Educação de excelência, focada na formação de cidadãos conscientes e preparados para o futuro. Um espaço dedicado ao desenvolvimento integral do aluno.',
  bento_titulo: 'Acesso Rápido',
  turmas_titulo: 'Nossas Turmas',
  turmas_subtitulo: 'Estrutura curricular completa do básico ao avançado.',
  cards_dinamicos: [
    { icone_nome: "FileText", titulo: "Editais APP", descricao: "Consulte documentos, editais e publicações oficiais da Associação.", link_url: "/sobre" },
    { icone_nome: "PhoneCall", titulo: "Contato", descricao: "Fale com a secretaria, direção ou coordenação pedagógica via WhatsApp.", link_url: "#contato" },
    { icone_nome: "History", titulo: "Histórico", descricao: "Conheça a trajetória, o patrono e os valores da nossa instituição.", link_url: "/sobre" }
  ]
};

export default async function Home() {
  const featuredNotices = await getAvisosDestaqueHome();
  const heroContentRaw = await getPaginaConteudoPublic('home_hero');
  
  let heroContent = DEFAULT_HOME_HERO;
  if (heroContentRaw?.conteudo_html) {
    try {
      heroContent = { ...DEFAULT_HOME_HERO, ...JSON.parse(heroContentRaw.conteudo_html) };
    } catch (e) {
      console.error('Erro ao parsear home_hero:', e);
    }
  }

  // Fallback for cards array if not present in saved json
  const cards = heroContent.cards_dinamicos || DEFAULT_HOME_HERO.cards_dinamicos;

  return (
    <div className="bg-pure-white text-slate-text min-h-screen flex flex-col relative overflow-hidden w-full">

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
      {heroContent.mostrar_hero && (
        <section className="w-full bg-pure-white py-16 md:py-24 px-4 md:px-8 flex flex-col items-center justify-center text-center relative overflow-hidden border-b border-soft-border">
          <div className="max-w-[800px] mx-auto flex flex-col items-center z-10">

            {/* Badge */}
            {heroContent.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low border border-soft-border text-secondary font-semibold text-xs mb-8 shadow-sm">
                <GraduationCap className="h-4 w-4" />
                <span>{heroContent.badge}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              {heroContent.titulo}
            </h1>

            {/* Paragraph */}
            <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-[640px] mb-10 font-medium leading-relaxed">
              {heroContent.paragrafo}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/sobre"
                className="bg-secondary text-white font-semibold px-8 py-3 rounded shadow-subtle hover:bg-opacity-95 transition-all text-center"
              >
                Conheça a Escola
              </Link>
              <WhatsAppTrigger
                className="bg-pure-white text-primary border border-primary font-semibold px-8 py-3 rounded shadow-subtle hover:bg-surface-container-low transition-all text-center flex items-center justify-center gap-2 outline-none"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Fale Conosco</span>
              </WhatsAppTrigger>
            </div>

          </div>
        </section>
      )}

      {/* Mural de Avisos Carrossel (Abaixo do Hero, flutuante bg-[#0B1B42]) */}
      {heroContent.mostrar_avisos && featuredNotices.length > 0 && (
        <section className="container mx-auto my-12 rounded-[2rem] bg-[#0B1B42] p-8 md:p-12 text-white shadow-2xl">
          <AvisosCarousel avisos={featuredNotices} />
        </section>
      )}

      {/* Centralized State Government Services Grid */}
      <ServicosGrid />

      {/* Quick Access (Bento Style Cards from CMS) */}
      {heroContent.mostrar_acessos_rapidos && cards.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 relative w-full">
          {heroContent.bento_titulo && (
            <div className="mb-8 border-b border-soft-border pb-3">
              <h2 className="font-display text-2xl font-bold text-primary">{heroContent.bento_titulo}</h2>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => {
              const IconComponent = ICON_MAP[card.icone_nome as keyof typeof ICON_MAP] || HelpCircle;
              const isWhatsApp = card.link_url === '#contato' || card.link_url.startsWith('whatsapp');

              const cardContent = (
                <>
                  <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-secondary group-hover:scale-110 transition-transform mx-auto">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-primary mb-2">{card.titulo || "Card"}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {card.descricao}
                    </p>
                  </div>
                </>
              );

              if (isWhatsApp) {
                return (
                  <WhatsAppTrigger
                    key={index}
                    className="bg-pure-white border border-soft-border rounded-xl p-8 shadow-subtle hover:shadow-md hover:border-secondary transition-all duration-300 group flex flex-col items-center text-center gap-4 outline-none text-slate-text cursor-pointer"
                  >
                    {cardContent}
                  </WhatsAppTrigger>
                );
              }

              return (
                <Link
                  key={index}
                  href={card.link_url || "/"}
                  className="bg-pure-white border border-soft-border rounded-xl p-8 shadow-subtle hover:shadow-md hover:border-secondary transition-all duration-300 group flex flex-col items-center text-center gap-4 outline-none"
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Classes Section */}
      {heroContent.mostrar_turmas && (
        <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 mb-16 relative w-full">
          <div className="mb-12 border-b border-soft-border pb-4 flex justify-between items-end">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">
                {heroContent.turmas_titulo || "Nossas Turmas"}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {heroContent.turmas_subtitulo || "Estrutura curricular completa do básico ao avançado."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Category 1 */}
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-lg md:text-xl font-bold text-primary flex items-center gap-2 mb-2">
                <Smile className="h-5 w-5 text-secondary" />
                <span>Anos Iniciais</span>
              </h3>

              <Link
                href="/turmas"
                className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
              >
                <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                  1º ao 5º Ano
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
              </Link>

              <Link
                href="/turmas"
                className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
              >
                <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                  Apoio Pedagógico
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
              </Link>
            </div>

            {/* Category 2 */}
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-lg md:text-xl font-bold text-primary flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                <span>Ensino Fundamental II</span>
              </h3>

              <Link
                href="/turmas"
                className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
              >
                <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                  6º ao 9º Ano
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
              </Link>

              <Link
                href="/turmas"
                className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
              >
                <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                  Projetos Extracurriculares
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
              </Link>
            </div>

            {/* Category 3 */}
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-lg md:text-xl font-bold text-primary flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-secondary" />
                <span>Ensino Médio</span>
              </h3>

              <Link
                href="/turmas"
                className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
              >
                <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                  Novo Ensino Médio
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
              </Link>

              <Link
                href="/turmas"
                className="bg-pure-white border border-soft-border rounded-lg p-5 shadow-subtle flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group outline-none"
              >
                <span className="text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                  Preparatório ENEM
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-secondary transition-colors" />
              </Link>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
