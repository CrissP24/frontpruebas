import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginApi } from '../services/auth'
import { useAuth } from '../hooks/useAuth'
import logoNav from '../recursos/logo_bar_nav.png'

function Navbar() {
  const { auth, logout } = useAuth()

  return (
    <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-50">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-5 md:gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoNav} alt="Consulta Médica Ecuador" className="h-9 w-auto" />
          </Link>
          <div className="hidden md:block w-px h-5 bg-gray-200"></div>
          <a href="https://pro.omedso.com" target="_blank" rel="noreferrer" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-[var(--primary)] transition">
            ¿Eres Especialista?
          </a>
        </div>

        <div className="flex items-center gap-3">
          {!auth?.user ? (
            <Link to="/login" className="btn-primary flex items-center gap-2 text-sm px-5 py-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3" />
                <path d="M6 18c1.5-3 4.5-3 6-3s4.5 0 6 3" />
              </svg>
              <span>Acceder</span>
            </Link>
          ) : (
            <>
              <Link to="/dashboard" className="btn-outline">Dashboard</Link>
              <button onClick={logout} className="btn-outline">Salir</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // 'login' | 'recovery'
  const [mode, setMode] = useState('login')
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [timer, setTimer] = useState(0)
  const [codeSent, setCodeSent] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [codeVerified, setCodeVerified] = useState(false)

  const otpRefs = useRef([])
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (mode !== 'recovery' || timer <= 0) return
    const id = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [mode, timer])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Ingresa tu correo y contraseña.')
      return
    }
    setLoading(true)
    try {
      const result = await loginApi(email, password)
      if (!result) throw new Error('Respuesta inválida del servidor')
      
      const user = result.user || result.data?.user
      const token = result.token || result.data?.token
      
      if (!user || !token) throw new Error('Respuesta inválida del servidor')
      
      setAuth({ user, token })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      let msg = 'Error en login'
      if (e?.response?.data?.error) msg = e.response.data.error
      else if (e?.response?.data?.message) msg = e.response.data.message
      else if (e?.message) msg = e.message
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // --- Lógica de recuperación y redes sociales omitida por brevedad, 
  // pero mantén exactamente la misma que tenías en tu código ---
  async function handleRecovery(e) { e.preventDefault() }
  const loginWithGoogle = async () => {}
  const loginWithFacebook = () => {}

  const handleForgotClick = () => {
    setMode('recovery')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#140172]/5 via-violet-50/40 to-teal-50/40 flex flex-col">
      
      {/* Navbar estandarizado */}
      <Navbar />

      {/* CONTENEDOR PRINCIPAL CENTRADO */}
      <main className="flex-1 flex items-center justify-center p-4">
        
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-[0_20px_60px_-15px_rgba(20,1,114,0.15)] border border-slate-100 relative">
          
          {/* Botón de regreso integrado en la tarjeta */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            title="Regresar al inicio"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {mode === 'login' ? (
            <div className="mt-6">
              <h2 className="text-xl font-medium text-center text-gray-800 mb-6">Continúa con</h2>

              {/* Botones Sociales */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3 14.6 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c5.6 0 9.2-3.9 9.2-9.4 0-.6-.1-1-.2-1.5H12z"/>
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={loginWithFacebook}
                  className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Separador */}
              <div className="flex items-center gap-3 mb-8">
                <hr className="flex-1 border-gray-200" />
                <span className="text-sm text-gray-600">o inicia sesión con tu correo electrónico</span>
                <hr className="flex-1 border-gray-200" />
              </div>

              {/* Formulario */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#140172] focus:border-transparent outline-none"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#140172] focus:border-transparent outline-none pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={handleForgotClick}
                    className="text-sm text-[#140172] hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#140172] text-white rounded-full py-3 font-semibold hover:bg-[#2a1c9c] transition disabled:opacity-70 mt-4"
                >
                  {loading ? 'Entrando...' : 'INICIAR SESIÓN'}
                </button>
                
                <p className="text-center text-sm text-gray-800 mt-6">
                  ¿Eres un nuevo usuario?{' '}
                  <a href="/registro" className="text-[#140172] hover:underline font-medium">
                    Regístrate gratis
                  </a>
                </p>
              </form>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Recuperación de contraseña</h2>
              {/* Aquí va tu formulario de recuperación original */}
              <button onClick={() => setMode('login')} className="text-sm text-[#140172] hover:underline mt-4">
                Volver a iniciar sesión
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}