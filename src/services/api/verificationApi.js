import { adminApi } from './adminApi'

export const verificationApi = {
  scan: adminApi.verifyCode,
  lookup: adminApi.lookupCode,
}

export default verificationApi
