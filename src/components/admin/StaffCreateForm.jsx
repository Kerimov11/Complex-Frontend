import { useState } from 'react'
import AdminNotice from './AdminNotice'
import { ROLE_META } from './RoleBadge'

export const STAFF_ROLE_OPTIONS = [
  'ROLE_VOLUNTEER',
  'ROLE_CASHIER',
  'ROLE_COORDINATOR',
]

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  phoneNumber: '',
}

const FIELDS = [
  ['firstName', 'Ad', 'text'],
  ['lastName', 'Soyad', 'text'],
  ['username', 'İstifadəçi adı', 'text'],
  ['email', 'E-poçt', 'email'],
  ['password', 'Şifrə', 'password'],
  ['phoneNumber', 'Telefon', 'text'],
]

export default function StaffCreateForm({ onCreate, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [role, setRole] = useState('ROLE_VOLUNTEER')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onCreate({ ...form, roles: [role] })
      setForm(EMPTY_FORM)
      setRole('ROLE_VOLUNTEER')
    } catch (err) {
      setError(err?.message || 'Əməkdaş hesabı yaradılmadı.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="glass mb-5 rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-white">
            Yeni əməkdaş hesabı
          </h3>
          <p className="mt-1 text-xs text-frost/45">
            Hesab yaradıldıqdan sonra rolu istənilən vaxt yüksəldə bilərsiniz.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-frost/55 hover:bg-white/10"
          >
            Bağla
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {FIELDS.map(([key, label, type]) => (
          <label key={key} className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
              {label}
            </span>
            <input
              type={type}
              value={form[key]}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, [key]: event.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
              required
              minLength={key === 'password' ? 6 : key === 'username' ? 3 : undefined}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STAFF_ROLE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRole(option)}
            className={`rounded-md border px-3 py-1.5 text-xs font-bold transition-colors ${
              role === option
                ? ROLE_META[option].className
                : 'border-white/10 bg-white/5 text-frost/45'
            }`}
          >
            {ROLE_META[option].label}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="btn-primary mt-4 !px-5 !py-2.5 text-sm disabled:opacity-50"
      >
        {busy ? 'Yaradılır...' : 'Hesabı yarat'}
      </button>
    </form>
  )
}
