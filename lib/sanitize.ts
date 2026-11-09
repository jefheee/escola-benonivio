/**
 * Data Sanitization Utilities
 * Prevents Cross-Site Scripting (XSS) and injection vectors by cleansing inputs.
 */

/**
 * Validates that a string is a safe HTTP or HTTPS URL, or an internal safe relative path.
 * Rejects javascript:, data:, vbscript:, and arbitrary schemas.
 */
export function isValidSafeUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;

  // Safe internal relative path (must not start with // which is protocol-relative)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Ensures an href attribute is completely safe. Returns '#' if unsafe or invalid.
 */
export function sanitizeHref(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (isValidSafeUrl(trimmed)) {
    return trimmed;
  }
  return '#';
}

/**
 * Sanitizes a single string by recursively stripping dangerous HTML tags, javascript: protocols, and unsafe control chars.
 */
export function sanitizeString(input: string | null | undefined): string {
  if (typeof input !== 'string') return '';

  let sanitized = input
    .trim()
    // Remove control characters (except newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Recursive loop to eliminate nested/bypass payloads like javajavascript:script:
  let prev = '';
  while (prev !== sanitized) {
    prev = sanitized;
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/data\s*:\s*text\/html/gi, '')
      .replace(/vbscript\s*:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  return sanitized;
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
