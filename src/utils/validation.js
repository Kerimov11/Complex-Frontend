const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

/**
 * E-poçt ünvanının düzgün formatda olub-olmadığını yoxlayır (məs: ad@gmail.com).
 */
export function isValidEmail(value) {
  return EMAIL_RE.test(String(value || '').trim())
}
