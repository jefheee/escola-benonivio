import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, MessageSquare, ExternalLink, Calendar, Megaphone, Link2 } from 'lucide-react';
import { getTurmaByIdPublic, getTurmaPostsPublic } from '@/lib/data/turmas';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TurmaDetailPage({ params }: PageProps) {
  const { id } = params;
  
  // Fetch details and posts concurrently (under unstable_cache)
  const [turma, posts] = await Promise.all([
    getTurmaByIdPublic(id),
    getTurmaPostsPublic(id)
  ]);

  if (!turma) {
    notFound();
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      
      {/* Back button */}
      <div>
        <Link 
          href="/turmas"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-secondary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Voltar para todas as turmas</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <span className={`inline-block text-[10px] font-extrabold px-3 py-1 rounded-full ${
            turma.turno === 'Matutino'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : turma.turno === 'Vespertino'
              ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
              : turma.turno === 'Noturno'
              ? 'bg-purple-50 text-purple-800 border border-purple-200'
              : 'bg-slate-50 text-slate-700 border border-slate-200'
          }`}>
            Turno {turma.turno}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00185f] font-display leading-tight">
            {turma.ano}
          </h1>
          <p className="text-sm text-slate-500 font-semibold">
            Identificador da Classe: <span className="text-[#00185f] font-bold">Turma {turma.nome}</span>
          </p>
        </div>

        {/* WhatsApp invite link */}
        {turma.whatsapp_link && (
          <a
            href={turma.whatsapp_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all shrink-0"
          >
            <MessageSquare className="h-5 w-5 shrink-0" />
            <span>Entrar no WhatsApp da Turma</span>
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left column: Resources/links (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#00185f] uppercase tracking-wider border-b pb-3 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-secondary" />
              <span>Recursos Extras</span>
            </h3>

            {turma.outros_links && turma.outros_links.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {turma.outros_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-white border border-slate-100 hover:border-[#00185f]/30 rounded-xl text-xs font-bold text-slate-700 hover:text-[#00185f] shadow-inner hover:shadow transition-all group"
                  >
                    <span className="truncate pr-4">{link.titulo}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-secondary transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium py-2">
                Nenhum link adicional cadastrado para esta turma.
              </p>
            )}
          </div>
        </div>

        {/* Right column: timeline feed (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <div className="p-1.5 bg-[#00185f]/5 text-[#00185f] rounded-lg">
              <Megaphone className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-[#00185f] font-display">
              Mural de Recados
            </h2>
            <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}
            </span>
          </div>

          <div className="space-y-6 relative border-l-2 border-slate-150 pl-6 ml-4 py-2">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="relative group">
                  {/* Timeline dot */}
                  <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-slate-400 group-hover:bg-[#00185f] transition-colors" />

                  {/* Post Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 group-hover:border-[#00185f]/30 hover:shadow transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {new Date(post.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </span>
                    </div>

                    <h4 className="font-display font-extrabold text-base text-[#00185f] leading-snug">
                      {post.titulo}
                    </h4>

                    {post.conteudo && (
                      <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">
                        {post.conteudo}
                      </p>
                    )}

                    {post.imagem_url && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-100 max-h-[350px] w-full flex justify-center bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.imagem_url}
                          alt={post.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {post.link_referencia && (
                      <div className="mt-3">
                        <a
                          href={post.link_referencia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00185f] hover:text-secondary bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg transition-colors outline-none"
                        >
                          <Link2 className="h-3.5 w-3.5" />
                          <span>Acessar Link Anexo</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium">
                Nenhum comunicado foi publicado no mural desta turma até o momento.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
