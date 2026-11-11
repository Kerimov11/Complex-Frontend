import { useState, useEffect, useRef, useCallback } from 'react'
import { loadJSON, saveJSON } from '../utils/storage'
import { RESERVATION } from '../data/config'
import { api } from '../api/client'

function newReservation() {
  const expiresAt = Date.now() + RESERVATION.initialMinutes * 60 * 1000
  return {
    expiresAt,
    extendsUsed: 0,
    extendedAt: [],
    status: 'active',
  }
}

function parseExpiry(value) {
  if (!value) return 0
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

/**
 * Backend-dən qaytarılan rezervasiyaları tək taymerə çevirir.
 * Bütün konkilər eyni anda yaradıldığı üçün ilk rezervasiyanın
 * taymeri panel üçün əsas götürülür.
 */
function fromBackend(ticket) {
  const list = ticket?.backendReservations
  if (!Array.isArray(list) || list.length === 0) return null

  const first = list[0] || {}
  const expiresAt = parseExpiry(first.timerExpiresAt)
  if (!expiresAt) return null

  const extendsUsed = Number(first.extensionCount) || 0
  const status =
    expiresAt <= Date.now()
      ? extendsUsed < RESERVATION.maxExtensions
        ? 'attention'
        : 'expired'
      : 'active'

  return {
    expiresAt,
    extendsUsed,
    extendedAt: [],
    status,
    backendIds: list.map((r) => r.id).filter(Boolean),
  }
}

export function useReservation(ticketOrId) {
  const ticket = ticketOrId && typeof ticketOrId === 'object' ? ticketOrId : null
  const ticketId = ticket ? ticket.id : ticketOrId
  const key = ticketId ? `ha_reservation_${ticketId}` : null

  const [reservation, setReservation] = useState(() => {
    if (!key) return null
    const saved = loadJSON(key, null)
    if (saved) return saved
    return ticket ? fromBackend(ticket) : null
  })
  const [remaining, setRemaining] = useState(0)
  const timerRef = useRef(null)

  const sync = useCallback(() => {
    if (!reservation) return
    const rem = reservation.expiresAt - Date.now()
    if (reservation.status === 'expired') {
      setRemaining(0)
      return
    }
    if (rem <= 0) {
      if (reservation.extendsUsed < RESERVATION.maxExtensions) {
        setReservation((prev) => ({ ...prev, status: 'attention' }))
        setRemaining(0)
      } else {
        setReservation((prev) => ({ ...prev, status: 'expired' }))
        setRemaining(0)
      }
      return
    }
    setRemaining(Math.round(rem / 1000))
  }, [reservation])

  useEffect(() => {
    if (!reservation) return
    setRemaining(
      Math.max(0, Math.round((reservation.expiresAt - Date.now()) / 1000))
    )
  }, [reservation])

  useEffect(() => {
    if (!key || !reservation) return undefined
    timerRef.current = setInterval(sync, 500)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [key, reservation, sync])

  const start = useCallback((input) => {
    const id =
      typeof input === 'string' ? input : input && typeof input === 'object' ? input.id : null
    if (!id) return

    const k = `ha_reservation_${id}`
    const saved = loadJSON(k, null)
    const seeded = typeof input === 'object' ? fromBackend(input) : null

    // Backend taymeri varsa, köhnə lokal taymeri deyil, onu əsas götürürük.
    // Eyni biletin əvvəl uzadılmış backend vəziyyəti varsa, onu saxlayırıq.
    const keepSaved =
      saved &&
      saved.status !== 'expired' &&
      (!seeded || (saved.backendIds && saved.backendIds.length > 0))

    const next = keepSaved ? saved : seeded || newReservation()
    saveJSON(k, next)
    setReservation(next)
  }, [])

  const extend = useCallback(async () => {
    if (!key || !reservation) {
      return { ok: false, message: 'Aktiv rezervasiya tapılmadı.' }
    }
    if (reservation.status === 'expired') {
      return { ok: false, message: 'Rezervasiya vaxtı bitib.' }
    }
    if (reservation.extendsUsed >= RESERVATION.maxExtensions) {
      return { ok: false, message: 'Uzatma limiti bitib (maks. 2 dəfə).' }
    }

    // Backend rezervasiyası varsa, taymeri serverdə uzadırıq.
    if (reservation.backendIds && reservation.backendIds.length > 0) {
      try {
        let first = null
        for (const id of reservation.backendIds) {
          const result = await api.extendReservation(id)
          if (!first) first = result
        }

        const expiresAt = parseExpiry(first?.timerExpiresAt)
        const extendsUsed = Number.isFinite(Number(first?.extensionCount))
          ? Number(first.extensionCount)
          : reservation.extendsUsed + 1

        const next = {
          ...reservation,
          expiresAt: expiresAt || Date.now() + RESERVATION.extensionMinutes * 60 * 1000,
          extendsUsed,
          extendedAt: [...reservation.extendedAt, Date.now()],
          status: 'active',
        }
        saveJSON(key, next)
        setReservation(next)
        return { ok: true, message: 'Rezervasiya 10 dəqiqə uzadıldı.' }
      } catch (err) {
        return {
          ok: false,
          message: err?.message || 'Rezervasiyanı uzatmaq alınmadı.',
        }
      }
    }

    // Backend olmayan (köhnə lokalbilet) hal üçün ehtiyat məntiq.
    const next = {
      ...reservation,
      expiresAt:
        reservation.expiresAt + RESERVATION.extensionMinutes * 60 * 1000,
      extendsUsed: reservation.extendsUsed + 1,
      extendedAt: [...reservation.extendedAt, Date.now()],
      status: 'active',
    }
    saveJSON(key, next)
    setReservation(next)
    return { ok: true, message: 'Rezervasiya 10 dəqiqə uzadıldı.' }
  }, [key, reservation])

  const release = useCallback(() => {
    if (!key) return
    setReservation(null)
    setRemaining(0)
  }, [key])

  const extensionsLeft =
    RESERVATION.maxExtensions -
    (reservation ? reservation.extendsUsed : RESERVATION.maxExtensions)

  return {
    reservation,
    remaining,
    start,
    extend,
    release,
    extensionsLeft,
    maxExtensions: RESERVATION.maxExtensions,
    backend: Boolean(reservation?.backendIds?.length),
    active: Boolean(reservation && reservation.status === 'active'),
    needsAttention: Boolean(reservation && reservation.status === 'attention'),
    expired: Boolean(reservation && reservation.status === 'expired'),
  }
}
