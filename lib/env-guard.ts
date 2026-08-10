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
    
    // Check for service role or secret key signatures in variable name or value
    const containsSecretName = /service_role|secret|private|sk_live|sk_test/i.test(key);
    const containsSecretValue = /service_role|secret|sk_live_|sk_test_/i.test(value);

    if (containsSecretName || containsSecretValue) {
      throw new Error(
        `[SECURITY VIOLATION] Critical leakage detected in public environment variable "${key}". Private keys (service_role, sk_, etc.) must never be prefixed with NEXT_PUBLIC_.`
      );
    }
  }
}
