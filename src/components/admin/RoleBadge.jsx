const ROLE_META = {
  ROLE_ADMIN: {
    label: 'Admin',
    className: 'border-amber-300/30 bg-amber-400/10 text-amber-200',
  },
  ROLE_COORDINATOR: {
    label: 'Koordinator',
    className: 'border-sky-300/30 bg-sky-400/10 text-sky-200',
  },
  ROLE_CASHIER: {
    label: 'Kassir',
    className: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200',
  },
  ROLE_VOLUNTEER: {
    label: 'Könüllü',
    className: 'border-violet-300/30 bg-violet-400/10 text-violet-200',
  },
  ROLE_USER: {
    label: 'İstifadəçi',
    className: 'border-white/15 bg-white/5 text-frost/70',
  },
}

export default function RoleBadge({ role }) {
  const meta = ROLE_META[role] || {
    label: role?.replace('ROLE_', '') || '—',
    className: 'border-white/15 bg-white/5 text-frost/70',
  }
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${meta.className}`}
    >
      {meta.label}
    </span>
  )
}

export { ROLE_META }
