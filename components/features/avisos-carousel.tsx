'use client';

import { useState, useRef } from 'react';
import { Megaphone, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { EscolaAvisoPublic } from '@/lib/data/avisos';

interface AvisosCarouselProps {
  avisos: EscolaAvisoPublic[];
}

export default function AvisosCarousel({ avisos }: AvisosCarouselProps) {
  const [selectedAviso, setSelectedAviso] = useState<EscolaAvisoPublic | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (avisos.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 relative w-full border-b border-soft-border">
      {/* Title with controls */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-secondary" />
            <span>Avisos Importantes</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Fique por dentro dos principais comunicados e eventos da escola.
          </p>
        </div>

        {/* Buttons (Desktop) */}
        {avisos.length > 3 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer outline-none"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer outline-none"
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Scroll Area */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 outline-none scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {avisos.map((aviso) => (
          <div
            key={aviso.id}
            onClick={() => setSelectedAviso(aviso)}
            className="w-[290px] sm:w-[360px] shrink-0 snap-start bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-subtle flex flex-col justify-between cursor-pointer group hover:border-[#00185f] hover:shadow-md transition-all h-[360px]"
          >
            {/* Card Image */}
            <div className="h-40 bg-slate-50 relative shrink-0 overflow-hidden flex items-center justify-center border-b border-slate-100">
              {aviso.imagem_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={aviso.imagem_url}
                  alt={aviso.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-6 text-center">
                  <Megaphone className="h-10 w-10 text-[#00185f]/15" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Destaque</span>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 block uppercase flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>
                    {new Date(aviso.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </span>
                <h3 className="font-display text-base font-extrabold text-[#00185f] group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                  {aviso.titulo}
                </h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3">
                  {aviso.resumo}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00185f] group-hover:text-secondary transition-colors">
                <span>Ver detalhes</span>
                <span>+</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Details */}
      {selectedAviso && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col">
            {selectedAviso.imagem_url && (
              <div className="h-56 shrink-0 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedAviso.imagem_url}
                  alt={selectedAviso.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Publicado em {new Date(selectedAviso.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </span>
                <button
                  onClick={() => setSelectedAviso(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h2 className="font-display font-extrabold text-2xl text-[#00185f] leading-snug">
                {selectedAviso.titulo}
              </h2>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-semibold text-slate-600 leading-relaxed">
                {selectedAviso.resumo}
              </div>

              {selectedAviso.conteudo && (
                <div className="text-slate-700 text-sm leading-relaxed space-y-3 whitespace-pre-wrap pt-2 border-t border-slate-100">
                  {selectedAviso.conteudo}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedAviso(null)}
                className="bg-[#00185f] hover:bg-[#001144] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors outline-none"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
