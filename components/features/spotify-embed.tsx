'use client';

import { useState } from 'react';
import { Radio, Headphones, Play, ExternalLink } from 'lucide-react';

const PODCAST_EPISODES = [
  {
    id: '0FPrOxnMIJQEij1AmJKgSf',
    title: 'ENEM e Vestibulares: Universidade Pública x Privada',
    date: '22/08/2020',
    participants: 'Profs. Iara Silva e Mariana Suyan'
  },
  {
    id: '1Dx6AEhMUW0Nor5s9R7Muk',
    title: 'Bacharelado x Licenciatura & Cursos de Linguagens',
    date: '05/09/2020',
    participants: 'Profs. Carlos Rodrigo e Mirian Carla Barbosa'
  },
  {
    id: '5HXJHFtOw29zZbBErHeZN2',
    title: 'Grades Curriculares, Flexibilização & Ciências Humanas',
    date: '19/09/2020',
    participants: 'Profs. Katíscia Pereira e Mara Regina Oliveira'
  },
  {
    id: '6bMuK4SqxEm333BTl7yniX',
    title: 'Transferências, Retornos, Geografia e Matemática',
    date: '03/10/2020',
    participants: 'Equipe de Ciências Exatas e Humanas'
  },
  {
    id: '0ziMqtaqgXoMTTPTqQ7dBL',
    title: 'Cursos Técnicos e Tecnólogos & Ciências da Natureza',
    date: '17/10/2020',
    participants: 'Equipe de Ciências da Natureza'
  },
  {
    id: '31d62h0e4HSm9kYslOPOWs',
    title: 'Profissões do Futuro, Mercado de Trabalho & Roteiros de Estudos',
    date: '31/10/2020',
    participants: 'Equipe do Grupo de Estudos'
  }
];

export default function SpotifyEmbed() {
  const [activeEpisodeId, setActiveEpisodeId] = useState(PODCAST_EPISODES[0].id);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md mb-1">
              <Headphones className="h-3 w-3" />
              <span>Podcast Oficial Benonívio</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Grupo de Estudos do 3º Ano
            </h3>
          </div>
        </div>

        <a
          href="https://open.spotify.com/show/7zqRN8F3AWrBbcSWh0klNa"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <span>Ouvir no Spotify</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Main player + Episode Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Player */}
        <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-center min-h-[170px]">
          <iframe
            key={activeEpisodeId}
            data-testid="embed-iframe"
            style={{ borderRadius: '12px' }}
            src={`https://open.spotify.com/embed/episode/${activeEpisodeId}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Episode Player"
          />
        </div>

        {/* Episodes list */}
        <div className="lg:col-span-6 space-y-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Selecione o Episódio ({PODCAST_EPISODES.length})
          </span>
          {PODCAST_EPISODES.map((ep) => {
            const isActive = activeEpisodeId === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => setActiveEpisodeId(ep.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                  <Play className="h-3.5 w-3.5 fill-current" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold truncate">{ep.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{ep.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{ep.participants}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
