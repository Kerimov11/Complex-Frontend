import { Link } from 'react-router-dom'
import logoSrc from '../assets/logo.jpg'

const SIZES = {
  sm: 'h-10 w-10 rounded-xl',
  md: 'h-11 w-11 rounded-xl',
  lg: 'h-16 w-16 rounded-lg',
}

/**
 * Saytdakı yeganə loqo komponenti (Navbar və Footer-da ortaq istifadə olunur).
 * Şəkil qara fonda olduğu üçün qara dəyirmi plitkədə göstərilir -
 * saytın tünd fonu ilə səliqəli birləşir.
 */
export default function Logo({ compact = false, size = 'md', to = '/' }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3"
      title="Heydər Əliyev İdman və Konsert Kompleksi (HƏİKK)"
      aria-label="Heydər Əliyev İdman və Konsert Kompleksi - ana səhifə"
    >
      <span
        className={`relative grid shrink-0 place-items-center overflow-hidden bg-black ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105 ${SIZES[size]}`}
      >
        <img
          src={logoSrc}
          alt={compact ? 'Heydər Əliyev Buz Arenası loqosu' : ''}
          width="192"
          height="192"
          decoding="async"
          className="h-full w-full object-contain"
          draggable="false"
        />
      </span>
      {!compact && (
        <div className="min-w-0 leading-tight">
          {/* Geniş ekranlarda tam ad, dar ekranlarda qısa HƏİKK -
              başlıq heç vaxt sıxlıqla dolmur. */}
          <p className="whitespace-nowrap font-display text-sm font-bold tracking-wide text-white">
            <span className="hidden min-[1440px]:inline">
              Heydər Əliyev İdman və Konsert Kompleksi
            </span>
            <span className="min-[1440px]:hidden">HƏİKK</span>
          </p>
          <p className="text-gradient-ice font-display text-sm font-bold tracking-wider">
            BUZ ARENASI
          </p>
        </div>
      )}
    </Link>
  )
}
