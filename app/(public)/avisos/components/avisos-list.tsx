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
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialAvisos.length > 0 ? (
          initialAvisos.map((aviso) => (
            <div
              key={aviso.id}
              onClick={() => setSelectedAviso(aviso)}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-subtle flex flex-col justify-between cursor-pointer group hover:border-[#00185f] hover:shadow-md transition-all h-[400px] relative"
            >
              {/* Card Image */}
              <div className="h-44 bg-slate-50 relative shrink-0 overflow-hidden flex items-center justify-center border-b border-slate-100">
                {aviso.imagem_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={aviso.imagem_url}
                    alt={aviso.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
                    <Megaphone className="h-12 w-12 text-[#00185f]/15" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comunicado Oficial</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {new Date(aviso.created_at).toLocaleDateString('pt-BR', {
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

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00185f] group-hover:text-secondary transition-colors">
                  <span>Ver detalhes</span>
                  <span className="text-lg leading-none">+</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-slate-400 py-12 font-semibold">Nenhum aviso publicado no momento.</p>
        )}
      </div>

      {/* Modal Details */}
      {selectedAviso && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col">
            {/* Image header inside modal */}
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

            {/* Modal Content */}
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
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
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
