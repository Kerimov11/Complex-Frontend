import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'

const IMAGE =
  'https://images.unsplash.com/photo-1547866241-aa6d5a7be613?q=80&w=1600&auto=format&fit=crop'

const FACTS = [
  { label: 'İstismara verilmə', value: '1990-cı il, noyabr' },
  { label: 'Tikintinin başlanması', value: '1976–1977-ci illər' },
  { label: 'Tamaşaçı tutumu', value: '7 600 – 8 000 nəfər' },
  { label: 'Ümumi ərazi', value: '6,1 hektar' },
]

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
    body: 'Açıq konkisürmədən peşəkar məşğələlərə qədər — buz idmanını hər kəs üçün əlçatan edirik.',
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6">
      <SectionTitle
        eyebrow="Haqqımızda"
        title="Heydər Əliyev adına İdman-Konsert Kompleksi"
        description="Bakı şəhərində, Tbilisi prospektində yerləşən ölkənin əsas idman, konsert və sərgi mərkəzlərindən biri."
      />

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
        <div className="glass relative overflow-hidden rounded-xl">
          <img
            src={IMAGE}
            alt="Heydər Əliyev adına İdman-Konsert Kompleksinin Buz Arenası"
            className="h-80 w-full object-cover sm:h-96"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-950/85 via-night-950/20 to-transparent" />
          <p className="absolute bottom-4 left-4 text-sm font-semibold text-white/95">
            Tbilisi prospekti 12 · Buz Arenası
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-frost/75">
            <b>Heydər Əliyev adına İdman-Konsert Kompleksi</b> Bakının əsas idman
            və mədəniyyət məkanlarından biridir. Kompleksin inşasına 1976–1977-ci
            illərdə Ümummilli Lider Heydər Əliyevin təşəbbüsü ilə başlanılmış,
            bina 1990-cı ilin noyabr ayında istismara verilmişdir.
          </p>
          <p className="text-base leading-relaxed text-frost/75">
            2004-cü ilin mart ayında Prezident İlham Əliyevin sərəncamı ilə
            kompleksə Ümummilli Lider Heydər Əliyevin adı verilmişdir. I Avropa
            Oyunları və IV İslam Həmrəyliyi Oyunları ərəfəsində kompleks əsaslı
            şəkildə yenidən qurulmuşdur.
          </p>
          <p className="text-base leading-relaxed text-frost/75">
            Əsas arena 16 müxtəlif idman növü üzrə beynəlxalq yarışların, həmçinin
            konsertlərin, sərgilərin və kütləvi tədbirlərin keçirilməsinə imkan
            verir. Kompleksin tərkibindəki <b>Buz Arenası</b> isə fiqurlu
            konkisürmə, buzüstü xokkey və ictimai konkisürmə seansları üçün müasir
            infrastrukturla təchiz olunub.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link to="/bilet" className="btn-primary">
              Bilet al
            </Link>
            <Link to="/elaqe" className="btn-ghost">
              Bizimlə əlaqə
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.label} className="glass rounded-xl p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ice-200">
              {f.label}
            </p>
            <p className="mt-1.5 font-display text-lg font-bold text-white">
              {f.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
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