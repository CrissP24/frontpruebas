import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import StatCard from '../../components/dashboard/StatCard'
import { UsersIcon, DoctorIcon, CalendarIcon, ChartBarIcon } from '../../components/dashboard/IconComponents'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    appointments: 0,
    specialties: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/stats')
      setStats(res.data || {
        users: 0,
        doctors: 0,
        appointments: 0,
        specialties: 0
      })
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
      // Fallback a datos básicos si falla
      try {
        const [doctorsRes, appointmentsRes] = await Promise.all([
          api.get('/doctors').catch(() => ({ data: { data: [] } })),
          api.get('/appointments/me').catch(() => ({ data: [] })),
        ])
        const doctors = Array.isArray(doctorsRes.data) 
          ? doctorsRes.data 
          : (doctorsRes.data.doctors || doctorsRes.data.data || [])
        const appointments = Array.isArray(appointmentsRes.data) 
          ? appointmentsRes.data 
          : (appointmentsRes.data.data || [])
        setStats({
          users: 0,
          doctors: doctors.length,
          appointments: appointments.length,
          specialties: 0
        })
      } catch (e) {
        console.error('Error en fallback:', e)
      }
    } finally {
      setLoading(false)
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
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-1">Gestiona la plataforma MySimo</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={UsersIcon}
          title="Usuarios"
          value={stats.users}
          subtitle="Total de usuarios"
          color="primary"
        />
        <StatCard
          icon={DoctorIcon}
          title="Doctores"
          value={stats.doctors}
          subtitle="Médicos registrados"
          color="accent"
        />
        <StatCard
          icon={CalendarIcon}
          title="Citas"
          value={stats.appointments}
          subtitle="Total de citas"
          color="success"
        />
        <StatCard
          icon={ChartBarIcon}
          title="Especialidades"
          value={stats.specialties}
          subtitle="Especialidades médicas"
          color="warning"
        />
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/usuarios')}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--primary)] text-white rounded-xl">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Gestionar Usuarios</h3>
              <p className="text-sm text-gray-500">Administrar usuarios del sistema</p>
            </div>
          </div>
        </div>

        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/doctores')}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#eef0ff] text-[var(--primary)] rounded-xl">
              <DoctorIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Gestionar Doctores</h3>
              <p className="text-sm text-gray-500">Administrar perfiles médicos</p>
            </div>
          </div>
        </div>

        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/citas')}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-700 rounded-xl">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Gestionar Citas</h3>
              <p className="text-sm text-gray-500">Ver y administrar citas</p>
            </div>
          </div>
        </div>

        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/configuracion')}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 text-yellow-700 rounded-xl">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Configuración</h3>
              <p className="text-sm text-gray-500">Ajustes del sistema</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Sistema */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Información del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Versión</p>
            <p className="font-medium">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Estado</p>
            <p className="font-medium text-green-600">Operativo</p>
          </div>
        </div>
      </div>
    </div>
  )
}



