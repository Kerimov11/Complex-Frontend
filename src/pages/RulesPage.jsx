import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import SafetyNotice from '../components/SafetyNotice'
import WorkingHours from '../components/home/WorkingHours'
import {
  ARENA_RULES,
  EXTRA_TERMS,
  OBLIGATIONS,
  TRAUMA_NOTE,
} from '../data/rules'

function BlockTitle({ eyebrow, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-6 w-1 rounded-full bg-ice-400" />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-ice-300">
          {eyebrow}
        </p>
        <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
          {title}
        </h3>
      </div>
    </div>
  )
}

export default function RulesPage() {
  const [checked, setChecked] = useState({})
  const acceptedCount = OBLIGATIONS.filter((o) => checked[o.id]).length
  const allChecked = acceptedCount === OBLIGATIONS.length

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <SectionTitle
        eyebrow="Qaydalar"
        title="İstifadə şərtləri, qaydalar və qadağalar"
        description="Buz Arenasından istifadə etməzdən əvvəl aşağıdakı bəndlərlə mütləq tanış olun. Bütün qaydalar bütün iştirakçılar üçün qüvvədədir."
      />

      {/* 1. Yaş məhdudiyyəti — xüsusi vurğu (keçid düyməsi yoxdur: istifadəçi onsuz da qaydalar səhifəsindədir) */}
      <div className="mx-auto mt-10 max-w-3xl">
        <SafetyNotice showLink={false} />
      </div>

      {/* Travmatik idman növü xəbərdarlığı */}
      <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-ice-300/30 bg-ice-400/10 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ice-400/20 text-ice-200">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z" />
            </svg>
          </span>
          <div>
            <p className="font-display font-bold text-white">
              Qaydalara əməl etmək mütləqdir
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-frost/75">
              {TRAUMA_NOTE}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Qaydalar və qadağalar */}
      <section className="mt-14">
        <BlockTitle
          eyebrow="Bölmə 1"
          title="Kompleksin istifadə qaydaları və qadağaları"
        />

        <ol className="mt-7 grid gap-4 md:grid-cols-2">
          {ARENA_RULES.map((r) => (
            <li
              key={r.id}
              className="glass card-hover flex gap-4 rounded-lg p-5"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ice-400 font-display text-sm font-bold text-night-950">
                {r.id}
              </span>
              <div className="min-w-0">
                <p className="font-display font-bold text-white">{r.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-frost/70">
                  {r.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {EXTRA_TERMS.map((t) => (
            <div
              key={t.title}
              className="rounded-lg border border-amber-300/25 bg-amber-400/[0.07] p-5"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                Əlavə şərtlər
              </p>
              <p className="mt-2 font-display font-bold text-white">
                {t.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-frost/70">
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Müştəri öhdəlikləri və təsdiq */}
      <section className="mt-14">
        <BlockTitle
          eyebrow="Bölmə 2"
          title="Müştəri öhdəlikləri və təsdiq"
        />

        <div className="glass mt-7 rounded-xl p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-frost/70">
            Aşağıdakı hər bir bəndi oxuyub onu qəbul etdiyinizi bildirin.
            Bilet alışı zamanı bu öhdəliklərə əməl etməyi öz üzərinizə götürürsünüz.
          </p>

          <ul className="mt-6 space-y-3">
            {OBLIGATIONS.map((o) => {
              const isChecked = Boolean(checked[o.id])
              return (
                <li key={o.id}>
                  <label
                    htmlFor={`ob-${o.id}`}
                    className={`flex cursor-pointer items-start gap-3.5 rounded-lg border p-4 transition-all ${
                      isChecked
                        ? 'border-ice-300/60 bg-ice-400/12'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                    }`}
                  >
                    <input
                      id={`ob-${o.id}`}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(o.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-ice-300"
                    />
                    <span className="text-sm leading-relaxed text-frost/80">
                      {o.text}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div className="flex items-center gap-3">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10 sm:w-44">
                <div
                  className="h-full rounded-full bg-ice-400 transition-all duration-500"
                  style={{
                    width: `${(acceptedCount / OBLIGATIONS.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-frost/60">
                {acceptedCount}/{OBLIGATIONS.length} təsdiqlənib
              </span>
            </div>

            {allChecked ? (
              <span className="inline-flex items-center gap-2 rounded-md border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-200">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Bütün öhdəliklər təsdiqləndi
              </span>
            ) : (
              <span className="text-xs font-semibold text-frost/50">
                Bilet alışı üçün bütün bəndlər təsdiq olunmalıdır
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 4. İş saatları */}
      <section className="mt-14">
        <BlockTitle eyebrow="Bölmə 3" title="İş saatları" />
        <div className="mt-7">
          <WorkingHours />
        </div>
      </section>
    </div>
  )
}
