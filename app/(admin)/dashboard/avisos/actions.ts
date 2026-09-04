'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { sanitizeString, sanitizeInput, UUID_REGEX } from '@/lib/sanitize';

export interface EscolaAviso {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string | null;
  destaque_home: boolean;
  publicado: boolean;
  imagem_url: string | null;
  imagens: string[] | null;
  data_publicacao: string;
  data_expiracao: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const avisoSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'ID inválido.').optional().or(z.literal('')),
  titulo: z.string().min(1, 'Título é obrigatório.').max(200),
  resumo: z.string().min(1, 'Resumo é obrigatório.').max(500),
  conteudo: z.string().nullable().optional(),
  destaque_home: z.boolean().default(false),
  publicado: z.boolean().default(true),
  imagem_url: z.string().nullable().optional(),
  imagens: z.array(z.string().url('URL de imagem inválida.')).optional().default([]),
  data_publicacao: z.string().optional(),
  data_expiracao: z.string().nullable().optional(),
  status: z.enum(['ativo', 'lixeira']).default('ativo'),
}).strict();

const idSchema = z.string().regex(UUID_REGEX, 'ID inválido.');

function getStoragePathFromUrl(url: string, bucketName: string = 'escola_midias'): string | null {
  if (!url) return null;
  const matchStr = `${bucketName}/`;
  const index = url.indexOf(matchStr);
  if (index !== -1) {
    return url.substring(index + matchStr.length);
  }
  return null;
}

export async function getAvisosAdmin() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('escola_avisos')
      .select('id, titulo, resumo, conteudo, destaque_home, publicado, imagem_url, imagens, data_publicacao, data_expiracao, status, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('[DATABASE ERROR] getAvisosAdmin:', error);
      throw new Error('Falha ao consultar avisos.');
    }

    return (data || []) as EscolaAviso[];
  } catch (err) {
    console.error('[SERVER ACTION ERROR] getAvisosAdmin:', err);
    throw new Error('Não foi possível carregar a lista de avisos.');
  }
}

export async function saveAviso(prevState: unknown, formData: FormData) {
  try {
    const rawImagens = formData.get('imagens') as string;
    let parsedImagens: string[] = [];
    if (rawImagens) {
      try {
        parsedImagens = JSON.parse(rawImagens);
      } catch {
        return { error: 'Formato de lista de imagens inválido.' };
      }
    }

    const rawPayload = {
      id: (formData.get('id') as string) || undefined,
      titulo: sanitizeString(formData.get('titulo') as string),
      resumo: sanitizeString(formData.get('resumo') as string),
      conteudo: sanitizeString(formData.get('conteudo') as string) || null,
      destaque_home: formData.get('destaque_home') === 'true',
      publicado: formData.get('publicado') === 'true',
      imagens: sanitizeInput(parsedImagens),
      data_publicacao: (formData.get('data_publicacao') as string) || new Date().toISOString(),
      data_expiracao: (formData.get('data_expiracao') as string) || null,
      status: (formData.get('status') as string) || 'ativo',
    };

    const validated = avisoSchema.safeParse(rawPayload);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Dados inválidos.';
      return { error: firstError };
    }

    const { id, imagens, ...parsedData } = validated.data;
    const imagem_url = imagens && imagens.length > 0 ? imagens[0] : null;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado. Usuário não autenticado.' };

    const updateData = {
      ...parsedData,
      imagem_url,
      imagens,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await supabase
        .from('escola_avisos')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('[DATABASE ERROR] update aviso:', error);
        return { error: 'Erro ao atualizar aviso.' };
      }
    } else {
      const { error } = await supabase.from('escola_avisos').insert({
        ...parsedData,
        imagem_url,
        imagens,
      });

      if (error) {
        console.error('[DATABASE ERROR] insert aviso:', error);
        return { error: 'Erro ao criar aviso.' };
      }
    }

    revalidateTag('avisos');
    revalidatePath('/');
    revalidatePath('/avisos');
    revalidatePath('/dashboard/avisos');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] saveAviso:', err);
    return { error: 'Ocorreu um erro interno ao salvar o aviso.' };
  }
}

export async function toggleAvisoDestaque(idRaw: string, destaque: boolean) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_avisos')
      .update({ destaque_home: Boolean(destaque), updated_at: new Date().toISOString() })
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] toggleAvisoDestaque:', error);
      return { error: 'Erro ao alterar destaque do aviso.' };
    }

    revalidateTag('avisos');
    revalidatePath('/');
    revalidatePath('/avisos');
    revalidatePath('/dashboard/avisos');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] toggleAvisoDestaque:', err);
    return { error: 'Erro interno ao alterar destaque.' };
  }
}

export async function toggleAvisoPublicado(idRaw: string, publicado: boolean) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_avisos')
      .update({ publicado: Boolean(publicado), updated_at: new Date().toISOString() })
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] toggleAvisoPublicado:', error);
      return { error: 'Erro ao alterar publicação do aviso.' };
    }

    revalidateTag('avisos');
    revalidatePath('/');
    revalidatePath('/avisos');
    revalidatePath('/dashboard/avisos');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] toggleAvisoPublicado:', err);
    return { error: 'Erro interno ao alterar publicação.' };
  }
}

export async function moveToTrashAviso(idRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_avisos')
      .update({ status: 'lixeira', publicado: false, updated_at: new Date().toISOString() })
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] moveToTrashAviso:', error);
      return { error: 'Erro ao mover aviso para a lixeira.' };
    }

    revalidateTag('avisos');
    revalidatePath('/');
    revalidatePath('/avisos');
    revalidatePath('/dashboard/avisos');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] moveToTrashAviso:', err);
    return { error: 'Erro interno ao mover aviso para lixeira.' };
  }
}

export async function restoreAviso(idRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_avisos')
      .update({ status: 'ativo', publicado: true, updated_at: new Date().toISOString() })
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] restoreAviso:', error);
      return { error: 'Erro ao restaurar aviso.' };
    }

    revalidateTag('avisos');
    revalidatePath('/');
    revalidatePath('/avisos');
    revalidatePath('/dashboard/avisos');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] restoreAviso:', err);
    return { error: 'Erro interno ao restaurar aviso.' };
  }
}

export async function deleteAvisoPermanently(idRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { data: aviso, error: fetchError } = await supabase
      .from('escola_avisos')
      .select('imagens')
      .eq('id', validId.data)
      .single();

    if (fetchError) {
      console.error('[DATABASE ERROR] fetch aviso images:', fetchError);
      return { error: 'Erro ao localizar imagens do aviso.' };
    }

    const { error: deleteDbError } = await supabase
      .from('escola_avisos')
      .delete()
      .eq('id', validId.data);

    if (deleteDbError) {
      console.error('[DATABASE ERROR] delete aviso row:', deleteDbError);
      return { error: 'Erro ao excluir aviso do banco de dados.' };
    }

    const imagens: string[] = (aviso?.imagens as string[]) || [];
    if (imagens && imagens.length > 0) {
      const storagePaths = imagens
        .map((url) => getStoragePathFromUrl(url))
        .filter((path): path is string => !!path);

      if (storagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('escola_midias')
          .remove(storagePaths);

        if (storageError) {
          console.error('[STORAGE ERROR] remove orphan aviso images:', storageError);
        }
      }
    }

    revalidateTag('avisos');
    revalidatePath('/');
    revalidatePath('/avisos');
    revalidatePath('/dashboard/avisos');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] deleteAvisoPermanently:', err);
    return { error: 'Erro interno ao excluir o aviso permanentemente.' };
  }
}
