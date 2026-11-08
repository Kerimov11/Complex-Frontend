import { Link } from 'react-router-dom'

// Poster kimi xarici şəkil istifadə etmirik: keçid zamanı 1 saniyəlik
// yanlış şəkil (qızın fotosu) yanıb-sönməsinə yol verirdi. Bunun əvəzinə
// video konteynerinə dizayna uyğun tünd buz gradienti qoyulub.
const VIDEO_SOURCES = [
  'https://videos.pexels.com/video-files/2985182/2985182-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/4611794/4611794-hd_1920_1080_25fps.mp4',
]

const STATS = [
  { value: '4000+', label: 'm² buz səthi' },
  { value: '500+', label: 'eyni anda giriş' },
  { value: '365', label: 'gün aktiv buz' },
]

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            '#0b1220',
        }}
      >
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        >
          {VIDEO_SOURCES.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
        </video>
        <div className="absolute inset-0 bg-night-950/60" />
              </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-40 pt-40 sm:px-6">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <span className="chip">HƏİKK - Buz Arenası</span>
            <span className="chip chip-ice">Nizami metrosu yaxınlığında</span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Buz Arenası -{' '}
            <span className="text-gradient-ice">
              buzda sürüşün ritmini hiss et
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-frost/75 sm:text-lg">
            Beynəlxalq standartlara cavab verən buz səthimizdə açıq konkisürmə,
            məşğələlər və xüsusi tədbirlər. Canlı yayımı izlə, konki ölçünü
            rezervasiya et və vaxtını buza ayır.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/bilet" className="btn-primary">
              Bilet al
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link to="/canli" className="btn-ghost">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              Canlı yayım
            </Link>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-lg px-4 py-4 text-center">
                <p className="font-display text-2xl font-bold text-white">
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-frost/55">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}