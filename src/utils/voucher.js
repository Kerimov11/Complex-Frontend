import { loadJSON, saveJSON, remove } from './storage'
import { isTicketExpired } from './ticket'

const KEY_PREFIX = 'ha_voucher_'
const LAST_KEY = 'ha_voucher_last'

export function saveVoucher(ticket) {
  saveJSON(`${KEY_PREFIX}${ticket.id}`, ticket)
  saveJSON(LAST_KEY, { id: ticket.id, at: Date.now() })
}

export function getVoucher(id) {
  return loadJSON(`${KEY_PREFIX}${id}`, null)
}

/**
 * Sonuncu bileti geri qaytarır.
 * Etibarlılıq müddəti bitmiş biletlər silinir və qaytarılmır -
 * beləliklə müddət bitdikdən sonra bilet ekranda görünmür.
 */
/** Etibarlılıq yoxlaması etmədən son bileti qaytarır (logout/təmizlik üçün). */
export function loadLastVoucherRaw() {
  const last = loadJSON(LAST_KEY, null)
  if (!last || !last.id) return null
  return getVoucher(last.id)
}

export function loadLastVoucher() {
  const last = loadJSON(LAST_KEY, null)
  if (!last || !last.id) return null

  const t = getVoucher(last.id)
  if (!t) {
    remove(LAST_KEY)
    return null
  }

  if (isTicketExpired(t)) {
    clearVoucher(last.id)
    return null
  }

  return t
}

/**
 * Avtomatik bərpa girişini dayandırır (yeni bilet alındıqda işlədilir).
 * Öz bilet saxlanıcıda qalır, sadəcə səhifə yüklənəndə avtomatik
 * geri qaytarılmır.
 */
export function clearLastVoucher() {
  remove(LAST_KEY)
}

/** Bileti (həm öz qeydini, həm avtomatik bərpa girişini) silir. */
export function clearVoucher(id) {
  if (id) remove(`${KEY_PREFIX}${id}`)
  remove(LAST_KEY)
}
