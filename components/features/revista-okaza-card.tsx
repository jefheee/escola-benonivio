'use client';

import { BookOpen, Download, FileText, CheckCircle2, Users } from 'lucide-react';

const EDITIONS = [
  {
    title: 'Edição nº 1 - Dezembro de 2019',
    year: '2019',
    driveUrl: 'https://drive.google.com/file/d/1wtcGAhPh-0BdFRwDy_LA6tQhBWi4XanI/view?usp=sharing',
    localUrl: '/assets/docs/Edição nº 1 - Dezembro de 2019.pdf',
    description: 'Relatos de experiência pedagógica e artigos construídos por docentes da EEB Benonívio.'
  },
  {
    title: 'Edição nº 2 - Dezembro de 2020',
    year: '2020',
    driveUrl: 'https://drive.google.com/file/d/1FARrAewCwUYO7BDsNm1vMZr233DaKgQh/view?usp=sharing',
    localUrl: '/assets/docs/Edição nº 2 - Dezembro de 2020.pdf',
    description: 'Coletânea de artigos e reflexões sobre educação em tempos de ensino remoto e híbrido.'
  }
];

export default function RevistaOkazaCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-subtle space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00185f]/10 text-[#00185f] rounded-2xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#bc0100] bg-[#bc0100]/10 px-2.5 py-0.5 rounded-md mb-1 border border-[#bc0100]/20">
              <span>Publicação Científico-Pedagógica</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-[#00185f]">
              Revista Okaza
            </h3>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-500 max-w-sm">
          Periódico anual organizado pela Associação de Pais e Professores (APP) com relatos de experiência docente.
        </div>
      </div>

      {/* Editions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EDITIONS.map((ed) => (
          <div key={ed.year} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-[#00185f]/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-[#00185f] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                  {ed.year}
                </span>
                <span className="text-[11px] font-bold text-slate-400">Edição Digital PDF</span>
              </div>
              <h4 className="font-bold text-[#00185f] text-base font-display">
                {ed.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {ed.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2">
              <a
                href={ed.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white hover:bg-slate-100 text-[#00185f] border border-slate-250 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Abrir no Google Drive</span>
              </a>
              <a
                href={ed.localUrl}
                download
                className="bg-[#00185f] hover:bg-[#00185f]/90 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                title="Download do PDF"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Baixar</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Guidelines Block */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#00185f] uppercase tracking-wider">
          <Users className="h-4 w-4" />
          <span>Regras de Submissão & Publicação</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Público:</strong> Professores(as) da escola. Alunos podem ser coautores.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Formatos:</strong> Relatos de Experiência Didática ou Seção &quot;Fala Mestre&quot; (artigos, ensaios, poesias).</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Avaliação Formativa:</strong> Revisão ortográfica coletiva, valorizando todas as escritas docentes.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
