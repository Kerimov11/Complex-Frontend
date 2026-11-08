import { useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import PublicNavbar from './PublicNavbar'
import StaffNavbar from './StaffNavbar'

const STAFF_ROUTE_PREFIXES = ['/admin', '/volunteer']

/**
 * Staff chrome is used only inside the role management areas. Staff and public
 * users see the full public navigation when they return to the public site.
 */
export function isStaffArea(pathname = '') {
  return STAFF_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export default function AppHeader() {
  const { pathname } = useLocation()
  const { isStaff } = useAuth()

  if (isStaff && isStaffArea(pathname)) {
    return <StaffNavbar />
  }

  return <PublicNavbar />
}
