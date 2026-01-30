import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import AppointmentCard from '../../components/dashboard/AppointmentCard'
import { CalendarIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '../../components/dashboard/IconComponents'

export default function PatientAppointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, past

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const res = await api.get('/appointments/me')
      const data = Array.isArray(res.data) ? res.data : (res.data.data || [])
      setAppointments(data)
    } catch (error) {
      console.error('Error cargando citas:', error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const now = new Date()
    const apptDate = new Date(appointment.dateTime || appointment.date_time)
    
    if (filter === 'upcoming') {
      return apptDate > now && appointment.status !== 'cancelled'
    }
    if (filter === 'past') {
      return apptDate <= now || appointment.status === 'cancelled'
    }
    return true
  }).sort((a, b) => new Date(b.dateTime || b.date_time) - new Date(a.dateTime || a.date_time))

  const handleViewAppointment = (appointment) => {
    navigate(`/dashboard/citas/${appointment.id}`)
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      try {
        await api.patch(`/appointments/${appointmentId}/status`, { status: 'cancelled' })
        loadAppointments()
      } catch (error) {
        console.error('Error cancelando cita:', error)
        alert('Error al cancelar la cita')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
          <p className="text-gray-600 mt-1">Gestiona todas tus citas médicas</p>
        </div>
        <button
          onClick={() => navigate('/doctores')}
          className="btn-primary"
        >
          Reservar Nueva Cita
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-btn ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-btn ${filter === 'upcoming' ? 'bg-primary text-white' : 'bg-gray-100'}`}
        >
          Próximas
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-btn ${filter === 'past' ? 'bg-primary text-white' : 'bg-gray-100'}`}
        >
          Pasadas
        </button>
      </div>

      {/* Lista de Citas */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-3">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              showDoctor={true}
              onAction={handleViewAppointment}
              actionLabel="Ver Detalles"
              secondaryAction={
                appointment.status !== 'cancelled' && new Date(appointment.dateTime || appointment.date_time) > new Date()
                  ? () => handleCancelAppointment(appointment.id)
                  : null
              }
              secondaryActionLabel="Cancelar"
            />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-4">
            {filter === 'all' ? 'No tienes citas registradas' : 
             filter === 'upcoming' ? 'No tienes citas próximas' : 
             'No tienes citas pasadas'}
          </p>
          <button
            onClick={() => navigate('/doctores')}
            className="btn-primary"
          >
            Buscar Doctor
          </button>
        </div>
      )}
    </div>
  )
}