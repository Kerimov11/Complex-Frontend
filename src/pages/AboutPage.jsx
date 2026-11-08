import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'

const IMAGE =
  'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?q=80&w=1600&auto=format&fit=crop'

const VALUES = [
  {
    title: 'Təhlükəsizlik',
    body: 'Buz səthinin gündəlik yoxlanışı, 4 yaşından aşağı uşaqların girişinin qəti qadağası və peşəkar nəzarət.',
  },
  {
    title: 'Keyfiyyət',
    body: 'Beynəlxalq standartlara uyğun buz səthi və müasir idman infrastrukturu.',
  },
  {
    title: 'İctimaiyyət',
    body: 'Açıq konkisürmədən peşəkar məşğələlərə qədər - buz idmanını hər kəs üçün əlçatan edirik.',
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <SectionTitle
        eyebrow="Haqqımızda"
        title="Heydər Əliyev İdman və Konsert Kompleksi"
        description="Buz Arenası - paytaxtın mərkəzində, Nizami metrosunun yaxınlığında müasir buz idmanı məkanı."
      />

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
        <div className="glass relative overflow-hidden rounded-xl">
          <img
            src={IMAGE}
            alt="Buz arenasında konkisürənlər"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 to-transparent" />
          <p className="absolute bottom-4 left-4 text-sm font-semibold text-white/90">
            Buz səthi - 4000 m²
          </p>
        </div>
        <div className="space-y-5">
          <p className="text-base leading-relaxed text-frost/75">
            Heydər Əliyev İdman və Konsert Kompleksinin Buz Arenası həm peşəkar
            idmançılar,
            həm də həvəskarlar üçün nəzərdə tutulub. Buz səthimiz fiqurlu
            konkisürmə, buzüstü xokkey və sürətli konkisürmə üzrə məşğələlər və
            yarışlar keçirməyə tam uyğundur.
          </p>
          <p className="text-base leading-relaxed text-frost/75">
            Açıq konkisürmə seanslarında hər kəsə konki icarəyə verilir. Bilet
            alarkən konki razmerinizi qeyd edin - konkilər sizi gözləyəcək.
          </p>
          <p className="text-base leading-relaxed text-frost/75">
            Buz açıq olduğu müddətcə arenanın canlı yayımını saytımızdan izləyə
            və buz üstündəki cari müştəri sayını görə bilərsiniz.
          </p>
          <Link to="/elaqe" className="btn-primary mt-2">
            Bizimlə əlaqə
          </Link>
        </div>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="glass card-hover rounded-lg p-6">
            <p className="font-display text-lg font-bold text-white">{v.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-frost/65">
              {v.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}