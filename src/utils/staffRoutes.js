export function staffHomePath({
  isAdmin,
  isCoordinator,
  isCashier,
  isVolunteer,
} = {}) {
  if (isAdmin) return '/admin'
  if (isCoordinator) return '/admin/shifts'
  if (isCashier) return '/admin/pos'
  if (isVolunteer) return '/volunteer/reservations'
  return '/'
}
