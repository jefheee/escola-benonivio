/**
 * Data Sanitization Utilities
 * Prevents Cross-Site Scripting (XSS) and injection vectors by cleansing inputs.
 */

/**
 * Sanitizes a single string by stripping dangerous HTML tags, javascript: protocols, and unsafe control chars.
 */
export function sanitizeString(input: string | null | undefined): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    // Remove control characters (except newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove potential inline script tags and script protocols
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Recursively sanitizes strings within an array or object.
 */
export function sanitizeInput<T>(val: T): T {
  if (typeof val === 'string') {
    return sanitizeString(val) as unknown as T;
  }

  if (Array.isArray(val)) {
    return val.map((item) => sanitizeInput(item)) as unknown as T;
  }

  if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
    const cleansed: Record<string, unknown> = {};
    for (const key of Object.keys(val)) {
      cleansed[key] = sanitizeInput((val as Record<string, unknown>)[key]);
    }
    return cleansed as T;
  }

  return val;
}

/**
 * Standard PostgreSQL UUID regex pattern (32 hexadecimal chars with hyphens).
 * More forgiving than strict RFC-4122 while remaining completely safe against injections.
 */
export const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
