'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface EscolaTurma {
  id: string;
  ano: string; // Ex: 6º Ano
  nome: string; // Ex: 61
  turno: string; // Matutino, Vespertino, Noturno
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
  link_referencia: string | null;
  created_at: string;
}

// ---------------- TURMAS ACTIONS ----------------

export async function getTurmasAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('escola_turmas')
    .select('*')
    .order('ano', { ascending: true })
    .order('nome', { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar turmas: ${error.message}`);
  }

  return (data || []) as EscolaTurma[];
}

export async function saveTurma(prevState: unknown, formData: FormData) {
  const id = formData.get('id') as string;
  const ano = formData.get('ano') as string;
  const nome = formData.get('nome') as string;
  const turno = formData.get('turno') as string;
  const whatsapp_link = (formData.get('whatsapp_link') as string) || null;
  const outros_links_raw = formData.get('outros_links') as string;

  let outros_links = [];
  if (outros_links_raw) {
    try {
      outros_links = JSON.parse(outros_links_raw);
    } catch {
      return { error: 'Formato de links adicionais inválido.' };
    }
  }

  if (!ano || !nome || !turno) {
    return { error: 'Ano, Nome e Turno são obrigatórios.' };
  }

  if (whatsapp_link && !whatsapp_link.startsWith('https://chat.whatsapp.com/')) {
    return { error: 'O link deve ser um convite de WhatsApp válido (começando com https://chat.whatsapp.com/).' };
  }

  const supabase = createClient();

  if (id) {
    // Update
    const { error } = await supabase
      .from('escola_turmas')
      .update({
        ano,
        nome,
        turno,
        whatsapp_link,
        outros_links,
      })
      .eq('id', id);

    if (error) {
      return { error: `Erro ao atualizar turma: ${error.message}` };
    }
  } else {
    // Insert
    const { error } = await supabase.from('escola_turmas').insert({
      ano,
      nome,
      turno,
      whatsapp_link,
      outros_links,
    });

    if (error) {
      return { error: `Erro ao criar turma: ${error.message}` };
    }
  }

  revalidateTag('turmas');
  revalidatePath('/turmas');
  revalidatePath('/dashboard/turmas');

  return { success: true };
}

export async function deleteTurma(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('escola_turmas').delete().eq('id', id);

  if (error) {
    return { error: `Erro ao excluir turma: ${error.message}` };
  }

  revalidateTag('turmas');
  revalidatePath('/turmas');
  revalidatePath('/dashboard/turmas');

  return { success: true };
}

// ---------------- POSTS ACTIONS ----------------

export async function getPostsAdmin(turmaId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('escola_turmas_posts')
    .select('*')
    .eq('turma_id', turmaId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar posts da turma: ${error.message}`);
  }

  return (data || []) as EscolaTurmaPost[];
}

export async function savePost(prevState: unknown, formData: FormData) {
  const id = formData.get('id') as string;
  const turma_id = formData.get('turma_id') as string;
  const titulo = formData.get('titulo') as string;
  const conteudo = formData.get('conteudo') as string;
  const anexos_raw = formData.get('anexos') as string;
  const imagem_url = (formData.get('imagem_url') as string) || null;
  const link_referencia = (formData.get('link_referencia') as string) || null;

  let anexos = [];
  if (anexos_raw) {
    try {
      anexos = JSON.parse(anexos_raw);
    } catch {
      return { error: 'Formato de anexos inválido.' };
    }
  }

  if (!turma_id || !titulo) {
    return { error: 'Turma ID e Título são obrigatórios.' };
  }

  const supabase = createClient();

  if (id) {
    // Update
    const { error } = await supabase
      .from('escola_turmas_posts')
      .update({
        titulo,
        conteudo,
        anexos,
        imagem_url,
        link_referencia,
      })
      .eq('id', id);

    if (error) {
      return { error: `Erro ao atualizar post: ${error.message}` };
    }
  } else {
    // Insert
    const { error } = await supabase.from('escola_turmas_posts').insert({
      turma_id,
      titulo,
      conteudo,
      anexos,
      imagem_url,
      link_referencia,
    });

    if (error) {
      return { error: `Erro ao criar post: ${error.message}` };
    }
  }

  revalidateTag(`turmas-posts-${turma_id}`);
  revalidateTag('turmas-posts');
  revalidatePath(`/turmas/${turma_id}`);
  revalidatePath('/dashboard/turmas');

  return { success: true };
}

export async function deletePost(id: string, turmaId: string) {
  const supabase = createClient();
  const { error } = await supabase.from('escola_turmas_posts').delete().eq('id', id);

  if (error) {
    return { error: `Erro ao excluir post: ${error.message}` };
  }

  revalidateTag(`turmas-posts-${turmaId}`);
  revalidateTag('turmas-posts');
  revalidatePath(`/turmas/${turmaId}`);
  revalidatePath('/dashboard/turmas');

  return { success: true };
}
