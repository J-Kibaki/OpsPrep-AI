/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize user input to prevent prompt injection attacks
 * Removes or escapes characters that could be used to manipulate AI prompts
 */
export const sanitizePromptInput = (input: string): string => {
  if (!input) return '';
  
  // Trim to reasonable length to prevent abuse
  const maxLength = 10000;
  let sanitized = input.substring(0, maxLength);
  
  // Remove control characters and null bytes
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Escape special prompt engineering patterns
  // Remove multiple newlines that could be used to break out of context
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
  
  // Remove common prompt injection patterns
  const dangerousPatterns = [
    /ignore\s+previous\s+instructions/gi,
    /disregard\s+all\s+prior/gi,
    /forget\s+everything/gi,
    /new\s+instructions:/gi,
    /system\s*:/gi,
    /\[SYSTEM\]/gi,
    /\{SYSTEM\}/gi,
  ];
  
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized.trim();
};

/**
 * Sanitize text for display to prevent XSS
 * Note: React already escapes text content, but this is for extra safety
 */
export const sanitizeForDisplay = (text: string): string => {
  if (!text) return '';
  
  // Remove script tags and event handlers
  let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  return sanitized;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize file upload content
 * Limits file size and validates content
 */
export const sanitizeFileContent = (content: string, maxLength: number = 50000): string => {
  if (!content) return '';
  
  // Limit length
  let sanitized = content.substring(0, maxLength);
  
  // Remove null bytes and control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized;
};

/**
 * Rate limiting check (simple client-side implementation)
 * For production, implement server-side rate limiting
 */
const requestTimestamps: Map<string, number[]> = new Map();

export const checkRateLimit = (
  userId: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const timestamps = requestTimestamps.get(userId) || [];
  
  // Remove timestamps outside the window
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
  
  if (validTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  // Add current timestamp
  validTimestamps.push(now);
  requestTimestamps.set(userId, validTimestamps);
  
  return true;
};

/**
 * Validate numeric input
 */
export const sanitizeNumber = (value: any, min?: number, max?: number): number | null => {
  const num = Number(value);
  
  if (isNaN(num)) return null;
  if (min !== undefined && num < min) return min;
  if (max !== undefined && num > max) return max;
  
  return num;
};

/**
 * Sanitize and validate skill/tag inputs
 */
export const sanitizeSkillTag = (tag: string): string => {
  if (!tag) return '';
  
  // Remove special characters, keep only alphanumeric, spaces, hyphens, dots
  let sanitized = tag.replace(/[^a-zA-Z0-9\s\-\.]/g, '');
  
  // Trim and limit length
  sanitized = sanitized.substring(0, 50).trim();
  
  return sanitized;
};
