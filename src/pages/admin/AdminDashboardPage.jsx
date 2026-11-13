import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminNotice from '../../components/admin/AdminNotice'
import StatCard from '../../components/admin/StatCard'
import { formatMoney, formatNumber } from '../../components/admin/formatters'
import { adminApi } from '../../services/api/adminApi'
import { formatDateAZ } from '../../utils/datetime'

function LoadingCard() {
  return <div className="glass h-36 animate-pulse rounded-xl" />
}

function getTodayString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getYesterdayString() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function AdminDashboardPage() {
  const todayStr = useMemo(() => getTodayString(), [])
  const yesterdayStr = useMemo(() => getYesterdayString(), [])
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isToday = selectedDate === todayStr

  const load = useCallback(async (targetDate = selectedDate) => {
    setLoading(true)
    setError('')
    try {
      const res = await adminApi.getDashboard(targetDate)
      setData(res)
    } catch (err) {
      setError(err?.message || 'İdarəetmə paneli məlumatları yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    load(selectedDate)
  }, [selectedDate, load])

  const trendMax = useMemo(
    () => Math.max(1, ...(data?.revenueTrend || []).map((item) => Number(item.amount) || 0)),
    [data]
  )

  const dateLabel = isToday ? 'Bugünkü' : `${formatDateAZ(selectedDate)} üzrə`

  return (
    <div>
      <AdminPageHeader
        eyebrow="Analitika və İdarəetmə"
        title="İdarəetmə paneli"
        description="Gəlir, seans doluluğu, ödənişlər və anbar göstəriciləri. İstənilən keçmiş tarixin analitikasına baxa bilərsiniz."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-night-900/80 p-1">
              <button
                type="button"
                onClick={() => setSelectedDate(todayStr)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  isToday
                    ? 'bg-ice-400 text-night-950 shadow-sm'
                    : 'text-frost/65 hover:text-white'
                }`}
              >
                Bu gün
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(yesterdayStr)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  selectedDate === yesterdayStr
                    ? 'bg-ice-400 text-night-950 shadow-sm'
                    : 'text-frost/65 hover:text-white'
                }`}
              >
                Dünən
              </button>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-night-900/80 px-2.5 py-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-frost/45">
                Tarix:
              </span>
              <input
                type="date"
                value={selectedDate}
                max={todayStr}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value)
                }}
                className="bg-transparent text-xs font-bold text-white outline-none [color-scheme:dark]"
              />
            </div>

            <button
              type="button"
              onClick={() => load(selectedDate)}
              className="btn-ghost !px-4 !py-2 text-xs"
            >
              Yenilə
            </button>
          </div>
        }
      />

      {!isToday && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-ice-300/30 bg-ice-400/10 px-4 py-3 text-xs text-ice-100">
          <div>
            <span className="font-bold text-ice-200">📅 Tarix analizi:</span> Hazırda{' '}
            <b>{formatDateAZ(selectedDate)}</b> tarixinin arxiv göstəricilərinə baxırsınız.
          </div>
          <button
            type="button"
            onClick={() => setSelectedDate(todayStr)}
            className="underline font-bold text-white hover:text-ice-200"
          >
            Bu günə qayıt
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((key) => (
            <LoadingCard key={key} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label={`${dateLabel} gəlir`}
              value={formatMoney(data?.todayRevenue)}
              hint={`${formatNumber(data?.todayTransactions)} tranzaksiya`}
              icon="₼"
              tone="green"
            />
            <StatCard
              label="Seans doluluğu"
              value={`${(Number(data?.todayOccupancyRate) || 0).toFixed(1)}%`}
              hint={`${formatNumber(data?.activeSessions)} seans`}
              icon="◷"
              tone="ice"
            />
            <StatCard
              label={`${dateLabel} rezervasiya`}
              value={formatNumber(data?.todayReservations)}
              hint={`${formatNumber(data?.confirmedReservations)} təsdiqlənmiş`}
              icon="◎"
              tone="violet"
            />
            <StatCard
              label="Konki anbarı"
              value={formatNumber(data?.stockAlerts?.length)}
              hint="Diqqət tələb edən ölçü"
              icon="⛸"
              tone={(data?.stockAlerts?.length || 0) > 0 ? 'amber' : 'green'}
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Onlayn gəlir"
              value={formatMoney(data?.todayOnlineRevenue)}
              hint="Ödəniş gateway"
              tone="ice"
            />
            <StatCard
              label="Kassir gəliri"
              value={formatMoney(data?.todayPosRevenue)}
              hint="POS satışları"
              tone="green"
            />
            <StatCard
              label="Gözləyən ödəniş"
              value={formatNumber(data?.pendingPayments)}
              hint={`${formatNumber(data?.failedPayments)} uğursuz`}
              tone={(data?.pendingPayments || 0) > 0 ? 'amber' : 'green'}
            />
            <StatCard
              label="Giriş qeydə alınıb"
              value={formatNumber(data?.checkedInTickets)}
              hint="Turniket QR scan"
              tone="violet"
            />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-bold text-white">
                  {isToday ? 'Bu günün seansları' : `${formatDateAZ(selectedDate)} seansları`}
                </h3>
                <span className="chip chip-ice">{formatNumber(data?.todaySessions)} seans</span>
              </div>
              <div className="mt-4 space-y-3">
                {(data?.sessions || []).length === 0 && (
                  <p className="text-sm text-frost/45">Bu tarix üçün seans qeydə alınmayıb.</p>
                )}
                {(data?.sessions || []).map((session) => (
                  <div key={session.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-white">
                          {session.startTime}–{session.endTime}
                        </span>
                        {session.blocked && (
                          <span className="rounded-md bg-red-400/10 px-2 py-0.5 text-[10px] font-bold text-red-200">
                            Blok
                          </span>
                        )}
                        {session.active && (
                          <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                            Aktiv
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-frost/55">
                        {formatNumber(session.occupiedTickets)}/{formatNumber(session.maxTickets)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-ice-400"
                        style={{ width: `${Math.min(100, Number(session.occupancyRate) || 0)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-[10px] font-semibold text-frost/40">
                      {(Number(session.occupancyRate) || 0).toFixed(1)}% doluluq
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="glass rounded-xl p-5">
                <h3 className="font-display text-lg font-bold text-white">
                  {isToday ? 'Son 7 günün gəlir trendi' : `${formatDateAZ(selectedDate)} və əvvəlki 6 gün`}
                </h3>
                <div className="mt-5 flex h-40 items-end gap-2">
                  {(data?.revenueTrend || []).map((item) => {
                    const height = Math.max(6, (Number(item.amount) / trendMax) * 100)
                    const isSelectedBar = item.date === selectedDate
                    return (
                      <div key={item.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                        <div className="flex h-32 w-full items-end">
                          <div
                            className={`w-full rounded-t-lg transition-all ${
                              isSelectedBar ? 'bg-emerald-400 shadow-md shadow-emerald-400/20' : 'bg-ice-400'
                            }`}
                            style={{ height: `${height}%` }}
                            title={`${item.date}: ${formatMoney(item.amount)} (${item.transactions} satış)`}
                          />
                        </div>
                        <span
                          className={`text-[10px] font-semibold ${
                            isSelectedBar ? 'text-emerald-200 font-bold' : 'text-frost/40'
                          }`}
                        >
                          {String(item.date).slice(5)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="glass rounded-xl p-5">
                <h3 className="font-display text-lg font-bold text-white">Anbar xəbərdarlıqları</h3>
                <div className="mt-3 space-y-2">
                  {(data?.stockAlerts || []).length === 0 && (
                    <p className="text-sm text-frost/45">Bütün ölçülərdə stok normaldır.</p>
                  )}
                  {(data?.stockAlerts || []).map((alert) => (
                    <div
                      key={alert.skateId}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{alert.size} ölçü</p>
                        <p className="text-[11px] text-frost/45">
                          Boşda: {alert.availableQuantity} · Zədəli: {alert.damagedQuantity}
                        </p>
                      </div>
                      <span
                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${
                          alert.level === 'CRITICAL'
                            ? 'bg-red-400/10 text-red-200'
                            : alert.level === 'LOW'
                              ? 'bg-amber-400/10 text-amber-200'
                              : 'bg-violet-400/10 text-violet-200'
                        }`}
                      >
                        {alert.level === 'CRITICAL'
                          ? 'Kritik'
                          : alert.level === 'LOW'
                            ? 'Azalır'
                            : 'Zədəli'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
