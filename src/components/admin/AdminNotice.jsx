export default function AdminNotice({ tone = 'info', title, children }) {
  const tones = {
    info: 'border-ice-300/25 bg-ice-400/10 text-ice-100',
    success: 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100',
    error: 'border-red-300/25 bg-red-400/10 text-red-100',
    warning: 'border-amber-300/25 bg-amber-400/10 text-amber-100',
  }
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${tones[tone] || tones.info}`}>
      {title && <p className="font-bold">{title}</p>}
      {children && <div className={title ? 'mt-1 opacity-80' : 'opacity-80'}>{children}</div>}
    </div>
  )
}
