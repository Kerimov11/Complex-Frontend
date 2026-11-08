import { useCallback, useEffect, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import RoleBadge, { ROLE_META } from '../../components/admin/RoleBadge'
import { adminApi } from '../../services/api/adminApi'
import { useAuth } from '../../auth/AuthContext'

const ROLE_OPTIONS = [
  'ROLE_USER',
  'ROLE_VOLUNTEER',
  'ROLE_CASHIER',
  'ROLE_COORDINATOR',
  'ROLE_ADMIN',
]

const EMPTY_FORM = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  roles: ['ROLE_USER'],
}

export default function UserManagementPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busyKey, setBusyKey] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setUsers(await adminApi.getUsers(search))
    } catch (err) {
      setError(err?.message || 'İstifadəçilər yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [load])

  async function toggleRole(user, role) {
    if (!user || busyKey) return
    const has = user.roles?.includes(role)
    if (role === 'ROLE_ADMIN' && user.username === currentUser?.username && has) {
      setError('Öz admin rolunuzu silə bilməzsiniz.')
      return
    }
    setBusyKey(`${user.id}:${role}`)
    setError('')
    setSuccess('')
    try {
      const updated = has
        ? await adminApi.removeUserRole(user.id, role)
        : await adminApi.addUserRole(user.id, role)
      setUsers((prev) => prev.map((item) => (item.id === user.id ? updated : item)))
      setSuccess(`${user.username} üçün ${ROLE_META[role]?.label || role} rolu yeniləndi.`)
    } catch (err) {
      setError(err?.message || 'Rol dəyişdirilə bilmədi.')
    } finally {
      setBusyKey('')
    }
  }

  async function createStaff(event) {
    event.preventDefault()
    setBusyKey('create')
    setError('')
    setSuccess('')
    try {
      const created = await adminApi.createStaff(form)
      setUsers((prev) => [...prev, created].sort((a, b) => a.id - b.id))
      setSuccess(`${created.username} hesabı yaradıldı.`)
      setForm(EMPTY_FORM)
      setShowCreate(false)
    } catch (err) {
      setError(err?.message || 'Yeni istifadəçi yaradılmadı.')
    } finally {
      setBusyKey('')
    }
  }

  function toggleFormRole(role) {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((item) => item !== role)
        : [...prev.roles, role],
    }))
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="İstifadəçi idarəetməsi"
        title="Rollar və əməkdaşlar"
        description="Kassir və könüllü rollarını təyin edin, ləğv edin və yeni əməkdaş hesabı yaradın."
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

      {error && <div className="mb-3"><AdminNotice tone="error">{error}</AdminNotice></div>}
      {success && <div className="mb-3"><AdminNotice tone="success">{success}</AdminNotice></div>}

      {showCreate && (
        <form onSubmit={createStaff} className="glass mb-5 rounded-xl p-5">
          <h3 className="font-display text-lg font-bold text-white">Yeni əməkdaş hesabı</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              ['firstName', 'Ad'],
              ['lastName', 'Soyad'],
              ['username', 'İstifadəçi adı'],
              ['email', 'E-poçt'],
              ['password', 'Şifrə'],
              ['phoneNumber', 'Telefon'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                  {label}
                </span>
                <input
                  type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
                  value={form[key]}
                  onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
                  required={['firstName', 'lastName', 'username', 'email', 'password'].includes(key)}
                />
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleFormRole(role)}
                className={`rounded-md border px-3 py-1.5 text-xs font-bold transition-colors ${
                  form.roles.includes(role)
                    ? ROLE_META[role].className
                    : 'border-white/10 bg-white/5 text-frost/45'
                }`}
              >
                {ROLE_META[role].label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={busyKey === 'create' || form.roles.length === 0}
            className="btn-primary mt-4 !px-5 !py-2.5 text-sm disabled:opacity-50"
          >
            {busyKey === 'create' ? 'Yaradılır...' : 'Hesabı yarat'}
          </button>
        </form>
      )}

      <div className="glass overflow-hidden rounded-xl">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-white">
            {loading ? 'Yüklənir...' : `${users.length} istifadəçi`}
          </p>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ad, istifadəçi adı və ya e-poçt..."
            className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-frost/30 focus:border-ice-300/50 sm:w-72"
          />
        </div>

        <div className="divide-y divide-white/[0.06]">
          {loading && <div className="p-8 text-center text-sm text-frost/45">Yüklənir...</div>}
          {!loading && users.length === 0 && (
            <div className="p-8 text-center text-sm text-frost/45">İstifadəçi tapılmadı.</div>
          )}
          {!loading &&
            users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-white/[0.025] lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-sm font-bold text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <span className="text-xs text-frost/40">@{user.username}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-frost/45">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(user.roles || []).map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-frost/25">
                    {user.reservationCount} rezervasiya · {user.ticketCount} bilet
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {ROLE_OPTIONS.filter((role) => role !== 'ROLE_USER').map((role) => {
                    const active = user.roles?.includes(role)
                    const key = `${user.id}:${role}`
                    return (
                      <button
                        key={role}
                        type="button"
                        disabled={Boolean(busyKey)}
                        onClick={() => toggleRole(user, role)}
                        className={`rounded-md border px-3 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-40 ${
                          active
                            ? ROLE_META[role].className
                            : 'border-white/10 bg-white/5 text-frost/40 hover:bg-white/10'
                        }`}
                      >
                        {busyKey === key ? '...' : active ? `${ROLE_META[role].label} ✓` : `+ ${ROLE_META[role].label}`}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
