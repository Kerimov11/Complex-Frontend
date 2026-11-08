import { useEffect, useRef } from 'react'

const TAU = Math.PI * 2

function rand(min, max) {
  return min + Math.random() * (max - min)
}

/**
 * Yüngül Canvas qar effekti.
 * - Tek canvas, tek requestAnimationFrame (DOM-a toxunmur)
 * - Tab gizlədiləndə tam dayanır (CPU/yaddaş sıfır təsir)
 * - Zəif cihazlarda dənə sayı və DPR azalır
 * - prefers-reduced-motion olduqda qar YOX olmur, sadəcə daha yavaş/azdır
 */
export default function Snowfall() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Cihaz gücünə görə yüklüyü azalt
    const cores = navigator.hardwareConcurrency || 8
    const mem = navigator.deviceMemory || 8
    const lowEnd = cores <= 4 || mem <= 4

    const DPR = Math.min(window.devicePixelRatio || 1, lowEnd ? 1.5 : 2)
    // Hərəkət azaltma açıqdısa qar YOX olmur, sadəcə daha yüngül olur
    const FLAKE_MAX = lowEnd ? 60 : reduceMotion ? 60 : 120
    const SPEED = reduceMotion ? 0.55 : 1

    let w = 0
    let h = 0
    let rafId = 0
    let flakes = []
    let bumps = []
    let mound = 0
    let moundVel = 0
    let moundGrad = null
    const MAX_MOUND = 76
    let last = 0

    /**
     * seed  → dənələr dərhal ekranın boyu səpələnsin (ilk kadrdan yağış görünsün)
     * top   → enən dənə ekranın cəmi 70px üstündən yenidən başlasın
     *          (əvvəl -h qədər yuxarıdan başlayırdı → 1080p ekrana çatmaq
     *           14-51 saniyə çəkirdi, buna görə yağış ümumiyyətlə görünmürdü)
     */
    function makeFlake(mode) {
      return {
        x: rand(0, w),
        y: mode === 'seed' ? rand(-h * 0.4, h * 0.88) : rand(-70, -8),
        r: rand(0.9, 3),
        vy: rand(0.45, 1.6) * SPEED,
        vx: rand(-0.3, 0.3),
        a: rand(0.45, 0.95),
        phase: rand(0, TAU),
        speed: rand(0.006, 0.02),
      }
    }

    function buildScene(mode) {
      const count = Math.min(
        FLAKE_MAX,
        Math.max(24, Math.round((w * h) / 17000))
      )
      flakes = Array.from({ length: count }, () => makeFlake(mode))
      bumps = Array.from({ length: 44 }, () => rand(-7, 7))
      // Gradient yalnız dəyişiklik zamanı yaradılır (hər kadrda yox)
      moundGrad = ctx.createLinearGradient(0, h - MAX_MOUND - 12, 0, h)
      moundGrad.addColorStop(0, 'rgba(255,255,255,0.92)')
      moundGrad.addColorStop(0.55, 'rgba(214,238,252,0.5)')
      moundGrad.addColorStop(1, 'rgba(138,217,255,0.1)')
    }

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * DPR)
      canvas.height = Math.floor(h * DPR)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      buildScene('seed')
      mound = 0
      moundVel = 0
      last = 0
    }

    function drawMound(now) {
      const base = h - 2
      const step = w / (bumps.length - 1)
      const top = h - mound

      ctx.beginPath()
      ctx.moveTo(0, base)
      ctx.lineTo(0, top + 10)
      for (let i = 0; i < bumps.length; i++) {
        const y = top + Math.sin(now * 0.0006 + i * 1.7) * 1.1 + bumps[i]
        ctx.lineTo(i * step, y)
      }
      ctx.lineTo(w, top + 10)
      ctx.lineTo(w, base)
      ctx.closePath()
      ctx.fillStyle = moundGrad
      ctx.fill()
    }

    function frame(now) {
      rafId = requestAnimationFrame(frame)

      if (document.hidden || !last) {
        last = now
        return
      }

      const dt = Math.min((now - last) / 16.666, 2)
      last = now

      ctx.clearRect(0, 0, w, h)

      // Yığılma qəsdən yavaşdır: təxminən 40-50 saniyəyə tam hündürlüyə
      // çatır, əvvəl isə ~4 saniyəyə dolurdu və yağış başlamamış "bitirdi"
      if (mound < MAX_MOUND) {
        moundVel = Math.min(0.03, moundVel + rand(0, 0.0012) * dt)
        mound = Math.min(MAX_MOUND, mound + (0.02 + moundVel) * dt)
      }

      ctx.fillStyle = '#eaf6ff'
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i]
        f.phase += f.speed * dt
        f.x += (f.vx + Math.sin(f.phase) * 0.18) * dt
        f.y += f.vy * dt
        const landY = h - 6 - Math.max(0, mound - f.r * 10) * 0.35
        if (f.y > landY || f.x < -20 || f.x > w + 20) {
          flakes[i] = makeFlake('top')
          continue
        }
        ctx.globalAlpha = f.a
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, TAU)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      drawMound(reduceMotion ? 0 : now)
    }

    function start() {
      if (rafId || document.hidden) return
      last = 0
      rafId = requestAnimationFrame(frame)
    }

    function stop() {
      if (!rafId) return
      cancelAnimationFrame(rafId)
      rafId = 0
    }

    // Resize-i debounce edirik ki, fırtına kimi yenidən qurulmasın
    let resizeTimer = 0
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }

    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }

    resize()
    start()

    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 h-full w-full select-none"
    />
  )
}
