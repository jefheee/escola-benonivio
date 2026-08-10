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
    <div className="relative select-none w-full">
      {/* Decorative vectors inside container */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/[0.02] rounded-full blur-2xl pointer-events-none translate-y-1/3 -translate-x-1/4" />

      {/* Title with controls */}
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 font-bold text-[10px] uppercase mb-2 tracking-wider shadow-inner">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Mural de Comunicados Importantes
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white flex items-center gap-2.5">
            <Megaphone className="h-6 w-6 text-amber-400 shrink-0" />
            <span>Destaques & Novidades</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-300 font-medium mt-1">
            Fique por dentro das últimas notícias, eventos e avisos oficiais da escola.
          </p>
        </div>

        {/* Buttons (Desktop) */}
        {avisos.length > 3 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="p-2.5 border border-white/10 bg-white/5 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer outline-none shadow-sm"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2.5 border border-white/10 bg-white/5 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer outline-none shadow-sm"
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
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 outline-none scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {avisos.map((aviso) => {
          const firstImage = (aviso.imagens && aviso.imagens.length > 0)
            ? aviso.imagens[0]
            : aviso.imagem_url;

          return (
            <div
              key={aviso.id}
              onClick={() => setSelectedAviso(aviso)}
              className="w-[290px] sm:w-[370px] shrink-0 snap-start bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between cursor-pointer group hover:border-amber-400 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 h-[380px]"
            >
              {/* Card Image */}
              <div className="h-44 bg-slate-50 relative shrink-0 overflow-hidden flex items-center justify-center border-b border-slate-100">
                {firstImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={firstImage}
                    alt={aviso.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center w-full h-full bg-gradient-to-br from-slate-50 to-slate-100/50">
                    <Megaphone className="h-10 w-10 text-[#00185f]/15" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Aviso da Escola</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#00185f] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md border border-indigo-900/30 uppercase tracking-wide">
                    Comunicado
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-grow flex flex-col justify-between text-left">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>
                      {new Date(aviso.data_publicacao || aviso.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </span>
                  <h3 className="font-display text-base font-extrabold text-[#00185f] group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                    {aviso.titulo}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3">
                    {aviso.resumo}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#00185f] group-hover:text-red-650 transition-colors">
                  <span>Ler Informativo Completo</span>
                  <span className="text-base font-bold bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-lg group-hover:bg-red-600 group-hover:text-white group-hover:border-transparent transition-colors">+</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Details */}
      {selectedAviso && (
        <div className="fixed inset-0 z-[150] bg-black/55 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col animate-scaleIn text-left">
            {/* Show first image or carousel of images if multiple exist */}
            {selectedAviso.imagens && selectedAviso.imagens.length > 0 ? (
              <div className="h-60 shrink-0 relative overflow-hidden bg-slate-900 flex gap-2 overflow-x-auto snap-x snap-mandatory">
                {selectedAviso.imagens.map((imgUrl, i) => (
                  <div key={i} className="w-full h-full shrink-0 snap-start relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`${selectedAviso.titulo} - ${i}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedAviso.imagens!.length > 1 && (
                      <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
                        {i + 1} de {selectedAviso.imagens!.length}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : selectedAviso.imagem_url ? (
              <div className="h-56 shrink-0 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedAviso.imagem_url}
                  alt={selectedAviso.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Publicado em {new Date(selectedAviso.data_publicacao || selectedAviso.created_at).toLocaleDateString('pt-BR', {
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
    </div>
  );
}
