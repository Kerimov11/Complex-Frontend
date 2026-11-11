import { useCallback, useEffect, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import StatCard from '../../components/admin/StatCard'
import ShiftDateFilter from '../../components/shift/ShiftDateFilter'
import ShiftStatusBadge from '../../components/shift/ShiftStatusBadge'
import StationCounts from '../../components/shift/StationCounts'
import StationSelect from '../../components/shift/StationSelect'
import { formatShiftDate, formatShiftRange } from '../../components/shift/formatters'
import { stationLabel } from '../../components/shift/stations'
import { useAuth } from '../../auth/AuthContext'
import { shiftApi } from '../../services/api/shiftApi'
import { todayISO } from '../../utils/datetime'

function getEligibleLaterSlots(allSlots, currentSlot, selectedDate) {
  if (!Array.isArray(allSlots) || !currentSlot) return []
  const isToday = selectedDate === todayISO()
  const nowTime = new Date().toTimeString().slice(0, 5)
  const currentStart = String(currentSlot.startTime).slice(0, 5)

  return allSlots.filter((candidate) => {
    if (candidate.shiftSlotId === currentSlot.shiftSlotId) return false
    if (candidate.active === false) return false

    // Yalnız saat olaraq cari smendən sonrakı smenlər (əvvəldə qalan smenlər olmasın)
    const candidateStart = String(candidate.startTime).slice(0, 5)
    if (candidateStart <= currentStart) return false

    // Əgər gün bu gündürsə, vaxtı artıq bitmiş keçmiş smenlər də çıxarılsın
    if (isToday) {
      const candidateEnd = String(candidate.endTime).slice(0, 5)
      if (candidateEnd <= nowTime) return false
    }

    return true
  })
}

export default function ShiftOverviewPage() {
  const { isAdmin, isCoordinator } = useAuth()
  const canAssign = isAdmin || isCoordinator
  const [date, setDate] = useState(todayISO())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busyKey, setBusyKey] = useState(null)

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setError('')
    try {
      setData(await shiftApi.getShiftOverview(date))
    } catch (err) {
      setError(err?.message || 'Könüllü smenləri yüklənmədi.')
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [date])

  useEffect(() => {
    load()
  }, [load])

  async function assign(shift, station) {
    if (!station) return
    setBusyKey(shift.id)
    setError('')
    setSuccess('')
    try {
      await shiftApi.assignStation(shift.id, station)
      setSuccess(
        `${shift.fullName} üçün stansiya ${stationLabel(station)} olaraq yeniləndi.`
      )
      await load(false)
    } catch (err) {
      setError(err?.message || 'Stansiya təyin edilə bilmədi.')
    } finally {
      setBusyKey(null)
    }
  }

  async function move(shift, shiftSlotId) {
    if (!shiftSlotId) return
    setBusyKey(shift.id)
    setError('')
    setSuccess('')
    try {
      await shiftApi.updateShift(shift.id, {
        shiftSlotId: Number(shiftSlotId),
        station: shift.station || null,
      })
      setSuccess(`${shift.fullName} başqa smen vaxtına keçirildi.`)
      await load(false)
    } catch (err) {
      setError(err?.message || 'Smen vaxtı dəyişdirilə bilmədi.')
    } finally {
      setBusyKey(null)
    }
  }

  async function remove(shift) {
    const confirmed = window.confirm(
      `${shift.fullName} adlı könüllünün bu smen qeydiyyatı silinsin?`
    )
    if (!confirmed) return
    setBusyKey(shift.id)
    setError('')
    setSuccess('')
    try {
      await shiftApi.deleteShift(shift.id)
      setSuccess(`${shift.fullName} adlı könüllünün smen qeydiyyatı silindi.`)
      await load(false)
    } catch (err) {
      setError(err?.message || 'Smen qeydiyyatı silinə bilmədi.')
    } finally {
      setBusyKey(null)
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Könüllü smenləri"
        title="Günün smenləri və stansiyalar"
        description="Admin, koordinator və kassir üçün vahid mənzərə: hər smen üzrə könüllü sayı, stansiya bölgüsü və canlı smen statusu."
        actions={
          <div className="flex items-end gap-2">
            <ShiftDateFilter value={date} onChange={setDate} label="Smen tarixi" />
            <button
              type="button"
              onClick={() => load()}
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

      <div className="mb-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ümumi könüllü"
          value={data?.totalVolunteers || 0}
          hint={formatShiftDate(data?.date || date)}
          icon="◎"
          tone="ice"
        />
        <StatCard
          label="Smendə"
          value={data?.onDutyVolunteers || 0}
          icon="●"
          tone="green"
        />
        <StatCard
          label="Smen təyin edilib"
          value={data?.assignedVolunteers || 0}
          icon="⌖"
          tone="violet"
        />
        <StatCard
          label="Təyinat gözləyən"
          value={data?.unassignedVolunteers || 0}
          icon="!"
          tone={(data?.unassignedVolunteers || 0) > 0 ? 'amber' : 'green'}
        />
      </div>

      <div className="glass mb-5 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-base font-bold text-white">
            Stansiyalar üzrə ümumi bölgü
          </h3>
          <span className="text-xs text-frost/40">
            {formatShiftDate(data?.date || date)}
          </span>
        </div>
        <div className="mt-3">
          <StationCounts stations={data?.stationTotals || []} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((key) => (
            <div key={key} className="glass h-32 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (data?.slots || []).length === 0 ? (
        <div className="glass rounded-xl p-8 text-center text-sm text-frost/45">
          Bu tarix üçün smen slotu yoxdur.
        </div>
      ) : (
        <div className="space-y-3">
          {data.slots.map((slot) => {
            const laterSlots = getEligibleLaterSlots(data?.slots, slot, data?.date || date)
            return (
            <div key={slot.shiftSlotId} className="glass overflow-hidden rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-white">
                      {formatShiftRange(slot.startTime, slot.endTime)}
                    </h3>
                    {!slot.active && (
                      <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-frost/40">
                        Deaktiv
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-frost/45">
                    {slot.totalVolunteers} könüllü · {slot.onDutyVolunteers} smendə ·{' '}
                    {slot.unassignedVolunteers} təyinat gözləyir
                  </p>
                </div>
                <StationCounts stations={slot.stations || []} compact />
              </div>

              <div className="divide-y divide-white/[0.06]">
                {slot.volunteers.length === 0 && (
                  <div className="p-4 text-center text-xs text-frost/40">
                    Bu smen üçün könüllü seçilməyib.
                  </div>
                )}
                {slot.volunteers.map((shift) => (
                  <div
                    key={shift.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-white">{shift.fullName}</p>
                        <span className="text-xs text-frost/40">@{shift.username}</span>
                        <ShiftStatusBadge status={shift.liveStatus} />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-md border px-2.5 py-1 text-[10px] font-bold ${
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

                    {canAssign ? (
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <StationSelect
                          value={shift.station || ''}
                          onChange={(station) => assign(shift, station)}
                          disabled={busyKey === shift.id}
                          placeholder="Stansiya seç"
                        />
                        {laterSlots.length > 0 ? (
                          <select
                            value=""
                            onChange={(event) => move(shift, event.target.value)}
                            disabled={busyKey === shift.id}
                            className="rounded-xl border border-white/10 bg-night-900/70 px-3 py-2 text-xs font-semibold text-frost/75 outline-none focus:border-ice-300/50 disabled:opacity-40"
                            title="Könüllünü sonrakı smen vaxtına keçir"
                          >
                            <option value="">Başqa smenə keçir</option>
                            {laterSlots.map((candidate) => (
                              <option
                                key={candidate.shiftSlotId}
                                value={candidate.shiftSlotId}
                              >
                                {formatShiftRange(candidate.startTime, candidate.endTime)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className="text-[10px] text-frost/30"
                            title="Son smendir və ya sonrakı smen yoxdur"
                          >
                            Son smen
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(shift)}
                          disabled={busyKey === shift.id}
                          className="rounded-xl border border-red-300/25 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-100 transition-colors hover:bg-red-500/20 disabled:opacity-40"
                          title="Smen qeydiyyatını sil"
                        >
                          Sil
                        </button>
                        {busyKey === shift.id && (
                          <span className="text-[10px] text-frost/40">Yenilənir...</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-frost/25">
                        Yalnız baxış
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
