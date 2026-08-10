import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabasePublic = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface EscolaTurmaPublic {
  id: string;
  ano: string;
  nome: string;
  turno: string;
  whatsapp_link: string | null;
  outros_links: { titulo: string; url: string }[] | null;
}

export interface EscolaTurmaPostPublic {
  id: string;
  turma_id: string;
  titulo: string;
  conteudo: string | null;
  anexos: string[] | null;
  imagem_url: string | null;
  imagens: string[] | null;
  link_referencia: string | null;
  data_publicacao: string;
  created_at: string;
}

// Custom ranking for sorting grades from highest to lowest
export const GRADE_RANK: Record<string, number> = {
  "3º Ano Ensino Médio": 8,
  "2º Ano Ensino Médio": 7,
  "1º Ano Ensino Médio": 6,
  "9º Ano": 5,
  "8º Ano": 4,
  "7º Ano": 3,
  "6º Ano": 2,
  "Anos Iniciais": 1,
};

export const getTurmasPublic = unstable_cache(
  async () => {
    const { data, error } = await supabasePublic
      .from('escola_turmas')
      .select('id, ano, nome, turno, whatsapp_link, outros_links')
      .order('ano', { ascending: true })
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar turmas públicas:', error);
      return [];
    }

    return (data || []) as EscolaTurmaPublic[];
  },
  ['turmas-list'],
  {
    tags: ['turmas'],
  }
);

export const getTurmaByIdPublic = unstable_cache(
  async (id: string) => {
    const { data, error } = await supabasePublic
      .from('escola_turmas')
      .select('id, ano, nome, turno, whatsapp_link, outros_links')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erro ao buscar turma por ID ${id}:`, error);
      return null;
    }

    return data as EscolaTurmaPublic;
  },
  ['turma-detail'],
  {
    tags: ['turmas'],
  }
);

export const getTurmaPostsPublic = unstable_cache(
  async (turmaId: string) => {
    const nowStr = new Date().toISOString();
    const { data, error } = await supabasePublic
      .from('escola_turmas_posts')
      .select('id, turma_id, titulo, conteudo, anexos, imagem_url, imagens, link_referencia, data_publicacao, created_at')
      .eq('turma_id', turmaId)
      .eq('status', 'ativo')
      .lte('data_publicacao', nowStr)
      .or(`data_expiracao.is.null,data_expiracao.gt.${nowStr}`)
      .order('data_publicacao', { ascending: false });

    if (error) {
      console.error(`Erro ao buscar posts da turma ${turmaId}:`, error);
      return [];
    }

    return (data || []) as EscolaTurmaPostPublic[];
  },
  ['turma-posts-list'],
  {
    tags: ['turmas-posts', 'turmas'],
    revalidate: 60
  }
);
