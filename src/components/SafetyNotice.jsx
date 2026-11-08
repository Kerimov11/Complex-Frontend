import { Link } from 'react-router-dom'
import { SITE } from '../data/config'

/**
 * Yaş məhdudiyyəti üzrə VURĞULU xəbərdarlıq.
 * compact = klassik kiçik kart (sətir içi istifadə üçün)
 * showLink = "/qaydalar" keçidini göstər (Qaydalar səhifəsində söndürülür)
 */
export default function SafetyNotice({ compact = false, showLink = true }) {
  return (
    <div
      role="alert"
      className={`relative overflow-hidden border-2 border-red-500/55 bg-gradient-to-r from-red-600/30 via-red-500/15 to-amber-400/15 shadow-[0_10px_40px_rgba(220,38,38,0.22)] backdrop-blur-sm ${
        compact ? 'rounded-xl px-4 py-3' : 'rounded-2xl px-5 py-4 sm:px-6 sm:py-5'
      }`}
    >
      {/* Sol vurğu zolağı */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-red-400 via-red-500 to-amber-300"
      />

      <div className="flex items-start gap-3 ps-2.5">
        <div
          className={`mt-0.5 grid shrink-0 place-items-center rounded-full bg-red-500/25 text-red-100 ring-1 ring-red-300/40 ${
            compact ? 'h-7 w-7' : 'h-9 w-9 animate-pulse-soft'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className={compact ? 'h-4 w-4' : 'h-5 w-5'}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l9 16H3l9-16z" />
            <path d="M12 10v4" />
            <path d="M12 17.5v.01" />
          </svg>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200/90 sm:text-[11px]">
            Vacib xəbərdarlıq — yaş məhdudiyyəti
          </p>
          <p
            className={`mt-1 font-display font-black leading-snug text-white ${
              compact ? 'text-sm' : 'text-base sm:text-lg'
            }`}
          >
            {SITE.safetyUnder4}
          </p>
          {!compact && (
            <>
              <p className="mt-2 text-sm leading-relaxed text-red-100/80">
                Bilet alışı zamanı hər bir iştirakçının yaşı yoxlanılır. Yaş
                həddinə cavab verməyən şəxslər buza buraxılmır və onlar üçün
                alına biletlər girişdə etibarsız sayılır.
              </p>
              {showLink && (
                <Link
                  to="/qaydalar"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-red-300/40 bg-red-500/15 px-4 py-2 text-xs font-bold text-red-50 transition-colors hover:border-red-200/70 hover:bg-red-500/25"
                >
                  Bütün qaydalar və qadağalar
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
