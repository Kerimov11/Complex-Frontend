import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import StatCard from '../../components/admin/StatCard'
import { formatDateTime, formatMoney, formatNumber, todayISO } from '../../components/admin/formatters'
import { api } from '../../api/client'
import { cashierApi } from '../../services/api/cashierApi'

export default function CashierPosPage() {
  const [date, setDate] = useState(todayISO())
  const [sessions, setSessions] = useState([])
  const [sessionId, setSessionId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [duration, setDuration] = useState(60)
  const [method, setMethod] = useState('CASH')
  const [customerName, setCustomerName] = useState('')
  const [report, setReport] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selling, setSelling] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [sessionData, reportData] = await Promise.all([
        api.getSessionsByDate(date),
        cashierApi.report(date),
      ])
      const list = Array.isArray(sessionData) ? sessionData : []
      setSessions(list)
      setReport(reportData)
      setSessionId((current) => {
        if (current && list.some((item) => String(item.id) === String(current))) {
          return current
        }
        const firstOpen = list.find((item) => !item.blocked && item.salesOpen)
        return firstOpen ? String(firstOpen.id) : ''
      })
    } catch (err) {
      setError(err?.message || 'POS məlumatları yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    load()
  }, [load])

  const selectedSession = useMemo(
    () => sessions.find((item) => String(item.id) === String(sessionId)),
    [sessions, sessionId]
  )

  async function submitSale(event) {
    event.preventDefault()
    if (!sessionId) {
      setError('Sessiya seçin.')
      return
    }
    setSelling(true)
    setError('')
    setSuccess('')
    try {
      const result = await cashierApi.sell({
        sessionId: Number(sessionId),
        quantity: Number(quantity),
        durationMinutes: Number(duration),
        paymentMethod: method,
        customerName: customerName || null,
      })
      setReceipt(result)
      setSuccess(`${result.quantity} bilet satıldı. Yekun: ${formatMoney(result.totalAmount)}`)
      setCustomerName('')
      setQuantity(1)
      await load()
    } catch (err) {
      setError(err?.message || 'POS satışı alınmadı.')
    } finally {
      setSelling(false)
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Kassir POS"
        title="Yerində bilet satışı"
        description="Nağd və ya kart ödənişi ilə daxili bilet satışı, gün sonu kassasiya hesabatı."
        actions={
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none focus:border-ice-300/50"
          />
        }
      />

      {error && <div className="mb-3"><AdminNotice tone="error">{error}</AdminNotice></div>}
      {success && <div className="mb-3"><AdminNotice tone="success">{success}</AdminNotice></div>}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Kassa yekunu"
          value={formatMoney(report?.totalAmount)}
          hint={`${formatNumber(report?.transactionCount)} əməliyyat`}
          tone="green"
        />
        <StatCard
          label="Nağd"
          value={formatMoney(report?.cashTotal)}
          hint="Gün sonu kassa"
          tone="amber"
        />
        <StatCard
          label="Kart"
          value={formatMoney(report?.cardTotal)}
          hint={`${formatNumber(report?.ticketCount)} bilet`}
          tone="ice"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.15fr]">
        <form onSubmit={submitSale} className="glass rounded-xl p-5">
          <h3 className="font-display text-lg font-bold text-white">Yeni satış</h3>
          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Sessiya
              </span>
              <select
                value={sessionId}
                onChange={(event) => setSessionId(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
              >
                <option value="">Sessiya seçin</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {String(session.startTime).slice(0, 5)}–{String(session.endTime).slice(0, 5)}
                    {session.blocked ? ' (blok)' : ` · qalıq ${session.availableTickets}`}
                  </option>
                ))}
              </select>
            </label>

            {selectedSession && (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-frost/55">
                <p>
                  Qalıq bilet: <span className="font-bold text-white">{selectedSession.availableTickets}</span>
                </p>
                <p className="mt-1">
                  Sessiya vaxtı: {String(selectedSession.startTime).slice(0, 5)}–
                  {String(selectedSession.endTime).slice(0, 5)}
                </p>
                {selectedSession.blocked && (
                  <p className="mt-2 font-bold text-red-200">Bu sessiya bloklanıb.</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                  Bilet sayı
                </span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                  Müddət
                </span>
                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
                >
                  <option value={30}>30 dəqiqə</option>
                  <option value={60}>60 dəqiqə</option>
                </select>
              </label>
            </div>

            <div>
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Ödəniş üsulu
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['CASH', 'Nağd'],
                  ['CARD', 'Kart'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMethod(value)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${
                      method === value
                        ? 'border-ice-300/40 bg-ice-400/15 text-ice-100'
                        : 'border-white/10 bg-white/5 text-frost/45'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Müştəri adı (istəyə bağlı)
              </span>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Ad, soyad"
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none placeholder:text-frost/30 focus:border-ice-300/50"
              />
            </label>

            <button
              type="submit"
              disabled={selling || loading || !sessionId}
              className="btn-primary w-full !px-5 !py-3 text-sm disabled:opacity-50"
            >
              {selling ? 'Satış aparılır...' : 'Satışı tamamla'}
            </button>
          </div>
        </form>

        <div className="space-y-5">
          {receipt && (
            <div className="glass-strong rounded-xl p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-bold text-white">Satış qəbzi</h3>
                <span className="chip chip-ice">{receipt.saleReference}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-white/[0.04] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-frost/35">Yekun</p>
                  <p className="mt-1 font-display text-xl font-bold text-emerald-200">
                    {formatMoney(receipt.totalAmount)}
                  </p>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-frost/35">Ödəniş</p>
                  <p className="mt-1 font-display text-xl font-bold text-white">
                    {receipt.paymentMethod === 'CASH' ? 'Nağd' : 'Kart'}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-frost/50">
                {formatDateTime(receipt.soldAt)} · {receipt.quantity} bilet · {receipt.cashierUsername}
              </p>
              <div className="mt-3 max-h-44 space-y-2 overflow-y-auto pr-1">
                {(receipt.tickets || []).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-white/10 bg-night-900/50 px-3 py-2 font-mono text-xs text-ice-200"
                  >
                    {ticket.ticketCode}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass overflow-hidden rounded-xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
              <h3 className="font-display text-lg font-bold text-white">Gün sonu hesabatı</h3>
              <span className="chip">{formatNumber(report?.ticketCount)} bilet</span>
            </div>
            <div className="max-h-[28rem] divide-y divide-white/[0.06] overflow-y-auto">
              {(report?.sales || []).length === 0 && (
                <p className="p-6 text-sm text-frost/45">Bu gün üçün POS satışı yoxdur.</p>
              )}
              {(report?.sales || []).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {sale.reference || sale.transactionId}
                    </p>
                    <p className="mt-1 text-[11px] text-frost/45">
                      {formatDateTime(sale.paymentDate)} · {sale.quantity || 0} bilet
                      {sale.customerName ? ` · ${sale.customerName}` : ''}
                    </p>
                    {sale.cashierUsername && (
                      <p className="text-[10px] text-frost/30">Kassir: {sale.cashierUsername}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold text-emerald-200">
                      {formatMoney(sale.amount)}
                    </p>
                    <p className="text-[10px] font-bold text-frost/35">
                      {sale.paymentMethod === 'CASH' ? 'Nağd' : 'Kart'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
