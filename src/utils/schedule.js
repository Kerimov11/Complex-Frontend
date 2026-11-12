import { SITE } from '../data/config'
import { toISODate, pad } from './datetime'

/**
 * İş saatları və bilet satış qaydaları:
 * - Arenanın bağlanma vaxtı həmin günün son iş saatıdır.
 * - Cari gün üçün satış, bağlanmaya 30 dəqiqə qalıbdan avtomatik bağlanır.
 */

export const SALES_CUTOFF_MINUTES = 30

/** Sessiya düymələrinin addımı (dəqiqə). Bütün iş saatları hədləri 5-ə bölünür. */
export const SLOT_STEP_MINUTES = 5

export function timeToMinutes(t) {
  const [h, m] = String(t).split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(total) {
  const v = Math.max(0, Math.min(24 * 60, Math.round(total)))
  if (v === 24 * 60) return '24:00'
  return `${pad(Math.floor(v / 60))}:${pad(v % 60)}`
}

/** Sessiyanın bitiş vaxtı ("10:30" + 'half' -> "11:00"). */
export function sessionEndTime(start, duration) {
  const need = duration === 'half' ? 30 : 60
  return minutesToTime(timeToMinutes(start) + need)
}

/** Sessiya düyməsinin qısa səbəbi (düymənin içində görünür). */
export const SLOT_REASON_LABEL = {
  past: 'keçib',
  cutoff: '30 dəq',
  nofit: 'uymur',
}

/** Sessiya düyməsinin tam izahı (title tooltip). */
export const SLOT_REASON_TITLE = {
  past: 'Bu vaxt artıq keçib',
  cutoff: 'Bağlanmaya 30 dəqiqədən az qalıb — seçilmir',
  nofit: 'Sessiyanın müddəti iş saatı daxilində bitmir',
}

/** Həftənin günü üçün iş saatları qeydi (1-ci gün = Bazar ertəsi). */
export function dayEntry(dateISO) {
  const day = new Date(`${dateISO}T00:00:00`).getDay()
  return SITE.workingHours[day === 0 ? 6 : day - 1]
}

/** Həmin günün bağlanma vaxtı (dəqiqə). */
export function closingMinutes(dateISO) {
  const entry = dayEntry(dateISO)
  let max = 0
  entry.ranges.forEach((range) => {
    const end = range.split('-')[1]
    if (end) max = Math.max(max, timeToMinutes(end.trim()))
  })
  return max
}

/** Məs. "21:30" */
export function closingTimeLabel(dateISO) {
  return minutesToTime(closingMinutes(dateISO))
}

/** Satışın dayandırıldığı vaxt = bağlanma - 30 dəqiqə. Məs. "21:00" */
export function salesCutoffLabel(dateISO) {
  return minutesToTime(closingMinutes(dateISO) - SALES_CUTOFF_MINUTES)
}

/**
 * GÜNÜN DİNAMİK SESSİYA ÇİZELƏSİ.
 *
 * Hər düymə = həmin günün iş saatları cədvəlindən yaranan 5 dəqiqəlik başlanğıc.
 *
 * Aktiv (seçilə bilən) şərtlər:
 *   1. Düymə iş saatı aralığındadır;
 *   2. Bağlanışa (aralığın bitişinə) ən azı 30 dəqiqə qalıb;
 *   3. Sessiyanın müddəti iş saatı daxilində bitir;
 *   4. Cari gün üçün vaxt hələ keçməyib (indiki andan etibarən).
 *
 * Qalan bütün aralıqlar `disabled` və qırmızı göstərilir:
 *   - iş saatları xarici (fasilə, gün başlamazdan əvvəl, bağlanmadan sonra)
 *   - bağlana 30 dəqiqədən az qalan zaman
 *   - artıq keçmiş vaxtlar
 */
export function buildSessionTimeline(dateISO, duration, now = new Date()) {
  const entry = dayEntry(dateISO)
  const need = duration === 'half' ? 30 : 60
  const isToday = dateISO === toISODate(now)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const sundayDealDay = entry.day === '7-ci gün'

  const ranges = entry.ranges
    .map((range) => {
      const [from, to] = range.split('-').map((t) => t.trim())
      return { start: timeToMinutes(from), end: timeToMinutes(to) }
    })
    .sort((a, b) => a.start - b.start)

  const spans = []

  // Gündəlik işə başlamazdən əvvəl (00:00 - ilk aralıq)
  const first = ranges[0]
  if (first.start > 0) {
    spans.push(closedSpan(0, first.start, 'Arena bağlı'))
  }

  ranges.forEach((range, idx) => {
    const cutoff = range.end - SALES_CUTOFF_MINUTES
    const items = []

    for (let t = range.start; t < range.end; t += SLOT_STEP_MINUTES) {
      let state = 'active'
      let reason = ''

      if (isToday && t <= nowMinutes) {
        state = 'disabled'
        reason = 'past'
      } else if (t > cutoff) {
        state = 'disabled'
        reason = 'cutoff'
      } else if (t + need > range.end) {
        state = 'disabled'
        reason = 'nofit'
      }

      items.push({
        minutes: t,
        from: minutesToTime(t),
        state,
        reason,
        // Bazar günü 10:00 - 12:00 arası endirim (pricing.js ilə eyni məntiq)
        sundayDiscount: sundayDealDay && t >= 600 && t <= 720,
      })
    }

    const active = items.filter((i) => i.state === 'active')
    const last = ranges[ranges.length - 1]

    spans.push({
      kind: 'session',
      key: `session-${idx}`,
      label:
        ranges.length === 1
          ? 'Gündəlik sessiya'
          : idx === 0
            ? 'Səhər sessiyası'
            : range === last
              ? 'Axşam sessiyası'
              : `Sessiya ${idx + 1}`,
      from: minutesToTime(range.start),
      to: minutesToTime(range.end),
      cutoff: minutesToTime(cutoff),
      lastStart: active.length ? active[active.length - 1].from : null,
      items,
    })

    const next = ranges[idx + 1]
    if (next) {
      spans.push(
        closedSpan(range.end, next.start, 'Fasilə', 'İş saatları xaricidir')
      )
    }
  })

  const lastRange = ranges[ranges.length - 1]
  if (lastRange.end < 24 * 60) {
    spans.push(closedSpan(lastRange.end, 24 * 60, 'Arena bağlı'))
  }

  const activeItems = spans.flatMap((span) =>
    span.kind === 'session'
      ? span.items.filter((i) => i.state === 'active')
      : []
  )

  return {
    spans,
    hasActive: activeItems.length > 0,
    firstActive: activeItems.length ? activeItems[0].from : null,
    activeStarts: activeItems.map((i) => i.from),
  }
}

function closedSpan(from, to, label, reason = 'İş saatları xaricidir') {
  return {
    kind: 'closed',
    key: `closed-${from}-${to}`,
    label,
    reason,
    from: minutesToTime(from),
    to: minutesToTime(to),
  }
}

/**
 * Seçilmiş tarix üçün müştəriyə ən uyğun aktiv sessiyanı avtomatik seçir.
 * Cari gün üçün əvvəlcə hazırda davam edən, sonra növbəti sessiya götürülür.
 */
export function resolveActiveSession(sessions) {
  const list = Array.isArray(sessions) ? sessions : []
  if (!list.length) return null
  return list[0]
}

/**
 * Sessiyanın faktiki başlama vaxtı. Cari gün üçün sessiya artıq başlayıbsa,
 * indiki an götürülür; gələcək sessiyalar üçün sessiyanın başlanğıcı.
 */
export function effectiveSessionStart(session, dateISO, now = new Date()) {
  if (!session || !session.startTime) return ''
  if (dateISO !== toISODate(now)) return session.startTime
  const start = timeToMinutes(session.startTime)
  const end = timeToMinutes(session.endTime)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  if (nowMinutes < start) return session.startTime
  if (nowMinutes >= end) return session.endTime
  return minutesToTime(nowMinutes)
}

/**
 * Həmin gün üçün bilet satışı bağlıdır?
 * Yalnız CARİ gün üçün qüvvədədir: bağlanmaya 30 dəqiqə qalanda
 * (və ya bağlanandan sonra) həmin günün biletləri avtomatik bağlanır.
 */
export function daySalesClosed() {
  return false
}

/**
 * Cari vaxt üçün buz meydançasının giriş xəbərdarlığı:
 * - İş saatından əvvəl və ya fasilədən əvvəlki son 30 dəq / fasilə zamanı (növbəti seans varsa):
 *   "Hal-hazırda iş saatı deyil. Buz {HH:MM}-də açılacaq."
 * - Günün son bağlanmasına 30 dəq qalmış və ya bağlandıqdan sonra:
 *   "Buza bu gün artıq giriş yoxdur."
 */
export function iceEntryWarning(now = new Date()) {
  const dateISO = toISODate(now)
  const entry = dayEntry(dateISO)
  if (!entry || !entry.ranges?.length) return null

  const ranges = entry.ranges
    .map((range) => {
      const [from, to] = range.split('-').map((t) => t.trim())
      return { start: timeToMinutes(from), end: timeToMinutes(to) }
    })
    .sort((a, b) => a.start - b.start)

  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const first = ranges[0]
  const last = ranges[ranges.length - 1]

  if (nowMinutes < first.start) {
    const openTime = minutesToTime(first.start)
    return {
      kind: 'closed-until',
      nextOpenTime: openTime,
      message: `Hal-hazırda iş saatı deyil. Buz ${openTime}-də açılacaq.`,
    }
  }

  for (let i = 0; i < ranges.length - 1; i++) {
    const curr = ranges[i]
    const next = ranges[i + 1]
    if (nowMinutes >= curr.end - SALES_CUTOFF_MINUTES && nowMinutes < next.start) {
      const openTime = minutesToTime(next.start)
      return {
        kind: 'closed-until',
        nextOpenTime: openTime,
        message: `Hal-hazırda iş saatı deyil. Buz ${openTime}-də açılacaq.`,
      }
    }
  }

  if (nowMinutes >= last.end - SALES_CUTOFF_MINUTES) {
    return {
      kind: 'closed-today',
      nextOpenTime: null,
      message: 'Buza bu gün artıq giriş yoxdur.',
    }
  }

  return null
}

// --- köhnə adlar (geriyə uyğunluq üçün) ---
export { timeToMinutes as toMinutes, minutesToTime as fmtTime }
