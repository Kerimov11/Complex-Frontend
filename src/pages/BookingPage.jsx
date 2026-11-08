import SectionTitle from '../components/SectionTitle'
import SafetyNotice from '../components/SafetyNotice'
import BookingWizard from '../components/booking/BookingWizard'

export default function BookingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <SectionTitle
        eyebrow="Onlayn bilet"
        title="Bilet al və konki rezervasiya et"
        description="Tarixi seçin, iştirakçıların yaşını və konki razmerlərini qeyd edin. Sessiya avtomatik təyin olunur; konki rezervasiyasını arenaya gəldikdə “Biletlərim” bölməsindən aktivləşdirin."
      />
      <div className="mx-auto mt-8 max-w-2xl">
        <SafetyNotice />
      </div>
      <div className="mt-10">
        <BookingWizard />
      </div>
    </div>
  )
}