import { PRICING } from '../data/pricing'

export const WEEKDAY = 'weekday'
export const WEEKEND = 'weekend'

export function getDayType(date) {
  const d = new Date(`${date}T00:00:00`)
  const day = d.getDay()
  return day === 0 || day === 6 ? WEEKEND : WEEKDAY
}

export function isSundayMorning(date, time) {
  const d = new Date(`${date}T00:00:00`)
  if (d.getDay() !== 0) return false
  const [h, m] = String(time).split(':').map(Number)
  const hour = h + m / 60
  return hour >= 10 && hour <= 12
}

export function getBasePrice(dayType, duration) {
  return PRICING.standard[dayType][duration]
}

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100

const pct = (value, percent) =>
  round2(value - (value * (Number(percent) || 0)) / 100)

const DISCOUNT_KEYS = {
  SHAHEED: 'shaheed',
  QAZI: 'qazi',
  PUSH30: 'push30',
  FAMILY: 'family',
  FIVE_PLUS_ONE: 'fivePlusOne',
  GROUP: 'group',
  STUDENT: 'student',
  SUNDAY_MORNING: 'sunday',
  NONE: 'none',
}

/**
 * Backend `DiscountServiceImpl` ilə eyni qaydalar.
 *
 * Qrup (10+) və 5+1 istifadəçi seçimindən asılı deyil — say avtomatik
 * yoxlanılır. Eyni anda yalnız müştəri üçün ən sərfəli endirim tətbiq olunur.
 * Bu funksiya backend əlçatmaz olduqda fallback kimi istifadə olunur.
 */
export function calculatePrice({
  date,
  time = '12:00',
  duration = 'hour',
  qty = 1,
  merits = {},
}) {
  const dayType = getDayType(date)
  const isHour = duration === 'hour'
  const unit = getBasePrice(dayType, duration)
  const quantity = Math.max(1, Number(qty) || 1)
  const originalPrice = round2(unit * quantity)

  const candidates = []

  const addFree = (type, label, requestedFree) => {
    const freeCount = Math.min(quantity, Math.max(0, Number(requestedFree) || 0))
    const paying = Math.max(0, quantity - freeCount)
    const finalPrice = round2(unit * paying)
    const lines = []
    if (paying > 0) {
      lines.push({
        label: 'Ödənişli giriş',
        each: unit,
        qty: paying,
        total: round2(unit * paying),
      })
    }
    if (freeCount > 0) {
      lines.push({
        label: 'Pulsuz giriş',
        each: 0,
        qty: freeCount,
        total: 0,
      })
    }
    candidates.push({
      type,
      label,
      finalPrice,
      freeCount,
      unitPrice: unit,
      lines,
    })
  }

  const addPercent = (type, label, percent) => {
    const unitPrice = pct(unit, percent)
    const finalPrice = round2(unitPrice * quantity)
    candidates.push({
      type,
      label,
      finalPrice,
      freeCount: 0,
      unitPrice,
      lines: [
        {
          label: 'Endirimli vahid qiymət',
          each: unitPrice,
          qty: quantity,
          total: finalPrice,
        },
      ],
    })
  }

  // 1) Şəhid ailəsi — seçilmiş sayda iştirakçı pulsuz (təsdiq tələb olunur).
  if (merits.shaheed && merits.shaheedVerified) {
    const sCount =
      merits.shaheedCount == null
        ? quantity
        : Math.max(1, Math.min(quantity, Number(merits.shaheedCount) || 1))
    const label =
      sCount === quantity
        ? 'Şəhid ailələri — pulsuz giriş'
        : `Şəhid ailələri — ${sCount}/${quantity} nəfər pulsuz`
    addFree('SHAHEED', label, sCount)
  }

  // 2) Qazi — ilk giriş pulsuz, 2-ci giriş 50%.
  if (merits.qazi && isHour) {
    const visits = Number(merits.qaziVisits)
    if (visits === 0) {
      addFree('QAZI', 'Qazi — ilk giriş pulsuz', 1)
    } else if (visits === 1) {
      addPercent('QAZI', 'Qazi — 2-ci giriş 50% endirim', 50)
    }
  }

  // 3) PUSH30 — 1 saatlıq bilet üçün 1 pulsuz giriş.
  if (merits.push30 && isHour) {
    addFree('PUSH30', 'PUSH30 — premium paket, 1 giriş pulsuz', 1)
  }

  // 4) Ailə — 2+ nəfər olduqda 1 nəfər pulsuz.
  if (merits.family && quantity >= 2) {
    addFree('FAMILY', 'Ailə endirimi — 1 nəfər pulsuz', 1)
  }

  // 5) 5+1 — hər 6 nəfərdən 1-i pulsuz. 12 nəfər = 2 pulsuz.
  if (quantity >= 6) {
    const free = Math.floor(quantity / 6)
    addFree(
      'FIVE_PLUS_ONE',
      `5+1 kampaniyası — ${free} nəfər pulsuz`,
      free
    )
  }

  // 6) Qrup — 10+ nəfər və yalnız 1 saatlıq bilet.
  if (isHour && quantity >= 10) {
    addPercent(
      'GROUP',
      `Qrup endirimi — ${quantity} nəfər, ${PRICING.rules.group.percent}%`,
      PRICING.rules.group.percent
    )
  }

  // 7) Tələbə — yalnız həftəiçi və 1 saatlıq bilet.
  if (merits.student && isHour && dayType === WEEKDAY) {
    const sCount =
      merits.studentCount == null
        ? quantity
        : Math.max(0, Math.min(quantity, Number(merits.studentCount) || 0))
    const pct = PRICING.rules.student.percent
    if (sCount >= quantity) {
      addPercent(
        'STUDENT',
        `Tələbə endirimi — həftəiçi ${pct}%`,
        pct
      )
    } else if (sCount > 0) {
      const studentUnit = roundMoney(unit * (1 - pct / 100))
      const studentTotal = roundMoney(studentUnit * sCount)
      const regularTotal = roundMoney(unit * (quantity - sCount))
      const finalPrice = roundMoney(studentTotal + regularTotal)
      candidates.push({
        type: 'STUDENT',
        label: `Tələbə endirimi — ${sCount}/${quantity} nəfər (${pct}%)`,
        unitPrice: unit,
        freeCount: 0,
        discountAmount: roundMoney(originalPrice - finalPrice),
        finalPrice,
        lines: [
          {
            label: `Tələbə girişi (${pct}% endirim)`,
            quantity: sCount,
            unitPrice: studentUnit,
            total: studentTotal,
          },
          {
            label: 'Standart giriş',
            quantity: quantity - sCount,
            unitPrice: unit,
            total: regularTotal,
          },
        ],
      })
    }
  }

  // 8) Bazar günü 10:00–12:00 arası 1 saatlıq biletə endirim.
  if (isHour && isSundayMorning(date, time)) {
    addPercent(
      'SUNDAY_MORNING',
      `Bazar günü 10:00–12:00 — ${PRICING.rules.sundayMorning.percent}%`,
      PRICING.rules.sundayMorning.percent
    )
  }

  const best = candidates.reduce((current, candidate) => {
    if (!current) return candidate
    if (candidate.finalPrice < current.finalPrice) return candidate
    if (
      candidate.finalPrice === current.finalPrice &&
      candidate.freeCount > 0 &&
      current.freeCount === 0
    ) {
      return candidate
    }
    return current
  }, null)

  const finalPrice = best ? best.finalPrice : originalPrice
  const discountAmount = round2(originalPrice - finalPrice)
  const notes = []
  if (!isHour) {
    notes.push('Yarım saatlıq biletlərə faiz endirimləri tətbiq olunmur.')
  }
  if (quantity >= 10 && !isHour) {
    notes.push('Qrup endirimi yalnız 1 saatlıq biletlərə aiddir.')
  }

  return {
    dayType,
    duration,
    unit,
    unitPrice: best ? best.unitPrice : unit,
    freeCount: best ? best.freeCount : 0,
    freeTickets: best ? best.freeCount : 0,
    applied: best
      ? {
          key: DISCOUNT_KEYS[best.type] || 'none',
          type: best.type,
          label: best.label,
          saved: discountAmount,
        }
      : null,
    appliedDiscountType: best ? best.type : 'NONE',
    appliedDiscountLabel: best ? best.label : 'Endirim yoxdur',
    notes,
    lines: best
      ? best.lines
      : [
          {
            label: 'Standart vahid qiymət',
            each: unit,
            qty: quantity,
            total: originalPrice,
          },
        ],
    baseTotal: originalPrice,
    originalPrice,
    discountAmount,
    finalPrice,
    payable: finalPrice,
    saved: discountAmount,
  }
}

/** Backend `/api/discounts/apply` cavabını UI modelinə çevirir. */
export function priceFromQuote(quote, duration) {
  if (!quote) return null
  const type = quote.appliedDiscountType || 'NONE'
  const hasDiscount = type !== 'NONE'
  const lines = (quote.lines || []).map((line) => ({
    label: line.label,
    each: round2(line.unitPrice),
    qty: line.quantity,
    total: round2(line.total),
  }))

  return {
    dayType: quote.dayType,
    duration,
    unit: round2(Number(quote.originalPrice) / Math.max(1, quote.quantity)),
    unitPrice: round2(quote.unitPrice),
    freeCount: Number(quote.freeTickets) || 0,
    freeTickets: Number(quote.freeTickets) || 0,
    applied: hasDiscount
      ? {
          key: DISCOUNT_KEYS[type] || 'none',
          type,
          label: quote.appliedDiscountLabel,
          saved: round2(quote.discountAmount),
        }
      : null,
    appliedDiscountType: type,
    appliedDiscountLabel: quote.appliedDiscountLabel,
    notes: quote.notes || [],
    lines,
    baseTotal: round2(quote.originalPrice),
    originalPrice: round2(quote.originalPrice),
    discountAmount: round2(quote.discountAmount),
    finalPrice: round2(quote.finalPrice),
    payable: round2(quote.finalPrice),
    saved: round2(quote.discountAmount),
  }
}

export function monthlyPrice(ownSkates = false) {
  const m = PRICING.monthly
  return {
    price: ownSkates ? m.ownSkates : m.standard,
    entries: m.entries,
    ownSkates,
    saved: ownSkates ? m.standard - m.ownSkates : 0,
  }
}
