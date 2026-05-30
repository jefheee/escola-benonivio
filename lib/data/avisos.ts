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
  created_at: string;
}

export const getAvisosPublic = unstable_cache(
  async () => {
    const { data, error } = await supabasePublic
      .from('escola_avisos')
      .select('id, titulo, resumo, conteudo, imagem_url, created_at')
      .eq('publicado', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avisos públicos:', error);
      return [];
    }

    return (data || []) as EscolaAvisoPublic[];
  },
  ['avisos-publicos'],
  {
    tags: ['avisos'],
  }
);

export const getAvisosDestaqueHome = unstable_cache(
  async () => {
    const { data, error } = await supabasePublic
      .from('escola_avisos')
      .select('id, titulo, resumo, conteudo, imagem_url, created_at')
      .eq('publicado', true)
      .eq('destaque_home', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avisos de destaque:', error);
      return [];
    }

    return (data || []) as EscolaAvisoPublic[];
  },
  ['avisos-destaque'],
  {
    tags: ['avisos'],
  }
);
