import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { useAuth } from '../auth/AuthContext'

/**
 * Shared header chrome for the public site and staff panels.
 * The caller supplies the navigation items that are valid for its area.
 */
export default function HeaderBar({
  items = [],
  showBooking = false,
  bookingLabel = 'Bilet al',
  logoTo = '/',
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { isAuthenticated, isStaff, user, openAuth, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function desktopLinkClass({ isActive }, item) {
    if (item.tone === 'accent') {
      return `whitespace-nowrap rounded-md px-1.5 py-1.5 text-xs xl:px-2 xl:text-[13px] font-semibold transition-colors ${
        isActive ? 'text-amber-200' : 'text-amber-200/70 hover:text-amber-100'
      }`
    }
    return `whitespace-nowrap rounded-md px-1.5 py-1.5 text-xs xl:px-2 xl:text-[13px] font-semibold transition-colors ${
      isActive ? 'text-ice-200' : 'text-frost/75 hover:text-white'
    }`
  }

  function mobileLinkClass({ isActive }, item) {
    if (item.tone === 'accent') {
      return `whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold ${
        isActive ? 'bg-amber-400/10 text-amber-200' : 'text-amber-200/70'
      }`
    }
    return `whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold ${
      isActive ? 'bg-white/10 text-ice-200' : 'text-frost/80'
    }`
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-150 ${
        scrolled
          ? 'glass-strong py-2.5'
          : 'border-b border-white/5 bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Logo to={logoTo} />

        <nav className="hidden min-w-0 items-center gap-0.5 lg:flex xl:gap-1" aria-label="Əsas naviqasiya">
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

          {!isAuthenticated && <LanguageSwitcher className="ml-2" />}

          {isAuthenticated ? (
            <div className="ml-1.5 flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5">
              <Link
                to="/hesabim"
                title={user?.username || 'Hesabım'}
                className="max-w-[4.5rem] truncate whitespace-nowrap text-xs font-bold text-ice-200 transition-colors hover:text-white"
              >
                {user?.username || 'Hesabım'}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="shrink-0 whitespace-nowrap rounded-md px-1.5 py-1 text-[11px] font-semibold text-frost/55 transition-colors hover:text-white"
              >
                Çıxış
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="ml-1.5 shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-[13px] font-semibold text-frost/75 transition-colors hover:text-white"
            >
              Daxil ol
            </button>
          )}

          {showBooking && (
            <Link to="/bilet" className="btn-primary ml-1.5 shrink-0 whitespace-nowrap !px-4 !py-2 text-[13px]">
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
        <div className="glass-strong mx-3 mt-2.5 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl p-3 sm:mx-4 sm:mt-3 sm:p-4 lg:hidden">
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

            {!isAuthenticated && (
              <div className="my-2 px-2">
                <LanguageSwitcher full />
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex flex-col gap-1 border-t border-white/10 pt-2">
                <Link
                  to="/hesabim"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-ice-200 transition-colors hover:bg-white/5"
                >
                  {user?.username || 'Hesabım'} (Hesabım)
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-frost/60 transition-colors hover:text-white"
                >
                  Çıxış
                </button>
              </div>
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
                className="btn-primary mt-2 whitespace-nowrap text-sm"
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
