'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { sanitizeString } from '@/lib/sanitize';

export interface EscolaNotificacao {
  id: string;
  titulo: string;
  mensagem: string;
  importancia: 'Alta' | 'Média' | 'Baixa';
  ativa: boolean;
  created_at: string;
}

const notificacaoSchema = z.object({
  id: z.string().uuid().optional().or(z.literal('')),
  titulo: z.string().min(1, 'Título é obrigatório.').max(200),
  mensagem: z.string().min(1, 'Mensagem é obrigatória.').max(1000),
  importancia: z.enum(['Alta', 'Média', 'Baixa']),
  ativa: z.boolean().default(true),
}).strict();

const idSchema = z.string().uuid('ID inválido.');

export async function getNotificacoesAdmin() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('escola_notificacoes')
      .select('id, titulo, mensagem, importancia, ativa, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[DATABASE ERROR] getNotificacoesAdmin:', error);
      throw new Error('Falha ao consultar notificações.');
    }

    return (data || []) as EscolaNotificacao[];
  } catch (err) {
    console.error('[SERVER ACTION ERROR] getNotificacoesAdmin:', err);
    throw new Error('Não foi possível carregar a lista de notificações.');
  }
}

export async function saveNotificacao(prevState: unknown, formData: FormData) {
  try {
    const rawPayload = {
      id: (formData.get('id') as string) || undefined,
      titulo: sanitizeString(formData.get('titulo') as string),
      mensagem: sanitizeString(formData.get('mensagem') as string),
      importancia: formData.get('importancia') as 'Alta' | 'Média' | 'Baixa',
      ativa: formData.get('ativa') === 'true',
    };

    const validated = notificacaoSchema.safeParse(rawPayload);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Dados inválidos.';
      return { error: firstError };
    }

    const { id, ...notifData } = validated.data;
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado. Usuário não autenticado.' };

    if (id) {
      const { error } = await supabase
        .from('escola_notificacoes')
        .update(notifData)
        .eq('id', id);

      if (error) {
        console.error('[DATABASE ERROR] update notificacao:', error);
        return { error: 'Erro ao atualizar notificação.' };
      }
    } else {
      const { error } = await supabase.from('escola_notificacoes').insert(notifData);

      if (error) {
        console.error('[DATABASE ERROR] insert notificacao:', error);
        return { error: 'Erro ao criar notificação.' };
      }
    }

    revalidateTag('notificacoes');
    revalidatePath('/');
    revalidatePath('/dashboard/notificacoes');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] saveNotificacao:', err);
    return { error: 'Ocorreu um erro interno ao salvar a notificação.' };
  }
}

export async function toggleNotificacaoAtiva(idRaw: string, ativa: boolean) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_notificacoes')
      .update({ ativa: Boolean(ativa) })
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] toggleNotificacaoAtiva:', error);
      return { error: 'Erro ao alterar status da notificação.' };
    }

    revalidateTag('notificacoes');
    revalidatePath('/');
    revalidatePath('/dashboard/notificacoes');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] toggleNotificacaoAtiva:', err);
    return { error: 'Erro interno ao alterar status.' };
  }
}

export async function deleteNotificacao(idRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_notificacoes')
      .delete()
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] deleteNotificacao:', error);
      return { error: 'Erro ao excluir notificação.' };
    }

    revalidateTag('notificacoes');
    revalidatePath('/');
    revalidatePath('/dashboard/notificacoes');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] deleteNotificacao:', err);
    return { error: 'Erro interno ao excluir notificação.' };
  }
}
