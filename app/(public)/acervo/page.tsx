import { getAcervoPublic } from '@/lib/data/acervo';
import AcervoHub from './components/acervo-hub';

export const dynamic = 'force-dynamic';

export default async function PublicAcervoPage() {
  const documents = await getAcervoPublic();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-block bg-slate-100 text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-slate-200 mb-1 tracking-wider">
          Materiais & Downloads
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 font-display">
          Acervo Digital Pedagógico
        </h1>
        <div className="h-1 w-20 bg-slate-900 mx-auto rounded-full" />
        <p className="text-slate-600 font-medium">
          Acesse planos de aula, roteiros de estudos, apostilas e materiais de apoio pedagógico disponibilizados pelo corpo docente da escola.
        </p>
      </div>

      {/* Interactive Downloads Hub */}
      <AcervoHub initialDocuments={documents} />
    </div>
  );
}
