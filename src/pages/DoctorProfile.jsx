import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../hooks/useAuth'

export default function DoctorProfile(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { auth } = useAuth()
  const [doc, setDoc] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ date_time: '', notes: '' })

  useEffect(()=>{
    if (auth?.user?.role === 'patient') {
      api.get(`/doctors/${id}`)
        .then(res=> {
          // Manejar nueva estructura de respuesta
          const data = res.data
          setDoc(data)
        })
        .catch(() => setDoc(null))
    }
  }, [id, auth])

  // Si no está autenticado o no es paciente, mostrar bloqueado
  if (!auth || auth.user.role !== 'patient') {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-8">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Perfil Bloqueado</h3>
            <p className="text-gray-600 mb-6">Para ver el perfil completo del doctor, necesitas iniciar sesión como paciente.</p>
            <button 
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!doc) return <div className="container py-10">Cargando...</div>

  // Limitar ubicación a 140 caracteres
  const location = doc.city || 'Ubicación no especificada'
  const truncatedLocation = location.length > 140 ? location.substring(0, 140) + '...' : location

  return (
    <div className="container py-10">
      <div className="grid md:grid-cols-3 gap-8">
        {/* IZQUIERDA: Reseñas */}
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="font-semibold mb-4 text-lg">Reseñas</div>
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">★★★★★</div>
                <span className="text-sm font-medium">Juan Pérez</span>
              </div>
              <p className="text-sm text-gray-600">Excelente atención, muy profesional y empático.</p>
              <p className="text-xs text-gray-400 mt-2">Hace 2 semanas</p>
            </div>
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">★★★★☆</div>
                <span className="text-sm font-medium">María González</span>
              </div>
              <p className="text-sm text-gray-600">Buen servicio, aunque la espera fue un poco larga.</p>
              <p className="text-xs text-gray-400 mt-2">Hace 1 mes</p>
            </div>
          </div>
        </div>

        {/* DERECHA: Módulo foto y perfil */}
        <div className="md:col-span-2 order-1 md:order-2">
          <div className="bg-white border rounded-xl p-6 shadow-lg">
            {/* Foto */}
            <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden mb-4">
              {doc.photoUrl ? (
                <img src={doc.photoUrl} alt={doc.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Sin foto</div>
              )}
            </div>

            {/* Nombre */}
            <h1 className="text-3xl font-bold mb-2">{doc.fullName}</h1>
            
            {/* Especialidad */}
            <div className="text-lg text-gray-700 mb-2">{doc.specialty}</div>
            
            {/* Ubicación (limitada a 140 caracteres) */}
            <div className="text-sm text-gray-600 mb-6">
              <span className="font-medium">Ubicación:</span> {truncatedLocation}
            </div>

            {/* Educación */}
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div>
                <span className="font-medium text-gray-700">Pregrado:</span>{' '}
                <span className="text-gray-600">Universidad Católica</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Postgrado:</span>{' '}
                <span className="text-gray-600">Universidad de Palermo</span>
              </div>
            </div>

            {/* Sobre */}
            <p className="text-gray-700 mb-6">{doc.about || 'Experiencia y atención de calidad.'}</p>

            {/* Seguros */}
            {doc.insurances?.length > 0 && (
              <div className="mb-6">
                <div className="font-medium text-gray-700 mb-2">Acepta seguros:</div>
                <div className="flex flex-wrap gap-2">
                  {doc.insurances.map((insurance, i) => (
                    <span key={i} className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1">
                      {insurance}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Botón reservar */}
            <div className="mt-6">
              <button 
                onClick={() => { 
                  if (!auth) { 
                    navigate('/login') 
                  } else if (!doc.phone && !doc.whatsapp) {
                    alert('Este doctor no tiene un número de WhatsApp disponible')
                  } else {
                    // Obtener número de WhatsApp o teléfono
                    const phoneNumber = (doc.whatsapp || doc.phone || '').replace(/[^0-9]/g, '')
                    if (!phoneNumber) {
                      alert('No hay número de contacto disponible')
                      return
                    }
                    
                    // Crear mensaje
                    const doctorName = doc.fullName || 'Doctor'
                    const patientName = auth?.user?.name || 'Paciente'
                    const message = `Hola Dr. ${doctorName}, deseo agendar una cita médica. Soy ${patientName}.`
                    const encodedMessage = encodeURIComponent(message)
                    
                    // Determinar el código de país (asumimos Ecuador +593 si no tiene prefijo)
                    let finalPhone = phoneNumber
                    if (finalPhone.startsWith('593')) {
                      // Ya tiene el código
                    } else if (finalPhone.startsWith('9')) {
                      // Número local sin código, agregar 593
                      finalPhone = '593' + finalPhone
                    } else if (!finalPhone.startsWith('0')) {
                      finalPhone = '593' + finalPhone
                    }
                    
                    const whatsappUrl = `https://wa.me/${finalPhone}?text=${encodedMessage}`
                    window.open(whatsappUrl, '_blank')
                  }
                }} 
                className="px-6 py-3 rounded-btn bg-accent text-white hover:opacity-90 transition w-full md:w-auto"
              >
                Reservar cita por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}




