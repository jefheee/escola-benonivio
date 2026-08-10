'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { loginRateLimiter } from '@/lib/rate-limit';
import { validateApiIsolation } from '@/lib/env-guard';

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

  // 4. Input Sanitization & Validation
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.' };
  }

  const supabase = createClient();

  // 5. Authenticate via Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'E-mail ou senha incorretos. Por favor, tente novamente.' };
    }
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
