import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { googleLoginApi } from '../services/auth'
import { FaXTwitter } from 'react-icons/fa6'
import { FaLinkedinIn } from 'react-icons/fa'
import logoNav from '../recursos/logo_bar_nav.png'
import logoFooter from '../recursos/logofooter.png'

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

          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
          >
            <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m-4 4l4 4M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
            Iniciar sesión con correo
          </Link>
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
  const { auth, logout } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-50">
        <div className="container px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoNav} alt="Consulta Médica Ecuador" className="h-8 md:h-9 w-auto" />
            </Link>
            <div className="hidden md:block w-px h-5 bg-gray-200"></div>
            <a href="https://pro.omedso.com" target="_blank" rel="noreferrer" className="hidden md:block text-[15px] font-semibold text-gray-600 hover:text-[var(--primary)] transition">
              ¿Eres Especialista?
            </a>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {!auth?.user ? (
              <button
                onClick={() => setShowAuth(true)}
                className="btn-primary flex items-center gap-1.5 text-xs md:text-sm px-3 py-1.5 md:px-5 md:py-2"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M6 18c1.5-3 4.5-3 6-3s4.5 0 6 3" />
                </svg>
                <span>Acceder</span>
              </button>
            ) : (
              <>
                <Link to="/dashboard" className="btn-outline text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2">Dashboard</Link>
                <button onClick={logout} className="btn-outline text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2">Salir</button>
              </>
            )}
          </div>
        </div>
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-8 md:pt-10 pb-6">
      <div className="mx-auto max-w-7xl px-5 md:px-16">
        <div className="flex items-center gap-5 border-b border-slate-100 pb-4 md:pb-5">
          <span className="text-xs md:text-sm font-semibold text-slate-500 tracking-wide">Síguenos</span>
          <a href="https://x.com/omedsolat" target="_blank" rel="noopener noreferrer" aria-label="X"
            className="text-slate-400 transition-colors hover:text-slate-900">
            <FaXTwitter className="h-4 w-4 md:h-[17px] md:w-[17px]" />
          </a>
          <a href="https://linkedin.com/company/omedsolat" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="text-slate-400 transition-colors hover:text-[#0077b5]">
            <FaLinkedinIn className="h-4 w-4 md:h-[17px] md:w-[17px]" />
          </a>
        </div>
        <div className="py-5 text-[13px] text-slate-500">
          <div className="flex flex-col gap-4 md:hidden">
            <a href="https://omedso.com" target="_blank" rel="noreferrer">
              <img src={logoFooter} alt="Omedso" className="h-6 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            </a>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
              <a href="https://pro.omedso.com" target="_blank" rel="noreferrer"
                className="hover:text-[#140172] transition-colors">¿Eres especialista?</a>
              <Link to="/buscar" className="hover:text-[#140172] transition-colors">Nuestros médicos</Link>
            </div>
            <div className="flex gap-x-5 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
              <Link to="/privacidad" className="hover:text-[#140172] transition-colors">Privacidad</Link>
              <Link to="/terminos" className="hover:text-[#140172] transition-colors">Términos</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center flex-wrap gap-x-8 gap-y-3">
            <a href="https://omedso.com" target="_blank" rel="noreferrer" className="flex-shrink-0 mr-2">
              <img src={logoFooter} alt="Omedso" className="h-7 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            </a>
            <a href="https://pro.omedso.com" target="_blank" rel="noreferrer"
              className="hover:text-[#140172] hover:underline transition-colors">¿Eres especialista?</a>
            <Link to="/buscar" className="hover:text-[#140172] hover:underline transition-colors">Nuestros médicos</Link>
            <span className="ml-auto flex items-center gap-x-8">
              <Link to="/privacidad" className="hover:text-[#140172] hover:underline transition-colors">Privacidad</Link>
              <Link to="/terminos" className="hover:text-[#140172] hover:underline transition-colors">Términos</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
