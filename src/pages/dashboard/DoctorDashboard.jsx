import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import StatCard from '../../components/dashboard/StatCard'
import AppointmentCard from '../../components/dashboard/AppointmentCard'
import { CalendarIcon, ClockIcon, CheckCircleIcon, UserIcon, ChartBarIcon } from '../../components/dashboard/IconComponents'

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    today: 0,
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
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const statsData = {
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        confirmed: data.filter(a => a.status === 'confirmed').length,
        cancelled: data.filter(a => a.status === 'cancelled').length,
        today: data.filter(a => {
          const apptDate = new Date(a.dateTime || a.date_time)
          return apptDate >= today && apptDate < tomorrow && a.status !== 'cancelled'
        }).length,
      }
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando citas:', error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const todayAppointments = appointments
    .filter(a => {
      const apptDate = new Date(a.dateTime || a.date_time)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return apptDate >= today && apptDate < tomorrow && a.status !== 'cancelled'
    })
    .sort((a, b) => new Date(a.dateTime || a.date_time) - new Date(b.dateTime || b.date_time))

  const pendingAppointments = appointments
    .filter(a => a.status === 'pending')
    .sort((a, b) => new Date(a.dateTime || a.date_time) - new Date(b.dateTime || b.date_time))
    .slice(0, 5)

  const handleViewAppointment = (appointment) => {
    navigate(`/dashboard/citas/${appointment.id}`)
  }

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status: newStatus })
      loadAppointments()
    } catch (error) {
      console.error('Error actualizando estado:', error)
      alert('Error al actualizar el estado de la cita')
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel Médico</h1>
        <p className="text-gray-600 mt-1">Gestiona tus citas y pacientes</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={CalendarIcon}
          title="Total Citas"
          value={stats.total}
          subtitle="Todas las citas"
          color="primary"
        />
        <StatCard
          icon={ClockIcon}
          title="Hoy"
          value={stats.today}
          subtitle="Citas de hoy"
          color="accent"
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
          subtitle="Citas confirmadas"
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

      {/* Citas de Hoy */}
      {todayAppointments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Citas de Hoy</h2>
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showPatient={true}
                showDoctor={false}
                onAction={handleViewAppointment}
                actionLabel="Ver Detalles"
              />
            ))}
          </div>
        </div>
      )}

      {/* Citas Pendientes de Confirmar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Citas Pendientes de Confirmar</h2>
          {pendingAppointments.length > 0 && (
            <button
              onClick={() => navigate('/dashboard/citas')}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Ver todas
            </button>
          )}
        </div>

        {pendingAppointments.length > 0 ? (
          <div className="space-y-3">
            {pendingAppointments.map((appointment) => (
              <div key={appointment.id} className="card p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pendiente
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(appointment.dateTime || appointment.date_time).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {new Date(appointment.dateTime || appointment.date_time).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    {appointment.patient && (
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Paciente: {appointment.patient.name || appointment.patient.email}</span>
                      </div>
                    )}
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-2">{appointment.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                    className="btn-primary btn-sm flex-1"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                    className="btn-outline btn-sm flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <CheckCircleIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No hay citas pendientes de confirmar</p>
          </div>
        )}
      </div>

      {/* Acciones Rápidas */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/dashboard/citas')}
            className="btn-primary"
          >
            Ver Todas las Citas
          </button>
          <button
            onClick={() => navigate('/dashboard/estadisticas')}
            className="btn-outline"
          >
            Ver Estadísticas
          </button>
          <button
            onClick={() => navigate('/dashboard/perfil')}
            className="btn-outline"
          >
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  )
}

