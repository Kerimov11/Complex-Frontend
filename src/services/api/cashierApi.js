import { adminApi } from './adminApi'

export const cashierApi = {
  sell: adminApi.sellPos,
  report: adminApi.getPosReport,
  sales: adminApi.getPosSales,
}

export default cashierApi
