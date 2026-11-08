import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function AccessGate({ title, description, action }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6">
      <div className="glass-strong rounded-xl p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-ice-400/10 text-2xl text-ice-200">
          ⚿
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-white">{title}</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-frost/60">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {action}
          <Link to="/" className="btn-ghost !px-5 !py-2.5 text-sm">
            Ana səhifə
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ProtectedRoute({ roles = [], children }) {
  const { isAuthenticated, hasRole, openAuth } = useAuth()

  if (!isAuthenticated) {
    return (
      <AccessGate
        title="Giriş tələb olunur"
        description="Bu bölməyə giriş üçün Ice Arena hesabınıza daxil olun."
        action={
          <button
            type="button"
            onClick={() => openAuth('login')}
            className="btn-primary !px-5 !py-2.5 text-sm"
          >
            Daxil ol
          </button>
        }
      />
    )
  }

  if (roles.length > 0 && !roles.some((role) => hasRole(role))) {
    return (
      <AccessGate
        title="İcazə yoxdur"
        description="Hesabınıza bu bölmə üçün lazımi rol təyin edilməyib. Admin ilə əlaqə saxlayın."
      />
    )
  }

  return children
}
