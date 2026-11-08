import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { api } from '../api/client'
import { clearVoucher, loadLastVoucherRaw } from '../utils/voucher'

const AUTH_KEY = 'ha_auth'
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

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readAuth)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('login')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

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
    const next = {
      token: data?.token || '',
      userId: data?.userId ?? null,
      username: data?.username || '',
      roles: Array.isArray(data?.roles) ? data.roles : [],
    }
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(next))
    } catch {
      // localStorage əlçatmazdırsa sessiya yalnız yaddaşda qalır
    }
    setAuth(next)
  }, [])

  const login = useCallback(
    async (username, password) => {
      setBusy(true)
      setError('')
      try {
        const data = await api.login(username, password)
        if (!data?.token) throw new Error('Token alınmadı')
        persist(data)
        setOpen(false)
        return true
      } catch (err) {
        setError(err?.message || 'Daxil olmaq alınmadı.')
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
        return true
      } catch (err) {
        setError(err?.message || 'Qeydiyyat alınmadı.')
        return false
      } finally {
        setBusy(false)
      }
    },
    [persist]
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
    setOpen(false)
    setError('')
  }, [])

  const hasRole = useCallback(
    (role) => Boolean(auth?.roles?.includes(role)),
    [auth]
  )

  const value = useMemo(
    () => ({
      auth,
      user: auth,
      isAuthenticated: Boolean(auth?.token && auth?.userId),
      isAdmin: Boolean(auth?.roles?.includes('ROLE_ADMIN')),
      isCoordinator: Boolean(auth?.roles?.includes('ROLE_COORDINATOR')),
      isCashier: Boolean(auth?.roles?.includes('ROLE_CASHIER')),
      isVolunteer: Boolean(auth?.roles?.includes('ROLE_VOLUNTEER')),
      isStaff: Boolean(
        auth?.roles?.some((role) =>
          [
            'ROLE_ADMIN',
            'ROLE_COORDINATOR',
            'ROLE_CASHIER',
            'ROLE_VOLUNTEER',
          ].includes(role)
        )
      ),
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
      logout,
    }),
    [
      auth,
      open,
      mode,
      busy,
      error,
      hasRole,
      openAuth,
      closeAuth,
      login,
      register,
      logout,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth AuthProvider daxilində istifadə olunmalıdır')
  return ctx
}
