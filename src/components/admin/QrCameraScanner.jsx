import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

export default function QrCameraScanner({ onDetected }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const detectorRef = useRef(null)
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
    detectorRef.current = null
    setActive(false)
  }

  useEffect(() => stop, [])

  async function start() {
    setError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Kamera API əlçatan deyil. Kodu əl ilə daxil edin.')
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

      try {
        detectorRef.current = 'BarcodeDetector' in window
          ? new window.BarcodeDetector({ formats: ['qr_code'] })
          : null
      } catch {
        // Bəzi brauzerlər BarcodeDetector-u elan edir, amma QR formatını
        // dəstəkləmir. Bu halda jsQR fallback istifadə olunur.
        detectorRef.current = null
      }
      setActive(true)

      timerRef.current = setInterval(async () => {
        const video = videoRef.current
        if (!video || video.readyState < 2) return

        let value = ''
        if (detectorRef.current) {
          try {
            const codes = await detectorRef.current.detect(video)
            value = codes?.[0]?.rawValue || ''
          } catch {
            // BarcodeDetector bu kadrı oxuya bilmədi; jsQR fallback işləyəcək.
          }
        }

        if (!value) {
          const canvas = canvasRef.current
          const context = canvas?.getContext('2d', { willReadFrequently: true })
          if (canvas && context && video.videoWidth && video.videoHeight) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            const image = context.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsQR(image.data, image.width, image.height, {
              inversionAttempts: 'attemptBoth',
            })
            if (code?.data) value = code.data
          }
        }

        if (value) {
          stop()
          onDetected(String(value).trim())
        }
      }, 450)
    } catch (err) {
      setError(err?.message || 'Kamera açılmadı.')
      stop()
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-night-900/40 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-white">Kamera ilə QR skan</p>
        <button
          type="button"
          onClick={active ? stop : start}
          className={`rounded-md border px-3 py-1.5 text-[11px] font-bold ${
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
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      {error && <p className="mt-2 text-[11px] text-amber-200">{error}</p>}
      {!active && !error && (
        <p className="mt-2 text-[11px] leading-relaxed text-frost/35">
          Kameranı açıb biletin QR kodunu çərçivəyə yaxınlaşdırın. Kamera
          olmadıqda kodu yuxarıdaki sahəyə əl ilə daxil edin.
        </p>
      )}
    </div>
  )
}
