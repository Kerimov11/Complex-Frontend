import { QRCodeSVG } from 'qrcode.react'

/**
 * Real, skan edilə bilən QR kod.
 * `seed` köhnə çağırışlarla uyğunluq üçün saxlanılır; `value` prioritetdir.
 */
export default function QrCode({ value, seed, className = 'h-28 w-28' }) {
  const data = String(value ?? seed ?? '').trim()

  if (!data) {
    return (
      <div
        className={`${className} grid place-items-center rounded-md bg-white/10 text-center text-[10px] font-semibold text-white/60`}
      >
        QR kod yoxdur
      </div>
    )
  }

  return (
    <QRCodeSVG
      value={data}
      size={128}
      level="M"
      marginSize={1}
      bgColor="#ffffff"
      fgColor="#07111f"
      className={className}
      title="Bilet QR kodu"
    />
  )
}
