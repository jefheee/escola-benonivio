'use server';

import { createClient } from '@/lib/supabase/server';
import { validateApiIsolation } from '@/lib/env-guard';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_DOCUMENT_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_DOCUMENT_SIZE_BYTES,
} from '@/lib/storage-security';
import crypto from 'crypto';

export interface UploadActionResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Server Action corporativa para upload autenticado de mídias.
 * Executada no servidor Next.js com sessão protegida, eliminando falhas de RLS do cliente.
 */
export async function uploadMediaAction(formData: FormData): Promise<UploadActionResult> {
  validateApiIsolation();
  const supabase = createClient();

  // 1. Verificação autoritativa do usuário autenticado no servidor
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Sessão expirada ou não autenticada. Faça login novamente.' };
  }

  const file = formData.get('file') as File | null;
  const bucketName = (formData.get('bucketName') as string) || 'escola_midias';
  const folderName = (formData.get('folderName') as string) || 'banners';
  const category = (formData.get('category') as 'image' | 'document') || 'image';

  if (!file) {
    return { success: false, error: 'Nenhum arquivo enviado.' };
  }

  // 2. Verificação estrita de tamanho
  const maxSize = category === 'image' ? MAX_IMAGE_SIZE_BYTES : MAX_DOCUMENT_SIZE_BYTES;
  if (file.size > maxSize) {
    const mb = Math.round(maxSize / (1024 * 1024));
    return { success: false, error: `Tamanho excede o limite máximo permitido de ${mb}MB.` };
  }

  if (file.size === 0) {
    return { success: false, error: 'Arquivo inválido (tamanho zero).' };
  }

  // 3. Verificação estrita de MIME type
  const rawType = (file.type || '').toLowerCase();
  const allowedMap = category === 'image' ? ALLOWED_IMAGE_MIME_TYPES : ALLOWED_DOCUMENT_MIME_TYPES;
  const ext = allowedMap[rawType];
  if (!ext) {
    return {
      success: false,
      error: category === 'image'
        ? 'Formato de imagem não permitido. Use JPEG, PNG, WebP, GIF ou AVIF.'
        : 'Formato de documento não permitido. Use PDF, DOC, DOCX ou planilhas válidas.',
    };
  }

  // 4. Nome seguro criptográfico e higienização de pasta (Anti-Path Traversal)
  const safeFilename = `${crypto.randomUUID()}.${ext}`;
  const safeFolder = folderName.replace(/[^a-zA-Z0-9_-]/g, '');
  const filePath = safeFolder ? `${safeFolder}/${safeFilename}` : safeFilename;

  // 5. Upload via cliente de servidor autenticado
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: rawType,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[STORAGE SERVER ERROR] Falha no upload:', uploadError);
      return { success: false, error: `Erro no armazenamento: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (err: unknown) {
    console.error('[STORAGE SERVER ERROR] Exceção no upload:', err);
    return { success: false, error: 'Erro inesperado ao processar upload no servidor.' };
  }
}
