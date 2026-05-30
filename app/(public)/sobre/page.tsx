import Image from "next/image";
import { MapPin, Award, BookOpen, Users, Zap, Globe, Music } from "lucide-react";
import { SCHOOL_INFO } from "@/lib/constants";
import { getPaginaConteudoPublic } from "@/lib/data/paginas";

export const dynamic = 'force-dynamic';

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

export default async function SobrePage() {
  const contentRaw = await getPaginaConteudoPublic('sobre');
  
  let sobre = DEFAULT_SOBRE;
  if (contentRaw?.conteudo_html) {
    try {
      sobre = { ...DEFAULT_SOBRE, ...JSON.parse(contentRaw.conteudo_html) };
    } catch (e) {
      console.error('Erro ao parsear sobre_content:', e);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-primary font-display">
          Nossa Escola
        </h1>
        <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
        <p className="text-slate-600 font-medium">
          Conheça a infraestrutura, os dados de atendimento e a história da EEB Professor Benonívio João Martins.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* Cell 1: História do Patrono (Span 2 Columns) */}
        <div className="md:col-span-2 bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-primary border-b pb-4 mb-4 flex items-center gap-2">
              <Award className="h-6 w-6 text-secondary" />
              <span>Quem foi o Patrono?</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex-shrink-0">
                <Image 
                  src="/assets/images/professor-benonivio-joao-martins.jpeg" 
                  alt="Professor Benonívio João Martins" 
                  width={350} 
                  height={450} 
                  className="rounded-xl object-cover shadow-sm w-full md:w-[220px] h-auto" 
                />
              </div>
              <div className="space-y-4 text-sm text-slate-600 font-medium leading-relaxed">
                <div className="bg-[#1B2F78]/5 p-4 rounded-xl border-l-4 border-l-primary">
                  <span className="text-xs text-primary font-bold uppercase block">Nome Oficial</span>
                  <span className="text-lg text-slate-900 font-extrabold block">{sobre.patronoNome}</span>
                  <span className="text-xs text-slate-500 font-bold block mt-0.5">({sobre.patronoAnos})</span>
                </div>
                <div className="whitespace-pre-wrap">
                  {sobre.patronoBio}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cell 2: Censo/Matrícula (Span 1 Column) */}
        <div className="md:col-span-1 bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary border-b pb-4 mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-secondary" />
              <span>Matrículas & Censo</span>
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase">Código MEC / INEP</span>
                <span className="text-lg text-slate-900 font-extrabold">{sobre.codigoMec}</span>
              </div>
              
              <div className="border-t pt-4">
                <span className="text-xs text-slate-400 font-bold block uppercase mb-2">Total de Alunos (2026)</span>
                <span className="text-3xl font-extrabold text-primary">{sobre.totalAlunos}</span>
                <span className="text-xs text-slate-500 font-semibold block mt-1">Alunos ativos matriculados</span>
              </div>

              <div className="border-t pt-4 space-y-2">
                <span className="text-xs text-slate-400 font-bold block uppercase">Distribuição por Turno</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="block text-slate-400">Matutino</span>
                    <span className="text-slate-900 font-bold">{sobre.alunosMatutino} alunos</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="block text-slate-400">Vespertino</span>
                    <span className="text-slate-900 font-bold">{sobre.alunosVespertino} alunos</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="block text-slate-400">Noturno</span>
                    <span className="text-slate-900 font-bold">{sobre.alunosNoturno} alunos</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="block text-slate-400">Integral</span>
                    <span className="text-slate-900 font-bold">{sobre.alunosIntegral} alunos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cell 3: Infraestrutura (Span 1 Column) */}
        <div className="md:col-span-1 bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary border-b pb-4 mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-secondary" />
              <span>Infraestrutura</span>
            </h2>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-slate-900 font-bold block">Rede de Energia</span>
                  <span>{sobre.infraEnergia}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg mt-0.5">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-slate-900 font-bold block">Conectividade Local</span>
                  <span>{sobre.infraConectividade}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg mt-0.5">
                  <Music className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-slate-900 font-bold block">Atividades Culturais</span>
                  <span>{sobre.infraCultura}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Cell 4: Localização Dinâmica (Span 2 Columns) */}
        <div className="md:col-span-2 bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-primary border-b pb-4 mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-secondary" />
              <span>Localização</span>
            </h2>
            <p className="text-sm text-slate-600 font-semibold mb-4">
              Endereço: {SCHOOL_INFO.address.street}, {SCHOOL_INFO.address.number} - {SCHOOL_INFO.address.neighborhood}, {SCHOOL_INFO.address.city}/{SCHOOL_INFO.address.state} (CEP: {SCHOOL_INFO.address.zipCode})
            </p>
            <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1767.54989144233!2d-48.667191048476354!3d-27.621426117409058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9527358fbaaaaaab%3A0xa4a4e87166b392b7!2sEeb%20Prof%20Benonivio%20Joao%20Martins!5e0!3m2!1spt-BR!2sbr!4v1779936658693!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
