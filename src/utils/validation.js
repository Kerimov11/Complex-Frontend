const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

/**
 * E-poçt ünvanının düzgün formatda olub-olmadığını yoxlayır (məs: ad@gmail.com).
 */
export function isValidEmail(value) {
  return EMAIL_RE.test(String(value || '').trim())
}

/**
 * Mobil nömrə formatını yoxlayır (Azərbaycan operator prefiksləri və ya beynəlxalq + format).
 * Düzgün olduqda boş string (''), səhv olduqda xəta mesajı qaytarır.
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return 'Mobil nömrə daxil edilməlidir.'
  }
  const cleaned = phone.trim()
  const digits = cleaned.replace(/\D/g, '')

  if (digits.length === 12 && digits.startsWith('994')) {
    if (!/^994(10|50|51|55|60|70|71|77|99)\d{7}$/.test(digits)) {
      return 'Mobil nömrə prefiksi yanlışdır (məs: +994 50 123 45 67).'
    }
    return ''
  }
  if (digits.length === 10 && digits.startsWith('0')) {
    if (!/^0(10|50|51|55|60|70|71|77|99)\d{7}$/.test(digits)) {
      return 'Mobil nömrə prefiksi yanlışdır (məs: 050 123 45 67).'
    }
    return ''
  }
  if (digits.length === 9) {
    if (!/^(10|50|51|55|60|70|71|77|99)\d{7}$/.test(digits)) {
      return 'Mobil nömrə prefiksi yanlışdır (məs: 50 123 45 67).'
    }
    return ''
  }
  if (
    cleaned.startsWith('+') &&
    !digits.startsWith('994') &&
    digits.length >= 10 &&
    digits.length <= 15
  ) {
    return ''
  }
  return 'Mobil nömrə düzgün formatda deyil (məs: +994 50 123 45 67).'
}
