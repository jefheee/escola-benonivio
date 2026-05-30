'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface EscolaDocumento {
  id: string;
  titulo: string;
  url_arquivo: string;
  categoria: string | null;
  created_at: string;
}

export async function getDocumentosAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('escola_documentos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar documentos: ${error.message}`);
  }

  return (data || []) as EscolaDocumento[];
}

export async function saveDocumento(prevState: unknown, formData: FormData) {
  const id = formData.get('id') as string;
  const titulo = formData.get('titulo') as string;
  const url_arquivo = formData.get('url_arquivo') as string;
  const categoria = formData.get('categoria') as string || null;

  if (!titulo || !url_arquivo) {
    return { error: 'Título e arquivo são obrigatórios.' };
  }

  const supabase = createClient();

  if (id) {
    const { error } = await supabase
      .from('escola_documentos')
      .update({
        titulo,
        url_arquivo,
        categoria,
      })
      .eq('id', id);

    if (error) {
      return { error: `Erro ao atualizar documento: ${error.message}` };
    }
  } else {
    const { error } = await supabase.from('escola_documentos').insert({
      titulo,
      url_arquivo,
      categoria,
    });

    if (error) {
      return { error: `Erro ao criar documento: ${error.message}` };
    }
  }

  revalidateTag('documentos');
  revalidatePath('/app'); // APPPage uses documents
  revalidatePath('/dashboard/documentos');

  return { success: true };
}

export async function deleteDocumento(id: string) {
  const supabase = createClient();

  // 1. Get the document details to retrieve url_arquivo
  const { data: doc, error: fetchError } = await supabase
    .from('escola_documentos')
    .select('url_arquivo')
    .eq('id', id)
    .single();

  if (fetchError) {
    return { error: `Erro ao localizar documento no banco: ${fetchError.message}` };
  }

  // 2. Delete the file from Storage if the URL matches our pattern
  if (doc?.url_arquivo) {
    try {
      const match = doc.url_arquivo.match(/\/escola_midias\/(.+)$/);
      if (match && match[1]) {
        const filePath = decodeURIComponent(match[1]);
        const { error: storageError } = await supabase.storage
          .from('escola_midias')
          .remove([filePath]);
        
        if (storageError) {
          console.error(`Erro ao deletar arquivo do Storage: ${storageError.message}`);
        }
      }
    } catch (err) {
      console.error('Erro na remoção do arquivo do storage:', err);
    }
  }

  // 3. Delete from DB
  const { error } = await supabase.from('escola_documentos').delete().eq('id', id);

  if (error) {
    return { error: `Erro ao excluir documento do banco: ${error.message}` };
  }

  revalidateTag('documentos');
  revalidatePath('/documentos');
  revalidatePath('/dashboard/documentos');

  return { success: true };
}
