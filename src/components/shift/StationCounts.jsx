export default function StationCounts({ stations = [], compact = false }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {stations.map((station) => (
        <span
          key={station.station}
          className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] ${
            compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
          } font-semibold text-frost/60`}
        >
          <span className="text-white/80">{station.label || station.station}</span>
          <span className="rounded-full bg-white/10 px-1.5 text-[10px] text-ice-100">
            {station.count}
          </span>
        </span>
      ))}
    </div>
  )
}
