import HeaderBar from './HeaderBar'
import { useAuth } from '../auth/AuthContext'
import { staffHomePath } from '../utils/staffRoutes'

function staffTabs({ isAdmin, isCoordinator, isCashier, isVolunteer }) {
  if (isCoordinator) {
    return [
      { to: '/admin/shifts', label: 'Smenlər' },
      { to: '/volunteer/inventory', label: 'Anbar' },
      { to: '/volunteer/reservations', label: 'Rezervasiyalar' },
      { to: '/admin/verification', label: 'Turniket' },
      { to: '/admin/cashier-verification', label: 'Kassa QR' },
      { to: '/admin/active', label: 'Buzdakı müştərilər' },
    ]
  }

  if (isAdmin) {
    return [
      { to: '/admin', label: 'İdarəetmə paneli', end: true },
      { to: '/admin/shifts', label: 'Smenlər' },
      { to: '/admin/skates', label: 'Anbar' },
      { to: '/volunteer/reservations', label: 'Rezervasiyalar' },
      { to: '/admin/verification', label: 'Turniket' },
      { to: '/admin/cashier-verification', label: 'Kassa QR' },
      { to: '/admin/identity-verifications', label: 'Bilet təsdiqi' },
      { to: '/admin/active', label: 'Buzdakı müştərilər' },
      { to: '/admin/pos', label: 'POS' },
    ]
  }

  if (isCashier) {
    return [
      { to: '/admin/pos', label: 'POS' },
      { to: '/admin/identity-verifications', label: 'Bilet təsdiqi' },
      { to: '/admin/active', label: 'Buzdakı müştərilər' },
    ]
  }

  if (isVolunteer) {
    return [
      { to: '/volunteer/reservations', label: 'Rezervasiyalar' },
      { to: '/admin/verification', label: 'Turniket' },
      { to: '/admin/cashier-verification', label: 'Kassa QR' },
      { to: '/admin/active', label: 'Buzdakı müştərilər' },
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
  const roles = { isAdmin, isCoordinator, isCashier, isVolunteer }

  return (
    <HeaderBar
      items={staffTabs(roles)}
      logoTo={staffHomePath(roles)}
    />
  )
}
