import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { formatDate, formatDateTime } from '../../components/admin/formatters'
import { identityReviewApi } from '../../services/api/identityReviewApi'
import { formatDateAZ } from '../../utils/datetime'

const FILTERS = [
  { key: 'PENDING_REVIEW', label: 'Təsdiq gözləyənlər' },
  { key: 'APPROVED', label: 'Təsdiqlənənlər' },
  { key: 'REJECTED', label: 'Rədd edilənlər' },
  { key: 'ALL', label: 'Hamısı' },
]

function getTodayString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getYesterdayString() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toLocalDateISO(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getItemDateISO(item) {
  const primary =
    item.reviewedAt ||
    item.identityReviewedAt ||
    item.ticket?.purchaseDate ||
    item.identityConfirmedAt
  return toLocalDateISO(primary)
}

const STATUS_BADGE = {
  PENDING_REVIEW: {
    label: 'Gözləyir',
    cls: 'border-amber-300/35 bg-amber-400/15 text-amber-100',
  },
  APPROVED: {
    label: 'Təsdiqlənib',
    cls: 'border-emerald-300/35 bg-emerald-400/15 text-emerald-100',
  },
  REJECTED: {
    label: 'Rədd edilib',
    cls: 'border-red-400/35 bg-red-500/15 text-red-100',
  },
}

export default function IdentityVerificationsPage() {
  const todayStr = useMemo(() => getTodayString(), [])
  const yesterdayStr = useMemo(() => getYesterdayString(), [])
  const [filter, setFilter] = useState('PENDING_REVIEW')
  const [selectedDate, setSelectedDate] = useState(() => getTodayString())
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [rejectReasons, setRejectReasons] = useState({})
  const [zoomPhoto, setZoomPhoto] = useState('')

  const showDateFilter = filter !== 'PENDING_REVIEW'

  const filteredItems = useMemo(() => {
    if (!showDateFilter || !selectedDate || selectedDate === 'ALL_DATES') {
      return items
    }
    return items.filter((item) => getItemDateISO(item) === selectedDate)
  }, [items, showDateFilter, selectedDate])

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate || selectedDate === 'ALL_DATES') return 'Bütün tarixlər'
    if (selectedDate === todayStr) return `Bu gün (${formatDateAZ(todayStr)})`
    if (selectedDate === yesterdayStr) return `Dünən (${formatDateAZ(yesterdayStr)})`
    return formatDateAZ(selectedDate)
  }, [selectedDate, todayStr, yesterdayStr])

  const load = useCallback(
    async (statusKey = filter) => {
      setLoading(true)
      setError('')
      try {
        const data = await identityReviewApi.list(statusKey)
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.message || 'Müraciətlər yüklənə bilmədi.')
      } finally {
        setLoading(false)
      }
    },
    [filter]
  )

  useEffect(() => {
    load(filter)
  }, [filter, load])

  async function handleApprove(item) {
    const isTicket = item.itemType === 'TICKET'
    const key = isTicket ? `ticket-${item.ticketCode}` : `user-${item.userId}`
    setBusyId(key)
    setError('')
    setNotice('')
    try {
      if (isTicket) {
        await identityReviewApi.approveTicket(item.ticketCode)
        setNotice(`Bilet (${item.ticketCode}) uğurla təsdiqləndi.`)
      } else {
        await identityReviewApi.approve(item.userId)
        setNotice('Müştərinin hesab şəxsiyyət təsdiqi uğurla təsdiqləndi.')
      }
      await load(filter)
    } catch (err) {
      setError(err?.message || 'Təsdiqləmə alınmadı.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleReject(item) {
    const isTicket = item.itemType === 'TICKET'
    const key = isTicket ? `ticket-${item.ticketCode}` : `user-${item.userId}`
    setBusyId(key)
    setError('')
    setNotice('')
    try {
      const reason = String(rejectReasons[key] || '').trim()
      const res = isTicket
        ? await identityReviewApi.rejectTicket(item.ticketCode, reason)
        : await identityReviewApi.reject(item.userId, reason)
      setNotice(
        res?.refundedAmount
          ? `Müraciət rədd edildi, bilet ləğv olundu və ${res.refundedAmount} AZN ödəniş müştərinin kartına geri qaytarıldı.`
          : 'Müraciət rədd edildi və müştəriyə yenidən yükləmək üçün bildirildi.'
      )
      await load(filter)
    } catch (err) {
      setError(err?.message || 'Rədd etmə alınmadı.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Kassir nəzarəti"
        title="Bilet və şəxsiyyət təsdiqi"
        description="İlk dəfə bilet alan müştərilərin şəxsiyyət vəsiqəsi (seriya, FİN), foto təsdiqi və bilet məlumatlarını yoxlayıb təsdiqləyin."
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-md px-4 py-2 text-xs font-bold transition-colors ${
                filter === tab.key
                  ? 'bg-ice-400 text-night-950'
                  : 'glass text-frost/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showDateFilter && (
            <>
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-night-900/80 p-1">
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayStr)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    selectedDate === todayStr
                      ? 'bg-ice-400 text-night-950 shadow-sm'
                      : 'text-frost/65 hover:text-white'
                  }`}
                >
                  Bu gün
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(yesterdayStr)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    selectedDate === yesterdayStr
                      ? 'bg-ice-400 text-night-950 shadow-sm'
                      : 'text-frost/65 hover:text-white'
                  }`}
                >
                  Dünən
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate('ALL_DATES')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    selectedDate === 'ALL_DATES'
                      ? 'bg-ice-400 text-night-950 shadow-sm'
                      : 'text-frost/65 hover:text-white'
                  }`}
                >
                  Bütün tarixlər
                </button>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-night-900/80 px-2.5 py-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-frost/45">
                  Tarix:
                </span>
                <input
                  type="date"
                  value={selectedDate === 'ALL_DATES' ? '' : selectedDate}
                  max={todayStr}
                  onChange={(e) => {
                    if (e.target.value) setSelectedDate(e.target.value)
                  }}
                  className="bg-transparent text-xs font-bold text-white outline-none [color-scheme:dark]"
                />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => load(filter)}
            className="btn-ghost !px-4 !py-2 text-xs"
          >
            Yenilə
          </button>
        </div>
      </div>

      {showDateFilter && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ice-300/25 bg-ice-400/10 px-4 py-2.5 text-xs text-ice-100">
          <div>
            <span className="font-bold text-ice-200">📅 Tarix filtri:</span>{' '}
            <b>{selectedDateLabel}</b> üzrə nəticələr göstərilir ({filteredItems.length} müraciət).
          </div>
          {selectedDate !== 'ALL_DATES' && (
            <button
              type="button"
              onClick={() => setSelectedDate('ALL_DATES')}
              className="font-bold text-white underline hover:text-ice-200"
            >
              Bütün tarixləri göstər ({items.length})
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}
      {notice && (
        <div className="mb-4">
          <AdminNotice tone="success">{notice}</AdminNotice>
        </div>
      )}

      {loading ? (
        <div className="glass rounded-xl p-8 text-center text-sm text-frost/60">
          Yüklənir…
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-strong rounded-xl p-10 text-center text-sm text-frost/60">
          <p>
            {showDateFilter && selectedDate !== 'ALL_DATES'
              ? `Seçilmiş tarix (${selectedDateLabel}) üzrə bu kateqoriyada müraciət tapılmadı.`
              : 'Bu kateqoriyada müraciət yoxdur.'}
          </p>
          {showDateFilter && selectedDate !== 'ALL_DATES' && items.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedDate('ALL_DATES')}
              className="btn-ghost mt-4 !px-4 !py-2 text-xs"
            >
              Bütün tarixlərdəki müraciətlərə bax ({items.length})
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredItems.map((item) => {
            const isTicket = item.itemType === 'TICKET'
            const itemKey = isTicket ? `ticket-${item.ticketCode}` : `user-${item.userId}`
            const statusKey = item.reviewStatus || item.identityReviewStatus || 'PENDING_REVIEW'
            const badge = STATUS_BADGE[statusKey] || STATUS_BADGE.PENDING_REVIEW
            const t = item.ticket
            const participantNames = Array.isArray(item.participantNames)
              ? item.participantNames
              : []

            if (isTicket && t) {
              return (
                <article
                  key={itemKey}
                  className="glass-strong flex flex-col gap-4 rounded-xl border border-white/15 p-5"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-base font-bold text-white">
                          {t.ticketCode}
                        </p>
                        {item.discountType && item.discountType !== 'NONE' && (
                          <span className="rounded bg-ice-400/20 px-2 py-0.5 text-[11px] font-bold text-ice-200">
                            {item.discountType}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-frost/65">
                        Hesab sahibi: <b className="text-white">{item.fullName}</b> (@{item.username}
                        {item.phoneNumber ? ` · ${item.phoneNumber}` : ''})
                      </p>
                      {participantNames.length > 0 && (
                        <p className="mt-1 text-xs text-amber-200">
                          Bilet iştirakçıları: <b>{participantNames.join(', ')}</b>
                        </p>
                      )}
                    </div>
                    <span className={`chip shrink-0 border ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                      <span className="text-frost/45">Seans / Müddət</span>
                      <p className="mt-0.5 font-semibold text-white">
                        {t.sessionDate ? formatDate(t.sessionDate) : 'Sərbəst'} · {t.durationMinutes || 60} dəq
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                      <span className="text-frost/45">Nəfər / Konki</span>
                      <p className="mt-0.5 font-semibold text-white">
                        {t.participantCount || 1} nəfər
                        {t.skateSizes?.length ? ` · ${t.skateSizes.join(', ')}` : ''}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                      <span className="text-frost/45">Alınma tarixi</span>
                      <p className="mt-0.5 font-semibold text-white">
                        {t.purchaseDate ? formatDateTime(t.purchaseDate) : '—'}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                      <span className="text-frost/45">Bilet statusu</span>
                      <p className="mt-0.5 font-semibold text-white">
                        {t.status || 'CONFIRMED'}
                      </p>
                    </div>
                  </div>

                  {(t.familyIdsPhotoData ||
                    t.push30ScreenshotData ||
                    t.push30Phone ||
                    t.qaziDocumentPhotoData ||
                    t.qaziFullName ||
                    t.shaheedDocumentPhotoData) && (
                    <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      {t.push30Phone && (
                        <p className="text-xs text-amber-200">
                          <b>PUSH30 nömrəsi:</b>{' '}
                          <span className="font-mono">{t.push30Phone}</span>
                        </p>
                      )}
                      {t.qaziFullName && (
                        <p className="text-xs text-ice-200">
                          <b>Qazi Ad/Soyad:</b> {t.qaziFullName}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {t.familyIdsPhotoData && (
                          <button
                            type="button"
                            onClick={() => setZoomPhoto(t.familyIdsPhotoData)}
                            className="overflow-hidden rounded border border-ice-300/30 bg-night-950 p-1 text-center"
                          >
                            <img
                              src={t.familyIdsPhotoData}
                              alt="Ailə 3 şəxsiyyət vəsiqəsi"
                              className="h-24 w-36 object-cover"
                            />
                            <span className="mt-0.5 block text-[10px] text-ice-200">
                              Ailə (3 vəsiqə)
                            </span>
                          </button>
                        )}
                        {t.push30ScreenshotData && (
                          <button
                            type="button"
                            onClick={() => setZoomPhoto(t.push30ScreenshotData)}
                            className="overflow-hidden rounded border border-amber-300/30 bg-night-950 p-1 text-center"
                          >
                            <img
                              src={t.push30ScreenshotData}
                              alt="PUSH30 Premium"
                              className="h-24 w-36 object-cover"
                            />
                            <span className="mt-0.5 block text-[10px] text-amber-200">
                              PUSH30 Ekran şəkli
                            </span>
                          </button>
                        )}
                        {t.qaziDocumentPhotoData && (
                          <button
                            type="button"
                            onClick={() => setZoomPhoto(t.qaziDocumentPhotoData)}
                            className="overflow-hidden rounded border border-emerald-300/30 bg-night-950 p-1 text-center"
                          >
                            <img
                              src={t.qaziDocumentPhotoData}
                              alt="Qazi sənədi"
                              className="h-24 w-36 object-cover"
                            />
                            <span className="mt-0.5 block text-[10px] text-emerald-200">
                              Qazi sənədi
                            </span>
                          </button>
                        )}
                        {t.shaheedDocumentPhotoData && (
                          <button
                            type="button"
                            onClick={() => setZoomPhoto(t.shaheedDocumentPhotoData)}
                            className="overflow-hidden rounded border border-ice-300/30 bg-night-950 p-1 text-center"
                          >
                            <img
                              src={t.shaheedDocumentPhotoData}
                              alt="Şəhid ailəsi sənədi"
                              className="h-24 w-36 object-cover"
                            />
                            <span className="mt-0.5 block text-[10px] text-ice-200">
                              Şəhid ailəsi sənədi
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {Array.isArray(t.participantPhotos) &&
                    t.participantPhotos.some(
                      (p) => p.identityPhotoData || p.studentCardPhotoData
                    ) && (
                      <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        {t.participantPhotos.map((p, idx) => (
                          <div
                            key={p.reservationId || idx}
                            className="rounded-lg bg-night-900/60 p-2"
                          >
                            <p className="text-[11px] font-semibold text-white">
                              {p.participantName || `İştirakçı #${idx + 1}`}
                              {p.participantAge ? ` (${p.participantAge} yaş)` : ''}
                              {p.skateSize ? ` · Konki ${p.skateSize}` : ''}
                              {p.studentDiscountApplied && (
                                <span className="ml-2 rounded bg-ice-400/20 px-1.5 py-0.5 text-[10px] text-ice-200">
                                  Tələbə
                                </span>
                              )}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-2">
                              {p.identityPhotoData && (
                                <button
                                  type="button"
                                  onClick={() => setZoomPhoto(p.identityPhotoData)}
                                  className="overflow-hidden rounded border border-white/15 bg-night-950 p-1 text-center"
                                >
                                  <img
                                    src={p.identityPhotoData}
                                    alt="Şəxsiyyət fotosu"
                                    className="h-20 w-28 object-cover"
                                  />
                                  <span className="mt-0.5 block text-[10px] text-ice-200">
                                    Şəxsiyyət
                                  </span>
                                </button>
                              )}
                              {p.studentCardPhotoData && (
                                <button
                                  type="button"
                                  onClick={() => setZoomPhoto(p.studentCardPhotoData)}
                                  className="overflow-hidden rounded border border-ice-300/30 bg-night-950 p-1 text-center"
                                >
                                  <img
                                    src={p.studentCardPhotoData}
                                    alt="Tələbə kartı fotosu"
                                    className="h-20 w-28 object-cover"
                                  />
                                  <span className="mt-0.5 block text-[10px] text-ice-200">
                                    Tələbə kartı
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {item.reviewedBy && (
                    <p className="text-[11px] text-frost/55">
                      Yoxlayan: <b>{item.reviewedBy}</b>{' '}
                      {item.reviewedAt ? `(${formatDateTime(item.reviewedAt)})` : ''}
                      {item.reviewReason ? ` · Səbəb: ${item.reviewReason}` : ''}
                    </p>
                  )}

                  <div className="mt-auto space-y-2.5 border-t border-white/10 pt-3">
                    <input
                      type="text"
                      value={rejectReasons[itemKey] || ''}
                      onChange={(e) =>
                        setRejectReasons((prev) => ({
                          ...prev,
                          [itemKey]: e.target.value,
                        }))
                      }
                      placeholder="Rədd səbəbi (istəyə bağlı, məs: sənəd uyğun deyil)"
                      className="w-full rounded-lg border border-white/15 bg-night-900/80 px-3 py-2 text-xs text-white placeholder-frost/35 outline-none focus:border-ice-300/50"
                    />
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        disabled={busyId === itemKey}
                        onClick={() => handleApprove(item)}
                        className="btn-primary flex-1 !py-2.5 text-xs font-bold disabled:opacity-50"
                      >
                        {busyId === itemKey ? 'Gözləyin…' : '✓ Bileti təsdiqlə'}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === itemKey}
                        onClick={() => handleReject(item)}
                        className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-2.5 text-xs font-bold text-red-100 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                      >
                        ✕ Bileti rədd et
                      </button>
                    </div>
                  </div>
                </article>
              )
            }

            const tickets = Array.isArray(item.tickets) ? item.tickets : []
            return (
              <article
                key={itemKey}
                className="glass-strong flex flex-col gap-4 rounded-xl border border-white/15 p-5"
              >
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <p className="font-display text-lg font-bold text-white">
                      {item.fullName}
                    </p>
                    <p className="text-xs text-frost/60">
                      Hesab şəxsiyyət təsdiqi · @{item.username}
                      {item.phoneNumber ? ` · ${item.phoneNumber}` : ''}
                    </p>
                  </div>
                  <span className={`chip shrink-0 border ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                    <span className="text-frost/45">Seriya / Nömrə</span>
                    <p className="mt-0.5 font-mono font-bold text-white">
                      {item.identityDocumentNumber || '—'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                    <span className="text-frost/45">FİN kod</span>
                    <p className="mt-0.5 font-mono font-bold text-white">
                      {item.finCode || '—'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                    <span className="text-frost/45">Doğum tarixi</span>
                    <p className="mt-0.5 font-semibold text-white">
                      {item.dateOfBirth ? formatDate(item.dateOfBirth) : '—'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                    <span className="text-frost/45">Göndərilmə</span>
                    <p className="mt-0.5 font-semibold text-white">
                      {item.identityConfirmedAt
                        ? formatDateTime(item.identityConfirmedAt)
                        : '—'}
                    </p>
                  </div>
                </div>

                {item.identityPhotoData ? (
                  <button
                    type="button"
                    onClick={() => setZoomPhoto(item.identityPhotoData)}
                    className="group relative overflow-hidden rounded-xl border border-white/15 bg-night-950/70 p-2 text-left"
                  >
                    <img
                      src={item.identityPhotoData}
                      alt={`${item.fullName} foto təsdiqi`}
                      className="mx-auto max-h-64 w-full rounded-lg object-contain transition-transform group-hover:scale-[1.01]"
                    />
                    <span className="mt-1.5 block text-center text-[11px] font-semibold text-ice-200">
                      Böyütmək üçün klikləyin
                    </span>
                  </button>
                ) : (
                  <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-frost/55">
                    Şəkil yüklənməyib.
                  </p>
                )}

                {item.identityReviewedBy && (
                  <p className="text-[11px] text-frost/55">
                    Yoxlayan: <b>{item.identityReviewedBy}</b>{' '}
                    {item.identityReviewedAt
                      ? `(${formatDateTime(item.identityReviewedAt)})`
                      : ''}
                    {item.identityRejectionReason
                      ? ` · Səbəb: ${item.identityRejectionReason}`
                      : ''}
                  </p>
                )}

                <div className="mt-auto space-y-2.5 border-t border-white/10 pt-3">
                  <input
                    type="text"
                    value={rejectReasons[itemKey] || ''}
                    onChange={(e) =>
                      setRejectReasons((prev) => ({
                        ...prev,
                        [itemKey]: e.target.value,
                      }))
                    }
                    placeholder="Rədd səbəbi (istəyə bağlı, məs: şəkil bulanıqdır)"
                    className="w-full rounded-lg border border-white/15 bg-night-900/80 px-3 py-2 text-xs text-white placeholder-frost/35 outline-none focus:border-ice-300/50"
                  />
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      disabled={busyId === itemKey}
                      onClick={() => handleApprove(item)}
                      className="btn-primary flex-1 !py-2.5 text-xs font-bold disabled:opacity-50"
                    >
                      {busyId === itemKey ? 'Gözləyin…' : '✓ Hesabı təsdiqlə'}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === itemKey}
                      onClick={() => handleReject(item)}
                      className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-2.5 text-xs font-bold text-red-100 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                    >
                      ✕ Hesabı rədd et
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto('')}
          className="fixed inset-0 z-50 grid place-items-center bg-night-950/85 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-3xl overflow-auto rounded-2xl border border-white/20 bg-night-900 p-3"
          >
            <button
              type="button"
              onClick={() => setZoomPhoto('')}
              className="btn-ghost mb-2 ml-auto block !px-3 !py-1.5 text-xs"
            >
              Bağla ✕
            </button>
            <img
              src={zoomPhoto}
              alt="Böyüdülmüş şəkil"
              className="max-h-[78vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
