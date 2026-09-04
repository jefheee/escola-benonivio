'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { getServerAiApiKey, validateApiIsolation } from '@/lib/env-guard';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export interface RefeicaoRegistro {
  id?: string;
  data: string;
  turno: 'diurno' | 'noturno';
  descricao: string;
  created_at?: string;
}

export interface ParseCardapioResult {
  success: boolean;
  count?: number;
  data?: RefeicaoRegistro[];
  error?: string | null;
}

const RefeicaoItemSchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido. Use YYYY-MM-DD.'),
  turno: z.enum(['diurno', 'noturno']),
  descricao: z.string().min(3, 'Descrição da refeição muito curta.'),
});

const RefeicoesListSchema = z.array(RefeicaoItemSchema).min(1, 'Nenhuma refeição válida encontrada no documento.');

/**
 * Server Action corporativa para ingestão automatizada de cardápio via PDF oficial da SED/SC.
 * Utiliza o SDK oficial @google/generative-ai com o modelo gemini-1.5-flash processando
 * o PDF nativamente via inlineData (base64) e gravando no Supabase via upsert atômico.
 */
export async function parseCardapioPDF(formData: FormData): Promise<ParseCardapioResult> {
  validateApiIsolation();
  const supabase = createClient();

  // 1. Verificação autoritativa de sessão administrativa
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      success: false,
      error: 'Sessão expirada ou não autorizada. Faça login novamente no painel.',
    };
  }

  // 2. Extração e validação do arquivo PDF
  const file = formData.get('file') as File | null;
  if (!file) {
    return {
      success: false,
      error: 'Nenhum arquivo PDF foi selecionado para envio.',
    };
  }

  // Validar MIME type
  const mimeType = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();
  if (mimeType !== 'application/pdf' && !fileName.endsWith('.pdf')) {
    return {
      success: false,
      error: 'Formato inválido. O arquivo enviado deve ser estritamente um documento PDF (.pdf).',
    };
  }

  // Validar tamanho máximo (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'O arquivo PDF excede o limite máximo permitido de 10 MB.',
    };
  }

  if (file.size === 0) {
    return {
      success: false,
      error: 'O arquivo enviado está vazio (0 bytes).',
    };
  }

  // 3. Obtenção da chave de API da IA do Google Gemini
  const apiKey = getServerAiApiKey() || process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: 'Chave de API do Google Gemini não encontrada no servidor. Configure a variável GEMINI_API_KEY ou AI_API_KEY no arquivo .env.local.',
    };
  }

  try {
    // 4. Conversão do arquivo PDF para Buffer e Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // 5. Inicialização do Google Generative AI com modelos estáveis e fallback
    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-2.5-flash',
      'gemini-3.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-1.5-flash',
    ].filter(Boolean) as string[];

    const prompt = `Você é um extrator de dados. Analise este PDF de cardápio escolar. Extraia os pratos principais, guarnições e sobremesas de cada dia útil do mês. Retorne ESTRITAMENTE um array JSON com a tipagem: [{ data: 'YYYY-MM-DD', turno: 'diurno' | 'noturno', descricao: 'Prato Principal: X. Guarnições: Y. Sobremesa: Z' }]. Não inclua markdown na resposta, apenas o JSON puro.`;

    let responseText = '';
    let lastError: Error | null = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType: 'application/pdf',
            },
          },
          prompt,
        ]);

        responseText = result.response.text();
        if (responseText) {
          break;
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[AI CARDAPIO] Falha ao consultar modelo ${modelName}:`, lastError.message);
      }
    }

    if (!responseText) {
      throw lastError || new Error('O modelo de IA não retornou nenhuma resposta.');
    }

    // 6. Limpeza e parsing defensivo do JSON
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedRaw: unknown;
    try {
      parsedRaw = JSON.parse(cleanJson);
    } catch {
      throw new Error('A IA não retornou um JSON válido. Verifique se o PDF contém o formato padrão de cardápio.');
    }

    // Se o Gemini retornar embrulhado em um objeto { refeicoes: [...] } ou similar
    let rawArray: unknown[] = [];
    if (Array.isArray(parsedRaw)) {
      rawArray = parsedRaw;
    } else if (parsedRaw && typeof parsedRaw === 'object') {
      const values = Object.values(parsedRaw);
      const foundArray = values.find((v) => Array.isArray(v));
      if (foundArray && Array.isArray(foundArray)) {
        rawArray = foundArray;
      }
    }

    // 7. Validação estrita dos dados extraídos via Zod
    const validationResult = RefeicoesListSchema.safeParse(rawArray);
    if (!validationResult.success) {
      console.error('[AI CARDAPIO ERROR] Falha na validação Zod:', validationResult.error.format());
      return {
        success: false,
        error: `Estrutura extraída inválida: ${validationResult.error.issues[0]?.message || 'Formato incompatível.'}`,
      };
    }

    const refeicoesParaGravar = validationResult.data.map((r) => ({
      data: r.data,
      turno: r.turno,
      descricao: r.descricao.trim(),
    }));

    // 8. Bulk Upsert no Supabase via chave única composta (data, turno)
    const { data: upsertData, error: dbError } = await supabase
      .from('refeicoes')
      .upsert(refeicoesParaGravar, {
        onConflict: 'data, turno',
      })
      .select('id, data, turno, descricao');

    if (dbError) {
      console.error('[SUPABASE ERROR] Erro no upsert de refeições:', dbError);
      return {
        success: false,
        error: `Erro ao salvar refeições no banco: ${dbError.message}`,
      };
    }

    // 9. Revalidação das rotas pública e administrativa
    revalidatePath('/cardapio');
    revalidatePath('/dashboard/cardapio');

    return {
      success: true,
      count: upsertData ? upsertData.length : refeicoesParaGravar.length,
      data: (upsertData || []) as RefeicaoRegistro[],
    };
  } catch (err: unknown) {
    console.error('[AI CARDAPIO SERVER ERROR] Exceção no fluxo de IA:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Falha inesperada ao processar o cardápio com inteligência artificial.',
    };
  }
}

/**
 * Busca as refeições cadastradas recentemente para conferência administrativa.
 */
export async function getRefeicoesCadastradas(): Promise<RefeicaoRegistro[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('refeicoes')
    .select('id, data, turno, descricao, created_at')
    .order('data', { ascending: false })
    .limit(30);

  if (error) {
    console.error('[SUPABASE ERROR] Erro ao buscar refeições:', error);
    return [];
  }

  return (data || []) as RefeicaoRegistro[];
}

/**
 * Remove uma refeição cadastrada individualmente.
 */
export async function deleteRefeicaoAction(id: string): Promise<{ success: boolean; error?: string }> {
  validateApiIsolation();
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Não autorizado.' };
  }

  const { error } = await supabase
    .from('refeicoes')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/cardapio');
  revalidatePath('/dashboard/cardapio');
  return { success: true };
}
