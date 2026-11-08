const STATUS_META = {
  UPCOMING: {
    label: 'Gözlənilir',
    className: 'border-ice-300/25 bg-ice-400/10 text-ice-100',
  },
  ON_DUTY: {
    label: 'Növbədə',
    className: 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100',
  },
  COMPLETED: {
    label: 'Tamamlandı',
    className: 'border-white/10 bg-white/5 text-frost/50',
  },
  UNKNOWN: {
    label: 'Naməlum',
    className: 'border-white/10 bg-white/5 text-frost/50',
  },
}

export default function ShiftStatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.UNKNOWN
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${meta.className}`}
    >
      {meta.label}
    </span>
  )
}
