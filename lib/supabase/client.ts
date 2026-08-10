import { createBrowserClient } from '@supabase/ssr';
import { validateApiIsolation } from '@/lib/env-guard';

export function createClient() {
  validateApiIsolation();
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
