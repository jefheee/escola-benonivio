import { FileText, Download, ExternalLink, Info, Users, HeartHandshake, ShieldCheck, FileSpreadsheet, FileArchive } from "lucide-react";
import { getDocumentosPublic, EscolaDocumentoPublic } from "@/lib/data/documentos";

export const dynamic = 'force-dynamic';

export default async function DocumentosPage() {
  const documentos = await getDocumentosPublic();

  // Group documents by category
  const categoriesMap: Record<string, EscolaDocumentoPublic[]> = {};
  
  documentos.forEach((doc) => {
    const cat = doc.categoria?.trim() || "Geral";
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(doc);
  });

  const categoryNames = Object.keys(categoriesMap).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-block bg-[#bc0100]/10 text-[#bc0100] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-[#bc0100]/15 mb-1">
          Transparência & Downloads
        </div>
        <h1 className="text-4xl font-extrabold text-[#00185f] font-display">
          APP & Documentos Públicos
        </h1>
        <div className="h-1 w-20 bg-[#bc0100] mx-auto rounded-full" />
        <p className="text-slate-655 font-semibold text-lg">
          Associação de Pais e Professores — CNPJ: 78.639.903/0001-04
        </p>
        <p className="text-slate-500 font-medium">
          A APP gere recursos e auxilia na manutenção da escola, promovendo parcerias entre famílias e a equipe escolar. Consulte abaixo editais, orçamentos, atas e guias de estudos.
        </p>
      </div>

      {/* Pillars Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Colegiado */}
        <div className="bg-white border border-slate-200 shadow-subtle rounded-2xl p-6 text-center space-y-3">
          <div className="p-3 bg-[#00185f]/5 text-[#00185f] w-fit mx-auto rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-[#00185f] font-display">Colegiado</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Representação democrática de pais, professores e comunidade no planejamento e tomadas de decisão da APP.
          </p>
        </div>

        {/* Card 2: Parcerias */}
        <div className="bg-white border border-slate-200 shadow-subtle rounded-2xl p-6 text-center space-y-3">
          <div className="p-3 bg-[#00185f]/5 text-[#bc0100] w-fit mx-auto rounded-xl">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-[#00185f] font-display">Parcerias</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Organização de eventos e captação de recursos para melhorias no espaço físico e digital da escola.
          </p>
        </div>

        {/* Card 3: Transparência */}
        <div className="bg-white border border-slate-200 shadow-subtle rounded-2xl p-6 text-center space-y-3">
          <div className="p-3 bg-[#00185f]/5 text-[#00185f] w-fit mx-auto rounded-xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-[#00185f] font-display">Transparência</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Prestação de contas e divulgação periódica dos relatórios e investimentos realizados para a comunidade.
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-5 flex items-start gap-4 max-w-4xl mx-auto shadow-sm">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm font-medium leading-relaxed">
          <span className="font-extrabold block mb-1">Repositório de Transparência Escolar</span>
          Todos os documentos públicos oficiais da APP e da direção da escola (incluindo editais de chamada pública, atas administrativas, prestações de contas oficiais e o Guia de Estudos do estudante) são cadastrados aqui pela secretaria.
        </div>
      </div>

      {/* Dynamic Categorized Documents Section */}
      <div className="space-y-12">
        {categoryNames.length > 0 ? (
          categoryNames.map((category) => {
            const docs = categoriesMap[category];
            return (
              <div key={category} className="space-y-5">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-display font-extrabold text-xl text-[#00185f] flex items-center gap-2">
                    <FileArchive className="h-5.5 w-5.5 text-[#bc0100]" />
                    <span>{category}</span>
                  </h3>
                  <span className="text-[10px] font-extrabold bg-[#00185f]/5 text-[#00185f] px-3 py-1 rounded-full border border-[#00185f]/15">
                    {docs.length} {docs.length === 1 ? "Arquivo" : "Arquivos"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {docs.map((doc) => {
                    const isExcel = doc.url_arquivo.toLowerCase().includes(".xls") || doc.url_arquivo.toLowerCase().includes(".xlsx");

                    return (
                      <div
                        key={doc.id}
                        className="bg-white border border-slate-200 hover:border-[#00185f]/30 rounded-2xl p-5 shadow-subtle flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {isExcel ? (
                              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                                <FileSpreadsheet className="h-4.5 w-4.5" />
                              </div>
                            ) : (
                              <div className="p-2 bg-red-50 text-[#bc0100] rounded-lg">
                                <FileText className="h-4.5 w-4.5" />
                              </div>
                            )}
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">
                              {new Date(doc.created_at).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-805 text-sm leading-snug group-hover:text-[#bc0100] transition-colors line-clamp-2">
                            {doc.titulo}
                          </h4>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <a
                            href={doc.url_arquivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-3 rounded-lg border border-slate-200 text-xs transition-colors outline-none"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Visualizar</span>
                          </a>
                          <a
                            href={doc.url_arquivo}
                            download
                            className="flex-1 flex items-center justify-center gap-1.5 bg-[#bc0100] hover:bg-[#bc0100]/90 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors outline-none shadow-sm"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Baixar</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-250 rounded-2xl">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-400">Nenhum edital ou documento disponível no momento.</p>
          </div>
        )}
      </div>

    </div>
  );
}
