'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { z } from 'zod';
import { loginRateLimiter } from '@/lib/rate-limit';
import { validateApiIsolation } from '@/lib/env-guard';
import { sanitizeString } from '@/lib/sanitize';

const loginSchema = z.object({
  email: z.string().trim().email('E-mail em formato inválido.').max(255),
  password: z.string().min(1, 'A senha é obrigatória.').max(128),
}).strict();

export async function login(prevState: unknown, formData: FormData) {
  // 1. API Key Isolation Check
  validateApiIsolation();

  // 2. Client IP Extraction for Rate Limiting
  const headerList = headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  const realIp = headerList.get('x-real-ip');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  // 3. Severe Rate Limiting Check (5 attempts / minute per IP)
  const rateLimit = loginRateLimiter.check(clientIp);
  if (!rateLimit.success) {
    return {
      error: `Muitas tentativas de login bloqueadas por segurança. Por favor, aguarde ${rateLimit.resetSeconds} segundos antes de tentar novamente.`,
    };
  }

  // 4. Input Sanitization & Strict Zod Validation
  const rawEmail = sanitizeString(formData.get('email') as string);
  const rawPassword = formData.get('password') as string;

  const validation = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || 'Dados de login inválidos.' };
  }

  const { email, password } = validation.data;
  const supabase = createClient();

  // 5. Authenticate via Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Anti-Account Enumeration & Defensive Logging
    console.error('[AUTH FAILURE] Falha na autenticação do IP', clientIp, error.message);
    return { error: 'E-mail ou senha incorretos. Por favor, verifique suas credenciais.' };
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = createClient();
  // Revoke all sessions globally on server-side
  await supabase.auth.signOut({ scope: 'global' });
  redirect('/login');
}
