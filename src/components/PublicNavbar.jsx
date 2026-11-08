import HeaderBar from './HeaderBar'
import { useAuth } from '../auth/AuthContext'

const PUBLIC_LINKS = [
  { to: '/', label: 'Ana səhifə', end: true },
  { to: '/qiymetler', label: 'Qiymətlər' },
  { to: '/fealiyyetler', label: 'Fəaliyyətlər' },
  { to: '/qaydalar', label: 'Qaydalar' },
  { to: '/elaqe', label: 'Əlaqə' },
]

const LIVE_LINK = { to: '/canli', label: 'Buza Canlı Bax' }

export default function PublicNavbar() {
  const {
    isAuthenticated,
    isStaff,
    isAdmin,
    isCoordinator,
    isCashier,
    isVolunteer,
  } = useAuth()

  const panelPath = isAdmin
    ? '/admin'
    : isCoordinator
      ? '/admin/shifts'
      : isCashier
        ? '/admin/pos'
        : isVolunteer
          ? '/volunteer/reservations'
          : '/biletlerim'
  const panelLabel = isAdmin
    ? 'Admin Paneli'
    : isCoordinator
      ? 'Koordinator Paneli'
      : isCashier
        ? 'Kassir Paneli'
        : isVolunteer
          ? 'Könüllü Paneli'
          : 'Biletlərim'

  const items = [...PUBLIC_LINKS, LIVE_LINK]

  if (isAuthenticated) {
    items.push(
      isStaff
        ? { to: panelPath, label: panelLabel, tone: 'accent' }
        : { to: '/biletlerim', label: 'Biletlərim', tone: 'accent' }
    )
  }

  return <HeaderBar items={items} showBooking />
}
