import { Link } from 'react-router-dom'
import { SITE } from '../data/config'
import Logo from './Logo'

const QUICK_LINKS = [
  { to: '/', label: 'Ana səhifə' },
  { to: '/qiymetler', label: 'Qiymətlər' },
  { to: '/bilet', label: 'Bilet al' },
  { to: '/canli', label: 'Canlı yayım' },
  { to: '/haqqimizda', label: 'Haqqımızda' },
  { to: '/fealiyyetler', label: 'Fəaliyyətlər' },
  { to: '/qaydalar', label: 'Qaydalar və qadağalar' },
  { to: '/elaqe', label: 'Əlaqə' },
]

export default function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/10 bg-night-900/80 pb-28 pt-16 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-4">
              <Logo compact size="lg" />
              <div className="leading-tight">
                <p className="font-display text-base font-bold leading-snug text-white sm:text-lg">
                  Heydər Əliyev İdman və Konsert Kompleksi
                </p>
                <p className="text-gradient-ice mt-1 font-display font-bold tracking-wider">
                  BUZ ARENASI
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-frost/60">
              Buz idmanının bütün növləri üçün müasir, beynəlxalq standartlara
              cavab verən buz arenası.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="glass inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-frost transition-colors hover:border-ice-300/50 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 2.2c3.2 0 3.6 0 4.8.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.81s-.01 3.54-.07 4.81c-.15 3.23-1.66 4.77-4.92 4.92-1.2.06-1.6.07-4.8.07-3.22 0-3.6 0-4.81-.07-3.26-.15-4.77-1.7-4.92-4.92C2.2 15.64 2.2 15.24 2.2 12s.01-3.54.07-4.81C2.42 3.96 3.93 2.42 7.19 2.27 8.4 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.52 0-4.71.07-2.5.12-3.63 1.3-3.75 3.75C3.47 9 3.47 9.38 3.47 12.5S3.47 16 3.54 17.18c.12 2.44 1.25 3.63 3.75 3.75 1.19.06 1.57.07 4.71.07s3.52 0 4.71-.07c2.5-.12 3.63-1.31 3.75-3.75.07-1.18.07-1.56.07-4.68s0-3.5-.07-4.68c-.12-2.45-1.25-3.63-3.75-3.75-1.19-.07-1.57-.07-4.71-.07Zm0 3.06a5.44 5.44 0 1 1 0 10.88 5.44 5.44 0 0 1 0-10.88Zm0 1.8a3.64 3.64 0 1 0 0 7.28 3.64 3.64 0 0 0 0-7.28Zm5.68-3.3a1.27 1.27 0 1 1 0 2.54 1.27 1.27 0 0 1 0-2.54Z" />
                </svg>
                {SITE.instagramHandle}
              </a>
              <a
                href={SITE.tiktok}
                target="_blank"
                rel="noreferrer"
                className="glass inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-frost transition-colors hover:border-ice-300/50 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M21 8.5a6.5 6.5 0 0 1-4.1-1.4V15a5 5 0 1 1-5-5c.3 0 .6 0 .9.1v3.1a2 2 0 1 0 1.1 1.8V2h3.1a3.4 3.4 0 0 0 3.4 3.2V8.5z" />
                </svg>
                {SITE.tiktokHandle}
              </a>
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-ice-200">
              Sürətli keçidlər
            </p>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-frost/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-ice-200">
              İş saatları
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-frost/70">
              {SITE.workingHours.map((w) => (
                <li key={w.day} className="flex items-baseline justify-between gap-x-2">
                  <span className="shrink-0">{w.day}</span>
                  <span className="ml-auto whitespace-nowrap text-right text-[13px] font-semibold tabular-nums text-frost">
                    {w.ranges.join(' / ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-ice-200">
              Əlaqə
            </p>
            <address className="mt-4 space-y-3 text-sm not-italic text-frost/70">
              <p>
                <a
                  href={SITE.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {SITE.address}
                </a>
              </p>
              <p>{SITE.metro}</p>
              <p className="flex flex-wrap gap-1.5">
                {SITE.buses.map((b) => (
                  <span key={b} className="chip !px-2.5 !py-0.5">
                    {`Avtobus ${b}`}
                  </span>
                ))}
              </p>
              <p>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                  className="text-ice-200 hover:text-white"
                >
                  {SITE.phone}
                </a>
              </p>
              <p>
                <a
                  href={SITE.phone2Href}
                  className="text-ice-200 hover:text-white"
                >
                  {SITE.phone2}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-ice-200 hover:text-white"
                >
                  {SITE.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Rəsmi məlumatlar */}
        <div className="mt-12 rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ice-200">
            Rəsmi məlumatlar
          </p>
          <p className="mt-3 text-sm font-semibold text-frost/85">
            {SITE.official.founder}
          </p>
          <p className="font-display text-base font-bold text-white">
            {SITE.official.company}
          </p>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-frost/70 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
            <span>{`Ünvan: ${SITE.official.legalAddress}`}</span>
            <a
              href={SITE.official.phoneHref}
              className="transition-colors hover:text-white"
            >
              {`Tel: ${SITE.official.phone}`}
            </a>
            <a
              href={`mailto:${SITE.official.email}`}
              className="transition-colors hover:text-white"
            >
              {`Email: ${SITE.official.email}`}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-frost/50 sm:flex-row">
          <p>
            {`© ${new Date().getFullYear()} Heydər Əliyev İdman və Konsert Kompleksi (HƏİKK) - Buz Arenası`}
          </p>
        </div>
      </div>
    </footer>
  )
}