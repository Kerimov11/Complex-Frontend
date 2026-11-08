import { formatDateTime, formatMoney } from './formatters'

const STATUS_META = {
  PENDING: { label: 'Gözləyir', className: 'border-amber-300/30 bg-amber-400/10 text-amber-200' },
  SUCCESS: {
    label: 'Uğurlu',
    className: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200',
  },
  FAILED: { label: 'Uğursuz', className: 'border-red-300/30 bg-red-400/10 text-red-200' },
}

export default function PaymentCard({ payment, busy, onChange }) {
  const meta = STATUS_META[payment.status] || STATUS_META.PENDING
  return (
    <article className="glass-strong rounded-3xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-frost/40">
            {payment.reference || payment.transactionId}
          </p>
          <p className="mt-1 font-display text-2xl font-black text-white">
            {formatMoney(payment.amount)}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-frost/55">
              {payment.channel === 'POS' ? 'POS' : 'Onlayn'}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-frost/55">
              {payment.paymentMethod === 'CASH'
                ? 'Nağd'
                : payment.paymentMethod === 'CARD'
                  ? 'Kart'
                  : 'Gateway'}
            </span>
          </div>
        </div>
        <span className={`chip border !py-1 text-[10px] uppercase ${meta.className}`}>
          {meta.label}
        </span>
      </div>

      <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
        <Info label="İstifadəçi" value={payment.username || '—'} />
        <Info label="Tarix" value={formatDateTime(payment.paymentDate)} />
        <Info label="Müştəri" value={payment.customerName || '—'} />
        <Info label="Kassir" value={payment.cashierUsername || '—'} />
        <div className="sm:col-span-2">
          <dt className="text-frost/40">Transaction ID</dt>
          <dd className="break-all font-mono text-[11px] text-ice-200">
            {payment.transactionId}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
        {payment.status !== 'SUCCESS' && (
          <button
            type="button"
            onClick={() => onChange(payment, 'SUCCESS')}
            disabled={busy}
            className="btn-primary !px-4 !py-2 text-xs uppercase disabled:opacity-50"
          >
            {busy ? '…' : 'Təsdiqlə'}
          </button>
        )}
        {payment.status !== 'FAILED' && (
          <button
            type="button"
            onClick={() => onChange(payment, 'FAILED')}
            disabled={busy}
            className="rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase text-red-200 transition-colors hover:bg-red-500/20 disabled:opacity-50"
          >
            {busy ? '…' : 'Uğursuz et'}
          </button>
        )}
      </div>
    </article>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-frost/40">{label}</dt>
      <dd className="font-semibold text-white">{value}</dd>
    </div>
  )
}
