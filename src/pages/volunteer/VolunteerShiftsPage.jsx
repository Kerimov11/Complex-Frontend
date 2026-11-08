import { useCallback, useEffect, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import ShiftDateFilter from '../../components/shift/ShiftDateFilter'
import ShiftStatusBadge from '../../components/shift/ShiftStatusBadge'
import { formatShiftDate, formatShiftRange } from '../../components/shift/formatters'
import { stationLabel } from '../../components/shift/stations'
import { useAuth } from '../../auth/AuthContext'
import { shiftApi } from '../../services/api/shiftApi'
import { todayISO } from '../../utils/datetime'

export default function VolunteerShiftsPage() {
  const { isAdmin } = useAuth()
  const [date, setDate] = useState(todayISO())
  const [available, setAvailable] = useState([])
  const [myShifts, setMyShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [slots, mine] = await Promise.all([
        shiftApi.getAvailableShifts(date),
        shiftApi.getMyShifts(),
      ])
      setAvailable(slots)
      setMyShifts(mine)
    } catch (err) {
      setError(err?.message || 'Smen məlumatları yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    load()
  }, [load])

  async function select(slot) {
    setBusyId(slot.id)
    setError('')
    setSuccess('')
    try {
      const shift = await shiftApi.selectShift(slot.id)
      setSuccess(
        `${formatShiftDate(shift.shiftDate)} ${formatShiftRange(
          shift.startTime,
          shift.endTime
        )} smeni seçildi.`
      )
      await load()
    } catch (err) {
      setError(err?.message || 'Smen seçilə bilmədi.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Könüllü iş masası"
        title="Smen seçimi"
        description="Gün üzrə mövcud könüllü smenlərini görün və özünüzə uyğun intervalı seçin. Koordinator sonradan stansiya təyin edəcək."
        actions={
          <div className="flex items-end gap-2">
            <ShiftDateFilter value={date} onChange={setDate} label="Smen tarixi" />
            <button
              type="button"
              onClick={load}
              className="btn-ghost !px-4 !py-2 text-xs"
            >
              Yenilə
            </button>
          </div>
        }
      />

      {error && (
        <div className="mb-3">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}
      {success && (
        <div className="mb-3">
          <AdminNotice tone="success">{success}</AdminNotice>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="glass overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Mövcud smenlər
              </h3>
              <p className="mt-0.5 text-xs text-frost/40">
                {formatShiftDate(date)} · {loading ? 'Yüklənir...' : `${available.length} interval`}
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {loading && (
              <div className="p-8 text-center text-sm text-frost/45">Yüklənir...</div>
            )}
            {!loading && available.length === 0 && (
              <div className="p-8 text-center text-sm text-frost/45">
                Bu tarix üçün aktiv smen yoxdur.
              </div>
            )}
            {!loading &&
              available.map((slot) => {
                const selected = Boolean(slot.myVolunteerShiftId)
                return (
                  <div
                    key={slot.id}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-display text-base font-extrabold text-white">
                        {formatShiftRange(slot.startTime, slot.endTime)}
                      </p>
                      <p className="mt-1 text-xs text-frost/45">
                        {slot.selectedCount || 0} könüllü seçib
                      </p>
                      {selected && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-100">
                            Seçilib
                          </span>
                          {slot.myStationLabel && (
                            <span className="rounded-full border border-ice-300/25 bg-ice-400/10 px-2.5 py-1 text-[10px] font-bold text-ice-100">
                              {slot.myStationLabel}
                            </span>
                          )}
                          {slot.myStatus && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-frost/50">
                              {slot.myStatus}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => select(slot)}
                      disabled={selected || isAdmin || busyId === slot.id}
                      className="btn-primary !px-4 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                      title={
                        isAdmin
                          ? 'Admin hesabı smen seçmir'
                          : selected
                            ? 'Bu smen artıq seçilib'
                            : 'Smeni seç'
                      }
                    >
                      {busyId === slot.id
                        ? 'Seçilir...'
                        : selected
                          ? 'Seçilib'
                          : 'Smeni seç'}
                    </button>
                  </div>
                )
              })}
          </div>
        </div>

        <div className="glass overflow-hidden rounded-3xl">
          <div className="border-b border-white/10 p-4">
            <h3 className="font-display text-lg font-bold text-white">Mənim smenlərim</h3>
            <p className="mt-0.5 text-xs text-frost/40">
              Bütün seçilmiş smenlər və koordinatorun stansiya təyinatları
            </p>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {loading && (
              <div className="p-8 text-center text-sm text-frost/45">Yüklənir...</div>
            )}
            {!loading && myShifts.length === 0 && (
              <div className="p-8 text-center text-sm text-frost/45">
                Hələ smen seçməmisiniz.
              </div>
            )}
            {!loading &&
              myShifts.map((shift) => (
                <div key={shift.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display text-sm font-bold text-white">
                      {formatShiftDate(shift.shiftDate)} ·{' '}
                      {formatShiftRange(shift.startTime, shift.endTime)}
                    </p>
                    <ShiftStatusBadge status={shift.liveStatus} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                        shift.station
                          ? 'border-ice-300/25 bg-ice-400/10 text-ice-100'
                          : 'border-amber-300/25 bg-amber-400/10 text-amber-100'
                      }`}
                    >
                      {shift.stationLabel || stationLabel(shift.station)}
                    </span>
                    {shift.assignedBy && (
                      <span className="text-[10px] text-frost/30">
                        Təyin edən: {shift.assignedBy}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
