import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { isSnowfallEnabled, setSnowfallEnabled } from '../../components/Snowfall'
import { api } from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import { formatDateAZ, pad } from '../../utils/datetime'

function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

function getInitials(firstName, lastName, username) {
  const f = (firstName || '').trim().charAt(0)
  const l = (lastName || '').trim().charAt(0)
  if (f || l) return `${f}${l}`.toUpperCase()
  return (username || 'H').trim().slice(0, 2).toUpperCase()
}

export default function AccountPage() {
  const { user, isStaff, isAdmin, isCoordinator, isCashier, isVolunteer, updateVerification, verifyIdentity, logout } = useAuth()

  const [profile, setProfile] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Şəxsi məlumatlar forması
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [profileBusy, setProfileBusy] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

  // Şifrə dəyişdirmə forması
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordBusy, setPasswordBusy] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Şəxsiyyət vəsiqəsi təsdiqi
  const [docNumber, setDocNumber] = useState('')
  const [docBusy, setDocBusy] = useState(false)
  const [docError, setDocError] = useState('')
  const [docSuccess, setDocSuccess] = useState('')

  // Qar animasiyası tənzimləməsi
  const [snowEnabled, setSnowEnabled] = useState(isSnowfallEnabled)
  const [copiedUsername, setCopiedUsername] = useState(false)

  const populateForm = useCallback((data) => {
    if (!data) return
    setFirstName(data.firstName || '')
    setLastName(data.lastName || '')
    setEmail(data.email || '')
    setPhoneNumber(data.phoneNumber || '')
    setDateOfBirth(data.dateOfBirth || '')
  }, [])

  const loadAccountData = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const [profileData, ticketList] = await Promise.all([
        api.getCustomerProfile(),
        api.getMyTickets().catch(() => []),
      ])
      setProfile(profileData)
      populateForm(profileData)
      setTickets(Array.isArray(ticketList) ? ticketList : [])
      if (profileData) {
        updateVerification(profileData)
      }
    } catch (err) {
      setLoadError(err?.message || 'Hesab məlumatları yüklənmədi.')
    } finally {
      setLoading(false)
    }
  }, [populateForm, updateVerification])

  useEffect(() => {
    loadAccountData()
  }, [loadAccountData])

  function handleSnowToggle() {
    const next = !snowEnabled
    setSnowEnabled(next)
    setSnowfallEnabled(next)
  }

  async function handleCopyUsername() {
    const uname = profile?.username || user?.username || ''
    if (!uname || !navigator?.clipboard) return
    try {
      await navigator.clipboard.writeText(uname)
      setCopiedUsername(true)
      setTimeout(() => setCopiedUsername(false), 2000)
    } catch {
      // ignore
    }
  }

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')

    if (!firstName.trim() || !lastName.trim()) {
      setProfileError('Ad və soyad boş ola bilməz.')
      return
    }
    if (!email.trim()) {
      setProfileError('E-poçt (Gmail) ünvanı boş ola bilməz.')
      return
    }
    if (!phoneNumber.trim()) {
      setProfileError('Telefon nömrəsi boş ola bilməz.')
      return
    }

    setProfileBusy(true)
    try {
      const updated = await api.updateCustomerProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || null,
        dateOfBirth: dateOfBirth || null,
      })
      setProfile(updated)
      populateForm(updated)
      updateVerification(updated)
      setProfileSuccess('Profil məlumatlarınız uğurla yeniləndi.')
    } catch (err) {
      setProfileError(err?.message || 'Məlumatları yeniləmək alınmadı.')
    } finally {
      setProfileBusy(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!currentPassword) {
      setPasswordError('Cari şifrəni daxil edin.')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Yeni şifrə ilə təkrarı eyni deyil.')
      return
    }
    if (currentPassword === newPassword) {
      setPasswordError('Yeni şifrə cari şifrədən fərqli olmalıdır.')
      return
    }

    setPasswordBusy(true)
    try {
      const res = await api.changeCustomerPassword({
        currentPassword,
        newPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess(res?.message || 'Şifrəniz uğurla dəyişdirildi.')
    } catch (err) {
      setPasswordError(err?.message || 'Şifrəni dəyişdirmək alınmadı.')
    } finally {
      setPasswordBusy(false)
    }
  }

  async function handleIdentitySubmit(e) {
    e.preventDefault()
    setDocError('')
    setDocSuccess('')
    const cleaned = docNumber.trim()
    if (cleaned.length < 5) {
      setDocError('Şəxsiyyət vəsiqəsinin seriya və nömrəsini düzgün daxil edin.')
      return
    }

    setDocBusy(true)
    try {
      const vData = await verifyIdentity({
        identityDocumentNumber: cleaned,
        confirmed: true,
      })
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              identityConfirmed: vData.identityConfirmed,
              identityDocumentLast4: vData.identityDocumentLast4,
              identityConfirmedAt: vData.identityConfirmedAt,
            }
          : prev
      )
      setDocNumber('')
      setDocSuccess('Şəxsiyyət vəsiqəsi uğurla təsdiqləndi.')
    } catch (err) {
      setDocError(err?.message || 'Təsdiq alınmadı.')
    } finally {
      setDocBusy(false)
    }
  }

  const activeTicketCount = tickets.filter(
    (t) => t.ticketStatus === 'ACTIVE'
  ).length
  const usedTicketCount = tickets.filter((t) => t.ticketStatus === 'USED').length
  const totalTicketCount = tickets.length

  const displayUsername = profile?.username || user?.username || '—'
  const displayFullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
    displayUsername
  const displayEmail = profile?.email || '—'
  const displayDob = profile?.dateOfBirth
    ? formatDateAZ(profile.dateOfBirth)
    : 'Qeyd edilməyib'
  const displayAge =
    profile?.age !== null && profile?.age !== undefined
      ? `${profile.age} yaş`
      : null

  return (
    <div className="pt-28 pb-24">
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle
            eyebrow="Şəxsi kabinet"
            title="Hesabım"
            subtitle="İstifadəçi məlumatlarınızı, doğum tarixinizi, təhlükəsizlik şifrənizi və görünüş seçimlərinizi buradan idarə edin."
            align="left"
          />
          <div className="flex flex-wrap items-center gap-2">
            {isStaff ? (
              <Link to="/admin" className="btn-primary !px-5 !py-2.5 text-xs">
                ← İdarəetmə panelinə qayıt
              </Link>
            ) : (
              <>
                <Link to="/biletlerim" className="btn-ghost !px-4 !py-2.5 text-xs">
                  Biletlərim ({totalTicketCount})
                </Link>
                <Link to="/bilet" className="btn-primary !px-5 !py-2.5 text-xs">
                  Yeni bilet al
                </Link>
              </>
            )}
          </div>
        </div>

        {loadError && (
          <div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {loadError}
          </div>
        )}

        {loading ? (
          <div className="glass mt-8 rounded-2xl p-10 text-center text-sm text-frost/70">
            Hesab məlumatları yüklənir...
          </div>
        ) : (
          <>
            {/* Yuxarı Xülasə Kartı */}
            <div className="glass-strong mt-8 rounded-2xl border border-white/10 p-6 sm:p-7">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-ice-300/30 bg-gradient-to-br from-ice-400/25 to-ice-600/20 font-display text-2xl font-bold text-ice-100 shadow-inner">
                    {getInitials(
                      profile?.firstName,
                      profile?.lastName,
                      displayUsername
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-display text-xl font-bold text-white sm:text-2xl">
                        {displayFullName}
                      </h2>
                      <span className="rounded-full border border-ice-300/30 bg-ice-400/10 px-2.5 py-0.5 text-[11px] font-bold text-ice-200">
                        {isAdmin
                          ? 'Administrator'
                          : isCoordinator
                            ? 'Koordinator'
                            : isCashier
                              ? 'Kassir'
                              : isVolunteer
                                ? 'Könüllü'
                                : 'Müştəri hesabı'}
                      </span>
                      {!isStaff && profile?.ageVerified && (
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                            profile.isAdult
                              ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200'
                              : 'border-amber-300/30 bg-amber-400/10 text-amber-200'
                          }`}
                        >
                          {profile.isAdult ? '18+ Yetkin' : '18 yaşdan kiçik'}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-frost/80">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-frost/60">İstifadəçi adı:</span>
                        <button
                          type="button"
                          onClick={handleCopyUsername}
                          title="Kopyalamaq üçün üzərinə klikləyin"
                          className="cursor-pointer font-mono font-bold text-ice-200 transition hover:text-white"
                        >
                          @{displayUsername}
                          {copiedUsername && (
                            <span className="ml-1.5 font-sans text-[10px] font-semibold text-emerald-300">
                              ✓ Kopyalandı
                            </span>
                          )}
                        </button>
                      </span>
                      <span>
                        <span className="text-frost/60">Gmail / E-poçt:</span>{' '}
                        <strong className="text-white">{displayEmail}</strong>
                      </span>
                      <span>
                        <span className="text-frost/60">Doğum tarixi:</span>{' '}
                        <strong className="text-white">
                          {displayDob}
                          {displayAge ? ` (${displayAge})` : ''}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sürətli Statistika (yalnız müştəri hesabı üçün) */}
                {!isStaff && (
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:shrink-0">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-frost/50">
                        Aktiv bilet
                      </div>
                      <div className="mt-0.5 font-display text-xl font-bold text-emerald-300">
                        {activeTicketCount}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-frost/50">
                        İstifadə olunub
                      </div>
                      <div className="mt-0.5 font-display text-xl font-bold text-ice-200">
                        {usedTicketCount}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-center">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-frost/50">
                        Cəmi bilet
                      </div>
                      <div className="mt-0.5 font-display text-xl font-bold text-white">
                        {totalTicketCount}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Əsas İki Sütunlu Bölmə */}
            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              {/* Sol Sütun: Şəxsi Məlumatlar və Şifrə Dəyişdirmə (7 sütun) */}
              <div className="space-y-6 lg:col-span-7">
                {/* 1. Şəxsi məlumatlar kartı */}
                <form
                  onSubmit={handleProfileSubmit}
                  className="glass rounded-2xl border border-white/10 p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-ice-300">
                        Profil məlumatları
                      </div>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-white">
                        Şəxsi məlumatlarım
                      </h3>
                    </div>
                    <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-frost/65">
                      ID #{profile?.userId ?? user?.userId}
                    </span>
                  </div>

                  {profileError && (
                    <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-100">
                      {profileError}
                    </div>
                  )}
                  {profileSuccess && (
                    <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
                      {profileSuccess}
                    </div>
                  )}

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-frost/90">
                        İstifadəçi adı (Username)
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyUsername}
                        title="Kopyalamaq üçün üzərinə klikləyin"
                        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/15 bg-night-900/60 px-4 py-2.5 text-left font-mono text-sm font-semibold text-ice-200 transition hover:border-ice-300/50 hover:text-white"
                      >
                        <span>{displayUsername}</span>
                        {copiedUsername && (
                          <span className="font-sans text-[11px] font-semibold text-emerald-300">
                            ✓ Kopyalandı
                          </span>
                        )}
                      </button>
                      <p className="mt-1 text-[11px] text-frost/60">
                        Üzərinə basdıqda kopyalanır (dəyişdirilmir).
                      </p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-frost/90">
                        Gmail / E-poçt ünvanı
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@gmail.com"
                        required
                        className="input-ice w-full"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-frost/90">
                        Ad
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Adınız"
                        required
                        className="input-ice w-full"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-frost/90">
                        Soyad
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Soyadınız"
                        required
                        className="input-ice w-full"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-frost/90">
                        Doğum tarixi
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        max={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="input-ice w-full"
                      />
                      <p className="mt-1 text-[11px] text-frost/60">
                        {displayAge
                          ? `Cari hesablanmış yaş: ${displayAge}`
                          : 'Bilet qaydaları və yaş kateqoriyası üçün istifadə olunur.'}
                      </p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-frost/90">
                        Telefon nömrəsi
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+994 50 000 00 00"
                        required
                        className="input-ice w-full"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span className="text-xs text-frost/50">
                      Qeydiyyat tarixi: {formatDateTime(profile?.createdAt)}
                    </span>
                    <button
                      type="submit"
                      disabled={profileBusy}
                      className="btn-primary !px-6 !py-2.5 text-xs disabled:opacity-60"
                    >
                      {profileBusy
                        ? 'Yadda saxlanılır...'
                        : 'Məlumatları yadda saxla'}
                    </button>
                  </div>
                </form>

                {/* 2. Şifrəni dəyişdir kartı */}
                <form
                  onSubmit={handlePasswordSubmit}
                  className="glass rounded-2xl border border-white/10 p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                        Təhlükəsizlik
                      </div>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-white">
                        Şifrəni dəyişdir
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPasswords((v) => !v)}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-frost/75 transition hover:text-white"
                    >
                      {showPasswords ? 'Şifrələri gizlət' : 'Şifrələri göstər'}
                    </button>
                  </div>

                  {passwordError && (
                    <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-100">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-frost/75">
                        Cari şifrə
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Hazırkı şifrənizi daxil edin"
                        autoComplete="current-password"
                        className="input-ice w-full"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-frost/75">
                          Yeni şifrə
                        </label>
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Ən azı 6 simvol"
                          autoComplete="new-password"
                          className="input-ice w-full"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-frost/75">
                          Yeni şifrənin təkrarı
                        </label>
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Yeni şifrəni təkrar yazın"
                          autoComplete="new-password"
                          className="input-ice w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end border-t border-white/10 pt-4">
                    <button
                      type="submit"
                      disabled={passwordBusy}
                      className="btn-primary !px-6 !py-2.5 text-xs disabled:opacity-60"
                    >
                      {passwordBusy ? 'Yenilənir...' : 'Şifrəni yenilə'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Sağ Sütun: Qar Animasiyası, Təsdiqlər və Sürətli Keçidlər (5 sütun) */}
              <div className="space-y-6 lg:col-span-5">
                {/* 1. Görünüş və Qar Animasiyası Kartı */}
                <div className="glass rounded-2xl border border-white/10 p-6">
                  <div className="border-b border-white/10 pb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-ice-300">
                      Görünüş və Effektlər
                    </div>
                    <h3 className="mt-0.5 font-display text-lg font-bold text-white">
                      Sayt tənzimləmələri
                    </h3>
                  </div>

                  {/* Dil seçimi */}
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="font-semibold text-white">Sayt dili</span>
                      <span className="text-[11px] text-frost/60" data-no-translate="true">AZ / EN / RU</span>
                    </div>
                    <LanguageSwitcher full />
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            Qar animasiyası
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              snowEnabled
                                ? 'bg-ice-400/20 text-ice-200'
                                : 'bg-white/10 text-frost/55'
                            }`}
                          >
                            {snowEnabled ? 'Açıq' : 'Bağlı'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-frost/60">
                          Sayt boyu arxa planda yağan qar dənəcikləri effektini
                          istədiyiniz vaxt aça və ya bağlaya bilərsiniz.
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={snowEnabled}
                        onClick={handleSnowToggle}
                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ${
                          snowEnabled
                            ? 'border-ice-300/50 bg-ice-400/35'
                            : 'border-white/15 bg-white/10'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-200 ${
                            snowEnabled
                              ? 'translate-x-7 bg-ice-200 shadow-md'
                              : 'translate-x-1 bg-frost/60'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSnowEnabled(true)
                          setSnowfallEnabled(true)
                        }}
                        className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                          snowEnabled
                            ? 'border-ice-300/40 bg-ice-400/15 text-ice-100'
                            : 'border-white/10 bg-white/[0.02] text-frost/60 hover:text-white'
                        }`}
                      >
                        Qar effektini aç
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSnowEnabled(false)
                          setSnowfallEnabled(false)
                        }}
                        className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                          !snowEnabled
                            ? 'border-amber-300/40 bg-amber-400/15 text-amber-100'
                            : 'border-white/10 bg-white/[0.02] text-frost/60 hover:text-white'
                        }`}
                      >
                        Qar effektini bağla
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Təsdiq və Təhlükəsizlik Statusu Kartı (yalnız müştəri hesabı üçün) */}
                {!isStaff && (
                  <div className="glass rounded-2xl border border-white/10 p-6">
                    <div className="border-b border-white/10 pb-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                        Doğrulama və Qaydalar
                      </div>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-white">
                        Hesab təsdiq statusu
                      </h3>
                    </div>

                    <div className="mt-4 space-y-3">
                      {/* Yaş təsdiqi */}
                      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <div>
                          <div className="text-xs font-semibold text-white">
                            Doğum tarixi və yaş təsdiqi
                          </div>
                          <div className="mt-0.5 text-[11px] text-frost/60">
                            {profile?.ageVerified
                              ? `${displayDob} (${displayAge || '—'})`
                              : 'Doğum tarixi hələ daxil edilməyib'}
                          </div>
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                            profile?.ageVerified
                              ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200'
                              : 'border-amber-300/30 bg-amber-400/10 text-amber-200'
                          }`}
                        >
                          {profile?.ageVerified ? 'Təsdiqlənib' : 'Gözləyir'}
                        </span>
                      </div>

                      {/* Şəxsiyyət vəsiqəsi */}
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-semibold text-white">
                              Şəxsiyyət vəsiqəsi
                            </div>
                            <div className="mt-0.5 text-[11px] text-frost/60">
                              {profile?.identityConfirmed
                                ? `Təsdiqlənib (••••${profile.identityDocumentLast4 || ''})`
                                : 'Onlayn bilet alışı üçün vəsiqə təsdiqi'}
                            </div>
                          </div>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                              profile?.identityConfirmed
                                ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200'
                              : 'border-white/15 bg-white/5 text-frost/60'
                            }`}
                          >
                            {profile?.identityConfirmed ? 'Təsdiqlənib' : 'Təsdiqlənməyib'}
                          </span>
                        </div>

                        {!profile?.identityConfirmed && profile?.isAdult && (
                          <form onSubmit={handleIdentitySubmit} className="mt-3 space-y-2 border-t border-white/10 pt-3">
                            {docError && (
                              <div className="text-[11px] text-red-300">{docError}</div>
                            )}
                            {docSuccess && (
                              <div className="text-[11px] text-emerald-300">{docSuccess}</div>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={docNumber}
                                onChange={(e) => setDocNumber(e.target.value)}
                                placeholder="Məs: AZE12345678"
                                className="input-ice flex-1 !py-1.5 text-xs"
                              />
                              <button
                                type="submit"
                                disabled={docBusy}
                                className="btn-primary !px-3.5 !py-1.5 text-xs"
                              >
                                {docBusy ? '...' : 'Təsdiqlə'}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>

                      {/* Arena qaydaları */}
                      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <div>
                          <div className="text-xs font-semibold text-white">
                            Arena təhlükəsizlik qaydaları
                          </div>
                          <div className="mt-0.5 text-[11px] text-frost/60">
                            {profile?.acceptedObligationsCount
                              ? `${profile.acceptedObligationsCount} öhdəlik qəbul edilib`
                              : 'Qaydalarla tanış olub təsdiqləyə bilərsiniz'}
                          </div>
                        </div>
                        <Link
                          to="/qaydalar"
                          className="rounded-lg border border-ice-300/30 bg-ice-400/10 px-2.5 py-1 text-[11px] font-bold text-ice-200 transition hover:bg-ice-400/20"
                        >
                          Qaydalara bax
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Sürətli Keçidlər və Hesabdan Çıxış (yalnız müştəri hesabı üçün) */}
                {!isStaff && (
                  <div className="glass rounded-2xl border border-white/10 p-6">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-frost/55">
                      Sürətli əməliyyatlar
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                      <Link
                        to="/biletlerim"
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-xs font-semibold text-white transition hover:border-ice-300/40 hover:bg-white/[0.06]"
                      >
                        🎫 Biletlərimə keç
                      </Link>
                      <Link
                        to="/bilet"
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-xs font-semibold text-white transition hover:border-ice-300/40 hover:bg-white/[0.06]"
                      >
                        ⛸️ Yeni bilet al
                      </Link>
                      <Link
                        to="/canli"
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-xs font-semibold text-white transition hover:border-ice-300/40 hover:bg-white/[0.06]"
                      >
                        📡 Canlı buz statusu
                      </Link>
                      <button
                        type="button"
                        onClick={logout}
                        className="rounded-xl border border-red-400/25 bg-red-500/10 px-3.5 py-3 text-left text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
                      >
                        🚪 Hesabdan çıxış
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
