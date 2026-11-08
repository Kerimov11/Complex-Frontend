import SectionTitle from '../components/SectionTitle'
import PricingSection from '../components/pricing/PricingSection'
import SafetyNotice from '../components/SafetyNotice'

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <SectionTitle
        eyebrow="Tariflər"
        title="Qiymət cədvəli və endirimlər"
        description="Standart qiymətlər, aylıq paketlər və bütün endirim şərtləri bir yerdə."
      />
      <div className="mx-auto mt-8 max-w-2xl">
        <SafetyNotice compact />
      </div>
      <div className="mt-10">
        <PricingSection detailed />
      </div>
    </div>
  )
}