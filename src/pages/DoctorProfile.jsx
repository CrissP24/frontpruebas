import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  FaHospital,
  FaVideo,
  FaWhatsapp,
  FaStar,
  FaMapMarkerAlt,
  FaArrowLeft,
} from 'react-icons/fa'
import { api } from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import PublicLayout from '../components/PublicLayout'

const ClinicIcon = ({ className = '' }) => <FaHospital className={className} />
const OnlineIcon = ({ className = '' }) => <FaVideo className={className} />
const WhatsAppIcon = ({ className = '' }) => <FaWhatsapp className={className} />
const StarIcon = ({ className = '' }) => <FaStar className={className} />
const LocationIcon = ({ className = '' }) => <FaMapMarkerAlt className={className} />

export default function DoctorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { auth } = useAuth()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/doctors/${id}`)
      .then(res => setDoc(res.data))
      .catch(() => setDoc(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center text-slate-400">Cargando perfil...</div>
      </PublicLayout>
    )
  }

  if (!doc) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center">
          <p className="text-slate-500 mb-4">No se encontró el perfil del profesional.</p>
          <Link to="/buscar" className="btn-primary px-5 py-2 text-sm">Volver a buscar</Link>
        </div>
      </PublicLayout>
    )
  }

  const fullName = doc.fullName || doc.full_name || doc.name || 'Doctor'
  const specialty = doc.specialty?.name || doc.specialty || 'Especialidad'
  const city = doc.city?.name || doc.city || ''
  const rating = doc.rating ? Number(doc.rating).toFixed(1) : '5.0'
  const ratingNum = parseFloat(rating)
  const photo = doc.photoUrl || doc.avatar
  const initials = fullName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const avatarColors = ['#c0392b', '#2980b9', '#16a085', '#8e44ad', '#d35400', '#27ae60']
  const avatarBg = avatarColors[fullName.charCodeAt(0) % avatarColors.length]

  const handleWhatsApp = () => {
    if (!auth?.user) {
      navigate('/login')
      return
    }
    const phoneNumber = (doc.whatsapp || doc.phone || '').replace(/[^0-9]/g, '')
    if (!phoneNumber) {
      alert('No hay número de contacto disponible')
      return
    }
    let finalPhone = phoneNumber
    if (!finalPhone.startsWith('593') && finalPhone.startsWith('9')) {
      finalPhone = '593' + finalPhone
    } else if (!finalPhone.startsWith('593')) {
      finalPhone = '593' + finalPhone
    }
    const patientName = auth?.user?.name || 'Paciente'
    const message = `Hola Dr. ${fullName}, deseo agendar una cita médica. Soy ${patientName}.`
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <PublicLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Botón volver */}
        <div className="container max-w-5xl px-4 md:px-6 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#140172] transition-colors"
          >
            <FaArrowLeft className="h-3.5 w-3.5" />
            Volver
          </button>
        </div>

        <div className="container max-w-5xl px-4 md:px-6 py-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">

            {/* ── Columna izquierda: Tarjeta de perfil + contacto ── */}
            <div className="md:col-span-1 flex flex-col gap-5">

              {/* Tarjeta principal */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {/* Foto / avatar */}
                <div className="relative h-56 w-full" style={{ background: avatarBg }}>
                  {photo ? (
                    <img
                      src={photo}
                      alt={fullName}
                      className="h-full w-full object-cover"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                  ) : null}
                  <div
                    className="absolute inset-0 items-center justify-center"
                    style={{ display: photo ? 'none' : 'flex' }}
                  >
                    <span className="text-6xl font-bold text-white tracking-tight">{initials}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h1 className="text-[17px] font-bold tracking-tight text-slate-900 leading-tight">{fullName}</h1>
                  <p className="mt-1 text-sm text-slate-500">{specialty}</p>

                  {city && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                      <LocationIcon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{city}</span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <StarIcon
                          key={i}
                          className={`h-3.5 w-3.5 ${i <= Math.round(ratingNum) ? 'text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-amber-600">{rating}</span>
                  </div>

                  {/* Badges */}
                  <div className="mt-4 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                      <ClinicIcon className="h-3 w-3 text-slate-400" />
                      Presencial
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                      <OnlineIcon className="h-3 w-3 text-slate-400" />
                      Virtual
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón agendar */}
              {(doc.whatsapp || doc.phone) && (
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#0D7D2E] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a6626] hover:shadow-[0_4px_16px_-4px_rgba(13,125,46,0.4)]"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                  Agendar por WhatsApp
                </button>
              )}

              {/* Seguros */}
              {doc.insurances?.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-900 mb-3">Acepta seguros médicos</h2>
                  <div className="flex flex-wrap gap-2">
                    {doc.insurances.map((ins, i) => (
                      <span key={i} className="rounded-full bg-[#eaf1fb] px-3 py-1 text-[12px] font-medium text-[#3a6fa8]">
                        {ins}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Columna derecha: Sobre mí + Reseñas ── */}
            <div className="md:col-span-2 flex flex-col gap-5">

              {/* Sobre mí */}
              {doc.about && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-base font-semibold text-slate-900 mb-3">Sobre el profesional</h2>
                  <p className="text-sm leading-7 text-slate-600">{doc.about}</p>
                </div>
              )}

              {/* Formación (estática por ahora) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900 mb-4">Formación académica</h2>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-[#140172] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Pregrado</p>
                      <p className="text-sm text-slate-500">Universidad Católica</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-[#140172] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Postgrado</p>
                      <p className="text-sm text-slate-500">Universidad de Palermo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reseñas */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900 mb-4">Reseñas de pacientes</h2>
                <div className="flex flex-col gap-4">
                  {[
                    { name: 'Juan Pérez', stars: 5, text: 'Excelente atención, muy profesional y empático.', time: 'Hace 2 semanas' },
                    { name: 'María González', stars: 4, text: 'Buen servicio, aunque la espera fue un poco larga.', time: 'Hace 1 mes' },
                  ].map((r, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-800">{r.name}</span>
                        <span className="text-xs text-slate-400">{r.time}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map(s => (
                          <StarIcon key={s} className={`h-3.5 w-3.5 ${s <= r.stars ? 'text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
