export const ENDPOINTS = {
  live: '/api/live',
  login: '/api/auth/login',
  register: '/api/auth/register',
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: '/api/auth/reset-password',
  sessionsByDate: (date) =>
    `/api/sessions/public/date?sessionDate=${encodeURIComponent(date)}`,
  sessionAvailability: (sessionId, { startTime, durationMinutes } = {}) => {
    const params = new URLSearchParams()
    if (startTime) params.set('startTime', startTime)
    if (durationMinutes) params.set('durationMinutes', String(durationMinutes))
    const query = params.toString()
    return `/api/sessions/public/${encodeURIComponent(
      sessionId
    )}/availability${query ? `?${query}` : ''}`
  },
  skates: '/api/skates',
  skatesBySession: (sessionId) =>
    `/api/skates/session/${encodeURIComponent(sessionId)}`,
  discountsActive: '/api/discounts/active',
  discountsApply: '/api/discounts/apply',
  createReservation: ({
    userId,
    sessionId,
    skateId,
    startTime,
    durationMinutes,
    voucherCode,
    participantName,
    participantAge,
  }) => {
    const params = new URLSearchParams({
      userId: String(userId),
      sessionId: String(sessionId),
      skateId: String(skateId),
    })
    if (startTime) params.set('startTime', startTime)
    if (durationMinutes) params.set('durationMinutes', String(durationMinutes))
    if (voucherCode) params.set('voucherCode', voucherCode)
    if (participantName) params.set('participantName', participantName)
    if (participantAge !== undefined && participantAge !== null && participantAge !== '') {
      params.set('participantAge', String(participantAge))
    }
    return `/api/reservations/create?${params.toString()}`
  },
  reservation: (id) => `/api/reservations/${id}`,
  extendReservation: (id) => `/api/reservations/${id}/extend`,
  cancelReservation: (id) => `/api/reservations/${id}/cancel`,
  myTickets: '/api/tickets/my-tickets',
  customerProfile: '/api/customer/profile',
  customerPassword: '/api/customer/profile/password',
  rulesAcceptance: '/api/customer/rules-acceptance',
  customerVerification: '/api/customer/verification',
  customerAgeVerification: '/api/customer/verification/age',
  customerIdentityVerification: '/api/customer/verification/identity',
  activateTicket: (ticketCode) =>
    `/api/customer/reservations/${encodeURIComponent(ticketCode)}/activate`,
  returnTicketSkates: (ticketCode) =>
    `/api/tickets/${encodeURIComponent(ticketCode)}/return-skates`,
  createPayment: '/api/payments/checkout',
  payPayment: (transactionId) =>
    `/api/payments/${encodeURIComponent(transactionId)}/pay`,
  failPayment: (transactionId) =>
    `/api/payments/${encodeURIComponent(transactionId)}/fail`,
  payment: (transactionId) =>
    `/api/payments/${encodeURIComponent(transactionId)}`,
  payments: (status) =>
    status
      ? `/api/payments?status=${encodeURIComponent(status)}`
      : '/api/payments',
  processPayment: (transactionId, status) =>
    `/api/payments/process/${encodeURIComponent(
      transactionId
    )}?status=${encodeURIComponent(status)}`,
}
