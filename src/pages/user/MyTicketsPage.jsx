import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import QrCode from '../../components/booking/QrCode'
import SectionTitle from '../../components/SectionTitle'
import { api } from '../../api/client'
import { formatDateAZ, pad, secondsToClock } from '../../utils/datetime'
import { skateReservationCheck } from '../../utils/schedule'

const STATUS_STYLE = {
  ACTIVE: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100',
  USED: 'border-sky-300/25 bg-sky-400/10 text-sky-100',
  EXPIRED: 'border-white/10 bg-white/5 text-frost/55',
  CANCELLED: 'border-red-300/30 bg-red-400/10 text-red-100',
  PENDING: 'border-amber-300/30 bg-amber-400/10 text-amber-100',
}

function timeLabel(value) {
  return value ? String(value).slice(0, 5) : '—'
}

function dateTimeLabel(value) {
  if (!value) return '—'
  const d = new Date(value)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

function ticketSecondsLeft(ticket, now, fetchedAt) {
  if (
    ticket?.timerRemainingSeconds != null &&
    Number.isFinite(Number(ticket.timerRemainingSeconds))
  ) {
    const elapsed = Math.max(0, Math.floor((now - fetchedAt) / 1000))
    return Math.max(0, Number(ticket.timerRemainingSeconds) - elapsed)
  }
  if (!ticket?.timerExpiresAt) return 0
  const end = new Date(ticket.timerExpiresAt).getTime()
  if (!Number.isFinite(end)) return 0
  return Math.max(0, Math.floor((end - now) / 1000))
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ticketErrors, setTicketErrors] = useState({})
  const [confirmState, setConfirmState] = useState(null)
  const [success, setSuccess] = useState('')
  const [busyCode, setBusyCode] = useState(null)
  const [filter, setFilter] = useState('active')
  const [now, setNow] = useState(() => Date.now())
  const [fetchedAt, setFetchedAt] = useState(() => Date.now())

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const list = await api.getMyTickets()
      setTickets(Array.isArray(list) ? list : [])
      setFetchedAt(Date.now())
    } catch (err) {
      setError(err?.message || 'Bilet tarixçəsi yüklənmədi.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const onFocus = () => load(true)
    const onVisibility = () => {
      if (!document.hidden) load(true)
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [load])

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick)
  }, [])

  // Təsdiq gözləyən biletlər olduqda kassir təsdiq edən kimi avtomatik yenilə
  const hasPendingReview = tickets.some(
    (ticket) => ticket.identityReviewStatus === 'PENDING_REVIEW'
  )
  useEffect(() => {
    if (!hasPendingReview) return undefined
    const timer = setInterval(() => load(true), 5000)
    return () => clearInterval(timer)
  }, [hasPendingReview, load])

  const hasActiveTimer = tickets.some((ticket) => ticket.reservationActive)
  useEffect(() => {
    if (!hasActiveTimer) return undefined
    const timer = setInterval(() => load(true), 15000)
    return () => clearInterval(timer)
  }, [hasActiveTimer, load])

  useEffect(() => {
    if (!hasActiveTimer) return undefined
    const finished = tickets.some(
      (ticket) => ticket.reservationActive && ticketSecondsLeft(ticket, now, fetchedAt) <= 0
    )
    if (!finished) return undefined
    const timer = setTimeout(() => load(true), 2500)
    return () => clearTimeout(timer)
  }, [now, fetchedAt, tickets, hasActiveTimer, load])

  const shown = useMemo(() => {
    // Yalnız ödənişi təsdiq olunmuş biletlər göstərilir (ödənişi tamamlanmamış PENDING biletlər düşmür)
    const paidTickets = tickets.filter((ticket) => ticket.status !== 'PENDING')
    if (filter === 'all') return paidTickets
    if (filter === 'past') {
      return paidTickets.filter((ticket) =>
        ['USED', 'EXPIRED', 'CANCELLED'].includes(ticket.status)
      )
    }
    return paidTickets.filter((ticket) => ticket.status === 'ACTIVE')
  }, [tickets, filter])

  async function activate(ticket, skipConfirm = false) {
    if (busyCode) return

    const check = skateReservationCheck(ticket.durationMinutes || 60, new Date())
    if (!check.allowed) {
      setError(check.message)
      setTicketErrors((prev) => ({ ...prev, [ticket.ticketCode]: check.message }))
      return
    }
    if (check.confirmMessage && !skipConfirm) {
      setTicketErrors((prev) => ({ ...prev, [ticket.ticketCode]: '' }))
      setConfirmState({ ticket, message: check.confirmMessage })
      return
    }

    setBusyCode(ticket.ticketCode)
    setError('')
    setTicketErrors((prev) => ({ ...prev, [ticket.ticketCode]: '' }))
    setSuccess('')
    try {
      const updated = await api.activateTicket(ticket.ticketCode)
      setTickets((prev) =>
        prev.map((item) =>
          item.ticketCode === ticket.ticketCode ? { ...item, ...updated } : item
        )
      )
      setFetchedAt(Date.now())
      setSuccess(
        'Konki rezervasiyası aktivləşdirildi. Könüllü heyəti konkilərinizi hazırlayacaq.'
      )
      await load(true)
    } catch (err) {
      const msg = err?.message || 'Rezervasiya aktivləşdirilə bilmədi.'
      setError(msg)
      setTicketErrors((prev) => ({ ...prev, [ticket.ticketCode]: msg }))
    } finally {
      setBusyCode(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
      <SectionTitle
        eyebrow="Müştəri paneli"
        title="Biletlərim"
        description="Keçmiş və aktiv biletləriniz, QR kodlarınız və konki rezervasiyasının əl ilə aktivləşdirilməsi."
      />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'active', label: 'Aktiv biletlər' },
            { key: 'past', label: 'Keçmiş biletlər' },
            { key: 'all', label: 'Hamısı' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
                filter === tab.key
                  ? 'bg-ice-400 text-night-950'
                  : 'glass text-frost/65 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => load()} className="btn-ghost !py-2.5">
            Yenilə
          </button>
          <Link to="/bilet" className="btn-primary !py-2.5">
            Yeni bilet al
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-5 rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {success}
        </div>
      )}

      {loading ? (
        <div className="glass mt-6 rounded-xl p-8 text-center text-sm text-frost/60">
          Biletlər yüklənir…
        </div>
      ) : shown.length === 0 ? (
        <div className="glass-strong mt-6 rounded-xl p-10 text-center">
          <p className="font-display text-xl font-bold text-white">
            Bu bölmədə bilet yoxdur
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-frost/60">
            Yeni bilet aldıqdan sonra o, avtomatik olaraq burada görünəcək.
          </p>
          <Link to="/bilet" className="btn-primary mt-5 inline-flex">
            Bilet al
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {shown.map((ticket) => {
            const secondsLeft = ticketSecondsLeft(ticket, now, fetchedAt)
            const activeTimer = Boolean(ticket.reservationActive) && secondsLeft > 0
            const attemptsLeft =
              ticket.remainingActivations ??
              Math.max(0, (ticket.maxActivations || 2) - (ticket.activationCount || 0))
            const canActivate = Boolean(ticket.canActivate) && attemptsLeft > 0
            const statusStyle = STATUS_STYLE[ticket.status] || STATUS_STYLE.EXPIRED
            const isBooking = ticket.source === 'BOOKING'

            return (
              <article
                key={`${ticket.source}-${ticket.ticketCode}`}
                className="glass-strong overflow-hidden rounded-xl"
              >
                <div className="flex items-start justify-between gap-4 border-b border-dashed border-white/20 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ice-300">
                      {isBooking ? 'Onlayn bilet' : 'Kassa bileti'}
                    </p>
                    <p className="mt-1 truncate font-display text-lg font-bold tracking-wider text-white">
                      {ticket.ticketCode}
                    </p>
                    <p className="mt-1 text-[11px] text-frost/50">
                      {`Alınma: ${dateTimeLabel(ticket.purchaseDate)}`}
                    </p>
                  </div>
                  <span className={`chip shrink-0 border ${statusStyle}`}>
                    {ticket.statusLabel || ticket.status}
                  </span>
                </div>

                <div className="flex flex-col gap-5 p-5 sm:flex-row">
                  <div className="grid shrink-0 place-items-center self-start rounded-lg border border-white/10 bg-white p-3 text-night-950">
                    <QrCode value={ticket.qrCode || ticket.ticketCode} className="h-24 w-24" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-3 text-sm">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-frost/45">
                        Bilet və giriş
                      </p>
                      <p className="mt-0.5 font-semibold text-white">
                        {ticket.sessionDate ? formatDateAZ(ticket.sessionDate) : 'Sərbəst tarix'}
                      </p>
                      <p className="text-xs text-frost/60">
                        {ticket.checkedInAt || ticket.iceEntryTime
                          ? `Buza giriş: ${ticket.iceEntryTime || timeLabel(ticket.checkedInAt)} · Çıxış: ${ticket.iceExitTime || timeLabel(ticket.checkedOutAt)} (${ticket.durationMinutes || 60} dəq)`
                          : `Giriş: İş saatları içində istənilən vaxt · ${ticket.durationMinutes || 60} dəqiqəlik sürüş`}
                      </p>
                    </div>

                    {isBooking && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-xl bg-white/[0.04] px-3 py-2">
                          <span className="text-frost/45">İştirakçı</span>
                          <p className="font-bold text-white">{ticket.participantCount || 1}</p>
                        </div>
                        <div className="rounded-xl bg-white/[0.04] px-3 py-2">
                          <span className="text-frost/45">Konki razmeri</span>
                          <p className="font-bold text-white">
                            {(ticket.skateSizes || []).join(', ') || '—'}
                          </p>
                        </div>
                      </div>
                    )}

                    {isBooking && ticket.identityReviewStatus === 'PENDING_REVIEW' && (
                      <div className="rounded-xl border border-amber-300/35 bg-amber-400/12 px-3 py-2.5 text-xs leading-relaxed text-amber-100">
                        <b>Təsdiq gözləyir:</b> Bilet və təqdim olunan sənəd/foto məlumatlarınız kassir tərəfindən yoxlanılır və biletiniz ən qısa müddətdə təsdiqlənəcək.
                      </div>
                    )}

                    {isBooking && ticket.identityReviewStatus === 'REJECTED' && (
                      <div className="rounded-xl border border-red-400/35 bg-red-500/12 px-3 py-2.5 text-xs leading-relaxed text-red-100">
                        <b>Şəxsiyyət / bilet təsdiqi rədd edilib:</b>{' '}
                        {ticket.identityRejectionReason || 'Zəhmət olmasa qaydalara uyğun yeni foto yükləyin.'}{' '}
                        {ticket.status === 'CANCELLED' && (
                          <span className="block mt-1 font-semibold text-emerald-200">
                            Bilet ləğv olundu və ödəniş kartınıza geri qaytarıldı.
                          </span>
                        )}
                        <Link to="/hesabim" className="mt-1 inline-block underline font-bold">
                          Hesabım bölməsindən yenidən göndərin
                        </Link>
                      </div>
                    )}

                    {isBooking && !ticket.skateHandedOut && (
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-frost/55">Aktivləşdirmə cəhdi</span>
                          <b className="text-white">
                            {ticket.activationCount || 0} / {ticket.maxActivations || 2}
                          </b>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-ice-400"
                            style={{
                              width: `${
                                ((ticket.activationCount || 0) /
                                  (ticket.maxActivations || 2)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {activeTimer ? (
                      <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-3 py-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                          Konki rezervasiyası aktivdir
                        </p>
                        <p className="mt-1 font-display text-2xl font-bold text-white">
                          {secondsToClock(secondsLeft)}
                        </p>
                        <p className="text-[11px] text-emerald-100/70">
                          Könüllü heyəti konkilərinizi hazırlayır. Taymer bitərsə stok
                          avtomatik geri qaytarılır.
                        </p>
                      </div>
                    ) : isBooking && ticket.skateHandedOut ? (
                      <p className="rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-3 py-2.5 text-xs font-semibold text-emerald-100">
                        Konki təhvil alındı
                      </p>
                    ) : canActivate ? (
                      <div className="space-y-2">
                        {ticketErrors[ticket.ticketCode] && (
                          <p className="rounded-lg border border-red-400/35 bg-red-500/12 px-3 py-2 text-xs font-semibold text-red-100">
                            {ticketErrors[ticket.ticketCode]}
                          </p>
                        )}
                        <button
                          type="button"
                          disabled={busyCode === ticket.ticketCode}
                          onClick={() => activate(ticket)}
                          className="btn-primary w-full !py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {busyCode === ticket.ticketCode
                            ? 'Aktivləşdirilir…'
                            : `Konki rezervasiyasını aktivləşdir (${attemptsLeft} cəhd qalıb)`}
                        </button>
                      </div>
                    ) : isBooking && ticket.identityReviewStatus === 'PENDING_REVIEW' ? (
                      <p className="rounded-xl border border-amber-300/25 bg-amber-400/10 px-3 py-2.5 text-xs text-amber-100">
                        Biletiniz kassir tərəfindən təsdiqləndikdən sonra konki rezervasiyası aktivləşdirilə bilər.
                      </p>
                    ) : isBooking && ticket.identityReviewStatus === 'REJECTED' ? null : isBooking && ticket.status === 'ACTIVE' ? (
                      <p className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-frost/55">
                        {attemptsLeft > 0
                          ? 'Rezervasiyanı aktivləşdirmək üçün arenaya yaxınlaşdıqda düyməni basın.'
                          : 'Bu bilet üçün 2 aktivləşdirmə cəhdi istifadə olunub.'}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {confirmState && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-night-950/75 p-4 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-md rounded-xl border border-amber-300/35 p-6">
            <p className="font-display text-lg font-bold text-amber-100">
              Bağlanma xəbərdarlığı
            </p>
            <p className="mt-2 text-sm leading-relaxed text-frost/80">
              {confirmState.message}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmState(null)}
                className="btn-ghost !py-2 text-xs"
              >
                Ləğv et
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = confirmState.ticket
                  setConfirmState(null)
                  activate(target, true)
                }}
                className="btn-primary !py-2 text-xs"
              >
                Bəli, rezerv et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
