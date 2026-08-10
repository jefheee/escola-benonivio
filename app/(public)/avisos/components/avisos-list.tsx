'use client';

import { useState } from 'react';
import { Megaphone, Calendar, X } from 'lucide-react';
import { EscolaAvisoPublic } from '@/lib/data/avisos';

interface AvisosListProps {
  initialAvisos: EscolaAvisoPublic[];
}

export default function AvisosList({ initialAvisos }: AvisosListProps) {
  const [selectedAviso, setSelectedAviso] = useState<EscolaAvisoPublic | null>(null);

  return (
    <div className="space-y-8">
      {initialAvisos.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {initialAvisos.map((aviso) => {
            const firstImage = (aviso.imagens && aviso.imagens.length > 0)
              ? aviso.imagens[0]
              : aviso.imagem_url;

            return (
              <div key={aviso.id} className="break-inside-avoid mb-6">
                <div
                  onClick={() => setSelectedAviso(aviso)}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-subtle flex flex-col justify-between cursor-pointer group hover:border-[#00185f] hover:shadow-md transition-all relative"
                >
                  {/* Card Image */}
                  <div className="bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100 max-h-96">
                    {firstImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={firstImage}
                        alt={aviso.titulo}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-10 text-center w-full">
                        <Megaphone className="h-12 w-12 text-[#00185f]/15" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comunicado Oficial</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between text-left">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {new Date(aviso.data_publicacao || aviso.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </span>
                      <h3 className="font-display text-lg font-extrabold text-[#00185f] leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                        {aviso.titulo}
                      </h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3">
                        {aviso.resumo}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00185f] group-hover:text-secondary transition-colors">
                      <span>Ver detalhes</span>
                      <span className="text-lg leading-none">+</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-slate-400 py-12 font-semibold">Nenhum aviso publicado no momento.</p>
      )}

      {/* Modal Details */}
      {selectedAviso && (
        <div className="fixed inset-0 z-[150] bg-black/55 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col text-left animate-scaleIn">
            {/* Image Header with Multi-image carousel support */}
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

            {/* Modal Content */}
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
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors"
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

              {/* Full Content */}
              {selectedAviso.conteudo && (
                <div className="text-slate-700 text-sm leading-relaxed space-y-3 whitespace-pre-wrap pt-2 border-t border-slate-100">
                  {selectedAviso.conteudo}
                </div>
              )}
            </div>

            {/* Modal Footer */}
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
