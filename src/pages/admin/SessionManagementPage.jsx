import { useCallback, useEffect, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { formatDate, todayISO } from '../../components/admin/formatters'
import { adminApi } from '../../services/api/adminApi'

const EMPTY_FORM = {
  sessionDate: todayISO(),
  startTime: '10:30',
  endTime: '13:45',
  maxTicketLimit: 50,
}

export default function SessionManagementPage() {
  const [date, setDate] = useState(todayISO())
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busyId, setBusyId] = useState('')
  const [form, setForm] = useState({ ...EMPTY_FORM, sessionDate: todayISO() })
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setSessions(await adminApi.getSessionsByDate(date))
    } catch (err) {
      setError(err?.message || 'Sessiyalar yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    load()
  }, [load])

  function startEdit(session) {
    setEditingId(session.id)
    setForm({
      sessionDate: session.sessionDate,
      startTime: String(session.startTime || '').slice(0, 5),
      endTime: String(session.endTime || '').slice(0, 5),
      maxTicketLimit: session.maxTicketLimit,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, sessionDate: date })
    setShowForm(false)
  }

  async function saveSession(event) {
    event.preventDefault()
    setBusyId('save')
    setError('')
    setSuccess('')
    const payload = {
      ...form,
      maxTicketLimit: Number(form.maxTicketLimit),
    }
    try {
      if (editingId) {
        await adminApi.updateSession(editingId, payload)
        setSuccess('Sessiya yeniləndi.')
      } else {
        await adminApi.createSession(payload)
        setSuccess('Yeni sessiya yaradıldı.')
      }
      resetForm()
      await load()
    } catch (err) {
      setError(err?.message || 'Sessiya yadda saxlanmadı.')
    } finally {
      setBusyId('')
    }
  }

  async function blockSession(session) {
    const reason = window.prompt(
      `${session.startTime}–${session.endTime} sessiyası üçün blok səbəbi:`,
      'Texniki fasilə'
    )
    if (reason === null) return
    setBusyId(`block:${session.id}`)
    setError('')
    try {
      const updated = await adminApi.blockSession(session.id, reason)
      setSessions((prev) => prev.map((item) => (item.id === session.id ? updated : item)))
      setSuccess('Sessiya bloklandı.')
    } catch (err) {
      setError(err?.message || 'Sessiya bloklanmadı.')
    } finally {
      setBusyId('')
    }
  }

  async function unblockSession(session) {
    setBusyId(`block:${session.id}`)
    setError('')
    try {
      const updated = await adminApi.unblockSession(session.id)
      setSessions((prev) => prev.map((item) => (item.id === session.id ? updated : item)))
      setSuccess('Sessiya açıldı.')
    } catch (err) {
      setError(err?.message || 'Sessiya açılmadı.')
    } finally {
      setBusyId('')
    }
  }

  async function deleteSession(session) {
    if (!window.confirm(`${session.startTime}–${session.endTime} sessiyası silinsin?`)) return
    setBusyId(`delete:${session.id}`)
    setError('')
    try {
      await adminApi.deleteSession(session.id)
      setSessions((prev) => prev.filter((item) => item.id !== session.id))
      setSuccess('Sessiya silindi.')
    } catch (err) {
      setError(err?.message || 'Sessiya silinmədi. Rezervasiyalar mövcud ola bilər.')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Seans idarəetməsi"
        title="İş saatları və bilet limitləri"
        description="Günlük sessiyaları yaradın, limitləri yeniləyin, texniki fasilə üçün bloklayın."
        actions={
          <button
            type="button"
            onClick={() => {
              if (showForm) resetForm()
              else {
                setForm({ ...EMPTY_FORM, sessionDate: date })
                setShowForm(true)
              }
            }}
            className="btn-primary !px-5 !py-2.5 text-sm"
          >
            {showForm ? 'Formanı bağla' : '+ Yeni sessiya'}
          </button>
        }
      />

      {error && <div className="mb-3"><AdminNotice tone="error">{error}</AdminNotice></div>}
      {success && <div className="mb-3"><AdminNotice tone="success">{success}</AdminNotice></div>}

      {showForm && (
        <form onSubmit={saveSession} className="glass mb-5 rounded-xl p-5">
          <h3 className="font-display text-lg font-bold text-white">
            {editingId ? 'Sessiyanı yenilə' : 'Yeni sessiya'}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Tarix
              </span>
              <input
                type="date"
                value={form.sessionDate}
                onChange={(event) => setForm((prev) => ({ ...prev, sessionDate: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Başlama
              </span>
              <input
                type="time"
                value={form.startTime}
                onChange={(event) => setForm((prev) => ({ ...prev, startTime: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Bitmə
              </span>
              <input
                type="time"
                value={form.endTime}
                onChange={(event) => setForm((prev) => ({ ...prev, endTime: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Bilet limiti
              </span>
              <input
                type="number"
                min="1"
                value={form.maxTicketLimit}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, maxTicketLimit: event.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
                required
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={busyId === 'save'}
              className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-50"
            >
              {busyId === 'save' ? 'Saxlanılır...' : editingId ? 'Yenilə' : 'Yarat'}
            </button>
            <button type="button" onClick={resetForm} className="btn-ghost !px-5 !py-2.5 text-sm">
              Ləğv et
            </button>
          </div>
        </form>
      )}

      <div className="glass overflow-hidden rounded-xl">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-white">{formatDate(`${date}T00:00:00`)}</p>
            <p className="mt-1 text-xs text-frost/45">{sessions.length} sessiya</p>
          </div>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none focus:border-ice-300/50"
          />
        </div>

        <div className="divide-y divide-white/[0.06]">
          {loading && <div className="p-8 text-center text-sm text-frost/45">Yüklənir...</div>}
          {!loading && sessions.length === 0 && (
            <div className="p-8 text-center text-sm text-frost/45">Bu tarix üçün sessiya yoxdur.</div>
          )}
          {!loading &&
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-white/[0.025] lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg bg-ice-400/10 px-3 py-2 font-display text-sm font-bold text-ice-100">
                    {String(session.startTime).slice(0, 5)}–{String(session.endTime).slice(0, 5)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {session.occupiedTickets || 0}/{session.maxTicketLimit} bilet
                    </p>
                    <p className="text-[11px] text-frost/45">
                      Qalıq: {session.availableTickets} · Doluluq: {(Number(session.occupancyRate) || 0).toFixed(1)}%
                    </p>
                  </div>
                  {session.blocked && (
                    <span className="rounded-md bg-red-400/10 px-2.5 py-1 text-[10px] font-bold text-red-200">
                      Bloklanıb
                    </span>
                  )}
                  {session.salesOpen ? (
                    <span className="rounded-md bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-200">
                      Satış açıq
                    </span>
                  ) : (
                    <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-bold text-frost/45">
                      Satış bağlı
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => startEdit(session)}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-frost/60 transition-colors hover:bg-white/10"
                  >
                    Düzəliş
                  </button>
                  <button
                    type="button"
                    disabled={busyId === `block:${session.id}`}
                    onClick={() => (session.blocked ? unblockSession(session) : blockSession(session))}
                    className={`rounded-md border px-3 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-40 ${
                      session.blocked
                        ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200'
                        : 'border-amber-300/25 bg-amber-400/10 text-amber-200'
                    }`}
                  >
                    {session.blocked ? 'Bloku aç' : 'Blokla'}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === `delete:${session.id}`}
                    onClick={() => deleteSession(session)}
                    className="rounded-md border border-red-300/25 bg-red-400/10 px-3 py-1.5 text-[11px] font-bold text-red-200 transition-colors hover:bg-red-400/15 disabled:opacity-40"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
