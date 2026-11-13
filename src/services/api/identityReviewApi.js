import { request } from '../../api/client'

export const identityReviewApi = {
  list(status = '') {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    return request(`/api/admin/identity-verifications${query}`)
  },
  approve(userId) {
    return request(`/api/admin/identity-verifications/${userId}/approve`, {
      method: 'POST',
    })
  },
  reject(userId, reason) {
    return request(`/api/admin/identity-verifications/${userId}/reject`, {
      method: 'POST',
      body: { reason },
    })
  },
}
