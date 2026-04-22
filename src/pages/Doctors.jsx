import { useEffect, useMemo, useState, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  FaHospital,
  FaVideo,
  FaSearch,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaStar,
  FaUser,
  FaLinkedinIn,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import { api } from '../lib/api'
import { googleLoginApi } from '../services/auth'
import { ecuadorProvinces, medicalSpecialties } from '../data/ecuadorData.js'
import { useAuth } from '../hooks/useAuth'
import logoNav from '../recursos/logo_bar_nav.png'
import logoFooter from '../recursos/logofooter.png'

const ClinicIcon = ({ className = '' }) => <FaHospital className={className} />
const OnlineIcon = ({ className = '' }) => <FaVideo className={className} />
const SearchIconBar = ({ className = '' }) => <FaSearch className={className} />
const LocationIcon = ({ className = '' }) => <FaMapMarkerAlt className={className} />
const WhatsAppIcon = ({ className = '' }) => <FaWhatsapp className={className} />
const StarIcon = ({ className = '' }) => <FaStar className={className} />
const UserIcon = ({ className = '' }) => <FaUser className={className} />
const ChevronLeftIcon = ({ className = '' }) => <IoChevronBack className={className} />
const ChevronRightIcon = ({ className = '' }) => <IoChevronForward className={className} />

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

        {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}

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

function Navbar({ hidden = false }) {
  const { auth, logout } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <header className={`bg-white/90 backdrop-blur border-b sticky top-0 z-50 transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="container px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-8">
            <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
                <UserIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
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

function DoctorSearchBar({ className = '' }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [visitType, setVisitType] = useState(searchParams.get('visitType') || 'presencial')
  const [insurance, setInsurance] = useState(searchParams.get('insurance') || 'no')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [specialties, setSpecialties] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const res = await api.get('/specialties')
        setSpecialties(res.data || [])
      } catch {
        setSpecialties(medicalSpecialties.map(name => ({ name })))
      }
    }
    loadSpecialties()
  }, [])

  useEffect(() => {
    const urlVisitType = searchParams.get('visitType')
    const urlInsurance = searchParams.get('insurance')
    const urlQuery = searchParams.get('q')
    const urlCity = searchParams.get('city')

    if (urlVisitType) setVisitType(urlVisitType)
    if (urlInsurance) setInsurance(urlInsurance)
    if (urlQuery !== null) setSearchQuery(urlQuery)
    if (urlCity) {
      setSelectedCity(urlCity)
      const province = ecuadorProvinces.find(p => p.cities.includes(urlCity) || p.name === urlCity)
      if (province) setSelectedProvince(province.name)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchQuery.length > 1 && specialties.length > 0) {
      const normalizedQuery = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const suggestions = specialties
        .filter(specialty => specialty.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalizedQuery))
        .slice(0, 8)
        .map(s => s.name)
      setFilteredSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [searchQuery, specialties])

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleInputChange = (e) => setSearchQuery(e.target.value)
  const handleInputFocus = () => { if (filteredSuggestions.length > 0) setShowSuggestions(true) }
  const handleInputBlur = () => setTimeout(() => setShowSuggestions(false), 150)

  const selectedProvinceData = ecuadorProvinces.find(p => p.name === selectedProvince)
  const availableCities = selectedProvinceData?.cities || []

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCity) params.set('city', selectedCity)
    else if (selectedProvince) params.set('city', selectedProvince)
    if (visitType) params.set('visitType', visitType)
    if (insurance) params.set('insurance', insurance)
    navigate(`/buscar?${params.toString()}`)
  }

  return (
    <div className={'w-full bg-white/80 backdrop-blur border border-[var(--line)] rounded-2xl shadow-card px-3 py-3 md:px-5 md:py-4 ' + className}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <div className="inline-flex rounded-full border border-[var(--line)] p-1 bg-transparent">
              <button
                type="button"
                onClick={() => setVisitType('presencial')}
                className={'flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition ' + (visitType === 'presencial' ? 'bg-[var(--primary)] text-white shadow' : 'text-[var(--text)] hover:text-[var(--primary-400)]')}
              >
                <ClinicIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span>Presencial</span>
              </button>
              <button
                type="button"
                onClick={() => setVisitType('en-linea')}
                className={'flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition ' + (visitType === 'en-linea' ? 'bg-[var(--primary)] text-white shadow' : 'text-[var(--text)] hover:text-[var(--primary-400)]')}
              >
                <OnlineIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span>En línea</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs md:text-sm text-[var(--text-light)] w-full md:w-auto justify-center md:justify-end">
            <span>¿Tienes seguro médico privado?</span>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input type="radio" name="insurance" value="si" checked={insurance === 'si'} onChange={() => setInsurance('si')} className="h-4 w-4 text-[var(--primary)] border-[var(--line)]" />
              <span>Sí</span>
            </label>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input type="radio" name="insurance" value="no" checked={insurance === 'no'} onChange={() => setInsurance('no')} className="h-4 w-4 text-[var(--primary)] border-[var(--line)]" />
              <span>No</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-[var(--line)] px-3 py-2 relative">
            <SearchIconBar className="w-4 h-4 text-[var(--text-light)]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Nombre del médico o especialidad"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="flex-1 bg-transparent outline-none text-sm md:text-base text-[var(--text)] placeholder:text-[var(--text-light)]"
            />
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 bg-white border border-[var(--line)] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto mt-1">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm md:text-base text-[var(--text)] border-b border-gray-100 last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-[var(--line)] px-3 py-2">
            <LocationIcon className="w-4 h-4 text-[var(--text-light)]" />
            <select
              value={selectedProvince}
              onChange={e => { setSelectedProvince(e.target.value); setSelectedCity('') }}
              className="flex-1 bg-transparent outline-none text-sm md:text-base text-[var(--text)] border-none"
            >
              <option value="">Provincia</option>
              {ecuadorProvinces.map(province => (
                <option key={province.id} value={province.name}>{province.name}</option>
              ))}
            </select>
            {selectedProvince && (
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm md:text-base text-[var(--text)] border-none ml-2"
              >
                <option value="">Ciudad</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            )}
          </div>

          <button type="submit" className="btn-primary btn-icon flex items-center justify-center px-6">
            <span className="hidden md:inline">Buscar</span>
            <span className="md:hidden">Ir</span>
          </button>
        </form>
      </div>
    </div>
  )
}

function DoctorCard({ doctor }) {
  const photo = doctor.photoUrl || doctor.avatar
  const fullName = doctor.fullName || doctor.full_name || doctor.name || 'Doctor'
  const specialty = doctor.specialty?.name || doctor.specialty || 'Especialidad'
  const city = doctor.city?.name || doctor.city || ''
  const rating = doctor.rating ? Number(doctor.rating).toFixed(1) : '5.0'
  const initials = fullName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  const avatarColors = ['#c0392b','#2980b9','#16a085','#8e44ad','#d35400','#27ae60']
  const avatarBg = avatarColors[fullName.charCodeAt(0) % avatarColors.length]

  const Avatar = () => (
    <div className="relative flex-shrink-0 overflow-hidden rounded-xl" style={{ width: 72, height: 72, background: avatarBg }}>
      {photo ? (
        <img
          src={photo}
          alt={fullName}
          className="h-full w-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
        />
      ) : null}
      <div className="absolute inset-0 items-center justify-center" style={{ display: photo ? 'none' : 'flex' }}>
        <span className="text-2xl font-bold text-white tracking-tight">{initials}</span>
      </div>
    </div>
  )

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[#140172]/25 hover:shadow-[0_8px_32px_-8px_rgba(20,1,114,0.14)]">
      <div className="flex items-start gap-4 p-5 pb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold tracking-tight text-slate-900 leading-tight">{fullName}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
              <StarIcon className="h-3 w-3 text-amber-400" />
              {rating}
            </span>
          </div>
          <p className="mt-1 text-[13px] text-slate-500 leading-5">
            {specialty}{city ? <span className="text-slate-400"> · {city}</span> : null}
          </p>
          {doctor.insurances?.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <svg className="h-3 w-3 flex-shrink-0 text-[#7b9fd4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="flex items-center gap-1 flex-wrap">
                {doctor.insurances.slice(0, 3).map((ins, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="h-1 w-1 rounded-full bg-[#93b8e8] flex-shrink-0" aria-hidden="true" />}
                    <span className="text-[12px] font-medium text-[#3a6fa8]">{ins}</span>
                  </span>
                ))}
                {doctor.insurances.length > 3 && (
                  <span className="flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-[#93b8e8] flex-shrink-0" aria-hidden="true" />
                    <span className="rounded-full bg-[#eaf1fb] px-1.5 py-0.5 text-[11px] font-semibold text-[#5a82b4]">+{doctor.insurances.length - 3}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <Avatar />
      </div>

      <div className="mx-5 h-px bg-slate-100" />

      <div className="flex items-center justify-between gap-3 px-5 py-3.5">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            <ClinicIcon className="h-3 w-3 text-slate-400" />
            Presencial
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            <OnlineIcon className="h-3 w-3 text-slate-400" />
            Virtual
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Link
            to={`/profesional/${doctor.id}`}
            className="rounded-lg bg-[#140172] px-3.5 py-2 text-[12px] font-semibold text-white transition-all hover:bg-[#1a0899] hover:shadow-[0_4px_12px_-4px_rgba(20,1,114,0.35)]"
          >
            Ver perfil y agendar
          </Link>
          {doctor.whatsapp && (
            <a
              href={`https://wa.me/${doctor.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#0D7D2E]/40 hover:bg-[#0D7D2E]/5 hover:text-[#0D7D2E]"
              aria-label={`WhatsApp ${fullName}`}
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function DoctorList({ doctors }) {
  if (!doctors?.length) return <div className="text-sm text-slate-500 py-8 text-center">No hay resultados.</div>
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {doctors.map(d => <DoctorCard key={d.id} doctor={d} />)}
    </div>
  )
}

export default function Doctors() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ total: 0, data: [], results: 0, page: 1, limit: 20 })
  const q = searchParams.get('q') || ''
  const city = searchParams.get('city') || ''
  const specialty = searchParams.get('specialty') || ''
  const visitType = searchParams.get('visitType') || ''
  const insurance = searchParams.get('insurance') || ''

  const [page, setPage] = useState(1)

  const footerRef = useRef(null)
  const [navHidden, setNavHidden] = useState(false)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setNavHidden(entry.isIntersecting),
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [q, city, specialty, visitType, insurance])

  const query = useMemo(() => {
    const p = new URLSearchParams()
    const hasSearchFilters = (q && q.trim()) || (city && city.trim()) || (specialty && specialty.trim())

    if (q && q.trim()) p.set('q', q.trim())
    if (city && city.trim()) p.set('city', city.trim())
    if (specialty && specialty.trim()) p.set('specialty', specialty.trim())
    if (visitType && visitType.trim()) p.set('visitType', visitType.trim())

    if (insurance && insurance.trim() !== '') {
      if (hasSearchFilters || insurance === 'si') {
        p.set('insurance', insurance)
      }
    }

    p.set('status', 'active')
    p.set('page', String(page))
    p.set('limit', '9')
    return p.toString()
  }, [q, city, specialty, visitType, insurance, page])

  useEffect(() => {
    setLoading(true)
    api.get(`/doctors?${query}`).then(res => {
      let doctorsData = []
      let totalCount = 0
      let resultsCount = 0
      let currentPage = page
      let currentLimit = 10

      if (res.data) {
        const featured = res.data.featured || []
        const doctors = res.data.doctors || []
        doctorsData = [...featured, ...doctors]

        if (doctorsData.length === 0) {
          if (Array.isArray(res.data)) {
            doctorsData = res.data
          } else if (res.data.data && Array.isArray(res.data.data)) {
            doctorsData = res.data.data
          }
        }

        if (res.data.meta?.pagination) {
          totalCount = res.data.meta.pagination.total || 0
          resultsCount = doctorsData.length
          currentPage = res.data.meta.pagination.page || page
          currentLimit = res.data.meta.pagination.limit || 10
        } else if (res.data.total !== undefined) {
          totalCount = res.data.total || 0
          resultsCount = doctorsData.length
          currentPage = res.data.page || page
          currentLimit = res.data.limit || 10
        } else {
          totalCount = doctorsData.length
          resultsCount = doctorsData.length
        }
      }

      if (!Array.isArray(doctorsData)) doctorsData = []

      setData({
        data: doctorsData,
        total: totalCount,
        results: resultsCount,
        page: currentPage,
        limit: currentLimit,
      })
    }).catch(() => {
      setData({ total: 0, data: [], results: 0, page: 1, limit: 20 })
    }).finally(() => setLoading(false))
  }, [query, page])

  const canPrev = page > 1
  const canNext = (data.page * data.limit) < data.total

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar hidden={navHidden} />

      {/* Barra de búsqueda */}
      <section className="bg-white border-b">
        <div className="container py-8">
          <DoctorSearchBar />
        </div>
      </section>

      {/* Resultados */}
      <div className="flex-1">
        <div className="container py-8">
          {/* Encabezado con contador + paginación arriba a la derecha */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">
              Mostrando {data.results || 0} de {data.total || 0} resultados
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={!canPrev}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#140172] hover:text-[#140172] disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Página anterior"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <span className="text-sm text-slate-500 px-1">Pág. {page}</span>
              <button
                disabled={!canNext}
                onClick={() => setPage(p => p + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#140172] hover:text-[#140172] disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Página siguiente"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Cargando...</div>
          ) : (
            <DoctorList doctors={data.data} />
          )}
        </div>
      </div>

      {/* Footer idéntico al Home */}
      <footer ref={footerRef} className="bg-white border-t border-slate-200 pt-8 md:pt-10 pb-6">
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
            {/* Mobile */}
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
            {/* Desktop */}
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
    </div>
  )
}
