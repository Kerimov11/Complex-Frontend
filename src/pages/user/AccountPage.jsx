import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { isSnowfallEnabled, setSnowfallEnabled } from '../../components/Snowfall'
import { api } from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import { formatDateAZ, pad } from '../../utils/datetime'
import { isValidEmail, validatePhone } from '../../utils/validation'
import IdentityVerificationFields from '../../components/booking/IdentityVerificationFields'

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

  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'notifications' | 'feedback'
  const [profile, setProfile] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (isStaff && activeTab === 'feedback') {
      setActiveTab('profile')
    }
  }, [isStaff, activeTab])

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
  const [finCode, setFinCode] = useState('')
  const [identityPhotoData, setIdentityPhotoData] = useState('')
  const [docBusy, setDocBusy] = useState(false)
  const [docError, setDocError] = useState('')
  const [docSuccess, setDocSuccess] = useState('')

  // Qar animasiyası tənzimləməsi
  const [snowEnabled, setSnowEnabled] = useState(isSnowfallEnabled)
  const [copiedUsername, setCopiedUsername] = useState(false)

  // Bildirişlər sistemi
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('ha_notifications_enabled') !== 'false'
  })
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ha_read_notifications') || '[]')
    } catch {
      return []
    }
  })

  // Geri dönüş (Feedback) forması
  const [feedbackCategory, setFeedbackCategory] = useState('Təklif')
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackSubject, setFeedbackSubject] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackSuccess, setFeedbackSuccess] = useState('')
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackBusy, setFeedbackBusy] = useState(false)
  const [feedbackList, setFeedbackList] = useState(() => {
    try {
      const saved = localStorage.getItem(`ha_feedbacks_${user?.userId || 'guest'}`)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const populateForm = useCallback((data) => {
    if (!data) return
    setFirstName(data.firstName || '')
    setLastName(data.lastName || '')
    setEmail(data.email || '')
    setPhoneNumber(data.phoneNumber || '')
    setDateOfBirth(data.dateOfBirth || '')
  }, [])

  const loadAccountData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setLoadError('')
    try {
      const [profileData, ticketList] = await Promise.all([
        api.getCustomerProfile(),
        api.getMyTickets().catch(() => []),
      ])
      setProfile(profileData)
      if (!silent) {
        populateForm(profileData)
      }
      setTickets(Array.isArray(ticketList) ? ticketList : [])
      if (profileData) {
        updateVerification(profileData)
      }
    } catch (err) {
      if (!silent) setLoadError(err?.message || 'Hesab məlumatları yüklənmədi.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [populateForm, updateVerification])

  useEffect(() => {
    loadAccountData()
  }, [loadAccountData])

  useEffect(() => {
    const timer = setInterval(() => {
      loadAccountData(true)
    }, 10000)
    return () => clearInterval(timer)
  }, [loadAccountData])

  function handleSnowToggle() {
    const next = !snowEnabled
    setSnowEnabled(next)
    setSnowfallEnabled(next)
  }

  function handleNotificationsToggle() {
    const next = !notificationsEnabled
    setNotificationsEnabled(next)
    localStorage.setItem('ha_notifications_enabled', String(next))
  }

  function markNotificationAsRead(id) {
    if (readNotificationIds.includes(id)) return
    const updated = [...readNotificationIds, id]
    setReadNotificationIds(updated)
    localStorage.setItem('ha_read_notifications', JSON.stringify(updated))
  }

  function markAllNotificationsAsRead() {
    const allIds = generatedNotifications.map((n) => n.id)
    setReadNotificationIds(allIds)
    localStorage.setItem('ha_read_notifications', JSON.stringify(allIds))
  }

  function clearAllNotifications() {
    const allIds = generatedNotifications.map((n) => n.id)
    setReadNotificationIds(allIds)
    localStorage.setItem('ha_read_notifications', JSON.stringify(allIds))
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

    const trimmedFirst = firstName.trim()
    const trimmedLast = lastName.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phoneNumber.trim()

    if (!trimmedFirst || !trimmedLast) {
      setProfileError('Ad və soyadı daxil edin.')
      return
    }
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      setProfileError('E-poçt formatı düzgün deyil.')
      return
    }
    const phoneCheck = validatePhone(trimmedPhone)
    if (!phoneCheck.valid) {
      setProfileError(phoneCheck.message)
      return
    }

    setProfileBusy(true)
    try {
      const updated = await api.updateCustomerProfile({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail,
        phoneNumber: phoneCheck.normalized,
        dateOfBirth: dateOfBirth || null,
      })
      setProfile(updated)
      populateForm(updated)
      updateVerification(updated)
      setProfileSuccess('Məlumatlarınız uğurla yeniləndi.')
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
    const cleaned = docNumber.replace(/[^A-Za-z0-9]/g, '')
    if (cleaned.length < 5) {
      setDocError('Şəxsiyyət vəsiqəsinin seriya və nömrəsini düzgün daxil edin.')
      return
    }
    const cleanedFin = finCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    if (cleanedFin.length !== 7) {
      setDocError('FİN kodu 7 simvoldan ibarət olmalıdır.')
      return
    }
    if (!identityPhotoData) {
      setDocError('Şəxsiyyət vəsiqəsini sifətinizin yanına tutaraq foto çəkib yükləyin.')
      return
    }

    setDocBusy(true)
    try {
      const vData = await verifyIdentity({
        identityDocumentNumber: cleaned,
        finCode: cleanedFin,
        identityPhotoData,
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
      setFinCode('')
      setIdentityPhotoData('')
      setDocSuccess('Məlumatlarınız göndərildi və kassir tərəfindən ən qısa müddətdə təsdiqlənəcək.')
    } catch (err) {
      setDocError(err?.message || 'Təsdiq alınmadı.')
    } finally {
      setDocBusy(false)
    }
  }

  function handleFeedbackSubmit(e) {
    e.preventDefault()
    setFeedbackError('')
    setFeedbackSuccess('')

    const trimmed = feedbackText.trim()
    if (!trimmed || trimmed.length < 5) {
      setFeedbackError('Zəhmət olmasa rəy və ya təklifinizi ən azı 5 simvol ilə qeyd edin.')
      return
    }

    setFeedbackBusy(true)
    try {
      const newFeedback = {
        id: 'fb-' + Date.now(),
        category: feedbackCategory,
        rating: feedbackRating,
        subject: feedbackSubject.trim() || feedbackCategory,
        text: trimmed,
        createdAt: new Date().toISOString(),
        username: profile?.username || user?.username || 'Müştəri',
      }
      const updated = [newFeedback, ...feedbackList]
      setFeedbackList(updated)
      localStorage.setItem(`ha_feedbacks_${user?.userId || 'guest'}`, JSON.stringify(updated))

      setFeedbackText('')
      setFeedbackSubject('')
      setFeedbackRating(5)
      setFeedbackSuccess('Geri dönüşünüz üçün təşəkkür edirik! Rəyiniz qeydə alındı.')
      setTimeout(() => setFeedbackSuccess(''), 6000)
    } catch {
      setFeedbackError('Geri dönüş göndərilə bilmədi. Zəhmət olmasa yenidən cəhd edin.')
    } finally {
      setFeedbackBusy(false)
    }
  }

  // Dinamik bildirişlərin generasiyası
  const generatedNotifications = useMemo(() => {
    const list = []
    if (!Array.isArray(tickets)) return list

    tickets.forEach((ticket) => {
      const code = ticket.ticketCode || ticket.id || 'Bilet'
      const time = ticket.purchaseDate || new Date().toISOString()

      // 1. Kassir tərəfindən bilet təsdiqi
      if (ticket.identityReviewStatus === 'APPROVED') {
        list.push({
          id: `approved-${code}`,
          type: 'success',
          icon: '✅',
          title: 'Bilet təsdiqləndi',
          message: `${code} kodlu biletiniz kassir tərəfindən təsdiqləndi. İndi konki rezervasiyasını aktivləşdirə bilərsiniz.`,
          date: ticket.purchaseDate,
          badge: 'Təsdiq',
        })
      } else if (ticket.identityReviewStatus === 'REJECTED') {
        list.push({
          id: `rejected-${code}`,
          type: 'error',
          icon: '❌',
          title: 'Bilet təsdiqi rədd edildi',
          message: `${code} kodlu biletin təsdiqi kassir tərəfindən rədd edildi: ${ticket.identityRejectionReason || 'Sənəd qaydalara uyğun deyil'}.`,
          date: ticket.purchaseDate,
          badge: 'Rədd edildi',
        })
      }

      // 2. Könüllü tərəfindən "Konki hazırdır" / rezervasiya aktivləşdirilməsi
      if (ticket.reservationActive) {
        list.push({
          id: `active-timer-${code}`,
          type: 'info',
          icon: '⛸️',
          title: 'Konki hazırdır və ayrıldı',
          message: `${code} nömrəli biletiniz üçün konki ayrıldı və hazırlanır. Zəhmət olmasa təhvil məntəqəsinə yaxınlaşın.`,
          date: ticket.timerExpiresAt || time,
          badge: 'Hazırlanır',
        })
      }

      // 3. Konki təhvil alındıqda
      if (ticket.skateHandedOut) {
        list.push({
          id: `handed-${code}`,
          type: 'success',
          icon: '⛸️',
          title: 'Konki təhvil alındı',
          message: `${code} kodlu bilet üzrə konki təhvil verildi. Arenada xoş istirahətlər və təhlükəsiz sürüşlər!`,
          date: time,
          badge: 'Təhvil alındı',
        })
      }

      // 4. Arenaya turniket girişi
      if (ticket.checkedInAt || ticket.iceEntryTime) {
        list.push({
          id: `entry-${code}`,
          type: 'ice',
          icon: '🚪',
          title: 'Buza giriş qeydə alındı',
          message: `${code} biletiniz ilə buza giriş qeydə alındı. ${ticket.durationMinutes || 60} dəqiqəlik seansınız başladı.`,
          date: ticket.checkedInAt || time,
          badge: 'Giriş edildi',
        })
      }

      // 5. Konki anbara təhvil verildikdə
      if (ticket.skateReturned || ticket.skateReturnedAt) {
        list.push({
          id: `returned-${code}`,
          type: 'success',
          icon: '✅',
          title: 'Konki anbara təhvil verildi',
          message: `${code} kodlu bilet üzrə konki(lər) təhvil verildi və avtomatik anbar stokuna qaytarıldı.`,
          date: ticket.skateReturnedAt || time,
          badge: 'Təhvil verildi',
        })
      }

      // 6. İlkin bilet rezervasiyası / alışı
      if (ticket.status === 'ACTIVE') {
        list.push({
          id: `order-${code}`,
          type: 'info',
          icon: '🎫',
          title: 'Rezervasiya tamamlandı',
          message: `${code} nömrəli biletiniz uğurla rəsmiləşdirildi (${ticket.sessionDate ? formatDateAZ(ticket.sessionDate) : 'Sərbəst vaxt'}).`,
          date: ticket.purchaseDate || time,
          badge: 'Bilet alışı',
        })
      }
    })

    // Ən yeni bildirişlər yuxarıda
    return list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [tickets])

  const unreadCount = useMemo(() => {
    return generatedNotifications.filter((n) => !readNotificationIds.includes(n.id)).length
  }, [generatedNotifications, readNotificationIds])

  const activeTicketCount = tickets.filter(
    (t) => (t.status || t.ticketStatus) === 'ACTIVE'
  ).length
  const usedTicketCount = tickets.filter(
    (t) => (t.status || t.ticketStatus) === 'USED'
  ).length
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
            subtitle={
              isStaff
                ? 'İstifadəçi məlumatlarınızı və bildirişlərinizi buradan idarə edin.'
                : 'İstifadəçi məlumatlarınızı, bildirişlərinizi və arena rəylərinizi (geri dönüş) buradan idarə edin.'
            }
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
                              : 'border-sky-300/30 bg-sky-400/10 text-sky-200'
                          }`}
                        >
                          {profile.isAdult ? '18+ Yaş təsdiqlənib' : 'Yetkinlik yaşına çatmayıb'}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-frost/70">
                      <span className="flex items-center gap-1.5">
                        <span className="text-frost/40">İstifadəçi adı:</span>
                        <code className="font-mono font-semibold text-white">
                          @{displayUsername}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyUsername}
                          className="rounded px-1.5 py-0.5 text-[10px] text-ice-300 hover:bg-white/10"
                        >
                          {copiedUsername ? 'Kopyalandı' : 'Kopyala'}
                        </button>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-frost/40">E-poçt:</span>
                        <span className="font-medium text-white">{displayEmail}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {!isStaff && (
                  <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center sm:gap-4 sm:p-4">
                    <div>
                      <div className="font-display text-xl font-bold text-emerald-300 sm:text-2xl">
                        {activeTicketCount}
                      </div>
                      <div className="text-[11px] font-semibold text-frost/60">
                        Aktiv bilet
                      </div>
                    </div>
                    <div className="border-x border-white/10 px-2 sm:px-4">
                      <div className="font-display text-xl font-bold text-ice-200 sm:text-2xl">
                        {usedTicketCount}
                      </div>
                      <div className="text-[11px] font-semibold text-frost/60">
                        İstifadə olunan
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-xl font-bold text-white sm:text-2xl">
                        {totalTicketCount}
                      </div>
                      <div className="text-[11px] font-semibold text-frost/60">
                        Cəmi bilet
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bölmə Naviqasiyası (Tab-lar) */}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-ice-400 text-night-950 shadow-md shadow-ice-400/20'
                    : 'text-frost/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                👤 Şəxsi məlumatlar və Təhlükəsizlik
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-ice-400 text-night-950 shadow-md shadow-ice-400/20'
                    : 'text-frost/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                🔔 Bildirişlər
                {notificationsEnabled && unreadCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {!isStaff && (
                <button
                  type="button"
                  onClick={() => setActiveTab('feedback')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    activeTab === 'feedback'
                      ? 'bg-ice-400 text-night-950 shadow-md shadow-ice-400/20'
                      : 'text-frost/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  💬 Geri dönüş (Feedback)
                </button>
              )}
            </div>

            {/* TAB 1: BİLDİRİŞLƏR BÖLMƏSİ */}
            {activeTab === 'notifications' && (
              <div className="mt-6 space-y-5">
                <div className="glass rounded-2xl border border-white/10 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-ice-300">
                        Canlı xəbərdarlıqlar və statuslar
                      </div>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-white">
                        Hesab bildirişləri
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-frost/70">
                          Bildirişlər:
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={notificationsEnabled}
                          onClick={handleNotificationsToggle}
                          className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ${
                            notificationsEnabled
                              ? 'border-emerald-300/50 bg-emerald-500/30'
                              : 'border-white/15 bg-white/10'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ${
                              notificationsEnabled
                                ? 'translate-x-6 bg-emerald-200 shadow-sm'
                                : 'translate-x-1 bg-frost/50'
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs font-bold ${
                            notificationsEnabled ? 'text-emerald-200' : 'text-frost/50'
                          }`}
                        >
                          {notificationsEnabled ? 'Aktiv' : 'Bağlı'}
                        </span>
                      </div>

                      {notificationsEnabled && generatedNotifications.length > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsAsRead}
                          className="btn-ghost !px-3 !py-1 text-[11px]"
                        >
                          Hamısını oxunmuş et
                        </button>
                      )}
                    </div>
                  </div>

                  {!notificationsEnabled ? (
                    <div className="py-10 text-center">
                      <span className="text-4xl">🔕</span>
                      <h4 className="mt-3 font-display text-base font-bold text-white">
                        Bildirişlər hazırda söndürülüb
                      </h4>
                      <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-frost/60">
                        Bilet təsdiqi, konki hazırlığı və turniket girişləri barədə canlı bildirişləri almaq üçün yuxarıdakı keçidlə bildirişləri aktivləşdirin.
                      </p>
                      <button
                        type="button"
                        onClick={handleNotificationsToggle}
                        className="btn-primary mt-4 !px-4 !py-2 text-xs"
                      >
                        Bildirişləri aktivləşdir
                      </button>
                    </div>
                  ) : generatedNotifications.length === 0 ? (
                    <div className="py-12 text-center text-sm text-frost/50">
                      <span className="text-3xl">🔔</span>
                      <p className="mt-2 font-semibold text-white">Hələlik yeni bildiriş yoxdur</p>
                      <p className="mt-1 text-xs text-frost/50">
                        Bilet aldıqda və ya kassir/könüllü heyəti tərəfindən status dəyişdikdə bildirişlər burada görünəcək.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {generatedNotifications.map((n) => {
                        const isRead = readNotificationIds.includes(n.id)
                        return (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`group relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-150 ${
                              isRead
                                ? 'border-white/5 bg-white/[0.02] opacity-75 hover:bg-white/[0.04]'
                                : 'border-ice-300/30 bg-ice-400/10 shadow-sm hover:border-ice-300/50'
                            }`}
                          >
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-xl">
                              {n.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-display text-sm font-bold text-white">
                                    {n.title}
                                  </h4>
                                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-frost/60">
                                    {n.badge}
                                  </span>
                                  {!isRead && (
                                    <span className="h-2 w-2 rounded-full bg-ice-300 shadow-sm" />
                                  )}
                                </div>
                                <span className="text-[11px] text-frost/45">
                                  {formatDateTime(n.date)}
                                </span>
                              </div>
                              <p className="mt-1 text-xs leading-relaxed text-frost/75">
                                {n.message}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: GERİ DÖNÜŞ (FEEDBACK) BÖLMƏSİ (Yalnız müştəri hesablarında) */}
            {!isStaff && activeTab === 'feedback' && (
              <div className="mt-6 space-y-6">
                <div className="glass rounded-2xl border border-white/10 p-6 sm:p-7">
                  <div className="border-b border-white/10 pb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-ice-300">
                      Müştəri məmnuniyyəti
                    </div>
                    <h3 className="mt-0.5 font-display text-lg font-bold text-white">
                      Geri dönüş (Feedback)
                    </h3>
                    <p className="mt-1 text-xs text-frost/60">
                      Buz Arenasında xidmət keyfiyyətini artırmaq üçün təklif, irad və ya təşəkkürünüzü bizimlə bölüşün.
                    </p>
                  </div>

                  {feedbackSuccess && (
                    <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-100">
                      {feedbackSuccess}
                    </div>
                  )}
                  {feedbackError && (
                    <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-100">
                      {feedbackError}
                    </div>
                  )}

                  <form onSubmit={handleFeedbackSubmit} className="mt-5 space-y-5">
                    {/* Kateqoriya seçimi */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-frost/80">
                        Geri dönüşün növü:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Təklif', 'Şikayət / İrad', 'Təşəkkür', 'Konki və Buz', 'Digər'].map((cat) => (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => setFeedbackCategory(cat)}
                            className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                              feedbackCategory === cat
                                ? 'border-ice-300 bg-ice-400/20 text-white shadow-sm'
                                : 'border-white/10 bg-white/[0.03] text-frost/60 hover:text-white'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ulduz Qiymətləndirməsi */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-frost/80">
                        Xidmət qiymətləndirməsi:
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                          >
                            <span className={star <= feedbackRating ? 'text-amber-300' : 'text-white/20'}>
                              ★
                            </span>
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-bold text-amber-200">
                          {feedbackRating === 5
                            ? 'Əla (5/5)'
                            : feedbackRating === 4
                              ? 'Yaxşı (4/5)'
                              : feedbackRating === 3
                                ? 'Orta (3/5)'
                                : feedbackRating === 2
                                  ? 'Qənaətbəxş (2/5)'
                                  : 'Zəif (1/5)'}
                        </span>
                      </div>
                    </div>

                    {/* Mövzu */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-frost/80">
                        Mövzu / Qısa başlıq:
                      </label>
                      <input
                        type="text"
                        value={feedbackSubject}
                        onChange={(e) => setFeedbackSubject(e.target.value)}
                        placeholder="Məsələn: Konki təhvili zamanı növbə / Buzun keyfiyyəti"
                        className="input-ice w-full"
                      />
                    </div>

                    {/* Rəy mətni */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-frost/80">
                        Rəy və ya təklifiniz: *
                      </label>
                      <textarea
                        rows="4"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Fikirlərinizi, təkliflərinizi və ya qarşılaşdığınız problemi ətraflı qeyd edin..."
                        className="input-ice w-full resize-y"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-end border-t border-white/10 pt-4">
                      <button
                        type="submit"
                        disabled={feedbackBusy}
                        className="btn-primary !px-6 !py-2.5 text-xs font-bold disabled:opacity-50"
                      >
                        {feedbackBusy ? 'Göndərilir…' : 'Geri dönüşü göndər'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Əvvəlki Geri Dönüşlərim */}
                {feedbackList.length > 0 && (
                  <div className="glass rounded-2xl border border-white/10 p-6">
                    <div className="border-b border-white/10 pb-3">
                      <h4 className="font-display text-sm font-bold text-white">
                        Əvvəlki geri dönüşlərim ({feedbackList.length})
                      </h4>
                    </div>
                    <div className="mt-4 space-y-3">
                      {feedbackList.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{item.subject}</span>
                              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-frost/70">
                                {item.category}
                              </span>
                              <span className="text-amber-300 font-bold">
                                {'★'.repeat(item.rating || 5)}
                              </span>
                            </div>
                            <span className="text-[11px] text-frost/40">
                              {formatDateTime(item.createdAt)}
                            </span>
                          </div>
                          <p className="mt-2 leading-relaxed text-frost/80">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: HESAB VƏ ŞƏXSİ MƏLUMATLAR BÖLMƏSİ */}
            {activeTab === 'profile' && (
              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                {/* Sol Sütun: Şəxsi Məlumatlar və Şifrə (7 sütun) */}
                <div className="space-y-6 lg:col-span-7">
                  {/* 1. Şəxsi Məlumatlar Forması */}
                  <form
                    onSubmit={handleProfileSubmit}
                    className="glass rounded-2xl border border-white/10 p-6 sm:p-7"
                  >
                    <div className="border-b border-white/10 pb-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-ice-300">
                        Profil Məlumatları
                      </div>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-white">
                        Şəxsi məlumatların redaktəsi
                      </h3>
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

                    <div className="mt-5 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-frost/75">
                            Ad *
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Adınızı daxil edin"
                            className="input-ice w-full"
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-frost/75">
                            Soyad *
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Soyadınızı daxil edin"
                            className="input-ice w-full"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-frost/75">
                            E-poçt ünvanı
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="adiniz@example.com"
                            className="input-ice w-full"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-frost/75">
                            Mobil nömrə
                          </label>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+994 50 123 45 67"
                            className="input-ice w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-frost/75">
                          Doğum tarixi (18+ bilet satışı üçün tələb olunur)
                        </label>
                        <input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          max={new Date().toISOString().slice(0, 10)}
                          className="input-ice w-full [color-scheme:dark]"
                        />
                        <p className="mt-1 text-[11px] text-frost/50">
                          Doğum tarixi bilet alarkən yaş kateqoriyasının və endirimlərin müəyyənləşdirilməsi üçün istifadə olunur.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end border-t border-white/10 pt-4">
                      <button
                        type="submit"
                        disabled={profileBusy}
                        className="btn-primary !px-6 !py-2.5 text-xs disabled:opacity-60"
                      >
                        {profileBusy ? 'Yadda saxlanılır...' : 'Məlumatları saxla'}
                      </button>
                    </div>
                  </form>

                  {/* 2. Şifrə Dəyişdirmə Forması */}
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="glass rounded-2xl border border-white/10 p-6 sm:p-7"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-ice-300">
                          Təhlükəsizlik
                        </div>
                        <h3 className="mt-0.5 font-display text-lg font-bold text-white">
                          Şifrənin dəyişdirilməsi
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="text-xs font-semibold text-ice-300 hover:text-white"
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

                {/* Sağ Sütun: Görünüş, Təsdiqlər və Sürətli Keçidlər (5 sütun) */}
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

                          {(!profile?.identityConfirmed || user?.identityReviewStatus === 'REJECTED') && profile?.isAdult && (
                            <form onSubmit={handleIdentitySubmit} className="mt-3 space-y-3 border-t border-white/10 pt-3">
                              {docError && (
                                <div className="text-[11px] font-semibold text-red-300">{docError}</div>
                              )}
                              {docSuccess && (
                                <div className="text-[11px] font-semibold text-emerald-300">{docSuccess}</div>
                              )}
                              <IdentityVerificationFields
                                documentNumber={docNumber}
                                onDocumentNumberChange={setDocNumber}
                                finCode={finCode}
                                onFinCodeChange={setFinCode}
                                photoData={identityPhotoData}
                                onPhotoDataChange={setIdentityPhotoData}
                                confirmed
                                onConfirmedChange={() => {}}
                                showCheckbox={false}
                                rejectionReason={user?.identityRejectionReason || ''}
                              />
                              <button
                                type="submit"
                                disabled={docBusy}
                                className="btn-primary w-full !py-2 text-xs font-bold"
                              >
                                {docBusy ? 'Göndərilir…' : 'Təsdiqə göndər'}
                              </button>
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
            )}
          </>
        )}
      </section>
    </div>
  )
}
