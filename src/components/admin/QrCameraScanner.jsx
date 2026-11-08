import { useEffect, useRef, useState } from 'react'

export default function QrCameraScanner({ onDetected }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState('')

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setActive(false)
  }

  useEffect(() => stop, [])

  async function start() {
    setError('')
    if (!('BarcodeDetector' in window)) {
      setError('Bu brauzer QR kamera skanını dəstəkləmir. Kodu əl ilə daxil edin.')
      return
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Kamera API əlçatan deyil.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
      setActive(true)
      timerRef.current = setInterval(async () => {
        if (!videoRef.current) return
        try {
          const codes = await detector.detect(videoRef.current)
          const value = codes?.[0]?.rawValue
          if (value) {
            stop()
            onDetected(value)
          }
        } catch {
          // Kadr hələ hazır olmaya bilər; növbəti cəhddə davam edirik.
        }
      }, 500)
    } catch (err) {
      setError(err?.message || 'Kamera açılmadı.')
      stop()
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-night-900/40 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-white">Kamera ilə QR skan</p>
        <button
          type="button"
          onClick={active ? stop : start}
          className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${
            active
              ? 'border-red-300/25 bg-red-400/10 text-red-200'
              : 'border-ice-300/25 bg-ice-400/10 text-ice-200'
          }`}
        >
          {active ? 'Dayandır' : 'Kameranı aç'}
        </button>
      </div>
      <video
        ref={videoRef}
        muted
        playsInline
        className={`mt-3 w-full rounded-xl bg-black/40 ${active ? 'block' : 'hidden'}`}
      />
      {error && <p className="mt-2 text-[11px] text-amber-200">{error}</p>}
      {!active && !error && (
        <p className="mt-2 text-[11px] leading-relaxed text-frost/35">
          Kamera dəstəklənən brauzerde QR kodu oxutmaq üçün istifadə edin.
        </p>
      )}
    </div>
  )
}
