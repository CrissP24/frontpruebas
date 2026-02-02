import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ChartBarIcon, UserIcon, CalendarIcon, StarIcon, CheckCircleIcon, XCircleIcon } from '../../components/dashboard/IconComponents'

export default function DoctorStatistics() {
  const { auth } = useAuth()
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    averageRating: 0,
    totalReviews: 0,
    monthlyAppointments: [],
    recentReviews: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = () => {
    try {
      // Cargar citas del doctor desde localStorage
      const appointments = JSON.parse(localStorage.getItem('mysimo_appointments') || '[]')
      const doctorAppointments = appointments.filter(a => 
        a.doctorId === auth.user.id || a.doctor?.id === auth.user.id
      )

      // Calcular estadísticas
      const completed = doctorAppointments.filter(a => a.status === 'completed').length
      const cancelled = doctorAppointments.filter(a => a.status === 'cancelled').length

      // Cargar datos del doctor
      const doctors = JSON.parse(localStorage.getItem('mysimo_doctors') || '[]')
      const doctor = doctors.find(d => d.id === auth.user.id)

      setStats({
        totalAppointments: doctorAppointments.length,
        completedAppointments: completed,
        cancelledAppointments: cancelled,
        averageRating: doctor?.rating || 0,
        totalReviews: doctor?.reviews_count || 0,
        monthlyAppointments: calculateMonthlyStats(doctorAppointments),
        recentReviews: []
      })
    } catch (error) {
      console.error('Error loading statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateMonthlyStats = (appointments) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const currentYear = new Date().getFullYear()
    
    return months.map((month, index) => {
      const count = appointments.filter(a => {
        const date = new Date(a.dateTime || a.date_time)
        return date.getMonth() === index && date.getFullYear() === currentYear
      }).length
      
      return { month, count }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando estadísticas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
        <p className="text-gray-600 mt-1">Análisis de tu desempeño profesional</p>
      </div>



      {/* Gráfico de Citas por Mes */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Citas por Mes (2026)</h2>
        <div className="space-y-3">
          {stats.monthlyAppointments.map((data, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-12 text-sm text-gray-600">{data.month}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                <div 
                  className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(data.count / Math.max(...stats.monthlyAppointments.map(m => m.count), 1)) * 100}%` }}
                >
                  {data.count > 0 && (
                    <span className="text-xs font-semibold text-white">{data.count}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen de Desempeño</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Tasa de Completación</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {stats.totalAppointments > 0 
                ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100) 
                : 0}%
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Tasa de Cancelación</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {stats.totalAppointments > 0 
                ? Math.round((stats.cancelledAppointments / stats.totalAppointments) * 100) 
                : 0}%
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Citas Pendientes</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {stats.totalAppointments - stats.completedAppointments - stats.cancelledAppointments}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
