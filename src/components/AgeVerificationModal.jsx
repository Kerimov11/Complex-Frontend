import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

const labelCls =
  'text-[10px] font-bold uppercase tracking-wider text-frost/45'

export default function AgeVerificationModal() {
  const {
    user,
    isCustomer,
    verificationLoading,
    verifyAge,
  } = useAuth()

  const [dateOfBirth, setDateOfBirth] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const needsAge = Boolean(
    isCustomer && !verificationLoading && !user?.ageVerified
  )
  const open = Boolean(isCustomer && (needsAge || result))

  const maxDate = useMemo(() => {
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${today.getFullYear()}-${month}-${day}`
  }, [])

  useEffect(() => {
    setDateOfBirth('')
    setError('')
    setResult(null)
    setBusy(false)
  }, [user?.userId])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  const underage = result && result.isAdult === false

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setError('')
    setBusy(true)
    try {
      const data = await verifyAge(dateOfBirth)
      if (data?.isAdult === false) {
        setResult(data)
      }
    } catch (err) {
      setError(err?.message || 'Yaş təsdiqi aparıla bilmədi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[130] grid place-items-center overflow-y-auto bg-night-950/90 p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Yaş təsdiqi"
        className="glass-strong my-6 w-full max-w-md overflow-hidden rounded-xl border border-white/15"
      >
        <div className="border-b border-white/10 p-6 pb-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ice-200">
            Yaş təsdiqi
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            {underage ? 'Bilet alışı mümkün deyil' : 'Yaşınızı təsdiqləyin'}
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-frost/60">
            Bilet satışı üçün 18 yaş həddi tətbiq olunur. Doğum tarixinizi
            qeyd edin; 18 yaşdan kiçik şəxslər onlayn bilet ala bilməz.
          </p>
        </div>

        <div className="p-6">
          {underage ? (
            <>
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4">
                <p className="text-sm font-semibold text-red-100">
                  {result.message ||
                    '18 yaşdan kiçik şəxslər bilet ala bilməz.'}
                </p>
                <p className="mt-2 text-xs text-red-100/70">
                  Qeyd olunan yaş: {result.age ?? '—'}. Bilet almaq üçün 18
                  yaşınız tamam olmalıdır.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="btn-primary mt-5 w-full"
              >
                Anladım
              </button>
            </>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className={labelCls} htmlFor="age-date-of-birth">
                  Doğum tarixi
                </label>
                <input
                  id="age-date-of-birth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  min="1900-01-01"
                  max={maxDate}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-ice-300/60"
                  autoFocus
                  required
                />
              </div>

              <div className="rounded-lg border border-amber-300/25 bg-amber-400/10 p-3">
                <p className="text-xs leading-relaxed text-amber-100/80">
                  Bu məlumat yalnız yaş həddinin yoxlanılması üçün saxlanılır
                  və sonradan dəyişdirilə bilməz.
                </p>
              </div>

              {error && (
                <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy || !dateOfBirth}
                className={`btn-primary w-full ${
                  busy || !dateOfBirth ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                {busy ? 'Yoxlanılır…' : 'Yaşı təsdiqlə'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
