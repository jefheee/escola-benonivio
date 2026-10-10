import { unstable_cache } from 'next/cache';
import { supabasePublic } from '@/lib/supabase/public';

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
      .order('created_at', { ascending: false })
      .limit(20);

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
