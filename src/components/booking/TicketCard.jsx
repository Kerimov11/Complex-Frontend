import { Link } from 'react-router-dom'
import QrCode from './QrCode'
import {
  formatDateAZ,
  dayNameAZ,
  formatDurationAZ,
  pad,
} from '../../utils/datetime'
import { formatPrice, ticketValidUntil } from '../../utils/ticket'

function shortTime(value) {
  return value ? String(value).slice(0, 5) : ''
}

export default function TicketCard({ ticket }) {
  const { people, session, id } = ticket
  const backendReservations = Array.isArray(ticket.backendReservations)
    ? ticket.backendReservations
    : []

  // Biletin etibarlılıq tarixi (sessiyanın bitmə vaxtınadək)
  const validUntil = ticketValidUntil(ticket)
  const validLabel = (() => {
    if (!validUntil) return '—'
    const d = new Date(validUntil)
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`
  })()

  return (
    <div className="glass-strong overflow-hidden rounded-xl">
      <div className="flex items-center justify-between gap-4 border-b border-dashed border-white/20 px-6 py-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-ice-300">
            Rəqəmsal bilet / Digital Ticket
          </p>
          <p className="mt-1 font-display text-xl font-bold tracking-wider text-white">
            {id}
          </p>
        </div>
        <div className="text-right">
          <span className="chip chip-ice uppercase">Təsdiqləndi</span>
          <p className="mt-1.5 text-[11px] font-semibold text-frost/55">
            Etibarlıq: {validLabel}-dək
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
        <div className="grid shrink-0 place-items-center rounded-lg border border-white/10 bg-white p-4 text-night-950">
          <QrCode value={id} />
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-frost/50">Tarix</p>
              <p className="mt-0.5 font-semibold text-white">
                {dayNameAZ(session.date)}, {formatDateAZ(session.date)}
              </p>
              <p className="text-ice-200">{shortTime(session.time)} - {shortTime(session.endTime)}</p>
            </div>
            <div>
              <p className="text-xs text-frost/50">Müddət</p>
              <p className="mt-0.5 font-semibold text-white">
                {formatDurationAZ(session.duration)}
              </p>
            </div>
            <div>
              <p className="text-xs text-frost/50">Ödəniş</p>
              <p className="mt-0.5 font-display text-lg font-bold text-white">
                {formatPrice(ticket.price.payable)}
              </p>
              {ticket.payment?.transactionId ? (
                <p className="mt-0.5 text-[10px] font-semibold text-emerald-200/80">
                  Ödəniş təsdiqləndi
                  {ticket.payment.last4
                    ? ` · •••• ${ticket.payment.last4}`
                    : ''}
                </p>
              ) : ticket.payment?.status === 'FREE' ? (
                <p className="mt-0.5 text-[10px] font-semibold text-emerald-200/80">
                  Pulsuz giriş
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-frost/50">
              İştirakçılar və konki razmerləri
            </p>
            <ul className="mt-3 space-y-2">
              {people.map((p, i) => (
                <li
                  key={`${i}-${p.skateSize}`}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-ice-400/15 text-xs font-bold text-ice-200">
                    {i + 1}
                  </span>
                  <span className="font-medium text-white">
                    {p.name ? p.name : `İştirakçı ${i + 1}`}
                  </span>
                  <span className="text-frost/50">
                    {p.age} yaş
                    {p.skateSize ? ` | konki razmer ${p.skateSize}` : ''}
                  </span>
                  {p.free && (
                    <span className="chip !py-0 uppercase text-emerald-300">
                      Pulsuz
                    </span>
                  )}
                  {backendReservations[i] && (
                    <span className="chip !py-0 text-[10px] uppercase text-ice-200">
                      Konki #{backendReservations[i].id}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {backendReservations.length > 0 && (
              <p className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-emerald-200/80">
                {backendReservations.length} konki rezervasiyası yaradıldı.
                Arenaya gəldikdə “Biletlərim” bölməsindən konki taymerini əl
                ilə aktivləşdirin.
              </p>
            )}
          </div>

          {ticket.discountNote && (
            <p className="flex items-start gap-2 text-xs text-ice-200">
              <span className="mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full bg-ice-400/15 text-[10px]">
                %
              </span>
              {ticket.discountNote}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.03] px-6 py-4">
        <div>
          <p className="text-xs text-frost/55">
            Giriş üçün bu çeki girişdə işçiyə göstərin. QR kod yalnız bir dəfə
            skan edilir.
          </p>
          {ticket.payment?.transactionId && (
            <p className="mt-1 font-mono text-[10px] text-frost/35">
              Ödəniş ID: {ticket.payment.transactionId.slice(0, 8)}…
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-ghost !px-4 !py-2 text-xs !font-bold uppercase"
          >
            Çap et
          </button>
          <Link to="/canli" className="btn-primary !px-4 !py-2 text-xs uppercase">
            Canlı yayım
          </Link>
        </div>
      </div>
    </div>
  )
}