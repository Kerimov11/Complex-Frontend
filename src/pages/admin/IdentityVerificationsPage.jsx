import { useCallback, useEffect, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { formatDate, formatDateTime } from '../../components/admin/formatters'
import { identityReviewApi } from '../../services/api/identityReviewApi'

const FILTERS = [
  { key: 'PENDING_REVIEW', label: 'Təsdiq gözləyənlər' },
  { key: 'APPROVED', label: 'Təsdiqlənənlər' },
  { key: 'REJECTED', label: 'Rədd edilənlər' },
  { key: 'ALL', label: 'Hamısı' },
]

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
  const [filter, setFilter] = useState('PENDING_REVIEW')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [rejectReasons, setRejectReasons] = useState({})
  const [zoomPhoto, setZoomPhoto] = useState('')

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

  async function handleApprove(userId) {
    setBusyId(userId)
    setError('')
    setNotice('')
    try {
      await identityReviewApi.approve(userId)
      setNotice('Müştərinin şəxsiyyət və bilet təsdiqi uğurla təsdiqləndi.')
      await load(filter)
    } catch (err) {
      setError(err?.message || 'Təsdiqləmə alınmadı.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleReject(userId) {
    setBusyId(userId)
    setError('')
    setNotice('')
    try {
      const reason = String(rejectReasons[userId] || '').trim()
      await identityReviewApi.reject(userId, reason)
      setNotice('Müraciət rədd edildi və müştəriyə yenidən yükləmək üçün bildirildi.')
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
        <button
          type="button"
          onClick={() => load(filter)}
          className="btn-ghost !px-4 !py-2 text-xs"
        >
          Yenilə
        </button>
      </div>

      <AdminNotice tone="error" message={error} />
      <AdminNotice tone="success" message={notice} />

      {loading ? (
        <div className="glass rounded-xl p-8 text-center text-sm text-frost/60">
          Yüklənir…
        </div>
      ) : items.length === 0 ? (
        <div className="glass-strong rounded-xl p-10 text-center text-sm text-frost/60">
          Bu kateqoriyada müraciət yoxdur.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((item) => {
            const badge =
              STATUS_BADGE[item.identityReviewStatus] || STATUS_BADGE.PENDING_REVIEW
            const tickets = Array.isArray(item.tickets) ? item.tickets : []
            return (
              <article
                key={item.userId}
                className="glass-strong flex flex-col gap-4 rounded-xl border border-white/15 p-5"
              >
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <p className="font-display text-lg font-bold text-white">
                      {item.fullName}
                    </p>
                    <p className="text-xs text-frost/60">
                      @{item.username}
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

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-frost/50">
                    Müştərinin biletləri ({tickets.length})
                  </p>
                  {tickets.length === 0 ? (
                    <p className="mt-1 text-xs text-frost/55">
                      Hələ bilet alınmayıb.
                    </p>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {tickets.map((t) => (
                        <div
                          key={t.ticketCode}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-night-900/70 px-3 py-2 text-xs"
                        >
                          <div>
                            <p className="font-mono font-bold text-white">
                              {t.ticketCode}
                            </p>
                            <p className="text-[11px] text-frost/60">
                              {t.sessionDate ? formatDate(t.sessionDate) : 'Sərbəst'} ·{' '}
                              {t.durationMinutes || 60} dəq · {t.participantCount || 1} nəfər
                              {t.skateSizes?.length
                                ? ` · Konki: ${t.skateSizes.join(', ')}`
                                : ''}
                            </p>
                          </div>
                          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-frost/80">
                            {t.status || 'CONFIRMED'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

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
                    value={rejectReasons[item.userId] || ''}
                    onChange={(e) =>
                      setRejectReasons((prev) => ({
                        ...prev,
                        [item.userId]: e.target.value,
                      }))
                    }
                    placeholder="Rədd səbəbi (istəyə bağlı, məs: şəkil bulanıqdır)"
                    className="w-full rounded-lg border border-white/15 bg-night-900/80 px-3 py-2 text-xs text-white placeholder-frost/35 outline-none focus:border-ice-300/50"
                  />
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      disabled={busyId === item.userId}
                      onClick={() => handleApprove(item.userId)}
                      className="btn-primary flex-1 !py-2.5 text-xs font-bold disabled:opacity-50"
                    >
                      {busyId === item.userId ? 'Gözləyin…' : '✓ Təsdiqlə'}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item.userId}
                      onClick={() => handleReject(item.userId)}
                      className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-2.5 text-xs font-bold text-red-100 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                    >
                      ✕ Rədd et
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
