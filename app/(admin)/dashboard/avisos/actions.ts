'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface EscolaAviso {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string | null;
  destaque_home: boolean;
  publicado: boolean;
  imagem_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAvisosAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('escola_avisos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar avisos: ${error.message}`);
  }

  return (data || []) as EscolaAviso[];
}

export async function saveAviso(prevState: unknown, formData: FormData) {
  const id = formData.get('id') as string;
  const titulo = formData.get('titulo') as string;
  const resumo = formData.get('resumo') as string;
  const conteudo = formData.get('conteudo') as string;
  const destaque_home = formData.get('destaque_home') === 'true';
  const publicado = formData.get('publicado') === 'true';
  const imagem_url = (formData.get('imagem_url') as string) || null;

  if (!titulo || !resumo) {
    return { error: 'Título e resumo são obrigatórios.' };
  }

  const supabase = createClient();

  if (id) {
    // Update
    const { error } = await supabase
      .from('escola_avisos')
      .update({
        titulo,
        resumo,
        conteudo,
        destaque_home,
        publicado,
        imagem_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { error: `Erro ao atualizar: ${error.message}` };
    }
  } else {
    // Insert
    const { error } = await supabase.from('escola_avisos').insert({
      titulo,
      resumo,
      conteudo,
      destaque_home,
      publicado,
      imagem_url,
    });

    if (error) {
      return { error: `Erro ao criar: ${error.message}` };
    }
  }

  revalidateTag('avisos');
  revalidatePath('/');
  revalidatePath('/avisos');
  revalidatePath('/dashboard/avisos');

  return { success: true };
}

export async function toggleAvisoDestaque(id: string, destaque: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from('escola_avisos')
    .update({ destaque_home: destaque, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { error: `Erro ao alterar destaque: ${error.message}` };
  }

  revalidateTag('avisos');
  revalidatePath('/');
  revalidatePath('/avisos');
  revalidatePath('/dashboard/avisos');

  return { success: true };
}

export async function toggleAvisoPublicado(id: string, publicado: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from('escola_avisos')
    .update({ publicado, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { error: `Erro ao alterar publicação: ${error.message}` };
  }

  revalidateTag('avisos');
  revalidatePath('/');
  revalidatePath('/avisos');
  revalidatePath('/dashboard/avisos');

  return { success: true };
}

export async function deleteAviso(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('escola_avisos').delete().eq('id', id);

  if (error) {
    return { error: `Erro ao excluir: ${error.message}` };
  }

  revalidateTag('avisos');
  revalidatePath('/');
  revalidatePath('/avisos');
  revalidatePath('/dashboard/avisos');

  return { success: true };
}
