'use client';

import { useState, FormEvent } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

interface WhatsAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppDialog({ isOpen, onClose }: WhatsAppDialogProps) {
  const [nome, setNome] = useState('');
  const [perfil, setPerfil] = useState('Responsável');
  const [assunto, setAssunto] = useState('Matrícula');
  const [mensagem, setMensagem] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nome || !mensagem) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const texto = `Olá, me chamo ${nome}, sou ${perfil}. Gostaria de falar sobre ${assunto}: ${mensagem}`;
    const url = `https://wa.me/5548988354422?text=${encodeURIComponent(texto)}`;
    
    window.open(url, '_blank');
    onClose();
    
    // Reset form
    setNome('');
    setPerfil('Responsável');
    setAssunto('Matrícula');
    setMensagem('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 animate-fadeIn">
      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden animate-scaleIn">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm text-[#00185f] uppercase tracking-wider">
                Triagem de Contato
              </h3>
              <span className="text-[11px] text-slate-400 font-bold block leading-none mt-0.5">
                Secretaria EEB Benonívio
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-650 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Nome */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase block">Seu Nome Completo</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-805 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
            />
          </div>

          {/* Perfil */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase block">Você é:</label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
            >
              <option value="Responsável / Familiar">Responsável / Familiar</option>
              <option value="Aluno(a)">Aluno(a)</option>
              <option value="Professor(a) / Servidor(a)">Professor(a) / Servidor(a)</option>
              <option value="Membro da Comunidade">Membro da Comunidade</option>
            </select>
          </div>

          {/* Assunto */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase block">Assunto do Contato</label>
            <select
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none"
            >
              <option value="Matrículas e Vagas">Matrículas e Vagas</option>
              <option value="Histórico e Documentos">Histórico e Documentos</option>
              <option value="Dúvidas Gerais">Dúvidas Gerais</option>
              <option value="Assuntos Pedagógicos">Assuntos Pedagógicos</option>
            </select>
          </div>

          {/* Mensagem */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase block">Escreva sua Mensagem</label>
            <textarea
              required
              rows={4}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite aqui o que você deseja falar com a secretaria..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-805 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none resize-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2 outline-none"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Iniciar Conversa</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
