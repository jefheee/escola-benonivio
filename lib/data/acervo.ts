import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabasePublic = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface EscolaAcervoDigitalPublic {
  id: string;
  titulo: string;
  url_arquivo: string;
  categoria: string | null;
  created_at: string;
}

export interface EscolaAcervoItemPublic {
  id: string;
  ano: string;
  categoria: string;
  titulo: string;
  descricao: string | null;
  imagens: string[] | null;
  data_publicacao: string;
  created_at: string;
}

// getAcervoPublic now queries school_documentos for Acervo Digital (Downloads Hub)
export const getAcervoPublic = unstable_cache(
  async () => {
    const { data, error } = await supabasePublic
      .from('escola_documentos')
      .select('id, titulo, url_arquivo, categoria, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar acervo digital (documentos) público:', error);
      return [];
    }

    return (data || []) as EscolaAcervoDigitalPublic[];
  },
  ['acervo-digital-publico'],
  {
    tags: ['documentos', 'acervo-digital'],
    revalidate: 60
  }
);

// getAcervoHistoricoPublic queries school_acervo for historical photos
export const getAcervoHistoricoPublic = unstable_cache(
  async () => {
    const nowStr = new Date().toISOString();
    const { data, error } = await supabasePublic
      .from('escola_acervo')
      .select('id, ano, categoria, titulo, descricao, imagens, data_publicacao, created_at')
      .eq('status', 'ativo')
      .lte('data_publicacao', nowStr)
      .order('ano', { ascending: false })
      .order('data_publicacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar acervo histórico público:', error);
      return [];
    }

    return (data || []) as EscolaAcervoItemPublic[];
  },
  ['acervo-historico-publico'],
  {
    tags: ['acervo-historico'],
    revalidate: 60
  }
);
