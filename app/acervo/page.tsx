import { ImageIcon, Radio, ExternalLink, Info } from "lucide-react";

interface GaleriaItem {
  title: string;
  year: "2019" | "2018 e Anteriores";
  link: string;
}

const EVENTOS_2019: GaleriaItem[] = [
  { title: "Homenagem aos Professores", year: "2019", link: "https://photos.app.goo.gl/z4wgGkA1esjtzL5v9" },
  { title: "Bingo Beneficente AMBIAL", year: "2019", link: "https://photos.app.goo.gl/L6jZtyt6Rfg9FDqp7" },
  { title: "Setembro Amarelo", year: "2019", link: "https://photos.app.goo.gl/hJMVNqMtEN3M6Wgs5" },
  { title: "1ª Mostra Científica e Cultural", year: "2019", link: "https://photos.app.goo.gl/yrHZ4gvHZ6Rt25Kp8" },
  { title: "Festa Junina 2019", year: "2019", link: "https://photos.app.goo.gl/KPY1HJVhBeT6ZHbx6" },
  { title: "Dia da Família 2019 (Álbum 1)", year: "2019", link: "https://photos.app.goo.gl/A51a5zpipRsUj1sFA" },
  { title: "Dia da Família 2019 (Álbum 2)", year: "2019", link: "https://photos.app.goo.gl/JxWP5gQRVGjwwRcM9" },
];

const EVENTOS_2018_ANTERIORES: GaleriaItem[] = [
  { title: "Gincana de Halloween 2018", year: "2018 e Anteriores", link: "https://photos.app.goo.gl/PDemehvCqLhnqmDB9" },
  { title: "Feira Catarinense de Matemática", year: "2018 e Anteriores", link: "https://photos.app.goo.gl/h68giEFspBznJLHz6" },
  { title: "Feira Regional de Matemática", year: "2018 e Anteriores", link: "https://photos.app.goo.gl/P7HBDo4mhJEr4pS79" },
  { title: "Torcida Benô na Copa", year: "2018 e Anteriores", link: "https://photos.app.goo.gl/jwfmwwzwoXHAsQ4x9" },
  { title: "Festa Junina 2018", year: "2018 e Anteriores", link: "https://photos.app.goo.gl/zG7xaEc6L7R11EHA7" },
  { title: "Um Pé de Quê?", year: "2018 e Anteriores", link: "https://photos.app.goo.gl/SuCwJXJ34sXgCo6J7" },
  { title: "Dia da Família 2018", year: "2018 e Anteriores", link: "https://photos.app.goo.gl/A7ou9f1pMdDhtVHh7" },
  { title: "Galeria Geral Pré-2017", year: "2018 e Anteriores", link: "https://photos.app.goo.gl/Q6QFGq42Tp837h8p9" },
];

interface PodcastEpisode {
  date: string;
  title: string;
  guests?: string;
  embedUrl: string;
}

const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    date: "22/08/2020",
    title: "ENEM e vestibulares, universidade pública x privada.",
    guests: "Profs. Iara Silva e Mariana Suyan",
    embedUrl: "https://open.spotify.com/embed/episode/0FPrOxnMIJQEij1AmJKgSf?utm_source=generator&theme=0"
  },
  {
    date: "05/09/2020",
    title: "Bacharelado x licenciatura, cursos de linguagens.",
    guests: "Profs. Carlos Rodrigo e Mirian Carla Barbosa",
    embedUrl: "https://open.spotify.com/embed/episode/1Dx6AEhMUW0Nor5s9R7Muk?utm_source=generator&theme=0"
  },
  {
    date: "19/09/2020",
    title: "Grades curriculares, flexibilização, cursos de humanas.",
    guests: "Profs. Katíscia Pereira e Mara Regina Oliveira",
    embedUrl: "https://open.spotify.com/embed/episode/5HXJHFtOw29zZbBErHeZN2?utm_source=generator&theme=0"
  },
  {
    date: "03/10/2020",
    title: "Transferências, retornos, cursos de Geografia e Matemática.",
    embedUrl: "https://open.spotify.com/embed/episode/6bMuK4SqxEm333BTl7yniX?utm_source=generator&theme=0"
  },
  {
    date: "17/10/2020",
    title: "Cursos técnicos e tecnólogos, Ciências da Natureza.",
    embedUrl: "https://open.spotify.com/embed/episode/0ziMqtaqgXoMTTPTqQ7dBL?utm_source=generator&theme=0"
  },
  {
    date: "31/10/2020",
    title: "Profissões do futuro, mercado de trabalho, roteiros de estudos.",
    embedUrl: "https://open.spotify.com/embed/episode/31d62h0e4HSm9kYslOPOWs?utm_source=generator&theme=0"
  }
];

function PodcastCard({ episode, index }: { episode: PodcastEpisode; index: number }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#1B2F78]/10 text-primary text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
            Encontro {index + 1} • {episode.date}
          </span>
          {episode.guests && (
            <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
              {episode.guests}
            </span>
          )}
        </div>
        <h4 className="font-bold text-slate-900 text-sm leading-snug">
          {episode.title}
        </h4>
      </div>
      <div className="w-full overflow-hidden rounded-xl bg-slate-50">
        <iframe
          data-testid="embed-iframe"
          style={{ borderRadius: "12px" }}
          src={episode.embedUrl}
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`Episódio do dia ${episode.date}: ${episode.title}`}
          className="border-none w-full"
        ></iframe>
      </div>
    </div>
  );
}

export default function AcervoPage() {
  return (
    <div className="py-6 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-primary font-display">
          Acervo Histórico & Galerias
        </h1>
        <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
        <p className="text-slate-600 font-medium">
          Espaço dedicado ao resgate histórico, preservação da memória escolar e produções pedagógicas do Benô.
        </p>
      </div>

      {/* Info Warning Card - Resgate Histórico */}
      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 max-w-4xl mx-auto">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm font-medium leading-relaxed">
          <span className="font-extrabold block mb-1">Aviso de Arquivo Histórico</span>
          Todo o conteúdo desta página faz parte da memória e do resgate histórico da escola. As fotos e os podcasts referem-se a projetos desenvolvidos em anos anteriores e são disponibilizados para consulta pública e valorização do patrimônio escolar.
        </div>
      </div>

      {/* Galerias Section */}
      <section className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-4">
          <div className="flex items-center space-x-3 text-primary">
            <ImageIcon className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold font-display">Galerias &quot;Aconteceu no Benô&quot;</h2>
          </div>
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 uppercase">
            [ACERVO 2018-2019]
          </span>
        </div>

        <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
          Navegue pelas fotos oficiais registradas pela equipe escolar e comunidade. Os álbuns estão organizados cronologicamente e hospedados externamente no Google Fotos para visualização completa.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 2019 */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-primary font-display">Ano Letivo de 2019</h3>
              <span className="text-[10px] font-extrabold bg-[#1B2F78]/10 text-primary px-2 py-0.5 rounded">FOTOS 2019</span>
            </div>
            <div className="space-y-3">
              {EVENTOS_2019.map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-primary/20 hover:bg-slate-50 transition-all font-semibold text-slate-700 text-sm outline-none group"
                >
                  <span>{item.title}</span>
                  <div className="flex items-center space-x-1 text-slate-400 group-hover:text-secondary transition-colors">
                    <span className="text-xs">Acessar Álbum</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Card 2018 e Anteriores */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-primary font-display">Anos Anteriores</h3>
              <span className="text-[10px] font-extrabold bg-[#1B2F78]/10 text-primary px-2 py-0.5 rounded">MUSEU DIGITAL</span>
            </div>
            <div className="space-y-3">
              {EVENTOS_2018_ANTERIORES.map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-primary/20 hover:bg-slate-50 transition-all font-semibold text-slate-700 text-sm outline-none group"
                >
                  <span>{item.title}</span>
                  <div className="flex items-center space-x-1 text-slate-400 group-hover:text-secondary transition-colors">
                    <span className="text-xs">Acessar Álbum</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Podcast Section */}
      <section className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-4">
          <div className="flex items-center space-x-3 text-primary">
            <Radio className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold font-display">Grupo de Estudos (Preparação ENEM)</h2>
          </div>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200 uppercase">
            [PROJETO ENCERRADO - PANDEMIA 2020]
          </span>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
            Durante o período da pandemia de COVID-19 em 2020, os docentes estruturaram este projeto de aulas e debates em formato de podcast para apoiar a preparação para o ENEM e outros vestibulares. Abaixo constam os 6 encontros gravados.
          </p>
          <a
            href="https://open.spotify.com/show/7zqRN8F3AWrBbcSWh0klNa?si=fa39bddc0658436d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-secondary hover:opacity-90 text-white text-xs font-bold py-3 px-5 rounded-xl transition-all shadow-sm shrink-0 outline-none"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Ver Canal Completo no Spotify</span>
          </a>
        </div>

        {/* Podcast Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {PODCAST_EPISODES.map((episode, idx) => (
            <PodcastCard key={episode.date} episode={episode} index={idx} />
          ))}
        </div>
      </section>

    </div>
  );
}
