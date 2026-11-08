export default function StatCard({ label, value, hint, tone = 'ice', icon }) {
  const tones = {
    ice: 'from-ice-400/20 to-ice-500/5 text-ice-100 border-ice-300/25',
    green: 'from-emerald-400/20 to-emerald-500/5 text-emerald-100 border-emerald-300/25',
    amber: 'from-amber-400/20 to-amber-500/5 text-amber-100 border-amber-300/25',
    red: 'from-red-400/20 to-red-500/5 text-red-100 border-red-300/25',
    violet: 'from-violet-400/20 to-violet-500/5 text-violet-100 border-violet-300/25',
  }
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 ${tones[tone] || tones.ice}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
          {label}
        </p>
        {icon && (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-sm">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-black text-white sm:text-3xl">
        {value}
      </p>
      {hint && <p className="mt-2 text-xs leading-relaxed text-white/45">{hint}</p>}
    </div>
  )
}
