import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminNotice from './AdminNotice'
import LanguageSwitcher from '../LanguageSwitcher'
import { useAuth } from '../../auth/AuthContext'
import { shiftApi } from '../../services/api/shiftApi'
import { formatShiftDate, formatShiftRange } from '../shift/formatters'

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { user, isAdmin, isCoordinator, isCashier, isVolunteer } = useAuth()
  const [cancelledShifts, setCancelledShifts] = useState([])

  useEffect(() => {
    if (!isVolunteer) {
      setCancelledShifts([])
      return
    }
    let active = true
    shiftApi
      .getMyShifts()
      .then((shifts) => {
        if (!active) return
        const cancelled = (shifts || []).filter(
          (item) =>
            item.status === 'CANCELLED' || item.liveStatus === 'CANCELLED'
        )
        setCancelledShifts(cancelled)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [isVolunteer, pathname])

  const roleLabel = isAdmin
    ? 'Administrator'
    : isCoordinator
      ? 'Koordinator'
      : isCashier
        ? 'Kassir'
        : isVolunteer
          ? 'Könüllü'
          : 'İstifadəçi'

  return (
    <section className="mx-auto max-w-7xl px-3 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24">
      <div className="glass mb-4 flex flex-col gap-2 rounded-xl p-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ice-300">
            İdarəetmə paneli
          </p>
          <h1 className="mt-0.5 truncate font-display text-lg font-bold text-white sm:text-2xl">
            Xoş gəldiniz, {user?.username || 'komanda'}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <span className="chip chip-ice">{roleLabel}</span>
          <span className="chip hidden sm:inline-flex">Canlı sistem</span>
        </div>
      </div>

      {isVolunteer &&
        pathname !== '/volunteer/shifts' &&
        cancelledShifts.map((shift) => (
          <div key={`layout-cancelled-${shift.id}`} className="mb-4">
            <AdminNotice tone="warn">
              {shift.cancellationMessage ||
                `Seçdiyiniz ${formatShiftDate(shift.shiftDate)} (${formatShiftRange(
                  shift.startTime,
                  shift.endTime
                )}) smeni ləğv edilmişdir.`}
            </AdminNotice>
          </div>
        ))}

      <div className="grid gap-3 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-5">
        <AdminSidebar />
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </section>
  )
}
