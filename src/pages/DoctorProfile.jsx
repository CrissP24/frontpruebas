import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  FaHospital, FaVideo, FaWhatsapp, FaStar, FaMapMarkerAlt, FaArrowLeft,
  FaGraduationCap, FaLock, FaPen, FaChevronLeft, FaChevronRight,
} from 'react-icons/fa'
import { api } from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import PublicLayout from '../components/PublicLayout'
import { openBookingWhatsApp } from '../utils/bookingCode'

/* ── Helpers ── */
function formatRelative(iso) {
  if (!iso) return ''
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  if (days < 30) return `Hace ${Math.floor(days / 7)} sem.`
  if (days < 365) return `Hace ${Math.floor(days / 30)} mes${Math.floor(days / 30) > 1 ? 'es' : ''}`
  return new Date(iso).toLocaleDateString('es-EC', { month: 'short', year: 'numeric' })
}

function formatAbsolute(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })
}

/* ── Star display ── */
function Stars({ value, size = 'sm' }) {
  const sz = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <FaStar key={i} className={`${sz} ${i <= Math.round(value) ? 'text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  )
}

/* ── Interactive star selector ── */
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
          aria-label={`${s} estrella${s > 1 ? 's' : ''}`}
        >
          <FaStar
            className={`h-7 w-7 ${(hovered || value) >= s ? 'text-amber-400' : 'text-slate-200'}`}
          />
        </button>
      ))}
    </div>
  )
}

/* ── Patient avatar ── */
function PatientAvatar({ name }) {
  const palette = ['#6366f1', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777']
  const bg = palette[(name || '').charCodeAt(0) % palette.length]
  const initials = (name || 'P').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return (
    <div
      className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ background: bg }}
    >
      {initials}
    </div>
  )
}

/* ── My review section ── */
function MyReviewSection({ doctorId, patient, onReviewSaved }) {
  const [phase, setPhase]     = useState('loading') // loading | hidden | blocked | view | form
  const [myReview, setMyReview] = useState(null)
  const [rating,   setRating]   = useState(0)
  const [comment,  setComment]  = useState('')
  const [sending,  setSending]  = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    if (!patient || patient.role !== 'patient') { setPhase('hidden'); return }

    async function init() {
      try {
        const [eligRes, revRes] = await Promise.all([
          api.get(`/doctors/${doctorId}/appointments/check`),
          api.get(`/doctors/${doctorId}/reviews/my`),
        ])
        if (!eligRes.data?.eligible) { setPhase('blocked'); return }
        const existing = revRes.data
        if (existing) {
          setMyReview(existing)
          setRating(existing.rating)
          setComment(existing.comment)
          setPhase('view')
        } else {
          setPhase('form')
        }
      } catch {
        setPhase('blocked')
      }
    }
    init()
  }, [doctorId, patient])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0)               { setError('Selecciona una calificación'); return }
    if (comment.trim().length < 10) { setError('Escribe al menos 10 caracteres'); return }
    setSending(true)
    setError('')
    try {
      const res = await api.post(`/doctors/${doctorId}/reviews`, { rating, comment: comment.trim() })
      setMyReview(res.data)
      setPhase('view')
      onReviewSaved?.(res.data)
    } catch {
      setError('No se pudo guardar la reseña. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  if (phase === 'hidden' || phase === 'loading') return null

  /* ─ Bloqueado: no hay cita confirmada ─ */
  if (phase === 'blocked') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex items-start gap-4">
        <div className="mt-0.5 h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
          <FaLock className="h-3.5 w-3.5 text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">¿Ya te atendió este profesional?</p>
          <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">
            Solo pacientes con una cita confirmada pueden dejar una reseña.
            Si ya te atendió, la opción aparecerá automáticamente aquí.
          </p>
        </div>
      </div>
    )
  }

  /* ─ Vista: reseña existente ─ */
  if (phase === 'view' && myReview) {
    const isUpdated = myReview.updated_at !== myReview.created_at
    return (
      <div className="rounded-2xl border border-[#140172]/20 bg-[#f5f3ff] p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-sm font-bold text-[#140172]">Tu reseña</p>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {isUpdated
                ? `Actualizada el ${formatAbsolute(myReview.updated_at)}`
                : `Publicada el ${formatAbsolute(myReview.created_at)}`}
            </p>
          </div>
          <button
            onClick={() => setPhase('form')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#140172]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#140172] transition hover:bg-[#140172] hover:text-white flex-shrink-0"
          >
            <FaPen className="h-2.5 w-2.5" />
            Editar
          </button>
        </div>
        <Stars value={myReview.rating} size="md" />
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">{myReview.comment}</p>
      </div>
    )
  }

  /* ─ Formulario ─ */
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          {myReview ? 'Editar tu reseña' : 'Deja tu reseña'}
        </h2>
        <p className="text-[13px] text-slate-400 mt-0.5">
          {myReview
            ? 'Actualiza tu calificación y comentario cuando quieras.'
            : 'Comparte tu experiencia. Solo puedes dejar una reseña por profesional.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Calificación</p>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Comentario</p>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Describe tu experiencia con este profesional..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#140172]/40 focus:bg-white focus:ring-2 focus:ring-[#140172]/10 transition resize-none"
          />
          <p className="text-[11px] text-slate-400 mt-1 text-right">{comment.length}/500</p>
        </div>

        {error && <p className="text-[12px] text-red-500">{error}</p>}

        <div className="flex gap-3">
          {myReview && (
            <button
              type="button"
              onClick={() => setPhase('view')}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={sending}
            className="flex-1 rounded-xl bg-[#140172] py-2.5 text-sm font-bold text-white transition hover:bg-[#1a0199] hover:shadow-[0_4px_12px_-4px_rgba(20,1,114,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? 'Guardando...' : myReview ? 'Actualizar reseña' : 'Publicar reseña'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ══════════════════════════════════════════════ */

export default function DoctorProfile() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { auth }  = useAuth()
  const [doc,     setDoc]     = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewPage, setReviewPage] = useState(0)
  const REVIEWS_PER_PAGE = 5

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/doctors/${id}`),
      api.get(`/doctors/${id}/reviews`),
    ])
      .then(([docRes, revRes]) => {
        setDoc(docRes.data)
        setReviews(revRes.data || [])
      })
      .catch(() => setDoc(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleReviewSaved = (saved) => {
    setReviews(prev => {
      const idx = prev.findIndex(r => String(r.patient_id) === String(saved.patient_id))
      if (idx !== -1) { const updated = [...prev]; updated[idx] = saved; return updated }
      return [saved, ...prev]
    })
  }

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

  const fullName   = doc.fullName || doc.full_name || doc.name || 'Doctor'
  const specialty  = doc.specialty?.name || doc.specialty || 'Especialidad'
  const city       = doc.city?.name || doc.city || ''
  const photo      = doc.photoUrl || doc.avatar
  const initials   = fullName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const palette    = ['#c0392b', '#2980b9', '#16a085', '#8e44ad', '#d35400', '#27ae60']
  const avatarBg   = palette[fullName.charCodeAt(0) % palette.length]

  const reviewCount = reviews.length
  const avgRating   = reviewCount
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1)
    : doc.rating ? Number(doc.rating).toFixed(1) : null

  const handleBooking = () => {
    if (!auth?.user) { navigate('/login'); return }
    openBookingWhatsApp({ specialty })
  }

  return (
    <PublicLayout>
      <div className="bg-gray-50 min-h-screen">

        {/* Volver */}
        <div className="container max-w-5xl px-4 md:px-6 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#140172] transition-colors"
          >
            <FaArrowLeft className="h-3.5 w-3.5" />
            Volver
          </button>
        </div>

        <div className="container max-w-5xl px-4 md:px-6 py-4 md:py-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

            {/* ── Columna izquierda ── */}
            <div className="md:col-span-1 flex flex-col gap-5">

              {/* Tarjeta de perfil */}
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">

                {/* Foto / iniciales */}
                <div className="relative h-40 sm:h-52 w-full" style={{ background: avatarBg }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.22) 100%)' }} />
                  {photo ? (
                    <img src={photo} alt={fullName} className="h-full w-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white/90 tracking-tight">{initials}</span>
                    </div>
                  )}
                </div>

                <div className="px-5 pt-4 pb-5 space-y-4">

                  {/* Nombre + especialidad + ciudad + modalidades */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h1 className="text-[18px] font-bold tracking-tight text-slate-900 leading-snug">{fullName}</h1>
                        <p className="mt-0.5 text-[13px] font-semibold text-[#140172] tracking-wide">{specialty}</p>
                        {city && (
                          <div className="mt-1 flex items-center gap-1 text-[12px] text-slate-400">
                            <FaMapMarkerAlt className="h-3 w-3 flex-shrink-0" />
                            <span>{city}</span>
                          </div>
                        )}
                      </div>
                      {((doc.attends_in_person ?? true) || doc.attends_online) && (
                        <div className="flex flex-col gap-1 flex-shrink-0 mt-0.5">
                          {(doc.attends_in_person ?? true) && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#f0eeff] px-2 py-0.5 text-[11px] font-medium text-[#140172]">
                              <FaHospital className="h-2.5 w-2.5" /> Presencial
                            </span>
                          )}
                          {doc.attends_online && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#f0eeff] px-2 py-0.5 text-[11px] font-medium text-[#140172]">
                              <FaVideo className="h-2.5 w-2.5" /> Virtual
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divisor */}
                  <div className="h-px bg-slate-100" />

                  {/* Rating + exp + precio */}
                  <div className="space-y-2">
                    {avgRating && (
                      <div className="flex items-center gap-2">
                        <Stars value={parseFloat(avgRating)} size="sm" />
                        <span className="text-sm font-bold text-slate-800">{avgRating}</span>
                        {reviewCount > 0 && (
                          <span className="text-[12px] text-slate-400">· {reviewCount} reseña{reviewCount !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    )}
                    {doc.experience_years > 0 && (
                      <p className="text-[13px] text-slate-500">
                        <span className="font-semibold text-slate-700">{doc.experience_years}</span> años de experiencia
                      </p>
                    )}
                    {doc.consultation_fee > 0 && (
                      <p className="text-[13px] text-slate-500">
                        <span className="font-semibold text-slate-700">${doc.consultation_fee}</span> por consulta
                      </p>
                    )}
                  </div>

                  {/* Formación académica — solo si viene de la BD */}
                  {doc.education?.length > 0 && (
                    <>
                      <div className="h-px bg-slate-100" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Formación</p>
                        <div className="space-y-2.5">
                          {doc.education.map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="mt-0.5 h-5 w-5 rounded-md bg-[#f0eeff] flex items-center justify-center flex-shrink-0">
                                <FaGraduationCap className="h-2.5 w-2.5 text-[#140172]" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[12px] font-semibold text-slate-700 leading-tight">{item.level}</p>
                                <p className="text-[11px] text-slate-400 truncate">{item.school}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>

            {/* ── Columna derecha ── */}
            <div className="md:col-span-2 flex flex-col gap-5">

              {/* Un solo cuadro: Sobre el profesional + Solicitar cita + Seguros */}
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">

                  {/* Sobre el profesional */}
                  <div className="p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Sobre el profesional</p>
                    <p className="text-sm leading-7 text-slate-600">
                      {doc.about || doc.bio || 'Este profesional aún no ha añadido una descripción.'}
                    </p>
                  </div>

                  {/* Solicitar cita + Seguros */}
                  <div className="p-6 flex flex-col gap-4">
                    <button
                      onClick={handleBooking}
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#0D7D2E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a6626] hover:shadow-[0_4px_16px_-4px_rgba(13,125,46,0.4)]"
                    >
                      <FaWhatsapp className="h-4 w-4" />
                      Agendar cita
                    </button>
                    {doc.insurances?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2.5">Acepta seguros</p>
                        <div className="flex flex-wrap gap-1.5">
                          {doc.insurances.map((ins, i) => (
                            <span key={i} className="rounded-full bg-[#f0eeff] px-3 py-1 text-[12px] font-semibold text-[#140172]">
                              {ins}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Reseñas de pacientes — paginadas 5 en 5 */}
              {(() => {
                const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE))
                const safePage = Math.min(reviewPage, totalPages - 1)
                const start = safePage * REVIEWS_PER_PAGE
                const pageReviews = reviews.slice(start, start + REVIEWS_PER_PAGE)
                const canPrev = safePage > 0
                const canNext = safePage < totalPages - 1

                return (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 sm:gap-3">
                      <div className="flex items-center gap-3">
                        <h2 className="text-base font-semibold text-slate-900">Reseñas de pacientes</h2>
                        {reviewCount > 0 && avgRating && (
                          <div className="flex items-center gap-1.5">
                            <FaStar className="h-4 w-4 text-amber-400" />
                            <span className="text-sm font-bold text-slate-800">{avgRating}</span>
                            <span className="text-xs text-slate-400">/ 5 · {reviewCount}</span>
                          </div>
                        )}
                      </div>

                      {reviews.length > REVIEWS_PER_PAGE && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {safePage + 1} / {totalPages}
                          </span>
                          <button
                            type="button"
                            onClick={() => setReviewPage(p => Math.max(0, p - 1))}
                            disabled={!canPrev}
                            aria-label="Reseñas anteriores"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-[#140172] hover:text-[#140172] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-500"
                          >
                            <FaChevronLeft className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setReviewPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={!canNext}
                            aria-label="Siguientes reseñas"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-[#140172] hover:text-[#140172] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-500"
                          >
                            <FaChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {reviews.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-sm text-slate-400">Aún no hay reseñas para este profesional.</p>
                        <p className="text-[12px] text-slate-300 mt-0.5">¡Sé el primero en compartir tu experiencia!</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {pageReviews.map((r, i) => {
                          const isOwn     = auth?.user?.id && String(auth.user.id) === String(r.patient_id)
                          const isUpdated = r.updated_at !== r.created_at
                          return (
                            <div
                              key={r.id || `${start}-${i}`}
                              className={`rounded-xl border p-4 ${isOwn ? 'border-[#140172]/20 bg-[#f5f3ff]' : 'border-slate-100 bg-slate-50'}`}
                            >
                              <div className="flex items-start gap-3">
                                <PatientAvatar name={r.patient_name} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-slate-800">
                                      {r.patient_name || 'Paciente'}
                                    </span>
                                    {isOwn && (
                                      <span className="rounded-full bg-[#140172] px-2 py-0.5 text-[10px] font-bold text-white">
                                        Tu reseña
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Stars value={r.rating} />
                                    <span className="text-[11px] text-slate-400">
                                      {isUpdated
                                        ? `Actualizado ${formatRelative(r.updated_at)}`
                                        : formatRelative(r.created_at)}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{r.comment}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Sección mi reseña */}
              <MyReviewSection
                doctorId={id}
                patient={auth?.user || null}
                onReviewSaved={handleReviewSaved}
              />

            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
