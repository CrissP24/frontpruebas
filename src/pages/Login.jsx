import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../services/auth'
import { useAuth } from '../hooks/useAuth'
import teleImg from '../components/recursos/tele.png'

export default function Login() {
  // Valores por defecto para facilitar pruebas (puedes cambiar a '' en producción)
  const [email, setEmail] = useState('admin@mysimo.ec')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 'login' | 'recovery'
  const [mode, setMode] = useState('login')
  const [otp, setOtp] = useState(Array(6).fill('')) // código 6 dígitos
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
      
      console.log('Login result:', result)
      
      // El interceptor ya extrae los datos, result debería ser { user, token }
      if (!result) {
        throw new Error('Respuesta inválida del servidor')
      }
      
      // Manejar tanto el formato directo como el formato envuelto
      const user = result.user || result.data?.user
      const token = result.token || result.data?.token
      
      if (!user || !token) {
        console.error('Datos incompletos en respuesta:', result)
        throw new Error('Respuesta inválida del servidor')
      }
      
      setAuth({ user, token })
      
      // Redirigir al dashboard usando React Router
      navigate('/dashboard', { replace: true })
    } catch (e) {
      console.error('Error en login:', e)
      console.error('Error response:', e?.response)
      
      // Extraer mensaje de error de diferentes formatos
      let msg = 'Error en login'
      if (e?.response?.data?.error) {
        msg = e.response.data.error
      } else if (e?.response?.data?.message) {
        msg = e.response.data.message
      } else if (e?.message) {
        msg = e.message
      }
      
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleRecovery(e) {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Ingresa tu correo para enviarte el código.')
      return
    }

    // Primer clic: enviar código y mostrar mensaje + inputs
    if (!codeSent) {
      try {
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mysimobackend.onrender.com/api'}/auth/password-reset/request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Error al enviar código')
        
        // En desarrollo, mostrar código en consola
        if (data.data?.code) {
          console.log('Código de recuperación:', data.data.code)
          alert(`Código de recuperación (solo para desarrollo): ${data.data.code}`)
        }
        
        setCodeSent(true)
        setTimer(60)
        setOtp(Array(6).fill(''))
      } catch (err) {
        setError(err.message || 'Error al enviar código')
      } finally {
        setLoading(false)
      }
      return
    }

    // Segundo paso: validar código
    if (!codeVerified) {
      const code = otp.join('')
      if (code.length < 6) {
        setError('Completa el código de 6 dígitos.')
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mysimobackend.onrender.com/api'}/auth/password-reset/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code })
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Código inválido')
        
        setCodeVerified(true)
        setError('')
      } catch (err) {
        setError(err.message || 'Código inválido')
      } finally {
        setLoading(false)
      }
      return
    }

    // Tercer paso: restablecer contraseña
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      setLoading(true)
      const code = otp.join('')
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mysimobackend.onrender.com/api'}/auth/password-reset/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al restablecer contraseña')
      
      alert('Contraseña restablecida exitosamente. Puedes iniciar sesión ahora.')
      setMode('login')
      setOtp(Array(6).fill(''))
      setCodeSent(false)
      setCodeVerified(false)
      setNewPassword('')
      setConfirmNewPassword('')
      setTimer(0)
    } catch (err) {
      setError(err.message || 'Error al restablecer contraseña')
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = () => {
    // TODO: Implementar OAuth con Google
    window.location.href = '/api/auth/google'
  }

  const loginWithHotmail = () => {
    // TODO: Implementar OAuth con Microsoft/Hotmail
    window.location.href = '/api/auth/microsoft'
  }

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)

    setOtp(prev => {
      const next = [...prev]
      next[index] = digit
      return next
    })

    if (digit && index < otp.length - 1) {
      const nextInput = otpRefs.current[index + 1]
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = otpRefs.current[index - 1]
      if (prevInput) prevInput.focus()
    }
  }

  const handleForgotClick = () => {
    setMode('recovery')
    setError('')
    setOtp(Array(6).fill(''))
    setTimer(0)
    setCodeSent(false)
    setCodeVerified(false)
    setNewPassword('')
    setConfirmNewPassword('')
  }

  const handleResend = async () => {
    if (!codeSent || timer > 0) return
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://mysimobackend.onrender.com/api'}/auth/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al reenviar código')
      
      if (data.data?.code) {
        console.log('Código de recuperación:', data.data.code)
        alert(`Código de recuperación (solo para desarrollo): ${data.data.code}`)
      }
      
      setTimer(60)
      setOtp(Array(6).fill(''))
      setCodeVerified(false)
    } catch (err) {
      setError(err.message || 'Error al reenviar código')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container grid gap-10 md:grid-cols-2 py-10">
      {/* IZQUIERDA */}
      <div className="max-w-lg">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          ACCESO A LA PLATAFORMA
        </p>
        <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
          <span className="text-[var(--primary)]">Bienvenido,</span>{' '}
          <span className="text-black">accede al dashboard</span>
        </h1>

        {/* Login social (pacientes) */}
        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Acceso para pacientes</p>
            <span className="text-[var(--primary)]">
              ¡Descubre nuestros gadgets!
            </span>
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={loginWithGoogle}
              className="inline-flex items-center justify-center gap-3 rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-sm hover:bg-[var(--bg)]/60 transition"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3 14.6 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c5.6 0 9.2-3.9 9.2-9.4 0-.6-.1-1-.2-1.5H12z"
                />
              </svg>
              Continuar con Google
            </button>

            <button
              type="button"
              onClick={loginWithHotmail}
              className="inline-flex items-center justify-center gap-3 rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-sm hover:bg-[var(--bg)]/60 transition"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#0078D4"
                  d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                />
              </svg>
              Continuar con Hotmail
            </button>
          </div>
        </div>

        {/* Separador global */}
        <div className="relative my-6">
          <hr className="border-[var(--line)]" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg)] px-3 text-xs text-[var(--text-light)]">
            o
          </span>
        </div>

        {/* Login / recuperación profesional */}
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">
              {mode === 'login' ? 'Acceso para profesionales' : 'Recuperación de contraseña'}
            </p>
            {/* Info de credenciales de prueba */}
            {mode === 'login' && (
              <details className="text-xs text-gray-500 cursor-pointer">
                <summary className="hover:text-[var(--primary)]">Ver credenciales</summary>
                <div className="mt-2 p-2 bg-gray-50 rounded text-left space-y-1">
                  <div><strong>Admin:</strong> admin@mysimo.ec / Admin123</div>
                  <div><strong>Doctor:</strong> doctor1@mail.com / 123456</div>
                  <div><strong>Paciente:</strong> paciente1@mail.com / 123456</div>
                </div>
              </details>
            )}

            {mode === 'recovery' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setCodeSent(false)
                  setTimer(0)
                  setOtp(Array(6).fill(''))
                }}
                className="text-[11px] text-[var(--primary)] hover:underline"
              >
                Volver a iniciar sesión
              </button>
            )}
          </div>

          <form
            onSubmit={mode === 'login' ? handleLogin : handleRecovery}
            className="mt-3 space-y-3"
          >
            {mode === 'login' ? (
              <>
                <label className="block">
                  <span className="sr-only">Correo electrónico</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    autoComplete="username"
                    aria-invalid={Boolean(error)}
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Contraseña</span>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    autoComplete="current-password"
                    aria-invalid={Boolean(error)}
                  />
                </label>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="sr-only">Correo electrónico</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    autoComplete="email"
                  />
                </label>

                {codeSent && (
                  <div className="space-y-3">
                    {!codeVerified ? (
                      <>
                        <div className="flex items-center justify-between text-[11px] text-[var(--text-light)]">
                          <span className="text-left">
                            {timer > 0
                              ? `Te enviamos un código de 6 dígitos. Reenviar código en 0:${String(
                                  timer
                                ).padStart(2, '0')}`
                              : '¿No recibiste el código?'}
                          </span>
                          <button
                            type="button"
                            onClick={handleResend}
                            disabled={timer > 0 || loading}
                            className={
                              timer > 0 || loading
                                ? 'text-[var(--text-light)] cursor-default'
                                : 'text-[var(--primary)] hover:underline'
                            }
                          >
                            Reenviar
                          </button>
                        </div>

                        <div className="flex gap-2">
                          {otp.map((value, index) => (
                            <input
                              key={index}
                              ref={el => (otpRefs.current[index] = el)}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={value}
                              onChange={e => handleOtpChange(index, e.target.value)}
                              onKeyDown={e => handleOtpKeyDown(index, e)}
                              className="h-11 flex-1 border rounded-lg text-center text-base"
                              disabled={loading}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                          ✓ Código verificado. Ingresa tu nueva contraseña.
                        </div>
                        <input
                          type="password"
                          placeholder="Nueva contraseña"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          disabled={loading}
                        />
                        <input
                          type="password"
                          placeholder="Confirmar nueva contraseña"
                          value={confirmNewPassword}
                          onChange={e => setConfirmNewPassword(e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          disabled={loading}
                        />
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {error ? <div className="text-red-600 text-xs">{error}</div> : null}

            {mode === 'login' && (
              <div className="mt-1 flex flex-col items-end gap-1 text-[12px]">
                <div className="flex items-center gap-1 text-right">
                  <span className="text-black font-semibold">¿No tienes cuenta aún?</span>
                  <a
                    href="/registro"
                    className="text-[var(--primary)] hover:underline"
                  >
                    Eres médico
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleForgotClick}
                  className="text-[var(--primary)] hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              className="btn-primary w-full disabled:opacity-60 mt-2"
              disabled={loading}
              type="submit"
            >
              {mode === 'login'
                ? loading
                  ? 'Entrando…'
                  : 'Iniciar sesión'
                : codeVerified
                  ? loading
                    ? 'Restableciendo…'
                    : 'Restablecer contraseña'
                  : codeSent
                    ? loading
                      ? 'Verificando…'
                      : 'Verificar código'
                    : 'Enviar código'}
            </button>
          </form>
        </div>
      </div>

      {/* DERECHA: TELEMEDICINA / OMEDSO */}
      <aside className="hidden md:flex justify-end relative">
        <div className="relative w-full max-w-lg rounded-3xl border border-[var(--line)] bg-white shadow-xl overflow-hidden">
          {/* Glows */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent)]/12 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[var(--primary)]/10 blur-2xl" />

          {/* Puntos */}
          <div className="pointer-events-none absolute right-4 top-8 grid grid-cols-3 gap-1.5 opacity-50">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/40" />
            ))}
          </div>

          <div className="relative p-6 space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              OMEDSO TELEMEDICINA
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
              <span className="text-[var(--primary)]">Omedso</span>{' '}
              <span className="text-black">siempre contigo.</span>
            </h2>

            <p className="text-xs md:text-sm text-[var(--text-light)]">
              Agenda videollamadas seguras con especialistas verificados y accede a herramientas
              para organizar tu salud desde casa.
            </p>

            {/* Funcionalidades clave */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] md:text-xs">
              {/* 1. Videoconsultas */}
              <div className="flex items-start gap-2 rounded-xl bg-[var(--bg)]/70 border border-[var(--line)] px-3 py-2">
                <span className="mt-[2px] h-6 w-6 rounded-full bg-[var(--accent)]/10 grid place-items-center text-[var(--accent)]">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="13" height="14" rx="2" />
                    <polygon points="16 9 21 7 21 17 16 15" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold leading-tight text-[var(--text)]">
                    Videoconsultas seguras
                  </p>
                  <p className="text-[var(--text-light)] leading-tight">
                    Atención médica sin traslados ni filas.
                  </p>
                </div>
              </div>

              {/* 2. Recordatorios */}
              <div className="flex items-start gap-2 rounded-xl bg-[var(--bg)]/70 border border-[var(--line)] px-3 py-2">
                <span className="mt-[2px] h-6 w-6 rounded-full bg-[var(--accent)]/10 grid place-items-center text-[var(--accent)]">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12h18" />
                    <path d="M12 3v18" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold leading-tight text-[var(--text)]">
                    Recordatorios automáticos
                  </p>
                  <p className="text-[var(--text-light)] leading-tight">
                    Alertas de citas y seguimiento de tratamientos.
                  </p>
                </div>
              </div>

              {/* 3. Recetas e informes */}
              <div className="flex items-start gap-2 rounded-xl bg-[var(--bg)]/70 border border-[var(--line)] px-3 py-2">
                <span className="mt-[2px] h-6 w-6 rounded-full bg-[var(--accent)]/10 grid place-items-center text-[var(--accent)]">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="M8 8h8v2H8z" />
                    <path d="M8 12h7v2H8z" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold leading-tight text-[var(--text)]">
                    Recetas e informes digitales
                  </p>
                  <p className="text-[var(--text-light)] leading-tight">
                    Descarga resúmenes de consulta y órdenes médicas.
                  </p>
                </div>
              </div>

              {/* 4. Historial */}
              <div className="flex items-start gap-2 rounded-xl bg-[var(--bg)]/70 border border-[var(--line)] px-3 py-2">
                <span className="mt-[2px] h-6 w-6 rounded-full bg-[var(--accent)]/10 grid place-items-center text-[var(--accent)]">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 .6-1A1.65 1.65 0 0 0 4.6 6.2l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15.4 9a1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold leading-tight text-[var(--text)]">
                    Historial en un solo lugar
                  </p>
                  <p className="text-[var(--text-light)] leading-tight">
                    Información de tus consultas interconectadas cuando.
                  </p>
                </div>
              </div>
            </div>

            {/* Imagen sin borde, centrada */}
            <div className="mt-6 flex justify-center">
              <div className="w-56 md:w-64 rounded-2xl overflow-hidden bg-[var(--bg)]/60">
                <img
                  src={teleImg}
                  alt="Sesión de telemedicina"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  )
}
