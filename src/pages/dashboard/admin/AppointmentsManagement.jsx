import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'

export default function AppointmentsManagement() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '' })

  useEffect(() => {
    loadAppointments()
  }, [filters])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const res = await api.get('/appointments/all')
      let data = res.data.data || res.data || []
      
      if (filters.status) {
        data = data.filter(apt => apt.status === filters.status)
      }
      
      setAppointments(data)
    } catch (error) {
      console.error('Error cargando citas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: newStatus })
      alert('Estado actualizado exitosamente')
      loadAppointments()
    } catch (error) {
      alert(error?.response?.data?.error || 'Error al actualizar estado')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Citas</h1>
        <p className="text-gray-600 mt-1">Administra todas las citas médicas</p>
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <select
          value={filters.status}
          onChange={e => setFilters({...filters, status: e.target.value})}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      {/* Lista */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay citas</div>
        ) : (
          <div className="divide-y">
            {appointments.map(apt => (
              <div key={apt.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
                        {apt.doctor?.fullName || 'Doctor'} - {apt.patient?.name || 'Paciente'}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(apt.dateTime).toLocaleString('es-EC')}
                    </p>
                    {apt.notes && (
                      <p className="text-sm text-gray-500 mt-1">{apt.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {apt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(apt.id, 'confirmed')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleStatusChange(apt.id, 'cancelled')}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Ver Docs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

