import { adminApi } from './adminApi'

export const verificationApi = {
  scan: adminApi.verifyCode,
  lookup: adminApi.lookupCode,
  handover: adminApi.handoverCode,
  active: adminApi.getActiveGuests,
}

export default verificationApi
