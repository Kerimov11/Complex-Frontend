import { secondsToClock } from '../../utils/datetime'

export default function ReservationPanel({
  remaining,
  active,
  needsAttention,
  expired,
  extensionsLeft,
  maxExtensions,
  onExtend,
  extending = false,
  notice = '',
  backend = false,
}) {
  const progress = active
    ? Math.max(0, Math.min(100, (remaining / 600) * 100))
    : 0

  const tone = expired
    ? 'border-red-400/30 bg-red-500/10'
    : needsAttention
      ? 'border-amber-300/30 bg-amber-400/10'
      : 'border-ice-300/30 bg-ice-400/10'

  const colorCls = expired ? 'text-red-200' : needsAttention ? 'text-amber-200' : 'text-white'

  return (
    <div className={`rounded-xl border ${tone} p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className={`font-display text-sm font-bold uppercase tracking-wider ${colorCls}`}>
            {expired
              ? 'Rezervasiya bitdi'
              : needsAttention
                ? 'Vaxt bitdi - yeniləyin'
                : 'Konki rezervasiyası aktivdir'}
          </p>
          <p className={`mt-1 text-xs ${expired ? 'text-red-200/70' : needsAttention ? 'text-amber-100/70' : 'text-frost/60'}`}>
            {active &&
              'Konkilər razmerinizə uyğun hazırlanıb kənara qoyulur. Arenaya yaxınlaşmağınla taymiri yeniləyə bilərsiniz.'}
            {needsAttention &&
              `Taymer bitdi. Yeniləmək üçün ${extensionsLeft} dəfə imkanınız qalır.`}
            {expired &&
              'Konkilər hazırlanmaq üçün tələb ləğv olundu. Yeni rezervasiya üçün bilet səhifəsinə keçin.'}
          </p>
          {backend && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Backend ilə sinxron
            </p>
          )}
        </div>

        <div className="text-right">
          <p className={`font-display text-4xl font-bold tabular-nums sm:text-5xl ${colorCls}`}>
            {active ? secondsToClock(remaining) : '00:00'}
          </p>
          <p className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${expired ? 'text-red-200/60' : needsAttention ? 'text-amber-100/60' : 'text-ice-200/70'}`}>
            mm:ss
          </p>
        </div>
      </div>

      {active && (
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-ice-400 transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {!expired && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className={`text-xs ${needsAttention ? 'text-amber-100/60' : 'text-frost/55'}`}>
            Yeniləmə limiti: {extensionsLeft} / {maxExtensions} qalıb
          </p>
          {active && extensionsLeft > 0 && (
            <button
              type="button"
              onClick={onExtend}
              disabled={extending}
              className={`btn-primary !px-5 !py-2.5 text-xs font-bold uppercase ${
                extending ? 'cursor-wait opacity-60' : ''
              }`}
            >
              {extending ? 'Yenilənir…' : '+10 dəq yenilə'}
            </button>
          )}
          {needsAttention && (
            <button
              type="button"
              onClick={onExtend}
              disabled={extending}
              className={`btn-primary !px-5 !py-2.5 text-xs font-bold uppercase ${
                extending ? 'cursor-wait opacity-60' : ''
              }`}
            >
              {extending ? 'Yenilənir…' : 'Dərhal yenilə'}
            </button>
          )}
        </div>
      )}

      {notice && (
        <p
          className={`mt-4 rounded-xl border px-4 py-2.5 text-xs font-semibold ${
            notice.ok
              ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
              : 'border-amber-300/30 bg-amber-400/10 text-amber-100'
          }`}
        >
          {notice.text}
        </p>
      )}

      {active && extensionsLeft === 0 && (
        <p className="mt-4 text-xs text-frost/50">
          Yeniləmə limiti tükəndi. Rezervasiya vaxtında arenada olun.
        </p>
      )}
    </div>
  )
}