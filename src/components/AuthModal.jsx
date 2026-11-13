import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { api } from '../api/client'
import { staffHomePath } from '../utils/staffRoutes'
import { isValidEmail } from '../utils/validation'

const inputCls =
  'mt-1 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-frost/30 outline-none transition-colors focus:border-ice-300/60'

const labelCls =
  'text-[10px] font-bold uppercase tracking-wider text-frost/45'

export default function AuthModal() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    open,
    mode,
    busy,
    error,
    openAuth,
    closeAuth,
    login,
    register,
    persist,
  } = useAuth()

  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
  })

  // Şifrəmi unutdum state-ləri
  const [forgotMethod, setForgotMethod] = useState('EMAIL') // 'EMAIL' | 'PHONE'
  const [forgotIdentifier, setForgotIdentifier] = useState('')
  const [forgotStep, setForgotStep] = useState(1) // 1: kod göndər, 2: kodu və yeni şifrəni yaz
  const [forgotInfo, setForgotInfo] = useState(null)
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [forgotBusy, setForgotBusy] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') closeAuth()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, closeAuth])

  useEffect(() => {
    setLocalError('')
    if (mode !== 'forgot') {
      setForgotStep(1)
      setForgotInfo(null)
      setResetCode('')
      setNewPassword('')
      setConfirmNewPassword('')
      setForgotError('')
      setForgotSuccess('')
    }
  }, [mode, open])

  if (!open) return null

  const isLogin = mode === 'login'
  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'

  function redirectAfterAuth(data) {
    if (!data || !Array.isArray(data.roles)) return
    const roles = data.roles
    const isAdmin = roles.includes('ROLE_ADMIN')
    const isCoordinator = roles.includes('ROLE_COORDINATOR')
    const isCashier = roles.includes('ROLE_CASHIER')
    const isVolunteer = roles.includes('ROLE_VOLUNTEER')
    if (isAdmin || isCoordinator || isCashier || isVolunteer) {
      navigate(staffHomePath({ isAdmin, isCoordinator, isCashier, isVolunteer }), {
        replace: true,
      })
      return
    }
    if (
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname === '/volunteer' ||
      pathname.startsWith('/volunteer/')
    ) {
      navigate('/', { replace: true })
    }
  }

  async function submitLogin(e) {
    e.preventDefault()
    const data = await login(loginForm.username.trim(), loginForm.password)
    redirectAfterAuth(data)
  }

  async function submitDemoLogin() {
    const data = await login('demo', 'demo123')
    redirectAfterAuth(data)
  }

  async function submitRegister(e) {
    e.preventDefault()
    setLocalError('')
    if (!isValidEmail(registerForm.email)) {
      setLocalError('E-poçt ünvanı düzgün formatda deyil (məs: ad@gmail.com).')
      return
    }
    const data = await register({
      username: registerForm.username.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
      firstName: registerForm.firstName.trim(),
      lastName: registerForm.lastName.trim(),
      dateOfBirth: registerForm.dateOfBirth || null,
      phoneNumber: registerForm.phoneNumber.trim(),
    })
    redirectAfterAuth(data)
  }

  async function submitForgotRequest(e) {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')

    if (!forgotIdentifier.trim()) {
      setForgotError(
        forgotMethod === 'EMAIL'
          ? 'Zəhmət olmasa Gmail (e-poçt) ünvanınızı daxil edin.'
          : 'Zəhmət olmasa telefon nömrənizi daxil edin.'
      )
      return
    }

    setForgotBusy(true)
    try {
      const res = await api.forgotPassword({
        method: forgotMethod,
        identifier: forgotIdentifier.trim(),
      })
      setForgotInfo(res)
      setForgotStep(2)
      setForgotSuccess(
        res?.message || 'Təsdiq kodu uğurla göndərildi.'
      )
    } catch (err) {
      setForgotError(err?.message || 'Təsdiq kodu göndərilə bilmədi.')
    } finally {
      setForgotBusy(false)
    }
  }

  async function submitResetPassword(e) {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')

    if (!resetCode.trim()) {
      setForgotError('6 rəqəmli təsdiq kodunu daxil edin.')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setForgotError('Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Yeni şifrə ilə təkrarı eyni deyil.')
      return
    }

    setForgotBusy(true)
    try {
      const data = await api.resetPassword({
        method: forgotMethod,
        identifier: forgotIdentifier.trim(),
        code: resetCode.trim(),
        newPassword,
      })
      if (data?.token) {
        persist(data)
        closeAuth()
      } else {
        openAuth('login')
      }
    } catch (err) {
      setForgotError(err?.message || 'Şifrəni yeniləmək alınmadı.')
    } finally {
      setForgotBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto bg-night-950/85 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAuth()
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          isForgot ? 'Şifrəni bərpa et' : isLogin ? 'Daxil ol' : 'Qeydiyyat'
        }
        className="glass-strong my-6 w-full max-w-md overflow-hidden rounded-xl border border-white/15"
      >
        <div className="relative border-b border-white/10 p-6 pb-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ice-200">
            Şəxsi kabinet
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            {isForgot
              ? 'Şifrənin bərpası'
              : isLogin
                ? 'Hesabınıza daxil olun'
                : 'Yeni hesab yaradın'}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-frost/60">
            {isForgot
              ? 'Gmail ünvanınıza və ya telefon nömrənizə gələn təsdiq kodu ilə şifrənizi yeniləyin.'
              : 'Bilet və konki rezervasiyası üçün hesabınız təsdiqlənəcək.'}
          </p>

          <button
            type="button"
            onClick={closeAuth}
            aria-label="Bağla"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-frost/70 transition-colors hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {!isForgot && (
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
              <button
                type="button"
                onClick={() => openAuth('login')}
                className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                  isLogin
                    ? 'bg-ice-400 text-night-950'
                    : 'text-frost/60 hover:text-white'
                }`}
              >
                Daxil ol
              </button>
              <button
                type="button"
                onClick={() => openAuth('register')}
                className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                  isRegister
                    ? 'bg-ice-400 text-night-950'
                    : 'text-frost/60 hover:text-white'
                }`}
              >
                Qeydiyyat
              </button>
            </div>
          )}

          {isLogin && (
            <form onSubmit={submitLogin} className="space-y-4">
              <div>
                <label className={labelCls} htmlFor="auth-username">
                  İstifadəçi adı
                </label>
                <input
                  id="auth-username"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, username: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="demo"
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className={labelCls} htmlFor="auth-password">
                    Şifrə
                  </label>
                  <button
                    type="button"
                    onClick={() => openAuth('forgot')}
                    className="text-xs font-semibold text-ice-200 transition-colors hover:text-white"
                  >
                    Şifrəmi unutdum?
                  </button>
                </div>
                <input
                  id="auth-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, password: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className={`btn-primary w-full ${
                  busy ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                {busy ? 'Yoxlanılır…' : 'Daxil ol'}
              </button>
            </form>
          )}

          {isRegister && (
            <form onSubmit={submitRegister} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="reg-first">
                    Ad
                  </label>
                  <input
                    id="reg-first"
                    value={registerForm.firstName}
                    onChange={(e) =>
                      setRegisterForm((p) => ({
                        ...p,
                        firstName: e.target.value,
                      }))
                    }
                    className={inputCls}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="reg-last">
                    Soyad
                  </label>
                  <input
                    id="reg-last"
                    value={registerForm.lastName}
                    onChange={(e) =>
                      setRegisterForm((p) => ({
                        ...p,
                        lastName: e.target.value,
                      }))
                    }
                    className={inputCls}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelCls} htmlFor="reg-username">
                  İstifadəçi adı
                </label>
                <input
                  id="reg-username"
                  value={registerForm.username}
                  onChange={(e) =>
                    setRegisterForm((p) => ({ ...p, username: e.target.value }))
                  }
                  className={inputCls}
                  autoComplete="username"
                  minLength={3}
                  required
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="reg-email">
                  Gmail / E-poçt
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="ornek@gmail.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="reg-password">
                  Şifrə (min. 6 simvol)
                </label>
                <input
                  id="reg-password"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm((p) => ({ ...p, password: e.target.value }))
                  }
                  className={inputCls}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="reg-dob">
                    Doğum tarixi
                  </label>
                  <input
                    id="reg-dob"
                    type="date"
                    value={registerForm.dateOfBirth}
                    min="1900-01-01"
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) =>
                      setRegisterForm((p) => ({
                        ...p,
                        dateOfBirth: e.target.value,
                      }))
                    }
                    className={`${inputCls} [color-scheme:dark]`}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="reg-phone">
                    Telefon nömrəsi
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={registerForm.phoneNumber}
                    onChange={(e) =>
                      setRegisterForm((p) => ({
                        ...p,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className={inputCls}
                    placeholder="+994 50 000 00 00"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className={`btn-primary w-full ${
                  busy ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                {busy ? 'Qeydiyyat aparılır…' : 'Qeydiyyatdan keç'}
              </button>
            </form>
          )}

          {isForgot && (
            <div className="space-y-4">
              {forgotStep === 1 ? (
                <form onSubmit={submitForgotRequest} className="space-y-4">
                  <div>
                    <p className={labelCls}>Bərpa üsulunu seçin</p>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotMethod('EMAIL')
                          setForgotIdentifier('')
                          setForgotError('')
                        }}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors ${
                          forgotMethod === 'EMAIL'
                            ? 'border-ice-300/60 bg-ice-400/20 text-ice-100'
                            : 'border-white/10 bg-white/[0.03] text-frost/60 hover:text-white'
                        }`}
                      >
                        ✉️ Gmail / E-poçt ilə
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotMethod('PHONE')
                          setForgotIdentifier('')
                          setForgotError('')
                        }}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors ${
                          forgotMethod === 'PHONE'
                            ? 'border-ice-300/60 bg-ice-400/20 text-ice-100'
                            : 'border-white/10 bg-white/[0.03] text-frost/60 hover:text-white'
                        }`}
                      >
                        📱 Telefon nömrəsi ilə
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="forgot-identifier">
                      {forgotMethod === 'EMAIL'
                        ? 'Gmail / E-poçt ünvanınız'
                        : 'Qeydiyyatda olan telefon nömrəniz'}
                    </label>
                    <input
                      id="forgot-identifier"
                      type={forgotMethod === 'EMAIL' ? 'email' : 'tel'}
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      className={inputCls}
                      placeholder={
                        forgotMethod === 'EMAIL'
                          ? 'demo@icearena.az'
                          : '+994 50 111 22 33'
                      }
                      required
                    />
                  </div>

                  {forgotError && (
                    <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-200">
                      {forgotError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={forgotBusy}
                    className={`btn-primary w-full ${
                      forgotBusy ? 'cursor-not-allowed opacity-60' : ''
                    }`}
                  >
                    {forgotBusy
                      ? 'Göndərilir…'
                      : forgotMethod === 'EMAIL'
                        ? 'Gmail-ə təsdiq kodu göndər'
                        : 'Nömrəyə SMS kod göndər'}
                  </button>

                  <button
                    type="button"
                    onClick={() => openAuth('login')}
                    className="w-full text-center text-xs font-semibold text-frost/60 transition-colors hover:text-white"
                  >
                    ← Giriş ekranına qayıt
                  </button>
                </form>
              ) : (
                <form onSubmit={submitResetPassword} className="space-y-4">
                  {forgotSuccess && (
                    <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-100">
                      <p className="font-semibold">{forgotSuccess}</p>
                      {forgotInfo?.demoResetCode && (
                        <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-300/30 bg-night-950/60 px-3 py-2">
                          <span>
                            Gələn mesaj kodu:{' '}
                            <strong className="font-mono text-sm tracking-widest text-white">
                              {forgotInfo.demoResetCode}
                            </strong>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setResetCode(forgotInfo.demoResetCode)
                            }
                            className="rounded bg-emerald-400/20 px-2 py-1 text-[11px] font-bold text-emerald-200 hover:bg-emerald-400/30"
                          >
                            Kodu daxil et
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className={labelCls} htmlFor="reset-code">
                      6 rəqəmli təsdiq kodu
                    </label>
                    <input
                      id="reset-code"
                      type="text"
                      maxLength={6}
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className={`${inputCls} font-mono tracking-widest`}
                      placeholder="000000"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="reset-new-password">
                      Yeni şifrə (min. 6 simvol)
                    </label>
                    <input
                      id="reset-new-password"
                      type="password"
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputCls}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label
                      className={labelCls}
                      htmlFor="reset-confirm-password"
                    >
                      Yeni şifrənin təkrarı
                    </label>
                    <input
                      id="reset-confirm-password"
                      type="password"
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className={inputCls}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {forgotError && (
                    <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-200">
                      {forgotError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={forgotBusy}
                    className={`btn-primary w-full ${
                      forgotBusy ? 'cursor-not-allowed opacity-60' : ''
                    }`}
                  >
                    {forgotBusy ? 'Yenilənir…' : 'Şifrəni yenilə və daxil ol'}
                  </button>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1)
                        setForgotError('')
                      }}
                      className="font-semibold text-frost/60 hover:text-white"
                    >
                      ← Yenidən kod göndər
                    </button>
                    <button
                      type="button"
                      onClick={() => openAuth('login')}
                      className="font-semibold text-ice-200 hover:text-white"
                    >
                      Girişə qayıt
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {!isForgot && (localError || error) && (
            <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {localError || error}
            </p>
          )}

          {!isForgot && (
            <div className="mt-5 rounded-lg border border-ice-300/25 bg-ice-400/10 p-4">
              <p className="text-xs leading-relaxed text-frost/65">
                Demo hesab: <span className="font-bold text-white">demo</span> /{' '}
                <span className="font-bold text-white">demo123</span>
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={submitDemoLogin}
                className="mt-2 text-xs font-bold uppercase tracking-wider text-ice-200 transition-colors hover:text-white disabled:opacity-50"
              >
                Demo ilə daxil ol →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
