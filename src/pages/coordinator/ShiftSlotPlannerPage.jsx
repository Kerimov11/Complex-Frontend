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

const TIME_24_RE = /^([01]\d|2[0-3]):[0-5]\d$/

function clock(value) {
  return value ? String(value).slice(0, 5) : ''
}

function formatTime24Input(raw, prev) {
  const cleaned = String(raw || '').replace(/[^\d:]/g, '')
  if (cleaned.includes(':')) {
    const [h = '', m = ''] = cleaned.split(':')
    return `${h.slice(0, 2)}:${m.slice(0, 2)}`
  }
  const digits = cleaned.slice(0, 4)
  if (digits.length > 2 && cleaned.length >= String(prev || '').length) {
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`
  }
  return digits
}

function Time24Input({ value, onChange, label, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
        {label}
      </span>
      <input
        type="text"
        inputMode="numeric"
        maxLength={5}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(formatTime24Input(e.target.value, value))}
        className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm font-semibold tabular-nums text-white outline-none placeholder:text-frost/30 focus:border-ice-300/50"
        required
      />
    </label>
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
    setError('')
    setSuccess('')
    if (!TIME_24_RE.test(form.startTime) || !TIME_24_RE.test(form.endTime)) {
      setError('Başlama və bitmə saatı 24 saatlıq formatda olmalıdır (məs: 09:00, 18:45).')
      return
    }
    setBusy(true)
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
            <Time24Input
              label="Başlama"
              placeholder="09:00"
              value={form.startTime}
              onChange={(startTime) =>
                setForm((prev) => ({ ...prev, startTime }))
              }
            />
            <Time24Input
              label="Bitmə"
              placeholder="18:45"
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
