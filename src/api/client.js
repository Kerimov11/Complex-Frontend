import { ENDPOINTS } from './endpoints'

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
).replace(/\/+$/, '')

const AUTH_KEY = 'ha_auth'

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function getToken() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return ''
    const parsed = JSON.parse(raw)
    return typeof parsed?.token === 'string' ? parsed.token : ''
  } catch {
    return ''
  }
}

function sanitize(str) {
  if (!str || typeof str !== 'string') return ''
  const trimmed = str.trim()
  if (/bad\s+credentials/i.test(trimmed)) {
    return 'İstifadəçi adı və ya şifrə yanlışdır'
  }
  return trimmed
}

function extractMessage(data, status) {
  if (typeof data === 'string' && data.trim()) return sanitize(data)

  if (data && typeof data === 'object') {
    if (typeof data.message === 'string' && data.message.trim()) {
      return sanitize(data.message)
    }
    if (typeof data.error === 'string' && data.error.trim()) {
      return sanitize(data.error)
    }
    if (data.errors && typeof data.errors === 'object') {
      const first = Object.values(data.errors)[0]
      if (first) return sanitize(String(first))
    }
  }

  if (status === 401 || status === 403) {
    return 'İcazə yoxdur. Zəhmət olmasa yenidən daxil olun.'
  }
  if (status === 404) return 'Məlumat tapılmadı.'
  if (status >= 500) {
    return 'Sistem xətası baş verdi. Bir az sonra yenidən cəhd edin.'
  }
  return `Sorğu uğursuz oldu (${status}).`
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    auth = true,
    signal,
  } = options

  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = auth ? getToken() : ''
  if (token) headers.Authorization = `Bearer ${token}`

  // Şəbəkə cavab verməzsə sorğunu 60 saniyədən sonra dayandırırıq (Render free-tier oyanma vaxtı üçün).
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000)
  const onAbort = () => controller.abort()
  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener('abort', onAbort, { once: true })
  }

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      signal: controller.signal,
    })
  } catch (error) {
    if (error?.name === 'AbortError') {
      if (signal?.aborted) throw error
      throw new ApiError(
        'Sistem cavab vermədi. Bir az sonra yenidən cəhd edin.',
        0,
        null
      )
    }
    throw new ApiError(
      'Sistemlə əlaqə yoxdur. Bir az sonra yenidən cəhd edin.',
      0,
      null
    )
  } finally {
    clearTimeout(timeoutId)
    if (signal) signal.removeEventListener('abort', onAbort)
  }

  const contentType = res.headers.get('content-type') || ''
  let data = null
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null)
  } else {
    const text = await res.text().catch(() => '')
    data = text || null
  }

  if (!res.ok) {
    throw new ApiError(extractMessage(data, res.status), res.status, data)
  }

  return data
}

export const api = {
  login: (username, password) =>
    request(ENDPOINTS.login, {
      method: 'POST',
      body: { username, password },
      auth: false,
    }),

  register: (payload) =>
    request(ENDPOINTS.register, {
      method: 'POST',
      body: payload,
      auth: false,
    }),

  forgotPassword: (payload) =>
    request(ENDPOINTS.forgotPassword, {
      method: 'POST',
      body: payload,
      auth: false,
    }),

  resetPassword: (payload) =>
    request(ENDPOINTS.resetPassword, {
      method: 'POST',
      body: payload,
      auth: false,
    }),

  getLive: () => request(ENDPOINTS.live, { auth: false }),

  getSessionsByDate: (date) =>
    request(ENDPOINTS.sessionsByDate(date), { auth: false }),

  getSessionAvailability: (sessionId, params) =>
    request(ENDPOINTS.sessionAvailability(sessionId, params), { auth: false }),

  getSkates: () => request(ENDPOINTS.skates, { auth: false }),

  getSkatesBySession: (sessionId) =>
    request(ENDPOINTS.skatesBySession(sessionId), { auth: false }),

  getActiveDiscounts: () =>
    request(ENDPOINTS.discountsActive, { auth: false }),

  calculateDiscount: (payload) =>
    request(ENDPOINTS.discountsApply, {
      method: 'POST',
      body: payload,
      auth: false,
    }),

  createReservation: (payload) =>
    request(ENDPOINTS.createReservation(payload), { method: 'POST' }),

  getReservation: (id) => request(ENDPOINTS.reservation(id)),

  extendReservation: (id) =>
    request(ENDPOINTS.extendReservation(id), { method: 'POST' }),

  cancelReservation: (id) =>
    request(ENDPOINTS.cancelReservation(id), { method: 'POST' }),

  getMyTickets: () => request(ENDPOINTS.myTickets),

  getCustomerProfile: () => request(ENDPOINTS.customerProfile),

  updateCustomerProfile: (payload) =>
    request(ENDPOINTS.customerProfile, {
      method: 'PUT',
      body: payload,
    }),

  changeCustomerPassword: (payload) =>
    request(ENDPOINTS.customerPassword, {
      method: 'PUT',
      body: payload,
    }),

  getRulesAcceptance: () => request(ENDPOINTS.rulesAcceptance),

  saveRulesAcceptance: (acceptedObligationIds) =>
    request(ENDPOINTS.rulesAcceptance, {
      method: 'PUT',
      body: { acceptedObligationIds },
    }),

  getCustomerVerification: () =>
    request(ENDPOINTS.customerVerification),

  saveAgeVerification: (dateOfBirth) =>
    request(ENDPOINTS.customerAgeVerification, {
      method: 'PUT',
      body: { dateOfBirth },
    }),

  saveIdentityVerification: ({
    identityDocumentNumber,
    finCode,
    identityPhotoData,
    confirmed = true,
  }) =>
    request(ENDPOINTS.customerIdentityVerification, {
      method: 'PUT',
      body: { identityDocumentNumber, finCode, identityPhotoData, confirmed },
    }),

  saveTicketPhotos: (payload) =>
    request('/api/customer/verification/ticket-photos', {
      method: 'POST',
      body: payload,
    }),

  checkPush30Phone: (phone) =>
    request(
      `/api/customer/verification/push30-check?phone=${encodeURIComponent(phone)}`
    ),

  activateTicket: (ticketCode) =>
    request(ENDPOINTS.activateTicket(ticketCode), { method: 'POST' }),

  createPayment: (payload) =>
    request(ENDPOINTS.createPayment, {
      method: 'POST',
      body: payload,
    }),

  payPayment: (transactionId) =>
    request(ENDPOINTS.payPayment(transactionId), { method: 'POST' }),

  failPayment: (transactionId) =>
    request(ENDPOINTS.failPayment(transactionId), { method: 'POST' }),

  getPayment: (transactionId) => request(ENDPOINTS.payment(transactionId)),

  getPayments: (status) => request(ENDPOINTS.payments(status)),

  processPayment: (transactionId, status) =>
    request(ENDPOINTS.processPayment(transactionId, status), {
      method: 'POST',
    }),
}

/**
 * Backend `/api/live` cavabını UI modelinə çevirir.
 * Backend əlçatmazsa saxta rəqəm göstərmirik — dürüst offline vəziyyəti qaytarırıq.
 */
export async function getLiveStatus() {
  try {
    const data = await api.getLive()
    return {
      count: Number(data?.onIce) || 0,
      open: Boolean(data?.iceActive),
      updatedAt: data?.updatedAt || null,
      source: data?.source || null,
      offline: false,
    }
  } catch {
    return { count: 0, open: false, offline: true }
  }
}

export { request, BASE_URL }
