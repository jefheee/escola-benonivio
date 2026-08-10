import { getDocumentosAdmin } from './actions';
import DocumentosManager from './components/documentos-manager';

export const dynamic = 'force-dynamic';

export default async function DocumentosDashboardPage() {
  const docs = await getDocumentosAdmin();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#00185f] font-display">
          Gerenciar Documentos Públicos
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Faça upload de editais, atas de reuniões, prestações de contas da APP e regulamentos para download na interface pública.
        </p>
      </div>

      <DocumentosManager initialDocs={docs} />
    </div>
  );
}
