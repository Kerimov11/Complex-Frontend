import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import RoleBadge, { ROLE_META } from '../../components/admin/RoleBadge'
import StaffCreateForm, {
  STAFF_ROLE_OPTIONS,
} from '../../components/admin/StaffCreateForm'
import { adminApi } from '../../services/api/adminApi'

function staffRoleOf(member) {
  return (member?.roles || []).find((role) => STAFF_ROLE_OPTIONS.includes(role)) || ''
}

export default function StaffManagementPage() {
  const [staff, setStaff] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busyKey, setBusyKey] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setStaff(await adminApi.getStaff(search))
    } catch (err) {
      setError(err?.message || 'Əməkdaşlar yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [load])

  const summary = useMemo(() => {
    const result = Object.fromEntries(STAFF_ROLE_OPTIONS.map((role) => [role, 0]))
    staff.forEach((member) => {
      const role = staffRoleOf(member)
      if (role) result[role] += 1
    })
    return result
  }, [staff])

  async function createStaff(payload) {
    setError('')
    setSuccess('')
    const created = await adminApi.createStaffMember(payload)
    setStaff((prev) => [...prev, created].sort((a, b) => a.id - b.id))
    setSuccess(`${created.username} əməkdaş hesabı yaradıldı.`)
    setShowCreate(false)
  }

  async function changeRole(member, nextRole) {
    const current = staffRoleOf(member)
    if (!nextRole || nextRole === current) return
    setBusyKey(String(member.id))
    setError('')
    setSuccess('')
    try {
      const updated = await adminApi.updateStaffRole(member.id, nextRole)
      setStaff((prev) => prev.map((item) => (item.id === member.id ? updated : item)))
      setSuccess(
        `${member.username} rolu ${ROLE_META[nextRole]?.label || nextRole} olaraq yeniləndi.`
      )
    } catch (err) {
      setError(err?.message || 'Əməkdaş rolu dəyişdirilə bilmədi.')
    } finally {
      setBusyKey('')
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Əməkdaş idarəetməsi"
        title="Könüllü, kassir və koordinatorlar"
        description="Limitsiz əməkdaş hesabı yaradın və mövcud əməkdaşın rolunu bir kliklə yüksəldin. Bütün dəyişikliklər dərhal JWT səlahiyyətlərinə tətbiq olunur."
        actions={
          <button
            type="button"
            onClick={() => setShowCreate((value) => !value)}
            className="btn-primary !px-5 !py-2.5 text-sm"
          >
            {showCreate ? 'Formanı bağla' : '+ Yeni əməkdaş'}
          </button>
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

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {STAFF_ROLE_OPTIONS.map((role) => (
          <div
            key={role}
            className={`rounded-2xl border bg-gradient-to-br p-4 ${
              role === 'ROLE_COORDINATOR'
                ? 'border-sky-300/25 from-sky-400/15 to-sky-500/5'
                : role === 'ROLE_CASHIER'
                  ? 'border-emerald-300/25 from-emerald-400/15 to-emerald-500/5'
                  : 'border-violet-300/25 from-violet-400/15 to-violet-500/5'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              {ROLE_META[role].label}
            </p>
            <p className="mt-2 font-display text-2xl font-black text-white">
              {summary[role]}
            </p>
            <p className="mt-1 text-[11px] text-white/40">aktiv əməkdaş</p>
          </div>
        ))}
      </div>

      {showCreate && (
        <StaffCreateForm
          onCreate={createStaff}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="glass overflow-hidden rounded-3xl">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-white">
            {loading ? 'Yüklənir...' : `${staff.length} əməkdaş`}
          </p>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ad, istifadəçi adı və ya e-poçt..."
            className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-frost/30 focus:border-ice-300/50 sm:w-72"
          />
        </div>

        <div className="divide-y divide-white/[0.06]">
          {loading && (
            <div className="p-8 text-center text-sm text-frost/45">Yüklənir...</div>
          )}
          {!loading && staff.length === 0 && (
            <div className="p-8 text-center text-sm text-frost/45">
              Əməkdaş tapılmadı.
            </div>
          )}
          {!loading &&
            staff.map((member) => {
              const currentRole = staffRoleOf(member)
              return (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 p-4 transition-colors hover:bg-white/[0.025] lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-sm font-bold text-white">
                        {member.firstName} {member.lastName}
                      </p>
                      <span className="text-xs text-frost/40">@{member.username}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-frost/45">{member.email}</p>
                    {member.phoneNumber && (
                      <p className="mt-0.5 text-xs text-frost/30">
                        {member.phoneNumber}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(member.roles || []).map((role) => (
                        <RoleBadge key={role} role={role} />
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-frost/25">
                      {member.reservationCount || 0} rezervasiya ·{' '}
                      {member.ticketCount || 0} bilet
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-frost/30">
                      Əməkdaş rolu
                    </span>
                    <select
                      value={currentRole}
                      onChange={(event) => changeRole(member, event.target.value)}
                      disabled={busyKey === String(member.id)}
                      className="rounded-xl border border-white/10 bg-night-900/80 px-3 py-2 text-xs font-bold text-white outline-none focus:border-ice-300/50 disabled:opacity-50"
                    >
                      {STAFF_ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_META[role].label}
                        </option>
                      ))}
                    </select>
                    {busyKey === String(member.id) && (
                      <span className="text-xs text-frost/40">Yenilənir...</span>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
