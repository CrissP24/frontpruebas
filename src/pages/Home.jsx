import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  FaHospital,
  FaVideo,
  FaSearch,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaHeart,
  FaStar,
  FaBrain,
  FaUser,
  FaHeartbeat,
  FaLinkedinIn,
  FaLink,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { HiOutlineSparkles } from 'react-icons/hi2'
import { IoChevronBack, IoChevronForward, IoChevronDown } from 'react-icons/io5'

import { api } from '../lib/api'
import { ecuadorProvinces, medicalSpecialties } from '../data/ecuadorData.js'
import { useAuth } from '../hooks/useAuth'
import logoNav from '../recursos/logo_bar_nav.png'
import logoFooter from '../recursos/logofooter.png'
import bgDoct from '../recursos/bg_doct.png'

/* ==== ALIAS DE ICONOS (react-icons reales) ==== */
const ClinicIcon = ({ className = '' }) => <FaHospital className={className} />
const OnlineIcon = ({ className = '' }) => <FaVideo className={className} />
const SearchIconBar = ({ className = '' }) => <FaSearch className={className} />
const LocationIcon = ({ className = '' }) => <FaMapMarkerAlt className={className} />
const WhatsAppIcon = ({ className = '' }) => <FaWhatsapp className={className} />
const HeartIcon = ({ className = '' }) => <FaHeart className={className} />
const StarIcon = ({ className = '' }) => <FaStar className={className} />
const ActivityIcon = ({ className = '' }) => <FaHeartbeat className={className} />
const BrainIcon = ({ className = '' }) => <FaBrain className={className} />
const SparklesIcon = ({ className = '' }) => <HiOutlineSparkles className={className} />
const ChevronDownIcon = ({ className = '' }) => <IoChevronDown className={className} />
const ChevronLeftIcon = ({ className = '' }) => <IoChevronBack className={className} />
const ChevronRightIcon = ({ className = '' }) => <IoChevronForward className={className} />
const UserIcon = ({ className = '' }) => <FaUser className={className} />
const LinkIcon = ({ className = '' }) => <FaLink className={className} />

/* ==== COMPONENTES EMBEBIDOS ==== */

const API_BASE = (import.meta.env.VITE_API_URL || 'https://mysimobackend.onrender.com/api').replace(/\/api$/, '')

function AuthModal({ onClose }) {
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
          <img src={logoNav} alt="Omedso" className="h-8 w-auto mx-auto mb-4" />
          <p className="text-sm text-slate-500">Elige cómo quieres continuar</p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={`${API_BASE}/auth/google`}
            className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </a>

          <a
            href={`${API_BASE}/auth/facebook`}
            className="flex items-center justify-center gap-3 rounded-xl bg-[#1877F2] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#166fe5] hover:shadow-md"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continuar con Facebook
          </a>
        </div>

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

function DoctorCard({ doctor, horizontal = false }) {
  const photo = doctor.photoUrl || doctor.avatar
  const fullName = doctor.fullName || doctor.full_name || doctor.name || 'Doctor'
  const specialty = doctor.specialty?.name || doctor.specialty || 'Especialidad'
  const city = doctor.city?.name || doctor.city || ''
  const rating = doctor.rating ? Number(doctor.rating).toFixed(1) : '5.0'
  const initials = fullName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const ratingNum = parseFloat(rating)
  const fullStars = Math.floor(ratingNum)

  const avatarColors = ['#c0392b','#2980b9','#16a085','#8e44ad','#d35400','#27ae60']
  const avatarBg = avatarColors[fullName.charCodeAt(0) % avatarColors.length]

  const Avatar = () => (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-xl"
      style={{ width: 72, height: 72, background: avatarBg }}
    >
      {photo ? (
        <img
          src={photo.startsWith('http') ? photo : `${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}${photo}`}
          alt={fullName}
          className="h-full w-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
        />
      ) : null}
      <div
        className="absolute inset-0 items-center justify-center"
        style={{ display: photo ? 'none' : 'flex' }}
      >
        <span className="text-2xl font-bold text-white tracking-tight">{initials}</span>
      </div>
    </div>
  )

  if (horizontal) {
    return (
      <article className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-slate-300 hover:shadow-md">
        <Avatar />
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 truncate">{fullName}</h3>
          <p className="mt-0.5 text-[13px] text-slate-500 truncate">{specialty}{city ? ` · ${city}` : ''}</p>
        </div>
      </article>
    )
  }

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-[#140172]/25 hover:shadow-[0_8px_32px_-8px_rgba(20,1,114,0.14)]">

      {/* Bloque superior: texto izq · foto der */}
      <div className="flex items-start gap-4 p-5 pb-4">
        <div className="flex-1 min-w-0">
          {/* Nombre + estrella única en la misma línea */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold tracking-tight text-slate-900 leading-tight">{fullName}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
              <StarIcon className="h-3 w-3 text-amber-400" />
              {rating}
            </span>
          </div>

          {/* Especialidad · Ciudad */}
          <p className="mt-1 text-[13px] text-slate-500 leading-5">
            {specialty}{city ? <span className="text-slate-400"> · {city}</span> : null}
          </p>

          {/* Seguros — inline separados por puntito azul pastel */}
          {doctor.insurances?.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <svg className="h-3 w-3 flex-shrink-0 text-[#7b9fd4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
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

        {/* Foto a la derecha */}
        <Avatar />
      </div>

      {/* Separador */}
      <div className="mx-5 h-px bg-slate-100" />

      {/* Fila inferior: badges izq · botón der */}
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

export default function Home() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // --- ESTADOS: Buscador ---
  const [visitType, setVisitType] = useState(searchParams.get('visitType') || 'presencial')
  const [insurance, setInsurance] = useState(searchParams.get('insurance') || 'no')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [specialties, setSpecialties] = useState([])
  const searchInputRef = useRef(null)

  // --- ESTADOS: Doctores Destacados ---
  const [featuredItems, setFeaturedItems] = useState([])
  const featuredScroller = useRef(null)

  // --- ESTADO: Blog Dr. Said Cañarte ---
  const [activeBlogCategory, setActiveBlogCategory] = useState('Todos')
  const blogScroller = useRef(null)

  const footerRef = useRef(null)
  const [navHidden, setNavHidden] = useState(false)

  const year = new Date().getFullYear()

  // --- EFECTOS ---
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
    const loadSpecialties = async () => {
      try {
        const res = await api.get('/specialties')
        setSpecialties(res.data || [])
      } catch (error) {
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
      const province = ecuadorProvinces.find(p => 
        p.cities.includes(urlCity) || p.name === urlCity
      )
      if (province) setSelectedProvince(province.name)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchQuery.length > 1 && specialties.length > 0) {
      const normalizedQuery = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const suggestions = specialties
        .filter(specialty => 
          specialty.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalizedQuery)
        )
        .slice(0, 8)
        .map(s => s.name)
      setFilteredSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [searchQuery, specialties])

  useEffect(() => {
    api.get('/doctors?featured=true')
      .then(res => {
        const data = res.data
        // Adaptamos la extracción para asegurar que lea los doctores (ya sean del array directo, de featured o de doctors)
        const items = Array.isArray(data) ? data : (data.featured?.length ? data.featured : (data.doctors || data.data || []))
        // Tomamos los primeros 12 para mostrar en el carrusel
        setFeaturedItems(items.slice(0, 12))
      })
      .catch(() => setFeaturedItems([]))
  }, [])

  // --- MANEJADORES ---
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }
  const handleInputChange = (e) => setSearchQuery(e.target.value)
  const handleInputFocus = () => { if (filteredSuggestions.length > 0) setShowSuggestions(true) }
  const handleInputBlur = () => setTimeout(() => setShowSuggestions(false), 150)

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

  const scrollFeaturedDoctors = (dx) => {
    if (featuredScroller.current) featuredScroller.current.scrollBy({ left: dx, behavior: 'smooth' })
  }

  const selectedProvinceData = ecuadorProvinces.find(p => p.name === selectedProvince)
  const availableCities = selectedProvinceData?.cities || []

  const topicCards = [
    {
      icon: ActivityIcon,
      title: 'Diabetes y metabolismo',
      description: 'Encuentra endocrinólogos y especialistas para control, seguimiento y prevención.',
      href: '/buscar?q=Endocrinología',
    },
    {
      icon: HeartIcon,
      title: 'Corazón y circulación',
      description: 'Agenda con cardiólogos y revisa opciones presenciales o en línea según tu ciudad.',
      href: '/buscar?q=Cardiología',
    },
    {
      icon: BrainIcon,
      title: 'Salud mental',
      description: 'Conecta con psicólogos y psiquiatras para atención oportuna y acompañamiento profesional.',
      href: '/buscar?q=Psicología',
    },
    {
      icon: SparklesIcon,
      title: 'Piel y bienestar',
      description: 'Explora dermatología y tratamientos estéticos con perfiles claros y verificados.',
      href: '/buscar?q=Dermatología',
    },
  ]

  const blogCategories = [
    'Todos',
    'Ojos y Visión',
    'Peso y Metabolismo',
    'Huesos y Músculos',
    'Memoria y Presión Arterial',
    'Cuidado de la Piel',
    'Salud del Hombre',
  ]

  const blogArticles = [
    {
      tag: 'Ojos y Visión',
      title: 'Lo que tu mirada revela antes de los primeros olvidos',
      excerpt: 'El biomarcador visual que la ciencia recomienda monitorear después de los 60.',
      image: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/ed6c45a8-0fd1-4768-a7d1-507f52afdec3/salud-cerebral-enfoque-mental.jpg?t=1775939071',
      url: 'https://consejos.drsaidcanarte.com/p/bienestar-visual-y-neuronal',
    },
    {
      tag: 'Peso y Metabolismo',
      title: 'La ciencia detrás del metabolismo lento (y cómo activarlo)',
      excerpt: 'No es genética ni edad, es un tejido inflamado que puedes equilibrar hoy.',
      image: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/05732268-940b-4d0e-9a5b-208fd66969e3/energia-metabolismo-equilibrado.jpg?t=1775194113',
      url: 'https://consejos.drsaidcanarte.com/p/inflamacion-y-salud-cognitiva',
    },
    {
      tag: 'Memoria y Presión Arterial',
      title: '¿Tu presión arterial está asfixiando silenciosamente tu cerebro?',
      excerpt: 'No es "cosas de la edad". Son microinfartos.',
      image: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/dc25fa7d-cf7b-4510-a3e4-629b102d6f1a/aevumcast-editada__1_.png?t=1774789851',
      url: 'https://consejos.drsaidcanarte.com/p/presion-alta-demencia-vascular-memoria',
    },
    {
      tag: 'Ojos y Visión',
      title: 'La mentira de tu oftalmólogo (no es solo sobre lentes)',
      excerpt: 'La ciencia revela la conexión directa entre tu vista y la niebla mental.',
      image: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/1e647c36-9755-4377-b1e3-d728d8609d59/aevumcast-editada__1_.png?t=1774197245',
      url: 'https://consejos.drsaidcanarte.com/p/ojos-ventana-cerebro-derrame-vascular',
    },
    {
      tag: 'Salud del Hombre',
      title: 'La alarma de 3 años antes de un derrame (actúa ya)',
      excerpt: 'Lo que tu urólogo sabe, pero tu cardiólogo teme decirte.',
      image: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/70db3706-9a33-42dc-91e2-a0516f29965e/aevumcast-editada.png?t=1772914822',
      url: 'https://consejos.drsaidcanarte.com/p/alarma-infarto-disfuncion-endotelial',
    },
    {
      tag: 'Huesos y Músculos',
      title: 'El seguro contra el Alzheimer que ya tienes (y no usas)',
      excerpt: 'Lo que tu médico olvidó decirte sobre tus músculos y tu memoria.',
      image: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/c250887b-63a2-4721-8e2b-969ef48bfb36/aevumcast-editada__3_.png?t=1772379159',
      url: 'https://consejos.drsaidcanarte.com/p/musculos-recuperacion-longevidad',
    },
    {
      tag: 'Ojos y Visión',
      title: 'Tu corazón está enfermando a tus ojos (y no es broma)',
      excerpt: 'La ciencia acaba de revelar el verdadero culpable de la degeneración macular.',
      image: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/e49a9d7a-f2f3-4825-b434-68267354e5ed/aevumcast-editada__20_.png?t=1771770514',
      url: 'https://consejos.drsaidcanarte.com/p/metabolismo-y-vision-secreto',
    },
    {
      tag: 'Memoria y Presión Arterial',
      title: 'Haz esto antes de las 10 AM para "encender" tus neuronas',
      excerpt: '3 pasos para activar la neurogénesis hoy mismo.',
      image: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/73b3763c-c105-4c64-837d-c473638da36c/aevumcast-editada__14_.png?t=1771167464',
      url: 'https://consejos.drsaidcanarte.com/p/cerebro-plastico-neurogenesis',
    },
    {
      tag: 'Peso y Metabolismo',
      title: '¿Fatiga después de comer? Lee esto antes de la cena',
      excerpt: 'No es la vejez, es la inflamación. Te enseño a apagarla.',
      image: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/1d4f0e39-3bae-4978-ac0c-d1d18a3a0bbf/aevumcast-editada__9_.png?t=1770558230',
      url: 'https://consejos.drsaidcanarte.com/p/verdad-metabolismo-edad',
    },
    {
      tag: 'Memoria y Presión Arterial',
      title: '¿Se te olvidan los nombres o es tu metabolismo?',
      excerpt: 'No es "cosa de la edad". Es cosa de tu insulina.',
      image: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/31d218c8-2d4d-460a-8564-2f11440f15c0/aevumcast-editada__3_.png?t=1769951156',
      url: 'https://consejos.drsaidcanarte.com/p/metabolismo-vision-energia-60',
    },
  ]

  const filteredBlogArticles =
    activeBlogCategory === 'Todos'
      ? blogArticles
      : blogArticles.filter((a) => a.tag === activeBlogCategory)

  const scrollBlog = (dx) => {
    if (blogScroller.current) blogScroller.current.scrollBy({ left: dx, behavior: 'smooth' })
  }

  const testimonials = [
    {
      quote: 'Reservé con mi cardiólogo en menos de tres minutos. La confirmación llegó al instante y no tuve que hacer ni una llamada.',
      name: 'Thais D.',
      date: '12 marzo 2026',
    },
    {
      quote: 'Pude comparar especialistas, revisar horarios y agendar en el mismo lugar. Me ahorré toda una tarde de trámites.',
      name: 'Daniel G.',
      date: '27 mayo 2026',
    },
    {
      quote: 'Encontré una dermatóloga en Quito que aceptaba mi seguro. Todo quedó claro desde el primer clic.',
      name: 'Pierina M.',
      date: '8 septiembre 2026',
    },
  ]

  const faqItems = [
    {
      question: '¿Cómo agendo una cita con un especialista?',
      answer:
        'Busca por especialidad o ciudad, elige el horario y confirma. La reserva llega a tu correo al instante — sin llamadas ni intermediarios.',
    },
    {
      question: '¿Tiene algún costo buscar y reservar citas?',
      answer:
        'No. Buscar, comparar perfiles y reservar es gratuito para pacientes. Solo pagas la consulta directamente al especialista.',
    },
    {
      question: '¿Puedo reprogramar o cancelar una cita?',
      answer:
        'Sí. Desde tu cuenta puedes reprogramar o cancelar en cualquier momento. Recomendamos hacerlo con al menos 24 horas de anticipación.',
    },
    {
      question: '¿Los profesionales están certificados?',
      answer:
        'Verificamos títulos universitarios y registros del Ministerio de Salud (ACESS) antes de publicar cada perfil. Solo aparecen profesionales que cumplen todos los requisitos.',
    },
    {
      question: '¿Cómo funcionan las videoconsultas?',
      answer:
        'Filtra por atención virtual, reserva y recibirás un enlace privado para conectarte. Solo necesitas internet y cámara — sin apps adicionales.',
    },
    {
      question: '¿Qué es el acompañamiento Omedso?',
      answer:
        'Seguimiento por WhatsApp entre consultas: recordatorios de medicación, dudas rápidas y derivación al especialista cuando lo necesitas.',
    },
  ]

  return (
    <>
      {/* Navbar Embebido */}
      <Navbar hidden={navHidden} />

      {/* Fondo degradado exclusivo del Home con toques lila y agua */}
      <section className="relative bg-gradient-to-br from-[#140172]/10 via-violet-100/60 to-teal-50/80 overflow-hidden">
        <div className="container py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Columna de texto */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] leading-tight">
                <span className="block whitespace-nowrap">El especialista que necesitas,</span>
                <span className="block">listo para recibirte.</span>
              </h1>
              <p className="mt-4 text-[var(--text-light)] max-w-2xl">
                Busca por especialidad o ciudad y reserva en minutos con confirmación inmediata. Sin llamadas, sin intermediarios.
              </p>
            </div>

            <div className="md:col-span-2 mt-10 md:mt-12">
              {/* Barra de Búsqueda Embebida */}
              <div className="w-full bg-white/80 backdrop-blur border border-[var(--line)] rounded-2xl shadow-card px-3 py-3 md:px-5 md:py-4 md:max-w-5xl mx-auto md:mx-0">
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
                        <input
                          type="radio"
                          name="insurance"
                          value="si"
                          checked={insurance === 'si'}
                          onChange={() => setInsurance('si')}
                          className="h-4 w-4 text-[var(--primary)] border-[var(--line)]"
                        />
                        <span>Sí</span>
                      </label>
                      <label className="inline-flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="insurance"
                          value="no"
                          checked={insurance === 'no'}
                          onChange={() => setInsurance('no')}
                          className="h-4 w-4 text-[var(--primary)] border-[var(--line)]"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4">
                    <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-[var(--line)] px-3 py-2 relative">
                      <SearchIconBar className="w-4 h-4 text-[var(--text-light)]" />
                      <input
                        ref={searchInputRef}
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
                        onChange={e => { setSelectedProvince(e.target.value); setSelectedCity(''); }}
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
            </div>
          </div>
        </div>

        {/* Imagen del equipo médico superpuesta, alineada a la derecha y más grande */}
        <div className="absolute bottom-0 right-0 hidden md:flex justify-end pointer-events-none">
          <img
            src={bgDoct}
            alt="Equipo médico profesional con tablet"
            className="
              object-contain
              h-[300px]
              md:h-[380px]
              lg:h-[460px]
              xl:h-[520px]
              max-w-none
              opacity-95
              drop-shadow-2xl
              translate-x-4
              translate-y-2
            "
          />
        </div>
      </section>

      {/* 1. Métricas de confianza — minimalista */}
      <div id="confianza" className="border-y border-slate-200 bg-white scroll-mt-16">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="group flex items-center justify-center gap-4 py-6 md:py-7 transition-colors duration-200 hover:bg-slate-50/70">
              <p className="text-3xl font-semibold tracking-tight text-[#140172] transition-transform duration-200 group-hover:scale-110">4.9</p>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 group-hover:text-[#140172] transition-colors duration-200">Valoración promedio</p>
                <p className="text-xs text-slate-500">Reseñas verificadas de pacientes</p>
              </div>
            </div>

            <div className="group flex items-center justify-center gap-4 py-6 md:py-7 transition-colors duration-200 hover:bg-slate-50/70">
              <p className="text-3xl font-semibold tracking-tight text-[#140172] transition-transform duration-200 group-hover:scale-110">+1.5M</p>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 group-hover:text-[#140172] transition-colors duration-200">Alcance mensual</p>
                <p className="text-xs text-slate-500">Redes sociales y aliados estratégicos</p>
              </div>
            </div>
            
            <div className="group flex items-center justify-center gap-4 py-6 md:py-7 transition-colors duration-200 hover:bg-slate-50/70">
              <p className="text-3xl font-semibold tracking-tight text-[#140172] transition-transform duration-200 group-hover:scale-110">+40</p>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 group-hover:text-[#140172] transition-colors duration-200">Especialidades médicas</p>
                <p className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors duration-200">Desde cardiología hasta dermatología</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lo que otros están viendo */}
      <section id="buscando" className="relative overflow-hidden border-b border-slate-200 py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 50%, #f0fdf4 100%)' }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#140172]/25 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#140172]/10 to-transparent" />
        <div className="container max-w-6xl relative">
          <div className="text-center mb-14">
            <h2 className="text-[1.45rem] md:whitespace-nowrap md:text-[1.6rem] font-bold leading-[1.2] md:leading-[1.1] tracking-tight text-slate-950 lg:text-[2.25rem]">
              Lo que otros están <span className="relative inline-block font-extrabold text-[#140172]">buscando hoy<span aria-hidden="true" className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-[#140172]/30"></span></span>
            </h2>
            <p className="mt-5 text-[17px] leading-8 text-slate-600 max-w-xl mx-auto">
              Los <span className="font-semibold text-slate-900">síntomas más buscados</span> por pacientes como tú esta semana.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Dolor de espalda',
                desc: 'Una de las consultas más frecuentes. Descubre cuándo es urgente y qué especialista te ayuda.',
                href: '/buscar?q=Traumatología',
              },
              {
                title: 'Dolor de cabeza y migrañas',
                desc: 'Si los dolores son frecuentes o intensos, no son normales. Conoce las causas y tratamientos.',
                href: '/buscar?q=Neurología',
              },
              {
                title: 'Ansiedad y estrés',
                desc: 'Taquicardia, insomnio, pensamientos que no paran. Hablar con un profesional hace la diferencia.',
                href: '/buscar?q=Psicología',
              },
              {
                title: 'Acidez y gastritis',
                desc: 'Ese ardor después de comer tiene solución. Identifica los síntomas y cuándo buscar ayuda.',
                href: '/buscar?q=Gastroenterología',
              },
              {
                title: 'Problemas de sueño',
                desc: 'Dormir mal afecta todo: tu ánimo, tu peso, tu corazón. Recupera tus noches con el especialista adecuado.',
                href: '/buscar?q=Neurología',
              },
              {
                title: 'Acné y manchas en la piel',
                desc: 'No todo lo que ves en el espejo es permanente. Los dermatólogos tienen respuestas efectivas.',
                href: '/buscar?q=Dermatología',
              },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#140172]/30 hover:shadow-[0_8px_30px_-8px_rgba(20,1,114,0.15)]"
              >
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#140172] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-slate-500 flex-1">{item.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#140172]">
                  Ver especialistas
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Contenido principal — minimalista elegante */}
      <div id="articulos" className="bg-white">
        <section className="relative overflow-hidden py-20 md:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#140172]/20 to-transparent"
          />
          <div aria-hidden="true" className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-[#140172]/5 blur-3xl" />
          <div className="mx-auto max-w-6xl px-5 sm:px-6 relative">
            <div className="text-center">
              <h2 className="text-[1.45rem] md:whitespace-nowrap md:text-[1.6rem] font-bold leading-[1.2] tracking-tight text-slate-950 lg:text-[2.25rem]">
                Salud con <span className="relative inline-block font-extrabold text-[#140172]">evidencia<span aria-hidden="true" className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-[#140172]/30"></span></span>, sin rodeos
              </h2>
              <p className="mt-5 text-[17px] leading-8 text-slate-600 max-w-xl mx-auto">
                Del <span className="font-semibold text-slate-900">Dr. Said Cañarte</span>, para llegar informado y a tu consulta.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div
                role="tablist"
                aria-label="Categorías del blog"
                className="flex flex-wrap justify-center gap-2 sm:justify-start"
              >
                {blogCategories.map((cat) => {
                  const isActive = activeBlogCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveBlogCategory(cat)}
                      className={
                        'rounded-full border px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ' +
                        (isActive
                          ? 'border-[#140172] bg-[#140172] text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900')
                      }
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>

              {filteredBlogArticles.length > 2 && (
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollBlog(-340)}
                    aria-label="Anterior"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#140172] hover:text-[#140172]"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollBlog(340)}
                    aria-label="Siguiente"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#140172] hover:text-[#140172]"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative mt-8">
              <div
                ref={blogScroller}
                className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 -mx-5 px-5 sm:-mx-0 sm:px-0"
              >
                {filteredBlogArticles.map((article) => (
                  <article
                    key={article.url}
                    className="group flex w-[300px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_40px_-16px_rgba(20,1,114,0.25)] md:w-[326px]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="inline-flex w-fit items-center rounded-full bg-[#140172]/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#140172]">
                        {article.tag}
                      </span>
                      <h3 className="mt-4 text-[17px] font-semibold leading-snug tracking-tight text-slate-900">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {article.excerpt}
                      </p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#140172] transition-all group-hover:gap-2.5"
                      >
                        Leer consejo
                        <ChevronRightIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </article>
                ))}

                <div className="flex w-[300px] flex-shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center md:w-[326px]">
                  <p className="text-sm font-semibold tracking-tight text-slate-900">
                    Más del partner
                  </p>
                  <p className="text-xs leading-5 text-slate-500">
                    Explora el repositorio completo de consejos del Dr. Said Cañarte.
                  </p>
                  <a
                    href="https://consejos.drsaidcanarte.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                  >
                    Ver más
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Flechas navegación móvil */}
              {filteredBlogArticles.length > 1 && (
                <div className="flex sm:hidden items-center justify-center gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => scrollBlog(-300)}
                    aria-label="Anterior"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#140172] hover:text-[#140172]"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollBlog(300)}
                    aria-label="Siguiente"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#140172] hover:text-[#140172]"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Omedso — Acompañamiento entre consultas, en equipo con la plataforma */}
 

        <section className="relative overflow-hidden border-t border-slate-200 bg-[#fafbfc] py-20 md:py-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(#140172 1px, transparent 1px), linear-gradient(90deg, #140172 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
            aria-hidden="true"
          />
          <div aria-hidden="true" className="pointer-events-none absolute top-10 right-10 h-60 w-60 rounded-full bg-amber-200/30 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-10 left-10 h-60 w-60 rounded-full bg-[#140172]/10 blur-3xl" />
          <div className="container max-w-6xl relative">
            <div className="text-center">
              <h2 className="text-[1.45rem] md:whitespace-nowrap md:text-[1.6rem] font-bold leading-[1.2] md:leading-[1.1] tracking-tight text-slate-950 lg:text-[2.25rem]">
                Lo que dicen nuestros <span className="relative inline-block font-extrabold text-[#140172]">pacientes<span aria-hidden="true" className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-[#140172]/30"></span></span>
              </h2>
              <p className="mt-5 text-[17px] leading-8 text-slate-600 max-w-xl mx-auto">
                <span className="font-semibold text-slate-900">Más de 1.5M</span> de personas nos eligen cada mes en Ecuador.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <article
                  key={item.name}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-8px_rgba(20,1,114,0.12)]"
                >
                  <div className="flex gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIcon key={i} className="h-4 w-4" />
                    ))}
                  </div>

                  <p className="mt-5 flex-1 text-base leading-7 text-slate-700">
                    "{item.quote}"
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.date}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {featuredItems.length > 0 && (
          <section className="relative overflow-hidden border-t border-slate-200 bg-white py-20 md:py-28">
            <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-[#140172]/5 blur-3xl" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#140172]/20 to-transparent"
            />
            <div className="container max-w-6xl relative">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-[1.45rem] md:whitespace-nowrap md:text-[1.6rem] font-bold leading-[1.2] md:leading-[1.1] tracking-tight text-slate-950 lg:text-[2.25rem]">
                  Encuentra tu <span className="relative inline-block font-extrabold text-[#140172]">especialista ideal<span aria-hidden="true" className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-[#140172]/30"></span></span>
                </h2>
                <p className="mt-5 text-[17px] leading-8 text-slate-600 max-w-xl mx-auto">
                  <span className="font-semibold text-slate-900">Perfiles verificados</span> y agenda abierta para reservar en segundos.
                </p>
              </div>

              <div className="relative mt-14">
                <button
                  onClick={() => scrollFeaturedDoctors(-400)}
                  className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 -translate-x-2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.12)] transition hover:border-[#140172] hover:text-[#140172] hover:shadow-[0_8px_24px_-4px_rgba(20,1,114,0.2)] md:flex lg:-translate-x-6"
                  aria-label="Ver especialistas anteriores"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollFeaturedDoctors(400)}
                  className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.12)] transition hover:border-[#140172] hover:text-[#140172] hover:shadow-[0_8px_24px_-4px_rgba(20,1,114,0.2)] md:flex lg:translate-x-6"
                  aria-label="Ver siguientes especialistas"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>

                {/* Mobile: 3 tarjetas apiladas */}
                <div className="flex flex-col gap-4 md:hidden">
                  {featuredItems.slice(0, 3).map((d) => (
                    <div key={d.id} className="w-full">
                      <DoctorCard doctor={d} horizontal={false} />
                    </div>
                  ))}
                </div>
                {/* Desktop: carrusel */}
                <div
                  ref={featuredScroller}
                  className="hidden md:flex gap-5 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {featuredItems.map((d) => (
                    <div key={d.id} className="w-[calc(50%-10px)] shrink-0 snap-start lg:w-[calc(33.333%-14px)]">
                      <DoctorCard doctor={d} horizontal={false} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <Link
                  to="/buscar"
                  className="group inline-flex items-center gap-3 rounded-full border border-[#140172]/30 bg-white px-7 py-3 text-sm font-semibold text-[#140172] shadow-[0_2px_8px_-4px_rgba(20,1,114,0.12)] transition-all hover:border-[#140172]/50 hover:bg-[#140172]/5 hover:shadow-[0_4px_16px_-4px_rgba(20,1,114,0.18)]"
                >
                  Ver todos los especialistas
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#140172]/10 transition-all group-hover:bg-white/20">
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="relative overflow-hidden border-t border-slate-200 bg-[#fafbfc] pt-20 pb-10 md:pt-24 md:pb-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(#140172 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
            aria-hidden="true"
          />
          <div aria-hidden="true" className="pointer-events-none absolute top-1/4 -left-24 h-72 w-72 rounded-full bg-[#140172]/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-1/4 -right-24 h-72 w-72 rounded-full bg-[#0D7D2E]/10 blur-3xl" />
          <div className="container max-w-3xl px-4 md:px-6 relative">
            <div className="text-center">
              <h2 className="text-[1.45rem] md:whitespace-nowrap md:text-[1.6rem] font-bold leading-[1.2] tracking-tight text-slate-950 md:leading-[1.1] lg:text-[2.25rem]">
                Resolvemos todas tus <span className="relative inline-block font-extrabold text-[#140172]">preguntas<span aria-hidden="true" className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-[#140172]/30"></span></span>
              </h2>
              <p className="mt-4 text-[15px] md:text-[17px] leading-7 md:leading-8 text-slate-600 max-w-xl mx-auto">
                <span className="font-semibold text-slate-900">Respuestas directas</span> para que uses la plataforma con confianza.
              </p>
            </div>

            <div className="mt-8 md:mt-12 flex flex-col gap-2 md:gap-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  name="faq"
                  className="group rounded-xl md:rounded-2xl border border-slate-200 bg-white px-4 md:px-6 transition-all hover:border-slate-300 open:border-[#140172]/30 open:shadow-[0_8px_30px_-8px_rgba(20,1,114,0.12)] [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 py-4 md:py-5 text-left text-sm md:text-base font-semibold text-slate-900 outline-none transition-colors leading-snug">
                    {item.question}
                    <span className="flex h-7 w-7 md:h-8 md:w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-180 group-open:bg-[#140172] group-open:text-white">
                      <ChevronDownIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    </span>
                  </summary>

                  <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-in-out group-open:grid-rows-[1fr] group-open:pb-5 group-open:opacity-100">
                    <div className="overflow-hidden">
                      <p className="text-[13px] md:text-[15px] leading-6 md:leading-7 text-slate-600">{item.answer}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <footer ref={footerRef} className="bg-white border-t border-slate-200 pt-8 md:pt-10 pb-6">
          <div className="mx-auto max-w-7xl px-5 md:px-16">
            {/* Fila 1 — Síguenos */}
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

            {/* Fila 2 — Logo + links (mobile: apilado, desktop: fila) */}
            <div className="py-5 text-[13px] text-slate-500">
              {/* Mobile layout */}
              <div className="flex flex-col gap-4 md:hidden">
                <a href="https://omedso.com" target="_blank" rel="noreferrer">
                  <img src={logoFooter} alt="Omedso" className="h-6 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                </a>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
                  <a href="https://pro.omedso.com" target="_blank" rel="noreferrer"
                    className="hover:text-[#140172] transition-colors">¿Eres especialista?</a>
                  <Link to="/buscar" className="hover:text-[#140172] transition-colors">Nuestros médicos</Link>
                  <button type="button"
                    onClick={() => document.getElementById('confianza')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-[#140172] transition-colors">Sobre nosotros</button>
                </div>
                <div className="flex gap-x-5 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                  <Link to="/privacidad" className="hover:text-[#140172] transition-colors">Privacidad</Link>
                  <Link to="/terminos" className="hover:text-[#140172] transition-colors">Términos</Link>
                </div>
              </div>
              {/* Desktop layout */}
              <div className="hidden md:flex items-center flex-wrap gap-x-8 gap-y-3">
                <a href="https://omedso.com" target="_blank" rel="noreferrer" className="flex-shrink-0 mr-2">
                  <img src={logoFooter} alt="Omedso" className="h-7 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                </a>
                <a href="https://pro.omedso.com" target="_blank" rel="noreferrer"
                  className="hover:text-[#140172] hover:underline transition-colors">¿Eres especialista?</a>
                <Link to="/buscar" className="hover:text-[#140172] hover:underline transition-colors">Nuestros médicos</Link>
                <button type="button"
                  onClick={() => document.getElementById('confianza')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-[#140172] hover:underline transition-colors">Sobre nosotros</button>
                <span className="ml-auto flex items-center gap-x-8">
                  <Link to="/privacidad" className="hover:text-[#140172] hover:underline transition-colors">Privacidad</Link>
                  <Link to="/terminos" className="hover:text-[#140172] hover:underline transition-colors">Términos</Link>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}