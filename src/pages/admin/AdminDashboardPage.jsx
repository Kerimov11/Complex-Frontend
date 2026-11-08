import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminNotice from '../../components/admin/AdminNotice'
import StatCard from '../../components/admin/StatCard'
import { formatMoney, formatNumber } from '../../components/admin/formatters'
import { adminApi } from '../../services/api/adminApi'

function LoadingCard() {
  return <div className="glass h-36 animate-pulse rounded-3xl" />
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await adminApi.getDashboard())
    } catch (err) {
      setError(err?.message || 'Dashboard məlumatları yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const trendMax = useMemo(
    () => Math.max(1, ...(data?.revenueTrend || []).map((item) => Number(item.amount) || 0)),
    [data]
  )

  if (loading) {
    return (
      <div>
        <AdminPageHeader eyebrow="Canlı analitika" title="Dashboard" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((key) => (
            <LoadingCard key={key} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Canlı analitika"
        title="Dashboard"
        description="Günlük gəlir, seans doluluğu, ödəniş vəziyyəti və anbar siqnalları bir ekranda."
        actions={
          <button type="button" onClick={load} className="btn-ghost !px-5 !py-2.5 text-sm">
            Yenilə
          </button>
        }
      />

      {error && (
        <div className="mb-4">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bugünkü gəlir"
          value={formatMoney(data?.todayRevenue)}
          hint={`${formatNumber(data?.todayTransactions)} tranzaksiya`}
          icon="₼"
          tone="green"
        />
        <StatCard
          label="Seans doluluğu"
          value={`${(Number(data?.todayOccupancyRate) || 0).toFixed(1)}%`}
          hint={`${formatNumber(data?.activeSessions)} aktiv seans`}
          icon="◷"
          tone="ice"
        />
        <StatCard
          label="Bugünkü rezervasiya"
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
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-white">Bu günün seansları</h3>
            <span className="chip chip-ice">{formatNumber(data?.todaySessions)} seans</span>
          </div>
          <div className="mt-4 space-y-3">
            {(data?.sessions || []).length === 0 && (
              <p className="text-sm text-frost/45">Bu gün üçün seans yoxdur.</p>
            )}
            {(data?.sessions || []).map((session) => (
              <div key={session.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-white">
                      {session.startTime}–{session.endTime}
                    </span>
                    {session.blocked && (
                      <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-[10px] font-bold text-red-200">
                        Blok
                      </span>
                    )}
                    {session.active && (
                      <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
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
                    className="h-full rounded-full bg-gradient-to-r from-ice-400 to-emerald-300"
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
          <div className="glass rounded-3xl p-5">
            <h3 className="font-display text-lg font-bold text-white">Son 7 gün gəliri</h3>
            <div className="mt-5 flex h-40 items-end gap-2">
              {(data?.revenueTrend || []).map((item) => {
                const height = Math.max(6, (Number(item.amount) / trendMax) * 100)
                return (
                  <div key={item.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-ice-500/40 to-ice-300 transition-all"
                        style={{ height: `${height}%` }}
                        title={`${item.date}: ${formatMoney(item.amount)}`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-frost/40">
                      {String(item.date).slice(5)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass rounded-3xl p-5">
            <h3 className="font-display text-lg font-bold text-white">Anbar xəbərdarlıqları</h3>
            <div className="mt-3 space-y-2">
              {(data?.stockAlerts || []).length === 0 && (
                <p className="text-sm text-frost/45">Bütün ölçülərdə stok normaldır.</p>
              )}
              {(data?.stockAlerts || []).map((alert) => (
                <div
                  key={alert.skateId}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-bold text-white">{alert.size} ölçü</p>
                    <p className="text-[11px] text-frost/45">
                      Boşda: {alert.availableQuantity} · Zədəli: {alert.damagedQuantity}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
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
    </div>
  )
}
