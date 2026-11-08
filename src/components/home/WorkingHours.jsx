import { SITE } from '../../data/config'

/**
 * Həftənin günləri üzrə iş saatları — hər gün ayrıca blok/sətir.
 */
export default function WorkingHours() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
      {SITE.workingHours.map((w) => (
        <div
          key={w.day}
          className="glass card-hover flex flex-col rounded-2xl p-4"
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-ice-300">
            {w.day}
          </p>

          <div className="mt-3 flex flex-1 flex-col gap-2">
            {w.ranges.map((r) => (
              <p
                key={r}
                className="rounded-xl border border-white/10 bg-white/[0.05] px-2 py-2 text-center font-display text-sm font-extrabold tracking-wide text-white"
              >
                {r}
              </p>
            ))}
          </div>

          <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-[11px] text-frost/50">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 8v4l2.5 2.5" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Seans fasilələri ayrıdır
          </p>
        </div>
      ))}

      <div className="glass card-hover flex items-center gap-4 rounded-2xl p-5 sm:col-span-2 md:col-span-4 xl:col-span-7">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ice-300 to-ice-600 text-night-900">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 2.2c3.2 0 3.6 0 4.8.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.81s-.01 3.54-.07 4.81c-.15 3.23-1.66 4.77-4.92 4.92-1.2.06-1.6.07-4.8.07-3.22 0-3.6 0-4.81-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.81s.01-3.54.07-4.81c.15-3.23 1.66-4.77 4.92-4.92C8.4 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.52 0-4.71.07-2.5.12-3.63 1.3-3.75 3.75C3.47 9 3.47 9.38 3.47 12.5S3.47 16 3.54 17.18c.12 2.44 1.25 3.63 3.75 3.75 1.19.06 1.57.07 4.71.07s3.52 0 4.71-.07c2.5-.12 3.63-1.31 3.75-3.75.07-1.18.07-1.56.07-4.68s0-3.5-.07-4.68c-.12-2.45-1.25-3.63-3.75-3.75-1.19-.07-1.57-.07-4.71-.07Zm0 3.06a5.44 5.44 0 1 1 0 10.88 5.44 5.44 0 0 1 0-10.88Zm0 1.8a3.64 3.64 0 1 0 0 7.28 3.64 3.64 0 0 0 0-7.28Zm5.68-3.3a1.27 1.27 0 1 1 0 2.54 1.27 1.27 0 0 1 0-2.54Z" />
          </svg>
        </div>
        <div>
          <p className="font-display font-bold text-white">
            İş saatlarını izlə
          </p>
          <p className="text-sm text-frost/60">
            Dəyişikliklər və xüsusi günlər üçün bizi{' '}
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-ice-200 underline decoration-ice-300/40 underline-offset-4 hover:text-white"
            >
              Instagram
            </a>{' '}
            səhifəmizdən izləyin.
          </p>
        </div>
      </div>
    </div>
  )
}
