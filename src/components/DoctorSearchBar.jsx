import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ecuadorProvinces, medicalSpecialties } from '../data/ecuadorData.js'
import { api } from '../lib/api'

function ClinicIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20v-9.5L12 4l8 6.5V20" />
      <path d="M9 20v-5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5" />
      <path d="M12 9v4" />
      <path d="M10 11h4" />
    </svg>
  )
}

function OnlineIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M10 20h4" />
      <path d="M12 16v4" />
      <path d="M15.5 9.5 18 8v5l-2.5-1.5" />
    </svg>
  )
}

function SearchIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="6" />
      <line x1="16" y1="16" x2="20" y2="20" />
    </svg>
  )
}

function LocationIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  )
}

export default function DoctorSearchBar({ className = '' }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Leer valores iniciales desde URL
  const [visitType, setVisitType] = useState(searchParams.get('visitType') || 'presencial') // 'presencial' | 'en-linea'
  const [insurance, setInsurance] = useState(searchParams.get('insurance') || 'no')         // 'si' | 'no'
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')

  // Autocompletado
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [specialties, setSpecialties] = useState([])
  const inputRef = useRef(null)

  // Cargar especialidades
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const res = await api.get('/specialties')
        setSpecialties(res.data || [])
      } catch (error) {
        console.error('Error cargando especialidades:', error)
        // Fallback to static data
        setSpecialties(medicalSpecialties.map(name => ({ name })))
      }
    }
    loadSpecialties()
  }, [])

  // Actualizar valores cuando cambian los parámetros de URL
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
      // Intentar encontrar la provincia basada en la ciudad
      const province = ecuadorProvinces.find(p => 
        p.cities.includes(urlCity) || p.name === urlCity
      )
      if (province) setSelectedProvince(province.name)
    }
  }, [searchParams])

  // Filtrar sugerencias
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

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleInputFocus = () => {
    if (filteredSuggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay para permitir clic en sugerencias
    setTimeout(() => setShowSuggestions(false), 150)
  }

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
    navigate(`/doctores?${params.toString()}`)
  }

  return (
    <div
      className={
        'w-full bg-white/80 backdrop-blur border border-[var(--line)] rounded-2xl shadow-card px-3 py-3 md:px-5 md:py-4 ' +
        className
      }
    >
      <div className="flex flex-col gap-3">
        {/* Fila superior: tipo de visita + seguro médico */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Toggle Presencial / En línea */}
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <div className="inline-flex rounded-full border border-[var(--line)] p-1 bg-transparent">
              <button
                type="button"
                onClick={() => setVisitType('presencial')}
                className={
                  'flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition ' +
                  (visitType === 'presencial'
                    ? 'bg-[var(--primary)] text-white shadow'
                    : 'text-[var(--text)] hover:text-[var(--primary-400)]')
                }
              >
                <ClinicIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span>Presencial</span>
              </button>

              <button
                type="button"
                onClick={() => setVisitType('en-linea')}
                className={
                  'flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition ' +
                  (visitType === 'en-linea'
                    ? 'bg-[var(--primary)] text-white shadow'
                    : 'text-[var(--text)] hover:text-[var(--primary-400)]')
                }
              >
                <OnlineIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span>En línea</span>
              </button>
            </div>
          </div>

          {/* Seguro médico: radios clásicos Sí / No */}
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

        {/* Barra de búsqueda */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4"
        >
          {/* Campo principal */}
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-[var(--line)] px-3 py-2 relative">
            <SearchIcon className="w-4 h-4 text-[var(--text-light)]" />
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
            {/* Sugerencias */}
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

          {/* Ubicación con dropdown */}
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-[var(--line)] px-3 py-2">
            <LocationIcon className="w-4 h-4 text-[var(--text-light)]" />
            <select
              value={selectedProvince}
              onChange={e => {
                setSelectedProvince(e.target.value)
                setSelectedCity('')
              }}
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

          {/* Hidden para tipo de visita y seguro */}
          <input type="hidden" name="visitType" value={visitType} />
          <input type="hidden" name="hasInsurance" value={insurance} />

          {/* Botón buscar */}
          <button
            type="submit"
            className="btn-primary btn-icon flex items-center justify-center px-6"
          >
            <span className="hidden md:inline">Buscar</span>
            <span className="md:hidden">Ir</span>
          </button>
        </form>
      </div>
    </div>
  )
}





