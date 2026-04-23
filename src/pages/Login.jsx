import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { googleLoginApi } from '../services/auth'
import { useAuth } from '../hooks/useAuth'
import logoNav from '../recursos/logo_bar_nav.png'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const googleCallbackRef = useRef(null)
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth?.token) navigate('/dashboard', { replace: true })
  }, [auth, navigate])

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
      setError('Google no disponible. Verifica tu conexión a internet.')
      return
    }
    setError('')
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setError('No se pudo mostrar Google. Intenta de nuevo o revisa las cookies de terceros.')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#140172]/5 via-violet-50/40 to-teal-50/40 flex flex-col">

      <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoNav} alt="Consulta Médica Ecuador" className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-[0_20px_60px_-15px_rgba(20,1,114,0.15)] border border-slate-100">

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </button>

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#140172]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#140172]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="8" r="3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18c1.5-3 4.5-3 6-3s4.5 0 6 3" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Accede a tu cuenta</h1>
            <p className="text-sm text-gray-500 mt-1">Usa tu cuenta de Google para continuar</p>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
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

          {error && (
            <p className="mt-4 text-center text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <p className="mt-6 text-center text-[11px] text-gray-400">
            Al continuar aceptas nuestros{' '}
            <Link to="/terminos" className="underline hover:text-gray-600">Términos</Link>
            {' '}y{' '}
            <Link to="/privacidad" className="underline hover:text-gray-600">Privacidad</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
