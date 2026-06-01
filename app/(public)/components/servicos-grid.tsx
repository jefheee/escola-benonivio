'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  UserPlus, 
  ShieldCheck, 
  Utensils, 
  X, 
  Info, 
  CheckCircle, 
  ExternalLink 
} from 'lucide-react';

export default function ServicosGrid() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 w-full text-left">
      {/* Section Header */}
      <div className="mb-8 border-b border-slate-200 pb-3">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Serviços & Portais Governamentais
        </h2>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Estudante Online */}
        <a
          href="https://estudanteonline.sed.sc.gov.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-slate-250 hover:border-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-[210px] outline-none"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                <span>Estudante Online</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-3">
                Acesse boletins, notas, frequência e acompanhe o rendimento letivo no sistema oficial do Estado de SC.
              </p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-wider flex items-center gap-1">
            <span>Acessar boletim</span>
            <span>→</span>
          </div>
        </a>

        {/* Card 2: Matrícula Online */}
        <div
          onClick={openModal}
          className="bg-white border border-slate-250 hover:border-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-[210px] cursor-pointer outline-none"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform shrink-0">
              <UserPlus className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base">
                Matrícula Online 2026
              </h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-3">
                Saiba como funciona o processo de matrícula e transferência da rede pública estadual de Santa Catarina.
              </p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-wider flex items-center gap-1">
            <span>Ver orientações</span>
            <span>→</span>
          </div>
        </div>

        {/* Card 3: Professor Online */}
        <a
          href="https://professoronline.sed.sc.gov.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-slate-250 hover:border-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-[210px] outline-none"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                <span>Professor Online</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-3">
                Acesso restrito aos docentes para lançamento de conteúdos, planejamento letivo e frequência escolar.
              </p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-wider flex items-center gap-1">
            <span>Diário de classe</span>
            <span>→</span>
          </div>
        </a>

        {/* Card 4: Cardápio Escolar */}
        <Link
          href="/cardapio"
          className="bg-white border border-slate-250 hover:border-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-[210px] outline-none"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform shrink-0">
              <Utensils className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base">
                Cardápio da Merenda
              </h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-3">
                Acompanhe o cronograma semanal de alimentação escolar planejada por nutricionistas oficiais da SED/SC.
              </p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-wider flex items-center gap-1">
            <span>Ver alimentação</span>
            <span>→</span>
          </div>
        </Link>

      </div>

      {/* Matricula Info Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn text-left">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg text-slate-950">
                Diretrizes de Matrícula Online 2026
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Intro Warning */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-3 text-xs text-slate-600 font-semibold leading-relaxed">
                <Info className="h-5 w-5 text-slate-800 shrink-0 mt-0.5" />
                <div>
                  O processo de matrícula para novos alunos e transferências na rede estadual de Santa Catarina para o ano letivo de 2026 segue o fluxo oficial de **duas etapas obrigatórias**.
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs shrink-0 select-none">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">Etapa 1: Inscrição Online no Portal do Estado</h4>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                      O responsável deve acessar o portal de matrículas da SED/SC usando os dados da conta unificada **gov.br**. Selecione a cidade de **Palhoça** e a unidade **EEB Professor Benonívio João Martins** para efetuar a pré-matrícula no período determinado pelo cronograma estadual.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs shrink-0 select-none">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">Etapa 2: Validação Física na Secretaria (Presencial)</h4>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                      Após a confirmação online da vaga, compareça presencialmente à secretaria da escola no bairro **Brejaru I** para entregar e assinar a documentação física original necessária (RG/CPF do aluno e responsável, comprovante de residência, histórico letivo e cartão de vacinação atualizado).
                    </p>
                  </div>
                </div>
              </div>

              {/* Document list info */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Documentos Obrigatórios:</span>
                <ul className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>RG e CPF do aluno</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>RG e CPF do responsável</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Histórico Escolar</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Cartão de Vacina</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Comprovante Residencial</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Tipo Sanguíneo do aluno</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={closeModal}
                className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors outline-none"
              >
                Entendi, Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
