import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import CalendarView from '../../components/CalendarView'
import { CalendarIcon } from '../../components/dashboard/IconComponents'

export default function PatientAppointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

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

  const handleCancelAppointment = async (appointmentId) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      try {
        await api.patch(`/appointments/${appointmentId}/status`, { status: 'cancelled' })
        loadAppointments()
        setShowDetailModal(false)
        setSelectedAppointment(null)
      } catch (error) {
        console.error('Error cancelando cita:', error)
        alert('Error al cancelar la cita')
      }
    }
  }

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => {
      const apptDate = new Date(a.dateTime || a.date_time)
      return apptDate > new Date() && a.status !== 'cancelled'
    }).length,
    past: appointments.filter(a => {
      const apptDate = new Date(a.dateTime || a.date_time)
      return apptDate <= new Date() || a.status === 'cancelled'
    }).length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
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

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
          <div className="text-sm text-gray-600">Próximas</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.past}</div>
          <div className="text-sm text-gray-600">Pasadas</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-600">Canceladas</div>
        </div>
      </div>

      {/* Calendario */}
      <CalendarView 
        appointments={appointments}
        onSelectAppointment={(apt) => {
          setSelectedAppointment(apt)
          setShowDetailModal(true)
        }}
      />

      {/* Modal de detalles de cita */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalles de la Cita</h2>
            
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-600">Doctor</p>
                <p className="font-semibold text-gray-900">
                  {selectedAppointment.doctor?.fullName || 'Doctor'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Especialidad</p>
                <p className="font-semibold text-gray-900">
                  {selectedAppointment.doctor?.specialty || 'Especialidad'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedAppointment.dateTime || selectedAppointment.date_time).toLocaleDateString('es-EC')}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Hora</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedAppointment.dateTime || selectedAppointment.date_time).toLocaleTimeString('es-EC', {hour: '2-digit', minute: '2-digit'})}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedAppointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  selectedAppointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedAppointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedAppointment.status === 'confirmed' ? 'Confirmada' :
                   selectedAppointment.status === 'pending' ? 'Pendiente' :
                   selectedAppointment.status === 'cancelled' ? 'Cancelada' :
                   selectedAppointment.status}
                </span>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notas</p>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/dashboard/citas/${selectedAppointment.id}`)}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Ver Detalles
              </button>

              {selectedAppointment.status !== 'cancelled' && new Date(selectedAppointment.dateTime || selectedAppointment.date_time) > new Date() && (
                <button
                  onClick={() => handleCancelAppointment(selectedAppointment.id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Cancelar
                </button>
              )}

              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedAppointment(null)
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {appointments.length === 0 && (
        <div className="card p-8 text-center">
          <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-4">
            No tienes citas registradas
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
