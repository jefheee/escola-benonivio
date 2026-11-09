'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { sanitizeString, UUID_REGEX, isValidSafeUrl } from '@/lib/sanitize';

export interface EscolaDocumento {
  id: string;
  titulo: string;
  url_arquivo: string;
  categoria: string | null;
  created_at: string;
}

const documentoSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'ID inválido.').optional().or(z.literal('')),
  titulo: z.string().min(1, 'Título é obrigatório.').max(200),
  url_arquivo: z.string().refine(isValidSafeUrl, 'URL do arquivo inválida. Deve utilizar https:// ou http://'),
  categoria: z.string().nullable().optional(),
}).strict();

const idSchema = z.string().regex(UUID_REGEX, 'ID inválido.');

export async function getDocumentosAdmin() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Acesso não autorizado.');
    }

    const { data, error } = await supabase
      .from('escola_documentos')
      .select('id, titulo, url_arquivo, categoria, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('[DATABASE ERROR] getDocumentosAdmin:', error);
      throw new Error('Falha ao buscar documentos.');
    }

    return (data || []) as EscolaDocumento[];
  } catch (err) {
    console.error('[SERVER ACTION ERROR] getDocumentosAdmin:', err);
    throw new Error('Não foi possível carregar a lista de documentos.');
  }
}

export async function saveDocumento(prevState: unknown, formData: FormData) {
  try {
    const rawPayload = {
      id: (formData.get('id') as string) || undefined,
      titulo: sanitizeString(formData.get('titulo') as string),
      url_arquivo: sanitizeString(formData.get('url_arquivo') as string),
      categoria: sanitizeString(formData.get('categoria') as string) || null,
    };

    const validated = documentoSchema.safeParse(rawPayload);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || 'Dados do documento inválidos.';
      return { error: firstError };
    }

    const { id, ...docData } = validated.data;
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado. Usuário não autenticado.' };

    if (id) {
      const { error } = await supabase
        .from('escola_documentos')
        .update(docData)
        .eq('id', id);

      if (error) {
        console.error('[DATABASE ERROR] update documento:', error);
        return { error: 'Erro ao atualizar documento.' };
      }
    } else {
      const { error } = await supabase.from('escola_documentos').insert(docData);

      if (error) {
        console.error('[DATABASE ERROR] insert documento:', error);
        return { error: 'Erro ao criar documento.' };
      }
    }

    revalidateTag('documentos');
    revalidatePath('/app');
    revalidatePath('/dashboard/documentos');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] saveDocumento:', err);
    return { error: 'Ocorreu um erro interno ao salvar o documento.' };
  }
}

export async function deleteDocumento(idRaw: string) {
  try {
    const validId = idSchema.safeParse(idRaw);
    if (!validId.success) return { error: 'ID do documento inválido.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Acesso negado.' };

    const { data: doc, error: fetchError } = await supabase
      .from('escola_documentos')
      .select('url_arquivo')
      .eq('id', validId.data)
      .single();

    if (fetchError) {
      console.error('[DATABASE ERROR] fetch documento:', fetchError);
      return { error: 'Erro ao localizar documento no banco de dados.' };
    }

    if (doc?.url_arquivo) {
      try {
        const match = doc.url_arquivo.match(/\/escola_midias\/(.+)$/);
        if (match && match[1]) {
          const filePath = decodeURIComponent(match[1]);
          const { error: storageError } = await supabase.storage
            .from('escola_midias')
            .remove([filePath]);

          if (storageError) {
            console.error('[STORAGE ERROR] remove documento file:', storageError);
          }
        }
      } catch (err) {
        console.error('[STORAGE ERROR] parse url_arquivo:', err);
      }
    }

    const { error } = await supabase
      .from('escola_documentos')
      .delete()
      .eq('id', validId.data);

    if (error) {
      console.error('[DATABASE ERROR] delete documento:', error);
      return { error: 'Erro ao excluir documento do banco de dados.' };
    }

    revalidateTag('documentos');
    revalidatePath('/documentos');
    revalidatePath('/dashboard/documentos');

    return { success: true };
  } catch (err) {
    console.error('[SERVER ACTION ERROR] deleteDocumento:', err);
    return { error: 'Erro interno ao excluir o documento.' };
  }
}
