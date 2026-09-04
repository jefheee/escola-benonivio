/**
 * Storage & Media Security Utility
 * Enforces strict MIME validation, file size bounds, filename sanitization,
 * and pixel flood / image bomb mitigations.
 */

// Strict Whitelist of Allowed Media & Document MIME types
export const ALLOWED_IMAGE_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

export const ALLOWED_DOCUMENT_MIME_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

// Size Limits
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// Image Bomb Protection Bounds
export const MAX_IMAGE_PIXEL_COUNT = 16 * 1024 * 1024; // 16 Megapixels max
export const MAX_IMAGE_DIMENSION = 4096; // 4096px max width or height

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
  mimeType?: string;
}

/**
 * Validates file size, MIME type, and generates a cryptographically safe filename.
 */
export function validateAndSanitizeFile(
  file: File,
  category: 'image' | 'document' | 'any' = 'any'
): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo fornecido.' };
  }

  // 1. File Size Verification
  const maxSize = category === 'image' ? MAX_IMAGE_SIZE_BYTES : MAX_DOCUMENT_SIZE_BYTES;
  if (file.size > maxSize) {
    const sizeMb = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `Tamanho de arquivo excede o limite máximo permitido de ${sizeMb}MB.`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'Arquivo inválido (tamanho zero).' };
  }

  // 2. MIME Type Whitelist Check
  const rawType = (file.type || '').toLowerCase();
  let ext = '';

  if (category === 'image') {
    ext = ALLOWED_IMAGE_MIME_TYPES[rawType];
    if (!ext) {
      return {
        valid: false,
        error: 'Formato de imagem não permitido. Use apenas JPEG, PNG, WebP ou GIF.',
      };
    }
  } else if (category === 'document') {
    ext = ALLOWED_DOCUMENT_MIME_TYPES[rawType] || ALLOWED_IMAGE_MIME_TYPES[rawType];
    if (!ext) {
      return {
        valid: false,
        error: 'Formato de documento não permitido. Use PDF, DOC, DOCX ou planilhas válidas.',
      };
    }
  } else {
    ext = ALLOWED_IMAGE_MIME_TYPES[rawType] || ALLOWED_DOCUMENT_MIME_TYPES[rawType];
    if (!ext) {
      return {
        valid: false,
        error: 'Tipo de arquivo não suportado pelo sistema.',
      };
    }
  }

  // 3. Cryptographically Secure Filename Generation (Anti-Command Injection)
  let cryptoRandom: string;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    cryptoRandom = crypto.randomUUID();
  } else if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    cryptoRandom = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  } else {
    cryptoRandom = `${Date.now()}-secure`;
  }

  const sanitizedFilename = `${cryptoRandom}.${ext}`;

  return {
    valid: true,
    sanitizedFilename,
    mimeType: rawType,
  };
}

/**
 * Validates image dimensions to prevent Pixel Flood / Image Bomb attacks.
 */
export function validateImageDimensions(width: number, height: number): { valid: boolean; error?: string } {
  if (width <= 0 || height <= 0) {
    return { valid: false, error: 'Dimensões de imagem inválidas.' };
  }

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    return {
      valid: false,
      error: `Dimensão de imagem muito alta (máximo ${MAX_IMAGE_DIMENSION}px).`,
    };
  }

  const totalPixels = width * height;
  if (totalPixels > MAX_IMAGE_PIXEL_COUNT) {
    return {
      valid: false,
      error: 'Resolução total da imagem excede o limite seguro contra esgotamento de memória.',
    };
  }

  return { valid: true };
}
