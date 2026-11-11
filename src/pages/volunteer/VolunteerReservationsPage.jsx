import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import StatCard from '../../components/admin/StatCard'
import { formatDateTime } from '../../components/admin/formatters'
import { formatShiftDate, formatShiftRange } from '../../components/shift/formatters'
import { shiftApi } from '../../services/api/shiftApi'

const STATUS_STYLE = {
  CONFIRMED: 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100',
  PENDING: 'border-amber-300/25 bg-amber-400/10 text-amber-100',
  CANCELLED: 'border-red-300/25 bg-red-400/10 text-red-100',
  EXPIRED: 'border-white/10 bg-white/5 text-frost/50',
}

function secondsLeft(reservation, now) {
  if (!reservation?.timerExpiresAt) return 0
  const end = new Date(reservation.timerExpiresAt).getTime()
  if (!Number.isFinite(end)) return 0
  return Math.max(0, Math.floor((end - now) / 1000))
}

function clock(total) {
  const value = Math.max(0, Math.floor(total))
  const minutes = Math.floor(value / 60)
  const seconds = value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function VolunteerReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [live, setLive] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [now, setNow] = useState(() => Date.now())

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const [all, active] = await Promise.all([
        shiftApi.getReservations(),
        shiftApi.getActiveReservations(),
      ])
      setReservations(Array.isArray(all) ? all : [])
      setLive(Array.isArray(active) ? active : [])
    } catch (err) {
      setError(err?.message || 'Aktiv rezervasiyalar yüklənmədi.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => load(true), 10000)
    return () => clearInterval(timer)
  }, [load])

  const filteredUpcoming = useMemo(() => {
    const liveIds = new Set(live.map((reservation) => reservation.id))
    const needle = search.trim().toLowerCase()
    return reservations
      .filter((reservation) => !liveIds.has(reservation.id))
      .filter((reservation) => {
        if (!needle) return true
        const haystack = [
          reservation.customerName,
          reservation.customerUsername,
          reservation.voucherCode,
          reservation.skateSize,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(needle)
      })
  }, [reservations, live, search])

  const waiting = live.filter((reservation) => !reservation.skateReserved).length
  const preparing = live.filter((reservation) => reservation.skateReserved).length
  const handedOut = reservations.filter((reservation) => reservation.skateHandedOut).length

  async function reserve(reservation) {
    setBusyId(reservation.id)
    setError('')
    setSuccess('')
    try {
      const updated = await shiftApi.reserveReservation(reservation.id)
      setLive((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      )
      setSuccess(
        `${updated.customerName} üçün ${updated.skateSize} ölçülü konki hazırlanır.`
      )
      await load(true)
    } catch (err) {
      setError(err?.message || 'Konki rezervasiyası qeydə alınmadı.')
    } finally {
      setBusyId(null)
    }
  }

  async function fulfill(reservation) {
    setBusyId(reservation.id)
    setError('')
    setSuccess('')
    try {
      const updated = await shiftApi.fulfillReservation(reservation.id)
      setSuccess(
        `${updated.customerName} üçün konki təhvili qeydə alındı${
          updated.skateHandedOutBy ? ` (${updated.skateHandedOutBy})` : ''
        }.`
      )
      await load(true)
    } catch (err) {
      setError(err?.message || 'Konki təhvili qeydə alınmadı.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Könüllü iş masası"
        title="Konki təhvili"
        description="Müştəri taymeri aktivləşdirən kimi tələb aşağıdakı canlı siqnal bölməsində görünür. Lazımi ölçünü götürüb “Konki hazırdır” düyməsini basın, sonra təhvili qeyd edin."
        actions={
          <button
            type="button"
            onClick={() => load()}
            className="btn-ghost !px-5 !py-2.5 text-sm"
          >
            Yenilə
          </button>
        }
      />

      {error && (
        <div className="mb-3">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}
      {success && (
        <div className="mb-3">
          <AdminNotice tone="success">{success}</AdminNotice>
        </div>
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Canlı tələb"
          value={live.length}
          hint="Taymeri aktiv olan"
          icon="●"
          tone={live.length > 0 ? 'amber' : 'green'}
        />
        <StatCard
          label="Təhvil gözləyir"
          value={waiting}
          hint="Konki hələ götürülməyib"
          icon="⛸"
          tone={waiting > 0 ? 'amber' : 'green'}
        />
        <StatCard
          label="Hazırlanır"
          value={preparing}
          hint="Təhvilə hazır"
          icon="✓"
          tone="ice"
        />
        <StatCard
          label="Təhvil verilib"
          value={handedOut}
          hint="Bu günün qeydləri"
          icon="◈"
          tone="green"
        />
      </div>

      <section className="mb-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              Canlı siqnal
            </h2>
            <p className="mt-1 text-xs text-frost/50">
              10 dəqiqəlik taymer bitərsə konki stoku avtomatik geri qaytarılır.
            </p>
          </div>
          <span className="chip !border-emerald-300/25 !bg-emerald-400/10 text-emerald-100">
            {live.length} aktiv
          </span>
        </div>

        {loading ? (
          <div className="glass rounded-xl p-8 text-center text-sm text-frost/45">
            Yüklənir...
          </div>
        ) : live.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-sm font-semibold text-white">Hazırda canlı tələb yoxdur</p>
            <p className="mt-1 text-xs text-frost/45">
              Müştəri “Biletlərim” bölməsindən rezervasiyanı aktivləşdirəndə burada görünəcək.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {live.map((reservation) => {
              const remaining = secondsLeft(reservation, now)
              const expired = remaining <= 0
              return (
                <article
                  key={reservation.id}
                  className={`glass-strong overflow-hidden rounded-xl border ${
                    reservation.skateReserved
                      ? 'border-ice-300/30'
                      : 'border-amber-300/35'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-lg font-bold text-white">
                          {reservation.customerName}
                        </p>
                        <span className="text-xs text-frost/45">
                          @{reservation.customerUsername}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-frost/55">
                        {formatShiftDate(reservation.sessionDate)} ·{' '}
                        {formatShiftRange(
                          reservation.sessionStartTime,
                          reservation.sessionEndTime
                        )}{' '}
                        · Giriş {reservation.entryTime?.slice(0, 5) || '—'}
                      </p>
                    </div>
                    <span
                      className={`rounded-md border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        reservation.skateReserved
                          ? 'border-ice-300/30 bg-ice-400/10 text-ice-100'
                          : 'border-amber-300/30 bg-amber-400/10 text-amber-100'
                      }`}
                    >
                      {reservation.statusLabel}
                    </span>
                  </div>

                  <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-ice-400 text-night-950">
                        <span className="font-display text-2xl font-bold">
                          {reservation.skateSize || '—'}
                        </span>
                        <span className="-mt-1 text-[9px] font-bold uppercase tracking-wider">
                          ölçü
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-frost/40">
                          Konki rezervasiyası
                        </p>
                        <p
                          className={`mt-1 font-display text-3xl font-bold ${
                            expired ? 'text-red-200' : 'text-white'
                          }`}
                        >
                          {clock(remaining)}
                        </p>
                        <p className="text-[11px] text-frost/45">
                          {expired
                            ? 'Taymer bitdi, stok geri qaytarılır'
                            : 'Təhvil verilənə qədər taymer davam edir'}
                        </p>
                        {reservation.skateReservedAt && (
                          <p className="mt-1 text-[10px] text-ice-200/70">
                            Hazırlayan: {reservation.skateReservedBy || '—'} ·{' '}
                            {formatDateTime(reservation.skateReservedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:w-40">
                      {!reservation.skateReserved ? (
                        <button
                          type="button"
                          disabled={busyId === reservation.id || expired}
                          onClick={() => reserve(reservation)}
                          className="btn-primary !px-4 !py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {busyId === reservation.id ? 'Qeyd edilir...' : 'Konki hazırdır'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId === reservation.id || expired}
                          onClick={() => fulfill(reservation)}
                          className="btn-primary !px-4 !py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {busyId === reservation.id ? 'Qeyd edilir...' : 'Təhvil ver'}
                        </button>
                      )}
                      {reservation.voucherCode && (
                        <p className="truncate text-center font-mono text-[10px] text-frost/30">
                          {reservation.voucherCode}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              Növbəti rezervasiyalar
            </h2>
            <p className="mt-1 text-xs text-frost/50">
              Taymer hələ aktivləşdirilməyib. Müştəri arenaya gəldikdə canlı siqnala keçəcək.
            </p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Müştəri, kod və ya ölçü..."
            className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-frost/30 focus:border-ice-300/50 sm:w-72"
          />
        </div>

        <div className="glass overflow-hidden rounded-xl">
          <div className="divide-y divide-white/[0.06]">
            {!loading && filteredUpcoming.length === 0 && (
              <div className="p-8 text-center text-sm text-frost/45">
                Gözləyən rezervasiya tapılmadı.
              </div>
            )}
            {filteredUpcoming.map((reservation) => (
              <div
                key={reservation.id}
                className="flex flex-col gap-4 p-4 transition-colors hover:bg-white/[0.025] xl:flex-row xl:items-center xl:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-sm font-bold text-white">
                      {reservation.customerName}
                    </p>
                    <span className="text-xs text-frost/40">
                      @{reservation.customerUsername}
                    </span>
                    <span
                      className={`rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        STATUS_STYLE[reservation.status] || STATUS_STYLE.EXPIRED
                      }`}
                    >
                      {reservation.statusLabel || reservation.status}
                    </span>
                    {reservation.skateHandedOut && (
                      <span className="rounded-md border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-100">
                        Konki verilib
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-frost/50">
                    <span>
                      {formatShiftDate(reservation.sessionDate)} ·{' '}
                      {formatShiftRange(
                        reservation.sessionStartTime,
                        reservation.sessionEndTime
                      )}
                    </span>
                    <span>
                      Giriş: {reservation.entryTime?.slice(0, 5) || '—'} ·{' '}
                      {reservation.durationMinutes || 0} dəq
                    </span>
                    <span>
                      Konki: {reservation.skateSize ? `${reservation.skateSize} ölçü` : '—'}
                    </span>
                    {reservation.voucherCode && (
                      <span className="font-mono text-frost/35">
                        {reservation.voucherCode}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {reservation.skateHandedOut ? (
                    <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-frost/40">
                      Tamamlandı
                    </span>
                  ) : reservation.reservationActive ? (
                    <span className="rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-100">
                      Canlı siqnalda
                    </span>
                  ) : (
                    <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-frost/45">
                      Taymer gözləyir
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
