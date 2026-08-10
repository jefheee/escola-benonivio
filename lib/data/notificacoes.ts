import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabasePublic = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface EscolaNotificacaoPublic {
  id: string;
  titulo: string;
  mensagem: string;
  importancia: 'Alta' | 'Média' | 'Baixa';
  ativa: boolean;
  created_at: string;
}

export const getNotificacoesPublic = unstable_cache(
  async () => {
    const { data, error } = await supabasePublic
      .from('escola_notificacoes')
      .select('id, titulo, mensagem, importancia, ativa, created_at')
      .eq('ativa', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar notificações públicas:', error);
      return [];
    }

    return (data || []) as EscolaNotificacaoPublic[];
  },
  ['notificacoes-list'],
  {
    tags: ['notificacoes'],
  }
);
