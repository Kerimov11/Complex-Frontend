import { useRef, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import QrCameraScanner from '../../components/admin/QrCameraScanner'
import { formatDateTime } from '../../components/admin/formatters'
import { verificationApi } from '../../services/api/verificationApi'

const STATUS_META = {
  CHECKED_IN: { tone: 'success', label: 'Giriş təsdiqləndi' },
  VALID: { tone: 'success', label: 'Etibarlı bilet' },
  ALREADY_USED: { tone: 'warning', label: 'Artıq istifadə olunub' },
  PAYMENT_PENDING: { tone: 'warning', label: 'Ödəniş gözləyir' },
  CANCELLED: { tone: 'error', label: 'Ləğv edilib' },
  EXPIRED: { tone: 'error', label: 'Vaxtı keçib' },
  NOT_FOUND: { tone: 'error', label: 'Tapılmadı' },
}

export default function VerificationPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  async function scan(value) {
    const next = String(value || code || '').trim()
    if (!next) {
      setError('QR və ya bilet kodu daxil edin.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await verificationApi.scan(next)
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

  function onSubmit(event) {
    event.preventDefault()
    scan(code)
  }

  const meta = result ? STATUS_META[result.status] || STATUS_META.NOT_FOUND : null

  return (
    <div>
      <AdminPageHeader
        eyebrow="Turniket doğrulaması"
        title="QR / bilet skanı"
        description="Könüllü və kassir üçün giriş nəzarəti. Rəqəmsal bilet kodunu skan edin və ya əl ilə daxil edin."
      />

      {error && <div className="mb-3"><AdminNotice tone="error">{error}</AdminNotice></div>}

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="glass rounded-xl p-5">
          <form onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Bilet / QR kodu
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
              {loading ? 'Yoxlanılır...' : 'Bileti yoxla və giriş et'}
            </button>
          </form>

          <div className="mt-4">
            <QrCameraScanner onDetected={(value) => scan(value)} />
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-frost/30">
            Hardware QR skaner koddan sonra Enter göndərirsə, input sahəsi avtomatik
            doğrulama aparır. Uğurlu scan rezervasiyanı “checked-in” statusuna keçirir.
          </p>
        </div>

        <div className="space-y-5">
          {result ? (
            <div className="glass-strong rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-frost/35">
                    Nəticə
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-white">
                    {meta?.label}
                  </h3>
                </div>
                <span
                  className={`rounded-md px-3 py-1.5 text-xs font-bold ${
                    meta?.tone === 'success'
                      ? 'bg-emerald-400/15 text-emerald-200'
                      : meta?.tone === 'warning'
                        ? 'bg-amber-400/15 text-amber-200'
                        : 'bg-red-400/15 text-red-200'
                  }`}
                >
                  {result.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-frost/65">{result.message}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Info label="Kod" value={result.code} mono />
                <Info label="Mənbə" value={result.source || '—'} />
                <Info label="Sahib" value={result.ownerName || result.ownerUsername || '—'} />
                <Info label="İştirakçı" value={result.participantCount || 0} />
                <Info label="Tarix" value={result.sessionDate || '—'} />
                <Info
                  label="Sessiya"
                  value={
                    result.sessionStartTime
                      ? `${result.sessionStartTime}–${result.sessionEndTime || ''}`
                      : '—'
                  }
                />
              </div>

              {result.skateSizes?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {result.skateSizes.map((size) => (
                    <span key={size} className="chip">
                      {size} ölçü
                    </span>
                  ))}
                </div>
              )}

              {result.checkedInAt && (
                <p className="mt-4 rounded-xl bg-emerald-400/10 px-3 py-2 text-[11px] text-emerald-200">
                  Giriş: {formatDateTime(result.checkedInAt)}
                  {result.checkedInBy ? ` · ${result.checkedInBy}` : ''}
                </p>
              )}
            </div>
          ) : (
            <div className="glass rounded-xl p-8 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-white/5 text-2xl text-ice-200">
                ⌁
              </span>
              <p className="mt-4 text-sm text-frost/45">
                Skan nəticəsi burada göstəriləcək.
              </p>
            </div>
          )}

          {history.length > 0 && (
            <div className="glass overflow-hidden rounded-xl">
              <div className="border-b border-white/10 p-4">
                <h3 className="font-display text-lg font-bold text-white">Son skanlar</h3>
              </div>
              <div className="max-h-64 divide-y divide-white/[0.06] overflow-y-auto">
                {history.map((item, index) => (
                  <div key={`${item.code}-${index}`} className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-white">{item.code}</p>
                      <p className="mt-0.5 text-[10px] text-frost/35">
                        {item.ownerName || item.ownerUsername || '—'}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-bold ${
                        item.status === 'CHECKED_IN' || item.status === 'VALID'
                          ? 'text-emerald-200'
                          : 'text-red-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Info({ label, value, mono = false }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-2.5">
      <p className="text-[10px] uppercase tracking-wide text-frost/35">{label}</p>
      <p className={`mt-0.5 truncate text-xs font-semibold text-white ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  )
}
