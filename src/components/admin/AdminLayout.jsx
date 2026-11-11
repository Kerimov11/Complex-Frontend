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
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6">
      <div className="glass mb-5 flex flex-col gap-3 rounded-xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ice-300">
            İdarəetmə paneli
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-white">
            Xoş gəldiniz, {user?.username || 'komanda'}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher />
          <span className="chip chip-ice">{roleLabel}</span>
          <span className="chip">Canlı sistem</span>
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

      <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <AdminSidebar />
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </section>
  )
}
