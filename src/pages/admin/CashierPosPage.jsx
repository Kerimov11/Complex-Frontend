import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import StatCard from '../../components/admin/StatCard'
import { formatDateTime, formatMoney, formatNumber, todayISO } from '../../components/admin/formatters'
import { api } from '../../api/client'
import { cashierApi } from '../../services/api/cashierApi'

function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return 'Mobil nömrə daxil edilməlidir.'
  }
  const cleaned = phone.trim()
  const digits = cleaned.replace(/\D/g, '')

  if (digits.length === 12 && digits.startsWith('994')) {
    if (!/^994(10|50|51|55|60|70|71|77|99)\d{7}$/.test(digits)) {
      return 'Mobil nömrə prefiksi yanlışdır (məs: +994 50 123 45 67).'
    }
    return ''
  }
  if (digits.length === 10 && digits.startsWith('0')) {
    if (!/^0(10|50|51|55|60|70|71|77|99)\d{7}$/.test(digits)) {
      return 'Mobil nömrə prefiksi yanlışdır (məs: 050 123 45 67).'
    }
    return ''
  }
  if (digits.length === 9) {
    if (!/^(10|50|51|55|60|70|71|77|99)\d{7}$/.test(digits)) {
      return 'Mobil nömrə prefiksi yanlışdır (məs: 50 123 45 67).'
    }
    return ''
  }
  if (cleaned.startsWith('+') && digits.length >= 10 && digits.length <= 15) {
    return ''
  }
  return 'Mobil nömrə düzgün formatda deyil (məs: +994 50 123 45 67).'
}

function validateFullName(name) {
  if (!name || !name.trim()) {
    return 'Ad və soyad daxil edilməlidir.'
  }
  const parts = name.trim().split(/\s+/)
  if (parts.length < 2 || parts[0].length < 2 || parts[1].length < 2) {
    return 'Həm ad, həm də soyad tam qeyd olunmalıdır (məs: Əli Əliyev).'
  }
  return ''
}

export default function CashierPosPage() {
  const [date, setDate] = useState(todayISO())
  const [sessions, setSessions] = useState([])
  const [sessionId, setSessionId] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [duration, setDuration] = useState(60)
  const [method, setMethod] = useState('CASH')
  const [guestNames, setGuestNames] = useState([''])
  const [fieldErrors, setFieldErrors] = useState({})
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
        return firstOpen ? String(firstOpen.id) : (list[0]?.id ? String(list[0].id) : '')
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

  function handleQuantityChange(val) {
    const qty = Math.max(1, Math.min(50, parseInt(val, 10) || 1))
    setQuantity(qty)
    setGuestNames((prev) => {
      const next = [...prev]
      if (next.length < qty) {
        while (next.length < qty) next.push('')
      } else if (next.length > qty) {
        return next.slice(0, qty)
      }
      return next
    })
  }

  function updateGuestName(index, val) {
    setGuestNames((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
  }

  async function submitSale(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const errors = {}
    const phoneErr = validatePhone(customerPhone)
    if (phoneErr) {
      errors.phone = phoneErr
    }

    const guestErrors = []
    for (let i = 0; i < quantity; i++) {
      const name = guestNames[i] || ''
      const nameErr = validateFullName(name)
      if (nameErr) {
        guestErrors[i] = nameErr
        if (!errors.names) {
          errors.names = quantity > 1
            ? `${i + 1}-ci qonağın ${nameErr.toLowerCase()}`
            : nameErr
        }
      }
    }
    if (guestErrors.some(Boolean)) {
      errors.guestList = guestErrors
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setError(errors.phone || errors.names)
      return
    }

    setFieldErrors({})
    setSelling(true)
    try {
      const primaryName = guestNames[0].trim()
      const filteredNames = guestNames.slice(0, quantity).map((n) => n.trim())
      const result = await cashierApi.sell({
        sessionId: sessionId ? Number(sessionId) : null,
        quantity: Number(quantity),
        durationMinutes: Number(duration),
        paymentMethod: method,
        customerPhone: customerPhone.trim(),
        customerName: primaryName,
        customerNames: filteredNames,
      })
      setReceipt(result)
      setSuccess(`${result.quantity} bilet satıldı. Yekun: ${formatMoney(result.totalAmount)}`)
      setCustomerPhone('')
      setGuestNames([''])
      setQuantity(1)
      setFieldErrors({})
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
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Mobil nömrə
              </span>
              <input
                type="tel"
                value={customerPhone}
                onChange={(event) => {
                  setCustomerPhone(event.target.value)
                  if (fieldErrors.phone) {
                    setFieldErrors((prev) => ({ ...prev, phone: '' }))
                  }
                }}
                placeholder="+994 (__) ___-__-__"
                className={`w-full rounded-xl border bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none placeholder:text-frost/30 transition-colors ${
                  fieldErrors.phone
                    ? 'border-red-500/80 focus:border-red-400'
                    : 'border-white/10 focus:border-ice-300/50'
                }`}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.phone}</p>
              )}
            </label>

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
                  onChange={(event) => handleQuantityChange(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                  Müddət
                </span>
                <select
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
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

            <div className="space-y-2">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                {quantity > 1 ? `Qonaqların ad və soyadı (${quantity} nəfər)` : 'Ad, Soyad'}
              </span>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {guestNames.slice(0, quantity).map((name, index) => {
                  const hasErr = Boolean(fieldErrors.guestList?.[index])
                  return (
                    <div key={index} className="space-y-1">
                      <input
                        value={name}
                        onChange={(event) => {
                          updateGuestName(index, event.target.value)
                          if (fieldErrors.guestList?.[index]) {
                            setFieldErrors((prev) => {
                              const nextList = [...(prev.guestList || [])]
                              nextList[index] = ''
                              return { ...prev, guestList: nextList }
                            })
                          }
                        }}
                        placeholder={quantity > 1 ? `${index + 1}-ci qonaq: Ad, Soyad` : 'Ad, Soyad'}
                        className={`w-full rounded-xl border bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none placeholder:text-frost/30 transition-colors ${
                          hasErr
                            ? 'border-red-500/80 focus:border-red-400'
                            : 'border-white/10 focus:border-ice-300/50'
                        }`}
                      />
                      {hasErr && (
                        <p className="text-[11px] text-red-400">
                          {fieldErrors.guestList[index]}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={selling || loading}
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
                {(receipt.tickets || []).map((ticket, index) => (
                  <div
                    key={ticket.id || index}
                    className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-night-900/50 px-3 py-2 font-mono text-xs text-ice-200"
                  >
                    <span>{ticket.ticketCode}</span>
                    {ticket.customerName && (
                      <span className="font-sans text-[11px] text-frost/70 truncate max-w-[150px]">
                        {ticket.customerName}
                      </span>
                    )}
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
