import { Link } from 'react-router-dom'
import { PRICING } from '../../data/pricing'
import { monthlyPrice } from '../../utils/pricing'

function DiscountCard({ title, detail, tag }) {
  return (
    <div className="glass card-hover rounded-lg p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-display font-bold text-white">{title}</p>
        {tag && <span className="chip chip-ice shrink-0 uppercase">{tag}</span>}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-frost/65">{detail}</p>
    </div>
  )
}

export default function PricingSection({ detailed = false }) {
  const m1 = monthlyPrice(false)
  const m2 = monthlyPrice(true)

  return (
    <div className="space-y-8">
      <div className="glass overflow-hidden rounded-xl">
        <div className="border-b border-white/10 bg-white/[0.04] px-6 py-4">
          <p className="font-display font-bold text-white">
            Standart qiymətlər
          </p>
          <p className="text-xs text-frost/55">
            Konki icarəsi qiymətə daxildir
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-ice-200">
                <th className="px-6 py-4 font-semibold">Müddət</th>
                <th className="px-6 py-4 font-semibold">Həftəiçi</th>
                <th className="px-6 py-4 font-semibold">
                  Həftəsonu
                  <span className="ml-2 normal-case text-frost/45">
                    (şənbə, bazar)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="px-6 py-4 font-medium text-frost">1 saat</td>
                <td className="px-6 py-4">
                  <span className="font-display text-lg font-bold text-white">
                    {PRICING.standard.weekday.hour}
                  </span>{' '}
                  <span className="text-xs text-ice-200">AZN</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-display text-lg font-bold text-white">
                    {PRICING.standard.weekend.hour}
                  </span>{' '}
                  <span className="text-xs text-ice-200">AZN</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-frost">Yarım saat</td>
                <td className="px-6 py-4">
                  <span className="font-display text-lg font-bold text-white">
                    {PRICING.standard.weekday.half}
                  </span>{' '}
                  <span className="text-xs text-ice-200">AZN</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-display text-lg font-bold text-white">
                    {PRICING.standard.weekend.half}
                  </span>{' '}
                  <span className="text-xs text-ice-200">AZN</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass card-hover flex flex-col rounded-lg p-5">
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-white">
              Aylıq abunəlik
            </p>
            <span className="chip chip-ice uppercase">12 giriş</span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-gradient-ice">
            {m1.price} AZN
          </p>
          <p className="mt-1 text-sm text-frost/65">
            {m1.entries} giriş, hər biri 1 saat
          </p>
        </div>
        <div className="glass card-hover flex flex-col rounded-lg p-5">
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-white">
              Aylıq abunəlik - öz konkisi
            </p>
            <span className="chip chip-ice uppercase">12 giriş</span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-gradient-ice">
            {m2.price} AZN
          </p>
          <p className="mt-1 text-sm text-frost/65">
            Şəxsi konkisi ilə gələnlər üçün. {m2.saved} AZN qənaət.
          </p>
        </div>
        <div className="rounded-lg border border-ice-300/25 bg-ice-400/10 p-5">
          <p className="font-display font-bold text-white">
            Qayda - bir eyni zamanda
          </p>
          <p className="mt-2 text-sm leading-relaxed text-frost/70">
            Endirimlər yalnız 1 saatlıq biletlər üçün keçərlidir və eyni anda
            yalnız bir endirim tətbiq oluna bilər.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DiscountCard
          tag="20%"
          title="Bazar günü səhər"
          detail="Bazar günü saat 10:00 - 12:00 arası bütün 1 saatlıq biletlərə 20% endirim."
        />
        <DiscountCard
          tag="20%"
          title="Tələbə endirimi"
          detail="Yalnız həftəiçi günlər. Tələbə bileti ilə 1 saat = 16 AZN. Yarım saatlıq paketlərə tətbiq olunmur."
        />
        <DiscountCard
          tag="20%"
          title="Qrup endirimi"
          detail="10 nəfər və daha çox. Həftəiçi adam başı 16 AZN, həftəsonu 20 AZN."
        />
        <DiscountCard
          title="Ailə endirimi"
          detail="Ailə neçə nəfərdirsə, 1 nəfər pulsuzdur (2+1 və ya 3+1)."
        />
        <DiscountCard
          title="5+1 kampaniyası"
          detail="Ən az 6 nəfər olduqda 1 nəfər pulsuz giriş."
        />
        <DiscountCard
          title="PUSH30"
          detail="Tətbiqdə premium paketləri olanlar üçün yalnız 1 dəfə 1 saat pulsuz giriş."
        />
        <DiscountCard
          title="Şəhid ailələri"
          detail="Giriş hər zaman pulsuzdur. Şəhidlik vəsiqəsi qeydiyyat zamanı təsdiq olunmalıdır."
        />
        <DiscountCard
          title="Qazilər"
          detail="İlk dəfə 1 saat pulsuz, 2-ci səfərdə 50% endirim (10 AZN), qalan səfərlər standart qiymət. Veteranlara şamil olunmur."
        />
        <DiscountCard
          title="Aylıq paketlər"
          detail={`12 giriş (1 saatlıq) = ${PRICING.monthly.standard} AZN. Öz konkisi ilə = ${PRICING.monthly.ownSkates} AZN.`}
        />
      </div>

      {detailed && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-frost/60">
            Qiymətləri hesablamaq üçün bilet səhifəsindən istifadə edin.
          </p>
          <Link to="/bilet" className="btn-primary">
            İndi bilet al
          </Link>
        </div>
      )}
    </div>
  )
}