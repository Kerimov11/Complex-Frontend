import { STATIONS } from './stations'

export default function StationSelect({
  value,
  onChange,
  disabled = false,
  placeholder = 'Stansiya seç',
  className = '',
}) {
  return (
    <select
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className={`rounded-xl border border-white/10 bg-night-900/80 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-ice-300/50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <option value="">{placeholder}</option>
      {STATIONS.map((station) => (
        <option key={station.value} value={station.value}>
          {station.label}
        </option>
      ))}
    </select>
  )
}
