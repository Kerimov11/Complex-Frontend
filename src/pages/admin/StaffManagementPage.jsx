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
  const [editingMember, setEditingMember] = useState(null)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'ROLE_VOLUNTEER',
  })
  const [savingEdit, setSavingEdit] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

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
    if (!search.trim()) {
      load()
      return undefined
    }
    const timer = setTimeout(load, 200)
    return () => clearTimeout(timer)
  }, [load, search])

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
    setStaff((prev) => {
      const filtered = prev.filter((item) => item.id !== created.id)
      return [...filtered, created].sort((a, b) => a.id - b.id)
    })
    await load()
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

  function startEdit(member) {
    setError('')
    setSuccess('')
    setConfirmDeleteId(null)
    setEditingMember(member)
    setEditForm({
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      username: member.username || '',
      email: member.email || '',
      phoneNumber: member.phoneNumber || '',
      password: '',
      role: staffRoleOf(member) || 'ROLE_VOLUNTEER',
    })
  }

  async function saveEdit(event) {
    event.preventDefault()
    if (!editingMember) return
    setSavingEdit(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        phoneNumber: editForm.phoneNumber.trim() || null,
        password: editForm.password.trim() || null,
        role: editForm.role,
      }
      const updated = await adminApi.updateStaffMember(editingMember.id, payload)
      setStaff((prev) => prev.map((item) => (item.id === editingMember.id ? updated : item)))
      setSuccess(`${updated.username} məlumatları yeniləndi.`)
      setEditingMember(null)
    } catch (err) {
      setError(err?.message || 'Əməkdaş məlumatları yenilənmədi.')
    } finally {
      setSavingEdit(false)
    }
  }

  async function deleteMember(member) {
    setBusyKey(String(member.id))
    setError('')
    setSuccess('')
    try {
      await adminApi.deleteStaffMember(member.id)
      setStaff((prev) => prev.filter((item) => item.id !== member.id))
      if (editingMember?.id === member.id) setEditingMember(null)
      setConfirmDeleteId(null)
      setSuccess(`${member.username} əməkdaş siyahısından silindi.`)
    } catch (err) {
      setError(err?.message || 'Əməkdaş silinə bilmədi.')
    } finally {
      setBusyKey('')
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Əməkdaş idarəetməsi"
        title="Könüllü, kassir və koordinatorlar"
        description="Limitsiz əməkdaş hesabı yaradın və mövcud əməkdaşın rolunu bir kliklə yüksəldin."
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
            className={`rounded-lg border bg-night-800 p-4 ${
              role === 'ROLE_COORDINATOR'
                ? 'border-sky-300/25'
                : role === 'ROLE_CASHIER'
                  ? 'border-emerald-300/25'
                  : 'border-violet-300/25'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              {ROLE_META[role].label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-white">
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

      {editingMember && (
        <form onSubmit={saveEdit} className="glass mb-5 rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ice-300">
                Əməkdaşa düzəliş
              </p>
              <h3 className="font-display text-lg font-bold text-white">
                {editingMember.firstName} {editingMember.lastName} (@{editingMember.username})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingMember(null)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-frost/60 hover:text-white"
            >
              Bağla
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Ad
              </span>
              <input
                required
                value={editForm.firstName}
                onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none focus:border-ice-300/50"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Soyad
              </span>
              <input
                required
                value={editForm.lastName}
                onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none focus:border-ice-300/50"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                İstifadəçi adı
              </span>
              <input
                required
                value={editForm.username}
                onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none focus:border-ice-300/50"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                E-poçt
              </span>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none focus:border-ice-300/50"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Telefon (istəyə bağlı)
              </span>
              <input
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none focus:border-ice-300/50"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Rol
              </span>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none focus:border-ice-300/50"
              >
                {STAFF_ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_META[role].label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2 lg:col-span-3">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Yeni şifrə (dəyişmək istəmirsinizsə boş buraxın)
              </span>
              <input
                type="password"
                minLength={6}
                value={editForm.password}
                onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Minimum 6 simvol"
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-frost/30 focus:border-ice-300/50"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingMember(null)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-frost/70 hover:text-white"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={savingEdit}
              className="btn-primary !px-5 !py-2 text-xs disabled:opacity-50"
            >
              {savingEdit ? 'Yadda saxlanır...' : 'Yadda saxla'}
            </button>
          </div>
        </form>
      )}

      <div className="glass overflow-hidden rounded-xl">
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
              const visibleRoles = (member.roles || []).filter((role) =>
                STAFF_ROLE_OPTIONS.includes(role)
              )
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
                      {visibleRoles.map((role) => (
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
                    <button
                      type="button"
                      onClick={() => startEdit(member)}
                      disabled={busyKey === String(member.id)}
                      className="rounded-xl border border-ice-300/25 bg-ice-400/10 px-3 py-2 text-xs font-bold text-ice-200 transition-colors hover:bg-ice-400/20 disabled:opacity-50"
                    >
                      Düzəliş et
                    </button>
                    {confirmDeleteId === member.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => deleteMember(member)}
                          disabled={busyKey === String(member.id)}
                          className="rounded-xl border border-red-400/40 bg-red-500/25 px-3 py-2 text-xs font-bold text-red-100 transition-colors hover:bg-red-500/40 disabled:opacity-50"
                        >
                          Təsdiqlə
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={busyKey === String(member.id)}
                          className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-bold text-frost/60 hover:text-white"
                        >
                          Ləğv et
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(member.id)}
                        disabled={busyKey === String(member.id)}
                        className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                      >
                        Sil
                      </button>
                    )}
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
