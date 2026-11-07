/**
 * sanitize.ts
 *
 * Input sanitization, URL validation, and payload compaction utilities.
 * Strips dangerous HTML/script tags, control characters, and undefined fields
 * before persisting payloads to Supabase or local storage.
 */

// eslint-disable-next-line no-control-regex
const CONTROL_CHAR_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const HTML_TAG_REGEX = /<\/?[a-z][^>]*>/gi

/**
 * Sanitizes a user-supplied text string by stripping HTML tags,
 * control characters, and enforcing a maximum character length.
 */
export function sanitizeText(value: string | undefined | null, maxLength = 500): string {
  if (!value) return ''
  return value
    .replace(CONTROL_CHAR_REGEX, '')
    .replace(HTML_TAG_REGEX, '')
    .trim()
    .slice(0, maxLength)
}

/**
 * Validates that a URL string uses a safe HTTPS protocol.
 */
export function sanitizeHttpsUrl(url: string | undefined | null, maxLength = 500): string {
  if (!url) return ''
  const trimmed = url.trim().slice(0, maxLength)
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:') {
      return ''
    }
    return parsed.toString()
  } catch {
    return ''
  }
}

/**
 * Compacts an API payload object by removing undefined properties and
 * recursively sanitizing string values to minimize request payload size.
 */
export function compactAndSanitizePayload<T extends Record<string, unknown>>(
  payload: T,
): Partial<T> {
  const result: Record<string, unknown> = {}

  for (const [key, val] of Object.entries(payload)) {
    if (val === undefined) continue

    if (typeof val === 'string') {
      result[key] = sanitizeText(val, 2000)
    } else if (Array.isArray(val)) {
      result[key] = val.map((item) => {
        if (typeof item === 'string') return sanitizeText(item, 1000)
        if (item && typeof item === 'object') {
          return compactAndSanitizePayload(item as Record<string, unknown>)
        }
        return item
      })
    } else if (val && typeof val === 'object') {
      result[key] = compactAndSanitizePayload(val as Record<string, unknown>)
    } else {
      result[key] = val
    }
  }

  return result as Partial<T>
}
