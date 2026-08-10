'use client';

import { useState, useTransition } from 'react';
import {
  LayoutDashboard, Award, Users, BookOpen, AlertCircle, CheckCircle2,
  Sliders, Globe, Zap, Music, GraduationCap, Plus, Trash2,
  PhoneCall, FileText, History, Smile, HelpCircle, Eye
} from 'lucide-react';
import { savePaginaConteudo, EscolaPaginaConteudo } from '../actions';

interface ManagerProps {
  initialPages: EscolaPaginaConteudo[];
}

// Icon mapper for live preview
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
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

const ICON_OPTIONS = [
  { value: 'FileText', label: 'Documento / Editais (FileText)' },
  { value: 'PhoneCall', label: 'Telefone / Contato (PhoneCall)' },
  { value: 'History', label: 'Histórico / Relógio (History)' },
  { value: 'BookOpen', label: 'Livro / Estudos (BookOpen)' },
  { value: 'Users', label: 'Comunidade / Alunos (Users)' },
  { value: 'Award', label: 'Prêmio / Patrono (Award)' },
  { value: 'Globe', label: 'Mundo / Internet (Globe)' },
  { value: 'Smile', label: 'Sorriso / Apoio (Smile)' },
];

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

// Default values for home_hero
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
    { icone_nome: "FileText", titulo: "Editais APP", descricao: "Consulte documentos, editais e publicações oficiais da Associação.", link_url: "/documentos" },
    { icone_nome: "PhoneCall", titulo: "Contato", descricao: "Fale com a secretaria, direção ou coordenação pedagógica via WhatsApp.", link_url: "#contato" },
    { icone_nome: "History", titulo: "Histórico", descricao: "Conheça a trajetória, o patrono e os valores da nossa instituição.", link_url: "/sobre" }
  ]
};

// Default values for sobre
const DEFAULT_SOBRE = {
  patronoNome: 'Professor Benonívio João Martins',
  patronoAnos: '1933 - 1978',
  patronoBio: 'O professor Benonívio João Martins foi um profissional exemplar da educação catarinense e uma importante figura de liderança comunitária na região da Grande Florianópolis. Nascido em 1933 e falecido precocemente em 1978, deixou um legado inestimável focado no bem-estar comunitário, cidadania ativa e incentivo à leitura.\n\nSua memória é honrada através desta escola, inspirando gerações de alunos a trilharem o caminho da responsabilidade e do aprendizado no Brejaru. A instituição carrega no nome e no dia a dia os valores de solidariedade, persistência e busca pelo saber.',
  codigoMec: '42004047',
  totalAlunos: '1.897',
  alunosMatutino: '431',
  alunosVespertino: '399',
  alunosNoturno: '274',
  alunosIntegral: '245',
  infraEnergia: 'Alimentação pública estabilizada em 220V.',
  infraConectividade: 'Internet dedicada distribuída em Rede Local de alta velocidade.',
  infraCultura: 'Fanfarra escolar e projetos pedagógicos artísticos históricos.',
};

export default function PaginasManager({ initialPages }: ManagerProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'sobre'>('home');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Home Hero State (Block CMS)
  const rawHomeHero = initialPages.find(p => p.slug === 'home_hero')?.conteudo_html;
  const parsedHomeHero: HomeHeroSettings = rawHomeHero
    ? { ...DEFAULT_HOME_HERO, ...JSON.parse(rawHomeHero) }
    : DEFAULT_HOME_HERO;
  
  // Ensure cards array exists and has correct default layout
  if (!parsedHomeHero.cards_dinamicos) {
    parsedHomeHero.cards_dinamicos = DEFAULT_HOME_HERO.cards_dinamicos;
  }

  const [homeHero, setHomeHero] = useState<HomeHeroSettings>(parsedHomeHero);

  // Sobre State
  const rawSobre = initialPages.find(p => p.slug === 'sobre')?.conteudo_html;
  const parsedSobre = rawSobre ? { ...DEFAULT_SOBRE, ...JSON.parse(rawSobre) } : DEFAULT_SOBRE;
  const [sobre, setSobre] = useState(parsedSobre);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSaveHomeHero = () => {
    startTransition(async () => {
      const res = await savePaginaConteudo('home_hero', JSON.stringify(homeHero));
      if (res.success) {
        showFeedback('success', 'Configurações da Página Inicial salvas com sucesso!');
      } else {
        showFeedback('error', res.error || 'Erro ao salvar conteúdo.');
      }
    });
  };

  const handleSaveSobre = () => {
    startTransition(async () => {
      const res = await savePaginaConteudo('sobre', JSON.stringify(sobre));
      if (res.success) {
        showFeedback('success', 'Conteúdo da página Quem Somos salvo!');
      } else {
        showFeedback('error', res.error || 'Erro ao salvar conteúdo.');
      }
    });
  };

  // Dynamic Cards Helpers
  const handleAddCard = () => {
    if (homeHero.cards_dinamicos.length >= 5) {
      showFeedback('error', 'O limite é de 5 cards de acesso rápido.');
      return;
    }
    const updatedCards = [
      ...homeHero.cards_dinamicos,
      { icone_nome: 'FileText', titulo: '', descricao: '', link_url: '' }
    ];
    setHomeHero({ ...homeHero, cards_dinamicos: updatedCards });
  };

  const handleRemoveCard = (index: number) => {
    const updatedCards = homeHero.cards_dinamicos.filter((_, idx) => idx !== index);
    setHomeHero({ ...homeHero, cards_dinamicos: updatedCards });
  };

  const handleCardChange = (index: number, field: keyof DynamicCard, value: string) => {
    const updatedCards = [...homeHero.cards_dinamicos];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setHomeHero({ ...homeHero, cards_dinamicos: updatedCards });
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {feedback && (
        <div className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 max-w-sm animate-fadeIn ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span className="text-sm font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 outline-none ${
            activeTab === 'home'
              ? 'border-[#00185f] text-[#00185f] bg-[#00185f]/5'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Página Inicial (CMS Blocos)</span>
        </button>
        <button
          onClick={() => setActiveTab('sobre')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 outline-none ${
            activeTab === 'sobre'
              ? 'border-[#00185f] text-[#00185f] bg-[#00185f]/5'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Página Quem Somos (Sobre)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Editing Form */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-subtle p-6 space-y-8">
          
          {activeTab === 'home' && (
            <div className="space-y-6">
              
              {/* Secção 1: Visibilidade de Blocos */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-[#00185f] uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-slate-500" />
                  <span>Visibilidade das Seções</span>
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Toggle Hero */}
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <input
                      type="checkbox"
                      id="mostrar_hero"
                      checked={homeHero.mostrar_hero}
                      onChange={(e) => setHomeHero({ ...homeHero, mostrar_hero: e.target.checked })}
                      className="h-4 w-4 text-[#00185f] focus:ring-[#00185f] border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="mostrar_hero" className="text-xs font-bold text-slate-700 cursor-pointer block select-none">
                      Mostrar Hero Banner
                    </label>
                  </div>

                  {/* Toggle Avisos */}
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <input
                      type="checkbox"
                      id="mostrar_avisos"
                      checked={homeHero.mostrar_avisos}
                      onChange={(e) => setHomeHero({ ...homeHero, mostrar_avisos: e.target.checked })}
                      className="h-4 w-4 text-[#00185f] focus:ring-[#00185f] border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="mostrar_avisos" className="text-xs font-bold text-slate-700 cursor-pointer block select-none">
                      Mostrar Mural de Avisos
                    </label>
                  </div>

                  {/* Toggle Bento Grid */}
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <input
                      type="checkbox"
                      id="mostrar_acessos_rapidos"
                      checked={homeHero.mostrar_acessos_rapidos}
                      onChange={(e) => setHomeHero({ ...homeHero, mostrar_acessos_rapidos: e.target.checked })}
                      className="h-4 w-4 text-[#00185f] focus:ring-[#00185f] border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="mostrar_acessos_rapidos" className="text-xs font-bold text-slate-700 cursor-pointer block select-none">
                      Mostrar Acessos Rápidos
                    </label>
                  </div>

                  {/* Toggle Turmas */}
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <input
                      type="checkbox"
                      id="mostrar_turmas"
                      checked={homeHero.mostrar_turmas}
                      onChange={(e) => setHomeHero({ ...homeHero, mostrar_turmas: e.target.checked })}
                      className="h-4 w-4 text-[#00185f] focus:ring-[#00185f] border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="mostrar_turmas" className="text-xs font-bold text-slate-700 cursor-pointer block select-none">
                      Mostrar Seção de Turmas
                    </label>
                  </div>
                </div>
              </div>

              {/* Secção 2: Textos do Banner Principal (Hero) */}
              {homeHero.mostrar_hero && (
                <div className="space-y-4 border-t pt-4">
                  <h2 className="text-xs font-bold text-[#00185f] uppercase tracking-wider pb-2 flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-slate-500" />
                    <span>Textos do Hero Banner</span>
                  </h2>

                  {/* Badge Text */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase">Texto do Badge</label>
                    <input
                      type="text"
                      value={homeHero.badge}
                      onChange={(e) => setHomeHero({ ...homeHero, badge: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase">Título Principal</label>
                    <textarea
                      rows={2}
                      value={homeHero.titulo}
                      onChange={(e) => setHomeHero({ ...homeHero, titulo: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none resize-none"
                    />
                  </div>

                  {/* Paragraph */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase">Parágrafo / Descrição</label>
                    <textarea
                      rows={4}
                      value={homeHero.paragrafo}
                      onChange={(e) => setHomeHero({ ...homeHero, paragrafo: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Secção 3: Textos das outras seções */}
              <div className="space-y-4 border-t pt-4">
                <h2 className="text-xs font-bold text-[#00185f] uppercase tracking-wider pb-2 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-slate-500" />
                  <span>Títulos das Seções da Home</span>
                </h2>

                {homeHero.mostrar_acessos_rapidos && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase">Título - Acesso Rápido</label>
                    <input
                      type="text"
                      value={homeHero.bento_titulo}
                      onChange={(e) => setHomeHero({ ...homeHero, bento_titulo: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                    />
                  </div>
                )}

                {homeHero.mostrar_turmas && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 uppercase">Título - Seção de Turmas</label>
                      <input
                        type="text"
                        value={homeHero.turmas_titulo}
                        onChange={(e) => setHomeHero({ ...homeHero, turmas_titulo: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 uppercase">Subtítulo - Seção de Turmas</label>
                      <input
                        type="text"
                        value={homeHero.turmas_subtitulo}
                        onChange={(e) => setHomeHero({ ...homeHero, turmas_subtitulo: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Secção 4: Cards Dinâmicos */}
              {homeHero.mostrar_acessos_rapidos && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-[#00185f] uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-slate-500" />
                      <span>Cards Dinâmicos (Acesso Rápido - Máx. 5)</span>
                    </h2>
                    <button
                      type="button"
                      onClick={handleAddCard}
                      disabled={homeHero.cards_dinamicos.length >= 5}
                      className="text-xs font-bold text-[#00185f] hover:text-[#bc0100] disabled:opacity-40 flex items-center gap-1 outline-none"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Adicionar Card ({homeHero.cards_dinamicos.length}/5)</span>
                    </button>
                  </div>

                  {/* Cards List Editor */}
                  <div className="space-y-4">
                    {homeHero.cards_dinamicos.map((card, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative">
                        {/* Remove Card Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveCard(idx)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-slate-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <span className="text-[10px] font-extrabold text-[#00185f] uppercase tracking-wider block">Card #{idx + 1}</span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Icon selection */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-600 block uppercase">Ícone</label>
                            <select
                              value={card.icone_nome}
                              onChange={(e) => handleCardChange(idx, 'icone_nome', e.target.value)}
                              className="w-full px-3 py-2 border bg-white rounded-lg text-xs outline-none"
                            >
                              {ICON_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Title */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-600 block uppercase">Título</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: Editais APP"
                              value={card.titulo}
                              onChange={(e) => handleCardChange(idx, 'titulo', e.target.value)}
                              className="w-full px-3 py-2 border bg-white rounded-lg text-xs outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Description */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-600 block uppercase">Descrição</label>
                            <input
                              type="text"
                              required
                              placeholder="Breve resumo informativo..."
                              value={card.descricao}
                              onChange={(e) => handleCardChange(idx, 'descricao', e.target.value)}
                              className="w-full px-3 py-2 border bg-white rounded-lg text-xs outline-none"
                            />
                          </div>

                          {/* Link URL */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-600 block uppercase">URL de Destino</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: /documentos ou https://..."
                              value={card.link_url}
                              onChange={(e) => handleCardChange(idx, 'link_url', e.target.value)}
                              className="w-full px-3 py-2 border bg-white rounded-lg text-xs outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {homeHero.cards_dinamicos.length === 0 && (
                      <p className="text-xs text-slate-400 font-medium text-center py-6">Adicione ao menos um card de acesso rápido para aparecer no site.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveHomeHero}
                disabled={isPending}
                className="w-full bg-[#00185f] hover:bg-[#001144] disabled:opacity-50 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm outline-none"
              >
                {isPending ? 'Salvando...' : 'Salvar Configurações da Home'}
              </button>
            </div>
          )}

          {activeTab === 'sobre' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-[#00185f] uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                <span>Campos da Página Nossa Escola</span>
              </h2>

              <div className="bg-[#1B2F78]/5 p-3 rounded-lg border-l-4 border-l-primary text-xs font-semibold text-slate-600">
                Os dados digitados abaixo alimentam os cards informativos da página Quem Somos.
              </div>

              {/* Patrono Section */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-[#00185f] uppercase">Seção do Patrono</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Nome Oficial</label>
                    <input
                      type="text"
                      value={sobre.patronoNome}
                      onChange={(e) => setSobre({ ...sobre, patronoNome: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Anos (Nasc-Morte)</label>
                    <input
                      type="text"
                      value={sobre.patronoAnos}
                      onChange={(e) => setSobre({ ...sobre, patronoAnos: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Biografia</label>
                  <textarea
                    rows={4}
                    value={sobre.patronoBio}
                    onChange={(e) => setSobre({ ...sobre, patronoBio: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs resize-none"
                  />
                </div>
              </div>

              {/* Censo Section */}
              <div className="space-y-3 pt-3 border-t">
                <h3 className="text-xs font-bold text-[#00185f] uppercase">Matrículas & Censo</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Código MEC / INEP</label>
                    <input
                      type="text"
                      value={sobre.codigoMec}
                      onChange={(e) => setSobre({ ...sobre, codigoMec: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Total Alunos</label>
                    <input
                      type="text"
                      value={sobre.totalAlunos}
                      onChange={(e) => setSobre({ ...sobre, totalAlunos: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase">Matutino</label>
                    <input
                      type="text"
                      value={sobre.alunosMatutino}
                      onChange={(e) => setSobre({ ...sobre, alunosMatutino: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase">Vespertino</label>
                    <input
                      type="text"
                      value={sobre.alunosVespertino}
                      onChange={(e) => setSobre({ ...sobre, alunosVespertino: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase">Noturno</label>
                    <input
                      type="text"
                      value={sobre.alunosNoturno}
                      onChange={(e) => setSobre({ ...sobre, alunosNoturno: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase">Integral</label>
                    <input
                      type="text"
                      value={sobre.alunosIntegral}
                      onChange={(e) => setSobre({ ...sobre, alunosIntegral: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Infraestructure Section */}
              <div className="space-y-3 pt-3 border-t">
                <h3 className="text-xs font-bold text-[#00185f] uppercase">Infraestrutura</h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Energia</label>
                  <input
                    type="text"
                    value={sobre.infraEnergia}
                    onChange={(e) => setSobre({ ...sobre, infraEnergia: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Conectividade</label>
                  <input
                    type="text"
                    value={sobre.infraConectividade}
                    onChange={(e) => setSobre({ ...sobre, infraConectividade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Cultura / Projetos</label>
                  <input
                    type="text"
                    value={sobre.infraCultura}
                    onChange={(e) => setSobre({ ...sobre, infraCultura: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveSobre}
                disabled={isPending}
                className="w-full bg-[#00185f] hover:bg-[#001144] disabled:opacity-50 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm outline-none"
              >
                {isPending ? 'Salvando...' : 'Salvar Página Nossa Escola'}
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Live Preview */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1.5">
            <Eye className="h-4.5 w-4.5 text-[#00185f]" />
            <span>Visualização da Home (Blocos Ativos)</span>
          </span>

          {activeTab === 'home' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6 max-w-lg mx-auto shadow-inner">
              
              {/* Preview 1: Hero Banner */}
              {homeHero.mostrar_hero ? (
                <div className="bg-white border border-slate-200 rounded-xl p-5 text-center space-y-3 shadow-sm">
                  <div className="inline-flex items-center gap-1 bg-slate-50 border px-2.5 py-0.5 rounded-full text-[9px] text-[#bc0100] font-bold uppercase">
                    <GraduationCap className="h-3 w-3" />
                    <span>{homeHero.badge || 'Matrículas Abertas'}</span>
                  </div>
                  <h3 className="font-display text-lg font-extrabold text-[#00185f] leading-snug">
                    {homeHero.titulo || 'Sem título'}
                  </h3>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
                    {homeHero.paragrafo || 'Sem parágrafo descriptivo.'}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-100 border border-dashed border-slate-300 p-4 text-center rounded-xl text-xs text-slate-400 font-semibold select-none">
                  Hero Banner Ocultado
                </div>
              )}

              {/* Preview 2: Mural de Avisos */}
              {homeHero.mostrar_avisos ? (
                <div className="bg-[#00185f] text-white border border-indigo-900 rounded-xl p-4 space-y-1 shadow-sm">
                  <span className="text-[8px] font-extrabold bg-amber-500 text-[#00185f] px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                    Informativo
                  </span>
                  <h4 className="font-bold text-xs">Mural de Destaques & Comunicados</h4>
                  <p className="text-[10px] text-indigo-200/90 font-medium">Os comunicados e avisos oficiais da escola serão exibidos aqui.</p>
                </div>
              ) : (
                <div className="bg-slate-100 border border-dashed border-slate-300 p-4 text-center rounded-xl text-xs text-slate-400 font-semibold select-none">
                  Mural de Avisos Ocultado
                </div>
              )}

              {/* Preview 3: Bento Grid dynamic cards */}
              {homeHero.mostrar_acessos_rapidos ? (
                <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-xs text-[#00185f] border-b pb-1.5 uppercase tracking-wider select-none">
                    {homeHero.bento_titulo || 'Acesso Rápido'}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {homeHero.cards_dinamicos.map((card, idx) => {
                      const IconComponent = ICON_MAP[card.icone_nome] || HelpCircle;
                      return (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-lg text-left">
                          <div className="p-2 bg-white rounded-lg text-[#bc0100] border shrink-0">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="truncate">
                            <span className="font-bold text-xs text-slate-800 block leading-tight">{card.titulo || 'Card sem título'}</span>
                            <span className="text-[9px] text-slate-450 block truncate max-w-[200px] font-medium">{card.descricao || 'Sem descrição'}</span>
                          </div>
                        </div>
                      );
                    })}
                    {homeHero.cards_dinamicos.length === 0 && (
                      <p className="text-[10px] text-slate-400 font-medium text-center">Nenhum card cadastrado.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 border border-dashed border-slate-300 p-4 text-center rounded-xl text-xs text-slate-400 font-semibold select-none">
                  Acessos Rápidos Ocultados
                </div>
              )}

              {/* Preview 4: Turmas */}
              {homeHero.mostrar_turmas ? (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <div className="text-left border-b pb-1.5">
                    <h4 className="font-bold text-xs text-[#00185f]">{homeHero.turmas_titulo || 'Turmas'}</h4>
                    <p className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">{homeHero.turmas_subtitulo || 'Subtítulo'}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                    <span className="bg-slate-50 border p-1 rounded text-slate-600">6º ao 9º Ano</span>
                    <span className="bg-slate-50 border p-1 rounded text-slate-600">Ensino Médio</span>
                    <span className="bg-slate-50 border p-1 rounded text-slate-600">Apoio</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 border border-dashed border-slate-300 p-4 text-center rounded-xl text-xs text-slate-400 font-semibold select-none">
                  Seção de Turmas Ocultada
                </div>
              )}

            </div>
          )}

          {activeTab === 'sobre' && (
            <div className="space-y-4 text-left">
              {/* Patrono Preview */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-primary flex items-center gap-2 border-b pb-2 text-sm">
                  <Award className="h-4 w-4 text-secondary" />
                  <span>Quem foi o Patrono?</span>
                </h3>
                <div className="bg-[#1B2F78]/5 p-3 rounded-lg border-l-4 border-l-primary text-xs">
                  <span className="text-[9px] text-primary font-bold uppercase block">Nome Oficial</span>
                  <span className="font-extrabold block text-slate-800">{sobre.patronoNome}</span>
                  <span className="text-[10px] text-slate-500 font-bold">({sobre.patronoAnos})</span>
                </div>
                <p className="text-slate-600 text-xs font-medium leading-relaxed whitespace-pre-wrap">
                  {sobre.patronoBio}
                </p>
              </div>

              {/* Censo Preview */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-primary flex items-center gap-2 border-b pb-2 text-sm">
                  <Users className="h-4 w-4 text-secondary" />
                  <span>Censo Escolar</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Código MEC</span>
                    <span className="text-xs font-extrabold">{sobre.codigoMec}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Total Alunos</span>
                    <span className="text-sm font-extrabold text-primary">{sobre.totalAlunos}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-center">
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-slate-400 block text-[8px]">Mat.</span>
                    <span>{sobre.alunosMatutino}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-slate-400 block text-[8px]">Vesp.</span>
                    <span>{sobre.alunosVespertino}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-slate-400 block text-[8px]">Not.</span>
                    <span>{sobre.alunosNoturno}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded">
                    <span className="text-slate-400 block text-[8px]">Integ.</span>
                    <span>{sobre.alunosIntegral}</span>
                  </div>
                </div>
              </div>

              {/* Infra Preview */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-primary flex items-center gap-2 border-b pb-2 text-sm">
                  <BookOpen className="h-4 w-4 text-secondary" />
                  <span>Infraestrutura</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                  <li className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{sobre.infraEnergia}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">{sobre.infraConectividade}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Music className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{sobre.infraCultura}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
