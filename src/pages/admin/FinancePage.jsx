import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import PaymentCard from '../../components/admin/PaymentCard'
import StatCard from '../../components/admin/StatCard'
import { formatMoney, formatNumber } from '../../components/admin/formatters'
import { adminApi } from '../../services/api/adminApi'

const FILTERS = [
  { value: '', label: 'Hamısı' },
  { value: 'PENDING', label: 'Gözləyən' },
  { value: 'SUCCESS', label: 'Uğurlu' },
  { value: 'FAILED', label: 'Uğursuz' },
]

export default function FinancePage() {
  const [payments, setPayments] = useState([])
  const [filter, setFilter] = useState('')
  const [channel, setChannel] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setPayments((await adminApi.getPayments()) || [])
    } catch (err) {
      setError(err?.message || 'Ödənişlər yüklənmədi.')
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const summary = useMemo(() => {
    const successful = payments.filter((payment) => payment.status === 'SUCCESS')
    const online = successful.filter((payment) => payment.channel !== 'POS')
    return {
      pending: payments.filter((payment) => payment.status === 'PENDING').length,
      successful: successful.length,
      total: successful.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      online: online.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      pos: successful
        .filter((payment) => payment.channel === 'POS')
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    }
  }, [payments])

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return payments.filter((payment) => {
      if (filter && payment.status !== filter) return false
      if (channel && (payment.channel || 'ONLINE') !== channel) return false
      if (!needle) return true
      return [payment.reference, payment.transactionId, payment.username, payment.customerName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle))
    })
  }, [channel, filter, payments, search])

  async function changeStatus(payment, status) {
    if (busyId) return
    setBusyId(payment.transactionId)
    setError('')
    try {
      const updated = await adminApi.processPayment(payment.transactionId, status)
      setPayments((prev) =>
        prev.map((item) => (item.transactionId === updated.transactionId ? updated : item))
      )
    } catch (err) {
      setError(err?.message || 'Ödəniş statusu dəyişdirilmədi.')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Maliyyə və audit"
        title="Ödəniş monitorinqi"
        description="Onlayn gateway və kassir POS tranzaksiyalarını izləyin, statusları idarə edin."
        actions={
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="btn-ghost !px-5 !py-2.5 text-sm disabled:opacity-50"
          >
            {loading ? 'Yüklənir...' : 'Yenilə'}
          </button>
        }
      />

      {error && <div className="mb-3"><AdminNotice tone="error">{error}</AdminNotice></div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Gözləyən"
          value={formatNumber(summary.pending)}
          hint="Manual yoxlama"
          tone={summary.pending > 0 ? 'amber' : 'green'}
        />
        <StatCard
          label="Uğurlu ödəniş"
          value={formatNumber(summary.successful)}
          hint="Ümumi tranzaksiya"
          tone="green"
        />
        <StatCard
          label="Onlayn gəlir"
          value={formatMoney(summary.online)}
          hint="Gateway"
          tone="ice"
        />
        <StatCard
          label="Kassir gəliri"
          value={formatMoney(summary.pos)}
          hint="POS"
          tone="violet"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={channel}
            onChange={(event) => setChannel(event.target.value)}
            className="rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none focus:border-ice-300/50"
          >
            <option value="">Bütün kanallar</option>
            <option value="ONLINE">Onlayn</option>
            <option value="POS">POS</option>
          </select>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Referans, istifadəçi..."
            className="rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-frost/30 focus:border-ice-300/50"
          />
        </div>
      </div>

      {loading && payments.length === 0 ? (
        <div className="glass mt-5 rounded-3xl p-10 text-center text-sm text-frost/45">
          Ödənişlər yüklənir...
        </div>
      ) : visible.length === 0 ? (
        <div className="glass mt-5 rounded-3xl p-10 text-center text-sm text-frost/45">
          Bu filtr üzrə ödəniş tapılmadı.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {visible.map((payment) => (
            <PaymentCard
              key={payment.transactionId}
              payment={payment}
              busy={busyId === payment.transactionId}
              onChange={changeStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}
