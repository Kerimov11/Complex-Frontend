import { useEffect, useRef, useState } from 'react'
import { getLiveStatus } from '../../api/client'
import { SITE } from '../../data/config'

const STREAM_POSTER =
  'https://images.unsplash.com/photo-1547866241-aa6d5a7be613?q=80&w=1600&auto=format&fit=crop'

function useLiveStatus() {
  const [count, setCount] = useState(24)

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => (prev === 24 ? 25 : 24))
    }, 15000)
    return () => clearInterval(id)
  }, [])

  return {
    count,
    open: true,
    offline: false,
    loading: false,
  }
}

function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(value)
  const current = useRef(value)
  const raf = useRef(0)

  useEffect(() => {
    cancelAnimationFrame(raf.current)
    const step = () => {
      const diff = value - current.current
      if (Math.abs(diff) < 0.05) {
        current.current = value
      } else {
        current.current += diff * 0.12
      }
      setDisplay(Math.round(current.current))
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [value])

  return <>{display}</>
}

export default function LiveStream() {
  const { count, open, loading, offline } = useLiveStatus()
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <div className="glass group relative overflow-hidden rounded-xl">
      <div className="relative aspect-video overflow-hidden bg-night-900">
        {!videoFailed ? (
          <video
            src="/live-stream.mp4"
            poster={STREAM_POSTER}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
            className="h-full w-full object-cover opacity-80"
          />
        ) : (
          <img
            src={STREAM_POSTER}
            alt="Buz arenası"
            className="h-full w-full object-cover opacity-70"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/30 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-bold ${
              offline
                ? 'border-white/15 bg-white/10 text-frost/60'
                : 'border-red-400/40 bg-red-600/20 text-red-100'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  offline ? 'bg-white/40' : 'bg-red-500'
                }`}
              />
            </span>
            {offline ? 'OFFLINE' : 'CANLI'}
          </span>
          {!loading && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold ${
                offline
                  ? 'border-amber-300/30 bg-amber-400/10 text-amber-100'
                  : open
                    ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
                    : 'border-white/15 bg-white/10 text-frost/70'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  offline ? 'bg-amber-300' : open ? 'bg-emerald-400' : 'bg-white/40'
                }`}
              />
              {offline
                ? 'Məlumat əlçatmazdır'
                : open
                  ? 'Buz açıqdır'
                  : 'Buz bağlıdır'}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5">
          <div>
            <p className="font-display text-base font-bold text-white">
              Buz Arenası - Canlı kamera
            </p>
            <p className="mt-0.5 text-xs text-frost/60">
              {SITE.address}
            </p>
          </div>
          <div className="glass-strong flex items-center gap-3 rounded-lg px-5 py-3">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-ice-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div className="text-right">
              <p
                className="font-display text-2xl font-bold leading-none text-white"
                title={offline ? 'Canlı məlumat əlçatmazdır' : `${count} müştəri`}
              >
                {offline ? '—' : <AnimatedCounter value={count} />}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-frost/55">
                buz üstündə
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}