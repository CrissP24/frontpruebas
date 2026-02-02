import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import CalendarView from '../../components/CalendarView'

export default function DoctorAppointments() {
  const { auth } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [newAppointment, setNewAppointment] = useState({
    patient_name: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  })

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('mysimo_appointments') || '[]')
      const doctorAppointments = stored.filter(apt => apt.doctor_id === auth.user.id)
      setAppointments(doctorAppointments)
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  const handleCreateAppointment = (e) => {
    e.preventDefault()
    
    try {
      const appointments = JSON.parse(localStorage.getItem('mysimo_appointments') || '[]')
      const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1

      const appointment = {
        id: newId,
        patient_name: newAppointment.patient_name,
        doctor_id: auth.user.id,
        doctor_name: auth.user.name,
        date: newAppointment.date,
        time: newAppointment.time,
        reason: newAppointment.reason,
        notes: newAppointment.notes,
        status: 'confirmed',
        created_at: new Date().toISOString()
      }

      appointments.push(appointment)
      localStorage.setItem('mysimo_appointments', JSON.stringify(appointments))

      setNewAppointment({
        patient_name: '',
        date: '',
        time: '',
        reason: '',
        notes: ''
      })
      setShowCreateModal(false)
      loadAppointments()
      alert('Cita creada exitosamente')
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('Error al crear la cita')
    }
  }

  const handleStatusChange = (appointmentId, newStatus) => {
    try {
      const appointments = JSON.parse(localStorage.getItem('mysimo_appointments') || '[]')
      const index = appointments.findIndex(a => a.id === appointmentId)
      
      if (index !== -1) {
        appointments[index].status = newStatus
        localStorage.setItem('mysimo_appointments', JSON.stringify(appointments))
        loadAppointments()
        setShowDetailModal(false)
        setSelectedAppointment(null)
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const handleDelete = (appointmentId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return
    
    try {
      const appointments = JSON.parse(localStorage.getItem('mysimo_appointments') || '[]')
      const filtered = appointments.filter(a => a.id !== appointmentId)
      localStorage.setItem('mysimo_appointments', JSON.stringify(filtered))
      loadAppointments()
      setShowDetailModal(false)
      setSelectedAppointment(null)
      alert('Cita eliminada exitosamente')
    } catch (error) {
      console.error('Error deleting appointment:', error)
    }
  }

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus citas con pacientes</p>
        </div>
        <button
          onClick={() => {
            setNewAppointment({
              patient_name: '',
              date: '',
              time: '',
              reason: '',
              notes: ''
            })
            setShowCreateModal(true)
          }}
          className="btn-primary px-4 py-2"
        >
          + Crear Cita
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmadas</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
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
                <p className="text-sm text-gray-600">Paciente</p>
                <p className="font-semibold text-gray-900">{selectedAppointment.patient_name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedAppointment.date).toLocaleDateString('es-EC')}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Hora</p>
                <p className="font-semibold text-gray-900">{selectedAppointment.time}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Motivo</p>
                <p className="font-semibold text-gray-900">{selectedAppointment.reason}</p>
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
              {selectedAppointment.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange(selectedAppointment.id, 'confirmed')}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Confirmar
                </button>
              )}
              
              {selectedAppointment.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusChange(selectedAppointment.id, 'completed')}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Completar
                </button>
              )}

              {selectedAppointment.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusChange(selectedAppointment.id, 'cancelled')}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Cancelar
                </button>
              )}

              <button
                onClick={() => handleDelete(selectedAppointment.id)}
                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              >
                Eliminar
              </button>

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

      {/* Modal crear cita */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Crear Nueva Cita</h2>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paciente *
                </label>
                <input
                  type="text"
                  value={newAppointment.patient_name}
                  onChange={e => setNewAppointment({ ...newAppointment, patient_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Nombre del paciente"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora *
                </label>
                <input
                  type="time"
                  value={newAppointment.time}
                  onChange={e => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de consulta *
                </label>
                <input
                  type="text"
                  value={newAppointment.reason}
                  onChange={e => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ej: Revisión general"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={e => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Notas adicionales..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2"
                >
                  Crear Cita
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
