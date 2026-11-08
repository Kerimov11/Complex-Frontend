import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import { SITE } from '../data/config'

const ACTIVITIES = [
  {
    title: 'Açıq konkisürmə',
    body: 'Bütün yaş qrupları üçün azad sürüş seansları. Konki icarəsi qiymətə daxildir.',
    icon: 'rollers',
  },
  {
    title: 'Fiqurlu konkisürmə',
    body: 'Peşəkar məşqçilərlə fərdi və qrup məşğələləri.',
    icon: 'star',
  },
  {
    title: 'Buzüstü xokkey',
    body: 'Uşaq və həvəskar xokkey komandaları üçün məşqlər və oyunlar.',
    icon: 'hockey',
  },
  {
    title: 'Doğum günləri',
    body: 'Doğum gününüzü buz üstündə qeyd edin - xüsusi paketlər mövcuddur.',
    icon: 'gift',
  },
  {
    title: 'Məktəb turu',
    body: 'Məktəb şagirdləri üçün təşkil olunan kollektiv sürüş seansları.',
    icon: 'school',
  },
  {
    title: 'Ailə günləri',
    body: 'Ailə endirimi ilə buzdan birlikdə həzz alın - 1 nəfər pulsuzdur.',
    icon: 'family',
  },
]

const ICONS = {
  rollers: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 8L7 5l3-2 2 3 3 2-3 3-4-3zm4 4l2-2 4 3-2 4-3 2-2-3 1-4zM7 5l-2 6 5 1"
    />
  ),
  star: <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3z" />,
  hockey: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 17l5-2 8-8 3 3-8 8-2 5-5-2-1-4zM13 6l4-2 3 3-2 4"
    />
  ),
  gift: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 12h16M12 12v9M12 4a2 2 0 00-4 0c0 2 4 2 4 3 0-1 4-1 4-3a2 2 0 10-4 0zM6 12V9h12v3M5 12v7h14v-7"
    />
  ),
  school: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 9l9-6 9 6v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9zM3 9l9 6 9-6M7 21v-8l5 3 5-3v8"
    />
  ),
  family: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
    />
  ),
}

export default function ActivitiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <SectionTitle
        eyebrow="Fəaliyyətlər"
        title="Buzda hər kəs üçün fəaliyyət"
        description="Azad sürüşdən peşəkar məşğələlərə qədər - seçim sizindir."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIVITIES.map((a) => (
          <div key={a.title} className="glass card-hover rounded-2xl p-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-ice-300 to-ice-600 text-night-900">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                {ICONS[a.icon]}
              </svg>
            </div>
            <p className="mt-4 font-display text-lg font-bold text-white">
              {a.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-frost/65">
              {a.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div className="glass rounded-3xl p-8">
          <p className="font-display text-lg font-bold text-white">
            Məşğələ klubları
          </p>
          <p className="mt-2 text-sm text-frost/60">
            Peşəkar məşqçilərlə məşğələlər üçün klublarla birbaşa əlaqə saxlayın.
          </p>
          <div className="mt-6 space-y-3">
            {SITE.clubs.map((c) => (
              <div
                key={c.name}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <div>
                  <p className="font-display font-bold text-white">{c.name}</p>
                  <p className="text-xs text-frost/55">Buz idmanı klubu</p>
                </div>
                <a
                  href={`tel:${c.phone.replace(/\s/g, '')}`}
                  className="btn-primary !px-4 !py-2 text-xs uppercase"
                >
                  {c.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <p className="font-display text-lg font-bold text-white">
            Kampaniyalar
          </p>
          <div className="mt-4 space-y-3 text-sm text-frost/70">
            <p className="flex items-center gap-2">
              <span className="chip chip-ice">Ailə</span>
              Ailə endirimi - 1 nəfər pulsuz (2+1 / 3+1)
            </p>
            <p className="flex items-center gap-2">
              <span className="chip chip-ice">5+1</span>
              6 nəfərdən 1 nəfər pulsuz
            </p>
            <p className="flex items-center gap-2">
              <span className="chip chip-ice">20%</span>
              Bazar 10:00 - 12:00 arası
            </p>
            <p className="flex items-center gap-2">
              <span className="chip chip-ice">Aylıq</span>
              12 giriş = 180 AZN, öz konkim ilə = 120 AZN
            </p>
          </div>
          <Link to="/qiymetler" className="btn-primary mt-6">
            Bütün endirimlər
          </Link>
        </div>
      </div>
    </div>
  )
}