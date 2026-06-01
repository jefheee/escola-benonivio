'use client';

import { useState } from 'react';
import { Search, FileText, FileSpreadsheet, Download, ExternalLink, FileArchive } from 'lucide-react';
import { EscolaAcervoDigitalPublic } from '@/lib/data/acervo';

interface AcervoHubProps {
  initialDocuments: EscolaAcervoDigitalPublic[];
}

const DISCIPLINES = [
  'Todas',
  'Matemática',
  'Português',
  'História',
  'Ciências',
  'Geografia',
  'Biologia',
  'Física',
  'Química',
  'Artes',
  'Inglês',
  'Educação Física',
  'Outros'
];

export default function AcervoHub({ initialDocuments }: AcervoHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('Todas');

  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const matchesDiscipline = (docCat: string | null, disc: string) => {
    if (!docCat) return disc === 'Outros';
    const catNorm = normalizeString(docCat);
    const discNorm = normalizeString(disc);

    if (disc === 'Outros') {
      const standards = DISCIPLINES.slice(1, -1).map(d => normalizeString(d));
      return !standards.includes(catNorm);
    }

    return catNorm === discNorm || catNorm.includes(discNorm) || discNorm.includes(catNorm);
  };

  const filteredDocuments = initialDocuments.filter(doc => {
    const matchesSearch = doc.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.categoria || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = selectedDiscipline === 'Todas' || matchesDiscipline(doc.categoria, selectedDiscipline);

    return matchesSearch && matchesTab;
  });

  const getFileIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('.xls') || lowerUrl.includes('.xlsx') || lowerUrl.includes('.csv')) {
      return <FileSpreadsheet className="h-5 w-5 text-slate-600" />;
    }
    if (lowerUrl.includes('.zip') || lowerUrl.includes('.rar') || lowerUrl.includes('.7z')) {
      return <FileArchive className="h-5 w-5 text-slate-600" />;
    }
    return <FileText className="h-5 w-5 text-slate-600" />;
  };

  const getFileExtension = (url: string) => {
    const parts = url.split('.');
    if (parts.length > 1) {
      const ext = parts[parts.length - 1].split('?')[0].toUpperCase();
      if (ext.length <= 4) return ext;
    }
    return 'PDF';
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Search and Filters row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-4 border border-slate-200 rounded-2xl">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar materiais..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="text-[11px] font-bold text-slate-450 uppercase shrink-0">
          {filteredDocuments.length} {filteredDocuments.length === 1 ? 'material encontrado' : 'materiais encontrados'}
        </div>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="border-b border-slate-200 pb-2">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-slate-300">
          {DISCIPLINES.map((disc) => (
            <button
              key={disc}
              onClick={() => setSelectedDiscipline(disc)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap outline-none border ${
                selectedDiscipline === disc
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-400 text-slate-600 hover:text-slate-900'
              }`}
            >
              {disc}
            </button>
          ))}
        </div>
      </div>

      {/* Downloads Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const ext = getFileExtension(doc.url_arquivo);
            
            return (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 hover:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[180px] hover:shadow-md transition-all duration-300 group"
              >
                {/* Top header block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-extrabold">
                      {doc.categoria || 'Geral'}
                    </span>
                    <span>
                      {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:underline line-clamp-2">
                    {doc.titulo}
                  </h4>
                </div>

                {/* Bottom action block */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-450 bg-slate-50 border border-slate-150 px-2 py-1.5 rounded-lg mr-auto shrink-0 select-none">
                    {getFileIcon(doc.url_arquivo)}
                    <span>{ext}</span>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={doc.url_arquivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-slate-250 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
                      title="Visualizar"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href={doc.url_arquivo}
                      download
                      className="p-2 bg-slate-900 hover:bg-black text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold px-3 py-2 shadow-sm"
                      title="Baixar"
                    >
                      <Download className="h-4 w-4" />
                      <span>Baixar</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">Nenhum material encontrado para esta busca/disciplina.</p>
        </div>
      )}
      
    </div>
  );
}
