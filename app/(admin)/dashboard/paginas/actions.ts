'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { sanitizeString } from '@/lib/sanitize';

export interface EscolaPaginaConteudo {
  slug: string;
  conteudo_html: string | null;
  updated_at: string;
}

const paginaSchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório.').max(100).regex(/^[a-z0-9-]+$/, 'Formato de slug inválido.'),
  conteudo_html: z.string().nullable().optional(),
}).strict();

export async function getPaginasAdmin() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('escola_conteudo_paginas')
      .select('slug, conteudo_html, updated_at')
      .order('slug', { ascending: true })
      .limit(50);

    if (error) {
      console.error('[DATABASE ERROR] getPaginasAdmin:', error);
      throw new Error('Falha ao buscar páginas.');
    }

    return (data || []) as EscolaPaginaConteudo[];
  } catch (err) {
    console.error('[SERVER ACTION ERROR] getPaginasAdmin:', err);
    throw new Error('Não foi possível carregar o conteúdo das páginas.');
  }
}

export async function savePaginaConteudo(slugRaw: string, conteudoHtmlRaw: string) {
  try {
    const rawPayload = {
      slug: sanitizeString(slugRaw),
      conteudo_html: sanitizeString(conteudoHtmlRaw) || null,
    };

    const validated = paginaSchema.safeParse(rawPayload);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Dados inválidos.';
      return { error: firstError };
    }

    const { slug, conteudo_html } = validated.data;
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado. Usuário não autenticado.' };

    const { error } = await supabase
      .from('escola_conteudo_paginas')
      .upsert(
        {
          slug,
          conteudo_html,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      );

    if (error) {
      console.error('[DATABASE ERROR] savePaginaConteudo:', error);
      return { error: 'Erro ao salvar conteúdo da página.' };
    }

    revalidateTag(`pagina-${slug}`);
    revalidateTag('paginas');
    revalidatePath('/');
    revalidatePath('/sobre');
    revalidatePath('/dashboard/paginas');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] savePaginaConteudo:', err);
    return { error: 'Ocorreu um erro interno ao salvar a página.' };
  }
}
