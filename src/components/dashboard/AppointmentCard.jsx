/**
 * Tarjeta de cita médica
 */
export default function AppointmentCard({ appointment, onAction, actionLabel, showDoctor = true, showPatient = false }) {
  const date = new Date(appointment.dateTime || appointment.date_time)
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
  }

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status] || statusColors.pending}`}>
              {statusLabels[appointment.status] || 'Pendiente'}
            </div>
            <span className="text-sm text-gray-500">
              {date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-1">
            {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {showDoctor && appointment.doctor && (
            <div className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Dr. {appointment.doctor.fullName}</span>
              {appointment.doctor.specialty && (
                <span className="text-gray-500"> · {appointment.doctor.specialty.name}</span>
              )}
            </div>
          )}
          {showPatient && appointment.patient && (
            <div className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Paciente: {appointment.patient.name || appointment.patient.email}</span>
            </div>
          )}
          {appointment.notes && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{appointment.notes}</p>
          )}
        </div>
        {onAction && (
          <button
            onClick={() => onAction(appointment)}
            className="ml-4 btn-outline btn-sm"
          >
            {actionLabel || 'Ver'}
          </button>
        )}
      </div>
    </div>
  )
}





