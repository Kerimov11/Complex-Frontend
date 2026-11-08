import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

const inputCls =
  'mt-1 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-frost/30 outline-none transition-colors focus:border-ice-300/60'

const labelCls =
  'text-[10px] font-bold uppercase tracking-wider text-frost/45'

export default function AuthModal() {
  const {
    open,
    mode,
    busy,
    error,
    openAuth,
    closeAuth,
    login,
    register,
  } = useAuth()

  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })

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

  if (!open) return null

  const isLogin = mode === 'login'

  async function submitLogin(e) {
    e.preventDefault()
    await login(loginForm.username.trim(), loginForm.password)
  }

  async function submitRegister(e) {
    e.preventDefault()
    await register({
      username: registerForm.username.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
      firstName: registerForm.firstName.trim(),
      lastName: registerForm.lastName.trim(),
      phoneNumber: registerForm.phoneNumber.trim() || null,
    })
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
        aria-label={isLogin ? 'Daxil ol' : 'Qeydiyyat'}
        className="glass-strong my-6 w-full max-w-md overflow-hidden rounded-xl border border-white/15"
      >
        <div className="relative border-b border-white/10 p-6 pb-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ice-200">
            Şəxsi kabinet
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            {isLogin ? 'Hesabınıza daxil olun' : 'Yeni hesab yaradın'}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-frost/60">
            Bilet və konki rezervasiyası üçün hesabınız backend-də
            təsdiqlənəcək.
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
                !isLogin
                  ? 'bg-ice-400 text-night-950'
                  : 'text-frost/60 hover:text-white'
              }`}
            >
              Qeydiyyat
            </button>
          </div>

          {isLogin ? (
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
                <label className={labelCls} htmlFor="auth-password">
                  Şifrə
                </label>
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
          ) : (
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
                  E-poçt
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className={inputCls}
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
              <div>
                <label className={labelCls} htmlFor="reg-phone">
                  Telefon (istəyə bağlı)
                </label>
                <input
                  id="reg-phone"
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
                />
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

          {error && (
            <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </p>
          )}

          <div className="mt-5 rounded-lg border border-ice-300/25 bg-ice-400/10 p-4">
            <p className="text-xs leading-relaxed text-frost/65">
              Demo hesab: <span className="font-bold text-white">demo</span> /{' '}
              <span className="font-bold text-white">demo123</span>
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => login('demo', 'demo123')}
              className="mt-2 text-xs font-bold uppercase tracking-wider text-ice-200 transition-colors hover:text-white disabled:opacity-50"
            >
              Demo ilə daxil ol →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
