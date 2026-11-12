import { useCallback, useEffect, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { formatDate, formatNumber } from '../../components/admin/formatters'
import { verificationApi } from '../../services/api/verificationApi'

function clockTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 5)
  return date.toLocaleTimeString('az-AZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function durationLabel(minutes) {
  const value = Number(minutes) || 0
  if (value === 60) return '1 saat (60 dəq)'
  if (value === 30) return 'Yarım saat (30 dəq)'
  return value > 0 ? `${value} dəq` : '1 saat'
}

function remainingBadgeTone(minutes) {
  const value = Number(minutes) || 0
  if (value <= 10) return 'border-red-300/35 bg-red-500/15 text-red-100'
  if (value <= 20) return 'border-amber-300/35 bg-amber-400/15 text-amber-100'
  return 'border-emerald-300/35 bg-emerald-400/15 text-emerald-100'
}

function summarizeGuestList(items = []) {
  const totalTickets = items.length
  const totalPeople = items.reduce(
    (sum, item) => sum + (Number(item.participantCount) || 1),
    0
  )
  const groups = items.filter((item) => (Number(item.participantCount) || 1) > 1)
  const singles = items.filter((item) => (Number(item.participantCount) || 1) <= 1)
  const groupCount = groups.length
  const groupPeople = groups.reduce(
    (sum, item) => sum + (Number(item.participantCount) || 1),
    0
  )
  const singleCount = singles.length

  const parts = []
  if (groupCount > 0) {
    parts.push(`${groupCount} qrup (${groupPeople} nəfər)`)
  }
  if (singleCount > 0) {
    parts.push(`${singleCount} fərdi (${singleCount} nəfər)`)
  }

  const breakdownText = parts.length > 0 ? parts.join(' · ') : '0 bilet'

  return {
    totalTickets,
    totalPeople,
    groupCount,
    groupPeople,
    singleCount,
    breakdownText,
  }
}

export default function ActiveGuestsPage() {
  const [data, setData] = useState({ activeTickets: [], onIce: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true)
      setError('')
    }
    try {
      const result = await verificationApi.active()
      setData({
        activeTickets: Array.isArray(result?.activeTickets)
          ? result.activeTickets
          : [],
        onIce: Array.isArray(result?.onIce) ? result.onIce : [],
      })
      setError('')
      setUpdatedAt(new Date())
    } catch (err) {
      if (!silent) {
        setError(err?.message || 'Buzdakı müştərilər yüklənmədi.')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const timer = setInterval(() => load(true), 10000)
    return () => clearInterval(timer)
  }, [load])

  const activeTickets = data.activeTickets
  const onIce = data.onIce

  const activeSummary = summarizeGuestList(activeTickets)
  const onIceSummary = summarizeGuestList(onIce)

  const shortest = onIce.length
    ? Math.min(...onIce.map((item) => Number(item.minutesRemaining) || 0))
    : null

  const header = (
    <AdminPageHeader
      eyebrow="Canlı buz nəzarəti"
      title="Buzdakı müştərilər"
      description="Kassada təsdiqlənən biletlər əvvəlcə “Aktiv bilet” sayına düşür. Müştəri Turniketdə QR oxudub təsdiq aldıqda isə “Aktiv bilet” sayından azalır və “Buzdakı müştəri sayı”na əlavə olunur."
      actions={
        <button
          type="button"
          onClick={() => load()}
          className="btn-ghost !px-5 !py-2.5 text-sm"
        >
          Yenilə
        </button>
      }
    />
  )

  if (loading) {
    return (
      <div>
        {header}
        <div className="grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((key) => (
            <div key={key} className="glass h-36 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="mt-5 glass h-64 animate-pulse rounded-xl" />
      </div>
    )
  }

  return (
    <div>
      {header}

      {error && (
        <div className="mb-4">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}

      {/* Yuxarı Statistik Kartlar */}
      <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-3">
        {/* 1. Aktiv bilet (Kassada təsdiqlənənlər, hələ Turniketdən keçməyənlər) */}
        <div className="glass rounded-xl border border-amber-300/20 p-3.5 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-frost/45">
              Aktiv bilet
            </p>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-amber-300/25 bg-amber-400/10 text-sm font-bold text-amber-200">
              ▣
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {activeSummary.totalTickets > 0
              ? activeSummary.breakdownText
              : '0 bilet'}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-100">
              Ümumi: {formatNumber(activeSummary.totalPeople)} nəfər
            </span>
            <span className="text-[11px] text-frost/45">
              Kassada təsdiqlənib (Turniket gözləyir)
            </span>
          </div>
        </div>

        {/* 2. Buzdakı müştəri sayı (Turniketdə təsdiqlənənlər) */}
        <div className="glass rounded-xl border border-emerald-300/20 p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-frost/45">
              Buzdakı müştəri sayı
            </p>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-emerald-300/25 bg-emerald-400/10 text-sm font-bold text-emerald-200">
              ⛸
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            Ümumi: {formatNumber(onIceSummary.totalPeople)} nəfər
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-emerald-400/15 px-2.5 py-1 text-xs font-bold text-emerald-100">
              {onIceSummary.totalTickets > 0
                ? onIceSummary.breakdownText
                : '0 müştəri'}
            </span>
            <span className="text-[11px] text-frost/45">
              Turniketdə təsdiqlənib buzda olanlar
            </span>
          </div>
        </div>

        {/* 3. Ən tez çıxış vaxtı */}
        <div className="glass rounded-xl border border-ice-300/20 p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-frost/45">
              Ən tez çıxış vaxtı
            </p>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ice-300/25 bg-ice-400/10 text-sm font-bold text-ice-200">
              ◷
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {shortest === null ? '—' : `${shortest} dəq qalıb`}
          </p>
          <p className="mt-2 text-xs text-frost/45">
            Buzdan çıxmağa qalan ən qısa müddət
          </p>
        </div>
      </div>

      {updatedAt && (
        <p className="mt-3 text-right text-[10px] text-frost/35">
          Son yenilənmə:{' '}
          {updatedAt.toLocaleTimeString('az-AZ', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
      )}

      {/* Kassada təsdiqlənmiş, Turniket gözləyən Aktiv biletlər (varsa göstərilir) */}
      {activeTickets.length > 0 && (
        <section className="glass mt-4 overflow-hidden rounded-xl border border-amber-300/20">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-amber-400/[0.05] px-5 py-3.5">
            <div>
              <h2 className="font-display text-base font-bold text-white">
                Aktiv biletlər — Kassada təsdiqlənənlər (Turniket gözləyir)
              </h2>
              <p className="mt-0.5 text-xs text-frost/50">
                Bu biletlər Kassa QR-da skan edilib. Turniketdə oxudulan kimi buradan çıxıb aşağıdakı “Buzdakı müştərilər” siyahısına düşəcək.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-100">
                {activeSummary.breakdownText}
              </span>
              <span className="rounded-md border border-amber-300/30 bg-amber-400/20 px-3 py-1 text-xs font-bold text-white">
                Ümumi: {formatNumber(activeSummary.totalPeople)} nəfər
              </span>
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {activeTickets.map((item, idx) => {
              const count = Number(item.participantCount) || 1
              const isGroup = count > 1
              const participants = Array.isArray(item.participants)
                ? item.participants
                : []
              const fullName =
                item.ownerName ||
                item.customerName ||
                participants[0]?.name ||
                'Naməlum müştəri'

              return (
                <div
                  key={`active-${item.code || item.ticketCode}-${idx}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-amber-400/15 px-2.5 py-0.5 text-xs font-bold text-amber-200">
                        {isGroup ? `1 qrup (${count} nəfər)` : 'Fərdi (1 nəfər)'}
                      </span>
                      <span className="font-display text-sm font-bold text-white">
                        {fullName}
                      </span>
                      <span className="font-mono text-xs text-frost/45">
                        · {item.ticketCode || item.code}
                      </span>
                    </div>
                    {participants.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {participants.map((p, pIdx) => (
                          <span
                            key={p.reservationId || `${p.name}-${pIdx}`}
                            className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-frost/80"
                          >
                            {pIdx + 1}. <b className="text-white">{p.name || fullName}</b>
                            {p.skateSize ? ` (${p.skateSize} razmer)` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-xs text-frost/55">
                    <p>
                      Kassa təsdiqi:{' '}
                      <b className="font-mono text-amber-200">
                        {clockTime(item.cashierVerifiedAt)}
                      </b>
                    </p>
                    <p className="mt-0.5">{durationLabel(item.durationMinutes)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Buzdakı müştərilərin siyahısı (Turniketdə təsdiqlənib 1 saat və ya yarım saat vaxtı aktiv olanlar) */}
      <section className="glass mt-4 overflow-hidden rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              Buzdakı müştərilərin siyahısı
            </h2>
            <p className="mt-0.5 text-xs text-frost/50">
              Turniketdə QR-ı təsdiqlənib 1 saat və ya yarım saat vaxtı aktiv olan müştərilər sıra ilə (qrup olaraq gələnlərin hamısının Ad Soyadı, buza daxil olduğu saat və buzdan çıxmalı olduğu saat)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onIceSummary.totalTickets > 0 && (
              <span className="rounded-md bg-ice-400/15 px-3 py-1 text-xs font-bold text-ice-200">
                {onIceSummary.breakdownText}
              </span>
            )}
            <span className="rounded-md bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
              Ümumi: {formatNumber(onIceSummary.totalPeople)} nəfər
            </span>
          </div>
        </div>

        {onIce.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/5 text-xl text-ice-200">
              ⛸
            </span>
            <p className="mt-3 font-display text-base font-bold text-white">
              Hazırda buzda aktiv müştəri yoxdur
            </p>
            <p className="mt-1 text-xs text-frost/45">
              Turniket bölməsində müştərinin QR bileti skan edildikdə dərhal bu siyahıya düşəcək.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.08]">
            {/* Cədvəl / Siyahı başlığı (Desktop) */}
            <div className="hidden grid-cols-[56px_minmax(0,1.9fr)_0.9fr_1fr_1fr_130px] items-center gap-4 bg-white/[0.03] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-frost/45 lg:grid">
              <span>№</span>
              <span>Müştəri / Qrup üzvləri (Ad Soyad)</span>
              <span>Müddət / Konki</span>
              <span>Buza daxil olduğu saat</span>
              <span>Buzdan çıxmalı olduğu saat</span>
              <span className="text-right">Qalan vaxt</span>
            </div>

            {onIce.map((item, index) => {
              const minutes = Number(item.minutesRemaining) || 0
              const sizes = Array.isArray(item.skateSizes) ? item.skateSizes : []
              const participants = Array.isArray(item.participants)
                ? item.participants
                : []
              const count =
                Number(item.participantCount) || participants.length || 1
              const isGroup = count > 1
              const fullName =
                item.ownerName ||
                item.customerName ||
                participants[0]?.name ||
                'Naməlum müştəri'

              return (
                <div
                  key={`${item.source}-${item.code || item.ticketCode}-${index}`}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-white/[0.025] lg:grid-cols-[56px_minmax(0,1.9fr)_0.9fr_1fr_1fr_130px] lg:items-center lg:gap-4"
                >
                  {/* Sıra nömrəsi */}
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ice-400/15 font-display text-sm font-bold text-ice-200 ring-1 ring-ice-300/25">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold uppercase text-frost/45 lg:hidden">
                      Sıra #{index + 1}
                    </span>
                  </div>

                  {/* Müştəri Ad Soyadı / Qrup üzvlərinin hamısının Ad Soyadı */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {isGroup ? (
                        <span className="rounded-md border border-ice-300/35 bg-ice-400/20 px-2.5 py-0.5 text-xs font-bold text-ice-100">
                          1 qrup ({count} nəfər)
                        </span>
                      ) : (
                        <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-semibold text-frost/70">
                          Fərdi (1 nəfər)
                        </span>
                      )}
                      <p className="truncate font-display text-base font-bold text-white">
                        {fullName}
                      </p>
                      {isGroup && (
                        <span className="text-xs text-ice-200/80">
                          (Qrup olaraq gəliblər)
                        </span>
                      )}
                    </div>

                    {/* Qrup olduqda (məs. 5 nəfər) hamısının Ad Soyadı alt-alta / sıra ilə aydın göstərilir */}
                    {isGroup ? (
                      <div className="mt-2 rounded-lg border border-ice-300/20 bg-ice-400/[0.06] p-2.5">
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-ice-200">
                          Qrup üzvlərinin siyahısı ({count} nəfər · eyni QR bilet):
                        </p>
                        <div className="grid gap-1.5 sm:grid-cols-2">
                          {participants.map((p, pIdx) => (
                            <div
                              key={p.reservationId || `${p.name}-${pIdx}`}
                              className="flex items-center justify-between gap-2 rounded-md bg-night-950/55 px-2.5 py-1.5 text-xs"
                            >
                              <span className="truncate font-semibold text-white">
                                {pIdx + 1}. {p.name || `${fullName} (${pIdx + 1})`}
                              </span>
                              {p.skateSize && (
                                <span className="shrink-0 rounded bg-ice-400/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-ice-200">
                                  {p.skateSize} ölçü
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      participants[0]?.name &&
                      participants[0].name !== fullName && (
                        <p className="mt-0.5 text-xs text-frost/65">
                          İştirakçı: <b className="text-white">{participants[0].name}</b>
                        </p>
                      )
                    )}

                    <p className="mt-1.5 font-mono text-[11px] text-frost/40">
                      QR Bilet: {item.ticketCode || item.code || '—'}
                      {item.sessionDate ? ` · ${formatDate(item.sessionDate)}` : ''}
                    </p>
                  </div>

                  {/* Bilet müddəti və konki razmeri */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-frost/40 lg:hidden">
                      Müddət / Konki:{' '}
                    </span>
                    <p className="text-xs font-semibold text-white">
                      {durationLabel(item.durationMinutes)}
                    </p>
                    {sizes.length > 0 && (
                      <p className="mt-0.5 text-[11px] text-ice-200">
                        Konki: {sizes.join(', ')} ölçü
                      </p>
                    )}
                  </div>

                  {/* Buza daxil olduğu saat (Turniket təsdiq saatı) */}
                  <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/[0.07] px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/75">
                      Buza daxil olduğu saat
                    </p>
                    <p className="mt-0.5 font-mono text-base font-bold text-white">
                      {clockTime(item.checkedInAt)}
                    </p>
                  </div>

                  {/* Buzdan çıxmalı olduğu saat */}
                  <div className="rounded-lg border border-amber-300/20 bg-amber-400/[0.07] px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200/75">
                      Buzdan çıxmalı olduğu saat
                    </p>
                    <p className="mt-0.5 font-mono text-base font-bold text-white">
                      {clockTime(item.endsAt)}
                    </p>
                  </div>

                  {/* Qalan vaxt */}
                  <div className="flex items-center justify-between lg:justify-end">
                    <span className="text-xs text-frost/45 lg:hidden">Qalan vaxt:</span>
                    <span
                      className={`inline-flex items-center rounded-lg border px-3 py-1.5 font-display text-sm font-bold ${remainingBadgeTone(
                        minutes
                      )}`}
                    >
                      {minutes} dəq qalıb
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
