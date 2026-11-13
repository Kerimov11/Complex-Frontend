import { useCallback, useEffect, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import ShiftDateFilter from '../../components/shift/ShiftDateFilter'
import { formatShiftDate, formatShiftRange } from '../../components/shift/formatters'
import { shiftApi } from '../../services/api/shiftApi'
import { todayISO } from '../../utils/datetime'

const EMPTY_FORM = {
  startTime: '09:00',
  endTime: '12:25',
  active: true,
}

const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

function clock(value) {
  return value ? String(value).slice(0, 5) : ''
}

function Time24Select({ value, onChange, label }) {
  const [hour = '09', minute = '00'] = clock(value).split(':')
  return (
    <div className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
        {label}
      </span>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 rounded-xl border border-white/10 bg-night-900/60 px-2.5 py-2 focus-within:border-ice-300/50">
        <select
          aria-label={`${label} saat`}
          value={HOURS_24.includes(hour) ? hour : '09'}
          onChange={(e) => onChange(`${e.target.value}:${minute}`)}
          className="w-full bg-transparent text-center text-sm font-semibold text-white outline-none [&>option]:bg-night-900 [&>option]:text-white"
        >
          {HOURS_24.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <span className="font-bold text-frost/45">:</span>
        <select
          aria-label={`${label} dəqiqə`}
          value={MINUTES_60.includes(minute) ? minute : '00'}
          onChange={(e) => onChange(`${hour}:${e.target.value}`)}
          className="w-full bg-transparent text-center text-sm font-semibold text-white outline-none [&>option]:bg-night-900 [&>option]:text-white"
        >
          {MINUTES_60.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default function ShiftSlotPlannerPage() {
  const [date, setDate] = useState(todayISO())
  const [slots, setSlots] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setSlots(await shiftApi.getShiftSlots(date))
    } catch (err) {
      setError(err?.message || 'Smen slotları yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }, [date])

  function startEdit(slot) {
    setEditingId(slot.id)
    setForm({
      startTime: clock(slot.startTime),
      endTime: clock(slot.endTime),
      active: slot.active,
    })
    setError('')
    setSuccess('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        shiftDate: date,
        startTime: form.startTime,
        endTime: form.endTime,
        active: form.active,
      }
      if (editingId) {
        await shiftApi.updateShiftSlot(editingId, payload)
        setSuccess('Smen slotu yeniləndi.')
      } else {
        await shiftApi.createShiftSlot(payload)
        setSuccess('Yeni smen slotu yaradıldı.')
      }
      setEditingId(null)
      setForm(EMPTY_FORM)
      await load()
    } catch (err) {
      setError(err?.message || 'Smen slotu yadda saxlanılmadı.')
    } finally {
      setBusy(false)
    }
  }

  async function remove(slot) {
    const hasVolunteers = (slot.selectedCount || 0) > 0
    const confirmText = hasVolunteers
      ? `${formatShiftRange(slot.startTime, slot.endTime)} smenini silmək istəyirsiniz? Bu smeni seçmiş ${slot.selectedCount} könüllüyə smenin ləğv olunduğu barədə mesaj göndəriləcək.`
      : `${formatShiftRange(slot.startTime, slot.endTime)} smenini silmək istəyirsiniz?`
    if (!window.confirm(confirmText)) {
      return
    }
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      await shiftApi.deleteShiftSlot(slot.id)
      setSuccess(
        hasVolunteers
          ? 'Smen slotu silindi və könüllülərə seçdikləri smenin ləğv olunduğu barədə mesaj göndərildi.'
          : 'Smen slotu silindi.'
      )
      if (editingId === slot.id) cancelEdit()
      await load()
    } catch (err) {
      setError(err?.message || 'Smen slotu silinə bilmədi.')
    } finally {
      setBusy(false)
    }
  }

  async function toggleActive(slot) {
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      await shiftApi.updateShiftSlot(slot.id, {
        shiftDate: slot.shiftDate,
        startTime: clock(slot.startTime),
        endTime: clock(slot.endTime),
        active: !slot.active,
      })
      setSuccess(
        !slot.active ? 'Smen slotu aktivləşdirildi.' : 'Smen slotu deaktiv edildi.'
      )
      await load()
    } catch (err) {
      setError(err?.message || 'Smen slotu yenilənə bilmədi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Koordinator planlaması"
        title="Günlük smen slotları"
        description="Hər gün üçün könüllü smen intervallarını əlavə edin, redaktə edin və ya deaktiv edin. Dəyişikliklər könüllülərin seçim ekranına dərhal yansıyır."
        actions={
          <ShiftDateFilter value={date} onChange={setDate} label="Plan tarixi" />
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

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={submit} className="glass h-fit rounded-xl p-5">
          <h3 className="font-display text-lg font-bold text-white">
            {editingId ? 'Smeni redaktə et' : 'Yeni smen slotu'}
          </h3>
          <p className="mt-1 text-xs text-frost/45">{formatShiftDate(date)}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Time24Select
              label="Başlama"
              value={form.startTime}
              onChange={(startTime) =>
                setForm((prev) => ({ ...prev, startTime }))
              }
            />
            <Time24Select
              label="Bitmə"
              value={form.endTime}
              onChange={(endTime) =>
                setForm((prev) => ({ ...prev, endTime }))
              }
            />
          </div>

          <label className="mt-3 flex items-center gap-2 text-sm text-frost/65">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, active: event.target.checked }))
              }
              className="h-4 w-4 rounded border-white/20 bg-night-900"
            />
            Aktiv (könüllülər seçə bilər)
          </label>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy}
              className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-50"
            >
              {busy ? 'Yadda saxlanılır...' : editingId ? 'Yenilə' : 'Slot əlavə et'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-ghost !px-5 !py-2.5 text-sm"
              >
                Ləğv et
              </button>
            )}
          </div>
        </form>

        <div className="glass overflow-hidden rounded-xl">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                {formatShiftDate(date)} slotları
              </h3>
              <p className="mt-0.5 text-xs text-frost/40">
                {loading ? 'Yüklənir...' : `${slots.length} interval`}
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-frost/55 hover:bg-white/10"
            >
              Yenilə
            </button>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {loading && (
              <div className="p-8 text-center text-sm text-frost/45">Yüklənir...</div>
            )}
            {!loading && slots.length === 0 && (
              <div className="p-8 text-center text-sm text-frost/45">
                Bu tarix üçün slot yoxdur. Soldakı formadan əlavə edin.
              </div>
            )}
            {!loading &&
              slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
                    editingId === slot.id ? 'bg-ice-400/[0.06]' : ''
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base font-bold text-white">
                        {formatShiftRange(slot.startTime, slot.endTime)}
                      </p>
                      <span
                        className={`rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          slot.active
                            ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100'
                            : 'border-white/10 bg-white/5 text-frost/40'
                        }`}
                      >
                        {slot.active ? 'Aktiv' : 'Deaktiv'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-frost/45">
                      {slot.selectedCount || 0} könüllü seçib
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(slot)}
                      disabled={busy}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-frost/65 transition-colors hover:bg-white/10 disabled:opacity-40"
                    >
                      Redaktə
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(slot)}
                      disabled={busy}
                      className="rounded-xl border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-100 transition-colors hover:bg-amber-400/15 disabled:opacity-40"
                    >
                      {slot.active ? 'Deaktiv et' : 'Aktivləşdir'}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(slot)}
                      disabled={busy}
                      title="Slotu sil"
                      className="rounded-xl border border-red-300/20 bg-red-400/10 px-3 py-2 text-xs font-bold text-red-100 transition-colors hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
