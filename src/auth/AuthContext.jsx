import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { clearVoucher, loadLastVoucherRaw } from '../utils/voucher'

const AUTH_KEY = 'ha_auth'
const STAFF_ROLES = [
  'ROLE_ADMIN',
  'ROLE_COORDINATOR',
  'ROLE_CASHIER',
  'ROLE_VOLUNTEER',
]
const AuthContext = createContext(null)

function readAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.token ? parsed : null
  } catch {
    return null
  }
}

function writeAuth(next) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(next))
  } catch {
    // localStorage əlçatmazdırsa sessiya yalnız yaddaşda qalır
  }
}

function verificationFields(data) {
  return {
    dateOfBirth: data?.dateOfBirth || null,
    age: data?.age ?? null,
    ageVerified: Boolean(data?.ageVerified),
    isAdult: Boolean(data?.isAdult),
    identityConfirmed: Boolean(data?.identityConfirmed),
    identityDocumentLast4: data?.identityDocumentLast4 || '',
    finCode: data?.finCode || '',
    identityReviewStatus: data?.identityReviewStatus || null,
    identityRejectionReason: data?.identityRejectionReason || '',
    hasIdentityPhoto: Boolean(data?.hasIdentityPhoto),
  }
}

function isStaffRole(role) {
  return STAFF_ROLES.includes(role)
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(readAuth)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('login')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [verificationLoading, setVerificationLoading] = useState(() => {
    const stored = readAuth()
    const roles = Array.isArray(stored?.roles) ? stored.roles : []
    return Boolean(
      stored?.token &&
        roles.includes('ROLE_USER') &&
        !roles.some(isStaffRole)
    )
  })

  const openAuth = useCallback((nextMode = 'login') => {
    setMode(nextMode)
    setError('')
    setOpen(true)
  }, [])

  const closeAuth = useCallback(() => {
    setOpen(false)
    setError('')
  }, [])

  const persist = useCallback((data) => {
    const roles = Array.isArray(data?.roles) ? data.roles : []
    const next = {
      token: data?.token || '',
      userId: data?.userId ?? null,
      username: data?.username || '',
      roles,
      ...verificationFields(data),
    }
    const customer = roles.includes('ROLE_USER') && !roles.some(isStaffRole)
    setVerificationLoading(customer)
    writeAuth(next)
    setAuth(next)
  }, [])

  const updateVerification = useCallback((data) => {
    setAuth((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...verificationFields(data) }
      writeAuth(next)
      return next
    })
  }, [])

  // Köhnə localStorage sessiyaları üçün backend-dəki təsdiq vəziyyətini
  // yeniləyirik. Beləliklə əvvəl yaşını təsdiqləmiş istifadəçidən təkrar
  // doğum tarixi soruşulmur.
  useEffect(() => {
    const token = auth?.token
    const roles = Array.isArray(auth?.roles) ? auth.roles : []
    const customer = roles.includes('ROLE_USER') && !roles.some(isStaffRole)

    if (!token || !customer) {
      setVerificationLoading(false)
      return undefined
    }

    let cancelled = false
    setVerificationLoading(true)
    api
      .getCustomerVerification()
      .then((data) => {
        if (!cancelled) updateVerification(data)
      })
      .catch(() => {
        // Giriş cavabındakı məlumat kifayətdir; şəbəkə xətası sessiyanı pozmur.
      })
      .finally(() => {
        if (!cancelled) setVerificationLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [auth?.token, updateVerification])

  const login = useCallback(
    async (username, password) => {
      setBusy(true)
      setError('')
      try {
        const data = await api.login(username, password)
        if (!data?.token) throw new Error('Token alınmadı')
        persist(data)
        setOpen(false)
        return data
      } catch (err) {
        const msg = err?.message || ''
        if (/bad\s+credentials/i.test(msg)) {
          setError('İstifadəçi adı və ya şifrə yanlışdır')
        } else {
          setError(msg || 'Daxil olmaq alınmadı.')
        }
        return false
      } finally {
        setBusy(false)
      }
    },
    [persist]
  )

  const register = useCallback(
    async (payload) => {
      setBusy(true)
      setError('')
      try {
        const data = await api.register(payload)
        if (!data?.token) throw new Error('Token alınmadı')
        persist(data)
        setOpen(false)
        return data
      } catch (err) {
        setError(err?.message || 'Qeydiyyat alınmadı.')
        return false
      } finally {
        setBusy(false)
      }
    },
    [persist]
  )

  const verifyAge = useCallback(
    async (dateOfBirth) => {
      const data = await api.saveAgeVerification(dateOfBirth)
      updateVerification(data)
      return data
    },
    [updateVerification]
  )

  const verifyIdentity = useCallback(
    async ({ identityDocumentNumber, finCode, identityPhotoData, confirmed = true }) => {
      const data = await api.saveIdentityVerification({
        identityDocumentNumber,
        finCode,
        identityPhotoData,
        confirmed,
      })
      updateVerification(data)
      return data
    },
    [updateVerification]
  )

  const logout = useCallback(async () => {
    // Alınmış biletlər backend-də saxlanılır və "Biletlərim" tarixçəsində
    // qalır. Çıxış yalnız lokal sessiyanı təmizləyir.
    const voucher = loadLastVoucherRaw()

    if (voucher?.id) {
      try {
        localStorage.removeItem(`ha_reservation_${voucher.id}`)
      } catch {
        // ignore
      }
      clearVoucher(voucher.id)
    }

    try {
      localStorage.removeItem(AUTH_KEY)
    } catch {
      // ignore
    }
    setAuth(null)
    setVerificationLoading(false)
    setOpen(false)
    setError('')
    navigate('/', { replace: true })
  }, [navigate])

  const hasRole = useCallback(
    (role) => Boolean(auth?.roles?.includes(role)),
    [auth]
  )

  const value = useMemo(() => {
    const isStaff = Boolean(
      Array.isArray(auth?.roles) && auth.roles.some(isStaffRole)
    )
    const isCustomer = Boolean(
      auth?.roles?.includes('ROLE_USER') && !isStaff
    )

    return {
      auth,
      user: auth,
      isAuthenticated: Boolean(auth?.token && auth?.userId),
      isAdmin: Boolean(auth?.roles?.includes('ROLE_ADMIN')),
      isCoordinator: Boolean(auth?.roles?.includes('ROLE_COORDINATOR')),
      isCashier: Boolean(auth?.roles?.includes('ROLE_CASHIER')),
      isVolunteer: Boolean(auth?.roles?.includes('ROLE_VOLUNTEER')),
      isStaff,
      isCustomer,
      isMinor: Boolean(
        isCustomer && auth?.ageVerified && auth?.isAdult === false
      ),
      needsAgeVerification: Boolean(
        isCustomer && !verificationLoading && !auth?.ageVerified
      ),
      needsIdentityVerification: Boolean(
        isCustomer &&
          auth?.ageVerified &&
          auth?.isAdult &&
          !auth?.identityConfirmed
      ),
      verificationLoading,
      hasRole,
      open,
      mode,
      setMode,
      busy,
      error,
      openAuth,
      closeAuth,
      login,
      register,
      persist,
      verifyAge,
      verifyIdentity,
      updateVerification,
      logout,
    }
  }, [
    auth,
    open,
    mode,
    busy,
    error,
    verificationLoading,
    hasRole,
    openAuth,
    closeAuth,
    login,
    register,
    persist,
    verifyAge,
    verifyIdentity,
    updateVerification,
    logout,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth AuthProvider daxilində istifadə olunmalıdır')
  return ctx
}
