import { Link } from 'react-router-dom'
import logoSrc from '../assets/logo.jpg'

const SIZES = {
  sm: 'h-10 w-10 rounded-xl',
  md: 'h-11 w-11 rounded-xl',
  lg: 'h-16 w-16 rounded-2xl',
}

/**
 * Saytdakı yeganə loqo komponenti (Navbar və Footer-da ortaq istifadə olunur).
 * Şəkil qara fonda olduğu üçün qara dəyirmi plitkədə göstərilir -
 * saytın tünd fonu ilə səliqəli birləşir.
 */
export default function Logo({ compact = false, size = 'md' }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3"
      title="Heydər Əliyev İdman və Konsert Kompleksi (HƏİKK)"
      aria-label="Heydər Əliyev İdman və Konsert Kompleksi - ana səhifə"
    >
      <span
        className={`relative grid shrink-0 place-items-center overflow-hidden bg-black ring-1 ring-white/15 shadow-ice-glow transition-transform duration-300 group-hover:scale-105 ${SIZES[size]}`}
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
        <div className="leading-tight">
          {/* Geniş ekranlarda tam ad, dar ekranlarda qısa HƏİKK -
              başlıq heç vaxt sıxlıqla dolmur. */}
          <p className="whitespace-nowrap font-display text-sm font-extrabold tracking-wide text-white">
            <span className="hidden xl:inline">
              Heydər Əliyev İdman və Konsert Kompleksi
            </span>
            <span className="xl:hidden">HƏİKK</span>
          </p>
          <p className="text-gradient-ice font-display text-sm font-extrabold tracking-widest">
            BUZ ARENASI
          </p>
        </div>
      )}
    </Link>
  )
}
