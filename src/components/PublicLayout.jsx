import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { googleLoginApi } from '../services/auth'
import logoNav from '../recursos/logo_bar_nav.png'
import SharedFooter from './SharedFooter'
import NavUserButton from './NavUserButton'

function AuthModal({ onClose }) {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const googleCallbackRef = useRef(null)

  useEffect(() => {
    googleCallbackRef.current = async (response) => {
      setLoading(true)
      setError('')
      try {
        const result = await googleLoginApi(response.credential)
        const user = result.user || result.data?.user
        const token = result.token || result.data?.token
        if (!user || !token) throw new Error('Respuesta inválida')
        setAuth({ user, token })
        onClose()
        navigate('/dashboard', { replace: true })
      } catch (e) {
        setError(e?.message || 'Error al iniciar sesión con Google')
      } finally {
        setLoading(false)
      }
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (r) => googleCallbackRef.current?.(r),
        auto_select: false,
        cancel_on_tap_outside: true,
      })
    }

    if (window.google?.accounts?.id) {
      initGoogle()
    } else {
      let attempts = 0
      const interval = setInterval(() => {
        attempts++
        if (window.google?.accounts?.id) { clearInterval(interval); initGoogle() }
        else if (attempts >= 50) clearInterval(interval)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [])

  const handleGoogle = () => {
    if (!window.google?.accounts?.id) {
      setError('Google no disponible. Verifica tu conexión.')
      return
    }
    setError('')
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        navigate('/login')
        onClose()
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="mb-6 text-center">
          <img src={logoNav} alt="Consulta Médica Ecuador" className="h-8 w-auto mx-auto mb-4" />
          <p className="text-sm text-slate-500">Elige cómo quieres continuar</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md disabled:opacity-60"
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loading ? 'Iniciando sesión...' : 'Continuar con Google'}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-center text-xs text-red-500">{error}</p>
        )}

        <p className="mt-5 text-center text-[11px] text-slate-400">
          Al continuar aceptas nuestros{' '}
          <Link to="/terminos" onClick={onClose} className="underline hover:text-slate-600">Términos</Link>
          {' '}y{' '}
          <Link to="/privacidad" onClick={onClose} className="underline hover:text-slate-600">Privacidad</Link>.
        </p>
      </div>
    </div>
  )
}

function Navbar() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-50">
        <div className="container px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-5">
          <div className="flex items-center gap-3 md:gap-8">
            <Link to="/" className="flex-shrink-0">
              <img src={logoNav} alt="Consulta Médica Ecuador" className="h-8 md:h-9 w-auto" />
            </Link>
            <div className="hidden md:block w-px h-5 bg-gray-200 flex-shrink-0" />
            <a href="https://pro.omedso.com" target="_blank" rel="noreferrer"
              className="hidden md:block text-[15px] font-semibold text-gray-600 hover:text-[#140172] transition whitespace-nowrap">
              ¿Eres profesional?
            </a>
          </div>
          <NavUserButton onLoginClick={() => setShowAuth(true)} />
        </div>
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}


export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <SharedFooter />
    </div>
  )
}
