export default function StatCard({ label, value, hint, tone = 'ice', icon }) {
  const tones = {
    ice: 'border-l-ice-400',
    green: 'border-l-emerald-400',
    amber: 'border-l-amber-400',
    red: 'border-l-red-400',
    violet: 'border-l-violet-400',
  }
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-l-4 border-white/[0.08] bg-night-800 p-3 sm:p-5 ${tones[tone] || tones.ice}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/55">
          {label}
        </p>
      </div>
      <p className="mt-1.5 sm:mt-3 font-display text-lg sm:text-2xl font-bold text-white xl:text-3xl">
        {value}
      </p>
      {hint && (
        <p className="mt-1 sm:mt-2 truncate text-[10px] sm:text-xs leading-relaxed text-white/45">
          {hint}
        </p>
      )}
    </div>
  )
}
