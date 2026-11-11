const TICKET_PREFIX = 'SAV'

export function uid(len = 4) {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let out = ''
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  for (let i = 0; i < len; i++) out += chars[bytes[i] % chars.length]
  return out
}

export function createTicketId() {
  return `${TICKET_PREFIX}-${uid(3)}-${uid(4)}`
}

export function createReference() {
  return `BZ-${Date.now().toString(36).toUpperCase()}-${uid(3)}`
}

export function hashString(str) {
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const MODULE_SIZE = 21

export function makeQrMatrix(seed) {
  const h = hashString(seed)
  const rows = []
  for (let y = 0; y < MODULE_SIZE; y++) {
    const row = []
    for (let x = 0; x < MODULE_SIZE; x++) {
      const inFinder =
        (x < 7 && y < 7) ||
        (x >= MODULE_SIZE - 7 && y < 7) ||
        (x < 7 && y >= MODULE_SIZE - 7)
      row.push(inFinder ? (x === 0 || x === 6 || y === 0 || y === 6 ? 1 : x < 5 && y < 5 && x > 0 && y > 0 && x + y !== 10 ? 0 : x === 3 && y === 3 ? 1 : 0) : ((h >> ((x * 7 + y) % 31)) & 1) === 1)
    }
    rows.push(row)
  }
  return rows
}

export function formatPrice(value) {
  if (value === 0) return 'Pulsuz'
  return `${Math.round(value * 100) / 100} AZN`
}

/**
 * Biletin etibarlılıq bitmə vaxtı (ms).
 * QR kod skan edilib təsdiqlənmədiyi müddətcə bilet heç vaxt vaxtı bitmir (limitsizdir).
 * Yalnız turniketdə skan edildikdən sonra (`checkedInAt`) bilet müddəti (30 və ya 60 dəq) başlayır.
 */
export function ticketValidUntil(ticket) {
  if (!ticket) return null
  if (ticket.checkedInAt) {
    const checkedInTs = new Date(ticket.checkedInAt).getTime()
    const durationMs = (ticket.durationMinutes || ticket.session?.durationMinutes || 60) * 60 * 1000
    return checkedInTs + durationMs
  }
  return null
}

/** Bilet etibarlılıq müddətini keçib? */
export function isTicketExpired(ticket, now = Date.now()) {
  const v = ticketValidUntil(ticket)
  return v !== null && now >= v
}