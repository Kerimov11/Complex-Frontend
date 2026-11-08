import { addDaysISO, todayISO } from '../../utils/datetime'

export default function ShiftDateFilter({ value, onChange, label = 'Tarix' }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
        {label}
      </span>
      <input
        type="date"
        value={value}
        min={todayISO()}
        max={addDaysISO(13)}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none focus:border-ice-300/50"
      />
    </label>
  )
}
