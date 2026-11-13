import { useState } from 'react'

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Şəkil oxuna bilmədi.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Düzgün şəkil faylı seçin.'))
      img.onload = () => {
        const maxSide = 1080
        let { width, height } = img
        if (width > maxSide || height > maxSide) {
          if (width >= height) {
            height = Math.round((height * maxSide) / width)
            width = maxSide
          } else {
            width = Math.round((width * maxSide) / height)
            height = maxSide
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = String(reader.result || '')
    }
    reader.readAsDataURL(file)
  })
}

export default function IdentityVerificationFields({
  documentNumber,
  onDocumentNumberChange,
  finCode,
  onFinCodeChange,
  photoData,
  onPhotoDataChange,
  confirmed,
  onConfirmedChange,
  showCheckbox = true,
  rejectionReason = '',
}) {
  const [photoError, setPhotoError] = useState('')
  const [compressing, setCompressing] = useState(false)

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError('Yalnız şəkil faylı (JPG, PNG, WEBP) yükləyin.')
      return
    }
    setPhotoError('')
    setCompressing(true)
    try {
      const compressed = await compressImageFile(file)
      onPhotoDataChange(compressed)
    } catch (err) {
      setPhotoError(err?.message || 'Şəkil emal edilə bilmədi.')
    } finally {
      setCompressing(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-ice-300/30 bg-ice-400/10 px-3.5 py-2.5 text-xs leading-relaxed text-ice-100">
        <b>İlk bilet təsdiqi:</b> Bu proses yalnız ilk alınan bilet üçün keçərlidir. Məlumatlarınız kassir tərəfindən yoxlanıldıqdan sonra biletiniz ən qısa müddətdə təsdiqlənəcək.
      </div>

      {rejectionReason && (
        <div className="rounded-xl border border-red-400/35 bg-red-500/12 px-3.5 py-2.5 text-xs text-red-100">
          <b>Əvvəlki müraciət rədd edilib:</b> {rejectionReason}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-frost/60">
            Şəxsiyyət vəsiqəsinin seriya və nömrəsi
          </label>
          <input
            type="text"
            value={documentNumber}
            onChange={(e) => onDocumentNumberChange(e.target.value)}
            maxLength={30}
            placeholder="AA1234567"
            className="w-full rounded-xl border border-white/15 bg-night-900/80 px-4 py-2.5 text-sm uppercase text-white placeholder-frost/30 outline-none transition-colors focus:border-ice-300/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-frost/60">
            FİN kod (7 simvol)
          </label>
          <input
            type="text"
            value={finCode}
            onChange={(e) => onFinCodeChange(e.target.value.toUpperCase())}
            maxLength={7}
            placeholder="5ABC123"
            className="w-full rounded-xl border border-white/15 bg-night-900/80 px-4 py-2.5 text-sm uppercase text-white placeholder-frost/30 outline-none transition-colors focus:border-ice-300/60"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/12 bg-night-900/60 p-3.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white">
          Şəxsiyyət vəsiqəsi ilə foto təsdiqi
        </p>
        <p className="mt-1 text-xs leading-relaxed text-frost/75">
          Şəxsiyyət vəsiqəsini görünür şəkildə sifətinizin yanına tutaraq aydın foto çəkin və yükləyin.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-frost/65">
          <li>Şəkil aydın, işıqlı və bulanıqsız olsun</li>
          <li>Sifətdə heç bir aksesuar olmasın (eynək, papaq, maska, şarf və s.)</li>
          <li>Şəxsiyyət vəsiqəsindəki şəkil, seriya nömrəsi və FİN kod oxunaqlı görünsün</li>
        </ul>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="btn-ghost cursor-pointer !px-4 !py-2 text-xs">
            {compressing
              ? 'Şəkil hazırlanır…'
              : photoData
                ? 'Şəkli dəyişdir'
                : 'Kamera / Qalereyadan şəkil seç'}
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {photoData && (
            <button
              type="button"
              onClick={() => onPhotoDataChange('')}
              className="text-xs font-semibold text-red-200 hover:text-red-100"
            >
              Şəkli sil
            </button>
          )}
        </div>

        {photoError && (
          <p className="mt-2 text-xs font-semibold text-red-200">{photoError}</p>
        )}

        {photoData && (
          <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-night-950/70 p-2">
            <img
              src={photoData}
              alt="Şəxsiyyət vəsiqəsi ilə foto təsdiqi"
              className="mx-auto max-h-56 rounded-lg object-contain"
            />
          </div>
        )}
      </div>

      {showCheckbox && (
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-frost/75">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onConfirmedChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-ice-300"
          />
          <span>
            18 yaşımdan böyük olduğumu, şəxsiyyət vəsiqəmi təqdim edəcəyimi və
            qeyd etdiyim məlumatların doğru olduğunu təsdiq edirəm.
          </span>
        </label>
      )}
    </div>
  )
}
