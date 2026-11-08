export function formatShiftDate(value) {
  if (!value) return '—'
  const parts = String(value).split('-')
  if (parts.length !== 3) return String(value)
  return `${parts[2]}.${parts[1]}.${parts[0]}`
}

export function formatClock(value) {
  if (!value) return '—'
  return String(value).slice(0, 5)
}

export function formatShiftRange(start, end) {
  return `${formatClock(start)}–${formatClock(end)}`
}
