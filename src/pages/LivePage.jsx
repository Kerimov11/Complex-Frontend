import SectionTitle from '../components/SectionTitle'
import LiveStream from '../components/live/LiveStream'

export default function LivePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <SectionTitle
        eyebrow="Canlı yayım"
        title="Buz Arenası - indiki an"
        description="Buz aktiv olduqda arenanın canlı görüntüsü. Sayaç buz üstündəki cari müştəri sayını göstərir."
      />
      <div className="mt-10">
        <LiveStream />
      </div>
    </div>
  )
}