'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  History as HistoryIcon,
  BookOpen,
  Users,
  MapPin,
  FileText,
  Download,
  ExternalLink,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Award,
  Milestone,
  CheckCircle
} from 'lucide-react';
import { EscolaDocumentoPublic } from '@/lib/data/documentos';
import { EscolaAcervoItemPublic } from '@/lib/data/acervo';
import { SCHOOL_INFO } from '@/lib/constants';

interface SobreHubProps {
  documentos: EscolaDocumentoPublic[];
  fotosHistoricas: EscolaAcervoItemPublic[];
}

type TabType = 'historico' | 'ppp' | 'organizacao' | 'ambientes';

export default function SobreHub({ documentos, fotosHistoricas }: SobreHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('historico');
  const [selectedPhotoItem, setSelectedPhotoItem] = useState<EscolaAcervoItemPublic | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Filter documents
  const pppDocs = documentos.filter(doc => {
    const title = doc.titulo.toLowerCase();
    const cat = (doc.categoria || '').toLowerCase();
    return title.includes('ppp') || cat.includes('ppp');
  });

  const orgDocs = documentos.filter(doc => {
    const title = doc.titulo.toLowerCase();
    const cat = (doc.categoria || '').toLowerCase();
    const keywords = ['app', 'ata', 'edital', 'prestação de contas', 'prestaçao de contas', 'conselho', 'regulamento', 'grêmio', 'gremio'];
    const isPpp = title.includes('ppp') || cat.includes('ppp');
    const isCardapio = title.includes('cardápio') || title.includes('cardapio') || cat.includes('cardápio') || cat.includes('cardapio');

    return !isPpp && !isCardapio && (
      keywords.some(kw => title.includes(kw) || cat.includes(kw)) ||
      (!cat && !title.includes('ppp')) ||
      cat === 'geral' || cat === 'teste'
    );
  });

  const handleOpenPhoto = (item: EscolaAcervoItemPublic) => {
    setSelectedPhotoItem(item);
    setActivePhotoIdx(0);
  };

  const handleNextPhoto = (e: React.MouseEvent, max: number) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % max);
  };

  const handlePrevPhoto = (e: React.MouseEvent, max: number) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev - 1 + max) % max);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'historico':
        return (
          <div className="space-y-12 animate-fadeIn text-left">
            {/* História e Território */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-display font-extrabold text-2xl text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <Milestone className="h-6 w-6 text-slate-700 shrink-0" />
                  <span>Nossa História (O Brejaru)</span>
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Fundada gradativamente nos anos 80 e formalizada pela <span className="font-bold text-slate-900">Portaria Nº 47 de 1984</span>, a escola cresceu lado a lado com a urbanização e estruturação da comunidade Frei Damião e arredores.
                </p>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Como a primeira grande presença do Estado na região do Brejaru, a E.E.B. Professor Benonívio João Martins atuou historicamente não apenas como local de ensino, mas como um verdadeiro vetor de mobilidade social, proteção coletiva e centro de cidadania. A escola orgulha-se de ter caminhado ao lado de lutas históricas da comunidade, simbolizadas em marcos como a Carta do Brejaru.
                </p>
              </div>

              {/* Destaque Bio Patrono */}
              <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  <Award className="h-3.5 w-3.5" />
                  <span>Patrono da Escola</span>
                </div>
                <div className="relative w-36 h-48 mx-auto border border-slate-350 rounded-2xl overflow-hidden shadow-sm bg-slate-200">
                  <Image
                    src="/assets/images/professor-benonivio-joao-martins.jpeg"
                    alt="Professor Benonívio João Martins"
                    fill
                    className="object-cover grayscale"
                  />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="font-bold text-slate-900 text-base">Prof. Benonívio João Martins</h4>
                  <p className="text-[11px] text-slate-500 font-bold">(1933 — 1978)</p>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed text-center">
                  Educador normalista e administrador escolar formado pela UDESC, dedicou toda a sua vida à educação na Grande Florianópolis.
                </p>
              </div>
            </div>

            {/* Galeria de Fotos Históricas Integrada (Masonry-like Grid) */}
            {fotosHistoricas.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-display font-extrabold text-2xl text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <ImageIcon className="h-6 w-6 text-slate-700 shrink-0" />
                  <span>Galeria de Memórias & Acervo Histórico</span>
                </h3>
                <p className="text-sm text-slate-500 font-medium max-w-3xl">
                  Registros fotográficos restaurados que contam momentos marcantes da escola e da comunidade ao longo das últimas décadas. Clique em um álbum para navegar.
                </p>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                  {fotosHistoricas.map((item) => {
                    const firstImage = (item.imagens && item.imagens.length > 0) ? item.imagens[0] : null;
                    const photoCount = item.imagens?.length || 0;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenPhoto(item)}
                        className="break-inside-avoid bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-800 transition-all duration-300 flex flex-col cursor-pointer group mb-6"
                      >
                        {firstImage && (
                          <div className="relative overflow-hidden aspect-video bg-slate-100 border-b border-slate-150">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={firstImage}
                              alt={item.titulo}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-103"
                            />
                            {photoCount > 1 && (
                              <span className="absolute bottom-3 right-3 bg-black/75 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                                +{photoCount - 1} Fotos
                              </span>
                            )}
                          </div>
                        )}
                        <div className="p-5 space-y-2.5">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                            <span>{item.categoria}</span>
                            <span className="bg-slate-100 border border-slate-250 px-2 py-0.5 rounded-full text-slate-700 font-extrabold">{item.ano}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:underline">
                            {item.titulo}
                          </h4>
                          {item.descricao && (
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 font-medium">
                              {item.descricao}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'ppp':
        return (
          <div className="space-y-10 animate-fadeIn text-left">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-display font-extrabold text-2xl text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-slate-700 shrink-0" />
                  <span>Proposta Pedagógica & PPP</span>
                </h3>
                <p className="text-slate-655 font-medium leading-relaxed text-sm sm:text-base">
                  O Projeto Político Pedagógico (PPP) é a identidade viva da escola. Ele estabelece diretrizes, compromissos e metas de ensino com foco na inclusão social, no protagonismo juvenil e na formação cidadã. Nossas ações didáticas visam o pleno desenvolvimento humano dos estudantes e a inserção ativa no mundo do trabalho e nas universidades.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Inovação e Reconhecimento</span>
                  <h4 className="font-bold text-slate-950 text-sm">Projeto de Matemática Vencedor</h4>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    Durante a pandemia de COVID-19, nossos professores desenvolveram o projeto de &quot;Videoaulas de Matemática&quot;, garantindo a continuidade do aprendizado e conquistando o prêmio de destaque na 36ª Feira Catarinense de Matemática.
                  </p>
                </div>
              </div>

              {/* IDEB Indicators */}
              <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-5">
                <h4 className="font-display font-extrabold text-base text-slate-900 border-b pb-2">Indicadores e Avanços</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-200 text-slate-800 rounded-xl font-bold font-display text-xl">
                      95%
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-800 block">Taxa de Aprovação</span>
                      <span className="text-xs text-slate-500 font-semibold">Anos iniciais letivos</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-200 text-slate-800 rounded-xl font-bold font-display text-xl">
                      SAEB
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-800 block">Evolução no Fluxo</span>
                      <span className="text-xs text-slate-500 font-semibold">Crescimento constante no IDEB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PPP Downloads List */}
            <div className="space-y-5">
              <h4 className="font-display font-bold text-lg text-slate-900">Documentos Oficiais do PPP</h4>
              {pppDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pppDocs.map(doc => (
                    <div key={doc.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-800 transition-all flex items-center justify-between shadow-sm group">
                      <div className="flex items-center gap-3 truncate pr-4">
                        <div className="p-2 bg-slate-100 text-slate-700 rounded-lg shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-slate-850 text-sm block group-hover:underline truncate">{doc.titulo}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">PDF / Cadastrado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <a
                          href={doc.url_arquivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
                          title="Visualizar"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a
                          href={doc.url_arquivo}
                          download
                          className="p-2 bg-slate-900 hover:bg-black text-white rounded-lg transition-colors"
                          title="Baixar"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 border border-dashed border-slate-200 text-center rounded-xl text-xs font-semibold text-slate-450">
                  Nenhum edital ou documento de diretrizes pedagógicas publicado no momento.
                </div>
              )}
            </div>
          </div>
        );

      case 'organizacao':
        return (
          <div className="space-y-10 animate-fadeIn text-left">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-display font-extrabold text-2xl text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <Users className="h-6 w-6 text-slate-700 shrink-0" />
                  <span>Gestão Democrática e Colegiada</span>
                </h3>
                <p className="text-slate-655 font-medium leading-relaxed text-sm">
                  Na EEB Professor Benonívio João Martins, a tomada de decisões é compartilhada. A Associação de Pais e Professores (APP) coordena o conselho comunitário, atuando ativamente na aplicação transparente das verbas e na manutenção predial e pedagógica. Além disso, o Conselho Deliberativo garante assembleias democráticas mensais para planejamento.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Democratização</span>
                    <h5 className="font-bold text-slate-900 text-xs">Revista Okaza</h5>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Projeto e periódico oficial da escola que fomenta a escrita criativa, publicação científica e democratização da autoria escolar.
                    </p>
                  </div>
                  <div className="border border-slate-200 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Esporte Feminino</span>
                    <h5 className="font-bold text-slate-900 text-xs">Futsal & Atletismo no JESC</h5>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Tradição consolidada na representação do atletismo e futsal nos Jogos Escolares de SC (JESC) com dezenas de conquistas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Organization Data Card */}
              <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                <h4 className="font-display font-extrabold text-base text-slate-900 border-b pb-2">Colegiados Ativos</h4>
                <ul className="space-y-3 text-xs font-semibold text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Direção Geral e Pedagógica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Associação de Pais e Professores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Conselho Deliberativo Escolar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Grêmio Estudantil Oficial</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* APP & Administrative documents list (Eliminates old page) */}
            <div className="space-y-5">
              <h4 className="font-display font-bold text-lg text-slate-900">Editais, Atas e Prestações de Contas</h4>
              <p className="text-xs text-slate-500 font-medium">
                Transparência total na aplicação de recursos. Confira os relatórios emitidos pela APP e pela secretaria.
              </p>

              {orgDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orgDocs.map(doc => (
                    <div key={doc.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-800 transition-all flex items-center justify-between shadow-sm group">
                      <div className="flex items-center gap-3 truncate pr-4">
                        <div className="p-2 bg-slate-100 text-slate-700 rounded-lg shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-slate-850 text-sm block group-hover:underline truncate">{doc.titulo}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">
                            {doc.categoria || 'APP'} / Cadastrado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <a
                          href={doc.url_arquivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
                          title="Visualizar"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a
                          href={doc.url_arquivo}
                          download
                          className="p-2 bg-slate-900 hover:bg-black text-white rounded-lg transition-colors"
                          title="Baixar"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 border border-dashed border-slate-200 text-center rounded-xl text-xs font-semibold text-slate-450">
                  Nenhuma ata ou prestação de contas cadastrada recentemente.
                </div>
              )}
            </div>
          </div>
        );

      case 'ambientes':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn text-left">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-display font-extrabold text-2xl text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-slate-700 shrink-0" />
                <span>Infraestrutura & Ambientes</span>
              </h3>
              <p className="text-slate-655 font-medium leading-relaxed text-sm">
                Revitalizada estruturalmente de forma ampla em 2007 (investimento estadual superior a R$ 1 milhão), a escola Professor Benonívio João Martins conta com uma estrutura completa de salas amplas e arejadas para atender cerca de 1.300 alunos em três turnos letivos:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                <li className="flex items-start gap-2.5 p-3.5 bg-slate-50 border rounded-xl">
                  <div className="p-1 bg-slate-200 text-slate-800 rounded mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block">Quadra Poliesportiva</span>
                    <span>Espaço dedicado às aulas de educação física e competições esportivas regionais.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 p-3.5 bg-slate-50 border rounded-xl">
                  <div className="p-1 bg-slate-200 text-slate-800 rounded mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block">Pátios Pavimentados</span>
                    <span>Áreas externas seguras para recreação e encontros da comunidade escolar.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 p-3.5 bg-slate-50 border rounded-xl">
                  <div className="p-1 bg-slate-200 text-slate-800 rounded mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block">Laboratórios de Suporte</span>
                    <span>Salas adaptadas para pesquisas de ciências e informática conectadas por rede interna.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 p-3.5 bg-slate-50 border rounded-xl">
                  <div className="p-1 bg-slate-200 text-slate-800 rounded mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block">Refeitório Espaçoso</span>
                    <span>Local adaptado e monitorado pela merenda escolar saudável do dia a dia.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Google Map & Address Details */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                <h4 className="font-display font-extrabold text-base text-slate-900 border-b pb-2">Localização no Brejaru</h4>
                <div className="space-y-1.5 text-xs text-slate-600 font-semibold leading-relaxed">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Endereço da Secretaria</span>
                  <p className="font-bold text-slate-800 leading-snug">
                    {SCHOOL_INFO.address.street}, {SCHOOL_INFO.address.number}<br />
                    {SCHOOL_INFO.address.neighborhood} - {SCHOOL_INFO.address.city}/{SCHOOL_INFO.address.state}<br />
                    CEP: {SCHOOL_INFO.address.zipCode}
                  </p>
                </div>

                <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1767.54989144233!2d-48.667191048476354!3d-27.621426117409058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9527358fbaaaaaab%3A0xa4a4e87166b392b7!2sEeb%20Prof%20Benonivio%20Joao%20Martins!5e0!3m2!1spt-BR!2sbr!4v1779936658693!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa da Escola"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-12">
      {/* Grayscale Navigation Tabs */}
      <div className="flex flex-wrap justify-center border-b border-slate-200 pb-2 gap-2">
        <button
          onClick={() => setActiveTab('historico')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider outline-none transition-all ${activeTab === 'historico'
            ? 'border-slate-800 text-slate-900 bg-slate-50'
            : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
            }`}
        >
          <HistoryIcon className="h-4 w-4 shrink-0" />
          <span>História & Patrono</span>
        </button>

        <button
          onClick={() => setActiveTab('ppp')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider outline-none transition-all ${activeTab === 'ppp'
            ? 'border-slate-800 text-slate-900 bg-slate-50'
            : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
            }`}
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          <span>PPP & Proposta</span>
        </button>

        <button
          onClick={() => setActiveTab('organizacao')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider outline-none transition-all ${activeTab === 'organizacao'
            ? 'border-slate-800 text-slate-900 bg-slate-50'
            : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
            }`}
        >
          <Users className="h-4 w-4 shrink-0" />
          <span>Organização Escolar</span>
        </button>

        <button
          onClick={() => setActiveTab('ambientes')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider outline-none transition-all ${activeTab === 'ambientes'
            ? 'border-slate-800 text-slate-900 bg-slate-50'
            : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
            }`}
        >
          <MapPin className="h-4 w-4 shrink-0" />
          <span>Ambientes & Estrutura</span>
        </button>
      </div>

      {/* Tabs Content */}
      <div className="bg-white p-2 sm:p-4 rounded-3xl min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Image Gallery Viewer Modal */}
      {selectedPhotoItem && (
        <div className="fixed inset-0 z-[150] bg-black/85 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col text-left animate-scaleIn">

            {/* Modal Image Slider */}
            {selectedPhotoItem.imagens && selectedPhotoItem.imagens.length > 0 ? (
              <div className="h-72 sm:h-[420px] bg-slate-950 relative shrink-0 overflow-hidden flex items-center justify-center select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPhotoItem.imagens[activePhotoIdx]}
                  alt={`${selectedPhotoItem.titulo} - ${activePhotoIdx + 1}`}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-350"
                />

                {/* Left Arrow */}
                {selectedPhotoItem.imagens.length > 1 && (
                  <button
                    onClick={(e) => handlePrevPhoto(e, selectedPhotoItem.imagens!.length)}
                    className="absolute left-4 bg-black/60 hover:bg-black text-white rounded-full p-2 outline-none"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                {/* Right Arrow */}
                {selectedPhotoItem.imagens.length > 1 && (
                  <button
                    onClick={(e) => handleNextPhoto(e, selectedPhotoItem.imagens!.length)}
                    className="absolute right-4 bg-black/60 hover:bg-black text-white rounded-full p-2 outline-none"
                    aria-label="Próxima"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}

                {/* Counter indicator */}
                <span className="absolute bottom-4 right-4 bg-black/75 text-white text-xs font-bold px-3 py-1 rounded">
                  {activePhotoIdx + 1} de {selectedPhotoItem.imagens.length}
                </span>
              </div>
            ) : (
              <div className="h-48 bg-slate-900 flex flex-col items-center justify-center text-slate-500 gap-2 shrink-0">
                <ImageIcon className="h-10 w-10 text-slate-600" />
                <span className="text-xs font-bold uppercase">Sem Fotos</span>
              </div>
            )}

            {/* Modal Info Content */}
            <div className="p-6 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4.5 w-4.5 text-slate-600 shrink-0" />
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{selectedPhotoItem.categoria}</span>
                </div>
                <span className="bg-slate-900 text-white text-xs font-extrabold px-3 py-0.5 rounded-full">{selectedPhotoItem.ano}</span>
              </div>

              <h2 className="font-display font-extrabold text-2xl text-slate-950 leading-snug">
                {selectedPhotoItem.titulo}
              </h2>

              {selectedPhotoItem.descricao && (
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap pt-2.5 border-t border-slate-100 font-medium">
                  {selectedPhotoItem.descricao}
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedPhotoItem(null)}
                className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors outline-none"
              >
                Fechar Álbum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
