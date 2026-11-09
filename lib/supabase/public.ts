import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { validateApiIsolation } from '@/lib/env-guard';

let clientInstance: SupabaseClient | null = null;

/**
 * Returns a validated singleton Supabase client for public read queries.
 * Validates environment variables and API isolation with fail-fast assertions.
 */
export function getPublicSupabaseClient(): SupabaseClient {
  if (clientInstance) return clientInstance;

  validateApiIsolation();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      '[CONFIG ERROR] Variáveis de ambiente obrigatórias ausentes: NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  clientInstance = createSupabaseClient(url, anonKey);
  return clientInstance;
}

/**
 * Proxy singleton for seamless drop-in usage across public data queries.
 */
export const supabasePublic = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getPublicSupabaseClient();
    const value = (client as unknown as Record<string, unknown>)[prop as string];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
