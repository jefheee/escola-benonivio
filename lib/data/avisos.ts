import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabasePublic = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface EscolaAvisoPublic {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string | null;
  imagem_url: string | null;
  imagens: string[] | null;
  data_publicacao: string;
  created_at: string;
}

export const getAvisosPublic = unstable_cache(
  async () => {
    const nowStr = new Date().toISOString();
    const { data, error } = await supabasePublic
      .from('escola_avisos')
      .select('id, titulo, resumo, conteudo, imagem_url, imagens, data_publicacao, created_at')
      .eq('status', 'ativo')
      .lte('data_publicacao', nowStr)
      .or(`data_expiracao.is.null,data_expiracao.gt.${nowStr}`)
      .order('data_publicacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avisos públicos:', error);
      return [];
    }

    return (data || []) as EscolaAvisoPublic[];
  },
  ['avisos-publicos'],
  {
    tags: ['avisos'],
    revalidate: 60
  }
);

export const getAvisosDestaqueHome = unstable_cache(
  async () => {
    const nowStr = new Date().toISOString();
    const { data, error } = await supabasePublic
      .from('escola_avisos')
      .select('id, titulo, resumo, conteudo, imagem_url, imagens, data_publicacao, created_at')
      .eq('status', 'ativo')
      .eq('destaque_home', true)
      .lte('data_publicacao', nowStr)
      .or(`data_expiracao.is.null,data_expiracao.gt.${nowStr}`)
      .order('data_publicacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avisos de destaque:', error);
      return [];
    }

    return (data || []) as EscolaAvisoPublic[];
  },
  ['avisos-destaque'],
  {
    tags: ['avisos'],
    revalidate: 60
  }
);
