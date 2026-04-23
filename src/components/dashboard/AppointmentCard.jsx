export default function AppointmentCard({ appointment, onAction, actionLabel, showDoctor = true, showPatient = false }) {
  const date = new Date(appointment.dateTime || appointment.date_time)

  const statusStyles = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-500',
  }

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
  }

  const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' })
  const dayNum = date.toLocaleDateString('es-ES', { day: 'numeric' })
  const monthName = date.toLocaleDateString('es-ES', { month: 'short' })
  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-[#140172]/25 hover:shadow-[0_8px_32px_-8px_rgba(20,1,114,0.14)]">
      <div className="flex items-center gap-4">
        {/* Date block */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#140172]/5 border border-[#140172]/10">
          <span className="text-[10px] font-semibold text-[#140172]/60 uppercase tracking-wide">{dayName}</span>
          <span className="text-xl font-bold text-[#140172] leading-tight">{dayNum}</span>
          <span className="text-[10px] font-medium text-[#140172]/60 capitalize">{monthName}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[appointment.status] || statusStyles.pending}`}>
              {statusLabels[appointment.status] || 'Pendiente'}
            </span>
            <span className="text-[12px] text-slate-400">{time}</span>
          </div>
          {showDoctor && appointment.doctor && (
            <p className="text-[14px] font-semibold text-slate-900 truncate">
              Dr. {appointment.doctor.fullName}
              {appointment.doctor.specialty && (
                <span className="font-normal text-slate-500"> · {appointment.doctor.specialty.name || appointment.doctor.specialty}</span>
              )}
            </p>
          )}
          {showPatient && appointment.patient && (
            <p className="text-[14px] font-semibold text-slate-900 truncate">
              {appointment.patient.name || appointment.patient.email}
            </p>
          )}
          {appointment.notes && (
            <p className="text-[12px] text-slate-400 mt-0.5 line-clamp-1">{appointment.notes}</p>
          )}
        </div>

        {/* Action */}
        {onAction && (
          <button
            onClick={() => onAction(appointment)}
            className="flex-shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:border-[#140172]/40 hover:text-[#140172]"
          >
            {actionLabel || 'Ver'}
          </button>
        )}
      </div>
    </div>
  )
}
