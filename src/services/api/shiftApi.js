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

export const shiftApi = {
  // Volunteer workspace
  getReservations: () => request('/api/volunteer/reservations'),
  getActiveReservations: () => request('/api/volunteer/reservations/active'),
  reserveReservation: (id) =>
    request(`/api/volunteer/reservations/${id}/reserve`, { method: 'POST' }),
  fulfillReservation: (id) =>
    request(`/api/volunteer/reservations/${id}/fulfill`, { method: 'POST' }),
  getInventory: () => request('/api/volunteer/skates/inventory'),
  getAvailableShifts: (date) =>
    request(`/api/volunteer/shifts/available${query({ date })}`),
  getMyShifts: () => request('/api/volunteer/shifts/my'),
  selectShift: (shiftSlotId) =>
    request('/api/volunteer/shifts/select', {
      method: 'POST',
      body: { shiftSlotId },
    }),

  // Coordinator / admin planner
  getShiftSlots: (date) =>
    request(`/api/coordinator/shift-slots${query({ date })}`),
  createShiftSlot: (payload) =>
    request('/api/coordinator/shift-slots', { method: 'POST', body: payload }),
  updateShiftSlot: (id, payload) =>
    request(`/api/coordinator/shift-slots/${id}`, {
      method: 'PUT',
      body: payload,
    }),
  deleteShiftSlot: (id) =>
    request(`/api/coordinator/shift-slots/${id}`, { method: 'DELETE' }),
  assignStation: (volunteerShiftId, station) =>
    request('/api/coordinator/shifts/assign-station', {
      method: 'POST',
      body: { volunteerShiftId, station },
    }),
  updateShift: (id, payload) =>
    request(`/api/coordinator/shifts/${id}`, { method: 'PUT', body: payload }),
  deleteShift: (id) =>
    request(`/api/coordinator/shifts/${id}`, { method: 'DELETE' }),

  // Universal live deployment view
  getShiftOverview: (date) =>
    request(`/api/shifts/overview${query({ date })}`),
}

export default shiftApi
