import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import StatCard from '../../components/dashboard/StatCard'
import CalendarView from '../../components/CalendarView'
import { CalendarIcon, ClockIcon, CheckCircleIcon, UserIcon } from '../../components/dashboard/IconComponents'
import { useAuth } from '../../hooks/useAuth'

export default function PatientDashboard() {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 })

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const res = await api.get('/appointments/me')
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      setAppointments(data)
      setStats({
        total:     data.length,
        pending:   data.filter(a => a.status === 'pending').length,
        confirmed: data.filter(a => a.status === 'confirmed').length,
        cancelled: data.filter(a => a.status === 'cancelled').length,
      })
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
    } catch {
      alert('Error al cancelar la cita')
    }
  }

  const handleReschedule = async (aptId, newDay) => {
    try {
      const apt = appointments.find(a => a.id === aptId)
      if (!apt) return
      const oldDate = new Date(apt.dateTime || apt.date_time || apt.date)
      const newDate = new Date(newDay)
      newDate.setHours(oldDate.getHours(), oldDate.getMinutes(), 0, 0)
      await api.patch(`/appointments/${aptId}/status`, { status: 'pending', date: newDate.toISOString() })
      await load()
    } catch {
      alert('Error al reagendar la cita')
    }
  }

  const firstName = (auth?.user?.name || '').split(' ')[0] || 'Paciente'

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hola, {firstName}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Aquí tienes el resumen de tu agenda médica</p>
        </div>
        <button
          onClick={() => navigate('/buscar')}
          className="rounded-xl bg-[#140172] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a0899] hover:shadow-[0_4px_12px_-4px_rgba(20,1,114,0.35)]"
        >
          + Reservar cita
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={CalendarIcon} title="Total de citas"  value={stats.total}     subtitle="Historial completo" color="accent"  />
        <StatCard icon={ClockIcon}       title="Pendientes"     value={stats.pending}   subtitle="En espera"          color="warning" />
        <StatCard icon={CheckCircleIcon} title="Confirmadas"    value={stats.confirmed} subtitle="Listas"             color="success" />
        <StatCard icon={UserIcon}        title="Canceladas"     value={stats.cancelled} subtitle="No asistidas"       color="danger"  />
      </div>

      {/* Calendario de citas */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <CalendarView
          appointments={appointments}
          onSelectAppointment={() => navigate('/dashboard/citas')}
          onCancel={handleCancel}
          onReschedule={handleReschedule}
        />
      </div>

    </div>
  )
}
