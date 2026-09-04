/**
 * Environmental Security Guard
 * Ensures API isolation by asserting that no secret/service_role keys
 * are accidentally exposed via NEXT_PUBLIC_ prefixes.
 */
export function validateApiIsolation(): void {
  const publicEnvKeys = Object.keys(process.env).filter((key) =>
    key.startsWith('NEXT_PUBLIC_')
  );

  for (const key of publicEnvKeys) {
    const value = process.env[key] || '';
    
    // Check for service role, secret key, or AI private API key signatures in variable name or value
    const containsSecretName = /service_role|secret|private|sk_live|sk_test|ai_api_key|gemini_api_key|groq_api_key/i.test(key);
    const containsSecretValue = /service_role|secret|sk_live_|sk_test_|gsk_|AIzaSy/i.test(value);

    if (containsSecretName || containsSecretValue) {
      throw new Error(
        `[SECURITY VIOLATION] Critical leakage detected in public environment variable "${key}". Private keys (service_role, AI keys, sk_, etc.) must never be prefixed with NEXT_PUBLIC_.`
      );
    }
  }
}

/**
 * Retorna a chave de API de IA configurada no servidor (Google Gemini API ou Groq).
 * Utilizada exclusivamente por Server Actions para o AI PDF Parser Workflow de cardápios.
 */
export function getServerAiApiKey(): string | null {
  return process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || null;
}
