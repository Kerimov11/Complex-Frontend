import { useCallback, useEffect, useState } from 'react'
import AdminNotice from '../../components/admin/AdminNotice'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { formatNumber } from '../../components/admin/formatters'
import { adminApi } from '../../services/api/adminApi'

const EMPTY_FORM = { size: '', quantity: 20 }

export default function SkateInventoryPage() {
  const [skates, setSkates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busyId, setBusyId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setSkates(await adminApi.getSkates())
    } catch (err) {
      setError(err?.message || 'Konki stoku yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function createSkate(event) {
    event.preventDefault()
    setBusyId('create')
    setError('')
    setSuccess('')
    try {
      const created = await adminApi.createSkate({
        size: Number(form.size),
        quantity: Number(form.quantity),
      })
      setSkates((prev) => [...prev, created].sort((a, b) => a.size - b.size))
      setSuccess(`${created.size} ölçü anbara əlavə edildi.`)
      setForm(EMPTY_FORM)
      setShowForm(false)
    } catch (err) {
      setError(err?.message || 'Yeni ölçü yaradılmadı.')
    } finally {
      setBusyId('')
    }
  }

  async function changeStock(skate, type) {
    const verb = type === 'restock' ? 'əlavə ediləcək' : 'zədəli kimi silinəcək'
    const raw = window.prompt(`${skate.size} ölçü üçün ${verb} say:`, '1')
    if (raw === null) return
    const quantity = Number(raw)
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError('Say müsbət tam ədəd olmalıdır.')
      return
    }
    setBusyId(`${type}:${skate.id}`)
    setError('')
    setSuccess('')
    try {
      const updated =
        type === 'restock'
          ? await adminApi.restockSkate(skate.id, quantity)
          : await adminApi.writeOffSkate(skate.id, quantity)
      setSkates((prev) => prev.map((item) => (item.id === skate.id ? updated : item)))
      setSuccess(
        type === 'restock'
          ? `${quantity} ədəd ${skate.size} ölçü stoka əlavə edildi.`
          : `${quantity} ədəd ${skate.size} ölçü zədəli kimi silindi.`
      )
    } catch (err) {
      setError(err?.message || 'Stok əməliyyatı alınmadı.')
    } finally {
      setBusyId('')
    }
  }

  async function deleteSkate(skate) {
    if (!window.confirm(`${skate.size} ölçü inventardan tam silinsin?`)) return
    setBusyId(`delete:${skate.id}`)
    setError('')
    try {
      await adminApi.deleteSkate(skate.id)
      setSkates((prev) => prev.filter((item) => item.id !== skate.id))
      setSuccess(`${skate.size} ölçü silindi.`)
    } catch (err) {
      setError(err?.message || 'Ölçü silinmədi.')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Konki stok və icarə"
        title="İnventar idarəetməsi"
        description="Razmerlər üzrə canlı stok, yeni partiya və zədələnmiş konkilərin inventardan çıxarılması."
        actions={
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="btn-primary !px-5 !py-2.5 text-sm"
          >
            {showForm ? 'Formanı bağla' : '+ Yeni ölçü'}
          </button>
        }
      />

      {error && <div className="mb-3"><AdminNotice tone="error">{error}</AdminNotice></div>}
      {success && <div className="mb-3"><AdminNotice tone="success">{success}</AdminNotice></div>}

      {showForm && (
        <form onSubmit={createSkate} className="glass mb-5 rounded-3xl p-5">
          <h3 className="font-display text-lg font-bold text-white">Yeni ölçü əlavə et</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                Ölçü
              </span>
              <input
                type="number"
                min="20"
                max="50"
                value={form.size}
                onChange={(event) => setForm((prev) => ({ ...prev, size: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-frost/45">
                İlkin say
              </span>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-night-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-ice-300/50"
                required
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={busyId === 'create'}
            className="btn-primary mt-4 !px-5 !py-2.5 text-sm disabled:opacity-50"
          >
            {busyId === 'create' ? 'Əlavə olunur...' : 'Əlavə et'}
          </button>
        </form>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {loading && <div className="glass rounded-3xl p-8 text-sm text-frost/45">Yüklənir...</div>}
        {!loading && skates.length === 0 && (
          <div className="glass rounded-3xl p-8 text-sm text-frost/45">İnventar boşdur.</div>
        )}
        {!loading &&
          skates.map((skate) => {
            const total = Number(skate.totalQuantity) || 0
            const available = Number(skate.availableQuantity) || 0
            const damaged = Number(skate.damagedQuantity) || 0
            const used = Math.max(0, total - available)
            const rate = total === 0 ? 0 : (available / total) * 100
            return (
              <div key={skate.id} className="glass rounded-3xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-black text-white">{skate.size}</p>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-frost/35">
                      Razmer
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      available === 0
                        ? 'bg-red-400/10 text-red-200'
                        : available <= 5
                          ? 'bg-amber-400/10 text-amber-200'
                          : 'bg-emerald-400/10 text-emerald-200'
                    }`}
                  >
                    {available === 0 ? 'Bitib' : available <= 5 ? 'Azalır' : 'Stokda'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white/[0.04] px-2 py-2">
                    <p className="font-display text-lg font-bold text-white">{formatNumber(total)}</p>
                    <p className="text-[10px] text-frost/40">Ümumi</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] px-2 py-2">
                    <p className="font-display text-lg font-bold text-emerald-200">{formatNumber(available)}</p>
                    <p className="text-[10px] text-frost/40">Boşda</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] px-2 py-2">
                    <p className="font-display text-lg font-bold text-violet-200">{formatNumber(damaged)}</p>
                    <p className="text-[10px] text-frost/40">Zədəli</p>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ice-400 to-emerald-300"
                    style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-frost/35">
                  İstifadədə: {formatNumber(used)} · Mövcudluq: {rate.toFixed(0)}%
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    disabled={Boolean(busyId)}
                    onClick={() => changeStock(skate, 'restock')}
                    className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold text-emerald-200 disabled:opacity-40"
                  >
                    + Stok
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(busyId)}
                    onClick={() => changeStock(skate, 'writeoff')}
                    className="rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1.5 text-[11px] font-bold text-amber-200 disabled:opacity-40"
                  >
                    Zədəli sil
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(busyId)}
                    onClick={() => deleteSkate(skate)}
                    className="rounded-full border border-red-300/20 bg-red-400/10 px-3 py-1.5 text-[11px] font-bold text-red-200 disabled:opacity-40"
                  >
                    Sil
                  </button>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
