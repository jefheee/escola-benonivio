import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabasePublic = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface EscolaPaginaConteudoPublic {
  slug: string;
  conteudo_html: string | null;
  updated_at: string;
}

export const getPaginaConteudoPublic = unstable_cache(
  async (slug: string) => {
    const { data, error } = await supabasePublic
      .from('escola_conteudo_paginas')
      .select('slug, conteudo_html, updated_at')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`Erro ao buscar conteúdo da página ${slug}:`, error);
      return null;
    }

    return data as EscolaPaginaConteudoPublic | null;
  },
  ['pagina-conteudo'],
  {
    tags: ['paginas'],
  }
);
