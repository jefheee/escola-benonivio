import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabasePublic = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface EscolaDocumentoPublic {
  id: string;
  titulo: string;
  url_arquivo: string;
  categoria: string | null;
  created_at: string;
}

export const getDocumentosPublic = unstable_cache(
  async () => {
    const { data, error } = await supabasePublic
      .from('escola_documentos')
      .select('id, titulo, url_arquivo, categoria, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar documentos públicos:', error);
      return [];
    }

    return (data || []) as EscolaDocumentoPublic[];
  },
  ['documentos-list'],
  {
    tags: ['documentos'],
  }
);
