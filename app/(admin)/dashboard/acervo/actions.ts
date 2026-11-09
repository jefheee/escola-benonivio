'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { sanitizeString, sanitizeInput, UUID_REGEX, isValidSafeUrl } from '@/lib/sanitize';

export interface EscolaAcervoItem {
  id: string;
  ano: string;
  categoria: string;
  titulo: string;
  descricao: string | null;
  imagens: string[] | null;
  data_publicacao: string;
  status: string;
  created_at: string;
}

// Zod Strict Schema for Acervo Payload
const acervoSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'ID inválido.').optional().or(z.literal('')),
  ano: z.string().min(1, 'Ano é obrigatório.').max(50),
  categoria: z.string().min(1, 'Categoria é obrigatória.').max(100),
  titulo: z.string().min(1, 'Título é obrigatório.').max(200),
  descricao: z.string().nullable().optional(),
  status: z.enum(['ativo', 'arquivado', 'lixeira']).default('ativo'),
  imagens: z.array(z.string().refine(isValidSafeUrl, 'URL de imagem inválida.')).optional().default([]),
  data_publicacao: z.string().optional(),
}).strict();

const idSchema = z.string().regex(UUID_REGEX, 'ID inválido.');
const anoSchema = z.string().min(1, 'Ano é obrigatório.');

function getStoragePathFromUrl(url: string, bucketName: string = 'escola_midias'): string | null {
  if (!url) return null;
  const matchStr = `${bucketName}/`;
  const index = url.indexOf(matchStr);
  if (index !== -1) {
    return url.substring(index + matchStr.length);
  }
  return null;
}

export async function getAcervoAdmin() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Acesso não autorizado.');
    }

    const { data, error } = await supabase
      .from('escola_acervo')
      .select('id, ano, categoria, titulo, descricao, imagens, data_publicacao, status, created_at')
      .order('ano', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('[DATABASE ERROR] getAcervoAdmin:', error);
      throw new Error('Falha ao recuperar acervo administrativo.');
    }

    return (data || []) as EscolaAcervoItem[];
  } catch (err) {
    console.error('[SERVER ACTION ERROR] getAcervoAdmin:', err);
    throw new Error('Não foi possível carregar os itens do acervo.');
  }
}

export async function saveAcervo(prevState: unknown, formData: FormData) {
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
      ano: sanitizeString(formData.get('ano') as string),
      categoria: sanitizeString(formData.get('categoria') as string),
      titulo: sanitizeString(formData.get('titulo') as string),
      descricao: sanitizeString(formData.get('descricao') as string) || null,
      status: (formData.get('status') as string) || 'ativo',
      imagens: sanitizeInput(parsedImagens),
      data_publicacao: (formData.get('data_publicacao') as string) || new Date().toISOString(),
    };

    // 1. Zod Payload Validation
    const validated = acervoSchema.safeParse(rawPayload);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Dados fornecidos são inválidos.';
      return { error: firstError };
    }

    const { id, ...acervoData } = validated.data;
    const supabase = createClient();

    // 2. Authoritative Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'Acesso negado. Sessão não autenticada.' };
    }

    if (id) {
      const { error } = await supabase
        .from('escola_acervo')
        .update(acervoData)
        .eq('id', id);

      if (error) {
        console.error('[DATABASE ERROR] update acervo:', error);
        return { error: 'Erro ao atualizar item do acervo.' };
      }
    } else {
      const { error } = await supabase
        .from('escola_acervo')
        .insert(acervoData);

      if (error) {
        console.error('[DATABASE ERROR] insert acervo:', error);
        return { error: 'Erro ao cadastrar novo acervo.' };
      }
    }

    revalidateTag('acervo');
    revalidatePath('/acervo');
    revalidatePath('/dashboard/acervo');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] saveAcervo:', err);
    return { error: 'Ocorreu um erro interno ao salvar o item.' };
  }
}

export async function archiveYear(anoRaw: string) {
  try {
    const anoClean = sanitizeString(anoRaw);
    const validAno = anoSchema.safeParse(anoClean);
    if (!validAno.success) {
      return { error: validAno.error.issues[0]?.message || 'Ano inválido.' };
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado. Sessão não autenticada.' };

    const { error } = await supabase
      .from('escola_acervo')
      .update({ status: 'arquivado' })
      .eq('ano', validAno.data)
      .neq('status', 'lixeira');

    if (error) {
      console.error('[DATABASE ERROR] archiveYear:', error);
      return { error: 'Erro ao arquivar itens do ano selecionado.' };
    }

    revalidateTag('acervo');
    revalidatePath('/acervo');
    revalidatePath('/dashboard/acervo');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] archiveYear:', err);
    return { error: 'Erro interno ao arquivar o ano.' };
  }
}

export async function moveToTrashAcervo(idRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) {
      return { error: 'ID do acervo inválido.' };
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_acervo')
      .update({ status: 'lixeira' })
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] moveToTrashAcervo:', error);
      return { error: 'Erro ao mover item para a lixeira.' };
    }

    revalidateTag('acervo');
    revalidatePath('/acervo');
    revalidatePath('/dashboard/acervo');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] moveToTrashAcervo:', err);
    return { error: 'Erro interno ao mover para lixeira.' };
  }
}

export async function restoreAcervo(idRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_acervo')
      .update({ status: 'ativo' })
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] restoreAcervo:', error);
      return { error: 'Erro ao restaurar item do acervo.' };
    }

    revalidateTag('acervo');
    revalidatePath('/acervo');
    revalidatePath('/dashboard/acervo');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] restoreAcervo:', err);
    return { error: 'Erro interno ao restaurar o acervo.' };
  }
}

export async function deleteAcervoPermanently(idRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { data: item, error: fetchError } = await supabase
      .from('escola_acervo')
      .select('imagens')
      .eq('id', validId.data)
      .single();

    if (fetchError) {
      console.error('[DATABASE ERROR] fetch acervo for deletion:', fetchError);
      return { error: 'Erro ao localizar item para exclusão.' };
    }

    const { error: deleteError } = await supabase
      .from('escola_acervo')
      .delete()
      .eq('id', validId.data);

    if (deleteError) {
      console.error('[DATABASE ERROR] delete acervo row:', deleteError);
      return { error: 'Erro ao excluir item do banco de dados.' };
    }

    const imagens: string[] = (item?.imagens as string[]) || [];
    if (imagens && imagens.length > 0) {
      const storagePaths = imagens
        .map((url) => getStoragePathFromUrl(url))
        .filter((path): path is string => !!path);

      if (storagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('escola_midias')
          .remove(storagePaths);

        if (storageError) {
          console.error('[STORAGE ERROR] remove orphan acervo images:', storageError);
        }
      }
    }

    revalidateTag('acervo');
    revalidatePath('/acervo');
    revalidatePath('/dashboard/acervo');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] deleteAcervoPermanently:', err);
    return { error: 'Erro interno ao excluir permanentemente o item.' };
  }
}
