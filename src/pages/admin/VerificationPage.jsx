import { useRef, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import QrCameraScanner from '../../components/admin/QrCameraScanner'
import QrCode from '../../components/booking/QrCode'
import { formatDate, formatDateTime, formatMoney } from '../../components/admin/formatters'
import { verificationApi } from '../../services/api/verificationApi'
import { useAuth } from '../../auth/AuthContext'

const PAYMENT_LABELS = {
  CASH: 'Nağd',
  CARD: 'Kart',
  ONLINE: 'Onlayn',
  FREE: 'Pulsuz',
}

const TICKET_TYPE_LABELS = {
  BIG: 'Böyük bilet',
  CHILD: 'Uşaq bileti',
  ONLINE: 'Onlayn bilet',
}

function paymentLabel(value) {
  return value ? PAYMENT_LABELS[value] || value : '—'
}

function ticketTypeLabel(value) {
  return value ? TICKET_TYPE_LABELS[value] || value : '—'
}

function durationLabel(minutes) {
  const value = Number(minutes) || 0
  if (!value) return '—'
  if (value === 60) return '1 saat (60 dəq)'
  if (value === 30) return 'Yarım saat (30 dəq)'
  return `${value} dəq`
}

function remainingLabel(minutes) {
  const value = Number(minutes) || 0
  if (value <= 0) return 'vaxt bitib'
  if (value < 60) return `${value} dəq qalıb`
  const hours = Math.floor(value / 60)
  const rest = value % 60
  return rest ? `${hours} saat ${rest} dəq qalıb` : `${hours} saat qalıb`
}

function clockTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 5)
  return date.toLocaleTimeString('az-AZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const STATUS_META = {
  CHECKED_IN: { tone: 'success', label: 'Təsdiqləndi — Buza buraxın' },
  HANDED_OUT: { tone: 'success', label: 'Konki təhvil verildi' },
  VALID: { tone: 'success', label: 'Kassada təsdiqləndi' },
  ALREADY_USED: { tone: 'error', label: 'Bu QR bilet artıq istifadə olunub' },
  ALREADY_CASHIER_VERIFIED: { tone: 'warning', label: 'Bilet artıq kassada təsdiqlənib' },
  ALREADY_HANDED_OUT: { tone: 'warning', label: 'Konki artıq təhvil verilib' },
  NOT_CHECKED_IN: { tone: 'warning', label: 'Əvvəlcə Kassa QR və ya Turniketdə skan edin' },
  PAYMENT_PENDING: { tone: 'warning', label: 'Ödəniş gözləyir' },
  CANCELLED: { tone: 'error', label: 'Ləğv edilib' },
  EXPIRED: { tone: 'error', label: 'Vaxtı keçib' },
  OUT_OF_STOCK: { tone: 'error', label: 'Stok yoxdur' },
  NOT_FOUND: { tone: 'error', label: 'Tapılmadı' },
}

function timeLabel(value) {
  return value ? String(value).slice(0, 5) : '—'
}

export default function VerificationPage({ mode = 'turnstile' }) {
  const { isAdmin, isCoordinator, isCashier, isVolunteer } = useAuth()
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [handoverBusy, setHandoverBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const inputRef = useRef(null)
  const isCashierMode = mode === 'cashier'

  const canHandover = isAdmin || isCoordinator || isCashier || isVolunteer

  async function scan(value) {
    const next = String(value || code || '').trim()
    if (!next) {
      setError('QR və ya bilet kodu daxil edin.')
      return
    }
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const data = isCashierMode
        ? await verificationApi.lookup(next)
        : await verificationApi.scan(next)
      setResult(data)
      setHistory((prev) => [data, ...prev].slice(0, 8))
      setCode('')
      inputRef.current?.focus()
    } catch (err) {
      setError(err?.message || 'Doğrulama alınmadı.')
    } finally {
      setLoading(false)
    }
  }

  async function handover() {
    if (!result?.code || handoverBusy) return
    setHandoverBusy(true)
    setError('')
    setNotice('')
    try {
      const data = await verificationApi.handover(result.code)
      setResult(data)
      setHistory((prev) => [data, ...prev].slice(0, 8))
      if (data?.valid) {
        setNotice(data.message || 'Konki təhvil verildi və stokdan çıxıldı.')
      } else {
        setError(data?.message || 'Konki təhvil verilə bilmədi.')
      }
    } catch (err) {
      setError(err?.message || 'Konki təhvil verilə bilmədi.')
    } finally {
      setHandoverBusy(false)
    }
  }

  function onSubmit(event) {
    event.preventDefault()
    scan(code)
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow={isCashierMode ? 'Kassa QR yoxlanışı' : 'Turniket QR nəzarəti'}
        title={isCashierMode ? 'Kassa QR skan' : 'Turniket QR skan'}
        description={
          isCashierMode
            ? 'Müştəri biletindəki QR kodu açır, kassadakı əməkdaş və ya könüllü burada skan edir. Bilet hələ təsdiqlənməyibsə biletin şəkli, neçə nəfərlik olduğu, seçilmiş konki razmerləri və bütün bilet məlumatları açılır.'
            : 'Müştəri buza daxil olarkən QR kod burada skan edilir. Bilet təsdiqlənməyibsə dərhal təsdiqlənir, müştəri buza buraxılır və “Buzdakı müştərilər” siyahısına düşür.'
        }
      />

      {error && (
        <div className="mb-3">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}
      {notice && (
        <div className="mb-3">
          <AdminNotice tone="success">{notice}</AdminNotice>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="glass rounded-xl p-5">
          <form onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Bilet / QR kodu skan edin
              </span>
              <input
                ref={inputRef}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Məsələn: SAV-ABC-1234 və ya POS-XXXXXXXXXXXX"
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-night-900/60 px-4 py-3.5 font-mono text-sm text-white outline-none placeholder:text-frost/25 focus:border-ice-300/50"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-3 w-full !px-5 !py-3 text-sm disabled:opacity-50"
            >
              {loading
                ? 'QR yoxlanılır...'
                : isCashierMode
                  ? 'QR kodu skan et və bileti aç'
                  : 'QR kodu skan et və təsdiqlə'}
            </button>
          </form>

          <div className="mt-4">
            <QrCameraScanner onDetected={(value) => scan(value)} />
          </div>

          <p className="mt-4 rounded-lg border border-amber-300/20 bg-amber-400/[0.06] px-3 py-2.5 text-[11px] leading-relaxed text-amber-100/75">
            {isCashierMode
              ? 'Kassa QR bölməsi bileti yoxlayır və şəklini açır.'
              : 'Hər bilet yalnız bir dəfə təsdiqlənir.'}
          </p>
        </div>

        <div className="space-y-5">
          {result ? (
            <ScannedTicket
              result={result}
              mode={mode}
              canHandover={canHandover}
              busy={handoverBusy}
              onHandover={handover}
            />
          ) : (
            <div className="glass rounded-xl p-8 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-white/5 text-2xl text-ice-200">
                ⌁
              </span>
              <p className="mt-4 font-display text-base font-bold text-white">
                {isCashierMode ? 'Kassa QR skan gözləyir' : 'Turniket QR skan gözləyir'}
              </p>
              <p className="mt-1 text-sm text-frost/45">
                Müştərinin biletindəki QR kodu skan edin — biletin şəkli və bütün detalları burada açılacaq.
              </p>
            </div>
          )}

          {history.length > 0 && (
            <div className="glass overflow-hidden rounded-xl">
              <div className="border-b border-white/10 p-4">
                <h3 className="font-display text-lg font-bold text-white">Son skanlar</h3>
              </div>
              <div className="max-h-64 divide-y divide-white/[0.06] overflow-y-auto">
                {history.map((item, index) => {
                  const statusMeta = STATUS_META[item.status] || STATUS_META.NOT_FOUND
                  return (
                    <div
                      key={`${item.code}-${item.status}-${index}`}
                      className="flex items-center justify-between gap-3 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs text-white">
                          {item.ticketCode || item.code}
                        </p>
                        <p className="mt-0.5 text-[10px] text-frost/45">
                          {item.ownerName || item.ownerUsername || '—'}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold ${
                          statusMeta.tone === 'success'
                            ? 'bg-emerald-400/15 text-emerald-200'
                            : statusMeta.tone === 'warning'
                              ? 'bg-amber-400/15 text-amber-200'
                              : 'bg-red-400/15 text-red-200'
                        }`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ScannedTicket({ result, mode = 'turnstile', canHandover, busy, onHandover }) {
  const meta = STATUS_META[result.status] || STATUS_META.NOT_FOUND
  const participants = Array.isArray(result.participants) ? result.participants : []
  const sizes = Array.isArray(result.skateSizes) ? result.skateSizes : []
  const isReservation = result.source === 'RESERVATION'
  const isCashierMode = mode === 'cashier'
  const isAlreadyUsed = result.status === 'ALREADY_USED'
  const isNotFound = result.status === 'NOT_FOUND'
  const isCheckedInNow = result.status === 'CHECKED_IN' || result.status === 'HANDED_OUT'
  const isUnconfirmedValid = result.status === 'VALID'
  const participantCount = result.participantCount || participants.length || 1
  const ticketCode = result.ticketCode || result.code || '—'

  const showHandover =
    isReservation &&
    canHandover &&
    result.canHandover &&
    !result.skateHandedOut
  const handedOut = result.status === 'HANDED_OUT' || result.skateHandedOut

  if (isNotFound) {
    return (
      <div className="overflow-hidden rounded-xl border border-red-400/30 bg-red-500/10 p-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-400/20 text-2xl font-bold text-red-200">
          ✕
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-white">
          Bilet tapılmadı
        </h3>
        <p className="mt-1 font-mono text-xs text-red-200/80">{ticketCode}</p>
        <p className="mt-2 text-sm text-red-100/80">
          {result.message || 'Bu QR koda uyğun bilet tapılmadı.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Status Banner: Əvvəl təsdiqlənibsə həm Turniketdə, həm də Kassa QR-da "Bu QR bilet istifadə olunub" çıxır */}
      {isAlreadyUsed && (
        <div className="rounded-xl border-2 border-red-400/45 bg-red-500/15 p-5 shadow-lg">
          <div className="flex items-start gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-500/25 text-xl font-bold text-red-100">
              !
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-200">
                {isCashierMode ? 'Kassa QR xəbərdarlığı' : 'Turniket xəbərdarlığı'}
              </p>
              <h3 className="mt-0.5 font-display text-2xl font-bold text-white">
                Bu QR bilet istifadə olunub
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-red-100/85">
                Bu bilet daha əvvəl Turniketdə skan edilərək təsdiqlənib. Eyni QR bilet ikinci dəfə təsdiqlənə bilməz.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {result.checkedInAt && (
                  <span className="rounded-lg border border-red-300/30 bg-night-950/60 px-3 py-1.5 font-semibold text-red-100">
                    Buza giriş saatı: <b className="font-mono">{clockTime(result.checkedInAt)}</b> ({formatDateTime(result.checkedInAt)})
                  </span>
                )}
                {result.endsAt && (
                  <span className="rounded-lg border border-red-300/30 bg-night-950/60 px-3 py-1.5 font-semibold text-red-100">
                    Buzdan çıxış saatı: <b className="font-mono">{clockTime(result.endsAt)}</b>
                  </span>
                )}
                {result.checkedInBy && (
                  <span className="rounded-lg border border-red-300/30 bg-night-950/60 px-3 py-1.5 text-red-100/80">
                    Təsdiqləyən: <b>{result.checkedInBy}</b>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Turniketdə ilk dəfə təsdiqlənəndə */}
      {!isCashierMode && isCheckedInNow && (
        <div className="rounded-xl border-2 border-emerald-400/40 bg-emerald-500/15 p-5 shadow-lg">
          <div className="flex items-start gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-400/25 text-xl font-bold text-emerald-100">
              ✓
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                Turniket giriş təsdiqi
              </p>
              <h3 className="mt-0.5 font-display text-2xl font-bold text-white">
                Bilet təsdiqləndi — Müştərini buza buraxa bilərsiniz
              </h3>
              <p className="mt-1 text-sm text-emerald-100/85">
                Müştəri “Buzdakı müştərilər” siyahısına əlavə olundu ({durationLabel(result.durationMinutes)}).
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg border border-emerald-300/30 bg-night-950/50 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80">
                    Buza daxil olduğu saat
                  </span>
                  <p className="mt-0.5 font-mono text-lg font-bold text-white">
                    {clockTime(result.checkedInAt)}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-300/30 bg-night-950/50 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80">
                    Buzdan çıxmalı olduğu saat
                  </span>
                  <p className="mt-0.5 font-mono text-lg font-bold text-white">
                    {clockTime(result.endsAt)}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-300/30 bg-night-950/50 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80">
                    Aktiv vaxt
                  </span>
                  <p className="mt-0.5 font-display text-lg font-bold text-emerald-200">
                    {remainingLabel(result.minutesRemaining)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kassa QR-da bilet hələ təsdiqlənməyibsə və ya konki təhvil verilibsə */}
      {isCashierMode && (isUnconfirmedValid || handedOut) && (
        <div className="rounded-xl border border-emerald-300/35 bg-emerald-400/10 px-4 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-base font-bold text-emerald-100">
                ✓
              </span>
              <div>
                <p className="text-sm font-bold text-emerald-100">
                  {handedOut
                    ? 'Bilet təsdiqləndi və konki təhvil verildi (stokdan çıxıldı)'
                    : 'Bilet Kassa QR-da təsdiqləndi — Etibarlıdır'}
                </p>
                <p className="text-xs text-emerald-100/75">
                  {handedOut
                    ? 'Müştəriyə konki təhvil verilib və uyğun ölçü stokdan çıxılıb.'
                    : 'Aşağıda seçilmiş konki razmerləri göstərilir. Konkini müştəriyə təhvil verdikdə “Konki təhvil verildi” düyməsini basın (həmin anda stokdan çıxılacaq).'}
                </p>
              </div>
            </div>
            {showHandover && (
              <button
                type="button"
                disabled={busy}
                onClick={onHandover}
                className="btn-primary shrink-0 !px-4 !py-2.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? 'Təhvil qeyd edilir…' : '⛸ Konki təhvil verildi'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Biletin Şəkli (Visual Digital Ticket Card) */}
      <div className="glass-strong overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br from-ice-400/[0.12] via-night-900/85 to-night-950 shadow-2xl">
        {/* Bilet Başlığı */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-white/20 px-6 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ice-300">
              Rəqəmsal bilet / {isReservation ? 'Onlayn sifariş' : 'Kassa (POS) bileti'}
            </p>
            <p className="mt-1 truncate font-display text-2xl font-bold tracking-wider text-white">
              {ticketCode}
            </p>
            <p className="mt-1 text-xs font-medium text-frost/65">
              Müştəri: <b className="text-white">{result.ownerName || result.customerName || 'Naməlum müştəri'}</b>
              {result.ownerUsername ? ` · @${result.ownerUsername}` : ''}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex rounded-md px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide ${
                meta.tone === 'success'
                  ? 'bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-300/40'
                  : meta.tone === 'warning'
                    ? 'bg-amber-400/20 text-amber-100 ring-1 ring-amber-300/40'
                    : 'bg-red-500/25 text-red-100 ring-1 ring-red-400/40'
              }`}
            >
              {meta.label}
            </span>
            <p className="mt-1.5 text-[11px] font-semibold text-frost/50">
              {result.sessionDate ? formatDate(result.sessionDate) : '—'} ·{' '}
              {timeLabel(result.sessionStartTime)} – {timeLabel(result.sessionEndTime)}
            </p>
          </div>
        </div>

        {/* Biletin Şəkli: QR Kod + Əsas Göstəricilər (Neçə nəfərlik, Konki razmerləri, Müddət) */}
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
          <div className="flex shrink-0 flex-col items-center self-center rounded-xl border border-white/15 bg-white p-4 text-night-950 shadow-md sm:self-start">
            <QrCode value={ticketCode} className="h-32 w-32" />
            <span className="mt-2 font-mono text-[11px] font-bold tracking-wider text-night-900">
              {ticketCode}
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            {/* Xüsusi vurğulanan bloklar: Neçə nəfərlik bilet + Seçilmiş konki razmerləri */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-ice-300/30 bg-ice-400/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ice-200">
                  Bilet üzrə nəfər sayı
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  {participantCount} nəfərlik bilet
                </p>
                <p className="mt-0.5 text-xs text-frost/65">
                  Müddət: <b className="text-white">{durationLabel(result.durationMinutes)}</b>
                </p>
              </div>

              <div className="rounded-xl border border-ice-300/30 bg-ice-400/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ice-200">
                  Seçilmiş konki razmerləri
                </p>
                {sizes.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {sizes.map((size, index) => (
                      <span
                        key={`${size}-${index}`}
                        className="rounded-lg bg-ice-400 px-3 py-1 font-display text-sm font-bold text-night-950"
                      >
                        {size} razmer
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-frost/65">
                    {isReservation ? 'Razmer qeyd edilməyib' : 'POS bilet (konki ayrıca seçilir)'}
                  </p>
                )}
              </div>
            </div>

            {/* Bilet haqqında bütün detallar */}
            <div className="grid gap-3 sm:grid-cols-3">
              <TicketInfo
                label="Sessiya tarixi"
                value={result.sessionDate ? formatDate(result.sessionDate) : '—'}
              />
              <TicketInfo
                label="Sessiya saatı"
                value={`${timeLabel(result.sessionStartTime)} – ${timeLabel(result.sessionEndTime)}`}
              />
              <TicketInfo
                label="Bilet müddəti"
                value={durationLabel(result.durationMinutes)}
              />
              <TicketInfo
                label="Ödəniş məbləği"
                value={
                  result.price !== null && result.price !== undefined
                    ? formatMoney(result.price)
                    : 'Pulsuz / —'
                }
              />
              <TicketInfo label="Ödəniş üsulu" value={paymentLabel(result.paymentMethod)} />
              <TicketInfo label="Bilet növü" value={ticketTypeLabel(result.ticketType)} />
            </div>
          </div>
        </div>

        {/* İştirakçılar və konki razmerləri siyahısı */}
        <div className="px-6 pb-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-ice-200">
                İştirakçılar və seçilmiş konki razmerləri ({participantCount} nəfər)
              </p>
              {sizes.length > 0 && (
                <span className="text-xs font-semibold text-frost/60">
                  Razmerlər: <b className="text-white">{sizes.join(', ')}</b>
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2">
              {participants.length > 0 ? (
                participants.map((participant, index) => (
                  <div
                    key={participant.reservationId || `${participant.name}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/5 bg-night-950/50 px-3.5 py-2.5 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-ice-400/20 text-xs font-bold text-ice-200">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-white">
                          {participant.name || result.ownerName || `İştirakçı ${index + 1}`}
                        </p>
                        <p className="text-xs text-frost/50">
                          {participant.age ? `${participant.age} yaş` : 'Yaş qeyd edilməyib'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-ice-300/30 bg-ice-400/15 px-3 py-1 font-mono text-xs font-bold text-ice-100">
                        Konki razmeri: {participant.skateSize || '—'}
                      </span>
                      {participant.skateHandedOut && (
                        <span className="rounded-md bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-200">
                          Təhvil verilib
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-frost/50">İştirakçı məlumatı yoxdur.</p>
              )}
            </div>
          </div>

          {/* Əlavə satış və təsdiq məlumatları */}
          <div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-lg bg-white/[0.04] px-3 py-2.5">
              <span className="text-frost/40">Alınma tarixi və referans</span>
              <p className="mt-0.5 font-semibold text-white">
                {result.purchaseDate ? formatDateTime(result.purchaseDate) : '—'}
              </p>
              {result.saleReference && (
                <p className="mt-0.5 truncate font-mono text-[10px] text-frost/45">
                  Ref: {result.saleReference}
                </p>
              )}
            </div>
            <div className="rounded-lg bg-white/[0.04] px-3 py-2.5">
              <span className="text-frost/40">Turniket təsdiq vəziyyəti</span>
              <p className="mt-0.5 font-semibold text-white">
                {result.checkedInAt
                  ? `Təsdiqlənib (${clockTime(result.checkedInAt)})`
                  : 'Hələ təsdiqlənməyib'}
              </p>
              {result.checkedInBy && (
                <p className="mt-0.5 text-[10px] text-frost/45">
                  Təsdiqləyən: {result.checkedInBy}
                </p>
              )}
            </div>
            <div className="rounded-lg bg-white/[0.04] px-3 py-2.5">
              <span className="text-frost/40">Konki təhvil vəziyyəti</span>
              <p className="mt-0.5 font-semibold text-white">
                {handedOut
                  ? 'Konki təhvil verilib'
                  : result.skateStockDeducted
                    ? 'Stokdan çıxılıb (Təhvil gözləyir)'
                    : 'Təhvil verilməyib'}
              </p>
              {result.skateHandedOutAt && (
                <p className="mt-0.5 text-[10px] text-frost/45">
                  {formatDateTime(result.skateHandedOutAt)}
                  {result.skateHandedOutBy ? ` · ${result.skateHandedOutBy}` : ''}
                </p>
              )}
            </div>
          </div>

          {showHandover && (
            <button
              type="button"
              disabled={busy}
              onClick={onHandover}
              className="btn-primary mt-4 w-full !py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Təhvil qeyd edilir…' : '⛸ Konki təhvil verildi (Stokdan çıx)'}
            </button>
          )}

          {handedOut && (
            <p className="mt-4 rounded-lg border border-emerald-300/25 bg-emerald-400/10 px-3 py-2.5 text-center text-xs font-bold text-emerald-100">
              ✓ Bu bilet üzrə konki təhvil verilib və stokdan çıxılıb.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function TicketInfo({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[10px] uppercase tracking-wide text-frost/40">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}
