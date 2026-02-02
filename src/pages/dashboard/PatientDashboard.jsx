import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import StatCard from '../../components/dashboard/StatCard'
import AppointmentCard from '../../components/dashboard/AppointmentCard'
import { CalendarIcon, ClockIcon, CheckCircleIcon, UserIcon } from '../../components/dashboard/IconComponents'

export default function PatientDashboard() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  })

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const res = await api.get('/appointments/me')
      const data = Array.isArray(res.data) ? res.data : (res.data.data || [])
      setAppointments(data)
      
      // Calcular estadísticas
      const statsData = {
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        confirmed: data.filter(a => a.status === 'confirmed').length,
        cancelled: data.filter(a => a.status === 'cancelled').length,
      }
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando citas:', error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const upcomingAppointments = appointments
    .filter(a => new Date(a.dateTime || a.date_time) > new Date() && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.dateTime || a.date_time) - new Date(b.dateTime || b.date_time))
    .slice(0, 5)

  const pastAppointments = appointments
    .filter(a => new Date(a.dateTime || a.date_time) <= new Date() && a.status !== 'cancelled')
    .sort((a, b) => new Date(b.dateTime || b.date_time) - new Date(a.dateTime || a.date_time))
    .slice(0, 5)

  const handleViewAppointment = (appointment) => {
    navigate(`/dashboard/citas/${appointment.id}`)
  }

  const handleBookAppointment = () => {
    navigate('/doctores')
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
        <p className="text-gray-600 mt-1">Gestiona tus citas médicas</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CalendarIcon}
          title="Total de Citas"
          value={stats.total}
          subtitle="Todas las citas"
          color="primary"
        />
        <StatCard
          icon={ClockIcon}
          title="Pendientes"
          value={stats.pending}
          subtitle="Esperando confirmación"
          color="warning"
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Confirmadas"
          value={stats.confirmed}
          subtitle="Citas próximas"
          color="success"
        />
        <StatCard
          icon={UserIcon}
          title="Canceladas"
          value={stats.cancelled}
          subtitle="Citas canceladas"
          color="danger"
        />
      </div>

      {/* Próximas Citas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Próximas Citas</h2>
          {upcomingAppointments.length > 0 && (
            <button
              onClick={() => navigate('/dashboard/citas')}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Ver todas
            </button>
          )}
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showDoctor={true}
                onAction={handleViewAppointment}
                actionLabel="Ver Detalles"
              />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-4">No tienes citas próximas</p>
            <button
              onClick={handleBookAppointment}
              className="btn-primary"
            >
              Reservar Mi Primera Cita
            </button>
          </div>
        )}
      </div>

      {/* Citas Pasadas */}
      {pastAppointments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Citas Pasadas</h2>
            <button
              onClick={() => navigate('/dashboard/citas')}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-3">
            {pastAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showDoctor={true}
                onAction={handleViewAppointment}
                actionLabel="Ver Detalles"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}



