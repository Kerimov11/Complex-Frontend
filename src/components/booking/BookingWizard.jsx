import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SafetyNotice from '../SafetyNotice'
import TicketCard from './TicketCard'
import { useAuth } from '../../auth/AuthContext'
import { api } from '../../api/client'
import { calculatePrice, priceFromQuote } from '../../utils/pricing'
import { createTicketId, createReference, ticketValidUntil } from '../../utils/ticket'
import {
  saveVoucher,
  loadLastVoucher,
  clearLastVoucher,
  clearVoucher,
} from '../../utils/voucher'
import PaymentModal from './PaymentModal'
import {
  addDaysISO,
  dayNameAZ,
  formatDateAZ,
  formatDurationAZ,
  toISODate,
} from '../../utils/datetime'
import { RULES } from '../../data/config'
import {
  daySalesClosed,
  closingTimeLabel,
  effectiveSessionStart,
  resolveActiveSession,
  salesCutoffLabel,
  sessionEndTime,
} from '../../utils/schedule'

const BENEFITS = [
  {
    key: 'student',
    title: 'Tələbə',
    desc: 'Həftəiçi 1 saatlıq biletə 20%',
  },
  {
    key: 'family',
    title: 'Ailə',
    desc: '2+ nəfər olduqda 1 nəfər pulsuz',
  },
  {
    key: 'push30',
    title: 'PUSH30',
    desc: 'Premium paket — 1 saatlıq 1 pulsuz giriş',
  },
  {
    key: 'qazi',
    title: 'Qazi',
    desc: 'İlk giriş pulsuz, 2-ci giriş 50%',
  },
  {
    key: 'shaheed',
    title: 'Şəhid ailəsi',
    desc: 'Təsdiqlənmiş ailə üçün pulsuz giriş',
  },
]

function durationMinutesOf(duration) {
  return duration === 'half' ? 30 : 60
}

function Step({ num, title }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-ice-400 text-xs font-bold text-night-950">
        {num}
      </span>
      <span className="text-sm font-semibold text-white">{title}</span>
    </div>
  )
}

function backendTime(value) {
  return value ? String(value).slice(0, 5) : ''
}

export default function BookingWizard({ onTicketChange }) {
  const {
    user,
    isAuthenticated,
    isCustomer,
    openAuth,
    verifyAge,
    verifyIdentity,
  } = useAuth()

  const [step, setStep] = useState(1)
  const [error, setError] = useState('')

  const [date, setDate] = useState(addDaysISO(0))
  const [duration, setDuration] = useState('hour')
  const [qty, setQty] = useState(1)
  const [people, setPeople] = useState([{ name: '', age: '', skateSize: '' }])

  const [benefits, setBenefits] = useState({
    student: false,
    family: false,
    push30: false,
    qazi: false,
    shaheed: false,
  })
  const [qaziVisits, setQaziVisits] = useState('0')
  const [shaheedVerified, setShaheedVerified] = useState(false)
  const [agree, setAgree] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [bookingDob, setBookingDob] = useState('')
  const [identityDocumentNumber, setIdentityDocumentNumber] = useState('')
  const [identityConfirmedCheck, setIdentityConfirmedCheck] = useState(false)

  const [ticket, setTicket] = useState(() => loadLastVoucher())
  const [notice, setNotice] = useState('')
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [pendingOrder, setPendingOrder] = useState(null)
  const [paymentError, setPaymentError] = useState('')

  // Backend-dən gələn real seanslar, konki stoku və rezervasiya vəziyyəti
  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [sessionsError, setSessionsError] = useState('')
  const [sessionsReload, setSessionsReload] = useState(0)
  const [skates, setSkates] = useState([])
  const [skatesLoading, setSkatesLoading] = useState(true)
  const [skatesError, setSkatesError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [availability, setAvailability] = useState(null)
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [availabilityError, setAvailabilityError] = useState('')
  const [quote, setQuote] = useState(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  const sessionIdRef = useRef(null)

  useEffect(() => {
    onTicketChange?.(Boolean(ticket))
  }, [ticket, onTicketChange])

  // Cari tarix/saat üçün canlı saat: satış bağlanma qaydasını izləyir
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 20000)
    return () => clearInterval(timer)
  }, [])

  const loadSkates = useCallback(async () => {
    setSkatesLoading(true)
    setSkatesError('')
    try {
      const list = sessionIdRef.current
        ? await api.getSkatesBySession(sessionIdRef.current)
        : await api.getSkates()
      setSkates(Array.isArray(list) ? list : [])
    } catch (err) {
      setSkates([])
      setSkatesError(err?.message || 'Konki məlumatları yüklənmədi.')
    } finally {
      setSkatesLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    setSessionsLoading(true)
    setSessionsError('')

    api
      .getSessionsByDate(date)
      .then((list) => {
        if (!active) return
        const sorted = (Array.isArray(list) ? list : [])
          .slice()
          .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)))
        setSessions(sorted)
        setSessionsLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setSessions([])
        setSessionsError(err?.message || 'Seanslar yüklənmədi.')
        setSessionsLoading(false)
      })

    return () => {
      active = false
    }
  }, [date, sessionsReload])

  const todayISO = toISODate(new Date(now))
  const todayClosed = daySalesClosed(todayISO, new Date(now))
  const dateClosed = daySalesClosed(date, new Date(now))

  const skatesSorted = useMemo(
    () =>
      [...skates].sort(
        (a, b) =>
          Number(a.sortKey ?? parseInt(a.size, 10)) -
          Number(b.sortKey ?? parseInt(b.size, 10))
      ),
    [skates]
  )
  const skatesReady = !skatesLoading && !skatesError && skatesSorted.length > 0

  // Müştəri başlama vaxtı seçmir. Tarix üçün aktiv sessiya avtomatik tapılır
  // və faktiki başlama vaxtı backend qaydalarına uyğun təyin edilir.
  const durationMinutes = durationMinutesOf(duration)
  const backendSession = useMemo(
    () => resolveActiveSession(sessions, date, durationMinutes, new Date(now)),
    [sessions, date, durationMinutes, now]
  )
  const time = useMemo(
    () => effectiveSessionStart(backendSession, date, new Date(now)),
    [backendSession, date, now]
  )
  const hasOpenSlot = Boolean(backendSession)

  const backendReady =
    !sessionsLoading && !sessionsError && Boolean(backendSession)

  // Sosial güzəşt hüquqları. Qrup və 5+1 burada yoxdur — onlar saydan
  // asılı olaraq avtomatik hesablanır.
  const eligibility = useMemo(
    () => ({
      student: benefits.student,
      family: benefits.family,
      push30: benefits.push30,
      qazi: benefits.qazi,
      qaziVisits: benefits.qazi ? Number(qaziVisits) : null,
      shaheed: benefits.shaheed,
      shaheedVerified: benefits.shaheed && shaheedVerified,
    }),
    [benefits, qaziVisits, shaheedVerified]
  )

  const merits = useMemo(
    () => ({
      ...eligibility,
      sunday: true,
      campaign5Plus1: true,
    }),
    [eligibility]
  )

  const localPrice = useMemo(
    () =>
      calculatePrice({
        date,
        time,
        duration,
        qty,
        merits,
      }),
    [date, time, duration, qty, merits]
  )

  const price = useMemo(
    () => priceFromQuote(quote, duration) || localPrice,
    [quote, duration, localPrice]
  )

  // Seçilmiş slot üçün backend-in dinamik mövcudluq cavabı.
  useEffect(() => {
    let active = true
    if (!backendSession?.id || !time) {
      setAvailability(null)
      setAvailabilityLoading(false)
      setAvailabilityError('')
      return undefined
    }

    setAvailabilityLoading(true)
    setAvailabilityError('')
    api
      .getSessionAvailability(backendSession.id, {
        startTime: time,
        durationMinutes,
      })
      .then((data) => {
        if (!active) return
        setAvailability(data)
        setAvailabilityLoading(false)
      })
      .catch((err) => {
        if (!active) return
        setAvailability(null)
        setAvailabilityError(err?.message || 'Sessiya mövcudluğu yoxlanmadı.')
        setAvailabilityLoading(false)
      })

    return () => {
      active = false
    }
  }, [backendSession?.id, time, durationMinutes])

  // Backend qiymət mühərriki. O, qrup/5+1 endirimlərini avtomatik seçir.
  useEffect(() => {
    let active = true
    if (!backendSession?.id || !date || !time) {
      setQuote(null)
      setQuoteLoading(false)
      setQuoteError('')
      return undefined
    }

    setQuote(null)
    setQuoteLoading(true)
    setQuoteError('')

    const timer = setTimeout(() => {
      api
        .calculateDiscount({
          sessionId: backendSession.id,
          date,
          startTime: time,
          durationMinutes,
          quantity: qty,
          ...eligibility,
        })
        .then((data) => {
          if (!active) return
          setQuote(data)
          setQuoteLoading(false)
        })
        .catch((err) => {
          if (!active) return
          setQuote(null)
          setQuoteError(err?.message || 'Qiymət alınmadı.')
          setQuoteLoading(false)
        })
    }, 250)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [backendSession?.id, date, time, durationMinutes, qty, eligibility])

  // Hər seans üçün ayrıca konki stoku.
  useEffect(() => {
    sessionIdRef.current = backendSession?.id || null
    loadSkates()
  }, [backendSession?.id, loadSkates])

  const canContinue =
    hasOpenSlot &&
    backendReady
  const continueBlockReason = !hasOpenSlot
    ? 'Bu tarix üçün aktiv sessiya tapılmadı.'
    : sessionsLoading
      ? 'Seanslar yüklənir…'
      : sessionsError
        ? `${sessionsError}`
        : sessions.length === 0
          ? 'Bu tarix üçün seans yoxdur - başqa gün seçin.'
          : !backendSession
            ? 'Aktiv sessiya tapılmadı.'
            : ''

  // Biletin etibarlılıq müddəti bitdikdə ekrandan/sistemdən avtomatik silinməsi
  useEffect(() => {
    if (!ticket) return undefined
    const check = () => {
      const validUntil = ticketValidUntil(ticket)
      if (validUntil !== null && Date.now() >= validUntil) {
        // Bilet backend-də saxlanılır və "Biletlərim" tarixçəsində qalır.
        if (ticket.id) {
          try {
            localStorage.removeItem(`ha_reservation_${ticket.id}`)
          } catch {
            // ignore
          }
        }
        clearVoucher(ticket.id)
        setTicket(null)
        setStep(1)
        setNotice(
          'Biletinizin etibarlılıq müddəti bitdi və sistemdən silindi. Yeni bilet ala bilərsiniz.'
        )
      }
    }
    check()
    const timer = setInterval(check, 15000)
    return () => clearInterval(timer)
  }, [ticket, loadSkates])

  // Başqa hesaba aid bilet bu brauzerdə göstərilməsin.
  useEffect(() => {
    if (!ticket || !user?.userId || !ticket.userId) return
    if (String(ticket.userId) === String(user.userId)) return

    if (ticket.id) {
      try {
        localStorage.removeItem(`ha_reservation_${ticket.id}`)
      } catch {
        // ignore
      }
    }
    clearVoucher(ticket.id)
    setTicket(null)
    setStep(1)
    setNotice(
      'Bu bilet başqa hesaba aid olduğu üçün göstərilmir. Yeni bilet ala bilərsiniz.'
    )
  }, [ticket, user?.userId])

  useEffect(() => {
    setPeople((prev) => {
      const next = prev.slice(0, qty)
      while (next.length < qty) {
        next.push({ name: '', age: '', skateSize: '' })
      }
      return next
    })
  }, [qty])

  // Backend stoku dəyişdikdə artıq mövcud olmayan ölçü seçimini sıfırla.
  useEffect(() => {
    if (skatesSorted.length === 0) return
    setPeople((prev) =>
      prev.map((person) => {
        if (!person.skateSize) return person
        const exists = skatesSorted.some(
          (skate) => String(skate.size) === String(person.skateSize)
        )
        return exists ? person : { ...person, skateSize: '' }
      })
    )
  }, [skatesSorted])

  const setPerson = (i, patch) =>
    setPeople((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)))

  const toggleBenefit = (key) =>
    setBenefits((prev) => ({ ...prev, [key]: !prev[key] }))

  const ageValid = people.every((p) => Number(p.age) >= 4)
  const sizesValid = people.every((p) => String(p.skateSize).trim() !== '')

  const discountHint = useMemo(() => {
    if (benefits.shaheed && !shaheedVerified)
      return 'Şəhid ailəsi güzəşti üçün vəsiqənin təsdiqini qeyd edin.'
    if (benefits.qazi && Number(qaziVisits) >= 2)
      return 'Qazi güzəşti yalnız ilk iki girişə aiddir.'
    if (benefits.student && duration === 'half')
      return 'Tələbə endirimi yalnız 1 saatlıq biletlərə tətbiq olunur.'
    if (benefits.student && price.dayType !== 'weekday')
      return 'Tələbə endirimi yalnız həftəiçi keçərlidir.'
    if (benefits.family && qty < 2)
      return 'Ailə endirimi üçün ən az 2 nəfər lazımdır.'
    if (benefits.push30 && duration === 'half')
      return 'PUSH30 yalnız 1 saatlıq biletlərə tətbiq olunur.'
    return ''
  }, [benefits, shaheedVerified, qaziVisits, qty, duration, price.dayType])

  function buildOrder({ ageVerifiedOverride, isAdultOverride } = {}) {
    if (daySalesClosed(date)) {
      setError(
        `${formatDateAZ(date)} tarixi üçün bilet satışı bağlanıb. Zəhmət olmasa başqa gün seçin.`
      )
      return null
    }
    if (!backendSession || !time) {
      setError(
        'Bu tarix üçün aktiv sessiya avtomatik tapılmadı. Zəhmət olmasa başqa gün və ya müddət seçin.'
      )
      return null
    }
    if (!agree) {
      setError('Zəhmət olmasa yaş məhdudiyyəti barədə xəbərdarlığı təsdiq edin.')
      return null
    }
    if (!agreeTerms) {
      setError(
        'Zəhmət olmasa istifadə şərtləri, qaydalar və müştəri öhdəlikləri ilə tanış olduğunuzu təsdiq edin.'
      )
      return null
    }
    if (!ageValid) {
      setError('4 yaşından kiçik uşaqların buza girişi qadağandır.')
      return null
    }
    if (!sizesValid) {
      setError('Hər iştirakçı üçün konki ölçüsünü (razmer) qeyd edin.')
      return null
    }
    if (!isAuthenticated || !user?.userId) {
      setError('Bilet almaq və konki rezerv etmək üçün əvvəlcə hesabınıza daxil olun.')
      openAuth('login')
      return null
    }
    if (isCustomer) {
      const effectiveAgeVerified = ageVerifiedOverride ?? user?.ageVerified
      const effectiveIsAdult = isAdultOverride ?? user?.isAdult
      if (!effectiveAgeVerified) {
        setError('Bilet almaq üçün əvvəlcə yaşınızı təsdiqləyin.')
        return null
      }
      if (effectiveIsAdult === false) {
        setError('18 yaşdan kiçik şəxslər bilet ala bilməz.')
        return null
      }
    }
    if (sessionsLoading) {
      setError('Seanslar hələ yüklənməyib. Bir neçə saniyə sonra yenidən cəhd edin.')
      return null
    }
    if (sessionsError) {
      setError(`${sessionsError}`)
      return null
    }
    if (!backendSession) {
      setError('Seçilmiş tarix və müddət üçün aktiv sessiya tapılmadı. Başqa gün və ya müddət seçin.')
      return null
    }
    if (availabilityLoading) {
      setError('Sessiya vaxtı yoxlanılır. Bir neçə saniyə sonra yenidən cəhd edin.')
      return null
    }
    if (availability?.salesOpen === false) {
      setError(
        availability.message ||
          'Sessiyanın bağlanmasına 30 dəqiqədən az qalıb; bilet satışı dayandırılıb.'
      )
      return null
    }
    if (availability?.requestedDurationAvailable === false) {
      setError(
        availability.message ||
          'Seçilmiş müddət üçün kifayət qədər vaxt yoxdur.'
      )
      return null
    }
    if (!skatesReady) {
      setError('Konki stoku yüklənməyib. Zəhmət olmasa bir az sonra yenidən cəhd edin.')
      return null
    }

    const skatesBySize = new Map(
      skatesSorted.map((skate) => [String(skate.size), skate])
    )
    const needBySize = new Map()

    for (const person of people) {
      const size = String(person.skateSize).trim()
      const skate = skatesBySize.get(size)
      if (!skate) {
        setError(`Konki razmeri ${size} stokda yoxdur.`)
        return null
      }
      needBySize.set(size, (needBySize.get(size) || 0) + 1)
    }

    for (const [size, count] of needBySize.entries()) {
      const skate = skatesBySize.get(size)
      if (Number(skate.availableQuantity) < count) {
        setError(
          `${size} ölçüdə kifayət qədər konki yoxdur (mövcud: ${skate.availableQuantity}, tələb: ${count}).`
        )
        return null
      }
    }

    const endTime = sessionEndTime(time, duration)
    const next = {
      id: createTicketId(),
      reference: createReference(),
      createdAt: Date.now(),
      // Bilet limitsizdir — turniketdə skan edilib təsdiqlənənədək vaxtı bitmir
      validUntil: null,
      session: {
        date,
        time,
        endTime,
        duration,
        durationMinutes,
      },
      people: people.map((p, i) => ({
        name: p.name.trim(),
        age: Number(p.age),
        skateSize: p.skateSize.trim(),
        free: i < price.freeCount,
      })),
      price: {
        ...price,
        originalPrice: Number(price.originalPrice ?? price.baseTotal ?? 0),
        discountAmount: Number(price.discountAmount ?? price.saved ?? 0),
        appliedDiscountType: price.appliedDiscountType || 'NONE',
        finalPrice: Number(price.finalPrice ?? price.payable ?? 0),
      },
      discountNote: price.applied ? price.applied.label : null,
    }

    return { next, skatesBySize }
  }

  async function handleCheckout() {
    if (submitting) return
    setError('')
    setPaymentError('')

    let currentAgeVerified = Boolean(user?.ageVerified)
    let currentIsAdult = Boolean(user?.isAdult)
    let currentIdentityConfirmed = Boolean(user?.identityConfirmed)

    if (isAuthenticated && isCustomer && !currentAgeVerified) {
      if (!bookingDob) {
        setError('Bilet almaq üçün doğum tarixinizi qeyd edin (18+ tələbi).')
        return
      }
      setSubmitting(true)
      try {
        const ageRes = await verifyAge(bookingDob)
        currentAgeVerified = Boolean(ageRes?.ageVerified)
        currentIsAdult = Boolean(ageRes?.isAdult)
        if (!currentIsAdult) {
          setSubmitting(false)
          setError('18 yaşdan kiçik şəxslər onlayn bilet ala bilməz.')
          return
        }
      } catch (err) {
        setSubmitting(false)
        setError(err?.message || 'Yaş təsdiqi aparıla bilmədi.')
        return
      }
      setSubmitting(false)
    }

    if (
      isAuthenticated &&
      isCustomer &&
      currentIsAdult &&
      !currentIdentityConfirmed
    ) {
      const documentNumber = identityDocumentNumber.replace(/[^A-Za-z0-9]/g, '')
      if (documentNumber.length < 5) {
        setError('Şəxsiyyət vəsiqəsinin seriya və nömrəsini qeyd edin.')
        return
      }
      if (!identityConfirmedCheck) {
        setError('18+ yaş və şəxsiyyət vəsiqəsi təsdiqini işarələyin.')
        return
      }

      setSubmitting(true)
      try {
        await verifyIdentity({
          identityDocumentNumber: documentNumber,
          confirmed: true,
        })
        currentIdentityConfirmed = true
      } catch (err) {
        setSubmitting(false)
        setError(err?.message || 'Şəxsiyyət vəsiqəsi təsdiqlənmədi.')
        return
      }
      setSubmitting(false)
    }

    const order = buildOrder({
      ageVerifiedOverride: currentAgeVerified,
      isAdultOverride: currentIsAdult,
    })
    if (!order) return

    if (Number(order.next.price.payable) <= 0) {
      finalizeOrder(order, null)
      return
    }

    setPendingOrder(order)
    setPaymentOpen(true)
  }

  async function finalizeOrder(order, paymentInfo) {
    if (!order) return { ok: false }

    const { next, skatesBySize } = order
    setSubmitting(true)
    setPaymentError('')

    const created = []
    let paymentRecord = null

    try {
      for (const person of next.people) {
        const skate = skatesBySize.get(String(person.skateSize))
        const createdReservation = await api.createReservation({
          userId: user.userId,
          sessionId: backendSession.id,
          skateId: skate.id,
          startTime: next.session.time,
          durationMinutes: next.session.durationMinutes,
          voucherCode: next.id,
          participantName: person.name,
          participantAge: person.age,
        })

        if (!createdReservation?.id) {
          throw new Error('Rezervasiya yaradıla bilmədi')
        }

        created.push({
          id: createdReservation.id,
          skateId: createdReservation.skate?.id ?? skate.id,
          skateSize: createdReservation.skate?.size ?? skate.size,
          timerExpiresAt: createdReservation.timerExpiresAt,
          extensionCount: createdReservation.extensionCount ?? 0,
          reservationExtensionCount:
            createdReservation.reservationExtensionCount ??
            createdReservation.extensionCount ??
            0,
          status: createdReservation.status,
        })
      }

      if (Number(next.price.payable) > 0) {
        paymentRecord = await api.createPayment({
          amount: Math.round(Number(next.price.payable) * 100) / 100,
          reference: next.reference,
          reservationIds: created.map((reservation) => reservation.id),
          date: next.session.date,
          startTime: next.session.time,
          durationMinutes: next.session.durationMinutes,
          student: eligibility.student,
          family: eligibility.family,
          push30: eligibility.push30,
          qazi: eligibility.qazi,
          qaziVisits: eligibility.qaziVisits,
          shaheed: eligibility.shaheed,
          shaheedVerified: eligibility.shaheedVerified,
        })

        if (!paymentRecord?.transactionId) {
          throw new Error('Ödəniş yaradıla bilmədi')
        }

        const paid = await api.payPayment(paymentRecord.transactionId)
        if (paid?.status !== 'SUCCESS') {
          throw new Error('Ödəniş təsdiqlənmədi')
        }
        paymentRecord = paid
      }
    } catch (err) {
      // Çoxnəfərli sifarişin bir hissəsi yaradılıbsa, konki stokunu
      // geri qaytarmaq üçün yaradılan rezervasiyaları ləğv edirik.
      await Promise.allSettled(
        created.map((reservation) => api.cancelReservation(reservation.id))
      )
      if (paymentRecord?.transactionId) {
        await api.failPayment(paymentRecord.transactionId).catch(() => {})
      }
      if (err?.status === 401 || err?.status === 403) {
        setPaymentOpen(false)
        setPendingOrder(null)
        openAuth('login')
      }
      const message = `Ödəniş və ya rezervasiya alınmadı: ${(err?.message || 'naməlum xəta').replace(
        /[.!?]+$/,
        ''
      )}. Zəhmət olmasa yenidən cəhd edin.`
      setError(message)
      setPaymentError(message)
      setSubmitting(false)
      await loadSkates()
      return { ok: false, error: message }
    }

    const finalTicket = {
      ...next,
      userId: user.userId,
      backendSession: {
        id: backendSession.id,
        startTime: backendSession.startTime,
        endTime: backendSession.endTime,
      },
      backendReservations: created,
      payment: paymentRecord
        ? {
            id: paymentRecord.id,
            transactionId: paymentRecord.transactionId,
            reference: paymentRecord.reference,
            amount: paymentRecord.amount,
            status: paymentRecord.status,
            last4: paymentInfo?.last4 || null,
            holder: paymentInfo?.holder || null,
          }
        : { status: 'FREE' },
    }

    saveVoucher(finalTicket)
    setTicket(finalTicket)
    setNotice('')
    setPaymentOpen(false)
    setPendingOrder(null)
    setPaymentError('')
    setStep(3)
    setSubmitting(false)
    loadSkates()
    return { ok: true }
  }

  function handlePayment(paymentInfo) {
    if (!pendingOrder) return
    finalizeOrder(pendingOrder, paymentInfo)
  }

  function closePayment() {
    if (submitting) return
    setPaymentOpen(false)
    setPendingOrder(null)
    setPaymentError('')
  }

  async function resetBooking() {
    if (submitting) return

    const currentTicket = ticket

    if (currentTicket?.id) {
      try {
        localStorage.removeItem(`ha_reservation_${currentTicket.id}`)
      } catch {
        // ignore
      }
      clearVoucher(currentTicket.id)
    } else {
      clearLastVoucher()
    }

    setTicket(null)
    setStep(1)
    setError('')
    setAgree(false)
    setAgreeTerms(false)
    setIdentityDocumentNumber('')
    setIdentityConfirmedCheck(false)
    setBenefits({
      student: false,
      family: false,
      push30: false,
      qazi: false,
      shaheed: false,
    })
    setQaziVisits('0')
    setShaheedVerified(false)
    setSubmitting(false)
    setPaymentOpen(false)
    setPendingOrder(null)
    setPaymentError('')
    setQuote(null)
    setNotice(
      'Yeni sifariş üçün hazırsınız. Əvvəlki biletləriniz "Biletlərim" bölməsində saxlanılır.'
    )
  }

  if (ticket) {
    return (
      <div className="space-y-6">
        <TicketCard ticket={ticket} />

        <div className="glass-strong rounded-xl border border-ice-300/30 p-6">
          <p className="font-display text-lg font-bold text-white">
            Konki rezervasiyasını nə vaxt aktivləşdirməliyəm?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-frost/65">
            Bilet alındıqdan sonra 10 dəqiqəlik konki taymeri avtomatik
            başlamır. Arenaya yaxınlaşdıqda <b className="text-ice-100">Biletlərim</b>{' '}
            bölməsinə keçin və konki rezervasiyasını əl ilə aktivləşdirin.
            İlk aktivləşdirmə də daxil olmaqla maksimum 2 cəhd mümkündür.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/biletlerim" className="btn-primary">
              Biletlərimə keç
            </Link>
            <button type="button" onClick={resetBooking} className="btn-ghost">
              Yeni bilet al
            </button>
          </div>
        </div>

        <div className="glass space-y-3 rounded-lg p-5 text-sm text-frost/70">
          <p className="font-display font-bold text-white">
            Konki rezervasiyası necə işləyir?
          </p>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-ice-200">1.</span>
              Ödənişdən sonra biletiniz qüvvəyə minir, amma konki stoku hələ
              tutulmur.
            </li>
            <li className="flex gap-2">
              <span className="text-ice-200">2.</span>
              Arenaya gəldiyiniz an "Biletlərim" bölməsindən taymeri
              aktivləşdirin. Konkilər yalnız o zaman stokdan çıxılır.
            </li>
            <li className="flex gap-2">
              <span className="text-ice-200">3.</span>
              Taymer 10 dəqiqədir. Konki təhvil verilməzsə, stok avtomatik
              geri qaytarılır. Maksimum 2 aktivləşdirmə cəhdi var.
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mx-auto mb-10 flex max-w-3xl items-center justify-center gap-8">
        <Step num={1} title="Sessiya" />
        <div
          className={`h-px flex-1 ${step >= 2 ? 'bg-ice-300' : 'bg-white/15'}`}
        />
        <Step num={2} title="İştirakçılar" />
        <div
          className={`h-px flex-1 ${step >= 3 ? 'bg-ice-300' : 'bg-white/15'}`}
        />
        <Step num={3} title="Bilet" />
      </div>

      {step === 1 && (
        <div className="mx-auto max-w-3xl space-y-5">
          {notice && (
            <div className="flex items-start gap-3 rounded-lg border border-ice-300/40 bg-ice-400/12 p-4">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ice-400/20 text-ice-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-relaxed text-ice-100">
                  {notice}
                </p>
                <button
                  type="button"
                  onClick={() => setNotice('')}
                  className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-frost/50 transition-colors hover:text-white"
                >
                  Bağla
                </button>
              </div>
            </div>
          )}

          {todayClosed && (
            <div className="flex items-start gap-3 rounded-lg border border-red-400/40 bg-red-500/12 p-4 sm:p-5">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-red-500/25 text-red-100 ring-1 ring-red-300/40">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-red-100">
                  {formatDateAZ(todayISO)} tarixi üçün bilet satışı avtomatik
                  bağlanıb
                </p>
                <p className="mt-1 text-xs leading-relaxed text-red-100/75">
                  Arenanın bağlanma vaxtı {closingTimeLabel(todayISO)}-dir.
                  Bağlanmaya 30 dəqiqə qalıbdan ({salesCutoffLabel(todayISO)})
                  sonra həmin gün üçün bilet satışı dayandırılır. Tarix avtomatik
                  olaraq sabaha keçirildi.
                </p>
              </div>
            </div>
          )}

          <div className="glass rounded-xl p-6 sm:p-8">
            <p className="font-display font-bold text-white">Tarix seçin</p>
            <input
              type="date"
              value={date}
              min={todayClosed ? addDaysISO(1) : addDaysISO(0)}
              onChange={(e) => setDate(e.target.value)}
              className="mt-3 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-ice-300/60"
            />
            <div className="mt-2 text-xs text-frost/55">
              {dayNameAZ(date)}, {formatDateAZ(date)}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs">
              {sessionsLoading ? (
                <span className="text-frost/60">Seanslar yüklənir…</span>
              ) : sessionsError ? (
                <>
                  <span className="font-semibold text-amber-200">
                    {sessionsError}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSessionsReload((v) => v + 1)}
                    className="font-bold uppercase tracking-wider text-ice-200 transition-colors hover:text-white"
                  >
                    Yenidən cəhd et
                  </button>
                </>
              ) : sessions.length === 0 ? (
                <span className="font-semibold text-amber-200">
                  Bu tarix üçün seans yoxdur.
                </span>
              ) : (
                <>
                  <span className="text-frost/65">
                    Giriş: <b className="text-white">İş saatları içində istənilən vaxt</b> (qeyri-məhdud)
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 font-display font-bold text-white">
              Vaxt və müddət
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-frost/50">
                  Müddət
                </p>
                <div className="mt-2 flex gap-2">
                  {[
                    { k: 'half', label: 'Yarım saat' },
                    { k: 'hour', label: '1 saat' },
                  ].map((d) => (
                    <button
                      key={d.k}
                      type="button"
                      onClick={() => setDuration(d.k)}
                      className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                        duration === d.k
                          ? 'bg-ice-400 text-night-950'
                          : 'bg-white/[0.06] text-frost/70 hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-frost/50">
                  Nəfər sayı
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty((v) => Math.max(1, v - 1))}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] font-bold text-white hover:bg-white/10"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-16 rounded-lg bg-white/[0.06] py-1 text-center font-display text-2xl font-bold text-white outline-none focus:ring-1 focus:ring-ice-300"
                  />
                  <button
                    type="button"
                    onClick={() => setQty((v) => v + 1)}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] font-bold text-white hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-ice-300/30 bg-ice-400/10 p-4 sm:p-5">
              <p className="font-display font-bold text-white">
                Sərbəst giriş biletləri
              </p>
              <p className="mt-1 text-xs leading-relaxed text-frost/70">
                Biletiniz qeyri-məhdud müddətlidir — saat seçimi yoxdur. QR kod təsdiqlənmədiyi müddətcə istədiyiniz gün və iş saatında gəlib buza daxil ola bilərsiniz. Vaxt yalnız turniketdən keçdikdən sonra aktivləşir.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {!canContinue && (
              <p className="text-right text-xs font-semibold text-amber-200">
                {continueBlockReason}
              </p>
            )}
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => setStep(2)}
              className={`btn-primary ${
                canContinue ? '' : 'cursor-not-allowed opacity-50'
              }`}
            >
              Davam et
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <div className="glass rounded-xl p-4 sm:p-8">
              <div className="mb-4">
                <SafetyNotice compact />
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs">
                {skatesLoading ? (
                  <span className="text-frost/60">Konki stoku yüklənir…</span>
                ) : skatesError ? (
                  <>
                    <span className="font-semibold text-amber-200">
                      Konki stoku əlçatmazdır: {skatesError}
                    </span>
                    <button
                      type="button"
                      onClick={loadSkates}
                      className="font-bold uppercase tracking-wider text-ice-200 transition-colors hover:text-white"
                    >
                      Yenidən cəhd et
                    </button>
                  </>
                ) : (
                  <span className="text-frost/65">
                    Stok:{' '}
                    <b className="text-white">
                      {skatesSorted.filter(
                        (s) => Number(s.availableQuantity) > 0
                      ).length}{' '}
                      ölçü
                    </b>{' '}
                    mövcuddur. Ölçü seçiminiz birbaşa konki rezervasiyasına
                    bağlanır.
                  </span>
                )}
              </div>

              <p className="font-display font-bold text-white">
                İştirakçılar ({qty} nəfər)
              </p>
              <p className="mt-1 text-xs text-frost/55">
                Yaş 4-dən aşağı olmamalıdır. Hər kəs üçün konki ölçüsünü
                (razmer) qeyd edin.
              </p>

              <div className="mt-4 space-y-3">
                {people.map((p, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[minmax(0,1fr)_52px_76px] items-end gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-2 sm:grid-cols-[auto_1fr_110px_130px] sm:gap-3 sm:p-4"
                  >
                    <span className="hidden h-9 w-9 self-center place-items-center rounded-xl bg-ice-400/15 font-display text-sm font-bold text-ice-200 sm:grid">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-frost/40">
                        <span className="sm:hidden">{i + 1}. Ad Soyad</span>
                        <span className="hidden sm:inline">Ad və soyad</span>
                      </p>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => setPerson(i, { name: e.target.value })}
                        placeholder="Ad və soyad yazın"
                        className="w-full min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2.5 text-sm text-white placeholder-frost/30 outline-none focus:border-ice-300/60 sm:px-3.5"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-frost/40">
                        Yaş*
                      </p>
                      <input
                        type="number"
                        value={p.age}
                        min="4"
                        onChange={(e) => setPerson(i, { age: e.target.value })}
                        placeholder="4+"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2.5 text-xs text-white placeholder-frost/30 outline-none focus:border-ice-300/60 sm:px-3 sm:text-sm"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-frost/40">
                        <span className="sm:hidden">Ölçü*</span>
                        <span className="hidden sm:inline">Konki razmeri*</span>
                      </p>
                      <select
                        value={p.skateSize}
                        onChange={(e) => setPerson(i, { skateSize: e.target.value })}
                        disabled={!skatesReady}
                        className={`w-full appearance-none rounded-xl border px-2 py-2.5 text-xs outline-none transition-colors sm:px-3 sm:text-sm ${
                          !skatesReady
                            ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-frost/35'
                            : p.skateSize
                              ? 'border-ice-300/40 bg-white/[0.06] text-white'
                              : 'border-white/10 bg-white/[0.04] text-frost/50'
                        }`}
                      >
                        <option value="" className="text-night-950">
                          {skatesLoading
                            ? 'Yüklənir…'
                            : skatesError
                              ? 'Əlçatmır'
                              : 'Seçin'}
                        </option>
                        {skatesSorted.map((skate) => {
                          const available = Number(skate.availableQuantity) || 0
                          return (
                            <option
                              key={skate.id}
                              value={skate.size}
                              disabled={available <= 0}
                              className="text-night-950"
                            >
                              {skate.size}
                              {available <= 0
                                ? ' — bitib'
                                : ` — ${available} ədəd`}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {!ageValid && qty > 0 && (
                <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-200">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                  4 yaşından kiçik uşaqlar üçün bilet mümkün deyil.
                </p>
              )}

              <div className="mt-5 flex items-start gap-3 rounded-lg border border-amber-300/30 bg-amber-400/10 p-4">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-amber-300"
                />
                <label
                  htmlFor="agree"
                  className="cursor-pointer text-sm text-amber-100/90"
                >
                  Təsdiq edirəm ki, bütün iştirakçılar 4 yaşdan böyükdür və
                  4 yaşından kiçik uşaqların buza girişinin qadağan olduğunu
                  bilirəm.
                </label>
              </div>
            </div>

            <div className="glass rounded-xl p-6 sm:p-8">
              <p className="font-display font-bold text-white">
                Endirimlər avtomatik tətbiq olunur
              </p>
              <p className="mt-1 text-xs leading-relaxed text-frost/55">
                Qrup (10+ nəfər) və 5+1 endirimləri seçim tələb etmir. Sistem
                eyni anda yalnız müştəri üçün ən sərfəli endirimi seçir.
              </p>

              <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-white">5+1 kampaniyası</span>
                  <span
                    className={`text-right text-xs font-bold ${
                      qty >= 6 ? 'text-emerald-300' : 'text-frost/50'
                    }`}
                  >
                    {qty >= 6
                      ? `${Math.floor(qty / 6)} nəfər pulsuz`
                      : '6 nəfərdən başlayır'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-white">Qrup endirimi</span>
                  <span
                    className={`text-right text-xs font-bold ${
                      qty >= 10 && duration === 'hour'
                        ? 'text-emerald-300'
                        : 'text-frost/50'
                    }`}
                  >
                    {qty >= 10 && duration === 'hour'
                      ? `20% endirim (${qty} nəfər)`
                      : qty >= 10
                        ? 'Yalnız 1 saatlıq biletlərə'
                        : '10 nəfərdən başlayır'}
                  </span>
                </div>
                {price.applied && (
                  <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-2 text-sm">
                    <span className="font-semibold text-ice-200">
                      {price.applied.label}
                    </span>
                    <span className="shrink-0 font-bold text-emerald-300">
                      -{Math.round(Number(price.discountAmount) * 100) / 100} AZN
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-5 font-display font-bold text-white">
                Sosial güzəşt hüququnuz var?
              </p>
              <p className="mt-1 text-xs text-frost/55">
                Yalnız sizə aid olan güzəştləri qeyd edin. Təsdiq sənədləri
                girişdə tələb oluna bilər.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {BENEFITS.map((d) => (
                  <label
                    key={d.key}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${
                      benefits[d.key]
                        ? 'border-ice-300/70 bg-ice-400/15'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(benefits[d.key])}
                      onChange={() => toggleBenefit(d.key)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-ice-300"
                    />
                    <span className="min-w-0">
                      <span className="block font-bold text-white">{d.title}</span>
                      <span className="mt-1 block text-xs text-frost/60">
                        {d.desc}
                      </span>
                    </span>
                  </label>
                ))}
              </div>

              {benefits.shaheed && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <input
                    type="checkbox"
                    id="shaheed"
                    checked={shaheedVerified}
                    onChange={(e) => setShaheedVerified(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-ice-300"
                  />
                  <label htmlFor="shaheed" className="text-sm text-frost/75">
                    Şəhidlik vəsiqəsi qeydiyyatda təsdiq olunub. Bu sənəd
                    girişdə də tələb olunur.
                  </label>
                </div>
              )}

              {benefits.qazi && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-frost/75">
                    Bu sənədki gəlişlər sayı:
                  </p>
                  <select
                    value={qaziVisits}
                    onChange={(e) => setQaziVisits(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="0" className="text-night-950">
                      İlk giriş (pulsuz)
                    </option>
                    <option value="1" className="text-night-950">
                      2-ci giriş (50% endirim)
                    </option>
                    <option value="2" className="text-night-950">
                      3+ (standart)
                    </option>
                  </select>
                </div>
              )}

              {discountHint && (
                <p className="mt-4 text-sm font-semibold text-amber-200">
                  {discountHint}
                </p>
              )}

              {quoteError && (
                <p className="mt-4 text-xs font-semibold text-amber-200">
                  Qiymət alınmadı; ehtiyat hesablama göstərilir:{' '}
                  {quoteError}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="btn-ghost">
                Geri
              </button>
            </div>
          </div>

          <div className="h-fit lg:sticky lg:top-24">
            <div className="glass-strong rounded-xl p-6">
              <p className="font-display text-sm font-bold uppercase tracking-wider text-ice-200">
                Sifariş yekunu
              </p>

              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-frost/70">
                  <span>Tarix</span>
                  <span className="font-semibold text-white">
                    {formatDateAZ(date)}
                  </span>
                </div>
                <div className="flex justify-between text-frost/70">
                  <span>Vaxt</span>
                  <span className="font-semibold text-white">
                    {backendTime(time)} - {time ? sessionEndTime(time, duration) : ''}
                  </span>
                </div>
                <div className="flex justify-between text-frost/70">
                  <span>Müddət</span>
                  <span className="font-semibold text-white">
                    {formatDurationAZ(duration)}
                  </span>
                </div>
                <div className="flex justify-between text-frost/70">
                  <span>Nəfər</span>
                  <span className="font-semibold text-white">{qty}</span>
                </div>
                <div className="flex justify-between text-frost/70">
                  <span>Orijinal məbləğ</span>
                  <span className="font-semibold text-white">
                    {Math.round(Number(price.baseTotal ?? 0) * 100) / 100} AZN
                  </span>
                </div>
                <div className="flex justify-between text-frost/70">
                  <span>Vahid qiymət</span>
                  <span className="font-semibold text-white">
                    {price.unitPrice} AZN
                  </span>
                </div>
                {price.freeCount > 0 && (
                  <div className="flex justify-between font-semibold text-emerald-300">
                    <span>Pulsuz</span>
                    <span>{price.freeCount} nəfər</span>
                  </div>
                )}
                {price.applied && (
                  <div className="flex justify-between text-ice-200">
                    <span>Endirim</span>
                    <span className="text-right">
                      -{Math.round(Number(price.saved ?? 0) * 100) / 100} AZN
                    </span>
                  </div>
                )}

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-frost/45">
                    Hesablama
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {(price.lines || []).map((line, index) => (
                      <div
                        key={`${line.label}-${index}`}
                        className="flex justify-between gap-3 text-xs text-frost/65"
                      >
                        <span>
                          {line.label} × {line.qty}
                        </span>
                        <span className="shrink-0 font-semibold text-white">
                          {Math.round(Number(line.total) * 100) / 100} AZN
                        </span>
                      </div>
                    ))}
                    {quoteLoading && (
                      <p className="text-[11px] text-frost/45">
                        Qiymət yoxlanılır…
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-dashed border-white/20 pt-4">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-frost/60">Ödəniləcək</span>
                  <span className="font-display text-3xl font-bold text-white">
                    {price.payable === 0
                      ? 'Pulsuz'
                      : `${Math.round(price.payable * 100) / 100} AZN`}
                  </span>
                </div>
                {(price.notes || []).map((note) => (
                  <p key={note} className="mt-2 text-xs text-frost/50">
                    {note}
                  </p>
                ))}
              </div>

              {!isAuthenticated && (
                <p className="mt-5 rounded-xl border border-ice-300/25 bg-ice-400/10 px-4 py-3 text-xs leading-relaxed text-frost/65">
                  Konki rezervasiyası avtomatik yaradılacaq.{' '}
                  <button
                    type="button"
                    onClick={() => openAuth('login')}
                    className="font-bold text-ice-200 underline decoration-ice-300/40 underline-offset-4 hover:text-white"
                  >
                    Hesabınıza daxil olun
                  </button>{' '}
                  və ya demo hesabla davam edin.
                </p>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={
                  submitting ||
                  quoteLoading ||
                  skatesLoading ||
                  Boolean(skatesError) ||
                  skatesSorted.length === 0
                }
                className={`btn-primary mt-3 w-full whitespace-nowrap ${
                  submitting ||
                  quoteLoading ||
                  skatesLoading ||
                  Boolean(skatesError) ||
                  skatesSorted.length === 0
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
              >
                {submitting
                  ? 'Ödəniş emal olunur…'
                  : quoteLoading
                    ? 'Qiymət yoxlanılır…'
                    : price.payable === 0
                      ? 'Pulsuz bileti al'
                      : 'Ödəniş et və bilet al'}
              </button>

              {error && (
                <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                  {error}
                </p>
              )}

              <div className="mt-5 space-y-1.5 text-[11px] leading-relaxed text-frost/45">
                {RULES.map((r) => (
                  <p key={r}>• {r}</p>
                ))}
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-ice-300"
                />
                <label
                  htmlFor="agreeTerms"
                  className="cursor-pointer text-xs leading-relaxed text-frost/75"
                >
                  İstifadə şərtlərini, qayda və qadağaları, habelə müştəri
                  öhdəliklərini oxudum, onlara əməl etməyi öz üzərimə götürürəm.{' '}
                  <Link
                    to="/qaydalar"
                    className="font-semibold text-ice-200 underline decoration-ice-300/40 underline-offset-4 hover:text-white"
                  >
                    Ətraflı oxu
                  </Link>
                </label>
              </div>

              {isAuthenticated &&
                isCustomer &&
                (!user?.ageVerified || !user?.identityConfirmed) && (
                  <div className="mt-4 rounded-lg border border-ice-300/30 bg-ice-400/10 p-4">
                    <p className="font-display text-sm font-bold text-white">
                      18+ yaş və şəxsiyyət vəsiqəsinin təsdiqi
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-frost/65">
                      18+ bilet alışı üçün məlumatlarınızı bir dəfə təsdiqləyin.
                      Növbəti bilet alışlarında bu təsdiq təkrar tələb olunmayacaq.
                    </p>

                    {!user?.ageVerified && (
                      <div className="mt-3">
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-frost/60">
                          Doğum tarixiniz (18+ tələbi)
                        </label>
                        <input
                          type="date"
                          value={bookingDob}
                          min="1900-01-01"
                          max={new Date().toISOString().slice(0, 10)}
                          onChange={(e) => setBookingDob(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-night-900/80 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-ice-300/60 [color-scheme:dark]"
                        />
                      </div>
                    )}

                    {!user?.identityConfirmed && (
                      <>
                        <div className="mt-3">
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-frost/60">
                            Şəxsiyyət vəsiqəsinin seriya və nömrəsi
                          </label>
                          <input
                            type="text"
                            value={identityDocumentNumber}
                            onChange={(e) =>
                              setIdentityDocumentNumber(e.target.value)
                            }
                            maxLength={30}
                            placeholder="AA1234567"
                            className="w-full rounded-xl border border-white/15 bg-night-900/80 px-4 py-2.5 text-sm uppercase text-white placeholder-frost/30 outline-none transition-colors focus:border-ice-300/60"
                          />
                        </div>
                        <label className="mt-3 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-frost/75">
                          <input
                            type="checkbox"
                            checked={identityConfirmedCheck}
                            onChange={(e) =>
                              setIdentityConfirmedCheck(e.target.checked)
                            }
                            className="mt-0.5 h-4 w-4 shrink-0 accent-ice-300"
                          />
                          <span>
                            18 yaşımdan böyük olduğumu, şəxsiyyət vəsiqəmi təqdim
                            edəcəyimi və qeyd etdiyim məlumatların doğru olduğunu
                            təsdiq edirəm.
                          </span>
                        </label>
                      </>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {step === 3 && ticket === null && (
        <div className="mx-auto max-w-xl">
          <div className="glass rounded-xl p-8 text-center">
            <p className="font-display text-xl font-bold text-white">
              Biletiniz hazırlanır...
            </p>
          </div>
        </div>
      )}

      <PaymentModal
        open={paymentOpen}
        amount={pendingOrder?.next.price.payable || price.payable || 0}
        busy={submitting}
        error={paymentError}
        onClose={closePayment}
        onPay={handlePayment}
      />
    </div>
  )
}