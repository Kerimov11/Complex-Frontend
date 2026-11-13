import HeaderBar from './HeaderBar'
import { useAuth } from '../auth/AuthContext'

const PUBLIC_LINKS = [
  { to: '/', label: 'Ana səhifə', end: true },
  { to: '/qiymetler', label: 'Qiymətlər' },
  { to: '/haqqimizda', label: 'Haqqımızda' },
  { to: '/qaydalar', label: 'Qaydalar' },
  { to: '/elaqe', label: 'Əlaqə' },
]

const LIVE_LINK = { to: '/canli', label: 'Canlı' }

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
    if (isStaff) {
      items.push({ to: panelPath, label: panelLabel, tone: 'accent' })
    } else {
      items.push(
        { to: '/biletlerim', label: 'Biletlərim', tone: 'accent' },
        { to: '/hesabim', label: 'Hesabım', tone: 'accent' }
      )
    }
  }

  return <HeaderBar items={items} showBooking />
}
