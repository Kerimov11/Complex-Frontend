import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/ticket'

const inputCls =
  'mt-1 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-frost/30 outline-none transition-colors focus:border-ice-300/60'

const labelCls =
  'text-[10px] font-bold uppercase tracking-wider text-frost/45'

const onlyDigits = (value) => value.replace(/\D/g, '')

function detectCardBrand(digits) {
  if (/^4\d*$/.test(digits)) return 'VISA'
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d*$/.test(digits)) {
    return 'MASTERCARD'
  }
  if (/^3[47]\d*$/.test(digits)) return 'AMEX'
  return ''
}

function luhnValid(digits) {
  let sum = 0
  let doubleIt = false
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = Number(digits[i])
    if (doubleIt) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    doubleIt = !doubleIt
  }
  return sum % 10 === 0
}

function formatCardNumber(value) {
  const digits = onlyDigits(value)
  const brand = detectCardBrand(digits)
  const maxLen = brand === 'AMEX' ? 15 : 16
  const sliced = digits.slice(0, maxLen)
  if (brand === 'AMEX') {
    return sliced.replace(/^(\d{4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    )
  }
  return sliced.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function validateCard({ number, holder, expiry, cvv }) {
  const digits = onlyDigits(number)
  const brand = detectCardBrand(digits)
  if (!brand) {
    return 'Yalnız Visa, Mastercard və ya American Express kartları qəbul olunur.'
  }
  const expectedLen = brand === 'AMEX' ? 15 : 16
  if (digits.length !== expectedLen) {
    return `Kart nömrəsi ${expectedLen} rəqəm olmalıdır.`
  }
  if (/^(\d)\1+$/.test(digits) || digits === '1234567890123456') {
    return 'Saxta və ya etibarsız kart nömrəsi daxil etmək olmaz.'
  }
  if (!luhnValid(digits)) {
    return 'Kart nömrəsi bank standartına (Luhn yoxlaması) uyğun deyil.'
  }

  const trimmedHolder = holder.trim()
  const holderParts = trimmedHolder.split(/\s+/).filter(Boolean)
  if (
    holderParts.length < 2 ||
    !/^[\p{L}\s'-]{4,60}$/u.test(trimmedHolder)
  ) {
    return 'Kart sahibinin ad və soyadını düzgün daxil edin (yalnız hərflər).'
  }

  const match = /^(\d{2})\/(\d{2})$/.exec(expiry.trim())
  if (!match) {
    return 'Son istifadə tarixi AA/İİ formatında olmalıdır.'
  }
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const currentYear = new Date().getFullYear()
  if (month < 1 || month > 12) {
    return 'Son istifadə ayı 01–12 aralığında olmalıdır.'
  }
  if (year > currentYear + 15) {
    return 'Son istifadə ili düzgün deyil.'
  }
  const expiresAt = new Date(year, month, 0, 23, 59, 59)
  if (expiresAt.getTime() < Date.now()) {
    return 'Kartın istifadə müddəti bitib.'
  }

  const cvvDigits = onlyDigits(cvv)
  const expectedCvv = brand === 'AMEX' ? 4 : 3
  if (cvvDigits.length !== expectedCvv || /^0+$/.test(cvvDigits)) {
    return `CVV/CVC kodu ${expectedCvv} rəqəm olmalıdır.`
  }
  return ''
}

export default function PaymentModal({
  open,
  amount,
  busy,
  error,
  onClose,
  onPay,
}) {
  const [card, setCard] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  })
  const [localError, setLocalError] = useState('')
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    setCard({ number: '', holder: '', expiry: '', cvv: '' })
    setLocalError('')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape' && !busy) onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, busy])

  if (!open) return null

  function fillDemoCard() {
    setCard({
      number: '4242 4242 4242 4242',
      holder: 'DEMO USER',
      expiry: '12/30',
      cvv: '123',
    })
    setLocalError('')
  }

  function submit(event) {
    event.preventDefault()
    if (busy) return
    const message = validateCard(card)
    if (message) {
      setLocalError(message)
      return
    }
    setLocalError('')
    onPay({
      last4: onlyDigits(card.number).slice(-4),
      holder: card.holder.trim(),
    })
  }

  return (
    <div
      className="fixed inset-0 z-[130] grid place-items-center overflow-y-auto bg-night-950/85 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ödəniş"
        className="glass-strong my-6 w-full max-w-lg overflow-hidden rounded-xl border border-white/15"
      >
        <div className="relative border-b border-white/10 p-6 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ice-200">
              Təhlükəsiz ödəniş
            </p>
            <span className="chip !py-0 text-[10px] uppercase text-amber-200">
              Demo gateway
            </span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Ödənişi tamamlayın
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-frost/60">
            Ödəniləcək məbləğ:{' '}
            <span className="font-display text-base font-bold text-white">
              {formatPrice(amount)}
            </span>
            . Bu demo ödənişdir — real kart məlumatı daxil etməyin.
          </p>

          <button
            type="button"
            onClick={() => !busy && onClose()}
            disabled={busy}
            aria-label="Bağla"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-frost/70 transition-colors hover:text-white disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="relative overflow-hidden rounded-lg border border-ice-300/25 bg-night-950 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ice-200">
                Ice Arena
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-frost/45">
                {detectCardBrand(onlyDigits(card.number)) || 'VISA / MC / AMEX'}
              </span>
            </div>
            <p className="mt-6 font-mono text-lg font-semibold tracking-wider text-white">
              {card.number || '•••• •••• •••• ••••'}
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-wider text-frost/40">
                  Kart sahibi
                </p>
                <p className="truncate text-xs font-bold uppercase tracking-wide text-white">
                  {card.holder || 'AD SOYAD'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-wider text-frost/40">
                  Tarix
                </p>
                <p className="text-xs font-bold text-white">
                  {card.expiry || 'AA/İİ'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className={labelCls} htmlFor="pay-card">
                Kart nömrəsi
              </label>
              <input
                id="pay-card"
                value={card.number}
                onChange={(event) =>
                  setCard((prev) => ({
                    ...prev,
                    number: formatCardNumber(event.target.value),
                  }))
                }
                className={inputCls}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
                autoComplete="cc-number"
                disabled={busy}
                required
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="pay-holder">
                Kart sahibinin adı
              </label>
              <input
                id="pay-holder"
                value={card.holder}
                onChange={(event) =>
                  setCard((prev) => ({
                    ...prev,
                    holder: event.target.value.replace(/[^\p{L}\s'-]/gu, ''),
                  }))
                }
                className={inputCls}
                placeholder="DEMO USER"
                autoComplete="cc-name"
                disabled={busy}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} htmlFor="pay-expiry">
                  Son istifadə
                </label>
                <input
                  id="pay-expiry"
                  value={card.expiry}
                  onChange={(event) =>
                    setCard((prev) => ({
                      ...prev,
                      expiry: formatExpiry(event.target.value),
                    }))
                  }
                  className={inputCls}
                  placeholder="AA/İİ"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  disabled={busy}
                  required
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="pay-cvv">
                  CVV
                </label>
                <input
                  id="pay-cvv"
                  value={card.cvv}
                  onChange={(event) =>
                    setCard((prev) => ({
                      ...prev,
                      cvv: onlyDigits(event.target.value).slice(0, 4),
                    }))
                  }
                  className={inputCls}
                  placeholder="123"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  disabled={busy}
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={fillDemoCard}
                disabled={busy}
                className="text-xs font-bold text-ice-200 underline decoration-ice-300/40 underline-offset-4 transition-colors hover:text-white disabled:opacity-40"
              >
                Demo kartı doldur
              </button>
              <Link
                to="/qaydalar"
                className="text-[11px] font-semibold text-frost/45 transition-colors hover:text-frost/70"
              >
                Ödəniş qaydaları
              </Link>
            </div>

            {(localError || error) && (
              <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                {localError || error}
              </p>
            )}

            <button
              type="submit"
              id="pay-submit"
              disabled={busy}
              className={`btn-primary w-full ${
                busy ? 'cursor-not-allowed opacity-60' : ''
              }`}
            >
              {busy
                ? 'Ödəniş yoxlanılır…'
                : `${formatPrice(amount)} ödə və bileti al`}
            </button>
            <button
              type="button"
              onClick={() => !busy && onClose()}
              disabled={busy}
              className="btn-ghost w-full"
            >
              Ləğv et
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
