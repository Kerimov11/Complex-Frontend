import HeaderBar from './HeaderBar'
import { useAuth } from '../auth/AuthContext'

const LIVE_LINK = { to: '/canli', label: 'Buza Canlı Bax' }

function staffTabs({ isAdmin, isCoordinator, isCashier, isVolunteer }) {
  if (isAdmin) {
    return [
      { to: '/admin', label: 'Dashboard', end: true },
      { to: '/admin/shifts', label: 'Smenlər' },
      { to: '/admin/skates', label: 'Anbar' },
      { to: '/volunteer/reservations', label: 'Rezervasiyalar' },
      { to: '/admin/pos', label: 'POS' },
    ]
  }

  if (isCoordinator) {
    return [
      { to: '/admin/shifts', label: 'Smenlər' },
      { to: '/volunteer/inventory', label: 'Anbar' },
      { to: '/volunteer/reservations', label: 'Rezervasiyalar' },
    ]
  }

  if (isCashier) {
    return [
      { to: '/admin/pos', label: 'POS' },
      { to: '/admin/shifts', label: 'Smenlər' },
      { to: '/admin/verification', label: 'Turniket' },
    ]
  }

  if (isVolunteer) {
    return [
      { to: '/volunteer/reservations', label: 'Rezervasiyalar' },
      { to: '/volunteer/inventory', label: 'Anbar' },
      { to: '/volunteer/shifts', label: 'Smenlər' },
    ]
  }

  return []
}

export default function StaffNavbar() {
  const {
    isAdmin,
    isCoordinator,
    isCashier,
    isVolunteer,
  } = useAuth()

  const items = [
    LIVE_LINK,
    ...staffTabs({ isAdmin, isCoordinator, isCashier, isVolunteer }),
  ]

  return <HeaderBar items={items} />
}
