import { Link } from 'react-router-dom'
import Hero from '../components/home/Hero'
import LiveStream from '../components/live/LiveStream'
import SafetyNotice from '../components/SafetyNotice'
import SectionTitle from '../components/SectionTitle'
import PricingSection from '../components/pricing/PricingSection'
import WorkingHours from '../components/home/WorkingHours'
import { SITE } from '../data/config'

const FEATURES = [
  {
    title: 'Konki rezervasiyası',
    body: 'Bilet alarkən konki ölçünü (razmer) qeyd edin - konkilar gəldiyiniz vaxt hazır olacaq.',
  },
  {
    title: 'Rəqəmsal bilet',
    body: 'Hər biletə unikal kod və QR təyin olunur. Çeki telefonunuzdan göstərərək buza daxil olun.',
  },
  {
    title: 'Canlı sayaç',
    body: 'Buz üstündəki kişi sayını real vaxtda izləyin və ən uyğun saata bilet alın.',
  },
]

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Yaş məhdudiyyəti — nəzərə çarpan vurğu bloku */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <SafetyNotice />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle
              align="left"
              eyebrow="Canlı yayım"
              title="Buz həmişə göz önündədir"
              description="Buz açıq olduğu müddətcə arenanı canlı izləyin. Hazırda buz üstündə neçə müştəri olduğunu rəqəmsal sayaçdan öyrənin."
            />
            <div className="mt-8 space-y-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ice-400/15 text-ice-200">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-bold text-white">{f.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-frost/65">
                      {f.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/bilet" className="btn-primary">
                Bilet al
              </Link>
              <Link to="/canli" className="btn-ghost">
                Canlı səhifə
              </Link>
            </div>
          </div>
          <LiveStream />
        </div>
      </section>

      <section className="bg-night-900/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="Qiymətlər"
            title="Şəffaf qiymət siyasəti"
            description="Endirimlər yalnız 1 saatlıq biletlər üçün keçərlidir və eyni anda yalnız bir endirim tətbiq oluna bilər."
          />
          <div className="mt-12">
            <PricingSection />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionTitle
          eyebrow="İş saatları"
          title="Bizi nə vaxt ziyarət edə bilərsiniz"
          description="İş saatları hər həftə yenilənə bilir. Xüsusi günlər haqqında Instagram səhifəmizdən məlumat alın."
        />
        <div className="mt-12">
          <WorkingHours />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="glass relative overflow-hidden rounded-xl p-8 sm:p-12">
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-wider text-ice-200">
                Məşğələlər və klublar
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                Peşəkar məşqçilərlə buz idmanı
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-frost/70">
                Ocaq Sport Club və Tamis Sport Club ilə əməkdaşlıq - fiqurlu
                konkisürmə, xokkey və sürətli konkisürmə məşğələləri.
              </p>
              <div className="mt-6 space-y-2.5">
                {SITE.clubs.map((c) => (
                  <a
                    key={c.name}
                    href={`tel:${c.phone.replace(/\s/g, '')}`}
                    className="glass flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm transition-colors hover:border-ice-300/40"
                  >
                    <span className="font-semibold text-white">{c.name}</span>
                    <span className="text-ice-200">{c.phone}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Link
                to="/fealiyyetler"
                className="btn-primary w-full text-center"
              >
                Bütün fəaliyyətlər
              </Link>
              <p className="text-center text-xs text-frost/50">
                Qruplar üçün xüsusi təkliflərimiz də var - qrup endirimi ilə
                tanış olun.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}