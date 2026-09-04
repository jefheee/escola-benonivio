'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { sanitizeString, sanitizeInput, UUID_REGEX } from '@/lib/sanitize';

export interface EscolaTurma {
  id: string;
  ano: string;
  nome: string;
  turno: string;
  whatsapp_link: string | null;
  outros_links: { titulo: string; url: string }[];
  created_at: string;
}

export interface EscolaTurmaPost {
  id: string;
  turma_id: string;
  titulo: string;
  conteudo: string | null;
  anexos: string[];
  imagem_url: string | null;
  imagens: string[] | null;
  link_referencia: string | null;
  data_publicacao: string;
  data_expiracao: string | null;
  status: string;
  created_at: string;
}

const turmaSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'ID inválido.').optional().or(z.literal('')),
  ano: z.string().min(1, 'Ano é obrigatório.').max(100),
  nome: z.string().min(1, 'Nome da turma é obrigatório.').max(100),
  turno: z.string().min(1, 'Turno é obrigatório.').max(50),
  whatsapp_link: z
    .string()
    .url('Link do WhatsApp inválido.')
    .startsWith('https://chat.whatsapp.com/', 'O link deve ser um convite de WhatsApp válido (começando com https://chat.whatsapp.com/).')
    .nullable()
    .optional(),
  outros_links: z
    .array(
      z.object({
        titulo: z.string().min(1),
        url: z.string().url(),
      })
    )
    .optional()
    .default([]),
}).strict();

const postSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'ID inválido.').optional().or(z.literal('')),
  turma_id: z.string().regex(UUID_REGEX, 'ID de turma inválido.'),
  titulo: z.string().min(1, 'Título é obrigatório.').max(200),
  conteudo: z.string().nullable().optional(),
  link_referencia: z.string().url('Link de referência inválido.').nullable().optional(),
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

// ---------------- TURMAS ACTIONS ----------------

export async function getTurmasAdmin() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('escola_turmas')
      .select('id, ano, nome, turno, whatsapp_link, outros_links, created_at')
      .order('ano', { ascending: true })
      .order('nome', { ascending: true })
      .limit(100);

    if (error) {
      console.error('[DATABASE ERROR] getTurmasAdmin:', error);
      throw new Error('Falha ao buscar turmas.');
    }

    return (data || []) as EscolaTurma[];
  } catch (err) {
    console.error('[SERVER ACTION ERROR] getTurmasAdmin:', err);
    throw new Error('Não foi possível carregar as turmas.');
  }
}

export async function saveTurma(prevState: unknown, formData: FormData) {
  try {
    const outrosLinksRaw = formData.get('outros_links') as string;
    let parsedOutrosLinks = [];
    if (outrosLinksRaw) {
      try {
        parsedOutrosLinks = JSON.parse(outrosLinksRaw);
      } catch {
        return { error: 'Formato de links adicionais inválido.' };
      }
    }

    const whatsappLinkRaw = formData.get('whatsapp_link') as string;

    const rawPayload = {
      id: (formData.get('id') as string) || undefined,
      ano: sanitizeString(formData.get('ano') as string),
      nome: sanitizeString(formData.get('nome') as string),
      turno: sanitizeString(formData.get('turno') as string),
      whatsapp_link: whatsappLinkRaw ? sanitizeString(whatsappLinkRaw) : null,
      outros_links: sanitizeInput(parsedOutrosLinks),
    };

    const validated = turmaSchema.safeParse(rawPayload);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Dados inválidos.';
      return { error: firstError };
    }

    const { id, ...turmaData } = validated.data;
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado. Usuário não autenticado.' };

    if (id) {
      const { error } = await supabase
        .from('escola_turmas')
        .update(turmaData)
        .eq('id', id);

      if (error) {
        console.error('[DATABASE ERROR] update turma:', error);
        return { error: 'Erro ao atualizar turma.' };
      }
    } else {
      const { error } = await supabase.from('escola_turmas').insert(turmaData);

      if (error) {
        console.error('[DATABASE ERROR] insert turma:', error);
        return { error: 'Erro ao criar turma.' };
      }
    }

    revalidateTag('turmas');
    revalidatePath('/turmas');
    revalidatePath('/dashboard/turmas');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] saveTurma:', err);
    return { error: 'Ocorreu um erro interno ao salvar a turma.' };
  }
}

export async function deleteTurma(idRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID da turma inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_turmas')
      .delete()
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] deleteTurma:', error);
      return { error: 'Erro ao excluir turma do banco de dados.' };
    }

    revalidateTag('turmas');
    revalidatePath('/turmas');
    revalidatePath('/dashboard/turmas');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] deleteTurma:', err);
    return { error: 'Erro interno ao excluir a turma.' };
  }
}

// ---------------- POSTS ACTIONS ----------------

export async function getPostsAdmin(turmaIdRaw: string) {
  try {
    const validTurmaId = idSchema.safeParse(turmaIdRaw);
    if (!validTurmaId.success) throw new Error('ID de turma inválido.');

    const supabase = createClient();
    const { data, error } = await supabase
      .from('escola_turmas_posts')
      .select('id, turma_id, titulo, conteudo, link_referencia, imagem_url, imagens, data_publicacao, data_expiracao, status, created_at')
      .eq('turma_id', validTurmaId.data)
      .order('data_publicacao', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[DATABASE ERROR] getPostsAdmin:', error);
      throw new Error('Falha ao buscar posts da turma.');
    }

    return (data || []) as EscolaTurmaPost[];
  } catch (err) {
    console.error('[SERVER ACTION ERROR] getPostsAdmin:', err);
    throw new Error('Não foi possível carregar os posts da turma.');
  }
}

export async function savePost(prevState: unknown, formData: FormData) {
  try {
    const rawImagens = formData.get('imagens') as string;
    let parsedImagens: string[] = [];
    if (rawImagens) {
      try {
        parsedImagens = JSON.parse(rawImagens);
      } catch {
        return { error: 'Formato de imagens inválido.' };
      }
    }

    const linkRefRaw = formData.get('link_referencia') as string;

    const rawPayload = {
      id: (formData.get('id') as string) || undefined,
      turma_id: formData.get('turma_id') as string,
      titulo: sanitizeString(formData.get('titulo') as string),
      conteudo: sanitizeString(formData.get('conteudo') as string) || null,
      link_referencia: linkRefRaw ? sanitizeString(linkRefRaw) : null,
      imagens: sanitizeInput(parsedImagens),
      data_publicacao: (formData.get('data_publicacao') as string) || new Date().toISOString(),
      data_expiracao: (formData.get('data_expiracao') as string) || null,
      status: (formData.get('status') as string) || 'ativo',
    };

    const validated = postSchema.safeParse(rawPayload);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Dados inválidos.';
      return { error: firstError };
    }

    const { id, turma_id, imagens, ...postDataFields } = validated.data;
    const imagem_url = imagens && imagens.length > 0 ? imagens[0] : null;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado. Usuário não autenticado.' };

    const postData = {
      turma_id,
      ...postDataFields,
      imagem_url,
      imagens,
    };

    if (id) {
      const { error } = await supabase
        .from('escola_turmas_posts')
        .update(postData)
        .eq('id', id);

      if (error) {
        console.error('[DATABASE ERROR] update post:', error);
        return { error: 'Erro ao atualizar recado da turma.' };
      }
    } else {
      const { error } = await supabase.from('escola_turmas_posts').insert(postData);

      if (error) {
        console.error('[DATABASE ERROR] insert post:', error);
        return { error: 'Erro ao criar recado da turma.' };
      }
    }

    revalidateTag(`turmas-posts-${turma_id}`);
    revalidateTag('turmas-posts');
    revalidatePath(`/turmas/${turma_id}`);
    revalidatePath('/dashboard/turmas');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] savePost:', err);
    return { error: 'Ocorreu um erro interno ao salvar o recado.' };
  }
}

export async function moveToTrashPost(idRaw: string, turmaIdRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    const validTurmaId = idSchema.safeParse(turmaIdRaw);
    if (!validId.success || !validTurmaId.success) return { error: 'IDs inválidos.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_turmas_posts')
      .update({ status: 'lixeira' })
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] moveToTrashPost:', error);
      return { error: 'Erro ao mover recado para a lixeira.' };
    }

    revalidateTag(`turmas-posts-${validTurmaId.data}`);
    revalidateTag('turmas-posts');
    revalidatePath(`/turmas/${validTurmaId.data}`);
    revalidatePath('/dashboard/turmas');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] moveToTrashPost:', err);
    return { error: 'Erro interno ao mover para lixeira.' };
  }
}

export async function restorePost(idRaw: string, turmaIdRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    const validTurmaId = idSchema.safeParse(turmaIdRaw);
    if (!validId.success || !validTurmaId.success) return { error: 'IDs inválidos.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { error } = await supabase
      .from('escola_turmas_posts')
      .update({ status: 'ativo' })
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] restorePost:', error);
      return { error: 'Erro ao restaurar recado.' };
    }

    revalidateTag(`turmas-posts-${validTurmaId.data}`);
    revalidateTag('turmas-posts');
    revalidatePath(`/turmas/${validTurmaId.data}`);
    revalidatePath('/dashboard/turmas');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] restorePost:', err);
    return { error: 'Erro interno ao restaurar o recado.' };
  }
}

export async function deletePostPermanently(idRaw: string, turmaIdRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    const validTurmaId = idSchema.safeParse(turmaIdRaw);
    if (!validId.success || !validTurmaId.success) return { error: 'IDs inválidos.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { data: post, error: fetchError } = await supabase
      .from('escola_turmas_posts')
      .select('imagens')
      .eq('id', validId.data)
      .single();

    if (fetchError) {
      console.error('[DATABASE ERROR] fetch post for deletion:', fetchError);
      return { error: 'Erro ao localizar imagens do recado.' };
    }

    const { error: deleteError } = await supabase
      .from('escola_turmas_posts')
      .delete()
      .eq('id', validId.data);

    if (deleteError) {
      console.error('[DATABASE ERROR] delete post row:', deleteError);
      return { error: 'Erro ao excluir recado do banco de dados.' };
    }

    const imagens: string[] = (post?.imagens as string[]) || [];
    if (imagens && imagens.length > 0) {
      const storagePaths = imagens
        .map((url) => getStoragePathFromUrl(url))
        .filter((path): path is string => !!path);

      if (storagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('escola_midias')
          .remove(storagePaths);

        if (storageError) {
          console.error('[STORAGE ERROR] remove orphan post images:', storageError);
        }
      }
    }

    revalidateTag(`turmas-posts-${validTurmaId.data}`);
    revalidateTag('turmas-posts');
    revalidatePath(`/turmas/${validTurmaId.data}`);
    revalidatePath('/dashboard/turmas');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] deletePostPermanently:', err);
    return { error: 'Erro interno ao excluir permanentemente o recado.' };
  }
}
