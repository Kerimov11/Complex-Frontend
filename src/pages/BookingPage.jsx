import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import SafetyNotice from '../components/SafetyNotice'
import BookingWizard from '../components/booking/BookingWizard'
import { useAuth } from '../auth/AuthContext'
import { loadLastVoucher } from '../utils/voucher'

export default function BookingPage() {
  const { isCustomer, user } = useAuth()
  const [hasTicket, setHasTicket] = useState(() => Boolean(loadLastVoucher()))
  const needsFirstTicketVerification = Boolean(
    isCustomer && (!user?.ageVerified || !user?.identityConfirmed)
  )
  const minorBlocked = Boolean(
    isCustomer && user?.ageVerified && user?.isAdult === false
  )

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <SectionTitle
        eyebrow="Onlayn bilet"
        title="Bilet al və konki rezervasiya et"
        description="Tarixi seçin, iştirakçıların sayını və konki razmerlərini qeyd edin. Biletiniz limitsizdir — saat seçimi yoxdur; QR kod təsdiqlənənədək istədiyiniz gün və iş saatında gəlib buza daxil ola bilərsiniz."
      />
      {!hasTicket && (
        <div className="mx-auto mt-8 max-w-2xl">
          <SafetyNotice />
        </div>
      )}

      {minorBlocked ? (
        <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-red-400/40 bg-red-500/10 p-5">
          <p className="font-display text-lg font-bold text-red-100">
            18 yaşdan kiçik şəxslər bilet ala bilməz
          </p>
          <p className="mt-2 text-sm leading-relaxed text-red-100/75">
            Hesabınızda qeyd olunan yaş 18-dən kiçikdir. Bu səbəbdən onlayn
            bilet satışı və konki rezervasiyası əlçatan deyil. Arenaya giriş
            qaydaları ilə tanış ola bilərsiniz.
          </p>
          <Link
            to="/qaydalar"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-red-300/40 bg-red-500/15 px-4 py-2 text-xs font-bold text-red-50 transition-colors hover:border-red-200/70 hover:bg-red-500/25"
          >
            Qaydalar və qadağalar
          </Link>
        </div>
      ) : (
        <>
          {needsFirstTicketVerification && !hasTicket && (
            <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-ice-300/30 bg-ice-400/10 p-5">
              <p className="font-display font-bold text-white">
                18+ yaş və şəxsiyyət vəsiqəsi tələbi
              </p>
              <p className="mt-2 text-sm leading-relaxed text-frost/70">
                18 yaşdan kiçik şəxslərə onlayn bilet satışı qadağandır. İlk
                bilet alışınızda yaşınızın 18+ olduğunu və şəxsiyyət vəsiqənizi
                bir dəfə təsdiqləməyiniz kifayətdir; növbəti biletlərdə təkrar
                soruşulmayacaq.
              </p>
            </div>
          )}
          <div className="mt-10">
            <BookingWizard onTicketChange={setHasTicket} />
          </div>
        </>
      )}
    </div>
  )
}
