const MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avqust',
  'sentyabr',
  'oktyabr',
  'noyabr',
  'dekabr',
]
const DAYS = [
  'Bazar',
  'Bazar ertəsi',
  'Çərşənbə axşamı',
  'Çərşənbə',
  'Cümə axşamı',
  'Cümə',
  'Şənbə',
]

export function formatDateAZ(date) {
  const d = new Date(date)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function dayNameAZ(date) {
  const d = new Date(date)
  return DAYS[d.getDay()]
}

export function formatDurationAZ(duration) {
  return duration === 'half' ? '30 dəqiqə' : '1 saat'
}

export function pad(n) {
  return String(n).padStart(2, '0')
}

export function secondsToClock(total) {
  const s = Math.max(0, Math.floor(total))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${pad(m)}:${pad(r)}`
}

export function isFutureDate(dateStr) {
  const d = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d.getTime() >= today.getTime()
}

export function toISODate(d) {
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  return `${y}-${m}-${day}`
}

export function addDaysISO(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export function todayISO() {
  return toISODate(new Date())
}