import { NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export default function AdminSidebar() {
  const {
    user,
    isAdmin,
    isCoordinator,
    isCashier,
    isVolunteer,
    logout,
  } = useAuth()

  const canVolunteer = isAdmin || isCoordinator || isVolunteer
  const canCoordinate = isAdmin || isCoordinator

  const groups = [
    {
      label: 'Administrasiya',
      items: [
        {
          to: '/admin',
          end: true,
          label: 'İdarəetmə paneli',
          hint: 'Canlı analitika',
          show: isAdmin,
          icon: '▦',
        },
        {
          to: '/admin/staff',
          label: 'Əməkdaşlar',
          hint: 'Rol yüksəltmə',
          show: isAdmin,
          icon: '◈',
        },
        {
          to: '/admin/skates',
          label: 'Konki anbarı',
          hint: 'Stok və zədə',
          show: isAdmin,
          icon: '⛸',
        },
        {
          to: '/admin/finance',
          label: 'Maliyyə',
          hint: 'Onlayn ödənişlər',
          show: isAdmin,
          icon: '₼',
        },
      ],
    },
    {
      label: 'Smenlər və könüllülər',
      items: [
        {
          to: '/admin/shifts',
          label: 'Könüllü smenləri',
          hint: 'Canlı stansiyalar',
          show: isAdmin || isCoordinator,
          icon: '⌖',
        },
        {
          to: '/admin/shift-slots',
          label: 'Smen planlayıcısı',
          hint: 'Günlük slotlar',
          show: canCoordinate,
          icon: '◫',
        },
        {
          to: '/volunteer/reservations',
          label: 'Konki təhvili',
          hint: 'Rezervasiyalar',
          show: canVolunteer,
          icon: '✓',
        },
        {
          to: '/volunteer/inventory',
          label: 'Konki anbarı',
          hint: 'Ölçü üzrə canlı',
          show: !isAdmin && canVolunteer,
          icon: '⛸',
        },
        {
          to: '/volunteer/shifts',
          label: 'Mənim smenlərim',
          hint: 'Smen seçimi',
          show: isVolunteer,
          icon: '◷',
        },
      ],
    },
    {
      label: 'Əməliyyatlar',
      items: [
        {
          to: '/admin/pos',
          label: 'Kassir POS',
          hint: 'Yerində satış',
          show: !isCoordinator && (isAdmin || isCashier),
          icon: '▣',
        },
        {
          to: '/admin/verification',
          label: 'Turniket',
          hint: 'QR doğrulama',
          show: !isCashier && (isAdmin || isCoordinator || isVolunteer),
          icon: '⌁',
        },
        {
          to: '/admin/cashier-verification',
          label: 'Kassa QR',
          hint: 'Bilet məlumatları',
          show: !isCashier && (isAdmin || isCoordinator || isVolunteer),
          icon: '▤',
        },
        {
          to: '/admin/active',
          label: 'Buzdakı müştərilər',
          hint: 'Giriş və çıxış saatları',
          show: isAdmin || isCoordinator || isCashier || isVolunteer,
          icon: '◉',
        },
      ],
    },
    {
      label: 'Şəxsi',
      items: [
        {
          to: '/hesabim',
          label: 'Hesabım',
          hint: 'Profil və şifrə',
          show: true,
          icon: '⚙',
        },
      ],
    },
  ]
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.show),
    }))
    .filter((group) => group.items.length > 0)

  const mobileItems = groups.flatMap((group) => group.items)

  function linkClass(isActive, mobile = false) {
    if (mobile) {
      return `shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
        isActive
          ? 'border-ice-300/40 bg-ice-400/20 text-white shadow-sm'
          : 'border-white/10 bg-night-900/80 text-frost/70 hover:text-white'
      }`
    }
    return `group flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
      isActive
        ? 'bg-ice-400/15 text-white ring-1 ring-ice-300/30'
        : 'text-frost/65 hover:bg-white/5 hover:text-white'
    }`
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
      <div className="glass-strong hidden overflow-hidden rounded-xl lg:block">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ice-300">
            Ice Arena
          </p>
          <p className="mt-1 font-display text-lg font-bold text-white">
            İdarəetmə mərkəzi
          </p>
          <p className="mt-2 truncate text-xs text-frost/55">
            {user?.username || 'İstifadəçi'}
          </p>
        </div>

        <nav className="flex flex-col gap-3 p-3">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-1 pt-1 text-[9px] font-bold uppercase tracking-wider text-frost/25">
                {group.label}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => linkClass(isActive)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">
                        {item.label}
                      </span>
                      <span className="block truncate text-[11px] text-frost/40">
                        {item.hint}
                      </span>
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-frost/55 transition-colors hover:bg-red-400/10 hover:text-red-200"
          >
            Çıxış et
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 lg:hidden hide-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {mobileItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => linkClass(isActive, true)}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
