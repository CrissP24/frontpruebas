import { useMemo, useState, useEffect } from 'react'
import { registerApi } from '../services/auth'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { ecuadorProvinces, ecuadorInsurances, ecuadorUniversities } from '../data/ecuadorData.js'

import centroImg from '../components/recursos/hce.png'

export default function Register() {
  const { setAuth } = useAuth()
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [specialties, setSpecialties] = useState([])
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    specialty: '',
    province: '',
    city: '',
    phone: '',
    email: '',
    confirm_email: '',
    password: '',
    confirm_password: '',
    insurances: [],
    marketing_opt_in: true,
    accept_terms: false,
    recaptcha: false,
  })

  // Cargar especialidades al montar
  useEffect(() => {
    const loadedSpecialties = JSON.parse(localStorage.getItem('mysimo_specialties') || '[]')
    if (loadedSpecialties.length === 0) {
      // Especialidades por defecto
      const defaultSpecialties = [
        { id: 1, name: 'Cardiología' },
        { id: 2, name: 'Dermatología' },
        { id: 3, name: 'Pediatría' },
        { id: 4, name: 'Medicina General' },
        { id: 5, name: 'Ginecología' },
        { id: 6, name: 'Traumatología' },
        { id: 7, name: 'Oftalmología' },
        { id: 8, name: 'Psiquiatría' },
        { id: 9, name: 'Neurología' },
        { id: 10, name: 'Urología' }
      ]
      localStorage.setItem('mysimo_specialties', JSON.stringify(defaultSpecialties))
      setSpecialties(defaultSpecialties)
    } else {
      setSpecialties(loadedSpecialties)
    }
  }, [])

  // Ciudades disponibles según la provincia
  const availableCities = useMemo(() => {
    if (!form.province) return []
    const province = ecuadorProvinces.find(p => p.name === form.province)
    return province ? province.cities : []
  }, [form.province])

  const payload = useMemo(() => {
    const full_name = `${form.first_name} ${form.last_name}`.trim()
    return {
      role: 'doctor',
      full_name,
      specialty: form.specialty,
      city: form.city || form.province,
      province: form.province,
      phone: `+593 ${form.phone}`,
      email: form.email.trim(),
      password: form.password,
      insurances: form.insurances,
      marketing_opt_in: form.marketing_opt_in,
      accept_terms: form.accept_terms,
    }
  }, [form])
  
  function validateForm() {
    const newErrors = {}
    
    console.log('Validando formulario con datos:', form)
    
    if (!form.first_name.trim()) newErrors.first_name = 'Nombre es requerido'
    if (!form.last_name.trim()) newErrors.last_name = 'Apellido es requerido'
    if (!form.username.trim()) newErrors.username = 'Usuario es requerido'
    if (form.username.trim() && !/^[a-zA-Z0-9._-]{4,20}$/.test(form.username)) {
      newErrors.username = 'Usuario debe tener 4-20 caracteres'
    }
    if (!form.specialty.trim()) newErrors.specialty = 'Especialidad es requerida'
    if (!form.province) newErrors.province = 'Provincia es requerida'
    if (!form.city) newErrors.city = 'Ciudad es requerida'
    if (!form.phone.trim()) newErrors.phone = 'Teléfono es requerido'
    if (!form.email.trim()) {
      newErrors.email = 'Email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!form.password) {
      newErrors.password = 'Contraseña es requerida'
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    if (form.password !== form.confirm_password) {
      newErrors.confirm_password = 'Las contraseñas no coinciden'
    }
    // Insurances es opcional
    if (!form.recaptcha) newErrors.recaptcha = 'Debes completar el reCAPTCHA'
    if (!form.accept_terms) newErrors.accept_terms = 'Debes aceptar los términos y condiciones'
    
    console.log('Errores de validación:', newErrors)
    console.log('¿Formulario válido?', Object.keys(newErrors).length === 0)
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    
    if (!validateForm()) {
      // Mostrar los primeros 3 errores
      const errorMessages = Object.values(errors).slice(0, 3).join('. ')
      setMsg(`Por favor corrige los siguientes errores: ${errorMessages}`)
      // Hacer scroll hacia arriba para ver el mensaje
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)
    setMsg('')
    
    console.log('Iniciando registro con datos:', {
      username: form.username,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name
    })
    
    try {
      const newId = Date.now()
      
      // Crear datos del doctor con la estructura esperada por el sistema
      const doctorData = {
        id: newId,
        username: form.username.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        full_name: `${form.first_name} ${form.last_name}`.trim(),
        specialty: form.specialty,
        specialtyId: null, // Se asignará cuando admin apruebe
        province: form.province,
        city: form.city,
        cityId: null, // Se asignará cuando admin apruebe
        phone: `+593 ${form.phone}`,
        whatsapp: `+593 ${form.phone}`,
        email: form.email.trim(),
        insurances: form.insurances,
        status: 'pending',
        role: 'doctor',
        rating: 0,
        reviews_count: 0,
        avatar: null,
        photoUrl: '',
        about: '',
        price: null,
        marketing_opt_in: form.marketing_opt_in,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile_completed: false
      }
      
      // Verificar datos existentes
      const doctors = JSON.parse(localStorage.getItem('mysimo_doctors') || '[]')
      const users = JSON.parse(localStorage.getItem('mysimo_users') || '[]')
      
      // Verificar si el username ya existe
      if (doctors.some(d => d.username === doctorData.username) || users.some(u => u.username === doctorData.username)) {
        setMsg('El nombre de usuario ya existe')
        setLoading(false)
        return
      }
      
      // Verificar si el email ya existe
      if (doctors.some(d => d.email === doctorData.email) || users.some(u => u.email === doctorData.email)) {
        setMsg('El correo electrónico ya está registrado')
        setLoading(false)
        return
      }
      
      // Agregar el nuevo doctor
      doctors.push(doctorData)
      localStorage.setItem('mysimo_doctors', JSON.stringify(doctors))
      
      // Crear usuario para login con la misma estructura
      const newUser = {
        id: newId,
        username: doctorData.username,
        name: doctorData.full_name,
        email: doctorData.email,
        password: form.password, // En producción esto debe estar hasheado
        role: 'doctor',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorData.full_name)}&background=10b981&color=fff`,
        created_at: doctorData.created_at,
        updated_at: doctorData.updated_at
      }
      users.push(newUser)
      localStorage.setItem('mysimo_users', JSON.stringify(users))
      
      console.log('Usuario registrado exitosamente:', newUser)
      console.log('Total de doctores:', doctors.length)
      console.log('Total de usuarios:', users.length)
      
      // Hacer login automático
      const token = `mock_token_${newId}_${Date.now()}`
      setAuth({ user: newUser, token })
      
      console.log('Login automático completado, redirigiendo al dashboard...')
      
      // Redirigir al panel de doctor para completar el perfil
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 500)
      
    } catch (error) {
      console.error('Error en el registro:', error)
      setMsg('Error al registrar. Por favor intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }
  
  function toggleInsurance(insurance) {
    setForm(prev => ({
      ...prev,
      insurances: prev.insurances.includes(insurance)
        ? prev.insurances.filter(i => i !== insurance)
        : [...prev.insurances, insurance]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="container py-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Regresar
        </button>
      </div>

      <div className="container py-10">
      <section className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
        {/* Columna izquierda: formulario */}
        <form onSubmit={submit} className="space-y-5 max-w-lg">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            Registro profesional
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Crea tu cuenta de <span className="text-[var(--primary)]">especialista</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-3">
            <input
              placeholder="Nombre(s)*"
              className={`border rounded-lg px-3 py-2 ${errors.first_name ? 'border-red-500' : ''}`}
              value={form.first_name}
              onChange={e => update('first_name', e.target.value)}
              required
            />
            {errors.first_name && <p className="text-xs text-red-500">{errors.first_name}</p>}
            <input
              placeholder="Apellidos*"
              className={`border rounded-lg px-3 py-2 ${errors.last_name ? 'border-red-500' : ''}`}
              value={form.last_name}
              onChange={e => update('last_name', e.target.value)}
              required
            />
            {errors.last_name && <p className="text-xs text-red-500">{errors.last_name}</p>}
            
            <input
              placeholder="Nombre de usuario*"
              className={`border rounded-lg px-3 py-2 md:col-span-2 ${errors.username ? 'border-red-500' : ''}`}
              value={form.username}
              onChange={e => update('username', e.target.value)}
              required
            />
            {errors.username && <p className="text-xs text-red-500 md:col-span-2">{errors.username}</p>}
            
            <select
              className={`border rounded-lg px-3 py-2 md:col-span-2 ${errors.specialty ? 'border-red-500' : ''}`}
              value={form.specialty}
              onChange={e => update('specialty', e.target.value)}
              required
            >
              <option value="">Selecciona una especialidad*</option>
              {specialties.map(specialty => (
                <option key={specialty.id} value={specialty.name}>
                  {specialty.name}
                </option>
              ))}
            </select>
            {errors.specialty && <p className="text-xs text-red-500 md:col-span-2">{errors.specialty}</p>}
            
            {/* Provincia */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Provincia*</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {ecuadorProvinces.map(province => (
                  <label key={province.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.province === province.name}
                      onChange={() => {
                        update('province', form.province === province.name ? '' : province.name)
                        update('city', '')
                      }}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{province.name}</span>
                  </label>
                ))}
              </div>
              {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
            </div>
            
            {/* Ciudad */}
            {form.province && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Ciudad*</label>
                <select
                  className={`border rounded-lg px-3 py-2 w-full ${errors.city ? 'border-red-500' : ''}`}
                  value={form.city}
                  onChange={e => update('city', e.target.value)}
                  required
                >
                  <option value="">Selecciona una ciudad</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
            )}

            <div className="grid grid-cols-[100px_1fr] gap-2 md:col-span-2">
              <input
                value="+593"
                disabled
                className="border rounded-lg px-3 py-2 text-center bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <input
                placeholder="Número de teléfono móvil*"
                className="border rounded-lg px-3 py-2"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                required
              />
            </div>
            <p className="mt-1 text-xs text-[var(--text-light)] md:col-span-2">
              Solo para configurar tu cuenta. No se mostrará en tu perfil.
            </p>

            <input
              type="email"
              placeholder="Correo electrónico*"
              className={`border rounded-lg px-3 py-2 md:col-span-2 ${errors.email ? 'border-red-500' : ''}`}
              value={form.email}
              onChange={e => update('email', e.target.value)}
              required
            />
            {errors.email && <p className="text-xs text-red-500 md:col-span-2">{errors.email}</p>}

            <input
              type="password"
              placeholder="Contraseña*"
              className={`border rounded-lg px-3 py-2 ${errors.password ? 'border-red-500' : ''}`}
              value={form.password}
              onChange={e => update('password', e.target.value)}
              required
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            <input
              type="password"
              placeholder="Confirmar contraseña*"
              className={`border rounded-lg px-3 py-2 ${errors.confirm_password ? 'border-red-500' : ''}`}
              value={form.confirm_password}
              onChange={e => update('confirm_password', e.target.value)}
              required
            />
            {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password}</p>}
          </div>

          {/* Seguros médicos */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Seguros donde trabaja*</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
              {ecuadorInsurances.map(insurance => (
                <label key={insurance} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.insurances.includes(insurance)}
                    onChange={() => toggleInsurance(insurance)}
                    className="h-4 w-4"
                  />
                  <span className="text-xs">{insurance}</span>
                </label>
              ))}
            </div>
            {errors.insurances && <p className="text-xs text-red-500 mt-1">{errors.insurances}</p>}
          </div>

          {/* Captcha */}
          <div className="mt-3">
            <label className="block text-sm font-medium mb-2">Verificación*</label>
            <div 
              className={`w-full h-[78px] border-2 rounded-lg flex items-center justify-center cursor-pointer transition ${
                form.recaptcha 
                  ? 'bg-green-50 border-green-500' 
                  : errors.recaptcha 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
              onClick={() => update('recaptcha', !form.recaptcha)}
            >
              {form.recaptcha ? (
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Verificación completada</span>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">[ reCAPTCHA - Click para verificar ]</div>
              )}
            </div>
            {errors.recaptcha && <p className="text-xs text-red-500 mt-1">{errors.recaptcha}</p>}
          </div>

          {/* Checkbox de marketing */}
          <label className="mt-2 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.marketing_opt_in}
              onChange={e => update('marketing_opt_in', e.target.checked)}
            />
            <span>
              Quiero recibir estadísticas del perfil, notificaciones sobre opiniones e información sobre funcionalidades.
            </span>
          </label>

          {/* Términos */}
          <label className={`flex items-start gap-2 text-sm mt-3 ${errors.accept_terms ? 'text-red-500' : ''}`}>
            <input
              type="checkbox"
              className="mt-1"
              checked={form.accept_terms}
              onChange={e => update('accept_terms', e.target.checked)}
            />
            <span className={errors.accept_terms ? 'text-red-500' : 'text-[var(--text-light)]'}>
              Acepto los{' '}
              <a href="/terminos" className="underline">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="/privacidad" className="underline">
                política de privacidad
              </a>.
            </span>
          </label>
          {errors.accept_terms && <p className="text-xs text-red-500">{errors.accept_terms}</p>}

          {/* Botón principal */}
          <button
            disabled={loading}
            className="btn-primary w-full px-5 py-2 rounded-btn disabled:opacity-60 mt-2"
          >
            {loading ? 'Creando cuenta…' : 'Crear cuenta de especialista'}
          </button>

          {/* Mensaje */}
          {msg && (
            <div className={`mt-4 p-4 rounded-lg border ${
              msg.includes('Error') || msg.includes('ya existe') || msg.includes('ya está registrado')
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-green-50 border-green-200 text-green-800'
            }`}>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  {msg.includes('Error') || msg.includes('ya existe') || msg.includes('ya está registrado') ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  )}
                </svg>
                <div className="text-sm whitespace-pre-line flex-1">{msg}</div>
              </div>
            </div>
          )}
 



        </form>

{/* Columna derecha: OMEDSO HCE */}
<aside className="hidden md:flex justify-end relative">
  <div
    className="relative md:-mr-10 lg:-mr-16 w-full max-w-lg rounded-3xl border border-[var(--line)] bg-white shadow-xl overflow-hidden"
  >
    {/* Glows de color suaves */}
    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent)]/12 blur-2xl" />
    <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[var(--primary)]/10 blur-2xl" />

    {/* Patrón de puntos tipo vector */}
    <div className="pointer-events-none absolute right-4 top-8 grid grid-cols-3 gap-1.5 opacity-50">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/40" />
    </div>

    <div className="relative p-6 space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        OMEDSO HCE para especialistas
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
        <span className="text-[var(--primary)]">Sé médico,</span>{' '}
        <span className="text-black">no digitador.</span>
      </h2>

      <p className="text-xs md:text-sm text-[var(--text-light)]">
        Te atraemos pacientes y Omedso se encarga de lo demás:
      </p>

      {/* Funcionalidades clave con iconos SVG */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] md:text-xs">
        {/* Agenda inteligente */}
        <div className="flex items-start gap-2 rounded-xl bg-[var(--bg)]/40 hover:bg-[var(--bg)]/60 transition border border-[var(--line)] px-3 py-2">
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="16" y1="2" x2="16" y2="6" />
            </svg>
          </span>
          <div>
            <p className="font-semibold leading-tight text-[var(--text)]">Agenda inteligente</p>
            <p className="text-[var(--text-light)] leading-tight">
              Turnos, recordatorios y tipos de consulta.
            </p>
          </div>
        </div>

        {/* Facturación */}
        <div className="flex items-start gap-2 rounded-xl bg-[var(--bg)]/40 hover:bg-[var(--bg)]/60 transition border border-[var(--line)] px-3 py-2">
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
              <path d="M6 3h12a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2-3-2V5a2 2 0 0 1 2-2z" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="13" y2="13" />
            </svg>
          </span>
          <div>
            <p className="font-semibold leading-tight text-[var(--text)]">Facturación</p>
            <p className="text-[var(--text-light)] leading-tight">
              Comprobantes y cobros ordenados.
            </p>
          </div>
        </div>

        {/* Expediente clínico */}
        <div className="flex items-start gap-2 rounded-xl bg-[var(--bg)]/40 hover:bg-[var(--bg)]/60 transition border border-[var(--line)] px-3 py-2">
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
              <path d="M4 4h7l2 3h7v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="9" y1="16" x2="13" y2="16" />
            </svg>
          </span>
          <div>
            <p className="font-semibold leading-tight text-[var(--text)]">Expediente clínico</p>
            <p className="text-[var(--text-light)] leading-tight">
              Historia clínica completa y segura.
            </p>
          </div>
        </div>

        {/* Teleconsulta */}
        <div className="flex items-start gap-2 rounded-xl bg-[var(--bg)]/40 hover:bg-[var(--bg)]/60 transition border border-[var(--line)] px-3 py-2">
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
            <p className="font-semibold leading-tight text-[var(--text)]">Teleconsulta</p>
            <p className="text-[var(--text-light)] leading-tight">
              Videollamadas ligadas al expediente.
            </p>
          </div>
        </div>

        {/* Atajos inteligentes */}
        <div className="flex items-start gap-2 rounded-xl bg-[var(--bg)]/40 hover:bg-[var(--bg)]/60 transition border border-[var(--line)] px-3 py-2">
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
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </span>
          <div>
            <p className="font-semibold leading-tight text-[var(--text)]">Atajos inteligentes</p>
            <p className="text-[var(--text-light)] leading-tight">
              Plantillas, macros y menos clics.
            </p>
          </div>
        </div>

        {/* Revenue sharing */}
        <div className="flex items-start gap-2 rounded-xl bg-[var(--bg)]/40 hover:bg-[var(--bg)]/60 transition border border-[var(--line)] px-3 py-2">
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
              <rect x="4" y="5" width="16" height="14" rx="2" />
              <line x1="8" y1="9" x2="16" y2="9" />
              <path d="M10 13c0 1.1.9 2 2 2s2-.9 2-2-1-1.5-2-1.5-2-.4-2-1.5.9-2 2-2 2 .9 2 2" />
            </svg>
          </span>
          <div>
            <p className="font-semibold leading-tight text-[var(--text)]">Revenue sharing</p>
            <p className="text-[var(--text-light)] leading-tight">
              Modelo de ingresos compartidos.
            </p>
          </div>
        </div>
      </div>

      {/* Imagen del panel más abajo */}
      <div className="mt-8 overflow-hidden rounded-2xl">
        <img
          src={centroImg}
          alt="Panel Omedso HCE"
          className="w-full h-auto block"
        />
      </div>

      <p className="text-[11px] text-[var(--text-light)] mt-3">
        * Vincula tu cuenta a Omedso y gestiona toda tu práctica desde un solo lugar.
      </p>
    </div>
  </div>
</aside>


      </section>
    </div>
    </div>
  )
}