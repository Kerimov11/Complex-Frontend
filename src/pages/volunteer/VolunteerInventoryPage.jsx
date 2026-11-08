import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import StatCard from '../../components/admin/StatCard'
import { formatNumber } from '../../components/admin/formatters'
import { shiftApi } from '../../services/api/shiftApi'

export default function VolunteerInventoryPage() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setInventory(await shiftApi.getInventory())
    } catch (err) {
      setError(err?.message || 'Konki anbarı yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const totals = useMemo(
    () =>
      inventory.reduce(
        (result, item) => ({
          total: result.total + Number(item.totalQuantity || 0),
          available: result.available + Number(item.availableQuantity || 0),
          inUse: result.inUse + Number(item.inUseQuantity || 0),
          damaged: result.damaged + Number(item.damagedQuantity || 0),
        }),
        { total: 0, available: 0, inUse: 0, damaged: 0 }
      ),
    [inventory]
  )

  return (
    <div>
      <AdminPageHeader
        eyebrow="Könüllü iş masası"
        title="Konki anbarı"
        description="Ölçülər üzrə ümumi stok, hazırda istifadədə olan və zədəli konkilərin canlı görünüşü."
        actions={
          <button
            type="button"
            onClick={load}
            className="btn-ghost !px-5 !py-2.5 text-sm"
          >
            Yenilə
          </button>
        }
      />

      {error && (
        <div className="mb-3">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ümumi stok"
          value={formatNumber(totals.total)}
          hint="Bütün ölçülər"
          icon="⛸"
          tone="ice"
        />
        <StatCard
          label="Boşda"
          value={formatNumber(totals.available)}
          hint="Təhvile hazır"
          icon="✓"
          tone="green"
        />
        <StatCard
          label="İstifadədə"
          value={formatNumber(totals.inUse)}
          hint="Aktiv rezervasiyalarda"
          icon="◎"
          tone="violet"
        />
        <StatCard
          label="Zədəli"
          value={formatNumber(totals.damaged)}
          hint="Anbardan çıxarılıb"
          icon="!"
          tone={totals.damaged > 0 ? 'amber' : 'green'}
        />
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((key) => (
            <div key={key} className="glass h-40 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : inventory.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center text-sm text-frost/45">
          Anbarda konki qeydə alınmayıb.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {inventory.map((item) => {
            const percent = Math.max(0, Math.min(100, Number(item.availabilityPercent) || 0))
            const tone =
              percent <= 15
                ? 'bg-red-400'
                : percent <= 35
                  ? 'bg-amber-400'
                  : 'bg-ice-400'
            return (
              <div key={item.id} className="glass rounded-xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-frost/35">
                      Konki ölçüsü
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-white">
                      {item.size}
                      <span className="ml-1 text-sm font-bold text-frost/40">ölçü</span>
                    </p>
                  </div>
                  <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-ice-100">
                    {percent.toFixed(0)}%
                  </span>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${tone}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Info label="Boşda" value={item.availableQuantity} tone="text-emerald-200" />
                  <Info label="İstifadədə" value={item.inUseQuantity} tone="text-ice-100" />
                  <Info label="Ümumi" value={item.totalQuantity} tone="text-white" />
                  <Info label="Zədəli" value={item.damagedQuantity} tone="text-amber-200" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Info({ label, value, tone }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-2.5">
      <p className="text-[10px] uppercase tracking-wide text-frost/35">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${tone}`}>{formatNumber(value)}</p>
    </div>
  )
}
