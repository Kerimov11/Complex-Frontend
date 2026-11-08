import { useCallback, useEffect, useMemo, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import { useAuth } from '../auth/AuthContext'
import { api } from '../api/client'
import { formatPrice } from '../utils/ticket'
import { pad } from '../utils/datetime'

const STATUS_META = {
  PENDING: {
    label: 'Gözləyir',
    chip: 'border-amber-300/30 bg-amber-400/10 text-amber-200',
  },
  SUCCESS: {
    label: 'Uğurlu',
    chip: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200',
  },
  FAILED: {
    label: 'Uğursuz',
    chip: 'border-red-300/30 bg-red-400/10 text-red-200',
  },
}

const FILTERS = [
  { value: '', label: 'Hamısı' },
  { value: 'PENDING', label: 'Gözləyən' },
  { value: 'SUCCESS', label: 'Uğurlu' },
  { value: 'FAILED', label: 'Uğursuz' },
]

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

function formatTotal(value) {
  const amount = Number(value) || 0
  return amount > 0 ? formatPrice(amount) : '0 AZN'
}

export default function AdminPaymentsPage() {
  const { isAuthenticated, isAdmin, openAuth } = useAuth()
  const [filter, setFilter] = useState('')
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = useCallback(async () => {
    if (!isAdmin) return
    setLoading(true)
    setError('')
    try {
      const data = await api.getPayments()
      setPayments(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Ödənişlər yüklənmədi.')
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    load()
  }, [load])

  const summary = useMemo(() => {
    const pending = payments.filter((payment) => payment.status === 'PENDING')
    const successful = payments.filter((payment) => payment.status === 'SUCCESS')
    const total = successful.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    )
    return { pending: pending.length, successful: successful.length, total }
  }, [payments])

  const visiblePayments = useMemo(
    () =>
      filter
        ? payments.filter((payment) => payment.status === filter)
        : payments,
    [filter, payments]
  )

  async function changeStatus(payment, status) {
    if (busyId) return
    setBusyId(payment.transactionId)
    setError('')
    try {
      const updated = await api.processPayment(payment.transactionId, status)
      setPayments((prev) =>
        prev.map((item) =>
          item.transactionId === updated.transactionId ? updated : item
        )
      )
    } catch (err) {
      setError(err?.message || 'Ödəniş statusu dəyişdirilmədi.')
    } finally {
      setBusyId('')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-10 pt-32 sm:px-6">
        <SectionTitle
          eyebrow="Admin"
          title="Ödəniş idarəetməsi"
          description="Bu səhifə yalnız arena administratorları üçündür."
        />
        <div className="glass-strong mt-10 rounded-3xl p-8 text-center">
          <p className="text-sm text-frost/65">
            Davam etmək üçün admin hesabı ilə daxil olun.
          </p>
          <button
            type="button"
            onClick={() => openAuth('login')}
            className="btn-primary mt-5"
          >
            Admin kimi daxil ol
          </button>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-10 pt-32 sm:px-6">
        <SectionTitle
          eyebrow="Admin"
          title="Ödəniş idarəetməsi"
          description="Bu səhifə yalnız arena administratorları üçündür."
        />
        <div className="glass-strong mt-10 rounded-3xl p-8 text-center">
          <p className="text-sm text-frost/65">
            Hazırkı hesabınızın admin icazəsi yoxdur. Zəhmət olmasa admin
            hesabı ilə daxil olun.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <SectionTitle
        eyebrow="Admin panel"
        title="Ödəniş idarəetməsi"
        description="Demo ödənişləri statusa görə filtr edin, təsdiqləyin və ya uğursuz edin."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-frost/45">
            Gözləyən ödəniş
          </p>
          <p className="mt-2 font-display text-3xl font-black text-amber-200">
            {summary.pending}
          </p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-frost/45">
            Uğurlu ödəniş
          </p>
          <p className="mt-2 font-display text-3xl font-black text-emerald-200">
            {summary.successful}
          </p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-frost/45">
            Uğurlu məbləğ
          </p>
          <p className="mt-2 font-display text-3xl font-black text-white">
            {formatTotal(summary.total)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
          {FILTERS.map((item) => (
            <button
              key={item.value || 'all'}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                filter === item.value
                  ? 'bg-gradient-to-br from-ice-300 to-ice-600 text-night-900'
                  : 'text-frost/60 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="btn-ghost !px-4 !py-2 text-xs uppercase disabled:opacity-50"
        >
          {loading ? 'Yüklənir…' : 'Yenilə'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-frost/45">
        Demo gateway: normal istifadəçi kartla ödəyəndə ödəniş avtomatik
        SUCCESS olur. Bu panel həmin ödənişləri izləmək və statusu dəyişmək
        üçündür.
      </p>

      {loading && payments.length === 0 ? (
        <div className="glass mt-6 rounded-3xl p-10 text-center">
          <p className="text-sm font-semibold text-frost/60">
            Ödənişlər yüklənir…
          </p>
        </div>
      ) : visiblePayments.length === 0 ? (
        <div className="glass mt-6 rounded-3xl p-10 text-center">
          <p className="text-sm font-semibold text-frost/60">
            Bu filtr üzrə ödəniş tapılmadı.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {visiblePayments.map((payment) => {
            const meta = STATUS_META[payment.status] || STATUS_META.PENDING
            const isBusy = busyId === payment.transactionId
            return (
              <article
                key={payment.transactionId}
                className="glass-strong rounded-3xl p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-frost/40">
                      {payment.reference || 'Booking payment'}
                    </p>
                    <p className="mt-1 font-display text-2xl font-black text-white">
                      {formatPrice(Number(payment.amount || 0))}
                    </p>
                  </div>
                  <span
                    className={`chip border !py-1 text-[10px] uppercase ${meta.chip}`}
                  >
                    {meta.label}
                  </span>
                </div>

                <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-frost/40">İstifadəçi</dt>
                    <dd className="font-semibold text-white">
                      {payment.username || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-frost/40">Tarix</dt>
                    <dd className="font-semibold text-white">
                      {formatDateTime(payment.paymentDate)}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-frost/40">Transaction ID</dt>
                    <dd className="break-all font-mono text-[11px] text-ice-200">
                      {payment.transactionId}
                    </dd>
                  </div>
                  {payment.ticketId && (
                    <div>
                      <dt className="text-frost/40">Bilet ID</dt>
                      <dd className="font-semibold text-white">
                        #{payment.ticketId}
                      </dd>
                    </div>
                  )}
                  {payment.skateRentalId && (
                    <div>
                      <dt className="text-frost/40">Konki rezervasiyası</dt>
                      <dd className="font-semibold text-white">
                        #{payment.skateRentalId}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  {payment.status !== 'SUCCESS' && (
                    <button
                      type="button"
                      onClick={() => changeStatus(payment, 'SUCCESS')}
                      disabled={isBusy}
                      className="btn-primary !px-4 !py-2 text-xs uppercase disabled:opacity-50"
                    >
                      {isBusy ? '…' : 'Təsdiqlə'}
                    </button>
                  )}
                  {payment.status !== 'FAILED' && (
                    <button
                      type="button"
                      onClick={() => changeStatus(payment, 'FAILED')}
                      disabled={isBusy}
                      className="rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase text-red-200 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      {isBusy ? '…' : 'Uğursuz et'}
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
