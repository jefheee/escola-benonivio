import { Users, HeartHandshake, ShieldCheck, Download, ExternalLink, FileText, Info, BookOpen } from "lucide-react";

interface PublicDoc {
  title: string;
  badge: string;
  localPath: string;
  driveLink: string;
}

const DOCUMENTOS_PUBLICOS: PublicDoc[] = [
  {
    title: "Ata e Estatuto da APP (Assembleia Ordinária de 01/04/2021)",
    badge: "Edital 2021",
    localPath: "/assets/docs/ATA DA ASSEMBLEIA ORDINÁRIA DE 01_04_2021.docx",
    driveLink: "https://docs.google.com/document/d/1xupUEnVYeAAESvYTyKiTn1ubqPa0a9F74k5CSemWAYI/edit?usp=sharing"
  },
  {
    title: "Orçamento de Preços Oficial",
    badge: "Orçamento",
    localPath: "/assets/docs/ORÇAMENTO.docx",
    driveLink: "https://docs.google.com/document/d/1nt_SLumaazmFzdfw7KhB_isDlFwvrthf/edit?usp=sharing&ouid=104645576181430987058&rtpof=true&sd=true"
  },
  {
    title: "Solicitação de Recurso para Assistência ao Estudante",
    badge: "Auxílio Estudantil",
    localPath: "/assets/docs/SOLICITAÇÃO DE RECURSO PARA ASSISTÊNCIA AO ESTUDANTE.docx",
    driveLink: "https://docs.google.com/document/d/1t41U_R7weyTaxsQDxKTGuhBAEhO5_6lc4OKUai9sN_U/edit?usp=sharing"
  }
];

interface RevistaEdicao {
  title: string;
  subtitle: string;
  badge: string;
  localPath: string;
  driveLink: string;
}

const EDICOES_REVISTA: RevistaEdicao[] = [
  {
    title: "Revista Okaza - Edição nº 1",
    subtitle: "Dezembro de 2019",
    badge: "Edição 01 - 2019",
    localPath: "/assets/docs/Edição nº 1 - Dezembro de 2019.pdf",
    driveLink: "https://drive.google.com/file/d/1wtcGAhPh-0BdFRwDy_LA6tQhBWi4XanI/view?usp=sharing"
  },
  {
    title: "Revista Okaza - Edição nº 2",
    subtitle: "Dezembro de 2020",
    badge: "Edição 02 - 2020",
    localPath: "/assets/docs/Edição nº 2 - Dezembro de 2020.pdf",
    driveLink: "https://drive.google.com/file/d/1FARrAewCwUYO7BDsNm1vMZr233DaKgQh/view?usp=sharing"
  }
];

export default function APPPage() {
  return (
    <div className="py-6 space-y-16">
      
      {/* ==================== SEÇÃO ATIVA (CONTEÚDO ATIVO) ==================== */}
      <section className="space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-emerald-200 mb-1">
            Conteúdo Ativo
          </div>
          <h1 className="text-4xl font-extrabold text-primary font-display">
            APP - Associação de Pais e Professores
          </h1>
          <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
          <p className="text-slate-600 font-semibold text-lg">
            CNPJ: 78.639.903/0001-04
          </p>
          <p className="text-slate-600 font-medium">
            A Associação de Pais e Professores gere os recursos e auxilia ativamente na manutenção da escola, promovendo parcerias entre as famílias e a equipe escolar.
          </p>
        </div>

        {/* Colegiado Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Colegiado */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 text-center space-y-3">
            <div className="p-3 bg-[#1B2F78]/10 text-primary w-fit mx-auto rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-primary font-display">Colegiado</h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Representação democrática de pais, professores e comunidade no planejamento e tomadas de decisão da APP.
            </p>
          </div>

          {/* Card 2: Parcerias */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 text-center space-y-3">
            <div className="p-3 bg-[#1B2F78]/10 text-primary w-fit mx-auto rounded-xl">
              <HeartHandshake className="h-6 w-6 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-primary font-display">Parcerias</h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Organização de eventos e captação de recursos para melhorias no espaço físico e digital da escola.
            </p>
          </div>

          {/* Card 3: Transparência */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 text-center space-y-3">
            <div className="p-3 bg-[#1B2F78]/10 text-primary w-fit mx-auto rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-primary font-display">Transparência</h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Prestação de contas e divulgação periódica dos relatórios e investimentos realizados para a comunidade.
            </p>
          </div>

        </div>
      </section>

      {/* ==================== SEÇÃO HISTÓRICA (ARQUIVO HISTÓRICO) ==================== */}
      <section className="border-t border-slate-200 pt-12 space-y-10">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-block bg-amber-100 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-amber-200">
            Arquivo Histórico
          </div>
          <h2 className="text-3xl font-extrabold text-primary font-display">
            Acervo & Documentos de Gestões Anteriores
          </h2>
          <p className="text-slate-600 font-medium">
            Repositório de documentos oficiais, atas administrativas e publicações de gestões anteriores da APP.
          </p>
        </div>

        {/* Info Warning Card - Resgate Histórico */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 max-w-4xl">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm font-medium leading-relaxed">
            <span className="font-extrabold block mb-1">Aviso de Resgate Histórico</span>
            Esta seção disponibiliza documentos oficiais, atas e produções editoriais passadas da APP. O acervo de documentos, a Revista Okaza e o Guia de Estudos constituem um resgate histórico da memória escolar e administrativa.
          </div>
        </div>

        {/* Documentos Públicos Section */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-4">
            <div className="flex items-center space-x-3 text-primary">
              <FileText className="h-6 w-6 text-secondary" />
              <h3 className="text-2xl font-bold font-display">Documentos Públicos (2021)</h3>
            </div>
            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 uppercase">
              [ACERVO GESTÃO 2021]
            </span>
          </div>

          <p className="text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
            Consulte as atas de assembleias e modelos de documentos operacionais da época. Você pode visualizar o documento online no Google Docs ou baixar para o seu computador:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DOCUMENTOS_PUBLICOS.map((doc) => (
              <div key={doc.title} className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="inline-block bg-[#1B2F78]/10 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                    {doc.badge}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm leading-relaxed">{doc.title}</h4>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href={doc.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-3 rounded-lg border border-slate-200 text-xs transition-colors outline-none"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Visualizar Online</span>
                  </a>
                  <a
                    href={doc.localPath}
                    download
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors outline-none"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Baixar Arquivo</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revista Okaza & Guia de Estudos Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Revista Okaza */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-2">
                <div className="flex items-center space-x-3 text-primary">
                  <BookOpen className="h-6 w-6 text-secondary" />
                  <h3 className="text-2xl font-bold font-display">Revista Okaza</h3>
                </div>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 uppercase">
                  [RELATOS DOCENTES 2019-2020]
                </span>
              </div>
              
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                A **Revista Okaza** foi idealizada pela equipe escolar para registrar e divulgar os relatos de experiências docentes, projetos pedagógicos inovadores e atividades interdisciplinares.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl space-y-1 text-xs text-slate-500 font-bold border border-slate-100">
                <span className="text-[#1B2F78] uppercase block text-[10px] mb-1">Organizadores da época</span>
                <p>Prof. Djeison Machado — <a href="mailto:680450@profe.sed.sc.gov.br" className="underline hover:text-primary">680450@profe.sed.sc.gov.br</a></p>
                <p>Profª. Vanessa Souza Pereira — <a href="mailto:700596@profe.sed.sc.gov.br" className="underline hover:text-primary">700596@profe.sed.sc.gov.br</a></p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {EDICOES_REVISTA.map((ed) => (
                  <div key={ed.title} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 bg-white">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#F90000] uppercase block">{ed.badge}</span>
                      <span className="font-bold text-slate-900 text-sm block mt-1">{ed.title}</span>
                      <span className="text-xs text-slate-500 font-semibold">{ed.subtitle}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-2">
                      <a
                        href={ed.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-1.5 px-3 rounded-lg border border-slate-200 text-xs transition-colors outline-none"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Ver Drive</span>
                      </a>
                      <a
                        href={ed.localPath}
                        download
                        className="w-full flex items-center justify-center gap-1.5 bg-primary hover:opacity-90 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors outline-none"
                      >
                        <Download className="h-3 w-3" />
                        <span>Baixar PDF</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Guia de Estudos Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-2">
                <div className="flex items-center space-x-3 text-primary">
                  <FileText className="h-6 w-6 text-secondary" />
                  <h3 className="text-2xl font-bold font-display">Guia de Estudos</h3>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase">
                  [SUPORTE AO ESTUDANTE]
                </span>
              </div>

              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                O **Guia de Estudos** foi desenvolvido pelos docentes como ferramenta complementar de apoio à aprendizagem. O guia oferece trilhas de revisão de disciplinas básicas e roteiros de autoestudo para os alunos do Ensino Fundamental e Ensino Médio.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm">Ficha Técnica do Material:</h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Elaborado de forma interdisciplinar para assegurar o suporte durante os períodos de distanciamento e autoestudo. Arquivo compilado em formato PDF público.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
              <a
                href="https://drive.google.com/file/d/1YyCzhr5reISch4bqPsHZbAkQZB8bLpf7/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl border border-slate-200 text-xs transition-colors outline-none"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Ver Guia no Drive</span>
              </a>
              <a
                href="/assets/docs/GUIA DE ESTUDOS.pdf"
                download
                className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors outline-none"
              >
                <Download className="h-4 w-4" />
                <span>Baixar Guia (PDF)</span>
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
