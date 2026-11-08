import { request } from '../../api/client'

function query(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value))
    }
  })
  const value = search.toString()
  return value ? `?${value}` : ''
}

export const adminApi = {
  getDashboard: () => request('/api/admin/dashboard'),

  getUsers: (search) => request(`/api/admin/users${query({ q: search })}`),
  createStaff: (payload) =>
    request('/api/admin/users', { method: 'POST', body: payload }),
  updateUserRoles: (id, roles) =>
    request(`/api/admin/users/${id}/roles`, {
      method: 'PUT',
      body: { roles },
    }),
  addUserRole: (id, role) =>
    request(`/api/admin/users/${id}/roles/${encodeURIComponent(role)}`, {
      method: 'POST',
    }),
  removeUserRole: (id, role) =>
    request(`/api/admin/users/${id}/roles/${encodeURIComponent(role)}`, {
      method: 'DELETE',
    }),

  getStaff: (search) => request(`/api/admin/staff${query({ q: search })}`),
  createStaffMember: (payload) =>
    request('/api/admin/staff/create', { method: 'POST', body: payload }),
  updateStaffRole: (id, role) =>
    request(`/api/admin/staff/${id}/role`, {
      method: 'PUT',
      body: { role },
    }),

  getSessions: () => request('/api/admin/sessions'),
  getSessionsByDate: (date) =>
    request(`/api/admin/sessions/date/${encodeURIComponent(date)}`),
  createSession: (payload) =>
    request('/api/admin/sessions', { method: 'POST', body: payload }),
  updateSession: (id, payload) =>
    request(`/api/admin/sessions/${id}`, { method: 'PUT', body: payload }),
  blockSession: (id, reason) =>
    request(`/api/admin/sessions/${id}/block${query({ reason })}`, {
      method: 'POST',
    }),
  unblockSession: (id) =>
    request(`/api/admin/sessions/${id}/unblock`, { method: 'POST' }),
  deleteSession: (id) =>
    request(`/api/admin/sessions/${id}`, { method: 'DELETE' }),

  getSkates: () => request('/api/admin/skates'),
  createSkate: (payload) =>
    request('/api/admin/skates', { method: 'POST', body: payload }),
  restockSkate: (id, quantity) =>
    request(`/api/admin/skates/${id}/restock${query({ quantity })}`, {
      method: 'POST',
    }),
  writeOffSkate: (id, quantity) =>
    request(`/api/admin/skates/${id}/write-off${query({ quantity })}`, {
      method: 'POST',
    }),
  deleteSkate: (id) =>
    request(`/api/admin/skates/${id}`, { method: 'DELETE' }),

  sellPos: (payload) =>
    request('/api/admin/pos/sales', { method: 'POST', body: payload }),
  getPosReport: (date) =>
    request(`/api/admin/pos/report${query({ date })}`),
  getPosSales: (date) => request(`/api/admin/pos/sales${query({ date })}`),

  verifyCode: (code) =>
    request('/api/verification/scan', {
      method: 'POST',
      body: { code },
    }),
  lookupCode: (code) =>
    request(`/api/verification/lookup${query({ code })}`),

  getPayments: (status) => request(`/api/payments${query({ status })}`),
  processPayment: (transactionId, status) =>
    request(
      `/api/payments/process/${encodeURIComponent(transactionId)}${query({
        status,
      })}`,
      { method: 'POST' }
    ),
}

export default adminApi
