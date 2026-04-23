import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import CalendarView from '../../components/CalendarView'

const statusConfig = {
  pending:   { label: 'Pendiente',  pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  confirmed: { label: 'Confirmada', pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  cancelled: { label: 'Cancelada',  pill: 'bg-red-50 text-red-500 ring-1 ring-red-200' },
}

function getDateTime(apt) {
  return new Date(apt.dateTime || apt.date_time || apt.date)
}

export default function PatientAppointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const res = await api.get('/appointments/me')
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      setAppointments(data)
    } catch {
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar esta cita?')) return
    try {
      await api.patch(`/appointments/${id}/status`, { status: 'cancelled' })
      await load()
      if (selected?.id === id) { setShowModal(false); setSelected(null) }
    } catch {
      alert('Error al cancelar la cita')
    }
  }

  const handleReschedule = async (aptId, newDay) => {
    try {
      const apt = appointments.find(a => a.id === aptId)
      if (!apt) return
      const oldDate = getDateTime(apt)
      const newDate = new Date(newDay)
      newDate.setHours(oldDate.getHours(), oldDate.getMinutes(), 0, 0)
      await api.patch(`/appointments/${aptId}/status`, { status: 'pending', date: newDate.toISOString() })
      await load()
    } catch {
      alert('Error al reagendar la cita')
    }
  }

  const openDetail = (apt) => { setSelected(apt); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setSelected(null) }

  const today = new Date()
  const stats = {
    total:     appointments.length,
    upcoming:  appointments.filter(a => getDateTime(a) > today && a.status !== 'cancelled').length,
    past:      appointments.filter(a => getDateTime(a) <= today && a.status !== 'cancelled').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#140172]/30 border-t-[#140172] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mis Citas</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gestiona y revisa tu agenda médica</p>
        </div>
        <button
          onClick={() => navigate('/buscar')}
          className="rounded-xl bg-[#140172] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a0899] hover:shadow-[0_4px_12px_-4px_rgba(20,1,114,0.35)]"
        >
          + Reservar cita
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total',      value: stats.total,     color: 'text-slate-900' },
          { label: 'Próximas',   value: stats.upcoming,  color: 'text-[#140172]' },
          { label: 'Pasadas',    value: stats.past,      color: 'text-slate-500' },
          { label: 'Canceladas', value: stats.cancelled, color: 'text-red-500' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center hover:border-[#140172]/20 hover:shadow-sm transition-all"
          >
            <div className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-slate-400 mt-0.5 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <CalendarView
          appointments={appointments}
          onSelectAppointment={openDetail}
          onCancel={handleCancel}
          onReschedule={handleReschedule}
        />
      </div>

      {/* Modal de detalle */}
      {showModal && selected && (
        <div
          className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full sm:max-w-sm bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Cabecera modal */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-[16px] font-bold text-slate-900 truncate">
                  {selected.doctor?.fullName || selected.doctor?.name || 'Doctor'}
                </h2>
                <p className="text-[13px] text-slate-500 truncate mt-0.5">
                  {selected.doctor?.specialty?.name || selected.doctor?.specialty || 'Especialidad'}
                </p>
              </div>
              <span className={`flex-shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${(statusConfig[selected.status] || statusConfig.pending).pill}`}>
                {(statusConfig[selected.status] || statusConfig.pending).label}
              </span>
            </div>

            {/* Cuerpo */}
            <div className="px-6 py-5 space-y-4">
              {[
                {
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: 'Fecha',
                  value: getDateTime(selected).toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
                },
                {
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  label: 'Hora',
                  value: getDateTime(selected).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
                },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#140172]/8 flex items-center justify-center flex-shrink-0 text-[#140172]">
                    {row.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{row.label}</p>
                    <p className="text-[13px] font-semibold text-slate-900 capitalize">{row.value}</p>
                  </div>
                </div>
              ))}

              {selected.notes && (
                <div className="rounded-xl bg-slate-50 px-4 py-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Notas</p>
                  <p className="text-[13px] text-slate-600">{selected.notes}</p>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="px-6 pb-6 flex gap-2">
              {selected.status !== 'cancelled' && getDateTime(selected) > today && (
                <button
                  onClick={() => handleCancel(selected.id)}
                  className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2.5 text-[13px] font-bold text-red-500 transition hover:bg-red-100"
                >
                  Cancelar cita
                </button>
              )}
              <button
                onClick={closeModal}
                className="flex-1 rounded-xl bg-[#140172] py-2.5 text-[13px] font-bold text-white transition hover:bg-[#1a0899]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
