import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../auth/AuthContext'

/**
 * Shared header chrome for the public site and staff panels.
 * The caller supplies the navigation items that are valid for its area.
 */
export default function HeaderBar({
  items = [],
  showBooking = false,
  bookingLabel = 'Bilet al',
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, openAuth, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function desktopLinkClass({ isActive }, item) {
    if (item.tone === 'accent') {
      return `rounded-full px-3 py-2 text-[13px] font-semibold transition-colors ${
        isActive ? 'text-amber-200' : 'text-amber-200/70 hover:text-amber-100'
      }`
    }
    return `rounded-full px-3 py-2 text-[13px] font-semibold transition-colors ${
      isActive ? 'text-ice-200' : 'text-frost/75 hover:text-white'
    }`
  }

  function mobileLinkClass({ isActive }, item) {
    if (item.tone === 'accent') {
      return `rounded-xl px-4 py-3 text-sm font-semibold ${
        isActive ? 'bg-amber-400/10 text-amber-200' : 'text-amber-200/70'
      }`
    }
    return `rounded-xl px-4 py-3 text-sm font-semibold ${
      isActive ? 'bg-white/10 text-ice-200' : 'text-frost/80'
    }`
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong py-2.5'
          : 'border-b border-white/5 bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Əsas naviqasiya">
          {items.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              end={item.end}
              className={(state) => desktopLinkClass(state, item)}
            >
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="ml-2 flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              <span className="max-w-[9rem] truncate text-xs font-bold text-ice-200">
                {user.username || 'Hesab'}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full px-2 py-1 text-[11px] font-semibold text-frost/55 transition-colors hover:text-white"
              >
                Çıxış
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="ml-2 rounded-full px-3 py-2 text-[13px] font-semibold text-frost/75 transition-colors hover:text-white"
            >
              Daxil ol
            </button>
          )}

          {showBooking && (
            <Link to="/bilet" className="btn-primary ml-2 !px-5 !py-2 text-[13px]">
              {bookingLabel}
            </Link>
          )}
        </nav>

        <button
          type="button"
          aria-label="Menyunu aç/bağla"
          onClick={() => setOpen((value) => !value)}
          className="glass grid h-11 w-11 place-items-center rounded-xl lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="glass-strong mx-4 mt-3 rounded-2xl p-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobil naviqasiya">
            {items.map((item) => (
              <NavLink
                key={`${item.to}-${item.label}`}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={(state) => mobileLinkClass(state, item)}
              >
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  logout()
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-frost/60"
              >
                {user.username || 'Hesab'} · Çıxış
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  openAuth('login')
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-frost/80"
              >
                Daxil ol
              </button>
            )}

            {showBooking && (
              <Link
                to="/bilet"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 text-sm"
              >
                {bookingLabel}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
