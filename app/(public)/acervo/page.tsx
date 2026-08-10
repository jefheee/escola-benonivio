import { getAcervoPublic } from '@/lib/data/acervo';
import AcervoHub from './components/acervo-hub';
import SpotifyEmbed from '@/components/features/spotify-embed';
import RevistaOkazaCard from '@/components/features/revista-okaza-card';

export const dynamic = 'force-dynamic';

export default async function PublicAcervoPage() {
  const documents = await getAcervoPublic();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-block bg-slate-100 text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-slate-200 mb-1 tracking-wider">
          Materiais, Podcasts & Publicações
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 font-display">
          Acervo Digital Pedagógico
        </h1>
        <div className="h-1 w-20 bg-slate-900 mx-auto rounded-full" />
        <p className="text-slate-600 font-medium">
          Acesse planos de aula, roteiros de estudos, edições da Revista Okaza e podcasts preparatórios para vestibular e ENEM da EEB Professor Benonívio João Martins.
        </p>
      </div>

      {/* Revista Okaza Section */}
      <RevistaOkazaCard />

      {/* Spotify Podcast Player Section */}
      <SpotifyEmbed />

      {/* Interactive Downloads Hub */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-slate-900 font-display">
            Materiais de Apoio & Apostilas
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Filtre os documentos por disciplina e faça o download direto dos materiais didáticos.
          </p>
        </div>
        <AcervoHub initialDocuments={documents} />
      </div>
    </div>
  );
}
