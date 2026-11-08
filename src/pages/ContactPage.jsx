import SectionTitle from '../components/SectionTitle'
import WorkingHours from '../components/home/WorkingHours'
import { SITE } from '../data/config'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <SectionTitle
        eyebrow="Əlaqə"
        title="Bizi tapmaq asandır"
        description="Nizami metrosunun yaxınlığında, Avropa otelinin yanında."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="glass rounded-xl p-7">
            <p className="font-display text-sm font-bold uppercase tracking-wider text-ice-200">
              Ünvan
            </p>
            <p className="mt-3 font-display text-lg font-bold text-white">
              {SITE.address}
            </p>
            <p className="mt-1 text-sm text-frost/65">{SITE.metro}</p>
            <p className="mt-2 font-mono text-xs tracking-wide text-frost/45">
              {SITE.coordsLabel}
            </p>
            <p className="mt-4 flex flex-wrap gap-2">
              {SITE.buses.map((b) => (
                <span key={b} className="chip">
                  Avtobus {b}
                </span>
              ))}
            </p>
          </div>

          <div className="glass rounded-xl p-7">
            <p className="font-display text-sm font-bold uppercase tracking-wider text-ice-200">
              Əlaqə
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <a
                href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-frost/80 transition-colors hover:text-white"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-ice-400/15 text-ice-200">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2.1L8 10a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.9.6 2.9.7a2 2 0 011.7 2z" />
                  </svg>
                </span>
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 text-frost/80 transition-colors hover:text-white"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-ice-400/15 text-ice-200">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </span>
                {SITE.email}
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-frost/80 transition-colors hover:text-white"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-ice-400/15 text-ice-200">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M12 2.2c3.2 0 3.6 0 4.8.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.81s-.01 3.54-.07 4.81c-.15 3.23-1.66 4.77-4.92 4.92-1.2.06-1.6.07-4.8.07-3.22 0-3.6 0-4.81-.07-3.26-.15-4.77-1.7-4.92-4.92C2.2 15.64 2.2 15.24 2.2 12s.01-3.54.07-4.81C2.42 3.96 3.93 2.42 7.19 2.27 8.4 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.52 0-4.71.07-2.5.12-3.63 1.3-3.75 3.75C3.47 9 3.47 9.38 3.47 12.5S3.47 16 3.54 17.18c.12 2.44 1.25 3.63 3.75 3.75 1.19.06 1.57.07 4.71.07s3.52 0 4.71-.07c2.5-.12 3.63-1.31 3.75-3.75.07-1.18.07-1.56.07-4.68s0-3.5-.07-4.68c-.12-2.45-1.25-3.63-3.75-3.75-1.19-.07-1.57-.07-4.71-.07Zm0 3.06a5.44 5.44 0 1 1 0 10.88 5.44 5.44 0 0 1 0-10.88Zm0 1.8a3.64 3.64 0 1 0 0 7.28 3.64 3.64 0 0 0 0-7.28Zm5.68-3.3a1.27 1.27 0 1 1 0 2.54 1.27 1.27 0 0 1 0-2.54Z" />
                  </svg>
                </span>
                {SITE.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        <div className="glass flex h-full min-h-[380px] flex-col overflow-hidden rounded-xl">
          <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-4">
            <a
              href={SITE.directionsLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary !px-4 !py-2 text-sm"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Marşrut qur
            </a>
            <a
              href={SITE.mapLink}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost !px-4 !py-2 text-sm"
            >
              Google Maps-də aç
            </a>
            <span className="chip ml-auto">{SITE.coordsLabel}</span>
          </div>
          <iframe
            title="Buz Arenası - xəritə (Tbilisi prospekti 12, Bakı)"
            src={SITE.mapEmbed}
            className="min-h-[340px] w-full flex-1 border-0 grayscale-[0.85] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      <div className="mt-14">
        <SectionTitle
          eyebrow="İş saatları"
          title="Bizə nə vaxt gələ bilərsiniz"
          description="İş saatları hər həftə yenilənə bilir."
        />
        <div className="mt-8">
          <WorkingHours />
        </div>
      </div>
    </div>
  )
}